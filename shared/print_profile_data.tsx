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

    <View> PrintSemesters(year)
        year --> a YearContent object whose semesters' info will be outputted to the <View>.

DESCRIPTION

    Iterate through parameter year's semesters and output their info depending on whether it is properly initialized or not
    (whether the semester's season has been defined). Each semester's season, year, and classes are displayed.

RETURNS

    Returns a View component that shows information from the parameter year's semesters.
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

/*
NAME

    PrintClasses - a function that prints the classes found in parameter semester.
    
SYNOPSIS

    <View> PrintClasses(semester)
        semester --> a SemesterContent object whose class' info will be outputted to the <View>.

DESCRIPTION

    Iterate through parameter semester's classes and output their info depending on whether it is properly initialized or not
    (whether the class's name has been defined). Each class's name, letter grade, and sections are displayed.

RETURNS

    Returns a View component that shows information from the parameter semester's classes.
*/
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

/*
NAME

    PrintSections - a function that prints the sections found in parameter curr_class.
    
SYNOPSIS

    <View> PrintSections(curr_class)
        curr_class --> a ClassContent object whose sections' info will be outputted to the <View>.

DESCRIPTION

    Iterate through parameter curr_class's sections and output their info depending on whether there are sections
    in the class or not. Each section's name, relative weight, and assignments are displayed.

RETURNS

    Returns a View component that shows information from the parameter curr_class's sections.
*/
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

/*
NAME

    PrintAssignments - a function that prints the assignments found in parameter section.
    
SYNOPSIS

    <View> PrintAssignments(section)
        section --> a SectionContent object whose assignments' info will be outputted to the <View>.

DESCRIPTION

    Iterate through parameter section's assignments and output their info depending on whether there are assignments
    in the section or not. Each assignment's name, grade, or numerator and denominator are displayed.

RETURNS

    Returns a View component that shows information from the parameter section's assignments.
*/
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

/*
NAME

    PrintData - a function component that prints the academic years and their childrens' data found in parameter profile_context.
    
SYNOPSIS

    <View> PrintData(profile_context)
        profile_context --> a ProfileContent object whose academic years' info will be outputted to the <View>.

DESCRIPTION

    Iterate through parameter profile_context's academic years and output their info. Each academic year's beginning year, end 
    year, and semesters are displayed.

RETURNS

    Returns a View component that shows information from the parameter profile_context's academic years.
*/
// The Profile context is passed in rather than called within this component as it led to inconsistent hook calls from the caller.
export const PrintData = (profile_context) => {
    let child_key = 0;

    return(
        <View>
            <Text style={[common_style.defaultText, {fontWeight: 'bold', textAlign: 'center'}]}>Profile Data for "{profile_context.profile_name}":</Text>
            {profile_context.years.map((year) => {
                child_key++
                return(
                    <View key={child_key}>
                        {year.beg_year === -1 && (
                            <Text style={[common_style.defaultText, {fontWeight: 'bold'}]}>New Academic Year</Text>
                        )}
                        {year.beg_year !== -1 && (
                            <Text style={[common_style.defaultText, {fontWeight: 'bold'}]}>Academic Year {year.beg_year}-{year.end_year}:</Text>
                        )}
                        { PrintSemesters(year) }
                    </View>
                );
            })}
        </View>
    );
}