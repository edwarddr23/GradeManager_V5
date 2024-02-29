import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';
import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';

const SaveScreen = ({navigation, route}) => {
    const {profile} = route.params;
    console.log('SaveScreen.tsx: profile:', profile);
    const[documentsFolder, setDocumentsFolder] = useState('');
    const[saveFileName, setSaveFileName] = useState('');
    let saveFilePath = "";
    let saveFileExists = false;
    // const[saveFileExists, setSaveFileExists] = useState(false);
    // const[saveFilePath, setSaveFilePath] = useState('')

    useEffect(() => {
        setDocumentsFolder(RNFS.DocumentDirectoryPath);
    }, []);
    
    const saveToFileHandler = (saveFilePath) => {
        console.log('SaveScreen.tsx: saveToFileHandler():', saveFilePath);
        RNFS.exists(saveFilePath)
            .then((exists) => {
                if(exists) {
                    saveFileExists = true;
                }
                else{
                    saveFileExists = false;
                }
                console.log('SaveScreen.tsx: saveToFileHandler(): saveFileExists:', saveFileExists);
            })
            .catch((error => {
                console.log('SaveScreen.tsx: saveToFileHandler(): Error saving to file.');
            }))
    }

    return(
        <View>
            <Text>Documents Folder:</Text>
            <Text>{documentsFolder}</Text>
            <Text>Save File Location:</Text>
            <Text>{documentsFolder + '/' + saveFileName}</Text>
            <View style={{paddingVertical: '10%', paddingHorizontal: '5%'}}>
                <InputWithLabel
                    value={saveFileName}
                    SetValue={setSaveFileName}
                    placeholder={'Suggestion: \"' + profile["name"] + '\"?'}
                    label="Profile Name:"
                />
                <Text>{saveFileName} {saveFileExists}</Text>
                <View style={{height: '40%', paddingTop: '5%'}}>
                    <FlatButton 
                        text='Save to File'
                        onPress={saveToFileHandler(documentsFolder + '/' + saveFileName)}
                    />
                </View>
                <ScrollView style={{paddingTop: "5%"}}>
                    <Text>Profile Data:</Text>
                </ScrollView>
            </View>
        </View>
    );
}

export default SaveScreen;