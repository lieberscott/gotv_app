import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, TextInput } from 'react-native';

import firebase from 'firebase';
import { UserContext } from "../contexts/userContext.js";

const Config = () => {

  const [address, setAddress] = useState("");
  const user = useContext(UserContext);

  const handleChangeAddress = () => {

    if (address == "") {
      Alert.alert("No address entered");
      return;
    }
    else {
      firebase.database().ref("/voters/" + user.user.uid)
      .update({
        voting_address: address
      });
    }

    // fetch /requestreseet
    fetch("https://negron.glitch.me/changeaddress", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gotv_token })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      Alert.alert("An email has been sent.");
      setAddress("");
    })
    .catch((err) => {
      console.log("Err : ", err);
      Alert.alert("Unable to send reset email. Please try again.");
      setAddress("");
    });
  }

  const handleDelete = () => {
    Alert.alert("Are you sure you want to delete your account? This can not be undone.");
    // fetch /deleteaccount
    fetch("http://localhost:3000/deleteaccount", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gotv_token })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      Alert.alert("Your account has been deleted.");
      getLogin(false);
    })
    .catch((err) => {
      console.log("Err : ", err);
      Alert.alert("Unable to delete account. Please try again.");
    });
  }

  const handleTextChange = (e) => {
    console.log("text change");
    setAddress(e);
  }

  return (
    <View style={ styles.view }>
      <Text>To become visible for local campaigns to see you, enter your voting address below.</Text>
      <TextInput type="text" name="address" placeholder="enter your voting address here" onChangeText={ handleTextChange} value={ address } />
      <TouchableOpacity style={ styles.button }>
        <Button color="teal" onPress={ handleChangeAddress } title="Change voting address" />
      </TouchableOpacity>
      <Text>Danger Zone</Text>
      <TouchableOpacity>
        <Button color="red" onPress={ handleDelete } title="Delete Account" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "80%",
    marginVertical: 8
  },
  view: {
    alignItems: "center",
    justifyContent: "center",
    height: "25%",
    marginHorizontal: 8
  }
});

export default Config;
