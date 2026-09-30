/* ============================================================
   动态风格包（自包含单文件）
   恐怖 · 恐怖·深夜录像
   上传 / 删除 / 热更新的最小单位就是本文件。
   ============================================================ */

/* 本风格的部分部件来自共享包 common.js（12 个引擎文件），
   应用前请先加载 styles/common.js（清单 index.json 中本条目带 "common": true）。 */
LrcPlayer.registerStyle({
  key: "hrNightRec",
  category: "恐怖",
  name: "恐怖·深夜录像",
  pack: { "name": "深夜の録画", "desc": "真っ黒な画面・監視映像の白と赤・砂嵐", "moods": ["horror"], "set": "horror", "schemes": [{ "bg": "#050505", "fg": "#EDEDED", "sub": "#8A8A8A", "accent": "#E3261E", "accent2": "#FFFFFF", "ink": "#EDEDED", "dim": "#121212", "ghostA": "#6E6E6E", "ghostB": "#E3261E" },{ "bg": "#0B0E0B", "fg": "#D8F0D8", "sub": "#6F866F", "accent": "#FF3A2A", "accent2": "#D8F0D8", "ink": "#D8F0D8", "dim": "#141A14", "ghostA": "#3E6B3E", "ghostB": "#FF3A2A" },{ "bg": "#DADADA", "fg": "#0A0A0A", "sub": "#4A4A4A", "accent": "#C8140E", "accent2": "#0A0A0A", "ink": "#0A0A0A", "dim": "#CCCCCC", "ghostA": "#8A8A8A", "ghostB": "#C8140E" }], "fonts": { "display": ["gothic_bold","gothic_black"], "serif": ["mincho"], "body": ["gothic_med"], "mono": ["mono","dot"] }, "texture": { "grain": 1.2, "paper": 0, "scan": 0.7 }, "ghost": 0.8, "bias": { "layout": { "hrFlashlight": 1.6, "hrDoorGap": 1.3, "hrWallScrawl": 1.2, "hrCctv": 2.2, "hrOuija": 0.9, "hrMissing": 1, "hrWrongOne": 1.5, "hrRisingDark": 1.3, "hrRedacted": 1.3, "hrStaticTv": 1.6, "hrSpiritPhoto": 1, "hrWrongShadow": 1.3, "center": 1.1, "vcols": 1.2, "pop": 0.3, "type": 1.2 }, "enter": { "hrBlinkCreep": 1.3, "hrJumpScare": 0.9, "hrUneasy": 1.6, "hrVhold": 1.8, "hrMirrorSnap": 1, "hrManifest": 1.6, "hrClawReveal": 1, "blur": 1.2, "flicker": 1.2, "pop": 0.2, "bounceBig": 0.1, "bubbles": 0.1, "glitchIn": 1 }, "exit": { "hrPulledDown": 1.4, "hrLookBack": 1.3, "hrTurnAway": 1.2, "hrShiver": 1.2, "hrSwallow": 1.3, "hrFlickerDie": 1.8, "hrDrain": 1.2, "blur": 1.1, "popOut": 0.1, "balloonOff": 0.1, "glitch": 1 }, "treat": { "hrDoubleExp": 1.4, "hrRedact": 1.2, "glitchSplit": 1, "rainbow": 0.1 }, "bg": { "hrFailingLamp": 1.4, "hrCorridor": 1.6, "vhsBand": 1.4, "noiseField": 1, "polka": 0.1 }, "cam": { "hrNervous": 1.8, "hrDutchSnap": 1, "handheld": 1.2, "jelly": 0.1 }, "fx": { "hrSignalLoss": 1.6, "hrSubliminal": 1.3, "hrPassingShadow": 1, "tvStatic": 1.4, "trackingNoise": 1.2, "vhsRoll": 1.2, "starGlint": 0.1 } }, "decor": { "hrStaticPatch": 1.6, "hrWatchEye": 1, "hrCracks": 0.8, "hrScratches": 0.8, "timecodeBar": 1, "hud": 1, "confetti": 0.05 }, "hud": true, "glow": 0.5, "glitchBoost": 1.2 },
  parts: {  },
});
