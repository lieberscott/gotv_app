// x (sorta) - on GiftedChat, need to distinguish between people in the conversation
// x - on MapPage, red pins for new voters without conversations started yet, blue if they've already started a conversation
// x - on MapPage, allow zooming in and out at appropriate distances
// upon Map move, re-read the database (and re-draw the pins) given the new center position of the map
// function to delete old messages so document doesn't exceed 1mb
// you need to delete your campaign users and re-register them to allow the changes above (specifically the different color pins) to be applied, given how the new code saves and then reads the campaign user object

import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import * as firebase from 'firebase';

import { AppLoading } from 'expo';
import Navigator from './routes/drawer';
import CampaignNavigator from './routes/campaignDrawer';
import TabNavigator from './routes/tabs';
import LoadingScreen from './screens/LoadingScreen';
import { StoreContext } from "./contexts/storeContext.js";

const firebaseConfig = {
    apiKey: "AIzaSyDJ5t2aZhaXka4djV0aWVW8k2JZg5tVm_E",
    authDomain: "other-side-app-69d00.firebaseapp.com",
    databaseURL: "https://other-side-app-69d00.firebaseio.com",
    projectId: "other-side-app-69d00",
    // storageBucket: "other-side-app-69d00.appspot.com",
    // messagingSenderId: "1098826575801",
    appId: "1:1098826575801:web:8c16aae9542383c8085068",
    // measurementId: "G-H8QWR5WJRL"
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

  const getUser = (u) => {
    console.log("get user called : ");
    setUser(u);
  }

  if (loaded) {
    console.log("admin : ", admin);
    return (
      <View style={{ flex: 1 }}>
        <StoreContext.Provider value={{
          user,
          getUser
        }}>
          <AppNavigator />
        </StoreContext.Provider>
      </View>
    );
  }

  else {
    return (
      <AppLoading
        startAsync={ getFonts }
        onFinish={() => setLoaded(true) }
      />
    )
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: TabNavigator,
  CampaignStack: CampaignNavigator,
  VoterStack: Navigator
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%"
  }
});
