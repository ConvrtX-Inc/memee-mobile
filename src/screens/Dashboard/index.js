import React, { useState, useEffect, useRef } from 'react';
import { View, Text, RefreshControl, TouchableOpacity, BackHandler, Alert, ActivityIndicator, PermissionsAndroid, Animated, Modal, Dimensions, MaskedViewIOS, StyleSheet, ScrollView, Image, FlatList, ImageBackground, ViewBase } from 'react-native';
import ButtonCoins from '../../component/ButtonCoins';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import TwitterTextView from 'react-native-twitter-textview';
import { currentDateFN } from '../../Utility/Utils';
import messaging from '@react-native-firebase/messaging';
import { firebaseConfig } from '../../redux/constants';
import BottomNavBar from '../../component/BottomNavBar';
import { getNotifications } from '../../redux/actions/Auth';
import Toast from 'react-native-toast-message';

var offset = 0;
global.navigateDashboard = 1;
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var gloIndex = "";

export default function Dashboard(props) {

    const navigation = useNavigation();
    const { coinsStored, scrollDown, ImageBottoms, notifications } = useSelector(({ authRed }) => authRed)

    const [dBottomFont, setdBottomFont] = useState(global.fontSelect);
    const dispatch = useDispatch();
    const [followingPost, setFollowingPost] = useState([]);
    const [modalVisible, setModalVisible] = useState("");
    const [postIdToDelete, setPostIdToDelete] = useState("");
    const [defaultHeartColor, setDefaultHeartColor] = useState("#89789A");
    const [heartColor, setHeartColor] = useState("#EC1C1C");

    const [btncolor1_1, setBtncolor1_1] = useState('#FFE299');
    const [btncolor1_2, setBtncolor1_2] = useState('#F6B202');
    const [txtcolor1, setTxtcolor1] = useState('#000000');

    const [btncolor2_1, setBtncolor2_1] = useState('#201E23');
    const [btncolor2_2, setBtncolor2_2] = useState('#201E23');
    const [txtcolor2, setTxtcolor2] = useState('#ABABAD');

    const [btncolor3_1, setBtncolor3_1] = useState('#201E23');
    const [btncolor3_2, setBtncolor3_2] = useState('#201E23');
    const [txtcolor3, setTxtcolor3] = useState('#ABABAD');
    const [pimgChange, setPimgChange] = useState(global.userData.imgurl);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loaderIndicator, setLoaderIndicator] = useState(true);
    const flatlistRef = useRef()

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        selectTab(global.navigateDashboard)
    }, []);

    useEffect(() => {
        selectTab(global.navigateDashboard)
        setdBottomFont(global.fontSelect)

        const unsubscribe = navigation.addListener('focus', () => {

            setdBottomFont(global.fontSelect)

            setPimgChange(global.userData.imgurl)
            global.TabButton = 1;

            SelectedBtnFN(global.navigateDashboard)

            if (global.refresh) {
                getPosts(global.navigateDashboard)
                global.refresh = false
            }

            dispatch(getNotifications())

            messaging().getToken().then(deviceToken => {
                return saveTokenToDatabase(deviceToken);
            });

            return messaging().onTokenRefresh(deviceToken => {
                saveTokenToDatabase(deviceToken);
            });
        });

        return unsubscribe;
    }, [navigation]);


    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);



    function saveTokenToDatabase(deviceToken) {

        fetch(global.address + 'updateDeviceToken/' + global.userData.user_id + "/" + deviceToken, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },

        }).then((response) => response.json())
            .then((responseJson) => {

                // console.log("\n response of device token.... \n",responseJson)

            }).catch((error) => {
                console.error(error);
            });
    }

    function selectTab(index) {
        SelectedBtnFN(index)
        getPosts(index)
    }

    function SelectedBtnFN(btnNo) {

        console.log("Selected tab : ", btnNo);

        global.navigateDashboard = btnNo;

        if (btnNo == 1) {
            setBtncolor1_1(global.btnColor1)
            setBtncolor1_2(global.btnColor2)

            setBtncolor2_1('#201E23')
            setBtncolor2_2('#201E23')

            setBtncolor3_1('#201E23')
            setBtncolor3_2('#201E23')

            setTxtcolor1(global.btnTxt)
            setTxtcolor2('#ABABAD')
            setTxtcolor3('#ABABAD')
        }
        else if (btnNo == 2) {

            setBtncolor1_1('#201E23')
            setBtncolor1_2('#201E23')

            setBtncolor2_1(global.btnColor1)
            setBtncolor2_2(global.btnColor2)

            setBtncolor3_1('#201E23')
            setBtncolor3_2('#201E23')

            setTxtcolor1('#ABABAD')
            setTxtcolor2(global.btnTxt)
            setTxtcolor3('#ABABAD')
        }
        else if (btnNo == 3) {

            setBtncolor1_1('#201E23')
            setBtncolor1_2('#201E23')

            setBtncolor2_1('#201E23')
            setBtncolor2_2('#201E23')

            setBtncolor3_1(global.btnColor1)
            setBtncolor3_2(global.btnColor2)

            setTxtcolor1('#ABABAD')
            setTxtcolor2('#ABABAD')
            setTxtcolor3(global.btnTxt)
        }
        else {
            setBtncolor1_1(global.btnColor1)
            setBtncolor1_2(global.btnColor2)

            setBtncolor2_1('#201E23')
            setBtncolor2_2('#201E23')

            setBtncolor3_1('#201E23')
            setBtncolor3_2('#201E23')

            setTxtcolor1(global.btnTxt)
            setTxtcolor2('#ABABAD')
            setTxtcolor3('#ABABAD')

        }

    }

    const getImageSize = async uri => new Promise(resolve => {
        Image.getSize(uri, (width, height) => {
            resolve([width, height]);
        })
    })

    function getPosts(tabNo, scroll = false) {

        if (scroll && followingPost.length < 50)
            return;

        // setLoaderIndicator(true)
        console.log('getting posts')

        var postApiName = ""
        if (tabNo == 1) {
            postApiName = "GetFollowingPosts"
        }
        else if (tabNo == 2) {
            postApiName = "GetLatestPosts"
        }
        else if (tabNo == 3) {
            postApiName = "GetTrendingPosts"
        }
        else {
            console.log("wrong tab")
        }

        var limit = 50;
        offset = scroll ? offset + 50 : 0;

        fetch(global.address + postApiName + '/' + global.userData.user_id + '/' + offset + '/' + limit, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },

        }).then((response) => response.json())
            .then((responseJson) => {

                setRefreshing(false)

                let data = []

                if (tabNo == 1)
                    data = responseJson.FollowerPosts;
                else if (tabNo == 2)
                    data = responseJson.NewPosts;
                else if (tabNo == 3)
                    data = responseJson.TrendingPosts;

                if (data.length == 0)
                    setLoaderIndicator(false)
                data.forEach(async function (element, index) {
                    element.showMenu = false;
                    const [width, height] = await getImageSize(element.img_url);
                    const ratio = windowWidth / width;
                    element.calHeight = height * ratio;
                    element.calWidth = windowWidth;
                    if (index == data.length - 1) {
                        setTimeout(() => {
                            scroll ? followingPost.push(data) : setFollowingPost(data)
                            setLoaderIndicator(false)
                        }, 2500);
                    }
                });

            }).catch((error) => {
                setRefreshing(false);
                setLoaderIndicator(false)
                console.error(error);
            });
    }

    function navigateToprofileFN() {
        global.profileID = global.userData.user_id;
        navigation.navigate("ProfileScreen")
    }

    function likeOrUnlikeFN(index) {

        var postID = followingPost[index].post_id;
        var arrayTemp = "";

        var arrayTemp = followingPost;

        if (arrayTemp[index].IsLiked == 0) {
            arrayTemp[index].IsLiked = 1;
            arrayTemp[index].like_count = parseInt(arrayTemp[index].like_count) + 1;
        }
        else {
            arrayTemp[index].IsLiked = 0;
            arrayTemp[index].like_count = parseInt(arrayTemp[index].like_count) - 1;
        }
        setFollowingPost(([...arrayTemp]));

        fetch(global.address + "reactToPost", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
            body: JSON.stringify({
                UserID: global.userData.user_id,
                PostID: postID,
                dateTime: currentDateFN(),
            })

        })
    }

    function showMenuFN(index) {

        var followinVar = followingPost;
        followinVar[index].showMenu = !followingPost[index].showMenu,
            setFollowingPost(([...followinVar]));

    }

    function showMenueModalFN(index) {

        gloIndex = index;
        var followinVar = followingPost;
        followinVar[index].showMenu = !followingPost[index].showMenu,

            setFollowingPost(([...followinVar]));
        setModalVisible(true)
        setPostIdToDelete(followingPost[index].post_id)

    }

    function deleteMemeeFN() {
        setModalVisible(false)

        fetch(global.address + 'DeletePost/' + postIdToDelete, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                var postDelArr = followingPost;
                postDelArr.splice(gloIndex, 1);
                setFollowingPost(([...postDelArr]));
            }).catch((error) => {
                Toast.show({
                    type: 'error',
                    text2: "Please check your internet connection.",
                })
                console.error(error);
            });
    }

    function navigateToComment(index) {
        global.postId = followingPost[index].post_id;
        navigation.navigate("CommentScreen");
    }

    function navigationToProfileFN(index) {

        global.profileID = followingPost[index].user_id;
        navigation.navigate("ProfileScreen")
    }

    function sharePostFN(index) {

        // var arrForSC = followingPost
        // var shareCountVar = arrForSC[index].share_count;
        // shareCountVar = parseInt(shareCountVar) + 1;
        // arrForSC[index].share_count = shareCountVar;
        // setFollowingPost(([...arrForSC]));
        // var DateTimeCurrent = currentDateFN()

        global.sharePost = followingPost[index];

        console.log("global.sharePost : ", global.sharePost)
        navigation.navigate("SharePost");
    }

    // for bottom tab
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
    }

    return (
        <View style={{ flex: 1, backgroundColor: global.colorPrimary, }}>
            <FlatList
                ref={flatlistRef}
                data={followingPost}
                onEndReached={() => getPosts(global.navigateDashboard, true)}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                renderItem={({ item, index }) =>
                    <View style={{ width: windowWidth, alignSelf: 'center', marginBottom: 10, }} >

                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                            {item.ParentUserId > 0 ?
                                <View>
                                    <TouchableOpacity onPress={() => navigationToProfileFN(index)}>
                                        <View style={{ marginTop: 15, paddingLeft: 15, flexDirection: 'row' }}>
                                            <View style={{ borderRadius: 35, borderColor: '#fff', borderWidth: 2 }}>
                                                <Avatar
                                                    rounded
                                                    size="medium"
                                                    source={
                                                        { uri: item.UserImage, }
                                                    }
                                                />
                                            </View>

                                            <View style={{ marginLeft: 10 }}>
                                                <Text numberOfLines={1} style={{ fontSize: 18, color: global.colorTextPrimary, marginTop: 0, fontFamily: global.fontSelect }}>{item.UserName} <Text style={{ fontSize: 12 }}>shared this Memee</Text></Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigationToProfileFN(index)}>
                                        <View style={{ marginTop: -25, paddingLeft: 45, flexDirection: 'row' }}>
                                            <View style={{ borderRadius: 35, borderColor: '#fff', borderWidth: 2 }}>
                                                <Avatar
                                                    rounded
                                                    size="small"
                                                    source={
                                                        { uri: item.ParentUserImage, }
                                                    }
                                                />
                                            </View>

                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 15, color: global.colorTextPrimary, marginTop: 6, fontFamily: global.fontSelect }}>{item.ParentUserName}</Text>
                                                {/* <Text style={{ fontSize: 10, color: '#D1BCD4' }}>{item.UserBio}</Text> */}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View>
                                    <TouchableOpacity onPress={() => navigationToProfileFN(index)}>
                                        <View style={{ marginTop: 15, paddingLeft: 15, flexDirection: 'row' }}>
                                            <View style={{ borderRadius: 35, borderColor: '#fff', borderWidth: 2 }}>
                                                <Avatar
                                                    rounded
                                                    size="medium"
                                                    source={
                                                        { uri: item.UserImage, }
                                                    }
                                                />

                                            </View>

                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontSize: 18, color: global.colorTextPrimary, fontFamily: global.fontSelect }}>{item.UserName}</Text>
                                                <Text style={{ fontSize: 12, color: global.colorTextPrimary, fontFamily: global.fontSelect }}>{item.UserBio}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>}
                            {global.userData.user_id == item.user_id ?
                                <TouchableOpacity onPress={() => showMenuFN(index)} style={{ marginLeft: 'auto', marginTop: 27, marginRight: 10 }}>
                                    <View>
                                        <Image
                                            style={{ height: 22, width: 22, marginLeft: 10, marginRight: 2, tintColor: global.colorIcon }}
                                            resizeMode='stretch'
                                            source={require('../../images/more.png')}
                                        />
                                    </View>
                                </TouchableOpacity>

                                : null}
                        </View>

                        <TwitterTextView onPressHashtag={() => { }} hashtagStyle={{ color: global.colorTextActive }} style={{ color: global.colorTextPrimary, marginLeft: '5%', marginTop: 5, marginRight: "5%", fontFamily: global.fontSelect, marginBottom: 15 }}>{item.description}</TwitterTextView>

                        <ImageBackground source={{ uri: item.img_url, }} resizeMode='contain' style={{
                            height: item.calHeight ? item.calHeight : windowWidth,
                            width: '100%',
                        }}>
                            <LinearGradient
                                colors={[global.overlay1, global.overlay3]}
                                style={{ height: '100%', width: '100%' }} />
                        </ImageBackground>

                        <View style={{ width: '100%', backgroundColor: global.colorPrimary }}>

                            <ImageBackground source={require('../../images/Rectangle.png')} resizeMode='stretch' style={{ flexDirection: 'row', width: windowWidth - (windowWidth * 25) / 100, marginLeft: '0%', marginTop: 15, height: windowWidth - (windowWidth * 79) / 100, borderRadius: 40, alignSelf: 'center', }}>

                                <View style={{ width: '26%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                    {item.IsLiked == 0 ?
                                        <TouchableOpacity onPress={() => likeOrUnlikeFN(index)}>
                                            <View>
                                                <Image
                                                    style={{ height: 28, width: 28, marginLeft: 10, marginRight: 2, tintColor: defaultHeartColor }}
                                                    resizeMode='stretch'
                                                    source={require('../../images/Vector.png')}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => likeOrUnlikeFN(index)}>
                                            <View>
                                                <Image
                                                    style={{ height: 28, width: 28, marginLeft: 10, marginRight: 2, tintColor: heartColor }}
                                                    resizeMode='stretch'
                                                    source={require('../../images/Vector.png')}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    }

                                    <Text style={[styles.txtReaction, { fontFamily: global.fontSelect }]}>{item.like_count}</Text>

                                </View>

                                <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => navigateToComment(index)}>
                                        <Image
                                            style={{ height: 28, width: 28, marginLeft: 10, marginRight: 2 }}
                                            resizeMode='stretch'
                                            source={require('../../images/sms.png')}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.txtReaction, { fontFamily: global.fontSelect }]}>{item.comment_count}</Text>
                                </View>

                                <View style={{ width: '32%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => sharePostFN(index)}>
                                        <Image
                                            style={{ height: 28, width: 28, marginLeft: 10, marginRight: 2 }}
                                            resizeMode='stretch'
                                            source={require('../../images/share.png')}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.txtReaction, { fontFamily: global.fontSelect }]}>{item.share_count}</Text>
                                </View>

                            </ImageBackground>


                        </View>

                        <View style={{ width: '100%', height: 3, backgroundColor: global.colorSecondary, marginTop: 20 }}></View>


                        {item.showMenu == true ?

                            <View style={{ padding: 10, borderRadius: 20, position: 'absolute', top: 30, right: 22, backgroundColor: '#fff' }}>

                                {global.userData.user_id == item.user_id ?

                                    <View>
                                        <TouchableOpacity onPress={() => showMenueModalFN(index)}>
                                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                                <Image
                                                    style={{ height: 22, width: 22, marginLeft: 0, marginRight: 10 }}
                                                    resizeMode='stretch'
                                                    source={require('../../images/delete.png')}
                                                />
                                                <Text style={{ fontFamily: global.fontSelect, marginRight: 5 }}>Delete</Text>

                                            </View>
                                        </TouchableOpacity>


                                    </View>
                                    : null}
                            </View>
                            : null}
                    </View>

                }
                keyExtractor={item => item.post_id}
                ListFooterComponent={() => <View>
                    {loaderIndicator == true ?
                        <ActivityIndicator size="large" color={global.colorTextActive} style={{ alignSelf: 'center', marginTop: '10%' }} />
                        : null}
                </View>}
                ListHeaderComponent={() => <View>
                    <View style={styles.topView}>

                        <TouchableOpacity onPress={() => navigateToprofileFN()}>
                            <Avatar
                                rounded
                                size="medium"
                                source={
                                    { uri: pimgChange }
                                }
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")} style={{ marginLeft: 'auto' }}>
                            <Image
                                style={{ height: 50, width: 30, tintColor: global.colorIcon, marginRight: 10 }}
                                resizeMode='contain'
                                source={notifications.some(n => n.status == 0) ? require('../../images/notifications.png') : require("../../images/no_notifications.png")}
                            />
                        </TouchableOpacity>

                        <ButtonCoins
                            title={coinsStored}
                            font={global.fontSelect}
                            onPress={() => navigation.navigate("AddCoins")}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', backgroundColor: '#201E23', width: "93%", height: 60, alignSelf: 'center', borderRadius: 30, marginBottom: 20 }}>

                        <TouchableOpacity onPress={() => selectTab(1)} style={{ width: "33%", }}>
                            {/* <View style={{ height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}> */}
                            <LinearGradient
                                colors={[btncolor1_1, btncolor1_2]}
                                style={{ height: 60, width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 30, }}
                            >
                                <Text style={{ color: txtcolor1, fontFamily: global.fontSelect }}>Following</Text>
                            </LinearGradient>
                            {/* </View> */}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => selectTab(2)} style={{ width: "34%", }}>
                            {/* <View style={{ height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}> */}
                            <LinearGradient
                                colors={[btncolor2_1, btncolor2_2]}
                                style={{ height: 60, width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 30, }}
                            >
                                <Text style={{ color: txtcolor2, fontFamily: global.fontSelect }}>New Memes</Text>
                            </LinearGradient>
                            {/* </View> */}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => selectTab(3)} style={{ width: "33%", }}>
                            {/* <View style={{ height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}> */}
                            <LinearGradient
                                colors={[btncolor3_1, btncolor3_2]}
                                style={{ height: 60, width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 30, }}
                            >
                                <Text style={{ color: txtcolor3, fontFamily: global.fontSelect }}>Trending</Text>
                            </LinearGradient>
                            {/* </View> */}
                        </TouchableOpacity>

                    </View>

                </View>}

            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible)

                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text style={[styles.modalText, { fontFamily: global.fontSelect }]}>Are you sure you want to delete this Meme?</Text>


                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => deleteMemeeFN()}
                            >
                                <LinearGradient
                                    colors={[global.btnColor1, global.btnColor2]}
                                    style={{ paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center', borderRadius: 25, }}
                                >
                                    <Text style={[styles.textStyle, { color: global.btnTxt, fontFamily: global.fontSelect }]}>Delete</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <LinearGradient
                                    colors={['#fefefe', '#868686']}
                                    style={{ paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center', borderRadius: 25, }}
                                >
                                    <Text style={[styles.textStyle, { fontFamily: global.fontSelect }]}>Cancel</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>


            <BottomNavBar
                onPress={(index) => activeTab(index)}
                themeIndex={ImageBottoms}
                navigation={navigation}
                navIndex={0} />
        </View>
    );
}


const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        color: '#E6E6E6',
        marginBottom: 15
    },

    tinyLogo: {
        width: 30,
        height: 30,
        marginTop: 10,
        marginRight: 10,
        tintColor: '#222222',
        alignSelf: 'flex-end'
    },

    Logo: {
        width: 350,
        height: 350,
        marginTop: 10,
        alignSelf: 'center'

    },
    topView: {
        width: '100%',
        height: 85,
        // backgroundColor: '#ffffff',
        paddingTop: 15,
        paddingLeft: 12,
        flexDirection: 'row'
    },

    image: {
        height: 380,
        width: '100%',
        resizeMode: "stretch",
        // justifyContent: "center"

    },
    text: {
        color: "white",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000a0"
    },

    // Modal style
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: '36%',

    },
    modalView: {
        margin: 20,
        borderColor: '#FBC848',
        borderWidth: 1,
        width: '80%',
        backgroundColor: "#201E23",
        borderRadius: 20,
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
    button: {
        borderRadius: 25,
        elevation: 2,
        marginRight: '1%',
        marginTop: '1%'
    },
    buttonOpen: {
        backgroundColor: "#FBC848",
    },
    buttonClose: {
        marginLeft: 15,
        backgroundColor: "#868686",
    },
    textStyle: {
        color: "#000",
        textAlign: "center",
        fontSize: 15
    },
    modalText: {
        marginBottom: 0,
        marginTop: 5,
        textAlign: "center",
        color: '#ffffff'
    },
    txtReaction: {
        fontSize: 20,
        marginLeft: 3,
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


    // modal CSS new post
    centeredViewNewPost: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: '6%',

    },
    modalViewNewPost: {
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
    modalViewImgPickerNewPost: {
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
    modalViewbioNewPost: {
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
    buttonNewPost: {
        borderRadius: 25,

        elevation: 2,
        marginRight: '1%',
        marginTop: '1%'
    },
    buttonOpenNewPost: {
        backgroundColor: "#FBC848",
        alignSelf: 'center'
    },
    buttonCloseNewPost: {
        backgroundColor: "#0B0213",
    },
    textStyleNewPost: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15
    },
    modalTextNewPost: {
        marginBottom: 0,
        marginTop: 0,
        textAlign: "center",

    },

})