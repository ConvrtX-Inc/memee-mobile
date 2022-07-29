import axios from 'axios';
// import { BASE_URL } from '../../BASE_URL/index'
import {
  REGISTER_USER,
  LOGIN_ACTION,
  LOGIN_DATA,
  GET_VERIFICATION_CODE,
  IS_LOADING,
  COINS_STORED,
  IS_SCROLL_DOWN,
  SELECTED_BADGES,
  IMAGES_BOTTOMTAB,
  NOTIFICATIONS,
} from '../constants/index';
import Toast from 'react-native-toast-message';
import {urls} from '../../api/urls';

export function registerUserFN(data, removeStates, navigate) {
  /* console.log('Login data..', data); */

  return async dispatch => {
    axios({
      method: 'post',
      url: urls.baseUrl,
      data: data,
      validateStatus: status => {
        return true;
      },
    })
      .catch(error => {
        // loginError()
        console.log('Error', error);
        Toast.show({
          type: 'error',
          text1: error,
        });
      })
      .then(Response => {
        /* console.log('products Response: WITH TOKEN', Response.data); */

        if (Response.data.Status == 201) {
          dispatch({type: REGISTER_USER, data: Response.data});
          dispatch(getDataAction(Response.data.Token));
          navigate();
          removeStates();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Alert!',
            text2: Response.data.Message,
          });
        }
      });
  };
}

export function getNotifications() {
  if (global.userData.user_id) {
    return async dispatch => {
      fetch(`${global.address}GetNotifications/${global.userData.user_id}`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authToken: global.token,
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          dispatch({type: NOTIFICATIONS, data: responseJson.Response});
        })
        .catch(error => {
          console.error(error);
        });
    };
  }
}

export function readNotifications() {
  if (global.userData.user_id) {
    return async dispatch => {
      fetch(`${global.address}ReadNotifications/${global.userData.user_id}`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authToken: global.token,
        },
      });
    };
  }
}

export async function toggleOnlineStatus(val) {
  /* console.info('val', val);
  console.info('uth_token: global.token,', global.token); */
  // console.log(
  //   'URL USE:',
  //   global.address +
  //     'toggleOnlineStatus/' +
  //     global.userData.user_id +
  //     '/' +
  //     val,
  // );
  if (global.userData.user_id !== undefined) {
    fetch(
      global.address +
        'toggleOnlineStatus/' +
        global.userData.user_id +
        '/' +
        val,
      {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authToken: global.token,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          '\n Apstatus Api called toggleOnlineStatus.... \n',
          responseJson,
        );
      })
      .catch(error => {
        console.error('errpr', error);
      });
  }
}

export async function GetOnlineStatus() {
  /* console.info('val', val);
  console.info('uth_token: global.token,', global.token); */
  fetch(global.address + 'GetOnlineStatus/' + global.userData.user_id, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authToken: global.token,
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log(
        '\n Apstatus Api called GetOnlineStatus .... \n',
        responseJson,
      );
      return responseJson.onlineStatus;
    })
    .catch(error => {
      console.error(error);
    });
}

export function coinsRecordFN(data) {
  return async dispatch => {
    dispatch({type: COINS_STORED, data: data});
  };
}

export function detectScrollingFN(data) {
  // console.log("action running....", data)
  return async dispatch => {
    dispatch({type: IS_SCROLL_DOWN, data: data});
  };
}

export function storedSelectedBadges(data) {
  // console.log("action running Badges....", data)
  return async dispatch => {
    dispatch({type: SELECTED_BADGES, data: data});
  };
}

export function storeIconsBottomTabFN(data) {
  // console.log("action running Badges....", data)
  return async dispatch => {
    dispatch({type: IMAGES_BOTTOMTAB, data: data});
  };
}
