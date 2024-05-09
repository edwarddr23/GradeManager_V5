/* 
    ConfigureSectionsScreen.tsx

    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for configuring sections for a given class. Section names and relative weights
        can be defined. Changes in the state will be saved to the global profile context to keep the 
        data consistent between screens and make sure that the data saved in SaveScreen.tsx is accurate.
*/

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Keyboard, BackHandler } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useProfileContext, SectionContent } from '../shared/profile_context';
import Toast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native';

import { findNextID } from '../shared/key_functions';
import Footer from '../shared/custom_footer';
import { validPositiveIntInputs } from '../shared/input_validation_functions';
import common_style from '../shared/common_style';
import { InputWithLabel } from '../shared/custom_text_Inputs';

/*
NAME

    SectionView - a component that represents a section object within a class object.
        
SYNOPSIS

    <View> ConfigureLetterGradingScreen({Object section, Object route})
        section --> the object representing the current section to represent.
        deleteSection --> a function that mutates the parent component's sections state array and the sections array in the profile context to reflect the deletion of a sections object.

DESCRIPTION

    This component will return a View representing a certain section. A section's name and relative weight could be defined, and can also be removed entirely if the delete button is pressed.

RETURNS

    Returns a View that displays the section object's name and relative weight
    depending on whether the is_editing state variable is true or false (this variable, which,
    will change depending on whether the user pressed the editing button or the done button).
*/
const SectionView = ({updateTotal, section, deleteSection}) => {
    const { updateSectionInProfile } = useProfileContext();
    // State variables to allow for the changing of the component's interactible elements.
    const[is_editing, setIs_editing] = useState(false);
    const[name, setName] = useState(section.name);
    // Precision needs to be defined as sometimes an integer over 100 gives a repeating integer (example 55 /100)
    const[weight, setWeight] = useState(() => {
        if(section.weight !== -1){
            return (section.weight * 100).toFixed(0);
        }
        return '';
    });

    return(
        <View style={styles.section}>
            {/* Viewing state of section. */}
            {!is_editing && (
                <View style={{flexDirection: 'row'}}>
                    {/* By default, a new section object created will have '' as a name. If this component is initialized and the name is empty, then it must be a new section.*/}
                    {name === '' && (
                        <Text style={[common_style.defaultText, {fontSize: 30, fontWeight: 'bold'}]}>New Section</Text>
                    )}
                    {/* Otherwise, the section object in question has been fully initialized. Print out the name and the weight. */}
                    {name !== '' && (
                        <Text style={[common_style.defaultText, {fontSize: 30, fontWeight: 'bold'}]}>{section.name}: {weight}%</Text>
                    )}
                    {/* Edit button that changes the state of the View returned by SectionView to editing state.*/}
                    <TouchableOpacity
                        style={{marginLeft: 'auto'}}
                        onPress={() => setIs_editing(!is_editing)}>
                        <AntDesign name='edit' size={45} color='black'/>
                    </TouchableOpacity>
                </View>
            )}
            {/* Editing state of section. */}
            {is_editing && (
                <View style={{alignItems: 'center', gap: 15}}>
                    <View style={{flexDirection: 'row'}}>
                        {/* TextInputs that allow for the editing of the section name and weight. */}
                        <InputWithLabel
                            textStyle={styles.inputText}
                            value={name}
                            onChangeText={setName}
                            placeholder='Name'
                            hasLabel={false}
                        />
                        <InputWithLabel
                            textStyle={styles.inputText}
                            value={weight}
                            onChangeText={setWeight}
                            placeholder='Weight'
                            hasLabel={false}
                        />
                        {/* Done button to change the name and weight of a section. */}
                        <TouchableOpacity
                            style={{marginLeft: 'auto', alignSelf: 'center'}}
                            onPress={() => {
                                /*
                                NAME

                                    validInputs - a function that validates the inputs for a section modification.
                                        
                                SYNOPSIS

                                    bool validInputs()
                                        
                                DESCRIPTION

                                    Each of the inputs will go through their own validation. If the name is empty or pure whitespace,
                                    or if the weight is not a positive integer or is greater than 100, then the inputs are not valid.
                                    If the inputs are not valid, then the state of the View returned by SectionView will not change to
                                    its viewing state and will remain in its editing state. The profile context will also not be updated,
                                    as we do not want to save an improper section object. If the input is valid, however, the state and the
                                    profile context will be updated and the state of the View returned by SectionView will change to its
                                    viewing state.
                                        
                                RETURNS

                                    This function will return a boolean. If the inputs fail any of the tests, return false. Otherwise, the input must be true, so return true.
                                */
                                function validInputs() {
                                    // Check if name is empty.
                                    if(name === '' || name.trim() === ''){
                                        Toast.show('Please enter a Name', Toast.SHORT);
                                        return false;
                                    }
                                    // Check if name is a positive integer.
                                    else if(validPositiveIntInputs([weight], ['Relative Weight']) === false) return false;
                                    // validPositiveInputs() just makes sure that the number entered is an integer and positive, but does not check the range.
                                    else if(weight > 100){
                                        Toast.show('Weight cannot exceed 100%', Toast.SHORT);
                                        return false;
                                    }
                                    return true;
                                }
                                // If the name and weight for the section in question is valid, then keep the name and weight in state and save the new modified section to the profile context.
                                if(validInputs() === true){
                                    // Intl.NumberFormat() is needed to make sure that the weight is recorded as a decimal to 2 decimal places everytime no matter what weight / 100 returns.
                                    const formatter = new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 2,      
                                        maximumFractionDigits: 2
                                    })
                                    // If there are leading or trailing spaces in the inputs, disregard them and save the trimmed inputs to the state on next rerender.
                                    setName(name.trim());
                                    setWeight(weight.trim());
                                    let new_section = {
                                        ...section,
                                        // May seem redundant to trim the name and weight again, but this must trimmed since the setName() and setWeight hooks are not called until the next rerender, and thus, name and weight are not trimmed yet.
                                        name: name.trim(),
                                        weight: formatter.format(weight.trim() / 100)
                                    }
                                    // Update the current section in question to the profile context. Create a new section object based on the old one but modify the name and weight to fit the standardized percentage format (which I standardized to a decimal to 2 decimal places).
                                    updateSectionInProfile(new_section);
                                    // Add the weight to to total weights. This will be used when checking for an invalid total when the user presses the back button.
                                    updateTotal(new_section);
                                    // Change the View returned by SectionView change back to its viewing state.
                                    setIs_editing(!is_editing);
                                }
                            }}>
                            <AntDesign name='checkcircleo' size={45} color='green'/>
                        </TouchableOpacity>
                    </View>
                    {/* Button that deletes a year from a semester. */}
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => deleteSection()}>
                        <AntDesign name="delete" size={50} color={'black'}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

/*
NAME

    ConfigureSectionsScreen - a component that represents the screen that handles the configuration of a class's sections.
        
SYNOPSIS

    <View> ConfigureLetterGradingScreen({Object navigation, Object route})
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
        route --> the route object also inherited from the NavigationContainer.

DESCRIPTION

    This component allows sections of the current class in question to be viewed, and new sections can be added. Section names and relative weights for each section can be changed.

RETURNS

    Returns a View that displays the section object's name and relative weight
    depending on whether the is_editing state variable is true or false (this variable, which,
    will change depending on whether the user pressed the editing button or the done button).
*/
const ConfigureSectionsScreen = ({navigation, route}) => {
    const { profile_context, addSectionToProfile, updateClassSectionsInProfile } = useProfileContext();
    // Extract the current class from the route's params to determine what the current class is.
    const { curr_class } = route.params;

    // Extract the sections in question from the profile context using the current class in question.
    const[sections, setSections] = useState(profile_context.years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id).classes.find((c) => c.id === curr_class.id).sections);

    // Keyboard flags in state that indicate whether the keyboard is showing or not. This will be used mainly to make certain views invisible when the keyboard comes up.
    const[keyboard_showing, setKeyboard_showing] = useState(false);

    // If there are sections already, set the total to the total of those weights.
    const[total, setTotal] = useState(() => {
        let t = 0;
        sections.map((s) => {
            if(s.weight != -1 && s.weight != undefined){
                t += parseInt(parseFloat(s.weight) * 100);
            }
        });
        return t;
    });

    // Hook that returns true if focused and false if not.
    const isFocused = useIsFocused();

    // Hook that runs on rerender. On rerender or when state variable total changes, then put this total in the params as well as the current semester. These will be for the header in App.tsx.
    useEffect(() => {
        // Keyboard listening to update keyboard_showing state. keyboard_state is used to indicate whether to hide certain views when keyboard is activated. Model taken from https://reactnative.dev/docs/keyboard.
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })
        route.params.total = total;
        route.params.semester = profile_context.years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id);
        /*
        NAME

            handleBackButton - a function component that handles the checking of the sections' relative weights when the user presses their hardware back button.
                
        SYNOPSIS

            bool handleBackButton()

        DESCRIPTION

            This function component will check to see if the sections' relative weights are greater than 100%. If they
            are, then send a toast and do not navigate back. Otherwise, navigate back.

        RETURNS

            Returns true to prevent default back button behavior.
        */
        const handleBackButton = () => {
            // Listener that runs when the ConfigureSectionsScreen is in focus. This check prevents this handler being run on other screens.
            if(isFocused){
                if(total > 100){
                    Toast.show(`The total weights cannot exceed 100% total: ${total}`, Toast.SHORT);
                }
                else{
                    navigation.goBack();
                }
                return true;
            }
            return false;
        }
        const backhandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => backhandler.remove();
    }, [total]);

    return(
        // The programmatically set view that displays existing sections and allows users to add sections.
        <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
            <View style={{width: '80%', flex: 1, gap: 10}}>
                {/* Button that adds a section. */}
                <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    activeOpacity={0.5}
                    onPress={() => {
                        // Properties of a section type for reference:
                        // id: Int32,
                        // year_id: Int32
                        // semester_id: Int32
                        // class_id: Int32
                        // name: string
                        // weight: Float
                        // average: Float
                        // assignments: AssignmentContent[]
                        // Initialize a new SectionContent object.
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
                        // Change the sections in state to reflect the new sections with the added section.
                        setSections([
                            ...sections,
                            new_section
                        ]);
                        // Modifies the global profile context to reflect the new sections with the added section
                        addSectionToProfile(new_section);
                    }}>
                    {/* The icon for the add button. */}
                    <AntDesign name="pluscircleo" size={70} color='black'/>
                </TouchableOpacity>
                {/* If there are no sections yet, display a text to notify the user to press the plus button to add sections. */}
                {sections.length === 0 && (
                    <Text style={[common_style.defaultText, {textAlign: 'center'}]}>Press this button to add sections</Text>
                )}
                {/* Display of sections of the current class in question. */}
                <View style={{flex: 1}}>
                    <FlatList
                        data={sections}
                        keyExtractor={(item, index) => item.id}
                        removeClippedSubviews={false}
                        renderItem={(section) => {
                            /*
                            NAME

                                deleteSectionFromClass - a function that handles the deletion of a section in the state and global profile context.
                            SYNOPSIS

                                void ConfigureLetterGradingScreen(Object section)
                                    section --> a section object that represents the section to remove from the sections in state and sections in the global profile context.           
                            
                            DESCRIPTION

                                This function allows for the handling of deleting a section from a class after the event that the user presses the delete button on a given section. A new section array is created that is based on the old one, but without the section that matches parameter section. The respective sections array is updated in the state and in the global profile context to instead use this new sections list.
                            
                            RETURNS

                                Returns void.
                            */
                            function deleteSectionFromClass() {
                                const new_sections = sections.filter((s) => s.id !== section.item.id);
                                setSections(new_sections);
                                updateClassSectionsInProfile(curr_class, new_sections);
                            }

                            /*
                            NAME

                                updateTotal - a function that handles the updating of the state total variable after a section object is modified.
                            
                            SYNOPSIS

                                void updateTotal(new_section)
                                    new_section --> a section object that represents the section in question that the user has finished editing (presumed to have valid values).
                            
                            DESCRIPTION

                                This function updates the total state variable after a section is updated. A new sections list is created to reflect the changed section which is now parameter new_section. A new total is calculated with this new sections array and this value is saved to the total state variable. This will be used in validating the total of the sections' weights after the back button in the header of the screen is pressed.
                            
                            RETURNS

                                Returns void.
                            */
                            function updateTotal(new_section) {
                                const new_sections = sections.map((s) => {
                                    if(s.id !== new_section.id) return s;
                                    return new_section;
                                });
                                let t = 0;
                                new_sections.map((s) => {
                                    if(s.weight != -1 && s.weight != undefined){
                                        t += parseInt(parseFloat(s.weight) * 100);
                                    }
                                });
                                setTotal(t);
                            }

                            // For each section element in state array sections, create a SectionView component using its data.
                            return(
                                <SectionView updateTotal={updateTotal} section={section.item} deleteSection={deleteSectionFromClass}/>
                            );
                        }}
                    />
                </View>
            </View>
            {/* If the keyboard is not up, then show the footer. If the footer is not hidden when the keyboard is brought up, then it will be brought to above the keyboard. */}
            {!keyboard_showing && (
                <Footer navigation={navigation}/>
            )}
        </View>
    );
}

export default ConfigureSectionsScreen;

const styles = StyleSheet.create({
    section: {
        padding: 20,
        backgroundColor: '#BEBEBE',
        borderRadius: 20,
        marginBottom: 20
    },

    inputText: {
        textAlign: 'center',
        fontSize: 25,
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        flex: 1
    },
});