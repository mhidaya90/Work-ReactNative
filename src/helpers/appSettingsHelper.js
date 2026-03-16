// constants
import { UNIT_OF_MEASURE } from '../constants/AppConstants';

// localization
import i18n from '../localization/i18n';

// helpers
import { stringIsEmpty } from './alphaNumericHelper';

export const convertStringToFixedDecimals = (value, decimalCount) => {
  if (value) {
    const convertedStringValue = value?.toString();
    const decimalIndex = convertedStringValue?.indexOf('.');
    if (decimalIndex > -1) {
      const numDigits = convertedStringValue?.substring(decimalIndex).length;
      if (numDigits > decimalCount) {
        return parseFloat(convertedStringValue)?.toFixed(decimalCount);
      }
    }

    return convertedStringValue;
  }

  return value;
};

export const getUnitOfMeasure = userData => {
  if (
    userData &&
    userData?.unitOfMeasure &&
    !stringIsEmpty(userData?.unitOfMeasure)
  ) {
    return userData?.unitOfMeasure;
  }
  return null;
};

export const getBCSScale = userData => {
  if (
    userData &&
    userData?.bcsPointScale &&
    !stringIsEmpty(userData?.bcsPointScale)
  ) {
    return userData?.bcsPointScale;
  }
  return null;
};

//#region get unit labels
export const getWeightUnit = userData => {
  const unit = getUnitOfMeasure(userData);
  if (unit) {
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return i18n.t('lbs');
    }
    return i18n.t('kg');
  }
  return '';
};

export const getWeightUnitByMeasure = unit => {
  if (unit) {
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return i18n.t('lbs');
    }
    return i18n.t('kg');
  }
  return '';
};

export const getCurrencyByWeightUnit = (currency, userData) => {
  const unit = getUnitOfMeasure(userData);
  if (unit) {
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return `(${currency}/${i18n.t('lbs')})`;
    }
    return `(${currency}/${i18n.t('kg')})`;
  }
  return '';
};

//#endregion

//#region unit conversion formulae

//#region metric to imperial
export const convertWeightToImperial = (value, decimalDigits = 3) => {
  if (value || value === 0) {
    // convert to lbs
    const convertedValue = parseFloat(value.toString()) * 2.2;
    const valueStr = convertedValue.toString();
    const decimalIndex = valueStr.indexOf('.');
    if (decimalIndex > -1) {
      const numDigits = valueStr.substring(decimalIndex).length;
      if (numDigits > decimalDigits) {
        return parseFloat(convertedValue.toFixed(decimalDigits));
      }
    }
    return convertedValue;
  }
  return null;
};

export const convertDenominatorWeightToImperial = (
  value,
  decimalDigits = 3,
) => {
  if (value) {
    // convert to value/lbs
    const convertedValue = parseFloat(value.toString()) / 2.2;
    const valueStr = convertedValue.toString();
    const decimalIndex = valueStr.indexOf('.');
    if (decimalIndex > -1) {
      const numDigits = valueStr.substring(decimalIndex).length;
      if (numDigits > decimalDigits) {
        return parseFloat(convertedValue.toFixed(decimalDigits));
      }
    }
    return convertedValue;
  }
  return null;
};

export const convertDenominatorWeightToImperialMultiply100 = (
  value,
  decimalDigits = 3,
) => {
  if (value) {
    // convert to value/lbs
    // const convertedValue = (parseFloat(value.toString()) / 2.205) * 100;

    // updated for energy equivalent milk loss
    const convertedValue = parseFloat(value.toString()) / 2.205;
    const valueStr = convertedValue.toString();
    const decimalIndex = valueStr.indexOf('.');
    if (decimalIndex > -1) {
      const numDigits = valueStr.substring(decimalIndex).length;
      if (numDigits > decimalDigits) {
        return parseFloat(convertedValue.toFixed(decimalDigits));
      }
    }
    return convertedValue;
  }
  return null;
};

//#endregion

//#region imperial to metric
export const convertWeightToMetric = value => {
  const valueStr = value.toString();
  if (valueStr !== '.') {
    // convert to kgs
    const res = parseFloat(value) / 2.2;
    return parseFloat(res.toFixed(2));
  }
  return 0;
};

export const convertDenominatorWeightToMetric = value => {
  const valueStr = value.toString();
  if (valueStr !== '.') {
    // convert to value/kgs
    const res = parseFloat(value) * 2.2;
    return parseFloat(res.toFixed(2));
  }
  return 0;
};

export const convertDenominatorWeightToMetricDivideBy100 = value => {
  const valueStr = value.toString();
  if (valueStr !== '.') {
    // convert to value/kgs
    // const res = (parseFloat(value) * 2.205) / 100;
    const res = parseFloat(value) * 2.205;
    return parseFloat(res.toFixed(2));
  }
  return 0;
};

//#endregion

//#endregion

//#region currency
export const getCurrencyKey = userData => {
  if (
    userData &&
    userData?.selectedCurrency &&
    !stringIsEmpty(userData?.selectedCurrency)
  ) {
    return userData?.selectedCurrency;
  }
  return null;
};

export const getCurrency = (currencyList, userData) => {
  let selectedCurrency = '';
  if (
    userData &&
    userData?.selectedCurrency &&
    !stringIsEmpty(userData?.selectedCurrency)
  ) {
    selectedCurrency = userData?.selectedCurrency;
  } else {
    return '';
  }
  const filteredList =
    currencyList?.length > 0
      ? currencyList?.filter(currency => currency.key === selectedCurrency)
      : [];
  if (filteredList && filteredList.length > 0) {
    const currency = filteredList[0];
    const bracketIndex = currency.value.indexOf('(');
    if (bracketIndex >= 0) {
      const spaceIndex = currency.value.indexOf(' ', bracketIndex);
      return currency.value.substring(bracketIndex + 1, spaceIndex);
    }
    return currency.key;
  }
  return '';
};

export const getCurrencyForTools = (currencyList, selectedCurrency) => {
  if (!selectedCurrency || stringIsEmpty(selectedCurrency)) {
    return '';
  }
  const filteredList = currencyList.filter(
    currency => currency.key === selectedCurrency,
  );
  if (filteredList && filteredList.length > 0) {
    const currency = filteredList[0];
    const bracketIndex = currency.value.indexOf('(');
    if (bracketIndex >= 0) {
      const spaceIndex = currency.value.indexOf(' ', bracketIndex);
      return currency.value.substring(bracketIndex + 1, spaceIndex);
    }
    return currency.key;
  }
  return '';
};
//#endregion

// Additional unit helpers for height
export const getHeightUnitByMeasure = unit => {
  if (unit) {
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return i18n.t('in');
    }
    return i18n.t('cm');
  }
  return '';
};

export const convertHeightToImperial = (value, decimalDigits = 3) => {
  if (value || value === 0) {
    // convert cm to inches
    const convertedValue = parseFloat(value.toString()) / 2.54;
    const valueStr = convertedValue.toString();
    const decimalIndex = valueStr.indexOf('.');
    if (decimalIndex > -1) {
      const numDigits = valueStr.substring(decimalIndex).length;
      if (numDigits > decimalDigits) {
        return parseFloat(convertedValue.toFixed(decimalDigits));
      }
    }
    return convertedValue;
  }
  return null;
};

export const convertHeightToMetric = value => {
  const valueStr = value?.toString?.() ?? String(value);
  if (valueStr !== '.') {
    // convert inches to cm
    const res = parseFloat(value) * 2.54;
    return parseFloat(res.toFixed(2));
  }
  return 0;
};
