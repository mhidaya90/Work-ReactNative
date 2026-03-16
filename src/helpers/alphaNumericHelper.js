import { getNumberFormatSettings } from 'react-native-localize';
import {
  DECIMAL_REGEX,
  DECIMAL_REGEX_VALIDATE,
  DECIMAL_TOFIXED_REGEX,
  TWO_DECIMAL_TOFIXED_REGEX,
  THREE_DECIMAL_TOFIXED_REGEX,
  INTEGER_REGEX,
  INTEGER_REGEX_VALIDATE,
  KEYBOARD_TYPES,
  COMMA_SEPARATED_NUMBER,
} from '../constants/AppConstants';
import { KEYBOARD_TYPE } from '../constants/FormConstants';

export const handleNumberFieldValidation = (value, type) => {
  //for decimal made "0." valid as it was not allowing . only
  const condition =
    type == KEYBOARD_TYPES.DECIMAL
      ? new RegExp(DECIMAL_REGEX)
      : new RegExp(INTEGER_REGEX);
  return condition.test(value);
};

export const sortAplhaNumeric = (a, b) => {
  let reA = /[^a-zA-Z]/g;
  let reN = /[^0-9]/g;

  var aA = a.replace(reA, '');
  var bA = b.replace(reA, '');
  if (aA === bA) {
    var aN = parseInt(a.replace(reN, ''), 10);
    var bN = parseInt(b.replace(reN, ''), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  } else {
    return aA > bA ? 1 : -1;
  }
};

export const numberToWords = num => {
  let a = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen ',
  ];
  let b = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  let c = ['', 'once', 'twice', 'thrice'];
  let str = '';
  if (num > 0 && num <= 3) {
    str = c[num];
  } else {
    if ((num = num.toString()).length > 9) {
      return 'overflow';
    }
    let n = ('000000000' + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) {
      return;
    }
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore '
        : '';
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh '
        : '';
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand '
        : '';
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred '
        : '';
    str +=
      n[5] != 0
        ? (str != '' ? 'and ' : '') +
          (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) +
          'times '
        : '';
  }
  return str;
};

export const toCamelCase = str => {
  if (typeof str !== 'string') {
    return '';
  }
  if (!str) {
    return '';
  }
  return str
    .replace(/\s(.)/g, $1 => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, $1 => $1.toLowerCase());
};

export const toUpperCase = str => {
  if (typeof str === 'string') {
    return str.toUpperCase();
  }
  return '';
};

export const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match =>
    match.toUpperCase(),
  );

export const stringIsEmpty = str => {
  return !str || /^\s*$/.test(str);
};

export const convertStringToNumber = (val = '', donotConvert = false) => {
  //converting it for saving and server thing.
  //this function was used all over the app before saving numbers
  if (!donotConvert) val = convertNumbersToEnFormat(val);

  let numVal = +val;

  if (numVal === NaN) {
    return 0;
  }

  return numVal;
};

export const convertNumberToString = (val, donotConvert = false) => {
  if (!val && val != 0) {
    return '';
  }

  //converting it for saving and server thing.
  //this function was used all over the app before saving numbers
  if (!donotConvert) val = convertNumbersToBrFormat(val);

  return String(val);
};

