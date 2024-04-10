import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, SectionList } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Footer from '../shared/custom_footer'

import { initializeArrKeys, findNextID } from '../shared/key_functions'
import InputWithLabel from '../shared/custom_text_Inputs'
import { calculateYearGPA, calculateSemesterGPA, calculateCumulativeGPA, calculateExpectedSemesterGPA, calculateExpectedYearGPA, calculateExpectedCumulativeGPA } from '../shared/calculation_functions'
import { useProfileContext, ClassContent, YearContent, SemesterContent } from '../shared/profile_context'

const SemesterView = ({ navigation, semester, updateSemesters }) => {
    const { profile_context, updateSemesterInProfile } = useProfileContext();
    const[is_editing, setIs_editing] = useState(false);
    const[season, setSeason] = useState(semester.season);
    const[year, setYear] = useState(semester.year);

    return(
        <TouchableOpacity 
            style={{width: '100%', backgroundColor: '#b8b8b8', borderRadius: 10, padding: 15, marginVertical: 10}}
            onPress={() => {
                navigation.navigate('Semester', {semester: semester});
            }}>
            <View>
                <View style={{flexDirection: 'column'}}>
                    {/* Viewing state for semester. */}
                    {is_editing == false && (
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'column'}}>
                                {is_editing == false && season === "" && (
                                    <Text style={{fontWeight: 'bold', fontSize: 25}}>New Semester</Text>
                                )}
                                {is_editing == false && season !== "" && (
                                    <Text style={{fontWeight: 'bold', fontSize: 25}}>{semester.season} {semester.year}</Text>
                                )}
                                <Text style={{fontSize: 20}}>Semester GPA: {calculateSemesterGPA(semester)}</Text>
                                <Text style={{fontSize: 20}}>Expected Semester GPA: {calculateExpectedSemesterGPA(semester)}</Text>
                            </View>
                            {/* Edit button that activates editing state for semester. */}
                            <TouchableOpacity
                                style={{marginLeft: 'auto', alignSelf: 'center'}}
                                activeOpacity={0.5}
                                onPress={() => {
                                    setIs_editing(!is_editing);
                                    // console.log('editing a class?')
                                }}
                            >
                                <AntDesign name="edit" size={40} color="black"/>
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* Editing state for semester */}
                    {is_editing == true && (
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                style={styles.inputText}
                                value={season}
                                placeholder="Season"
                                onChangeText={text => {
                                    setSeason(text);
                                }}
                            />
                            <TextInput
                                style={styles.inputText}
                                value={year}
                                placeholder="Year"
                                onChangeText={text => {
                                    setYear(text);
                                }}
                            />
                            {/* Done button for editing season and year for the semester. */}
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
                                <AntDesign name="checkcircleo" size={40} color='green'/>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const YearView = ({year, updateYears, updateSemestersInYear, navigation}) => {
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
                                        console.log(`chgSemesters(): new_semester.name: ${new_semester.name}`);
                                        console.log(`chgSemesters(): year: ${year}`)
                                        const new_semesters = semesters.map((s) => {
                                            if(s.id !== new_semester.id) return s;
                                            return new_semester;
                                        });
                                        setSemesters(new_semesters);
                                        // console.log(`chgSemesters(): semesters[0].name: ${semesters[0].name}`);
                                        updateSemestersInYear(year, new_semesters);
                                    }
                                    // console.log('MAP: semester:', semester);
                                    return(
                                        <SemesterView key={semester.id} semester={semester} updateSemesters={chgSemesters} navigation={navigation}/>
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                </View>
            )}
        </View>
    );

    const handleYearRender = () => {
        // Viewing state of Academic Year.
        if (!is_editing) {
            return(
                <View style={{paddingBottom: 10}}>
                    <View style={styles.year}>
                        <View style={{flexDirection: 'row'}}>
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
                                style={{marginRight: 20}}
                                activeOpacity={0.5} 
                                onPress={() => {
                                    // console.log('edit button: years:', years);
                                    setIs_editing(true);
                                }}>
                                <AntDesign name="edit" size={50} color="black"/>
                            </TouchableOpacity>
                            {/* Expand Button to see semesters. */}
                            <TouchableOpacity
                                onPress={toggleExpand}>
                                {!expanded && (<AntDesign name="downcircleo" size={50} color="black"/>)}
                                {expanded && (<AntDesign name="upcircleo" size={50} color="black"/>)}
                            </TouchableOpacity>
                        </View>
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
                                            console.log(`chgSemesters(): new_semester.name: ${new_semester.name}`);
                                            console.log(`chgSemesters(): year: ${year}`)
                                            const new_semesters = semesters.map((s) => {
                                                if(s.id !== new_semester.id) return s;
                                                return new_semester;
                                            });
                                            setSemesters(new_semesters);
                                            // console.log(`chgSemesters(): semesters[0].name: ${semesters[0].name}`);
                                            updateSemestersInYear(year, new_semesters);
                                        }
                                        // console.log('MAP: semester:', semester);
                                        return(
                                            <SemesterView key={semester.id} semester={semester} updateSemesters={chgSemesters} navigation={navigation}/>
                                        );
                                    })}
                                </View>
                        )}
                        {/* If there are no existing semesters, let the user know that there are none yet.*/}
                        {expanded && semesters.length == 0 && (
                            <Text style={{textAlign: 'center', fontSize: 20}}>No semesters yet!</Text>
                        )}
                    </View>
                </View>
            );
        }
        else if(is_editing){
            // Editing state of Academic Year.
            return(
                <View style={{paddingBottom: 10}}>
                    <View style={styles.year}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                    </View>
                </View>
            );
        }
    }

    return(handleYearRender());
}

