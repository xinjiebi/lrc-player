/* ============================================================
   基础包保底风格（B 方案：内置风格全部外置为单文件后，
   基础包只保留 noir 一套保底，保证未加载任何风格文件时也能出画面；
   加载 styles/noir.js 后会被完整版覆盖升级）。
   ============================================================ */
J.STYLES = {
  noir: {
    name: 'ノワール・クロマ', desc: '黒地・白文字・シアン/琥珀の色ズレ',
    schemes: [
      { bg: '#060607', fg: '#F5EEEA', sub: '#BDB6B2', accent: '#F5A50C', accent2: '#16F4D4', ink: '#F5EEEA', dim: '#2A2A2E', ghostA: '#F5A50C', ghostB: '#16F4D4' },
      { bg: '#F2EDE8', fg: '#0B0B0C', sub: '#4A4644', accent: '#E0600C', accent2: '#0FAE98', ink: '#0B0B0C', dim: '#D9D2CC', ghostA: '#F5A50C', ghostB: '#16C4B4', swap: true },
    ],
    fonts: { display: ['gothic_black', 'dela', 'zenkaku'], serif: ['mincho_light', 'mincho'], body: ['gothic_med'], mono: ['mono'] },
    texture: { grain: 0.9, paper: 0, scan: 0 }, ghost: 1.0,
    bias: { layout: { vcols: 2, condensed: 2, marquee: 1.6, tile: 1.4, center: 1.2 }, enter: { assemble: 2.2, slice: 1.8, stretch: 1.4 }, exit: { explode: 1.8, fall: 1.2, drift: 1.4 } },
    decor: { rings: 0.8, hud: 0.4, slash: 0.6 }, hud: false,
  },
};
/* noir2 = noir 的别名副本：保证基础包只装一套风格时 omakase 也有可抽对象
   （omakase 会避开当前风格，只有一套时会抽到空池崩溃）；选择器 UI 会隐藏它 */
J.STYLES.noir2 = Object.assign({}, J.STYLES.noir, { hidden: true });
J.STYLE_ORDER = ['noir', 'noir2'];
J.BASE_STYLES = ['noir'];

/* ---- 以下从 04_styles.js 原样保留：风格解析 / 抠像模式（引擎运行时必须） ---- */
J.resolveStyle = (project) => {
  const base = J.STYLES[project.style] || J.STYLES.noir;
  const st = JSON.parse(JSON.stringify(base));
  const ov = project.colors || {};
  // base colours (background / text) replace the main scheme only
  if (ov.enabled) st.schemes[0] = Object.assign({}, st.schemes[0], pickDefined(ov, ['bg', 'fg', 'sub']));
  // accent + chromatic ghost colours apply to every scheme; accent is re-lit per background for contrast
  if (ov.accentOn) {
    st.schemes = st.schemes.map(s => {
      const o = Object.assign({}, s);
      if (ov.accent) { o.accent = J.fitContrast(ov.accent, s.bg, 2.4); if (s.ink === s.accent) o.ink = o.accent; }
      // ghosts only need to stay visible against this scheme's background
      if (ov.ghostA) o.ghostA = J.fitContrast(ov.ghostA, s.bg, 1.35);
      if (ov.ghostB) o.ghostB = J.fitContrast(ov.ghostB, s.bg, 1.35);
      if (ov.accent && s.grad) o.grad = [J.fitContrast(ov.accent, s.bg, 2.4), J.mix(ov.accent, '#000000', 0.7)];
      return o;
    });
  }
  const fo = project.fonts || {};
  for (const role of ['display', 'serif', 'body']) if (fo[role] && J.FONTS[fo[role]]) st.fonts[role] = [fo[role]];
  if (J.keyMode(project)) keyStyle(st);
  return st;
};
/* ---- 合成用の背景（グリーンバック / ブラックバック） ----
   Every scheme becomes white-on-black (so every part behaves as on a dark background), textures go away,
   and the renderer turns the finished frame monochrome and — for green — screens it onto pure green.
   Black stays the "empty" colour, so a keyer (green) or a screen / luma blend (black) gives the same result. */
J.KEY_BG = { green: '#00FF00', black: '#000000' };
J.keyMode = project => (project && J.KEY_BG[project.keyBg] ? project.keyBg : null);
function keyStyle(st) {
  st.schemes = st.schemes.map(s => {
    const o = { bg: '#000000', fg: '#FFFFFF', sub: '#D2D2D2', accent: '#FFFFFF', accent2: '#BDBDBD', ink: '#FFFFFF', dim: '#1E1E1E', ghostA: '#9A9A9A', ghostB: '#5E5E5E' };
    if (s.grad) o.grad = ['#FFFFFF', '#A8A8A8'];
    return o;
  });
  st.texture = { grain: 0, paper: 0, scan: 0 };
  st.key = true;
}
function pickDefined(o, keys) { const r = {}; for (const k of keys) if (o[k]) r[k] = o[k]; return r; }
