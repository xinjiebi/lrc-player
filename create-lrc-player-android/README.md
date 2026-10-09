# create-lrc-player-android

动态歌词播放器的 Android 壳 —— 把 [create-lrc-player](https://github.com/xinjiebi/lrc-JIZURA) 的 JS SDK
封装成 **Android Library(AAR)**，宿主 App 一个 View 即可接入。

## 架构

```
宿主 App ── LrcPlayerView(自定义 View)── WebView ──┬─ assets/lrcplayer/  ← JS SDK(离线,1.6MB)
                                                  └─ /audio/<file>      ← 当前歌曲文件(Range 支持)
```

- 资源走 `WebViewAssetLoader`，映射为 `https://appassets.androidplatform.net/...`，不用 file://，无跨域问题
- 音频由壳映射成同域名 URL 交给 `<audio>` 播放，**seek 依赖的 HTTP Range(206)已支持**
- 精简字体模式只依赖在线 Google Fonts；完全离线可另跑 `vendor-fonts.js` 把字体打进 assets(机制自动探测)

## 接入

```groovy
// settings.gradle
include ':lrcplayer'
project(':lrcplayer').projectDir = new File('../create-lrc-player-android/lrcplayer')
// 或直接把 aar 放进 libs:implementation files('libs/lrcplayer-release.aar')
```

```xml
<com.lrcplayer.LrcPlayerView
    android:id="@+id/player"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```

```kotlin
player.load(audioFile, lrcText)                 // File + LRC 文本;可选 style/mood/seed
player.onReady = { duration, seed -> player.play() }
player.onLineChange = { index, text -> /* 通知栏歌词等 */ }
player.onEnded = { /* 下一首 */ }
player.seek(12.5); player.reroll("ocean"); player.pause()
// 销毁时必须:
override fun onDestroy() { player.release(); super.onDestroy() }
```

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

## 构建

```bash
./sync-sdk.sh          # SDK 更新后同步 dist/ → assets(首次已执行)
```

用 Android Studio 打开本目录 → Sync → Run `app`。
出 AAR:`Build > Make Module 'lrcplayer'`,产物在 `lrcplayer/build/outputs/aar/`。

## 模块

| 路径 | 说明 |
|---|---|
| `lrcplayer/` | 发布的 Library:`LrcPlayerView`(View+API)、`PlayerWebViewClient`(assets+音频拦截)、`BoundedInputStream`(Range)、assets 里的 JS SDK 与桥接页 |
| `app/` | Demo 宿主:SAF 选歌 → 播放 |
| `sync-sdk.sh` | dist/ → assets 同步脚本 |

## 权限

库清单已带 `INTERNET`(在线字体用)，随 Library 合并进宿主，无需手动声明。
音频文件在 App 私有目录时**不需要任何存储权限**。