const YearsScreen = ({navigation, route}) => {
    const { profile_context, addYearToProfile } = useProfileContext();
    const fromClassScreen = route.params.fromClassScreen;
    
    const [years, setYears] = useState(profile_context.years);

    useEffect(() => {
        setYears(profile_context.years);
    }, [years, fromClassScreen]);

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
                            profile_context.setYears(new_years);
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
                        }
                
                        return(
                            // Render current semester in a custom SemesterView component
                            <YearView key={curr_year.item.id} year={curr_year.item} updateYears={chgYrsHandler} updateSemestersInYear={chgSemestersInYrHandler} navigation={navigation}/>
                        );
                    }}
                />
            </View>
            <View style={{backgroundColor: '#c6e3ba', padding: 20, maxWidth: 'auto', marginVertical: 10, borderRadius: 30}}>
                <Text style={{fontSize: 30, textAlign: 'center'}}>Cumulative GPA: {calculateCumulativeGPA(years)}</Text>
                <Text style={{fontSize: 25, textAlign: 'center'}}>Expected Cumulative GPA: {calculateExpectedCumulativeGPA(years)}</Text>
            </View>
            {/* FOOTER */}
            <Footer/>
        </View>
    );
}

export default YearsScreen;

const styles = StyleSheet.create({
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

    // label: {
    //   position: 'relative',
    //   // backgroundColor: 'white',
    //   // left: 5,
    //   // top: 8,
    //   zIndex: 999,
    //   paddingHorizontal: 8,
    //   fontSize: 14,
    // },

    year: { 
    //   alignItems: 'center',
      borderWidth: 4,
      borderRadius: 30,
      padding: 15,
    //   flexDirection: 'row',
      gap: 10
      // backgroundColor: 'purple',
      // width: '95%'
    },

    inputText: {
      // height: 10,
      // margin: 12,
      textAlign: 'center',
      fontSize: 20,
      borderWidth: 3,
      borderRadius: 10,
      padding: 10,
      marginHorizontal: 5,
      flex: 1
    },

    // fab: {
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // }

})