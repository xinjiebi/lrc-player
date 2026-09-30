/* ============================================================
   动态风格包（自包含单文件）
   基础 · 黑白色差
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "noir",
  category: "基础",
  name: "黑白色差",
  pack: { "name": "ノワール・クロマ", "desc": "黒地・白文字・シアン/琥珀の色ズレ", "schemes": [{ "bg": "#060607", "fg": "#F5EEEA", "sub": "#BDB6B2", "accent": "#F5A50C", "accent2": "#16F4D4", "ink": "#F5EEEA", "dim": "#2A2A2E", "ghostA": "#F5A50C", "ghostB": "#16F4D4" },{ "bg": "#F2EDE8", "fg": "#0B0B0C", "sub": "#4A4644", "accent": "#E0600C", "accent2": "#0FAE98", "ink": "#0B0B0C", "dim": "#D9D2CC", "ghostA": "#F5A50C", "ghostB": "#16C4B4", "swap": true }], "fonts": { "display": ["gothic_black","dela","zenkaku"], "serif": ["mincho_light","mincho"], "body": ["gothic_med"], "mono": ["mono"] }, "texture": { "grain": 0.9, "paper": 0, "scan": 0 }, "ghost": 1, "bias": { "layout": { "vcols": 2, "condensed": 2, "marquee": 1.6, "tile": 1.4, "center": 1.2 }, "enter": { "assemble": 2.2, "slice": 1.8, "stretch": 1.4 }, "exit": { "explode": 1.8, "fall": 1.2, "drift": 1.4 } }, "decor": { "rings": 0.8, "hud": 0.4, "slash": 0.6 }, "hud": false },
  parts: {  },
});
