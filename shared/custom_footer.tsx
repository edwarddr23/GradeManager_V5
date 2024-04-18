import React, { useState, useEffect } from 'react'
import { View, Text, Keyboard } from 'react-native'
import { useProfileContext } from './profile_context';

export default function Footer ({navigation}) {
    const { profile_context } = useProfileContext();
    const [profile_name, setProfile_name] = useState(profile_context.profile_name);
    // const[keyboard_showing, setKeyboard_showing] = useState(false);


    useEffect(() => {
        console.log('hi')
        // A listener is added to the useEffect() hook so that when the LoadScreen comes back into focus, the save files available will be updated in the case that a user loads, saves to a new file, and then hits the back button until they go back to the load screen. Without this listener, useEffect() will not automatically run again once the back button brings the user back to LoadScreen.
        navigation.addListener('focus', () => {
            setProfile_name(profile_context.profile_name);
        })
        // setKeyboard_showing(KeyboardListener());
    }, []);

    // console.log(`Footer: profile_context.profile_name: ${profile_context.profile_name}`);
    return(
        <View style={{flexDirection: 'row', backgroundColor: '#F01d71', width: '100%', justifyContent: 'center'}}>
            <Text style={{fontSize: 25, color: 'white'}}>Current Profile: {profile_name}</Text>
            {/* <Text style={{fontSize: 25, fontWeight: 'bold'}}>Current Profile: {prof_name}</Text> */}
        </View>
    );
}