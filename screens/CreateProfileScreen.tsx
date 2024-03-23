import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';
import { useProfileContext } from '../shared/profile_context';

// const initializeProfile = (profile_name) => {
//     const profile = {
//         name: profile_name,
//         academic_years: [
//             // {
//             //     beg_year: 2022,
//             //     end_year: 2023,
//             //     classes: [
//             //         {
//             //             name: "Things 101",
//             //             type: "percentage"
//             //         },
//             //         {
//             //             name: "Economics 202",
//             //             type: "fraction"
//             //         },
//             //         {
//             //             name: "The Friggin 313",
//             //             type: "fraction"
//             //         }
//             //     ]
//             // },
//             // {
//             //     beg_year: 2023,
//             //     end_year: 2024,
//             //     classes: [
//             //         {
//             //             name: "Liberal Stuff 101",
//             //             type: "percentage"
//             //         },
//             //         {
//             //             name: "Developmental Instruction 301",
//             //             type: "percentage"
//             //         },
//             //         {
//             //             name: "Liberal Stuff 101",
//             //             type: "percentage"
//             //         },
//             //         {
//             //             name: "Biology 101",
//             //             type: "fraction"
//             //         }
//             //     ]
//             // }
//         ]
//     }
//     return profile;
// }

const CreateProfileScreen = ({navigation, route}) => {
    const { profile_context } = useProfileContext();
    // console.log(`CreateProfileScreen(): profile_context: ${profile_context}`);
    const [profile_name, setProfile_name] = useState('');
    // profile_context.profile_name = profile_name;
    // profile_context.setProfile_name = setProfile_name;

    // useEffect(() => {
    //     console.log('useEffect(): profile_context.profile_name:', profile_context.profile_name);
    // });

    function initializeProfile() {
        profile_context.setProfile_name(profile_name);
        profile_context.setYears([]);
    }

    const handleCreateProfile = () => {
        initializeProfile();
        return navigation.navigate('Years', {fromClassScreen: false});
    }

    return(
        <View style={{flex: 1, flexDirection: 'column', alignContent: 'center'}}>
            {/* Inputs go in this View */}
            <View style={{paddingTop: 20, paddingHorizontal: 20}}>
                <InputWithLabel
                    value={profile_name}
                    setValue={setProfile_name}
                    extraOnChangeText={() => {}}
                    placeholder='Enter your profile name here...'
                    label='Profile Name:'/>
                <View style={{width: '100%', height: 100, paddingTop: 20}}>
                    <FlatButton
                        text="Create Profile"
                        onPress={handleCreateProfile}
                    />
                </View>
            </View>
        </View>
    );
}

export default CreateProfileScreen;