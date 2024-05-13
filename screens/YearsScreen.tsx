/* 
    YearsScreen.tsx
    
    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for adding academic years to a profile, as well as add semesters within each year.
*/

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Keyboard } from 'react-native';
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Footer from '../shared/custom_footer';
import { useIsFocused } from '@react-navigation/native';

import { findNextID } from '../shared/key_functions'
import { calculateYearGPA, calculateSemesterGPA, calculateCumulativeGPA, calculateExpectedSemesterGPA, calculateExpectedYearGPA, calculateExpectedCumulativeGPA } from '../shared/calculation_functions'
import { useProfileContext, YearContent, SemesterContent } from '../shared/profile_context'
import { SelectList } from 'react-native-dropdown-select-list';
import { validPositiveIntInputs } from '../shared/input_validation_functions';
import common_style from '../shared/common_style';
import { InputWithLabel } from '../shared/custom_text_Inputs';

/*
NAME

    SemesterView - a dynamic component that allows the viewing and editing of a semester from a given academic year.

SYNOPSIS

    <TouchableOpacity> SemesterView({ years_range, semester, updateSemesters, deleteSemester, navigation })
        years_range --> a list that holds the beginning and year of the parent YearView's year object.
        semester --> the semester object that represents the current semester in question.
        updateSemesters --> a function responsible for updating the SemesterContent state array and the SemesterContent array in the global profile context.
        deleteSemester --> a function responsible for deleting a semester from the SemesterContent state array and the SemesterContent array in the global proile context.
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
              
DESCRIPTION

    This component has two states: viewing and editing. In the viewing state, the user can view the semester's season,
    year, calculated GPA, and expected GPA. The user can also press on this component to navigate to the SemesterScreen
    to make more changes to the semester (such as adding classes).

RETURNS

    Returns a dynamic TouchableOpacity with a viewing and editing state for a given semester.
*/
const SemesterView = ({ years_range, semester, updateSemesters, deleteSemester, navigation }) => {
    // Global profile context function extracted to handle updating the specific semester in question in the global profile context.
    const { updateSemesterInProfile } = useProfileContext();
    // State variables to handle the changing behavior and attributes of the current SemesterContent object and the component.
    const[is_editing, setIs_editing] = useState(false);
    const[season, setSeason] = useState(semester.season);
    const[year, setYear] = useState(semester.year);
    const[seasonAndYear, setSeasonAndYear] = useState(() => {
        if(season !== '' && year !== -1) return(`${season} ${year}`);
        return '';
    });
    const[semesterGPA, setSemesterGPA] = useState(calculateSemesterGPA(semester));
    const[expectedSemesterGPA, setExpectedSemesterGPA] = useState(calculateExpectedSemesterGPA(semester));

    

    // Hook that handles the rerendering of the gpa and expected semester gpa for the current semester in question when the YearsScreen comes back into focus.
    useEffect(() => {
        navigation.addListener('focus', () => {
            setSemesterGPA(calculateSemesterGPA(semester));
            setExpectedSemesterGPA(calculateExpectedSemesterGPA(semester));
        })
    });

    /*
    NAME

        renderSeasonAndYear - a function component that allows the viewing and editing states of a semester's season and year for a given semester.

    SYNOPSIS

        <View> or <Text> renderSeasonAndYear()

    DESCRIPTION

        This component has two states: viewing and editing. In the viewing state, the user can view the semester's season and year. In its
        editing state, a user can change the season and year by using a SelectList of predetermined seasons and years to prevent invalid
        inputs for the season and year.

    RETURNS

        Returns a <Text> for viewing and <View> for editing season and year of a semester.
    */
    const renderSeasonAndYear = () => {
        // If the SemesterView is in its viewing state, just display the season and its year.
        if(!is_editing){
            // If the season and year are initialized, display the season and year recorded.
            if(season !== '' && year !== -1) return(
                <Text style={common_style.defaultText}>{season} {year}</Text>
            );
            // Otherwise, it is not initialized, so display "New Semester" instead.
            return(
                <Text style={common_style.defaultText}>New Semester</Text>
            )
        }
        // If the SemesterView is in its editing state, instead display a SelectList so the user can change the semester's season and year based on a predetermined list. It is assumed that the beginning and end year range of its parent YearView have already been set.
        return(
            <View style={{flexDirection: 'row', gap: 10}}>
                <SelectList
                    // Placeholder is type so that the selected type will show after the exam is closed and reopened.
                    dropdownTextStyles={common_style.defaultText}
                    inputStyles={common_style.defaultText}
                    placeholder={seasonAndYear}
                    setSelected={(val) => setSeasonAndYear(val)}
                    data={[`Fall ${years_range[0]}`, `Winter ${years_range[0]}`, `Spring ${years_range[1]}`, `Summer ${years_range[1]}`]}
                    search={false}
                    save="value"
                    onSelect={() => {
                        console.log(`renderSeasonAndYear(): ${seasonAndYear}`);
                        setSeason(seasonAndYear.split(" ")[0]);
                        setYear(seasonAndYear.split(" ")[1]);
                        // For context, here are the attributes for SemesterContent:
                        // id: Int32
                        // year_id: Int32
                        // classes: ClassContent[]
                        // season: string
                        // year: Int32
                        const updated_semester = {
                            ...semester,
                            season: seasonAndYear.split(" ")[0],
                            year: seasonAndYear.split(" ")[1]
                        }
                        updateSemesters(updated_semester);
                        updateSemesterInProfile(updated_semester);
                    }}
                />
            </View>
        );
    }

    /*
    NAME

        renderDeleteButton - a function component that renders the delete button depending on the parent SemesterView's state (editing or viewing).

    SYNOPSIS

        <TouchableOpacity> renderDeleteButton()

    DESCRIPTION

        If the parent SemesterView component is in its editing state, then return the delete button so that it could
        be rendered. Otherwise, return null.

    RETURNS

        Returns a <TouchableOpacity> that handles the deletion of a semester from both the state and global profile context.
    */
    const renderDeleteButton = () => {
        {/* Button that deletes a semester from a year. */}
        if(is_editing) return(
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => deleteSemester(semester)}>
                <AntDesign name="delete" size={50} color={'black'}/>
            </TouchableOpacity>
        )
    }

    /*
    NAME

        renderDoneOrEdit - a function component that renders an edit or done button depending on the parent SemesterView's state (editing or viewing).

    SYNOPSIS

        <TouchableOpacity> renderDoneOrEdit()

    DESCRIPTION

        In the case that the is_editing state variable is false (viewing state), the edit button is displayed. In the case
        that is_editing is true (editing state), then display the done button. When the edit button is pressed, the is_editing
        variable is set to the opposite value (presumably true) so that the parent SemesterView component enters its editing state.
        When is_editing is true, the done button is displayed instead. On press, the done button will update the semester and year
        of the current semester in question within the state and the global profile context. The is_editing variable is then toggled
        to the opposite value (presumably to false) to return the parent SemesterView component to the viewing state.

    RETURNS

        Returns a <TouchableOpacity> that handles the editing or saving of changes to a given semester.
    */
    const renderDoneOrEdit = () => {
        // Edit button that activates editing state for semester.
        if(!is_editing){
            return(
                <TouchableOpacity
                    style={{marginLeft: 'auto'}}
                    activeOpacity={0.5}
                    onPress={() => {
                        setIs_editing(!is_editing);
                    }}>
                    <AntDesign name="edit" size={50} color="black"/>
                </TouchableOpacity>
            );
        }
        // Done button for editing season and year for the semester.
        return(
            <TouchableOpacity
                style={{marginLeft: 'auto', paddingLeft: 20, alignSelf: 'center'}}
                activeOpacity={0.5}
                onPress={() => {
                    // Create a new semester object based on the current semester object in question, but modify the season and year attributes to reflect what has been selected by the user in state.
                    const updated_semester = {
                        ...semester,
                        season: season,
                        year: year
                    }
                    // Update semester object in state.
                    updateSemesters(updated_semester);
                    // Update semester object in global profile object.
                    updateSemesterInProfile(updated_semester);
                    setIs_editing(!is_editing);
                }}>
                <AntDesign name="checkcircleo" size={50} color='green'/>
            </TouchableOpacity>
        );
    }

    return(
        <TouchableOpacity 
            style={styles.semester}
            onPress={() => {
                navigation.navigate('Semester', {semester: semester});
            }}>
            <View style={{alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            { renderSeasonAndYear() }
                            <Text style={common_style.defaultText}>Semester GPA: {semesterGPA}</Text>
                            <Text style={common_style.defaultText}>Expected Semester GPA: {expectedSemesterGPA}</Text>
                        </View>
                    </View>
                    { renderDoneOrEdit() }
                </View>
                { renderDeleteButton() }
            </View>
        </TouchableOpacity>
    );
}

/*
NAME

    YearView - a dynamic component that allows the viewing and editing of a year from a given profile.

SYNOPSIS

    <View> YearView({ year, updateYears, updateSemestersInYear, deleteYear, navigation })
        year --> the year object that represents the current year in question.
        updateYears --> a function responsible for updating the YearContent state array and the YearContent array in the global profile context.
        deleteYear --> a function responsible for deleting a year from the YearContent state array and the YearContent array in the global proile context.
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.     
        
DESCRIPTION

    This component displays an academic year's beginning and end year, the year's calculated GPA,
    the year's expected year gpa, and its semesters (if they exist). A user can edit the year's
    beginning and end year, as well as add seemsters for each academic year.

RETURNS

    Returns a dynamic View component that allows the user to edit and view a year within the profile.
*/
const YearView = ({year, updateYears, updateSemestersInYear, deleteYear, navigation}) => {
    const { addSemesterToProfile } = useProfileContext();
    // State variables to allow for the dynamic behavior of the YearView when attributes of a year are changed.
    const[beg_year, setBeg_year] = useState(year.beg_year);
    const[end_year, setEnd_year] = useState(year.end_year);
    const[is_editing, setIs_editing] = useState(false);
    const[semesters, setSemesters] = useState(year.semesters)
    const[expanded, setExpanded] = useState(false);
    const[yearGPA, setYearGPA] = useState(calculateYearGPA(year));
    const[expectedYearGPA, setExpectedYearGPA] = useState(calculateExpectedYearGPA(year));
    
    // Hook that handles the rerendering of the gpa and expected semester gpa for the current academic year in question when the YearsScreen comes back into focus.
    useEffect(() => {
        navigation.addListener('focus', () => {
            setYearGPA(calculateYearGPA(year));
            setExpectedYearGPA(calculateExpectedYearGPA(year));
        })
        // The year's calculated and expected GPAs need to be calculated on rerender of YearView components too in the case that a semester is removed from the academic year in question.
        setYearGPA(calculateYearGPA(year));
        setExpectedYearGPA(calculateExpectedYearGPA(year));
    }, [year])

    /*
    NAME

        renderBegAndEnd - a function component that renders the beginning and end year for an academic year or the TextInputs to change them.

    SYNOPSIS

        <Text> or <View> renderBegAndEnd()

    DESCRIPTION

        This function component has an editing and view state that behaves in line with the parent YearView's state. In its
        viewing state, it displays a Text component that simply displays the beginning and end year. Otherwise, it displays
        TextInputs that allows for the user to edit the beginning and end year for the given academic year in question.
        
    RETURNS

        Returns a Text component that displays the beginning and end year or a View component with the TextInputs to edit the beginning and end year.
    */
    const renderBegAndEnd = () => {
        // Viewing state of beginning and end year. Display the beginning and end year.
        if(!is_editing){
            if(beg_year !== -1 && end_year !== -1) return (
                <Text style={[common_style.defaultText, {textAlignVertical: 'center', fontSize: 20, flex: 1}]}>Academic Year {beg_year}-{end_year}</Text>
            )
            else if(beg_year === -1 && end_year === -1) return (
                <Text style={[common_style.defaultText, {textAlignVertical: 'center', fontSize: 20, flex: 1}]}>New Academic Year</Text>
            )
        }
        // Editing state of beginning and end year, so display the TextInputs that change them.
        return(
            <View>
                <Text style={[common_style.defaultText, {textAlignVertical: 'center', fontSize: 20, flex: 1}]}>Academic Year:</Text>
                <View style={{flexDirection: 'row', gap: 10}}>
                    {/* TextInput that lets the user edit the beg year for a given academic year. */}
                    <InputWithLabel
                        textStyle={styles.inputText}
                        value={beg_year}
                        onChangeText={setBeg_year}
                        placeholder='Start'
                        hasLabel={false}
                    />
                    {/* TextInput that lets the user edit the end year for a given academic year. */}
                    <InputWithLabel
                        textStyle={styles.inputText}
                        value={end_year}
                        onChangeText={setEnd_year}
                        placeholder='End'
                        hasLabel={false}
                    />
                </View>
            </View>
        );
    }
    
    /*
    NAME

        renderEditOrDoneButton - a function component that renders the edit or done button for the parent YearView.

    SYNOPSIS

        <TouchableOpacity> renderEditOrDoneButton()

    DESCRIPTION

        This function component has an editing and view state that behaves in line with the parent YearView's state. In its
        viewing state, it displays a TouchableOpacity component that toggles the is_editing state variable from the parent
        YearView component. Otherwise, it displays a TouchableOpacity component that displays a done button icon, which handles
        the saving of changes to the beginning and end years of a given academic year. If the inputs are invalid, then the parent's
        is_editing state variable is not toggled (so it stays in its editing state) and the changes are not saved to the state or
        the global profile context. Otherwise, the changes are saved to the state and global profile context and the is_editing
        state variable is toggled to change the parent component's state back to its viewing state.
        
    RETURNS

        Returns a TouchableOpacity component that either allows for the editing of the beginning and end year for a given academic year or saves the changes to those values if any are made.
    */
    const renderEditOrDoneButton = () => {
        // Edit Button to change the years range
        if(!is_editing) return(
            <TouchableOpacity
                activeOpacity={0.5} 
                onPress={() => {
                    // console.log('edit button: years:', years);
                    setIs_editing(true);
                }}>
                <AntDesign name="edit" size={50} color="black"/>
            </TouchableOpacity>
        );
        // Done Button which saves the changes to the state years array by editing only the year with the current id.
        if(is_editing) return(
            <TouchableOpacity 
                onPress={() => {
                    // Validate input for beginning and end year. If either are invalid or if both together are invalid, then do not save the changes to state and global profile context and do not update the current year object in question.
                    if(beg_year === -1 || beg_year === ''){
                        Toast.show('Please enter a beginning year', Toast.SHORT);
                        setBeg_year(-1);
                        return;
                    }
                    else if(end_year === -1 || end_year === ''){
                        Toast.show('Please enter an end year', Toast.SHORT);
                        setEnd_year(-1);
                        return;
                    }
                    else if(validPositiveIntInputs([beg_year, end_year], ['beginning year', 'end year']) === false) return;
                    else if(beg_year > end_year){
                        Toast.show('Beginning year cannot be greater than end year', Toast.SHORT);
                        return;
                    }
                    else if(end_year - beg_year > 1){
                        Toast.show('Beginning and end year cannot be more than 1 year apart', Toast.SHORT);
                        return;
                    }
                    else if(beg_year == end_year){
                        Toast.show('Beginning and end year cannot be the same value', Toast.SHORT);
                        return;
                    }
                    setBeg_year(beg_year.trim());
                    setEnd_year(end_year.trim());
                    updateYears(
                        {
                            ...year,
                            beg_year: parseInt(beg_year.trim()),
                            end_year: parseInt(end_year.trim())
                        }
                    );
                    setIs_editing(!is_editing);
                }}>
                <AntDesign name="checkcircleo" size={50} color={'green'}/>
            </TouchableOpacity>
        );
    }

    /*
    NAME

        renderDeleteButton - a function component that renders the delete button for the parent YearView.

    SYNOPSIS

        <TouchableOpacity> renderDeleteButton()

    DESCRIPTION

        This function component only returns the delete button if the parent is in its editing state. Otherwise,
        nothing is returned (and hence, there will be no delete button in the academic year in question).
        
    RETURNS

        Returns a TouchableOpacity component that handles the deletion of a year fromm the state and global profile context.
    */
    const renderDeleteButton = () => {
        if(is_editing) return(
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => deleteYear(year)}>
                <AntDesign name="delete" size={50} color={'black'}/>
            </TouchableOpacity>
        );
    }

    /*
    NAME

        renderAddSemesterButton - a function component that renders the button in the current academic year in question that handles the adding of a semester.

    SYNOPSIS

        <TouchableOpacity> renderAddSemesterButton()

    DESCRIPTION

        This function component only returns the delete button if the parent is in its editing state. Otherwise,
        nothing is returned (and hence, there will be no delete button in the academic year in question).
        
    RETURNS

        Returns a TouchableOpacity component that handles the deletion of a year fromm the state and global profile context.
    */
    const renderAddSemesterButton = () => {
        if(expanded) return (
            <TouchableOpacity
                onPress={() => {
                    // If the beginning or end year are not initialized, then tell the user to specify them first before adding a semester and do nothing. This way, the seasons and years selected within each semester could be determined.
                    if(beg_year === -1 || end_year === -1){
                        Toast.show('Please enter a beginning and end year before adding a semester', Toast.LONG);
                        return;
                    }
                    // Otherwise, the beginning and end year state variables must be valid. Allow the user to add an initialized semester to the academic year in question.
                    // For reference, this is all of the attributes of the SemesterContent type:
                    // id: Int32
                    // year_id: Int32
                    // classes: ClassContent[]
                    // season: string
                    // year: Int32
                    // Create an initialized semester object.
                    const new_semester: SemesterContent = {
                        id: findNextID(semesters),
                        year_id: year.id,
                        classes: [],
                        season: '',
                        year: -1
                    };
                    // Add the new semester to the current SemesterContent state array
                    const newSemesters = [
                        ...semesters,
                        new_semester
                    ]
                    // Update the state and profile to reflect the added semester.
                    setSemesters(newSemesters);
                    addSemesterToProfile(new_semester);
                }}>
                <AntDesign name="pluscircleo" size={50} color="black"/>
            </TouchableOpacity>
        );
    }
    
    /*
    NAME

        renderSemsters - a function component that renders the semesters of the academic year in question.

    SYNOPSIS

        <View> or <Text> renderSemsters()

    DESCRIPTION

        If there are semesters to display, this function component programmatically creates and renders SemesterView components for 
        every semester found in the semesters state array. It also defines the function components that allow for the updating of
        semesters and deletion of semesters from the YearView's semesters array. If there are no semesters to display, instead render
        a TextView that lets the user know that there are no semesters for the given academic year in question.
        
    RETURNS

        Returns a View or Text component that handles the rendering of SemesterView components for each semester object found ini the semesters array.
    */
    const renderSemsters = () => {
        if(expanded){
            // If there's existing semesters, display them
            if(semesters.length > 0) return (
                <View>
                    {semesters.map((semester) => {
                        const chgSemesters = (new_semester) => {
                            const new_semesters = semesters.map((s) => {
                                if(s.id !== new_semester.id) return s;
                                return new_semester;
                            });
                            setSemesters(new_semesters);
                            updateSemestersInYear(year, new_semesters);
                        }

                        const deleteSemesterInYear = (semester) => {
                            const new_semesters = semesters.filter((s) => s.id !== semester.id);
                            setSemesters(new_semesters);
                            updateSemestersInYear(year, new_semesters);
                        }
                        
                        return(
                            <SemesterView key={semester.id} years_range={[beg_year, end_year]} semester={semester} updateSemesters={chgSemesters} deleteSemester={deleteSemesterInYear} navigation={navigation}/>
                        );
                    })}
                </View>
            )
            // If there are no existing semesters, let the user know that there are none yet.
            if(semesters.length === 0) return (
                <Text style={[common_style.defaultText, {textAlign: 'center', fontSize: 20}]}>No semesters yet!</Text>
            );
        }
    }

    return(
        <View style={{flex: 1}}>
            <View style={styles.year}>
                <TouchableOpacity style={{flexDirection: 'row', gap: 15, alignItems: 'center'}}
                    onPress={() => setExpanded(!expanded)}>
                    <View style={{flexDirection: 'column', flex: 1}}>
                        { renderBegAndEnd() }
                        <Text style={[common_style.defaultText, {textAlignVertical: 'center', fontSize: 18, flex: 1}]}>Year GPA: {yearGPA}</Text>
                        <Text style={[common_style.defaultText, {textAlignVertical: 'center', fontSize: 18, flex: 1}]}>Expected Year GPA: {expectedYearGPA}</Text>
                    </View>
                    { renderEditOrDoneButton() }
                    {/* Expand Button to see semesters. */}
                    {!expanded && (<AntDesign name="downcircleo" size={50} color="black"/>)}
                    {expanded && (<AntDesign name="upcircleo" size={50} color="black"/>)}
                </TouchableOpacity>
                { renderAddSemesterButton() }
                { renderSemsters() }
                { renderDeleteButton() }
            </View>
        </View>
    );
}

