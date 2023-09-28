import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
// import {VLCPlayer} from 'react-native-vlc-media-player';
import {VLCPlayer} from 'react-native-vlc-media-player'

function CameraComponent() {

  console.log("VLC PLAYER IS ", VLCPlayer)
  return ( 
    <VLCPlayer
        style={{width: 300, height: 100}}
        videoAspectRatio="16:9"
        source={{ uri: "https://www.radiantmediaplayer.com/media/big-buck-bunny-360p.mp4"}}
        title="Big Buck Bunny"
    />

  )
}

export default CameraComponent;