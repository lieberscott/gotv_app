import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';

import firebase from 'firebase';

const CampaignHome = ({ navigation }) => {
  const [error, setError] = useState(false);
  const [addedAddress, setAddedAddress] = useState(false);
  const [conversations, setConversations] = useState(0);
  const [waitlistNumber, setWaitlistNumber] = useState(-1);
  const votingAddress = null;
  const admin = false;

  useEffect(() => {
    console.log("Home screen!");
  }, [])

  const handleWatch = () => {
    // go to watch page
    navigation.navigate("Watch");
  }

  const handleReport = () => {
    // go to report page
    navigation.navigate("Report");
  }

  const handleLogout = () => {
    console.log("sign out");
    firebase.auth().signOut();
  }

  return (
    <View style={ styles.view }>
      <Text>Campaign Home: Hello!</Text>
      { addedAddress ? <View><Text>Your voting address is { votingAddress }.</Text><Text>You have { conversations } conversations going right now.</Text></View>
        : <Text>Enter your voting address so the campaigns in that area can reach out to you.</Text>
      }
      <Button onPress={ handleLogout } title="sign out" />
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

export default CampaignHome;
