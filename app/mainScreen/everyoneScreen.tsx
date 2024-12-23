import { useRouter } from "expo-router";
import React from "react";
import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

function EveryoneScreen({ myPosts }: any) {
  const router = useRouter();
  return (
    <FlatList
      data={myPosts}
      keyExtractor={(item) => item.post_id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={ () => {
          router.push(`/mainScreen/postScreen?postId=${item.post_id}`)}}>
          <Image
            style={stylesMenu.sceneImage}
            source={{uri: item.media}} 
          />
        </TouchableOpacity>
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
    borderWidth: 4,
  },
});

export default EveryoneScreen;
