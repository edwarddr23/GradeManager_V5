import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';

const CreateProfileScreen = ({navigation, route}) => {
    const [profile_name, setProfile_name] = useState('');

    const [isFocus, setIsFocus] = useState(false);

    return(
        <View style={{flex: 1, flexDirection: 'column', alignContent: 'center'}}>
            {/* Inputs go in this View */}
            <View style={{paddingTop: 20, paddingHorizontal: 20}}>
                <InputWithLabel
                    value={profile_name}
                    SetValue={setProfile_name}
                    placeholder='Enter your profile name here...'
                    label='Profile Name:'/>
                <FlatButton
                    text="Create Profile"
                    onPress={() => navigation.navigate('Years', {profile_name: {profile_name}})}/>
            </View>
        </View>
    );
}

export default CreateProfileScreen;