//constants
import {
  DATE_FORMATS,
  KG_REGEX,
  UNIT_OF_MEASURE,
} from '../constants/AppConstants';
import {
  STRESS_THRESHOLD_GREEN,
  STRESS_THRESHOLD_ORANGE,
  STRESS_THRESHOLD_RED,
  STRESS_THRESHOLD_YELLOW,
} from '../constants/AssetSVGConstants';
import { HEAT_STRESS_FIELDS } from '../constants/FormConstants';
import colors from '../constants/theme/variables/customColor';
import {
  HEAT_STRESS_COLOR_CONSTANTS,
  HEAT_STRESS_COLOR_TEXT,
  HEAT_STRESS_DISPLAY_CONSTANTS,
  HEAT_STRESS_FIELD_CONSTANTS,
  HEAT_STRESS_MIN_IMPERIAL,
  HEAT_STRESS_MIN_METRIC,
} from '../constants/toolsConstants/heatStressConstants';

// localization
import i18n from '../localization/i18n';

//helpers
import {
  convertNumberToString,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import {
  convertWeightToImperial,
  convertDenominatorWeightToImperial,
  convertWeightToMetric,
  convertDenominatorWeightToMetric,
  convertDenominatorWeightToImperialMultiply100,
  convertDenominatorWeightToMetricDivideBy100,
  getWeightUnitByMeasure,
  convertStringToFixedDecimals,
} from './appSettingsHelper';
import { dateHelper } from './dateHelper';
import { convertInputNumbersToRegionalBasis } from './genericHelper';
import { logEvent } from './logHelper';

// milk sold evaluation initial values set to Formik initial state Data
export const createHeatStressFromValues = (
  data,
  visitData = '',
  userData = {},
  isEditable,
  unitOfMeasure,
  conversionNeeded = false,
) => {
  try {
    const visitHeatStressData = parseVisitHeatStressData(visitData);

    //saved visit data temp will always be in C therefore converting to F
    let tempFromVisitData = visitHeatStressData?.temperatureInCelsius || '';
    if (
      !stringIsEmpty(tempFromVisitData) &&
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
    ) {
      tempFromVisitData = calculateMetricToImperial(tempFromVisitData, 'F');
    }

    const obj = {
      [HEAT_STRESS_FIELDS.LACTATING_ANIMALS]: isEditable
        ? convertNumberToString(data?.lactatingAnimal, !conversionNeeded) || ''
        : convertNumberToString(
            visitHeatStressData?.avgLactatingAnimals,
            !conversionNeeded,
          ) || '',

      [HEAT_STRESS_FIELDS.CURRENT_MILK_PRICE]: isEditable
        ? convertNumberToString(
            convertStringToFixedDecimals(data?.currentMilkPrice, 3) ||
              data?.currentMilkPrice,
            !conversionNeeded,
          ) || ''
        : convertNumberToString(
            visitHeatStressData?.avgCurrentMilkPrice,
            !conversionNeeded,
          ) || '',

      [HEAT_STRESS_FIELDS.MILK_YIELD]: isEditable
        ? convertNumberToString(
            convertStringToFixedDecimals(data?.milk, 1),
            !conversionNeeded,
          ) || ''
        : convertNumberToString(
            visitHeatStressData?.avgMilkWeightInkg,
            !conversionNeeded,
          ) || '',

      [HEAT_STRESS_FIELDS.DRY_MATTER_INTAKE]: isEditable
        ? convertNumberToString(
            convertStringToFixedDecimals(data?.dryMatterIntake, 1) ||
              data?.dryMatterIntake,
            !conversionNeeded,
          ) || ''
        : convertNumberToString(
            visitHeatStressData?.avgDMIWeightInkg,
            !conversionNeeded,
          ) || '',

      [HEAT_STRESS_FIELDS.NEL_DAIRY]: isEditable
        ? convertNumberToString(
            convertStringToFixedDecimals(data?.netEnergyOfLactationDairy, 3) ||
              data?.netEnergyOfLactationDairy,
            !conversionNeeded,
          ) || ''
        : convertNumberToString(
            visitHeatStressData?.avgNELWeightInkg,
            !conversionNeeded,
          ) || '',

      [HEAT_STRESS_FIELDS.MILK_FAT]: isEditable
        ? convertNumberToString(
            convertStringToFixedDecimals(data?.milkFatPercent, 2) ||
              data?.milkFatPercent,
            !conversionNeeded,
          ) || ''
        : convertNumberToString(
            visitHeatStressData?.avgMilkFatPercent,
            !conversionNeeded,
          ) || '',

      [HEAT_STRESS_FIELDS.MILK_PROTEIN]: isEditable
        ? convertNumberToString(
            convertStringToFixedDecimals(data?.milkProteinPercent, 2) ||
              data?.milkProteinPercent,
            !conversionNeeded,
          ) || ''
        : convertNumberToString(
            visitHeatStressData?.avgMilkProteinPercent,
            !conversionNeeded,
          ) || '',

      [HEAT_STRESS_FIELDS.TEMPERATURE]: tempFromVisitData
        ? convertNumberToString(
            convertStringToFixedDecimals(tempFromVisitData, 2),
            !conversionNeeded,
          ) || ''
        : tempFromVisitData,

      [HEAT_STRESS_FIELDS.HUMIDITY]:
        convertNumberToString(
          convertStringToFixedDecimals(
            visitHeatStressData?.humidityPercent,
            2,
          ) || visitHeatStressData?.humidityPercent,
          !conversionNeeded,
        ) || '',

      [HEAT_STRESS_FIELDS.HOURS_OF_SUN]:
        convertNumberToString(
          visitHeatStressData?.hoursExposedToSun,
          !conversionNeeded,
        ) || '0',
    };

    return obj;
  } catch (error) {
    logEvent('createHeatStressFromValues error', { error });
  }
};

export const parseHeatStressDataInImperial = (
  data,
  //this function is called from visit report too so adding this bool so that other things are not impacted
  conversionNeeded = false,
) => {
  const defaultValues = { ...data };
  try {
    const payload = {
      ...defaultValues,
      [HEAT_STRESS_FIELDS.CURRENT_MILK_PRICE]: defaultValues?.currentMilkPrice
        ? convertNumberToString(
            convertDenominatorWeightToImperial(
              convertStringToNumber(
                defaultValues?.currentMilkPrice,
                !conversionNeeded,
              ),
              3,
            ),
            !conversionNeeded,
          )
        : null,

      [HEAT_STRESS_FIELDS.MILK_YIELD]: defaultValues?.milk
        ? convertNumberToString(
            convertWeightToImperial(
              convertStringToNumber(defaultValues?.milk, !conversionNeeded),
              1,
            ),
            !conversionNeeded,
          )
        : null,

      [HEAT_STRESS_FIELDS.DRY_MATTER_INTAKE]: defaultValues?.dryMatterIntake
        ? convertNumberToString(
            convertWeightToImperial(
              convertStringToNumber(
                defaultValues?.dryMatterIntake,
                !conversionNeeded,
              ),
              1,
            ),
            !conversionNeeded,
          )
        : null,

      [HEAT_STRESS_FIELDS.NEL_DAIRY]: defaultValues?.netEnergyOfLactationDairy
        ? convertNumberToString(
            convertDenominatorWeightToImperialMultiply100(
              convertStringToNumber(
                defaultValues?.netEnergyOfLactationDairy,
                !conversionNeeded,
              ),
              3,
            ),
            !conversionNeeded,
          )
        : null,
    };

    return payload;
  } catch (error) {
    logEvent('parseHeatStressDataInImperial error', { error, defaultValues });
  }
};

const parseVisitHeatStressData = visitData => {
  if (visitData === '') {
    return visitData;
  }
  if (typeof visitData === 'string') {
    return JSON.parse(visitData);
  }
  return visitData;
};

//#region UPDATING ALL SITE DATA FIELDS ON FOCUS CHANGE
// heat stress save data fields values convert String To Number
const getVisitDataConvertToNumber = (data, conversionNeeded = false) => {
  let obj = {
    lactatingAnimal: stringIsEmpty(data?.lactatingAnimal)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.lactatingAnimal)
      : Number(data?.lactatingAnimal),
    currentMilkPrice: stringIsEmpty(data?.currentMilkPrice)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.currentMilkPrice)
      : Number(data?.currentMilkPrice),
    milk: stringIsEmpty(data?.milk)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.milk)
      : Number(data?.milk),
    dryMatterIntake: stringIsEmpty(data?.dryMatterIntake)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.dryMatterIntake)
      : Number(data?.dryMatterIntake),
    netEnergyOfLactationDairy: stringIsEmpty(data?.netEnergyOfLactationDairy)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.netEnergyOfLactationDairy)
      : Number(data?.netEnergyOfLactationDairy),
    milkFatPercent: stringIsEmpty(data?.milkFatPercent)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.milkFatPercent)
      : Number(data?.milkFatPercent),
    milkProteinPercent: stringIsEmpty(data?.milkProteinPercent)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.milkProteinPercent)
      : Number(data?.milkProteinPercent),
    temperatureInCelsius: stringIsEmpty(data?.temperatureInCelsius)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.temperatureInCelsius)
      : Number(data?.temperatureInCelsius),
    humidityPercent: stringIsEmpty(data?.humidityPercent)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.humidityPercent)
      : Number(data?.humidityPercent),
    hoursExposedToSun: stringIsEmpty(data?.hoursExposedToSun)
      ? null
      : conversionNeeded
      ? convertStringToNumber(data?.hoursExposedToSun)
      : Number(data?.hoursExposedToSun),
  };

  return obj;
};

