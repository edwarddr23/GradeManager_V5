/* 
    CreateProfileScreen.tsx
    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for initializing a new profile and navigating to the YearsScreen to let the user
        start editing the newly initialized global profile context
*/

import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Toast from 'react-native-simple-toast';

import InputWithLabel from '../shared/custom_text_Inputs';
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

    return(
        <View style={styles.container}>
            {/* Input for profile name. */}
            <InputWithLabel
                value={profile_name}
                setValue={setProfile_name}
                extraOnChangeText={() => {}}
                placeholder='Enter your profile name here...'
                label='Profile Name:'/>
            <View style={styles.button}>
                {/* Button to initialize profile context with initial profile values and navigate to YearsScreen.tsx. */}
                <FlatButton
                    text="Create Profile"
                    onPress={() => {
                        if(profile_name.trim() === ''){
                            Toast.show('Please enter a Profile Name', Toast.SHORT);
                            return null;
                        }
                        else{
                            profile_context.setProfile_name(profile_name);
                            profile_context.setYears([]);
                            return navigation.navigate('Years');
                        }
                    }}
                />
            </View>
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