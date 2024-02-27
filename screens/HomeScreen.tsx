import React from 'react'
import { View, Text } from 'react-native';

import FlatButton from '../shared/custom_buttons';

const HomeScreen = ({navigation}) => {
    function handleGoToCreateProfile (isLoadingProfile) {
        if(isLoadingProfile === false){
            return navigation.navigate('Create Profile', {name: 'NEW'})
        }
    };

    return(
        <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 50, fontWeight: 'bold', paddingBottom: 20, textAlign: 'center'}}>Welcome to Grade Manager!</Text>
          <View>
              <FlatButton
                text='Create New Profile'
                onPress={() => handleGoToCreateProfile(false) }/>
          </View>
        </View>
    );
}

export default HomeScreen;