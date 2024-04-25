import React from 'react'
import { StyleSheet, Text } from 'react-native'

// export class CustomText extends React.Component {
//     constructor(props){
//         super(props);
//     }
    
//     render(){
//         return(
//             <Text style={[styles.defaultStyle, this.props.style]}>{this.props.children}</Text>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     defaultStyle: {
//         color: 'black'
//     }
// });

export default StyleSheet.create({
    defaultText: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'Cochin'
    }
})