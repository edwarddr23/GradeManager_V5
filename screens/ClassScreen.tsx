import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Footer from '../shared/custom_footer';

import FlatButton from '../shared/custom_buttons';
import { useProfileContext } from '../shared/profile_context';
import { PrintClassesFromProfile } from '../shared/profile_functions';

const ClassScreen = ({route, navigation}) => {
    const profile_context = useProfileContext();
    console.log(`ConfigureSectionsScreen(): JSON.stringify(profile_context): ${JSON.stringify(profile_context)}`);
    console.log(`ClassScreen(): JSON.parse(JSON.stringify(profile_context.years[0])): ${JSON.stringify(profile_context.years[0])}`);
    console.log(`ClassScreen(): JSON.parse(JSON.stringify(profile_context.years[1])): ${JSON.stringify(profile_context.years[1])}`);
    console.log(`LOOP ~~~~~~~~~~~~~~~~~~~~~~~`);
    profile_context.years.forEach((year) => {
        console.log(`ClassScreen(): JSON.stringify(year): ${JSON.stringify(year)}`);
    });
    console.log(`ClassScreen(): JSON.parse(JSON.stringify(profile_context.years)): ${JSON.parse(JSON.stringify(profile_context.years))}`);
    console.log(`ClassScreen(): route.params: ${route.params}`)
    const { curr_class_id, year_id } = route.params;
    console.log(`ClassScreen(): year_id: ${year_id}`);
    console.log(`ClassScreen(): curr_class_id: ${curr_class_id}`);
    // console.log(`ClassScreen(): years: ${years}`);
    const year = profile_context.years.find((year) => year.id === year_id);
    const curr_class = year.classes.find((c) => c.id === curr_class_id);


    PrintClassesFromProfile();
    // console.log(`ClassScreen(): profile_context.years: ${profile_context.years}`)
    
    // const[c_class, setc_class] = useState(profile_context.years.find(y => y.id === year_id)).fn;

    // console.log('ClassScreen: c_class.sections:', c_class.sections);
    
    useEffect(() => {
        // Set the header title of the screen to the name of the class.
        navigation.setOptions({title: `Sections for ${curr_class.name}`});
        // PrintClassesFromProfile();
    });

    return(
        <View>
            <Text>Hello</Text>
            {/* FOOTER */}
            <Footer/>
        </View>
    );
    
    // return(
    //     <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
    //         <View style={{height: '10%', marginTop: '5%'}}>
    //             <FlatButton
    //                 text={'Configure Sections'}
    //                 onPress={() => navigation.navigate('Sections', {year: year, curr_class: curr_class})}
    //             />
    //         </View>
    //         {(c_class.sections === undefined || c_class.sections.length == 0) && (
    //             <View style={{marginTop: '5%', flex: 1}}>
    //                 <Text style={{textAlign: 'center', fontSize: 30}}>No Sections yet!</Text>
    //             </View>
    //         )}
    //         {(c_class.sections != undefined && c_class.sections.length > 0) && (
    //             <View style={{flex: 1, alignItems: 'center'}}>
                
    //             </View>
    //         )}
    //         {/* FOOTER */}
    //         <Footer/>
    //     </View>
    // );
}

export default ClassScreen;