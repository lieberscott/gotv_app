import React, { useEffect, useContext } from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import firebase from 'firebase';
import firestore from 'firebase/firestore';
import { UserContext } from "../contexts/userContext.js";

const LoadingScreen = ({ navigation }) => {

  const state = useContext(UserContext);

  useEffect(() => {
    console.log("check if Logged In");
    firebase.auth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged");
      if (user != null) {
        console.log("user != null");
        if (user.providerData[0].providerId == "facebook.com") {
          firebase.firestore().collection("voters").doc(user.uid).get()
          .then((snapshot) => {
            if (snapshot.exists) {
              const u = snapshot.data();
              console.log("u : ", u);
              state.getUser(u);
              navigation.navigate("VoterStack");
            } else {
              console.log('document not found');
            }
          })
          .catch((err) => {
            console.log("err : ", err);
            Alert.alert(err);
          });
        }
        else {
          console.log("here 1");
          firebase.firestore().collection("campaigns").doc(user.uid).get()
          .then((snapshot) => {
            console.log("here 2");
            const u = snapshot.data();
            console.log("u : ", u);
            state.getUser(u);
            navigation.navigate("CampaignStack");
          })
          .catch((err) => {
            console.log("err : ", err);
            Alert.alert(err);
          })
        }
      }
      else {
        console.log("user == null");
        navigation.navigate("LoginScreen");
        state.getUser({});
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
