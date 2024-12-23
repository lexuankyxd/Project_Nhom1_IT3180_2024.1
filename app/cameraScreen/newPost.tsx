import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduxFolder/store';  // Import the RootState type for proper typing
import AntDesign from '@expo/vector-icons/AntDesign';
import { TextInput } from 'react-native-paper';

const { width, height: screenHeight } = Dimensions.get("window");

function NewPost() {
  const [text, setText] = useState('');  
  const photo = useSelector((state: RootState) => state.captureImageSlice.photo);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainder}>
        <AntDesign name="left" size={32} color="white" />
      </View>

      <View style={styles.cameraContainer}>
        <Image style={styles.camera} source={{uri: photo.uri}} />
        <TextInput         
            style={styles.textInput}
            value={text}  
            onChangeText={setText}  
            placeholder="Enter description..."/>
      </View>
      <View style={styles.captureButtonContainer}>
      <TouchableOpacity style={styles.captureButton}>
            <Text style={styles.captureButtonContent}>Share!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  headerContainder: {
    flexDirection: "row",
    padding: "4%",
    justifyContent: "space-between"
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    width: "100%",
    height: "70%",
    padding: "3%",
    borderRadius: 40,
    borderColor: "white",
    borderWidth: 4
  },
  camera: {
    flex: 1
  },
  captureButtonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  captureButton: {
    backgroundColor: '#363636',   
    width: "40%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100
  },
  captureButtonContent: {
    fontWeight: "800",
    color: "white",
    fontSize: width * 0.06,
    textAlign: "center"
  },
  textInput: {
    position: 'absolute',
    bottom: 20,   
    left: 60,  
    width: width * 0.7,
    backgroundColor: "#B7B7B7BF",
    color: 'white',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderRadius: 20,
    paddingLeft: 10,
  },
});

export default NewPost;
