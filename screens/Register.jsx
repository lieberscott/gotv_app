import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import firebase from 'firebase';
import firestore from 'firebase/firestore';
import geohash from 'ngeohash';

import { Ionicons } from '@expo/vector-icons';
import { StoreContext } from "../contexts/storeContext.js";

const Register = ({navigation}) => {

  const [values, setValues] = useState({
    candidatefirst: "",
    candidatelast: "",
    office: "",
    publicname: "",
    zipcode: "",
    website: "",
    email: "",
    password: "",
    password2: "",
    userfirst: "",
    userlast: ""
  });
  const [step, setStep] = useState(1);
  const [primary, setPrimary] = useState(false);
  const store = useContext(StoreContext);

  const handleRegister = () => {
    console.log("handleRegister2");

    if (values.website == "" || values.email == "" || values.password == "" || values.userfirst == "" || values.userlast == "") {
      Alert.alert("Please fill in each box before continuing");
    }

    else if (values.password != values.password2) {
      Alert.alert("Passwords do not match");
    }

    else if (values.password && values.password.length < 8) {
      Alert.alert("Password must be at least 8 characters");
    }
    else {
      firebase.auth().createUserWithEmailAndPassword(values.email.toLowerCase(), values.password)
      .then((result) => {
        let uid = result.user.uid;
        if (result.additionalUserInfo.isNewUser) {
          console.log("is new userr : ", uid);
          fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + values.zipcode + "&key=AIzaSyBDHMpWOZmEbIGaxC8iNPMBWIGOQgbOl38")
          .then((res) => res.json())
          .then((json) => {
            console.log("json.results[0].geometry.location : ", json.results[0].geometry.location);
            const lat = json.results[0].geometry.location.lat;
            const lng = json.results[0].geometry.location.lng;
            const hash = geohash.encode(lat, lng);
            console.log("hash : ", hash);
            let obj = {
              uid,
              campaign_verified: false, // manually ensuring campaign is legit
              campaign_id: "", // manually entering a campaign_id to match with other candidates in the same race
              office: values.office, // manually entering the level "State Representative", "County Judge, etc. so voter knows what level they're dealing with
              website: values.website,
              candidate_first: values.candidatefirst,
              candidate_last: values.candidatelast,
              public_name: values.publicname,
              zip_code: values.zipcode,
              lat,
              lng,
              geohash: hash,
              primary: primary,
              user_first: values.userfirst,
              user_last: values.userlast,
              voter_ids_of_convos: {},
              email_verified: false,
              created_at: Date.now(),
              admin: true,
              paid: false,
              profile_picture: "",
              last_logged_in: Date.now()
            }
            firebase.firestore().collection("campaigns").doc(uid)
            .set(obj)
            .then(() => {
              // hacky. LoadingScreen page calls onAuthStateChanged (which calls getUser) when createUserWithEmailAndPassword is called
              // this is before user can be saved in firestore. So upon registration, LoadingPage calls onAuthStateChanged, user hasn't been saved in Firestore yet so it is undefined
              // so I set it here. It doesn't come from firestore, I just set it with the object I saved in Firestore above
              store.getUser(obj);
            })
          })
        }
        else {
          Alert.alert("You have already registered. Please go to the login page to log in.")
          return firebase.auth.signOut();
        }
      })
      .catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log("errror : ", error);
      });
    }
    // send data by email to myself
    // send data to firebase
    // you have to confirm it's a real website and then send an email to the email address provided ideally via firebase
  }

  const handleReturnToHomePage = () => {
    navigation.navigate("Login");
  }

  const handleChange = (value, name) => {
    value.persist();
    setValues((values) => ({ ...values, [name]: value.nativeEvent.text }));
  }

  const handleNext = () => {
    console.log("handleNexxt");
    setStep(2);
    // if (values.candidatefirst == "" || values.candidatelast == "" || values.publicname == "" || values.zipcode == "") {
    //   Alert.alert("Please fill in each box before continuing");
    // }
    // else {
    //   setStep(2);
    // }
  }

  const handlePrev = () => {
    setStep(1);
  }

  const handlePrimary = (e) => {
    setPrimary(!primary);

  }

  switch(step) {
    case 1:
      return (
        <View style={ styles.container }>
          <Text>Regsiter as a campaign</Text>
          <Text>Campaign Website</Text>
          <TextInput style={ styles.inputStyle } type="text" placeholder="campaign website" name="website" onChange={ e => handleChange(e,'website') } required>{ values.website }</TextInput>
          <TextInput style={ styles.inputStyle } type="text" placeholder="candidate first" onChange={ e => handleChange(e, 'candidatefirst') } name="candidatefirst" required>{ values.candidatefirst }</TextInput>
          <TextInput style={ styles.inputStyle } type="text" placeholder="candidatelast" name="candidatelast" onChange={ e => handleChange(e, 'candidatelast') } required>{ values.candidatelast }</TextInput>
          <TextInput style={ styles.inputStyle } type="text" placeholder="office seeking, e.g. 'County Judge, State Rep., etc.'" name="office" onChange={ e => handleChange(e, 'office') } required>{ values.office }</TextInput>
          <TextInput style={ styles.inputStyle } type="text" placeholder="public name, e.g. 'My Candidate for Congress'" name="publicname" onChange={ e => handleChange(e, 'publicname') } required>{ values.publicname }</TextInput>
          <TextInput style={ styles.inputStyle } type="text" placeholder="zip code" name="zipcode" keyboardType="numeric" onChange={ e => handleChange(e, 'zipcode') } required>{ values.zipcode }</TextInput>
          <Text>Primary: </Text><Ionicons name={ primary ? "md-checkbox-outline" : "md-square-outline" } size={32} color="green" onPress={ handlePrimary }/>
          <Ionicons name="ios-arrow-dropright" size={32} color="green" onPress={ handleNext }/>
        </View>
      );

    case 2:
      return (
        <View style={ styles.container }>
          <Text>Regsiter as a campaign</Text>
          <Text>Campaign Website</Text>
          <TextInput style={ styles.inputStyle } type="text" placeholder="your email" name="email" onChange={ e => handleChange(e, 'email') } required>{ values.email }</TextInput>
          <Text>Email must be a campaign email address</Text>
          <TextInput style={ styles.inputStyle } secureTextEntry={ true } type="password" placeholder="password" name="password" onChange={ e => handleChange(e, 'password') } required>{ values.password }</TextInput>
          <TextInput style={ styles.inputStyle } secureTextEntry={ true } type="password" placeholder="password2" name="password2" onChange={ e => handleChange(e, 'password2') } required>{ values.password2 }</TextInput>
          <TextInput style={ styles.inputStyle } type="text" placeholder="your first name" name="userfirst" onChange={ e => handleChange(e, 'userfirst') } required>{ values.userfirst }</TextInput>
          <TextInput style={ styles.inputStyle } type="text" placeholder="your last name" name="userlast" onChange={ e => handleChange(e, 'userlast') } required>{ values.userlast }</TextInput>
          <Button onPress={ handleRegister } title="register" />
          <Ionicons name="ios-arrow-dropleft" size={32} color="green" onPress={ handlePrev }/>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: "100%",
    marginHorizontal: 50,
    marginVertical: 50
  },
  formLabel: {
    fontSize: 20,
    color: '#fff',
  },
  inputStyle: {
    marginTop: 20,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#DCDCDC',
    flexDirection: "row"
  },
  formText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
  }
});

export default Register;
