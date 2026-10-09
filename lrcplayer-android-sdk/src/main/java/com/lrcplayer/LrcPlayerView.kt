package com.lrcplayer

import android.annotation.SuppressLint
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.AttributeSet
import android.view.GestureDetector
import android.view.MotionEvent
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.FrameLayout
import org.json.JSONObject
import java.io.File
import kotlin.math.abs

/**
 * 动态歌词播放器视图（Android 壳）。
 *
 * 用法：
 * ```
 * playerView.load(audioFile, lrcText)          // 创建并自动准备
 * playerView.onReady = { play() }              // 就绪后播放(或响应用户手势再播)
 * playerView.onLineChange = { i, text -> ... }
 * playerView.seek(12.5); playerView.reroll("ocean"); playerView.release()
 * ```
 *
 * 音频文件无需可读权限之外的特殊处理：内部把文件映射为
 * https://appassets.androidplatform.net/audio/<文件名> 交给 WebView 播放（带 Range 支持）。
 */
class LrcPlayerView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
) : FrameLayout(context, attrs) {

    /* ---- 事件回调（都在主线程触发） ---- */
    var onCreated: (() -> Unit)? = null
    var onReady: ((duration: Double, seed: Long) -> Unit)? = null
    var onLineChange: ((index: Int, text: String) -> Unit)? = null
    var onEnded: (() -> Unit)? = null
    /** 播放状态变化:true = 播放中,false = 已暂停 */
    var onState: ((playing: Boolean) -> Unit)? = null
    var onError: ((message: String) -> Unit)? = null
    var onAspect: ((aspect: String) -> Unit)? = null
    var onReroll: ((style: String, mood: String) -> Unit)? = null
    /** 单击封面（播放/暂停切换，宿主决定行为） */
    var onTap: (() -> Unit)? = null
    /** 竖向快滑:-1 = 上滑(下一首),1 = 下滑(上一首) */
    var onSwipeVertical: ((direction: Int) -> Unit)? = null

    private val main = Handler(Looper.getMainLooper())
    private var audioFile: File? = null
    private var pageReady = false
    private var pendingCreate: JSONObject? = null
    private var released = false

    private val web = WebView(context)
    private val client = PlayerWebViewClient(context, { audioFile }) {
        pageReady = true
        flush()
    }

    /* 手势:在 onInterceptTouchEvent 里喂给识别器但永远返回 false,
       WebView 照常收到事件(滚动/缩放不受影响),手势只是旁路监听 */
    private val detector = GestureDetector(context, object : GestureDetector.SimpleOnGestureListener() {
        override fun onDown(e: MotionEvent): Boolean = true
        override fun onSingleTapConfirmed(e: MotionEvent): Boolean {
            main.post { onTap?.invoke() }
            return true
        }
        override fun onFling(e1: MotionEvent?, e2: MotionEvent, velocityX: Float, velocityY: Float): Boolean {
            if (e1 == null) return false
            val dy = e2.y - e1.y
            if (abs(dy) > 120 && abs(velocityY) > 400) {
                main.post { onSwipeVertical?.invoke(if (dy < 0) -1 else 1) }
                return true
            }
            return false
        }
    })

    override fun onInterceptTouchEvent(ev: MotionEvent): Boolean {
        detector.onTouchEvent(ev)
        return false
    }

    init {
        web.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        web.settings.apply {
            @SuppressLint("SetJavaScriptEnabled")
            javaScriptEnabled = true
            domStorageEnabled = true
            // 允许代码触发播放（WebView 默认要求用户手势）
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = false
            allowContentAccess = false
        }
        web.addJavascriptInterface(NativeEvents(), "LrcPlayerNative")
        web.webViewClient = client
        addView(web)
        web.loadUrl(BRIDGE_URL)
    }

    /* ================= 对外 API ================= */

    /** 创建播放器。audio 为本地音频文件；lrcText 为 LRC 文本内容。 */
    @JvmOverloads
    fun load(audio: File, lrcText: String, style: String? = null, mood: String? = null, seed: Long? = null) {
        check(!released) { "LrcPlayerView 已 release" }
        audioFile = audio
        val opts = JSONObject()
            .put("audioUrl", "$AUDIO_BASE${audio.name}")
            .put("lrc", lrcText)
        style?.let { opts.put("style", it) }
        mood?.let { opts.put("mood", it) }
        seed?.let { opts.put("seed", it) }
        pendingCreate = opts
        flush()
    }

    fun play() = js("__native.play()")
    fun pause() = js("__native.pause()")
    /** 播放/暂停切换（封面点按用） */
    fun toggle() = js("__native.toggle()")
    fun seek(seconds: Double) = js("__native.seek($seconds)")
    fun reroll(style: String? = null) = js("__native.reroll(" + (style?.let { JSONObject.quote(it) } ?: "null") + ")")
    fun destroyPlayer() = js("__native.destroy()")

    /** 释放 WebView。Activity/Fragment 销毁时必须调用。 */
    fun release() {
        if (released) return
        released = true
        web.removeJavascriptInterface("LrcPlayerNative")
        web.destroy()
        removeAllViews()
    }

    /* ================= 内部 ================= */

    private fun flush() {
        if (!pageReady) return
        val opts = pendingCreate ?: return
        pendingCreate = null
        js("__native.create($opts)")
    }

    private fun js(code: String) {
        if (released) return
        main.post { if (!released) web.evaluateJavascript(code, null) }
    }

    /** JS → 原生事件入口（JavaBridge 线程,回调统一 post 到主线程） */
    private inner class NativeEvents {
        @JavascriptInterface
        fun event(name: String, payload: String) {
            main.post {
                when (name) {
                    "created" -> onCreated?.invoke()
                    "ready" -> {
                        val o = runCatching { JSONObject(payload) }.getOrNull()
                        onReady?.invoke(o?.optDouble("duration") ?: 0.0, o?.optLong("seed") ?: 0L)
                    }
                    "line" -> {
                        val o = runCatching { JSONObject(payload) }.getOrNull()
                        onLineChange?.invoke(o?.optInt("index") ?: -1, o?.optString("text") ?: "")
                    }
                    "ended" -> onEnded?.invoke()
                    "state" -> onState?.invoke(payload == "play")
                    "error" -> onError?.invoke(payload)
                    "jserror" -> onError?.invoke("JS: $payload")
                    "aspect" -> onAspect?.invoke(payload)
                    "reroll" -> {
                        val o = runCatching { JSONObject(payload) }.getOrNull()
                        onReroll?.invoke(o?.optString("style") ?: "", o?.optString("mood") ?: "")
                    }
                }
            }
        }
    }

    companion object {
        private const val HOST = "https://appassets.androidplatform.net"
        private const val BRIDGE_URL = "$HOST/lrcplayer/index.html"
        private const val AUDIO_BASE = "$HOST/audio/"
    }
}
