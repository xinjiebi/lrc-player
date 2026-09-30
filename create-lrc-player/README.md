# create-lrc-player

本地实时渲染的动态歌词播放器 SDK —— 从 [lrc-JIZURA](https://github.com/xinjiebi/lrc-JIZURA) 引擎裁剪而来。
**无服务器、无 MP4 生成、不上传任何文件**：音频和歌词全程留在用户设备上，画面由 Canvas 逐帧实时渲染。
**完全自包含**：引擎源码已 vendor 进本仓库（`vendor/jizura-src/`），构建不依赖 `../JIZURA` 仓库和网络。

- 传 `MP3(等音频) + LRC` → 立即得到 860 种排版手法 × 27 套风格随机组合的动态歌词播放
- **横竖屏切换 = 同种子毫秒级重排**（不是缩放），风格保持一致
- 纯浏览器技术（Canvas + Web Audio），Web / Android WebView / iOS WKWebView 三端共用一套代码

## 快速开始

```bash
python3 build.py     # 用 vendor/jizura-src/ 构建 dist/lrc-player.js（无需克隆 JIZURA 仓库）
python3 -m http.server 8080   # 在「项目根目录」启动（注意不是 demo 目录）
```

然后浏览器打开 **http://127.0.0.1:8080/demo/**（演示页以相对路径 `../dist/lrc-player.js` 引用 SDK，
必须从项目根目录起服务）。页面里选择 MP3 + LRC → 创建播放器 → 点击播放。
演示页含「两级风格选择面板（分组 · 风格色板，支持动态风格库）/ 切换竖屏 / 全屏」。

## 生命周期（重要）

**一首歌 = 一个 `LrcPlayer` 实例**，标准流程就是"上传成功自动创建"：

```
用户选择/导入歌曲（音频 + LRC）
   └─► 自动: LrcPlayer.create(container, {audio, lrc})   ← 无需用户手动触发
          ├─ loading 事件: audio → plan → fonts（可显示进度）
          └─ ready 事件 → 播放器就绪（<1 秒），展示播放按钮
用户点击播放（平台要求必须有手势才能出声）
   └─► 动态歌词实时渲染，横竖屏切换自动重排
切歌 = player.destroy() 旧实例 + create() 新实例（同一容器复用，<1 秒）
```

不要复用实例去"换歌"——`create` 足够快，销毁重建是最干净的方式；
同一个页面可以同时存在多个实例（不同容器），但同时播放的建议不超过 2~3 个。

## 在项目中使用

```html
<script src="dist/lrc-player.js"></script>
<div id="stage" style="width:100%;aspect-ratio:16/9"></div>
<script>
const player = await LrcPlayer.create('#stage', {
  audio: fileInput.files[0],   // File | Blob | URL
  lrc:   lrcText,              // LRC 文本（[mm:ss.xx] 时间轴驱动镜头切换）
  // 可选项：
  autoAspect: true,            // 跟随容器尺寸自动横竖屏重排（默认 true）
  omakase: true,               // 随机 roll 一套完整风格（默认 true）
  seed: 12345,                 // 固定随机种子（默认每次随机）
  mood: 'pop',                 // 限定心情：glitch|calm|pop|graphic|editorial|emotional|horror|chaos
  style: 'noir',               // 或限定风格包（需已内置/已下载该风格）
  onLineChange: i => console.log('当前句', i.index, i.text),
  onAspect: a => console.log('画面比切换', a.aspect),
  onError: e => console.error(e.message),
});
player.play(); player.pause(); player.seek(12.5); player.setVolume(0.8);
player.reroll();               // 换一套随机风格
player.destroy();              // 释放资源
</script>
```

事件：`ready {duration,bpm,seed,timings}` · `loading {stage}`（audio→plan→fonts 进度）· `bpm {bpm}`（后台检测完成）· `play` · `pause` · `ended` · `linechange {index,text,t}` · `aspect {aspect}` · `reroll` · `error {message}`

## 初始化性能（实测 180 秒 MP3）

| 阶段 | 耗时 | 说明 |
|---|---|---|
| 读取音频信息 | ~16ms | 只读 `<audio>` 元数据，**不整段解码** |
| 规划镜头 | ~24ms | 同种子确定性随机，毫秒级 |
| 加载字体 | 首次几秒 / 之后 ~30ms | 在线 Google Fonts（精简模式只有 2 个请求），浏览器缓存后近似免费 |
| **点击 → ready** | **< 1 秒** | BPM 检测（解码前 8MB 做自相关）在后台异步完成，不阻塞播放 |

设计要点：JIZURA 规划器只用音频**时长**（节拍网格仅在用户手动设 BPM 时启用），
所以自动 BPM 检测被移到后台线程路径，创建播放器不再需要"解码整首歌+全曲逐样本分析"。

## 字体方案（精简模式：1 中 + 1 英，在线加载）

SDK 默认走**精简字体模式**：所有风格、所有语言的歌词，只加载两套在线字体——

| 用途 | 字体 | 规格 |
|---|---|---|
| 中文 / 全部显示·正文角色 | Noto Sans SC | 300/500/700/900 + 变量体 100..900 |
| 英文数字 / 等宽（HUD) | IBM Plex Mono | 500/600 |

