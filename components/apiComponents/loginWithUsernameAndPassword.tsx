import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

function LoginWithUsernameAndPassword(username: string, password: string) {
    const apiUrl = `https://concrete-unlikely-stud.ngrok-free.app/account/login?login=${username}&password=${password}`;
    return fetch(apiUrl, {
        method: "GET",
        headers: {
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
            return true;
        }
    })
    .catch(error => {
        return false
    });
}

export default LoginWithUsernameAndPassword;