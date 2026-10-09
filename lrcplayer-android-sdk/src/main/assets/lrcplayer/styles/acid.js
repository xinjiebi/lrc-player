/* ============================================================
   动态风格包（自包含单文件）
   故障 · 酸性设计
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（8 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "acid",
  category: "故障",
  name: "酸性设计",
  pack: { "name": "アシッド", "desc": "黒×酸性グリーン×マゼンタ・荒い書体と壊れた画面", "moods": ["glitch","graphic"], "schemes": [{ "bg": "#050505", "fg": "#C6FF00", "sub": "#86A800", "accent": "#FF2BD6", "accent2": "#FFFFFF", "ink": "#C6FF00", "dim": "#111A00", "ghostA": "#FF2BD6", "ghostB": "#3D5BFF" },{ "bg": "#C6FF00", "fg": "#050505", "sub": "#2A3A00", "accent": "#050505", "accent2": "#FF2BD6", "ink": "#050505", "dim": "#B8F000", "ghostA": "#FF2BD6", "ghostB": "#2B3DFF" },{ "bg": "#FF2BD6", "fg": "#050505", "sub": "#3A0030", "accent": "#C6FF00", "accent2": "#050505", "ink": "#050505", "dim": "#F024C8", "ghostA": "#C6FF00", "ghostB": "#2B3DFF" },{ "bg": "#0A0A0A", "fg": "#FFFFFF", "sub": "#9A9A9A", "accent": "#C6FF00", "accent2": "#FF2BD6", "ink": "#FF2BD6", "dim": "#171717", "ghostA": "#C6FF00", "ghostB": "#FF2BD6" }], "fonts": { "display": ["reggae","dot","dela"], "serif": ["mincho_black"], "body": ["sansui"], "mono": ["dot","mono"] }, "texture": { "grain": 1, "paper": 0, "scan": 0.45 }, "ghost": 1.25, "bias": { "layout": { "dotMatrix": 1.6, "rain": 1.5, "crossBands": 1.4, "zoomRepeat": 1.4, "tile": 1.4, "splitHalves": 1.3, "huge": 1.3, "slotMachine": 1.1, "equalizer": 1.1, "condensed": 1.1, "hanging": 0.3, "bubble": 0.3, "quote": 0.3, "credits": 0.4 }, "enter": { "glitchIn": 1.8, "resolve": 1.5, "flicker": 1.4, "checker": 1.3, "vSlice": 1.3, "scramble": 1.3, "randomOrder": 1.2, "slice": 1.2, "fadeStagger": 0.3, "unroll": 0.3 }, "exit": { "glitchDissolve": 1.7, "scrambleOut": 1.4, "glitch": 1.4, "checkerOut": 1.2, "melt": 1.2, "vSliceDrop": 1.1, "dissolve": 0.3, "riseOut": 0.4 }, "treat": { "echoOutline": 1.5, "hatch": 1.3, "halftone": 1.2, "hardShadow": 1.2, "strike": 1.1, "softShadow": 0.3, "gradientV": 0.4 }, "bg": { "noiseField": 1.5, "tvBars": 1.3, "eqBars": 1.1, "bigStripes": 1, "scanBars": 1, "bokehBg": 0.2, "gradientSweep": 0.4 }, "cam": { "shakeHard": 1.4, "whipIn": 1.2, "stepZoom": 1.2, "crashZoom": 1.1, "handheld": 0.5, "tiltUp": 0.5 }, "fx": { "pixelDrift": 1.5, "posterize": 1.4, "tileShift": 1.4, "smear": 1.2, "invert": 1.2, "strobe": 1.1, "filmBurn": 0.2, "lightSweep": 0.3 } }, "decor": { "glitchRects": 1.6, "qrBlock": 1.2, "reticle": 1, "barcode": 1, "bars": 1, "crosshair": 0.8, "timecodeBar": 0.7, "petals": 0.1, "heartsStars": 0.1, "confetti": 0.1 }, "hud": true, "glow": 0.8, "glitchBoost": 1.6, "extra": true },
  parts: {  },
});
