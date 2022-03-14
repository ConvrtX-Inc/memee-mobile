import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
  NativeModules,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  PESDK,
  PhotoEditorModal,
  Configuration,
} from 'react-native-photoeditorsdk';
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from '../Utility/Utils';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

var windowWidth = Dimensions.get('window').width;

//Banuba Video Editor
const { VideoEditorModule } = NativeModules;

const openEditor = (): Promise<{ videoUri: string } | null> => {
  return VideoEditorModule.openVideoEditor();
};

export const openVideoEditor = async (): Promise<string | null> => {
  const response = await openEditor();

  console.log('response',response)

  if (!response) {
    return null;
  }

  return response?.videoUri;
};

async function getAndroidExportResult() {
  
  return await VideoEditorModule.openVideoEditor();
}
//End Video Editor


const BottomNavBar = ({themeIndex, navIndex, onPress, navigation}) => {
  const [showImagePickerDialog, setShowImagePickerDialog] = useState(false);

  let options = {
    mediaType: 'photo',
    maxWidth: 512,
    maxHeight: 512,
    quality: 1,
  };

  let gradientColors = [];
  let icons = [];
  let iconsSelected = [];
  let centerIcon = null;
  let selectedColor = '';
  let unselectedColor = '';

  global.colorPrimary = '#0D0219';
  global.colorSecondary = '#292929';
  global.colorInput = '#292929';
  global.colorTextPrimary = '#C1C1C1';
  global.colorTextSecondary = '#FFFFFF';
  global.colorTextActive = '#FFCD2F';
  global.colorIcon = '#FFFFFF';
  global.gradientColors = ['#292929', '#292929'];

  if (themeIndex == 1) {
    gradientColors = ['#5D33AD', '#171A59'];

    icons.push(require('../images/earthBlue.png'));
    icons.push(require('../images/exploreBlue.png'));
    icons.push(require('../images/prizeBlue.png'));
    icons.push(require('../images/profileBlue.png'));

    iconsSelected = icons;
    centerIcon = require('../images/postBlue.png');

    selectedColor = '#BB77F0';
    unselectedColor = '#654E77';

    global.gradientColors = ['#5D33AD', '#171A59'];
  } else if (themeIndex == 2) {
    gradientColors = ['#C83A6B', '#8D0E3A'];

    icons.push(require('../images/UniconHome.png'));
    icons.push(require('../images/uniconExplor.png'));
    icons.push(require('../images/uniconCup.png'));
    icons.push(require('../images/Uniconprofile.png'));

    iconsSelected = icons;
    centerIcon = require('../images/uniconMain.png');

    selectedColor = '#FFC7DA';
    unselectedColor = '#EE6293';
  } else if (themeIndex == 3) {
    /* the_100_theme_icon */
    gradientColors = ['#FFD524', '#ECB602'];

    icons.push(require('../images/Home100.png'));
    icons.push(require('../images/earth100.png'));
    icons.push(require('../images/trophy100.png'));
    icons.push(require('../images/profile1000.png'));

    iconsSelected.push(require('../images/Homefilled.png'));
    iconsSelected.push(require('../images/globeFilled.png'));
    iconsSelected.push(require('../images/trophy100Filled.png'));
    iconsSelected.push(require('../images/person100.png'));

    centerIcon = require('../images/M100.png');

    selectedColor = '#000000';
    unselectedColor = '#FFFFFF';

    global.colorPrimary = '#ECB602';
    global.colorSecondary = '#FFDE7E';
    global.colorInput = '#FFFFFF';
    global.colorTextPrimary = '#292929';
    global.colorTextSecondary = '#FFFFFF';
    global.colorTextActive = '#FFFFFF';
    global.colorIcon = '#292929';
    global.gradientColors = ['#FFDE7E', '#FFDE7E'];
  } else if (themeIndex == 4) {
    /* new_year_theme_icon */
    gradientColors = ['#413781', '#413781'];

    icons.push(require('../images/NewYearHome.png'));
    icons.push(require('../images/newYearExplore.png'));
    icons.push(require('../images/newYearPriz.png'));
    icons.push(require('../images/newYearPerson.png'));

    iconsSelected = icons;
    centerIcon = require('../images/newYearMain.png');

    selectedColor = '#FFFFFF';
    unselectedColor = '#B1CCAA';
  } else if (themeIndex == 5) {
    /* save_earth_theme_icon */
    gradientColors = ['#78AC6B', '#49843A'];

    icons.push(require('../images/saveEarthHome.png'));
    icons.push(require('../images/saveEarthExplore.png'));
    icons.push(require('../images/saveEarthPrize.png'));
    icons.push(require('../images/saveEarthPerson.png'));

    iconsSelected = icons;
    centerIcon = require('../images/saveEarthMain.png');

    selectedColor = '#FFFFFF';
    unselectedColor = '#B1CCAA';
  } else if (themeIndex == 6) {
    /* memee_theme_white_icon */
    gradientColors = ['#FFFFFF', '#FFFFFF'];

    icons.push(require('../images/whitehomeWhiteTheme.png'));
    icons.push(require('../images/whiteexploreWhite.png'));
    icons.push(require('../images/whiteTournamentWhite.png'));
    icons.push(require('../images/whiteprofileWhite.png'));

    iconsSelected = icons;
    centerIcon = require('../images/whiteMainM.png');

    selectedColor = '#FFD03B';
    unselectedColor = '#000000';
  } else {
    /* main_theme  */
    gradientColors = ['#292929', '#292929'];

    icons.push(require('../images/Home.png'));
    icons.push(require('../images/world.png'));
    icons.push(require('../images/cup.png'));
    icons.push(require('../images/person.png'));

    iconsSelected.push(require('../images/mainHomFille.png'));
    iconsSelected.push(require('../images/globeMainfilled.png'));
    iconsSelected.push(require('../images/trophyFilledmain.png'));
    iconsSelected.push(require('../images/personMainFilled.png'));

    centerIcon = require('../images/mainM.png');

    selectedColor = '#FFCD2F';
    unselectedColor = '#9B9B9B';
  }

  function openGallery() {
    setShowImagePickerDialog(false);
    launchImageLibrary(options, response => {
      /* console.log('Response = ', response); */

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

      let source = response.assets[0];
      openPhotoEditor(source.uri);
    });
  }



  const openCamera = async () => {
    setShowImagePickerDialog(false);
    let isStoragePermitted = await requestExternalWritePermission();
    let isCameraPermitted = await requestCameraPermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        /* console.log('Response = ', response); */

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

        let source = response.assets[0];
        openPhotoEditor(source.uri);
      });
    }
  };

  function openPhotoEditor(uri) {
    PESDK.openEditor({uri: uri}).then(
      result => {
        
        navigation.navigate('NewPost', {uri: result.image,type:'photo'});
      },
      error => {
        /* console.log(error); */
      },
    );
  }

  return (
    // <View style={[styles.barStyle,{justifyContent: 'center'}]}>
    <View style={[{justifyContent: 'center'}]}>
      <LinearGradient colors={gradientColors} style={styles.bottom} />
      <View style={{flexDirection: 'row', position: 'absolute'}}>
        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => onPress(1)}
            style={styles.touchstyle}>
            <Image
              style={styles.icon_inside}
              source={navIndex == 0 ? iconsSelected[0] : icons[0]}
            />
            <Text
              style={{
                color: navIndex == 0 ? selectedColor : unselectedColor,
                fontSize: 11,
                fontFamily: global.fontSelect,
              }}>
              Home
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => onPress(2)}
            style={styles.touchstyle}>
            <Image
              style={styles.icon_inside}
              source={navIndex == 1 ? iconsSelected[1] : icons[1]}
            />
            <Text
              style={{
                color: navIndex == 1 ? selectedColor : unselectedColor,
                fontSize: 11,
                fontFamily: global.fontSelect,
              }}>
              Explore
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => setShowImagePickerDialog(true)}
            style={styles.touchstyle}>
            <View>
              <Image
                style={styles.centerIcon}
                resizeMode="stretch"
                source={centerIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => onPress(3)}
            style={styles.touchstyle}>
            <Image
              style={styles.icon_inside}
              source={navIndex == 2 ? iconsSelected[2] : icons[2]}
            />
            <Text
              style={{
                color: navIndex == 2 ? selectedColor : unselectedColor,
                fontSize: 11,
                fontFamily: global.fontSelect,
              }}>
              Tournament
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => onPress(4)}
            style={styles.touchstyle}>
            <Image
              style={styles.icon_inside}
              source={navIndex == 3 ? iconsSelected[3] : icons[3]}
            />
            <Text
              style={{
                color: navIndex == 3 ? selectedColor : unselectedColor,
                fontSize: 11,
                fontFamily: global.fontSelect,
              }}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showImagePickerDialog}
        onRequestClose={() => {
          setShowImagePickerDialog(!showImagePickerDialog);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewImgPicker}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: '15%',
                marginTop: '3%',
              }}>
              Select File
            </Text>

            <TouchableOpacity
              style={{marginBottom: '8%'}}
              onPress={() => openCamera()}>
              <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                Take photo...
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginBottom: '6%'}}
              onPress={() => openGallery()}>
              <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                Choose Photo from library...
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginBottom: '6%'}}
              onPress={() => {
                setShowImagePickerDialog(false);
                if (Platform.OS === 'android') {
                  getAndroidExportResult().then(videoUri => {
                    console.log(videoUri)
                    // alert("VIDEO URI TO BE SAVED IN DB"+videoUri)
                    navigation.navigate('NewPost', {uri: `file://${videoUri}`,type:'video'});
                  }).catch(e => {
                    console.log("error",e)
                    console.log(e)
                  })
                } else {
                  const videoUri = openVideoEditor();
                  console.log(videoUri)
                }
              }}>
              <Text style={{color: '#fff', opacity: 0.5, fontSize: 16}}>
                Select Video
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonOpen, {marginTop: '20%'}]}
              onPress={() => setShowImagePickerDialog(false)}>
              <LinearGradient
                colors={[global.btnColor1, global.btnColor2]}
                style={{
                  paddingHorizontal: 27,
                  paddingVertical: 15,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 22,
                }}>
                <Text style={[styles.modalText, {color: global.btnTxt}]}>
                  Close
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  modalViewImgPicker: {
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
  },
  button: {
    borderRadius: 25,
    elevation: 2,
    marginRight: '1%',
    marginTop: '1%',
  },
  buttonOpen: {
    backgroundColor: '#FBC848',
    alignSelf: 'center',
  },
  modalText: {
    marginBottom: 0,
    marginTop: 0,
    textAlign: 'center',
  },
  barStyle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default BottomNavBar;