// save HEAT STRESS data
export const convertSiteValuesToNumber = (data, visitData, siteData) => {
  let visitDataConvertToNumber = getVisitDataConvertToNumber(data, true);
  return visitDataConvertToNumber;
};

// prepare HEAT STRESS data
export const onUpdateHeatStress = (data, visitData, siteData) => {
  let visitDataConvertToNumber = getVisitDataConvertToNumber(data, true);
  let siteDataObj = onUpdatedSiteData(visitDataConvertToNumber, siteData);
  return siteDataObj;
};

export const onUpdatedSiteData = (data, siteData, unitOfMeasure) => {
  let siteDataObj = {
    lactatingAnimal: data?.lactatingAnimal || null,
    currentMilkPrice:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && data?.currentMilkPrice
        ? convertDenominatorWeightToMetric(data?.currentMilkPrice)
        : data?.currentMilkPrice || null,

    milk:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && data?.milk
        ? convertWeightToMetric(data?.milk)
        : data?.milk || null,

    dryMatterIntake:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && data?.dryMatterIntake
        ? convertWeightToMetric(data?.dryMatterIntake)
        : data?.dryMatterIntake || null,

    netEnergyOfLactationDairy:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL &&
      data?.netEnergyOfLactationDairy
        ? convertDenominatorWeightToMetricDivideBy100(
            data?.netEnergyOfLactationDairy,
          )
        : data?.netEnergyOfLactationDairy || null,

    milkFatPercent: data?.milkFatPercent || null,
    milkProteinPercent: data?.milkProteinPercent || null,
    temperatureInCelsius: data?.temperatureInCelsius || null,
    humidityPercent: data?.humidityPercent || null,
    hoursExposedToSun: data?.hoursExposedToSun || null,
    updated: true,
    id: siteData?.id || null,
    siteName: siteData?.siteName || null,
  };

  return siteDataObj;
};
//#endregion

