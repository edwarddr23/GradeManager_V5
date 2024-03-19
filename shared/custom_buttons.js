import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'

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
        // height: 'auto',
        // width: 'auto',
        alignSelf: 'flex-start',
        // flex: 1,
        width: '100%',
        height: '100%',
        padding: 10,
        borderRadius: 10,
        // borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    buttonText: {
        textAlignVertical: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        // backgroundColor: 'blue',
        width: '100%',
        height: '100%',
        color: 'white'
    }
})