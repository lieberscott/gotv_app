import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Text } from 'react-native';

import AddSubscription from '../screens/AddSubscription';
import Header from '../shared/Header';


const screens = {
  AddSubscription: {
    screen: AddSubscription,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="Add Subscription"/>
      }
    }
  }
}

const AddSubscriptionStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTitleAlign: "left"
  }
})

export default AddSubscriptionStack;
