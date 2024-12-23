import { router, useRouter } from 'expo-router';
import React from 'react'
import { Alert } from 'react-native';

async function registerAccount(username: string | Blob, password: string | Blob, phone_number: string | Blob, email: string | Blob, name: string | Blob, city: string | Blob, bio: string | Blob, image: string | null) {
    const SERVER_URL = 'https://concrete-unlikely-stud.ngrok-free.app/account/register';
    
    const newImageUri =  "file:///" + image.split("file:/").join("");
    const formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)
    formData.append('phone_number', phone_number)
    formData.append('email', email)
    formData.append('name', name)
    formData.append('city', city)
    formData.append('bio', bio)
    
    
    formData.append('img', {
      uri: newImageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    return fetch(SERVER_URL, {
        method: 'POST',
        body: formData,
      })
      .then((response) => response.json())
      .then(async (data) => {
        if ("message" in data) {
          Alert.alert('Notice', data.message);
          return false
        } else {
          Alert.alert('Notice', "Registration Success!");
          return true
        }
    })
      .catch(error => {
      Alert.alert('Notice', 'Registration Fail');
      return false
  });

};

export default registerAccount