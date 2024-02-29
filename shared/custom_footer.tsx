import React from 'react'
import { View, Text } from 'react-native'

export default function Footer ({profile}) {
    return(
        <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 25}}>Current Profile: </Text>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>{profile["name"]}</Text>
        </View>
    );
}