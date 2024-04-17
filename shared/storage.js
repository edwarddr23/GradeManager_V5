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

export const getAllSaveFileNames = async(setAll_keys) => {
    let all_keys = [];
    AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
            stores.map((result, i, store) => {
                // get at each store's key/value so you can work with it
                let key = store[i][0];
                let value = store[i][1];
                console.log(`getAllSaveFileNames(): key: ${key}`);
                all_keys.push(key);
                console.log(`getAllSaveFileNames(): all_keys: ${all_keys}`);
                setAll_keys(all_keys);
            });
        });
    });
    // return all_keys;
    // let all_keys = [];
    // (await AsyncStorage.getAllKeys()).forEach((key) => {
    //     console.log(`getAllSaveFileNames(): key: ${key}`)
    //     console.log(`getAllSaveFileNames(): typeof key: ${typeof key}`)
    //     all_keys.push(key);
    // });
    // console.log(`getAllSaveFileNames(): all_keys: ${all_keys}`)
    // return all_keys;
    // return (await AsyncStorage.getAllKeys()).map((key) => key);
}

export const importData = async () => {
    try {
        const keys = (await AsyncStorage.getAllKeys());
        const result = await AsyncStorage.multiGet(keys);
        // console.log(`importData: keys: ${keys}`);
        // console.log(`importData: result: ${result}`);
        // return 'hehe'
        // return keys.map((key) => JSON.parse(key)).forEach(console.log);
        // console.log(`importData(): all_keys: ${all_keys}`);
        return result.map(req => JSON.parse(req)).forEach(console.log);
    } catch (error) {
        console.error(error)
        return null;
    }
  }