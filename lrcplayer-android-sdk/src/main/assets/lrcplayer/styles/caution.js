/* ============================================================
   动态风格包（自包含单文件）
   基础 · 警戒黄
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "caution",
  category: "基础",
  name: "警戒黄",
  pack: { "name": "コーション", "desc": "黄色地・赤と青のアクセント・計器UI", "schemes": [{ "bg": "#F4D21F", "fg": "#141414", "sub": "#3A3510", "accent": "#E0231C", "accent2": "#1F3FD8", "ink": "#141414", "dim": "#E6C413", "ghostA": "#E0231C", "ghostB": "#1F3FD8" },{ "bg": "#E0231C", "fg": "#F4D21F", "sub": "#FFE9A0", "accent": "#141414", "accent2": "#FFFFFF", "ink": "#141414", "dim": "#C81E17", "ghostA": "#141414", "ghostB": "#F4D21F" },{ "bg": "#18181A", "fg": "#F4D21F", "sub": "#DDD6B0", "accent": "#E0231C", "accent2": "#FFFFFF", "ink": "#F4D21F", "dim": "#26262A", "ghostA": "#E0231C", "ghostB": "#1F3FD8" }], "fonts": { "display": ["mincho_black","gothic_black"], "serif": ["mincho_black","mincho_bold"], "body": ["gothic_bold"], "mono": ["mono"] }, "texture": { "grain": 0.5, "paper": 0.25, "scan": 0 }, "ghost": 0.55, "bias": { "layout": { "ring": 2.2, "mixed": 2, "circle": 1.4, "gloss": 1.2 }, "enter": { "pop": 1.6, "spin": 1.5, "wipe": 1.2 }, "exit": { "scatter": 1.5, "shrink": 1.2 } }, "decor": { "hud": 1, "rings": 1, "arrows": 1, "counter": 0.8, "barcode": 0.8 }, "hud": true },
  parts: {  },
});
