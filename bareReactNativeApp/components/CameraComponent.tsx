import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
// import {VLCPlayer} from 'react-native-vlc-media-player';
import {VLCPlayer} from 'react-native-vlc-media-player'
import Video from 'react-native-video';
function CameraComponent() {

  console.log("VsLC PLAYwwewewewER IS ", VLCPlayer)
  console.log("-------------------------------------------- IS ")
  return ( 
    <View>
        <VLCPlayer
        style={[styles.video]}
        videoAspectRatio="16:9"
        source={{ uri: "rtmp://192.168.0.24/live/mystream"}}
        
        />
    </View>
  )
}

const videoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 250,
  };

  const viewStyle = {height: 250};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300,
  },
});
export default CameraComponent;