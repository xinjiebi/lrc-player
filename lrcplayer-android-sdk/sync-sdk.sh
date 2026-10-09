#!/bin/sh
# 把 SDK 仓库的构建产物 dist/ 同步进 Android 壳的 assets
# 每次 create-lrc-player 重新构建/导出风格后跑一次
SRC="$(dirname "$0")/../create-lrc-player/dist"
DST="$(dirname "$0")/src/main/assets/lrcplayer"
if [ ! -d "$SRC" ]; then
  echo "找不到 SDK 产物目录: $SRC（先在 create-lrc-player 里跑 python3 build.py）" >&2
  exit 1
fi
mkdir -p "$DST"
# --delete 会清掉 dist 里不存在的文件,桥接页 index.html 是 Android 侧专属,必须排除
rsync -a --delete --exclude 'fonts/' --exclude 'index.html' "$SRC/" "$DST/"
echo "✅ 已同步 $SRC -> $DST"
du -sh "$DST"