- 实现在 `sdk/player.js` 的「精简字体模式」段：运行时把引擎字体目录和语言映射全部重定向到这两套，
  引擎本身的懒加载机制不变（用到才发请求，unicode-range 只下载需要的分片）
- **代价**：字体个性消失（明朝/圆体/毛笔/像素体都渲染成黑体），版式与动画不受影响；
  恢复完整字体：删除该段即可回到引擎默认的 20+ 字体族行为
- 需要**完整离线**（不依赖任何网络）时：跑 `node tools/vendor-fonts.js` 下载全部字体规格到
  `dist/fonts/`（约 110MB，日/繁/简/韩 42 个规格），构建时会自动注入本地优先映射，
  部署带上 `dist/fonts/` 即离线；精简模式下该目录不是必需的

## 体积与性能

- `dist/lrc-player.js` **约 270KB**（未压缩；B 方案：只含 860 个排版部件 + 1 套保底风格，
  27 套内置风格全部外置为 `dist/styles/*.js` 按需下载）
- `dist/styles/` 共约 1.3MB = 27 个风格文件（合计 ~270KB，单文件 1~218KB）+
  共享部件包 `common.js`（~1MB，14 个共用引擎部件文件只存一份，随 styles/ 一起部署）
- 播放内存占用低：BPM 分析完即释放解码缓存，播放走 `<audio>` 元素，1 小时的歌曲也只占几 MB
- 低端机自动降载：帧绘制超时自动切换 fast 模式（关模糊/滤镜）

## 风格与换风格（reroll）

风格 = JIZURA 引擎的 **27 套风格包** × **8 种心情**（MOODS）的随机组合，和网页编辑器、AE 导出是同一套引擎，没有单独的「AE 风格」。

```js
player.reroll();                          // 完全随机换一套（约 10ms 重排）
player.reroll({ style: 'mono' });         // 限定风格包，其余随机
player.reroll({ mood: 'calm' });          // 限定心情
player.reroll({ mood: 'calm', style: 'mono' });
LrcPlayer.styleList();  // 已加载的风格包列表 [{key,name,jp,bg,fg,accent,accent2}]（未下载的动态风格不在其中）
LrcPlayer.moodList();   // 8 种心情 [{key,name}]
LrcPlayer.STYLE_CN / LrcPlayer.MOOD_CN   // 中文名映射
```

> 保底机制：基础包只内置 **noir** 一套风格（另注册一个隐藏的 `noir2` 别名副本供
> omakase 随机抽取——它会避开当前风格，只有一套时会抽到空池崩溃）。未下载任何
> 风格文件时播放器也能出画面；下载风格文件后自动扩充随机池。

注意：`J.omakase()` 返回新配置而不直接改 project（与编辑器相同），SDK 内部已处理（`_rollLook` 用 `Object.assign` 应用）。
`reroll` 事件带回 `{seed, mood, style}`。

### 动态风格库（一个风格 = 一个文件）

风格可以**运行时上下架**，不用重新打包 SDK。每个风格是一个自包含 JS 文件，
上传/删除/热更新的最小单位就是这个文件：

```js
// styles/superSuck.js —— 上传到服务器的全部内容
LrcPlayer.registerStyle({
  key: 'superSuck',          // 全局唯一 id
  category: '电子',           // 两级选择器的第一级（分组）
  name: '超级吸入',           // 组内显示名
  pack: { schemes, fonts, texture, bias },   // 引擎风格包定义（见上）
  parts: { enter: { myFx: { name, tags, apply } } },  // 可选：自带新部件
});
```

SDK API：

| API | 作用 |
|---|---|
| `LrcPlayer.registerStyle(def)` | 注册动态风格（重复注册同 key = 覆盖更新） |
| `LrcPlayer.loadStyle(url)` | 下载风格文件并注入注册 |
| `LrcPlayer.styleLibrary()` | 两级风格库 `[{category, styles:[…]}]`（内置+动态，选择器直接用） |
| `LrcPlayer.removeStyle(key)` | 从库移除（连同它注册的部件；内置风格不可删） |

服务端约定（参考 `demo/styles/`）：

```
styles/
  index.json     ← 风格清单：[{key, file, category, name}]，上传/删除时更新
  superSuck.js   ← 一个文件 = 一种风格
```

客户端打开选择器时拉 `index.json`，按需 `loadStyle` 下载风格文件（HTTP 缓存）。
上传 = 放一个文件 + 改清单；删除 = 删文件 + 删清单行。

**27 套内置风格已按同样方式外置**（B 方案，基础包因此从 ~2MB 瘦身到 ~270KB）：

