import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import firebase from 'firebase';

const LoadingScreen = ({ navigation }) => {

  useEffect(() => {
    console.log("check if Logged In");
    firebase.auth().onAuthStateChanged((user) => {
      console.log("user : ", user);
      if (user != null) {
        console.log("user != null");
        if (user.providerData[0].providerId == "facebook.com") {
          navigation.navigate("VoterStack");
          // firebase.database().ref("/voters/" + user.uid).once('value').then((doc) => {
          //   const u = doc.val();
          //   setAdmin(u.admin);
          //   setLoggedIn(true);
          //   setUser(u);
          //   navigation.navigate("VoterStack");
          // });
        }
        else {
          navigation.navigate("CampaignStack");
          // firebase.database().ref("campaigns/" + user.uid).once('value').then((doc) => {
          //   const u = doc.val();
          //   setAdmin(u.admin);
          //   setLoggedIn(true);
          //   setUser(u);
          //   navigation.navigate("CampaignStack");
          // });
        }
      }
      else {
        console.log("user == null");
        navigation.navigate("LoginScreen");
        // setAdmin(false);
        // setLoggedIn(false);
        // setUser({});
      }
    });
  }, []);

  return (
    <View>
      <Text>HellO</Text>
      <Text>HellO</Text>
      <Text>HellO</Text>
      <Text>HellO</Text>
      <Text>HellO</Text>
      <Text>HellO</Text>
      <Text>HellO</Text>
      <Text>HellO</Text>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default LoadingScreen;
