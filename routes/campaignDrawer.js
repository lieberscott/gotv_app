import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';

import CampaignHomeStack from './campaignHomeStack';
// import CampaignMapStack from './campaignMapStack';
import CampaignConfigStack from './campaignConfigStack';
import CampaignConversationStack from './campaignConversationStack';

const RootDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: CampaignHomeStack
  },
  Account: {
    screen: CampaignConfigStack
  },
  ConversationStack: {
    screen: CampaignConversationStack
  }
});

export default createAppContainer(RootDrawerNavigator);