//#region UPDATING INDIVIDUAL SITE DATA FIELDS ON BLUR
// heat stress save data fields values convert String To Number
const getVisitDataConvertToNumberOnBlur = (key, value) => {
  let obj = {
    [key]:
      stringIsEmpty(value) || value === NaN
        ? null
        : convertStringToNumber(value),
  };
  return obj;
};

// prepare HEAT STRESS data for individual value
export const onUpdateHeatStressOnBlur = (key, value, siteData) => {
  let visitDataConvertToNumber = getVisitDataConvertToNumberOnBlur(key, value);
  let siteDataObj = onUpdatedSiteDataOnBlur(visitDataConvertToNumber, siteData);
  return siteDataObj;
};

export const onUpdatedSiteDataOnBlur = (data, siteData) => {
  let siteDataObj = {
    ...data,
    updated: true,
    id: siteData?.id,
    siteName: siteData?.siteName,
  };

  return siteDataObj;
};
//#endregion

export const getLabelWithUnit = (label, unit) => {
  let str = label;
  if (unit && !stringIsEmpty(unit)) {
    str = `${str} (${unit})`;
  }
  return str;
};

export const getUnitOfMeasure = userData => {
  if (
    userData &&
    userData.unitOfMeasure &&
    !stringIsEmpty(userData.unitOfMeasure)
  ) {
    return userData.unitOfMeasure;
  }
  return null;
};

const isNull = value => {
  return value === null;
};

export const calculateMetricToImperial = (temperature, unit = 'F') => {
  if (unit === 'F') {
    return (temperature * 1.8 + 32).toFixed(2);
  } else {
    return (((temperature - 32) * 5) / 9).toFixed(2);
  }
};

export const calculateTempHumidtyIndexImperial = (
  temperature,
  humidity,
  hoursOfSun,
) => {
  if (isNull(temperature) || isNull(humidity) || isNull(hoursOfSun)) {
    return null;
  }
  return (
    temperature -
    (0.55 - 0.0055 * humidity) * (temperature - 58) +
    0.4167 * hoursOfSun
  );
};

export const calculateTempHumidtyIndexMetric = (
  temperature,
  humidity,
  hoursOfSun,
) => {
  if (isNull(temperature) || isNull(humidity) || isNull(hoursOfSun)) {
    return null;
  }
  return (
    (1.8 * [temperature] +
      32 -
      (0.55 - 0.0055 * [humidity]) * (1.8 * [temperature] - 26.8) -
      32) /
      1.8 +
    0.4167 * [hoursOfSun]
  );
};

export const calculateIntakeAdjustment = (tempHumidtyIndex, unit) => {
  if (isNull(tempHumidtyIndex)) {
    return null;
  }
  //according to Mike's comment
  if (
    (unit == UNIT_OF_MEASURE.METRIC &&
      tempHumidtyIndex < HEAT_STRESS_MIN_METRIC) ||
    (unit == UNIT_OF_MEASURE.IMPERIAL &&
      tempHumidtyIndex < HEAT_STRESS_MIN_IMPERIAL)
  ) {
    return 100;
  } else {
    return 118.66 - tempHumidtyIndex * 0.93;
  }
};

export const calculateDMIAdjustment = intakeAdjustment => {
  if (isNull(intakeAdjustment)) {
    return null;
  }
  return 100 - intakeAdjustment;
};

export const calculateEstimatedDryMatterIntakeKG = (
  dryMatterIntake,
  intakeAdjustment,
) => {
  if (isNull(dryMatterIntake) || isNull(intakeAdjustment)) {
    return null;
  }
  return dryMatterIntake * (intakeAdjustment / 100);
}; // <- also  has LBs formula which is same

export const calculateReductionInDMIKG = (
  dryMatterIntake,
  estimatedDryMatterIntake,
) => {
  if (isNull(dryMatterIntake) || isNull(estimatedDryMatterIntake)) {
    return null;
  }
  return dryMatterIntake - estimatedDryMatterIntake;
}; // <- also  has LBs formula which is same

export const calculateLossOfEnergyConsumed = (reductionInDMI, nelDairy) => {
  if (isNull(reductionInDMI) || isNull(nelDairy)) {
    return null;
  }
  return reductionInDMI * nelDairy;
};

export const calculateLossOfEnergyConsumedInImperial = (
  reductionInDMI,
  nelDairy,
) => {
  if (isNull(reductionInDMI) || isNull(nelDairy)) {
    return null;
  }
  return reductionInDMI * nelDairy;
};

export const calculateEnergyEquivalentMilkLossMetric = (
  lossOfEnergyConsumed,
  milkFat,
  milkProtien,
) => {
  if (isNull(lossOfEnergyConsumed) || isNull(milkFat) || isNull(milkProtien)) {
    return null;
  }
  return (
    lossOfEnergyConsumed / (0.0929 * milkFat + 0.0547 * milkProtien + 0.192)
  );
};

export const calculateEnergyEquivalentMilkLossImperial = (
  lossOfEnergyConsumed = 0,
  milkFat,
  milkProtien,
) => {
  if (isNull(lossOfEnergyConsumed) || isNull(milkFat) || isNull(milkProtien)) {
    return null;
  }
  return (
    (lossOfEnergyConsumed / (0.0929 * milkFat + 0.0547 * milkProtien + 0.192)) *
    2.205
  );
};

