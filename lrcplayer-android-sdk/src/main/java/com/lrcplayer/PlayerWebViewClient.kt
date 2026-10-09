package com.lrcplayer

import android.content.Context
import android.net.Uri
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import java.io.File
import java.io.RandomAccessFile
import java.net.URLConnection

/**
 * WebViewClient：两类拦截
 *  1. 其余所有路径        → 交给 WebViewAssetLoader，从 assets 提供 JS SDK 与风格文件
 *  2. /audio/ 前缀       → 当前注册的音频文件，带 Range 支持（audio 标签的 seek 依赖 206）
 * 音频与页面同域名（appassets.androidplatform.net），避免跨域与媒体信任问题。
 */
internal class PlayerWebViewClient(
    context: Context,
    private val audioProvider: () -> File?,
    private val onPageReady: () -> Unit,
) : WebViewClient() {

    // 前缀用 "/":WebViewAssetLoader 会剥掉前缀再映射 assets 路径,
    // 这样 /lrcplayer/index.html → assets/lrcplayer/index.html 才能对上
    private val assetLoader = WebViewAssetLoader.Builder()
        .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(context))
        .build()

    override fun onPageFinished(view: WebView, url: String?) {
        super.onPageFinished(view, url)
        if (url?.startsWith("https://appassets.androidplatform.net/lrcplayer/") == true) onPageReady()
    }

    override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
        if (request.url.path?.startsWith("/audio/") == true) return serveAudio(request)
        return assetLoader.shouldInterceptRequest(request.url)
    }

    private fun serveAudio(request: WebResourceRequest): WebResourceResponse? {
        val f = audioProvider() ?: return notFound()
        if (!f.exists() || !f.isFile) return notFound()
        val mime = URLConnection.guessContentTypeFromName(f.name) ?: "audio/mpeg"
        val len = f.length()
        val range = request.requestHeaders["Range"]
        return try {
            if (range != null && range.startsWith("bytes=")) {
                // Range 请求:返回 206 + Content-Range,<audio> 才能拖动进度
                val seg = range.removePrefix("bytes=").split("-")
                val start = seg[0].toLong().coerceIn(0, len - 1)
                val end = if (seg.size < 2 || seg[1].isEmpty()) len - 1 else seg[1].toLong().coerceAtMost(len - 1)
                if (start > end) return notFound()
                val raf = RandomAccessFile(f, "r")
                raf.seek(start)
                val resp = WebResourceResponse(mime, null, BoundedInputStream(raf, end - start + 1))
                resp.setStatusCodeAndReasonPhrase(206, "Partial Content")
                resp.setResponseHeaders(
                    mapOf(
                        "Content-Type" to mime,
                        "Accept-Ranges" to "bytes",
                        "Content-Range" to "bytes $start-$end/$len",
                    )
                )
                resp
            } else {
                // 整文件请求:返回 206 风格同样安全（Accept-Ranges 声明支持）,WebView 读流至 EOF
                val resp = WebResourceResponse(mime, null, f.inputStream())
                resp.setStatusCodeAndReasonPhrase(200, "OK")
                resp.setResponseHeaders(mapOf("Content-Type" to mime, "Accept-Ranges" to "bytes"))
                resp
            }
        } catch (e: Exception) {
            notFound()
        }
    }

    private fun notFound() = WebResourceResponse("text/plain", "utf-8", "404".byteInputStream())
}
