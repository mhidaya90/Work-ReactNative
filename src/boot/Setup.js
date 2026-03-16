import React from 'react';
import { Provider } from 'react-redux';
import { DatadogProvider } from '@datadog/mobile-react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import store from '../store';
import App from './App';

//constants
import ACTION_CONSTANTS from '../constants/actionConstants';

// datadog config
import { DataDogConfig } from '../helpers/logHelper';

class Setup extends React.Component {
  componentDidMount() {
    store.dispatch({
      type: ACTION_CONSTANTS.GET_INITIALIZED_REQUEST,
    });
  }

  render() {
    return (
      <DatadogProvider configuration={DataDogConfig}>
        <Provider store={store}>
          <KeyboardProvider>
            <App />
          </KeyboardProvider>
        </Provider>
      </DatadogProvider>
    );
  }
}

export default Setup;