export const calculateMilkValueLossPerDayMetric = (
  EnergyEquivalentMilkLoss,
  currentMilkPrice,
  lactatingAnimal,
) => {
  if (
    isNull(EnergyEquivalentMilkLoss) ||
    isNull(currentMilkPrice) ||
    isNull(lactatingAnimal)
  ) {
    return null;
  }
  return EnergyEquivalentMilkLoss * currentMilkPrice * lactatingAnimal;
};

export const calculateMilkValueLossPerDayImperial = (
  EnergyEquivalentMilkLoss,
  currentMilkPrice,
  lactatingAnimal,
) => {
  if (
    isNull(EnergyEquivalentMilkLoss) ||
    isNull(currentMilkPrice) ||
    isNull(lactatingAnimal)
  ) {
    return null;
  }
  return (EnergyEquivalentMilkLoss * currentMilkPrice * lactatingAnimal) / 100;
};

export const calculateMilkValueLossPerMonth = milkValueLossPerDay => {
  if (isNull(milkValueLossPerDay)) {
    return null;
  }
  return milkValueLossPerDay * 30.42;
};

export const getResultValuesMetric = (
  siteData = {},
  unitOfMeasure = UNIT_OF_MEASURE.METRIC,
  selectedCurrency,
  conversionNeeded = false,
) => {
  if (Object.keys(siteData).length === 0) {
    return {};
  }

  let data = getVisitDataConvertToNumber(siteData, conversionNeeded);
  let temperatureInCelsius = data?.temperatureInCelsius; //no conversion needed if metric
  let temperatureInFarenheit = data?.temperatureInCelsius; //no conversion needed if imperial

  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && temperatureInCelsius) {
    temperatureInCelsius = calculateMetricToImperial(temperatureInCelsius, 'C');
  } else if (
    unitOfMeasure === UNIT_OF_MEASURE.METRIC &&
    temperatureInFarenheit
  ) {
    temperatureInFarenheit = calculateMetricToImperial(
      temperatureInCelsius,
      'F',
    );
  }
  // const temperatureInFarenheit = calculateMetricToImperial(data?.temperatureInCelsius, 'F');

  const temperatureHumidityInCelsius = calculateTempHumidtyIndexMetric(
    temperatureInCelsius,
    data?.humidityPercent,
    data?.hoursExposedToSun,
  );
  const temperatureHumidityInFarenheit = calculateTempHumidtyIndexImperial(
    temperatureInFarenheit,
    data?.humidityPercent,
    data?.hoursExposedToSun,
  );
  const intakeAdjustmentPercent = calculateIntakeAdjustment(
    temperatureHumidityInCelsius,
    unitOfMeasure,
  );
  const dmiReductionPercent = calculateDMIAdjustment(intakeAdjustmentPercent);

  const estimatedDryMatterIntakeWeightInkg = parseFloat(
    calculateEstimatedDryMatterIntakeKG(
      data.dryMatterIntake,
      intakeAdjustmentPercent,
    ),
  );

  const reductionInDMIWeightInkg = calculateReductionInDMIKG(
    data?.dryMatterIntake,
    estimatedDryMatterIntakeWeightInkg,
  );
  const lossOfEnergyConsumedInMcal = calculateLossOfEnergyConsumed(
    reductionInDMIWeightInkg,
    data?.netEnergyOfLactationDairy,
  );

  const energyEquivalentMilkLossWeightInkg =
    calculateEnergyEquivalentMilkLossMetric(
      lossOfEnergyConsumedInMcal,
      data?.milkFatPercent,
      data?.milkProteinPercent,
    );

  const milkValueLossPerDay = calculateMilkValueLossPerDayMetric(
    energyEquivalentMilkLossWeightInkg,
    data?.currentMilkPrice,
    data?.lactatingAnimal,
  );

  const milkValueLossPerMonth =
    calculateMilkValueLossPerMonth(milkValueLossPerDay);

  return [
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.THI_CELSIUS,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.THI_CELSIUS,
      value: temperatureHumidityInCelsius
        ? parseFloat(temperatureHumidityInCelsius).toFixed(1)
        : null,
      unit: '°C',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.THI_FARENHEIT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.THI_FARENHEIT,
      value: temperatureHumidityInFarenheit
        ? parseFloat(temperatureHumidityInFarenheit).toFixed(1)
        : null,
      unit: '°F',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.INTAKE_ADJUSTMENT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.INTAKE_ADJUSTMENT,
      value: intakeAdjustmentPercent
        ? parseFloat(intakeAdjustmentPercent).toFixed(1)
        : null,
      unit: '%',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.DMI_PERCENT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.DMI_PERCENT,
      value: dmiReductionPercent
        ? parseFloat(dmiReductionPercent).toFixed(1)
        : null,
      unit: '%',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.EST_DRY_MATTER_WEIGHT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.EST_DRY_MATTER_WEIGHT,
      value: estimatedDryMatterIntakeWeightInkg
        ? parseFloat(estimatedDryMatterIntakeWeightInkg).toFixed(1)
        : null,
      unit: i18n.t('kg'),
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.REDUCTION_IN_DMI_WEIGHT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.REDUCTION_IN_DMI_WEIGHT,
      value: reductionInDMIWeightInkg
        ? parseFloat(reductionInDMIWeightInkg).toFixed(1)
        : null,
      unit: i18n.t('kg'),
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.LOSS_OF_ENERGY_CONSUMED,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.LOSS_OF_ENERGY_CONSUMED,
      value: lossOfEnergyConsumedInMcal
        ? parseFloat(lossOfEnergyConsumedInMcal).toFixed(2)
        : null,
      unit: i18n.t('Mcal'),
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.ENERGY_EQUIVALENT_MILK_LOSS_WEIGHT,
      displayName:
        HEAT_STRESS_DISPLAY_CONSTANTS.ENERGY_EQUIVALENT_MILK_LOSS_WEIGHT,
      value: energyEquivalentMilkLossWeightInkg
        ? parseFloat(energyEquivalentMilkLossWeightInkg).toFixed(1)
        : null,
      unit: i18n.t('kg'),
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.MILK_LOSS_VALUE_DAY,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.MILK_LOSS_VALUE_DAY,
      value: milkValueLossPerDay
        ? parseFloat(milkValueLossPerDay).toFixed(1)
        : null,
      unit: selectedCurrency,
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.MILK_LOSS_VALUE_MONTH,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.MILK_LOSS_VALUE_MONTH,
      value: milkValueLossPerMonth
        ? parseFloat(milkValueLossPerMonth).toFixed(1)
        : null,
      unit: selectedCurrency,
    },
  ];
};

