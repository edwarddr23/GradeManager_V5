/* 
    custom_text_inputs.js
    
    PURPOSE

        The purpose of this file is to define the custom text input component that will be used for almost all
        the screens in this project. The idea is to use this modularly and add it to any relevant screens.
*/

import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import common_style from './common_style';

/*
NAME

    InputWithLabel - a function component that returns a View with a TextInput with some defaults already determined.

SYNOPSIS

    <View> InputWithLabel({style, textStyle, labelStyle, value, onChangeText, placeholder, hasLabel, label})
        style --> an object containing all the additional styling that will be added to the View.
        textStyle --> an object containing all the additional styling that will be added to the text within the child TextInput.
        labelStyle --> an object containing all the additional styling that will be added to the label of the TextInput.
        value --> a state object that will be placed into the TextInput's value property.
        onChangeText --> a function that will be placed into the TextInput's onChangeText property.
        placeholder --> a string whose value will be used for the TextInput's placeholder property.
        hasLabel --> a boolean which will determine whether the label for the custom text input is displayed or not.
        label --> a string whose value will be used for the label of the TextInput.

DESCRIPTION

    This is essentially a prewritten View component with predefined styling. On its own it is just a View component with a TextInput. The parameters
    are injected into the View and its TextInput component, and the label is just a Text component.

RETURNS

    Returns a View component with a TextInput component, which has a predefined style.
*/
export const InputWithLabel = ({style, textStyle, labelStyle, value, onChangeText, placeholder, hasLabel, label}) => {
    const [isFocus, setIsFocus] = useState(false);

    return(
        <View style={style}>
            {/* Render the label for the custom text input. */}
            {hasLabel && (
                <Text style={[styles.label, labelStyle]}>{label}</Text>
            )}
            <TextInput
                style={[common_style.defaultText, styles.input, textStyle]}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                value={value}
                placeholder={placeholder}
                placeholderTextColor='#808080'
                onChangeText={text => {
                    onChangeText(text)
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 20,
        maxWidth: 'auto'
    },

    label: {
        position: 'relative',
        left: 10,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black'
    },
})