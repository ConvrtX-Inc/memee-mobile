import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Avatar} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {formatDateTime} from '../../Utility/Utils';
import {FOLLOW_REQUESTS} from '../../redux/constants';
import {readNotifications} from '../../redux/actions/Auth';

export default function ActivityNotification() {
  const {notifications, followRequests} = useSelector(({authRed}) => authRed);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      /* console.log('Screen was focused'); */
      /* console.log(followRequests); */
      showFollowRequestFN();
      dispatch(readNotifications());

      // Do something when the screen is focused
      return () => {
        /* console.log('Screen was unfocused'); */
      };
    }, []),
  );
  // function profileDataFN() {
  //   fetch(global.address + 'GetUserProfile/' + global.profileID, {
  //     method: 'get',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       authToken: global.token,
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       console.log('asds', responseJson.posts);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }
  function handleNotificationClick(data) {
    /* console.log(data); */
    if (data.type == 'comment') {
      global.postId = data.object_id;
      console.log(global.postId)
      navigation.navigate('CommentScreen');
    } else if (data.type == 'like') {
      console.log('Liked click');
      global.postId = data.object_id;
      navigation.navigate('CommentScreen');
    } else if (data.type == 'share') {
      console.log('shared click');
      global.selectedPost = {
        post_id: data.object_id,
        user_id: '125',
        img_url:
          'https://firebasestorage.googleapis.com/v0/b/memee-app-d35d3.appspot.com/o/538bec8d-eda3-4e78-99d2-ac4af6e8e86a.jpg?alt=media&token=e0da5206-e74c-4470-848a-9fb523e4e7b4',
        like_count: '1',
        comment_count: '1',
        share_count: '0',
        description:
          '\\u0049\\u0020\\u0077\\u0061\\u006E\\u0074\\u0020\\u0074\\u006F\\u0020\\u0066\\u006C\\u0079\\u0020\\u0061\\u0077\\u0061\\u0079\\u0020',
        datetime: '2022-05-1714:09:36',
        UserName: 'test account vince',
        UserImage:
          'https://firebasestorage.googleapis.com/v0/b/memee-app-d35d3.appspot.com/o/ecaf9651-d996-4be2-825b-3039e9779dfc.jpg?alt=media&token=f6e0c943-42c7-41d6-833c-b3c1413bd0aa',
        IsLiked: '1',
        tournament: [],
      };
      navigation.navigate('ProfileImageShow');
    }
  }

  function showFollowRequestFN() {
    fetch(global.address + 'GetFollowRequests/' + global.userData.user_id, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        dispatch({type: FOLLOW_REQUESTS, data: responseJson.Requests});
      })
      .catch(error => {
        console.error(error);
      });
  }

  function getAction(val) {
    if (val == 'like') return 'has liked your memee.';
    if (val == 'comment') return 'has commented on your memee.';
    if (val == 'share') return 'has shared your memee.';
  }

  return (
    <View
      style={{flex: 1, paddingTop: '2%', backgroundColor: global.colorPrimary}}>
      <ScrollView>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FollowRequest', {requests: followRequests})
          }>
          <View
            style={{
              width: '100%',
              paddingTop: 10,
              paddingBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: global.activityBorderBottomColor,
              borderBottomWidth: 1,
            }}>
            <Image
              style={{height: 50, width: 50, tintColor: global.colorIcon}}
              resizeMode="stretch"
              source={require('../../images/request.png')}
            />

            <View style={{width: '60%', height: 60, marginLeft: 10}}>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 4,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Follow Requests
              </Text>
              <Text
                style={{
                  color: global.colorTextPrimary,
                  fontSize: 13,
                  marginTop: 2,
                  fontFamily: global.fontSelect,
                }}>
                {' '}
                Approve or ignore requests
              </Text>
            </View>

            <View
              style={{
                width: '20%',
                height: 60,
                marginLeft: 'auto',
                flexDirection: 'row',
              }}>
              {followRequests?.length > 0 ? (
                <View
                  style={{
                    backgroundColor: global.followRequestCountBG,
                    height: 26,
                    width: 26,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      color: global.followRequestCountTextColor,
                      fontSize: 11,
                      fontFamily: global.fontSelect,
                    }}>
                    {followRequests?.length}
                  </Text>
                </View>
              ) : (
                <View style={{height: 26, width: 26}} />
              )}

              <Image
                style={{
                  height: 15,
                  width: 9,
                  tintColor: global.colorTextPrimary,
                  alignSelf: 'center',
                  marginLeft: '10%',
                }}
                resizeMode="stretch"
                source={require('../../images/farward.png')}
              />
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          data={notifications}
          renderItem={({item, index}) => (
            <TouchableOpacity
              // disabled={true}
              onPress={() => handleNotificationClick(item)}
              style={{
                width: '100%',
                paddingVertical: 5,
                flexDirection: 'row',
                marginTop: 10,
                paddingStart: 10,
                borderRadius: 10,
                backgroundColor:
                  item.status == 0
                    ? global.colorSecondary
                    : global.colorPrimary,
              }}>
              <Avatar rounded size="medium" source={{uri: item.Image}} />

              <View style={{width: '90%', height: 62, marginLeft: 10}}>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginTop: 4,
                    fontFamily: global.fontSelect,
                  }}>
                  {item.Name}
                  <Text
                    style={{
                      color: global.colorTextPrimary,
                      fontSize: 11,
                      marginTop: 2,
                      fontFamily: global.fontSelect,
                    }}>
                    {' '}
                    {getAction(item.type)}
                  </Text>
                </Text>
                <Text
                  style={{
                    color: global.colorTextPrimary,
                    fontSize: 11,
                    marginTop: 2,
                    fontFamily: global.fontSelect,
                  }}>
                  {' '}
                  {formatDateTime(item.date_time)}
                </Text>
              </View>

              {/* <View style={{ width: '20%', height: 60, marginLeft: 'auto', flexDirection: 'row' }}>
                                <ButtonExtraSmall
                                    title="Follow"
                                    bgClrFirst={global.btnColor1}
                                    bgClrSecond={global.btnColor2}
                                    btnTxtClr={global.btnTxt}
                                    font={global.fontSelect}
                                />
                            </View> */}
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          style={{marginTop: 20}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
  },
});