export const getResultValuesImperial = (
  siteData = {},
  unitOfMeasure = UNIT_OF_MEASURE.METRIC,
  selectedCurrency,
  conversionNeeded = false,
) => {
  if (Object.keys(siteData).length === 0) {
    return {};
  }

  let data = getVisitDataConvertToNumber(siteData, conversionNeeded);

  let temperatureInCelsius = data?.temperatureInCelsius; //no conversion needed if metric
  let temperatureInFarenheit = data?.temperatureInCelsius; //no conversion needed if imperial

  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && temperatureInCelsius) {
    temperatureInCelsius = calculateMetricToImperial(temperatureInCelsius, 'C');
  } else if (
    unitOfMeasure === UNIT_OF_MEASURE.METRIC &&
    temperatureInFarenheit
  ) {
    temperatureInFarenheit = calculateMetricToImperial(
      temperatureInCelsius,
      'F',
    );
  }

  // const temperatureInFarenheit = calculateMetricToImperial(data?.temperatureInCelsius, 'F');

  let milkInLbs = data?.milk;
  let dmiInLbs = data?.dryMatterIntake;
  let nelDairy = data?.netEnergyOfLactationDairy;

  //converting since below values are displayed in kg but formula uses them in lbs or their imperial equivalent
  // if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
  //   milkInLbs = milkInLbs * 2.2;
  //   dmiInLbs = dmiInLbs * 2.2;
  //   nelDairy = nelDairy / 2.2;
  // }

  const temperatureHumidityInCelsius = calculateTempHumidtyIndexMetric(
    temperatureInCelsius,
    data?.humidityPercent,
    data?.hoursExposedToSun,
  );
  const temperatureHumidityInFarenheit = calculateTempHumidtyIndexImperial(
    temperatureInFarenheit,
    data?.humidityPercent,
    data?.hoursExposedToSun,
  );
  const intakeAdjustmentPercent = calculateIntakeAdjustment(
    temperatureHumidityInCelsius,
  );
  const dmiReductionPercent = calculateDMIAdjustment(intakeAdjustmentPercent);

  const estimatedDryMatterIntakeWeightInkg =
    calculateEstimatedDryMatterIntakeKG(dmiInLbs, intakeAdjustmentPercent);
  const reductionInDMIWeightInkg = calculateReductionInDMIKG(
    dmiInLbs,
    estimatedDryMatterIntakeWeightInkg,
  );
  const lossOfEnergyConsumedInMcal = calculateLossOfEnergyConsumedInImperial(
    reductionInDMIWeightInkg,
    nelDairy,
  );

  const energyEquivalentMilkLossWeightInkg =
    calculateEnergyEquivalentMilkLossImperial(
      lossOfEnergyConsumedInMcal,
      data?.milkFatPercent,
      data?.milkProteinPercent,
    );
  const milkValueLossPerDay = calculateMilkValueLossPerDayImperial(
    energyEquivalentMilkLossWeightInkg,
    data?.currentMilkPrice,
    data?.lactatingAnimal,
  );
  const milkValueLossPerMonth =
    calculateMilkValueLossPerMonth(milkValueLossPerDay);

  return [
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.THI_CELSIUS,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.THI_CELSIUS,
      value: temperatureHumidityInCelsius
        ? parseFloat(temperatureHumidityInCelsius).toFixed(1)
        : null,
      unit: '°C',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.THI_FARENHEIT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.THI_FARENHEIT,
      value: temperatureHumidityInFarenheit
        ? parseFloat(temperatureHumidityInFarenheit).toFixed(1)
        : null,
      unit: '°F',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.INTAKE_ADJUSTMENT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.INTAKE_ADJUSTMENT,
      value: intakeAdjustmentPercent
        ? parseFloat(intakeAdjustmentPercent).toFixed(1)
        : null,
      unit: '%',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.DMI_PERCENT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.DMI_PERCENT,
      value: dmiReductionPercent
        ? parseFloat(dmiReductionPercent).toFixed(1)
        : null,
      unit: '%',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.EST_DRY_MATTER_WEIGHT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.EST_DRY_MATTER_WEIGHT_LBS,
      value: estimatedDryMatterIntakeWeightInkg
        ? parseFloat(estimatedDryMatterIntakeWeightInkg).toFixed(1)
        : null,
      unit: 'lbs',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.REDUCTION_IN_DMI_WEIGHT,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.REDUCTION_IN_DMI_WEIGHT_LBS,
      value: reductionInDMIWeightInkg
        ? parseFloat(reductionInDMIWeightInkg).toFixed(1)
        : null,
      unit: 'lbs',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.LOSS_OF_ENERGY_CONSUMED,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.LOSS_OF_ENERGY_CONSUMED,
      value: lossOfEnergyConsumedInMcal
        ? parseFloat(lossOfEnergyConsumedInMcal).toFixed(2)
        : null,
      unit: 'Mcal',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.ENERGY_EQUIVALENT_MILK_LOSS_WEIGHT,
      displayName:
        HEAT_STRESS_DISPLAY_CONSTANTS.ENERGY_EQUIVALENT_MILK_LOSS_WEIGHT_LBS,
      value: energyEquivalentMilkLossWeightInkg
        ? parseFloat(energyEquivalentMilkLossWeightInkg).toFixed(1)
        : null,
      unit: 'lbs',
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.MILK_LOSS_VALUE_DAY,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.MILK_LOSS_VALUE_DAY,
      value: milkValueLossPerDay
        ? parseFloat(milkValueLossPerDay).toFixed(1)
        : null,
      unit: selectedCurrency,
    },
    {
      name: HEAT_STRESS_FIELD_CONSTANTS.MILK_LOSS_VALUE_MONTH,
      displayName: HEAT_STRESS_DISPLAY_CONSTANTS.MILK_LOSS_VALUE_MONTH,
      value: milkValueLossPerMonth
        ? parseFloat(milkValueLossPerMonth).toFixed(1)
        : null,
      unit: selectedCurrency,
    },
  ];
};

