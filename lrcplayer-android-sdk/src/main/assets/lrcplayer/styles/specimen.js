/* ============================================================
   动态风格包（自包含单文件）
   基础 · 样本注解
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "specimen",
  category: "基础",
  name: "样本注解",
  pack: { "name": "スペシメン", "desc": "墨色地・明朝・辞書の注釈と引き出し線", "schemes": [{ "bg": "#1B1A1C", "fg": "#F2F0EC", "sub": "#A19E99", "accent": "#F2F0EC", "accent2": "#C8B98C", "ink": "#F2F0EC", "dim": "#2A292C", "ghostA": "#6E6A66", "ghostB": "#C8B98C" },{ "bg": "#F2F0EC", "fg": "#1B1A1C", "sub": "#5E5B57", "accent": "#1B1A1C", "accent2": "#8A7A4E", "ink": "#1B1A1C", "dim": "#E3E0DA", "ghostA": "#B9B4AD", "ghostB": "#8A7A4E" }], "fonts": { "display": ["mincho_bold","mincho_black"], "serif": ["mincho","mincho_light"], "body": ["mincho"], "mono": ["mono"] }, "texture": { "grain": 0.6, "paper": 0.3, "scan": 0 }, "ghost": 0.25, "bias": { "layout": { "gloss": 2.6, "vcols": 1.8, "mixed": 1.4, "center": 1.2, "tile": 1 }, "enter": { "type": 1.8, "blur": 1.6, "wipe": 1.2 }, "exit": { "blur": 1.6, "drift": 1.2, "wipe": 1.2 } }, "decor": { "leaders": 1, "slash": 0.8, "rings": 0.4 }, "hud": false },
  parts: {  },
});
