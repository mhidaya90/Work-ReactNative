import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import {
  BatchSize,
  DatadogProviderConfiguration,
  SdkVerbosity,
  UploadFrequency,
} from '@datadog/mobile-react-native';
import Config from 'react-native-config';

import { isOnline } from '../services/netInfoService';

import {
  DEV_LOG_FILE_NAME,
  HEADING_DECORATION,
  LOG_FOLDER_PATH,
  NEW_LINE,
} from '../constants/AppConstants';

// helpers
import { stringIsEmpty } from './alphaNumericHelper';
import { APP_VERSION } from './versioning';

export const getLogFileName = async userEmail => {
  return `${LOG_FOLDER_PATH}/${userEmail}-${new Date().getTime()}.txt`;
};

export const logEvent = async (eventName, data) => {
  try {
    const logFolderPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${LOG_FOLDER_PATH}`;

    const directoryExists = await ReactNativeBlobUtil.fs.exists(logFolderPath);
    if (!directoryExists) {
      await ReactNativeBlobUtil.fs.mkdir(logFolderPath);
    }

    let logEntry = `${new Date().toISOString()} - ${eventName}:`;
    logEntry += `${NEW_LINE}url: ${data?.url || '-'}`;
    logEntry += `${NEW_LINE}data: ${JSON.stringify(
      data,
    )}${NEW_LINE}${NEW_LINE}`;

    const filePath = `${logFolderPath}/${DEV_LOG_FILE_NAME}.txt`;

    await ReactNativeBlobUtil.fs.appendFile(filePath, logEntry, 'utf8');
  } catch (error) {
    console.error('Error in logging event:', error);
  }
};

export const readLogFile = async () => {
  try {
    const filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${LOG_FOLDER_PATH}/${DEV_LOG_FILE_NAME}.txt`;
    await ReactNativeBlobUtil.fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading log file:', error);
  }
};

export const writeToUserLogFile = async (filePath, textInBeginning) => {
  try {
    let devLogFileData = await readLogFile();

    let data = textInBeginning + devLogFileData;

    return await ReactNativeBlobUtil.fs.writeFile(filePath, data, 'utf8');
  } catch (error) {
    console.error('Error writeToUserLogFile log file:', error);
  }
};

export const clearLogFolder = async () => {
  try {
    const mediaPath =
      ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + LOG_FOLDER_PATH;

    const folderExist = await ReactNativeBlobUtil.fs.exists(mediaPath);
    if (folderExist) {
      await ReactNativeBlobUtil.fs.unlink(
        `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${LOG_FOLDER_PATH}`,
      );
    }
  } catch (error) {
    console.error('Error clearing log file:', error);
  }
};

/**
 *
 * @description
 * delete file or folder function to unlink file using RNFS.
 *
 * @param {string} filePath path of file required in case of deleting the file
 */
export const deleteFile = async filePath => {
  if (!stringIsEmpty(filePath)) {
    try {
      ReactNativeBlobUtil.fs
        .exists(filePath)
        .then(async result => {
          if (result) {
            await ReactNativeBlobUtil.fs
              .unlink(filePath)
              .then(() => {
                logEvent('deleteFile file deleted', 'FILE_DELETED');
              })
              .catch(err => {
                logEvent('deleteFile error deleting file ', err);
              });
          }
        })
        .catch(err => {
          logEvent('deleteFile file does not exist ', err);
        });
    } catch (error) {
      logEvent('deleteFile fail ', error);
    }
  } else {
    logEvent('deleteFile file path error ', 'FILE_DOES_NOT_EXIST');
  }
};

// export const createZipFile = async (sourcePath, targetPath) => {
//   try {
//     let path = await zip(sourcePath, targetPath);

//     return path;
//   } catch (e) {
//     console.log('createZipFile', e);
//     return null;
//   }
// };

