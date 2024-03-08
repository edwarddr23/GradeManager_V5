import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';

const initializeProfile = (profile_name) => {
    const profile = {
        name: profile_name,
        academic_years: [
            // {
            //     beg_year: 2022,
            //     end_year: 2023,
            //     classes: [
            //         {
            //             name: "Things 101",
            //             type: "percentage"
            //         },
            //         {
            //             name: "Economics 202",
            //             type: "fraction"
            //         },
            //         {
            //             name: "The Friggin 313",
            //             type: "fraction"
            //         }
            //     ]
            // },
            // {
            //     beg_year: 2023,
            //     end_year: 2024,
            //     classes: [
            //         {
            //             name: "Liberal Stuff 101",
            //             type: "percentage"
            //         },
            //         {
            //             name: "Developmental Instruction 301",
            //             type: "percentage"
            //         },
            //         {
            //             name: "Liberal Stuff 101",
            //             type: "percentage"
            //         },
            //         {
            //             name: "Biology 101",
            //             type: "fraction"
            //         }
            //     ]
            // }
        ]
    }
    return profile;
}

const CreateProfileScreen = ({navigation, route}) => {
    const [profile_name, setProfile_name] = useState('');

    const handleCreateProfile = () => {
        const new_profile = initializeProfile(profile_name);
        return navigation.navigate('Years', {profile: new_profile});
    }

    return(
        <View style={{flex: 1, flexDirection: 'column', alignContent: 'center'}}>
            {/* Inputs go in this View */}
            <View style={{paddingTop: 20, paddingHorizontal: 20}}>
                <InputWithLabel
                    value={profile_name}
                    SetValue={setProfile_name}
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