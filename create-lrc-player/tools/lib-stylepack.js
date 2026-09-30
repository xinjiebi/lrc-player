/* 风格打包共享库：引擎装载 / 单文件生成（pack-style.js 与 export-all-styles.js 共用）
   打包粒度 = 整个引擎源文件（11p_*.js 等）：
   部件函数依赖各自模块内的闭包辅助函数（E/mixC/inBack…），按对象抽取会断闭包；
   整个文件是自包含 IIFE，原样嵌入一定安全。已打进基础包的文件自动跳过。 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* 基础包（build.py 当前包含）里的引擎文件 —— 这些文件里的部件运行时已存在，打包时跳过 */
const BASE_FILES = new Set(['01_util.js', '02_fonts.js', '02b_lang.js', '03_text.js', '05b_registry.js',
  '05_anim.js', '06_layouts.js', '07_decor.js', '08_planner.js', '08b_omakase.js', '09_render.js', '10_audio.js']);

/* 在 Node 里"装载"完整引擎（含全部部件与风格定义）。
   返回 { J, fileOfKey }：fileOfKey 记录每个部件定义来自哪个源文件 */
function loadEngine() {
  // 引擎源码默认用本地 vendor 副本（自包含）；JIZURA_SRC 环境变量可指向上游仓库做同步
  const JIZURA_SRC = process.env.JIZURA_SRC || path.join(__dirname, '..', 'vendor', 'jizura-src');
  if (!fs.existsSync(JIZURA_SRC)) throw new Error('找不到 JIZURA 引擎目录: ' + JIZURA_SRC);
  const J = { STYLES: {}, STYLE_ORDER: [], MOODS: [] };
  const sandbox = { J, console,
    window: {}, document: { createElement: () => ({ getContext: () => null, style: {} }) }, navigator: {}, performance: { now: () => 0 },
    requestAnimationFrame: () => 0, cancelAnimationFrame: () => {},
    fetch: async () => { throw new Error('no network'); },
    URL, Blob, Set, Map, Math, JSON, Object, Array, Promise, RegExp, Date };
  sandbox.window.J = J;
  vm.createContext(sandbox);

  const fileOfKey = {};   // 'group.key' -> 源文件名
  let currentFile = '';
  // 先装载 05b_registry（它定义 J.register），然后再包一层记录来源文件
  vm.runInContext(fs.readFileSync(path.join(JIZURA_SRC, '05b_registry.js'), 'utf8'), sandbox, { filename: '05b_registry.js' });
  const realRegister = J.register;   // 先抓住真实现再包，否则自调用爆栈
  const _reg = (group, key, def, pack) => { fileOfKey[group + '.' + key] = currentFile; return realRegister(group, key, def, pack); };
  sandbox.J.register = _reg;
  sandbox.J.registerAll = (group, defs, pack) => { for (const k of Object.keys(defs)) _reg(group, k, defs[k], pack); };

  const files = ['01_util.js', '02_fonts.js', '02b_lang.js',
    '05_anim.js', '06_layouts.js', '07_decor.js', '04_styles.js', '08_planner.js', '08b_omakase.js', '09_render.js', '10_audio.js',
    ...fs.readdirSync(JIZURA_SRC).filter(f => /^11[pq]_.*\.js$/.test(f)).sort()];
  let failed = [];
  for (const f of files) {
    const p = path.join(JIZURA_SRC, f);
    if (!fs.existsSync(p)) continue;
    currentFile = f;
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f }); }
    catch (e) { failed.push(f + '(' + e.message + ')'); }
  }
  if (!J.order || !J.GROUP_KEYS) throw new Error('引擎装载失败（跳过: ' + failed.join(',') + '）');
  if (failed.length) console.error('  装载跳过:', failed.join(', '));
  return { J, fileOfKey, JIZURA_SRC };
}

/* 收集风格依赖：返回 { files: [需要整包嵌入的引擎文件], missing: [找不到的关键词] }
   - bias 选词 + decor + include 里，属于基础包文件的部件跳过（运行时必有）
   - 自带部件（def.parts）由用户保证自包含，不走文件嵌入 */
function collectFiles(J, fileOfKey, def, log) {
  const ownKeys = new Set();
  if (def.parts) for (const dict of Object.values(def.parts)) for (const k of Object.keys(dict || {})) ownKeys.add(k);
  const wanted = new Set(def.include || []);
  if (def.pack.bias) for (const dict of Object.values(def.pack.bias)) {
    if (dict && typeof dict === 'object') for (const k of Object.keys(dict)) wanted.add(k);
  }
  if (def.pack.decor) for (const k of Object.keys(def.pack.decor)) wanted.add(k);
  const files = new Set();
  let missing = [];
  for (const key of wanted) {
    if (ownKeys.has(key)) continue;
    let f = null;
    for (const g of J.GROUP_KEYS) {
      const d = J.registry(g)[key];
      if (d) { f = fileOfKey[g + '.' + key]; break; }
    }
    if (!f) continue;   // 注册表里有记录但无来源文件 = 核心文件直接赋值的部件（基础包必有），跳过
    if (d_builtin(J, key)) continue;
    if (BASE_FILES.has(f)) continue;                         // 基础包已有
    files.add(f);
  }
  if (missing.length && log) console.error('  ⚠ 关键词在引擎里找不到（将只是无效果）: ' + missing.join(', '));
  return { files: [...files].sort(), missing };
}
function d_builtin(J, key) {
  for (const g of J.GROUP_KEYS) { const d = J.registry(g)[key]; if (d) return !!d.builtin; }
  return false;
}

