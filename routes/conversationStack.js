import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Text } from 'react-native';

import ConversationInfiniteScroll from '../screens/ConversationInfiniteScroll';
import Header from '../shared/Header';


const screens = {
  ConversationInfiniteScroll: {
    screen: ConversationInfiniteScroll,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="ConversationInfinteScroll"/>
      }
    }
  }
}

const ConversationStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTitleAlign: "left"
  }
})

export default ConversationStack;
