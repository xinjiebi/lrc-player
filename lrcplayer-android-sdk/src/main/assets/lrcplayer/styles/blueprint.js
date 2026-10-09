/* ============================================================
   动态风格包（自包含单文件）
   基础 · 蓝图纸
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "blueprint",
  category: "基础",
  name: "蓝图纸",
  pack: { "name": "ブループリント", "desc": "鮮青×白×黒・図形コラージュ・斜め帯", "schemes": [{ "bg": "#1B1BE8", "fg": "#FFFFFF", "sub": "#C7C7FF", "accent": "#000000", "accent2": "#FFFFFF", "ink": "#000000", "dim": "#2323F0", "ghostA": "#000000", "ghostB": "#8C8CFF" },{ "bg": "#000000", "fg": "#FFFFFF", "sub": "#9A9AFF", "accent": "#1B1BE8", "accent2": "#FFFFFF", "ink": "#1B1BE8", "dim": "#0A0A30", "ghostA": "#1B1BE8", "ghostB": "#FFFFFF" },{ "bg": "#FFFFFF", "fg": "#1B1BE8", "sub": "#5A5AF0", "accent": "#000000", "accent2": "#1B1BE8", "ink": "#1B1BE8", "dim": "#EDEDFF", "ghostA": "#000000", "ghostB": "#8C8CFF" }], "fonts": { "display": ["dela","gothic_black"], "serif": ["mincho_bold"], "body": ["gothic_bold"], "mono": ["mono","dot"] }, "texture": { "grain": 0.4, "paper": 0, "scan": 0 }, "ghost": 0.6, "bias": { "layout": { "diag": 2.2, "labels": 1.4, "huge": 1.4, "condensed": 1.2 }, "enter": { "wipe": 1.6, "slice": 1.6, "stretch": 1.3 }, "exit": { "wipe": 1.6, "slice": 1.4, "glitch": 1.2 } }, "decor": { "shapes": 1.4, "stripes": 1, "slash": 1, "grid": 0.6 }, "hud": false },
  parts: {  },
});
