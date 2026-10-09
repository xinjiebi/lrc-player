package com.lrcplayer.demo

import androidx.appcompat.app.AppCompatActivity
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.view.WindowCompat
import com.lrcplayer.LrcPlayerView
import org.json.JSONObject
import java.io.File

/**
 * Demo:歌曲放在 assets/songs/(音频与 LRC 一一对应),因版权原因不随仓库分发,
 * 打包前需自行放入,见 README「歌曲资源」。
 * 点「选歌」→ 列表只显示歌曲名 → 自动配对 LRC → 播放。
 */
class MainActivity : AppCompatActivity() {

    private lateinit var player: LrcPlayerView

    /** 一首歌 = assets 里的音频 + 同名 LRC */
    private data class Song(val audio: String, val lrc: String, val title: String)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 内容延伸到状态栏与手势区域后面,真正的全屏(黑底上系统栏图标自动可见)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
        setContentView(R.layout.activity_main)
        player = findViewById(R.id.player)

        player.onCreated = { Log.i("LrcDemo", "event: created") }
        player.onReady = { duration, seed ->
            Log.i("LrcDemo", "event: ready duration=$duration seed=$seed")
            toast("就绪,时长 ${"%.1f".format(duration)}s")
            player.play()   // mediaPlaybackRequiresUserGesture=false,允许代码直接播
        }
        player.onLineChange = { index, text -> Log.i("LrcDemo", "event: line $index $text") }
        player.onEnded = {
            Log.i("LrcDemo", "event: ended")
            toast("播放完毕")
            findViewById<ImageButton>(R.id.btnPlay).visibility = View.VISIBLE
        }
        player.onError = { msg -> Log.e("LrcDemo", "event: error $msg"); toast("出错:$msg") }
        player.onAspect = { a -> Log.i("LrcDemo", "event: aspect $a") }
        player.onReroll = { s, m -> Log.i("LrcDemo", "event: reroll $s/$m") }

        findViewById<Button>(R.id.btnPick).setOnClickListener { showSongPicker() }
        findViewById<Button>(R.id.btnStyle).setOnClickListener { showStylePicker() }

        /* 点击封面 = 播放/暂停;上滑下一首,下滑上一首 */
        player.onTap = { player.toggle() }
        player.onSwipeVertical = { dir -> switchSong(if (dir < 0) 1 else -1) }

        /* 暂停(或播完)时显示居中播放按钮,点它或点封面都能继续 */
        val btnPlay = findViewById<ImageButton>(R.id.btnPlay)
        player.onState = { playing -> btnPlay.visibility = if (playing) View.GONE else View.VISIBLE }
        btnPlay.setOnClickListener { player.toggle() }

        /* 首次启动(安装后第一次打开)直接播放「你的答案」 */
        val sp = getSharedPreferences("demo", MODE_PRIVATE)
        if (!sp.getBoolean("autoPlayed", false)) {
            sp.edit().putBoolean("autoPlayed", true).apply()
            loadSongs().indexOfFirst { it.title == "你的答案" }
                .takeIf { it >= 0 }
                ?.let { playSongAt(it) }
        }
    }

    /* ================= 上下滑动切歌 ================= */

    private var songs: List<Song>? = null
    private var curIndex = -1

    private fun cachedSongs(): List<Song> = (songs ?: loadSongs().also { songs = it })

    /** offset:+1 下一首,-1 上一首(环形) */
    private fun switchSong(offset: Int) {
        val list = cachedSongs()
        if (list.isEmpty()) return
        val next = if (curIndex < 0) 0 else (curIndex + offset + list.size) % list.size
        playSongAt(next)
    }

    private fun playSongAt(index: Int) {
        val song = cachedSongs().getOrNull(index) ?: return
        curIndex = index
        playSong(song)
    }

    /* ================= 选歌(内置列表) ================= */

    private fun loadSongs(): List<Song> = runCatching {
        val files = assets.list("songs")?.toList() ?: emptyList()
        val audioExts = setOf("mp3", "aac", "m4a", "flac", "ogg", "wav")
        files.filter { it.substringAfterLast('.', "").lowercase() in audioExts }
            .mapNotNull { a ->
                val base = a.substringBeforeLast('.')
                val l = files.firstOrNull { it == "$base.lrc" } ?: return@mapNotNull null
                Song(a, l, songTitle(base))
            }
            .sortedBy { it.title }
    }.getOrElse { emptyList() }

    /* 文件名 "歌手 - 歌名" 或 "歌名-歌手" → 只取歌曲名 */
    private fun songTitle(base: String): String = when {
        " - " in base -> base.substringAfterLast(" - ")
        "-" in base -> base.substringBefore("-")
        else -> base
    }

    private fun showSongPicker() {
        val songs = loadSongs()
        if (songs.isEmpty()) return showNoSongsHint()
        AlertDialog.Builder(this)
            .setTitle("选择歌曲")
            .setItems(songs.map { it.title }.toTypedArray()) { _, which -> playSongAt(which) }
            .show()
    }

    /* 打包后没有内置歌曲时,弹出面板引导用户放歌再重新打包 */
    private fun showNoSongsHint() {
        AlertDialog.Builder(this)
            .setTitle("没有歌曲")
            .setMessage(
                "安装包中没有内置歌曲(歌曲因版权原因不随安装包分发)。\n\n" +
                    "打包前请把歌曲文件(mp3 / aac / m4a / flac / ogg / wav)和同名的 " +
                    ".lrc 歌词文件放入:\n\napp/src/main/assets/songs/\n\n然后重新打包安装即可。"
            )
            .setPositiveButton("知道了", null)
            .show()
    }

    /** 音频拷到缓存目录(WebView 播放需要 File),LRC 直接读文本 */
    private fun playSong(song: Song) {
        Log.i("LrcDemo", "选歌: ${song.audio}")
        runCatching {
            val ext = song.audio.substringAfterLast('.')
            val dst = File(cacheDir, "song.$ext")
            assets.open("songs/${song.audio}").use { i -> dst.outputStream().use { i.copyTo(it) } }
            val lrcText = assets.open("songs/${song.lrc}").use { it.readBytes().toString(Charsets.UTF_8) }
            player.load(dst, lrcText)
        }.onFailure { toast("加载失败:${it.message}") }
    }

    /* ================= 风格切换 ================= */

    private data class Style(val key: String, val name: String, val category: String)

    /* 风格列表来自 SDK 自带的 styles/index.json(同步脚本随 dist 更新) */
    private fun loadStyles(): List<Style> = runCatching {
        val txt = assets.open("lrcplayer/styles/index.json").use { it.readBytes().toString(Charsets.UTF_8) }
        val arr = JSONObject(txt).getJSONArray("styles")
        (0 until arr.length()).map {
            val o = arr.getJSONObject(it)
            Style(o.getString("key"), o.getString("name"), o.optString("category"))
        }
    }.getOrElse { emptyList() }

    private fun showStylePicker() {
        val styles = loadStyles()
        if (styles.isEmpty()) return toast("风格列表读取失败")
        val labels = styles.map { "[${it.category}] ${it.name}" }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle("切换风格")
            .setItems(labels) { _, which ->
                val st = styles[which]
                Log.i("LrcDemo", "切换风格: ${st.key}")
                player.reroll(st.key)
            }
            .show()
    }

    override fun onDestroy() {
        player.release()    // 必须：释放 WebView
        super.onDestroy()
    }

    private fun toast(msg: String) = Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
}
