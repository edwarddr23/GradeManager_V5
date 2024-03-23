import React, { useState, useEffect } from 'react'
import { View, Text, Keyboard } from 'react-native'
import { useProfileContext } from './profile_context';
import { KeyboardListener } from './keyboard_listener';

export default function Footer () {
    const { profile_context } = useProfileContext();
    // const[keyboard_showing, setKeyboard_showing] = useState(false);

    // useEffect(() => {
    //     setKeyboard_showing(KeyboardListener());
    // });

    // console.log(`Footer: profile_context.profile_name: ${profile_context.profile_name}`);
    return(
        <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 25}}>Current Profile: {profile_context.profile_name}</Text>
            {/* <Text style={{fontSize: 25, fontWeight: 'bold'}}>{profile_context.profile_name}</Text> */}
        </View>
    );
}