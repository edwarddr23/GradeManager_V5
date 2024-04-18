/* 
    SemesterScreen.tsx
    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for adding classes within a semester and editing their names. Buttons to edit
        other properties of the class will direct the user to another screen (which is really
        another component).
*/

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Keyboard, StyleSheet, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useProfileContext, ClassContent } from '../shared/profile_context';

import { findNextID } from '../shared/key_functions';
import { calculateSectionAverage, calculateClassAverage, calculateClassLetterGrade, calculateExpectedSectionAverage, calculateExpectedClassAverage, calculateExpectedClassLetterGrade } from '../shared/calculation_functions';

import Footer from '../shared/custom_footer';
import Toast from 'react-native-simple-toast';
import FlatButton from '../shared/custom_buttons';

/*
NAME

    SectionView - a dynamic component that allows the viewing and editing of a section from a given class.
SYNOPSIS

    <View> SectionView({semester, section, curr_class, navigation})
        semester --> the semester object the current section in question is a child of.
        section --> the section object in question to display and edit.
        curr_class --> the class object the current section in question is a child of.
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
            
DESCRIPTION

    This component has two states: viewing and editing. In the viewing state, the user can view the section's
    name, average, expected average, relative weight, and assignments. The edit button can change the name of
    the section, and pressing the SectionView itself will lead to the SectionScreen component, which allows for
    more customizability of the section in question.

RETURNS

    Returns a dynamic View with a viewing and editing state for a given section.
*/
const SectionView = ({semester, curr_class, section, navigation}) => {
    // Context function to update the current section within the global profile context.
    const { updateSectionInProfile } = useProfileContext();
    // State variables that track the changes the user makes to the current section in question.
    const[is_editing, setIs_editing] = useState(false);
    const[name, setName] = useState(section.name);
    const[assignments, setAssignments] = useState(section.assignments);

    /*
    NAME

        renderSectionName - a functional component that renders the name for a section depending on what the value is in context.
    
    SYNOPSIS

        <View> renderSectionName()

    DESCRIPTION

        The View component returned will have a Text component that will vary depending on whether the name of the section is
        initialized or not. If the name is initialized, then it will print the name. If not, then it will print "New Sectiion".

    RETURNS

        Returns a View that holds a Text component, which displays the section's name, or "New Section".
    */
    const renderSectionName = () => {
        return(
            <View>
                {section.name === '' && (
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>New Section</Text>
                )}
                {section.name !== '' && (
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>{section.name}</Text>
                )}
            </View>
        );
    }

    /*
    NAME

        renderCalculatedSectionAverage - a functional component that renders the calculated average for a section depending on what the assignments are in context.
    
    SYNOPSIS

        <View> renderCalculatedSectionAverage()

    DESCRIPTION

        The View component returned will have a Text component that will vary depending on whether the section's average can be calculated
        or not. When it can be calculated, display a percentage. Otherwise, just display the "N/A" the calculateSectionAverage() function
        returns.

    RETURNS

        Returns a View that holds a Text component, which displays the section's calculated average, or "N/A".
    */
    const renderCalculatedSectionAverage = () => {
        return(
            <View>
                {/* If a section's calculated average cannot be determined, just display the "N/A" returned */}
                {calculateSectionAverage(assignments) === 'N/A' && (
                    <Text style={{fontSize: 20, textDecorationLine: 'underline'}}>Section Average: {calculateSectionAverage(assignments)}</Text>
                )}
                {/* If a section's calculated average can be determined, display it as a percentage. */}
                {calculateSectionAverage(assignments) !== 'N/A' && (
                    <Text style={{fontSize: 20, textDecorationLine: 'underline'}}>Section Average: {(calculateSectionAverage(assignments) * 100).toFixed(2)}%</Text>
                )}
            </View>
        );
    }

    /*
    NAME

        renderExpectedSectionAverage - a functional component that renders the expected average for a section depending on what the assignments are in context.
    
    SYNOPSIS

        <View> renderExpectedSectionAverage()

    DESCRIPTION

        The View component returned will have a Text component that will vary depending on whether the section's expected average can be calculated
        or not. When it can be calculated, display a percentage. Otherwise, just display the "N/A" the calculateSectionAverage() function
        returns.

    RETURNS

        Returns a View that holds a Text component, which displays the section's expected average, or "N/A".
    */
    const renderExpectedSectionAverage = () => {
        return(
            <View>
                {/* If a section's expected average cannot be determined, just display the "N/A" returned */}
                {calculateExpectedSectionAverage(assignments) === 'N/A' && (
                    <Text style={{fontSize: 20, textDecorationLine: 'underline'}}>Expected Average: {calculateExpectedSectionAverage(assignments)}</Text>
                )}
                {/* If a section's expected average can be determined, display it as a percentage. */}
                {calculateExpectedSectionAverage(assignments) !== 'N/A' && (
                    <Text style={{fontSize: 20, textDecorationLine: 'underline'}}>Expected Average: {(calculateExpectedSectionAverage(assignments) * 100).toFixed(2)}%</Text>
                )}
            </View>
        );
    }

    /*
    NAME

        renderSectionWeight - a functional component that renders the relative weight of the current section in question.
    
    SYNOPSIS

        <Text> renderSectionWeight()
        
    DESCRIPTION

        If the section's weight is uninitialized (is equal to -1), then return the section weight as "N/A". Otherwise,
        display the section's weight as a percentage.

    RETURNS

        Returns a Text component that displays the assignment information, depending on what in that assignment object in context is initialized.
    */
    const renderSectionWeight = () => {
        if(section.weight !== -1) return(
            // The section's weight needs to have operations performed on it as the weights in context are recorded as decimals rather than percentages (e.g. 0.3 instead of 30%).
            <Text style={{fontSize: 20}}>Section Weight: {(section.weight * 100).toFixed(0)}%</Text>
        );
        return <Text style={{fontSize: 20}}>Section Weight: N/A</Text>
    }

    /*
    NAME

        renderSectionAssignments - a functional component that renders a Text component or a View with multiple Text components depending on how many assignments are in the current section in question.
    
    SYNOPSIS

        <Text> or <View> renderSectionAssignments()
        
    DESCRIPTION

        If the section has no assignments, then a Text component that says that there are no assignments will be returned. If there
        are assignments in the current section in question, then return a View component that iterates through each assignment

    RETURNS

        Returns a Text component that displays the assignment information, depending on what in that assignment object in context is initialized.
    */
    const renderSectionAssignments = () => {
        if(assignments.length === 0) return (
            <Text style={{fontSize: 20}}>No assignments yet!</Text>
        )
        return (
            <View>
                <Text style={{fontSize: 20}}>Assignments:</Text>
                {/* The Text component returned will vary based on several factors. If the assignment in question
                has a type, then there must be a name (as the validation when editing a section in the SectionScreen
                component requires a name to be specified when a type is specified). Therefore, display the name and
                the numerator and denominator. If the type is a ratio, just display the numerator and denominator as
                themselves, and when the type is a percentage, then put a % sign next to both values. If there is no
                type specified, then there is no numerator or denominator. Display "N/A" for the numerator and denominator.
                If the section name in context is uninitialized (is ''), then display "New Assignment". */}
                {assignments.map((a) => {
                    if(a.type === 'Ratio') return(
                        <Text key={a.id}>{a.name}: {a.numerator} / {a.denominator}</Text>
                    );
                    else if(a.type === 'Percentage') return(
                        <Text key={a.id}>{a.name}: {a.numerator}% / {a.denominator}%</Text>
                    );
                    else if(a.name !== '') return (
                        <Text key={a.id}>{a.name}: N/A</Text>
                    );
                    else if(a.name === '') return (
                        <Text key={a.id}>New Assignment</Text>
                    );
                })}
            </View>
        );
    }

    return(
        <View style={styles.section}>
            {/* Viewing state of section. */}
            {!is_editing && (
                <TouchableOpacity style={{flexDirection: 'row'}}
                    // Pressing on the section component will send the user to another screen, which lets them edit more of the section in question.
                    onPress={() => {
                        navigation.navigate('Section', {semester: semester, section: section, curr_class: curr_class});
                    }}>
                    <View>
                        {/* Display the name, calculated average, expected average, the relative weight, and the assignments of the section in question. */}
                        { renderSectionName() }
                        { renderCalculatedSectionAverage() }
                        { renderExpectedSectionAverage() }
                        { renderSectionWeight() }
                        { renderSectionAssignments() }
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
                            // If the name entered is currently empty, then do not let the user enter exit the editing state and notify them that they need to enter a name.
                            if(name.trim() === ''){
                                Toast.show('Please enter name', Toast.SHORT);
                                return;
                            }
                            // Otherwise, then trim the name entered and change the name in state and in the global profile context.
                            setName(name.trim());
                            const new_section = {
                                ...section,
                                name: name.trim()
                            };
                            updateSectionInProfile(new_section);
                            // Change the state of the View returned by SectionView to its viewing state.
                            setIs_editing(!is_editing);
                        }}>
                        <AntDesign name='checkcircleo' size={45} color='green'/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

/*
NAME

    ClassView - a dynamic component that allows the viewing and editing of a given class within a semester.
SYNOPSIS

    <View> ClassView = ({semester, curr_class, deleteClass, navigation})
        semester --> the semester object the current section in question is a child of.
        curr_class --> the class object in question to display and edit.
        deleteClass --> a function component to handle the deletion of a class from the parent component SemesterScreen.
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
            
DESCRIPTION

    This component has two states: viewing and editing. In the viewing state, the user can view the class's letter
    grade, calculated average, expected letter grade, expected average, letter grading, sections, and each section's
    assignments. The editing state allows the user to edit the name of the class in question. Buttons and views within
    the ClassView component allow for the editing of properties of the class.

RETURNS

    Returns a dynamic View with a viewing and editing state for a given class.
*/
const ClassView = ({semester, curr_class, deleteClass, navigation}) => {
    // Object profile_context and function updateClassInProfile are extracted from the global context to keep global context updated and the page responsive even when navigating back to this screen or when the sections within a class change.
    const { profile_context, updateClassInProfile } = useProfileContext();
    // State variables that handle the changing of certain properties of a class within this screen.
    const[name, setName] = useState(curr_class.name);
    const[sections, setSections] = useState(curr_class.sections);
    const[letter_grading, setLetter_grading] = useState(curr_class.letter_grading);

    // State variables that handle the behaviors of the state returned by the ClassView component.
    const[is_editing, setIs_editing] = useState(false);
    const[is_expanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // navigation.addListener('focus', () => {
        //     setSections(profile_context.years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id).classes.find((c) => c.id === curr_class.id).sections);
        // })
        // setLetter_grading(profile_context.years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id).classes.find((c) => c.id === curr_class.id).letter_grading);
    }, [])

    /*
    NAME

        renderCalculatedClassAverage - a function component that renders the calculated class average of the current class in question.
    
    SYNOPSIS

        void renderCalculatedClassAverage()

    DESCRIPTION

        This function component will display either the calculated class average as a proper decimal to 2 decimal places or as "N/A" if
        a calculated average for the class cannot be calculated with the information from its child assignments.

    RETURNS

        Returns a Text component that displays the calculated class average or "N/A".
    */
    const renderCalculatedClassAverage = () => {
        if(calculateClassAverage(sections) === 'N/A') return (
            <Text style={{fontSize: 20}}>Class Average%: {calculateClassAverage(sections)}</Text>
        );
        return (
            <Text style={{fontSize: 20}}>Class Average%: {(calculateClassAverage(sections) * 100).toFixed(2)}%</Text>
        )
    }

    /*
    NAME

        renderExpectedClassAverage - a function component that renders the expected class average of the current class in question.
    
    SYNOPSIS

        void renderExpectedClassLetterGrade()

    DESCRIPTION

        This function component will display either the expected class average as a proper decimal to 2 decimal places or as "N/A" if
        an expected average for the class cannot be calculated with the information from its child assignments.

    RETURNS

        Returns a Text component that displays the expected class average or "N/A".
    */
    const renderExpectedClassAverage = () => {
        if(calculateExpectedClassAverage(sections) === 'N/A') return (
            <Text style={{fontSize: 20}}>Expected Average%: {calculateExpectedClassAverage(sections)}</Text>
        )
        return(
            <Text style={{fontSize: 20}}>Expected Average%: {(calculateExpectedClassAverage(sections) * 100).toFixed(2)}%</Text>
        )
    }

    // State variables that handle the expanding and collapsing of the letter grading view.
    const[grading_expanded, setGrading_expanded] = useState(false);
    /*
    NAME

        renderClassLetterGrading - a function component that renders the letter grading thresholds of the current class in question.
    
    SYNOPSIS

        <View> renderClassLetterGrading()

    DESCRIPTION

        This function component will render a dynamic View component that has an expanded and unexpanded
        state. In its unexpanded state, it just shows its header, which says "Letter Grading". When the header
        (which is the only part of the View visible in its editing state) is pressed, the View is expanded,
        and will show the each letter grade and their respective ranges. There is also an edit button that allows
        the user to configure the letter grading thresholds for the current class in question.

    RETURNS

        Returns a dynamic View component which has an expanded or unexpanded state.
    */
    const renderClassLetterGrading = () => {
        return(
            <View style={styles.letterGrading}>
                {/* Top pressable part of the letter grading View component that lets the user view or edit the letter grading thresholds for a given class. It can be expanded or minimized to reduce clutter. */}
                <TouchableOpacity style={{flexDirection: 'row', gap: 10}}
                    onPress={() => setGrading_expanded(!grading_expanded)}
                    activeOpacity={0.5}>
                    <Text style={{flex: 1, fontSize: 28, textAlignVertical: 'center'}}>Letter Grading:</Text>
                    {/* Button to configure letter grades and their thresholds.*/}
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Configure Letter Grading', {semester: semester, curr_class: curr_class})}}>
                        <AntDesign name="edit" size={45} color='black'/>
                    </TouchableOpacity>
                    {/* Render the up arrow icon or down arrow icon depending on whether the ClassView is expanded or not. If it is not expanded, set it to the down icon. If it is expanded, set it to the up icon. */}
                    {!grading_expanded && (
                        <AntDesign style={{marginLeft: 'auto'}} name="downcircleo" size={45} color="black"/>
                    )}
                    {grading_expanded && (
                        <AntDesign style={{marginLeft: 'auto'}} name="upcircleo" size={45} color="black"/>
                    )}
                </TouchableOpacity>
                {/* Display each letter grade's thresholds when the letter grading component is expanded. */}
                {grading_expanded && (
                    <View>
                        <Text style={{fontSize: 15}}>(Last number is non-inclusive.)</Text>
                        {letter_grading.map((l) => {
                            return(
                                <Text key={l.id} style={{fontSize: 20}}>{l.letter}: {l.beg}-{l.end}</Text>
                            );
                        })}
                    </View>
                )}
            </View>
        );
    }

    /*
    NAME

        renderClassSections - a function component that renders the sections of the current class in question.
    
    SYNOPSIS

        <View> renderClassSections()

    DESCRIPTION

        This function component will render a View that will vary based on how many sections are
        iterated through when mapping through the sections state array. Each section found in the sections
        state array will have a respective SectionView component created from it, allowing the user to view
        and edit the section in question.

    RETURNS

        Returns a View that programmatically displays the sections of a class.
    */
    const renderClassSections = () => {
        if(sections.length > 0) return (
            <View>
                {sections.map((s) => {
                    return(
                        <SectionView key={s.id} semester={semester} curr_class={curr_class} section={s} navigation={navigation}/>
                    );
                })}
            </View>
        )
    }

    /*
    NAME

        renderClassArrowIcon - a function component that renders the up or down icon for a class.
    
    SYNOPSIS

        <AntDesign> renderClassArrowIcon()

    DESCRIPTION

        This function component will render an AntDesign component that is a down circle or
        up circle icon if the class is collapsed and expanded, respectively. This is short and
        simple, but is used multiple times as it must be called for both the viewing and editing
        states of the top section of the ClassView, so this has its own function component.

    RETURNS

        Returns an AntDesign component which has an up circle or down circle icon.
    */
    const renderClassArrowIcon = () => {
        if(!is_expanded) return (
            <AntDesign style={{marginLeft: 10}} name="downcircleo" size={50} color='black'/>
        );
        return (
            <AntDesign style={{marginLeft: 10}} name="upcircleo" size={50} color='black'/>
        );
    }

    return(
        <View style={styles.classStyle}>
            {/* Top section of SectionView for dropdown functionality and showing class name and class letter grade. */}
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setIsExpanded(!is_expanded)}>
                {/* Viewing state of top section of SectionView. */}
                {!is_editing && (
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{flex: 1}}>
                            {/* Display class name and letter grade, if possible. */}
                            {name !== '' && (
                                <Text style={{textAlignVertical: 'center', fontSize: 30, flex: 1, flexWrap: 'wrap'}}>{name}: {calculateClassLetterGrade(curr_class)}</Text>
                            )}
                            {name === '' && calculateClassLetterGrade(curr_class) === 'N/A' && (
                                <Text style={{textAlignVertical: 'center', fontSize: 30, flex: 1, flexWrap: 'wrap'}}>New Class</Text>
                            )}
                            {name === '' && calculateClassLetterGrade(curr_class) !== 'N/A' && (
                                <Text style={{textAlignVertical: 'center', fontSize: 30, flex: 1, flexWrap: 'wrap'}}>New Class: {calculateClassLetterGrade(curr_class)}</Text>
                            )}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            {/* Edit button for class, which changes the state of the top section of SectionView to its editing state. */}
                            <TouchableOpacity
                                style={{marginLeft: 'auto'}}
                                activeOpacity={0.5}
                                onPress={() => {
                                    setIs_editing(true);
                                }}>
                                <AntDesign name="edit" size={50} color='black'/>
                            </TouchableOpacity>
                        </View>
                        {/* Render the up arrow icon or down arrow icon depending on whether the ClassView is expanded or not. If it is not expanded, set it to the down icon. If it is expanded, set it to the up icon. */}
                        { renderClassArrowIcon() }
                    </View>
                )}
                {/* Editing state of top section of SectionView. */}
                {is_editing && (
                    <View style={{alignItems: 'center', gap: 10}}>
                        <View style={{flexDirection: 'row'}}>
                            {/* TextInput that allows the name of the current class in question to be changed. */}
                            <TextInput
                                style={styles.inputText}
                                value={name}
                                placeholder="Name"
                                onChangeText={text => {
                                    setName(text);
                                }}
                            />
                            {/* Done Button to change name of class, which also changes the state of the top section of SectionView to its viewing state. */}
                            <TouchableOpacity
                                style={{marginLeft: 'auto'}}
                                activeOpacity={0.5}
                                onPress={() => {
                                    // A copy of the old curr_class object is made, changing only the name.
                                    const new_class = {
                                        ...curr_class,
                                        name: name
                                    }
                                    // Update the global context to reflect the name change.
                                    updateClassInProfile(new_class);
                                    setIs_editing(false);
                                }}>
                                <AntDesign name="checkcircleo" size={50} color='green'/>
                            </TouchableOpacity>
                            {/* Render the up arrow icon or down arrow icon depending on whether the ClassView is expanded or not. If it is not expanded, set it to the down icon. If it is expanded, set it to the up icon. */}
                            { renderClassArrowIcon() }
                        </View>
                        {/* Button that deletes a year from a semester. */}
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => deleteClass(curr_class)}>
                            <AntDesign name="delete" size={50} color={'black'}/>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
            {/* If the ClassView is expanded, display the class info: class grade, sections, section weights, section grades, assignments, and assignment grades.*/}
            {is_expanded && (
                <View style={{marginVertical: 10, flex: 1, flexDirection: 'column', gap: 20}}>
                    {/* Print out class average if one can be calculated. */}
                    { renderCalculatedClassAverage() }
                    <View>
                        {/* Render the expected letter grade */}
                        <Text style={{fontSize: 20}}>Expected Letter Grade: {calculateExpectedClassLetterGrade(curr_class)}</Text>
                        { renderExpectedClassAverage() }
                    </View>
                    {/* Expandable letter grading component that displays the letter grade thresholds. */}
                    { renderClassLetterGrading() }
                    {/* Button to add sections and their weights */}
                    <View style={{height: 60}}>
                        <FlatButton
                            text='Configure Sections'
                            onPress={() => { navigation.navigate('Configure Sections', {curr_class: curr_class}) }}
                        />
                    </View>
                    { renderClassSections() }
                </View>
            )}
        </View>
    );
}

