import React, { useState } from 'react';
// import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, ScrollView, Modal, Image, ImageBackground, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Input from '../../component/InputField';
import ButtonLarge from '../../component/ButtonLarge';
import ButtonLargeIndicator from '../../component/ButtonLargeIndicator';
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { generateUID } from '../../Utility/Utils';
import { RNS3 } from 'react-native-aws3';
import { useDispatch, useSelector } from 'react-redux';
import { coinsRecordFN } from '../../redux/actions/Auth';
import Toast from 'react-native-toast-message';
import { getBucketOptions } from '../../Utility/Utils';

export default function EditProfileScreen(props) {

    const navigation = useNavigation();
    const dispatch = useDispatch()

    const [modalVisibleImgPicker, setModalVisibleImgPicker] = useState(false);
    const [filePath, setFilePath] = useState({});
    const [showPimg, setShowPimg] = useState(false);
    const [email, setEmail] = useState(global.userData.email);
    const [name, setName] = useState(global.userData.name);
    const [phone, setPhone] = useState(global.userData.phone);
    const [bio, setBio] = useState(global.userData.bio);
    const [indicatButton, setIndicatButton] = useState(false);

    const [emailChanged, setEmailChanged] = useState(global.userData.email);
    const [nameChanged, setNameChanged] = useState(global.userData.name);

    const [imgUrl, setImgUrl] = useState(global.userData.imgurl);

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
    };

    function uploadImageToS3(source) {

        setIndicatButton(true)

        const file = {
            uri: source.uri,
            name: generateUID() + ".jpg",
            type: source.type
        }
        RNS3.put(file, getBucketOptions("posts")).then(response => {
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");

            setImgUrl(response.body.postResponse.location)
            setIndicatButton(false)
        }).catch((error) => {
            console.error(error);
            setIndicatButton(false)
        });
    }

    function saveChanges() {

        setIndicatButton(true)
       
        global.userData.imgurl = imgUrl;
        fetch(global.address + 'UpdateProfile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth_token': global.token
            },
            body: JSON.stringify({
                userName: name,
                userImage: imgUrl,
                bio: bio,
                phone: phone,
                userId: global.userData.user_id,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                global.refresh = true
                navigation.navigate('Dashboard')
                setIndicatButton(false)
                if (responseJson.Status == '201') {
                    global.token = responseJson.Token
                    global.userData = responseJson.User[0]
                }
            }).catch((error) => {
                Toast.show({
                    type: 'error',
                    text2: "Please check your internet connection.",
                })
                setIndicatButton(false)
                console.error(error);
            });
    }

    return (
        <View style={{ flex: 1, paddingLeft: "5%", paddingTop: "5%", backgroundColor: global.colorPrimary  }}>
            <ScrollView>

                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            style={[styles.tinyLogo, {tintColor: global.colorIcon}]}
                            source={require('../../images/back1.png')}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, { fontFamily: global.fontSelect, color: global.colorIcon}]}>Edit Profile</Text>
                </View>

                <View style={{ marginLeft: '-5%' }}>
                    <TouchableOpacity onPress={() => setModalVisibleImgPicker(true)} style={{ alignSelf: "center", marginTop: 50, borderWidth: 3, borderColor: '#fff', borderRadius: 80 }}>

                        {showPimg == false ?
                            <Avatar
                                rounded
                                size="xlarge"
                                source={
                                    { uri: global.userData.imgurl }
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
                    <Image
                        style={{ height: 40, width: 40, marginLeft: '58%', marginTop: -39 }}
                        resizeMode='stretch'
                        source={require('../../images/imgCameraPick.png')}
                    />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: '-5%' }}>
                    <Text style={{ fontWeight: 'bold', color: global.colorTextPrimary, fontSize: 22, marginTop: 8, fontFamily: global.fontSelect, }}>{nameChanged}</Text>
                    <Text style={{ color: global.colorTextPrimary, opacity: 0.7, fontSize: 11, marginTop: 4, fontFamily: global.fontSelect, }}>{emailChanged}</Text>
                </View>

                <View style={{ width: '90%', alignSelf: 'center', marginTop: 75, marginBottom: -6 }}>
                    <Text style={{ color: global.colorTextPrimary, opacity: 0.7, fontSize: 11, marginTop: 4, fontFamily: global.fontSelect, }}>NAME</Text>
                </View>
                <Input
                    placeholder="Name"
                    onChangeText={text => setName(text)}
                    value={name}
                    secureTextEntry={false}
                    color={global.colorTextPrimary}
                />

                <View style={{ width: '90%', alignSelf: 'center', marginTop: 20, marginBottom: -6 }}>
                    <Text style={{ color: global.colorTextPrimary, opacity: 0.7, fontSize: 11, marginTop: 4, fontFamily: global.fontSelect, }}>EMAIL</Text>
                </View>
                <Input
                    placeholder="Email"
                    onChangeText={text => setEmail(text)}
                    value={email}
                    secureTextEntry={false}
                    Editable={false}
                    color={global.colorTextPrimary}
                />

                <View style={{ width: '90%', alignSelf: 'center', marginTop: 20, marginBottom: -6 }}>
                    <Text style={{ color: global.colorTextPrimary, opacity: 0.7, fontSize: 11, marginTop: 4, fontFamily: global.fontSelect, }}>PHONE</Text>
                </View>
                <Input
                    placeholder="Phone"
                    onChangeText={text => setPhone(text)}
                    value={phone}
                    secureTextEntry={false}
                    color={global.colorTextPrimary}
                    />

                <View style={{ width: '90%', alignSelf: 'center', marginTop: 20, marginBottom: -6 }}>
                    <Text style={{ color: global.colorTextPrimary, opacity: 0.7, fontSize: 11, marginTop: 4, fontFamily: global.fontSelect, }}>BIO</Text>
                </View>
                <Input
                    placeholder="Bio"
                    onChangeText={text => setBio(text)}
                    value={bio}
                    secureTextEntry={false}
                    color={global.colorTextPrimary}
                />

                <View style={{ marginTop: 20, marginBottom: 20 }}>
                    {indicatButton == false ?
                        <ButtonLarge
                            title="Save"
                            onPress={() => saveChanges()}
                            bgClrFirst={global.btnColor1}
                            bgClrSecond={global.btnColor2}
                            txtClr={global.btnTxt}
                            font={global.fontSelect}
                        />
                        :
                        <ButtonLargeIndicator
                            title="Save"
                            // onPress={() => navigation.navigate("")}
                            bgClrFirst={global.btnColor1}
                            bgClrSecond={global.btnColor2}
                            txtClr={global.btnTxt}
                        />
                    }
                </View>

            </ScrollView>

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
                    <View style={[styles.modalViewImgPicker, {backgroundColor: '#201E23'}]}>

                        <Text style={{ color: global.colorIcon, fontWeight: 'bold', fontSize: 18, marginBottom: '15%', marginTop: '3%' }}>Select Image</Text>

                        <TouchableOpacity style={{ marginBottom: '8%' }} onPress={() => captureImage('photo')}>
                            <Text style={{ color: global.colorIcon, opacity: 0.5, fontSize: 16 }}>Take Photo..</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginBottom: '6%' }} onPress={() => chooseFile('photo')}>
                            <Text style={{ color: global.colorIcon, opacity: 0.5, fontSize: 16 }}>Choose from Library..</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.buttonOpen, { marginTop: '20%' }]} onPress={() => setModalVisibleImgPicker(false)} >
                            <LinearGradient
                                colors={[global.btnColor1, global.btnColor2]}
                                style={{ paddingHorizontal: 27, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center', borderRadius: 22, }}
                            >
                                <Text style={[styles.modalText, {color: global.btnTxt}]}>Close</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({

    tinyLogo: {
        width: 30,
        height: 20,
        marginTop: 10,
        tintColor: global.colorIcon
    },
    title: {
        fontSize: 25,
        color: global.colorIcon,
        marginBottom: 25
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: '6%',

    },
    modalView: {
        margin: 20,
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

})
