import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, TextInput, Alert } from 'react-native';
import firebase from 'firebase';

const CampaignLogin = (props) => {

  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = () => {
    console.log("onpresshandler");
    firebase.auth().signInWithEmailAndPassword(values.email.toLowerCase(), values.password)
    .then((cred) => {
      console.log("cred.user : ", cred.user);
    }).
    catch((err) => {
      console.log("Err : ", err);
      Alert.alert(err);
    })
  }

  return (
    <View style={{ marginVertical: 50 }}>
      <TextInput type="text" onChangeText={e => setValues({...values, email: e }) } placeholder="your email" name="email" required>{ values.email }</TextInput>
      <TextInput type="password" onChangeText={e => setValues({...values, password: e }) } placeholder="password" name="password" required>{ values.password }</TextInput>
      <Button onPress={ handleSubmit } title="Submit" />
    </View>
  )
}

export default CampaignLogin;
