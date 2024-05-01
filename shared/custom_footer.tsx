/* 
    custom_footer.js
    PURPOSE

        The purpose of this file is to define the custom Footer component that will be used for almost all
        the screens in this project. The idea is to use this modularly and add it to any relevant screens.
*/

import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useProfileContext } from './profile_context';

/*
NAME

    Footer - a function component that returns a component that will be a View with some defaults already determined.

SYNOPSIS

    <View> Footer({navigation})
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.

DESCRIPTION

    This is essentially a prewritten View component with predefined styling. On its own it is just a component. It will listen for whether or not
    it is in focus or not to redetermine what profile name to enter in the case that a user saves the profile under a different profile name than
    what it was before.

RETURNS

    Returns a View component with a predefined style.
*/
export default function Footer ({navigation}) {
    const { profile_context } = useProfileContext();
    const [profile_name, setProfile_name] = useState(profile_context.profile_name);

    useEffect(() => {
        // A listener is added to the useEffect() hook so that when the LoadScreen comes back into focus, the save files available will be updated in the case that a user loads, saves to a new file, and then hits the back button until they go back to the load screen. Without this listener, useEffect() will not automatically run again once the back button brings the user back to LoadScreen.
        navigation.addListener('focus', () => {
            setProfile_name(profile_context.profile_name);
        })
    }, []);
    
    return(
        <View style={{flexDirection: 'row', backgroundColor: '#F01d71', width: '100%', justifyContent: 'center'}}>
            <Text style={{fontSize: 25, color: 'white'}}>Current Profile: {profile_name}</Text>
        </View>
    );
}