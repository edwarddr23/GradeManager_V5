import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';

import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';
import storage from '../shared/storage';
import { PrintData } from '../shared/profile_functions';

const SaveScreen = ({navigation, route}) => {
    const {profile} = route.params;
    const[documentsFolder, setDocumentsFolder] = useState('');
    const[saveFileName, setSaveFileName] = useState('');
    const[fileExists, setFileExists] = useState(false);

    useEffect(() => {
        setDocumentsFolder(RNFS.DocumentDirectoryPath);
    }, []);

    // Sets state fileExists to true or false depending on if the file is found or not. Set to a state so that it can be actively displayed in View.
    function saveFileExists() {
        let saveFilePath = documentsFolder + '/SaveFiles/' + saveFileName + '.txt';
        RNFS.exists(saveFilePath)
            .then((exists) => {
                setFileExists(exists);
            })
            .catch((error => {
                console.log('SaveScreen.tsx: saveToFileHandler(): Error saving to file.');
            }))
        return fileExists;
    }
    
    const saveToFileHandler = (saveFileName) => {
        console.log('SaveScreen.tsx: saveToFileHandler():', saveFileName);
        storage.save({
            key: String(saveFileName),
            data: {
                profile: profile
            },
            expires: null
        });
        console.log('SaveScreen.tsx: saveToFileHandler(): Save successful?');
    }

    return(
        <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flex: 1, paddingVertical: '3%', paddingHorizontal: '5%'}}>
                <InputWithLabel
                    value={saveFileName}
                    SetValue={setSaveFileName}
                    placeholder={'Suggestion: \"' + profile["name"] + '\"?'}
                    label="Save File Name:"
                />
                <Text style={{textAlign: 'center'}}>Please do not put punctuation or an extension at the end.</Text>
                {/* <Text>"{saveFileName + '.txt'}" exists: {String(saveFileExists())}</Text> */}
                <View style={{height: '15%', paddingTop: '5%'}}>
                    <FlatButton 
                        text='Save to File'
                        onPress={() => {
                            saveToFileHandler(saveFileName);
                        }}
                    />
                </View>
                <ScrollView style={{paddingTop: '5%', flex: 1}}>
                    {PrintData(profile)}
                </ScrollView>
            </View>
        </View>
    );
}

export default SaveScreen;