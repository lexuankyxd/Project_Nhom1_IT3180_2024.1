import React from "react";
import { View, Image, StyleSheet, FlatList, Dimensions } from "react-native";

interface EveryoneScreenProps {
  myPosts: string[]; 
}

const { width } = Dimensions.get("window");


function EveryoneScreen({ myPosts }: EveryoneScreenProps) {
  return (
    <FlatList
      data={myPosts}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <Image
          style={stylesMenu.sceneImage}
          source={require('@/assets/images/laserEye.jpg')}
        />
      )}
      numColumns={3} 
      contentContainerStyle={stylesMenu.scene}
    />
  );
}

const stylesMenu = StyleSheet.create({
  scene: {
    justifyContent: "space-evenly",
    paddingVertical: 10,
    backgroundColor: "#000",
  },
  sceneImage: {
    width: width * 0.27,  
    aspectRatio: 1,  
    margin: width * 0.015,  
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 4
  },
});

export default EveryoneScreen;
