import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Footer from '../shared/custom_footer'

const YearView = ({year, years, setYears}) => {
    // useStates for TextInputs:
    const[stateYear, setStateYear] = useState(year.item);
    const[beg_year, setBeg_year] = useState(String(year.item.beg_year));
    const[end_year, setEnd_year] = useState(String(year.item.end_year));
    const[is_editing, setIs_editing] = useState(false);
    // const curr_id = year.item.id;

    // useEffect(() => {
    //     year = stateYear;
    // }, [year, stateYear]);

    const handleYearRender = () => {
        // console.log('handleYearRender(): is_editing:', is_editing);

        if (is_editing == false) {
            return(
                // <Feather name="edit" style={{color: "black", flex: 1}} size={24}/>
                <View style={{paddingBottom: 10}}>
                    <View style={styles.year}>
                        {/* {renderLabel("Season")} */}
                        <Text style={{textAlignVertical: 'center', fontSize: 20, flex: 1}}>Academic Year {stateYear.beg_year}-{stateYear.end_year}:</Text>
                        <TouchableOpacity activeOpacity={0.5} 
                            onPress={() => {
                                console.log('edit button: year:', year);
                                console.log('edit button: year.item.id:', year.item.id);
                                console.log('edit button: years:', years);
                                setIs_editing(true);
                            }}>
                            <AntDesign name="edit" size={30} color="black"/>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        return(
            <View style={{paddingBottom: 10}}>
              <View style={styles.year}>
                  <Text style={{textAlignVertical: 'center'}}>Academic Year:</Text>
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
                  <TouchableOpacity 
                    onPress={() => {
                        console.log('Done button: beg_year:', beg_year);
                        console.log('Done button: end_year:', end_year);
                        setStateYear({
                            ...stateYear,
                            beg_year: beg_year,
                            end_year: end_year
                        });
                        setYears(data => data.map(item => {
                            if(item.id !== year.item.id) return item;
                            return {
                                ...item,
                                beg_year: beg_year,
                                end_year: end_year};
                        }))
                        setIs_editing(false);
                    }}>
                    <AntDesign name="checkcircleo" style={styles.plus_icon} size={30}/>
                  </TouchableOpacity>
              </View>
            </View>
        );
    }

    return(handleYearRender());
}

const YearsScreen = ({navigation, route}) => {
    const {profile} = route.params;
    
    const [years, setYears] = useState(profile["academic_years"]);

    const [nextId, setNextId] = useState(0);

    useEffect(() => {
        profile["academic_years"] = years
    }, [years]);

    const renderYear = ((curr_year) => {
        // console.log('renderYear(): curr_year:', curr_year);
        // const y = {curr_year};
        // console.log('renderYear(): y:', y);
        return(
            // Render current semester in a custom SemesterView component
            <YearView year={curr_year} years={years} setYears={setYears} key={curr_year.item.id}/>
        );
    });

    return(
        <View style={ {flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 10} } >
            <View style={{width: 80, height: 80}}>
                {/* Add Years Button */}
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
                        // nextId++;
                        // profile["academic_years"] = years;
                        // console.log('profile["academic_years"] after adding:', profile["academic_years"]);
                        // navigation.setParams({
                        //     profile: profile
                        // });
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
                    keyExtractor={(item, index) => item.key}
                    renderItem={curr_year => {
                        return renderYear(curr_year);
                    }}
                    // renderItem={({item, index}) => {

                    //     console.log('renderItem: item:', item, typeof item);
                    //     console.log('renderItem: index:', index);
                    //     console.log('renderItem: Object.keys(item):', Object.keys(item), typeof Object.keys(item));
                    //     return null;
                    //     // return renderYear([item][index]);
                    // }}
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
      // width: 100,
      // heigh: 100,
    //   padding: 20,
      color: "black",
      // backgroundColor: 'orange'
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

    label: {
      position: 'relative',
      // backgroundColor: 'white',
      // left: 5,
      // top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },

    year: { 
      alignItems: 'center',
      borderWidth: 4,
      borderRadius: 30,
      padding: 10,
      flexDirection: 'row',
      gap: 10
      // backgroundColor: 'purple',
      // width: '95%'
    },

    inputText: {
      // height: 10,
      // margin: 12,
      textAlign: 'center',
      fontSize: 20,
      borderWidth: 1,
      padding: 10,
      flex: 1
    },

    // fab: {
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // }

})