import React from 'react'

const getValidAssignments = (assignments) => {
    return assignments.filter((a) => {
        // console.log(`getValidAssignments(): a.numerator / a.denominator: ${a.numerator} / ${a.denominator}`);
        if(a.numerator != -1 && a.denominator != -1) return a;
    })
}

export function calculateSectionAverage(assignments) {
    let total = 0;
    const valid_assignments = getValidAssignments(assignments);
    // console.log(`calculateAverage(): valid_assignments: ${valid_assignments}`);
    
    if(valid_assignments.length === 0) return 'N/A';
    
    valid_assignments.map((a) => {
        total += a.numerator / a.denominator;
    });
    return (total / valid_assignments.length).toFixed(4);
}

export function calculateClassAverage(sections) {
    let section_averages = [];
    sections.map((s) => {
        const section_average = calculateSectionAverage(s.assignments);
        section_averages.push([section_average, s.weight]);
    })
    const valid_section_averages = section_averages.filter((s) => {
        if(s[0] !== 'N/A') return s;
    });
    if(valid_section_averages.length === 0) return 'N/A';
    let total_averages = 0;
    let total_weights = 0;
    valid_section_averages.map((v) => {
        total_averages += parseFloat(v[0]) * parseFloat(v[1]);
        total_weights += parseFloat(v[1]);
    });

    return (total_averages / total_weights).toFixed(4);
}