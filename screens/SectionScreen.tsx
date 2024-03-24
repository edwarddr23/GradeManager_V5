import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import { useProfileContext, AssignmentContent } from '../shared/profile_context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-simple-toast';

import { findNextID } from '../shared/key_functions';

const AssignmentView = ({assignment}) => {
    const { updateAssignmentInProfile } = useProfileContext();
    const[is_editing, setIs_editing] = useState(false);
    const[name, setName] = useState(assignment.name);
    const[type, setType] = useState(assignment.type);
    const[numerator, setNumerator] = useState(assignment.numerator);
    const[denominator, setDenominator] = useState(assignment.denominator);

    useEffect(() => {
        if(type === 'Percentage'){
            setDenominator(100);
        }
    });
    
    // Viewing state for assignment.
    if(!is_editing){
        return(
            <View style={styles.assignmentStyle}>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flexDirection: 'column', paddingLeft: 10}}>
                        {assignment.name === '' && (
                            <Text style={{fontSize: 25, textAlignVertical: 'center', fontWeight: 'bold'}}>New Assignment</Text>
                        )}
                        {assignment.name !== '' && (
                            <Text style={{fontSize: 25, textAlignVertical: 'center', fontWeight: 'bold'}}>{name}:{'\t\t'}</Text>
                        )}
                        {type === 'Percentage' && (
                            <Text style={{fontSize: 25, textAlignVertical: 'center'}}>Grade: {(numerator / denominator) * 100}%</Text>
                        )}
                        {type === 'Ratio' && (
                            <Text style={{fontSize: 25, textAlignVertical: 'center'}}>Grade: {numerator}/{denominator}</Text>
                        )}
                    </View>
                    {/* Edit button to change name of assignment. */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto', justifyContent: 'center'}}
                        activeOpacity={0.5}
                        onPress={() => {
                            setIs_editing(!is_editing);
                        }}>
                        <AntDesign name="edit" size={40} color='black'/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    // Editing state for assignment
    else{
        const types = [
            {key: '0', value: 'Percentage'},
            {key: '1', value: 'Ratio'}
        ];

        return(
            <View style={styles.assignmentStyle}>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                    <TextInput
                        style={styles.inputText}
                        value={name}
                        placeholder="Name"
                        onChangeText={(text) => {
                            setName(text);
                        }}
                    />
                    {/* Done button to update name for assignment. */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto', alignSelf: 'center'}}
                        activeOpacity={0.5}
                        onPress={() => {
                            const validInput = () => {
                                if(name === ''){
                                    Toast.show('Please enter a name', Toast.SHORT);
                                    return false;
                                }
                                // else if(type === ''){
                                //     Toast.show('Please enter a type', Toast.SHORT);
                                //     return false;
                                // }
                                else if(type ==='Percentage'){
                                    if(numerator === -1 || numerator === ''){
                                        Toast.show('Please enter numerator', Toast.SHORT);
                                        return false;
                                    }
                                    else if(denominator === -1 || denominator === ''){
                                        Toast.show('Please enter numerator', Toast.SHORT);
                                        return false;
                                    }
                                    else if(isNaN(numerator)){
                                        Toast.show('Please enter a numeric numerator. Do not enter any punctuation', Toast.SHORT);
                                        return false;
                                    }
                                    else if(!!numerator.toString().match(/[.]/) === true){
                                        // console.log(!!weight.match(/[.]/));
                                        Toast.show('Please enter an integer for the numerator', Toast.SHORT);
                                        return false;
                                    }
                                    else if(numerator < 0){
                                        Toast.show('Please enter a numerator greater or equal to 0', Toast.SHORT);
                                        return false;
                                    }
                                    else if(numerator > denominator){
                                        Toast.show('Percentage cannot be higher than 100', Toast.SHORT);
                                        return false;
                                    }
                                }
                                else if(type === 'Ratio'){
                                    if(denominator === -1 || denominator === ''){
                                        Toast.show('Please enter denominator', Toast.SHORT);
                                        return false;
                                    }
                                    else if(isNaN(denominator)){
                                        Toast.show('Please enter a numeric denominator. Do not enter any punctuation', Toast.SHORT);
                                        return false;
                                    }
                                    else if(!!denominator.toString().match(/[.]/) === true){
                                        // console.log(!!weight.match(/[.]/));
                                        Toast.show('Please enter an integer for the denominator', Toast.SHORT);
                                        return false;
                                    }
                                    else if(denominator < 0){
                                        Toast.show('Please enter a denominator greater or equal to 0', Toast.SHORT);
                                        return false;
                                    }
                                    else if(denominator < numerator){
                                        Toast.show('Please enter a denominator greater or equal to the numerator', Toast.SHORT);
                                        return false;
                                    }
                                }
                                return true;
                            }

                            if(validInput() === true){
                                const new_assignment = {
                                    ...assignment,
                                    name: name,
                                    type: type,
                                    numerator: numerator,
                                    denominator: denominator
                                }
                                setIs_editing(!is_editing);
                                console.log(`new_assignment.name: ${new_assignment.name}`);
                                updateAssignmentInProfile(new_assignment);
                            }
                        }}>
                        <AntDesign name="checkcircleo" size={40} color='green'/>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 2, justifyContent: 'center'}}>
                        <SelectList
                            // Placeholder is type so that the selected type will show after the exam is closed and reopened.
                            placeholder={type}
                            setSelected={(val) => setType(val)}
                            data={types}
                            search={false}
                            save="value"
                        />
                    </View>
                    {type !== '' && (
                        <View style={{flex: 2, flexDirection: 'row'}}>
                            <TextInput
                                style={styles.inputText}
                                value={numerator}
                                onChangeText={(text) => {
                                    setNumerator(text);
                                }}
                            />
                            <Text style={{fontSize: 30, textAlignVertical: 'center'}}>/</Text>
                        </View>
                    )}
                    {type === 'Percentage' && (
                        <View>
                            <Text style={{flex: 1,fontSize: 25, textAlignVertical: 'center'}}>100%</Text>
                        </View>
                    )}
                    {type === 'Ratio' && (
                        <TextInput
                            style={styles.inputText}
                            value={denominator}
                            onChangeText={(text) => {
                                setDenominator(text);
                            }}
                        />
                    )}
                </View>
            </View>
        );
    }
}

