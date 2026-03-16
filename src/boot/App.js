import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { StatusBar, AppState, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import Orientation from 'react-native-orientation-locker';

//styling
import colors from '../constants/theme/variables/customColor';

// actions
import { autoPublishVisitsRequest } from '../store/actions/visit';

//localization
import { setLanguage } from '../localization/i18n';

// components
import AppEntry from '../routes/AppEntry';
import Loader from '../components/common/Loader';
import { showUpdateAlert } from '../components/common/Alerts';

// services
import { initializeFirebase } from '../services/crashlytics';

console.disableYellowBox = true;

const App = () => {
  const dispatch = useDispatch();

  const {
    appInitialized,
    isUserLogin,
    isForceUpdateAvailable,
    isUpdateAvailable,
    language,
  } = useSelector(state => state.authentication);
  const newVersionUpdateAvailable = useSelector(
    state => state.versioning.isUpdateAvailable,
  );

  const appState = useRef(AppState.currentState);

  const [netInfo, setNetInfo] = useState(false);

  useEffect(() => {
    initializeFirebase();
  }, []);

  useEffect(() => {
    // Adding locale change event listener on app mount.
    if (appInitialized) {
      if (language) {
        setLanguage(language);
      }

      setTimeout(() => {
        if (isForceUpdateAvailable || isUpdateAvailable) {
          showUpdateAlert(isForceUpdateAvailable);
        }
      }, 1000);
    }
    if (isUserLogin) {
      dispatch(autoPublishVisitsRequest());
    }

    Orientation.lockToPortrait();
  }, [
    appInitialized,
    isUserLogin,
    isForceUpdateAvailable,
    isUpdateAvailable,
    language,
  ]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (Platform.OS === 'ios') {
          if (isForceUpdateAvailable || isUpdateAvailable) {
            showUpdateAlert(isForceUpdateAvailable);
          }
        }
        setLanguage(language);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [language, isForceUpdateAvailable, isUpdateAvailable]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // get versioning config on getting online if force update is false
      if (!newVersionUpdateAvailable && state.isConnected === true) {
        if (state.isConnected != netInfo) {
          setNetInfo(state.isConnected);
        }
      } else {
        setNetInfo(state.isConnected);
      }
    });

    return unsubscribe;
  }, [newVersionUpdateAvailable]);

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor={colors.white}
        barStyle={'dark-content'}
      />
      <Loader />
      <AppEntry />
    </>
  );
};

export default App;
