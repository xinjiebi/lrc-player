/* ============================================================
   动态风格包（自包含单文件）
   情绪化 · 夜樱
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（8 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "sakura",
  category: "情绪化",
  name: "夜樱",
  pack: { "name": "サクラ", "desc": "淡い桜色・深い梅紫・夜桜・丸文字と明朝", "moods": ["emotional","calm"], "schemes": [{ "bg": "#F8E4EB", "fg": "#4A1434", "sub": "#8A4A69", "accent": "#D93A74", "accent2": "#6F8F4E", "ink": "#4A1434", "dim": "#F0D3DE", "ghostA": "#EC6A9A", "ghostB": "#9A8AE6", "paper": true },{ "bg": "#26091B", "fg": "#FCE8F0", "sub": "#D69DB6", "accent": "#FF86B0", "accent2": "#B9E0A2", "ink": "#FCE8F0", "dim": "#351127", "ghostA": "#FF5C95", "ghostB": "#8A78FF" },{ "bg": "#E77FA3", "fg": "#3A0B26", "sub": "#65173F", "accent": "#3A0B26", "accent2": "#FFF3F7", "ink": "#3A0B26", "dim": "#DE7499", "ghostA": "#B4205A", "ghostB": "#6A4CC8" },{ "bg": "#FFFAF8", "fg": "#A01E4A", "sub": "#B45F7E", "accent": "#E0457F", "accent2": "#4A1434", "ink": "#A01E4A", "dim": "#F8ECEE", "ghostA": "#F07AA4", "ghostB": "#A898EA", "paper": true }], "fonts": { "display": ["kiwi","shippori"], "serif": ["shippori","mincho_light"], "body": ["kiwi"], "mono": ["mono"] }, "texture": { "grain": 0.35, "paper": 0.35, "scan": 0 }, "ghost": 0.45, "bias": { "layout": { "vcols": 1.8, "columnsBig": 1.6, "hanging": 1.5, "center": 1.3, "arcTop": 1.3, "mirror": 1.2, "circle": 1.2, "kanjiFocus": 1.2, "huge": 0.8, "tile": 0.4, "condensed": 0.5 }, "enter": { "blurStagger": 1.8, "fadeStagger": 1.6, "blur": 1.4, "trackIn": 1.3, "inkBleed": 1.2, "unroll": 1.1, "slice": 0.5, "scramble": 0.3 }, "exit": { "dissolve": 1.8, "riseOut": 1.5, "drift": 1.5, "blurOutStagger": 1.4, "echoOut": 1.1, "glitch": 0.3, "explode": 0.5 }, "treat": { "softShadow": 1.5, "emphasisDots": 1.2, "gradientV": 1.2, "echoOutline": 0.4, "hatch": 0.4 }, "bg": { "bokehBg": 1.4, "particlesBg": 1.3, "gradientSweep": 1.2, "spotlight": 1, "tvBars": 0.2, "bigStripes": 0.4, "noiseField": 0.4 }, "cam": { "driftDiag": 1.4, "pullOut": 1.2, "tiltUp": 1.2, "shakeHard": 0.3 }, "fx": { "lightSweep": 1.4, "whiteFrame": 1.2, "filmBurn": 1, "pixelDrift": 0.3, "posterize": 0.4 } }, "decor": { "petals": 1.6, "bokeh": 1, "twinkle": 0.8, "lightLeak": 0.7, "waveLine": 0.6, "glitchRects": 0.1, "barcode": 0.1 }, "hud": false, "glow": 0.9, "extra": true, "wa": true },
  parts: {  },
});
