package com.example.mobilehomeauto

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.mobilehomeauto.ui.theme.MobileHomeAutoTheme
import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.MediaItem
import com.google.android.exoplayer2.SimpleExoPlayer
import com.google.android.exoplayer2.ui.PlayerView

class MainActivity : ComponentActivity() {

    private var player: ExoPlayer? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        player = ExoPlayer.Builder(this).build()

        val uri = Uri.parse("http://192.168.0.16:3000/videos/ipcam/index.m3u8")
        val mediaItem = MediaItem.fromUri(uri)

        player?.setMediaItem(mediaItem)
        player?.prepare()
        val playerView = findViewById<PlayerView>(R.id.playerView)
        playerView.player = player
    }

    override fun onStart() {
        super.onStart()
        player?.playWhenReady = true
    }

    override fun onStop() {
        super.onStop()
        player?.playWhenReady = false
    }

    override fun onDestroy() {
        super.onDestroy()
        player?.release()
    }
}

