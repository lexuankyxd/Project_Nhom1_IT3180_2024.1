import React from 'react'
import { View, StyleSheet, Text, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';

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

function sliceStringIfNeeded(input: string): string {
  const maxLength = 30;
  
  if (input.length > maxLength) {
    return input.slice(0, maxLength) + '...'; 
  }
  
  return input;
}

function MessageMainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" style={styles.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerText}>MESSAGE</Text>
        <AntDesign name="plus" style={styles.headerText} />
      </View>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/mainScreen/message/${item.id}`)}>
            <View style={styles.contentElementContainer}>
              <Image source={require('@/assets/images/FB_IMG_1725192745457.jpg')} style={styles.contentElementImage}/>
              <View >
                <Text style={styles.name}>{item.content[item.content.length - 1].id}</Text>
                <View style={styles.contentElementMessageContainer}>
                  <Text style={styles.contentElementMessageText}>{sliceStringIfNeeded(item.content[item.content.length - 1].content)}</Text>
                  <Text style={styles.contentElementMessageSeparator}> - </Text>
                  <Text style={styles.contentElementMessageTime}>{item.content[item.content.length - 1].timestamp}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        numColumns={1} 
        contentContainerStyle={styles.contentContainer}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.035
  },
  headerText: {
    color: "white",
    fontSize: 25,
    fontWeight: "900"
  },
  contentContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  contentElementContainer: {
    flexDirection: "row",
    marginBottom: "7%",
    alignItems: "center"
  },
  contentElementImage: {
    width: width * 0.21,
    height: width * 0.21,
    borderColor: "#8E8C8C",
    borderWidth: 4,
    borderRadius: 100,
    marginRight: "3%" 
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "700"

  },
  contentElementMessageContainer: {
    flexDirection: "row",
    alignContent: "center"
  },
  contentElementMessageText: {
    color: "white",
    fontWeight: "300",
    paddingRight: 5
  },
  contentElementMessageSeparator: {
    color: "#6B6B6B",
    fontWeight: "500",
    fontSize: 15,
    paddingRight: 5
  },
  contentElementMessageTime: {
    color: "#6B6B6B",
    fontWeight: "500",
    fontSize: 15,
  }
});


export default MessageMainScreen