import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';

import Conversation from './Conversation';

const CampaignConversationInfiniteScroll = ({ navigation }) => {
  const [error, setError] = useState(false);
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    console.log("Conversation screen");
  }, []);

  return (
    <Conversation />
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
