/* ============================================================
   create-lrc-player — LrcPlayer
   lrc-JIZURA 引擎的播放器封装：本地实时渲染动态歌词，无服务器。
     const player = await LrcPlayer.create(container, {
       audio: File|Blob|URL,        // 必填
       lrc:   '[00:00.00]…',        // 必填，LRC 文本
       autoAspect: true,            // 跟随容器尺寸自动重排（横竖屏切换）
       omakase: true,               // 随机 roll 一套风格
       seed: 12345,                 // 固定随机种子（默认随机）
       mood: 'pop',                 // 限定心情: glitch|calm|pop|graphic|editorial|emotional|horror|chaos
       style: 'noir',               // 限定风格包（与 mood 二选一-ish）
       lang: 'auto',                // 歌词语言
       onReady/onPlay/onPause/onEnded/onLineChange/onAspect/onError
     });
     player.play(); player.pause(); player.seek(t); player.setVolume(v);
     player.reroll();              // 换一套随机风格
     player.destroy();
   ============================================================ */
(() => {
'use strict';

/* 离线字体基路径：按 SDK 脚本自身位置推导 dist/fonts/（与 lrc-player.js 同目录）。
   若 dist/fonts/ 已随 SDK 部署，引擎会用本地字体；缺失时自动回退线上 CDN。
   自行打包（webpack 等）导致 currentScript 不可用时保持 undefined = 回退 CDN。 */
try {
  const me = (typeof document !== 'undefined') && document.currentScript;
  if (me && me.src && /lrc-player\.js/.test(me.src)) J.FONT_BASE = new URL('fonts/', me.src).href;
} catch (e) {}

/* ---- 精简字体模式：只加载 1 中 + 1 英 两套在线字体 ----
   中文(含各风格全部显示/正文/明朝体角色) → Noto Sans SC；英文数字等宽 → IBM Plex Mono。
   代价：字体个性消失(明朝/圆体/毛笔体等都变成黑体)，版式与动画不受影响。
   注意：J.FONTS 条目的 family 必须带引号（fontCSS 直接用）；
   J.LANG_FACES 条目的 family 必须不带引字（faceOf 会自己包引号，重复包会让 canvas 字体串非法）。
   如需恢复完整字体个性：删除本段；如需完整离线：再跑 tools/vendor-fonts.js。 */
(() => {
  const CJK_SPEC = 'Noto+Sans+SC:wght@300;500;700;900';
  const MONO_SPEC = 'IBM+Plex+Mono:wght@500;600';
  const CJK_FB = '"Noto Sans SC","Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif';
  const cjkFace = (w, quoted) => ({ family: quoted ? '"Noto Sans SC"' : 'Noto Sans SC', weight: w, fb: CJK_FB, gf: CJK_SPEC, label: 'Noto Sans SC', name: 'Noto Sans SC' });
  const monoFace = (w, quoted) => ({ family: quoted ? '"IBM Plex Mono"' : 'IBM Plex Mono', weight: w, fb: CJK_FB, gf: MONO_SPEC, label: 'IBM Plex Mono', name: 'IBM Plex Mono' });
  for (const k of Object.keys(J.FONTS)) {
    const f = J.FONTS[k];
    Object.assign(f, f.kind === 'mono' ? monoFace(f.weight, true) : cjkFace(f.weight, true));
  }
  // 语言专属字体（繁中/简中/韩的替代表达）也统一到这两套（family 不带引号！）
  for (const lang of Object.keys(J.LANG_FACES || {})) {
    const L = J.LANG_FACES[lang];
    L.sans = cjkFace(500, false); L.serif = cjkFace(500, false);
    L.fbSans = CJK_FB; L.fbSerif = CJK_FB;
    for (const k of Object.keys(L.map || {})) {
      const m = L.map[k];
      L.map[k] = (m && /mono/i.test(k)) ? monoFace(m.weight || 500, false) : cjkFace((m && m.weight) || 500, false);
    }
  }
})();

const ASPECTS = ['16:9', '9:16', '4:3', '3:4', '1:1', '4:5', '21:9'];
const MOODS = ['glitch', 'calm', 'pop', 'graphic', 'editorial', 'emotional', 'horror', 'chaos'];
const STYLE_CN = { noir: '黑白色差', crimson: '深红信号', caution: '警戒黄', magenta: '流行洋红', paper: '纸墨质感',
  hud: '暗色HUD', mint: '薄荷终端', specimen: '样本注解', transit: '交通标识', blueprint: '蓝图纸', rouge: '胭脂渐变', mono: '单色RGB',
  sakura: '夜樱', ocean: '深海', sunset: '晚霞渐变', forest: '森之手帖', vapor: '蒸汽波', newsprint: '报纸版面',
  synth80: '合成器80s', kraft: '牛皮纸', candy: '糖果色', acid: '酸性设计', sumi: '墨与朱', gold: '漆黑金箔',
  hrRuin: '恐怖·废墟', hrNightRec: '恐怖·深夜录像', hrCurse: '恐怖·诅咒信' };
const MOOD_CN = { glitch: '故障', calm: '静谧', pop: '流行', graphic: '平面图形', editorial: '编辑排版', emotional: '情绪化', horror: '恐怖', chaos: '全部入' };
const ratioOf = a => { const [w, h] = J.designSize(a); return w / h; };

class LrcPlayer {
  /* 工厂：await LrcPlayer.create(container, opts)
     同一容器重复创建会自动销毁旧实例（防泄漏保险） */
  static async create(container, opts = {}) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (el && el.__lrcPlayer) { try { el.__lrcPlayer.destroy(); } catch (e) {} }
    const p = new LrcPlayer(container, opts);
    await p._init();
    p.container.__lrcPlayer = p;
    return p;
  }

  constructor(container, opts) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) throw new Error('LrcPlayer: 找不到容器元素');
    this.opts = opts;
    this._ev = {};
    this._raf = 0; this._destroyed = false; this._curLine = -2;
    this._slow = false; this._lastT = -1; this._dirty = true;

    const cs = getComputedStyle(this.container);
    if (cs.position === 'static') this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.style.background = '#000';

    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.audio = new Audio();
    this.audio.preload = 'auto';
    this._objUrl = null;

    this.renderer = new J.Renderer();
    this.project = null; this.plan = null;
    this.duration = 0; this.bpm = 0;

    this._loop = this._loop.bind(this);
  }

  /* ---------- 事件 ---------- */
  on(name, fn) { (this._ev[name] = this._ev[name] || []).push(fn); return this; }
  emit(name, arg) { for (const fn of this._ev[name] || []) { try { fn(arg); } catch (e) { console.error(e); } } }

  /* ---------- 初始化 ---------- */
  async _init() {
    const o = this.opts;
    const T = this._timings = {};                      // 各阶段耗时（ms），ready 事件里带回，便于排查
    const mark = (k, t0) => { T[k] = Math.round(performance.now() - t0); };
    try {
      // 音频 → Blob（URL 则取回；File 直接用）
      let blob = o.audio;
      if (typeof blob === 'string') {
        const r = await fetch(blob);
        if (!r.ok) throw new Error('音频下载失败: ' + r.status);
        blob = await r.blob();
      }
      if (!(blob instanceof Blob)) throw new Error('LrcPlayer: audio 需要 File / Blob / URL');
      this._objUrl = URL.createObjectURL(blob);
      this.audio.src = this._objUrl;

      // ① 时长：<audio> 元数据，毫秒级（不做整段解码）
      this.emit('loading', { stage: 'audio' });
      const tA = performance.now();
      await new Promise((res, rej) => {
        if (this.audio.readyState >= 1) return res();
        const to = setTimeout(() => rej(new Error('音频元数据超时')), 15000);
        this.audio.addEventListener('loadedmetadata', () => { clearTimeout(to); res(); }, { once: true });
        this.audio.addEventListener('error', () => { clearTimeout(to); rej(new Error('音频加载/解码失败（格式不受支持？）')); }, { once: true });
      });
      this.duration = this.audio.duration || 0;
      if (!isFinite(this.duration) || this.duration <= 0) throw new Error('无法读取音频时长');
      mark('audio', tA);

      // ② 歌词与元信息 + 随机风格 + 规划（毫秒级）
      this.emit('loading', { stage: 'plan' });
      const tP = performance.now();
      const parsed = J.parseLyrics(o.lrc || '');
      this.project = J.defaultProject();
      this.project.lyrics = o.lrc || '';
      this.project.title = o.title || (parsed.meta && parsed.meta.ti) || '';
      this.project.artist = o.artist || (parsed.meta && parsed.meta.ar) || '';
      this.project.lang = o.lang || 'auto';
      this.project.seed = (o.seed != null) ? o.seed : (Math.random() * 1e9) | 0;
      if (o.aspect && ASPECTS.includes(o.aspect)) this.project.aspect = o.aspect;
      if (o.fx) Object.assign(this.project.fx, o.fx);
      if (o.omakase !== false) this._rollLook(o);          // 随机 roll 一套（可用 mood/style 约束）
      else {
        if (o.mood && MOODS.includes(o.mood)) this.project.mood = o.mood;
        if (o.style && J.STYLES[o.style]) this.project.style = o.style;
        if (o.horror) { this.project.horror = true; if (J.setOn) J.setOn(this.project, 'horror'); }
      }
      this._aspectLocked = !o.autoAspect && !!o.aspect;
      this._replan();
      mark('plan', tP);

      // ③ 字体就绪（网络，唯一可能慢的阶段）—— 同时后台检测 BPM，不阻塞 ready
      this.emit('loading', { stage: 'fonts' });
      const tF = performance.now();
      if (o.bpm !== false) this._detectBpmFast(blob);          // 后台，完成发 'bpm' 事件
      await J.ensureFonts(this.project.lyrics + this.project.title, J.fontsOfPlan(this.plan));
      mark('fonts', tF);

      this._onResize();
      this._ro = new ResizeObserver(() => this._onResize());
      this._ro.observe(this.container);

      this.audio.addEventListener('play', () => this.emit('play'));
      this.audio.addEventListener('pause', () => this.emit('pause'));
      this.audio.addEventListener('ended', () => this.emit('ended'));
      this.audio.addEventListener('error', () => this.emit('error', { message: '音频加载/解码失败（格式不受支持？）' }));

      this._raf = requestAnimationFrame(this._loop);
      this.emit('ready', { duration: this.duration, bpm: this.bpm, seed: this.project.seed, timings: this._timings,
        mood: this.project.mood, style: this.project.style });
    } catch (e) {
      this.emit('error', { message: String(e && e.message || e) });
      throw e;
    }
  }

  /* BPM 后台检测：解码开头一段就够（音乐节拍在前面就能确定），不占创建时间。
     算法与 JIZURA 的 analyzeAudio 相同（自相关 70..180 BPM），只分析前 maxSec 秒。 */
  async _detectBpmFast(blob) {
    const maxSec = this.opts.bpmWindow || 90;
    try {
      const ab = await blob.arrayBuffer();
      const AC = window.AudioContext || window.webkitAudioContext;
      const decode = async bytes => {
        const ac = new AC();
        try { return await ac.decodeAudioData(bytes.slice(0)); } finally { try { ac.close(); } catch (e) {} }
      };
      // 先只解码前 8MB（128kbps MP3 ≈ 8 分钟），失败再整段解码（m4a/flac 等切不动会走这里）
      let buf = null;
      try { buf = await decode(ab.slice(0, Math.min(ab.byteLength, 8 * 1024 * 1024))); }
      catch (e) { buf = await decode(ab); }
      if (this._destroyed) return;                 // 等待期间播放器已销毁
      const sr = buf.sampleRate, ch = Math.min(2, buf.numberOfChannels);
      const len = Math.min(buf.length, Math.floor(sr * maxSec));
      const mono = new Float32Array(len);
      for (let c = 0; c < ch; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) mono[i] += d[i] / ch; }
      const rate = 50, hop = Math.round(sr / rate), n = Math.floor(len / hop);
      const energy = new Float32Array(n), flux = new Float32Array(n);
      let prevHP = 0, prevX = 0;
      for (let f = 0; f < n; f++) {
        let e = 0, eh = 0;
        for (let i = f * hop, end = Math.min(len, (f + 1) * hop); i < end; i++) {
          const x = mono[i]; e += x * x;
          const hp = 0.92 * (prevHP + x - prevX); prevHP = hp; prevX = x; eh += hp * hp;
        }
        energy[f] = Math.sqrt(e / hop); flux[f] = Math.sqrt(eh / hop);
      }
      const onset = new Float32Array(n);
      for (let f = 1; f < n; f++) {
        const cur = Math.log(1e-4 + flux[f]);
        let m = 0, k = 0; for (let j = Math.max(0, f - 4); j < f; j++) { m += Math.log(1e-4 + flux[j]); k++; }
        onset[f] = Math.max(0, cur - m / Math.max(1, k));
      }
      const minLag = Math.round(rate * 60 / 180), maxLag = Math.round(rate * 60 / 70);
      let best = 0, bestLag = Math.round(rate * 0.5); const scores = [];
      for (let lag = minLag; lag <= maxLag; lag++) {
        let s = 0; for (let f = lag; f < n; f++) s += onset[f] * onset[f - lag];
        s *= Math.exp(-0.5 * Math.pow(Math.log2((60 * rate / lag) / 125) / 0.7, 2));
        scores[lag] = s;
        if (s > best) { best = s; bestLag = lag; }
      }
      let lagF = bestLag;
      if (scores[bestLag - 1] != null && scores[bestLag + 1] != null) {
        const a = scores[bestLag - 1], b = scores[bestLag], c = scores[bestLag + 1], d = a - 2 * b + c;
        if (d !== 0) lagF = bestLag + 0.5 * (a - c) / d;
      }
      this.bpm = Math.round(60 * rate / lagF * 10) / 10;
      this.emit('bpm', { bpm: this.bpm });
    } catch (e) { /* BPM 只是信息项，失败静默 */ }
  }

  /* audioLike：与 JIZURA 编辑器一致（手动 BPM 才生成节拍网格，自动 BPM 由规划器内部处理） */
  _audioLike() {
    const T = this.project.timing;
    const a = { duration: this.duration, bpm: this.bpm };
    if (T.bpm > 0) a.beats = J.beatGrid(T.bpm, T.beatOffset || 0, this.duration);
    return a;
  }

  _replan() {
    this.plan = J.plan(this.project, this._audioLike());
    this._dirty = true;
  }

  /* ---------- 自适应 ---------- */
  _onResize() {
    const r = this.container.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; this._dirty = true; }

    // 画面比跨档 → 同种子重排（风格一致，版式适配新比例），毫秒级
    if (this._aspectLocked || !this.plan || w < 8 || h < 8) return;
    const cr = r.width / Math.max(1, r.height);
    const cur = this.project.aspect, curR = ratioOf(cur);
    if (Math.abs(Math.log(cr / curR)) < 0.12) return;          // 带迟滞，避免边界抖动
    let best = cur, bd = Infinity;
    for (const a of ASPECTS) { const d = Math.abs(Math.log(cr / ratioOf(a))); if (d < bd) { bd = d; best = a; } }
    if (best !== cur) {
      this.project.aspect = best;
      this._replan();
      J.ensureFonts(this.project.lyrics + this.project.title, J.fontsOfPlan(this.plan)).catch(() => {});
      this.emit('aspect', { aspect: best });
    }
  }

  /* ---------- 帧循环 ---------- */
  _loop() {
    if (this._destroyed) return;
    this._raf = requestAnimationFrame(this._loop);
    if (!this.plan) return;
    const playing = !this.audio.paused && !this.audio.ended;
    const t = this.audio.currentTime || 0;
    if (!this._dirty && !playing && Math.abs(t - this._lastT) < 0.004) return;   // 暂停且时间没动 → 不重画
    this._lastT = t;

    const t0 = performance.now();
    /* 画幅适配:contain=按宽铺满(默认,多余高度留边);cover=铺满画布并居中裁切 */
    const cw = this.canvas.width, ch = this.canvas.height;
    let k = cw / this.plan.W, dx = 0, dy = 0;
    if (this.opts.fit === 'cover') {
      k = Math.max(cw / this.plan.W, ch / this.plan.H);
      dx = (cw - this.plan.W * k) / 2;
      dy = (ch - this.plan.H * k) / 2;
    }
    this.renderer.frame(this.ctx, this.plan, t, { scale: k, dx, dy, fast: playing && this._slow });
    const dt = performance.now() - t0;
    if (playing) this._slow = dt > 30 ? true : dt < 14 ? false : this._slow;   // 自动降载

    // 当前歌词行变化事件
    const cut = J.cutAt(this.plan, t);
    const li = cut ? (cut.line | 0) : -1;
    if (li !== this._curLine) {
      this._curLine = li;
      this.emit('linechange', { index: li, text: cut ? cut.lineText || cut.text : '', t });
    }
  }

  /* ---------- 控制 ---------- */
  play() { return this.audio.play(); }
  pause() { this.audio.pause(); }
  get playing() { return !this.audio.paused && !this.audio.ended; }
  get currentTime() { return this.audio.currentTime || 0; }
  seek(t) { this.audio.currentTime = Math.max(0, Math.min(this.duration || 0, t)); this._dirty = true; }
  setVolume(v) { this.audio.volume = Math.max(0, Math.min(1, v)); }
  getVolume() { return this.audio.volume; }

  /* 随机 roll 一套风格；o.mood / o.style 可约束（JIZURA 的 omakase 返回结果不直接改 project，需应用） */
  _rollLook(o = {}) {
    if (o.mood && MOODS.includes(o.mood)) this.project.mood = o.mood;
    if (o.horror || o.mood === 'horror') { this.project.horror = true; if (J.setOn) J.setOn(this.project, 'horror'); }
    const r = J.omakase(this.project);
    Object.assign(this.project, r);                        // mood/style/fx/enabled/fonts/colors/seed
    if (o.mood && MOODS.includes(o.mood)) this.project.mood = o.mood;    // omakase 会避开当前 mood，强制用户选择
    if (o.style && J.STYLES[o.style]) this.project.style = o.style;
  }

  /* 换风格：不传 = 完全随机；传 'calm' 或 {mood, style} = 在约束下随机重排 */
  reroll(opts) {
    if (!this.project) return;
    const o = typeof opts === 'string' ? { mood: opts } : (opts || {});
    this._rollLook(o);
    this._replan();
    J.ensureFonts(this.project.lyrics + this.project.title, J.fontsOfPlan(this.plan)).catch(() => {});
    this.emit('reroll', { seed: this.project.seed, mood: this.project.mood, style: this.project.style });
  }

  destroy() {
    this._destroyed = true;
    cancelAnimationFrame(this._raf);
    if (this._ro) this._ro.disconnect();
    try { this.audio.pause(); this.audio.src = ''; } catch (e) {}
    if (this._objUrl) { URL.revokeObjectURL(this._objUrl); this._objUrl = null; }
    if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    if (this.container.__lrcPlayer === this) delete this.container.__lrcPlayer;
    this._ev = {};
  }
}

