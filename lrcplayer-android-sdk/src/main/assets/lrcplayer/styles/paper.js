/* ============================================================
   动态风格包（自包含单文件）
   基础 · 纸墨质感
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "paper",
  category: "基础",
  name: "纸墨质感",
  pack: { "name": "ペーパー・インク", "desc": "紙の質感・藍とマゼンタ・明朝の残像", "schemes": [{ "bg": "#ECE9E3", "fg": "#1B2350", "sub": "#4D5270", "accent": "#C2185B", "accent2": "#111111", "ink": "#111111", "dim": "#DAD6CE", "ghostA": "#C2185B", "ghostB": "#1B2350", "paper": true },{ "bg": "#151515", "fg": "#F0EDE7", "sub": "#B8B4AC", "accent": "#C2185B", "accent2": "#1B2350", "ink": "#F0EDE7", "dim": "#232323", "ghostA": "#C2185B", "ghostB": "#3A4690", "paper": true },{ "bg": "#C2185B", "fg": "#FFFFFF", "sub": "#F6C6D8", "accent": "#1B2350", "accent2": "#111111", "ink": "#1B2350", "dim": "#B5154F", "ghostA": "#1B2350", "ghostB": "#FFFFFF", "paper": true },{ "bg": "#1B2350", "fg": "#F0EDE7", "sub": "#AEB2CC", "accent": "#C2185B", "accent2": "#FFFFFF", "ink": "#F0EDE7", "dim": "#1F2858", "ghostA": "#C2185B", "ghostB": "#FFFFFF", "paper": true }], "fonts": { "display": ["mincho_black","tokumin"], "serif": ["mincho_black","mincho_bold"], "body": ["mincho"], "mono": ["mono"] }, "texture": { "grain": 0.7, "paper": 1, "scan": 0 }, "ghost": 0.5, "bias": { "layout": { "stack": 2.2, "mixed": 1.8, "huge": 1.6, "vcols": 1.4, "circle": 1.2 }, "enter": { "wipe": 1.6, "stretch": 1.4, "blur": 1.2, "slice": 1.2 }, "exit": { "drift": 1.6, "wipe": 1.4 } }, "decor": { "bars": 1, "blobs": 0.8, "shapes": 0.6, "waveform": 0.4 }, "hud": false },
  parts: {  },
});
