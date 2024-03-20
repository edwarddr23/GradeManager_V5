import React, { createContext } from 'react';

const ProfileContext = createContext();

function ProfileProvider(props) {
    const profileData = {
        name: 'huh?',
        classes: [
            {
                name: 'Test 101'
            },
            {
                name: 'Something 201'
            }
        ]
    }
    return (
        <ProfileContext.Provider value={profileData}>
            {props.children}
        </ProfileContext.Provider>
    );
}