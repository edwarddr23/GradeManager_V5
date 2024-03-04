import React from 'react'
import { View, Text } from 'react-native'
import RNFS from 'react-native-fs'

const LoadScreen = ({navigation}) => {

    // Inspired by https://www.waldo.com/blog/react-native-fs
    const readFile = () => {
        RNFS.readDir(RNFS.DocumentDirectoryPath)
            .then((result) => {
                console.log('LoadScreen.tsx: readFile(): result:', result);
                return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
                if(statResult[0].isFile()) {
                    console.log('LoadScreen.tsx: readFile(): statResult[1]:', RNFS.readFile(statResult[1], 'utf8'));
                    return RNFS.readFile(statResult[1], 'utf8');
                }
            })
    };

    return(
        <View>
            <Text>Load Screen</Text>
            {readFile()}
        </View>
    );
}

export default LoadScreen;