import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Button, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as Font from 'expo-font';
import LoginWithUsernameAndPassword from '@/components/apiComponents/loginWithUsernameAndPassword';
import * as ImagePicker from 'expo-image-picker';
import registerAccount from '@/components/apiComponents/registerAccount';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<string | null>(null);


  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
  }

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
        <ScrollView 
  style={styles.scrollView} 
  contentContainerStyle={styles.scrollViewContent} 
  keyboardShouldPersistTaps="handled"
>
        <View style={styles.formContainer}>
            <TextInput
            label="Your username"
            textColor="#000000"
            mode="flat"
            style={styles.input}
            placeholder="eg. khaiduc01"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            />

            <TextInput
            label="Password"
            style={styles.input}
            placeholder="eg. 12345678"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            />

            <TextInput
            label="Phone number"
            style={styles.input}
            placeholder="eg. 02738283920"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            />

            <TextInput
            label="Gmail"
            style={styles.input}
            placeholder="eg. dangduckhai44@gmail.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            />

            <TextInput
            label="Name"
            style={styles.input}
            placeholder="eg. Đặng Đức Khải"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            />

            <TextInput
            label="City"
            style={styles.input}
            placeholder="eg. Hà Nội"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
            />

            <TextInput
            label="Bio"
            style={styles.input}
            placeholder="eg. Hello Mọi Người!"
            placeholderTextColor="#999"
            value={bio}
            onChangeText={setBio}
            />

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerButtonText}>Pick an image from camera roll</Text>
        </TouchableOpacity>           
        {image && (<View>
               <Image source={{ uri: image }} style={styles.image} />
           </View>
        )}
            
        </View>
    </ScrollView>
        <TouchableOpacity 
    style={styles.button} 
    onPress={async () => {
      const reply = await registerAccount(username, password, phoneNumber, email, name, city, bio, image)
      if (reply) {
        router.back()
      }}}>
    <Text style={styles.buttonTextSignIn}>SIGN UP</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center', 
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
    image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  imagePickerButton: {
    backgroundColor: '#D3D3D3', 
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 3
  },
  imagePickerButtonText: {
    color: '#000', 
    fontSize: 16,
    fontWeight: 'bold',
  }
});
