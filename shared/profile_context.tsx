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

// Inspired by https://dev.to/madv/usecontext-with-typescript-23ln.
export type ProfileContent = {
    profile_name: string
    setProfile_name: (value: string) => void
    years: YearContent[]
    setYears: (value: never[]) => void
    // classes: string[]
    // setClasses: (value: never[]) => void
}

export type YearContent = {
    classes: ClassContent[]
    beg_year: Int32
    end_year: Int32
}

export type ClassContent = {
    class_name: string
    setClass_name: (c: string) => void
}

export const ProfileContext = createContext<ProfileContent>({
    profile_name: 'default profile name',
    setProfile_name: () => {},
    years: [],
    setYears: () => {}
    // classes: [],
    // setClasses: () => {}
});

export const useProfileContext = () => useContext(ProfileContext);