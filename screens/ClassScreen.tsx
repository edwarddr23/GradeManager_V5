import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import FlatButton from '../shared/custom_buttons';

const ClassScreen = ({navigation, route}) => {
    const[curr_class, setCurr_class] = useState(route.params.curr_class);

    console.log('ClassScreen: curr_class.sections:', curr_class.sections);
    
    useEffect(() => {
        // Set the header title of the screen to the name of the class.
        navigation.setOptions({title: route.params.curr_class.name});
    });
    
    return(
        // <Text>Hello</Text>
        <View style={{flexDirection: 'column', flex: 1, backgroundColor: 'aqua'}}>
            <View style={{height: '10%', marginTop: '5%', marginHorizontal: '5%'}}>
                <FlatButton
                    text={'Configure Sections'}
                    onPress={() => navigation.navigate('Sections', {profile: route.params.profile, curr_class: curr_class})}
                />
            </View>
            {(curr_class.sections === undefined || curr_class.sections.length == 0) && (
                <View style={{marginTop: '5%'}}>
                    <Text style={{textAlign: 'center', fontSize: 30}}>No Sections yet!</Text>
                </View>
            )}
        </View>
    );
}

export default ClassScreen;