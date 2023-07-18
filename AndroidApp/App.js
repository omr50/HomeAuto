import React, { useRef, useState } from 'react';
import { Video } from 'expo-av';
import { StatusBar, Text, View, Button, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
// import {ScreenOrientation} from 'expo-screen-orientation'

export default function App() {
  const videoRef = useRef(null);
  const [videoKey, setVideoKey] = useState(0); // To force refresh Video component
  const [lightStatus, setLightStatus] = useState('on');

  
  function setOrientation() {
    if (Dimensions.get('window').height > Dimensions.get('window').width) {
      //Device is in portrait mode, rotate to landscape mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    else {
      //Device is in landscape mode, rotate to portrait mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }

  const handleClick = () => {
    setVideoKey(videoKey + 1);
  }

  const handleLights = () => {
    fetch(`http://192.168.0.16:3000/lights`)
    .then((result)=> {
      console.log(success)
      // change the lights (how to know if they were really turned on.)
    })
    .catch((error)=> {
      console.log(error)
    })
}

  // REMEMBER TO ADD A BUTTON TO REFRESH STREAM INCASE YOUR OUT SIDE AND THE STREAM ISNT WORKING.
  return (
    <View>
      <Text>Camera 1 "Later change to User defined Cam Name"</Text>

      <Video
          key={videoKey} // Adding key to force refresh
          ref={videoRef}
          source={{ uri: 'http://192.168.0.16:3000/videos/ipcam/index.m3u8' }}
          rate={1.0}
          volume={1.0}
          isMuted={true}
          shouldPlay
          resizeMode="contain"
          onFullscreenUpdate={setOrientation}
          useNativeControls
          style={{width: Dimensions.get('window').width, height: 200, marginLeft:'auto', marginRight:'auto' }}
      />

      <Button title='Refresh Stream' onPress={handleClick}></Button>

      {/* implement record later. (Possibly record to hdd, but seperate power from data pin
          so that raspberry pi can handle it.)  */}
          <Button title='Lights' onPress={handleLights}></Button>
          
          <Button title='Record'></Button>

      <StatusBar style="auto" />
    </View>
  );
}
