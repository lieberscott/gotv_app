import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Text } from 'react-native';

import CampaignConversationInfiniteScroll from '../screens/CampaignConversationInfiniteScroll';
import Conversation from '../screens/Conversation';
import Header from '../shared/Header';
import HeaderConvo from '../shared/HeaderConvo';
import MapPage from '../screens/MapPage';

const screens = {
  ConversationInfiniteScroll: {
    screen: CampaignConversationInfiniteScroll,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="Messages"/>
      }
    }
  },
  MapPage: {
    screen: MapPage,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="MapPage"/>
      }
    }
  },
  Conversation: {
    screen: Conversation,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <HeaderConvo navigation={ navigation } />
      }
    }
  },
}

const CampaignConversationStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTitleAlign: "left"
  }
})

export default CampaignConversationStack;
