/* 
    ManageProfilesScreen.tsx

    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for loading or deleting a profile from a profile name.
*/

import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Keyboard } from 'react-native'

import storage from '../shared/storage';
import { SelectList } from 'react-native-dropdown-select-list';
import { PrintData } from '../shared/print_profile_data';
import FlatButton from '../shared/custom_buttons';
import { useProfileContext } from '../shared/profile_context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import common_style from '../shared/common_style';

/*
NAME

    ManageProfilesScreen - a component that handles the load screen functionality.

SYNOPSIS

    <View> ManageProfilesScreen({navigation})
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.

DESCRIPTION

    This component renders the TextInput for the profile name to load, the profile information, 
    and the button to load the profile in question if a profile with that name is found.

RETURNS

    Returns a View component that holds a SelectList, a View that holds a preview for the profile, and a "load file" button.
*/
const ManageProfilesScreen = ({navigation}) => {
    const { profile_context } = useProfileContext();
    // State variables to keep track of the profile name to load and whether to allow the printing and loading of a profile if one is found.
    const[fileExists, setFileExists] = useState(false);
    const[profile, setProfile] = useState({});
    const[selected, setSelected] = useState('');
    const[all_keys, setAll_keys] = useState([]);
    
    /*
    NAME

        getAllKeys - an async function that gets all of the saved profiles under a file name (key).
    
    SYNOPSIS

        void getAllKeys()
                
    DESCRIPTION

        This function is a promise that calls the AsyncStorage getAllKeys() function to get all of the filenames, as I saved all of the filenames as the key. This function
        is called in the useEffect hook to avoid running this promise function as an infinite loop.
    
    RETURNS

        Returns a View component.
    */
    // Algorithm inspiration taken from https://stackoverflow.com/questions/68762079/why-is-this-async-function-infinite-looping.
    const getAllKeys = async() => {
        try{
            // Key "__react_native_storage_test" always shows up when looking for all keys, which is not a profile_context object saved. Do not show it.
            setAll_keys((await AsyncStorage.getAllKeys()).filter((key) => {if(key !== '__react_native_storage_test') return key}));
        }
        catch(error){
            console.error(`Error: ${error}`);
        }
    }

    /*
    NAME

        removeItemAtKey - an async function that deletes the saved profile under a file name (key).
    
    SYNOPSIS

        bool removeItemAtKey()
                
    DESCRIPTION

        This function is a promise that calls the AsyncStorage removeItem() function to delete the entry at key
        defined by parameter key. After deletion, state list all_keys and selected are both updated to prevent a
        user from attempting to load or delete a profile that doesn't exist and also to update the list of profiles
        the SelectList pulls up.
    
    RETURNS

        Returns a boolean that returns true if successful and false if not.
    */
    const removeItemAtKey = async(key) => {
        try{
            await AsyncStorage.removeItem(key);
            setAll_keys(all_keys.filter((a) => a !== key));
            setSelected('');
            return true;
        }
        catch(e){
            return false;
        }
    }

    // Keyboard flags in state that indicate whether the keyboard is showing or not. This will be used mainly to make certain views invisible when the keyboard comes up.
    const[keyboard_showing, setKeyboard_showing] = useState(false);

    // Hook that runs everytime there is a rerender. Listeners for the keyboard are updated to keep track of whether the keyboard is up or not. This will be used to display the load button only when the keyboard is down, otherwise, the button will hold itself above the keyboard.
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })
        // A listener is added to the useEffect() hook so that when the ManageProfilesScreen comes back into focus, the save files available will be updated in the case that a user loads, saves to a new file, and then hits the back button until they go back to the load screen. Without this listener, useEffect() will not automatically run again once the back button brings the user back to ManageProfilesScreen.
        navigation.addListener('focus', () => {
            getAllKeys();
        })
    }, [all_keys]);

    /*
    NAME

        readFile - a function that handles the search for a profile under the name specified by parameter fileName.
    
    SYNOPSIS

        void readFile(fileName)
            fileName --> a string that represents the filename entered from the TextInput on this screen.
    
    DESCRIPTION

        If the fileName passed as a parameter is an empty string, then set the state fileExists variable to false to 
        avoid unexpected behavior. The filename must be passed as a parameter and cannot use the state variable as the 
        state variable is only updated after a rerender, when we want to read the file as it is entered (in other words,
        before a rerender). Once the fileName parameter entered is not empty, then attempt to load a profile in storage
        under the key name fileName. If a profile is found, set the profile variable in state to the data found. Edit the
        global profile_context object to now hold the data that was found in the file loaded.
    
    RETURNS

        Returns void.
    */
    // Inspired by https://www.waldo.com/blog/react-native-fs
    function readFile(fileName) {
        if(fileName === '' || fileName === undefined){
            setFileExists(false);
            return;
        }
        storage.load({key: fileName})
            // If a file is found under fileName, modify the global profile_context to reflect this loaded profile if the user chooses to load it. Set state variable fileExists to true so that the profile preview and the load button can be rendered.
            .then((data) => {
                const profile = data.profile;
                setProfile(profile);
                profile_context.setProfile_name(profile.profile_name);
                profile_context.setYears(profile.years);
                setFileExists(true);
            })
            // If a file is not found under fileName, then throw a warning into the console and set the fileExists state variable to false to prevent the loading of a profile that does not exist or a profile that should not be loaded.
            .catch((err) => {
                console.warn(err.message);
                console.log('err.name:', err.name);
                setFileExists(false);
            });
    };

    return(
        <View style={styles.container}>
            {/* SelectList that lets a user select a saved profile. */}
            <View>
                <SelectList
                    dropdownTextStyles={common_style.defaultText}
                    inputStyles={common_style.defaultText}
                    // Placeholder is type so that the selected type will show after the exam is closed and reopened.
                    placeholder={'Select a profile name here'}
                    setSelected={setSelected}
                    data={all_keys}
                    search={false}
                    save="value"
                    // When a user selects a profile, load that into the global profile_context and print its contents.
                    onSelect={() => {
                        readFile(selected);
                    }}
                />
            </View>
            {/* ScrollView to display the profile data loaded if one under the filename specified is found. */}
            <View style={{flex: 1}}>
                <ScrollView>
                    {/* If there is a profile name entered and a file is found for that name, print the data loaded. */}
                    {fileExists === true && selected !== '' && selected !== undefined && (
                        PrintData(profile_context)
                    )}
                    {/* If there is a profile name entered but no file is found, then let the user know that no user is found. */}
                    {fileExists === false && selected !== '' && selected !== undefined && (
                        <Text style={common_style.defaultText}>Profile: "{selected}" could not be found.</Text>
                    )}
                    {/* If there is no profile name entered, then return to a resting state and do not do anything. */}
                    {(selected === '' || selected === undefined) && (
                        <Text style={common_style.defaultText}>Profile Preview here...</Text>
                    )}
                </ScrollView>
            </View>
            {/* Load button that lets a user load the profile loaded into the global profile_context in function readFile(). */}
            <View style={{height: 100}}>
                {fileExists === true && selected !== '' && !keyboard_showing && (
                    <FlatButton 
                        text={'Load \"' +  selected + '\"'}
                        onPress={() => {
                            navigation.navigate('Years', {profile: profile});
                        }}
                    />
                )}
            </View>
            <View style={{height: 70}}>
                {fileExists === true && selected !== '' && !keyboard_showing && (
                    <FlatButton 
                        text={'Delete \"' +  selected + '\"'}
                        onPress={() => {
                            removeItemAtKey(selected);
                            // console.log(`all_keys after deletion: ${all_keys}`);
                            // navigation.navigate('Delete');
                            // navigation.navigate('Years', {profile: profile});
                        }}
                    />
                )}
            </View>
        </View>
    );
}

export default ManageProfilesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: '5%',
        width: '90%',
        alignSelf: 'center',
        gap: 20
    },

    textInput: {
        fontSize: 20,
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        flex: 1
    }
});