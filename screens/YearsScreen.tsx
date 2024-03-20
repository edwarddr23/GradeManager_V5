import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, SectionList } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Footer from '../shared/custom_footer'

import { initializeArrKeys, findNextID } from '../shared/key_functions'

const ClassView = ({curr_class, navigation, profile}) => {
    return(
        <TouchableOpacity 
            style={{width: '100%', backgroundColor: '#b8b8b8', borderRadius: 10, padding: 10, marginVertical: 10}}
            onPress={() => {
                navigation.navigate('Class', {profile: profile, curr_class: curr_class});
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 22}}>{curr_class.name}:</Text>
            <Text style={{fontSize: 18}}>Grade Type: {curr_class.type}</Text>
        </TouchableOpacity>
    );
}

const YearView = ({year, years, setYears, navigation, profile}) => {
    // useStates for TextInputs:
    const[beg_year, setBeg_year] = useState(String(year.item.beg_year));
    const[end_year, setEnd_year] = useState(String(year.item.end_year));
    const[is_editing, setIs_editing] = useState(false);
    const[classes, setClasses] = useState(initializeArrKeys(year.item["classes"]))

    const[expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    }

    const handleYearRender = () => {
        // console.log('handleYearRender(): is_editing:', is_editing);
        // Viewing state of Academic Year.
        if (is_editing == false) {
            return(
                // <Feather name="edit" style={{color: "black", flex: 1}} size={24}/>
                <View style={{paddingBottom: 10}}>
                    <View style={styles.year}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{textAlignVertical: 'center', fontSize: 20, flex: 1}}>Academic Year {beg_year}-{end_year}</Text>
                            {/* Edit Button to change the years range */}
                            <TouchableOpacity 
                                style={{marginRight: 20}}
                                activeOpacity={0.5} 
                                onPress={() => {
                                    console.log('edit button: year:', year);
                                    console.log('edit button: year.item.id:', year.item.id);
                                    console.log('edit button: years:', years);
                                    setIs_editing(true);
                                }}>
                                <AntDesign name="edit" size={40} color="black"/>
                            </TouchableOpacity>
                            {/* Expand Button to see classes. */}
                            <TouchableOpacity
                                onPress={toggleExpand}>
                                {!expanded && (<AntDesign name="downcircleo" size={40} color="black"/>)}
                                {expanded && (<AntDesign name="upcircleo" size={40} color="black"/>)}
                            </TouchableOpacity>
                        </View>
                        {/* If the academic year is expanded... */}
                        {/* Show the button that adds classes. */}
                        {expanded && (
                            <View>
                                <TouchableOpacity
                                    style={{alignSelf: 'center'}}
                                    onPress={() => {
                                        setClasses([
                                            ...classes,
                                            {
                                                name: "New Class",
                                                id: findNextID(classes)
                                            }
                                        ]);
                                    }}>
                                    <AntDesign name="pluscircleo" size={40} color="black"/>
                                </TouchableOpacity>
                            </View>
                        )}
                        {/* If there's existing classes, display them */}
                        {expanded && classes.length > 0 
                            && (
                                <View>
                                    {classes.map((curr_class) => {
                                        console.log('MAP: curr_class:', curr_class);
                                        return(
                                            <ClassView key={curr_class.id} curr_class={curr_class} navigation={navigation} profile={profile}/>
                                        );
                                    })}
                                </View>
                        )}
                        {/* If there are no existing classes, let the user know that there are none yet.*/}
                        {expanded && classes.length == 0 && (
                            <Text>No classes yet!</Text>
                        )}
                    </View>
                </View>
            );
        }
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
                            // console.log('Done button: beg_year:', beg_year);
                            // console.log('Done button: end_year:', end_year);
                            setYears(data => data.map(item => {
                                if(item.id !== year.item.id) return item;
                                return {
                                    ...item,
                                    beg_year: beg_year,
                                    end_year: end_year
                                };
                            }))
                            setIs_editing(false);
                        }}>
                        <AntDesign name="checkcircleo" style={styles.plus_icon} size={40}/>
                    </TouchableOpacity>
                </View>
              </View>
            </View>
        );
    }

    return(handleYearRender());
}

const YearsScreen = ({navigation, route}) => {
    const {profile} = route.params;
    
    const [years, setYears] = useState(initializeArrKeys(profile["academic_years"]));

    const [nextId, setNextId] = useState(() => {
        if(years.length > 0){
            return years[years.length - 1].id + 1;
        }
        return 0;
    });
    
    // console.log('INITIAL nextId:', nextId);

    useEffect(() => {
        profile["academic_years"] = years
        console.log('useEffect(): years:', years);
    }, [years]);

    const renderYear = ((curr_year) => {
        console.log('renderYear(): curr_year.item.id:', curr_year.item.id);
        return(
            // Render current semester in a custom SemesterView component
            <YearView year={curr_year} years={years} setYears={setYears} key={curr_year.item.id} navigation={navigation} profile={profile}/>
        );
    });

    return(
        <View style={ {flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 10} } >
            <View style={{width: 80, height: 80}}>
                {/* Button that adds years */}
                <TouchableOpacity 
                    activeOpacity={0.5} 
                    onPress={() => {
                        setYears([
                            ...years,
                            {
                                id: nextId,
                                beg_year: "",
                                end_year: "",
                                classes: []
                            },
                        ])
                        console.log('years after adding:', years);
                        setNextId(nextId + 1);
                    }}
                >
                    <AntDesign name="pluscircleo" style={styles.plus_icon} size={80}/>
                </TouchableOpacity>
            </View>
            <Text style={{fontSize: 17, fontWeight: 'bold', paddingBottom: 5}}>Press the plus sign to add an academic year</Text>
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                <FlatList
                    style={{width: '90%', flex: 1}}
                    data={years}
                    keyExtractor={(item, index) => item.id}
                    renderItem={curr_year => {
                        return renderYear(curr_year);
                    }}
                />
                {/* FOOTER */}
                <Footer profile={profile}/>
            </View>
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
      padding: 10,
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