import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, Alert } from 'react-native';

import firebase from 'firebase';

import Conversation from './Conversation';
import { StoreContext } from "../contexts/storeContext.js";

const CampaignConversationInfiniteScroll = ({ navigation, initiateConversation, voter }) => {
  const [error, setError] = useState(false);
  const store = useContext(StoreContext);
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("CampaignConversationInfiniteScroll");
    getData();
  }, []);

  const getData = () => {
    firebase.firestore().collection("conversations")
    .where(store.user.uid, "==", true)
    // .orderBy("date_of_last_message")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("snapshot.empty");
        Alert.alert("No conversations yet");
        return;
      }
      console.log("not empty");
      let c = [];
      snapshot.forEach((doc) => {
        c.push(doc.data());
      });
      setConversations(c);
      setRefreshing(false);

    })
    .catch((err) => {
      console.log("Err : ", err);
      setRefreshing(false);
      Alert.alert(err);
    })
  }

  const handleRefresh = () => {
    console.log("handleRefresh");
    getData();
    setRefreshing(true);
  }

  return (
    <View>
      <Text>Conversation Infinite Scroll</Text>
      <TouchableOpacity>
        <Button title="Map View" onPress={ () => { navigation.navigate("MapPage") }} />
      </TouchableOpacity>
      <FlatList
        keyExtractor={ (item, key) => item.createdAt ? item.createdAt.toString() : key.toString() }
        data={conversations}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={{ borderBottomColor: "black", borderBottomWidth: 1 }} onPress={ () => navigation.navigate("Conversation", { name: item.voter_name, address: item.voter_address, conversation_id: item.conversation_id, initiating: false }) }>
              <Text>{ item.read_by.includes(store.user.uid) ? "" : "Blue dot" }</Text>
              <Text>{ item.voter_name }, { item.voter_address }</Text>
              <Text>{ item.last_message ? item.last_message.slice(0, 20) + "..." : "No messages yet" }</Text>
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

export default CampaignConversationInfiniteScroll;

// const [conversations, setConversations] = useState([{
//   createdAt: Date.now(),
//   voter_id: "Scott32124",
//   "12345": true,
//   "1234": true,
//   // campaign_ids: [12345, 1234, "Scott32124"],
//   participant_info: [{
//     _id: 12345,
//     name: "Brad",
//     public_name: "Negron for 47",
//     campaign: true,
//     avatar: "google.com.jpg"
//   },
//   {
//     _id: 1234,
//     name: "Dubbo",
//     public_name: "Martin for 47",
//     campaign: true,
//     avatar: "facebook.com.img"
//   },
//   {
//     _id: "Scott32124",
//     public_name: "Scott",
//     name: "Scott",
//     campaign: false,
//     avatar: "site.com.jpg"
//   }],
//   currently_leaning_toward: "Undecided",
//   read_by: [{
//     "1234": true,
//     "12345": false,
//     "Scott32124": false
//   }], // which participants this conversation has been read by (for blue dot placement)
//   date_of_last_message: Date.now(),
//   last_message: {
//     content: "What's up with your shit fuckbag?",
//     createdAt: Date.now() - 15000,
//     sender: "Scott"
//   }
// }]);
