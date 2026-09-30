/* ============================================================
   电子 · 超级吸入 —— 动态风格包示例（自包含单文件）
   上传/删除/热更新的最小单位就是这个文件。
   结构：key（唯一id）+ category（库分组）+ name（组内名）
        + pack（引擎风格定义：色板/字体/质感/选词权重）
        + parts（自带新部件，可选）
   ============================================================ */
LrcPlayer.registerStyle({
  key: 'superSuck',
  category: '电子',
  name: '超级吸入',

  pack: {
    // 两套配色：深空蓝黑底霓虹青/品红，暗紫底紫/薄荷
    schemes: [
      { bg: '#02020A', fg: '#E8FBFF', sub: '#7FD4E8', accent: '#00F0FF', accent2: '#FF00E5',
        ink: '#00F0FF', dim: '#0A1430', ghostA: '#00F0FF', ghostB: '#FF00E5' },
      { bg: '#0A0020', fg: '#F2E8FF', sub: '#B48AE8', accent: '#B400FF', accent2: '#00FFC8',
        ink: '#B400FF', dim: '#180A30', ghostA: '#B400FF', ghostB: '#00FFC8' },
    ],
    fonts: { display: ['zenkaku', 'gothic_black'], serif: ['mincho'], body: ['gothic_med'], mono: ['mono'] },
    texture: { grain: 0.4, paper: 0, scan: 0.6 },   // 电子质感：颗粒 + 扫描线
    ghost: 1.2,                                      // 强色差残影（霓虹色边）
    bias: {
      layout: { center: 1.6, huge: 1.4, vcols: 0.8, tile: 0.4 },  // 偏好居中/巨字排版
      enter:  { superSuckFx: 2.4, blur: 1.2, slice: 0.4 },        // 偏好自带的"超级吸入"
      exit:   { blur: 1.3, cut: 0.5 },
      bg:     { grid: 1.4, stripes: 0.8 },
      cam:    { push: 1.5 },
      fx:     { chroma: 1.6, flash: 0.8 },
    },
    decor: { rings: 1.3, barcode: 1.1, sparks: 0.8 },
    hud: true,
  },

  // 自带一个新进入动画：文字从四周被"吸"回中心位置（带旋转和缩放）
  parts: {
    enter: {
      superSuckFx: {
        name: '超级吸入', tags: ['glitch', 'pop'],
        apply(env, it, p) {
          const seed = it.seed | 0, size = it.size, E = J.E;
          it.charFns.push((i, g, n) => {
            const d = n > 1 ? J.r(seed, i, 4) * 0.35 : 0;      // 逐字错峰
            const q = J.clamp((p - d) / 0.65);
            if (q <= 0) return { hide: true };
            const e = E.outExpo(q);
            const k = 1 - e;                                    // 1→0 收敛
            const ang = J.r(seed, i, 7) * J.TAU;
            const dist = size * (2.2 + J.r(seed, i, 8) * 3.2);
            return {
              dx: Math.cos(ang) * dist * k,
              dy: Math.sin(ang) * dist * k,
              s: 1 + k * 2.6,                                  // 从巨大收敛到等大
              rot: J.rs(seed, i, 9) * 40 * k,                  // 旋转归正
            };
          });
        },
      },
    },
  },
});