export const checkIntegerAndDecimalValidation = (
  value,
  isInteger,
  minValue = 0,
  maxValue,
  toFixOne,
  hasCommas = false,
  currency = null,
  isNegative = false,
) => {
  const regionSettings = getNumberFormatSettings();

  if (regionSettings.decimalSeparator == '.') {
    //made "0." valid as it was not allowing .
    if (!isNegative) {
      if (value === '-') {
        return false;
      }
    }
    if (currency) {
      value = removeCurrencyFromInput(value, currency);
    }
    if (hasCommas) {
      if (value === ',') {
        return false;
      }
      value = removeStringCommas(value);
    }

    const condition = isInteger
      ? new RegExp(INTEGER_REGEX)
      : !!toFixOne
      ? new RegExp(getDecimalExpression(toFixOne))
      : new RegExp(DECIMAL_REGEX);

    let isValid = condition.test(value);

    // if value is . or .10
    if (value === '.' && !isInteger) {
      return isValid;
    }

    if (value != '-' && isValid && (minValue || maxValue)) {
      value = Number(value);
      isValid = value >= minValue; //default is 0

      if (isValid && maxValue) {
        isValid = value <= maxValue;
      }
    }

    //will be returning all conditions (decimal, min/max as well)
    return isValid;
  } else {
    return checkIntegerAndDecimalValidationByRegionalBasis(
      value,
      isInteger,
      minValue,
      maxValue,
      toFixOne,
      hasCommas,
      currency,
      isNegative,
    );
  }
};

export const checkIntegerAndDecimalValidationByRegionalBasis = (
  value,
  isInteger,
  minValue = 0,
  maxValue,
  toFixOne,
  hasCommas = false,
  currency = null,
  isNegative = false,
) => {
  //made "0." valid as it was not allowing .
  if (!isNegative) {
    if (value === '-') {
      return false;
    }
  }
  if (currency) {
    value = removeCurrencyFromInput(value, currency);
  }
  if (hasCommas) {
    if (value === '.') {
      return false;
    }
    value = removeStringCommas(value);
  }
  const condition = isInteger
    ? new RegExp(INTEGER_REGEX)
    : !!toFixOne
    ? new RegExp(getDecimalExpression(toFixOne))
    : new RegExp(DECIMAL_REGEX);

  let isValid = condition.test(value);

  // if value is . or .10
  if (value === ',' && !isInteger) {
    return isValid;
  }

  if (value != '-' && isValid && (minValue || maxValue)) {
    //as parsing to number was returning NaN
    value = Number(convertNumbersToEnFormat(value));
    isValid = value >= minValue; //default is 0

    if (isValid && maxValue) {
      isValid = value <= maxValue;
    }
  }

  //will be returning all conditions (decimal, min/max as well)
  return isValid;
};

export const countCharacters = (input, char) => {
  let count = 0;

  for (let i = 0; i < input?.length; i++) {
    if (input[i] == char) {
      count++;
    }
  }

  return count;
};

const getDecimalExpression = (value = 1) => {
  return {
    1: DECIMAL_TOFIXED_REGEX,
    2: TWO_DECIMAL_TOFIXED_REGEX,
    3: THREE_DECIMAL_TOFIXED_REGEX,
  }[value];
};

export const validateNumber = (value, isInteger) => {
  const condition = isInteger
    ? new RegExp(INTEGER_REGEX_VALIDATE)
    : new RegExp(DECIMAL_REGEX_VALIDATE);

  return condition.test(value);
};

// only capatilize first letter of string
export const capitalizeFirstLetter = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// only capatilize first letter of string
export const capitalizeFirstLowercaseRest = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getFormattedScoreData = data => {
  return data?.map(obj => {
    const value = obj.includes('.') ? obj : obj + '.0';
    return { id: value, name: value };
  });
};

export const getFormattedDecimalValues = value => {
  //used in locomotion only
  let decimalValue = 2;
  let str = value?.toString();
  // str = str?.slice(0, str?.indexOf('.') + decimalValue + 1);
  if (str.includes('.')) {
    str = str?.slice(0, str?.indexOf('.') + decimalValue + 1);
  }
  const regionSettings = getNumberFormatSettings();
  if (regionSettings.decimalSeparator == '.') {
    return Number(str);
  } else {
    return convertNumbersToBrFormat(str);
  }
};

