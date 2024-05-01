/* 
    custom_buttons.js
    PURPOSE

        The purpose of this file is to define the custom FlatButton component that will be used for UI elements
        throughout the scope of this project. It has a common look and modular functionality that will be reused.
*/

import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'

/*
NAME

    FlatButton - a function component that returns a component that will be a TouchableOpacity with some defaults already determined.

SYNOPSIS

    <TouchableOpacity> FlatButton({text, onPress})
        text --> a string that represents the text to display on the button.
        onPress --> a function that represents what the TouchableOpacity should do onPress.

DESCRIPTION

    This is essentially a prewritten TouchableOpacity component with predefined styling and with modular functionality. On its own,
    it does not do much, but that is what the onPress parameter of this function is for. The parameter text is used as the displayed
    text on the button, and the onPress parameter is used to define what the button does onPress.

RETURNS

    Returns a TouchableOpacity component with a predefined style.
*/
export default function FlatButton({ text, onPress }) {
    return(
        <TouchableOpacity onPress={ onPress } style={[styles.button]}>
            <Text style={styles.buttonText} adjustsFontSizeToFit={true}>{ text }</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#F01d71',
        alignSelf: 'flex-start',
        width: '100%',
        height: '100%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    buttonText: {
        textAlignVertical: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        width: '100%',
        height: '100%',
        color: 'white'
    }
})