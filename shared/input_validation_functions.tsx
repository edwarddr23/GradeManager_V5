/* 
    input_validation_functions.js
    
    PURPOSE

        The purpose of this file is to define logic for input handling given certain inputs. This will
        be used several times throughout several files, so this is a shared function.
*/

import Toast from 'react-native-simple-toast';

/*
NAME

    validPositiveIntInputs - a function that returns a boolean that represents whether the inputs were valid or not.

SYNOPSIS

    boolean validPositiveIntInputs(inputs, input_names)
        inputs --> array of strings or some number datatype that represent the inputs from the user.
        input_names --> array of strings that represents the name for each input that will be displayed in the toast.

DESCRIPTION

    Iterate through every input in parameter inputs, and if there is an empty or unchanged value, is not a number, has a
    period, or is less than 0, then the inputs are invalid. Set the isValid boolean to false. Otherwise, isValid remains
    true. Every test, if failed, will show a toast.

RETURNS

    Returns a boolean that represents whether the inputs were valid or not.
*/
export function validPositiveIntInputs(inputs, input_names) {
    let isValid = true;
    inputs.forEach((input, i) => {
        // Check if the input in question is unchanged or empty.
        if(input === -1 || input.toString().trim() === ''){
            Toast.show(`Please enter ${input_names[i]}`, Toast.SHORT);
            isValid = false;
        }
        // Check if the input is not numeric.
        else if(isNaN(input)){
            Toast.show(`Please enter a numeric ${input_names[i]}`, Toast.SHORT);
            isValid = false;
        }
        // Check if the input is a decimal.
        else if(!!input.toString().match(/[.]/) === true){
            Toast.show(`Please enter an integer for a ${input_names[i]}`, Toast.SHORT);
            isValid = false;
        }
        // Check if the input is negative.
        else if(input < 0){
            Toast.show(`${input_names[i]} should be greater or equal to 0`, Toast.SHORT);
            isValid = false;
        }
    })
    return isValid;
}