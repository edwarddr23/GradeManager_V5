import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Footer from '../shared/custom_footer';

import FlatButton from '../shared/custom_buttons';

const ClassScreen = ({navigation, route}) => {
    const { profile } = route.params;
    const[curr_class, setCurr_class] = useState(route.params.curr_class);

    console.log('ClassScreen: curr_class.sections:', curr_class.sections);
    
    useEffect(() => {
        // Set the header title of the screen to the name of the class.
        navigation.setOptions({title: route.params.curr_class.name});
        console.log('ClassScreen.tsx: useEffect(): profile:', profile);
    });
    
    return(
        <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <View style={{height: '10%', marginTop: '5%'}}>
                <FlatButton
                    text={'Configure Sections'}
                    onPress={() => navigation.navigate('Sections', {profile: route.params.profile, curr_class: curr_class})}
                />
            </View>
            {(curr_class.sections === undefined || curr_class.sections.length == 0) && (
                <View style={{marginTop: '5%', flex: 1}}>
                    <Text style={{textAlign: 'center', fontSize: 30}}>No Sections yet!</Text>
                </View>
            )}
            {(curr_class.sections != undefined && curr_class.sections.length > 0) && (
                <View style={{flex: 1, alignItems: 'center'}}>
                
                </View>
            )}
            {/* FOOTER */}
            <Footer profile={profile}/>
        </View>
    );
}

export default ClassScreen;