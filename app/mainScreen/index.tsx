import React, { useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import FriendScreen from "./friendScreen";
import EveryoneScreen from "./everyoneScreen";
import MeScreen from "./meScreen";
import { useRouter } from "expo-router";


const { width, height: screenHeight } = Dimensions.get("window");
const menuHeight = screenHeight / 3.5;

const openModal = (slideAnim: any, setModalVisible: any) => {
  setModalVisible(true);
  Animated.timing(slideAnim, {
    toValue: menuHeight,
    duration: 300,
    useNativeDriver: false,
  }).start();
};

const closeModal = (slideAnim: any, setModalVisible: any) => {
  Animated.timing(slideAnim, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: false,
  }).start(() => setModalVisible(false));
};

const friends = [
  {
    id: 1,
    name: "Đặng Đức Khải",
    description: "Qua dep trai, vcl :vv",
    logo: "Capture2.png",
    location: {
      latitude: 38.78825,
      longitude: -122.4324,
    },
    images: [
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
    ],
    
  },
  {
    id: 2,
    name: "Alexander Manima",
    description: "Hello bro",
    logo: "Capture.png",
    location: {
      latitude: 32.78825,
      longitude: -122.4325,
    },
    images: [
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100"
    ],
  },
];


const MainScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const renderScene = SceneMap({
    me: () => <MeScreen myPosts={friends[1].images} />,
    friends: () => <FriendScreen listFriends={friends}/>,
    everyone: () => <EveryoneScreen myPosts={friends[1].images}/>,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "me", title: "Me" },
    { key: "friends", title: "Friends" },
    { key: "everyone", title: "Everyone" },
  ]);

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity>
          <Image
            style={styles.image}
            source={require("@/assets/images/laserEye.jpg")}
            resizeMode="stretch"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.everyoneText}
          onPress={() => openModal(slideAnim, setModalVisible)}
        >
          <AntDesign name="down" style={styles.everyoneTextContent} />
          <Text style={styles.everyoneTextContent}>Everyone</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/mainScreen/message")}>
          <View style={styles.mailOutlineContainer}>
            <Ionicons name="mail-outline" style={styles.mailOutline} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.05, 
            longitudeDelta: 0.05,
          }}
          customMapStyle={brownMapStyle}
          mapType="standard"
        >
          {friends.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.location}
              title={marker.name}
              description= {marker.description}
              image={require(`@/assets/images/Capture2.png`)}
              />
))}
        </MapView>
      </View>
      <TouchableOpacity>
        <AntDesign name="pluscircleo" style={styles.floatingButton} />
      </TouchableOpacity>
      
      {/* ----------------------------------------------MENU------------------------------------------- */}
      {modalVisible && (
        <TouchableWithoutFeedback onPress={() => closeModal(slideAnim, setModalVisible)}>
          <View style={stylesMenu.overlay}>
            <Animated.View
              style={[stylesMenu.modalContainer, { top: slideAnim }]}
              onStartShouldSetResponder={() => true}
            >
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: Dimensions.get("window").width }}
              style={stylesMenu.tabView}
              renderTabBar={renderTabBar}
            />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* -------------------------------------------------------------------------------------------- */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  containerHeader: {
    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  image: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#b8b894",
  },
  everyoneText: {
    width: width * 0.27,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  everyoneTextContent: {
    fontWeight: "900",
    fontSize: 24,
    marginHorizontal: 2,
    color: "white",
  },
  mailOutlineContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c2c2a3",
  },
  mailOutline: {
    color: "white",
    fontSize: 36,
    fontWeight: "900",
  },
  mapContainer: {
    flex: 1,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    overflow: "hidden",
  },
  floatingButton: {
    position: "absolute",
    zIndex: 10,
    bottom: 30,
    right: width * 0.4,
    backgroundColor: "#ffffff",
    borderRadius: 100,
    padding: 10,
    fontSize: 60,
    color: "#ab713b",
  },
});

const stylesMenu = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContainer: {
    position: "absolute",
    width: "100%",
    height: screenHeight - menuHeight,
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  tabView: {
    flex: 1,
  },
  meAndEveryoneContainer: {

  }
})

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    style={{ backgroundColor: "#000" }}
    indicatorStyle={{ backgroundColor: "#fff" }}
    labelStyle={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}
    pressColor="transparent"
    pressOpacity={1} 
  />
);

const brownMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3e3b2e"  
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f1e8d3"  
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#3e3b2e"  
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#7f7a64"  
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#7f7a64"  
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#9c9a7e"  
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f1e8d3"  
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#8c8764"  
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#9c9a7e"  
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#7f7a64"  
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#a89e89"  
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d1c6b0"  
      }
    ]
  }
];

export default MainScreen;
