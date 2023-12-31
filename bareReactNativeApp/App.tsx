/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import HomeScreen from './components/HomeComponent';
import CameraComponent from './components/CameraComponent';

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

const Stack = createStackNavigator();

function App(): JSX.Element {


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraComponent} />
      </Stack.Navigator>
    </NavigationContainer>
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
