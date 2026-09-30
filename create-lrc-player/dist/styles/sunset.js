/* ============================================================
   动态风格包（自包含单文件）
   情绪化 · 晚霞渐变
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（8 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "sunset",
  category: "情绪化",
  name: "晚霞渐变",
  pack: { "name": "夕焼けグラデ", "desc": "橙から菫へのグラデーション・太い明朝・逆光", "moods": ["emotional","pop"], "schemes": [{ "bg": "#2A0F44", "fg": "#FFF0DC", "sub": "#E6A98F", "accent": "#FF7A30", "accent2": "#FF4A86", "ink": "#FFB347", "dim": "#361456", "ghostA": "#FF7A30", "ghostB": "#B84BFF", "grad": ["#FFC15E","#FF4A7A"] },{ "bg": "#FF8A3D", "fg": "#2A0F44", "sub": "#5A1F55", "accent": "#2A0F44", "accent2": "#FFF0DC", "ink": "#2A0F44", "dim": "#F57F32", "ghostA": "#E0306A", "ghostB": "#7A2BC0", "grad": ["#6A1B9A","#2A0F44"] },{ "bg": "#B8325F", "fg": "#FFF3E4", "sub": "#FFC7A8", "accent": "#FFC15E", "accent2": "#2A0F44", "ink": "#FFF3E4", "dim": "#A92C56", "ghostA": "#FFC15E", "ghostB": "#2A0F44", "grad": ["#FFF0B8","#FFC46E"] },{ "bg": "#FFE4CF", "fg": "#3A1250", "sub": "#8A4A6A", "accent": "#F2562E", "accent2": "#8A3FD1", "ink": "#3A1250", "dim": "#F7D6BE", "ghostA": "#FF6A3D", "ghostB": "#9A4BE0", "grad": ["#E24A22","#7A2BBF"] }], "fonts": { "display": ["tokumin","mincho_black","dela"], "serif": ["mincho_black","shippori"], "body": ["gothic_med"], "mono": ["mono"] }, "texture": { "grain": 0.55, "paper": 0, "scan": 0 }, "ghost": 0.6, "bias": { "layout": { "huge": 1.8, "pill": 1.5, "arcTop": 1.5, "center": 1.3, "mixed": 1.3, "curtain": 1.3, "lowerThird": 1.2, "depthStack": 1.1, "tile": 0.5, "dotMatrix": 0.3 }, "enter": { "zoom": 1.5, "riseMask": 1.4, "blur": 1.3, "echoIn": 1.2, "wipe": 1.2, "trackIn": 1.1, "scramble": 0.4, "glitchIn": 0.3 }, "exit": { "zoomThrough": 1.4, "blur": 1.4, "drift": 1.3, "riseOut": 1.2, "shrink": 1.1, "glitchDissolve": 0.3 }, "treat": { "gradientV": 1.8, "longShadow": 1.2, "softShadow": 1.1, "glow": 1, "halftone": 0.5, "hatch": 0.4 }, "bg": { "gradientSweep": 1.8, "sunburst": 1.2, "spotlight": 1.2, "letterbox": 1.1, "halftoneFade": 0.8, "tvBars": 0.3 }, "cam": { "dollyIn": 1.3, "pullOut": 1.2, "tiltUp": 1.2, "crashZoom": 0.8 }, "fx": { "lightSweep": 1.6, "filmBurn": 1.4, "whiteFrame": 1, "hueShift": 0.8, "pixelDrift": 0.4 } }, "decor": { "lightLeak": 1.4, "lineBurst": 1, "bokeh": 0.8, "twinkle": 0.7, "halftonePatch": 0.6, "waveLine": 0.5 }, "hud": false, "glow": 1.3, "useGrad": true, "extra": true },
  parts: {  },
});
