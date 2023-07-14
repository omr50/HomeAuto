import React, { useRef, useEffect } from 'react'; // Import hooks from React
import { Video } from 'expo-av';
import { StatusBar, Text, View } from 'react-native';

export default function App() {
  const videoRef = useRef(null); // Create a reference

  useEffect(() => {
    // After the component did mount, start playing the video
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  return (
    <View>
      <Text>Open up App.js to start working on your app!</Text>
      {/* <Video
        ref={videoRef} // Use the reference
        source={{ uri: "http://192.168.0.16:3000/videos/ipcam/index.m3u8" }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        useNativeControls
        style={{ width: 300, height: 300 }}
      /> */}

      <Video
          source={{ uri: 'http://192.168.0.16:3000/videos/ipcam/index.m3u8' }}
          rate={1.0}
          volume={1.0}
          isMuted={true}
          shouldPlay
          useNativeControls
          style={{ width: 300, height: 300 }}/>
      <StatusBar style="auto" />
    </View>
  );
}
