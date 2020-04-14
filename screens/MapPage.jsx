import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import geohash from 'ngeohash';

import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

import { StoreContext } from "../contexts/storeContext.js";

const MapPage = ({ navigation }) => {

  const [pins_arr, setPins_arr] = useState([]);
  const [first, setFirst] = useState(true);
  const latDelta = 0.05;
  const lngDelta = 0.05;
  const store = useContext(StoreContext);
  console.log("store : ", store);

  const getGeohashRange = ( latitude, longitude, distance) => {
    const lat = 0.0144927536231884; // degrees latitude per mile
    const lon = 0.0181818181818182; // degrees longitude per mile
    const lowerLat = latitude - lat * distance;
    const lowerLon = longitude - lon * distance;
    const upperLat = latitude + lat * distance;
    const upperLon = longitude + lon * distance;
    const lower = geohash.encode(lowerLat, lowerLon);
    const upper = geohash.encode(upperLat, upperLon);

    return { lower, upper };
  };

  useEffect(() => {
    console.log("useEffect Map! user : ");
    if (first) {
      getPins();
    }
  }, [pins_arr])

  const getPins = () => {
    const userLat = store.user.lat;
    const userLng = store.user.lng;
    const range = getGeohashRange(userLat, userLng, 10);

    console.log("range : ");

    firebase.firestore().collection("voters")
    .orderBy("geohash")
    .where("geohash", ">=", range.lower)
    .where("geohash", "<=", range.upper)
    .get()
    .then((docs) => {
      if (docs.empty) {
        console.log('No such document!');
      }
      else {
        let arr = [];
        docs.forEach((doc) => {
          const x = doc.data();
          arr.push(x);
        })
        setFirst(false);
        setPins_arr(arr);
      }
    })
  }

  const handlePress = (v) => {
    console.log("handlePress");
    console.log("v : ", v);
    console.log("store.user : ", store.user);
    let initiating = false; // initiating conversation? will check below

    // conversation_id = campaign_id (which is the same for all campaigns in the same race) + "-" + voter_id
    // this way you can always check if the document already exists before creating it
    const newConvoId = store.user.campaign_id + "-" + v.uid;
    const obj = {
      conversation_id: newConvoId,
      voter_id: v.uid,
      voter_name: v.firstname,
      voter_address: v.voting_address,
      [store.user.uid]: true,
      participant_info: [{
        _id: v.uid,
        name: v.firstname,
        public_name: v.firstname,
        campaign: false,
        avatar: 'https://placeimg.com/140/140/any'
      },
    {
      _id: store.user.uid,
      name: store.user.user_first,
      public_name: store.user.public_name,
      campaign: true,
      avatar: 'https://placeimg.com/140/140/any'
    }],
    currently_leaning_toward: "Undecided",
    read_by: [{
      [v.uid]: false,
      [store.user.uid]: false
    }],
    date_of_last_message: Date.now()
    }

    // console.log("obj : ", obj);
    firebase.firestore().collection("conversations").doc(newConvoId).get().then((snapshot) => {
      if (!snapshot.exists) {
        console.log("!snapshot.exists");
        initiating = true;
        return firebase.firestore().collection("conversations").doc(newConvoId).set(obj)
      }
    })
    .then(() => { // ref is conversation_id
      console.log("navigation.navigate(Conversation)");
      navigation.navigate("Conversation", { conversation_id: newConvoId, name: v.firstname, address: v.address, initiating });
    })
    .catch((err) => {
      console.log("Err : ", err);
    });
  }

  return (
    <View style={ styles.container }>
      <MapView style={ styles.mapStyle } region={{ latitude: store.user.lat, longitude: store.user.lng, latitudeDelta: latDelta, longitudeDelta: lngDelta }} >
        { pins_arr.length ?  pins_arr.map((pin, i) => {
          return (<Marker key={ "pin" + i } coordinate={{ latitude: pin.lat, longitude: pin.lng }}>
            <Callout onPress={ () => handlePress(pin) }>
              <Text>{ pin.firstname }</Text>
              <Text>{ pin.voting_address }</Text>
              <TouchableOpacity>
                <Button title="Go to Conversation" />
              </TouchableOpacity>
            </Callout>
          </Marker> )
        }) : <Text>""</Text> }
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapPage;
