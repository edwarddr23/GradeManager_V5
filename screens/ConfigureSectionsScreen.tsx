import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

import InputWithLabel from '../shared/custom_text_Inputs';
import Footer from '../shared/custom_footer';

const ConfigureSectionsScreen = ({navigation, route}) => {
    const { profile } = route.params.profile;
    const [curr_class, setCurr_class] = useState(route.params.curr_class);
    
    useEffect(() => {
        // Change the header title to reflect the current class's sections being edited.
        navigation.setOptions({title: `Sections for ${curr_class.name}`});
    }, []);

    const[sections, setSections] = useState(() => {
        if(curr_class.sections === undefined) return [];
        return curr_class.sections;
    });
    
    return(
        <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            {/* Add Sections button */}
            <TouchableOpacity
                style={{marginTop: '3%'}}
                activeOpacity={0.5}
                onPress={() => {
                    setSections([
                        ...sections,
                        {
                            rel_weight: undefined
                        }
                    ]);
                }}>
                <AntDesign name='pluscircleo' size={70} color="black"/>
            </TouchableOpacity>
            {(curr_class.sections === undefined || curr_class.sections.length == 0) && (
                <View style={{marginTop: '5%'}}>
                    <Text style={{fontSize: 30}}>No Sections Yet!</Text>
                </View>
            )}
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                <FlatList
                    style={{width: '90%', flex: 1}}
                    data={sections}
                    keyExtractor={(item, index) => item.id}
                    renderItem={section => {
                        return <Text>a Section</Text>
                        // return renderYear(curr_year);
                    }}
                />
                {/* FOOTER */}
                {/* <Footer profile={profile}/> */}
            </View>
        </View>
    );
}

export default ConfigureSectionsScreen;