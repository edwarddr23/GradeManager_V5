import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useProfileContext } from '../shared/profile_context'; 

// const LetterGradeView = ({lett_key, beg, end}) => {
//     // console.log(`LetterGradeView(): key: ${key.item}`);
//     const[letter_key, setLetter_key] = useState(lett_key);
//     const[grade_beg, setGrade_beg] = useState(beg);
//     const[grade_end, setGrade_end] = useState(end);

//     return(
//         <View style={styles.letterGrade}>
//             <Text>{'\t\t\t' + letter_key}, {grade_beg}% - {grade_end}%</Text>
//         </View>
//     );
// }

const LetterGradeView = ({letter_grade}) => {
    // console.log(`LetterGradeView(): letter_grade: ${JSON.stringify(letter_grade)}`);
    const { updateLetterGradeInProfile } = useProfileContext();
    const[is_editing, setIs_editing] = useState(false);
    const[beg, setBeg] = useState(letter_grade.beg);
    const[end, setEnd] = useState(letter_grade.end);

    return(
        <View>
            {/* Viewing state of Letter Grade. */}
            {!is_editing && (
                <View style={styles.letterGrade}>
                    <Text style={{fontSize: 30, flex: 1}}>{letter_grade.letter}: {beg}-{end}</Text>
                    <TouchableOpacity style={{flex: 1}}
                        onPress={() => {
                            setIs_editing(!is_editing);
                        }}>
                        <AntDesign style={{marginLeft: 'auto', justifyContent: 'center'}} name="edit" size={45} color={'black'}/>
                    </TouchableOpacity>
                </View>
            )}
            {/* Editing state of Letter Grade. */}
            {is_editing && (
                <View style={styles.letterGrade}>
                    <TextInput
                        style={styles.inputText}
                        value={beg}
                        placeholder="Beg"
                        onChangeText={text => {
                            setBeg(text);
                        }}
                    />
                    <TextInput
                        style={styles.inputText}
                        value={end}
                        placeholder="End"
                        onChangeText={text => {
                            setEnd(text);
                        }}
                    />
                    {/* Done button for Letter Grade */}
                    <TouchableOpacity style={{flex: 1}}
                        onPress={() => {
                            setIs_editing(!is_editing);
                            const new_letter_grade = {
                                ...letter_grade,
                                beg: beg,
                                end: end
                            };
                            updateLetterGradeInProfile(new_letter_grade);
                        }}>
                        <AntDesign style={{marginLeft: 'auto', alignSelf: 'center'}} name="checkcircleo" size={45} color={'green'}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const ConfigureLetterGradingScreen = ({navigation, route}) => {
    const { profile_context } = useProfileContext();
    const { curr_class } = route.params;
    const[letter_grading, setLetter_grading] = useState(curr_class.letter_grading);

    useEffect(() => {
        const title = () => {
            if(curr_class.name === '') return `New Class`;
            return curr_class.name;
        };
        navigation.setOptions({
            title: `Letter Grading in ${title()}`,
            headerLeft: () => (
                <View style={{marginRight: 20}}>
                    <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        console.log('SectionScreen.tsx: CUSTOM BACK BUTTON');
                        navigation.navigate('Semester', {semester: profile_context.years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id)});
                    }}>
                    <AntDesign name="arrowleft" size={25} color='black'/>
                    </TouchableOpacity>
                </View>
            )
        });
    })
    
    return(
        // <Text>Configure letter grading!</Text>
        <View style={styles.container}>
            {/* <Text>{'\t\t'}Letter Grading:</Text> */}
            <FlatList
                style={{width: '100%'}}
                data={letter_grading}
                keyExtractor={(item, index) => item.id}
                removeClippedSubviews={false}
                renderItem={(letter_grade) => {
                    return(
                        // <Text>A letter grade</Text>
                        <LetterGradeView letter_grade={letter_grade.item}/>
                    );
                }}
                contentContainerStyle={{marginTop: 30}}
                ItemSeparatorComponent={() => <View style={{height: 20}}/>}
            />
            {/* {Object.keys(letter_grading).map((key) => (
                <LetterGradeView lett_key={key} beg={curr_class.letter_grading[key][0]} end={curr_class.letter_grading[key][1]}/>
            ))} */}
        </View>
    );
}

export default ConfigureLetterGradingScreen;

const styles = StyleSheet.create({
    container: {
        width: '90%',
        // flexDirection: 'column',
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'purple',
        alignSelf: 'center',
        gap: 20
        // flex: 1,
    },

    letterGrade: {
        padding: 20,
        backgroundColor: '#BEBEBE',
        borderRadius: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
        // justifyContent: 'center',
        // alignSelf: 'center'
        // marginBottom: 20
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