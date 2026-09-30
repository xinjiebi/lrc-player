#!/usr/bin/env python3
"""create-lrc-player 构建脚本
把 ../JIZURA/src 的引擎模块（去掉编辑器 12_ui.js、导出 11_export.js、
风格定义 04_styles.js / 11p_styles.js / 11p_horror3.js / 11q_sets.js、
以及全部 11p_* 部件库 —— 这些已全部外置为可按需加载的单文件）
与 sdk/core-styles-shim.js（保底风格 noir）+ sdk/player.js 拼接成基础包: dist/lrc-player.js
用法: python3 build.py
"""
import glob, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
# 引擎源码默认用本地 vendor 副本（自包含，不依赖 ../JIZURA 仓库）；也可用 JIZURA_SRC 环境变量指向上游
SRC = os.environ.get('JIZURA_SRC', os.path.join(ROOT, 'vendor', 'jizura-src'))
# 导出 / 编辑器 UI / 风格定义与部件库 —— 播放器基础包不需要（风格 = 单文件，按需加载）
EXCLUDE = {'11_export.js', '12_ui.js', '04_styles.js', '11q_sets.js'} | \
          {f'11p_{n}.js' for n in '''layoutsA layoutsB layoutsC layoutsD decor decorB enter enterB exit exitB
          bgcamB fxB looks treattrans kinetic1 kinetic2 kinetic3 typo1 typo2 typo3
          horror1 horror2 horror3 styles'''.split()}

files = [f for f in sorted(glob.glob(os.path.join(SRC, '*.js')))
         if os.path.basename(f) not in EXCLUDE]
if len(files) < 10:
    sys.exit(f'JIZURA 源模块数量异常 ({len(files)}), 检查 JIZURA_SRC={SRC}')

parts = [open(f, encoding='utf-8').read() for f in files]
parts.append(open(os.path.join(ROOT, 'sdk', 'core-styles-shim.js'), encoding='utf-8').read())
parts.append(open(os.path.join(ROOT, 'sdk', 'player.js'), encoding='utf-8').read())

out_dir = os.path.join(ROOT, 'dist')
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, 'lrc-player.js')
header = ('/* ============================================================\n'
          '   create-lrc-player — 动态歌词渲染 SDK\n'
          '   由 build.py 生成, 请勿手改。基于 lrc-JIZURA (MIT) 裁剪。\n'
          '   ============================================================ */\n')
# 离线字体：若已运行 tools/vendor-fonts.js 生成 dist/fonts/manifest.json，
# 注入「规格 → 本地 CSS」映射，运行时优先本地字体（见 vendor/jizura-src/02_fonts.js attachFamily）
font_manifest = os.path.join(out_dir, 'fonts', 'manifest.json')
if os.path.exists(font_manifest):
    with open(font_manifest, encoding='utf-8') as f:
        parts.append(';J.LOCAL_FONT_CSS = ' + f.read().strip() + ';\n')

with open(out, 'w', encoding='utf-8') as f:
    f.write(header + '\n;\n'.join(parts))

size = os.path.getsize(out)
print(f'{len(files)} 个引擎模块 + 保底风格 + player.js -> dist/lrc-player.js ({size/1024:.0f} KB)')
print('提示: 27 套内置风格已外置，用 node tools/export-all-styles.js 生成 styles/ 单文件')
