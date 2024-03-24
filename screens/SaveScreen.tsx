import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';

import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';
import storage from '../shared/storage';
import { PrintData } from '../shared/profile_functions';
import { useProfileContext } from '../shared/profile_context';

const SaveScreen = ({navigation, route}) => {
    const { profile_context } = useProfileContext();
    console.log(`SaveScreen.tsx: profile_context.years: ${profile_context.years}`);
    // const {profile} = route.params;
    // const[documentsFolder, setDocumentsFolder] = useState('');
    const[saveFileName, setSaveFileName] = useState('');
    // const[fileExists, setFileExists] = useState(false);

    // useEffect(() => {
    //     setDocumentsFolder(RNFS.DocumentDirectoryPath);
    // }, []);

    // return(
    //     <View>
    //         <Text>Save Screen</Text>
    //     </View>
    // );
    
    const saveToFileHandler = (saveFileName) => {
        console.log('SaveScreen.tsx: saveToFileHandler():', saveFileName);
        storage.save({
            key: String(saveFileName),
            data: {
                profile: profile_context
            },
            expires: null
        });
        console.log('SaveScreen.tsx: saveToFileHandler(): Save successful?');
        navigation.goBack();
    }

    return(
        <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flex: 1, paddingVertical: '3%', paddingHorizontal: '5%'}}>
                <InputWithLabel
                    value={saveFileName}
                    setValue={setSaveFileName}
                    extraOnChangeText={() => {}}
                    placeholder={'Suggestion: \"' + profile_context.profile_name + '\"?'}
                    label="Save File Name:"
                />
                <Text style={{textAlign: 'center'}}>Please do not put punctuation or an extension at the end.</Text>
                {/* <Text>"{saveFileName + '.txt'}" exists: {String(saveFileExists())}</Text> */}
                <View style={{height: 90, paddingTop: '5%'}}>
                    <FlatButton 
                        text='Save to File'
                        onPress={() => {
                            saveToFileHandler(saveFileName);
                        }}
                    />
                </View>
                {/* Print the preview of data for the profile found in the profile context. */}
                <ScrollView style={{paddingTop: '5%', flex: 1}}>
                    { PrintData(profile_context) }
                </ScrollView>
            </View>
        </View>
    );
}

export default SaveScreen;