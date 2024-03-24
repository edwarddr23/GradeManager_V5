import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Keyboard, StyleSheet, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useProfileContext, ClassContent, SectionContent } from '../shared/profile_context';

import { findNextID } from '../shared/key_functions';
import Footer from '../shared/custom_footer';
import Toast from 'react-native-simple-toast';
import FlatButton from '../shared/custom_buttons';

const SectionView = ({section, navigation}) => {
    const { updateSectionInProfile } = useProfileContext();
    const[is_editing, setIs_editing] = useState(false);
    // console.log(`SectionView(): section: ${section.name}`);
    const[name, setName] = useState(section.name);
    // const[weight, setWeight] = useState(section.weight * 100);

    return(
        <View style={styles.section}>
            {/* Viewing state of section. */}
            {!is_editing && (
                <TouchableOpacity style={{flexDirection: 'row'}}
                    onPress={() => {
                        console.log(`Clicked on a section!`);
                        console.log(`section.assignments.length: ${section.assignments.length}`);
                        navigation.navigate('Section', {section: section});
                    }}>
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
                </TouchableOpacity>
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
                    {/* Done button to change the name of a section. */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto', alignSelf: 'center'}}
                        onPress={() => {
                            const inputIsValid = () => {
                                if(name === ''){
                                    Toast.show('Please enter name', Toast.SHORT);
                                    return false;
                                }
                                return true;
                            }

                            if(inputIsValid() === true){
                                const new_section = {
                                    ...section,
                                    name: name
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

const ClassView = ({curr_class, navigation}) => {
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
            <View style={styles.classStyle}>
                <View>
                    <TouchableOpacity 
                    style={{flexDirection: 'row'}}
                    activeOpacity={0.5}
                    onPress={() => setIsExpanded(!is_expanded)}>
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
                    </TouchableOpacity>
                    {is_expanded && (
                        <View style={{marginVertical: 10, flex: 1, flexDirection: 'column'}}>
                            <View style={{height: 60, marginVertical: 20}}>
                                <FlatButton
                                    text='Configure Sections'
                                    onPress={() => {
                                        // console.log();
                                        navigation.navigate('Sections', {curr_class: curr_class});
                                    }}
                                />
                            </View>
                            {sections.length > 0 && (
                                <View style={{flex: 1}}>
                                    {sections.map((s) => {
                                        return(
                                            <SectionView key={s.id} section={s} navigation={navigation}/>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>
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
            <TouchableOpacity style={{ height: 75, marginTop: 20, marginBottom: 5}}
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
                    setClasses(newClasses);
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
                            <ClassView curr_class={curr_class.item} navigation={navigation}/>
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

const styles = StyleSheet.create({
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
        marginHorizontal: 10,
        flex: 1
    },

    section: {
        padding: 20,
        backgroundColor: '#BEBEBE',
        borderRadius: 20,
        marginBottom: 20
    }
});