// Exception handler
const exceptionHandler = async (error, isFatal) => {
  try {
    logEvent('---- APP CRASHED ----');
    logEvent(`Error: ${error.message}\nStack Trace: ${error.stack}`);
  } catch (e) {
    logEvent('APP CRASHED, BUT UNABLE TO LOG THE REASON FOR SOME REASON');
    console.error('Error recording crash log:', error, e);
  }
};
// Set up the exception handler
// setJSExceptionHandler(exceptionHandler, true);

export const getExportLogFileAppInfoHeaders = async userInfo => {
  let version = APP_VERSION;
  let text = `Date: ${new Date()} ${NEW_LINE} ${NEW_LINE}`;
  text += `App Version ${version} ${NEW_LINE} ${NEW_LINE}`;
  text += setUserInformation(userInfo);
  text += await setDeviceInformation();
  text += await setMemoryInformation();
  // text += await setDiskInformation();
  text += await setPowerInformation();
  text += NEW_LINE + ' ' + NEW_LINE;
  text += HEADING_DECORATION + ' ' + HEADING_DECORATION;
  text += NEW_LINE + ' ' + NEW_LINE;
  return text;
};

const setUserInformation = userInfo => {
  let userInfoText = '';

  userInfoText +=
    HEADING_DECORATION + 'User Information' + HEADING_DECORATION + NEW_LINE;
  // userInfoText += 'FullName: ' + userInfo.fullName + NEW_LINE;
  userInfoText += 'Email: ' + userInfo.email + NEW_LINE;
  userInfoText += NEW_LINE;

  return userInfoText;
};

const setDeviceInformation = async () => {
  let deviceInfoText = '';

  deviceInfoText +=
    HEADING_DECORATION + 'Device Information' + HEADING_DECORATION + NEW_LINE;
  deviceInfoText +=
    'Manufacturer: ' + (await DeviceInfo.getManufacturer()) + NEW_LINE;
  deviceInfoText += 'Identifier: ' + DeviceInfo.getModel() + NEW_LINE;
  deviceInfoText += 'Platform: ' + Platform.OS + NEW_LINE;
  deviceInfoText += 'OS version: ' + DeviceInfo.getSystemVersion() + NEW_LINE;
  deviceInfoText +=
    'UUID: ' + JSON.stringify(await DeviceInfo.getUniqueId()) + NEW_LINE;
  deviceInfoText += 'Device Type: ' + DeviceInfo.getDeviceType() + NEW_LINE;
  deviceInfoText += 'Network: ' + (await isOnline(true)) + NEW_LINE;
  deviceInfoText += NEW_LINE;

  return deviceInfoText;
};

const setMemoryInformation = async () => {
  let memoryInfoText = '';
  const totalMemory = await DeviceInfo.getTotalMemory();
  const maxMemory = await DeviceInfo.getMaxMemory();
  const usedMemory = await DeviceInfo.getUsedMemory();

  memoryInfoText +=
    HEADING_DECORATION + 'Memory' + HEADING_DECORATION + NEW_LINE;
  memoryInfoText +=
    Platform.OS === 'ios'
      ? ''
      : 'Maximum amount of memory VM can use: ' +
        maxMemory +
        ' B, ' +
        convertBytesToSize(maxMemory) +
        NEW_LINE;
  memoryInfoText +=
    Platform.OS === 'ios'
      ? ''
      : 'App memory usage: ' +
        usedMemory +
        ' B, ' +
        convertBytesToSize(usedMemory) +
        NEW_LINE;
  memoryInfoText +=
    'Total: ' +
    totalMemory +
    ' B, ' +
    convertBytesToSize(totalMemory) +
    NEW_LINE;
  memoryInfoText += NEW_LINE;

  return memoryInfoText;
};

const setDiskInformation = async () => {
  let diskSpaceInfoText = '';
  const totalDiskCapacity = await DeviceInfo.getTotalDiskCapacity();
  const freeDiskStorage = await DeviceInfo.getFreeDiskStorage();
  diskSpaceInfoText +=
    HEADING_DECORATION + 'Storage' + HEADING_DECORATION + NEW_LINE;
  diskSpaceInfoText +=
    'Free: ' +
    totalDiskCapacity +
    ' B, ' +
    convertBytesToSize(totalDiskCapacity) +
    NEW_LINE;
  diskSpaceInfoText +=
    'Total: ' +
    freeDiskStorage +
    ' B, ' +
    convertBytesToSize(freeDiskStorage) +
    NEW_LINE;
  diskSpaceInfoText += NEW_LINE;

  return diskSpaceInfoText;
};

