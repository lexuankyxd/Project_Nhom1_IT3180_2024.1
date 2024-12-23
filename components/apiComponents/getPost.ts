import { setPost } from '@/reduxFolder/reducerFolder/postDataSlice';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

async function getPost(post_id: any, dispatch: any) {
    const userToken = await SecureStore.getItemAsync('userToken');
    const SERVER_URL = `https://concrete-unlikely-stud.ngrok-free.app/post/getPost?post_id=${post_id}`

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
            dispatch(setPost(data))
            return true
        }
    })
    .catch(error => {
        Alert.alert('Notice', "Error!");
        return false
    });
}
export default getPost;
