import React, { useRef, useState } from 'react';
import { Video } from 'expo-av';
import { StatusBar, Text, View, Button } from 'react-native';

export default function App() {
  const videoRef = useRef(null);
  const [videoKey, setVideoKey] = useState(0); // To force refresh Video component

  const handleClick = () => {
    setVideoKey(videoKey + 1);
  }
  // REMEMBER TO ADD A BUTTON TO REFRESH STREAM INCASE YOUR OUT SIDE AND THE STREAM ISNT WORKING.
  return (
    <View>
      <Text>Open up App.js to start working on your app!</Text>

      <Video
          key={videoKey} // Adding key to force refresh
          ref={videoRef}
          source={{ uri: 'http://192.168.0.16:3000/videos/ipcam/index.m3u8' }}
          rate={1.0}
          volume={1.0}
          isMuted={true}
          shouldPlay
          resizeMode="contain"
          style={{ width: 350, height: 350, marginLeft:'auto', marginRight:'auto' }}
      />

      <Button title='Refresh Stream' onPress={handleClick}></Button>

      <StatusBar style="auto" />
    </View>
  );
}
