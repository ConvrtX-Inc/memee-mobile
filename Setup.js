import React, {useState} from 'react';
import {View, Text} from 'react-native';
import App from './App';
import firebase from '@react-native-firebase/app';

import messaging from '@react-native-firebase/messaging';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDLMTo1X70qO_r6N0bBorEfvHulLghNK68",
//   authDomain: "memee-app.firebaseapp.com",
//   projectId: "memee-app",
//   databaseURL: '',
//   storageBucket: "memee-app.appspot.com",
//   messagingSenderId: "740829831906",
//   appId: "1:740829831906:web:767e5db8fb770efc6274bb",
//   measurementId: "G-H15CTD7WSB"
// };

var firebaseConfig = {
  apiKey: 'AIzaSyCMsL44vvpEAO8T5Fyead6C2E48KyiOaAo',
  authDomain: 'memee-ce64c.firebaseapp.com',
  projectId: 'memee-ce64c',
  databaseURL: '',
  storageBucket: 'memee-ce64c.appspot.com',
  messagingSenderId: '665746906328',
  appId: '1:665746906328:web:24613c004294aa787dcbad',
  measurementId: 'G-ST2GTWP2RL',
};

if (!firebase.apps.length) {
  /* console.log("running setup....") */
  firebase.initializeApp(firebaseConfig);
}

export {firebase, messaging};

const Setup = () => {
  const [loading, setLoading] = useState(true);

  const setupCloudMessaging = async () => {
    messaging()
      .subscribeToTopic('notifyAll')
      .then(() => console.log('Subscribed to topic!'));
  };

  React.useEffect(async () => {
    setupCloudMessaging();
  }, []);

  return <App />;
};

export default Setup;
