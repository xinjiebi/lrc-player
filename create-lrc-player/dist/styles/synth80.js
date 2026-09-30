/* ============================================================
   动态风格包（自包含单文件）
   流行 · 合成器80s
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（6 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "synth80",
  category: "流行",
  name: "合成器80s",
  pack: { "name": "シンセ80s", "desc": "黒地にネオンのマゼンタ/シアン・立体文字・走査線", "moods": ["pop","glitch","emotional"], "schemes": [{ "bg": "#0B0414", "fg": "#FF4FD8", "sub": "#A98BFF", "accent": "#22E6FF", "accent2": "#FFE45C", "ink": "#22E6FF", "dim": "#1A0B2E", "ghostA": "#22E6FF", "ghostB": "#6A3BFF" },{ "bg": "#0B0414", "fg": "#22E6FF", "sub": "#8FA8FF", "accent": "#E62EBE", "accent2": "#FFE45C", "ink": "#FF4FD8", "dim": "#140A28", "ghostA": "#FF4FD8", "ghostB": "#FFE45C" },{ "bg": "#1C0A3A", "fg": "#FFFFFF", "sub": "#FFB0E8", "accent": "#E62EBE", "accent2": "#22E6FF", "ink": "#FFE45C", "dim": "#26104C", "ghostA": "#FF2E88", "ghostB": "#22E6FF", "grad": ["#FFE45C","#FF2E88"] },{ "bg": "#FF2E88", "fg": "#0B0414", "sub": "#3A0A30", "accent": "#0B0414", "accent2": "#22E6FF", "ink": "#0B0414", "dim": "#F0287E", "ghostA": "#22E6FF", "ghostB": "#FFE45C" }], "fonts": { "display": ["rampart","dela"], "serif": ["mincho_bold"], "body": ["gothic_bold"], "mono": ["mono","dot"] }, "texture": { "grain": 0.4, "paper": 0, "scan": 0.75 }, "ghost": 1, "bias": { "layout": { "neon": 2, "perspective": 1.6, "tunnel": 1.4, "equalizer": 1.3, "zoomRepeat": 1.3, "marquee": 1.3, "huge": 1.3, "sideways": 1.1, "crossBands": 1.1, "genkou": 0.3, "hanko": 0.3, "quote": 0.4 }, "enter": { "neonOn": 2, "zoomOut": 1.4, "echoIn": 1.3, "whip": 1.2, "stretch": 1.2, "flicker": 1.1, "inkBleed": 0.3, "strokeDraw": 0.5 }, "exit": { "zoomThrough": 1.5, "echoOut": 1.3, "stretch": 1.2, "whipOut": 1.1, "glitch": 1.1, "dissolve": 0.4 }, "treat": { "glow": 1.8, "echoOutline": 1.3, "extrude": 1.2, "longShadow": 1.1, "italic": 1, "emphasisDots": 0.3, "underline": 0.5 }, "bg": { "retroGrid": 2, "sunburst": 1.1, "eqBars": 1.1, "tvBars": 1, "speedLines": 0.8, "dotGrid": 0.4, "halftoneFade": 0.5 }, "cam": { "beatPunch": 1.4, "stepZoom": 1.2, "dollyIn": 1.1, "whipIn": 1, "handheld": 0.4 }, "fx": { "crtOff": 1.5, "strobe": 1.3, "rgbSplit": 1.3, "lightSweep": 1.2, "zoomPunch": 1.2, "filmBurn": 0.3 } }, "decor": { "triangleSpin": 1.2, "beatRing": 1.1, "lineBurst": 1, "twinkle": 0.8, "speedCorner": 0.8, "reticle": 0.6, "petals": 0.1, "tapePieces": 0.1 }, "hud": true, "glow": 1.9, "glitchBoost": 1.15, "extra": true },
  parts: {  },
});
