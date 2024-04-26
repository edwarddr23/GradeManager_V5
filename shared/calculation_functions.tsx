/*
NAME

    getValidAssignments - a function component that returns all initialized assignments (ones that actually have a numerator and denominator defined by the user).

SYNOPSIS

    AssignmentContent array getValidAssignments(assignments)
        assignments --> Array of assignments to look through for valid assignments.

DESCRIPTION

    Filter through the assignments in parameter array assignments to return only assignments that are valid. The valid
    assignemnts are the ones with a defined numerator and denominator (and thus, actually have a grade). This function
    is exclusively for this calculation_functions.tsx file, so it will not be exported for other files.

RETURNS

    Returns an array of AssignmentContent objects from parameter array assignemnts that have a defined numerator and denominator.
*/
const getValidAssignments = (assignments) => {
    return assignments.filter((a) => {
        if(a.numerator !== -1 && a.denominator !== -1) return a;
    })
}

/*
NAME

    calculateSectionAverage - a function that calculates the calculated average of a section.

SYNOPSIS

    float or string calculateSectionAverage(assignments)
        assignments --> array of assignment objects to determine average for.

DESCRIPTION

    Extract only the valid assignments from the parameter assignments and iterate through each valid assignment to accumulate a total of
    each assignment's grade. Then return that total over the number of valid assignments. If there are no valid assignments in the first
    place, then instead return a string that says 'N/A'.

RETURNS

    Returns a float that represents the section's average given parameter assignments or string 'N/A' if no valid assignments exist in the parameter.
*/
export function calculateSectionAverage(assignments) {
    let total = 0;
    const valid_assignments = getValidAssignments(assignments);
    
    // If there are no valid assignments, there is no average to determine.
    if(valid_assignments.length === 0) return 'N/A';
    
    valid_assignments.map((a) => {
        total += a.numerator / a.denominator;
    });
    return (total / valid_assignments.length);
}

/*
NAME

    simpleLinearRegression - a function that calculates the line of best fit given the data within parameter dataset.

SYNOPSIS

    Array of numbers simpleLinearRegression(dataset)
        dataset --> array, of presumably assignment objects, to determine the line of best fit for.

DESCRIPTION

    Each of the variables for the line of best fit will be extracted from parameter dataset directly or
    indirectly. x and y will be determined directly using the values in the dataset, determining x by
    simply recording indices from each value in the dataset. Each point in y is determined by calculating
    the grade for each assignment in the dataset. All of the other variables needed are derived from x and y.
    Using the simple equation for a line, y = mx + b, we will solve for m (slope of the line) and b (y-intercept
    of the line) using the variables derived from the parameter dataset.

RETURNS

    Returns an array of numbers that represent the slope and y-intercept (m and b, respectively) for the line of best fit for the parameter dataset.
*/
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
    const sum_x_sqr = x_sqr.reduce((a, b) => a + b, 0);

    const y_sqr = y.map((y) => {
        return y * y;
    });
    // const sum_y_sqr = y_sqr.reduce((a, b) => a + b, 0);
    
    const xy = x.map((element, idx) => {
        return x[idx] * y[idx];
    });
    const sum_xy = xy.reduce((a, b) => a + b, 0);

    const m = (sum_xy - ((sum_x * sum_y) / x.length)) / (sum_x_sqr - ((sum_x * sum_x) / x.length))
    const b = (sum_y - (m * sum_x)) / x.length;
    return [m, b];
}

/*
NAME

    calculateExpectedSectionAverage - a function that calculates the expected average of a section by using the line of best fit for the assignemnt grades from parameter assignments.

SYNOPSIS

    string or float calculateExpectedSectionAverage(assignments)
        assignments --> array of assignment objects to determine the expected average for.

DESCRIPTION

    Take the slope and y-intercept of the line of best fit for parameter assignments. Using the slope and u-intercept
    of that line, calculate the projected grade for each uninitialized assignment in parameter assignments. Then, calculate
    all the average with all of these modified values in mind.

RETURNS

    Returns a float that represents the expected average grade for parameter assignments using Linear Regression.
*/
export function calculateExpectedSectionAverage(assignments) {
    // If a calculated average of the assignments within a section cannot be determined, then neither can a projected average be determined.
    if(calculateSectionAverage(assignments) === 'N/A') return 'N/A';
    
    // Extract the slope and y-intercept (m and b, respectively) from the line of best fit found for assignments.
    const [m, b] = simpleLinearRegression(getValidAssignments(assignments));

    if(getValidAssignments(assignments).length > 1){
        let assignment_num = 0;
        let total = 0;
        // Create an array of assignment grades that reflects all of the recorded grades and the new projected grades for any uninitialized assignments found in the array assignments.
        const expected_assignment_grades = assignments.map((a) => {
            assignment_num++;
            // If the current assignment in question is uninitialized, then this will be a datapoint to predict. Using the linear regression model: y = mx + b, we will find the expected grade, y, by plugging in values for m, x, and b. m and b were already determined before, and x is determined by finding the "index" of the current assignment in question. Accumulate this y value into total for the average as well
            if(a.numerator === -1 && a.denominator === -1){
                total += m * assignment_num + b;
                // Add this y point to expected_assignment_grades.
                return m * assignment_num + b;
            }
            // Otherwise, add the recorded grade of the assignment to expected_assignment_grades and the total.
            total += a.numerator / a.denominator;
            return a.numerator / a.denominator;
        });

        // It is assumed that a section average cannot exceed 100%, and linear regression can easily lead to an average beyond 100% depending on the grades, the trend of the grades, and number of assignemnts. So, if it does exceed 100%, then return only 100%.
        if((total / expected_assignment_grades.length) > 1) return 1;
        // Otherwise, return the average determined.
        return (total / expected_assignment_grades.length);
    }
    // If there's only 1 valid assignment, then any subsequent expected grades are the grade of the only valid assignment. Mathematically, no matter how many points are added, since they will all have the same y value, the average of the line will always just be the value of the 1 valid assignemnt.
    else if(getValidAssignments(assignments).length === 1) {
        const valid_assignment = getValidAssignments(assignments)[0];
        return valid_assignment.numerator / valid_assignment.denominator;
    }
}

