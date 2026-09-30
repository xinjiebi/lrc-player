/* ============================================================
   动态风格包（自包含单文件）
   基础 · 交通标识
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "transit",
  category: "基础",
  name: "交通标识",
  pack: { "name": "トランジット", "desc": "オリーブ×黄色・矢印と標識・網点", "schemes": [{ "bg": "#5B582B", "fg": "#FFFFFF", "sub": "#E6E2BC", "accent": "#E8C21A", "accent2": "#1A1A1A", "ink": "#E8C21A", "dim": "#67633A", "ghostA": "#E8C21A", "ghostB": "#1A1A1A" },{ "bg": "#1A1A1A", "fg": "#FFFFFF", "sub": "#B8B5A0", "accent": "#E8C21A", "accent2": "#FFFFFF", "ink": "#E8C21A", "dim": "#242424", "ghostA": "#E8C21A", "ghostB": "#7C7A55" },{ "bg": "#9C9A94", "fg": "#FFFFFF", "sub": "#F0EEE6", "accent": "#E8C21A", "accent2": "#1A1A1A", "ink": "#1A1A1A", "dim": "#A6A49E", "ghostA": "#E8C21A", "ghostB": "#1A1A1A" }], "fonts": { "display": ["zenkaku","gothic_black"], "serif": ["mincho_bold"], "body": ["gothic_bold"], "mono": ["mono"] }, "texture": { "grain": 0.8, "paper": 0.2, "scan": 0 }, "ghost": 0.5, "bias": { "layout": { "mixed": 2, "scatter": 1.6, "diag": 1.4, "huge": 1.2 }, "enter": { "spin": 1.6, "drop": 1.4, "pop": 1.2, "stretch": 1.2 }, "exit": { "scatter": 1.4, "stretch": 1.4 } }, "decor": { "arrows": 1.4, "shapes": 1, "counter": 0.8, "rings": 0.6 }, "hud": false },
  parts: {  },
});
