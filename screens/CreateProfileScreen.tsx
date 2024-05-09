/* 
    CreateProfileScreen.tsx

    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for initializing a new profile and navigating to the YearsScreen to let the user
        start editing the newly initialized global profile context
*/

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Keyboard } from 'react-native'
import Toast from 'react-native-simple-toast';

import { InputWithLabel } from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';
import { useProfileContext } from '../shared/profile_context';

/*
NAME

    CreateProfileScreen - a component that displays and manages the screen which is responsible for the creation of a new profile object.
SYNOPSIS

    <View> updateTotal({navigation})
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
DESCRIPTION

    This component returns a View that lets the user enter a new profile using a TextInput to enter a profile name. Once the user presses the "Create Profile" button, the profile context is set to an empty profile (empty years array) with the profile name set by the user.
RETURNS

    Returns a View component that displays the screen's components (the TextInput for the profile name and the "Create Profile" button).
*/
const CreateProfileScreen = ({navigation}) => {
    // profile_context extracted for profile initialization when the user presses the "Create Profile" button.
    const { profile_context } = useProfileContext();
    // State variable profile_name created to handle the profile name as it is edited by the user.
    const [profile_name, setProfile_name] = useState('');
    // Keyboard flags in state that indicate whether the keyboard is showing or not. This will be used mainly to make certain views invisible when the keyboard comes up.
    const[keyboard_showing, setKeyboard_showing] = useState(false);

    useEffect(() => {
        // Keyboard listening to update keyboard_showing state. keyboard_state is used to indicate whether to hide certain views when keyboard is activated. Model taken from https://reactnative.dev/docs/keyboard.
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })
    });

    return(
        <View style={styles.container}>
            {/* Input for profile name. */}
            <InputWithLabel
                value={profile_name}
                onChangeText={setProfile_name}
                placeholder='Enter your profile name here...'
                label='Profile Name:'
                hasLabel={true}
            />
            {!keyboard_showing && (
                <View style={styles.button}>
                    {/* Button to initialize profile context with initial profile values and navigate to YearsScreen.tsx. */}
                    <FlatButton
                        text="Create Profile"
                        onPress={() => {
                            if(profile_name.trim() === ''){
                                Toast.show('Please enter a Profile Name', Toast.SHORT);
                                return null;
                            }
                            profile_context.setProfile_name(profile_name.trim());
                            profile_context.setYears([]);
                            return navigation.navigate('Years');
                        }}
                    />
                </View>
            )}
        </View>
    );
}

export default CreateProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        width: '90%',
        marginTop: 30,
        marginBottom: 50
    },

    button: {
        width: '100%',
        height: 80,
        marginTop: 'auto'
    }
})