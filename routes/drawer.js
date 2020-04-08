import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';

import HomeStack from './homeStack';
import ConfigStack from './configStack';
import ConversationStack from './conversationStack';

const RootDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeStack
  },
  Account: {
    screen: ConfigStack
  },
  ConversationStack: {
    screen: ConversationStack
  }
});

export default createAppContainer(RootDrawerNavigator);
