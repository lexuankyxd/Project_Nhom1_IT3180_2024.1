import * as SecureStore from 'expo-secure-store';

async function checkIfUserTokenExist() {
  const userToken = await SecureStore.getItemAsync('userToken');
  return userToken != null;
}

export default checkIfUserTokenExist;