/* ============================================================
   动态风格包（自包含单文件）
   基础 · 胭脂渐变
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "rouge",
  category: "基础",
  name: "胭脂渐变",
  pack: { "name": "ルージュ・グラデ", "desc": "明るいグレー地・赤のグラデーション・カプセル", "schemes": [{ "bg": "#E4E2E0", "fg": "#141414", "sub": "#6B6866", "accent": "#D40F1C", "accent2": "#141414", "ink": "#141414", "dim": "#D8D6D4", "ghostA": "#D40F1C", "ghostB": "#6B6866", "grad": ["#E3141F","#4A0005"] },{ "bg": "#140405", "fg": "#FFFFFF", "sub": "#C98A8E", "accent": "#E3141F", "accent2": "#FFFFFF", "ink": "#E3141F", "dim": "#220A0C", "ghostA": "#E3141F", "ghostB": "#FFFFFF", "grad": ["#FF4A52","#6A0008"] }], "fonts": { "display": ["gothic_black","dela"], "serif": ["mincho_black"], "body": ["gothic_med"], "mono": ["mono"] }, "texture": { "grain": 0.4, "paper": 0, "scan": 0 }, "ghost": 0.4, "bias": { "layout": { "huge": 2.2, "pill": 2, "mixed": 1.4, "labels": 1.2, "center": 1.2 }, "enter": { "zoom": 1.6, "wipe": 1.4, "pop": 1.2 }, "exit": { "shrink": 1.6, "wipe": 1.2 } }, "decor": { "hud": 0.8, "leaders": 0.8, "stripes": 0.6 }, "hud": true, "useGrad": true },
  parts: {  },
});
