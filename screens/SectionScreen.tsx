/* 
    SectionScreen.tsx
    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for adding assingments and specifying their grades for a specific section in
        question.
*/

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Keyboard } from 'react-native';
import { useProfileContext, AssignmentContent } from '../shared/profile_context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-simple-toast';

import { findNextID } from '../shared/key_functions';
import Footer from '../shared/custom_footer';

/*
NAME

        AssignmentView - a dynamic component that allows the viewing and editing of a section of a given class.
SYNOPSIS

        <View> AssignmentView({assignment})
            assignment --> the assignment object in question to display and edit.
DESCRIPTION

        This component has two states: viewing and editing. In the viewing state, the user can view the section's
        name and its grade. In its editing state is a textInput for the assignment name and a SelectList with an
        accompanying TextInput(s) for the numerator and denominator. The grade could be of type Percentage or Ratio.
        If it is a percentage, the denominator will be 100%, and the numerator has to be a positive integer. If it is
        a ratio, the numerator and the donominator have to be positive integers where the numerator has to be less than
        or equall to the denominator.
RETURNS

        Returns a dynamic View with a viewing and editing state for a given assignment.
*/
const AssignmentView = ({assignment, deleteAssignment}) => {
    // Function will be needed when the name, numerator, or denominator of an assignment is changed.
    const { updateAssignmentInProfile } = useProfileContext();
    // State variables of an assignment that a user can interact and change. Their initial values will be what the assignment object passed in has.
    const[is_editing, setIs_editing] = useState(false);
    const[name, setName] = useState(assignment.name);
    const[type, setType] = useState(assignment.type);
    const[numerator, setNumerator] = useState(assignment.numerator);
    const[denominator, setDenominator] = useState(assignment.denominator);
    
    /*
    NAME

            validInput - a function that validates the input for an assignment.
    SYNOPSIS

            bool validInput()
               
    DESCRIPTION

            The name, numerator, and denominator will be validated. The name will be validated based on
            whether it is an empty string or not after trailing whitespace is taken out. We do not want
            to validate a name that is only whitespace. Then, if the type selected is "Percentage", then
            we will check if a numerator was entered and if it is a positive integer. When the type selected
            is "Ratio", we will validate both the numerator and the denominator the same way.
    RETURNS

            Returns a boolean that returns true if the input is valid and false if it is invalid.
    */
    const validInput = () => {
        if(name.trim() === ''){
            Toast.show('Please enter a name', Toast.SHORT);
            return false;
        }
        // Regardless of the type, validate the numerator.
        if(numerator === -1 || numerator === ''){
            Toast.show('Please enter numerator', Toast.SHORT);
            return false;
        }
        else if(isNaN(numerator)){
            Toast.show('Please enter a numeric numerator. Do not enter any punctuation', Toast.SHORT);
            return false;
        }
        else if(!!numerator.toString().match(/[.]/) === true){
            Toast.show('Please enter an integer for the numerator', Toast.SHORT);
            return false;
        }
        else if(numerator < 0){
            Toast.show('Please enter a numerator greater or equal to 0', Toast.SHORT);
            return false;
        }
        
        if( type=== 'Percentage' && numerator > denominator){
            Toast.show('Percentage cannot be higher than 100', Toast.SHORT);
            return false;
        }
        // If the type is a ratio, then validate both the numerator and denominator
        if(type === 'Ratio'){
            if(denominator === -1 || denominator === ''){
                Toast.show('Please enter denominator', Toast.SHORT);
                return false;
            }
            else if(isNaN(denominator)){
                Toast.show('Please enter a numeric denominator. Do not enter any punctuation', Toast.SHORT);
                return false;
            }
            else if(!!denominator.toString().match(/[.]/) === true){
                Toast.show('Please enter an integer for the denominator', Toast.SHORT);
                return false;
            }
            else if(denominator < 0){
                Toast.show('Please enter a denominator greater or equal to 0', Toast.SHORT);
                return false;
            }
            else if(denominator < numerator){
                Toast.show('Please enter a denominator greater or equal to the numerator', Toast.SHORT);
                return false;
            }
        }
        // Otherwise, all of the tests pass, so the input must be valid. Return true.
        return true;
    }
    
    // Viewing state for assignment component.
    if(!is_editing){
        return(
            <View style={styles.assignmentStyle}>
                <View style={{flexDirection: 'row', flex: 1, width: '100%', alignItems: 'center'}}>
                    <View style={{flexDirection: 'column', paddingLeft: 10}}>
                        {/* Display assignment's name. */}
                        {assignment.name === '' && (
                            <Text style={{fontSize: 25, textAlignVertical: 'center', fontWeight: 'bold'}}>New Assignment</Text>
                        )}
                        {assignment.name !== '' && (
                            <Text style={{fontSize: 25, textAlignVertical: 'center', fontWeight: 'bold'}}>{name}:{'\t\t'}</Text>
                        )}
                        {/* Display assignment's type and the percentage or ratio. */}
                        {type === 'Percentage' && (
                            <Text style={{fontSize: 25, textAlignVertical: 'center'}}>Grade: {((numerator / denominator) * 100).toFixed(2)}%</Text>
                        )}
                        {type === 'Ratio' && (
                            <Text style={{fontSize: 25, textAlignVertical: 'center'}}>Grade: {numerator}/{denominator}</Text>
                        )}
                    </View>
                    {/* Edit button to change name of assignment. */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto', justifyContent: 'center'}}
                        activeOpacity={0.5}
                        onPress={() => {
                            setIs_editing(!is_editing);
                        }}>
                        <AntDesign name="edit" size={50} color='black'/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    // Editing state for assignment.
    else{
        // Array of objects that holds the information to work off of for the SelectList that lets a user select a type for the assignment in question.
        const types = [
            {key: '0', value: 'Percentage'},
            {key: '1', value: 'Ratio'}
        ];

        return(
            <View style={styles.assignmentStyle}>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                    {/* TextInput that changes the name of an assignment in question. */}
                    <TextInput
                        style={styles.inputText}
                        value={name}
                        placeholder="Name"
                        onChangeText={(text) => {
                            setName(text);
                        }}
                    />
                    {/* Done button to update name and/or the type, numerator, and denominator for the assignment in question. */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto', alignSelf: 'center'}}
                        activeOpacity={0.5}
                        onPress={() => {
                            // If the input is valid, then update the state and the global profile context to reflect the changes. Trim the name in both the state and the context so it looks cleaner in the case that the user put trailing and/or leading whitespace.
                            if(validInput() === true){
                                setName(name.trim());
                                // Create a new assignment object based on the old one to reflect possible changes in name, type, numerator, and/or denominator.
                                const new_assignment = {
                                    ...assignment,
                                    name: name.trim(),
                                    type: type,
                                    numerator: numerator,
                                    denominator: denominator
                                }
                                setIs_editing(!is_editing);
                                updateAssignmentInProfile(new_assignment);
                            }
                        }}>
                        <AntDesign name="checkcircleo" size={40} color='green'/>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 2, justifyContent: 'center'}}>
                        {/* SelectList that lets a user select between types "Percentage" and "Ratio". */}
                        <SelectList
                            // Placeholder is type so that the selected type will show after the exam is closed and reopened.
                            placeholder={type}
                            setSelected={(val) => setType(val)}
                            data={types}
                            search={false}
                            save="value"
                            onSelect={() => {
                                // If the user selects "Percentage", then the denominator must be 100.
                                if(type === 'Percentage'){
                                    setDenominator(100);
                                }
                                // If the user selects "Ratio", then make sure that the denominator is uninitialized in the case that the user switches between types.
                                if(type === 'Ratio'){
                                    setDenominator(-1);
                                }
                            }}
                        />
                    </View>
                    {/* If a type is selected, for either type, a numerator TextInput is needed for the user to enter a numerator.  */}
                    {type !== '' && (
                        // TextInput for numerator of an assignment.
                        <View style={{flex: 2, flexDirection: 'row'}}>
                            <TextInput
                                style={styles.inputText}
                                value={numerator}
                                onChangeText={(text) => {
                                    setNumerator(text);
                                }}
                            />
                            <Text style={{fontSize: 30, textAlignVertical: 'center'}}>/</Text>
                        </View>
                    )}
                    {/* If the type is a Percentage, then the denominator should not be entered, as it should be out of 100%. */}
                    {type === 'Percentage' && (
                        <Text style={{flex: 1, fontSize: 25, textAlignVertical: 'center'}}>100%</Text>
                    )}
                    {/* If the type is a Ratio, then another TextInput is needed for the user to enter a denominator. */}
                    {type === 'Ratio' && (
                        // TextInput for denominator of an assignment.
                        <TextInput
                            style={styles.inputText}
                            value={denominator}
                            onChangeText={(text) => {
                                setDenominator(text);
                            }}
                        />
                    )}
                </View>
                {/* Button that deletes a year from a semester. */}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={deleteAssignment}>
                    <AntDesign name="delete" size={50} color={'black'}/>
                </TouchableOpacity>
            </View>
        );
    }
}

/*
NAME

        SectionScreen - a component that handles the UI elements and functionalities associated with the screen responsible for adding and editing assignments within a section.
SYNOPSIS

        <View> SectionScreen({navigation, route})
            navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
            route --> the route object also inherited from the NavigationContainer.

DESCRIPTION

        If the user presses the plus button, a new assignment object will be created, with an accompanying View that can be
        interacted with to edit that object. The object will be updated in state and context.
RETURNS

        Returns View that lets the user add assignments and edit them within a section.
*/
const SectionScreen = ({navigation, route}) => {
    const { addAssignmentToProfile, updateSectionAssignmentsInProfile } = useProfileContext();
    const { section } = route.params;
    
    // Assignments array extracted from section (which is from the route's params) is tied to the state. 
    const[assignments, setAssignments] = useState(section.assignments);

    // Keyboard state flag that will help in tracking whether the keyboard is up or not.
    const[keyboard_showing, setKeyboard_showing] = useState(false);

    useEffect(() => {
        // Keyboard listening to update keyboard_showing state. keyboard_state is used to indicate whether to hide certain views when keyboard is activated. Model taken from https://reactnative.dev/docs/keyboard.
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })
    })

    return(
        <View style={{flex: 1, flexDirection: 'column', marginTop: 10, gap: 10, alignItems: 'center'}}>
            {/* Button that adds an assignment to a section */}
            <TouchableOpacity style={{ height: 75}}
                onPress={() => {
                    // For context, here are the AssignmentContent attributes:
                    // id: Int32
                    // year_id: Int32
                    // semester_id: Int32
                    // class_id: Int32
                    // section_id: Int32
                    // name: string
                    // type: string
                    // numerator: Float
                    // denominator: Float
                    let new_assignment: AssignmentContent = {
                        id: findNextID(assignments),
                        year_id: section.year_id,
                        semester_id: section.semester_id,
                        class_id: section.class_id,
                        section_id: section.id,
                        name: '',
                        type: '',
                        numerator: -1,
                        denominator: -1
                    }
                    // Add this new initialized assignment object to the state and context.
                    const new_assignments = [
                        ...assignments,
                        new_assignment
                    ]
                    setAssignments(new_assignments);
                    addAssignmentToProfile(new_assignment);
                }}>
                <AntDesign name="pluscircleo" size={70} color={'black'}/>
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
                {/* FlatList that holds all of the assignment views for the section in question. */}
                <FlatList
                    style={{width: '90%'}}
                    data={assignments}
                    keyExtractor={(item) => item.id}
                    removeClippedSubviews={false}
                    renderItem={(assignment) => {
                        /*
                        NAME

                                deleteAssignmentFromSection - a function that handles the deletion of an assignment from a section.
                        SYNOPSIS

                                void SectionScreen()
                                
                        DESCRIPTION

                                A new_assignments array is created to be the same as the previous assignments array but without the current 
                                assignment in question (which, would be the assignment to remove). Both the state and the global context are
                                updated with this new_assignments array.
                        RETURNS

                                Returns void.
                        */
                        function deleteAssignmentFromSection(){
                            const new_assignments = assignments.filter((s) => s.id !== assignment.item.id);
                            setAssignments(new_assignments);
                            updateSectionAssignmentsInProfile(section, new_assignments)
                        }
                        // Each item in the FlatList are displayed through an AssignmentView component.
                        return(
                            <AssignmentView assignment={assignment.item} deleteAssignment={deleteAssignmentFromSection}/>
                        );
                    }}
                />
            </View>
            {/* If the keyboard is not up, then show the footer. If the footer is not hidden when the keyboard is brought up, then it will be brought to above the keyboard. */}
            {!keyboard_showing && (
                <Footer navigation={navigation}/>
            )}
        </View>
    );
}

export default SectionScreen;

const styles = StyleSheet.create({
    assignmentStyle: {
        borderWidth: 4,
        borderRadius: 30,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        gap: 10
    }, 

    inputText: {
        textAlign: 'center',
        fontSize: 25,
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        flex: 1
    },
});