/* 
    App.tsx

    PURPOSE

        The purpose of this file is to define the starting point for the application. Most importantly, the profile 
        context provider is defined here to provide the profile_context and its relevant functions to all of the children
        (which are all of the other screen components, effectively making the profile context and its functions available
        in the global scope).
*/

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

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
import { ProfileProvider } from './shared/profile_context';
import SectionScreen from './screens/SectionScreen';
import SemesterScreen from './screens/SemesterScreen';
import ConfigureSectionsScreen from './screens/ConfigureSectionsScreen';
import ConfigureLetterGradingScreen from './screens/ConfigureLetterGradingScreen';
import common_style from './shared/common_style';

const HeaderView = ({navigation, backButtonOnPress, titleView, hasBackButton, hasSaveButton}) => {
  return(
    <View style={{width: '100%', backgroundColor: 'white', height: 65, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20}}>
      {/* Back button */}
      {hasBackButton && (
        <View style={{marginRight: 20}}>
          <TouchableOpacity
          activeOpacity={0.5}
          onPress={backButtonOnPress}>
            <AntDesign name="arrowleft" size={25} color='black'/>
          </TouchableOpacity>
        </View>
      )}
      {/* Title */}
      <View style={{flex: 1}}>
        { titleView }
      </View>
      {/* Save Button */}
      {hasSaveButton && (
        <View style={{width: 100, height: 45, marginLeft: 'auto'}}>
          <FlatButton
            text="Save"
            onPress={() => {
              navigation.navigate("Save");
            }}
          />
        </View>
      )}
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
            component={HomeScreen}
            options={({navigation}) => ({
              header: () => (
                <HeaderView
                  navigation={navigation}
                  hasBackButton={false}
                  hasSaveButton={false}
                  titleView={(
                    <View>
                      <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>Home</Text>
                    </View>
                  )}
                />
              )
            })}
          />
          <Stack.Screen
            name="Create Profile"
            component={CreateProfileScreen}
            options={({navigation}) => ({
              header: () => (
                <HeaderView
                  navigation={navigation}
                  hasBackButton={true}
                  backButtonOnPress={() => {
                    navigation.goBack();
                  }}
                  hasSaveButton={false}
                  titleView={(
                    <View>
                      <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>Home</Text>
                    </View>
                  )}
                />
              )
            })}
          />
          <Stack.Screen
            name="Years"
            component={YearsScreen}
            options={({navigation}) => ({
              header: () => (
                <HeaderView
                  navigation={navigation}
                  hasBackButton={true}
                  backButtonOnPress={() => {
                    navigation.goBack();
                  }}
                  titleView={(
                    <View>
                      <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>Academic Years</Text>
                    </View>
                  )}
                  hasSaveButton={true}
                />
              )
            })}/>
            <Stack.Screen
              name="Semester"
              component={SemesterScreen}
              options={({navigation, route}) => ({
                header: () => (
                  <HeaderView
                    navigation={navigation}
                    hasBackButton={true}
                    backButtonOnPress={() => {
                      navigation.goBack();
                    }}
                    titleView={(
                      <View>
                        {/* If the semester season and name are initialized, display them. */}
                        {route.params.semester.season !== '' && route.params.semester.year !== '' && (
                          <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontSize: 20, fontWeight: 'bold'}]}>{route.params.semester.season} {route.params.semester.year}</Text>
                        )}
                        {/* If the semester season and name are not initialized, display "New Semester". */}
                        {route.params.semester.season === '' && route.params.semester.year === -1 && (
                          <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontSize: 20, fontWeight: 'bold'}]}>New Semester</Text>
                        )}
                      </View>
                    )}
                    hasSaveButton={true}
                  />
                )
                // headerRight: () => (
                //   <View style={{width: 100, height: 45}}>
                //     <FlatButton
                //       text="Save"
                //       onPress={() => {
                //         navigation.navigate("Save");
                //       }}
                //     />
                //   </View>
                // )
              })}
            />
            <Stack.Screen
              name="Configure Sections"
              component={ConfigureSectionsScreen}
              options={({navigation, route}) => ({
                header: () => (
                  <HeaderView
                    navigation={navigation}
                    hasBackButton={true}
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
                          <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontSize: 20, fontWeight: 'bold'}]}>Configure Sections in {route.params.curr_class.name}</Text>
                        )}
                        {route.params.curr_class.name === '' && (
                          <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontSize: 20, fontWeight: 'bold'}]}>Configure Sections in New Class</Text>
                        )}
                      </View>
                    )}
                    hasSaveButton={false}
                  />
                )
              })}
            />
            <Stack.Screen
              name="Configure Letter Grading"
              component={ConfigureLetterGradingScreen}
              options={({navigation, route}) => ({
                header: () => (
                  <HeaderView
                    navigation={navigation}
                    hasBackButton={true}
                    backButtonOnPress={() => {
                      const { semester, letter_grading } = route.params;
                      console.log(`Back button: letter_grading[0]: ${JSON.stringify(letter_grading[0])}`);
                      // "A" must end at 100%.
                      if(parseInt(letter_grading[0].end) !== 100){
                        Toast.show('"A" grade must end at 100%', Toast.SHORT);
                        return;
                      }
                      // "F" must begin at 0%.
                      else if(parseInt(letter_grading[10].beg) !== 0){
                        Toast.show(`"F" grade msut begin at 0%`, Toast.SHORT);
                        return;
                      }
                      // Check if letter grading is contiguous.
                      function isContiguous(){
                        let contiguous = true;

                        for(let i = 0; i < letter_grading.length; i++){
                          let curr_letter_grade = letter_grading[i];
                          // Validate with letter after as long as the current letter is not "F" (the last one).
                          if(curr_letter_grade.letter !== "F"){
                            if(parseInt(curr_letter_grade.beg) !== parseInt(letter_grading[i + 1].end)){
                              Toast.show(`${curr_letter_grade.letter} and ${letter_grading[i + 1].letter} are not contiguous`, Toast.SHORT);
                              contiguous = false;
                              break;
                            }
                          }
                        };

                        return contiguous
                      }
                      // If the letter_grading is not contiguous, then a Toast would have already displayed from isContiguous(). Return so that user cannot navigate back.
                      if(!isContiguous()) return;
                      navigation.navigate('Semester', {semester: semester});
                    }}
                    titleView={(
                      <View>
                        {route.params.curr_class.name !== '' && (
                          <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>Letter Grading in {route.params.curr_class.name}</Text>
                        )}
                        {route.params.curr_class.name === '' && (
                          <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>Letter Grading in New Class</Text>
                        )}
                      </View>
                    )}
                    hasSaveButton={false}
                  />
                ),
              })}
            />
            <Stack.Screen
            name="Section"
            component={SectionScreen}
            options={({navigation, route}) => ({
              header: () => (
                <HeaderView
                  navigation={navigation}
                  hasBackButton={true}
                  backButtonOnPress={() => {
                    const { semester } = route.params;
                    navigation.navigate('Semester', {semester: semester});
                    // navigation.navigate('Semester', {semester: semester});
                  }}
                  titleView={(
                    <View>
                      {route.params.section.name !== '' && route.params.curr_class.name !== '' && (
                        <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>{route.params.section.name} in {route.params.curr_class.name}</Text>
                      )}
                      {route.params.section.name === '' && route.params.curr_class.name !== '' && (
                        <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>New Section in {route.params.curr_class.name}</Text>
                      )}
                      {route.params.section.name !== '' && route.params.curr_class.name === '' && (
                        <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>{route.params.section.name} in New Class</Text>
                      )}
                      {route.params.section.name === '' && route.params.curr_class.name === '' && (
                        <Text style={[common_style.defaultText, {flexWrap: 'wrap', fontWeight: 'bold'}]}>New Section in New Class</Text>
                      )}
                    </View>
                  )}
                  hasSaveButton={true}
                />
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
