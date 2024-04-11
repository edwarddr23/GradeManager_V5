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

// export const ProfileContext = createContext<ProfileContent>({
//     profile_name: 'default profile name',
//     setProfile_name: () => {},
//     years: [],
//     setYears: () => {}
// });

// const ProfileContext = createContext<ProfileContent>({
//     profile_name: 'default profile name',
//     setProfile_name: () => {},
//     years: [],
//     setYears: () => {}
// });

const ProfileContext = createContext(null);

export const useProfileContext = () => useContext(ProfileContext);

export function ProfileProvider({children}) {
    const[name, setName] = useState('UNINITIALIZED');
    const[years, setYears] = useState<YearContent[]>([]);
    // const[classes, setClasses] = useState([]);

    let profile_context: ProfileContent = {
        profile_name: name,
        setProfile_name: setName,
        years: years,
        setYears: setYears
    };

    const addYearToProfile = (id) => {
        // const[classes, setClasses] = useState<ClassContent>([]);
        let new_year: YearContent = {
            id: id,
            semesters: [],
            beg_year: -1,
            end_year: -1
        }
        setYears((prev_years) => [
            ...prev_years,
            new_year
        ])
        // setYears([])
    }

    const updateYearsInProfile = (new_years) => {
        setYears(new_years);
    }

    const addSemesterToProfile = (new_semester) => {
        years.find((y) => y.id === new_semester.year_id).semesters.push(new_semester);
    }

    const updateSemesterInProfile = (new_semester) => {
        let curr_semester = years.find((y) => y.id === new_semester.year_id).semesters.find((s) => s.id === new_semester.id);
        curr_semester.season = new_semester.season;
        curr_semester.year = new_semester.year;
    }

    const addClassToProfile = (new_class) => {
        years.find((y) => y.id === new_class.year_id).semesters.find((s) => s.id === new_class.semester_id).classes.push(new_class);
    }

    const updateClassInProfile = (new_class) => {
        let curr_class = years.find((y) => y.id === new_class.year_id).semesters.find((s) => s.id === new_class.semester_id).classes.find((c) => c.id === new_class.id);
        curr_class.name = new_class.name;
        curr_class.sections = new_class.sections;
    }
    
    const updateSemesterClassesInProfile = (semester, new_classes) => {
        let curr_semester = years.find((y) => y.id === semester.year_id).semesters.find((s) => s.id === semester.id);
        curr_semester.classes = new_classes;
    }

    const updateLetterGradeInProfile = (new_letter_grade) => {
        let curr_letter_grade = years.find((y) => y.id === new_letter_grade.year_id).semesters.find((s) => s.id === new_letter_grade.semester_id).classes.find((c) => c.id === new_letter_grade.class_id)?.letter_grading.find((l) => l.id === new_letter_grade.id);
        curr_letter_grade.beg = new_letter_grade.beg;
        curr_letter_grade.end = new_letter_grade.end;
    }

    const addSectionToProfile = (new_section) => {
        years.find((y) => y.id === new_section.year_id).semesters.find((s) => s.id === new_section.semester_id).classes.find((c) => c.id === new_section.class_id).sections.push(new_section);
    }

    const updateSectionInProfile = (new_section) => {
        let curr_section = years.find((y) => y.id === new_section.year_id).semesters.find((s) => s.id === new_section.semester_id).classes.find((c) => c.id === new_section.class_id).sections.find((s) => s.id === new_section.id);
        curr_section.name = new_section.name;
        curr_section.weight = new_section.weight;
        curr_section.average = new_section.average;
        console.log('updateSectionInProfile(): curr_section after editing:', curr_section);
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

    // const getValidAssignmentsFromSection = (section) => {
    //     // return section.assignments.map((a) => {
    //     //     console.log(`getValidAssignmentsFromSection(): a.numerator / a.denominator: ${a.numerator} / ${a.denominator}`);
    //     //     if(a.numerator != -1 && a.denominator != -1) return a;
    //     // })
    //     return section.assignments.filter((a) => {
    //         console.log(`getValidAssignmentsFromSection(): a.numerator / a.denominator: ${a.numerator} / ${a.denominator}`);
    //         if(a.numerator != -1 && a.denominator != -1) return a;
    //     })
    // }

    // const getSectionAverageFromProfile = (section) => {
    //     console.log(`getSectionAverageFromProfile(): This ran!`);
    //     const valid_assignments = getValidAssignmentsFromSection(section);
    //     console.log(`getSectionAverageFromProfile(): valid_assignments: ${valid_assignments}`);
    //     if(valid_assignments.length > 0) {
    //         let total = 0;
    //         valid_assignments.map((v) => {
    //             total += (v.numerator / v.denominator);
    //         });
    //         return (total / valid_assignments.length);
    //     }
    //     return 'N/A';
    //     // const total = section.assignments.map((a) => a.numerator / a.denominator).reduce((x, y) => x + y, 0);
    //     // return total / section.assignments.length;
    //     // return 5;
    // }

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
                addAssignmentToProfile,
                updateAssignmentInProfile,}}>
            {children}
        </ProfileContext.Provider>
    )
}