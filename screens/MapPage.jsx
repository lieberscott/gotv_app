import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import geohash from 'ngeohash';

import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

import { UserContext } from "../contexts/userContext.js";

const MapPage = ({ navigation }) => {

  const [pins_arr, setPins_arr] = useState([]);
  const [first, setFirst] = useState(true);
  const latDelta = 0.05;
  const lngDelta = 0.05;
  const user = useContext(UserContext);

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
    console.log("useEffect Map!");
    if (first) {
      getPins();
    }
  }, [pins_arr])

  const getPins = () => {
    const userLat = user.user.lat;
    const userLng = user.user.lng;
    // const userLat = 41.98984444;
    // const userLng = -87.6579438;
    //
    const range = getGeohashRange(userLat, userLng, 10);

    console.log("range : ", range);

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
    navigtaion.navigate("CampaignConversationInfiniteScroll", { initiateConversation: true, voter: v })
  }

  return (
    <View style={ styles.container }>
      <MapView style={ styles.mapStyle } region={{ latitude: user.user.lat, longitude: user.user.lng, latitudeDelta: latDelta, longitudeDelta: lngDelta }} >
        { pins_arr.length ?  pins_arr.map((pin, i) => {
          return (<Marker key={ "pin" + i } coordinate={{ latitude: pin.lat, longitude: pin.lng }}>
            <Callout>
              <Text>{ pin.firstname }</Text>
              <Text>{ pin.address }</Text>
              <Button onPress={ (pin) => handlePress(pin) } title="Go to Conversation">
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
