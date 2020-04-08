import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Text } from 'react-native';

import MapPage from '../screens/MapPage';
import Header from '../shared/Header';


const screens = {
  Map: {
    screen: MapPage,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="Map"/>
      }
    }
  }
}

const CampaignMapStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTitleAlign: "left"
  }
})

export default CampaignMapStack;