/*
NAME

    YearsScreen - a function component that handles the UI elements and functionalities associated with the screen responsible for adding viewing, adding, and editing academic years within a profile.

SYNOPSIS

    <View> YearsScreen({navigation})
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
        
DESCRIPTION

    If the user presses the plus button, a new ClassContent object is created, initialized and added to both the state and global profile context.
    Then, a ClassView component is made to display this object, and allows for the viewing and editing of that object. The name of a class or the names
    of sections within a class can be edited. Any other properties of a class can be changed using the functionality of a different screen (which is
    really, of course, just another component).

RETURNS

    Returns View that lets the user add classes and edit them within a semester.
*/
const YearsScreen = ({navigation}) => {
    // Global profile context functionalities that will be needed when synchronizing the changes in the state with the global profile context.
    const { profile_context, updateYearsInProfile, addYearToProfile } = useProfileContext();
    
    // State variables that stores the years dynamically to edit and track the year objects for the profile.
    const [years, setYears] = useState(profile_context.years);
    const[keyboard_showing, setKeyboard_showing] = useState(false);
    const[cumulativeGPA, setCumulativeGPA] = useState(calculateCumulativeGPA(years));
    const[expectedCumulativeGPA, setExpectedCumulativeGPA] = useState(calculateExpectedCumulativeGPA(years));

    // Hook that handles the tracking of the keyboard on rerender and rerendering of the calculated cumulative gpa and expected cumulative gpa for the current semester in question when the YearsScreen comes back into focus.
    useEffect(() => {
        // Keyboard listening to update keyboard_showing state. keyboard_state is used to indicate whether to hide certain views when keyboard is activated. Model taken from https://reactnative.dev/docs/keyboard.
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })
        // Navigation listener that rerenders the years, calculated cumulative gpa, and expected cumulative gpa when the user navigates back to YearsScreen.
        navigation.addListener('focus', () => {
            setCumulativeGPA(calculateCumulativeGPA(years));
            setExpectedCumulativeGPA(calculateExpectedCumulativeGPA(years));
        })
        // Calculated cumulative and expected cumulative GPAs must be updated on rerender in the case that a semester or academic year are removed on this screen.
        setCumulativeGPA(calculateCumulativeGPA(years));
        setExpectedCumulativeGPA(calculateExpectedCumulativeGPA(years));
    }, [years]);

    /*
    NAME

        renderAcademicYears - a function component that handles the rendering of academic years for the profile.

    SYNOPSIS

        <Text> or <View> renderAcademicYears()
        
    DESCRIPTION

        If the years state array is empty, then render a Text component that lets the user know that pressing the plus icon will
        let them add academic years to the profile. Otherwise, display the academic years with a View holding FlatList, which
        programmatically creates YearViews for each year found in the years state array. This function component also defines the
        functions passed into each YearView component.

    RETURNS

        Returns a Text or View component depending on how many years are in the years state array.
    */
    const renderAcademicYears = () => {
        if(years.length === 0) return(
            <Text style={[common_style.defaultText, {flex: 1, fontSize: 17, fontWeight: 'bold', paddingBottom: 5}]}>Press the plus sign to add an academic year</Text>
        );
        return(
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                <FlatList
                    style={{width: '90%'}}
                    data={years}
                    keyExtractor={(item) => item.id}
                    removeClippedSubviews={false}
                    ItemSeparatorComponent={() => <View style={{height: 20}}/>}
                    renderItem={curr_year => {
                        /*
                        NAME

                            chgYrsHandler - a function component that handles the updating of a given year's data by editing the years state array.

                        SYNOPSIS

                            void chgYrsHandler(new_year)
                                new_year --> year object in question to update to.
                            
                        DESCRIPTION

                            Iterate through all of the years in the years state array to create a new array with the respective year
                            modified with the data of parameter new_year. Update the state and the global profile context to reflect
                            the changes.

                        RETURNS

                            Returns void.
                        */
                        const chgYrsHandler = (new_year) => {
                            const new_years = years.map((y) => {
                                if(y.id !== new_year.id) return y;
                                return new_year;
                            })
                            setYears(new_years)
                            updateYearsInProfile(new_years);
                        }
                
                        /*
                        NAME

                            chgSemestersInYrHandler - a function component that handles the updating of semesters for a given year.

                        SYNOPSIS

                            void chgYrsHandler(new_year, new_semesters)
                                new_year --> year object in question to update to.
                                new_semesters --> new semesters array to update to.

                        DESCRIPTION

                            Iterate through all of the years in the years state array to create a new array with the respective year
                            modified with its semesters set to parameter new_semesters. Update the state years and years array in the
                            global profile context.

                        RETURNS

                            Returns void.
                        */
                        const chgSemestersInYrHandler = (new_year, new_semesters) => {
                            const new_years = years.map(y => {
                                console.log(`${y.id} == ${new_year.id}:`, (y.id == new_year.id));
                                if(y.id !== new_year.id) return y;
                                else{
                                    return {
                                        ...y,
                                        semesters: new_semesters
                                    }
                                }
                            });
                            setYears(new_years);
                            updateYearsInProfile(new_years);
                        }

                        /*
                        NAME

                            deleteYearFromYears - a function component that handles the deletion of an academic year from the academic years array in the profile in question.

                        SYNOPSIS

                            void deleteYearFromYears(year)
                                year --> year object in question to delete.

                        DESCRIPTION

                            Filter through the years in the current years state array to exclude the parameter year from the years array
                            and store that new array into new_years. Update the state years array and the global years context with this
                            new_years array.

                        RETURNS

                            Returns void.
                        */
                        const deleteYearFromYears = (year) => {
                            const new_years = years.filter((y) => y.id !== year.id);
                            setYears(new_years);
                            updateYearsInProfile(new_years);
                        }
                        
                        // Render current semester in a custom SemesterView component.
                        return(
                            <YearView key={curr_year.item.id} year={curr_year.item} updateYears={chgYrsHandler} updateSemestersInYear={chgSemestersInYrHandler} deleteYear={deleteYearFromYears} navigation={navigation}/>
                        );
                    }}
                />
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <View style={{width: 80, height: 80}}>
                {/* Button that adds years */}
                <TouchableOpacity 
                    activeOpacity={0.5} 
                    onPress={() => {
                        let new_year: YearContent = {
                            id: findNextID(years),
                            semesters: [],
                            beg_year: -1,
                            end_year: -1
                        }
                        setYears([
                            ...years,
                            new_year
                        ])
                        addYearToProfile(new_year.id);
                    }}>
                    <AntDesign name="pluscircleo" style={styles.plus_icon} size={80}/>
                </TouchableOpacity>
            </View>
            { renderAcademicYears() }
            {!keyboard_showing && (
                <View style={{width: '100%'}}>
                    <View style={{backgroundColor: '#c6e3ba', padding: 20, marginVertical: 10, borderRadius: 30}}>
                        <Text style={[common_style.defaultText, {fontSize: 30, textAlign: 'center'}]}>Cumulative GPA: {cumulativeGPA}</Text>
                        <Text style={[common_style.defaultText, {fontSize: 25, textAlign: 'center'}]}>Expected Cumulative GPA: {expectedCumulativeGPA}</Text>
                    </View>
                    {/* FOOTER */}
                    <Footer navigation={navigation}/>
                </View>
            )}
        </View>
    );
}

export default YearsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10,
        gap: 10
    },

    semester: {
        width: '100%',
        backgroundColor: '#b8b8b8',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        alignItems: 'center'
    },

    scroll: {
      width: '90%'
    },

    dropdown: {
      height: 50,
      width: 300,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      flex: 1
    },

    plus_icon: {
      color: "black",
    },

    placeholderStyle: {
      fontSize: 16,
      textAlign: 'center'
    },

    selectedTextStyle: {
      fontSize: 16,
      textAlign: 'center'
    },

    dropdown_iconStyle: {
      width: 'auto',
      height: 'auto'
    },

    year: { 
      borderWidth: 4,
      borderRadius: 30,
      padding: 15,
      gap: 20,
      alignItems: 'center'
    },

    inputText: {
      textAlign: 'center',
      fontSize: 25,
      borderWidth: 3,
      borderRadius: 10,
      padding: 10,
    },

})