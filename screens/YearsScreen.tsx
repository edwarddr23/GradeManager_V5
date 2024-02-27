import React from 'react'
import { View, Text } from 'react-native'

const YearsScreen = ({navigation, route}) => {
    const {profile_name} = route.params.profile_name;
    console.log('YearsScreen.tsx: profile_name:', profile_name);
    return(
        <View>
            <Text>{profile_name}</Text>
            {/* <Text>{route.params.profile_name}</Text> */}
        </View>
    );
}

export default YearsScreen;