import React, { useEffect } from 'react';
import { View, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { asignImageToProductsFN } from '../../Utility/Utils';
import { useDispatch } from 'react-redux';
import { coinsRecordFN, storeIconsBottomTabFN } from '../../redux/actions/Auth';
import { currentDateFN } from '../../Utility/Utils';

console.disableYellowBox = true;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var randomNum = ''
function SplashScreen({ navigation }) {

  const dispatch = useDispatch()

  useEffect(() => {


    global.adcoinAlert = "0"
    randomNum = Math.floor((Math.random() * 5) + 1);

    console.log('I am here ', randomNum)

    setTimeout(async () => {
      global.userName = await AsyncStorage.getItem("@userName");

      global.fullName = await AsyncStorage.getItem("@fullName");
      global.userDate = await AsyncStorage.getItem("@userDate");
      global.userImg = await AsyncStorage.getItem("@userImg");
      global.userLoginType = await AsyncStorage.getItem("@userLoginType");
      

      global.userPass = await AsyncStorage.getItem("@userPass")
      global.btnColor1 = await AsyncStorage.getItem("@btnclr1");
      global.btnColor2 = await AsyncStorage.getItem("@btnclr2");
      global.btnTxt = await AsyncStorage.getItem("@btntxtclr");
      global.btnText = await AsyncStorage.getItem("@btntxt");

      global.overlay1 = await AsyncStorage.getItem("@overlay1");
      global.overlay2 = await AsyncStorage.getItem("@overlay2");
      global.overlay3 = await AsyncStorage.getItem("@overlay3");
      global.itemCodeOverLay = await AsyncStorage.getItem("@overlayItemCodee");


      if (global.overlay1 == "" || global.overlay1 == undefined || global.overlay1 == null) {
        global.overlay1 = "#492C5B88"
        global.overlay3 = "#B9A4C633"
      }

      global.WhichTab = await AsyncStorage.getItem("@whichTab");
      global.bottomIcnClr1 = await AsyncStorage.getItem("@btmIcnClr");
      global.bottomTxtClr1 = await AsyncStorage.getItem("@btmTxtClr");

      global.fontSelect = await AsyncStorage.getItem("@whichFontFam");

      if (global.fontSelect == '' || global.fontSelect == null || global.fontSelect == undefined) {
        global.fontSelect = 'Arial'
      }

      var whichThemee = await AsyncStorage.getItem("@whichTheme");
      if (whichThemee == 0) {

        global.themeData = [
          {
            id: 1,
            img: require("../../images/themePink.png"),
            isSelected: true,
          },
          {
            id: 2,
            img: require("../../images/themeBlue.png"),
            isSelected: false,
          },

        ]

        global.CommentPostClr = '#FFCD2F'

      }
      else if (whichThemee == 1) {

        global.themeData = [
          {
            id: 1,
            img: require("../../images/themePink.png"),
            isSelected: false,
          },
          {
            id: 2,
            img: require("../../images/themeBlue.png"),
            isSelected: true,
          },

        ]

        global.CommentPostClr = "#A378F6"

      }
      else {

        global.themeData = [
          {
            id: 1,
            img: require("../../images/themePink.png"),
            isSelected: false,
          },
          {
            id: 2,
            img: require("../../images/themeBlue.png"),
            isSelected: false,
          },

        ]

        global.CommentPostClr = '#FFCD2F'

      }

      if (global.bottomIcnClr1 == null || global.bottomIcnClr1 == "") {
        global.WhichTab = '2'
        global.bottomIcnClr1 = "#868686"

        global.bottomTxtClr1 = "#868686"
        global.btmSelect = 2;

      }

      if (global.WhichTab == 1) {
        global.btmSelect = false;
      }
      else if (global.WhichTab == 2) {
        global.btmSelect = 1;
      }
      else {
        global.btmSelect = 3;
        console.log("");
      }


      //get and Set selected Profile bg Image

      // var profileImgCout = await AsyncStorage.getItem("@profileBG");
      var profileImgItemCode = await AsyncStorage.getItem("@profileItemCode");
      var profileImgType = await AsyncStorage.getItem("@profileType");

      // console.log("profileImgItemCode", profileImgItemCode)
      // console.log("profileImgType", profileImgType)

      if (profileImgItemCode == "" || profileImgItemCode == undefined) {
        profileImgItemCode = "main_theme_profile_background";
        profileImgType = "profile_background";
      }

      global.itemCodeProfileBG = profileImgItemCode;

      global.profileBGgl = asignImageToProductsFN(profileImgItemCode, profileImgType)


      //Set Bottom Tab Icons

      var iconBottomItemCode = await AsyncStorage.getItem("@bottOmIconItemCode");

      global.iconItemCode = iconBottomItemCode
      // console.log("iconBottomItemCode ", iconBottomItemCode)

      if (iconBottomItemCode == "space_theme_icon") {

        dispatch(storeIconsBottomTabFN(1))

        global.BottomIcon1 = require("../../images/earthBlue.png")
        global.BottomIcon2 = require("../../images/exploreBlue.png")
        global.BottomIcon3 = require("../../images/prizeBlue.png")
        global.BottomIcon4 = require("../../images/profileBlue.png")
        global.BottomMainIcon = require("../../images/postBlue.png")

        global.bottomClr1 = "#5D33AD"
        global.bottomClr2 = "#171A59"
        global.WhichTab = '1'
        global.iconBottomSelected = require("../../images/spaceThemeIcon.png")

      }
      else if (iconBottomItemCode == "unicorn_theme_icon") {
        dispatch(storeIconsBottomTabFN(2))

        global.BottomIcon1 = require("../../images/UniconHome.png")
        global.BottomIcon2 = require("../../images/uniconExplor.png")
        global.BottomIcon3 = require("../../images/uniconCup.png")
        global.BottomIcon4 = require("../../images/Uniconprofile.png")
        global.BottomMainIcon = require("../../images/uniconMain.png")

        global.bottomClr1 = "#C83A6B"
        global.bottomClr2 = "#8D0E3A"
        global.WhichTab = '1'
        global.iconBottomSelected = require("../../images/UniconThemeIcon.png")


      }
      else if (iconBottomItemCode == "the_100_theme_icon") {

        dispatch(storeIconsBottomTabFN(3))

        global.BottomIcon1 = require("../../images/Home100.png")
        global.BottomIcon2 = require("../../images/earth100.png")
        global.BottomIcon3 = require("../../images/trophy100.png")
        global.BottomIcon4 = require("../../images/person100.png")
        global.BottomMainIcon = require("../../images/M100.png")

        global.bottomClr1 = "#FFD524"
        global.bottomClr2 = "#ECB602"
        global.WhichTab = '1'
        global.iconBottomSelected = require("../../images/100theme.png")


      }
      else if (iconBottomItemCode == "new_year_theme_icon") {

        dispatch(storeIconsBottomTabFN(4))

        global.BottomIcon1 = require("../../images/NewYearHome.png")
        global.BottomIcon2 = require("../../images/newYearExplore.png")
        global.BottomIcon3 = require("../../images/newYearPriz.png")
        global.BottomIcon4 = require("../../images/newYearPerson.png")
        global.BottomMainIcon = require("../../images/newYearMain.png")

        global.bottomClr1 = "#413781"
        global.bottomClr2 = "#413781"
        global.WhichTab = '1'
        global.iconBottomSelected = require("../../images/newYearThemeIcons.png")


      }
      else if (iconBottomItemCode == "save_earth_theme_icon") {

        dispatch(storeIconsBottomTabFN(5))

        global.BottomIcon1 = require("../../images/saveEarthHome.png")
        global.BottomIcon2 = require("../../images/saveEarthExplore.png")
        global.BottomIcon3 = require("../../images/saveEarthPrize.png")
        global.BottomIcon4 = require("../../images/saveEarthPerson.png")
        global.BottomMainIcon = require("../../images/saveEarthMain.png")

        global.bottomClr1 = "#78AC6B"
        global.bottomClr2 = "#49843A"
        global.WhichTab = '1'
        global.iconBottomSelected = require("../../images/EarthDayThemeIcons.png")


      }
      else if (iconBottomItemCode == "memee_theme_white_icon") {

        dispatch(storeIconsBottomTabFN(6))

        global.BottomIcon1 = require("../../images/whitehomeWhiteTheme.png")
        global.BottomIcon2 = require("../../images/whiteexploreWhite.png")
        global.BottomIcon3 = require("../../images/whiteTournamentWhite.png")
        global.BottomIcon4 = require("../../images/whiteprofileWhite.png")
        global.BottomMainIcon = require("../../images/whiteMainM.png")

        global.bottomClr1 = "#ffffff"
        global.bottomClr2 = "#ffffff"
        global.WhichTab = '1'
        global.iconBottomSelected = require("../../images/whiteTheme.png")


      }
      else {

        dispatch(storeIconsBottomTabFN(8))
        global.BottomIcon1 = require("../../images/Home.png")
        global.BottomIcon2 = require("../../images/world.png")
        global.BottomIcon3 = require("../../images/cup.png")
        global.BottomIcon4 = require("../../images/person.png")
        global.BottomMainIcon = require("../../images/mainM.png")

        global.bottomClr1 = "#292929"
        global.bottomClr2 = "#292929"
        global.WhichTab = '0'
        global.iconBottomSelected = require("../../images/Tabbar.png")
      }

      //Set Bottom Tab Icons end

      if (global.btnColor1 == null || global.btnColor2 == "") {
        global.btnColor1 = '#FFE299';
        global.btnColor2 = '#F6B202';
        global.btnTxt = "#000000";
        global.btnText = "Buttons"
      }

      if(global.userLoginType == "Email"){
        generalLogin()
      }
      else if (global.userLoginType == "Facebook"){
        SignupSocialFN()
      }
      else if (global.userLoginType == "Google"){
        SignupSocialFN()
      }
      else{
        navigation.replace("Onboarding")
      }
    }, 3000);
  }, []);

  async function SignupSocialFN() {
   
    await fetch(global.address + 'RegisterUser', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: global.fullName,
            email: global.userName,
            userImage: global.userImg,
            loginType: global.userLoginType,
        })

    }).then((response) => response.json())
        .then(async(responseJson) => {
            if (responseJson.Status == 409) {
                console.log("Error", responseJson)
                navigation.replace("Onboarding")
            }
            else {
                global.userData = responseJson.User[0];
                global.token = responseJson.Token
                navigation.replace("Dashboard")
            }
        }).catch((error) => {
            console.error(error);
        });
}

  function generalLogin(){
    fetch(global.address + 'login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: global.userName,
        password: global.userPass,
      })

    }).then((response) => response.json())
      .then(async (responseJson) => {

        console.log("Login Message....");

        if (responseJson.Status == 400) {

          navigation.replace("Onboarding")
        }
        else {
          global.token = responseJson.Token;
          loginData();
        }

      }).catch((error) => {
        console.error(error);
        navigation.replace("Onboarding")
      });
  }

  function loginData() {
    fetch(global.address + 'getLoggedInUser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'auth_token': global.token
      },
      body: JSON.stringify({
        email: global.userName,
        password: global.userPass,
      })

    }).then((response) => response.json())
      .then((responseJson) => {

        global.userData = responseJson;
        dispatch(coinsRecordFN(
          global.userData.coins
        ))
        navigation.replace("Dashboard");

      }).catch((error) => {
        console.error(error);
      });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image 
        source={ randomNum == 1 ? require("../../images/Splash1.png") : 
                  randomNum == 2 ? require("../../images/Splash2.png") : 
                  randomNum == 3 ? require("../../images/Splash3.png") : 
                  randomNum == 4 ? require("../../images/Splash4.png") : 
                  require("../../images/Splash5.png") }
        resizeMode='cover'
        style={{ height: windowHeight, width: windowWidth, alignSelf: 'center' }} />
    </View>
  );
}

export default SplashScreen;