const SectionScreen = ({navigation, route}) => {
    const { profile_context, addAssignmentToProfile } = useProfileContext();
    const { section } = route.params;
    const curr_class = profile_context.years.find((y) => y.id === section.year_id).semesters.find((s) => s.id === section.semester_id).classes.find((c) => c.id === section.class_id);

    const[assignments, setAssignments] = useState(section.assignments);

    useEffect(() => {
        navigation.setOptions({
            title: `${section.name} in ${curr_class.name}`
        });
        console.log(`SectionScreen(): section.assignments.length: ${section.assignments.length}`);
        console.log(`SectionScreen(): assignments: ${assignments}`);
    });

    return(
        <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity style={{ height: 75, marginTop: 20, marginBottom: 5}}
                onPress={() => {
                    // let new_class: ClassContent = {
                    //     id: findNextID(classes),
                    //     year_id: semester.year_id,
                    //     semester_id: semester.id,
                    //     name: '',
                    //     sections: []
                    // };
                    // const newClasses = [
                    //     ...classes,
                    //     new_class
                    // ]
                    // setClasses(newClasses);
                    // // console.log(`ADD BUTTON: year.id: ${year.id}`);
                    // console.log(`ADD BUTTON: LOOP`);
                    // newClasses.map((c) => {
                    //     console.log(`c.id: ${c.id}`);
                    // });
                    // addClassToProfile(new_class);
                    // id: Int32
                    // year_id: Int32
                    // semester_id: Int32
                    // class_id: Int32
                    // section_id: Int32
                    // name: string
                    // type: string
                    // numerator: Float
                    // denominator: Float
                    let new_assignment: AssignmentContent = {
                        id: findNextID(assignments),
                        year_id: section.year_id,
                        semester_id: section.semester_id,
                        class_id: section.class_id,
                        section_id: section.id,
                        name: '',
                        type: '',
                        numerator: -1,
                        denominator: -1
                    }
                    const new_assignments = [
                        ...assignments,
                        new_assignment
                    ]
                    setAssignments(new_assignments);
                    addAssignmentToProfile(new_assignment);
                }}>
                <AntDesign name="pluscircleo" size={70} color={'black'}/>
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'center', marginTop: 20, width: '100%'}}>
                <FlatList
                    style={{width: '90%'}}
                    data={assignments}
                    keyExtractor={(item, index) => item.id}
                    removeClippedSubviews={false}
                    renderItem={(assignment) => {
                        return(
                            <AssignmentView assignment={assignment.item}/>
                        );
                    }}
                />
            </View>
        </View>
    );
}

export default SectionScreen;

const styles = StyleSheet.create({
    assignmentStyle: { 
        //   alignItems: 'center',
        borderWidth: 4,
        borderRadius: 30,
        padding: 10,
        marginBottom: 10
        //   flexDirection: 'row',
        // gap: 10
        // backgroundColor: 'purple',
        // width: '95%'
    }, 

    inputText: {
        // height: 10,
        // margin: 12,
        textAlign: 'center',
        fontSize: 25,
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        flex: 1
    },
});