const SemesterScreen = ({navigation, route}) => {
    const { profile_context, addClassToProfile, updateSemesterClassesInProfile } = useProfileContext();
    const { semester } = route.params;

    const[classes, setClasses] = useState(semester.classes);
    // const[classes, setClasses] = useState(profile_context.years.find((y) => y.id === semester.year_id).semesters.find((s) => s.id === semester.id).classes);

    const[keyboard_showing, setKeyboard_showing] = useState(false);

    useEffect(() => {
        setClasses(profile_context.years.find((y) => y.id === semester.year_id).semesters.find((s) => s.id === semester.id).classes);
        navigation.setOptions({
            title: `${semester.season} ${semester.year}`,
            headerLeft: () => (
                <View style={{marginRight: 20}}>
                    <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        console.log('SemesterScreen.tsx: CUSTOM BACK BUTTON');
                        navigation.navigate('Years', {fromClassScreen: true});
                    }}>
                    <AntDesign name="arrowleft" size={25} color='black'/>
                    </TouchableOpacity>
                </View>
            )
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
                    const initialLetterGrading = () => {
                        const letters = {
                            "A": [94, 100],
                            "A-": [90, 94],
                            "B+": [87, 90],
                            "B": [84, 87],
                            "B-": [80, 84],
                            "C+": [77, 80],
                            "C": [74, 77],
                            "C-": [70, 74],
                            "D+": [67, 70],
                            "D": [65, 67],
                            "F": [0, 65]
                        };
                        let init_letter_grading = [];
                        for(const [key, value] of Object.entries(letters)){
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
                            init_letter_grading.push(
                                {
                                    id: findNextID(init_letter_grading),
                                    year_id: semester.year_id,
                                    semester_id: semester.id,
                                    class_id: findNextID(classes),
                                    letter: key,
                                    beg: value[0],
                                    end: value[1]
                                }
                            )
                        }
                        return init_letter_grading;
                    }

                    // Class Data Info:
                    // id: Int32
                    // year_id: Int32
                    // semester_id: Int32
                    // name: string
                    // letter_grading: LetterGradeContent[]
                    // sections: SectionContent[]
                    let new_class: ClassContent = {
                        id: findNextID(classes),
                        year_id: semester.year_id,
                        semester_id: semester.id,
                        name: '',
                        letter_grading: initialLetterGrading(),
                        sections: []
                    };
                    const newClasses = [
                        ...classes,
                        new_class
                    ]
                    setClasses(newClasses);
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
                        const deleteClassInSemester = (class_to_remove) => {
                            const new_classes = classes.filter((c) => c.id !== class_to_remove.id);
                            setClasses(new_classes);
                            updateSemesterClassesInProfile(semester, new_classes);
                        }
                        return(
                            <ClassView semester={semester} curr_class={curr_class.item} deleteClass={deleteClassInSemester} navigation={navigation}/>
                        );
                    }}
                />
            </View>
            {/* FOOTER */}
            {!keyboard_showing && (
                <Footer navigation={navigation}/>
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
        marginBottom: 10,
        // alignItems: 'center',
        gap: 15
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
    },

    letterGrading: {
        backgroundColor: '#BEBEBE',
        borderRadius: 10,
        padding: 20
    }
});