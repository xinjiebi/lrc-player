/* ============================================================
   动态风格包（自包含单文件）
   静谧 · 墨与朱
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（7 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "sumi",
  category: "静谧",
  name: "墨与朱",
  pack: { "name": "墨と朱", "desc": "和紙の生成り・墨の筆文字・朱の落款", "moods": ["calm","emotional","editorial"], "schemes": [{ "bg": "#EFE5CF", "fg": "#16130F", "sub": "#5E574C", "accent": "#B83A22", "accent2": "#16130F", "ink": "#16130F", "dim": "#E3D8BF", "ghostA": "#9A9284", "ghostB": "#CC4A2E", "paper": true },{ "bg": "#121110", "fg": "#EFE8D8", "sub": "#9A9286", "accent": "#D9402A", "accent2": "#EFE8D8", "ink": "#EFE8D8", "dim": "#1E1C1A", "ghostA": "#5C5750", "ghostB": "#D9402A", "paper": true },{ "bg": "#B3301D", "fg": "#FFF6E8", "sub": "#FFD2C0", "accent": "#16130F", "accent2": "#FFF6E8", "ink": "#FFF6E8", "dim": "#A42B1A", "ghostA": "#16130F", "ghostB": "#E8A070", "paper": true },{ "bg": "#BAB4A7", "fg": "#16130F", "sub": "#3E3A33", "accent": "#A82A18", "accent2": "#16130F", "ink": "#16130F", "dim": "#AFA99C", "ghostA": "#6E685E", "ghostB": "#B8321E", "paper": true }], "fonts": { "display": ["brush","mincho_black"], "serif": ["brush","shippori"], "body": ["klee"], "mono": ["mono"] }, "texture": { "grain": 0.6, "paper": 0.8, "scan": 0 }, "ghost": 0.35, "bias": { "layout": { "hanko": 2, "vcols": 1.8, "kanjiFocus": 1.6, "columnsBig": 1.4, "halfVertical": 1.2, "genkou": 1.1, "center": 1.2, "huge": 1.1, "mirror": 0.8, "stickerBomb": 0.2, "keycaps": 0.2, "bubbles": 0.2, "neon": 0.2, "equalizer": 0.3 }, "enter": { "inkBleed": 2, "strokeDraw": 1.6, "unroll": 1.3, "blur": 1.2, "fadeStagger": 1.2, "stamp": 1, "bounceBig": 0.2, "rubber": 0.2, "neonOn": 0.2 }, "exit": { "dissolve": 1.5, "drift": 1.4, "undraw": 1.3, "burn": 1.1, "blurOutStagger": 1.2, "popOut": 0.2, "spinOut": 0.2 }, "treat": { "emphasisDots": 1.3, "softShadow": 1.1, "tall": 1.1, "glow": 0.2, "extrude": 0.3, "alternate": 0.3 }, "bg": { "bigChar": 1.5, "spotlight": 0.9, "splitH": 0.9, "ripples": 0.8, "retroGrid": 0.1, "polka": 0.1, "eqBars": 0.1, "tvBars": 0.1 }, "cam": { "handheld": 1.3, "tiltUp": 1.2, "dollyIn": 1.2, "bounce": 0.3, "beatPunch": 0.4 }, "fx": { "blackFrame": 1.2, "filmBurn": 1.1, "whiteFrame": 1, "hueShift": 0.2, "posterize": 0.3 } }, "decor": { "brushStroke": 1.8, "seal": 1.6, "watermarkKanji": 1.2, "verticalStrip": 1, "blobs": 0.9, "petals": 0.4, "confetti": 0.1, "heartsStars": 0.1, "glitchRects": 0.1 }, "hud": false, "glow": 0.4, "extra": true, "wa": true },
  parts: {  },
});
