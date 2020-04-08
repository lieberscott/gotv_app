import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, Alert } from 'react-native';

import firebase from 'firebase';

import Conversation from './Conversation';

const ConversationInfiniteScroll = ({ navigation }) => {
  const [error, setError] = useState(false);
  const [conversations, setConversations] = useState([{
    createdAt: Date.now(),
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
    }],
    voter_id: "Scott",
    campaign_ids: ["Brad", "Dubbo"],
    read_by: ["Brad"],
    date_of_last_message: Date.now()
  }]);
  const [refreshing, setRefreshing] = useState(false);
  const user = "Use context";

  // useEffect(() => {
  const x = () => {
    console.log("Conversation screen");
    firebase.datebase().collection("conversations").where("voter_id", "==", user.uid).orderBy("createdAt").get()
    .then((snapshot) => {
      if (snapshot.empty) {
        Alert.alert("No conversations yet");
        return;
      }
      let c = [];
      snapshot.forEach((doc) => {
        c.push(doc);
      });
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
        keyExtractor={ (item, key) => item.createdAt }
        data={conversations}
        renderItem={({ item }) => {
          const x = "Hello";
          return (
            <TouchableOpacity style={{ borderBottomColor: "black", borderBottomWidth: 1 }} onPress={ () => navigation.navigate("Home", { x, voter: "voter data", token: "some token" }) }>
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
