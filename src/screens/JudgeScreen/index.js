import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  Image,
  ToastAndroid,
  Modal,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

import {useNavigation} from '@react-navigation/native';
import {MonthsArray} from '../../Utility/Utils';

var windowWidth = Dimensions.get('window').width;
windowWidth = (windowWidth * 85) / 100;
var seassionWidth = (windowWidth * 80) / 100;
var windowWidthSeasion = (windowWidth * 20) / 100;
var Width3rd = (windowWidth * 33) / 100;
export default function JudgeScreen(props) {
  const currentDateTime = new Date();
  const currentMonth = currentDateTime.getMonth();
  const navigation = useNavigation();
  const [indicatButton, setIndicatButton] = useState(false);
  const [rankingData, setRankingData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetJudgePostFN();
    });
    GetJudgePostFN();

    return unsubscribe;
  }, [navigation]);

  function GetJudgePostFN() {
    var today = new Date();
    var yyy = today.getFullYear();

    var month = today.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    var ddd = today.getDate();
    if (ddd < 10) {
      ddd = '0' + ddd;
    }

    var date = yyy + '-' + month + '-' + ddd;
    //console.log(global.address + 'JudgeHistory/' + global.userData.user_id);

    fetch(global.address + 'availableTournaments/' + global.userData.user_id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authToken: global.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson);

        var data = responseJson.Data;
        let temp = [];
        data.forEach((element, index) => {
          if (index < 1) {
            var m = MonthsArray.indexOf(element.month) + 1;
            temp.push({
              ...element,
              NoOfPosts: data.filter(
                item => item.tournament_id == element.tournament_id,
              ).length,
              months: m,
              ongoing: m == currentMonth + 1 ? 1 : 0,
            });
          } else if (element.tournament_id != data[index - 1].tournament_id) {
            var m = MonthsArray.indexOf(element.month) + 1;
            temp.push({
              ...element,
              NoOfPosts: data.filter(
                item => item.tournament_id == element.tournament_id,
              ).length,
              months: m,
              ongoing: m == currentMonth + 1 ? 1 : 0,
            });
          }
        });
        //console.error(temp);

        setRankingData(temp);
      })
      .catch(error => {
        console.error(error);
      });

    // mock data
    /* setRankingData([
      {
        days: '01',
        NoOfPosts: 60,
      },
      {
        days: '02',
        NoOfPosts: 100,
      },
      {
        days: '03',
        NoOfPosts: 100,
      },
      {
        days: '04',
        NoOfPosts: 100,
      },
      {
        days: '05',
        NoOfPosts: 10,
      },
    ]); */
  }

  function navigatToJudgeScreenFN() {
    navigation.navigate('JudgeMeme');
    /* if (global.userData.participated_in_tournament == 0) {
      Toast.show({
        type: 'error',
        test1: 'Alert!',
        text2: 'You have not entered the tournament yet!',
      });
    } else {
      navigation.navigate('JudgeMeme');
    } */
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: '0%',
        backgroundColor: global.colorPrimary,
        paddingBottom: 50,
      }}>
      <ScrollView>
        <Image
          style={{
            width: windowWidth,
            height: (windowWidth * 70) / 100,
            alignSelf: 'center',
          }}
          resizeMode="stretch"
          source={require('../../images/judge1.png')}
        />

        <TouchableOpacity
          onPress={() => navigatToJudgeScreenFN()}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderRadius: (windowWidth * 10) / 100,
            marginTop: -(windowWidth * 16.5) / 100,
            width: (windowWidth * 30) / 100,
            height: (windowWidth * 12) / 100,
            backgroundColor: '#fff',
          }}>
          <Text style={{fontSize: 11, fontFamily: global.fontSelect}}>
            Lets judge
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: global.fontSelect,
            color: global.colorTextPrimary,
            marginTop: 30,
            marginLeft: 10,
            fontWeight: 'bold',
            fontSize: 15,
          }}>
          History
        </Text>

        {rankingData.length > 0 ? (
          <View
            style={{
              width: '100%',
              marginTop: 10,
              marginBottom: 5,
              height: 50,
              borderRadius: 25,
              flexDirection: 'row',
              backgroundColor: '#292929',
            }}>
            <View
              style={{
                width: '33%',
                height: 50,
                borderTopLeftRadius: 22,
                borderBottomLeftRadius: 22,
              }}>
              <LinearGradient
                colors={[global.btnColor1, global.btnColor2]}
                style={{
                  height: 50,
                  width: '100%',
                  borderTopLeftRadius: 22,
                  borderBottomLeftRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: global.btnTxt,
                    fontSize: 13,
                    fontFamily: global.fontSelect,
                    fontWeight: 'bold',
                  }}>
                  Month
                </Text>
              </LinearGradient>
            </View>

            <View
              style={{
                width: '34%',
                height: 50,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#292929',
              }}>
              <LinearGradient
                colors={[global.btnColor1, global.btnColor2]}
                style={{
                  height: 50,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: global.btnTxt,
                    fontSize: 13,
                    fontFamily: global.fontSelect,
                    fontWeight: 'bold',
                  }}>
                  No. of Memes
                </Text>
              </LinearGradient>
            </View>

            <View
              style={{
                width: '33%',
                height: 50,
                borderTopRightRadius: 22,
                borderBottomRightRadius: 22,
              }}>
              <LinearGradient
                colors={[global.btnColor1, global.btnColor2]}
                style={{
                  height: 50,
                  width: '100%',
                  borderTopRightRadius: 22,
                  borderBottomRightRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: global.btnTxt,
                    fontSize: 13,
                    fontFamily: global.fontSelect,
                    fontWeight: 'bold',
                  }}>
                  Status
                </Text>
              </LinearGradient>
            </View>
          </View>
        ) : (
          <Text
            style={{
              fontFamily: global.fontSelect,
              color: global.colorTextPrimary,
              marginTop: 10,
              marginLeft: 10,
              fontSize: 15,
            }}>
            No tournament available!
          </Text>
        )}

        <FlatList
          // horizontal={true}
          // showsHorizontalScrollIndicator={false}
          data={rankingData.reverse()}
          renderItem={({item, index}) => (
            <View>
              {/* <TouchableOpacity> */}
              <View
                style={{
                  width: '100%',
                  marginTop: 5,
                  marginBottom: 5,
                  height: 50,
                  borderRadius: 25,
                  flexDirection: 'row',
                  backgroundColor: '#292929',
                }}>
                <View style={{width: '28%', height: 50, borderRadius: 22}}>
                  <LinearGradient
                    colors={['#B461F4', '#671BA3']}
                    style={{
                      height: 50,
                      width: '100%',
                      borderRadius: 22,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontFamily: global.fontSelect,
                        fontWeight: 'bold',
                      }}>
                      {item.months}
                    </Text>
                  </LinearGradient>
                </View>

                <View style={{width: '38%'}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 17,
                      fontWeight: 'bold',
                      marginTop: 11,
                      textAlign: 'center',
                      fontFamily: global.fontSelect,
                    }}>
                    {item.NoOfPosts}/100
                  </Text>
                </View>

                <View style={{marginLeft: '19%', width: '17%', marginTop: 9}}>
                  {item.ongoing == 0 ? (
                    <ImageBackground
                      resizeMode="stretch"
                      style={{
                        height: 32,
                        width: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      source={require('../../images/uncheckedjudge.png')}>
                      <Image
                        resizeMode="stretch"
                        style={{height: 12, width: 12}}
                        source={require('../../images/checkedjudge.png')}
                      />
                    </ImageBackground>
                  ) : (
                    <Image
                      resizeMode="stretch"
                      style={{height: 32, width: 32}}
                      source={require('../../images/uncheckedjudge.png')}
                    />
                  )}
                </View>
              </View>
              {/* </TouchableOpacity> */}
            </View>
          )}
        />
        <View style={{margin: 50}}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: '#E6E6E6',
    marginBottom: 25,
    marginLeft: 5,
  },
  txt: {
    color: '#E6E6E6',
    marginTop: 20,
    marginLeft: '4%',
    marginBottom: '14%',
  },
  txtbelow: {
    color: '#E6E6E6',
    marginTop: '12%',
    alignSelf: 'center',
    marginBottom: '5%',
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
  },
  tinyLogo: {
    width: 30,
    height: 20,
    marginTop: 10,
    tintColor: '#ffffff',
  },
  //modal Style

  button: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
    marginRight: '-72%',
    marginTop: '-11%',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#0B0213',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
