import React from 'react';
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

var windowWidth = Dimensions.get('window').width;

export default class ProfileImageShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPostState: '',
      defaultHeartColor: '#89789A',
      heartColor: '#EC1C1C',
    };
  }

  getImageSize = async uri =>
    new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  async componentDidMount() {
    console.log(global.selectedPost.img_url);
    const [width, height] = await this.getImageSize(
      global.selectedPost.img_url,
    );
    const ratio = windowWidth / width;
    global.selectedPost.calHeight = height * ratio;

    this.setState({
      selectedPostState: global.selectedPost,
    });
  }

  likeOrUnlikeFN() {
    var postID = this.state.selectedPostState.post_id;

    var likeOrUnlikeApi = '';
    var arrayTemp = '';

    if (this.state.selectedPostState.IsLiked == 1) {
      likeOrUnlikeApi = 'UnLikePost';
    } else {
      likeOrUnlikeApi = 'LikePost';
    }

    var arrayTemp = this.state.selectedPostState;

    if (arrayTemp.IsLiked == 0) {
      arrayTemp.IsLiked = 1;
      arrayTemp.like_count = parseInt(arrayTemp.like_count) + 1;
    } else {
      arrayTemp.IsLiked = 0;
      arrayTemp.like_count = parseInt(arrayTemp.like_count) - 1;
    }

    this.setState({
      selectedPostState: arrayTemp,
    });

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
        console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }

  navigateToComment() {
    global.postId = this.state.selectedPostState.post_id;

    this.props.navigation.navigate('CommentScreen');
  }

  sharePostFN() {
    console.log(this.state.selectedPostState);

    global.sharePost = this.state.selectedPostState;
    this.props.navigation.navigate('SharePost');
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: global.colorPrimary,
          marginBottom: -30,
        }}>
        <ScrollView style={{marginBottom: 40}}>
          <ImageBackground
            style={{
              width: '100%',
              height: this.state.selectedPostState.calHeight,
            }}
            resizeMode="stretch"
            source={{uri: this.state.selectedPostState.img_url}}>
            <LinearGradient
              colors={[global.overlay1, global.overlay3]}
              style={{
                height: this.state.selectedPostState.calHeight,
                width: '100%',
              }}
            />
          </ImageBackground>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ProfileScreen')}
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
              {this.state.selectedPostState.IsLiked == 0 ? (
                <TouchableOpacity onPress={() => this.likeOrUnlikeFN()}>
                  <View>
                    <Image
                      style={{
                        height: 28,
                        width: 28,
                        marginLeft: 10,
                        marginRight: 2,
                        tintColor: this.state.defaultHeartColor,
                      }}
                      resizeMode="stretch"
                      source={require('../../images/Vector.png')}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.likeOrUnlikeFN()}>
                  <View>
                    <Image
                      style={{
                        height: 28,
                        width: 28,
                        marginLeft: 10,
                        marginRight: 2,
                        tintColor: this.state.heartColor,
                      }}
                      resizeMode="stretch"
                      source={require('../../images/Vector.png')}
                    />
                  </View>
                </TouchableOpacity>
              )}
              <Text style={{fontFamily: global.fontSelect}}>
                {this.state.selectedPostState.like_count}
              </Text>
            </View>

            <View
              style={{
                width: '28%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => this.navigateToComment()}>
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
                {this.state.selectedPostState.comment_count}
              </Text>
            </View>

            <View
              style={{
                width: '28%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => this.sharePostFN()}>
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
                {this.state.selectedPostState.share_count}
              </Text>
            </View>
          </ImageBackground>

          <View style={{flexDirection: 'row', marginLeft: 10}}>
            <Avatar
              rounded
              size="small"
              source={{uri: this.state.selectedPostState.UserImage}}
            />

            <Text
              style={{
                fontFamily: global.fontSelect,
                color: global.colorTextPrimary,
                marginTop: 10,
                marginLeft: 4,
                fontWeight: 'bold',
              }}>
              {this.state.selectedPostState.UserName}
            </Text>
            <TwitterTextView
              onPressHashtag={() => {}}
              hashtagStyle={{color: global.colorTextActive}}
              style={{
                color: global.colorTextPrimary,
                marginLeft: 8,
                marginTop: 10,
              }}>
              {this.state.selectedPostState.description}
            </TwitterTextView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topView: {
    width: '100%',
    height: 85,
    paddingTop: 15,
    paddingLeft: 12,
    flexDirection: 'row',
  },
});
