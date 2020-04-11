import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat'
import { UserContext } from "../contexts/userContext.js";
import firebase from 'firebase';

const Conversation = (props) => {
  const [error, setError] = useState(false);
  // const [messages, setMessages] = useState(props.item.messages);
  const [messages, setMessages] = useState([{
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
    }
  ]);
  const user = useContext(UserContext);
  // const conversationId = props.item._id;
  const conversationId = "123456";

  useEffect(() => {
    console.log("Conversation screen");
  }, [])

  const onSend = (newMessage = []) => {

    firebase.database().collection("conversations").doc(conversationId).update({
      messages: FieldValue.arrayUnion(newMessage)
    })
    .then(() => {
      setMessages(GiftedChat.append(messages, newMessage));
    })
    .catch((err) => {
      Alert.alert(err);
      console.log("err : ", err);
    })
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => onSend(newMessage)}
      user={{
        _id: 1,
      }}
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
