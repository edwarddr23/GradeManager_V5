/* 
    profile_functions.tsx

    PURPOSE

        The purpose of this file is to define the logic and components created
        to print out the profile data when loading or saving a profile.
*/

import React from 'react';
import { View, Text } from 'react-native';
import common_style from './common_style';
import { determineLetterGrade, calculateClassAverage } from './calculation_functions';

// Functions used for PrintData():

/*
NAME

    PrintSemesters - a function that prints the semesters found in parameter year.
    
SYNOPSIS

    <View> findNextID(arr)
        arr --> an array, of presumably objects, to determine the next ID for.

DESCRIPTION

    Iterate through every element within parameter arr. If the id in the current element in question is greater than the maxID,
    then that is the new maxID. After all elements have been considered, the maxID + 1 will be returned, to ensure that the next
    ID is different.

RETURNS

    Returns an int that represents the next id for a new object in the parameter arr.
*/
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
                child_key++;
                return(
                    <View key={child_key}>
                        {c.name !== '' && (
                            <Text style={common_style.defaultText} key={child_key++}>{'\t' + c.name}: {determineLetterGrade(c.letter_grading, calculateClassAverage(c.sections) * 100)}</Text>
                        )}
                        {c.name === '' && (
                            <Text style={common_style.defaultText} key={child_key++}>{'\t'}New Class: {determineLetterGrade(c.letter_grading, calculateClassAverage(c.sections) * 100)}</Text>
                        )}
                        {PrintSections(c)}
                    </View>
                );
            })}
        </View>
    )
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