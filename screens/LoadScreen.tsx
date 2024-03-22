import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native'

import storage from '../shared/storage';
import InputWithLabel from '../shared/custom_text_Inputs';
import { PrintData } from '../shared/profile_functions';
import FlatButton from '../shared/custom_buttons';
import { useProfileContext } from '../shared/profile_context';

const LoadScreen = ({navigation}) => {
    const profile_context = useProfileContext();
    const[loadFileName, setLoadFileName] = useState('');
    const[fileExists, setFileExists] = useState(false);
    const[profile, setProfile] = useState({});

    const renderProfilePreview = () => {
        if(fileExists === true && loadFileName != '') {
            return(PrintData(profile_context));
        }
        else if(fileExists === false && loadFileName != '') {
            return(
                <Text>Profile: "{loadFileName}" could not be found.</Text>
            );
        }
        else{
            console.log('renderProfilePreview(): fileExists():', fileExists);
            return(
                <Text>Profile Preview here...</Text>
            );
        }
    }

    const renderLoadProfileButton = () => {
        if(fileExists === true && loadFileName != '') {
            return(
                <FlatButton 
                    text={'Load \"' +  loadFileName + '\"'}
                    onPress={() => {
                        console.log('renderLoadProfileButton(): profile:', profile);
                        navigation.navigate('Years', {profile: profile});
                    }}
                />
            );
        }
        else{
            return null;
        }
    }

    // const saveFileExists = () => {
    //     if(loadFileName != ''){
    //         console.log('saveFileExists(): searching for', loadFileName + '...');
    //         storage.load({key: loadFileName})
    //             .then((data) => {
    //                 setFileExists(true)
    //             })
    //             .catch((err) => {
    //                 setFileExists(false)
    //             });
    //     }
    //     else{
    //         console.log('saveFileExists(): No profile name entered.');
    //         setFileExists('')
    //     }
    // }

    // Inspired by https://www.waldo.com/blog/react-native-fs
    const readFile = (fileName) => {
        if(fileName == ''){
            setFileExists(false);
            return
        }
        console.log('LoadScreen.tsx: readFile(): Reading from', fileName + '...');
        storage.load({key: fileName})
            .then((data) => {
                console.log('readFile(): data:', data);
                const profile = data.profile;
                setProfile(profile);
                console.log('LoadScreen.tsx: readFile(): profile:', profile);
                profile_context.setProfile_name(profile.profile_name);
                profile_context.setYears(profile.years);
                setFileExists(true);
            })
            .catch((err) => {
                console.warn(err.message);
                console.log('err.name:', err.name);
                setFileExists(false);
            });
    };

    return(
        <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flex: 1, marginVertical: '5%', marginHorizontal: '5%'}}>
                {/* <View style={{flex: .5}}> */}
                <View style={{height: 50}}>
                    <TextInput
                        style={styles.inputText}
                        value={loadFileName}
                        onChangeText={text => {
                            setLoadFileName(text);
                            readFile(text);
                        }}
                        placeholder='Enter profile name here'
                    />
                </View>
                    {/* <InputWithLabel
                        value={loadFileName}
                        SetValue={setLoadFileName}
                        placeholder={'Enter profile name here...'}
                        label="Profile Name:"
                    /> */}
                    <Text style={{textAlign: 'center'}}>Please do not put punctuation or an extension at the end.</Text>
                {/* </View> */}
                {/* {readFile()} */}
                {/* <Text>"{loadFileName}" exists: {String(saveFileExists())}</Text> */}
                {/* <View style={{flex: .3, marginTop: '5%'}}>
                    <FlatButton 
                        text='Show Preview'
                        onPress={() => {
                            readFile();
                            // poosaveToFileHandler(saveFileName);
                        }}
                    />
                </View> */}
                <View style={{flex: 1}}>
                    <ScrollView style={{paddingTop: '5%'}}>
                        {renderProfilePreview()}
                    </ScrollView>
                </View>
                <View style={{flex: .3, paddingBottom: '10%'}}>
                    {renderLoadProfileButton()}
                </View>
                {/* <View style={{flex:}}></View> */}
            </View>
        </View>
    );
}

export default LoadScreen;

const styles = StyleSheet.create({
    inputText: {
        fontSize: 20,
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        flex: 1
    }
});