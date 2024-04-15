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

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';

import HomeScreen from './screens/HomeScreen';
import CreateProfileScreen from './screens/CreateProfileScreen';
import YearsScreen from './screens/YearsScreen';
import SaveScreen from './screens/SaveScreen';
import LoadScreen from './screens/LoadScreen';
import { ProfileProvider, useProfileContext } from './shared/profile_context';
import SectionScreen from './screens/SectionScreen';
import SemesterScreen from './screens/SemesterScreen';
import ConfigureSectionsScreen from './screens/ConfigureSectionsScreen';
import ConfigureLetterGradingScreen from './screens/ConfigureLetterGradingScreen';

const HeaderView = ({navigation, backButtonOnPress, titleView}) => {
  return(
    <View style={{width: '100%', height: 65, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20}}>
      {/* Back button */}
      <View style={{marginRight: 20}}>
        <TouchableOpacity
        activeOpacity={0.5}
        onPress={backButtonOnPress}>
          <AntDesign name="arrowleft" size={25} color='black'/>
        </TouchableOpacity>
      </View>
      {/* Title */}
      <View style={{flex: 1}}>
        { titleView }
      </View>
      {/* Save Button */}
      <View style={{width: 100, height: 45, marginLeft: 'auto'}}>
        <FlatButton
          text="Save"
          onPress={() => {
            navigation.navigate("Save");
          }}
        />
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  // Define the navigation stack that allows the navigation between screens through different components. Structure and flow taken from official guide: https://reactnative.dev/docs/navigation.
  return (
    <ProfileProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}/>
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
              name="Configure Sections"
              component={ConfigureSectionsScreen}
              options={({navigation, route}) => ({
                header: () => (
                  <HeaderView
                    navigation={navigation}
                    backButtonOnPress={() => {
                      const { year, curr_class, total } = route.params;
                      if(total > 100){
                          Toast.show(`The total weights cannot exceed 100% total: ${total}`, Toast.SHORT);
                      }
                      else{
                          navigation.navigate('Semester', {semester: route.params.semester});
                      }
                    }}
                    titleView={(
                      <View>
                        {route.params.curr_class.name !== '' && (
                          <Text style={{flexWrap: 'wrap', fontSize: 20, fontWeight: 'bold'}}>Configure Sections in {route.params.curr_class.name}</Text>
                        )}
                        {route.params.curr_class.name === '' && (
                          <Text style={{flexWrap: 'wrap', fontSize: 20, fontWeight: 'bold'}}>Configure Sections in New Class</Text>
                        )}
                      </View>
                    )}
                  />)
              })}
            />
            <Stack.Screen
              name="Configure Letter Grading"
              component={ConfigureLetterGradingScreen}
              options={({navigation, route}) => ({
                header: () => (
                  <HeaderView
                    navigation={navigation}
                    backButtonOnPress={() => {
                      const { curr_class, semester } = route.params;
                      navigation.navigate('Semester', {semester: semester});
                    }}
                    titleView={(
                      <View>
                        {route.params.curr_class.name !== '' && (
                          <Text style={{flexWrap: 'wrap', fontSize: 20, fontWeight: 'bold'}}>Letter Grading in {route.params.curr_class.name}</Text>
                        )}
                        {route.params.curr_class.name === '' && (
                          <Text style={{flexWrap: 'wrap', fontSize: 20, fontWeight: 'bold'}}>Letter Grading in New Class</Text>
                        )}
                      </View>
                    )}
                  />
                ),
              })}
            />
            <Stack.Screen
            name="Section"
            component={SectionScreen}
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
            })}/>
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
