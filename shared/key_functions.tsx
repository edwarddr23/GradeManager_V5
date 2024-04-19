import React from 'react'

// Initializes an array's elements so that each one has a unique id.
// export const initializeArrKeys = (arr) => {
//     if(arr.length > 0) return arr;
//     // let initArr = [...arr];
//     let tmp_nextId = 0;
//     return(arr.map(element => {
//         let tmpElement ={
//             ...element,
//             id: tmp_nextId
//         };
//         tmp_nextId++;
//         return tmpElement;
//     }));
// }

// Finds the maximum ID in an array and returns that max ID + 1 to ensure that the ID returned is the next unique ID.
export const findNextID = (arr) => {
    if(arr.length == 0) return 0;
    let maxID = 0;
    const keysFromArr = arr.map(element => {
        maxID = Math.max(maxID, element.id);
    })
    return maxID + 1;
}