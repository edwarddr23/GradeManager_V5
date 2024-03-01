import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, SectionList } from 'react-native';
import RNFS from 'react-native-fs';
import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';

const PrintAcademicYear = (year) => {
    return (<Text style={{fontWeight: 'bold'}}>Academic Year {year.beg_year}-{year.end_year}:</Text>)
}

const PrintClasses = (year) => {
    console.log('PrintClasses(): year:', year);

    return(
        // <Text>Class Here</Text>
        <View>
            {year["classes"].map((curr_class) =>
                <Text>{curr_class["name"]}</Text>
            )}
        </View>
    )
    // return(<Text>Class here</Text>)
}

const PrintData = (profile) => {
    return(
        <View>
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Profile Data for "{profile.name}"":</Text>
            {profile["academic_years"].map((year) => 
                <View>
                    <Text style={{fontWeight: 'bold'}}>Academic Year {year.beg_year}-{year.end_year}:</Text>
                    {PrintClasses(year)}
                </View>
            )}
            {/* {PrintAcademicYears(profile)} */}
        </View>
        // <Text>Hello</Text>
    );
}

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
                // console.log('SaveScreen.tsx: saveToFileHandler(): saveFileExists:', saveFileExists);
                // Regardless of its existence, write to the path specified.
                console.log('saveToFileHandler(): saveFilePath:', saveFilePath);
                RNFS.writeFile(saveFilePath, 'Hey, it worked!', 'utf8')
                    .then(() => console.log('Wrote to ' + saveFileName + ' successfully.'))
                    .catch((err) => console.log(err.message));
            })
            .catch((error => {
                console.log('SaveScreen.tsx: saveToFileHandler(): Error saving to file.');
            }))
    }

    return(
        <View style={{flexDirection: 'column', flex: 1}}>
            <View>
                <Text>Documents Folder:</Text>
                <Text>{documentsFolder}</Text>
                <Text>Save File Location:</Text>
                <Text>{documentsFolder + '/' + saveFileName}</Text>
            </View>
            <View style={{flex: 1, paddingVertical: '3%', paddingHorizontal: '5%'}}>
                <InputWithLabel
                    value={saveFileName}
                    SetValue={setSaveFileName}
                    placeholder={'Suggestion: \"' + profile["name"] + '\"?'}
                    label="Save File Name:"
                />
                <Text style={{textAlign: 'center'}}>Please do not put punctuation or an extension at the end.</Text>
                <Text>"{saveFileName}" exists: {String(saveFileExists)}</Text>
                <View style={{height: '15%', paddingTop: '5%'}}>
                    <FlatButton 
                        text='Save to File'
                        onPress={saveToFileHandler(documentsFolder + '/' + saveFileName)}
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