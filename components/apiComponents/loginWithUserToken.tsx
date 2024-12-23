import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

async function loginWithUserToken() {
    const userToken = await SecureStore.getItemAsync('userToken');
    const SERVER_URL = 'https://concrete-unlikely-stud.ngrok-free.app/account/loginByToken'

    return fetch(SERVER_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json"
        },
    })
    .then((response) => response.json())
    .then(async (data) => {
        if ("message" in data) {
            Alert.alert('Notice', data.message);
            return false
        } else {
            await SecureStore.setItemAsync('userToken', data.token);
            return true
        }
    })
    .catch(error => {
        Alert.alert('Notice', "Login Fail!");
        return false
    });
}
export default loginWithUserToken;
