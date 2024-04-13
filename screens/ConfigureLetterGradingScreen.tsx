import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useProfileContext } from '../shared/profile_context';

import { validPositiveIntInputs } from '../shared/input_validation_functions';

/*
NAME

        LetterGradeView - a component that represents a specific letter grade which displays a letter, and its range of values, defining a beginning and end value. It is assumed that only integer values should be the beginning and end ranges.

SYNOPSIS

        <View> LetterGradeView({Object letter_grade})
            letter_grade --> the letter grade object (with the letter, the beginning, and end number range) to be displayed and possibly modified.

DESCRIPTION

        This component will return a View representing Object of type LetterGradeContent 
        letter_grade which the user can interact with. The View has a viewing and editing
        state. In viewing mode, the user can see the letter, beginning, and end range.
        In the editing mode, the user can modify the beginning and end range using TextInputs.
        When the user presses the green done button in editing mode, the changed beginning
        and end range is saved in both the state and the global profile object accessed through
        context. The corresponding letter grade in its respective hierarchy withing the profile
        context is edited by the function updateLetterGradeInProfile().

RETURNS

        Returns a View that displays the letter_grade object's letter, beginning, and end range
        depending on whether the is_editing state variable is true or false (this variable, which,
        will change depending on whether the user pressed the editing button or the done button).
*/
const LetterGradeView = ({letter_grade}) => {
    const { updateLetterGradeInProfile } = useProfileContext();
    // State variables to allow for the editing and viewing behaviors of component LetterGradeView.
    const[is_editing, setIs_editing] = useState(false);
    const[beg, setBeg] = useState(letter_grade.beg);
    const[end, setEnd] = useState(letter_grade.end);

    return(
        <View>
            {/* Viewing state of Letter Grade. */}
            {/* If the user is not editing, then they must be viewing the letter grade. Return a View that displays its letter and its beginning to end range, along with an edit button that can change the state of LetterGradeView and allow the user to edit the beginning and end range. */}
            {!is_editing && (
                <View style={styles.letterGrade}>
                    <Text style={{fontSize: 30}}>{letter_grade.letter}: {beg}%-{end}%</Text>
                    <TouchableOpacity style={{marginLeft: 'auto'}}
                        onPress={() => {
                            setIs_editing(!is_editing);
                        }}>
                        <AntDesign style={{marginLeft: 'auto', justifyContent: 'center'}} name="edit" size={45} color={'black'}/>
                    </TouchableOpacity>
                </View>
            )}
            {/* Editing state of Letter Grade. */}
            {/* If the user is editing, then instead return the editing View to the component LetterGradeView. Display TextInputs that allow the user to define a beginning and end range, and a done button to save changes to the current component. */}
            {is_editing && (
                <View style={styles.letterGrade}>
                    {/* Inputs for the user to enter the beginning and end ranges for the letter grade in question. When the text in the TextInput is changed, the state variables for the beginning and end ranges are mutated in real-time. This is so that the inputs could be validated as is when the user presses the done button. */}
                    <TextInput
                        style={styles.inputText}
                        value={beg}
                        placeholder="Beg"
                        onChangeText={text => {
                            setBeg(text);
                        }}
                    />
                    <TextInput
                        style={styles.inputText}
                        value={end}
                        placeholder="End"
                        onChangeText={text => {
                            setEnd(text);
                        }}
                    />
                    {/* Done button for the letter grade in question. When the user presses this, the inputs (the beginning and end ranges, saved in the state variables beg and end, respectively) will be validated on whether they are positive and integers. For semantics on this function, see its declaration. */}
                    <TouchableOpacity style={{flex: 1}}
                        onPress={() => {
                            const valid_inputs = validPositiveIntInputs([beg, end], ['Beginning Range', 'End Range']);
                            // Given the inputs pass all of the tests in validPositiveIntInputs(), then change the state of this component to its viewing state and keep the changes to the beginning and end ranges to the state as well as save them to the global profile object.
                            if(valid_inputs){
                                setIs_editing(!is_editing);
                                updateLetterGradeInProfile(
                                    {
                                        ...letter_grade,
                                        beg: beg,
                                        end: end
                                    }
                                );
                            }
                        }}>
                        {/* Edit icon for the button. */}
                        <AntDesign style={{marginLeft: 'auto', alignSelf: 'center'}} name="checkcircleo" size={45} color={'green'}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

/*
NAME

        ConfigureLetterGradingScreen - a component that represents the screen which allows the user to configure the letter grading of a class. Contains a FlatList of LetterGradeView components that allows the user to edit the ranges for each letter grade.

SYNOPSIS

        <View> ConfigureLetterGradingScreen({Object navigation, Object route})
            navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
            route --> the route object also inherited from the NavigationContainer.

DESCRIPTION

        This component will return a View representing the screen for defining letter grades for a specific class.

RETURNS

        Returns a View that displays the letter_grade object's letter, beginning, and end range
        depending on whether the is_editing state variable is true or false (this variable, which,
        will change depending on whether the user pressed the editing button or the done button).
*/
const ConfigureLetterGradingScreen = ({navigation, route}) => {
    const { profile_context } = useProfileContext();
    // Current class in question is extracted from the route params.
    const { curr_class } = route.params;
    // Attach the current class's letter_grading property in state so that it can be edited in state.
    const[letter_grading, setLetter_grading] = useState(curr_class.letter_grading);

    // useEffect(() => {
    //     const title = () => {
    //         if(curr_class.name === '') return `New Class`;
    //         return curr_class.name;
    //     };
    //     navigation.setOptions({
    //         title: `Letter Grading in ${title()}`,
    //         // headerLeft: () => (
    //         //     <View style={{marginRight: 20}}>
    //         //         <TouchableOpacity
    //         //         activeOpacity={0.5}
    //         //         onPress={() => {
    //         //             navigation.navigate('Semester', {semester: profile_context.years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id)});
    //         //         }}>
    //         //         <AntDesign name="arrowleft" size={25} color='black'/>
    //         //         </TouchableOpacity>
    //         //     </View>
    //         // )
    //     });
    // })
    
    return(
        <View style={styles.container}>
            {/* Display components in a scrollable FlatList that allows the user to edit the letter_grade objects within letter_grades.*/}
            <FlatList
                style={{width: '100%'}}
                data={letter_grading}
                keyExtractor={(item, index) => item.id}
                removeClippedSubviews={false}
                renderItem={(letter_grade) => {
                    return(
                        <LetterGradeView letter_grade={letter_grade.item}/>
                    );
                }}
                contentContainerStyle={{marginTop: 30}}
                ItemSeparatorComponent={() => <View style={{height: 20}}/>}
            />
        </View>
    );
}

export default ConfigureLetterGradingScreen;

const styles = StyleSheet.create({
    container: {
        width: '90%',
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        gap: 20
    },

    letterGrade: {
        padding: 20,
        backgroundColor: '#BEBEBE',
        borderRadius: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
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