import React from 'react';
//constants
import { UNIT_OF_MEASURE } from '../../constants/AppConstants';
import {
  HEAT_STRESS_GRAPH,
  HEAT_STRESS_GRAPH_CHINESE,
  HEAT_STRESS_GRAPH_FRENCH,
  HEAT_STRESS_GRAPH_FRENCH_CA,
  HEAT_STRESS_GRAPH_ITALIAN,
  HEAT_STRESS_GRAPH_KOREAN,
  HEAT_STRESS_GRAPH_POLISH,
  HEAT_STRESS_GRAPH_PORTUGUESE,
  HEAT_STRESS_GRAPH_RUSSIAN,
} from '../../constants/AssetSVGConstants';
import { STRESS_THRESHOLD_COLOR } from '../../constants/VisitReportConstants';
import { HEAT_STRESS_FIELD_CONSTANTS } from '../../constants/toolsConstants/heatStressConstants';

//localization
import i18n, { getLanguage } from '../../localization/i18n';

//store
import store from '../../store';

//helpers
import { convertNumberToString } from '../alphaNumericHelper';
import {
  getCurrencyForTools,
  getWeightUnitByMeasure,
} from '../appSettingsHelper';
import { getParsedToolData } from '../genericHelper';
import {
  createHeatStressFromValues,
  getLegendDescriptionForCard,
  getResultValues,
  isValueInBetween,
  parseHeatStressDataInImperial,
  returnDashIfNull,
} from '../heatStressHelper';
import { createDynamicObjForReqBody } from './visitReportHelper';

export const getHeatStressBody = (visitDetails, isEditable = false) => {
  const parsedToolData = getParsedToolData(visitDetails?.heatStress);

  const body = {};

  if (!parsedToolData) {
    return body;
  }

  let heatStressData = createHeatStressFromValues(
    visitDetails,
    parsedToolData,
    null,
    isEditable,
    visitDetails?.unitOfMeasure,
  );

  if (visitDetails?.unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    heatStressData = parseHeatStressDataInImperial(heatStressData);
  }

  const { currencies = [] } = store.getState()?.enums?.enum;
  const currencySymbol = getCurrencyForTools(
    currencies,
    visitDetails?.selectedCurrency,
  );

  const animalInputsData = getAnimalInputs(
    heatStressData,
    visitDetails?.unitOfMeasure,
    currencySymbol,
  );
  body.animalInputs = animalInputsData;

  const weatherData = getWeatherData(
    heatStressData,
    visitDetails?.unitOfMeasure,
  );
  body.weather = weatherData;

  const exposureData = getExposureData(heatStressData);
  body.exposure = exposureData;

  const heatStressResult = getHeatStressResult(
    heatStressData,
    visitDetails?.unitOfMeasure,
    currencySymbol,
  );

  body.unitOfMeasure = visitDetails?.unitOfMeasure || UNIT_OF_MEASURE.METRIC;

  const mergedBody = { ...body, ...heatStressResult };
  return mergedBody;
};

/** Start animal inputs */
const getAnimalInputs = (
  heatStressData,
  unitOfMeasure = '',
  selectedCurrency = '',
) => {
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  return [
    createDynamicObjForReqBody(
      i18n.t('lactatingAnimals'),
      convertNumberToString(heatStressData?.lactatingAnimal, true) ||
        i18n.t('numberPlaceholder'),
    ),
    createDynamicObjForReqBody(
      `${i18n.t('milkPrice')} (${selectedCurrency}/${weightUnit})`,
      convertNumberToString(heatStressData?.currentMilkPrice, true) ||
        i18n.t('numberPlaceholder'),
    ),
    createDynamicObjForReqBody(
      `${i18n.t('milkYield')} (${weightUnit})`,
      convertNumberToString(heatStressData?.milk, true) ||
        i18n.t('numberPlaceholder'),
    ),
    createDynamicObjForReqBody(
      `${i18n.t('dryMatterIntake')} (${weightUnit})`,
      convertNumberToString(heatStressData?.dryMatterIntake, true) ||
        i18n.t('numberPlaceholder'),
    ),
    createDynamicObjForReqBody(
      `${i18n.t('NELDairy(Kg)')} (${i18n.t('Mcal')}/${weightUnit})`,
      convertNumberToString(heatStressData?.netEnergyOfLactationDairy, true) ||
        i18n.t('numberPlaceholder'),
    ),
    createDynamicObjForReqBody(
      i18n.t('milkFat(%)'),
      convertNumberToString(heatStressData?.milkFatPercent, true) || '-',
    ),
    createDynamicObjForReqBody(
      i18n.t('milkProtein(%)'),
      convertNumberToString(heatStressData?.milkProteinPercent, true) || '-',
    ),
  ];
};

/** End animal inputs */

/** Start weather data */
const getWeatherData = (heatStressData, unitOfMeasure) => {
  return [
    createDynamicObjForReqBody(
      getTemperatureField(unitOfMeasure),
      heatStressData?.temperatureInCelsius || '-',
    ),
    createDynamicObjForReqBody(
      i18n.t('humidity(%)'),
      convertNumberToString(heatStressData?.humidityPercent, true) ||
        i18n.t('-'),
    ),
  ];
};

