import React from 'react'
import { View, Text } from 'react-native'
import { useProfileContext } from './profile_context';

export const PrintData = () => {
    const profile_context = useProfileContext();
    console.log('PrintData(): profile_context.profile_name:', profile_context.profile_name);
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
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Profile Data for "{profile_context.profile_name}":</Text>
            {profile_context.years.map((year) => 
                <View key={child_key++}>
                    <Text style={{fontWeight: 'bold'}}>Academic Year {year.beg_year}-{year.end_year}:</Text>
                    {PrintClasses(year)}
                </View>
            )}
            {/* {PrintAcademicYrs(profile)} */}
        </View>
        // <Text>Hello</Text>
    );
}