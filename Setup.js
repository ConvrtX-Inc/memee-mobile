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

/* var firebaseConfig = {
  apiKey: 'AIzaSyAfjXyX-CXZTpLZKZiZVqSc_Rr2-wp8iN0',
  authDomain: 'memee-ce64c.firebaseapp.com',
  projectId: 'memee-app-d35d3',
  databaseURL: '',
  storageBucket: 'memee-app-d35d3.appspot.com',
  messagingSenderId: '665746906328',
  appId: '1:628249846461:android:54ea0b987cde5aa6698dd4',
  measurementId: 'G-ST2GTWP2RL',
}; */

const firebaseConfig = {
  apiKey: 'AIzaSyCfzO2GC4QYg-EBmN0def7CRZS59Z3Qyog',
  authDomain: 'memee-f9aca.firebaseapp.com',
  projectId: 'memee-f9aca',
  storageBucket: 'memee-f9aca.appspot.com',
  messagingSenderId: '422086856195',
  appId: '1:422086856195:web:59bd5707f2247e3eb58836',
  measurementId: 'G-YK9V5ZWGSH',
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
