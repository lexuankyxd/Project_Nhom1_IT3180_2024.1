// CameraMain.tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';  // Keep this for dispatch
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { setImage } from '@/reduxFolder/reducerFolder/captureImageSlice';

function CameraMain() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const dispatch = useDispatch();

  const cameraRef = useRef(null);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (permission === null) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, exif: false };
      const photo = await cameraRef.current.takePictureAsync(options);
      dispatch(setImage(photo));
      router.push('/cameraScreen/newPost'); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainder}>
        <AntDesign name="left" size={32} color="white" />
        <MaterialCommunityIcons name="camera-flip-outline" onPress={toggleCameraFacing} size={32} color="white" />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      </View>
      <View style={styles.captureButtonContainer}>
        <View style={styles.captureButton} >
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonContent}></View>
          </TouchableOpacity>
        </View>
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
    width: "60%",
    height: "28%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100
  },
  captureButtonContent: {
    width: "40%",
    height: "300%",
    backgroundColor: "white",
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "grey"
  },
});

export default CameraMain;
