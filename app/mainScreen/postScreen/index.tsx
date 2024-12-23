import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import getPost from '@/components/apiComponents/getPost';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reduxFolder/store';

const { width, height } = Dimensions.get('window');
const menuHeight = height / 5;

const openModal = (slideAnim: Animated.Value | Animated.ValueXY, setModalVisible: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
  setModalVisible(true);
  Animated.timing(slideAnim, {
    toValue: menuHeight,
    duration: 100,
    useNativeDriver: false,
  }).start();
};

const closeModal = (slideAnim: Animated.Value | Animated.ValueXY, setModalVisible: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
  Animated.timing(slideAnim, {
    toValue: height,
    duration: 100,
    useNativeDriver: false,
  }).start(() => setModalVisible(false));
};

export default function Posts() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const dispatch = useDispatch();


  useEffect(() => {
    const apiCall = async () => {
        const tempData = await getPost(postId, dispatch);
        if (!tempData) {
          router.back()
        } 
        
    };
    apiCall();
    
  }, [postId]);  

  const postData = useSelector((state: RootState) => state.postDataSlice.post)
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={28} color="white" />
        </TouchableOpacity>
        <Image style={styles.logo} source={{uri: postData?.media}} resizeMode="stretch" />
        <View style={styles.nameAndTimeContainer}>
          <Text style={styles.name}>{postData?.username}</Text>
          <Text style={styles.timePost}>59 minutes ago</Text>
        </View>
      </View>
      <View>
        <Image
          style={styles.imageContent}
          source={{uri: postData?.media}}
        />
        <Text style={styles.postDiscription}>{postData?.content}</Text>
      </View>
      <View style={styles.belowContentContainer}>
        <View style={styles.belowContentHeader}>
          <View style={styles.belowContentLeftHeader}>
            <AntDesign name="hearto" style={styles.iconBelowHeaderLeft} />
            <Text style={styles.textBelowHeaderLeft}>{postData?.like_count}</Text>
            <TouchableOpacity onPress={() => openModal(slideAnim, setModalVisible)}>
              <Ionicons name="chatbubble-outline" style={styles.iconBelowHeaderLeft} />
            </TouchableOpacity>
            <Text style={styles.textBelowHeaderLeft}>{postData?.comment_count}</Text>
          </View>
          <Feather name="bookmark" size={24} color="white" />
        </View>
        <View style={styles.myMapViewContainer}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: parseFloat(postData?.latitude ?? '0'),
              longitude: parseFloat(postData?.longitude ?? '0'),
              latitudeDelta: 1,
              longitudeDelta: 1,
            }}
            customMapStyle={brownMapStyle}
          >
              <Marker
              coordinate={{"latitude": parseFloat(postData?.latitude ?? '0'), "longitude": parseFloat(postData?.longitude ?? '0')}}
              description= {postData?.content}
              image={require("@/assets/images/Capture2.png")}
              />
          </MapView>
        </View>
        <View style={styles.locationTextContainer}>
          <Ionicons name="location-outline" size={28} color="white" />
          <Text style={styles.locationText}>{"Latitude: " + postData?.latitude + " - Longtitude: " + postData?.longitude}</Text>
        </View>
      </View>
      {modalVisible && (
        <TouchableWithoutFeedback onPress={() => closeModal(slideAnim, setModalVisible)}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.modalContainer, { top: slideAnim }]}>
              <View style={styles.inputTextContainer}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Sent message..."
                  placeholderTextColor="white"
                  multiline
                />
                <TouchableOpacity onPress={() => console.log('Sent')}>
                  <AntDesign name="hearto" style={styles.inputTextIcon} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {postData?.comments.map((comment, index) => (
                  <View key={comment.comment_id} style={styles.commentItem}>
                    <Image source={{uri: comment.img}} style={styles.imageIconComment} />
                    <View style={styles.textContainer}>
                      <Text style={styles.nameComment}>{comment.username}</Text>
                      <View style={styles.textContainerCommentAndHeart}>
                        <Text style={styles.contentComment}>{comment.content}</Text>
                        <AntDesign name="hearto" size={24} color="white" />
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    padding: "1%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "3%"
  },  
  logo: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 100,
    marginLeft: "3%"
  },
  nameAndTimeContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2%",
  },
  name: {
    fontSize: width * 0.05,
    fontWeight: "800",
    color: "white"
  },
  timePost: {
    fontWeight: "300",
    color: "white"
  },
  imageContent: {
    width: width,
    height: width,
    marginTop: "4%"
  },
  belowContentContainer: {
    flex: 1, 
    alignItems: "center",

  },
  belowContentHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "4%",
  },
  belowContentLeftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBelowHeaderLeft: {
      color: "white",
      fontSize: 24,
      marginRight: width * 0.015
  },
  textBelowHeaderLeft: {
    color: "white",
    marginRight: width * 0.05
  },
  myMapViewContainer: {
    width: "90%",
    height: "60%",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden"
  },
  myMapView: {
    width: "100%",
    height: "100%"
  },
  locationTextContainer: {
    flexDirection: "row",
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  locationText: {
    color: "white",
  },
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
  postDiscription: {
    position: "absolute",
    color: "white",
    bottom: "4%", 
    left: "50%", 
    transform: [{ translateX: -width * 0.45 }], 
    width: "auto",  
    paddingHorizontal: 10,
    paddingVertical: 5, 
    textAlign: "center",
    backgroundColor: "#B7B7B7BF",
    fontWeight: "700",
    lineHeight: width * 0.08,
    borderRadius: 15,
  },
    commentItem: {
      width: width,
      flexDirection: "row",
      padding: "1%",
      alignItems: "center",
      marginBottom: width * 0.05
    },
    imageIconComment: {
      width: width * 0.15,
      height: width * 0.15,
      borderRadius: 100,
      marginRight: "5%",
      borderWidth: 4,
      borderColor: "grey"
    },
    textContainer: {
      alignContent: "center",
    },
    textContainerCommentAndHeart: {
      flexDirection: "row",
      width: "83%",
      justifyContent: "space-between",
      alignItems: "center",
      
    },
    nameComment: {
      fontSize: width * 0.045,
      fontWeight: "900",
      color: "white"
    },
    contentComment: {
      width: "80%",
      fontSize: width * 0.04,
      color: "white",
    },
    inputTextContainer: {
      height: "10%",                   
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      backgroundColor: '#4C4C4C',
      borderRadius: 30,
      marginBottom: width * 0.1,
    },
    inputText: {
      flex: 1,                       
      height: "100%",                 
      borderRadius: 30,
      backgroundColor: "#4C4C4C",
      color: 'white', 
      fontSize: 16
    },
    inputTextIcon: {
      marginLeft: 12,                 
      color: "white",
      fontSize: 24,
    },
})

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