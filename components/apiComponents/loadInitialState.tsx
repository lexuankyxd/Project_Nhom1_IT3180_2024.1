import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { setAccount, setProfile, setMyPost, setMyFeed, setFriends, setFriendRequests, setMessages } from "@/reduxFolder/reducerFolder/userProfileSlice"

async function loadInitialState(dispatch: any) {
    const userToken = await SecureStore.getItemAsync('userToken');
    const apiUrl = `https://concrete-unlikely-stud.ngrok-free.app/account/loadInitialState`;

    return fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then(async (data) => {
            if (data) {
                dispatch(setAccount(data.account));
                dispatch(setProfile(data.profile));
                dispatch(setMyPost(data.myPost));
                dispatch(setMyFeed(data.myFeed));
                dispatch(setFriends(data.friends));
                dispatch(setFriendRequests(data.friend_reqs));
                dispatch(setMessages(data.messages));
            }            
            return true;
        })
        .catch(error => {
            console.error('Error fetching initial state:', error);
            return false;
        });
}

export default loadInitialState;
