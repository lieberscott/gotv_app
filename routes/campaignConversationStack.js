import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Text } from 'react-native';

import CampaignConversationInfiniteScroll from '../screens/CampaignConversationInfiniteScroll';
import Conversation from '../screens/Conversation';
import Header from '../shared/Header';


const screens = {
  ConversationInfiniteScroll: {
    screen: CampaignConversationInfiniteScroll,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="Messages"/>
      }
    }
  },
  Conversation: {
    screen: Conversation,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={ navigation } title="Messages"/>
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
