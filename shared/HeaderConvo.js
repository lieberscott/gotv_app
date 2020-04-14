import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HeaderConvo = ({ navigation }) => {

  const name = navigation.getParam("name");
  const address = navigation.getParam("address");

  return (
    <View style={{ flex: 1 }}>
      <Text style={ styles.headerText }>{ name }, { address }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  headerText: {
    fontSize: 20,
    color: "#333",
    letterSpacing: 1,
    marginLeft: 55
  },
  icon: {
    position: "absolute",
    left: 1,
    color: "red"
  }
})

export default HeaderConvo;
