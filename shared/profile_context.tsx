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
    classes: ClassContent[]
    beg_year: Int32
    end_year: Int32
}

export type ClassContent = {
    id: Int32
    year_id: Int32
    name: string
    sections: SectionContent[]
}

export type SectionContent = {
    id: Int32
    class_id: Int32
    name: string
    weight: Float
    average: Float
    assignment: AssignmentContent[]
}

export type AssignmentContent = {
    id: Int32
    
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
            classes: [],
            beg_year: -1,
            end_year: -1
        }
        setYears((prev_years) => [
            ...prev_years,
            new_year
        ])
        // setYears([])
    }

    const addClassToProfile = (new_class) => {
        // const new_class: ClassContent = {
        //     id: new_class_id,
        //     year_id: year_id,
        //     name: 'New Class',
        //     sections: []
        // }
        years.find((y) => y.id === new_class.year_id).classes.push(new_class);
    }

    const updateClassInProfile = (year_id, class_id, new_class) => {
        console.log(`updateClassInProfile(): year_id: ${year_id}, class_id: ${class_id}, new_class: ${new_class}`);
        let curr_class = years.find((y) => y.id === year_id)?.classes.find((c) => c.id === class_id);
        curr_class.name = new_class.name;
        curr_class.sections = new_class.sections;
    }

    // const addClassToYear = (year, new_class) => {
    //     profile.years.find((y) => y.id === year.id).setClasses([
    //         ...profile.years.find((y) => y.id === year.id)?.classes,
    //         new_class
    //     ])
    // }

    return(
        <ProfileContext.Provider value={{
                profile_context,
                addYearToProfile,
                addClassToProfile,
                updateClassInProfile}}>
            {children}
        </ProfileContext.Provider>
    )
}