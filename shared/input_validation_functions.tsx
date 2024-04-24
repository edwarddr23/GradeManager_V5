import React from 'react'
import Toast from 'react-native-simple-toast';

export function validPositiveIntInputs(inputs, input_names) {
    let isValid = true;
    inputs.forEach((input, i) => {
        console.log(`validPositiveIntInputs: inputs[${i}]: ${input}`);
        if(input === -1 || input.toString().trim() === ''){
            Toast.show(`Please enter ${input_names[i]}`, Toast.SHORT);
            isValid = false;
        }
        else if(isNaN(input)){
            Toast.show(`Please enter a numeric ${input_names[i]}`, Toast.SHORT);
            isValid = false;
        }
        else if(!!input.toString().match(/[.]/) === true){
            Toast.show(`Please enter an integer for a ${input_names[i]}`, Toast.SHORT);
            isValid = false;
        }
        else if(input < 0){
            Toast.show(`${input_names[i]} should be greater or equal to 0`, Toast.SHORT);
            isValid = false;
        }
    })
    return isValid;
}