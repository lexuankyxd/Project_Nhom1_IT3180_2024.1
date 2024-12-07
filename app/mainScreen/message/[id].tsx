import { useRoute } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width, height } = Dimensions.get("window");

const messages = [{id: 0, content: [
  {
    id: "Khai",
    content: "ei bro!",
    timestamp: "20:11"
  },
  {
    id: "Bro 1",
    content: "Chào bạn! Hôm nay trời đẹp thật đấy! 😊 Quả thật là thời tiết tuyệt vời để ra ngoài chơi thể thao. Đúng là đi đá bóng vào ngày như thế này sẽ rất tuyệt, không quá nóng cũng không quá lạnh. Bạn có kế hoạch chơi đá bóng ở đâu không?",
    timestamp: "20:12"
  },
  {
    id: "Bro 1",
    content: "M noi dung, bro!!",
    timestamp: "20:12"
  },
  {
    id: "Bro 1",
    content: "Chào bạn! Hôm nay trời đẹp thật đấy! 😊 Quả thật là thời tiết tuyệt vời để ra ngoài chơi thể thao. Đúng là đi đá bóng vào ngày như thế này sẽ rất tuyệt, không quá nóng cũng không quá lạnh. Bạn có kế hoạch chơi đá bóng ở đâu không?",
    timestamp: "20:12"
  }
]},
{id: 1, content: [
  {
    id: "Khai",
    content: "ei bro!",
    timestamp: "20:12"
  },
  {
    id: "Khai",
    content: "Danh lien minh k bro?",
    timestamp: "20:12"
  },
  {
    id: "Bro 2",
    content: "oke bro!!",
    timestamp: "20:12"
  },
  {
    id: "Bro 2",
    content: "oke bro!!",
    timestamp: "20:12"
  }
]}
];

function MessageCell() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <View style={styles.headerContainerLeft}>
        <AntDesign name="left" style={styles.headerContainerLeftIcon} />
        <Image source={require('@/assets/images/FB_IMG_1725192745457.jpg')} style={styles.headerContainerLeftImage} />
        <View style={styles.headerContainerLeftTextContainer}>
          <Text style={styles.headerContainerLeftTextName}>{messages[Number(id)].content[messages[Number(id)].content.length - 1].id}</Text>
          <Text style={styles.headerContainerLeftTextId}>{messages[Number(id)].content[messages[Number(id)].content.length - 1].id + " - " + Number(id)}</Text>
        </View>
      </View>
      <Entypo name="dots-three-vertical" style={styles.headerLogoRight} />
      </View>
      <ScrollView   
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {messages[Number(id)].content.map((item, index) => (
          <View key={index} style={item.id !== "Khai" ? styles.friendContainer : styles.selfContainer}>
            <Text style={item.id !== "Khai" ? styles.friend : styles.self}>
              {item.content}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputTextContainer}>
        <TextInput placeholder='Sent message...' style={styles.inputText} placeholderTextColor="white"  multiline={true}/>
        <TouchableOpacity onPress={() => console.log("oke")}>
          <AntDesign name="hearto" style={styles.inputTextIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "3%",
    paddingVertical: "6%",
    alignItems: "center"
  },
  headerContainerLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContainerLeftIcon: {
    color: "white",
    fontSize: 30,
    fontWeight: "500",
    marginRight: 10
  },
  headerContainerLeftImage: {
    width: width * 0.13,
    height: width * 0.13,
    borderColor: "#8E8C8C",
    borderWidth: 4,
    borderRadius: 100,
    marginRight: 10
  },
  headerContainerLeftTextContainer: {
    justifyContent: "flex-start"
  },
  headerContainerLeftTextName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700"
  },
  headerContainerLeftTextId: {
    color: "white",
    fontSize: 10,
    fontWeight: "100"
  },
  headerLogoRight: {
    color: "white",
    fontSize: 25,
    fontWeight: "500"
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column-reverse', 
    paddingBottom: "5%"
  },
  scrollContent: {
    flexGrow: 1, 
    justifyContent: 'flex-end', 
    paddingHorizontal: "3%",
  },
  friendContainer: {
    alignItems: "flex-start",
    marginBottom: 10, 
  },
  selfContainer: {
    alignItems: "flex-end",
    marginBottom: 10, 
  },
  friend: {
    color: "white",  
    padding: 10,
    backgroundColor: "#4C4C4C", 
    borderRadius: 10,
    flexWrap: "wrap", 
    maxWidth: "80%",
    fontWeight: "600"
  },
  self: {
    color: "black",  
    padding: 10,
    backgroundColor: "#D9D9D9", 
    borderRadius: 10,
    flexWrap: "wrap", 
    maxWidth: "80%",
    fontWeight: "600"
  },
  inputTextContainer: {
    height: "8%",                   
    flexDirection: "row",           
    alignItems: "center",           
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#4C4C4C",        
    borderRadius: 30,
    marginBottom: 10
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
});

export default MessageCell;
