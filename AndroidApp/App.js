import React, { useRef, useState } from 'react';
import { Video } from 'expo-av';
import { StatusBar, Text, View, Button, Dimensions, Platform, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ScreenOrientation from 'expo-screen-orientation';
// import {ScreenOrientation} from 'expo-screen-orientation'

export default function App() {
  const videoRef = useRef(null);
  const [videoKey, setVideoKey] = useState(0); // To force refresh Video component
  const [lightStatus, setLightStatus] = useState('on');

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const hours = [...Array(24).keys()];
  const minutes = [...Array(60).keys()];

  const handleCam = (direction) => {
    fetch(`http://192.168.0.16:3000/move-${direction}`)
    .then((result)=> {
      console.log("successfully moved " + direction)
      // change the lights (how to know if they were really turned on.)
    })
    .catch((error)=> {
      console.log(error)
    })
  } 

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

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
      console.log("success")
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
          <View style={{marginBottom: 50}} />

          <Button title='Record'></Button>
          <View style={{marginBottom: 50}} />

          <Button title='Move Cam Left' onPress={()=>{handleCam('left')}}></Button>
          <View style={{marginBottom: 50}} />

          <Button title='Move Cam Right' onPress={()=>{handleCam('right')}}></Button>
          <View style={{marginBottom: 50}} />

          <Button title="Show Picker" onPress={() => setShow(true)} />
      <Modal visible={show} onRequestClose={() => setShow(false)}>
        <Picker
          selectedValue={date.getHours()}
          onValueChange={(itemValue, itemIndex) =>
            setDate(new Date(date.setHours(itemValue)))
          }>
          {hours.map((value, index) => (
            <Picker.Item key={index} label={value.toString()} value={value} />
          ))}
        </Picker>
        <Picker
          selectedValue={date.getMinutes()}
          onValueChange={(itemValue, itemIndex) =>
            setDate(new Date(date.setMinutes(itemValue)))
          }>
          {minutes.map((value, index) => (
            <Picker.Item key={index} label={value.toString()} value={value} />
          ))}
        </Picker>
        <Button title="Done" onPress={() => setShow(false)} />
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}
