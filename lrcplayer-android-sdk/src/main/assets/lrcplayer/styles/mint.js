/* ============================================================
   动态风格包（自包含单文件）
   基础 · 薄荷终端
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

LrcPlayer.registerStyle({
  key: "mint",
  category: "基础",
  name: "薄荷终端",
  pack: { "name": "ミント・ターミナル", "desc": "黒×青緑×ライム・ラベル貼り・スリットスキャン", "schemes": [{ "bg": "#0A0E0D", "fg": "#E6FFF5", "sub": "#7FB9A8", "accent": "#9CFF3A", "accent2": "#2E8C74", "ink": "#E6FFF5", "dim": "#142420", "ghostA": "#FF3B6B", "ghostB": "#2EE6C8" },{ "bg": "#3FAE93", "fg": "#0A0E0D", "sub": "#123A31", "accent": "#FFFFFF", "accent2": "#9CFF3A", "ink": "#0A0E0D", "dim": "#39A087", "ghostA": "#FFFFFF", "ghostB": "#0A0E0D" },{ "bg": "#F2F2EE", "fg": "#0A0E0D", "sub": "#40504B", "accent": "#2E8C74", "accent2": "#9CFF3A", "ink": "#0A0E0D", "dim": "#E2E4DE", "ghostA": "#2E8C74", "ghostB": "#9CFF3A" }], "fonts": { "display": ["gothic_black","dela"], "serif": ["mincho"], "body": ["gothic_med","sansui"], "mono": ["mono","dot"] }, "texture": { "grain": 0.8, "paper": 0, "scan": 0.6 }, "ghost": 0.9, "bias": { "layout": { "labels": 2.4, "tile": 1.6, "marquee": 1.4, "type": 1.4, "diag": 1.2 }, "enter": { "scramble": 1.8, "type": 1.6, "flicker": 1.4 }, "exit": { "glitch": 1.6, "slice": 1.4 } }, "decor": { "hud": 1, "grid": 0.8, "barcode": 0.8, "sparks": 0.5 }, "hud": true },
  parts: {  },
});
