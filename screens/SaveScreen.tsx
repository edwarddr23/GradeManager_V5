import React from 'react'
import { View, Text } from 'react-native'

const SaveScreen = ({navigation, route}) => {
    const {profile} = route.params;
    console.log('SaveScreen.tsx: profile:', profile);
    return(
        <View>
            <Text>Save screen</Text>
        </View>
    );
}

export default SaveScreen;