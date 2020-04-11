import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, TextInput } from 'react-native';

import firebase from 'firebase';
import firestore from 'firebase/firestore';
import geohash from 'ngeohash';
import { UserContext } from "../contexts/userContext.js";

const Config = () => {

  const [address, setAddress] = useState("");
  const user = useContext(UserContext);

  const handleChangeAddress = () => {

    if (address == "") {
      Alert.alert("No address entered.");
      return;
    }
    else {
      fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBDHMpWOZmEbIGaxC8iNPMBWIGOQgbOl38")
      .then((res) => res.json())
      .then((json) => {
        console.log("json.results[0].geometry.location : ", json.results[0].geometry.location);
        const lat = json.results[0].geometry.location.lat;
        const lng = json.results[0].geometry.location.lng;
        const hash = geohash.encode(lat, lng);
        return firebase.firestore().collection("voters").doc(user.user.uid)
        .set({ voting_address: address, lat, lng, geohash: hash });
      })
      .then(() => {
        setAddress("");
        Alert.alert("Address updated");
      })
      .catch((err) => {
        Alert.alert(err);
      })
    }
  }

  const deletePress = () => {
    Alert.alert("Are you sure you want to delete your account?", "This can not be undone", [
      { text: "Yes, continue", onPress: () => handleDelete() },
      { text: "No, keep my account", onPress: () => console.log("canceled") }
    ]);

  }

  const handleDelete = () => {
    firebase.auth().currentUser().delete().then(() => {
      return firebase.database().collection("voters").doc(user.user.uid).delete();
    })
    .then(() => {
      return firebase.auth().signOut();
    })
    .then(() => {
      Alert.alert("Your account has been deleted.");
    })
    .catch((err) => {
      Alert.alert(err);
    })

  }

  const handleTextChange = (e) => {
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
