import React from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';

async function CheckIfUserTokenExist() {
    const userToken = await EncryptedStorage.getItem('userToken');
  return userToken != null
}

export default CheckIfUserTokenExist