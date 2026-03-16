import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { getNumberFormatSettings } from 'react-native-localize';
import { jwtDecode } from 'jwt-decode';
import { Buffer } from 'buffer';
import SplashScreen from 'react-native-bootsplash';

import {
  COMMA_VALUES_BY_NUMBER_PATTERN,
  URL_REGEX,
} from '../constants/AppConstants';

import i18n from '../localization/i18n';

import { getFormattedCommaNumber, stringIsEmpty } from './alphaNumericHelper';
import { logEvent } from './logHelper';
/* Get the fallback text for user avater, in case imageURL
 * is not available.
 */
export const getAvatarFallbackText = name => {
  if (!name) return '';

  name = name.trim();
  let fallbackText = '';
  const wordList = name.split(' ');
  for (const word of wordList) {
    fallbackText += word[0];
  }
  if (fallbackText.length > 3) {
    fallbackText = fallbackText.substring(0, 3);
  }
  return fallbackText;
};

export const parseJwt = accessToken => {
  try {
    return jwtDecode(accessToken);
  } catch (e) {
    return null;
  }
};

export const getEncodedBase64 = async data => {
  return await Buffer.from(data).toString('base64');
};

export const isHttpUrl = string => {
  try {
    return URL_REGEX.test(string);
  } catch (_) {
    return false;
  }
};

// only capitalize first letter of string
export const capitalizeFirstLetter = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str?.slice(1);
};

export const getParsedToolData = data => {
  return data && typeof data === 'string' ? JSON.parse(data) : data;
};

export const getLocalBasePath = () => {
  return Platform.OS === 'ios'
    ? ReactNativeBlobUtil.fs.dirs.DocumentDir
    : `file://${ReactNativeBlobUtil.fs.dirs.DownloadDir}`;
};

export const getLocalNoteMediaBasePath = () => {
  return Platform.OS === 'ios'
    ? ReactNativeBlobUtil.fs.dirs.DocumentDir + '/notes'
    : `file://${ReactNativeBlobUtil.fs.dirs.DocumentDir}/notes`;
};

export const getLocalVisitReportPdfBasePath = () =>
  Platform.OS === 'ios'
    ? ReactNativeBlobUtil.fs.dirs.DocumentDir + '/visit_report_pdf/'
    : `file://${ReactNativeBlobUtil.fs.dirs.DocumentDir}/visit_report_pdf/`;

export const getMediaNoteBookAbsolutePath = path => {
  return path ? `${getLocalNoteMediaBasePath()}/` + path : '';
};

export const getMediaRelativePath = path => {
  return path ? path.split('/').pop() : '';
};

export const getMediaAbsolutePath = path => {
  return path ? `${getLocalBasePath()}/` + path : '';
};

export const removeWhiteSpae = str => {
  if (str) {
    return str.replace(/\s/g, '');
  }
  return '';
};

export const isEmpty = value => {
  return (
    // null or undefined
    value == null ||
    // has length and it's zero
    (value.hasOwnProperty('length') && value.length === 0) ||
    // is an Object and has no keys
    (value.constructor === Object && Object.keys(value).length === 0)
  );
};

export const getFormattedErrorMessage = (errorStr, entityType, entityName) => {
  if (!errorStr || stringIsEmpty(errorStr)) {
    return '';
  }
  const parsedErrorArray = JSON.parse(errorStr);
  let errorMessage = `${i18n.t('in')} ${entityType} ${entityName},`;
  for (const item of parsedErrorArray) {
    if (item?.entity === 'Contact') {
      errorMessage += `\n- ${item.message}`;
      if (errorMessage[errorMessage.length - 1] === '.') {
        errorMessage = errorMessage.substring(0, errorMessage.length - 1);
      }
      errorMessage += ` ${i18n.t('inContactDetail')}`;
    } else {
      errorMessage += `\n- ${item.message}`;
    }
  }
  return errorMessage;
};

export const truncateUsername = name => {
  if (!name) return '';

  return name?.slice(0, 22);
};

/**
 *
 * @function @name getCommaSeparatedValues
 * @description
 * function for transforming the number into comma separated number for the values above than 999.
 *
 * @param {number} value - required number to be parsed with comma values
 * @param {number} decimalPoints - key to show how many numbers to place after decimal points
 * @param {string} type - i18n locale pattern type required
 * @param {object} options - options can be passed for further improvements
 *
 * @returns {string} - comma separated value if value is greater than 999
 */
export const getCommaSeparatedValues = (
  value,
  decimalPoints = 0,
  type = COMMA_VALUES_BY_NUMBER_PATTERN,
  options = {},
) => {
  const regionSettings = getNumberFormatSettings();
  if (value) {
    value = value.toString();

    if (regionSettings?.decimalSeparator != '.') {
      if (value?.split(',')?.length > 0) {
        decimalPoints = value?.split(',')?.[1]?.length || 0;
      }

      return convertInputNumbersToRegionalBasis(
        value,
        decimalPoints,
        true,
        ',',
      );
    } else {
      let commaAddedValues = i18n.l(type, value, options);

      if (commaAddedValues && commaAddedValues?.split('.')?.length > 0) {
        // splitting value with added comma
        const splitValues = commaAddedValues?.split('.');

        if (decimalPoints === 0) {
          return splitValues[0];
        }

        // checking if numbers length are greater than provided decimals
        if (splitValues[1]?.length > decimalPoints) {
          // reassigning split values after removing extra digits from the tail
          splitValues[1] = splitValues[1]?.slice(0, decimalPoints);

          // reassigning splitted values by joining them with '.'
          commaAddedValues = splitValues.join('.');
        }
      }
      return commaAddedValues;
    }
  } else {
    return value;
  }
};

