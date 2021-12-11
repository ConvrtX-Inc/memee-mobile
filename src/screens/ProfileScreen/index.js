import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, BackHandler, PermissionsAndroid, ActivityIndicator, StyleSheet, Modal, Dimensions, ScrollView, Image, FlatList, ImageBackground, ViewBase } from 'react-native';
import { Avatar } from 'react-native-elements';
import ButtonCoins from '../../component/ButtonCoins';
import { useNavigation } from '@react-navigation/native';
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { generateUID } from '../../Utility/Utils';
import { RNS3 } from 'react-native-aws3';
import InputMultiline from '../../component/InputFieldMultiLine';
import ButtonSmall from '../../component/ButtonSmall';
import { currentDateFN } from '../../Utility/Utils';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux'
import { storedSelectedBadges } from '../../redux/actions/Auth';
import BottomNavBar from '../../component/BottomNavBar';
import { TextInput } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import { getBucketOptions } from '../../Utility/Utils';

const axios = require('axios');

var userName = ""
var userId = ""
var userEmail = ""
var userGender = ""
var userPassword = ""
var userBio = ""
var userimgUrl = ""
var imgURlSelect = ""

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
export default function ProfileScreen(props) {

    const navigation = useNavigation();
    const [profilePostData, setProfilePostData] = useState("");
    const [profileData, setProfileData] = useState("");
    const [filePath, setFilePath] = useState({});
    const [showPimg, setShowPimg] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleImg, setModalVisibleImg] = useState(false);
    const [modalVisibleImgPicker, setModalVisibleImgPicker] = useState(false);

    const [bioChange, setBioChange] = useState(false);
    const [profileBGPick, setProfileBGPick] = useState(global.profileBGgl)
    const [bagesActivit, setdBagesActivity] = useState('true');
    const [loader, setLoader] = useState(false);

    const dispatch = useDispatch()
    const { coinsStored, scrollDown, selectedBadges, ImageBottoms } = useSelector(({ authRed }) => authRed)

    useEffect(() => {
        const backAction = () => {
            navigation.goBack()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            //Screen Navigation
            global.TabButton = 4;
            profileDataFN()
            setProfileBGPick(global.profileBGgl)

            if(global.refreshBadges || global.lastLoadedProfile != global.profileID){
                getOrganizedBadgesFN()
                global.refreshBadges = false
            }

        });
        return unsubscribe;
    }, []);

    function openChat(){

        if(profileData == null)
            return

        setLoader(true)

        let users = []
        users.push({userId: global.userData.user_id, name: global.userData.name})
        users.push({userId: global.profileID, name: profileData.name})

        axios.post(`${global.address}createConversation`, users)
            .then(function (response) {
                setLoader(false)
                navigation.navigate('ChatScreen', {conversationId: response.data.ConversationID, name: response.data.Title})
            })
            .catch(function (error) {
                console.log(error)
                Toast.show({
                    type: 'error',
                    text2: "Something went wrong",
                });
                setLoader(false)
        });
    }

    function getOrganizedBadgesFN() {
        global.lastLoadedProfile = global.profileID
        setdBagesActivity(true)
        fetch(global.address + 'GetOrganizedBadges/'+ global.profileID, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                dispatch(storedSelectedBadges(
                    responseJson.OrganizedBadges
                ))
                setdBagesActivity(false)
            }).catch((error) => {
                console.error(error);
            });
    }

    function profileDataFN() {
        console.log("profile screen running ...")
        console.log(global.profileID)
        userBio = "";
        fetch(global.address + 'GetUserProfile/' + global.profileID, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                userName = responseJson.profile.name
                userId = responseJson.profile.user_id
                userEmail = responseJson.profile.email
                userGender = responseJson.profile.gender
                userPassword = responseJson.profile.password
                userBio = responseJson.profile.bio
                userimgUrl = responseJson.profile.imgurl

                if (userBio == "") {

                    console.log("bio is empty...")
                    userBio = "";

                }

                setProfileData(responseJson.profile)
                setProfilePostData(responseJson.posts)


            }).catch((error) => {
                console.error(error);
            });
    }

    // Image Picker Version 3//
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                // alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const captureImage = async (type) => {
        setModalVisibleImgPicker(false)
        let options = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            videoQuality: 'low',
            durationLimit: 30, //Video max duration in seconds
            saveToPhotos: true,
        };
        let isStoragePermitted = await requestExternalWritePermission();
        let isCameraPermitted = await requestCameraPermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    // alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    // alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    // alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    // alert(response.errorMessage);
                    return;
                }

                setFilePath(response.assets[0]);
                uploadImageToS3(response.assets[0]);
                setShowPimg(true)
            });
        }
    };

    const chooseFile = (type) => {
        setModalVisibleImgPicker(false)
        let options = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {

            if (response.didCancel) {
                // alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                // alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                // alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                // alert(response.errorMessage);
                return;
            }

            setFilePath(response.assets[0]);
            uploadImageToS3(response.assets[0]);
            setShowPimg(true)
        });
    };

    function uploadImageToS3(source) {

        const file = {
            uri: source.uri,
            name: generateUID() + ".jpg",
            type: source.type
        }
        RNS3.put(file, getBucketOptions("posts")).then(response => {
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
                console.log('here3')

            postUploadFN(response.body.postResponse.location);

        });
    }

    function postUploadFN(imgUrl) {

        let data = JSON.stringify({
            userId: global.userData.user_id,
            userImage: imgUrl,
        })

        global.userData.imgurl = imgUrl;
        fetch(global.address + 'UpdateProfile', {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.Status == '201') {
                    global.token = responseJson.Token
                }

            }).catch((error) => {
                console.error(error);
            });
    }

    function openBioChange() {

        if (global.profileID == global.userData.user_id) {
            if (profileData.bio == "Tap to add a bio") {
                setBioChange("");
            }
            else {
                setBioChange(profileData.bio);

            }
            setModalVisible(true)
        }
    }

    function updateDiscription() {
        setModalVisible(false)
        profileData.bio = bioChange;
        userBio = bioChange;

        fetch(global.address + 'UpdateProfile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
            body: JSON.stringify({

                userID: userId,
                userName: userName,
                userEmail: userEmail,
                userGender: userGender,
                // userPassword: userPassword,
                userImage: userimgUrl,
                bio: bioChange,

            })
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.Status == '201') {
                    global.token = responseJson.Token
                    // showBiotoggleVar = false
                }

            }).catch((error) => {
                // console.error(error);
            });
    }

    function sendFollowRequest() {
        profileData.requestStatus = 0
        setProfileData(profileData)
        var currentDate = currentDateFN()
        fetch(global.address + 'PostFollowRequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
            body: JSON.stringify({

                userID: global.userData.user_id,
                followingID: global.profileID,
                dateTime: currentDate,

            })
        }).then((response) => response.json())
            .then((responseJson) => {

                profileDataFN()

            }).catch((error) => {
                console.error(error);
            });
    }

    function cancelFollowRequest() {
        profileData.requestStatus = -1
        setProfileData(profileData)
        fetch(global.address + 'UnfollowUser/' + global.userData.user_id + "/" + global.profileID, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {

                profileDataFN()

            }).catch((error) => {
                console.error(error);
            });
    }

    function showImageFN(index) {
        global.selectedPost = profilePostData[index];
        navigation.navigate("ProfileImageShow")
    }


    // For Bottom Tab
    function activeTab(counter) {


        global.TabButton = counter;
        if (counter == 1) {
            navigation.navigate("Dashboard")
        }
        else if (counter == 2) {
            navigation.navigate("ExploreScreen")
        }
        else if (counter == 3) {
            navigation.navigate("Tournament");
        }
        else if (counter == 4) {
            global.profileID = global.userData.user_id;
            navigation.navigate("ProfileScreen")
        }
        else if (counter == 5) {
            // chooseFile(counter);
            setModalVisibleBottomImgPicker(true)
        }

    }

    return (
        <View style={{ flex: 1, marginBottom: 0, backgroundColor: global.colorPrimary }}>
            <ScrollView>
                <ImageBackground source={profileBGPick} resizeMode='cover'
                    imageStyle={{ borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}
                    style={styles.image}>
                    <View style={styles.topView}>

                        <TouchableOpacity onPress={() => navigation.navigate("ProfileSetting")}>
                            <LinearGradient
                                colors={["#ffffff44", "#ffffff55"]}
                                // style={styles.imgProfileBtn}
                                style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                            >
                                <Image
                                    style={{ height: 23, width: 23, marginLeft: 0, marginTop: 0 }}
                                    resizeMode='stretch'
                                    source={require('../../images/Left.png')}
                                />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("SettingScreen")}>
                            <LinearGradient
                                colors={["#ffffff44", "#ffffff55"]}
                                // style={styles.imgProfileBtn}
                                style={{ marginLeft: 8, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                            >
                                <Image
                                    style={{ height: 20, width: 20, marginLeft: 0, marginTop: 0 }}
                                    resizeMode='stretch'
                                    source={require('../../images/setting.png')}
                                />
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={{ marginTop: 20, marginLeft: 'auto' }}>
                            <ButtonCoins
                                title={coinsStored}
                                font={global.fontSelect}
                                onPress={() => navigation.navigate('AddCoins')}
                            />
                        </View>
                    </View>

                    {global.spaceMan == '1' ?
                        <Image
                            style={{ height: 60, width: 60, position: "absolute", top: '15%', left: '36%' }}
                            resizeMode='stretch'
                            source={require('../../images/spaceMan.png')}
                        />
                        : null}

                    <TouchableOpacity disabled={true} onPress={() => setModalVisibleImgPicker(true)} style={{ alignSelf: "center", marginTop: 50, borderWidth: 3, borderColor: '#fff', borderRadius: 80 }}>
                        {showPimg == false ?
                            <Avatar
                                rounded
                                size="xlarge"
                                source={
                                    { uri: profileData.imgurl }
                                }
                            />
                            :
                            <Avatar
                                rounded
                                size="xlarge"
                                source={
                                    { uri: filePath.uri }
                                }
                            />
                        }
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 22, marginTop: 8, fontFamily: global.fontSelect, }}>{profileData.name}</Text>
                    </View>
                    {global.profileID != global.userData.user_id ?
                        <View style={{ width: '60%', alignSelf: 'center', marginTop: 10, flexDirection:'row' }}>

                            {profileData.requestStatus == 0 ?

                                <ButtonSmall
                                    title="Requested"
                                    bgClrFirst={global.btnColor1}
                                    bgClrSecond={global.btnColor2}
                                    btnTxtClr={global.btnTxt}
                                    font={global.fontSelect}
                                    onPress={() => cancelFollowRequest()}
                                />
                                : null}

                            {profileData.requestStatus == 1 ?

                                <ButtonSmall
                                    title="Following"
                                    bgClrFirst={global.btnColor1}
                                    bgClrSecond={global.btnColor2}
                                    btnTxtClr={global.btnTxt}
                                    font={global.fontSelect}
                                    onPress={() => cancelFollowRequest()}
                                />
                                : null}

                            {profileData.requestStatus == -1 ?

                                <ButtonSmall
                                    title="Follow"
                                    bgClrFirst={global.btnColor1}
                                    bgClrSecond={global.btnColor2}
                                    btnTxtClr={global.btnTxt}
                                    font={global.fontSelect}
                                    onPress={() => sendFollowRequest()}
                                />
                                : null}
                             <ButtonSmall
                                    title="Message"
                                    bgClrFirst='white'
                                    bgClrSecond='white'
                                    btnTxtClr={global.btnTxt}
                                    font={global.fontSelect}
                                    loader={loader}
                                    onPress={() => openChat()}
                                />
                        </View>
                    : null}
                    <LinearGradient
                        colors={["#ffffff44", "#ffffff55"]}
                        style={styles.imgProfileBtn}
                    >

                        <View style={{ width: "100%", flexDirection: 'row', height: 75, }}>
                            <View style={{ width: "32.5%", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 19, fontWeight: 'bold', fontFamily: global.fontSelect }}>{profileData.NoOfPosts}</Text>
                                <Text style={{ color: '#fff', fontSize: 11, fontFamily: global.fontSelect }}>Posts</Text>
                            </View>

                            <View style={{ width: "0.5%", height: 37, backgroundColor: '#fff', marginTop: 17 }}></View>

                            <View style={{ width: "33%", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 19, fontWeight: 'bold', fontFamily: global.fontSelect }}>{profileData.NoOfFollowers}</Text>
                                <Text style={{ color: '#fff', fontSize: 11, fontFamily: global.fontSelect }}>Followers</Text>
                            </View>

                            <View style={{ width: "0.5%", height: 37, backgroundColor: '#fff', marginTop: 17 }}></View>

                            <View style={{ width: "32.5%", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 19, fontWeight: 'bold', fontFamily: global.fontSelect }}>{profileData.NoOfFollowings}</Text>
                                <Text style={{ color: '#fff', fontSize: 11, fontFamily: global.fontSelect }}>Following</Text>
                            </View>

                        </View>

                    </LinearGradient>
                    {global.userData.user_id == global.profileID ?
                        <View style={{ width: '85%', alignSelf: 'center', marginTop: 15 }}>

                            <TouchableOpacity onPress={() => openBioChange()} disabled={true}>
                                <Text style={{ color: '#fff', alignSelf: 'center', fontFamily: global.fontSelect }}>{profileData.bio ? '"' + profileData.bio + '"' : ''}</Text>
                            </TouchableOpacity>

                        </View>
                        : null}
                    {/* </ImageBackground> */}
                </ImageBackground>


                <LinearGradient
                    colors={global.gradientColors}
                    style={{
                        width: '100%', paddingHorizontal: '5%', alignItems: 'center', height: 160, borderRadius: 40, marginTop: 3, backgroundColor: "#5D33AD"
                    }}>
                    <View style={{ flexDirection: 'row', width: '90%', marginTop: 15, marginBottom: 5, justifyContent: 'space-between' }}>
                        <Text style={{ color: global.colorTextPrimary, fontSize: 16, fontWeight: 'bold' }}>Earned Badges</Text>
                        {global.userData.user_id == global.profileID ?
                            <TouchableOpacity onPress={() => {
                                    global.refreshBadges = true
                                    navigation.navigate("OrganizeBadges")
                                }}>
                                <Text style={{ color: global.colorTextPrimary, fontSize: 14, }}>Organize Badges</Text>
                            </TouchableOpacity>
                            : null}
                    </View>

                    <View style={{ width: '100%' }}>
                        {bagesActivit == true ?
                            <ActivityIndicator size="small" color={global.colorTextActive} style={{ alignSelf: 'center', marginTop: '10%' }} />
                            :
                            <View>
                                {selectedBadges == undefined ?
                                    <Text style={{ alignSelf: 'center', color: global.colorTextPrimary, fontSize: 15, marginTop: 25 }}>No Badges here!</Text>

                                    :
                                    <View>
                                        {selectedBadges.length <= 0 ?
                                            <Text style={{ alignSelf: 'center', color: global.colorTextPrimary, fontSize: 15, marginTop: 25 }}>No Badges here!</Text>
                                            :
                                            <FlatList
                                                horizontal={true}
                                                // numColumns={2}
                                                data={selectedBadges}
                                                renderItem={({ item, index }) =>
                                                    <View style={{ marginLeft: 5 }}>

                                                        <View style={{ width: (windowWidth * 20) / 100, alignItems: 'center', marginVertical: (windowWidth * 1) / 100, }} >

                                                            <View style={{ borderRadius: (windowWidth * 15) / 100, height: (windowWidth * 15) / 100, width: (windowWidth * 15) / 100, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Image
                                                                    style={{ width: (windowWidth * 10.5) / 100, height: (windowWidth * 10.5) / 100 }}
                                                                    resizeMode='contain'
                                                                    source={
                                                                        { uri: item.image_url }
                                                                    }
                                                                />
                                                            </View>
                                                            <Text style={{ color: global.colorTextPrimary, fontSize: 11, marginTop: (windowWidth * 0.5) / 100 }}>{item.badge_name}</Text>
                                                        </View>

                                                    </View>
                                                }
                                                keyExtractor={item => item.post_id}
                                            />
                                        }
                                    </View>
                                }
                            </View>
                        }
                    </View>
                </LinearGradient>

                <FlatList
                    // horizontal={true}
                    numColumns={2}
                    data={profilePostData}
                    renderItem={({ item, index }) =>
                        <View style={{ width: '50%', borderWidth: 1, borderColor: global.colorPrimary }} >
                            <TouchableOpacity onPress={() => showImageFN(index)}>
                                <Image
                                    style={{ width: '100%', height: windowWidth/2 }}
                                    source={{ uri: item.img_url }}
                                />
                            </TouchableOpacity>

                        </View>

                    }
                    keyExtractor={item => item.post_id}
                    style={{ borderRadius: 100, marginTop: 3, }}
                />

                <View style={{ marginBottom: 35 }}></View>

            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalViewbio}>

                        <TextInput
                            placeholder="One liner about yourself"
                            onChangeText={text => setBioChange(text)}
                            value={bioChange}
                            secureTextEntry={false}
                            font={global.fontSelect}
                            placeholderTextColor="#707070"
                            style={{
                                color: '#FFFFFF',
                                fontSize: 15,                                
                            }}
                        />

                        <TouchableOpacity style={[styles.button, styles.buttonOpen]} onPress={() => updateDiscription()}>
                            <LinearGradient
                                colors={[global.btnColor1, global.btnColor2]}
                                style={{ paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center', borderRadius: 25, }}
                            >
                                <Text style={[styles.modalText, { color: global.btnTxt, fontFamily: global.fontSelect }]}>Update</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            {/* Image Modal start */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisibleImg}
                onRequestClose={() => {
                    setModalVisibleImg(!modalVisibleImg);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Image
                            style={{ width: 250, height: 400, marginBottom: 5 }}
                            resizeMode='stretch'
                            source={{ uri: imgURlSelect }}
                        />

                        <TouchableOpacity style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisibleImg(false)} >
                            <LinearGradient
                                colors={['#FFE299', '#F6B202']}
                                style={{ paddingHorizontal: 27, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center', borderRadius: 22, }}
                            >
                                <Text style={styles.modalText}>Close</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            {/* Image picker Modal start */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisibleImgPicker}
                onRequestClose={() => {
                    setModalVisibleImgPicker(!modalVisibleImgPicker);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalViewImgPicker}>

                        <Text style={{ color: "#fff", fontWeight: 'bold', fontSize: 18, marginBottom: '15%', marginTop: '3%' }}>Select Image</Text>

                        <TouchableOpacity style={{ marginBottom: '8%' }} onPress={() => captureImage('photo')}>
                            <Text style={{ color: "#fff", opacity: 0.5, fontSize: 16 }}>Take Photo..</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginBottom: '6%' }} onPress={() => chooseFile('photo')}>
                            <Text style={{ color: "#fff", opacity: 0.5, fontSize: 16 }}>Choose from Library..</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.buttonOpen, { marginTop: '20%' }]} onPress={() => setModalVisibleImgPicker(false)} >
                            <LinearGradient
                                colors={[global.btnColor1, global.btnColor2]}
                                style={{ paddingHorizontal: 27, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center', borderRadius: 22, }}
                            >
                                <Text style={[styles.modalText, { color: global.btnTxt }]}>Close</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <BottomNavBar
            onPress={(index) => activeTab(index)}
            themeIndex={ImageBottoms}
            navigation={navigation}
            navIndex={3} />

            {/* Image picker Bottom Modal start */}

        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        paddingBottom: 20,
        width: '100%',
        resizeMode: "stretch",
        marginTop: -30,
        // justifyContent: "center"
    },
    imageinProfile: {
        height: 530,
        marginTop: -30,
        width: '100%',
        resizeMode: "stretch",
    },
    imgProfileBtn: {
        height: 75,
        marginTop: 20,
        // marginLeft: "5.5%",
        width: '85%',
        resizeMode: "stretch",
        alignSelf: 'center',
        borderRadius: 20
    },
    topView: {
        width: '100%',
        height: 85,
        // backgroundColor: '#ffffff',
        paddingTop: 55,
        paddingLeft: 12,
        flexDirection: 'row'
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: '6%',
    },
    modalView: {
        margin: 20,
        // borderColor: '#FBC848',
        // borderWidth: 1,
        backgroundColor: "#201E23",
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalViewImgPicker: {
        margin: 20,
        height: 300,
        width: '65%',
        backgroundColor: "#201E23",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalViewbio: {
        margin: 20,
        // borderColor: '#FBC848',
        // borderWidth: 1,
        backgroundColor: "#201E23",
        width: '70%',
        height: 270,
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        justifyContent: 'space-evenly',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 25,
        elevation: 2,
        marginRight: '1%',
        marginTop: '1%'
    },
    buttonOpen: {
        backgroundColor: "#FBC848",
        alignSelf: 'center'
    },
    buttonClose: {
        backgroundColor: "#0B0213",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15
    },
    modalText: {
        marginBottom: 0,
        marginTop: 0,
        textAlign: "center",
    },



    // bottom tab design
    bottom: {
        backgroundColor: '#272727',
        flexDirection: 'row',
        height: 80,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    first: {
        // backgroundColor: '#ffffff',
        width: '17.5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    forth: {
        // backgroundColor: '#ffffff',
        width: '22%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    third: {
        // backgroundColor: '#000000',
        width: '26%',
        justifyContent: 'center',
    },

    tinyLogo: {
        width: 30,
        height: 30,

    },
    tinyLogoOB: {
        width: 80,
        height: 80,
        // tintColor: '#000000'
        marginTop: -20
    },
    tinyLogothird: {
        width: 60,
        height: 60,
        tintColor: '#FBC848',
        marginTop: -27
    },
    touchstyle: {
        alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
    },
    txticon: {
        color: '#FBC848',
        fontSize: 11
    },
    ovalBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDD368',
        width: 65,
        height: 65,
        borderRadius: 40,
        marginTop: -40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },
})