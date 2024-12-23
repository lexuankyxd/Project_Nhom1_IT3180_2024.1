import React, { useRef, useState } from 'react'
import { View, StyleSheet, Dimensions, Image, Text, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import MeScreen from './meScreen';

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

const { width, height } = Dimensions.get("window");
const menuHeight = height / 10;

const openModal = (slideAnim: any, setModalVisible: any) => {
  setModalVisible(true);
  Animated.timing(slideAnim, {
    toValue: menuHeight,
    duration: 100,
    useNativeDriver: false,
  }).start();
};

const closeModal = (slideAnim: any, setModalVisible: any) => {
  Animated.timing(slideAnim, {
    toValue: height,
    duration: 100,
    useNativeDriver: false,
  }).start(() => setModalVisible(false));
};

const joy  = ['eating', 'play', 'work', 'hard']

function FriendProfile() {
  const [routes] = useState([
    { key: "me", title: "Me" },
    { key: "save", title: "Saved" },
  ]);
  
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const router = useRouter();
  
  
  const renderScene = SceneMap({
    me: () => (
        <MeScreen myPosts={friends[1].images} openModal={() => openModal(slideAnim, setModalVisible)} />
    ),
    save: () => (
        <MeScreen myPosts={friends[1].images} openModal={() => openModal(slideAnim, setModalVisible)}/>
    ),
  });
  
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeftContainer}>
          <MaterialCommunityIcons name="account-search-outline" style={styles.icon} />
        </View>
        <AntDesign name="right" style={styles.icon} />
      </View>
      <View style={styles.middleContainer}>
         <Image
            style={styles.image}
            source={require("@/assets/images/laserEye.jpg")}
          />
          <Text style={styles.userName}>SuperHero</Text>
          <Text style={styles.userId}>@dcm</Text>
         <View style={styles.locationAndFriendContainer}>
            <Text style={styles.locationAndFriendText}>Paris</Text>
            <Text style={{color: "white"}}>|</Text>
            <Text style={styles.locationAndFriendText}>128 friends</Text>
          </View>
          <Text style={styles.discriptionText}>
          at Microsoft.PowerShell.PSConsoleReadLine.ProcessOneKey(ConsoleKeyInfo key, Dictionary`2 dispatchTable, Boolean ignoreIfNoAction, Object arg)
          </Text>
      </View>
      <View style={styles.hobbiesContainer}>
        {joy.map((item, index) => (
          <View key={index} style={styles.hobbiesTextContainer}>
            <Text style={styles.hobbiesText}>{item}</Text>
          </View>
        ))}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        style={styles.tabView}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={renderTabBar}
      />

      {/* ----------------------------------------------MENU------------------------------------------- */}
      {modalVisible && (
        <TouchableWithoutFeedback onPress={() => closeModal(slideAnim, setModalVisible)}>
          <View style={stylesMenu.overlay}>
            <Animated.View
              style={[stylesMenu.modalContainer, { top: slideAnim }]}
              onStartShouldSetResponder={() => true}
            >
              <View>
                <TouchableOpacity onPress={() => closeModal(slideAnim, setModalVisible)}>
                  <View style={stylesMenu.headerContainer}>
                    <Feather name="x" size={32} color="white" />
                  </View>
                </TouchableOpacity>
                <View style={stylesMenu.middleContainer}>
                  <Image
                    style={stylesMenu.imageContent}
                    source={require("@/assets/images/FB_IMG_1725192745457.jpg")}
                    resizeMode="stretch"
                  />
                  <View style={stylesMenu.logoAndTimeContainer}>
                  <Image
                    style={stylesMenu.logo}
                    source={require("@/assets/images/laserEye.jpg")}
                    resizeMode="stretch"
                  />
                  <Text style={stylesMenu.time}>59 minutes ago</Text>
                  </View>
                  <View style={stylesMenu.locationContainer}>
                    <Ionicons name="location-sharp" size={28} color="white" />                    
                    <Text style={stylesMenu.locationText}>So 1 Dai co viet</Text>
                  </View>

                  <TouchableOpacity onPress={() => {router.push('/mainScreen/postScreen')}}>
                    <View style={stylesMenu.buttonGoPostContainer}>
                      <Entypo name="forward" size={24} color="white" />
                      <Text style={stylesMenu.buttonGoPostText}>Go to post</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                </View>

            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* -------------------------------------------------------------------------------------------- */}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: "3%",
    paddingTop: "3%"
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "1%"
  },
  headerLeftContainer: {
    flexDirection: "row"
  },
  icon: {
    fontSize: width * 0.09,
    marginLeft: width * 0.01,
    color: "white"
  },
  middleContainer: {
    backgroundColor: "black",
    alignItems: "center", 
    justifyContent: "center", 
    padding: "1%"
  },
  image: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "white"
  },
  userName: {
    color: "white",
    fontSize: width * 0.07,
    fontWeight: "800"
  },
  userId: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "300",
  },
  locationAndFriendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", 
    alignSelf: "center",  
    paddingVertical: "1%",
    marginVertical: width * 0.05
  },
  locationAndFriendText: {
    fontSize: width * 0.037,
    color: "white",
    width: width * 0.25,
    textAlign: "center" 
  },
  discriptionText: {
    color: "white",
    lineHeight: height * 0.03,
  },
  hobbiesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", 
    flexWrap: "wrap", 
    paddingLeft: "2%",
    marginTop: width * 0.05
  },

  hobbiesTextContainer: {
    backgroundColor: "white",
    marginRight: width * 0.05,
    marginBottom: width * 0.05,
    borderRadius: 30,
  },  
  hobbiesText: {
      color: "black",
      padding: "3%",
  },
  tabView: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

})

const stylesMenu = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(39, 35, 35, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    width: "100%",
    height: height - menuHeight,
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabView: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: width * 0.13
  },
  middleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContent: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 40,
    borderColor: "white",
    borderWidth: 4,
  },
  logoAndTimeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "1%"
  },
  logo: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "white",
    margin: width * 0.03
  },
  time: {
    color: "white",
    fontWeight:"200"
  },
  locationContainer: {
    flexDirection: "row",
    padding: width * 0.05,
    justifyContent: "center",
    alignItems: "center"
  },
  locationText: {
    color: "white",
    marginLeft: width * 0.03,
    fontWeight: "300",
  },
  buttonGoPostContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 15,  
    width: width * 0.3,  
    height: height * 0.05,  
    backgroundColor: "black",
  },
  buttonGoPostText: {
    color: "white"
  }

})

export default FriendProfile