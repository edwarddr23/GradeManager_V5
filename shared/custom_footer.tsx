import React from 'react'
import { View, Text } from 'react-native'
import { useProfileContext } from './profile_context';

export default function Footer () {
    const { profile_context } = useProfileContext();
    // console.log(`Footer: profile_context.profile_name: ${profile_context.profile_name}`);
    return(
        <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 25}}>Current Profile: {profile_context.profile_name}</Text>
            {/* <Text style={{fontSize: 25, fontWeight: 'bold'}}>{profile_context.profile_name}</Text> */}
        </View>
    );
}