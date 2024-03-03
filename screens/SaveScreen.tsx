import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, SectionList } from 'react-native';
import RNFS from 'react-native-fs';
import InputWithLabel from '../shared/custom_text_Inputs';
import FlatButton from '../shared/custom_buttons';

const PrintAcademicYear = (year) => {
    return (<Text style={{fontWeight: 'bold'}}>Academic Year {year.beg_year}-{year.end_year}:</Text>)
}

const PrintClasses = (year) => {
    let child_key = 0;
    // console.log('PrintClasses(): year:', year);

    return(
        // <Text>Class Here</Text>
        <View>
            {year["classes"].map((curr_class) =>
                <Text key={child_key++}>{curr_class["name"]}</Text>
            )}
        </View>
    )
    // return(<Text>Class here</Text>)
}

const PrintData = (profile) => {
    let child_key = 0;

    return(
        <View>
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Profile Data for "{profile.name}"":</Text>
            {profile["academic_years"].map((year) => 
                <View key={child_key++}>
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
        // console.log('SaveScreen.tsx: saveToFileHandler():', saveFilePath);
        // Check if SaveFiles directory exists. If not, create it.
        RNFS.exists(documentsFolder + '/SaveFiles')
            .then((exists) => {
                if(!exists){
                    RNFS.mkdir(documentsFolder + '/SaveFiles')
                }
                else{
                    console.log('saveToFileHandler(): /SaveFiles directory already exists.');
                }
            });
        // Write to save file at SaveFiles directory.
        RNFS.writeFile(documentsFolder + '/SaveFiles/' + saveFileName, 'Hey, it worked!', 'utf8')
            .then(() => console.log('Wrote to ' + saveFileName + ' successfully.'))
            .catch((err) => console.log(err.message));
        // State fileExists needs to be updated after a new save file is created.
        saveFileExists();
    }

    return(
        <View style={{flexDirection: 'column', flex: 1}}>
            <View>
                <Text>Documents Folder:</Text>
                <Text>{documentsFolder}</Text>
                <Text>Save File Location:</Text>
                <Text>{documentsFolder + '/SaveFiles/' + saveFileName}</Text>
            </View>
            <View style={{flex: 1, paddingVertical: '3%', paddingHorizontal: '5%'}}>
                <InputWithLabel
                    value={saveFileName}
                    SetValue={setSaveFileName}
                    placeholder={'Suggestion: \"' + profile["name"] + '\"?'}
                    label="Save File Name:"
                />
                <Text style={{textAlign: 'center'}}>Please do not put punctuation or an extension at the end.</Text>
                <Text>"{saveFileName + '.txt'}" exists: {String(saveFileExists())}</Text>
                <View style={{height: '15%', paddingTop: '5%'}}>
                    <FlatButton 
                        text='Save to File'
                        onPress={() => {
                            saveToFileHandler(saveFileName + '.txt');
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