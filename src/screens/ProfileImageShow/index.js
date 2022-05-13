import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import TwitterTextView from 'react-native-twitter-textview';
import LinearGradient from 'react-native-linear-gradient';
import {currentDateFN} from '../../Utility/Utils';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';

var windowWidth = Dimensions.get('window').width;

const index = ({navigation}) => {
  const [selectedPostState, setSelectedPostState] = useState(
    global.selectedPost,
  );
  const [defaultHeartColor, setDefaultHeartColor] = useState('#89789A');
  const [heartColor, setHeartColor] = useState('#EC1C1C');
  const [videoHeight, setVideoHeight] = useState(400);

  const getImageSize = async uri =>
    new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  const likeOrUnlikeFN = () => {
    var postID = selectedPostState.post_id;

    var likeOrUnlikeApi = '';
    var arrayTemp = '';

    if (selectedPostState.IsLiked == 1) {
      likeOrUnlikeApi = 'UnLikePost';
    } else {
      likeOrUnlikeApi = 'LikePost';
    }

    var arrayTemp = {...selectedPostState};

    if (arrayTemp.IsLiked == 0) {
      arrayTemp.IsLiked = 1;
      arrayTemp.like_count = parseInt(arrayTemp.like_count) + 1;
    } else {
      arrayTemp.IsLiked = 0;
      arrayTemp.like_count = parseInt(arrayTemp.like_count) - 1;
    }
    setSelectedPostState(arrayTemp);

    fetch(global.address + 'reactToPost', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
      body: JSON.stringify({
        UserID: global.userData.user_id,
        PostID: postID,
        dateTime: currentDateFN(),
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        /* console.log(responseJson); */
      })
      .catch(error => {
        console.error(error);
      });
  };

  const navigateToComment = () => {
    global.postId = selectedPostState.post_id;

    navigation.navigate('CommentScreen');
  };

  const sharePostFN = () => {
    /* console.log( selectedPostState); */

    global.sharePost = selectedPostState;
    navigation.navigate('SharePost');
  };

  const setUpData = async () => {
    var data = global.selectedPost;
    if (!data.img_url.includes('mp4')) {
      const [width, height] = await getImageSize(data.img_url);
      const ratio = windowWidth / width;
      data.calHeight = height * ratio;
    }
    setSelectedPostState(data);
    //console.log(data);
  };

  useEffect(() => {
    setUpData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: global.colorPrimary,
        marginBottom: -30,
      }}>
      <ScrollView style={{marginBottom: 40}}>
        {selectedPostState.img_url.includes('mp4') ? (
          <View key={selectedPostState.img_url}>
            <VideoPlayer
              key={selectedPostState.post_id}
              source={{uri: selectedPostState.img_url}}
              disableFullscreen
              disableBack
              controlTimeout={2500}
              tapAnywhereToPause={true}
              showOnStart={true}
              style={{
                width: '100%',
                height: videoHeight,
              }}
              resizeMode="cover"
              onLoad={response => {
                const {width, height} = response.naturalSize;
                const heightScaled =
                  height * (Dimensions.get('screen').width / width);

                if (heightScaled > 500) {
                  setVideoHeight(500);
                } else {
                  setVideoHeight(heightScaled);
                }
              }}
            />
          </View>
        ) : (
          <ImageBackground
            style={{
              width: '100%',
              height: selectedPostState?.calHeight || 500,
            }}
            resizeMode="stretch"
            source={{uri: selectedPostState.img_url}}>
            <LinearGradient
              colors={[global.overlay1, global.overlay3]}
              style={{
                height: selectedPostState.calHeight,
                width: '100%',
              }}
            />
          </ImageBackground>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileScreen')}
          style={{position: 'absolute', top: 30, left: 18}}>
          <View
            style={{
              opacity: 0.5,
              backgroundColor: '#000',
              height: 45,
              width: 45,
              justifyContent: 'center',
              borderRadius: 45,
            }}>
            <Image
              style={{
                height: 20,
                width: 20,
                tintColor: '#fff',
                alignSelf: 'center',
                marginRight: 5,
              }}
              resizeMode="stretch"
              source={require('../../images/back1.png')}
            />
          </View>
        </TouchableOpacity>

        <ImageBackground
          source={require('../../images/Rectangle.png')}
          resizeMode="stretch"
          style={{
            flexDirection: 'row',
            width: '85%',
            marginLeft: '11%',
            marginTop: 10,
            height: 80,
            borderRadius: 40,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: '28%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {selectedPostState.IsLiked == 0 ? (
              <TouchableOpacity onPress={() => likeOrUnlikeFN()}>
                <View>
                  <Image
                    style={{
                      height: 28,
                      width: 28,
                      marginLeft: 10,
                      marginRight: 2,
                      tintColor: defaultHeartColor,
                    }}
                    resizeMode="stretch"
                    source={require('../../images/Vector.png')}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => likeOrUnlikeFN()}>
                <View>
                  <Image
                    style={{
                      height: 28,
                      width: 28,
                      marginLeft: 10,
                      marginRight: 2,
                      tintColor: heartColor,
                    }}
                    resizeMode="stretch"
                    source={require('../../images/Vector.png')}
                  />
                </View>
              </TouchableOpacity>
            )}
            <Text style={{fontFamily: global.fontSelect}}>
              {selectedPostState.like_count}
            </Text>
          </View>

          <View
            style={{
              width: '28%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => navigateToComment()}>
              <Image
                style={{
                  height: 28,
                  width: 28,
                  marginLeft: 10,
                  marginRight: 2,
                }}
                resizeMode="stretch"
                source={require('../../images/sms.png')}
              />
            </TouchableOpacity>
            <Text style={{fontFamily: global.fontSelect}}>
              {selectedPostState.comment_count}
            </Text>
          </View>

          <View
            style={{
              width: '28%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => sharePostFN()}>
              <Image
                style={{
                  height: 28,
                  width: 28,
                  marginLeft: 10,
                  marginRight: 2,
                }}
                resizeMode="stretch"
                source={require('../../images/share.png')}
              />
            </TouchableOpacity>
            <Text style={{fontFamily: global.fontSelect}}>
              {selectedPostState.share_count}
            </Text>
          </View>
        </ImageBackground>

        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <Avatar
            rounded
            size="small"
            source={{uri: selectedPostState.UserImage}}
          />

          <Text
            style={{
              fontFamily: global.fontSelect,
              color: global.colorTextPrimary,
              marginTop: 10,
              marginLeft: 4,
              fontWeight: 'bold',
            }}>
            {selectedPostState.UserName}
          </Text>
          <TwitterTextView
            onPressHashtag={() => {}}
            hashtagStyle={{color: global.colorTextActive}}
            style={{
              color: global.colorTextPrimary,
              marginLeft: 8,
              marginTop: 10,
            }}>
            {selectedPostState.description}
          </TwitterTextView>
        </View>
      </ScrollView>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  topView: {
    width: '100%',
    height: 85,
    paddingTop: 15,
    paddingLeft: 12,
    flexDirection: 'row',
  },
});
