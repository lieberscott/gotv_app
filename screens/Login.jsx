import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase';

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
        console.log("token : ", token);
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);

        console.log("response : ", JSON.stringify(response));
        // Build Firebase credential with the Facebook access token.
        let credential = firebase.auth.FacebookAuthProvider.credential(token);
        console.log("credential : ", credential);
        // Sign in with credential from the Fb user.
        firebase.auth().signInWithCredential(credential)
        .then((result) => {
          console.log("result : ", result);
          if (result.additionalUserInfo.isNewUser) {
            firebase.database().ref("/voters/" + result.user.uid)
            .set({
              email: result.user.email,
              profile_picture: result.additionalUserInfo.profile.picture,
              firstname: result.additionalUserInfo.profile.given_name,
              admin: false,
              created_at: Date.now(),
              last_logged_in: Date.now()
              // to be added by voter on config page
              // voting_address, address_last_updated,convos_arr, will_vote_for(if doable)
            })
          }
          else {
            firebase.database().ref("/voters/" + result.user.uid)
            .update({
              last_logged_in: Date.now()
            });
          }

        })
        // .then(() => checkIfLoggedIn())
        .catch((error) => {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          // The email of the user's account used.
          let email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential;
          // ....
        });


        Alert.alert('Logged in!!', `Hi ${(await response.json()).name}!`);
        // checkIfLoggedIn();
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
