/* ============================================================
   动态风格包（自包含单文件）
   基础 · 深红信号
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "crimson",
  category: "基础",
  name: "深红信号",
  pack: { "name": "クリムゾン・シグナル", "desc": "深紅地・白と黒の二段組み・データ破損", "schemes": [{ "bg": "#C8103F", "fg": "#FFFFFF", "sub": "#FFD9E2", "accent": "#140509", "accent2": "#39F2C8", "ink": "#140509", "dim": "#B00D37", "ghostA": "#FFFFFF", "ghostB": "#39F2C8" },{ "bg": "#FF6F98", "fg": "#FFFFFF", "sub": "#FFE3EB", "accent": "#1A0710", "accent2": "#39F2C8", "ink": "#1A0710", "dim": "#F25C87", "ghostA": "#FFFFFF", "ghostB": "#1A0710" },{ "bg": "#150509", "fg": "#FF3D6E", "sub": "#FF9DB6", "accent": "#FFFFFF", "accent2": "#39F2C8", "ink": "#FF3D6E", "dim": "#2A0B14", "ghostA": "#FF3D6E", "ghostB": "#39F2C8" }], "fonts": { "display": ["gothic_black","zenkaku"], "serif": ["mincho"], "body": ["gothic_med","sansui"], "mono": ["mono"] }, "texture": { "grain": 0.6, "paper": 0, "scan": 0.4 }, "ghost": 0.8, "bias": { "layout": { "huge": 2, "marquee": 1.6, "scatter": 1.5, "stack": 1.3, "type": 1.3 }, "enter": { "scramble": 1.6, "slice": 1.6, "type": 1.3 }, "exit": { "glitch": 2, "slice": 1.6 } }, "decor": { "hud": 1, "arrows": 0.8, "rings": 0.8 }, "hud": true, "glitchBoost": 1.4 },
  parts: {  },
});
