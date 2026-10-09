/* ============================================================
   动态风格包（自包含单文件）
   基础 · 单色RGB
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "mono",
  category: "基础",
  name: "单色RGB",
  pack: { "name": "モノ・RGB", "desc": "灰色の空間・白い明朝・強いRGB分離・座標の円", "schemes": [{ "bg": "#3B3D41", "fg": "#FFFFFF", "sub": "#B9BBBF", "accent": "#FFFFFF", "accent2": "#FFE34D", "ink": "#1A1B1D", "dim": "#45474C", "ghostA": "#FF2A2A", "ghostB": "#2AA8FF" },{ "bg": "#141517", "fg": "#FFFFFF", "sub": "#9EA0A4", "accent": "#FFE34D", "accent2": "#FFFFFF", "ink": "#FFFFFF", "dim": "#1E1F22", "ghostA": "#FF2A2A", "ghostB": "#2AFF7A" }], "fonts": { "display": ["mincho_black","mincho_bold"], "serif": ["mincho_bold"], "body": ["mincho"], "mono": ["mono"] }, "texture": { "grain": 0.9, "paper": 0, "scan": 0.3 }, "ghost": 1.3, "bias": { "layout": { "circle": 1.8, "ring": 1.6, "pill": 1.4, "tile": 1.4, "vcols": 1.3 }, "enter": { "assemble": 1.4, "blur": 1.4, "zoom": 1.3 }, "exit": { "explode": 1.4, "glitch": 1.4, "blur": 1.2 } }, "decor": { "rings": 1.4, "hud": 0.6, "dots": 1 }, "hud": false },
  parts: {  },
});
