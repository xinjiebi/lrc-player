/* ============================================================
   动态风格包（自包含单文件）
   静谧 · 森之手帖
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（7 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "forest",
  category: "静谧",
  name: "森之手帖",
  pack: { "name": "森の手帖", "desc": "苔と生成り・樹皮の茶・鉛筆の手書き文字", "moods": ["calm","editorial","emotional"], "schemes": [{ "bg": "#1D291B", "fg": "#EFE9D6", "sub": "#A8B08A", "accent": "#B7C95A", "accent2": "#C4833F", "ink": "#EFE9D6", "dim": "#263423", "ghostA": "#8FB04A", "ghostB": "#C4833F" },{ "bg": "#EDE6D1", "fg": "#22301F", "sub": "#5D6647", "accent": "#4F7A35", "accent2": "#8A5A32", "ink": "#22301F", "dim": "#E1D9C2", "ghostA": "#6F9A45", "ghostB": "#B0703A", "paper": true },{ "bg": "#4A3526", "fg": "#F2EAD3", "sub": "#CDB894", "accent": "#B7C95A", "accent2": "#EFE9D6", "ink": "#B7C95A", "dim": "#55402F", "ghostA": "#8FB04A", "ghostB": "#D9A441", "paper": true },{ "bg": "#A9BC96", "fg": "#1A2618", "sub": "#34482F", "accent": "#1A2618", "accent2": "#F2EAD3", "ink": "#1A2618", "dim": "#9FB38C", "ghostA": "#4F7A35", "ghostB": "#8A5A32" }], "fonts": { "display": ["klee","shippori"], "serif": ["shippori","mincho"], "body": ["klee"], "mono": ["mono"] }, "texture": { "grain": 0.7, "paper": 0.5, "scan": 0 }, "ghost": 0.45, "bias": { "layout": { "columnsBig": 1.6, "vcols": 1.5, "hanging": 1.4, "quote": 1.3, "dropCap": 1.3, "frameBox": 1.2, "lowerThird": 1.2, "justified": 1.1, "marquee": 0.5, "equalizer": 0.3 }, "enter": { "strokeDraw": 1.7, "inkBleed": 1.4, "fadeStagger": 1.4, "riseMask": 1.2, "blur": 1.2, "unroll": 1.1, "scramble": 0.3, "glitchIn": 0.2 }, "exit": { "dissolve": 1.6, "undraw": 1.5, "drift": 1.4, "sinkMask": 1.2, "blurOutStagger": 1.1, "glitch": 0.3 }, "treat": { "underline": 1.3, "emphasisDots": 1.2, "dotted": 1.2, "softShadow": 1, "echoOutline": 0.3 }, "bg": { "dotGrid": 1.3, "particlesBg": 1.2, "spotlight": 1, "splitH": 0.8, "noiseField": 0.6, "retroGrid": 0.2, "tvBars": 0.2 }, "cam": { "handheld": 1.5, "driftDiag": 1.2, "tiltUp": 1.2, "whipIn": 0.4 }, "fx": { "filmBurn": 1.2, "lightSweep": 1, "strobe": 0.3, "posterize": 0.3 } }, "decor": { "scribbleUnder": 1.2, "scribbleCircle": 1, "waveLine": 1, "risingParticles": 0.9, "tapePieces": 0.7, "constellation": 0.6, "plusGrid": 0.5, "guides": 0.4 }, "hud": false, "extra": true },
  parts: {  },
});
