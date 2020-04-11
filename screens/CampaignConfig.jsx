import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, TextInput } from 'react-native';

const Config = () => {

  const [publicName, setPublicName] = useState("");

  const handleReset = () => {
    
  }

  const handleChange = () => {

    if (address == "") {
      Alert.alert("No public name entered");
      return;
    }

    // fetch /requestreseet
    fetch("https://negron.glitch.me/changepublicname", {
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
      <Text>To change your password, click the button below. You will receive an email with a link to change your password.</Text>
      <TextInput type="text" name="address" placeholder="enter your public name here" onTextChange={ handleTextChange} value={ publicName } />
      <TouchableOpacity style={ styles.button }>
        <Button color="teal" onPress={ handleReset } title="Change voting address" />
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
