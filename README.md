# create-lrc

本地实时渲染的动态歌词播放器 —— 从 [lrc-JIZURA](https://github.com/xinjiebi/lrc-JIZURA) 引擎裁剪而来。
传入 `音频 + LRC 歌词` 即可得到 860 种排版手法 × 27 套风格随机组合的动态歌词播放画面,
纯浏览器技术(Canvas + Web Audio),Web 与 Android 共用一套 JS 引擎。

## 仓库结构

```
create-lrc/
├── create-lrc-player/           # JS SDK 源仓库:引擎、构建脚本、Web 演示页
├── lrcplayer-android-sdk/       # 纯 Android SDK:把 JS SDK 封装成 AAR 的 WebView 壳
└── create-lrc-player-android/   # Android Demo 宿主:演示 SDK 接入的完整 App
```

三者的关系:

```
create-lrc-player (python3 build.py)
        │  构建产物 dist/
        ▼  lrcplayer-android-sdk/sync-sdk.sh 同步
lrcplayer-android-sdk (JS SDK 打进 assets,封装 LrcPlayerView)
        │  源码模块依赖 / AAR
        ▼
create-lrc-player-android (Demo App:选歌、播放、切风格)
```

## create-lrc-player/ —— JS SDK(Web 端 + 引擎源头)

所有端的渲染能力都来自这里。Android SDK 只是它的 WebView 封装。

```bash
cd create-lrc-player
python3 build.py                # 构建 dist/lrc-player.js(引擎源码已 vendor,无需联网)
python3 -m http.server 8080     # 在项目根目录起服务
# 浏览器打开 http://127.0.0.1:8080/demo/ → 选 MP3 + LRC → 播放
```

- 产物:`dist/lrc-player.js`(基础包 ~270KB)+ `dist/styles/`(27 套风格按需加载,共 ~1.3MB)
- 还能:导出全部风格(`node tools/export-all-styles.js`)、打包新风格(`node tools/pack-style.js`)、
  离线字体(`node tools/vendor-fonts.js`)
- **详细文档:[create-lrc-player/README.md](create-lrc-player/README.md)** —— 生命周期、API、
  风格系统、动态风格库、性能数据、目录说明都在里面

## lrcplayer-android-sdk/ —— 纯 Android SDK(AAR)

把上面的 JS SDK 打进 assets,用 WebView 封装成 `LrcPlayerView`,宿主 App 一个 View 接入。
独立可构建,不含 demo 代码。

```bash
cd lrcplayer-android-sdk
./sync-sdk.sh              # JS SDK 更新后同步 ../create-lrc-player/dist → src/main/assets
./gradlew assembleRelease  # 出 AAR,产物在 build/outputs/aar/
```

引入到其他 Android 项目(两种方式,任选):

```groovy
// 方式一:源码模块依赖 —— settings.gradle
include ':lrcplayer'
project(':lrcplayer').projectDir = new File('lrcplayer-android-sdk')
// app 模块:implementation project(':lrcplayer')

// 方式二:AAR —— app/libs/ 放 AAR 后
implementation files('libs/lrcplayer-android-sdk-release.aar')
```

```kotlin
player.load(audioFile, lrcText)          // File + LRC 文本
player.onReady = { _, _ -> player.play() }
override fun onDestroy() { player.release(); super.onDestroy() }
```

- **详细文档:[lrcplayer-android-sdk/README.md](lrcplayer-android-sdk/README.md)** —— 引入步骤、
  完整 API 参考、事件回调、权限说明

## create-lrc-player-android/ —— Android Demo

演示 SDK 用法的完整 App:选歌、点封面播放/暂停、上下滑切歌、27 套风格切换。

```bash
# 用 Android Studio 打开 create-lrc-player-android/ → Sync → Run 'app'
```

⚠️ **歌曲因版权原因不随仓库分发**。打包前自行放入:

```
create-lrc-player-android/app/src/main/assets/songs/
├── 歌名-歌手.mp3      # mp3 / aac / m4a / flac / ogg / wav
└── 歌名-歌手.lrc      # 同名 .lrc,与音频一一配对
```

不放歌也能打包安装,App 内点「选歌」会弹出引导面板。

- **详细文档:[create-lrc-player-android/README.md](create-lrc-player-android/README.md)**

## 常见工作流

**JS 引擎/风格更新后,同步到 Android:**

```bash
cd create-lrc-player && python3 build.py        # 1. 重新构建 JS SDK
cd ../lrcplayer-android-sdk && ./sync-sdk.sh    # 2. 同步进 Android SDK 的 assets
# 3. Android Studio 重新构建 demo 或 AAR
```

**新增一套风格:**

```bash
cd create-lrc-player
node tools/pack-style.js styles-src/myStyle.js   # 打成单文件风格 → dist/styles/
cd ../lrcplayer-android-sdk && ./sync-sdk.sh     # 同步到 Android
```

## 许可证

MIT(与 JIZURA 相同)。输出物权利归使用者;歌曲与歌词权利归原权利人 —— 因此本仓库不分发任何歌曲文件。
