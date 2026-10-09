/* ============================================================
   动态风格包（自包含单文件）
   基础 · 流行洋红
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "magenta",
  category: "基础",
  name: "流行洋红",
  pack: { "name": "ポップ・マゼンタ", "desc": "ショッキングピンク×白・太丸ゴシック・引き出し線", "schemes": [{ "bg": "#FF0A8C", "fg": "#FFFFFF", "sub": "#FFD2EA", "accent": "#FFFFFF", "accent2": "#2B2BD9", "ink": "#FFFFFF", "dim": "#F0077F", "ghostA": "#FF8CC8", "ghostB": "#2B2BD9" },{ "bg": "#FFFFFF", "fg": "#FF0A8C", "sub": "#FF6DB6", "accent": "#2B2BD9", "accent2": "#FF0A8C", "ink": "#FF0A8C", "dim": "#FFE4F2", "ghostA": "#2B2BD9", "ghostB": "#FF8CC8" },{ "bg": "#2B2BD9", "fg": "#FFFFFF", "sub": "#C9C9FF", "accent": "#FF0A8C", "accent2": "#FFFFFF", "ink": "#FFFFFF", "dim": "#2424C4", "ghostA": "#FF0A8C", "ghostB": "#FFFFFF" }], "fonts": { "display": ["round","pop","gothic_black"], "serif": ["mincho_bold"], "body": ["round","gothic_bold"], "mono": ["mono"] }, "texture": { "grain": 0.3, "paper": 0, "scan": 0 }, "ghost": 0.35, "bias": { "layout": { "wave": 2.2, "gloss": 1.6, "huge": 1.6, "pill": 1.4, "scatter": 1.2 }, "enter": { "pop": 2, "drop": 1.6, "spin": 1.3, "blur": 1.2 }, "exit": { "scatter": 1.6, "shrink": 1.4, "blur": 1.2 } }, "decor": { "leaders": 1, "counter": 1, "sparks": 0.8, "shapes": 0.6 }, "hud": false },
  parts: {  },
});
