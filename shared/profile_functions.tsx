import React from 'react'
import { View, Text } from 'react-native'
import { useProfileContext } from './profile_context';

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
                            <Text key={child_key} style={{textDecorationLine: 'underline'}}>New Semester</Text>
                        )}
                        {s.season !== '' && (
                            <Text key={child_key} style={{textDecorationLine: 'underline'}}>{s.season} {s.year}</Text>
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
                child_key++;
                return(
                    <View key={child_key}>
                        {c.name !== '' && (
                            <Text key={child_key++}>{'\t' + c.name}</Text>
                        )}
                        {c.name === '' && (
                            <Text key={child_key++}>New Class</Text>
                        )}
                        {PrintSections(c)}
                    </View>
                );
            })}
        </View>
    )
    // return(<Text>Class here</Text>)
}

function PrintSections(curr_class) {
    let child_key = 0;
    if(curr_class.sections === undefined || curr_class.sections.length == 0){
        return(
            <View>
                <Text>{'\t\t'}No sections yet!</Text>
            </View>
        );
    }

    return(
        <View>
            {curr_class.sections.map((s) => {
                child_key++;
                if(s.name != ''){
                    return(
                        <View key={child_key}>
                            <Text>{'\t\t' + s.name + ': ' + s.weight * 100 + '%'}</Text>
                            { PrintAssignments(s) }
                        </View>
                    );
                }
                return(
                    <View key={child_key}>
                        <Text>{'\t\tNew Section'}</Text>
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
            <Text>{'\t\t\t'}No assignments yet!</Text>
        );
    }
    else{
        return(
            <View>
                {/* <Text>Listing assignments...</Text> */}
                {section.assignments.map((a) => {
                    child_key++;
                    if(a.name === ''){
                        return(
                            <Text key={child_key}>{'\t\t\t'}New Assignment</Text>
                        );
                    }
                    else if(a.type === 'Percentage'){
                        return(
                            <Text key={child_key}>{'\t\t\t' + a.name}: {(a.numerator / a.denominator) * 100}%</Text>
                        );
                    }
                    else if(a.type === 'Ratio'){
                        return(
                            <Text key={child_key}>{'\t\t\t' + a.name}: {a.numerator} / {a.denominator}</Text>
                        );
                    }
                    else{
                        return(
                            <Text key={child_key}>{'\t\t\t' + a.name}: {a.numerator} / {a.denominator}</Text>
                        );
                    }
                })}
            </View>
        );
    }
}

// The Profile context is passed in rather than called within this component as it led to inconsistent hook calls from the caller.
export const PrintData = (profile_context) => {
    console.log('PrintData(): profile_context.years:', profile_context.years);
    let child_key = 0;

    return(
        <View>
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Profile Data for "{profile_context.profile_name}":</Text>
            {profile_context.years.map((year) => {
                child_key++
                // console.log(`PrintData(): year: ${year}`);
                return(
                    <View key={child_key}>
                        {year.beg_year === -1 && (
                            <Text style={{fontWeight: 'bold'}}>New Academic Year</Text>
                        )}
                        {year.beg_year !== -1 && (
                            <Text style={{fontWeight: 'bold'}}>Academic Year {year.beg_year}-{year.end_year}:</Text>
                        )}
                        { PrintSemesters(year) }
                        {/* {PrintClasses(year)} */}
                    </View>
                );
            })}
            {/* {PrintAcademicYrs(profile)} */}
        </View>
        // <Text>Hello</Text>
    );
}