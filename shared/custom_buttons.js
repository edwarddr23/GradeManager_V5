import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'

export default function FlatButton({ text, onPress }) {
    return(
        <TouchableOpacity onPress={ onPress } style={[styles.button]}>
            <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>{ text }</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#F01d71',
        height: 'auto',
        // width: 'auto',
        alignSelf: 'flex-start',
        // flex: 1,
        // width: '100%',
        // height: '100%',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center'
    },
    
    buttonText: {
        // color: 'white',
        // fontWeight: 'bold',
        // textTransform: 'uppercase',
        // fontSize: 16,
        // textAlign: 'center',
        fontSize: 30,
        textTransform: 'capitalize',
        // flex: 1
        // fontWeight: 500
    }
})