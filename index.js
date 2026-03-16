/**
 * @format
 */

// modules
import { AppRegistry } from 'react-native';

// components
import Setup from './src/boot/Setup';

import { name as appName } from './app.json';

if (__DEV__) {
  require('./ReactotronConfig');
}

AppRegistry.registerComponent(appName, () => Setup);
