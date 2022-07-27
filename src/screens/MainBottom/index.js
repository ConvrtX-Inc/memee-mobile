import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import IconsScreen from '../ScreensForStoreTab/IconsScreen';
import ButtonsScreen from '../ScreensForStoreTab/ButtonsScreen';
import FontScreen from '../ScreensForStoreTab/FontScreen';
import ProfileBackgroundScreen from '../ScreensForStoreTab/ProfileBackgroundScreen';
import ProfileOverlayScreen from '../ScreensForStoreTab/ProfileOverlayScreen';
import Dashboard from '../Dashboard';
import ExploreScreen from '../ExploreScreen';
import Tournament from '../Taurnament';
import ProfileScreen from '../ProfileScreen';
const Tab = createMaterialTopTabNavigator();

export default function MainBottom() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        scrollEnabled: true,
        activeTintColor: global.colorTextPrimary,
        inactiveTintColor: global.colorTextPrimary,
        labelStyle: {fontSize: 15, textTransform: 'none'},
        tabStyle: {width: 0, height: 0, position: 'absolute'},
        style: {backgroundColor: global.colorPrimary},
        indicatorStyle: {
          opacity: 0,
        },
      }}>
      <Tab.Screen name="HomeTab" component={Dashboard} />
      <Tab.Screen name="ExploreTab" component={ExploreScreen} />
      <Tab.Screen name="TournamentTab" component={Tournament} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            console.log('profileTab');
            global.profileID = global.userData.user_id;
          },
        })}
        options={{unmountOnBlur: true}}
      />
    </Tab.Navigator>
  );
}
