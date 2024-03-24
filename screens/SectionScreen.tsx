import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import { useProfileContext, AssignmentContent } from '../shared/profile_context';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { findNextID } from '../shared/key_functions';

const AssignmentView = ({assignment}) => {
    const { updateAssignmentInProfile } = useProfileContext();
    const[is_editing, setIs_editing] = useState(false);
    const[name, setName] = useState(assignment.name);
    
    // Viewing state for assignment.
    if(!is_editing){
        return(
            <View style={styles.assignmentStyle}>
                <View style={{flexDirection: 'row'}}>
                    {assignment.name === '' && (
                        <Text style={{fontSize: 25, textAlignVertical: 'center'}}>New Assignment</Text>
                    )}
                    {assignment.name !== '' && (
                        <Text style={{fontSize: 25, textAlignVertical: 'center'}}>{assignment.name}</Text>
                    )}
                    {/* Edit button to change name of assignment. */}
                    <TouchableOpacity
                        style={{marginLeft: 'auto'}}
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
        return(
            <View style={styles.assignmentStyle}>
                <View style={{flexDirection: 'row'}}>
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
                            const new_assignment = {
                                ...assignment,
                                name: name
                            }
                            setIs_editing(!is_editing);
                            console.log(`new_assignment.id: ${new_assignment.id}`);
                            updateAssignmentInProfile(new_assignment);
                        }}>
                        <AntDesign name="checkcircleo" size={40} color='green'/>
                    </TouchableOpacity>
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