import React from 'react'

const getValidAssignments = (assignments) => {
    return assignments.filter((a) => {
        if(a.numerator !== -1 && a.denominator !== -1) return a;
    })
}

export function calculateSectionAverage(assignments) {
    let total = 0;
    const valid_assignments = getValidAssignments(assignments);
    
    if(valid_assignments.length === 0) return 'N/A';
    
    valid_assignments.map((a) => {
        total += a.numerator / a.denominator;
    });
    return (total / valid_assignments.length);
}

// Algorithm for simple linear regression taken from here: https://www.youtube.com/watch?v=YC0bvIxR6t4
export function simpleLinearRegression(dataset) {
    // Use simple linear regression to find b and a in y = mx + b, where m is the slope and b is the y-intercept.
    let x_idx = 1;
    const x = dataset.map((d) => {
        return x_idx++; 
    });
    const sum_x = x.reduce((a, b) => a + b, 0);

    const y = dataset.map((d) => {
        return d.numerator / d.denominator;
    });
    const sum_y = y.reduce((a, b) => a + b, 0);

    const x_sqr = x.map((x) => {
        return x * x;
    });
    // console.log(`x_sqr: ${x_sqr}`)
    const sum_x_sqr = x_sqr.reduce((a, b) => a + b, 0);

    const y_sqr = y.map((y) => {
        return y * y;
    });
    const sum_y_sqr = y_sqr.reduce((a, b) => a + b, 0);
    
    const xy = x.map((element, idx) => {
        // console.log(`forEach: x[${idx}]: ${x[idx]}`)
        // console.log(`forEach: y[${idx}]: ${y[idx].numerator / y[idx].denominator}`)
        return x[idx] * y[idx];
    });
    // console.log(`simpleLinearRegression(): xy: ${xy}`);
    const sum_xy = xy.reduce((a, b) => a + b, 0);

    // console.log(`simpleLinearRegression(): sum_xy: ${sum_xy}`);
    // console.log(`simpleLinearRegression(): sum_x: ${sum_x}`);
    // console.log(`simpleLinearRegression(): sum_x_sqr: ${sum_x_sqr}`);
    // console.log(`simpleLinearRegression(): sum_y: ${sum_y}`);
    // console.log(`simpleLinearRegression(): sum_y_sqr: ${sum_y_sqr}`);
    // console.log(`simpleLinearRegression(): x.length: ${x.length}`);
    // console.log(`simpleLinearRegression(): top thing: ${(sum_xy - ((sum_x * sum_y) / x.length))}`);
    // console.log(`simpleLinearRegression(): bottom thing: ${(sum_x_sqr - ((sum_x * sum_x) / x.length))}`);
    const m = (sum_xy - ((sum_x * sum_y) / x.length)) / (sum_x_sqr - ((sum_x * sum_x) / x.length))
    // console.log(`simpleLinearRegression(): m: ${m}`);
    const b = (sum_y - (m * sum_x)) / x.length;
    // console.log(`simpleLinearRegression(): b: ${b}`);
    return [m, b];
}

export function calculateExpectedSectionAverage(assignments) {
    if(calculateSectionAverage(assignments) === 'N/A') return 'N/A';
    
    const [m, b] = simpleLinearRegression(getValidAssignments(assignments));

    if(getValidAssignments(assignments).length > 1){
        let assignment_num = 0;
        let total = 0;
        const expected_assignment_grades = assignments.map((a) => {
            assignment_num++;
            if(a.numerator === -1 && a.denominator === -1){
                total += m * assignment_num + b;
                return m * assignment_num + b;
            }
            total += a.numerator / a.denominator;
            return a.numerator / a.denominator;
        });

        return (total / expected_assignment_grades.length);
    }
    else if(getValidAssignments(assignments).length === 1) {
        const valid_assignment = getValidAssignments(assignments)[0];
        const valid_grade = valid_assignment.numerator / valid_assignment.denominator;
        // console.log(`valid_grade: ${valid_grade}`);
        let total = 0;
        assignments.map((a) => {
            total += valid_grade; 
        });
        console.log(`total: ${total}`);
        return total / assignments.length;
    }
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

export function calculateExpectedClassAverage(sections) {
    if(calculateClassAverage(sections) === 'N/A') return 'N/A';
    // return 69;
    const exp_section_averages = sections.map((s) => {
        return calculateExpectedSectionAverage(s.assignments);
    });
    const valid_exp_section_averages = exp_section_averages.filter((e) => {
        if(e !== 'N/A') return e;
    });
    let total = 0;
    valid_exp_section_averages.map((v) => {
        total += parseFloat(v);
    });
    // console.log(`calculateExpectedClassAverage(): valid_exp_section_averages: ${valid_exp_section_averages}`);
    // console.log(`calculateExpectedClassAverage(): total / valid_exp_section_averages.length: ${total / valid_exp_section_averages.length}`);
    return (total / valid_exp_section_averages.length);
}

function determineLetterGrade(letter_grading, class_average) {
    let result = 'N/A';
    letter_grading.forEach((l) => {
        if(class_average === 100) result = 'A';
        if(class_average >= l.beg && class_average < l.end){
            result = l.letter;
        }
    })
    return result;
}

export function calculateClassLetterGrade(curr_class) {
    const class_average = calculateClassAverage(curr_class.sections) * 100;
    return determineLetterGrade(curr_class.letter_grading, class_average);
}

export function calculateExpectedClassLetterGrade(curr_class) {
    if(calculateClassLetterGrade(curr_class) === 'N/A') return 'N/A';
    const expected_class_average = calculateExpectedClassAverage(curr_class.sections) * 100;
    return determineLetterGrade(curr_class.letter_grading, expected_class_average);
}

function determineGPAWithLetterGrades(letter_grades) {
    let total = 0.0;
    letter_grades.forEach((l) => {
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
    return (total / letter_grades.length).toFixed(2);
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
    return determineGPAWithLetterGrades(valid_letter_grades);
    // let total = 0.0;
    // valid_letter_grades.forEach((l) => {
    //     switch(l){
    //         case 'A':
    //             total += 4.0;
    //             break;
    //         case 'A-':
    //             total += 3.7;
    //             break;
    //         case 'B+':
    //             total += 3.3;
    //             break;
    //         case 'B':
    //             total += 3.0;
    //             break;
    //         case 'B-':
    //             total += 2.7;
    //             break;
    //         case 'C+':
    //             total += 2.3;
    //             break;
    //         case 'C':
    //             total += 2.0;
    //             break;
    //         case 'C-':
    //             total += 1.7;
    //             break;
    //         case 'D+':
    //             total += 1.3;
    //             break;
    //         case 'D':
    //             total += 1.0;
    //             break;
    //         case 'F':
    //             total += 0.0;
    //             break;
    //     }
    // });
    // return (total / valid_letter_grades.length).toFixed(2);
}

export function calculateExpectedSemesterGPA(semester) {
    if(calculateSemesterGPA(semester) === 'N/A') return 'N/A';
    let expected_letter_grades = [];
    semester.classes.forEach((c) => {
        expected_letter_grades.push(calculateExpectedClassLetterGrade(c));
    })
    const valid_expected_letter_grades = expected_letter_grades.filter((l) => {
        if(l !== 'N/A') return l;
    });
    return determineGPAWithLetterGrades(valid_expected_letter_grades);
    // console.log(`calculateExpectedSemesterGPA(): valid_expected_letter_grades: ${valid_expected_letter_grades}`);
    // return 'hehe';
    // return null;
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