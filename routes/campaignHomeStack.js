import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Text } from 'react-native';

import CampaignHome from '../screens/CampaignHome';
import Header from '../shared/Header';


const screens = {
  Home: {
    screen: CampaignHome,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="Home"/>
      }
    }
  }
}

const CampaignHomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTitleAlign: "left"
  }
})

export default CampaignHomeStack;
