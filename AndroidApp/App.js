import React, { useEffect, useRef, useState } from 'react';
import { Video } from 'expo-av';
import { StatusBar, Text, View, Button, Dimensions, Platform, Modal, FlatList, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ScreenOrientation from 'expo-screen-orientation';
// import {VLCPlayer, VlCPlayerView} from 'react-native-vlc-media-player';
// import {ScreenOrientation} from 'expo-screen-orientation'

export default function App() {
  const videoRef = useRef(null);
  const [videoKey, setVideoKey] = useState(0); // To force refresh Video component
  const [lightStatus, setLightStatus] = useState('on');

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const hours = [...Array(24).keys()];
  const minutes = [...Array(60).keys()];

  const [images, setImages] = useState([]);
  const [start, setStart] = useState(0);

  const getImages = async () => {
    try {
    const response = await fetch(`http://192.168.0.16:5000/get-images/0/2`);
    const images = await response.json();
    console.log(images)
    console.log(`http:/192.168.0.16:5000${images[0].url}`)
    setImages(prevImages => [...prevImages, ...images]);
    setStart(prevStart => prevStart + 2);
    } catch(e) {
      console.log("were getting an error", e)
    }
  }

  useEffect(() => {
      getImages();
  }, []);


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
      {/* <VLCPlayer
        autoplay={true}
        url="rtsp://user:password@192.168.0.13:554/live/ch1"
        onBuffering={(event) => {
          console.log('Buffering: ' + event);
        }}
        onError={(error) => {
          console.log('Error: ' + error);
        }}
        onOpen={(event) => {
          console.log('Stream open: ' + event);
        }}
        onProgress={(progress) => {
          console.log('Progress: ' + progress);
        }}
        onEnd={(event) => {
          console.log('End: ' + event);
        }}
        style={{ width: '100%', height: 200 }} // Or use your desired dimensions
      /> */}
      <Button title='Refresh Stream' onPress={handleClick}></Button>

      {/* implement record later. (Possibly record to hdd, but seperate power from data pin
          so that raspberry pi can handle it.)  */}
          <Button title='Lights' onPress={handleLights}></Button>
          <View style={{marginBottom: 5}} />

          <Button title='Record'></Button>
          <View style={{marginBottom: 5}} />

          <Button title='Move Cam Left' onPress={()=>{handleCam('left')}}></Button>
          <View style={{marginBottom: 5}} />

          <Button title='Move Cam Right' onPress={()=>{handleCam('right')}}></Button>
          <View style={{marginBottom: 5}} />

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
      
      {images.map((item, index) => (
        <Image key={index} source={{uri: `http:/192.168.0.16:5000${item.url}`}}  style= {{ width:100, height: 100}}/>
      ))}

      <StatusBar style="auto" />
    </View>
  );
}
