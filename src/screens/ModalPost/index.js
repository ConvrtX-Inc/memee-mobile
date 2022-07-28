import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  BackHandler,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Animated,
  Modal,
  Dimensions,
  MaskedViewIOS,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  ViewBase,
  NativeModules,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  PESDK,
  PhotoEditorModal,
  Configuration,
} from 'react-native-photoeditorsdk';
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from '../../Utility/Utils';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
global.navigateDashboard = 1;
var windowWidth = Dimensions.get('window').width;

//Banuba Video Editor
const {VideoEditorModule} = NativeModules;

const openEditor = async () => {
  return await VideoEditorModule.openVideoEditor();
};

export const openVideoEditor = async () => {
  const response = await openEditor();

  if (!response) {
    return null;
  }

  return response?.videoUri;
};

async function getAndroidExportResult() {
  return await VideoEditorModule.openVideoEditor();
}
//End Video Editor
const ModalPost = () => {
  let options = {
    mediaType: 'photo',
    maxWidth: 512,
    maxHeight: 512,
    quality: 1,
  };
  const navigation = useNavigation();

  const [addStoryModalVisible, setAddStoryModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [isOpenMedia, setIsOpenMedia] = useState(false);
  const [loadingAddStory, setLoadingAddStory] = useState(false);
  const [updatedStories, setUpdatedStories] = useState(0);

  // upload image/video
  function uploadImageToS3() {
    setLoadingAddStory(true);

    const data =
      file.type == 'photo'
        ? {
            uri: file.uri,
            name: generateUID() + '.jpg',
            type: 'image/jpeg',
          }
        : {
            uri: file.uri,
            name: generateUID() + '.mp4',
            type: 'video/mp4',
          };

    let reference = storage().ref(data.name);
    let task = reference.putFile(data.uri);

    task
      .then(res => {
        // console.log('Image uploaded to the bucket!');
        reference.getDownloadURL().then(response => {
          //console.log('Image downloaded from the bucket!', response);
          addStory(response);
        });
      })
      .catch(e => {
        // console.error('uploading image error => ', e);
        Toast.show({
          type: 'error',
          text2: 'Unable to add story. Please try again later!',
        });
        setLoadingAddStory(false);
      });
  }

  // Add story body: {userId: XXXX, ImgUrl: XXXX, VideoUrl: XXXX, dateTime: YYYY-MM-DD HH:mm:ss}
  async function addStory(location) {
    const response = await API.AddStory({
      userID: global.userData.user_id,
      ImgUrl: file.type === 'photo' ? location : '',
      VideoUrl: file.type === 'video' ? location : '',
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

    if (response.Status !== 201) {
      Toast.show({
        type: 'error',
        text2: 'Something went wrong. Please try again later!',
      });
      return;
    }
    setIsOpenMedia(false);
    setAddStoryModalVisible(false);
    setFile(null);
    setLoadingAddStory(false);
    setUpdatedStories(updatedStories + 1);
  }

  // delete story body: {story_id: xxxx}
  async function deleteStory(story_id) {
    const response = await API.DeleteStory({story_id});

    if (response.Status !== 200) {
      Toast.show({
        type: 'error',
        text2: 'Something went wrong. Please try again later!',
      });
      return false;
    }
    return true;
  }

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  function openGallery() {
    setIsOpenMedia(true);
    launchImageLibrary(options, response => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        // alert('User cancelled camera picker');
        setIsOpenMedia(false);
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        setIsOpenMedia(false);
        // alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        setIsOpenMedia(false);
        // alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        setIsOpenMedia(false);
        // alert(response.errorMessage);
        return;
      }

      let source = response.assets[0];
      openPhotoEditor(source.uri);
    });
  }
  const openCamera = async () => {
    setIsOpenMedia(true);
    let isStoragePermitted = await requestExternalWritePermission();
    let isCameraPermitted = await requestCameraPermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        //console.log('Response = ', response);

        if (response.didCancel) {
          // alert('User cancelled camera picker');
          setIsOpenMedia(false);
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          // alert('Camera not available on device');
          setIsOpenMedia(false);
          return;
        } else if (response.errorCode == 'permission') {
          // alert('Permission not satisfied');
          setIsOpenMedia(false);
          return;
        } else if (response.errorCode == 'others') {
          // alert(response.errorMessage);
          setIsOpenMedia(false);
          return;
        }

        let source = response.assets[0];
        openPhotoEditor(source.uri);
      });
    }
  };

  function openPhotoEditor(uri) {
    setIsOpenMedia(true);
    PESDK.openEditor({uri: uri}).then(
      result => {
        setIsOpenMedia(false);
        navigation.navigate('NewPost', {uri: result.image, type: 'photo'});
      },
      error => {
        /* console.log(error); */
      },
    );
  }
  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      }}>
      {/* <Modal
        // animationType='slide'
        // transparent={true}
        // visible={addStoryModalVisible}
        
        isOpen={true}
        onClosed={() => setAddStoryModalVisible(false)}
        position="center"
        coverScreen={true}
        transparent={true}> */}
      <View
        style={{
          backgroundColor: '#201E23',
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
          }}>
          <View style={{flexDirection: 'row-reverse'}}>
            <View>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text
                  style={{
                    paddingRight: 15,
                    paddingTop: 15,
                    color: 'white',
                    fontSize: 16,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.centeredView}>
            <View>
              <TouchableOpacity
                disabled={isOpenMedia}
                style={{marginBottom: '8%'}}
                onPress={() => openCamera()}>
                <Text
                  style={{
                    color: '#fff',
                    opacity: 0.5,
                    fontSize: 16,
                  }}>
                  Take photo...
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isOpenMedia}
                style={{marginBottom: '6%'}}
                onPress={() => openGallery()}>
                <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                  Choose photo from library...
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginBottom: '6%'}}
                onPress={() => {
                  setIsOpenMedia(true);
                  if (Platform.OS === 'android') {
                    getAndroidExportResult()
                      .then(videoUri => {
                        setFile({type: 'video', uri: videoUri});
                        navigation.navigate('NewPost', {
                          uri: `file://${videoUri}`,
                          type: 'video',
                        });
                      })
                      .catch(e => {
                        console.error('error', e);
                      });
                  } else {
                    const videoUri = openVideoEditor();
                    //console.log(videoUri);
                  }
                  setIsOpenMedia(false);
                }}>
                <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                  Select Video
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {file && file.type === 'photo' && (
          <ImageBackground
            source={{uri: file && file.uri}}
            resizeMode="contain"
            imageStyle={{
              flex: 1,
              height: '100%',
              width: '100%',
            }}
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
            }}></ImageBackground>
        )}
      </View>
      {/* </Modal> */}
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 15,
  },

  tinyLogo: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginRight: 10,
    tintColor: '#222222',
    alignSelf: 'flex-end',
  },

  Logo: {
    width: 350,
    height: 350,
    marginTop: 10,
    alignSelf: 'center',
  },
  topView: {
    width: '100%',
    height: 85,
    // backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingLeft: 12,
    flexDirection: 'row',
  },

  image: {
    height: 380,
    width: '100%',
    resizeMode: 'stretch',
    // justifyContent: "center"
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000a0',
  },

  // Modal style
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '36%',
  },
  modalView: {
    margin: 20,
    borderColor: '#FBC848',
    borderWidth: 1,
    width: '80%',
    backgroundColor: '#201E23',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 25,
    elevation: 2,
    marginRight: '1%',
    marginTop: '1%',
  },
  buttonOpen: {
    backgroundColor: '#FBC848',
  },
  buttonClose: {
    marginLeft: 15,
    backgroundColor: '#868686',
  },
  textStyle: {
    color: '#000',
    textAlign: 'center',
    fontSize: 15,
  },
  modalText: {
    marginBottom: 0,
    marginTop: 5,
    textAlign: 'center',
    color: '#ffffff',
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
    borderTopRightRadius: 30,
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
    marginTop: -20,
  },
  tinyLogothird: {
    width: 60,
    height: 60,
    tintColor: '#FBC848',
    marginTop: -27,
  },
  touchstyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txticon: {
    color: '#FBC848',
    fontSize: 11,
  },
  ovalBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDD368',
    width: 65,
    height: 65,
    borderRadius: 40,
    marginTop: -40,
    shadowColor: '#000',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
  },
  modalViewNewPost: {
    margin: 20,
    // borderColor: '#FBC848',
    // borderWidth: 1,
    backgroundColor: '#201E23',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewImgPickerNewPost: {
    margin: 20,
    height: 300,
    width: '65%',
    backgroundColor: '#201E23',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewbioNewPost: {
    margin: 20,
    // borderColor: '#FBC848',
    // borderWidth: 1,
    backgroundColor: '#201E23',
    width: '70%',
    height: 270,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    justifyContent: 'space-evenly',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonNewPost: {
    borderRadius: 25,

    elevation: 2,
    marginRight: '1%',
    marginTop: '1%',
  },
  buttonOpenNewPost: {
    backgroundColor: '#FBC848',
    alignSelf: 'center',
  },
  buttonCloseNewPost: {
    backgroundColor: '#0B0213',
  },
  textStyleNewPost: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  modalTextNewPost: {
    marginBottom: 0,
    marginTop: 0,
    textAlign: 'center',
  },
  videoContainer: {flex: 1, justifyContent: 'center'},
  backgroundVideo: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    width: '100%',
    height: 500,
  },
  bottom: {
    flexDirection: 'row',
    height: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  icon: {
    width: windowWidth / 5,
    alignSelf: 'center',
  },
  icon_inside: {
    width: 30,
    height: 30,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  centerIcon: {
    width: windowWidth / 5,
    height: windowWidth / 5,
    marginBottom: 30,
  },
  touchstyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModalPost;
