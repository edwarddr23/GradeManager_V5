import React from 'react'

const getValidAssignments = (assignments) => {
    return assignments.filter((a) => {
        console.log(`getValidAssignments(): a.numerator / a.denominator: ${a.numerator} / ${a.denominator}`);
        if(a.numerator != -1 && a.denominator != -1) return a;
    })
}

export function calculateAverage(assignments) {
    let total = 0;
    const valid_assignments = getValidAssignments(assignments);
    console.log(`calculateAverage(): valid_assignments: ${valid_assignments}`);
    
    if(valid_assignments.length === 0) return 'N/A';
    
    valid_assignments.map((a) => {
        total += a.numerator / a.denominator;
    });
    return (total / valid_assignments.length).toFixed(4);
}