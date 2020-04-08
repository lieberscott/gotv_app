import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({ navigation, title }) => {

  const openMenu = () => {
    console.log("open menu");
    navigation.openDrawer();
  }

  return (
    <View style={{ flex: 1 }}>
      <MaterialIcons onPress={ openMenu } name="menu" size={ 28 } style={ styles.icon } />
      <Text style={ styles.headerText }>{ title }</Text>
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

export default Header;
