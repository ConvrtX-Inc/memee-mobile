// import * as React from 'react';
import React, { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "../memee/src/screens/LoginScreen";
import SignUpScreen from "../memee/src/screens/SignUpScreen";
import SplashScreen from "../memee/src/screens/SplashScreen";
import Dashboard from "../memee/src/screens/Dashboard";
import CommentScreen from "../memee/src/screens/CommentScreen";
import NewPost from "../memee/src/screens/NewPost";
import ProfileScreen from "../memee/src/screens/ProfileScreen";
import ProfileSetting from "../memee/src/screens/ProfileSetting";
import NotificationScreen from '../memee/src/screens/NotificationScreen';
import ActivityNotification from '../memee/src/screens/ActivityNotification';
import FollowRequest from '../memee/src/screens/FollowRequest';
import NavigateScreen from '../memee/src/screens/NavigateScreen';
import SettingScreen from '../memee/src/screens/SettingScreen';
import ExploreScreen from '../memee/src/screens/ExploreScreen';
import ExploreDetail from '../memee/src/screens/ExploreDetail';
import TrendingPostExplore from '../memee/src/screens/TrendingPostExplore';
import SearchScreen from '../memee/src/screens/SearchScreen';
import ProfileImageShow from '../memee/src/screens/ProfileImageShow';
import SettingDetailNotification from '../memee/src/screens/SettingDetailNotification';
import Tournament from '../memee/src/screens/Taurnament';
import TounamentScreen from '../memee/src/screens/TournamentScreen';
import RankingScreen from '../memee/src/screens/RankingScreen';
import Store from '../memee/src/screens/Store';
import JudgeScreen from '../memee/src/screens/JudgeScreen';
import JudgeMeme from '../memee/src/screens/JudgeMeme';
import PaymentMethod from '../memee/src/screens/PaymentMethod';
import AddCoins from '../memee/src/screens/AddCoins';
import ForgetPassword from '../memee/src/screens/ForgetPassword';
import VerifyEmail from './src/screens/VerifyEmail';
import NewPassword from '../memee/src/screens/NewPassword';
// import PhotoEditingTry from '../memee/src/screens/PhotoEditingTry';
import StoreTab from '../memee/src/screens/StoreTab';
import IconsScreen from '../memee/src/screens/ScreensForStoreTab/IconsScreen';
import ButtonsScreen from '../memee/src/screens/ScreensForStoreTab/ButtonsScreen';
import FontScreen from '../memee/src/screens/ScreensForStoreTab/FontScreen';
import ProfileBackgroundScreen from '../memee/src/screens/ScreensForStoreTab/ProfileBackgroundScreen';
import ProfileOverlayScreen from '../memee/src/screens/ScreensForStoreTab/ProfileOverlayScreen';
import CoinsConfirmation from '../memee/src/screens/CoinsConfirmation';
import OrganizeBadges from '../memee/src/screens/OrganizeBadges';
import EditProfileScreen from '../memee/src/screens/EditProfileScreen';
import BillingDetail from '../memee/src/screens/BillingDetail';
import FAQScreen from '../memee/src/screens/FAQScreen';
import ChangeCountry from '../memee/src/screens/ChangeCountry';
import SharePost from '../memee/src/screens/SharePost';
import Onboarding from '../memee/src/screens/Onboarding';
import ChatScreen from './src/screens/ChatScreen';
import Inbox from './src/screens/Inbox';
import NewMessage from './src/screens/NewMessage';

import { Settings } from 'react-native-fbsdk-next';
import { Provider } from 'react-redux';
import configureStore from './src/redux/store/index';
import { PersistGate } from 'redux-persist/integration/react';
import Congradulation from '../memee/src/screens/Congradulation';

import Toast from 'react-native-toast-message';
import { toggleOnlineStatus } from './src/redux/actions/Auth';

const { store, persistor } = configureStore();

const Stack = createStackNavigator();

global.profileBGArray = "1";
global.bgOverlay = "1"
global.address = "http://memee.techticksdigital.com/Api/"
// global.address = "http://192.168.18.106/memee-services/Api/"

Settings.initializeSDK();
function App() {

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (global.userData) {
        if (nextAppState == 'active') {
          console.log("Online")
          toggleOnlineStatus('1')
        }
        else {
          console.log("Offline")
          toggleOnlineStatus('0')
        }
      }
    });

    return () => {
      if (subscription)
        subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar
            animated={true}
            backgroundColor="#0D0219"
          // barStyle={statusBarStyle}
          // showHideTransition={statusBarTransition}
          // hidden={hidden} 
          />
          <Stack.Navigator initialRouteName='SplashScreen'
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="CommentScreen" component={CommentScreen} />
            <Stack.Screen name="NewPost" component={NewPost} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
            <Stack.Screen name="ActivityNotification" component={ActivityNotification} />
            <Stack.Screen name="FollowRequest" component={FollowRequest} />
            <Stack.Screen name="NavigateScreen" component={NavigateScreen} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
            <Stack.Screen name="ExploreDetail" component={ExploreDetail} />
            <Stack.Screen name="TrendingPostExplore" component={TrendingPostExplore} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="ProfileImageShow" component={ProfileImageShow} />
            <Stack.Screen name="SettingDetailNotification" component={SettingDetailNotification} />
            <Stack.Screen name="Tournament" component={Tournament} />
            <Stack.Screen name="TounamentScreen" component={TounamentScreen} />
            <Stack.Screen name="RankingScreen" component={RankingScreen} />
            <Stack.Screen name="Store" component={Store} />
            <Stack.Screen name="JudgeScreen" component={JudgeScreen} />
            <Stack.Screen name="JudgeMeme" component={JudgeMeme} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
            <Stack.Screen name="AddCoins" component={AddCoins} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
            <Stack.Screen name="StoreTab" component={StoreTab} />
            <Stack.Screen name="IconsScreen" component={IconsScreen} />
            <Stack.Screen name="ButtonsScreen" component={ButtonsScreen} />
            <Stack.Screen name="FontScreen" component={FontScreen} />
            <Stack.Screen name="ProfileBackgroundScreen" component={ProfileBackgroundScreen} />
            <Stack.Screen name="ProfileOverlayScreen" component={ProfileOverlayScreen} />
            <Stack.Screen name="CoinsConfirmation" component={CoinsConfirmation} />
            <Stack.Screen name="OrganizeBadges" component={OrganizeBadges} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen name="BillingDetail" component={BillingDetail} />
            <Stack.Screen name="FAQScreen" component={FAQScreen} />
            <Stack.Screen name="ChangeCountry" component={ChangeCountry} />
            <Stack.Screen name="Congradulation" component={Congradulation} />
            <Stack.Screen name="SharePost" component={SharePost} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen name="NewMessage" component={NewMessage} />

            {/* <Stack.Screen name="PhotoEditingTry" component={PhotoEditingTry} /> */}

          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
      <Toast position="bottom" ref={(ref) => Toast.setRef(ref)} />
    </Provider>
  );
}

export default App;