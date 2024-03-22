import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, SectionList } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Footer from '../shared/custom_footer'

import { initializeArrKeys, findNextID } from '../shared/key_functions'
import InputWithLabel from '../shared/custom_text_Inputs'
import { useProfileContext, ClassContent, YearContent } from '../shared/profile_context'

const ClassView = ({ navigation, curr_class, updateClasses, year }) => {
    const { profile_context, updateClassInProfile } = useProfileContext();
    const[is_editingClass, setIs_editingClass] = useState(false);
    const[name, setName] = useState(curr_class.name);

    return(
        <TouchableOpacity 
            style={{width: '100%', backgroundColor: '#b8b8b8', borderRadius: 10, padding: 10, marginVertical: 10}}
            onPress={() => {
                profile_context.years.map(y => {
                    console.log('ClassView(): y:', y);
                    y.classes.map(c => {
                        console.log('ClassView(): c.name:', c.name);
                    });
                });
                console.log('ClassView(): curr_class:', curr_class);
                console.log('ClassView(): year:', year);
                console.log(`profile_context.years: ${profile_context.years}`);
                console.log(`profile_context.years[0]: ${profile_context.years[0]}`);
                navigation.navigate('Class', { year: year, curr_class: curr_class });
            }}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                    {is_editingClass == false && (
                        <Text style={{fontWeight: 'bold', fontSize: 22}}>{curr_class.name}:</Text>
                    )}
                    {is_editingClass == true && (
                        <InputWithLabel 
                            value={name} 
                            setValue={setName} 
                            extraOnChangeText={() => {}}
                            placeholder={curr_class.name} 
                            label={'Class Name:'}/>
                    )}
                    <Text style={{fontSize: 18}}>Grade Type: {curr_class.type}</Text>
                </View>
                {/* Button for editing name of a Class. */}
                {is_editingClass == false && (
                    <TouchableOpacity
                        style={{marginLeft: 'auto', alignSelf: 'center'}}
                        activeOpacity={0.5}
                        onPress={() => {
                            setIs_editingClass(!is_editingClass);
                            // console.log('editing a class?')
                        }}
                    >
                        <AntDesign name="edit" size={40} color="black"/>
                    </TouchableOpacity>
                )}
                {/* Done button for editing the name of a class. */}
                {is_editingClass == true && (
                    <TouchableOpacity
                    style={{marginLeft: 'auto', alignSelf: 'center'}}
                        activeOpacity={0.5}
                        onPress={() => {
                            const updated_class = {
                                ...curr_class,
                                name: name
                            }
                            updateClasses(updated_class);
                            updateClassInProfile(year.id, curr_class.id, updated_class)
                            setIs_editingClass(!is_editingClass);
                        }}>
                        <AntDesign name="checkcircleo" size={40} color='green'/>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}

const YearView = ({year, updateYears, updateClassesInYear, navigation}) => {
    const { profile_context, addClassToProfile } = useProfileContext();
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
    const[classes, setClasses] = useState(initializeArrKeys(year["classes"]))
    
    const[expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    }

    const handleYearRender = () => {
        // Viewing state of Academic Year.
        if (!is_editing) {
            return(
                // <Feather name="edit" style={{color: "black", flex: 1}} size={24}/>
                <View style={{paddingBottom: 10}}>
                    <View style={styles.year}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{textAlignVertical: 'center', fontSize: 18, flex: 1}}>Academic Year {beg_year}-{end_year}</Text>
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
                            {/* Expand Button to see classes. */}
                            <TouchableOpacity
                                onPress={toggleExpand}>
                                {!expanded && (<AntDesign name="downcircleo" size={50} color="black"/>)}
                                {expanded && (<AntDesign name="upcircleo" size={50} color="black"/>)}
                            </TouchableOpacity>
                        </View>
                        {/* If the academic year is expanded... */}
                        {/* The button that adds classes to an academic year. */}
                        {expanded && (
                            <View>
                                <TouchableOpacity
                                    style={{alignSelf: 'center'}}
                                    onPress={() => {
                                        // id: Int32
                                        // year_id: Int32
                                        // name: string
                                        // setName: (c: string) => void
                                        // sections: SectionContent[]
                                        // setSections: (value: never[]) => void
                                        let new_class: ClassContent = {
                                            id: findNextID(classes),
                                            year_id: year.id,
                                            name: 'New Class',
                                            sections: []
                                        };
                                        const newClasses = [
                                            ...classes,
                                            new_class
                                        ]
                                        console.log(`ADD BUTTON: year.id: ${year.id}`);
                                        console.log(`ADD BUTTON: LOOP`);
                                        newClasses.map((c) => {
                                            console.log(`c.id: ${c.id}`);
                                        });
                                        addClassToProfile(year.id, new_class.id);
                                        // newClass = {
                                        //     ...newClass,
                                        //     id: findNextID(classes),
                                        //     name: "New Class"
                                        // }
                                        // const newClasses = [
                                        //     ...classes,
                                        //     {
                                        //         name: "New Class",
                                        //         id: findNextID(classes)
                                        //     }
                                        // ];
                                        setClasses(newClasses);
                                        updateClassesInYear(year, newClasses);
                                    }}>
                                    <AntDesign name="pluscircleo" size={50} color="black"/>
                                </TouchableOpacity>
                            </View>
                        )}
                        {/* If there's existing classes, display them */}
                        {expanded && classes.length > 0 
                            && (
                                <View>
                                    {classes.map((curr_class) => {
                                        const chgClasses = (new_class) => {
                                            console.log(`chgClasses(): new_class.name: ${new_class.name}`);
                                            console.log(`chgClasses(): year: ${year}`)
                                            const new_classes = classes.map((c) => {
                                                if(c.id !== new_class.id) return c;
                                                return new_class;
                                            });
                                            setClasses(new_classes);
                                            // console.log(`chgClasses(): classes[0].name: ${classes[0].name}`);
                                            updateClassesInYear(year, new_classes);
                                        }
                                        // console.log('MAP: curr_class:', curr_class);
                                        return(
                                            <ClassView key={curr_class.id} navigation={navigation} curr_class={curr_class} updateClasses={chgClasses} year={year}/>
                                        );
                                    })}
                                </View>
                        )}
                        {/* If there are no existing classes, let the user know that there are none yet.*/}
                        {expanded && classes.length == 0 && (
                            <Text style={{textAlign: 'center', fontSize: 20}}>No classes yet!</Text>
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

const YearsScreen = ({navigation}) => {
    const { profile_context, addYearToProfile } = useProfileContext();
    // console.log('YearsScreen.tsx: profile_context:', profile_context);
    // console.log('YearsScreen.tsx: profile_context.years:', profile_context.years);
    // console.log('YearsScreen.tsx: profile_context.years[0].classes:', profile_context.years[0].classes);
    
    const [years, setYears] = useState(initializeArrKeys(profile_context.years));

    // const [nextId, setNextId] = useState(() => {
    //     if(years.length > 0){
    //         return years[years.length - 1].id + 1;
    //     }
    //     return 0;
    // });

    useEffect(() => {
        // profile["academic_years"] = years;
        // console.log(`useEffect(): years: ${years}`);
        console.log('USEEFFECT()');
        console.log(`useEffect(): profile_context.years: ${profile_context.years}`);
        // profile_context.setYears(years);
        // console.log('useEffect(): profile_context years:');
        // profile_context.years.map(year => {
        //     console.log('useEffect(): year:', year);
        //     year.classes.map(c => {
        //         console.log('useEffect(): c.name:', c.name);
        //     });
        // });
        // console.log('useEffect(): profile_context:', profile_context);
        // console.log('useEffect(): profile_context.years[0]:', profile_context.years[0]);
        // console.log('useEffect(): profile_context.years[1]:', profile_context.years[1]);
        // toggleExpand();
    }, [years]);

    const renderYear = ((curr_year) => {
        // console.log('renderYear(): curr_year.item:', curr_year.item);
        const chgYrsHandler = (new_year) => {
            const new_years = years.map((y) => {
                console.log(`y.id: ${y.id}, new_year.id: ${new_year.id}`);
                if(y.id != new_year.id) return y;
                return new_year;
            })
            setYears(new_years)
            profile_context.setYears(new_years);
            console.log('chgYrsHandler(): new_year:', new_year)
            console.log('chgYrsHandler(): years:', years)
        }

        const chgClassesInYrHandler = (new_year, new_classes) => {
            console.log(`chgClassesInYrHandler(): new_year: ${new_year}`);
            const new_years = years.map(y => {
                console.log(`${y.id} == ${new_year.id}:`, (y.id == new_year.id));
                if(y.id !== new_year.id) return y;
                else{
                    return {
                        ...y,
                        classes: new_classes
                    }
                }
            });
            setYears(new_years);
            // profile_context.setYears(new_years);
        }

        return(
            // Render current semester in a custom SemesterView component
            <YearView key={curr_year.item.id} year={curr_year.item} updateYears={chgYrsHandler} updateClassesInYear={chgClassesInYrHandler} navigation={navigation}/>
        );
    });

    return(
        <View style={ {flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 10} } >
            <View style={{width: 80, height: 80}}>
                {/* Button that adds years */}
                <TouchableOpacity 
                    activeOpacity={0.5} 
                    onPress={() => {
                        // id: Int32
                        // classes: ClassContent[]
                        // setClasses: (value: never[]) => void
                        // beg_year: Int32
                        // end_year: Int32
                        let new_year: YearContent ={
                            id: findNextID(years),
                            classes: [],
                            setClasses: () => {},
                            beg_year: -1,
                            end_year: -1
                        }
                        setYears([
                            ...years,
                            new_year
                        ])
                        addYearToProfile(new_year.id);
                        console.log(`PROFILE AFTER ADDING: profile_context.years ${profile_context.years}`);
                        // setYears([
                        //     ...years,
                        //     {
                        //         id: nextId,
                        //         classes: [],
                        //         setClasses: () => {},
                        //         beg_year: '',
                        //         end_year: ''
                        //     },
                        // ])
                        // console.log('years after adding:', years);
                        // setNextId(nextId + 1);
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