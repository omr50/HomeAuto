/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('red');
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const [textWidth, setTextWidth] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(0);

  const onTextLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setTextWidth(width);
  };

  const onButtonLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidth(width);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const translateX = -textWidth * 0.5;
  const translateXButton = -buttonWidth * 0.5;

  return (
    <>
    <SafeAreaView style={backgroundStyle}>

          <ImageBackground source={require('./images/smart-home-img.webp')} style={{width: '100%', height: '100%'}}>


          </ImageBackground>

          {/* text absolute and button absolute */}

          <Text onLayout={onTextLayout} style={[{ transform: [{ translateX: translateX }] }, styles.text]}>Home Auto</Text>
          
          <TouchableOpacity
          onLayout={onButtonLayout}
          style={ [{ transform: [{ translateX: translateXButton }] }, styles.enterButton] }
          onPress={() => {
            console.log('pressed')
          }}
        >
          <Text style={{ color: 'white', fontSize: 25, fontWeight: '500' }}>Enter</Text>
        </TouchableOpacity>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  text: {
    fontWeight: "100",    
    position: 'absolute',
    left: '50%',
    top: -15,
    fontSize: 48,
    color: 'lightblue',
    textShadowColor: 'red',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 5,
    textShadow: [
      { textShadowOffset: { width: -1, height: -1 }, textShadowRadius: 0 },
      { textShadowOffset: { width: 1, height: -1 }, textShadowRadius: 0 },
      { textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 0 },
      { textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0 }
    ],
  },
  enterButton: {
    backgroundColor: 'rgba(0,91,150, 0.5)',
    borderWidth: 1,
    borderColor: 'pink',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 45,
    paddingRight: 45,
    // borderRadius: 45,
    position: 'absolute',
    top: '80%',
    left: '50%',
  }
});

export default App;
