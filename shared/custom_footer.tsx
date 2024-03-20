import React from 'react'
import { View, Text } from 'react-native'
import { useProfileContext } from './profile_context';

export default function Footer () {
    const profile_context = useProfileContext();
    return(
        <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 25}}>Current Profile: </Text>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>{profile_context.profile_name}</Text>
        </View>
    );
}