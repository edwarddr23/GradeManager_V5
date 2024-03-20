import React, { createContext, useContext } from 'react';

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
    name: string
    setName: (c: string) => void
}

export const ProfileContext = createContext<ProfileContent>({
    name: 'default profile name',
    setName: () => {}
});

export const useProfileContext = () => useContext(ProfileContext);