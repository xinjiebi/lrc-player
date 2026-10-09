/* ============================================================
   动态风格包（自包含单文件）
   编辑排版 · 报纸版面
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（6 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "newsprint",
  category: "编辑排版",
  name: "报纸版面",
  pack: { "name": "新聞", "desc": "灰色の更紙・墨と赤・見出し明朝・CMYの版ズレと網点", "moods": ["editorial","graphic"], "schemes": [{ "bg": "#E6E5E0", "fg": "#111111", "sub": "#4E4E4C", "accent": "#D8141B", "accent2": "#0A82C8", "ink": "#111111", "dim": "#D8D7D1", "ghostA": "#E4007F", "ghostB": "#00A0E9", "paper": true },{ "bg": "#111111", "fg": "#F2F2EE", "sub": "#A5A5A0", "accent": "#F5D300", "accent2": "#E4007F", "ink": "#F2F2EE", "dim": "#1F1F1F", "ghostA": "#E4007F", "ghostB": "#00A0E9", "paper": true },{ "bg": "#D8141B", "fg": "#FFFFFF", "sub": "#FFD6D0", "accent": "#111111", "accent2": "#F5D300", "ink": "#FFFFFF", "dim": "#C71118", "ghostA": "#111111", "ghostB": "#F5D300", "paper": true }], "fonts": { "display": ["mincho_black","gothic_bold"], "serif": ["mincho_bold","mincho"], "body": ["mincho"], "mono": ["mono"] }, "texture": { "grain": 0.9, "paper": 0.9, "scan": 0 }, "ghost": 0.45, "bias": { "layout": { "justified": 2, "columnsBig": 1.7, "vcols": 1.6, "dropCap": 1.5, "quote": 1.4, "splitScreen": 1.3, "typeSpecimen": 1.2, "genkou": 1.1, "flipBoard": 1.1, "lowerThird": 1, "stack": 1, "bubbles": 0.3, "bounceLine": 0.3, "neon": 0.3 }, "enter": { "type": 1.5, "cursorSweep": 1.4, "riseMask": 1.3, "shutter": 1.3, "stamp": 1.2, "wipe": 1.2, "spin": 0.4, "bounceBig": 0.4 }, "exit": { "sweepCover": 1.6, "sinkMask": 1.3, "wipe": 1.3, "backspace": 1.2, "blindsClose": 1, "spinOut": 0.3, "popOut": 0.4 }, "treat": { "underline": 1.5, "boxed": 1.4, "emphasisDots": 1.4, "halftone": 1.3, "marker": 1.1, "glow": 0.3, "gradientV": 0.3 }, "bg": { "halftoneFade": 1.5, "bigChar": 1.3, "borderFrame": 1.2, "splitH": 1.1, "dotGrid": 0.8, "bokehBg": 0.2, "retroGrid": 0.2 }, "cam": { "panL": 1.3, "panR": 1.3, "stepZoom": 1.1, "roll": 0.3 }, "fx": { "posterize": 1.2, "blackFrame": 1.2, "panelWipe": 1.1, "hueShift": 0.3, "vhsRoll": 0.3 } }, "decor": { "halftonePatch": 1.4, "indexNum": 1.2, "rulerEdge": 1, "verticalStrip": 1, "cropMarks": 0.9, "dateStamp": 0.8, "crossOut": 0.6, "highlightMark": 0.6, "bokeh": 0.1, "confetti": 0.1 }, "hud": false, "extra": true },
  parts: {  },
});
