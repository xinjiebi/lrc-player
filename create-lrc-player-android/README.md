# create-lrc-player-android

动态歌词播放器的 Android **Demo 宿主** —— 演示如何接入 `lrcplayer-android-sdk`。

- SDK 在仓库根目录的 [`lrcplayer-android-sdk/`](../lrcplayer-android-sdk)(纯 Android Library,
  接入方式与 API 文档见该目录的 README)
- 本目录通过 `settings.gradle` 以源码模块方式引入 SDK(`:lrcplayer` 指到 `../lrcplayer-android-sdk`)

## 运行

用 Android Studio 打开本目录 → Sync → Run `app`。

打包前记得先放歌曲,见下文「歌曲资源」。

## 演示内容

`app/src/main/java/com/lrcplayer/demo/MainActivity.kt` 覆盖了 SDK 的典型用法:

- 从 `assets/songs/` 扫描音频并与同名 `.lrc` 配对
- 「选歌」AlertDialog 列表选歌 → 拷到 `cacheDir` → `player.load()` 播放
- 点封面播放/暂停(`onTap` + `toggle()`),上/下滑切歌(`onSwipeVertical`)
- 「风格」列表切换动态风格(`reroll(style)`)
- 无内置歌曲时弹出引导面板

## 歌曲资源

歌曲因版权原因**不随仓库分发**,`app/src/main/assets/songs/` 已加入 `.gitignore`。

打包 Demo 前,请自行把歌曲放入该目录:

```
app/src/main/assets/songs/
├── 歌名-歌手.mp3      # 音频:mp3 / aac / m4a / flac / ogg / wav
└── 歌名-歌手.lrc      # 同名 .lrc 歌词(与音频一一配对)
```

- 音频与同目录下**同名** `.lrc` 自动配对,缺少歌词的文件不会出现在选歌列表
- 该目录为空时打包也能正常安装,只是 App 内点「选歌」会弹出提示面板,引导先放歌再重新打包