/*
NAME

    calculateClassAverage - a function that calculates the expected average of a section by using the line of best fit for the assignemnt grades from parameter assignments.

SYNOPSIS

    string or float calculateExpectedSectionAverage(assignments)
        assignments --> array of assignment objects to determine the expected average for.

DESCRIPTION

    Averages for each section and their relative weights will be accumulated into an array. Then, only the valid
    sections are kept in the array based on whether their average is not 'N/A'. If there are no valid sections, then
    the average of the class cannot be determined either, so return 'N/A'. Otherwise, accumulate the total of weighted
    averages (each section average multiplied by their relative weights) and the total relative weights to determine the
    average of all of the sections with each section's weight in mind. This function allows for the average of sections
    that total less than 100%, as mathematically, there is nothing inherently wrong with that, as long as the relative
    weights are kept in mind.

RETURNS

    Returns a float that represents the expected average grade for parameter assignments using Linear Regression. Otherwise, if an average cannot be determined, 'N/A' will be returned.
*/
export function calculateClassAverage(sections) {
    // Accumulate each section's calculated average and relative weight into an array of arrays.
    let section_averages = [];
    sections.map((s) => {
        const section_average = calculateSectionAverage(s.assignments);
        section_averages.push([section_average, s.weight]);
    })
    // Take out all of the sections from this array which have average 'N/A', as that means that an average could not be determined and thus should not be considered. A proper average of a class can be deterimined without every section if evaluated on how much percentage of the total grade can be calculated with.
    const valid_section_averages = section_averages.filter((s) => {
        if(s[0] !== 'N/A') return s;
    });
    // If there are no sections with an actual average, then an average for the class cannot be determined either. Return 'N/A'.
    if(valid_section_averages.length === 0) return 'N/A';
    // Otherwise, accumulate the averages and weights of every section. The weights 
    let total_averages = 0;
    let total_weights = 0;
    valid_section_averages.map((v) => {
        // Each section average must be multiplied with its relative weight to keep the values relative to their relative weights. This becomes useful also for when the valid sections do not total 100% in relative weight.
        total_averages += parseFloat(v[0]) * parseFloat(v[1]);
        // The weights are accumulated to determine the average with the total relative weights in mind, as there will be situations where the total relative weight will not equal 100%.
        total_weights += parseFloat(v[1]);
    });
    return (total_averages / total_weights);
}

export function calculateExpectedClassAverage(sections) {
    // If a calculated average of the class's sections cannot be determined, then neither can the projected average. Return 'N/A'.
    if(calculateClassAverage(sections) === 'N/A') return 'N/A';
    
    // Accumulate all the expected averages for each section.
    const exp_section_averages = sections.map((s) => {
        return calculateExpectedSectionAverage(s.assignments);
    });
    // Filter out any expected section averages that are invalid. There must be at least one valid expected section average, otherwise, a calculated section average would not be determined either, so we will not need to check if any valid expected section averages exist.
    const valid_exp_section_averages = exp_section_averages.filter((e) => {
        if(e !== 'N/A') return e;
    });
    let total = 0;
    valid_exp_section_averages.map((v) => {
        total += parseFloat(v);
    });
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
}

function floatAverage(arr) {
    let total = 0;
    arr.forEach((a) => {
        total += parseFloat(a);
    });
    return (total / arr.length).toFixed(2);
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
    return floatAverage(valid_semester_gpas);
    // let total = 0;
    // valid_semester_gpas.forEach((v) => {
    //     total += parseFloat(v);
    // });
    // return (total / valid_semester_gpas.length).toFixed(2);
}

export function calculateExpectedYearGPA(year) {
    if(calculateYearGPA(year) === 'N/A') return 'N/A';
    let expected_semester_gpas = [];
    year.semesters.forEach((s) => {
        expected_semester_gpas.push(calculateExpectedSemesterGPA(s));
    })
    const valid_expected_semester_gpas = expected_semester_gpas.filter((e) => {
        if(e !== 'N/A') return e;
    });
    return floatAverage(valid_expected_semester_gpas);
    // return 'hehe';
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
    return floatAverage(valid_year_gpas);
    // return 'hehe';
    // let total = 0;
    // valid_year_gpas.forEach((v) => {
    //     total += v;
    // });
    // return (total / valid_year_gpas.length).toFixed(2);
}

export function calculateExpectedCumulativeGPA(years) {
    if(calculateCumulativeGPA(years) === 'N/A') return 'N/A';
    let expected_year_gpas = [];
    years.forEach((y) => {
        expected_year_gpas.push(calculateExpectedYearGPA(y));
    })
    const valid_expected_year_gpas = expected_year_gpas.filter((e) => {
        if(e !== 'N/A') return e;
    });
    return floatAverage(valid_expected_year_gpas);
    // return 'hehe';
}