import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import common_style from './common_style';

export const InputWithLabel = ({style, textStyle, labelStyle, value, onChangeText, placeholder, hasLabel, label}) => {
    const [isFocus, setIsFocus] = useState(false);

    // const renderLabel = (label) => {
    //     // console.log('custom_text_inputs.js: renderLabel(): value: ', value);
    //     // console.log('custom_text_inputs.js: renderLabel(): isFocus: ', isFocus);
    //     if (value || isFocus) {
    //         // console.log('custom_text_inputs.js: renderLabel(): returning label...');
    //         return(
    //             <Text style={[styles.label, isFocus && {color: 'blue'}]}>{label + ":"}</Text>
    //         );
    //     }
    //     return null;
    // }
    
    return(
        <View style={style}>
            {/* {renderLabel(label)} */}
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
                onSubmitEditing={() => {
                    // console.log('custom :D');
                    // console.log('SemesterView(): semester: ', semester);
                    // console.log('BEFORE SemesterView(): semester.year: ', semester.year);
                    // semester.year = year;
                    // console.log('AFTER SemesterView(): semester.year: ', semester.year);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        // height: 'auto',
        // backgroundColor: 'red',
        // margin: 12,
        // marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        // flex: 1,
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