/* 
    storage.js

    PURPOSE

        The purpose of this file is to define a shared storage object to utilize the AsyncStorage library
        to handle the saving of profile_context information to the back end.
*/

import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Taken from https://github.com/sunnylqm/react-native-storage
export default storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync: {}
});