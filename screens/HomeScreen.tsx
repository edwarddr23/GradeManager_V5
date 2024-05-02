/* 
    HomeScreen.tsx
    
    PURPOSE

        The purpose of this file is to define all of the functionalities necessary for the screen
        responsible for the home screen; This entails the welcome text and the buttons for going
        to the screen that handles creating a profile and the button that handles loading a profile.
*/

import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

import FlatButton from '../shared/custom_buttons';
import commonStyle from '../shared/common_style';

/*
NAME

        HomeScreen - a component that handles the home screen functionality.
SYNOPSIS

        <View> HomeScreen({navigation})
            navigation --> the navigation object inherited by every child within the Stack.Navigator in the NavigationContainer. The navigation hierarchy can be seen in the root of this project, App.tsx.
DESCRIPTION

        This component returns a View that displays the title text and the buttons that navigate to the CreateProfileScreen and LoadScreen.
RETURNS

        Returns a View component.
*/
const HomeScreen = ({navigation}) => {
    return(
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <Text style={[commonStyle.defaultText, {marginTop: 'auto', fontSize: 50, fontWeight: 'bold', paddingBottom: 20, textAlign: 'center'}]}>Welcome to Grade Manager!</Text>
            </View>
            <View style={{flex: 1, width: '70%', gap: 30}}>
                <View style={{flex: 1}}>
                    <FlatButton
                        text='Create New Profile'
                        onPress={() => navigation.navigate('Create Profile')}
                    />
                </View>
                <View style={{flex: 1}}>
                    <FlatButton
                        text='Load Profile'
                        onPress={() => navigation.navigate('Load')}
                    />
                </View>
                <View style={{flex: 1}}/>
            </View>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center'
    }
})