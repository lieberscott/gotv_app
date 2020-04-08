import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Text } from 'react-native';

import Config from '../screens/Config';
import Header from '../shared/Header';


const screens = {
  Config: {
    screen: Config,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="Account"/>
      }
    }
  }
}

const ConfigStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTitleAlign: "left"
  }
})

export default ConfigStack;