const getTemperatureField = unitOfMeasure => {
  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    return i18n.t('temperature(F)');
  }
  return i18n.t('temperature(C)');
};

/** End weather data */

/** Strt Exposure data */
const getExposureData = heatStressData => {
  return [
    createDynamicObjForReqBody(
      i18n.t('hoursOfSun'),
      convertNumberToString(heatStressData?.hoursExposedToSun, true) ||
        i18n.t('numberPlaceholder'),
    ),
  ];
};
/** End Exposure data */

/** Start Results */
const getHeatStressResult = (
  heatStressData,
  unitOfMeasure,
  selectedCurrency,
) => {
  const result = getResultValues(
    heatStressData,
    unitOfMeasure,
    selectedCurrency,
  );
  if (result && result.length > 0) {
    const THIMetric = result.find(
      item => item.name === HEAT_STRESS_FIELD_CONSTANTS.THI_CELSIUS,
    );
    const THIMImperial = result.find(
      item => item.name === HEAT_STRESS_FIELD_CONSTANTS.THI_FARENHEIT,
    );

    const colorValue = getColorValue(THIMetric?.value);
    const temperatureAndHumidityIndexValue = `${returnDashIfNull(
      THIMImperial?.value,
      THIMImperial?.unit,
    )} ${returnDashIfNull(THIMetric?.value, THIMetric?.unit)}`;
    const heatStressText = getLegendDescriptionForCard(THIMetric?.value);

    return {
      temperatureAndHumidityIndexValue: temperatureAndHumidityIndexValue,
      temperatureAndHumidityIndexColorValue: colorValue,
      heatStressColorText: heatStressText || '',
      results: getRemainingResultBody(result),
    };
  }

  return {};
};

const getColorValue = value => {
  if (isValueInBetween(value, 20, 22.9)) {
    return STRESS_THRESHOLD_COLOR.STRESS_THRESHOLD_GREEN;
  } else if (isValueInBetween(value, 23, 27.9)) {
    return STRESS_THRESHOLD_COLOR.STRESS_THRESHOLD_YELLOW;
  } else if (isValueInBetween(value, 28, 32.9)) {
    return STRESS_THRESHOLD_COLOR.STRESS_THRESHOLD_ORANGE;
  } else if (isValueInBetween(value, 33, 1000)) {
    return STRESS_THRESHOLD_COLOR.STRESS_THRESHOLD_RED;
  }
  return STRESS_THRESHOLD_COLOR.STRESS_THRESHOLD_GREEN;
};

const getRemainingResultBody = result => {
  const resultBody = {};
  result.forEach(item => {
    if (
      item?.name === HEAT_STRESS_FIELD_CONSTANTS.THI_CELSIUS ||
      item?.name === HEAT_STRESS_FIELD_CONSTANTS.THI_FARENHEIT
    ) {
      return null;
    } else {
      resultBody[i18n.t(`${item?.displayName}`)] =
        item.name === HEAT_STRESS_FIELD_CONSTANTS.MILK_LOSS_VALUE_DAY ||
        item.name === HEAT_STRESS_FIELD_CONSTANTS.MILK_LOSS_VALUE_MONTH
          ? returnDashIfNull(item.value, `${item.unit} `, true)
          : returnDashIfNull(item.value, ` ${item.unit}`);
    }
  });
  return resultBody;
};

/** End Results */

export const getHeatStressGraph = () => {
  const languageCode = getLanguage();
  switch (languageCode) {
    case 'en':
      return <HEAT_STRESS_GRAPH />;

    case 'fr':
      return <HEAT_STRESS_GRAPH_FRENCH />;

    case 'frca':
      return <HEAT_STRESS_GRAPH_FRENCH_CA />;

    case 'it':
      return <HEAT_STRESS_GRAPH_ITALIAN />;

    case 'ko':
      return <HEAT_STRESS_GRAPH_KOREAN />;

    case 'pl':
      return <HEAT_STRESS_GRAPH_POLISH />;

    case 'pt':
      return <HEAT_STRESS_GRAPH_PORTUGUESE />;

    case 'ru':
      return <HEAT_STRESS_GRAPH_RUSSIAN />;

    case 'zh':
      return <HEAT_STRESS_GRAPH_CHINESE />;

    default:
      return <HEAT_STRESS_GRAPH />;
  }
};

export const getHeatStressData = (visitDetails, isEditable = false) => {
  const parsedToolData = getParsedToolData(visitDetails?.heatStress);
  const body = {};

  if (!parsedToolData) {
    return body;
  }
  let heatStressData = createHeatStressFromValues(
    visitDetails,
    parsedToolData,
    null,
    isEditable,
    visitDetails?.unitOfMeasure,
  );
  const { currencies = [] } = store.getState()?.enums?.enum;
  const currencySymbol = getCurrencyForTools(
    currencies,
    visitDetails?.selectedCurrency,
  );
  const heatStressResult = getResultValues(
    heatStressData,
    visitDetails?.unitOfMeasure,
    currencySymbol,
  );
  return heatStressResult;
};
