import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as firebase from 'firebase';
// import 'firebase/firestore';
import * as Facebook from 'expo-facebook';
import { Ionicons } from '@expo/vector-icons';

import { AppLoading } from 'expo';
import Navigator from './routes/drawer';
import Login from './screens/Login';
import CampaignLogin from './screens/CampaignLogin';
import Register from './screens/Register';
import MapPage from './screens/MapPage';
import { UserContext } from "./contexts/userContext.js";


import Home from './screens/Home';

const firebaseConfig = {
    apiKey: "AIzaSyDJ5t2aZhaXka4djV0aWVW8k2JZg5tVm_E",
    authDomain: "other-side-app-69d00.firebaseapp.com",
    databaseURL: "https://other-side-app-69d00.firebaseio.com",
    projectId: "other-side-app-69d00",
    storageBucket: "other-side-app-69d00.appspot.com",
    messagingSenderId: "1098826575801",
    appId: "1:1098826575801:web:8c16aae9542383c8085068",
    measurementId: "G-H8QWR5WJRL"
  };
if (firebase.apps.length < 1) {
  firebase.initializeApp(firebaseConfig);
}

const getFonts = () => {
  console.log("get fonts");
}

export default function App() {

  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState({});

  // useEffect(() => checkIfLoggedIn, []);

  const checkIfLoggedIn = () => {
    console.log("check if Logged In");
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("user != null");
        firebase.database().ref("campaigns/" + user.uid).once('value').then((doc) => {
          const u = doc.val();
          setAdmin(u.admin);
          setLoggedIn(true);
          setUser(u);
        });
      }
      else {
        console.log("user == null");
        setAdmin(false);
        setLoggedIn(false);
        setUser({});
      }
    });
  }

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

  if (loaded) {
    console.log("admin : ", admin);
    return (
      <View style={{ flex: 1 }}>
        <UserContext.Provider value={ user }>
          { loggedIn ? admin ? <MapPage /> : <Navigator /> : <NavigationContainer><MyTabs /></NavigationContainer> }
        </UserContext.Provider>
      </View>
    );
  }

  else {
    return (
      <AppLoading
        startAsync={ checkIfLoggedIn }
        onFinish={() => setLoaded(true) }
      />
    )
  }
}

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Voter Login') {
            iconName = 'ios-open';
          }
          else if (route.name === 'Campaign Login') {
            iconName = 'ios-log-in';
          }
          else if (route.name === 'Campaign Register') {
            iconName = 'ios-clipboard';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
    }}>
      <Tab.Screen name="Voter Login" component={Login} />
      <Tab.Screen name="Campaign Login" component={CampaignLogin} />
      <Tab.Screen name="Campaign Register" component={Register} />
    </Tab.Navigator>
  );
}

// const AppNavigator = createAppContainer(AppTabNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%"
  }
});
