import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import ButtonWithImage from '../../component/ButtonWithImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginManager, AccessToken, Profile, Settings } from 'react-native-fbsdk-next';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { currentDateFN } from '../../Utility/Utils';
import Toast from 'react-native-toast-message';
import { toggleOnlineStatus } from '../../redux/actions/Auth';

Settings.initializeSDK()
global.userData = [];
var emailVar = ''
var nameVar = ''
var loginTypeVar = ''
var imageVar = ''

const windowWidth = Dimensions.get('window').width;
export default function Onboarding({ navigation }) {

    // Login with fb
    async function onFacebookButtonPress() {
       
        LoginManager.logInWithPermissions(["public_profile", "email"]).then(
            function (result) {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    console.log(
                        "Login success with permissions: " +
                        result.grantedPermissions.toString()
                    );
                    const currentProfile = Profile.getCurrentProfile().then(
                        function (currentProfile) {
                            if (currentProfile) {
                                console.log("The current logged user is: " +
                                    currentProfile,
                                );
                            }
                        },
                        AccessToken.getCurrentAccessToken().then((data) => {
                            const { accessToken } = data
                            initUser(accessToken)
                        })
                    );
                }
            },
            function (error) {
                Toast.show({
                    type: 'error',
                    text2: "Please check your internet connection.",
                })
                console.log("Login fail with error: " + error);
            }
        );
    }

    const initUser = (token) => {
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,location,first_name,picture.type(large),friends&access_token=' + token).then((response) => response.json())
            .then((json) => {
                console.log("Logged in user data", json)
                emailVar = json.email
                nameVar = json.name
                imageVar = json.picture.data.url
                loginTypeVar = 'Facebook'
                SignupFN()
            })
            .catch((err) => {
                console.log('ERROR GETTING DATA FROM FACEBOOK', err)
            })

    }

    // Login with Gmail 

    GoogleSignin.configure({
        webClientId: '665746906328-apdgobof81ouuksedv3o0pr757er9v5u.apps.googleusercontent.com',
        // androidClientId: '665746906328-10hlk6e5nm0gm7o0ljqb32gj78sbpmmf.apps.googleusercontent.com',
        offlineAccess: true

    });

    const signInGmail = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo.user.name)
            emailVar = userInfo.user.email
            nameVar = userInfo.user.name
            imageVar = userInfo.user.photo.replace("s96-c", "s384-c", true)
            loginTypeVar = 'Google'
            SignupFN()
        } catch (error) {
            Toast.show({
                type: 'error',
                text2: "Please check your internet connection.",
            })
            console.log(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    async function SignupFN() {
        var currentDate = currentDateFN()
       
        await fetch(global.address + 'RegisterUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: nameVar,
                email: emailVar,
                userImage: (imageVar != null && imageVar != '') ? imageVar : "https://memee-bucket.s3.amazonaws.com/posts%2F32886c6d-2c41-4a9b-bf5f-d47220140091.jpg",
                loginType: loginTypeVar,
            })

        }).then((response) => response.json())
            .then(async(responseJson) => {
                if (responseJson.Status == 409) {

                    if(loginTypeVar == 'Google')
                        logoutFromGoogle()

                    console.log("Error", responseJson)

                    Toast.show({
                        type: 'error',
                        text2: responseJson.Message,
                    })
                }
                else {

                    await AsyncStorage.setItem('@userName', emailVar);
                    await AsyncStorage.setItem('@fullName', nameVar);
                    await AsyncStorage.setItem('@userDate', currentDate);
                    await AsyncStorage.setItem('@userImg', "https://memee-bucket.s3.amazonaws.com/posts%2F32886c6d-2c41-4a9b-bf5f-d47220140091.jpg");
                    await AsyncStorage.setItem('@userLoginType', loginTypeVar);

                    global.userData = responseJson.User[0];
                    global.token = responseJson.Token
                    navigation.replace("Dashboard")

                    toggleOnlineStatus('1')
                }
            }).catch((error) => {
                if(loginTypeVar == 'Google')
                    logoutFromGoogle()

                Toast.show({
                    type: 'error',
                    text2: error,
                })
                console.error(error);
            });
    }

    async function logoutFromGoogle(){

        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        }
        catch(e){}
    }

    return (
        <View style={{ flex: 1, paddingHorizontal: "5%", paddingTop: "5%", backgroundColor: '#0B0213' }}>
            <ScrollView>

                <View>
                    <Image
                        style={{
                            width: (windowWidth * 64) / 100,
                            height: (windowWidth * 17) / 100,
                            marginTop: (windowWidth * 17) / 100,
                            marginBottom: (windowWidth * 17) / 100,
                            alignSelf: 'center'
                        }}
                        resizeMode='stretch'
                        source={require('../../images/onboardIcon.png')}
                    />
                </View>

                <ButtonWithImage
                    title="Continue with Email"
                    onPress={() => navigation.navigate("LoginScreen")}
                    bgClrFirst={global.btnColor1}
                    bgClrSecond={global.btnColor2}
                    txtClr={global.btnTxt}
                    font={global.fontSelect}
                    img={require("../../images/emailSignIn.png")}
                />

                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => signInGmail()}
                    style={styles.buttonStyle}>

                    <Image
                        style={styles.tinyLogoBtn}
                        source={require("../../images/Gmail11.png")}
                    />
                    <Text style={{ textAlign: "center", fontFamily: 'OpenSans-SemiBold', fontSize: 16, color: '#fff' }}>Continue with Google</Text>

                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => onFacebookButtonPress()}
                    style={styles.buttonStyle}>

                    <Image
                        style={styles.tinyLogoBtn}
                        source={require("../../images/fb11.png")}
                    />
                    <Text style={{ textAlign: "center", fontFamily: 'OpenSans-SemiBold', fontSize: 16, color: '#fff' }}>Continue with Facebook</Text>

                </TouchableOpacity>

            </ScrollView>
            
            <View style={{ flexDirection: 'row', alignSelf: 'center', }}>
                <Text style={[styles.txtdown, { fontWeight: 'bold', color: '#707070', }]}>New to memee?</Text>

                <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")} style={{ marginTop: '4%', }}>
                    <Text style={[styles.txtdown2, { fontFamily: global.fontSelect }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.txtdown, {color: '#707070', fontWeight: 'bold', marginTop: -25, textAlign: 'center', width: '80%' }]}>By continuing you agree Memee’s Terms of Services & Privacy Policy. </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        color: '#E6E6E6',
        marginBottom: 25,
        marginTop: 25
    },
    txt: {
        color: '#E6E6E6',
        marginTop: 20,
        marginLeft: "4%",
        marginBottom: '14%',
    },
    txtdown: {
        color: '#E6E6E6',
        marginTop: '5%',
        alignSelf: 'center',
        marginBottom: '10%',
    },
    txtdown2: {
        color: '#FBC848',
        marginTop: '5%',
        alignSelf: 'center',
        marginBottom: '10%',
        marginLeft: 10,
        fontWeight: 'bold'
    },
    tinyLogo: {
        width: 30,
        height: 20,
        marginTop: 10,
        tintColor: '#ffffff'
    },
  
    button: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        elevation: 2,
        marginRight: '-72%',
        marginTop: '-11%'
    },

    buttonStyle: {
        backgroundColor: '#0B0213',
        height: 65,
        width: '90%',
        marginTop: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 32,
        borderColor: '#676767',
        borderWidth: 2,
        elevation: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
  
    tinyLogoBtn: {
        width: 30,
        height: 30,
        marginRight: '10%'
    },
    
})