#!/usr/bin/env node
/* ============================================================
   批量导出全部内置风格为单文件 + 生成 styles/index.json 清单
   （B 方案：基础包只留核心引擎 + noir 保底，其余风格全部外置）

   用法: node tools/export-all-styles.js [输出目录，默认 dist/styles]
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { loadEngine, collectFiles, buildFile, buildCommon } = require('./lib-stylepack');

const OUT = process.argv[2] || path.join('dist', 'styles');
fs.mkdirSync(OUT, { recursive: true });

const { J, fileOfKey, JIZURA_SRC } = loadEngine();
console.error(`引擎装载完成，共 ${J.STYLE_ORDER.length} 套风格`);

/* 中文名：解析 sdk/player.js 里的 STYLE_CN / MOOD_CN 映射表 */
const sdkSrc = fs.readFileSync(path.join(__dirname, '..', 'sdk', 'player.js'), 'utf8');
const grab = (name) => {
  const m = sdkSrc.match(new RegExp('const ' + name + ' = \\{([\\s\\S]*?)\\};'));
  if (!m) return {};
  return eval('({' + m[1] + '})');
};
const STYLE_CN = grab('STYLE_CN'), MOOD_CN = grab('MOOD_CN');

/* 内置风格分组规则：有 moods 按第一个 mood 中文名，否则「基础」（与 SDK categoryOf 一致） */
function categoryOf(st) {
  if (st.moods && st.moods[0] && MOOD_CN[st.moods[0]]) return MOOD_CN[st.moods[0]];
  return '基础';
}

/* ---------- 第一遍：收集每个风格依赖的引擎文件，统计共用情况 ---------- */
const defs = [];
const usage = new Map();   // 引擎文件 -> 引用它的风格 key 列表
for (const key of J.STYLE_ORDER) {
  const st = J.STYLES[key];
  if (!st) continue;
  const def = {
    key,
    category: categoryOf(st),
    name: STYLE_CN[key] || st.name || key,
    pack: st,                       // 直接复用引擎里的风格定义
  };
  const { files } = collectFiles(J, fileOfKey, def, false);
  defs.push({ def, files });
  for (const f of files) {
    if (!usage.has(f)) usage.set(f, []);
    usage.get(f).push(key);
  }
}

/* 共用判定：被 ≥2 个风格内嵌的引擎文件抽进 common.js（全库只下载一次） */
const commonSet = new Set([...usage.entries()].filter(([, ks]) => ks.length >= 2).map(([f]) => f));
const commonFiles = [...commonSet].sort();
if (commonFiles.length) {
  const common = buildCommon(commonFiles, JIZURA_SRC);
  fs.writeFileSync(path.join(OUT, 'common.js'), common);
  console.log(`共享包 common.js：${commonFiles.length} 个引擎文件，共 ${(common.length / 1024).toFixed(0)} KB`);
  console.log(`  -> ${commonFiles.join(', ')}\n`);
}

/* ---------- 第二遍：生成瘦身风格文件（共用部分不内嵌）+ 清单 ---------- */
const manifest = [];
let totalKB = 0;
for (const { def, files } of defs) {
  const out = buildFile(def, files, null, JIZURA_SRC, commonSet);
  fs.writeFileSync(path.join(OUT, def.key + '.js'), out);
  totalKB += out.length / 1024;
  const entry = { key: def.key, file: def.key + '.js', category: def.category, name: def.name,
    bg: def.pack.schemes[0].bg, fg: def.pack.schemes[0].fg,
    accent: def.pack.schemes[0].accent, accent2: def.pack.schemes[0].accent2 };
  if (files.some(f => commonSet.has(f))) entry.common = true;   // 应用前需先加载 common.js
  manifest.push(entry);
  const shared = files.filter(f => commonSet.has(f)).length;
  console.log(`${def.category} · ${def.name} -> ${def.key}.js (${(out.length / 1024).toFixed(1)} KB, 独有 ${files.length - shared} 个引擎文件${shared ? `，共享 ${shared} 个走 common` : ''})`);
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ styles: manifest }, null, 2) + '\n');
console.log(`\n✅ ${defs.length} 套风格 + common.js -> ${OUT}/ （风格共 ${totalKB.toFixed(0)} KB），清单 index.json 已生成`);
