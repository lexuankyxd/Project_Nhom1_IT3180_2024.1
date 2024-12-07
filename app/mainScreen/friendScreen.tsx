import React from "react";
import { View, Image, StyleSheet, FlatList, Dimensions, Text } from "react-native";

interface FriendScreenProps {
  listFriends: any; 
}

const { width } = Dimensions.get("window");


function FriendScreen({ listFriends }: FriendScreenProps) {
  return (

    <FlatList
      data={listFriends}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={stylesMenu.friendContainer}>
          <View style={stylesMenu.sceneNameContainer}>
            <Image
                style={stylesMenu.sceneNameImage}
                source={require('@/assets/images/laserEye.jpg')}
            />
            <Text style={stylesMenu.sceneNameText}>{item.name}</Text>
          </View>
          <FlatList
          data={item.images}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
              <Image
                style={stylesMenu.friendSceneImage}
                source={require('@/assets/images/FB_IMG_1725192745457.jpg')}
              />
          )}
          numColumns={3} 
          contentContainerStyle={stylesMenu.scene}
        />
        </View>
      )}
      numColumns={1} 
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
  friendContainer: {
    marginBottom: width * 0.1
  },
  friendSceneImage: {
    width: width * 0.27,  
    aspectRatio: 1,  
    margin: width * 0.015,  
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 4
  },
  sceneNameContainer: {
    marginLeft: width * 0.015,
    marginBottom: width * 0.018,
    width: "auto",
    flexDirection: "row",
    alignItems: "center"  
  }, 
  sceneNameText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  sceneNameImage: {
    width: width * 0.14,  
    height: width * 0.14, 
    borderRadius: (width * 0.15) / 2,
    marginRight: width * 0.03, 
    borderWidth: 4, 
    borderColor: "#fff", 
  }
});

export default FriendScreen;
