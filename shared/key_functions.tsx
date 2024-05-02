/* 
    key_functions.tsx
    
    PURPOSE

        The purpose of this file is to define logic for finding the next id from an array of objects. This
        will be sued whenever a new object is created which needs to be recorded in the backend. Thus, this
        is shared globally as it will be used many times within the scope of this project.
*/

/*
NAME

    findNextID - a function component that finds the maximum ID in an array and returns that max ID + 1 to ensure that the ID returned is the next unique ID.

SYNOPSIS

    int findNextID(arr)
        arr --> an array, of presumably objects, to determine the next ID for.

DESCRIPTION

    Iterate through every element within parameter arr. If the id in the current element in question is greater than the maxID,
    then that is the new maxID. After all elements have been considered, the maxID + 1 will be returned, to ensure that the next
    ID is different.

RETURNS

    Returns an int that represents the next id for a new object in the parameter arr.
*/
export const findNextID = (arr) => {
    if(arr.length == 0) return 0;
    let maxID = 0;
    const keysFromArr = arr.map(element => {
        maxID = Math.max(maxID, element.id);
    })
    return maxID + 1;
}