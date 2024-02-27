import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'

const YearView = ({year}) => {
    // useStates for TextInputs:
    const[beg_year, setBeg_year] = useState("");
    const[end_year, setEnd_year] = useState("");
    // const[is_editing, setIs_editing] = useState(false);
    let is_editing = false;

    console.log('YearView(): year.item:', year.item);

    handleYearRender = () => {
        // console.log('handleYearRender(): is_editing:', is_editing);
        if (is_editing === false) {
            return <Feather name="edit" style={{color: "black", flex: 1}} size={24}/>
        }
        return <AntDesign name="checkcircleo" size={24} color="black"/>
    }

    return(
        <View style={{paddingBottom: 10}}>
            <View style={styles.year}>
                {/* {renderLabel("Season")} */}
                <Text style={{textAlignVertical: 'center', fontSize: 20, flex: 1}}>Academic Year {year.item.beg_year}-{year.item.end_year}:</Text>
                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                  console.log('Add a huh?');
                  is_editing = is_editing === false ? true : false
                  // setIs_editing(is_editing === false ? true : false);
                  console.log('AFTER is_editing:', is_editing);
                  }}>
                  { handleYearRender() }
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={0.5} onPress={() => {
                    print('YearView: this ran');
                    setIs_editing(!is_editing);
                    print('YearView: is_editing:', is_editing);
                  }}>
                    <Feather name="edit" style={{color: "black", flex: 1}} size={24}/>
                </TouchableOpacity> */}
            </View>
        </View>
        // Editing Semester View:
        // <View style={{paddingBottom: 10}}>
        //   <View style={styles.year}>
        //       {/* {renderLabel("Season")} */}
        //       <Text style={{textAlignVertical: 'center'}}>Academic Year:</Text>
        //       {/*Beg Year Number */}
        //       <TextInput
        //           style={styles.inputText}
        //           value={beg_year}
        //           placeholder="Start"
        //           onChangeText={text => {
        //               setBeg_year(text);
        //           }}
        //           onEndEditing={() => {
        //               year.beg_year = beg_year;
        //           }}
        //           onSubmitEditing={() => {
        //               year.beg_year = beg_year;
        //           }}
        //           keyboardType="numeric"
        //       />
        //       {/*End Year Number */}
        //       <TextInput
        //           style={styles.inputText}
        //           value={end_year}
        //           placeholder="End"
        //           onChangeText={text => {
        //               setEnd_year(text);
        //           }}
        //           onEndEditing={() => {
        //               year.end_year = end_year;
        //           }}
        //           onSubmitEditing={() => {
        //               year.end_year = end_year;
        //           }}
        //           keyboardType="numeric"
        //       />
        //       <TouchableOpacity onPress={() => {console.log('Add a huh?')}}>
        //           <AntDesign name="pluscircleo" style={styles.plus_icon} size={30}/>
        //       </TouchableOpacity>
        //   </View>
        // </View>
    );
}

const YearsScreen = ({navigation, route}) => {
    const {profile} = route.params;
    console.log('YearsScreen.tsx: profile:', profile);
    console.log('YearsScreen.tsx: profile["name"]:', profile["name"]);
    console.log('YearsScreen.tsx: profile["academic_years"]:', profile["academic_years"]);
    for(academic_year of profile["academic_years"]){
        console.log('YearsScreen.tsx: LOOP', {academic_year});
        for(curr_class of academic_year["classes"]){
            console.log('YearsScreen.tsx: LOOP curr_class:', {curr_class});
        }
    }

    // return(
    //     <View>
    //         <Text>{route.params.profile["name"]}</Text>
    //         {/* <Text>{route.params.profile_name}</Text> */}
    //     </View>
    // );
    
    const [years, setYears] = useState(profile["academic_years"]);
    console.log('INITIAL years:', years);

    const renderYear = ((curr_year) => {
        console.log('renderYear(): curr_year:', curr_year);
        return(
            // Render current semester in a custom SemesterView component
            // <View style={{backgroundColor: 'purple'}}>
                <YearView
                year={curr_year}
                //   key={curr_year.id}
                />
            // </View>
        );
    });

    return(
        <View style={ {flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 20} } >
            <View style={{width: 80, height: 80}}>
              <TouchableOpacity 
                activeOpacity={0.5} 
                onPress={() => {
                    console.log('Button Pressed!')
                    setYears([
                        ...years,
                        {
                        // id: nextId++,
                        beg_year: "",
                        end_year: "",
                        classes: []
                    },
                    ])
                }}
              >
                <AntDesign name="pluscircleo" style={styles.plus_icon} size={80}/>
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: 17, fontWeight: 'bold', paddingBottom: 5}}>Press the plus sign to add an academic year</Text>
            <FlatList
                data={years}
                renderItem={(curr_year => {
                  return renderYear(curr_year);
                })}
                width='90%'
            />
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