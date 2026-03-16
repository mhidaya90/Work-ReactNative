import { Linking, Platform } from 'react-native';
import Config from 'react-native-config';

import { ENVIRONMENT } from '../constants/AppConstants';

export const APP_VERSION =
  Platform.OS === 'ios' ? Config.IOS_VERSION_NAME : Config.ANDROID_VERSION_NAME;

export const getIsUpdateAvailable = newVersion => {
  let currentVersion =
    Platform.OS === 'ios'
      ? Config.IOS_VERSION_NAME
      : Config.ANDROID_VERSION_NAME;

  let versionUpdate = false;
  if (typeof newVersion + typeof currentVersion == 'stringstring') {
    let newVersionArray = newVersion.split('.'),
      currentVersionArray = currentVersion.split('.'),
      len = Math.max(newVersionArray.length, currentVersionArray.length);

    for (let i = 0; i < len; i++) {
      if (
        (newVersionArray[i] &&
          !currentVersionArray[i] &&
          parseInt(newVersionArray[i]) > 0) ||
        parseInt(newVersionArray[i]) > parseInt(currentVersionArray[i])
      ) {
        versionUpdate = true;
        break;
      } else if (
        (currentVersionArray[i] &&
          !newVersionArray[i] &&
          parseInt(currentVersionArray[i]) > 0) ||
        parseInt(newVersionArray[i]) < parseInt(currentVersionArray[i])
      ) {
        break;
      }
    }
  }
  return versionUpdate;
};
export const openDownloadLink = () => {
  let url = null;
  if (
    Config.ENVIRONMENT.toUpperCase() == ENVIRONMENT.PRODUCTION.toUpperCase()
  ) {
    if (Platform.OS === 'ios') {
      url = Config.APP_UPDATE_URL_IOS;
    } else {
      url = Config.APP_UPDATE_URL_ANDROID;
    }
  } else {
    // url = Config.APP_UPDATE_URL;
  }

  if (url) {
    Linking.openURL(url);
  }
};

export const compareVersionNumbers = (v1, v2) => {
  // vnum stores each numeric part of version
  let vnum1 = 0,
    vnum2 = 0;

  // loop until both string are processed
  for (let i = 0, j = 0; i < v1.length || j < v2.length; ) {
    // storing numeric part of version 1 in vnum1
    while (i < v1.length && v1[i] != '.') {
      vnum1 = vnum1 * 10 + (v1[i] - '0');
      i++;
    }
    // storing numeric part of version 2 in vnum2
    while (j < v2.length && v2[j] != '.') {
      vnum2 = vnum2 * 10 + (v2[j] - '0');
      j++;
    }

    if (vnum1 > vnum2) return 1;
    if (vnum2 > vnum1) return -1;

    // if equal, reset variables and go for next numeric part
    vnum1 = vnum2 = 0;
    i++;
    j++;
  }
  return 0;
};
