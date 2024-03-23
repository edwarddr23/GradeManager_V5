import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Keyboard } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';

import InputWithLabel from '../shared/custom_text_Inputs';
import Footer from '../shared/custom_footer';
import { findNextID, initializeArrKeys } from '../shared/key_functions';
import { useProfileContext, SectionContent } from '../shared/profile_context';
import FlatButton from '../shared/custom_buttons';
// import { KeyboardListener } from '../shared/keyboard_listener';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

const SectionView = ({section, updateSections}) => {
    const[is_editing, setIs_editing] = useState(false);
    const[name, setName] = useState(() => {
        if(section.name == "") return "";
        return section.name;
    });
    const[weight, setWeight] = useState(() => {
        if(section.weight == -1) return '';
        return (section.weight * 100).toString();
    });
    if(is_editing){
        console.log(`SectionView: section.weight: ${section.weight}`);
    }

    return(
        <View style={styles.section}>
            {/* View State for Section */}
            {!is_editing && (
                <View style={{flexDirection: 'row'}}>
                    {(name != '') && (
                        <Text style={{alignSelf: 'center', fontSize: 30, textDecorationLine: 'underline'}}>{name}</Text>
                    )}
                    {(name == '') && (
                        <Text style={{alignSelf: 'center', fontSize: 30}}>New Section</Text>
                    )}
                    {(weight != '') && (
                        <Text style={{alignSelf: 'center', fontSize: 30}}>{': ' + weight + '%'}</Text>
                    )}
                    <TouchableOpacity
                        style={{marginLeft: 'auto'}}
                        onPress={() => {
                            console.log(`editing section ${section.id}?`);
                            setIs_editing(!is_editing);
                        }}>
                        <AntDesign name="edit" size={50} color="black"/>
                    </TouchableOpacity>
                </View>  
            )}
            {/* Editing State for Section */}
            {is_editing && (
                <View style={{flexDirection: 'row'}}>
                    {/* Inputs: */}
                    <View style={{flexDirection: 'row', flex: 1, marginRight: 10}}>
                        <TextInput
                            style={styles.inputText}
                            value={name}
                            placeholder={'Name'}
                            onChangeText={text => {
                                setName(text.trim());
                            }}
                        />
                        <TextInput
                            style={styles.inputText}
                            value={weight}
                            placeholder={'Weight'}
                            onChangeText={(text) => {
                                setWeight(text.trim());
                            }}
                            keyboardType='numeric'
                        />
                    </View>
                    {/* Done Button */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto', justifyContent: 'center'}}
                        onPress={() => {
                            const inputIsValid = () => {
                                console.log(`inputIsValid(): name: ${name}`);
                                console.log(`inputIsValid(): typeof weight: ${typeof weight}`);
                                if(name === '' && weight === ''){
                                    return true;
                                }
                                else if(name === ''){
                                    Toast.show('Please enter name', Toast.SHORT);
                                    return false;
                                }
                                else if(weight === -1){
                                    Toast.show('Please enter weight', Toast.SHORT);
                                    return false;
                                }
                                else if(isNaN(weight)){
                                    Toast.show('Please enter a numeric weight. Do not enter any punctuation', Toast.SHORT);
                                    return false;
                                }
                                else if(!!weight.toString().match(/[.]/) === true){
                                    // console.log(!!weight.match(/[.]/));
                                    Toast.show('Please enter an integer for a weight', Toast.SHORT);
                                    return false;
                                }
                                else if(weight < 0){
                                    Toast.show('Please enter a weight greater or equal to 0', Toast.SHORT);
                                    return false;
                                }
                                return true;
                            }

                            if(inputIsValid() === true){
                                updateSections(
                                    {
                                        ...section,
                                        name: name,
                                        weight: weight / 100
                                    }
                                );
                                setIs_editing(!is_editing);
                            }
                        }}>
                        <AntDesign name="checkcircleo" size={50} color="green"/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const ClassScreen = ({route, navigation}) => {
    const { profile_context, updateClassInProfile } = useProfileContext();
    console.log(`ConfigureSectionsScreen(): route.params: ${route.params}`);
    const { year, curr_class } = route.params;
    console.log(`ConfigureSectionsScreen(): year: ${year}`);
    console.log(`ConfigureSectionsScreen(): curr_class.sections: ${curr_class.sections}`);

    const[sections, setSections] = useState(() => {
        if(curr_class.sections === undefined) return [];
        return initializeArrKeys(curr_class.sections);
    });

    const[total_weight, setTotal_weight] = useState<Float>(-1);

    const[keyboard_showing, setKeyboard_showing] = useState(false);
    
    // profile_context.years.find((y) => y.id === year.id)?.classes.find((c) => c.id === curr_class.id).sections = sections;

    useEffect(() => {
        // Change the header title to reflect the current class's sections being edited.
        navigation.setOptions({
            title: curr_class.name,
            headerLeft: () => (
                <View style={{marginRight: 20}}>
                    <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        const { year, curr_class } = route.params;
                        console.log('CUSTOM BUTTON PRESSED!');
                        console.log(`CUSTOM BUTTON: total_weight: ${total_weight}`);
                        // console.log(`Custom Button: route.params: ${route.params}`);
                        // profile_context.years.find()
                        console.log(`Custom Button: year: ${year.beg_year}-${year.end_year}, curr_class.name: ${curr_class.name}`);
                        const newSectionsExist = () => {
                            let new_section_found = false;
                            sections.forEach((s) => {
                                if(s.weight === -1){
                                    new_section_found = true;
                                };
                            });
                            return new_section_found;
                        }
                        
                        if(newSectionsExist() === true) {
                            Toast.show('Uninitialized sections exist. Please add info to them or remove them', Toast.SHORT);
                        }
                        else if(total_weight > 100){
                            Toast.show('The total weights cannot exceed 100%', Toast.SHORT);
                        }
                        else{
                            const new_class = {
                                ...curr_class,
                                sections: sections
                            }
                            updateClassInProfile(year.id, curr_class.id, new_class);
                            navigation.navigate('Years', {fromClassScreen: true});
                        }
                    }}>
                    <AntDesign name="arrowleft" size={25} color='black'/>
                    </TouchableOpacity>
                </View>
            ),
        });
        setTotal_weight(() => {
            let total = 0;
            sections.map((s) => {
                // console.log('MAP: s.weight:', s.weight);
                if(s.weight != -1 && s.weight != undefined){
                    total += parseInt(parseFloat(s.weight) * 100);
                }
            });
            console.log(`useEffect(): total: ${total}`);
            return total;
        });

        // Keyboard listening to update keyboard_showing state. keyboard_state is used to indicate whether to hide certain views when keyboard is activated. Model taken from https://reactnative.dev/docs/keyboard.
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })

        // console.log(`useEffect(): keyboard_showing: ${keyboard_showing}`);

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        }
        // KeyboardListener(setKeyboard_showing);
        // console.log('useEffect(): sections:', sections);
        // if(sections.length > 0){
        //     console.log(`useEffect(): sections.find((s) => s.id === 0).name: ${sections.find((s) => s.id === 0).name}`);
        //     // console.log('useEffect(): sections[0]', sections[0]);
        //     // profile_context.years.find((y) => y.id === year.id)?.classes.find((c) => c.id === curr_class.id)?.setSections(sections);
        // }
        // console.log(`useEffect(): profile_context current class sections: ${profile_context.years.find((y) => y.id === year.id)?.classes.find((c) => c.id === curr_class.id).sections}`);
    }, [sections, total_weight]);

    return(
        <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            {/* Button that adds sections. */}
            <TouchableOpacity
                style={{marginVertical: '3%'}}
                activeOpacity={0.5}
                onPress={() => {
                    let new_section: SectionContent = {
                        id: findNextID(sections),
                        class_id: curr_class.id,
                        name: '',
                        weight: -1
                    }
                    setSections([
                        ...sections,
                        new_section
                    ]);
                    // setSections([
                    //     ...sections,
                    //     {
                    //         id: findNextID(sections),
                    //         weight: undefined,
                    //         name: ''
                    //     }
                    // ])
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
            <View style={{flex: 2, width: '100%', alignItems: 'center'}}>
                <FlatList
                    style={{width: '90%', flex: 1}}
                    data={sections}
                    keyExtractor={(section) => section.id}
                    removeClippedSubviews={false}
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
                                <SectionView section={section.item} updateSections={chgSectionsHandler}/>
                            </View>
                        );
                    }}
                />
            </View>
            {!keyboard_showing && (total_weight < 100 || total_weight > 100) && (
                <View style={{backgroundColor: 'red', padding: 10, borderRadius: 30}}>
                    <Text style={{fontSize: 40, }}>Total Weight:{' ' + total_weight}%</Text>
                </View>
            )}
            {!keyboard_showing && (total_weight === 100) && (
                <View>
                    <View style={{backgroundColor: '#90EE90', padding: 10, borderRadius: 30}}>
                        <Text style={{fontSize: 40, }}>Total Weight:{' ' + total_weight}%</Text>
                    </View>
                </View>
            )}
            {/* FOOTER */}
            {!keyboard_showing && (
                <Footer/>
            )}
        </View>
    );
}

export default ClassScreen;

const styles = StyleSheet.create({
    section: {
        width: '95%',
        borderWidth: 4,
        // backgroundColor: 'purple',
        borderRadius: 30,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'column'
        // alignItems: 'center'
    },

    inputText: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        borderWidth: 3,
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 5,
        flex: 1,
        alignSelf: 'center'
    }
});