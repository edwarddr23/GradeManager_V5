/* 
    ConfigureLetterGradingScreen.tsx

    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for configuring the letter grades and their ranges for a given class. Changes
        in the state will be saved to the global profile context to keep the data consistent between
        screens and make sure that the data saved in SaveScreen.tsx is accurate.
*/

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Keyboard, BackHandler } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useProfileContext } from '../shared/profile_context';
import Toast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native';

import { validPositiveIntInputs } from '../shared/input_validation_functions';
import Footer from '../shared/custom_footer';
import common_style from '../shared/common_style';
import { InputWithLabel } from '../shared/custom_text_Inputs';

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
const LetterGradeView = ({letter_grade, updateRoute}) => {
    const { updateLetterGradeInProfile } = useProfileContext();
    // State variables to allow for the editing and viewing behaviors of component LetterGradeView.
    const[is_editing, setIs_editing] = useState(false);
    const[beg, setBeg] = useState(letter_grade.beg.toString());
    const[end, setEnd] = useState(letter_grade.end.toString());

    return(
        <View>
            {/* Viewing state of Letter Grade. */}
            {/* If the user is not editing, then they must be viewing the letter grade. Return a View that displays its letter and its beginning to end range, along with an edit button that can change the state of LetterGradeView and allow the user to edit the beginning and end range. */}
            {!is_editing && (
                <View style={styles.letterGrade}>
                    <Text style={[common_style.defaultText, {fontSize: 30}]}>{letter_grade.letter}: {beg}%-{end}%</Text>
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
                    <InputWithLabel
                        style={{flex: 1}}
                        textStyle={styles.inputText}
                        value={beg}
                        onChangeText={setBeg}
                        placeholder='Beg'
                        hasLabel={false}
                    />
                    <Text style={[common_style.defaultText, {fontSize: 30}]}>-</Text>
                    <InputWithLabel
                        style={{flex: 1}}
                        textStyle={styles.inputText}
                        value={end}
                        onChangeText={setEnd}
                        placeholder='End'
                        hasLabel={false}
                    />
                    {/* Done button for the letter grade in question. When the user presses this, the inputs (the beginning and end ranges, saved in the state variables beg and end, respectively) will be validated on whether they are positive and integers. For semantics on this function, see its declaration. */}
                    <TouchableOpacity style={{flex: 1}}
                        onPress={() => {
                            const valid_inputs = validPositiveIntInputs([beg, end], ['Beginning Range', 'End Range']);
                            // Beginning% cannot be greater than End%.
                            if(parseInt(beg) > parseInt(end)){
                                Toast.show('The beginning% cannot be greater than the end%', Toast.SHORT);
                                return;
                            }
                            // The beginning% and end% cannot be equal.
                            else if(parseInt(beg) === parseInt(end)){
                                Toast.show('The beginning% and the end% cannot be equal', Toast.SHORT);
                                return;
                            }
                            else if(parseInt(beg) > 99){
                                Toast.show('The beginning% cannot be greater than 99%', Toast.SHORT);
                                return;
                            }
                            else if(parseInt(end) > 100){
                                Toast.show('The end% cannot be greater than 100%', Toast.SHORT);
                                return;
                            }
                            // Given the inputs pass all of the tests in validPositiveIntInputs(), then change the state of this component to its viewing state and keep the changes to the beginning and end ranges to the state as well as save them to the global profile object.
                            if(valid_inputs){
                                setIs_editing(!is_editing);
                                setBeg(beg.trim());
                                setEnd(end.trim());
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
    // Current class in question is extracted from the route params.
    const { curr_class } = route.params;
    // Attach the current class's letter_grading property in state so that it can be edited in state.
    const[letter_grading, setLetter_grading] = useState(curr_class.letter_grading);

    // Keyboard flags in state that indicate whether the keyboard is showing or not. This will be used mainly to make certain views invisible when the keyboard comes up.
    const[keyboard_showing, setKeyboard_showing] = useState(false);

    // Hook that returns true if focused and false if not.
    const isFocused = useIsFocused();

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })

        /*
        NAME

            handleBackButton - a function component that handles the checking of the letter grades' beginning and end ranges when the user presses their hardware back button.
                
        SYNOPSIS

            bool handleBackButton()

        DESCRIPTION

            This function component will check to see if the letter grades' beginning and end ranges are contiguous. If
            not, then display a toast and do not navigate back. Otherwise, navigate back.

        RETURNS

            Returns true to prevent default back button behavior and false to resume normal back button behavior.
        */
        const handleBackButton = () => {
            // Listener that runs when the SemesterScreen comes back into focus. The assignments within the SectionView are updated.
            if(isFocused){
                // "A" must end at 100%.
                if(parseInt(letter_grading[0].end) !== 100){
                    Toast.show('"A" grade must end at 100%', Toast.SHORT);
                    return;
                }
                // "F" must begin at 0%.
                else if(parseInt(letter_grading[10].beg) !== 0){
                    Toast.show(`"F" grade msut begin at 0%`, Toast.SHORT);
                    return;
                }
                // Check if letter grading is contiguous.
                function isContiguous(){
                    let contiguous = true;

                    for(let i = 0; i < letter_grading.length; i++){
                        let curr_letter_grade = letter_grading[i];
                        // Validate with letter after as long as the current letter is not "F" (the last one).
                        if(curr_letter_grade.letter !== "F"){
                            if(parseInt(curr_letter_grade.beg) !== parseInt(letter_grading[i + 1].end)){
                                Toast.show(`${curr_letter_grade.letter} and ${letter_grading[i + 1].letter} are not contiguous`, Toast.SHORT);
                                contiguous = false;
                                break;
                            }
                        }
                    };

                    return contiguous
                }
                // If the letter_grading is not contiguous, then a Toast would have already displayed from isContiguous(). Return so that user cannot navigate back.
                if(!isContiguous()) return true;
                navigation.goBack();
                return true;
            }
            return false;
        }
        const backhandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => backhandler.remove();
    })
    
    return(
        <View style={{flexDirection: 'column', flex: 1}}>
            <View style={styles.container}>
                {/* Display components in a scrollable FlatList that allows the user to edit the letter_grade objects within letter_grades.*/}
                <FlatList
                    style={{width: '100%'}}
                    data={letter_grading}
                    keyExtractor={(item, index) => item.id}
                    removeClippedSubviews={false}
                    renderItem={(letter_grade) => {
                        function updateRoute(){
                            navigation.setParams({letter_grading: letter_grading});
                        }
                        // For each letter grade found in the letter_grading state array, create a LetterGradeView component based on its properties.
                        return(
                            <LetterGradeView letter_grade={letter_grade.item} updateRoute={updateRoute}/>
                        );
                    }}
                    contentContainerStyle={{marginTop: 30}}
                    ItemSeparatorComponent={() => <View style={{height: 20}}/>}
                />
            </View>
            {/* If the keyboard is not up, then show the footer. If the footer is not hidden when the keyboard is brought up, then it will be brought to above the keyboard. */}
            {!keyboard_showing && (
                <Footer navigation={navigation}/>
            )}
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