LrcPlayer.ASPECTS = ASPECTS;
LrcPlayer.MOODS = MOODS;
LrcPlayer.STYLE_CN = STYLE_CN;
LrcPlayer.MOOD_CN = MOOD_CN;
/* 风格包列表（给选择器 UI 用：含配色样板） */
LrcPlayer.styleList = () => J.STYLE_ORDER.map(k => {
  const s0 = J.STYLES[k].schemes[0];
  return { key: k, name: STYLE_CN[k] || J.STYLES[k].name || k, jp: J.STYLES[k].name, bg: s0.bg, fg: s0.fg, accent: s0.accent, accent2: s0.accent2 };
});
LrcPlayer.moodList = () => MOODS.map(k => ({ key: k, name: MOOD_CN[k] || k }));

/* ============================================================
   动态风格库：一个风格 = 一个自包含文件
   风格文件格式（上传/删除管理的最小单位）：
     LrcPlayer.registerStyle({
       key: 'superSuck',          // 全局唯一 id
       category: '电子',          // 库里的分组名（两级选择器第一级）
       name: '超级吸入',          // 组内显示名
       pack: { schemes, fonts, texture, bias, … },   // 引擎风格包定义
       parts: { enter: { myFx: { name, tags, apply } } }  // 可选：自带新部件
     });
   ============================================================ */
