import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useProfileContext, SectionContent } from '../shared/profile_context';
import Toast from 'react-native-simple-toast';

import { findNextID } from '../shared/key_functions';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import Footer from '../shared/custom_footer';

const SectionView = ({section, deleteSection}) => {
    const { updateSectionInProfile } = useProfileContext();
    const[is_editing, setIs_editing] = useState(false);
    const[name, setName] = useState(section.name);
    // Precision needs to be defined as sometimes an integer over 100 gives a repeating integer (example 55 /100)
    const[weight, setWeight] = useState((section.weight * 100).toFixed(0));

    return(
        <View style={styles.section}>
            {/* Viewing state of section. */}
            {!is_editing && (
                <View style={{flexDirection: 'row'}}>
                    {name === '' && (
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>New Section</Text>
                    )}
                    {name !== '' && (
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>{section.name}: {weight}%</Text>
                    )}
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
                        <TextInput
                            style={styles.inputText}
                            value={name}
                            placeholder="Name"
                            onChangeText={text => {
                                setName(text);
                            }}
                        />
                        <TextInput
                            style={styles.inputText}
                            value={weight}
                            placeholder="Weight"
                            onChangeText={text => {
                                setWeight(text);
                            }}
                            keyboardType='numeric'
                        />
                        {/* Done button to change the name of a section. */}
                        <TouchableOpacity
                            style={{marginLeft: 'auto', alignSelf: 'center'}}
                            onPress={() => {
                                const inputIsValid = () => {
                                    if(name === ''){
                                        return true;
                                    }
                                    if(weight === -1 || weight === ''){
                                        Toast.show('Please enter weight', Toast.SHORT);
                                        return false;
                                    }
                                    else if(isNaN(weight)){
                                        Toast.show('Please enter a numeric weight. Do not enter any punctuation', Toast.SHORT);
                                        return false;
                                    }
                                    else if(!!weight.match(/[.]/) === true){
                                        // console.log(!!weight.match(/[.]/));
                                        Toast.show('Please enter an integer for a weight', Toast.SHORT);
                                        return false;
                                    }
                                    else if(weight < 0){
                                        Toast.show('Please enter a weight greater or equal to 0', Toast.SHORT);
                                        return false;
                                    }
                                    return true;
                                }
                                
                                console.log(`Number.isInteger(${weight}): ${Number.isInteger(weight)}`)

                                if(inputIsValid() === true){
                                    const formatter = new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 2,      
                                        maximumFractionDigits: 2
                                    })
                                    const new_section = {
                                        ...section,
                                        name: name,
                                        weight: formatter.format(weight / 100)
                                    };
                                    console.log('new_section:', new_section);
                                    console.log('new_section.weight:', new_section.weight);
                                    updateSectionInProfile(new_section);
                                    setIs_editing(!is_editing);
                                }
                            }}>
                            <AntDesign name='checkcircleo' size={45} color='green'/>
                        </TouchableOpacity>
                    </View>
                    {/* Button that deletes a year from a semester. */}
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => deleteSection(section)}>
                        <AntDesign name="delete" size={50} color={'black'}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const ConfigureSectionsScreen = ({navigation, route}) => {
    const { profile_context, addSectionToProfile, updateClassSectionsInProfile } = useProfileContext();
    const { curr_class } = route.params;
    console.log(`ConfigureSectionsScreen(): curr_class: ${curr_class}`);

    // const[sections, setSections] = useState(curr_class.sections);
    const[sections, setSections] = useState(profile_context.years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id).classes.find((c) => c.id === curr_class.id).sections);
    const[total_weight, setTotal_weight] = useState<Float>(-1);

    useEffect(() => {
        // updateClassSectionsInProfile(curr_class, sections);
        let class_name;
        if(curr_class.name === ''){
            class_name = 'New Class';
        }
        else{
            class_name = curr_class.name;
        }
        // return total;
        navigation.setOptions({
            title: `Sections in ${class_name}`,
            headerLeft: () => (
                <View style={{marginRight: 20}}>
                    <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        const { year, curr_class } = route.params;
                        console.log('CUSTOM BUTTON PRESSED!');
                        // console.log(`CUSTOM BUTTON: total_weight: ${total_weight}`);
                        // console.log(`Custom Button: route.params: ${route.params}`);
                        // profile_context.years.find()
                        // console.log(`Custom Button: year: ${year.beg_year}-${year.end_year}, curr_class.name: ${curr_class.name}`);
                        let total = 0;
                        sections.map((s) => {
                            // console.log('MAP: s.weight:', s.weight);
                            if(s.weight != -1 && s.weight != undefined){
                                total += parseInt(parseFloat(s.weight) * 100);
                            }
                        });
                        console.log(`useEffect(): total: ${total}`);
                        if(total > 100){
                            Toast.show('The total weights cannot exceed 100%', Toast.SHORT);
                        }
                        else{
                            // const new_class = {
                            //     ...curr_class,
                            //     sections: sections
                            // }
                            // updateClassInProfile(year.id, curr_class.id, new_class);
                            // navigation.goBack();
                            navigation.navigate('Semester', {semester: profile_context.years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id)});
                        }
                    }}>
                    <AntDesign name="arrowleft" size={25} color='black'/>
                    </TouchableOpacity>
                </View>
            )
        });
    }, []);

    return(
        <View style={{flex: 1, alignItems: 'center'}}>
            <View style={{marginVertical: 10, width: '80%', flex: 1}}>
                {/* Button that adds a section. */}
                <TouchableOpacity
                    style={{marginBottom: 10, alignSelf: 'center'}}
                    activeOpacity={0.5}
                    onPress={() => {
                        // id: Int32,
                        // year_id: Int32
                        // semester_id: Int32
                        // class_id: Int32
                        // name: string
                        // weight: Float
                        // average: Float
                        // assignments: AssignmentContent[]
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
                        // console.log(`new_section.assignments.length: ${new_section.assignments.length}`);
                        setSections([
                            ...sections,
                            new_section
                        ]);
                        addSectionToProfile(new_section);
                    }}>
                    <AntDesign name="pluscircleo" size={55} color='black'/>
                </TouchableOpacity>
                {sections.length === 0 && (
                    <Text style={{textAlign: 'center', fontSize: 20}}>Press this button to add sections</Text>
                )}
                <View style={{flex: 1}}>
                    <FlatList
                        style={{width: '100%'}}
                        data={sections}
                        keyExtractor={(item, index) => item.id}
                        removeClippedSubviews={false}
                        renderItem={(section) => {
                            // const chgSections = (new_section) => {
                            //     const new_sections = 
                            //     setSections();
                            // }
                            const deleteSectionFromClass = (section) => {
                                // console.log(`deleteSectionFromClass(): This ran`);
                                const new_sections = sections.filter((s) => s.id !== section.id);
                                setSections(new_sections);
                                updateClassSectionsInProfile(curr_class, new_sections);
                                // updateSemesterClassesInProfile(semester, new_classes);
                            }

                            return(
                                <SectionView section={section.item} deleteSection={deleteSectionFromClass}/>
                            );
                        }}
                    />
                </View>
            </View>
            {/* FOOTER */}
            <Footer/>
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