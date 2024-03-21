import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

import InputWithLabel from '../shared/custom_text_Inputs';
import Footer from '../shared/custom_footer';
import { findNextID, initializeArrKeys } from '../shared/key_functions';

const ConfigureSectionsScreen = ({navigation, route}) => {
    console.log(`ConfigureSectionsScreen(): route.params: ${route.params}`);
    const { year, curr_class } = route.params;
    console.log(`ConfigureSectionsScreen(): year: ${year}`);
    console.log(`ConfigureSectionsScreen(): curr_class: ${curr_class}`);
    const [c_class, setc_class] = useState(route.params.curr_class);

    const[sections, setSections] = useState(() => {
        if(c_class.sections === undefined) return [];
        return initializeArrKeys(c_class.sections);
    });

    useEffect(() => {
        // Change the header title to reflect the current class's sections being edited.
        navigation.setOptions({title: `Sections for ${c_class.name}`});
        console.log('useEffect(): sections:', sections);
        console.log('useEffect(): sections[0]', sections[0]);
    }, []);
    
    const SectionView = ({section}) => {
        const[is_editing, setIs_editing] = useState(false);
        const[name, setName] = useState(() => {
            if(section.item.name == "") return "New Section";
            return section.item.name;
            // return "New Section";
            // console.log('useState(): section.item:', section.item);
            // return section.item.name;
        });
        console.log('SectionView: name:', name);
        // console.log(`SectionView: sections: ${sections}`);
        return(
            <View style={styles.section}>
                {!is_editing && (
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{alignSelf: 'center', fontSize: 20}}>{name}</Text>
                        <TouchableOpacity
                            style={{marginLeft: 'auto'}}
                            onPress={() => {
                                console.log(`editing section ${section.item.id}?`);
                                setIs_editing(!is_editing);
                            }}>
                            <AntDesign name="edit" size={40} color="black"/>
                        </TouchableOpacity>
                    </View>  
                )}
                {is_editing && (
                    <View style={{flexDirection: 'row'}}>
                        <TextInput
                            style={styles.inputText}
                            value={name}
                            placeholder={name}
                            onChangeText={text => {
                                setName(text);
                            }}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={{marginLeft: 'auto'}}
                            onPress={() => {
                                setIs_editing(!is_editing);
                            }}>
                            <AntDesign name="checkcircleo" size={40} color="black"/>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    return(
        <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            {/* Add Sections button */}
            <TouchableOpacity
                style={{marginTop: '3%'}}
                activeOpacity={0.5}
                onPress={() => {
                    let newSections = sections;
                    newSections = [
                        ...newSections,
                        {
                            id: findNextID(sections),
                            rel_weight: undefined,
                            name: ''
                        }
                    ];
                    setSections(newSections);
                    console.log('onPress(): sections:', sections);
                }}>
                <AntDesign name='pluscircleo' size={70} color="black"/>
            </TouchableOpacity>
            {(c_class.sections === undefined || c_class.sections.length == 0) && (
                <View style={{marginTop: '5%'}}>
                    <Text style={{fontSize: 30}}>No Sections Yet!</Text>
                </View>
            )}
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                <FlatList
                    style={{width: '90%', flex: 1}}
                    data={sections}
                    renderItem={section => {
                        return(
                            <View style={{alignItems: 'center'}}>
                                <SectionView section={section}/>
                            </View>
                        );
                    }}
                />
                {/* FOOTER */}
                <Footer/>
            </View>
        </View>
    );
}

export default ConfigureSectionsScreen;

const styles = StyleSheet.create({
    section: {
        width: '95%',
        borderWidth: 4,
        backgroundColor: 'purple',
        borderRadius: 30,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'column'
        // alignItems: 'center'
    },

    inputText: {
        textAlign: 'center',
        fontSize: 20,
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        flex: 1
    }
});