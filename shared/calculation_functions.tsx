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
    // console.log(`calculateSectionAverage(): (total / valid_assignments.length).toFixed(4): ${(total / valid_assignments.length).toFixed(4)}`);
    return (total / valid_assignments.length);
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

    return (total_averages / total_weights);
}

export function calculateClassLetterGrade(curr_class) {
    const class_average = calculateClassAverage(curr_class.sections) * 100;
    // console.log(`calculateClassLetterGrade(): class_average: ${class_average}`);
    let result = 'N/A';
    curr_class.letter_grading.forEach((l) => {
        // console.log(`THING: ${l.letter}: ${l.beg}-${l.end}`);
        if(class_average === 100) result = 'A';
        if(class_average >= l.beg && class_average < l.end){
            result = l.letter;
        }
    });
    return result;
}

export function calculateSemesterGPA(semester) {
    let letter_grades = [];
    // console.log(`calculateSemesterGPA(): semester: ${JSON.stringify(semester)}`);
    if(semester.classes.length === 0) return 'N/A';
    semester.classes.forEach((c) => {
        letter_grades.push(calculateClassLetterGrade(c));
    })
    const valid_letter_grades = letter_grades.filter((l) => {
        if(l !== 'N/A') return l;
    });
    if(valid_letter_grades.length === 0) return 'N/A';
    let total = 0.0;
    valid_letter_grades.forEach((l) => {
        switch(l){
            case 'A':
                total += 4.0;
                break;
            case 'A-':
                total += 3.7;
                break;
            case 'B+':
                total += 3.3;
                break;
            case 'B':
                total += 3.0;
                break;
            case 'B-':
                total += 2.7;
                break;
            case 'C+':
                total += 2.3;
                break;
            case 'C':
                total += 2.0;
                break;
            case 'C-':
                total += 1.7;
                break;
            case 'D+':
                total += 1.3;
                break;
            case 'D':
                total += 1.0;
                break;
            case 'F':
                total += 0.0;
                break;
        }
    });
    return (total / valid_letter_grades.length).toFixed(2);
}

export function calculateYearGPA(year) {
    if(year.semesters.length === 0) return 'N/A';
    let semester_gpas = [];
    year.semesters.forEach((s) => {
        semester_gpas.push(calculateSemesterGPA(s));
    })
    const valid_semester_gpas = semester_gpas.filter((l) => {
        if(l !== 'N/A') return l;
    });
    if(valid_semester_gpas.length === 0) return 'N/A';
    let total = 0;
    valid_semester_gpas.forEach((v) => {
        total += parseFloat(v);
    });
    return (total / valid_semester_gpas.length).toFixed(2);
}

export function calculateCumulativeGPA(years) {
    if(years.length === 0) return 'N/A';

    let year_gpas = [];
    years.forEach((y) => {
        year_gpas.push(calculateYearGPA(y));
    })
    const valid_year_gpas = year_gpas.filter((y) => {
        if(y !== 'N/A') return y;
    });
    if(valid_year_gpas.length === 0) return 'N/A';
    let total = 0;
    valid_year_gpas.forEach((v) => {
        total += v;
    });
    return (total / valid_year_gpas.length).toFixed(2);
}