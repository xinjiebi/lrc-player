/* ============================================================
   动态风格包（自包含单文件）
   流行 · 蒸汽波
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（7 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "vapor",
  category: "流行",
  name: "蒸汽波",
  pack: { "name": "ヴェイパー", "desc": "薄紫とパステルのピンク/水色・明朝・VHSのにじみ", "moods": ["pop","emotional","glitch"], "schemes": [{ "bg": "#3A2A6E", "fg": "#FFFFFF", "sub": "#D6C8FF", "accent": "#FF8FD8", "accent2": "#7DF9FF", "ink": "#7DF9FF", "dim": "#45347C", "ghostA": "#FF71CE", "ghostB": "#01CDFE", "grad": ["#FF8FD8","#7DF9FF"] },{ "bg": "#FFC6EC", "fg": "#3A2A6E", "sub": "#74489A", "accent": "#7A3BFF", "accent2": "#0F9FC8", "ink": "#3A2A6E", "dim": "#F7B8E2", "ghostA": "#2EC8F0", "ghostB": "#B04BFF", "grad": ["#7A3BFF","#0B7FB0"] },{ "bg": "#8FEAF2", "fg": "#35246A", "sub": "#4A3C8A", "accent": "#35246A", "accent2": "#FF4FC0", "ink": "#35246A", "dim": "#82E0EA", "ghostA": "#FF5CC8", "ghostB": "#8A5CFF", "grad": ["#D0249A","#5A2BD0"] },{ "bg": "#1A1030", "fg": "#FFFB96", "sub": "#B9A6E0", "accent": "#05FFA1", "accent2": "#FF71CE", "ink": "#FF71CE", "dim": "#241840", "ghostA": "#FF71CE", "ghostB": "#01CDFE", "grad": ["#FFFB96","#FF71CE"] }], "fonts": { "display": ["mincho","dot","mincho_black"], "serif": ["mincho_light","mincho"], "body": ["sansui"], "mono": ["dot","mono"] }, "texture": { "grain": 0.5, "paper": 0, "scan": 0.55 }, "ghost": 0.95, "bias": { "layout": { "mirror": 1.7, "perspective": 1.5, "sideways": 1.3, "arcTop": 1.3, "filmstrip": 1.2, "wave": 1.2, "center": 1.2, "tile": 1.1, "pill": 1.1, "genkou": 0.3, "justified": 0.4 }, "enter": { "echoIn": 1.6, "zoomOut": 1.3, "flicker": 1.2, "trackOut": 1.2, "blur": 1.2, "stretch": 1.1, "strokeDraw": 0.4 }, "exit": { "echoOut": 1.5, "zoomFar": 1.4, "stretch": 1.2, "melt": 1.2, "blur": 1.1, "burn": 0.4 }, "treat": { "gradientV": 1.6, "echoOutline": 1.4, "italic": 1.4, "wide": 1.3, "glow": 1.1, "emphasisDots": 0.3 }, "bg": { "retroGrid": 1.7, "checker": 1.3, "gradientSweep": 1.3, "scanBars": 1.1, "sunburst": 0.8, "borderFrame": 0.5 }, "cam": { "roll": 1.3, "driftDiag": 1.2, "dutch": 1.1, "pullOut": 1 }, "fx": { "vhsRoll": 1.7, "trackingNoise": 1.5, "hueShift": 1.3, "rgbSplit": 1.2, "smear": 1.1, "blackFrame": 0.5 } }, "decor": { "checkerStrip": 1.3, "twinkle": 1.1, "triangleSpin": 1, "shapes": 0.9, "lightLeak": 0.7, "halftonePatch": 0.6, "orbitDots": 0.5 }, "hud": false, "glow": 1.2, "useGrad": true, "extra": true },
  parts: {  },
});
