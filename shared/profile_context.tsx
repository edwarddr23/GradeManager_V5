/* 
    profile_context.tsx

    PURPOSE

        The purpose of this file is to define the logic and the global object that will be shared amongst all
        the files in this project. This is what defines the global profile context that will be edited and
        accessible from anywhere within the project. This is what is saved to the backend. Calculations using
        the information in this global object will be defined here.
*/

import React, { createContext, useContext, useState } from 'react';
import { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

// Inspired by https://dev.to/madv/usecontext-with-typescript-23ln.
export type ProfileContent = {
    profile_name: string
    setProfile_name: (value: string) => void
    years: YearContent[]
    setYears: (value: never[]) => void
}

export type YearContent = {
    id: Int32
    semesters: SemesterContent[]
    beg_year: Int32
    end_year: Int32
}

export type SemesterContent = {
    id: Int32
    year_id: Int32
    classes: ClassContent[]
    season: string
    year: Int32
}

export type ClassContent = {
    id: Int32
    year_id: Int32
    semester_id: Int32
    name: string
    letter_grading: LetterGradeContent[]
    sections: SectionContent[]
}

export type LetterGradeContent = {
    id: Int32,
    year_id: Int32
    semester_id: Int32
    class_id: Int32
    letter: string
    beg: Int32
    end: Int32
}

export type SectionContent = {
    id: Int32,
    year_id: Int32
    semester_id: Int32
    class_id: Int32
    name: string
    weight: Float
    average: Float
    assignments: AssignmentContent[]
}

export type AssignmentContent = {
    id: Int32
    year_id: Int32
    semester_id: Int32
    class_id: Int32
    section_id: Int32
    name: string
    type: string
    numerator: Int32
    denominator: Int32
}

const ProfileContext = createContext(null);

export const useProfileContext = () => useContext(ProfileContext);

/*
NAME

    ProfileProvider - a function component that will provide the global object to all the components within this project and the functions that are performed on its properties.

SYNOPSIS

    <ProfileContext.Provider> ProfileProvider({children})
        children --> an object, which presumably is all of the children inside the ProfileContext.Provider component.

DESCRIPTION

    The global ProfileContent object and all the operations on this object are defined within this function.

RETURNS

    Returns a ProfileContent.Provider that will provide the global profile_context object and the functions which modify that object.
*/
export function ProfileProvider({children}) {
    const[name, setName] = useState('UNINITIALIZED');
    const[years, setYears] = useState<YearContent[]>([]);

    let profile_context: ProfileContent = {
        profile_name: name,
        setProfile_name: setName,
        years: years,
        setYears: setYears
    };

    /*
    NAME

        addYearToProfile - function component that adds a year to the global profile context.

    SYNOPSIS

        void addYearToProfile(id)
            id --> an int, which presumably is the id to assign the new YearContent object that will be added to the global profile_context object.

    DESCRIPTION

        Modifies the global_context object by creating a new YearContent object with the id of parameter id. The new year is accumulated
        within the profile_context's years.

    RETURNS

        Returns void.
    */
    const addYearToProfile = (id) => {
        let new_year: YearContent = {
            id: id,
            semesters: [],
            beg_year: -1,
            end_year: -1
        }
        setYears((prev_years) => [
            ...prev_years,
            new_year
        ]);
    }

    /*
    NAME

        updateYearsInProfile - function component that updates the years in profile_context.

    SYNOPSIS

        void updateYearsInProfile(new_years)
            new_years --> an YearContent array that the years in profile_context need to be modified to.

    DESCRIPTION

        Modifies the global_context object's years to the years passed in.

    RETURNS

        Returns void.
    */
    const updateYearsInProfile = (new_years) => {
        setYears(new_years);
    }

    /*
    NAME

        addSemesterToProfile - function component that adds a semester to profile_context.

    SYNOPSIS

        void addSemesterToProfile(new_semester)
            new_semester --> a SemesterContent object that will be added to the profile_context's respective academic year.

    DESCRIPTION

        Using the information found in parameter new_semester, find the respective academic year to add the semester to, and then
        push the new_semester object onto it.

    RETURNS

        Returns void.
    */
    const addSemesterToProfile = (new_semester) => {
        years.find((y) => y.id === new_semester.year_id).semesters.push(new_semester);
    }

    /*
    NAME

        updateSemesterInProfile - function component that updates a semester in object profile_context.

    SYNOPSIS

        void updateSemesterInProfile(new_semester)
            new_semester --> a SemesterContent object whose info will be used to update the object it refers to.

    DESCRIPTION

        Using the information found in parameter new_semester, find the respective semester object to update, and modify its
        season and year properties with the property values in parameter new_semester.

    RETURNS

        Returns void.
    */
    const updateSemesterInProfile = (new_semester) => {
        let curr_semester = years.find((y) => y.id === new_semester.year_id).semesters.find((s) => s.id === new_semester.id);
        curr_semester.season = new_semester.season;
        curr_semester.year = new_semester.year;
    }

    /*
    NAME

        addClassToProfile - function component that adds a class to profile_context.

    SYNOPSIS

        void addClassToProfile(new_class)
            new_class --> a ClassContent object that will be added to the profile_context's respective semester.

    DESCRIPTION

        Using the information found in parameter new_class, find the respective semester to add the class to, and then
        push the new_class object onto it.

    RETURNS

        Returns void.
    */
    const addClassToProfile = (new_class) => {
        years.find((y) => y.id === new_class.year_id).semesters.find((s) => s.id === new_class.semester_id).classes.push(new_class);
    }

    /*
    NAME

        updateClassInProfile - function component that updates a ClassContent object in object profile_context.

    SYNOPSIS

        void updateClassInProfile(new_class)
            new_class --> a ClassContent object whose info will be used to update the object it refers to.

    DESCRIPTION

        Using the information found in parameter new_class, find the respective ClassContent object to update, and modify its
        name and sections properties with the property values in parameter new_class.

    RETURNS

        Returns void.
    */
    const updateClassInProfile = (new_class) => {
        let curr_class = years.find((y) => y.id === new_class.year_id).semesters.find((s) => s.id === new_class.semester_id).classes.find((c) => c.id === new_class.id);
        curr_class.name = new_class.name;
        curr_class.sections = new_class.sections;
    }
    
    /*
    NAME

        updateSemesterClassesInProfile - function component that updates a semester object's classes in object profile_context.

    SYNOPSIS

        void updateSemesterClassesInProfile(semester, new_classes)
            semester --> a SemesterContent object whose classes will be modified.
            new_classes --> a ClassContent array which will replace the classes in parameter semester.

    DESCRIPTION

        Using the information found in parameter semester, find the respective classes array to update, and modify it to
        parameter new_classes.

    RETURNS

        Returns void.
    */
    const updateSemesterClassesInProfile = (semester, new_classes) => {
        let curr_semester = years.find((y) => y.id === semester.year_id).semesters.find((s) => s.id === semester.id);
        curr_semester.classes = new_classes;
    }

    /*
    NAME

        updateLetterGradeInProfile - function component that updates a letter grade object in object profile_context.

    SYNOPSIS

        void updateLetterGradeInProfile(new_letter_grade)
            new_letter_grade --> a LetterGradeContent object whose information will be updated.

    DESCRIPTION

        Using the information found in parameter new_letter_grade, find the respective letter grade to update, and modify it's
        properties beg and end to the ones found in new_letter_grade.

    RETURNS

        Returns void.
    */
    const updateLetterGradeInProfile = (new_letter_grade) => {
        let curr_letter_grade = years.find((y) => y.id === new_letter_grade.year_id).semesters.find((s) => s.id === new_letter_grade.semester_id).classes.find((c) => c.id === new_letter_grade.class_id)?.letter_grading.find((l) => l.id === new_letter_grade.id);
        curr_letter_grade.beg = new_letter_grade.beg;
        curr_letter_grade.end = new_letter_grade.end;
    }

    /*
    NAME

        addSectionToProfile - function component that adds a section to profile_context.

    SYNOPSIS

        void addSectionToProfile(new_section)
            new_section --> a SectionContent object that will be added to the profile_context's respective class object.

    DESCRIPTION

        Using the information found in parameter new_section, find the respective class object to add the section to, and then
        push the new_section object onto it.

    RETURNS

        Returns void.
    */
    const addSectionToProfile = (new_section) => {
        years.find((y) => y.id === new_section.year_id).semesters.find((s) => s.id === new_section.semester_id).classes.find((c) => c.id === new_section.class_id).sections.push(new_section);
    }

    /*
    NAME

        updateSectionInProfile - function component that updates a letter grade object in object profile_context.

    SYNOPSIS

        void updateLetterGradeInProfile(new_letter_grade)
            new_letter_grade --> a LetterGradeContent object whose information will be updated.

    DESCRIPTION

        Using the information found in parameter new_letter_grade, find the respective letter grade to update, and modify it's
        properties beg and end to the ones found in new_letter_grade.

    RETURNS

        Returns void.
    */
    const updateSectionInProfile = (new_section) => {
        let curr_section = years.find((y) => y.id === new_section.year_id).semesters.find((s) => s.id === new_section.semester_id).classes.find((c) => c.id === new_section.class_id).sections.find((s) => s.id === new_section.id);
        curr_section.name = new_section.name;
        curr_section.weight = new_section.weight;
        curr_section.average = new_section.average;
    }

    const updateClassSectionsInProfile = (curr_class, new_sections) => {
        years.find((y) => y.id === curr_class.year_id).semesters.find((s) => s.id === curr_class.semester_id).classes.find((c) => c.id === curr_class.id).sections = new_sections;
        // console.log(`updateClassSectionsInProfile(): c_class.sections: ${c_class.sections}`);
    }
    
    const addAssignmentToProfile = (new_assignment) => {
        years.find((y) => y.id === new_assignment.year_id).semesters.find((s) => s.id === new_assignment.semester_id).classes.find((c) => c.id === new_assignment.class_id).sections.find((s) => s.id === new_assignment.section_id).assignments.push(new_assignment);
    }

    const updateAssignmentInProfile = (new_assignment) => {
        let curr_assignment = years.find((y) => y.id === new_assignment.year_id).semesters.find((s) => s.id === new_assignment.semester_id).classes.find((c) => c.id === new_assignment.class_id).sections.find((s) => s.id === new_assignment.section_id).assignments.find((a) => a.id === new_assignment.id);
        curr_assignment.name = new_assignment.name;
        curr_assignment.type = new_assignment.type;
        curr_assignment.numerator = new_assignment.numerator;
        curr_assignment.denominator = new_assignment.denominator;
    }

    const updateSectionAssignmentsInProfile = (section, new_assignments) => {
        years.find((y) => y.id === section.year_id).semesters.find((s) => s.id === section.semester_id).classes.find((c) => c.id === section.class_id).sections.find((s) => s.id === section.id).assignments = new_assignments;
    }

    return(
        <ProfileContext.Provider value={{
                profile_context,
                addYearToProfile,
                updateYearsInProfile,
                addSemesterToProfile,
                updateSemesterInProfile,
                addClassToProfile,
                updateClassInProfile,
                updateSemesterClassesInProfile,
                updateLetterGradeInProfile,
                addSectionToProfile,
                updateSectionInProfile,
                updateClassSectionsInProfile,
                addAssignmentToProfile,
                updateAssignmentInProfile,
                updateSectionAssignmentsInProfile}}>
            {children}
        </ProfileContext.Provider>
    )
}