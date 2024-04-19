/* 
    YearsScreen.tsx
    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for adding academic years to a profile, as well as add semesters within each year.
*/

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Keyboard } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Footer from '../shared/custom_footer';

import { findNextID } from '../shared/key_functions'
import { calculateYearGPA, calculateSemesterGPA, calculateCumulativeGPA, calculateExpectedSemesterGPA, calculateExpectedYearGPA, calculateExpectedCumulativeGPA } from '../shared/calculation_functions'
import { useProfileContext, YearContent, SemesterContent } from '../shared/profile_context'
import { SelectList } from 'react-native-dropdown-select-list';

/*
NAME

    SemesterView - a dynamic component that allows the viewing and editing of a semester from a given academic year.

SYNOPSIS

    <TouchableOpacity> SemesterView({ navigation, semester, updateSemesters, deleteSemester })
        navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
        semester --> the semester object the current section in question is a child of.
        updateSemesters --> a function responsible for updating the SemesterContent state array and the SemesterContent array in the global profile context.
        deleteSemester --> a function responsible for deleting a semester from the SemesterContent state array and the SemesterContent array in the global proile context.
              
DESCRIPTION

    This component has two states: viewing and editing. In the viewing state, the user can view the semester's season,
    year, calculated GPA, and expected GPA. The user can also press on this component to navigate to the SemesterScreen
    to make more changes to the semester (such as adding classes).

RETURNS

    Returns a dynamic TouchableOpacity with a viewing and editing state for a given semester.
*/
const SemesterView = ({ navigation, years_range, semester, updateSemesters, deleteSemester }) => {
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

    const renderSeasonAndYear = () => {
        return(
            <View style={{flexDirection: 'row', gap: 10}}>
                <SelectList
                    // Placeholder is type so that the selected type will show after the exam is closed and reopened.
                    placeholder={seasonAndYear}
                    setSelected={(val) => setSeasonAndYear(val)}
                    data={[`Fall ${years_range[0]}`, `Winter ${years_range[0]}`, `Spring ${years_range[1]}`]}
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
        // if(!is_editing){
        //     if(season === "") return(
        //         <Text style={{fontWeight: 'bold', fontSize: 25}}>New Semester</Text>
        //     );
        //     return(
        //         <Text style={{fontWeight: 'bold', fontSize: 25}}>{semester.season} {semester.year}</Text>
        //     );
        // }
        // return(
        //     <View style={{flexDirection: 'row', gap: 15}}>
        //         <TextInput
        //             style={styles.inputText}
        //             value={season}
        //             placeholder="Season"
        //             onChangeText={text => {
        //                 setSeason(text);
        //             }}
        //         />
        //         <TextInput
        //             style={styles.inputText}
        //             value={semesterYear}
        //             placeholder="Year"
        //             onChangeText={text => {
        //                 setSemesterYear(text);
        //             }}
        //         />
        //     </View>
        // );
    }

    const renderDoneOrEdit = () => {
        // Edit button that activates editing state for semester.
        if(!is_editing){
            return(
                <TouchableOpacity
                    style={{marginLeft: 'auto', alignSelf: 'center'}}
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
                    const updated_semester = {
                        ...semester,
                        season: season,
                        year: year
                    }
                    updateSemesters(updated_semester);
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
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    { renderSeasonAndYear() }
                    <Text style={{fontSize: 20}}>Semester GPA: {calculateSemesterGPA(semester)}</Text>
                    <Text style={{fontSize: 20}}>Expected Semester GPA: {calculateExpectedSemesterGPA(semester)}</Text>
                </View>
                { renderDoneOrEdit() }
            </View>
            {/* Button that deletes a semester from a year. */}
            {is_editing && (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => deleteSemester(semester)}>
                    <AntDesign name="delete" size={50} color={'black'}/>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

const YearView = ({year, updateYears, updateSemestersInYear, deleteYear, navigation}) => {
    // console.log(`YearView: year.id: ${year.id}`)
    const { profile_context, addSemesterToProfile } = useProfileContext();
    // useStates for TextInputs:
    const[beg_year, setBeg_year] = useState(() => {
                                                if(year.beg_year === -1) return ''
                                                else{
                                                    return year.beg_year;
                                                }});
    const[end_year, setEnd_year] = useState(() => {
                                                if(year.end_year === -1) return ''
                                                else{
                                                    return year.end_year;
                                                }});
    const[is_editing, setIs_editing] = useState(false);
    const[semesters, setSemesters] = useState(year.semesters)
    
    const[expanded, setExpanded] = useState(false);

    return(
        <View style={{flex: 1}}>
            {!is_editing && (
                <View style={styles.year}>
                    <TouchableOpacity style={{flexDirection: 'row', gap: 15, alignItems: 'center'}}
                        onPress={() => setExpanded(!expanded)}>
                        {/* Year Information: */}
                        <View style={{flexDirection: 'column'}}>
                            {beg_year !== '' && end_year !== '' && (
                                <Text style={{textAlignVertical: 'center', fontSize: 18, flex: 1}}>Academic Year {beg_year}-{end_year}</Text>
                            )}
                            {beg_year === '' && end_year === '' && (
                                <Text style={{textAlignVertical: 'center', fontSize: 20, flex: 1}}>New Academic Year</Text>
                            )}
                            <Text style={{textAlignVertical: 'center', fontSize: 18, flex: 1}}>Year GPA: {calculateYearGPA(year)}</Text>
                            <Text style={{textAlignVertical: 'center', fontSize: 18, flex: 1}}>Expected Year GPA: {calculateExpectedYearGPA(year)}</Text>
                        </View>
                        {/* Edit Button to change the years range */}
                        <TouchableOpacity
                            activeOpacity={0.5} 
                            onPress={() => {
                                // console.log('edit button: years:', years);
                                setIs_editing(true);
                            }}>
                            <AntDesign name="edit" size={50} color="black"/>
                        </TouchableOpacity>
                        {/* Expand Button to see semesters. */}
                        {!expanded && (<AntDesign name="downcircleo" size={50} color="black"/>)}
                        {expanded && (<AntDesign name="upcircleo" size={50} color="black"/>)}
                    </TouchableOpacity>
                    {/* If the academic year is expanded... */}
                    {/* The button that adds semesters to an academic year. */}
                    {expanded && (
                        <View>
                            <TouchableOpacity
                                style={{alignSelf: 'center'}}
                                onPress={() => {
                                    // id: Int32
                                    // year_id: Int32
                                    // classes: ClassContent[]
                                    // season: string
                                    // year: Int32
                                    let new_semester: SemesterContent = {
                                        id: findNextID(semesters),
                                        year_id: year.id,
                                        classes: [],
                                        season: '',
                                        year: -1
                                    };
                                    const newSemesters = [
                                        ...semesters,
                                        new_semester
                                    ]
                                    // console.log(`ADD BUTTON: year.id: ${year.id}`);
                                    // console.log(`ADD BUTTON: LOOP`);
                                    // newSemesters.map((s) => {
                                    //     console.log(`s.id: ${s.id}`);
                                    // });
                                    addSemesterToProfile(new_semester);
                                    setSemesters(newSemesters);
                                    updateSemestersInYear(year, newSemesters);
                                }}>
                                <AntDesign name="pluscircleo" size={50} color="black"/>
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* If there's existing semesters, display them */}
                    {expanded && semesters.length > 0 
                        && (
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
                    )}
                    {/* If there are no existing semesters, let the user know that there are none yet.*/}
                    {expanded && semesters.length == 0 && (
                        <Text style={{textAlign: 'center', fontSize: 20}}>No semesters yet!</Text>
                    )}
                </View>
            )}
            {is_editing && (
                <View style={styles.year}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                        <Text style={{textAlignVertical: 'center', fontSize: 17}}>Academic Year:</Text>
                        {/*Beg Year Number */}
                        <TextInput
                            style={styles.inputText}
                            value={beg_year}
                            placeholder="Start"
                            onChangeText={text => {
                                setBeg_year(text);
                            }}
                            keyboardType="numeric"
                        />
                        {/*End Year Number */}
                        <TextInput
                            style={styles.inputText}
                            value={end_year}
                            placeholder="End"
                            onChangeText={text => {
                                setEnd_year(text);
                            }}
                            keyboardType="numeric"
                        />
                        {/* Done Button, which saves the changes to the state years array by editing only the year with the current id. */}
                        <TouchableOpacity 
                            onPress={() => {
                                updateYears(
                                    {
                                        ...year,
                                        beg_year: beg_year,
                                        end_year: end_year
                                    }
                                );
                                setIs_editing(!is_editing);
                            }}>
                            <AntDesign name="checkcircleo" size={50} color={'green'}/>
                        </TouchableOpacity>
                    </View>
                    {/* Button that deletes a year from a semester. */}
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => deleteYear(year)}>
                        <AntDesign name="delete" size={50} color={'black'}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const YearsScreen = ({navigation, route}) => {
    const { profile_context, updateYearsInProfile, addYearToProfile } = useProfileContext();
    
    const [years, setYears] = useState(profile_context.years);

    const[keyboard_showing, setKeyboard_showing] = useState(false);

    // const[profile_name, setProfile_name] = useState(profile_context.profile_name);

    useEffect(() => {
        setYears(profile_context.years);
        // Keyboard listening to update keyboard_showing state. keyboard_state is used to indicate whether to hide certain views when keyboard is activated. Model taken from https://reactnative.dev/docs/keyboard.
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboard_showing(true);
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboard_showing(false)
        })
        // navigation.addListener('focus', () => {
        //     setProfile_name(profile_context.profile_name);
        // })
    }, [years]);

    return(
        <View style={ {flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 10} } >
            <View style={{width: 80, height: 80}}>
                {/* Button that adds years */}
                <TouchableOpacity 
                    activeOpacity={0.5} 
                    onPress={() => {
                        let new_year: YearContent ={
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
                    }}
                >
                    <AntDesign name="pluscircleo" style={styles.plus_icon} size={80}/>
                </TouchableOpacity>
            </View>
            <Text style={{fontSize: 17, fontWeight: 'bold', paddingBottom: 5}}>Press the plus sign to add an academic year</Text>
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                <FlatList
                    style={{width: '90%'}}
                    data={years}
                    keyExtractor={(item, index) => item.id}
                    removeClippedSubviews={false}
                    ItemSeparatorComponent={() => <View style={{height: 20}}/>}
                    renderItem={curr_year => {
                        const chgYrsHandler = (new_year) => {
                            const new_years = years.map((y) => {
                                if(y.id != new_year.id) return y;
                                return new_year;
                            })
                            setYears(new_years)
                            updateYearsInProfile(new_years);
                        }
                
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

                        const deleteYearFromYears = (year) => {
                            setYears(years.filter((y) => y.id !== year.id));
                            updateYearsInProfile(years.filter((y) => y.id !== year.id));
                        }
                
                        return(
                            // Render current semester in a custom SemesterView component
                            <YearView key={curr_year.item.id} year={curr_year.item} updateYears={chgYrsHandler} updateSemestersInYear={chgSemestersInYrHandler} deleteYear={deleteYearFromYears} navigation={navigation}/>
                        );
                    }}
                />
            </View>
            {!keyboard_showing && (
                <View style={{width: '100%'}}>
                    <View style={{backgroundColor: '#c6e3ba', padding: 20, marginVertical: 10, borderRadius: 30}}>
                        <Text style={{fontSize: 30, textAlign: 'center'}}>Cumulative GPA: {calculateCumulativeGPA(years)}</Text>
                        <Text style={{fontSize: 25, textAlign: 'center'}}>Expected Cumulative GPA: {calculateExpectedCumulativeGPA(years)}</Text>
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