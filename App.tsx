/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
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

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './screens/HomeScreen';
import CreateProfileScreen from './screens/CreateProfileScreen';
import YearsScreen from './screens/YearsScreen';
import SaveScreen from './screens/SaveScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
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
          options={({navigation, route}) => ({
            title: 'Academic Years',
            // title: {route.params}["name"],
            headerRight: () => (
              <View style={{width: 100, height: 45}}>
                <FlatButton
                  text="Save"
                  onPress={() => {
                    console.log('PRESSED SAVE BUTTON!');
                    console.log('Save button: route.params:', route.params);
                    const {profile} = route.params;
                    console.log('Save button: profile:', profile);
                    navigation.navigate("Save", {profile: profile});
                    // console.log('Save button: route.params.name:', route.params);
                  }}
                />
              </View>
            )
          })}/>
          <Stack.Screen
            name="Save"
            component={SaveScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});

export default App;
