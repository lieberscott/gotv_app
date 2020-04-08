import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Login from '../screens/Login';
import CampaignLogin from '../screens/CampaignLogin';
import Register from '../screens/Register';

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();

  const MyTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Voter Login') {
              iconName = 'ios-open';
            }
            else if (route.name === 'Campaign Login') {
              iconName = 'ios-log-in';
            }
            else if (route.name === 'Campaign Register') {
              iconName = 'ios-clipboard';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
      }}>
        <Tab.Screen name="Voter Login" component={Login} />
        <Tab.Screen name="Campaign Login" component={CampaignLogin} />
        <Tab.Screen name="Campaign Register" component={Register} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer><MyTabs /></NavigationContainer>
  )
}

export default TabNavigation;
