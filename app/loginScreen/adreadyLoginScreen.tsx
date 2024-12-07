import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

function AdreadyLoginScreen() {
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
      <Image 
        source={require('@/assets/images/laserEye.jpg')} 
        style={styles.image} 
        resizeMode="contain"
      />
      <Text style={styles.textTitle}>Welcome hzpro1221!</Text>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>SIGN IN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffff3',
    padding: 20,
  },

  logo: {
    fontSize: width * 0.18,
    color: 'black',
    marginBottom: height * 0.08,
    textAlign: 'center',
    fontFamily: 'IrishGrover-Regular', 
  },

  image: {
    width: width * 0.5, 
    height: width * 0.3,
    marginTop: 80, 
    marginBottom: 15, 
    borderRadius: 80, 
    borderWidth: 4,
    borderColor: '#000000'
  },

  textTitle: {
    fontSize: 25,
    fontWeight: "light"
  },

  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },

  button: {
    width: '60%',
    padding: width * 0.019,
    backgroundColor: 'black',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: height * 0.05,
  },
});

export default AdreadyLoginScreen;