```bash
node tools/export-all-styles.js     # 把引擎内置的 27 套风格全部导出到 dist/styles/ + 生成 index.json
```

- 每个内置风格 = 一个自包含文件，和它引用的引擎扩展部件（整文件内嵌，闭包安全）打在一起
- **共享部件包 `common.js`（约 1MB）**：被 ≥2 个风格共用的 14 个引擎部件文件只存一份，
  首次选用富风格时先下载它（之后所有风格共用缓存）；清单里依赖它的条目带 `"common": true`，
  客户端按标记预加载。**部署 styles/ 时必须带上 common.js**
- 去重机制：任意多个文件内嵌同一引擎文件时，运行时按文件名去重（`__lrcStyleFiles` 防重复执行）
- 瘦身效果：27 个风格文件合计 ~270KB（原本 9.4MB）+ common.js ~1MB
- 清单 `index.json` 里带色板元数据（bg/fg/accent/accent2），选择器**下载前就能渲染色板**
- 演示页同时合并 `dist/styles/index.json`（内置）和 `demo/styles/index.json`（自定义），
  两个目录的风格在同一个面板里出现
- 设计师用 `tools/pack-style.js` 打的新风格**仍是完全自包含单文件**（默认不依赖 common.js），
  上传/删除照旧"一个文件 + 一行清单"

**打包工具**（把风格源文件打成完全自包含的单文件，自动整包内嵌 bias 点名的引擎部件文件）：

```bash
node tools/pack-style.js styles-src/myStyle.js     # -> dist/styles/myStyle.js
```

风格源文件格式见 `styles-src/pulseSuck.js`（色板 + bias 选词 + 可选自带部件）；
bias 关键词对照表：`docs/parts-reference.html`（860 个部件中英双语）。

## App 集成（Android / iOS）

SDK 是 JS + Canvas + Web Audio，App 端通过 Web 容器承载：

| 平台 | 容器 | 关键配置 |
|---|---|---|
| Android | `WebView` | `mediaPlaybackRequiresUserAction = false`（允许代码触发播放） |
| iOS | `WKWebView` | `allowsInlineMediaPlayback = true`（内联播放，不强制全屏） |
| RN / Flutter | `react-native-webview` / `webview_flutter` | 同上对应参数 |

原生侧把音频文件（路径/URI）和 LRC 文本传给 JS 即可；离线场景把字体 woff2 打包进 App（引擎支持自定义字体）。

## 目录

| 路径 | 说明 |
|---|---|
| `build.py` | 构建脚本：拼接 `vendor/jizura-src/`（去掉导出/UI/全部内置风格文件）+ `sdk/core-styles-shim.js`（保底风格）+ `sdk/player.js` → `dist/lrc-player.js`；检测到 `dist/fonts/manifest.json` 时注入离线字体映射。`JIZURA_SRC` 环境变量可指向上游仓库 |
| `vendor/jizura-src/` | JIZURA 引擎源码本地副本（自包含；从上游同步后覆盖即可） |
| `sdk/player.js` | `LrcPlayer` 封装：生命周期、自适应重排、帧循环、事件、动态风格库 API、离线字体基路径 |
| `sdk/core-styles-shim.js` | 保底风格 noir（+ 隐藏别名 noir2）与风格解析函数，保证基础包独立可用 |
| `tools/lib-stylepack.js` | 风格打包共享库：Node 装载引擎、收集依赖文件、生成自包含单文件 |
| `tools/pack-style.js` | 单个风格源文件 → 自包含风格文件 |
| `tools/export-all-styles.js` | 批量把引擎内置 27 套风格导出到 `dist/styles/` + 清单 |
| `tools/vendor-fonts.js` | 离线字体打包：下载全部字体规格到 `dist/fonts/`（只需联网跑一次） |
| `styles-src/` | 风格源文件示例（给设计师/新增风格用） |
| `docs/parts-reference.html` | 860 个排版部件中英双语对照表（bias 选词参考） |
| `demo/index.html` | 演示页（文件选择 + 播放 + 两级风格面板 + 竖屏切换 + 全屏） |
| `dist/` | 部署产物：`lrc-player.js`（基础包 270KB）+ `styles/`（27 个风格 + 共享包 common.js + 清单，共 1.3MB）。`fonts/` 为可选离线字体包（精简模式不需要） |

## 与 lrc-JIZURA 的关系

JIZURA 是完整的「编辑器」（改歌词、调时间轴、导出 MP4）；
本 SDK 只保留它的**规划器 + 渲染器**，包装成不可编辑的播放器。
JIZURA 上游更新后：用上游 `src/` 覆盖 `vendor/jizura-src/`，再执行 `python3 build.py`
+ `node tools/export-all-styles.js` 即完成同步升级（`JIZURA_SRC` 环境变量可直接指向上游目录，无需复制）。

## 许可证

MIT（与 JIZURA 相同）。输出物权利归使用者；歌曲与歌词权利归原权利人。
