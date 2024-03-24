import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Keyboard, StyleSheet, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useProfileContext, ClassContent, SectionContent } from '../shared/profile_context';

import { findNextID } from '../shared/key_functions';
import Footer from '../shared/custom_footer';
import Toast from 'react-native-simple-toast';

const SectionView = ({section}) => {
    const { updateSectionInProfile } = useProfileContext();
    const[is_editing, setIs_editing] = useState(false);
    // console.log(`SectionView(): section: ${section.name}`);
    const[name, setName] = useState(section.name);
    const[weight, setWeight] = useState(section.weight);

    return(
        <View style={styles.section}>
            {/* Viewing state of section. */}
            {!is_editing && (
                <View style={{flexDirection: 'row'}}>
                    {section.name === '' && (
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>New Section</Text>
                    )}
                    {section.name !== '' && (
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>{section.name}: {section.weight * 100}%</Text>
                    )}
                    <TouchableOpacity
                        style={{marginLeft: 'auto'}}
                        onPress={() => setIs_editing(!is_editing)}>
                        <AntDesign name='edit' size={45} color='black'/>
                    </TouchableOpacity>
                </View>
            )}
            {/* Editing state of section. */}
            {is_editing && (
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={styles.inputText}
                        value={name}
                        placeholder="Name"
                        onChangeText={text => {
                            setName(text);
                        }}
                    />
                    <TextInput
                        style={styles.inputText}
                        value={weight}
                        placeholder="Weight"
                        onChangeText={text => {
                            setWeight(text);
                        }}
                        keyboardType='numeric'
                    />
                    {/* Done button to change the name of a section. */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto', alignSelf: 'center'}}
                        onPress={() => {
                            const inputIsValid = () => {
                                if(name === '' && weight === -1 || weight === ''){
                                    return true;
                                }
                                else if(name === ''){
                                    Toast.show('Please enter name', Toast.SHORT);
                                    return false;
                                }
                                else if(weight === -1 || weight === ''){
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
                                const new_section = {
                                    ...section,
                                    name: name,
                                    weight: weight / 100,
                                };
                                updateSectionInProfile(new_section);
                                setIs_editing(!is_editing);
                            }
                        }}>
                        <AntDesign name='checkcircleo' size={45} color='green'/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const ClassView = ({curr_class}) => {
    // console.log(`ClassView: curr_class: ${curr_class.id}`);
    const { updateClassInProfile, addSectionToProfile } = useProfileContext();
    // id: findNextID(classes),
    // year_id: semester.year_id,
    // semester_id: semester.id,
    // name: 'New Class',
    // sections: []
    const[name, setName] = useState(curr_class.name);
    const[sections, setSections] = useState(curr_class.sections);

    const[is_editing, setIs_editing] = useState(false);
    const[is_expanded, setIsExpanded] = useState(false);

    // Viewing state for a class.
    if(!is_editing){
        return(
            <TouchableOpacity style={styles.classStyle}
                activeOpacity={0.5}
                onPress={() => setIsExpanded(!is_expanded)}>
                <View>
                    <View style={{flexDirection: 'row'}}>
                        {name !== '' && (
                            <Text style={{textAlignVertical: 'center', fontSize: 30}}>{name}</Text>
                        )}
                        {name === '' && (
                            <Text style={{textAlignVertical: 'center', fontSize: 30}}>New Class</Text>
                        )}
                        {/* Edit button for class. */}
                        <TouchableOpacity
                            style={{marginLeft: 'auto'}}
                            activeOpacity={0.5}
                            onPress={() => {
                                setIs_editing(true);
                            }}>
                            <AntDesign name="edit" size={50} color='black'/>
                        </TouchableOpacity>
                        {!is_expanded && (
                            <AntDesign style={{marginLeft: 10}} name="downcircleo" size={50} color='black'/>
                        )}
                        {is_expanded && (
                            <AntDesign style={{marginLeft: 10}} name="upcircleo" size={50} color='black'/>
                        )}
                    </View>
                    {is_expanded && (
                        <View style={{marginVertical: 10}}>
                            {/* Button that adds a section. */}
                            <TouchableOpacity
                                style={{marginBottom: 20, alignSelf: 'center'}}
                                activeOpacity={0.5}
                                onPress={() => {
                                    // id: Int32,
                                    // year_id: Int32
                                    // semester_id: Int32
                                    // class_id: Int32
                                    // name: string
                                    // weight: Float
                                    // average: Float
                                    // assignments: AssignmentContent[]
                                    const new_section: SectionContent = {
                                        id: findNextID(sections),
                                        year_id: curr_class.year_id,
                                        semester_id: curr_class.semester_id,
                                        class_id: curr_class.id,
                                        name: '',
                                        weight: -1,
                                        average: -1,
                                        assignments: []
                                    }
                                    setSections([
                                        ...sections,
                                        new_section
                                    ]);
                                    addSectionToProfile(new_section);
                                }}>
                                <AntDesign name="pluscircleo" size={55} color='black'/>
                            </TouchableOpacity>
                            {sections.length === 0 && (
                                <Text style={{textAlign: 'center'}}>Press this button to add sections</Text>
                            )}
                            {sections.length > 0 && (
                                <View>
                                    {sections.map((s) => {
                                        return(
                                            <SectionView section={s}/>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }
    // Editing state for a class.
    else{
        return(
            <View style={styles.classStyle}>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={styles.inputText}
                        value={name}
                        placeholder="Name"
                        onChangeText={text => {
                            setName(text);
                        }}
                    />
                    {/* Done Button to change name of class. */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto'}}
                        activeOpacity={0.5}
                        onPress={() => {
                            const new_class = {
                                ...curr_class,
                                name: name
                            }
                            updateClassInProfile(new_class);
                            setIs_editing(false);
                        }}>
                        <AntDesign name="checkcircleo" size={50} color='green'/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const SemesterScreen = ({navigation, route}) => {
    const { addClassToProfile } = useProfileContext();
    const { semester } = route.params;

    const[classes, setClasses] = useState(semester.classes);

    const[keyboard_showing, setKeyboard_showing] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: `${semester.season} ${semester.year}`
        })
        // Keyboard listening to update keyboard_showing state. keyboard_state is used to indicate whether to hide certain views when keyboard is activated. Model taken from https://reactnative.dev/docs/keyboard.
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })
    });

    return(
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            {/* Button that adds a class to a semester */}
            <TouchableOpacity style={{marginTop: 20, marginBottom: 5}}
                onPress={() => {
                    let new_class: ClassContent = {
                        id: findNextID(classes),
                        year_id: semester.year_id,
                        semester_id: semester.id,
                        name: '',
                        sections: []
                    };
                    const newClasses = [
                        ...classes,
                        new_class
                    ]
                    // console.log(`ADD BUTTON: year.id: ${year.id}`);
                    console.log(`ADD BUTTON: LOOP`);
                    newClasses.map((c) => {
                        console.log(`c.id: ${c.id}`);
                    });
                    addClassToProfile(new_class);
                }}>
                <AntDesign name="pluscircleo" size={70} color={'black'}/>
            </TouchableOpacity>
            {classes.length === 0 && (
                <Text style={{fontSize: 30}}>Add classes</Text>
            )}
            <View style={{flex: 1, alignItems: 'center', marginTop: 20, width: '100%'}}>
                <FlatList
                    style={{width: '90%'}}
                    data={classes}
                    keyExtractor={(item, index) => item.id}
                    removeClippedSubviews={false}
                    renderItem={(curr_class) => {
                        return(
                            <ClassView curr_class={curr_class.item}/>
                        );
                    }}
                />
            </View>
            {/* FOOTER */}
            {!keyboard_showing && (
                <Footer/>
            )}
        </View>
    );
}

export default SemesterScreen;

const styles= StyleSheet.create({
    classStyle: { 
        //   alignItems: 'center',
        borderWidth: 4,
        borderRadius: 30,
        padding: 10,
        marginBottom: 10
        //   flexDirection: 'row',
        // gap: 10
        // backgroundColor: 'purple',
        // width: '95%'
    }, 

    inputText: {
        // height: 10,
        // margin: 12,
        textAlign: 'center',
        fontSize: 25,
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        flex: 1
      },

      section: {
        padding: 20,
        backgroundColor: '#BEBEBE',
        borderRadius: 20,
        marginBottom: 20
      }
});