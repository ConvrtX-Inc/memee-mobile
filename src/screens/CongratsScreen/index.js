import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
const CongratsScreen = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={require('../../images/Congrats.png')}
        style={{
          resizeMode: 'cover',
          width: windowWidth,
          height: windowHeight,
        }}
      />
    </TouchableOpacity>
  );
};

export default CongratsScreen;

const styles = StyleSheet.create({});
