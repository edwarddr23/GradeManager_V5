import React from 'react'
import { View, Text } from 'react-native';

import FlatButton from '../shared/custom_buttons';

const HomeScreen = ({navigation}) => {
    function handleGoToCreateProfile (isLoadingProfile) {
        if(isLoadingProfile === false){
            return navigation.navigate('Create Profile', {name: 'NEW'});
        }
    };

    function handleGoToLoadProfile () {
        return navigation.navigate('Load');
    }

    return(
        <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <View style={{flex: 1, paddingTop: '25%', width: '90%', justifyContent: 'space-evenly'}}>
                <Text style={{fontSize: 50, fontWeight: 'bold', paddingBottom: 20, textAlign: 'center'}}>Welcome to Grade Manager!</Text>
            </View>
            <View style={{flex: 1, width: '70%'}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, paddingBottom: '10%'}}>
                        <FlatButton
                            text='Create New Profile'
                            onPress={() => handleGoToCreateProfile(false)}
                        />
                    </View>
                    <View style={{flex: 1, paddingBottom: '30%'}}>
                        <FlatButton
                            text='Load Profile'
                            onPress={() => handleGoToLoadProfile()}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default HomeScreen;