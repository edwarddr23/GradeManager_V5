import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

const ClassScreen = ({navigation, route}) => {
    // Set the header title of the screen to the name of the class.
    navigation.setOptions({title: route.params.curr_class.name});

    const [curr_class, setCurr_class] = useState(route.params.curr_class);

    return(
        <View style={{flexDirection: 'column', flex: 1, backgroundColor: 'aqua'}}>
            <TouchableOpacity
                onPress={() => console.log('thing')}
            />
        </View>
    );
}

export default ClassScreen;