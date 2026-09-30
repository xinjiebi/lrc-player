/* 离线字体打包：把引擎会用到的全部 Google Fonts（loli.net 镜像）下载到本地。
   - 字体规格自动从 vendor/jizura-src/02_fonts.js（J.FONTS）与 02b_lang.js（J.LANG_FACES）收集
   - 每个规格下载 css2（woff2 切分），全部 woff2 存 dist/fonts/files/（按 URL 去重），
     重写为本地 CSS 存 dist/fonts/<slug>.css，并生成 dist/fonts/manifest.json（规格 → CSS 文件）
   - 运行时引擎优先用本地 CSS（J.LOCAL_FONT_CSS + J.FONT_BASE），缺文件时回退 CDN
   用法：node tools/vendor-fonts.js   （只需联网跑一次，之后 SDK 完全离线） */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SRC = process.env.JIZURA_SRC || path.join(ROOT, 'vendor', 'jizura-src');
const OUT = path.join(ROOT, 'dist', 'fonts');
const FILES = path.join(OUT, 'files');
const CDN = 'https://fonts.loli.net';
// woff2 UA：css2 按 UA 返回格式，现代浏览器 UA 才给 woff2 + unicode-range
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/* 从引擎源码收集全部 gf 规格（fonts 目录 + 语言映射 + ensureFonts 的变量规格） */
function collectSpecs() {
  const specs = new Set();
  for (const f of ['02_fonts.js', '02b_lang.js']) {
    const src = fs.readFileSync(path.join(SRC, f), 'utf8');
    for (const m of src.matchAll(/gf:\s*'([^']+)'/g)) specs.add(m[1]);               // J.FONTS / LANG_FACES 的 gf 字段
    for (const m of src.matchAll(/F\('[^']+',\s*\d+,\s*'([^']+)'\)/g)) specs.add(m[1]); // 语言映射 F(族, 字重, 规格)
    for (const m of src.matchAll(/'([A-Za-z0-9]+(?:\+[A-Za-z0-9]+)+(?::wght@[0-9.;]+)?)'/g)) specs.add(m[1]); // const 规格常量
    for (const m of src.matchAll(/'(Noto\+Sans\+JP:wght@[^']*|Noto\+Serif\+JP:wght@[^']*)'/g)) specs.add(m[1]);
  }
  return [...specs];
}
const slug = s => s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function fetchBuf(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
      console.error(`  ⚠ ${r.status} ${url}`);
    } catch (e) { if (i === tries - 1) console.error(`  ⚠ 失败 ${url}: ${e.message}`); }
    await new Promise(res => setTimeout(res, 500 * (i + 1)));
  }
  return null;
}

/* 简单并发池 */
async function pool(items, n, fn) {
  const errs = [];
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const it = items[i++]; try { await fn(it); } catch (e) { errs.push(it + ': ' + e.message); } }
  }));
  return errs;
}

(async () => {
  fs.mkdirSync(FILES, { recursive: true });
  const specs = collectSpecs();
  console.log(`共 ${specs.length} 个字体规格`);
  const manifest = {};
  const cssList = [];

  for (const spec of specs) {
    const css = await fetchBuf(`${CDN}/css2?family=${spec}&display=swap`);
    if (!css) { console.error(`✗ ${spec}`); continue; }
    const text = css.toString('utf8');
    const urls = [...new Set([...text.matchAll(/url\((https:\/\/[^)]+?)\)/g)].map(m => m[1]))];
    // 下载该规格的全部 woff2（URL 全局去重：不同规格/字重共享同一文件时只存一份）
    let done = 0;
    await pool(urls, 10, async (u) => {
      const name = crypto.createHash('md5').update(u).digest('hex').slice(0, 12) + '.woff2';
      const p = path.join(FILES, name);
      if (!fs.existsSync(p)) {
        const buf = await fetchBuf(u);
        if (!buf) throw new Error('下载失败');
        fs.writeFileSync(p, buf);
      }
      done++;
    });
    // 重写 CSS 中的 URL 为本地相对路径
    const local = text.replace(/url\(https:\/\/[^)]+?\)/g, (m) => {
      const u = m.slice(4, -1);
      return `url(files/${crypto.createHash('md5').update(u).digest('hex').slice(0, 12)}.woff2)`;
    });
    const cssName = slug(spec) + '.css';
    fs.writeFileSync(path.join(OUT, cssName), local);
    manifest[spec] = cssName;
    cssList.push({ spec, css: cssName, files: urls.length });
    console.log(`✓ ${spec}  (${urls.length} 个分片)`);
  }

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  const total = fs.readdirSync(FILES).reduce((s, f) => s + fs.statSync(path.join(FILES, f)).size, 0);
  console.log(`\n完成：${cssList.length} 个 CSS，${fs.readdirSync(FILES).length} 个 woff2，共 ${(total / 1048576).toFixed(1)} MB -> dist/fonts/`);
  console.log('下一步：python3 build.py（会把 manifest 注入基础包，运行时优先本地字体）');
})().catch(e => { console.error(e); process.exit(1); });
