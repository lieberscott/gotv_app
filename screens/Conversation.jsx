import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Alert } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat'
import { StoreContext } from "../contexts/storeContext.js";
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const Conversation = ({ navigation }) => {
  const [error, setError] = useState(false);
  // const [messages, setMessages] = useState(props.item.messages);
  const [messages, setMessages] = useState([]);
  const store = useContext(StoreContext);
  const conversation_id = navigation.getParam("conversation_id");
  const initiating = navigation.getParam("initiating");
  console.log("conversation!");
  // console.log("conversation_id : ", conversation_id);
  // console.log("navigation : ", navigation);

  useEffect(() => {
    firebase.database().ref("conversations/" + conversation_id).on("value", (snapshot) => {
      console.log("snapshot, conversation_id : ", conversation_id);
      if (messages.length == 0) {
        let data = snapshot.val();
        if (data) {
          let keys = Object.keys(data);
          let len = keys.length;
          console.log("len : ", len);
          let arr = [];
          for (let i = len - 1; i >= 0; i--) {
            arr.push(data[keys[i]][0]);
          }
          console.log("arrr");
          setMessages(arr);
        }
      }
    });
  }, [])

  const onSend = (newMessage = []) => {
    console.log("new message");
    // newMessage[0].user.name = store.user.user_first + ", " + store.user.public_name;
    // newMessage[0].user.avatar = store.user.image;
    // newMessage[0].user.avatar = 'https://placeimg.com/140/140/any';
    firebase.database().ref("conversations/" + conversation_id)
    .push(newMessage)
    .then((doc1) => {
      console.log("made it 1");
      return firebase.firestore().collection("conversations").doc(conversation_id).update({
        date_of_last_message: Date.now(),
        last_message: newMessage[0].text
      });
    })
    .then((doc2) => {
      console.log("made it 2");
      // setMessages(GiftedChat.append(messages, newMessage));
    })
    .catch((err) => {
      Alert.alert(err);
      console.log("err : ", err);
    });
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => onSend(newMessage)}
      user={{
        _id: store.user.uid,
        name: store.user.user_first + ", " + store.user.public_name,
        avatar: store.user.profile_picture || 'https://ui-avatars.com/api/?background=d88413&color=FFF&name=${store.user.user_first}'
      }}
      isTyping={ true }
      maxInputLength={ 380 }
    />
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

export default Conversation;
