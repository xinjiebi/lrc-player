/* 风格源文件示例：电子 · 脉冲吸入
   用 tools/pack-style.js 打包成自包含单文件：
     node tools/pack-style.js styles-src/pulseSuck.js
   bias 里的关键词（collapse / superSuckFx…）会被自动从引擎抽取进单文件。 */
module.exports = {
  key: 'pulseSuck',
  category: '电子',
  name: '脉冲吸入',

  pack: {
    schemes: [
      { bg: '#03030F', fg: '#EAFBFF', sub: '#6FB7D9', accent: '#00E5FF', accent2: '#FF2BD6',
        ink: '#00E5FF', dim: '#0B1030', ghostA: '#00E5FF', ghostB: '#FF2BD6' },
      { bg: '#0B0018', fg: '#F7ECFF', sub: '#A67BD9', accent: '#C400FF', accent2: '#00FFB0',
        ink: '#C400FF', dim: '#170B30', ghostA: '#C400FF', ghostB: '#00FFB0' },
    ],
    fonts: { display: ['dela', 'gothic_black'], serif: ['mincho'], body: ['gothic_med'], mono: ['mono'] },
    texture: { grain: 0.35, paper: 0, scan: 0.7 },
    ghost: 1.3,
    bias: {
      layout: { center: 1.7, huge: 1.3, marquee: 0.5 },
      enter:  { superSuckFx: 2.2, blur: 1.1 },
      exit:   { collapse: 2.2, blur: 1.0 },     // collapse = 引擎 11p_exit 的「吸い込み」
      bg:     { grid: 1.3 },
      cam:    { push: 1.4 },
      fx:     { chroma: 1.6 },
    },
    decor: { rings: 1.2, barcode: 1.0 },
    hud: true,
  },

  // 自带新部件（打包时会一并写入单文件）
  parts: {
    enter: {
      superSuckFx: {
        name: '超级吸入', tags: ['glitch', 'pop'],
        apply(env, it, p) {
          const seed = it.seed | 0, size = it.size, E = J.E;
          it.charFns.push((i, g, n) => {
            const d = n > 1 ? J.r(seed, i, 4) * 0.35 : 0;
            const q = J.clamp((p - d) / 0.65);
            if (q <= 0) return { hide: true };
            const e = E.outExpo(q), k = 1 - e;
            const ang = J.r(seed, i, 7) * J.TAU;
            const dist = size * (2.2 + J.r(seed, i, 8) * 3.2);
            return { dx: Math.cos(ang) * dist * k, dy: Math.sin(ang) * dist * k,
                     s: 1 + k * 2.6, rot: J.rs(seed, i, 9) * 40 * k };
          });
        },
      },
    },
  },
};
