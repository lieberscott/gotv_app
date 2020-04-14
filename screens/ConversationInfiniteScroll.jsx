import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, Alert } from 'react-native';

import firebase from 'firebase';

import Conversation from './Conversation';
import { StoreContext } from "../contexts/storeContext.js";

const ConversationInfiniteScroll = ({ navigation }) => {
  const [error, setError] = useState(false);
  const [conversations, setConversations] = useState([{
    createdAt: Date.now(),
    voter_id: "Scott32124",
    participant_ids: [12345, 1234, "Scott32124"],
    participant_info: [{
      _id: 12345,
      name: "Brad",
      public_name: "Negron for 47",
      campaign: true,
      avatar: "google.com.jpg"
    },
    {
      _id: 1234,
      name: "Dubbo",
      public_name: "Martin for 47",
      campaign: true,
      avatar: "facebook.com.img"
    },
    {
      _id: "Scott32124",
      public_name: "Scott",
      name: "Scott",
      campaign: false,
      avatar: "site.com.jpg"
    }],
    currently_leaning_toward: "Undecided",
    read_by: [1234], // which participants this conversation has been read by (for blue dot placement)
    date_of_last_message: Date.now(),
    messages: [{
      content: "What's up with your shit fuckbag?",
      createdAt: Date.now() - 15000,
      sender: "Scott"
    },
    {
      content: "Nothing much",
      createdAt: Date.now() - 10000,
      sender: "Brad"
    },
    {
      content: "Me neither",
      createdAt: Date.now() - 5000,
      sender: "Dubbo"
    }]
  }]);
  const [refreshing, setRefreshing] = useState(false);
  const store = useContext(StoreContext);

  // useEffect(() => {
  const x = () => {
    console.log("Conversation screen");
    firebase.firestore().collection("conversations").where("voter_id", "==", user.user.uid).orderBy("createdAt").get()
    .then((snapshot) => {
      if (snapshot.empty) {
        Alert.alert("No conversations yet");
        return;
      }
      const data = snapshot.docs[0].data();
      console.log("data : ", data);
      let c = [];
      // data.forEach((doc) => {
      //   c.push(doc);
      // });
      setConversations(c);

    })
    .catch((err) => {
      console.log("Err : ", err);
      Alert.alert(err)
    })
  }
  // }, []);

  const handleRefresh = () => {
    console.log("handleRefresh");
    // setRefreshing(true);
  }

  return (
    <View>
      <Text>Conversation Infinite Scroll</Text>
      <FlatList
        keyExtractor={ (item, key) => item.createdAt.toString() }
        data={conversations}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={{ borderBottomColor: "black", borderBottomWidth: 1 }} onPress={ () => navigation.navigate("Conversation", { item }) }>
              <Text>{ item.read_by.includes(user.uid) ? "" : "Blue dot" }</Text>
              <Text>{ item.messages[0].sender }</Text>
              <Text>{ item.messages.length ? item.messages[0].content.slice(0, 20) + "..." : "" }</Text>
              <Text>{ item.date_of_last_message }</Text>
            </TouchableOpacity>
          )
        }}
        refreshing={ refreshing }
        onRefresh={ handleRefresh }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "80%",
    marginVertical: 8
  },
  view: {
    flex: 1,
    height: "100%",
    marginVertical: 50
  }
});

export default ConversationInfiniteScroll;
