/* ============================================================
   动态风格包（自包含单文件）
   基础 · 暗色HUD
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "hud",
  category: "基础",
  name: "暗色HUD",
  pack: { "name": "ダークHUD", "desc": "炭色地・細線フレーム・橙の差し色・日食", "schemes": [{ "bg": "#131315", "fg": "#EFEDEA", "sub": "#8E8B88", "accent": "#F25A2B", "accent2": "#FFFFFF", "ink": "#EFEDEA", "dim": "#1E1E21", "ghostA": "#F25A2B", "ghostB": "#7FD7FF" },{ "bg": "#0B0B0C", "fg": "#FFFFFF", "sub": "#9A9796", "accent": "#F25A2B", "accent2": "#FFFFFF", "ink": "#F25A2B", "dim": "#18181A", "ghostA": "#F25A2B", "ghostB": "#FFFFFF" }], "fonts": { "display": ["gothic_black","zenkaku"], "serif": ["mincho_bold","mincho_light"], "body": ["gothic_med"], "mono": ["mono"] }, "texture": { "grain": 1, "paper": 0, "scan": 0.2 }, "ghost": 0.6, "bias": { "layout": { "circle": 2, "ring": 1.6, "vcols": 1.4, "center": 1.2, "gloss": 1 }, "enter": { "blur": 1.6, "type": 1.4, "assemble": 1.3 }, "exit": { "blur": 1.4, "drift": 1.4, "explode": 1.2 } }, "decor": { "hud": 1, "rings": 1, "arrows": 1, "grid": 0.8, "slash": 0.6 }, "hud": true, "glow": 1.4 },
  parts: {  },
});