export const getResultValues = (
  siteData,
  unitOfMeasure = UNIT_OF_MEASURE.METRIC,
  selectedCurrency = '$',
  conversionNeeded = false,
) => {
  const result = isMetric(unitOfMeasure)
    ? getResultValuesMetric(
        siteData,
        unitOfMeasure,
        selectedCurrency,
        conversionNeeded,
      )
    : getResultValuesImperial(
        siteData,
        unitOfMeasure,
        selectedCurrency,
        conversionNeeded,
      );
  return result;
};

export const ifAdjustmentIs100Percent = result => {
  if (result && result?.length > 0) {
    const intakeAdjustment = result?.find(
      dr => dr?.name === HEAT_STRESS_FIELD_CONSTANTS.INTAKE_ADJUSTMENT,
    );
    if (
      intakeAdjustment &&
      intakeAdjustment?.value &&
      parseFloat(intakeAdjustment?.value) >= 100
    ) {
      return true;
    }
    return false;
  }
  return false;
};

export const arrayToObject = arr => {
  let rv = {};
  for (let i = 0; i < arr.length; ++i) rv[arr[i]?.name] = arr[i]?.value;
  return rv;
};

export const prepareHeatStressDataForSync = (
  siteData,
  result = [],
  visitData,
  unitOfMeasure = UNIT_OF_MEASURE.METRIC,
) => {
  let temperatureInCelsius = siteData?.temperatureInCelsius || null;
  //convert temp from F to C if imperial since temp will always be saved in C
  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && temperatureInCelsius) {
    temperatureInCelsius = calculateMetricToImperial(temperatureInCelsius, 'C');
  }

  const resultConvertedToObj = arrayToObject(result);
  const obj = {
    avgMilkWeightInkg:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && siteData?.milk
        ? convertWeightToMetric(siteData?.milk)
        : siteData?.milk ?? null,

    avgDMIWeightInkg:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && siteData?.dryMatterIntake
        ? convertWeightToMetric(siteData?.dryMatterIntake)
        : siteData?.dryMatterIntake ?? null,

    avgNELWeightInkg:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL &&
      siteData?.netEnergyOfLactationDairy
        ? convertDenominatorWeightToMetricDivideBy100(
            siteData?.netEnergyOfLactationDairy,
          )
        : siteData?.netEnergyOfLactationDairy ?? null,

    avgMilkFatPercent: siteData?.milkFatPercent ?? null,
    avgMilkProteinPercent: siteData?.milkProteinPercent ?? null,
    temperatureInCelsius: temperatureInCelsius
      ? Number(temperatureInCelsius)
      : null,
    humidityPercent: siteData?.humidityPercent ?? null,
    hoursExposedToSun: siteData?.hoursExposedToSun ?? null,
    temperatureHumidityInCelsius:
      resultConvertedToObj?.temperatureHumidityInCelsius
        ? Number(resultConvertedToObj?.temperatureHumidityInCelsius)
        : null,
    intakeAdjustmentPercent: resultConvertedToObj?.intakeAdjustmentPercent
      ? Number(resultConvertedToObj?.intakeAdjustmentPercent)
      : null,
    dmiReductionPercent: resultConvertedToObj?.dmiReductionPercent
      ? Number(resultConvertedToObj?.dmiReductionPercent)
      : null,
    estimatedDryMatterIntakeWeightInkg:
      resultConvertedToObj?.estimatedDryMatterIntakeWeightInkg
        ? Number(resultConvertedToObj?.estimatedDryMatterIntakeWeightInkg)
        : null,
    reductionInDMIWeightInkg: resultConvertedToObj?.reductionInDMIWeightInkg
      ? Number(resultConvertedToObj?.reductionInDMIWeightInkg)
      : null,
    lossOfEnergyConsumedInMcal: resultConvertedToObj?.lossOfEnergyConsumedInMcal
      ? Number(resultConvertedToObj?.lossOfEnergyConsumedInMcal)
      : null,
    energyEquivalentMilkLossWeightInkg:
      resultConvertedToObj?.energyEquivalentMilkLossWeightInkg
        ? Number(resultConvertedToObj?.energyEquivalentMilkLossWeightInkg)
        : null,
    avgLactatingAnimals: siteData?.lactatingAnimal ?? null,
    avgCurrentMilkPrice:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && siteData?.currentMilkPrice
        ? convertDenominatorWeightToMetric(siteData?.currentMilkPrice)
        : siteData?.currentMilkPrice || null,
    // localVisitId: visitData?.id,
    // updated_at: dateHelper.getUnixTimestamp(new Date()),
    // mobileLastUpdatedTime: dateHelper.getUnixTimestamp(new Date()),
  };

  return obj;
};

