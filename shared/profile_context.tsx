import React, { createContext, useContext } from 'react';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

// const ProfileContext = createContext();

// function ProfileProvider(props) {
//     const profileData = {
//         name: 'huh?',
//         classes: [
//             {
//                 name: 'Test 101'
//             },
//             {
//                 name: 'Something 201'
//             }
//         ]
//     }
//     return (
//         <ProfileContext.Provider value={profileData}>
//             {props.children}
//         </ProfileContext.Provider>
//     );
// }

export type YearContent = {
    id: Int32
    classes: ClassContent[]
    setClasses: (value: never[]) => void
    beg_year: Int32
    end_year: Int32
}

export type ClassContent = {
    id: Int32
    year_id: Int32
    name: string
    setName: (c: string) => void
    sections: SectionContent[]
    setSections: (value: never[]) => void
}

export type SectionContent = {
    id: Int32
    class_id: Int32
    name: string
    setName: (c: string) => void
    section_weight: Int32
    setSection_weight: (c: Int32) => void
}

// Inspired by https://dev.to/madv/usecontext-with-typescript-23ln.
export type ProfileContent = {
    profile_name: string
    setProfile_name: (value: string) => void
    years: YearContent[]
    setYears: (value: never[]) => void
}

export const ProfileContext = createContext<ProfileContent>({
    profile_name: 'default profile name',
    setProfile_name: () => {},
    years: [],
    setYears: () => {}
});

export const useProfileContext = () => useContext(ProfileContext);