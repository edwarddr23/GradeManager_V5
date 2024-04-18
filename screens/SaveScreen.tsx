/* 
    SaveScreen.tsx
    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for saving a profile specified by a filename.
*/

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import RNFS from 'react-native-fs';

import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';
import storage from '../shared/storage';
import { PrintData } from '../shared/profile_functions';
import { useProfileContext } from '../shared/profile_context';
import Toast from 'react-native-simple-toast';

/*
NAME

        SaveScreen - a component that handles the UI elements and functionalities associated with the screen responsible for saving a profile to a file.
SYNOPSIS

        <View> SaveScreen({navigation})
            navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
DESCRIPTION

        A user enters a filename to save the current profile context into. After pressing the "Save to File" button,
        the global profile_context object is saved into storage using my storage.js wrapper with the save filename
        as the key. The current profile_context name in question will be changed to this new save filename entered
        so that the profile name and the save filename both match. This is to reduce confusion.
RETURNS

        Returns View that has a TextInput, a button to save to the file specified, and a preview of the profile data
        so far (which is in the global profile_context object).
*/
const SaveScreen = ({navigation}) => {
    // The global profile_context object is extracted from the profile context so that it can be saved to a file.
    const { profile_context } = useProfileContext();
    // The save filename is stored as a state variable so that its value can be used as the user changes the name of the save file.
    const[saveFileName, setSaveFileName] = useState('');
    
    return(
        <View style={styles.container}>
            {/* Custom TextInput and a message below it that warns the user not to add punctuation or an extension in their input. */}
            <View>
                <InputWithLabel
                    value={saveFileName}
                    setValue={setSaveFileName}
                    extraOnChangeText={() => {}}
                    placeholder={'Suggestion: \"' + profile_context.profile_name + '\"?'}
                    label="Save File Name:"
                />
                <Text style={{textAlign: 'center'}}>Please do not put punctuation or an extension at the end.</Text>
            </View>
            {/* Button that saves the global profile_context object to a file with the save filename in the state as the key. */}
            <View style={{height: 70}}>
                <FlatButton 
                    text='Save to File'
                    onPress={() => {
                        // If the save filename entered is an empty string, do not let the user save to a file and send a toast.
                        if(saveFileName.trim() === ''){
                            Toast.show("Please enter a name for the save file", Toast.SHORT);
                            return;
                        }
                        // If the save filename entered has anything besides spaces, letters, or numbers, do not let the user save to a file and send a toast.
                        else if(!!saveFileName.trim().match(/^[a-zA-Z1-9 ]+$/) === false) {
                            Toast.show("Please do not enter any punctuation for the save file", Toast.SHORT);
                            return;
                        }
                        // Modify the global profile_context name to whatever save filename was entered.
                        profile_context.profile_name = saveFileName.trim();
                        storage.save({
                            key: String(saveFileName.trim()),
                            data: {
                                profile: profile_context
                            },
                            expires: null
                        });
                        console.log('SaveScreen.tsx: saveToFileHandler(): Save successful?');
                        navigation.goBack();
                    }}
                />
            </View>
            {/* Print the preview of data for the profile found in the profile context. */}
            <ScrollView style={{paddingTop: '5%', flex: 1}}>
                { PrintData(profile_context) }
            </ScrollView>
        </View>
    );
}

export default SaveScreen;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        gap: 20,
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center'
    }
})