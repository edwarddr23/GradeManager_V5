import React from 'react'
import Toast from 'react-native-simple-toast';

export function validPositiveIntInputs(inputs, input_names) {
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i] === -1 || inputs[i] === ''){
            Toast.show(`Please enter ${input_names[i]}`, Toast.SHORT);
            return false;
        }
        else if(isNaN(inputs[i])){
            Toast.show(`Please enter a numeric ${input_names[i]}`, Toast.SHORT);
            return false;
        }
        else if(!!inputs[i].toString().match(/[.]/) === true){
            Toast.show(`Please enter an integer for a ${input_names[i]}`, Toast.SHORT);
            return false;
        }
        else if(inputs[i] < 0){
            Toast.show(`${input_names[i]} should be greater or equal to 0`, Toast.SHORT);
            return false;
        }
        return true;
    }
}