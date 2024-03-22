import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

import InputWithLabel from '../shared/custom_text_Inputs';
import Footer from '../shared/custom_footer';
import { findNextID, initializeArrKeys } from '../shared/key_functions';
import { useProfileContext, SectionContent } from '../shared/profile_context';

const SectionView = ({section, updateSections}) => {
    const[is_editing, setIs_editing] = useState(false);
    const[name, setName] = useState(() => {
        if(section.item.name == "") return "New Section";
        return section.item.name;
    });
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
                    {/* Done Button */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto', justifyContent: 'center'}}
                        onPress={() => {
                            updateSections(
                                {
                                    ...section.item,
                                    name: name
                                }
                            );
                            setIs_editing(!is_editing);
                        }}>
                        <AntDesign name="checkcircleo" size={40} color="green"/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const ConfigureSectionsScreen = ({navigation, route}) => {
    const { profile_context } = useProfileContext();
    console.log(`ConfigureSectionsScreen(): route.params: ${route.params}`);
    const { year, curr_class } = route.params;
    console.log(`ConfigureSectionsScreen(): year: ${year}`);
    console.log(`ConfigureSectionsScreen(): curr_class: ${curr_class}`);

    const[sections, setSections] = useState(() => {
        if(curr_class.sections === undefined) return [];
        return initializeArrKeys(curr_class.sections);
    });

    // profile_context.years.find((y) => y.id === year.id)?.classes.find((c) => c.id === curr_class.id).sections = sections;

    useEffect(() => {
        // Change the header title to reflect the current class's sections being edited.
        navigation.setOptions({title: `Sections for ${curr_class.name}`});
        console.log('useEffect(): sections:', sections);
        if(sections.length > 0){
            console.log(`useEffect(): sections.find((s) => s.id === 0).name: ${sections.find((s) => s.id === 0).name}`);
            // console.log('useEffect(): sections[0]', sections[0]);
            // profile_context.years.find((y) => y.id === year.id)?.classes.find((c) => c.id === curr_class.id)?.setSections(sections);
        }
        console.log(`useEffect(): profile_context current class sections: ${profile_context.years.find((y) => y.id === year.id)?.classes.find((c) => c.id === curr_class.id).sections}`);
    }, [sections]);

    return(
        <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            {/* Button that adds sections. */}
            <TouchableOpacity
                style={{marginVertical: '3%'}}
                activeOpacity={0.5}
                onPress={() => {
                    // let new_sections = [
                    //     ...sections,
                    //     {
                    //         id: findNextID(sections),
                    //         rel_weight: undefined,
                    //         name: ''
                    //     }
                    // ];
                    // setSections(new_sections);
                    setSections([
                        ...sections,
                        {
                            id: findNextID(sections),
                            rel_weight: undefined,
                            name: ''
                        }
                    ])
                    // DEBUG ONLY: When done there should be a continue button that lets the user continue to the previous page with the new sections now shown on screen. So, onPress for that button, update profile_context.
                    // let test = profile_context.years.find((y) => y.id === year.id)?.classes.find((c) => c.id === curr_class.id);
                    // // test?.setSections = setSections;
                    // test.sections = newSections;
                    // console.log('CURRENT CLASS:', profile_context.years.find((y) => y.id === year.id)?.classes.find((c) => c.id === curr_class.id).sections);
                }}>
                <AntDesign name='pluscircleo' size={70} color="black"/>
            </TouchableOpacity>
            {(sections === undefined || sections.length == 0) && (
                <View style={{marginTop: '5%'}}>
                    <Text style={{fontSize: 30}}>No Sections Yet!</Text>
                </View>
            )}
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                <FlatList
                    style={{width: '90%', flex: 1}}
                    data={sections}
                    keyExtractor={(section) => section.id}
                    renderItem={section => {
                        const chgSectionsHandler = (new_section) => {
                            const new_sections = sections.map((s) => {
                                if(s.id !== new_section.id) return s;
                                return new_section;
                            });
                            console.log(`chgSectionsHandler(): new_sections:`, new_sections);
                            setSections(new_sections);
                        }
                        return(
                            <View style={{alignItems: 'center'}}>
                                <SectionView section={section} updateSections={chgSectionsHandler}/>
                            </View>
                        );
                    }}
                />
            </View>
            {/* FOOTER */}
            <Footer/>
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