const STYLE_CATEGORY = {};            // key -> 分组名（内置风格也会填入，保证两级库一致）
const DYNAMIC_STYLES = new Set();     // registerStyle 注册的风格（removeStyle 只删这些）

/* 内置风格的分组规则：有 moods 的按第一个 mood 的中文名，否则归「基础」 */
function categoryOf(key) {
  if (STYLE_CATEGORY[key]) return STYLE_CATEGORY[key];
  const st = J.STYLES[key];
  if (st && st.moods && st.moods[0] && MOOD_CN[st.moods[0]]) return MOOD_CN[st.moods[0]];
  return '基础';
}

/* 两级风格库：[{ category, styles: [{key,name,bg,fg,accent,accent2,dynamic}] }] */
LrcPlayer.styleLibrary = () => {
  const map = new Map();
  for (const k of J.STYLE_ORDER) {
    const st = J.STYLES[k];
    if (!st || st.hidden || !st.schemes || !st.schemes[0]) continue;
    const cat = categoryOf(k);
    if (!map.has(cat)) map.set(cat, []);
    const s0 = st.schemes[0];
    map.get(cat).push({ key: k, name: STYLE_CN[k] || st.name || k, jp: st.name,
      bg: s0.bg, fg: s0.fg, accent: s0.accent, accent2: s0.accent2, dynamic: DYNAMIC_STYLES.has(k) });
  }
  return [...map].map(([category, styles]) => ({ category, styles }));
};

