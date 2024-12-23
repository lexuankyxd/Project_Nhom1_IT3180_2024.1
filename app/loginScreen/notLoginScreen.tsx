import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as Font from 'expo-font';
import LoginWithUsernameAndPassword from '@/components/apiComponents/loginWithUsernameAndPassword';
import { useRouter } from 'expo-router';
import loginWithUserToken from '@/components/apiComponents/loginWithUserToken';
import loadInitialState from '@/components/apiComponents/loadInitialState';

const { width, height } = Dimensions.get('window');

export default function notLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'IrishGrover-Regular': require('@/assets/fonts/IrishGrover-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PanC</Text>
      
      <TextInput
        label="User name, Email or phone numbers"
        textColor="#000000"
        mode="flat"
        style={styles.input}
        placeholder="0123456789"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      
      <TextInput
        label="Password"
        style={styles.input}
        placeholder="***********"
        placeholderTextColor="#999"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      
      <TouchableOpacity 
  style={styles.button} 
  onPress={async () => {
    const reply = await LoginWithUsernameAndPassword(username, password);
    if (reply) {
      router.push('/mainScreen')
    }
  }}>

  <Text style={styles.buttonTextSignIn}>SIGN IN</Text>
</TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>

      <View style={styles.separator}>
        <Text style={styles.orText}>OR</Text>
      </View>

      <TouchableOpacity style={styles.buttonNewAccount} onPress={() => router.push('/registerScreen')}>
        <Text style={styles.buttonTextNewAccount}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const theme = {
  fonts: {
    fontFamily: 'IrishGrover-Regular', 
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: width * 0.08,
  },

  logo: {
    fontSize: width * 0.18,
    color: 'black',
    marginBottom: height * 0.08,
    textAlign: 'center',
    fontFamily: 'IrishGrover-Regular', 
  },

  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: '#000000',
    fontSize: 16,
  },

  button: {
    width: '100%',
    padding: width * 0.019,
    backgroundColor: 'black',
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },

  buttonTextSignIn: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },

  buttonNewAccount: {
    width: '100%',
    padding: width * 0.019,
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: "#000000",
    borderWidth: 1,
    alignItems: 'center',
  },

  buttonTextNewAccount: {
    color: "#000",
    fontSize: 14
  },

  forgotPassword: {
    color: '#000',
    fontSize: 14,
    marginBottom: 20,
    marginLeft: width * 0.45
  },

  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginTop: width * 0.45
  },

  orText: {
    fontSize: 16,
    color: '#000',
  },
});

// import { useRef, useState } from 'react';
// import { Button, Image, View, StyleSheet, Alert, TouchableOpacity, Text, SafeAreaView } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

// const SERVER_URL = 'https://concrete-unlikely-stud.ngrok-free.app/account/register'; // Replace with your server URL

// export default function ImagePickerExample() {
//   const [image, setImage] = useState<string | null>(null);
  
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [permission, requestPermission] = useCameraPermissions();
//   const [photo, setPhoto] = useState<any>(null);  // Add photo state

//   const cameraRef = useRef(null);

//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
  
//     if (!permission) {
//       // Camera permissions are still loading.
//       return <View />;
//     }
  
//     if (!permission.granted) {
//       // Camera permissions are not granted yet.
//       return (
//         <View style={styles.container}>
//           <Text style={styles.message}>We need your permission to show the camera</Text>
//           <Button onPress={requestPermission} title="grant permission" />
//         </View>
//       );
//     }
  
  

//     console.log(result);

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async () => {
//     if (!image) {
//       Alert.alert('No image selected', 'Please select an image first.');
//       return;
//     }
//     const newImageUri =  "file:///" + image.split("file:/").join("");
//     const formData = new FormData();
//     formData.append('username', 'username')
//     formData.append('password', 'password')
//     formData.append('phone_number', 'phone_number')
//     formData.append('email', 'email')
//     formData.append('name', 'email')
//     formData.append('city', 'email')
//     formData.append('bio', 'email')
    
    
//     formData.append('img', {
//       uri: newImageUri,
//       type: 'image/jpeg', // Adjust this depending on the image type
//       name: 'photo.jpg',
//     });

//     try {
//       const response = await fetch(SERVER_URL, {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', 'Image uploaded successfully!');
//         console.log(result);
//       } else {
//         Alert.alert('Error', 'Failed to upload the image.');
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       Alert.alert('Error', 'Something went wrong while uploading.');
//     }
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const options = { quality: 1, base64: true, exif: false };
//       const photo = await cameraRef.current.takePictureAsync(options);
//       setPhoto(photo);  // Set the photo state after taking the picture
//       console.log(photo.uri);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Pick an image from camera roll" onPress={pickImage} />
//       {image && (
//         <>
//           <Image source={{ uri: image }} style={styles.image} />
//           <Button title="Upload Image" onPress={uploadImage} />
//         </>
//       )}
//       <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             <Text style={styles.text}>Flip Camera</Text>
//       </TouchableOpacity>
//       <View style={{ backgroundColor: 'white', alignItems: 'flex-end' }}>
//         <Button title="Take Picture" onPress={takePicture} />
//       </View>
//       {photo && (
//       <Image source={{ uri: photo.uri }} style={{width: 500, height: 500}} />      
//   )}
//       <Image source={{ uri: "https://d3ht352smadyrz.cloudfront.net/fccb6a76134b8472b39df74dcf1b457b.png__a75f31c56f7260311f7d9018221850eaa0d2a8916057aee9bdb3759a2dc6ffb0" }} style={{width: 500, height: 500}} />      


//       <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
//         <View style={styles.buttonContainer}>
//         </View>
//       </CameraView>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: "black"
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginVertical: 20,
//   },
//   message: {
//     textAlign: 'center',
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'black',
//   },
// });