export const getLegendInformation = () => {
  return [
    {
      svg: STRESS_THRESHOLD_GREEN,
      title: i18n.t('stressThreshold'),
      body: i18n.t('stressThresholdText'),
    },
    {
      svg: STRESS_THRESHOLD_YELLOW,
      title: i18n.t('mildModerateStress'),
      body: i18n.t('mildModerateStressText'),
    },
    {
      svg: STRESS_THRESHOLD_ORANGE,
      title: i18n.t('moderateSevereStress'),
      body: i18n.t('moderateSevereStressText'),
    },
    {
      svg: STRESS_THRESHOLD_RED,
      title: i18n.t('severeStress'),
      body: i18n.t('severeStressText'),
    },
  ];
};

export const isValueInBetween = (value, startValue, endValue) => {
  if (value >= startValue && value <= endValue) {
    return true;
  }
  return false;
};

export const getColorCodingMetric = value => {
  if (isValueInBetween(value, 20, 22.5)) {
    return colors.tempGreenColor;
  } else if (isValueInBetween(value, 22.6, 27.4)) {
    return colors.tempYellowColor;
  } else if (isValueInBetween(value, 27.5, 32.5)) {
    return colors.tempOrangeColor;
  } else if (isValueInBetween(value, 32.6, 1000)) {
    return colors.tempRedColor;
  }
  return colors.tempGreenColor;
};

export const getColorCodingImperial = value => {
  if (isValueInBetween(value, 68, 72.5)) {
    return colors.tempGreenColor;
  } else if (isValueInBetween(value, 72.6, 80.5)) {
    return colors.tempYellowColor;
  } else if (isValueInBetween(value, 80.6, 90.5)) {
    return colors.tempOrangeColor;
  } else if (isValueInBetween(value, 90.6, 1000)) {
    return colors.tempRedColor;
  }
  return colors.tempGreenColor;
};

export const getColorCodedSvg = value => {
  if (isValueInBetween(value, 20, 22.5)) {
    return STRESS_THRESHOLD_GREEN;
  } else if (isValueInBetween(value, 22.6, 27.4)) {
    return STRESS_THRESHOLD_YELLOW;
  } else if (isValueInBetween(value, 27.5, 32.5)) {
    return STRESS_THRESHOLD_ORANGE;
  } else if (isValueInBetween(value, 32.6, 1000)) {
    return STRESS_THRESHOLD_RED;
  }
  return STRESS_THRESHOLD_GREEN;
};

export const getColorForExport = value => {
  if (isValueInBetween(value, 20, 22.5)) {
    return HEAT_STRESS_COLOR_CONSTANTS.GREEN;
  } else if (isValueInBetween(value, 22.6, 27.4)) {
    return HEAT_STRESS_COLOR_CONSTANTS.YELLOW;
  } else if (isValueInBetween(value, 27.5, 32.5)) {
    return HEAT_STRESS_COLOR_CONSTANTS.ORANGE;
  } else if (isValueInBetween(value, 32.6, 1000)) {
    return HEAT_STRESS_COLOR_CONSTANTS.RED;
  }
  return HEAT_STRESS_COLOR_CONSTANTS.GREEN;
};

export const getSectionLabel = fieldKey => {
  switch (fieldKey) {
    case HEAT_STRESS_FIELDS.LACTATING_ANIMALS:
      return i18n.t('animalInputs');
    case HEAT_STRESS_FIELDS.TEMPERATURE:
      return i18n.t('weather');
    case HEAT_STRESS_FIELDS.HOURS_OF_SUN:
      return i18n.t('exposure');
    default:
      return '';
  }
};

const isMetric = unitOfMeasure => {
  return unitOfMeasure === UNIT_OF_MEASURE.METRIC;
};

