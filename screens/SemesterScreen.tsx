import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Keyboard, StyleSheet, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useProfileContext, ClassContent, SectionContent, LetterGradeContent } from '../shared/profile_context';

import { findNextID } from '../shared/key_functions';
import { calculateSectionAverage, calculateClassAverage, calculateClassLetterGrade } from '../shared/calculation_functions';

import Footer from '../shared/custom_footer';
import Toast from 'react-native-simple-toast';
import FlatButton from '../shared/custom_buttons';

const SectionView = ({section, navigation}) => {
    const { profile_context, updateSectionInProfile, getSectionAverageFromProfile } = useProfileContext();
    const[is_editing, setIs_editing] = useState(false);
    console.log(`SectionView(): section.assignments: ${section.assignments}`);
    const[name, setName] = useState(section.name);
    const[assignments, setAssignments] = useState(section.assignments);

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
                    <View style={{flexDirection: 'column'}}>
                        {section.name === '' && (
                            <Text style={{fontSize: 30, fontWeight: 'bold'}}>New Section</Text>
                        )}
                        {section.name !== '' && calculateSectionAverage(assignments) === 'N/A' && (
                            <View>
                                <Text style={{fontSize: 30, fontWeight: 'bold'}}>{section.name}: {calculateSectionAverage(assignments)}</Text>
                                <Text style={{fontSize: 20}}>Section Weight: {section.weight * 100}%</Text>
                            </View>
                        )}
                        {section.name !== '' && calculateSectionAverage(assignments) !== 'N/A' && (
                            <View>
                                <Text style={{fontSize: 30, fontWeight: 'bold'}}>{section.name}: {calculateSectionAverage(assignments) * 100}%</Text>
                                <Text style={{fontSize: 20}}>Section Weight: {section.weight * 100}%</Text>
                            </View>
                        )}
                        {assignments.length === 0 && (
                            <Text style={{fontSize: 20}}>No assignments yet!</Text>
                        )}
                        {assignments.length > 0 && (
                            <View>
                                <Text>Number of assignments: {assignments.length}</Text>
                                {assignments.map((a) => {
                                    console.log(`SectionView(): a.type: ${a.type}`);
                                    if(a.type === 'Ratio') return(
                                        <Text>{a.name}: {a.numerator} / {a.denominator}</Text>
                                    );
                                    else if(a.type === 'Percentage') return(
                                        <Text>{a.name}: {a.numerator}% / {a.denominator}%</Text>
                                    );
                                    else return(
                                        <Text>{a.name}</Text>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                    {/* Edit button for section. */}
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
    const[grading_expanded, setGrading_expanded] = useState(false);
    const[sections_expanded, setSections_expanded] = useState(false);

    // Viewing state for a class.
    if(!is_editing){
        return(
            <View style={styles.classStyle}>
                <View>
                    {/* Top section of SectionView for dropdown functionality and showing class name and class letter grade. */}
                    <TouchableOpacity 
                        style={{flexDirection: 'row'}}
                        activeOpacity={0.5}
                        onPress={() => setIsExpanded(!is_expanded)}>
                        {/* Display class name and letter grade, if possible. */}
                        {name !== '' && (
                            <Text style={{textAlignVertical: 'center', fontSize: 30}}>{name}: {calculateClassLetterGrade(curr_class)}</Text>
                        )}
                        {name === '' && calculateClassLetterGrade(curr_class) === 'N/A' && (
                            <Text style={{textAlignVertical: 'center', fontSize: 30}}>New Class</Text>
                        )}
                        {name === '' && calculateClassLetterGrade(curr_class) !== 'N/A' && (
                            <Text style={{textAlignVertical: 'center', fontSize: 30}}>New Class: {calculateClassLetterGrade(curr_class)}</Text>
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
                    {/* If the ClassView is expanded, display the class info: class grade, sections, section weights, section grades, assignments, and assignment grades.*/}
                    {is_expanded && (
                        <View style={{marginVertical: 10, flex: 1, flexDirection: 'column', gap: 20}}>
                            {/* Print out class average if one can be calculated. */}
                            {sections.length > 0 && calculateClassAverage(sections) === 'N/A' && (
                                <Text style={{fontSize: 20}}>Class Average%: {calculateClassAverage(sections)}</Text>
                            )}
                            {sections.length > 0 && calculateClassAverage(sections) !== 'N/A' && (
                                <Text style={{fontSize: 20}}>Class Average%: {calculateClassAverage(sections) * 100}%</Text>
                            )}
                            {/* Letter grading pane. */}
                            <View style={{backgroundColor: '#BEBEBE', borderRadius: 10, padding: 20}}>
                                <TouchableOpacity style={{flexDirection: 'row', flex: 1}}
                                    onPress={() => {
                                        setGrading_expanded(!grading_expanded);
                                    }}
                                    activeOpacity={0.5}>
                                    <Text style={{fontSize: 28, textAlignVertical: 'center', flex: 1}}>Letter Grading:</Text>
                                    {/* Button to configure letter grades and their thresholds.*/}
                                    <TouchableOpacity
                                        style={{marginRight: 15}}
                                        onPress={() => {
                                            navigation.navigate('Configure Letter Grading', {curr_class: curr_class});
                                        }}>
                                        <AntDesign name="edit" size={45} color='black'/>
                                    </TouchableOpacity>
                                    {!grading_expanded && (
                                        <AntDesign style={{marginLeft: 'auto'}} name="downcircleo" size={45} color="black"/>
                                    )}
                                    {grading_expanded && (
                                        <AntDesign style={{marginLeft: 'auto'}} name="upcircleo" size={45} color="black"/>
                                    )}
                                </TouchableOpacity>
                                {grading_expanded && (
                                    <View style={{flexDirection: 'column', flex: 1}}>
                                        <Text style={{fontSize: 15}}>(Last number is non-inclusive.)</Text>
                                        {curr_class.letter_grading.map((l) => {
                                            return(
                                                <Text style={{fontSize: 20}}>{l.letter}: {l.beg}-{l.end}</Text>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                            {/* Button to add sections and their weights */}
                            <View style={{height: 60}}>
                                <FlatButton
                                    text='Configure Sections'
                                    onPress={() => {
                                        navigation.navigate('Configure Sections', {curr_class: curr_class});
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
    const { profile_context, addClassToProfile } = useProfileContext();
    const { semester } = route.params;

    const[classes, setClasses] = useState(semester.classes);
    // const[classes, setClasses] = useState(profile_context.years.find((y) => y.id === semester.year_id).semesters.find((s) => s.id === semester.id).classes);

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
    }, [classes]);

    return(
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            {/* Button that adds a class to a semester */}
            <TouchableOpacity style={{ height: 75, marginTop: 20, marginBottom: 5}}
                onPress={() => {
                    // Class Data Info:
                    // id: Int32
                    // year_id: Int32
                    // semester_id: Int32
                    // name: string
                    // letter_grading: LetterGradeContent[]
                    // sections: SectionContent[]
                    // Letter Grading Info:
                    // id: Int32,
                    // year_id: Int32
                    // semester_id: Int32
                    // class_id: Int32
                    // letter: string
                    // beg: Int32
                    // end: Int32
                    // const a_grade: LetterGradeContent = {
                    //     id: 0,
                    //     year_id: semester.year_id,
                    //     semester_id: semester.id,
                    //     class_id
                    // }

                    let new_class: ClassContent = {
                        id: findNextID(classes),
                        year_id: semester.year_id,
                        semester_id: semester.id,
                        name: '',
                        letter_grading: [
                            {
                                id: 0,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "A",
                                beg: 94,
                                end: 100
                            },
                            {
                                id: 1,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "A-",
                                beg: 90,
                                end: 94
                            },
                            {
                                id: 2,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "B+",
                                beg: 87,
                                end: 90
                            },
                            {
                                id: 3,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "B",
                                beg: 84,
                                end: 87
                            },
                            {
                                id: 4,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "B-",
                                beg: 80,
                                end: 84
                            },
                            {
                                id: 5,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "C+",
                                beg: 77,
                                end: 80
                            },
                            {
                                id: 6,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "C",
                                beg: 74,
                                end: 77
                            },
                            {
                                id: 7,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "C-",
                                beg: 70,
                                end: 74
                            },
                            {
                                id: 8,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "D+",
                                beg: 67,
                                end: 70
                            },
                            {
                                id: 9,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "D",
                                beg: 65,
                                end: 67
                            },
                            {
                                id: 10,
                                year_id: semester.year_id,
                                semester_id: semester.id,
                                class_id: findNextID(classes),
                                letter: "F",
                                beg: 0,
                                end: 65
                            }
                            // 'A': [90, 100],
                            // 'B': [80, 89],
                            // 'C': [70, 79],
                            // 'D': [65, 69],
                            // 'F': [0, 65]
                        ],
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