export const convertInputNumbersToRegionalBasis = (
  value,
  decimalsAllowed,
  hasCommas = false,
  splitter = '.',
) => {
  if (value && value != '-' && value != '') {
    const regionSettings = getNumberFormatSettings();

    value = value.toString();

    if (
      regionSettings &&
      regionSettings?.decimalSeparator != '.' &&
      value?.charAt(value?.length - 1) != regionSettings?.decimalSeparator
    ) {
      let valueBreak = value.split(splitter);

      if (valueBreak && valueBreak.length > 0) {
        //add comma seprators where needed then convert all , to . as for these locales for the integer part
        valueBreak[0] = hasCommas
          ? getFormattedCommaNumber(valueBreak[0]?.toString())
          : valueBreak[0]?.toString();

        if (valueBreak[1] && decimalsAllowed) {
          valueBreak[1] = valueBreak[1]?.toString()?.slice(0, decimalsAllowed);
        }
        // if (decimalsAllowed) {
        //   valueBreak[1] = valueBreak[1] || '';
        //   if (valueBreak[1].length >= decimalsAllowed) {
        //     valueBreak[1] = valueBreak[1]
        //       ?.toString()
        //       ?.slice(0, decimalsAllowed);
        //   } else {
        //     let decimalsRemaining = decimalsAllowed - valueBreak[1].length;

        //     valueBreak[1] = valueBreak[1] + '0'.repeat(decimalsRemaining);
        //   }
        // }
        value = valueBreak[1] ? valueBreak.join(',') : valueBreak[0];

        return value;
      }
    } else if (
      regionSettings &&
      regionSettings?.decimalSeparator == '.' &&
      value?.charAt(value?.length - 1) != regionSettings?.decimalSeparator
    ) {
      let valueBreak = value.split('.');

      valueBreak[0] = hasCommas
        ? getFormattedCommaNumber(valueBreak[0]?.toString())
        : valueBreak[0]?.toString();

      if (valueBreak[1] && decimalsAllowed) {
        valueBreak[1] = valueBreak[1]?.toString()?.slice(0, decimalsAllowed);
      }
      value = valueBreak[1] ? valueBreak.join('.') : valueBreak[0];

      return value;
    }
  }

  return value;
};

export const removeFloatingPointsFromArray = (
  pointsArray = [],
  floatingPointKey = null,
) => {
  if (pointsArray?.length > 0) {
    pointsArray?.map(item => {
      let value = null;

      if (typeof item[floatingPointKey] === 'string') {
        value = parseFloat(item[floatingPointKey]).toFixed(2);
      } else {
        value = item[floatingPointKey]?.toFixed(2);
      }

      item[floatingPointKey] = value;
    });

    return pointsArray;
  }

  return pointsArray;
};

/**
 * @description
 * general function to altered domain from an email address
 *
 * @param {string} emailAddress required email string to altered without domain
 * @returns {string} altered email string
 */
export const removeMailAddressFromString = emailAddress => {
  if (emailAddress) {
    emailAddress?.toString();

    const decimalIndex = emailAddress.indexOf('@');

    if (decimalIndex) {
      const alteredString = emailAddress?.substring(0, decimalIndex);

      return alteredString;
    }

    return emailAddress;
  }

  return emailAddress;
};

/**
 *
 * @param {String} data any valid string data to parse in java script objects
 * e.x (Array, Object)
 * @returns
 */
export const parseStringToObject = (data = null) => {
  if (data && typeof data === 'string') {
    return JSON.parse(data);
  }

  return data;
};

export const upsertItem = (key, array, newItem) => {
  try {
    const index = array.findIndex(item => item[key] === newItem[key]);

    if (index !== -1) {
      // Replace existing item
      array[index] = newItem;
    } else {
      // Add new item
      array.push(newItem);
    }

    return array;
  } catch (e) {
    console.log('upsertItem error', e);
    logEvent('upsertItem error', e);
  }
};

export const addSpace = count => {
  let space = '';
  new Array(count).fill().map(() => (space += ' '));
  return space;
};

export function parseJsonData(data) {
  try {
    if (data && typeof data === 'string') {
      data = JSON.parse(data);
      return data;
    }
    return data;
  } catch (error) {
    return data;
  }
}

export async function hideSplashScreen(appInitialized = false) {
  const reason = appInitialized ? 'app initialized' : 'timeout (10s)';

  try {
    console.log(`✅ [Splash Screen] Hiding splash screen - reason: ${reason}`);
    await logEvent(`[Splash Screen] Hiding splash screen - reason: ${reason}`);

    await SplashScreen.hide({ fade: true });

    console.log(`✅ [Splash Screen] Splash screen hidden successfully`);
    await logEvent(`[Splash Screen] Splash screen hidden successfully`);
  } catch (e) {
    console.log(`⚠️ [Splash Screen] Error hiding splash: ${e.message}`);
    await logEvent(`[Splash Screen] Error hiding splash: ${e.message}`);
    // ignore if already hidden
  }
}
