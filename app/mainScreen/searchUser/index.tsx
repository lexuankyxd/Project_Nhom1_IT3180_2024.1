import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, ScrollView, Image, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width, height } = Dimensions.get("window");

const userFound = [
  {
    "index": 1,
    "image": require("@/assets/images/laserEye.jpg"),
    "name": "Tran Manh Hung",
    "id": "@tranmanhhung"
  },
  {
    "index": 2,
    "image": require("@/assets/images/laserEye.jpg"),
    "name": "Tran Manh Hung",
    "id": "@tranmanhhung"
  },
  {
    "index": 3,
    "image": require("@/assets/images/laserEye.jpg"),
    "name": "Tran Manh Hung",
    "id": "@tranmanhhung"
  }
];

function SearchUser() {
  const [idUserSearch, setIdUserSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Change this by API');
    }, 1000); 

    return () => clearTimeout(timer);
  }, [idUserSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <AntDesign name="left" size={24} color="white" />
        <View style={styles.inputTextContainer}>
          <TextInput
            style={styles.inputText}
            placeholder='Search'
            placeholderTextColor="white"
            multiline={false}
            value={idUserSearch}
            onChangeText={setIdUserSearch}
          />
        </View>
      </View>
      <ScrollView>
        {userFound.map((user) => (
          <View key={user.index} style={styles.userItem}>
            <Image source={user.image} style={styles.imageIcon} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.id}>{user.id}</Text>  
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.03,
    paddingTop: height * 0.03,
  },
  inputTextContainer: {
    width: width * 0.85,
    height: height * 0.06,
    marginLeft: width * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4C4C4C',
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  inputText: {
    flex: 1,
    height: "100%",
    borderRadius: 30,
    backgroundColor: "#4C4C4C",
    color: 'white',
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  imageIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  id: {
    color: '#bbb',
    fontSize: 14,
  }
});

export default SearchUser;
