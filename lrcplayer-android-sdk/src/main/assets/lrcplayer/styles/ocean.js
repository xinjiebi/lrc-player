/* ============================================================
   动态风格包（自包含单文件）
   静谧 · 深海
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（8 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "ocean",
  category: "静谧",
  name: "深海",
  pack: { "name": "深海", "desc": "濃紺の深海・シアンの発光・泡と細いゴシック", "moods": ["calm","emotional"], "schemes": [{ "bg": "#031A2E", "fg": "#E4FAFF", "sub": "#7FB2C8", "accent": "#1FD2E6", "accent2": "#4C7DFF", "ink": "#E4FAFF", "dim": "#0A2842", "ghostA": "#1FD2E6", "ghostB": "#3B5BFF" },{ "bg": "#0B5566", "fg": "#FFFFFF", "sub": "#A9E3EA", "accent": "#04182A", "accent2": "#7FF3FF", "ink": "#E4FAFF", "dim": "#0E6173", "ghostA": "#27E3F2", "ghostB": "#031A2E" },{ "bg": "#DCF1F2", "fg": "#06243A", "sub": "#3E6A7C", "accent": "#0A7F98", "accent2": "#3B5BFF", "ink": "#06243A", "dim": "#CBE6E8", "ghostA": "#16B4CC", "ghostB": "#5A6BFF" },{ "bg": "#01060D", "fg": "#7FF6FF", "sub": "#3E9AAE", "accent": "#FFFFFF", "accent2": "#2E6BFF", "ink": "#7FF6FF", "dim": "#081521", "ghostA": "#2E6BFF", "ghostB": "#00FFC2" }], "fonts": { "display": ["gothic_light","zenkaku"], "serif": ["mincho_light","mincho"], "body": ["sansui"], "mono": ["mono"] }, "texture": { "grain": 0.6, "paper": 0, "scan": 0 }, "ghost": 0.75, "bias": { "layout": { "bubbles": 1.8, "depthStack": 1.5, "tunnel": 1.3, "rain": 1.2, "wave": 1.3, "center": 1.3, "vcols": 1.2, "perspective": 1.2, "orbit": 1.1, "labels": 0.5, "stickerBomb": 0.3 }, "enter": { "riseMask": 1.6, "blur": 1.5, "waveIn": 1.4, "blurStagger": 1.3, "zoom": 1.1, "pop": 0.5, "stamp": 0.4 }, "exit": { "riseOut": 1.7, "zoomFar": 1.5, "dissolve": 1.3, "melt": 1.2, "blur": 1.2, "popOut": 0.5 }, "treat": { "glow": 1.6, "softShadow": 1.2, "gradientV": 1.1, "marker": 0.4, "boxed": 0.5 }, "bg": { "ripples": 1.6, "particlesBg": 1.4, "gradientSweep": 1.2, "concentric": 1, "bokehBg": 1, "checker": 0.3, "polka": 0.4 }, "cam": { "driftDiag": 1.4, "dollyIn": 1.2, "roll": 1.1, "tiltUp": 1.1, "bounce": 0.4 }, "fx": { "waveWarp": 1.6, "lightSweep": 1.1, "rgbSplit": 0.8, "strobe": 0.4 } }, "decor": { "risingParticles": 1.6, "bokeh": 1.1, "waveLine": 1.2, "orbitDots": 0.7, "beatRing": 0.6, "rings": 0.6, "sparks": 0.2 }, "hud": false, "glow": 1.6, "extra": true },
  parts: {  },
});