const setPowerInformation = async () => {
  let powerInfoText = '';
  const powerState = await DeviceInfo.getPowerState();

  powerInfoText +=
    HEADING_DECORATION + 'Power/Battery' + HEADING_DECORATION + NEW_LINE;
  powerInfoText += 'Battery Level: ' + powerState.batteryLevel + NEW_LINE;
  powerInfoText += 'Battery State: ' + powerState.batteryState + NEW_LINE;
  powerInfoText += 'Low Power Mode: ' + powerState.lowPowerMode + NEW_LINE;

  return powerInfoText;
};

/**
 * Convert number of bytes into human readable format
 *
 * @param integer bytes     Number of bytes to convert
 * @param integer precision Number of digits after the decimal separator
 * @return string
 */
const convertBytesToSize = (bytes, precision) => {
  const kilobyte = 1024,
    megabyte = kilobyte * 1024,
    gigabyte = megabyte * 1024,
    terabyte = gigabyte * 1024;

  if (!precision) {
    precision = 2;
  }

  if (bytes >= 0 && bytes < kilobyte) {
    return bytes + ' B';
  } else if (bytes >= kilobyte && bytes < megabyte) {
    return (bytes / kilobyte).toFixed(precision) + ' KB';
  } else if (bytes >= megabyte && bytes < gigabyte) {
    return (bytes / megabyte).toFixed(precision) + ' MB';
  } else if (bytes >= gigabyte && bytes < terabyte) {
    return (bytes / gigabyte).toFixed(precision) + ' GB';
  } else if (bytes >= terabyte) {
    return (bytes / terabyte).toFixed(precision) + ' TB';
  } else {
    return bytes + ' B';
  }
};

export const writeToStartOfFile = async textInBeginning => {
  try {
    const filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${LOG_FOLDER_PATH}/${DEV_LOG_FILE_NAME}.txt`;
    //this overwrites the existing text
    await ReactNativeBlobUtil.fs.writeFile(filePath, textInBeginning, 'utf8');
  } catch (error) {
    console.error('Error reading log file:', error);
  }
};

// #region configuration for datadog
export const DataDogConfig = new DatadogProviderConfiguration(
  Config.DATADOG_RUM_ID, //Rum id
  Config.DATADOG_ENVIRONMENT, //environment
  Config.DATADOG_APP_ID, //datadog app id
  Config.DATADOG_TRACK_USER_INTERACTIONS, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  Config.DATADOG_TRACK_RESOURCES, // track XHR Resources
  Config.DATADOG_TRACK_ERRORS, // track Errors
);

DataDogConfig.site = Config.DATADOG_SITE;
// Optional: Enable JavaScript long task collection
DataDogConfig.longTaskThresholdMs = Config.DATADOG_LONG_TASK_THRESHOLD_MS;
// Optional: enable or disable native crash reports
DataDogConfig.nativeCrashReportEnabled =
  Config.DATADOG_NATIVE_CRASH_REPORT_ENABLED;
// Optional: sample RUM sessions (here, 100% of session will be sent to Datadog. Default = 100%. Only tracked sessions send RUM events.)
DataDogConfig.sessionSamplingRate = Config.DATADOG_SESSION_SAMPLING_RATE;

if (__DEV__) {
  // Optional: Send data more frequently
  DataDogConfig.uploadFrequency = UploadFrequency.AVERAGE;
  // Optional: Send smaller batches of data
  DataDogConfig.batchSize = BatchSize.MEDIUM;
  // Optional: Enable debug logging
  DataDogConfig.verbosity = SdkVerbosity.DEBUG;
}
// #endregion
