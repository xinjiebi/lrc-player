#!/usr/bin/env node
/* ============================================================
   create-lrc-player — 风格单文件打包工具
   把一个风格源文件（色板+bias 选词）打成自包含的单文件：
   自动从 JIZURA 引擎抽取 bias 点名的部件代码塞进文件。

   用法:
     node tools/pack-style.js styles-src/myStyle.js [-o dist/styles/myStyle.js]

   风格源文件格式（CommonJS 导出一个对象，见 styles-src/pulseSuck.js）:
     module.exports = {
       key: 'myStyle', category: '电子', name: '我的风格',
       pack: { schemes: [...], fonts: {...}, bias: {...}, ... },
       parts: { enter: { myFx: {...} } },   // 可选：自带新部件
       include: ['somePartKey'],            // 可选：额外包含的部件（按 key 自动找组）
     };
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { loadEngine, collectFiles, buildFile } = require('./lib-stylepack');

const SRC = process.argv[2];
if (!SRC) { console.error('用法: node tools/pack-style.js <风格源文件> [-o 输出路径]'); process.exit(1); }
const outIdx = process.argv.indexOf('-o');
const OUT = outIdx > 0 ? process.argv[outIdx + 1]
  : path.join('dist', 'styles', path.basename(SRC).replace(/\.js$/, '') + '.js');

const { J, fileOfKey, JIZURA_SRC } = loadEngine();
const def = require(path.resolve(SRC));
if (!def.key || !def.pack) { console.error('风格源文件需要 export { key, pack }'); process.exit(1); }

const { files } = collectFiles(J, fileOfKey, def, true);
const out = buildFile(def, files, def.parts, JIZURA_SRC);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log(`✅ ${def.category || '自定义'} · ${def.name || def.key} -> ${OUT} (${(out.length / 1024).toFixed(1)} KB, 嵌入 ${files.length} 个引擎文件)`);
