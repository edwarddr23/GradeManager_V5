import React from 'react'
import { View, Text } from 'react-native'

export const PrintData = (profile) => {
    let child_key = 0;

    function PrintClasses(year) {
        let child_key = 0;
        // console.log('PrintClasses(): year:', year);
    
        return(
            // <Text>Class Here</Text>
            <View>
                {year["classes"].map((curr_class) =>
                    <Text key={child_key++}>{curr_class["name"]}</Text>
                )}
            </View>
        )
        // return(<Text>Class here</Text>)
    }

    return(
        <View>
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Profile Data for "{profile.name}"":</Text>
            {profile["academic_years"].map((year) => 
                <View key={child_key++}>
                    <Text style={{fontWeight: 'bold'}}>Academic Year {year.beg_year}-{year.end_year}:</Text>
                    {PrintClasses(year)}
                </View>
            )}
            {/* {PrintAcademicYears(profile)} */}
        </View>
        // <Text>Hello</Text>
    );
}