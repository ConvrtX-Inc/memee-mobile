import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleSheet,
  Linking,
  Text,
  Image,
} from 'react-native';
import {colors} from '../../Utility/colors';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Send,
  Avatar,
  Time,
} from 'react-native-gifted-chat';
const axios = require('axios');
import messaging from '@react-native-firebase/messaging';
const windowWidth = Dimensions.get('window').width;
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {generateUID} from '../../Utility/Utils';
import {RNS3} from 'react-native-aws3';
import {getLastSeenFormat} from '../../Utility/Utils';
import {getBucketOptions} from '../../Utility/Utils';
import storage from '@react-native-firebase/storage';

const ChatScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [otherChatUser, setOtherChatUser] = useState();
  const [currentChatUser, setCurrentChatUser] = useState();
  const {conversationId} = route.params;

  useEffect(() => {
    if (messages.length == 0) getConversation(0);
  }, [1]);

  function setMessagesView(data) {
    let currentUserID = global.userData.user_id;
    let _id = 2;
    data.users.forEach(value => {
      users.push({
        _id: value.id == currentUserID ? 1 : _id++,
        name: value.name,
        avatar: value.avatar,
        userId: value.id,
      });

      if (currentUserID != value.id) setOtherChatUser(value);
    });

    let messages = [];
    _id = 1;
    data.messages.forEach(value => {
      messages.push({
        _id: _id++,
        text: value.Type == 'text' ? value.Content : null,
        location:
          value.Type == 'location'
            ? {
                latitude: parseFloat(value.Content.split(',')[0]),
                longitude: parseFloat(value.Content.split(',')[1]),
              }
            : '',
        createdAt: value.DateCreated,
        user: users.find(element => element.userId == value.SentBy),
        image: value.Type == 'image' ? value.Content : null,
      });
    });

    setCurrentChatUser(users.find(element => element.userId == currentUserID));
    setMessages(messages);
  }

  function getConversation(offset) {
    axios
      .get(`${global.address}getConversation/${conversationId}/${offset}`)
      .then(function (response) {
        // handle success
        /* console.log(response.data); */
        setMessagesView(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  function sendMessage(msg, type) {
    var data = {
      ConversationID: conversationId,
      Type: type,
      Content: type == 'image' ? msg[0].image : msg[0].text,
      SentBy: global.userData.user_id,
    };

    console.log('data', data);

    setMessages(previousMessages => GiftedChat.append(previousMessages, msg));

    axios({
      method: 'post',
      url: `${global.address}sendMessage`,
      data: data,
      validateStatus: status => {
        return true;
      },
    })
      .catch(error => {
        console.log(error);
      })
      .then(Response => {});

    // axios
    //   .post(`${global.address}sendMessage`, data)
    //   .then(function (response) {})
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }

  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      /* console.log('msgggg', remoteMessage); */
      var msg = {
        _id: remoteMessage.messageId,
        text:
          remoteMessage.notification.body.trim() == 'Shared this image'
            ? ''
            : remoteMessage.notification.body,
        createdAt: remoteMessage.sentTime,
        user: users.find(
          element => element.userId == remoteMessage.data.objectId,
        ),
        image:
          remoteMessage.notification.body.trim() == 'Shared this image'
            ? remoteMessage.data.image
            : null,
      };
      if (msg.user.userId != global.userData.user_id)
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, msg),
        );
    });
  }, []);

  const onSend = useCallback((messages = []) => {
    sendMessage(messages, 'text');
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: '#FFCD2F',
            marginBottom: 15,
          },
          left: {
            backgroundColor: '#292929',
            marginBottom: 15,
          },
        }}
        textStyle={{
          right: {
            color: 'black',
          },
          left: {
            color: 'white',
          },
        }}
      />
    );
  }

  function renderInputToolbar(props) {
    return (
      <View
        style={{
          marginTop: 40,
          width: '90%',
          alignSelf: 'center',
          marginBottom: 20,
        }}>
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: 'transparent',
            borderTopColor: '#E8E8E8',
            borderTopWidth: 0,
            textColor: 'white',
            alignItems: 'center',
          }}
          primaryStyle={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        />
      </View>
    );
  }

  const renderTime = props => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: 'white',
          },
          right: {
            color: 'black',
          },
        }}
      />
    );
  };

  function renderAvatar(props) {
    return (
      <Avatar
        {...props}
        imageStyle={{
          left: {
            marginBottom: 15,
          },
          right: {
            marginBottom: 15,
          },
        }}
      />
    );
  }

  const galleryButton = sendProps => {
    return (
      <View flexDirection="row">
        <TouchableOpacity
          onPress={() => chooseFile()}
          style={styles.myStyle}
          activeOpacity={0.5}>
          <Image
            source={require('../../images/gallery.png')}
            style={{
              height: 25,
              width: 25,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const chooseFile = () => {
    let options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // setChatModal(true)
        const file = {
          uri: response.assets[0].uri,
          name: generateUID() + '.jpg',
          type: 'image/jpeg',
        };

        let reference = storage().ref(file.name);
        let task = reference.putFile(file.uri);

        task
          .then(response => {
            console.log('Image uploaded to the bucket!');
            reference.getDownloadURL().then(response => {
              /* console.log('Image downloaded from the bucket!', response); */

              var valueToPush = {};
              valueToPush['_id'] = Math.floor(Math.random() * 100000);
              valueToPush['text'] = '';
              valueToPush['createdAt'] = new Date();
              valueToPush['user'] = users.find(
                element => element.userId == global.userData.user_id,
              );
              valueToPush['image'] = response;

              let msg = [];
              msg.push(valueToPush);
              sendMessage(msg, 'image');
            });
          })
          .catch(e => {
            console.log('uploading image error => ', e);
          });

        /* RNS3.put(file, getBucketOptions('chat')).then(response => {
          if (response.status !== 201)
            throw new Error('Failed to upload image to S3');
          // setChatModal(false)

          var valueToPush = {};
          valueToPush['_id'] = Math.floor(Math.random() * 100000);
          valueToPush['text'] = '';
          valueToPush['createdAt'] = new Date();
          valueToPush['user'] = users.find(
            element => element.userId == global.userData.user_id,
          );
          valueToPush['image'] = response.body.postResponse.location;

          let msg = [];
          msg.push(valueToPush);
          sendMessage(msg, 'image');
        }); */
      }
    });
  };

  return (
    <View style={styles.containerStyle}>
      {otherChatUser ? (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerArrow}>
            <Icon name="arrowleft" size={24} color={colors.textColor} />
          </TouchableOpacity>
          {otherChatUser.avatar != '' ? (
            <Image
              source={{uri: otherChatUser.avatar}}
              style={[styles.addFriendImage, {}]}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../../images/person1.png')}
              style={[styles.addFriendImage, {}]}
              resizeMode="cover"
            />
          )}
          {otherChatUser.onlineStatus == '1' ? (
            <View>
              <Image
                source={require('../../images/online.png')}
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 10,
                  marginLeft: -15,
                  marginTop: 20,
                }}
                resizeMode="cover"
              />
            </View>
          ) : null}
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.headerText}>{otherChatUser.name}</Text>
            {otherChatUser.onlineStatus == '0' && otherChatUser.lastSeen ? (
              <Text style={styles.simpleText}>
                {getLastSeenFormat(otherChatUser.lastSeen)}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}
      <GiftedChat
        alwaysShowSend
        placeholder="Type a message"
        messages={messages}
        onSend={msg => onSend(msg)}
        user={currentChatUser}
        renderAvatar={renderAvatar}
        showUserAvatar={true}
        renderBubble={renderBubble}
        renderTime={props => renderTime(props)}
        renderSend={props => (
          <Send {...props}>
            <Image
              source={require('../../images/send.png')}
              style={{height: 22, width: 22, marginBottom: 15, marginLeft: 10}}
            />
          </Send>
        )}
        renderInputToolbar={props => renderInputToolbar(props)}
        renderActions={messages => galleryButton(messages)}
        textInputStyle={{
          backgroundColor: '#292929',
          borderRadius: 20,
          paddingLeft: 20,
          paddingRight: 20,
          color: 'white',
        }}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#0D0219',
  },
  header: {
    marginHorizontal: '5%',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    // justifyContent: 'space-between'
  },
  headerText: {
    color: colors.textColor,
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
    marginRight: 10,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  simpleText: {
    color: colors.textColor,
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    marginRight: 10,
    marginLeft: 10,
  },
  headerArrow: {
    marginTop: 4,
  },
  userImage: {height: 50, width: 50, borderRadius: 50 / 2},
  inputView: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginBottom: 20,
    borderColor: colors.placeholderColor,
    borderWidth: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
  },
  input: {
    minHeight: 50,
    maxHeight: 120,
    width: '65%',
    marginLeft: '5%',
    fontSize: 16,
    fontFamily: 'Gilroy-Regular',
    color: colors.textColor,
  },
  micButton: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  micImage: {
    height: 25,
    width: 25,
  },
  sendButton: {
    height: 45,
    width: 45,
    backgroundColor: colors.buttonBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2.5,
    marginLeft: 'auto',
    marginRight: '3%',
  },
  sendImage: {
    height: 22,
    width: 22,
    tintColor: colors.textColor,
  },
  myStyle: {
    alignItems: 'center',
    borderColor: '#fff',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    marginLeft: '-5%',
    marginRight: '5%',
    marginBottom: 5,
  },
  addFriendImage: {
    marginStart: 10,
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
});
