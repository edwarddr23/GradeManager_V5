/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import FlatButton from './shared/custom_buttons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './screens/HomeScreen';
import CreateProfileScreen from './screens/CreateProfileScreen';
import YearsScreen from './screens/YearsScreen';
import SaveScreen from './screens/SaveScreen';
import LoadScreen from './screens/LoadScreen';
import ClassScreen from './screens/ClassScreen';
// import { YearContent, ClassContent, ProfileContent, ProfileContext } from './shared/profile_context';
import { ProfileProvider, useProfileContext } from './shared/profile_context';
import SemesterScreen from './screens/SemesterScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  // const[name, setName] = useState('UNINITIALIZED');
  // const[years, setYears] = useState([]);
  // // const[classes, setClasses] = useState([]);

  // let profile: ProfileContent = {
  //   profile_name: name,
  //   setProfile_name: setName,
  //   years: years,
  //   setYears: setYears
  // };

  return (
    <ProfileProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              // title: 'Home',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold'
              },
              // headerTitleAlign: 'center'
            }}/>
          <Stack.Screen
            name="Create Profile"
            component={CreateProfileScreen}/>
          <Stack.Screen
            name="Years"
            component={YearsScreen}
            options={({navigation}) => ({
              title: 'Academic Years',
              headerRight: () => (
                <View style={{width: 100, height: 45}}>
                  <FlatButton
                    text="Save"
                    onPress={() => {
                      navigation.navigate("Save");
                    }}
                  />
                </View>
              )
            })}/>
            <Stack.Screen
              name="Semester"
              component={SemesterScreen}
              options={({navigation}) => ({
                headerRight: () => (
                  <View style={{width: 100, height: 45}}>
                    <FlatButton
                      text="Save"
                      onPress={() => {
                        navigation.navigate("Save");
                      }}
                    />
                  </View>
                )
              })}/>
            <Stack.Screen
              name="Class"
              component={ClassScreen}
              options={({navigation, route}) => ({
                headerRight: () => (
                  <View style={{width: 100, height: 45}}>
                    <FlatButton
                      text="Save"
                      onPress={() => {
                        navigation.navigate("Save");
                      }}
                    />
                  </View>
                )
              })}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}/>
            <Stack.Screen
              name="Load"
              component={LoadScreen}
              options={() => ({
                title: 'Load a Profile'
              })}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
});

export default App;
