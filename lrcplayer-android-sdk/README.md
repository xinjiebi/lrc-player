# lrcplayer-android-sdk

动态歌词播放器的纯 Android SDK —— 把 [create-lrc-player](https://github.com/xinjiebi/lrc-JIZURA) 的 JS SDK
封装成 **Android Library(AAR)**，宿主 App 一个 View 即可接入。

- namespace `com.lrcplayer`,minSdk 24,Java 17
- 本目录本身就是一个独立可构建的 Library 项目，不含任何 demo 代码
- Demo 宿主在仓库根目录的 `create-lrc-player-android/`

## 架构

```
宿主 App ── LrcPlayerView(自定义 View)── WebView ──┬─ assets/lrcplayer/  ← JS SDK(离线,1.6MB)
                                                  └─ /audio/<file>      ← 当前歌曲文件(Range 支持)
```

- 资源走 `WebViewAssetLoader`,映射为 `https://appassets.androidplatform.net/...`,不用 file://,无跨域问题
- 音频由壳映射成同域名 URL 交给 `<audio>` 播放,**seek 依赖的 HTTP Range(206)已支持**
- 精简字体模式只依赖在线 Google Fonts;完全离线可另跑 `vendor-fonts.js` 把字体打进 assets(机制自动探测)

## 引入到项目

两种方式任选其一。

### 方式一:源码模块依赖(推荐,方便改)

1. 把 `lrcplayer-android-sdk/` 整个目录拷到你的项目(如项目根目录)
2. `settings.gradle` 声明模块:

```groovy
include ':lrcplayer'
project(':lrcplayer').projectDir = new File('lrcplayer-android-sdk')   // 按实际路径调整
```

注意:宿主项目根 `build.gradle` 需要已声明对应插件版本(本 SDK 的 `build.gradle` 不带版本号):

```groovy
plugins {
    id 'com.android.library' version '8.5.2' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.24' apply false
}
```

3. app 模块 `build.gradle` 添加依赖:

```groovy
implementation project(':lrcplayer')
```

### 方式二:AAR 二进制依赖(不改源码时用)

1. 在本目录执行 `./gradlew assembleRelease`(或用 Android Studio `Build > Make Module`)
2. 取产物 `build/outputs/aar/` 下的 release AAR,拷到你项目的 `app/libs/`
3. 依赖它:

```groovy
implementation files('libs/lrcplayer-android-sdk-release.aar')
```

## 快速开始

**1. 布局里放 View:**

```xml
<com.lrcplayer.LrcPlayerView
    android:id="@+id/player"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```

**2. 加载并播放**(音频是本地 `File`,歌词是 LRC 文本):

```kotlin
val player = findViewById<LrcPlayerView>(R.id.player)

player.onReady = { duration, seed -> player.play() }   // 就绪后播放
player.load(audioFile, lrcText)                        // 可选 style / mood / seed 参数
```

**3. 销毁时必须释放 WebView:**

```kotlin
override fun onDestroy() {
    player.release()
    super.onDestroy()
}
```

## API 参考

所有回调都在主线程触发。

### 方法

| 方法 | 说明 |
|---|---|
| `load(audio: File, lrcText: String, style: String? = null, mood: String? = null, seed: Long? = null)` | 创建播放器并自动准备;音频为本地文件,`lrcText` 为 LRC 文本内容 |
| `play()` / `pause()` / `toggle()` | 播放 / 暂停 / 切换 |
| `seek(seconds: Double)` | 跳转(秒,支持 Range 精确 seek) |
| `reroll(style: String? = null)` | 换动态风格;传 null 随机 |
| `destroyPlayer()` | 销毁 JS 侧播放器实例(View 仍可用,可再 `load`) |
| `release()` | 释放 WebView,**Activity/Fragment 销毁时必须调用**;调用后 View 不可再用 |

### 事件回调

| 回调 | 参数 | 说明 |
|---|---|---|
| `onCreated` | — | JS 播放器实例已创建 |
| `onReady` | `duration: Double, seed: Long` | 就绪(时长/随机种子),此后可 `play()` |
| `onLineChange` | `index: Int, text: String` | 当前歌词行变化(可做通知栏歌词) |
| `onEnded` | — | 播放完毕(可在此切下一首) |
| `onState` | `playing: Boolean` | 播放状态变化,true = 播放中 |
| `onError` | `message: String` | 出错(含 JS 错误) |
| `onAspect` | `aspect: String` | 画面宽高比变化 |
| `onReroll` | `style: String, mood: String` | 风格已切换 |
| `onTap` | — | 单击封面(行为由宿主决定,如 `player.toggle()`) |
| `onSwipeVertical` | `direction: Int` | 竖向快滑:-1 = 上滑,1 = 下滑(可用于切歌) |

### 风格列表

可用风格 key 来自 SDK 内置的 `lrcplayer/styles/index.json`(assets 内)。读取示例见 demo
`MainActivity.kt` 的 `showStylePicker()`。

## 音频来源

音频来源不限:assets、下载到私有目录、SAF 选择的文件均可,只要能给出 `File` 和 LRC 文本。
assets 里的音频需先拷到 `cacheDir` 再交给播放器(WebView 播放需要 `File`),demo 的
`playSong()` 演示了这一做法。

## 构建与同步

```bash
./sync-sdk.sh              # JS SDK 更新后同步 dist/ → src/main/assets(首次已执行)
./gradlew assembleRelease  # 独立构建 AAR,产物在 build/outputs/aar/
```

`sync-sdk.sh` 从同仓库的 `../create-lrc-player/dist` 同步;JS SDK 重新构建/导出风格后跑一次。

## 模块结构

| 路径 | 说明 |
|---|---|
| `src/main/java/com/lrcplayer/LrcPlayerView.kt` | 自定义 View,对外的全部 API |
| `src/main/java/com/lrcplayer/PlayerWebViewClient.kt` | assets + 音频拦截(WebViewAssetLoader) |
| `src/main/java/com/lrcplayer/BoundedInputStream.kt` | HTTP Range(206)支持 |
| `src/main/assets/lrcplayer/` | JS SDK 与桥接页(由 `sync-sdk.sh` 同步) |

## 权限

库清单已带 `INTERNET`(在线字体用),随 Library 合并进宿主,无需手动声明。
音频文件在 App 私有目录时**不需要任何存储权限**。
