package com.example.mobilehomeauto

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView

class MainActivity : ComponentActivity() {

    private lateinit var player: ExoPlayer
    private lateinit var playerView: PlayerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        playerView = findViewById(R.id.player_view)

        val hlsUri = Uri.parse("http://192.168.0.16:3000/videos/ipcam/index.m3u8")

        // Create a player instance.
        player = ExoPlayer.Builder(this).build()
        // Set the media item to be played.
        player.setMediaItem(MediaItem.fromUri(hlsUri))
        // Prepare the player.
        player.prepare()

        // Connect your ExoPlayer to the PlayerView
        playerView.player = player
    }

    override fun onStart() {
        super.onStart()
        player.play()
    }

    override fun onStop() {
        super.onStop()
        player.pause()
    }

    override fun onDestroy() {
        super.onDestroy()
        player.release()
    }
}