export const mapDataForHeatStressExport = (
  visitState,
  resultData,
  siteData,
  unitOfMeasure = UNIT_OF_MEASURE.METRIC,
  currencyLabel,
) => {
  let temperatureInCelsius = siteData?.temperatureInCelsius; //no conversion needed if metric
  let temperatureInFarenheit = siteData?.temperatureInCelsius; //no conversion needed if imperial

  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    temperatureInCelsius = calculateMetricToImperial(temperatureInCelsius, 'C');
  } else if (unitOfMeasure === UNIT_OF_MEASURE.METRIC) {
    temperatureInFarenheit = calculateMetricToImperial(
      temperatureInCelsius,
      'F',
    );
  }
  const stressColor = getColorForExport(
    resultData?.temperatureHumidityInCelsius || 0,
  );
  const stressName = HEAT_STRESS_COLOR_TEXT?.[stressColor];

  const model = {
    fileName: visitState.visitName + '-heatstressReport',
    visitName: visitState.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('HeatStress'),
    sheetName: i18n.t('heatStressSheet'),
    data: {
      weightLabel: getWeightUnitByMeasure(unitOfMeasure),
      currencyLabel: currencyLabel,
      temperatureInCelsius: resultData?.temperatureHumidityInCelsius
        ? Number(resultData?.temperatureHumidityInCelsius)
        : null,
      temperatureInFahrenheit: resultData?.temperatureHumidityInFarenheit
        ? Number(resultData?.temperatureHumidityInFarenheit)
        : null,
      stressColour: stressColor,
      stressName: stressName,
      inTakeAdjustment: resultData?.intakeAdjustmentPercent
        ? Number(resultData?.intakeAdjustmentPercent)
        : null,
      estimatedDryMatterIntake: resultData?.estimatedDryMatterIntakeWeightInkg
        ? Number(resultData?.estimatedDryMatterIntakeWeightInkg)
        : null,
      lossOfEnergyConsumed: resultData?.lossOfEnergyConsumedInMcal
        ? Number(resultData?.lossOfEnergyConsumedInMcal)
        : null,
      milkValueLossPerDay: resultData?.milkValueLossPerDay
        ? Number(resultData?.milkValueLossPerDay)
        : null,
      milkValueLossPerMonth: resultData?.milkValueLossPerMonth
        ? Number(resultData?.milkValueLossPerMonth)
        : null,
      dmiAdjustmentPercentage: resultData?.dmiReductionPercent
        ? Number(resultData?.dmiReductionPercent)
        : null,
      reductionInDmi: resultData?.reductionInDMIWeightInkg
        ? Number(resultData?.reductionInDMIWeightInkg)
        : null,
      energyEquivalentMilkLoss: resultData?.energyEquivalentMilkLossWeightInkg
        ? Number(resultData?.energyEquivalentMilkLossWeightInkg)
        : null,
      temperatureInCelsiusLabel: resultData?.temperatureHumidityInCelsius
        ? convertInputNumbersToRegionalBasis(
            resultData?.temperatureHumidityInCelsius,
            0,
            true,
          )
        : null,
      temperatureInFahrenheitLabel: resultData?.temperatureHumidityInFarenheit
        ? convertInputNumbersToRegionalBasis(
            resultData?.temperatureHumidityInFarenheit,
            0,
            true,
          )
        : null,

      inTakeAdjustmentLabel: resultData?.intakeAdjustmentPercent
        ? convertInputNumbersToRegionalBasis(
            resultData?.intakeAdjustmentPercent,
            0,
            true,
          )
        : null,
      estimatedDryMatterIntakeLabel:
        resultData?.estimatedDryMatterIntakeWeightInkg
          ? convertInputNumbersToRegionalBasis(
              resultData?.estimatedDryMatterIntakeWeightInkg,
              0,
              true,
            )
          : null,

      lossOfEnergyConsumedLabel: resultData?.lossOfEnergyConsumedInMcal
        ? convertInputNumbersToRegionalBasis(
            resultData?.lossOfEnergyConsumedInMcal,
            0,
            true,
          )
        : null,
      milkValueLossPerDayLabel: resultData?.milkValueLossPerDay
        ? convertInputNumbersToRegionalBasis(
            resultData?.milkValueLossPerDay,
            0,
            true,
          )
        : null,
      dmiAdjustmentPercentageLabel: resultData?.dmiReductionPercent
        ? convertInputNumbersToRegionalBasis(
            resultData?.dmiReductionPercent,
            0,
            true,
          )
        : null,
      reductionInDmiLabel: resultData?.reductionInDMIWeightInkg
        ? convertInputNumbersToRegionalBasis(
            resultData?.reductionInDMIWeightInkg,
            0,
            true,
          )
        : null,
      energyEquivalentMilkLossLabel:
        resultData?.energyEquivalentMilkLossWeightInkg
          ? convertInputNumbersToRegionalBasis(
              resultData?.energyEquivalentMilkLossWeightInkg,
              0,
              true,
            )
          : null,
      milkValueLossPerMonthLabel: resultData?.milkValueLossPerMonth
        ? convertInputNumbersToRegionalBasis(
            resultData?.milkValueLossPerMonth,
            0,
            true,
          )
        : null,
    },
    unitOfMeasure: unitOfMeasure,
  };

  return model;
};

export const getLegendDescriptionForCard = (value = 0) => {
  const stressColor = getColorForExport(value || 0);
  const stressName = HEAT_STRESS_COLOR_TEXT?.[stressColor];
  return stressName;
};

export const getHeatStressFieldLabel = (
  unitOfMeasure,
  key,
  label,
  selectedCurrency,
  weightUnit,
) => {
  if (unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL) {
    if (key == HEAT_STRESS_FIELDS.CURRENT_MILK_PRICE) {
      return `${i18n.t('currentMilkPrice')} (${selectedCurrency}/${i18n.t(
        'lbs',
      )})`;
    }

    if (key === HEAT_STRESS_FIELDS.MILK_YIELD) {
      return `${i18n.t('milkProduction')} (${i18n.t('lbs')})`;
    }

    if (key === HEAT_STRESS_FIELDS.NEL_DAIRY) {
      return `${i18n.t('NELDairy(Kg)')} (${i18n.t('Mcal')}/${i18n.t('lbs')})`;
    }

    let value = !!label?.length ? label?.replace(KG_REGEX, weightUnit) : '';
    return value;
  }

  if (key == HEAT_STRESS_FIELDS.CURRENT_MILK_PRICE) {
    return `${i18n.t('currentMilkPrice')} (${selectedCurrency}/${i18n.t(
      'kg',
    )})`;
  }

  if (key === HEAT_STRESS_FIELDS.MILK_YIELD) {
    return `${i18n.t('milkProduction')} (${i18n.t('kg')})`;
  }

  if (key === HEAT_STRESS_FIELDS.NEL_DAIRY) {
    return `${i18n.t('NELDairy(Kg)')} (${i18n.t('Mcal')}/${i18n.t('kg')})`;
  }

  return label;
};

export const returnDashIfNull = (value, unit = '', unitAsPrefix = false) => {
  if (value) {
    if (unitAsPrefix) {
      return unit + value;
    } else {
      return value + unit;
    }
  } else {
    return '-';
  }
};
