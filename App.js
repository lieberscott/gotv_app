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
import MapPage from './screens/MapPage';
import { UserContext } from "./contexts/userContext.js";

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
        <UserContext.Provider value={{
          user,
          getUser
        }}>
          <AppNavigator />
        </UserContext.Provider>
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