export const getFormattedCommaNumber = value => {
  if (!value || stringIsEmpty(value)) {
    return '';
  }
  const regionSettings = getNumberFormatSettings();

  const commaModifiedValue = value
    .toString()
    .replace(COMMA_SEPARATED_NUMBER, regionSettings.groupingSeparator);

  const pointIndexNumber = commaModifiedValue.indexOf(
    regionSettings.decimalSeparator,
  );

  if (pointIndexNumber != -1) {
    let liftedPointString = commaModifiedValue.substring(pointIndexNumber);

    liftedPointString =
      regionSettings.groupingSeparator == ','
        ? liftedPointString.replace(/./g, '')
        : liftedPointString.replace(/./g, '');

    return (
      commaModifiedValue.substring(0, pointIndexNumber) + liftedPointString
    );
  }

  return commaModifiedValue;
};

export const removeStringCommas = value => {
  if (!value || stringIsEmpty(value)) {
    return '';
  }
  const regionSettings = getNumberFormatSettings();

  return value.replace(regionSettings.groupingSeparator, '');
};

export const removeCurrencyFromInput = (value, currency) => {
  if (!value || stringIsEmpty(value)) {
    return '';
  }
  return value.replace(currency, '');
};

export const removeNumberCommas = (value, isInteger) => {
  if (!value || stringIsEmpty(value)) {
    return null;
  }
  const regionSettings = getNumberFormatSettings();

  let valueStr = value?.toString();
  valueStr = valueStr.replace(regionSettings.groupingSeparator, '');
  if (isInteger) {
    return parseFloat(valueStr);
  }
  return valueStr;
};

export const containsUppercase = str => {
  return /[A-Z]{2,}/g.test(str);
};

export const separateStringIntoCamelCase = a => {
  let str = '';
  if (!containsUppercase(a)) {
    str = a.match(/([A-Z]?[^A-Z]*)/g).join(' ');
    str = str.toLowerCase();
  } else {
    str = a.match(/([A-Z]?[^A-Z]*)/g).join('');
    str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
};

export const convertObjectValuesToNumber = (obj = {}) => {
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object') {
      return isNaN(obj[k]) ? obj[k] : Number(obj[k]);
    }

    obj[k] = isNaN(obj[k]) ? obj[k] : Number(obj[k]);
  });

  return obj;
};

export const convertArrayOfObjValuesToNumber = (array = []) => {
  const newArray = array?.map(obj => convertObjectValuesToNumber(obj));
  return newArray;
};

export const convertToString = number => {
  return number?.toString();
};

export const roundNumber = (value, numberOFDecimals) => {
  if (value) {
    return parseFloat(value)?.toFixed(numberOFDecimals);
  }
  return '';
};

export const getKeyboardType = (decimalPoints = 0) => {
  return decimalPoints > 0 ? KEYBOARD_TYPE.DECIMAL : KEYBOARD_TYPE.NUMBER_PAD;
};

export const convertNumbersToBrFormat = (val = '', donotConvert = false) => {
  const regionSettings = getNumberFormatSettings();

  if (!donotConvert && regionSettings.decimalSeparator != '.') {
    val = val?.toString()?.replaceAll(',', '')?.replace('.', ',');
  }
  return val;
};

export const convertNumbersToEnFormat = (val = '', donotConvert = false) => {
  const regionSettings = getNumberFormatSettings();

  if (!donotConvert && regionSettings.decimalSeparator != '.') {
    val = val?.toString()?.replaceAll('.', '')?.replace(',', '.');
  }

  return val;
};

export const convertCommaValueToDotValue = (val = '') => {
  val = val?.toString()?.replaceAll(',', '.');
  return val;
};

export const truncateString = (text, len, eclipseType = 'end') => {
  switch (eclipseType) {
    case 'end':
      return text?.length > len ? text.slice(0, len) + '...' : text;

    case 'start':
      return text?.length > len ? '...' + text.slice(0, len) : text;

    case 'middle':
      return text?.length > len
        ? text.slice(0, len) + '...' + text.slice(len - 10, len)
        : text;

    default:
      return text;
  }
};
