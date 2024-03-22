import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Footer from '../shared/custom_footer';

import FlatButton from '../shared/custom_buttons';
import { useProfileContext } from '../shared/profile_context';
import { PrintClassesFromProfile } from '../shared/profile_functions';

const ClassScreen = ({route, navigation}) => {
    const { profile_context } = useProfileContext();
    const { year, curr_class } = route.params;
    console.log(`ClassScreen(): curr_class.name: ${curr_class.name}`);
    console.log(`ClassScreen(): curr_class.sections: ${curr_class.sections}`);

    // PrintClassesFromProfile();
    
    useEffect(() => {
        // Set the header title of the screen to the name of the class.
        navigation.setOptions({title: curr_class.name});
        // PrintClassesFromProfile();
    });
    
    return(
        <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <View style={{height: '10%', marginTop: '5%'}}>
                <FlatButton
                    text={'Configure Sections'}
                    onPress={() => navigation.navigate('Sections', {year: year, curr_class: curr_class})}
                />
            </View>
            {(curr_class.sections === undefined || curr_class.sections.length == 0) && (
                <View style={{marginTop: '5%', flex: 1}}>
                    <Text style={{textAlign: 'center', fontSize: 30}}>No Sections yet!</Text>
                </View>
            )}
            {(curr_class.sections != undefined && curr_class.sections.length > 0) && (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 30}}>Sections would be here!</Text>
                </View>
            )}
            {/* FOOTER */}
            <Footer/>
        </View>
    );
}

export default ClassScreen;