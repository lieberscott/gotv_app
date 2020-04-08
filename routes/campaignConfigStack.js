import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Text } from 'react-native';

import CampaignConfig from '../screens/CampaignConfig';
import Header from '../shared/Header';


const screens = {
  Config: {
    screen: CampaignConfig,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="Account"/>
      }
    }
  }
}

const CampaignConfigStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTitleAlign: "left"
  }
})

export default CampaignConfigStack;
