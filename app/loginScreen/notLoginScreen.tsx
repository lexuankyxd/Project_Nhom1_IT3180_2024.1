import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function notLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
      
      <TouchableOpacity style={styles.button} onPress={() => console.log('Sign In Pressed')}>
        <Text style={styles.buttonTextSignIn}>SIGN IN</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>

      <View style={styles.separator}>
        <Text style={styles.orText}>OR</Text>
      </View>

      <TouchableOpacity style={styles.buttonNewAccount} onPress={() => console.log('Create Account Pressed')}>
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
    backgroundColor: '#fffff3',
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