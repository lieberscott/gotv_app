import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import firestore from 'firebase/firestore';

const Login = (props) => {

  const handleLogin = async () => {
    try {
      await Facebook.initializeAsync('263269074685984', 'other_side_app');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        console.log("token : ");
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);

        console.log("response : ");
        // Build Firebase credential with the Facebook access token.
        let credential = firebase.auth.FacebookAuthProvider.credential(token);
        console.log("credential : ");
        // Sign in with credential from the Fb user.
        firebase.auth().signInWithCredential(credential)
        .then((result) => {
          console.log("result : ");
          if (result.additionalUserInfo.isNewUser) {
            console.log("result.additionalUserInfo : ", result.additionalUserInfo);
            firebase.firestore().collection("voters").doc(result.user.uid)
            .set({
              // email: result.user.email,
              uid: result.user.uid,
              profile_picture: result.additionalUserInfo.profile.picture.data.url,
              firstname: result.additionalUserInfo.profile.first_name || "",
              admin: false,
              created_at: Date.now(),
              last_logged_in: Date.now()
              // to be added by voter on config page
              // voting_address, address_last_updated,convos_arr, will_vote_for(if doable)
            })
            .catch((err) => {
              console.log("err : ", err);
              Alert.alert(err);
            })
          }
          else {
            firebase.firestore().collection("voters").doc(result.user.uid)
            .set({
              last_logged_in: Date.now()
            })
            .catch((err) => {
              console.log("err2 : ", err);
              Alert.alert(err);
            })
          }

        })
        .catch((error) => {
          console.log("error : ", error);
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          // The email of the user's account used.
          let email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential;
          // ....
        });

        console.log("pre alert");
        Alert.alert('Logged in!!', `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    }
    catch ({ message }) {
      Alert.alert(`Facebook Login Error: ${message}`);
    }
  }

  return (
    <View style={{ marginVertical: 50 }}>
      <TouchableOpacity>
        <Button onPress={ handleLogin } title="Facebook Login" />
      </TouchableOpacity>
    </View>
  )
}

export default Login;