/* 序列化（仅用于风格定义和用户自带部件：必须只依赖 J.* 与参数） */
function fnSrc(f) {
  let src = f.toString();
  if (/^(?:async\s+)?[A-Za-z_$][\w$]*\s*\(/.test(src) && !/^\s*(async\s+)?function/.test(src)) {
    src = (src.startsWith('async ') ? 'async function ' : 'function ') + src.replace(/^async\s+/, '');
  }
  return src;
}
function ser(v, seen = new Set()) {
  if (typeof v === 'function') return fnSrc(v);
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (seen.has(v)) throw new Error('定义存在循环引用，无法打包');
  seen.add(v);
  try {
    if (Array.isArray(v)) return '[' + v.map(x => ser(x, seen)).join(',') + ']';
    const keys = Object.keys(v).filter(k => v[k] !== undefined);
    return '{ ' + keys.map(k => JSON.stringify(k) + ': ' + ser(v[k], seen)).join(', ') + ' }';
  } finally { seen.delete(v); }
}

/* 生成自包含单文件：嵌入引擎文件（apply-once 防重复）+ registerStyle。
   commonSet：共享包文件名集合（被 ≥2 个风格共用的引擎文件）——这些文件不内嵌，
   由 dist/styles/common.js 统一提供（运行时必须先加载 common.js 再应用该风格）。
   传 null/不设 = 全部内嵌（完全自包含，设计师自定义风格用）。 */
function buildFile(def, embedFiles, customParts, JIZURA_SRC, commonSet) {
  const own = commonSet ? embedFiles.filter(f => !commonSet.has(f)) : embedFiles;
  const blocks = own.map(f => {
    const src = fs.readFileSync(path.join(JIZURA_SRC, f), 'utf8');
    return `/* ---- 引擎文件: ${f}（整包嵌入，同源闭包，安全） ---- */\n` +
      `if (!(window.__lrcStyleFiles && window.__lrcStyleFiles[${JSON.stringify(f)}])) {\n` +
      `  window.__lrcStyleFiles = window.__lrcStyleFiles || {};\n` +
      `  window.__lrcStyleFiles[${JSON.stringify(f)}] = 1;\n${src}\n}`;
  }).join('\n');
  const needCommon = commonSet ? embedFiles.length - own.length : 0;
  return `/* ============================================================
   动态风格包（自包含单文件）
   ${def.category || '自定义'} · ${def.name || def.key}
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */
${blocks}${needCommon ? `
/* 本风格的部分部件来自共享包 common.js（${needCommon} 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */` : ''}
LrcPlayer.registerStyle({
  key: ${JSON.stringify(def.key)},
  category: ${JSON.stringify(def.category || '自定义')},
  name: ${JSON.stringify(def.name || def.key)},
  pack: ${ser(def.pack)},
  parts: ${ser(customParts || {})},
});
`;
}

/* 生成共享包 common.js：把被多个风格共用的引擎文件打成一个包，全库只下载一次 */
function buildCommon(embedFiles, JIZURA_SRC) {
  const blocks = embedFiles.map(f => {
    const src = fs.readFileSync(path.join(JIZURA_SRC, f), 'utf8');
    return `/* ---- 引擎文件: ${f}（整包嵌入，同源闭包，安全） ---- */\n` +
      `if (!(window.__lrcStyleFiles && window.__lrcStyleFiles[${JSON.stringify(f)}])) {\n` +
      `  window.__lrcStyleFiles = window.__lrcStyleFiles || {};\n` +
      `  window.__lrcStyleFiles[${JSON.stringify(f)}] = 1;\n${src}\n}`;
  }).join('\n');
  return `/* ============================================================
   create-lrc-player 动态风格共享部件包（common.js）
   由 tools/export-all-styles.js 与内置风格同批次生成，必须随 styles/ 一起部署。
   含 ${embedFiles.length} 个共用引擎文件；任意多个风格内嵌同一文件时本守卫保证只执行一次。
   ============================================================
   本文件不调用 registerStyle，只负责把部件注册进引擎。 */
${blocks}
`;
}

module.exports = { loadEngine, collectFiles, ser, buildFile, buildCommon, BASE_FILES };