/* 注册一个动态风格（风格文件加载后调用；重复注册同 key = 覆盖更新） */
LrcPlayer.registerStyle = (def) => {
  if (!def || !def.key || !def.pack) throw new Error('registerStyle: 需要 { key, pack }');
  const key = def.key;
  def.pack.name = def.pack.name || def.name || key;
  if (!def.pack.schemes || !def.pack.schemes.length) throw new Error('registerStyle: pack.schemes 不能为空');
  J.STYLES[key] = def.pack;
  if (!J.STYLE_ORDER.includes(key)) J.STYLE_ORDER.push(key);
  STYLE_CATEGORY[key] = def.category || '自定义';
  if (def.name) STYLE_CN[key] = def.name;
  if (def.parts) {
    for (const group of Object.keys(def.parts)) {
      const dict = def.parts[group];
      if (!dict) continue;
      for (const pk of Object.keys(dict)) J.register(group, pk, dict[pk], 'style:' + key);
    }
  }
  DYNAMIC_STYLES.add(key);
  return key;
};

/* 从库中移除一个动态风格（连同它注册的部件；内置风格不可删） */
LrcPlayer.removeStyle = (key) => {
  if (!DYNAMIC_STYLES.has(key)) return false;
  delete J.STYLES[key];
  const i = J.STYLE_ORDER.indexOf(key);
  if (i >= 0) J.STYLE_ORDER.splice(i, 1);
  delete STYLE_CATEGORY[key];
  delete STYLE_CN[key];
  DYNAMIC_STYLES.delete(key);
  for (const g of J.GROUP_KEYS) {
    const reg = J.registry(g), order = J.order(g);
    for (const k of [...order]) {
      const d = reg[k];
      if (d && d.pack === 'style:' + key) { delete reg[k]; order.splice(order.indexOf(k), 1); }
    }
  }
  return true;
};

/* 加载一个风格文件（fetch → 注入 script → 文件内自行调用 registerStyle） */
const loadedStyleUrls = new Set();
LrcPlayer.loadStyle = async (url) => {
  if (loadedStyleUrls.has(url)) return true;
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) throw new Error('风格文件下载失败: ' + res.status);
  const code = await res.text();
  const el = document.createElement('script');
  const done = new Promise((res2, rej) => { el.onload = res2; el.onerror = () => rej(new Error('风格脚本执行失败: ' + url)); });
  el.src = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  document.head.appendChild(el);
  await done;
  loadedStyleUrls.add(url);
  return true;
};

if (typeof module !== 'undefined' && module.exports) module.exports = { LrcPlayer };
if (typeof window !== 'undefined') window.LrcPlayer = LrcPlayer;
})();
