import React from 'react'
import { View, Text } from 'react-native'
import { useProfileContext } from './profile_context';
import common_style from './common_style';

export const PrintClassesFromProfile = () => {
    const profile_content = useProfileContext();
    const parsed_profile_content = JSON.stringify(profile_content);
    console.log(`PrintClassesFromProfile(): profile_content: ${profile_content}`);
    // console.log(`PrintClassesFromProfile(): parsed_profile_content.years: ${parsed_profile_content.years}`);
    console.log(`PrintClassesFromProfile(): Classes in parsed_profile_content:`)
    // console.log(`PrintClassesFromProfile(): Classes in profile ${profile_content.profile_name}`);
    // profile_content.years.map(year => {
    //     console.log(`PrintClassesFromProfile(): year: ${year}`);
    // });
    // parsed_profile_content.years.map(year => {
    //     console.log(`PrintClassesFromProfile(): year:`, year);
    // });
    console.log(`PrintClassesFromProfile(): parsed_profile_content.years: ${parsed_profile_content.years}`);
}

// Functions used for PrintData():

function PrintSemesters(year) {
    let child_key = 0;
    
    return(
        <View>
            {year.semesters.map((s) => {
                child_key++
                return(
                    <View key={s.id}>
                        {(s.season === '') && (
                            <Text style={[common_style.defaultText, {textDecorationLine: 'underline'}]} key={child_key}>New Semester</Text>
                        )}
                        {s.season !== '' && (
                            <Text style={[common_style.defaultText, {textDecorationLine: 'underline'}]} key={child_key}>{s.season} {s.year}</Text>
                        )}
                        {PrintClasses(s)}
                    </View>
                );
            })} 
        </View>
    );
}

function PrintClasses(semester) {
    let child_key = 0;

    return(
        <View>
            {semester.classes.map((c) => {
                // console.log(`PrintClasses(): c.letter_grading: ${c.letter_grading}`);
                child_key++;
                return(
                    <View key={child_key}>
                        {c.name !== '' && (
                            <Text style={common_style.defaultText} key={child_key++}>{'\t' + c.name}</Text>
                        )}
                        {c.name === '' && (
                            <Text style={common_style.defaultText} key={child_key++}>{'\t'}New Class</Text>
                        )}
                        {/* {PrintLetterGrading(c)} */}
                        {PrintSections(c)}
                    </View>
                );
            })}
        </View>
    )
    // return(<Text style={common_style.defaultText} style={common_style.defaultText}>Class here</Text>)
}

function PrintLetterGrading(curr_class) {
    // console.log(`PrintLetterGrading(): curr_class.letter_grading:`);
    // {Object.keys(curr_class.letter_grading).map((key) => (
    //     console.log(`'\t\t\t' ${key}, ${curr_class.letter_grading[key][0]}% - ${curr_class.letter_grading[key][1]}%`)
    // ))}
    return(
        <View>
            <Text style={common_style.defaultText}>{'\t\t'}Letter Grading</Text>
            {curr_class.letter_grading.map((l) => {
                return(
                    <Text style={common_style.defaultText}>{'\t\t\t' + l.letter}: {l.beg}-{l.end}</Text>
                )
            })}
        </View>
    );
}

function PrintSections(curr_class) {
    let child_key = 0;
    if(curr_class.sections === undefined || curr_class.sections.length == 0){
        return(
            <View>
                <Text style={common_style.defaultText}>{'\t\t'}Sections:</Text>
                <Text style={common_style.defaultText}>{'\t\t\t'}No sections yet!</Text>
            </View>
        );
    }

    return(
        <View>
            <Text style={common_style.defaultText}>{'\t\t'}Sections:</Text>
            {curr_class.sections.map((s) => {
                child_key++;
                if(s.name != ''){
                    return(
                        <View key={child_key}>
                            <Text style={common_style.defaultText}>{'\t\t\t' + s.name + ': ' + (s.weight * 100).toFixed(0) + '%'}</Text>
                            { PrintAssignments(s) }
                        </View>
                    );
                }
                return(
                    <View key={child_key}>
                        <Text style={common_style.defaultText}>{'\t\t\tNew Section'}</Text>
                    </View>
                );
            })}
        </View>
    );
}

function PrintAssignments(section) {
    let child_key = 0;
    if(section.assignments.length === 0){
        return(
            <Text style={common_style.defaultText}>{'\t\t\t\t'}No assignments yet!</Text>
        );
    }
    else{
        return(
            <View>
                {/* <Text style={common_style.defaultText}>{'\t\t\t\t'}Assignments:</Text> */}
                {section.assignments.map((a) => {
                    child_key++;
                    if(a.name === ''){
                        return(
                            <Text style={common_style.defaultText} key={child_key}>{'\t\t\t\t'}New Assignment</Text>
                        );
                    }
                    else if(a.type === 'Percentage'){
                        return(
                            <Text style={common_style.defaultText} key={child_key}>{'\t\t\t\t' + a.name}: {(a.numerator / a.denominator) * 100}%</Text>
                        );
                    }
                    else if(a.type === 'Ratio'){
                        return(
                            <Text style={common_style.defaultText} key={child_key}>{'\t\t\t\t' + a.name}: {a.numerator} / {a.denominator}</Text>
                        );
                    }
                    else{
                        return(
                            <Text style={common_style.defaultText} key={child_key}>{'\t\t\t\t' + a.name}: N/A</Text>
                        );
                    }
                })}
            </View>
        );
    }
}

// The Profile context is passed in rather than called within this component as it led to inconsistent hook calls from the caller.
export const PrintData = (profile_context) => {
    // console.log('PrintData(): profile_context.years:', profile_context.years);
    let child_key = 0;

    return(
        <View>
            <Text style={[common_style.defaultText, {fontWeight: 'bold', textAlign: 'center'}]}>Profile Data for "{profile_context.profile_name}":</Text>
            {profile_context.years.map((year) => {
                child_key++
                // console.log(`PrintData(): year: ${year}`);
                return(
                    <View key={child_key}>
                        {year.beg_year === -1 && (
                            <Text style={[common_style.defaultText, {fontWeight: 'bold'}]}>New Academic Year</Text>
                        )}
                        {year.beg_year !== -1 && (
                            <Text style={[common_style.defaultText, {fontWeight: 'bold'}]}>Academic Year {year.beg_year}-{year.end_year}:</Text>
                        )}
                        { PrintSemesters(year) }
                        {/* {PrintClasses(year)} */}
                    </View>
                );
            })}
            {/* {PrintAcademicYrs(profile)} */}
        </View>
        // <Text style={common_style.defaultText}>Hello</Text>
    );
}