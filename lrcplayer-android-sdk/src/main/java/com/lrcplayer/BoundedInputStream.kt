package com.lrcplayer

import java.io.InputStream
import java.io.RandomAccessFile

/**
 * 有边界的文件流：从 RandomAccessFile 的指定位置只读 remaining 字节。
 * HTML <audio> 的 Range 请求用（206 Partial Content）。
 */
internal class BoundedInputStream(
    private val raf: RandomAccessFile,
    private var remaining: Long,
) : InputStream() {
    override fun read(): Int {
        if (remaining <= 0) return -1
        val b = raf.read()
        if (b >= 0) remaining--
        return b
    }
    override fun read(buffer: ByteArray, off: Int, len: Int): Int {
        if (remaining <= 0) return -1
        val n = raf.read(buffer, off, minOf(len.toLong(), remaining).toInt())
        if (n > 0) remaining -= n
        return n
    }
    override fun close() { raf.close() }
}
