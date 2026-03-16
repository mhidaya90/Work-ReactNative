import React from 'react';
// modules
import { addDays } from 'date-fns';

// constants
import {
  FORAGE_INVENTORIES_BAG_FIELDS,
  FORAGE_INVENTORIES_BUNKER_FIELDS,
  FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS,
  FORAGE_INVENTORIES_PILE_FIELDS,
  FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS,
} from '../constants/FormConstants';
import {
  FORAGE_INVENTORIES_INVENTORY,
  FORAGE_INVENTORIES_SILO_HEIGHT_MAX_LIMIT_METRIC,
  FORAGE_INVENTORIES_SILO_HEIGHT_MAX_LIMIT_IMPERIAL,
  UNIT_OF_MEASURE,
} from '../constants/AppConstants';
import {
  FORAGE_INVENTORIES_TYPES,
  HIGH_FEED_RATE_CENTIMETERS,
  LOW_FEED_RATE_CENTIMETERS,
  METER_TO_CENTIMETER,
} from '../constants/toolsConstants/ForageInventories';
import ROUTE_CONSTANTS from '../constants/RouteConstants';
import {
  PILE_CHINESE,
  PILE_ENGLISH,
  PILE_FRCA,
  PILE_FR,
  PILE_ITALIAN,
  PILE_KOREAN,
  PILE_POLISH,
  PILE_PORTUGUES,
  PILE_RUSSIAN,
  BAG_CHINESE,
  BAG_ENGLISH,
  BAG_FRCA,
  BAG_FR,
  BAG_ITALIAN,
  BAG_KOREAN,
  BAG_POLISH,
  BAG_PORTUGUES,
  BAG_RUSSIAN,
  BUNKER_CHINESE,
  BUNKER_ENGLISH,
  BUNKER_FRCA,
  BUNKER_FR,
  BUNKER_ITALIAN,
  BUNKER_KOREAN,
  BUNKER_POLISH,
  BUNKER_PORTUGUES,
  BUNKER_RUSSIAN,
  BOTTOM_L_SILO_CHINESE,
  BOTTOM_L_SILO_ENGLISH,
  BOTTOM_L_SILO_FRCA,
  BOTTOM_L_SILO_FR,
  BOTTOM_L_SILO_ITALIAN,
  BOTTOM_L_SILO_KOREAN,
  BOTTOM_L_SILO_POLISH,
  BOTTOM_L_SILO_PORTUGUES,
  BOTTOM_L_SILO_RUSSIAN,
  TOP_L_SILO_CHINESE,
  TOP_L_SILO_ENGLISH,
  TOP_L_SILO_FRCA,
  TOP_L_SILO_FR,
  TOP_L_SILO_ITALIAN,
  TOP_L_SILO_KOREAN,
  TOP_L_SILO_POLISH,
  TOP_L_SILO_PORTUGUES,
  TOP_L_SILO_RUSSIAN,
} from '../constants/AssetSVGConstants';

// localization
import i18n, { getLanguage } from '../localization/i18n';

// helpers
import {
  convertNumberToString,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import { dateHelper } from './dateHelper';
import { convertInputNumbersToRegionalBasis } from './genericHelper';

export const getDensityConverterData = () => {
  return [
    { lbValue: 8, kgValue: 128 },
    { lbValue: 9, kgValue: 144 },
    { lbValue: 10, kgValue: 160 },
    { lbValue: 11, kgValue: 176 },
    { lbValue: 12, kgValue: 192 },
    { lbValue: 13, kgValue: 208 },
    { lbValue: 14, kgValue: 224 },
    { lbValue: 15, kgValue: 240 },
    { lbValue: 16, kgValue: 256 },
    { lbValue: 17, kgValue: 272 },
    { lbValue: 18, kgValue: 288 },
    { lbValue: 19, kgValue: 304 },
    { lbValue: 20, kgValue: 320 },
  ];
};

export const getDefaultInventoryName = (name, number) => {
  return `${name} ${number}`;
};

export const getInventoryNumber = (allData, selectedInventoryKey) => {
  const filteredData = allData.filter(
    item => item.data.isPileOrBunker === selectedInventoryKey,
  );
  return filteredData ? filteredData.length + 1 : 1;
};

export const getRouteBySelectedIndex = index => {
  switch (index) {
    case 0:
      return ROUTE_CONSTANTS.FORAGE_INVENTORIES_PILE;

    case 1:
      return ROUTE_CONSTANTS.FORAGE_INVENTORIES_BUNKER;
    case 2:
      return ROUTE_CONSTANTS.TOP_UNLOADING_SILO;
    case 3:
      return ROUTE_CONSTANTS.BOTTOM_UNLOADING_SILO;

    case 4:
      return ROUTE_CONSTANTS.FORAGE_INVENTORIES_BAG;

    default:
      return ROUTE_CONSTANTS.FORAGE_INVENTORIES_PILE;
  }
};

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
    userData?.unitOfMeasure &&
    !stringIsEmpty(userData?.unitOfMeasure)
  ) {
    return userData?.unitOfMeasure;
  }
  return null;
};

export const getDistanceUnit = userData => {
  const unit = getUnitOfMeasure(userData);
  if (unit) {
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return i18n.t('feetUnit');
    }
    return i18n.t('meterUnit');
  }
  return '';
};

export const getAltDistanceValue = (value, unit) => {
  if (value && !stringIsEmpty(unit)) {
    const valueStr = value.toString();

    if (valueStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        // convert to meters
        return parseFloat(value) * 0.3048;
      } else {
        // convert to feet
        return parseFloat(value) * 3.28084;
      }
    }
  }
  return 0;
};

export const getAltDistanceText = (value, unit) => {
  value = value && convertStringToNumber(value);
  if (!stringIsEmpty(unit)) {
    const convertedValue = getAltDistanceValue(value, unit);
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return `${convertInputNumbersToRegionalBasis(
        convertedValue.toFixed(1),
        1,
      )} ${i18n.t('meters')}`;
    }
    return `${convertInputNumbersToRegionalBasis(
      convertedValue.toFixed(1),
      1,
    )} ${i18n.t('feet')}`;
  }
  return '';
};

export const getDensityUnit = userData => {
  const unit = getUnitOfMeasure(userData);
  if (unit) {
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return i18n.t('imperialDensityUnit');
    }
    return i18n.t('metricDensityUnit');
  }
  return '';
};

export const getAltDensityValue = (value, unit) => {
  if (value && !stringIsEmpty(unit)) {
    const valueStr = value.toString();
    if (valueStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        // convert to meters
        return parseFloat(value) * 16.0185;
      } else {
        // convert to feet
        return parseFloat(value) * 0.062428;
      }
    }
  }
  return 0;
};

export const getAltDensityText = (value, unit) => {
  value = value && convertStringToNumber(value);
  if (!stringIsEmpty(unit)) {
    const convertedValue = getAltDensityValue(value, unit);
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return `${convertInputNumbersToRegionalBasis(
        convertedValue.toFixed(1),
        1,
      )} ${i18n.t('metricDensityUnit')}`;
    }
    return `${convertInputNumbersToRegionalBasis(
      convertedValue.toFixed(1),
      1,
    )} ${i18n.t('imperialDensityUnit')}`;
  }
  return '';
};

export const createInventoryObject = (
  values,
  unit,
  enumState,
  selectedInventoryIndex,
) => {
  let inventoryType = '';
  let pileValues = '';
  if (enumState?.enum?.feedStorageType) {
    if (enumState?.enum?.feedStorageType.length > 0) {
      inventoryType =
        enumState?.enum?.feedStorageType[selectedInventoryIndex]?.key;
    }
  }
  // For Pile
  if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[0].id) {
    pileValues = prepareCreateUpdatePileValues(values, unit);
  }
  // For Bunker
  else if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[1].id) {
    pileValues = prepareCreateUpdateBunkerValues(values, unit);
  }
  // For Bag
  else if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[4].id) {
    pileValues = prepareCreateUpdateBagValues(values, unit);
  }
  // For Top Unloading
  else if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[2].id) {
    pileValues = prepareCreateUpdateTopUnloadingSiloValues(values, unit);
  }
  // For Bottom Unloading
  else if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[3].id) {
    pileValues = prepareCreateUpdateBottomUnloadingSiloValues(values, unit);
  }
  const obj = {
    ...pileValues,
    isPileOrBunker: inventoryType,
  };

  return obj;
};

export const getAltFeedOutValue = (value, unit) => {
  if (value && !stringIsEmpty(unit)) {
    const valueStr = value.toString();
    if (valueStr !== '.') {
      //formula provided by mike (consultant) - formula is not in sheet but values are calculated acc to this
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        return parseFloat(value) / 2.205;
      } else {
        return parseFloat(value) * 2.205;
      }
    }
  }
  return 0;
};

const calculateSilageDMDensitySilo = (
  diameterInMeters,
  heightOfSilageLeftInMeters,
  TonsDMSilo,
) => {
  if (
    !stringIsEmpty(diameterInMeters) &&
    !stringIsEmpty(heightOfSilageLeftInMeters) &&
    !stringIsEmpty(TonsDMSilo)
  ) {
    const radius = parseFloat(diameterInMeters) / 2;
    const finalVal = Math.PI * Math.pow(radius, 2);

    return Math.round(
      (parseFloat(TonsDMSilo) * 1000) /
        (finalVal * parseFloat(heightOfSilageLeftInMeters)),
      1,
    );
  } else {
    return null;
  }
};

const calculateFeedOutSurfaceAreaMetersSquaredSilo = diameterInMeters => {
  if (!stringIsEmpty(diameterInMeters)) {
    const radius = parseFloat(diameterInMeters) / 2;
    const pow = Math.pow(radius, 2);
    const finalVal = Math.PI * pow;

    return Math.round(finalVal);
  } else {
    return null;
  }
};

const calculateTopLength = (
  topWidthInMeters,
  bottomWidthInMeters,
  bottomLengthInMeters,
) => {
  if (
    !stringIsEmpty(topWidthInMeters) &&
    !stringIsEmpty(bottomLengthInMeters) &&
    !stringIsEmpty(bottomWidthInMeters)
  ) {
    const topWidth = Math.round(topWidthInMeters);
    const bottomWidth = Math.round(bottomWidthInMeters);
    const bottomLength = Math.round(bottomLengthInMeters);

    return bottomLength - (bottomWidth - topWidth);
  } else {
    return null;
  }
};

const calculateSlope = (
  widerWidthInMeters,
  narrowerWidthInMeters,
  heightInMeters,
) => {
  if (
    !stringIsEmpty(widerWidthInMeters) &&
    !stringIsEmpty(narrowerWidthInMeters) &&
    !stringIsEmpty(heightInMeters) &&
    heightInMeters != 0
  ) {
    const narrowerWidth = Math.round(narrowerWidthInMeters);
    const widerWidth = Math.round(widerWidthInMeters);
    return (widerWidth - narrowerWidth) / 2 / heightInMeters;
  } else {
    return null;
  }
};

const calculateTonnesAsFedPerMeterSquaredFootPrintArea = (
  tonnesAsFed,
  footPrintArea,
) => {
  if (
    !stringIsEmpty(tonnesAsFed) &&
    !stringIsEmpty(footPrintArea) &&
    footPrintArea != 0
  ) {
    return parseFloat(tonnesAsFed) / parseFloat(footPrintArea);
  } else {
    return null;
  }
};

const calculateFootPrintArea = (bottomLengthInMeters, bottomWidthInMeters) => {
  if (
    !stringIsEmpty(bottomLengthInMeters) &&
    !stringIsEmpty(bottomWidthInMeters)
  ) {
    return bottomLengthInMeters * bottomWidthInMeters;
  } else {
    return null;
  }
};

const calculateCowsPerDayNeededAtHigherFeedRate = (
  kilogramsDryMatterInOneMeter,
  feedOutInclusionRate,
  dryMatter,
) => {
  if (
    !stringIsEmpty(kilogramsDryMatterInOneMeter) &&
    !stringIsEmpty(feedOutInclusionRate) &&
    !stringIsEmpty(dryMatter) &&
    feedOutInclusionRate != 0 &&
    dryMatter != 0
  ) {
    return Math.round(
      ((kilogramsDryMatterInOneMeter / METER_TO_CENTIMETER) *
        HIGH_FEED_RATE_CENTIMETERS) /
        ((feedOutInclusionRate * dryMatter) / METER_TO_CENTIMETER),
      1,
    );
  } else {
    return null;
  }
};

const calculateKilogramsDryMatterInOneMeter = (
  feedOutSurfaceAreaMetersSquared,
  silageDMDensityInKgPerMetersCubed,
) => {
  if (
    !stringIsEmpty(feedOutSurfaceAreaMetersSquared) &&
    !stringIsEmpty(silageDMDensityInKgPerMetersCubed)
  ) {
    const silageDMDensity = Math.round(silageDMDensityInKgPerMetersCubed);

    return feedOutSurfaceAreaMetersSquared * silageDMDensity;
  } else {
    return null;
  }
};

const calculateCowsPerDayNeededAtLowerFeedRate = (
  kilogramsDryMatterInOneMeter,
  feedOutInclusionRate,
  dryMatter,
) => {
  if (
    !stringIsEmpty(kilogramsDryMatterInOneMeter) &&
    !stringIsEmpty(feedOutInclusionRate) &&
    !stringIsEmpty(dryMatter) &&
    feedOutInclusionRate != 0 &&
    dryMatter != 0
  ) {
    return Math.round(
      ((kilogramsDryMatterInOneMeter / METER_TO_CENTIMETER) *
        LOW_FEED_RATE_CENTIMETERS) /
        ((feedOutInclusionRate * dryMatter) / METER_TO_CENTIMETER),
    );
  } else {
    return null;
  }
};

const CalculateFeedOutSurfaceAreaMetersSquaredPile = (
  heightInMeters,
  bottomWidthInMeters,
  topWidthInMeters,
) => {
  if (
    !stringIsEmpty(heightInMeters) &&
    !stringIsEmpty(bottomWidthInMeters) &&
    !stringIsEmpty(topWidthInMeters)
  ) {
    const height = Math.round(heightInMeters);
    const topWidth = Math.round(topWidthInMeters);
    const bottomWidth = Math.round(bottomWidthInMeters);

    return Math.round(
      height * ((bottomWidth - topWidth) / 2) + height * topWidth,
    );
  } else {
    return null;
  }
};

// common function for silage as fed density(silageAsFedDensity)
const calculateSilageAsFedDensity = (
  silageDMDensityInKgPerMetersCubed,
  dryMatterPercentage,
) => {
  if (
    !stringIsEmpty(silageDMDensityInKgPerMetersCubed) &&
    silageDMDensityInKgPerMetersCubed &&
    stringIsEmpty(dryMatterPercentage) &&
    dryMatterPercentage != 0
  ) {
    return silageDMDensityInKgPerMetersCubed / (dryMatterPercentage / 100);
  } else {
    return null;
  }
};

const MIN = (param1, param2) => {
  return Math.min(param1, param2);
};

//#region TOP UNLOADING SILO

export const getTopUnloadingSilageDMDensity = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER] &&
    values[
      FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
    ] &&
    !stringIsEmpty(unit)
  ) {
    let diameter =
      convertStringToNumber(
        values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER],
        !conversionNeeded,
      ) ?? 0;

    let heightOfSilageLeftInSilo =
      convertStringToNumber(
        values[
          FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
        ],
        !conversionNeeded,
      ) ?? 0;

    const tonsDMSilo = getTopUnloadingTonsDM(values, unit, conversionNeeded);

    const radius = parseFloat(diameter) / 2;
    const finalVal = Math.PI * Math.pow(radius, 2);

    if (unit == UNIT_OF_MEASURE.IMPERIAL) {
      return (
        (parseFloat(tonsDMSilo) * 2000) /
        (finalVal * parseFloat(heightOfSilageLeftInSilo))
      );
    } else {
      return (
        (parseFloat(tonsDMSilo) * 1000) /
        (finalVal * parseFloat(heightOfSilageLeftInSilo))
      );
    }
  } else {
    return 0;
  }
};

export const getTopUnloadingTonsAF = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER] &&
    values[
      FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
    ] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FILLED_HEIGHT] &&
    !stringIsEmpty(unit)
  ) {
    let diameter =
      convertStringToNumber(
        values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER],
        !conversionNeeded,
      ) ?? 0;
    let filledHeight =
      convertStringToNumber(
        values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FILLED_HEIGHT],
        !conversionNeeded,
      ) ?? 0;
    let heightOfSilageLeftInSilo =
      convertStringToNumber(
        values[
          FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
        ],
        !conversionNeeded,
      ) ?? 0;
    let dryMatter =
      convertStringToNumber(
        values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER],
        !conversionNeeded,
      ) ?? 0;

    let val = 0;

    // for Metric
    if (unit == UNIT_OF_MEASURE.METRIC) {
      let a = (3.14 * (diameter * 3.280839 * diameter * 3.280839)) / 4;
      b =
        MIN(FORAGE_INVENTORIES_SILO_HEIGHT_MAX_LIMIT_METRIC, filledHeight) *
        3.280839;
      c = b - heightOfSilageLeftInSilo * 3.280839;

      val =
        (a * b * (-0.0012 * b * b + 0.2629 * b + 5.5952) -
          a * c * (-0.0012 * c * c + 0.2629 * c + 5.5952)) /
        (dryMatter / 100) /
        2000 /
        1.1023;
    } else {
      // for Imperial
      let a = (3.14 * (diameter * diameter)) / 4;
      let b = MIN(
        FORAGE_INVENTORIES_SILO_HEIGHT_MAX_LIMIT_IMPERIAL,
        filledHeight,
      );
      let c = b - heightOfSilageLeftInSilo;

      val =
        (a * b * (-0.0012 * b * b + 0.2629 * b + 5.5952) -
          a * c * (-0.0012 * c * c + 0.2629 * c + 5.5952)) /
        (dryMatter / 100) /
        2000;
    }
    if (!stringIsEmpty(val)) {
      return val;
    }
  }
  return 0;
};

export const getTopUnloadingTonsDM = (
  values,
  unit,
  conversionNeeded = false,
) => {
  let getTopUnloadingTonDM = getTopUnloadingTonsAF(
    values,
    unit,
    conversionNeeded,
  );

  if (
    !stringIsEmpty(getTopUnloadingTonDM) &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER]
  ) {
    let dryMatter =
      convertStringToNumber(
        values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER],
        !conversionNeeded,
      ) ?? 0;

    return (getTopUnloadingTonDM * dryMatter) / 100;
  }

  return 0;
};

export const getTopUnloadingSiloReferencesObject = () => {
  let obj = {};
  for (const key in FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS) {
    obj[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS[key]] = null;
  }
  return obj;
};

export const getDefaultTopUnloadingFormValues = defaultName => {
  return {
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.SILO_NAME]: defaultName,
    // Capacity
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FILLED_HEIGHT]: null,
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT]: null,
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER]: null,
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER]: null,
    // Feedout
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE]: null,
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED]: null,
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.START_DATE]: null,
  };
};

export const getTopUnloadingLbsDmInFoot = (
  values,
  unit,
  conversionNeeded = false,
) => {
  let silage = getTopUnloadingSilageDMDensity(values, unit, conversionNeeded);
  if (silage) {
    let topUnloadingFeedOutSurfaceArea = getTopUnloadingFeedOutSurfaceArea(
      values,
      conversionNeeded,
    );

    if (silage !== '.') {
      return parseFloat(silage) * parseFloat(topUnloadingFeedOutSurfaceArea);
    }
  }
  return 0;
};

export const getTopUnloadingFeedOutSurfaceArea = (
  values,
  conversionNeeded = false,
) => {
  if (values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER]) {
    let diameter = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER],
      !conversionNeeded,
    );

    if (!stringIsEmpty(diameter)) {
      return 3.1415926 * Math.pow(parseFloat(diameter) / 2, 2);
    }
  }
  return 0;
};

export const getTopUnloadingInchesCmPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    let cowsToBeFed = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    );
    let feedingRate = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    );
    let dryMatter = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER],
      !conversionNeeded,
    );
    let lbsDMIn1Foot = getTopUnloadingLbsDmInFoot(
      values,
      unit,
      conversionNeeded,
    );

    if (
      !stringIsEmpty(cowsToBeFed) &&
      cowsToBeFed.toString() !== '.' &&
      !stringIsEmpty(feedingRate) &&
      feedingRate.toString() !== '.' &&
      !stringIsEmpty(dryMatter) &&
      dryMatter.toString() !== '.' &&
      !stringIsEmpty(lbsDMIn1Foot) &&
      lbsDMIn1Foot.toString() !== '.'
    ) {
      if (unit == UNIT_OF_MEASURE.IMPERIAL) {
        return (
          ((parseFloat(cowsToBeFed) *
            ((parseFloat(feedingRate) * parseFloat(dryMatter)) / 100)) /
            parseFloat(lbsDMIn1Foot)) *
          12
        );
      } else {
        return (
          (parseFloat(cowsToBeFed) *
            (parseFloat(feedingRate) * parseFloat(dryMatter))) /
          parseFloat(lbsDMIn1Foot)
        );
      }
    }
  }
  return 0;
};

export const getTopUnloadingTonsPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    !stringIsEmpty(unit)
  ) {
    let cowsToBeFed = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    );
    let feedingRate = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    );

    if (
      !stringIsEmpty(cowsToBeFed) &&
      cowsToBeFed.toString() !== '.' &&
      !stringIsEmpty(feedingRate)
    ) {
      if (unit == UNIT_OF_MEASURE.IMPERIAL) {
        return (feedingRate * cowsToBeFed) / 2000;
      } else {
        return (feedingRate * cowsToBeFed) / 1000;
      }
    }
  }
  return 0;
};

export const getTopUnloadingAt3InchesDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    !stringIsEmpty(unit)
  ) {
    let dryMatter = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER],
      !conversionNeeded,
    );
    let feedingRate = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    );
    let lbsDmInFoot = getTopUnloadingLbsDmInFoot(
      values,
      unit,
      conversionNeeded,
    );

    if (
      !stringIsEmpty(dryMatter) &&
      dryMatter.toString() !== '.' &&
      !stringIsEmpty(feedingRate) &&
      feedingRate.toString() !== '.' &&
      !stringIsEmpty(lbsDmInFoot) &&
      lbsDmInFoot.toString() !== '.'
    ) {
      if (unit == UNIT_OF_MEASURE.IMPERIAL) {
        return lbsDmInFoot / 4 / ((feedingRate * dryMatter) / 100);
      } else {
        return ((lbsDmInFoot / 100) * 7) / ((feedingRate * dryMatter) / 100);
      }
    }
  }
  return 0;
};

export const getTopUnloadingAt6InchesDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    !stringIsEmpty(unit)
  ) {
    let dryMatter = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER],
      !conversionNeeded,
    );
    let feedingRate = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toFixed(1);
    let lbsDmInFoot = getTopUnloadingLbsDmInFoot(
      values,
      unit,
      conversionNeeded,
    );

    if (
      !stringIsEmpty(dryMatter) &&
      dryMatter.toString() !== '.' &&
      !stringIsEmpty(feedingRate) &&
      feedingRate.toString() !== '.' &&
      !stringIsEmpty(lbsDmInFoot) &&
      lbsDmInFoot.toString() !== '.'
    ) {
      if (unit == UNIT_OF_MEASURE.IMPERIAL) {
        return lbsDmInFoot / 2 / ((parseFloat(feedingRate) * dryMatter) / 100);
      } else {
        return (
          ((lbsDmInFoot / 100) * 15) /
          ((parseFloat(feedingRate) * dryMatter) / 100)
        );
      }
    }
  }
  return 0;
};

export const getTopUnloadingEndDate = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.START_DATE] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && cowsToBeFedStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 2000;
        if (denominator) {
          const tonsAF = getTopUnloadingTonsAF(values, unit, conversionNeeded);
          if (tonsAF) {
            let va = addDays(
              new Date(
                values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.START_DATE],
              ),
              tonsAF / denominator,
            );
            return addDays(
              new Date(
                values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.START_DATE],
              ),
              tonsAF / denominator,
            );
          }
        }
      } else {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 1000;
        if (denominator) {
          const tonsAF = getTopUnloadingTonsAF(values, unit, conversionNeeded);
          if (tonsAF) {
            return addDays(
              new Date(
                values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.START_DATE],
              ),
              tonsAF / denominator,
            );
          }
        }
      }
    }
  }
  return 0;
};

export const prepareCreateUpdateTopUnloadingSiloValues = (values, unit) => {
  let startDateValue = null;
  if (values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.START_DATE]) {
    const startDate = new Date(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.START_DATE],
    );
    startDateValue = startDate.toISOString();
  }

  const diameterInMeters = values[
    FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER],
          ),
        )
    : null;

  const silageLeftInMeters = values[
    FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[
              FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
            ],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[
              FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
            ],
          ),
        )
    : null;

  const feedOutInclusionRate = values[
    FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltFeedOutValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE],
          ),
        )
    : null;

  const dryMatterPercentage = values[
    FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER
  ]
    ? parseFloat(
        convertStringToNumber(
          values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER],
        ),
      )
    : null;

  const filledHeightInMeters = values[
    FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FILLED_HEIGHT
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FILLED_HEIGHT],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FILLED_HEIGHT],
          ),
        )
    : null;

  const obj = {
    name: values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.SILO_NAME],

    filledHeightInMeters: filledHeightInMeters,

    silageLeftInMeters: silageLeftInMeters,

    diameterInMeters: diameterInMeters,

    dryMatterPercentage: dryMatterPercentage,

    dryMatterPercentageSilo: dryMatterPercentage,

    feedOutInclusionRate: feedOutInclusionRate,

    cowsToBeFed: values.cowsToBeFed
      ? parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED],
          ),
        )
      : null,

    startDate: startDateValue,
  };

  // calculation for #silageDensity-TOP
  const silageDMDensityInKgPerMetersCubed = getTopUnloadingSilageDMDensity(
    values,
    unit,
    true,
  );
  obj.silageDMDensityInKgPerMetersCubed =
    silageDMDensityInKgPerMetersCubed || null;

  // calculation for #footPrintArea-TOP
  const footPrintArea = calculateFootPrintArea(
    filledHeightInMeters,
    silageLeftInMeters,
  );
  obj.footPrintArea = footPrintArea || null;

  // calculations for #tonnesOfDM-TOP
  const tonnesOfDM = getTopUnloadingTonsDM(values, unit, true)
    .toFixed(1)
    .toString();
  obj.tonnesOfDryMatter = tonnesOfDM;

  // calculations for #tonnesAsFed-TOp
  const tonnesAsFed = getTopUnloadingTonsAF(values, unit, true)
    .toFixed(1)
    .toString();
  obj.tonnesAsFed = tonnesAsFed;

  // calculations for #tonnesAsFedPerMeterSquaredFootPrintArea-TOP
  obj.tonnesAsFedPerMeterSquaredFootPrintArea =
    calculateTonnesAsFedPerMeterSquaredFootPrintArea(
      tonnesAsFed,
      footPrintArea,
    );

  // calculations for #silageAsFedDensity-TOP
  obj.silageAsFedDensity =
    calculateSilageAsFedDensity(
      silageDMDensityInKgPerMetersCubed,
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER]
        ? parseFloat(
            convertStringToNumber(
              values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER],
            ),
          )
        : null,
    ) || null;

  const silageDMDensitySiloKgPerMeter = calculateSilageDMDensitySilo(
    diameterInMeters,
    silageLeftInMeters,
    tonnesOfDM,
  );

  const feedOutSurfaceAreaMetersSquared =
    calculateFeedOutSurfaceAreaMetersSquaredSilo(diameterInMeters) || null;

  // calculations for #kgDMIn1MValue-TOP
  const kgDMIn1MValue =
    calculateKilogramsDryMatterInOneMeter(
      feedOutSurfaceAreaMetersSquared,
      silageDMDensitySiloKgPerMeter,
    ) || null;

  if (kgDMIn1MValue && !stringIsEmpty(kgDMIn1MValue)) {
    obj.kilogramsDryMatterInOneMeter = kgDMIn1MValue;
  }

  // calculations for #cowsPerDayNeededAtLowerFeedRate-TOP
  obj.cowsPerDayNeededAtLowerFeedRate =
    calculateCowsPerDayNeededAtLowerFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentage,
    ) || null;

  // calculations for #cowsPerDayNeededAtHigherFeedRate-TOP
  obj.cowsPerDayNeededAtHigherFeedRate =
    calculateCowsPerDayNeededAtHigherFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentage,
    ) || null;

  // calculations for #metersPerDay-TOP
  obj.metersPerDay =
    getTopUnloadingInchesCmPerDay(values, unit, true).toFixed(1).toString() ||
    null;

  return obj;
};

export const populateEditTopUnloadingForm = (values, unit) => {
  const startDate = values.startDate ? new Date(values.startDate) : null;
  return {
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.SILO_NAME]: values.name,
    // Capacity
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FILLED_HEIGHT]:
      values?.filledHeightInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values?.filledHeightInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  // .toFixed(1)
                  .toString()
              : values?.filledHeightInMeters.toString(),
          )
        : null,

    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT]:
      values?.silageLeftInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values?.silageLeftInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  // .toFixed(1)
                  .toString()
              : values?.silageLeftInMeters.toString(),
          )
        : null,

    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DIAMETER]:
      values?.diameterInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values?.diameterInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  // .toFixed(1)
                  .toString()
              : values?.diameterInMeters.toString(),
          )
        : null,

    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER]:
      values?.dryMatterPercentage != null
        ? convertNumberToString(values?.dryMatterPercentage).toString()
        : null,
    // Feedout

    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.FEEDING_RATE]:
      values?.feedOutInclusionRate != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltFeedOutValue(
                  values.feedOutInclusionRate,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.feedOutInclusionRate.toString(),
          )
        : null,
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED]:
      values?.cowsToBeFed != null
        ? convertNumberToString(values?.cowsToBeFed).toString()
        : null,
    [FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.START_DATE]: startDate
      ? dateHelper.getUnixTimestamp(startDate?.toISOString())
      : null,
  };
};
//#endregion

//#region BOTTOM UNLOADING SILO

export const getBottomUnloadingSiloReferencesObject = () => {
  let obj = {};
  for (const key in FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS) {
    obj[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS[key]] = null;
  }
  return obj;
};

export const getDefaultBottomUnloadingFormValues = defaultName => {
  return {
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.SILO_NAME]: defaultName,
    // Capacity
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FILLED_HEIGHT]: null,
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT]:
      null,
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER]: null,
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER]: null,
    // Feedout
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE]: null,
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED]: null,
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.START_DATE]: null,
  };
};

export const prepareCreateUpdateBottomUnloadingSiloValues = (values, unit) => {
  let startDateValue = null;
  if (values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.START_DATE]) {
    const startDate = new Date(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.START_DATE],
    );
    startDateValue = startDate.toISOString();
  }

  const diameterInMeters = values[
    FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER],
          ),
        )
    : null;

  const silageLeftInMeters = values[
    FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[
              FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS
                .HEIGHT_OF_SILAGE_LEFT
            ],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[
              FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS
                .HEIGHT_OF_SILAGE_LEFT
            ],
          ),
        )
    : null;

  const feedOutInclusionRate = values[
    FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltFeedOutValue(
          convertStringToNumber(
            values[
              FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE
            ],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[
              FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE
            ],
          ),
        )
    : null;

  const dryMatterPercentage = values[
    FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER
  ]
    ? parseFloat(
        convertStringToNumber(
          values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER],
        ),
      )
    : null;

  const obj = {
    name: values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.SILO_NAME],

    silageLeftInMeters: silageLeftInMeters,

    diameterInMeters: diameterInMeters,

    dryMatterPercentage: dryMatterPercentage,

    dryMatterPercentageSilo: dryMatterPercentage,

    feedOutInclusionRate: feedOutInclusionRate,

    cowsToBeFed: values.cowsToBeFed
      ? parseFloat(
          convertStringToNumber(
            values[
              FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED
            ],
          ),
        )
      : null,

    startDate: startDateValue,
  };

  // calculation for #silageDensity-BOTTOM
  const silageDMDensityInKgPerMetersCubed = getBottomUnloadingSilageDMDensity(
    values,
    unit,
    true,
  );
  obj.silageDMDensityInKgPerMetersCubed =
    silageDMDensityInKgPerMetersCubed || null;

  // calculation for #footPrintArea-BOTTOM
  const footPrintArea = calculateFootPrintArea(
    diameterInMeters,
    silageLeftInMeters,
  );
  obj.footPrintArea = footPrintArea || null;

  // calculations for #silageAsFedDensity-BOTTOM
  obj.silageAsFedDensity =
    calculateSilageAsFedDensity(
      silageDMDensityInKgPerMetersCubed,
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER]
        ? parseFloat(
            convertStringToNumber(
              values[
                FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER
              ],
            ),
          )
        : null,
    ) || null;

  // calculations for #tonnesOfDM-BOTTOM
  const tonnesOfDM = getBottomUnloadingTonsDM(values, unit, true)
    .toFixed(1)
    .toString();
  obj.tonnesOfDryMatter = tonnesOfDM || null;

  // calculations for #tonnesAsFed-BOTTOM
  const tonnesAsFed = getBottomUnloadingTonsAF(values, unit, true)
    .toFixed(1)
    .toString();
  obj.tonnesAsFed = tonnesAsFed || null;

  // calculations for #tonnesAsFedPerMeterSquaredFootPrintArea-BOTTOM
  obj.tonnesAsFedPerMeterSquaredFootPrintArea =
    calculateTonnesAsFedPerMeterSquaredFootPrintArea(
      tonnesAsFed,
      footPrintArea,
    ) || null;

  // calculations for #silageDMDensitySiloKgPerMeter-BOTTOM
  const silageDMDensitySiloKgPerMeter =
    calculateSilageDMDensitySilo(
      diameterInMeters,
      silageLeftInMeters,
      tonnesOfDM,
    ) || null;

  // calculations for #feedOutSurfaceAreaMetersSquared-BOTTOM
  const feedOutSurfaceAreaMetersSquared =
    calculateFeedOutSurfaceAreaMetersSquaredSilo(diameterInMeters) || null;

  // calculations for #kgDMIn1MValue-BOTTOM
  const kgDMIn1MValue =
    calculateKilogramsDryMatterInOneMeter(
      feedOutSurfaceAreaMetersSquared,
      silageDMDensitySiloKgPerMeter,
    ) || null;

  if (kgDMIn1MValue && !stringIsEmpty(kgDMIn1MValue)) {
    obj.kilogramsDryMatterInOneMeter = kgDMIn1MValue;
  }

  // calculations for #cowsPerDayNeededAtLowerFeedRate-BOTTOM
  obj.cowsPerDayNeededAtLowerFeedRate =
    calculateCowsPerDayNeededAtLowerFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentage,
    ) || null;

  // calculations for #cowsPerDayNeededAtHigherFeedRate-BOTTOM
  obj.cowsPerDayNeededAtHigherFeedRate =
    calculateCowsPerDayNeededAtHigherFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentage,
    ) || null;

  // calculations for #metersPerDay-BOTTOM
  obj.metersPerDay =
    getBottomUnloadingInchesCmPerDay(values, unit, true)
      .toFixed(1)
      .toString() || null;

  return obj;
};

export const populateEditBottomUnloadingForm = (values, unit) => {
  const startDate = values.startDate ? new Date(values.startDate) : null;
  return {
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.SILO_NAME]: values.name,
    // Capacity
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT]:
      values?.silageLeftInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values?.silageLeftInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  // .toFixed(1)
                  .toString()
              : values?.silageLeftInMeters.toString(),
          )
        : null,

    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER]:
      values?.diameterInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values?.diameterInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  // .toFixed(1)
                  .toString()
              : values?.diameterInMeters.toString(),
          )
        : null,

    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER]:
      values?.dryMatterPercentage != null
        ? convertNumberToString(values?.dryMatterPercentage).toString()
        : null,
    // Feedout

    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE]:
      values?.feedOutInclusionRate != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltFeedOutValue(
                  values.feedOutInclusionRate,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.feedOutInclusionRate.toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED]:
      values?.cowsToBeFed != null
        ? convertNumberToString(values?.cowsToBeFed).toString()
        : null,
    [FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.START_DATE]: startDate
      ? dateHelper.getUnixTimestamp(startDate?.toISOString())
      : null,
  };
};

export const getBottomUnloadingSilageDMDensity = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER] &&
    values[
      FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
    ] &&
    !stringIsEmpty(unit)
  ) {
    let diameter =
      convertStringToNumber(
        values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER],
        !conversionNeeded,
      ) ?? 0;

    let heightOfSilageLeftInSilo =
      convertStringToNumber(
        values[
          FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
        ],
        !conversionNeeded,
      ) ?? 0;

    const tonsDMSilo = getBottomUnloadingTonsDM(values, unit, conversionNeeded);

    const radius = parseFloat(diameter) / 2;
    const finalVal = Math.PI * Math.pow(radius, 2);

    if (unit == UNIT_OF_MEASURE.IMPERIAL) {
      return (
        (parseFloat(tonsDMSilo) * 2000) /
        (finalVal * parseFloat(heightOfSilageLeftInSilo))
      );
    } else {
      return (
        (parseFloat(tonsDMSilo) * 1000) /
        (finalVal * parseFloat(heightOfSilageLeftInSilo))
      );
    }
  } else {
    return 0;
  }
};

export const getBottomUnloadingTonsDM = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    let dryMatter = convertStringToNumber(
      values[FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS.DRY_MATTER],
      !conversionNeeded,
    );

    let tonsAF = getBottomUnloadingTonsAF(values, unit, conversionNeeded);

    if (
      !stringIsEmpty(dryMatter) &&
      dryMatter.toString() !== '.' &&
      !stringIsEmpty(tonsAF)
    ) {
      return (tonsAF * dryMatter) / 100;
    }
  }
  return 0;
};

export const getBottomUnloadingTonsAF = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER] &&
    values[
      FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
    ] &&
    !stringIsEmpty(unit)
  ) {
    let diameter =
      convertStringToNumber(
        values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER],
        !conversionNeeded,
      ) ?? 0;
    let heightOfSilageLeftInSilo =
      convertStringToNumber(
        values[
          FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.HEIGHT_OF_SILAGE_LEFT
        ],
        !conversionNeeded,
      ) ?? 0;
    let dryMatter =
      convertStringToNumber(
        values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER],
        !conversionNeeded,
      ) ?? 0;

    let val = 0;

    // for Metric
    if (unit == UNIT_OF_MEASURE.METRIC) {
      val =
        (((3.14 * (diameter * 3.28083989501312 * diameter * 3.28083989501312)) /
          4) *
          (heightOfSilageLeftInSilo * 3.28083989501312) *
          (-0.0012 *
            (heightOfSilageLeftInSilo * 3.28083989501312) *
            (heightOfSilageLeftInSilo * 3.28083989501312) +
            0.2629 * (heightOfSilageLeftInSilo * 3.28083989501312) +
            5.5952)) /
        (dryMatter / 100) /
        2000 /
        1.1023;
    } else {
      // for Imperial
      val =
        (((3.14 * (diameter * diameter)) / 4) *
          heightOfSilageLeftInSilo *
          (-0.0012 * heightOfSilageLeftInSilo * heightOfSilageLeftInSilo +
            0.2629 * heightOfSilageLeftInSilo +
            5.5952)) /
        (dryMatter / 100) /
        2000;
    }
    if (!stringIsEmpty(val)) {
      return val;
    }
  }
  return 0;
};

export const getBottomUnloadingLbsDmInFoot = (
  values,
  unit,
  conversionNeeded = false,
) => {
  let silage = getBottomUnloadingSilageDMDensity(
    values,
    unit,
    conversionNeeded,
  );
  if (silage) {
    const feedOutSurfaceArea = getBottomUnloadingFeedOutSurfaceArea(
      values,
      conversionNeeded,
    );

    if (silage !== '.') {
      return parseFloat(silage) * parseFloat(feedOutSurfaceArea);
    }
  }
  return 0;
};

export const getBottomUnloadingFeedOutSurfaceArea = (
  values,
  conversionNeeded = false,
) => {
  if (values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER]) {
    let diameter = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DIAMETER],
      !conversionNeeded,
    );

    if (!stringIsEmpty(diameter)) {
      return 3.1415926 * Math.pow(parseFloat(diameter) / 2, 2);
    }
  }
  return 0;
};

export const getBottomUnloadingInchesCmPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    let cowsToBeFed = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    );
    let feedingRate = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    );
    let dryMatter = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER],
      !conversionNeeded,
    );
    let lbsDMIn1Foot = getBottomUnloadingLbsDmInFoot(
      values,
      unit,
      conversionNeeded,
    );

    if (
      !stringIsEmpty(cowsToBeFed) &&
      cowsToBeFed.toString() !== '.' &&
      !stringIsEmpty(feedingRate) &&
      feedingRate.toString() !== '.' &&
      !stringIsEmpty(dryMatter) &&
      dryMatter.toString() !== '.' &&
      !stringIsEmpty(lbsDMIn1Foot) &&
      lbsDMIn1Foot.toString() !== '.'
    ) {
      if (unit == UNIT_OF_MEASURE.IMPERIAL) {
        return (
          ((parseFloat(cowsToBeFed) *
            ((parseFloat(feedingRate) * parseFloat(dryMatter)) / 100)) /
            parseFloat(lbsDMIn1Foot)) *
          12
        );
      } else {
        return (
          (parseFloat(cowsToBeFed) *
            (parseFloat(feedingRate) * parseFloat(dryMatter))) /
          parseFloat(lbsDMIn1Foot)
        );
      }
    }
  }
  return 0;
};

export const getBottomUnloadingTonsPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    !stringIsEmpty(unit)
  ) {
    let cowsToBeFed = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    );
    let feedingRate = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    );

    if (
      !stringIsEmpty(cowsToBeFed) &&
      cowsToBeFed.toString() !== '.' &&
      !stringIsEmpty(feedingRate)
    ) {
      if (unit == UNIT_OF_MEASURE.IMPERIAL) {
        return (feedingRate * cowsToBeFed) / 2000;
      } else {
        return (feedingRate * cowsToBeFed) / 1000;
      }
    }
  }
  return 0;
};

export const getBottomUnloadingAt3InchesDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    !stringIsEmpty(unit)
  ) {
    let dryMatter = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER],
      !conversionNeeded,
    );
    let feedingRate = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    );
    let lbsDmInFoot = getBottomUnloadingLbsDmInFoot(
      values,
      unit,
      conversionNeeded,
    );

    if (
      !stringIsEmpty(dryMatter) &&
      dryMatter.toString() !== '.' &&
      !stringIsEmpty(feedingRate) &&
      feedingRate.toString() !== '.' &&
      !stringIsEmpty(lbsDmInFoot) &&
      lbsDmInFoot.toString() !== '.'
    ) {
      if (unit == UNIT_OF_MEASURE.IMPERIAL) {
        return lbsDmInFoot / 4 / ((feedingRate * dryMatter) / 100);
      } else {
        return ((lbsDmInFoot / 100) * 7) / ((feedingRate * dryMatter) / 100);
      }
    }
  }
  return 0;
};

export const getBottomUnloadingEndDate = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.START_DATE] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && cowsToBeFedStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 2000;
        if (denominator) {
          const tonsAF = getBottomUnloadingTonsAF(
            values,
            unit,
            conversionNeeded,
          );
          if (tonsAF) {
            let va = addDays(
              new Date(
                values[
                  FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.START_DATE
                ],
              ),
              tonsAF / denominator,
            );
            return addDays(
              new Date(
                values[
                  FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.START_DATE
                ],
              ),
              tonsAF / denominator,
            );
          }
        }
      } else {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 1000;
        if (denominator) {
          const tonsAF = getBottomUnloadingTonsAF(
            values,
            unit,
            conversionNeeded,
          );
          if (tonsAF) {
            return addDays(
              new Date(
                values[
                  FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.START_DATE
                ],
              ),
              tonsAF / denominator,
            );
          }
        }
      }
    }
  }
  return 0;
};

export const getBottomUnloadingAt6InchesDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER] &&
    values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE] &&
    !stringIsEmpty(unit)
  ) {
    let dryMatter = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.DRY_MATTER],
      !conversionNeeded,
    );
    let feedingRate = convertStringToNumber(
      values[FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    );
    let lbsDmInFoot = getBottomUnloadingLbsDmInFoot(
      values,
      unit,
      conversionNeeded,
    );

    if (
      !stringIsEmpty(dryMatter) &&
      dryMatter.toString() !== '.' &&
      !stringIsEmpty(feedingRate) &&
      feedingRate.toString() !== '.' &&
      !stringIsEmpty(lbsDmInFoot) &&
      lbsDmInFoot.toString() !== '.'
    ) {
      if (unit == UNIT_OF_MEASURE.IMPERIAL) {
        return lbsDmInFoot / 2 / ((feedingRate * dryMatter) / 100);
      } else {
        return ((lbsDmInFoot / 100) * 15) / ((feedingRate * dryMatter) / 100);
      }
    }
  }
  return 0;
};
//#endregion

//#region  PILE
export const getDefaultPileFormValues = defaultPileName => {
  return {
    [FORAGE_INVENTORIES_PILE_FIELDS.PILE_NAME]: defaultPileName,
    // Capacity
    [FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY]: null,
    // Feedout
    [FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.START_DATE]: null,
  };
};

export const getPileTopLength = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH]
  ) {
    const bottomLengthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH],
      !conversionNeeded,
    ).toString();
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();

    if (
      bottomLengthStr !== '.' &&
      bottomWidthStr !== '.' &&
      topWidthStr !== '.'
    ) {
      return (
        parseFloat(bottomLengthStr) -
        (parseFloat(bottomWidthStr) - parseFloat(topWidthStr))
      );
    }
  }
  return 0;
};

export const prepareCreateUpdatePileValues = (values, unit) => {
  let startDateValue = null;
  if (values[FORAGE_INVENTORIES_PILE_FIELDS.START_DATE]) {
    const startDate = new Date(
      values[FORAGE_INVENTORIES_PILE_FIELDS.START_DATE],
    );
    startDateValue = startDate.toISOString();
  }

  const silageDMDensityInKgPerMetersCubed = values[
    FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDensityValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY],
          ),
        )
    : null;

  const heightInMeters = values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT]),
          unit,
        )
      : parseFloat(
          convertStringToNumber(values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT]),
        )
    : null;

  const bottomWidthInMeters = values[
    FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH],
          ),
        )
    : null;

  const topWidthInMeters = values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
          ),
        )
    : null;

  const feedOutInclusionRate = values[
    FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltFeedOutValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE],
          ),
        )
    : null;

  const dryMatterPercentage = values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER]
    ? parseFloat(
        convertStringToNumber(
          values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER],
        ),
      )
    : null;

  const bottomLengthInMeters = values[
    FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH],
          ),
        )
    : null;

  const obj = {
    name: values[FORAGE_INVENTORIES_PILE_FIELDS.PILE_NAME],

    topWidthInMeters: topWidthInMeters,

    bottomWidthInMeters: bottomWidthInMeters,

    heightInMeters: heightInMeters,

    bottomLengthInMeters: bottomLengthInMeters,

    dryMatterPercentage: dryMatterPercentage,

    silageDMDensityInKgPerMetersCubed: silageDMDensityInKgPerMetersCubed,

    feedOutInclusionRate: feedOutInclusionRate,

    cowsToBeFed: values[FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED]
      ? parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED],
          ),
        )
      : null,

    dryMatterOfFeedPerCowPerDay: null,

    startDate: startDateValue,
  };

  // calculation for #footPrintArea-PILE
  const footPrintArea = calculateFootPrintArea(
    bottomLengthInMeters,
    bottomWidthInMeters,
  );
  obj.footPrintArea = footPrintArea || null;

  // calculations for #slope-PILE
  const slope = calculateSlope(
    bottomWidthInMeters,
    topWidthInMeters,
    heightInMeters,
  );
  obj.slope = slope || null;

  // calculations for #tonnesAsFed-PILE
  const tonnesAsFed = getPileTonsAF(values, unit, true).toFixed(1).toString();
  // calculations for #tonnesAsFedPerMeterSquaredFootPrintArea-PILE
  obj.tonnesAsFedPerMeterSquaredFootPrintArea =
    calculateTonnesAsFedPerMeterSquaredFootPrintArea(
      tonnesAsFed,
      footPrintArea,
    );

  // calculations for #silageAsFedDensity-PILE
  obj.silageAsFedDensity =
    calculateSilageAsFedDensity(
      silageDMDensityInKgPerMetersCubed,
      values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER]
        ? parseFloat(values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER])
        : null,
    ) || null;

  // calculations for #feedOutSurfaceAreaMetersSquared-PILE
  const feedOutSurfaceAreaMetersSquared =
    CalculateFeedOutSurfaceAreaMetersSquaredPile(
      heightInMeters,
      bottomWidthInMeters,
      topWidthInMeters,
    );
  obj.feedOutSurfaceAreaMetersSquared = feedOutSurfaceAreaMetersSquared || null;

  // calculations for #kgDMIn1MValue-PILE
  const kgDMIn1MValue = calculateKilogramsDryMatterInOneMeter(
    feedOutSurfaceAreaMetersSquared,
    silageDMDensityInKgPerMetersCubed,
  );

  if (kgDMIn1MValue && !stringIsEmpty(kgDMIn1MValue)) {
    obj.kilogramsDryMatterInOneMeter = kgDMIn1MValue;
  }

  // calculations for #cowsPerDayNeededAtLowerFeedRate-PILE
  obj.cowsPerDayNeededAtLowerFeedRate =
    calculateCowsPerDayNeededAtLowerFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentage,
    ) || null;

  // calculations for #cowsPerDayNeededAtHigherFeedRate-PILE
  obj.cowsPerDayNeededAtHigherFeedRate =
    calculateCowsPerDayNeededAtHigherFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentage,
    ) || null;

  // calculations for #topLengthInMeters-PILE
  const topLengthInMeters = calculateTopLength(
    topWidthInMeters,
    bottomWidthInMeters,
    bottomLengthInMeters,
  );
  obj.topLengthInMeters = topLengthInMeters || null;

  // calculations for #metersPerDay-PILE
  obj.metersPerDay =
    getPileInchesPerDay(values, unit, true).toFixed(1).toString() || null;

  return obj;
};

const getPileCenterRectangle = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH]
  ) {
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();
    let pileTopLength = getPileTopLength(values, conversionNeeded);

    if (heightStr !== '.' && topWidthStr !== '.') {
      return parseFloat(heightStr) * parseFloat(topWidthStr) * pileTopLength;
    }
  }
  return 0;
};

const getPileOutsideTriangles = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT]
  ) {
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();

    if (bottomWidthStr !== '.' && topWidthStr !== '.' && heightStr !== '.') {
      return (
        ((parseFloat(bottomWidthStr) - parseFloat(topWidthStr)) / 2) *
        parseFloat(heightStr) *
        getPileTopLength(values, conversionNeeded)
      );
    }
  }
  return 0;
};

const getPileEndTriangles = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH]
  ) {
    const bottomLengthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH],
      !conversionNeeded,
    ).toString();
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();

    if (bottomLengthStr !== '.' && heightStr !== '.' && topWidthStr !== '.') {
      return (
        ((parseFloat(bottomLengthStr) -
          parseFloat(getPileTopLength(values, conversionNeeded))) /
          2) *
        parseFloat(heightStr) *
        parseFloat(topWidthStr)
      );
    }
  }
  return 0;
};

const getPileFourCorners = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH]
  ) {
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();
    const bottomLengthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH],
      !conversionNeeded,
    ).toString();

    if (
      heightStr !== '.' &&
      bottomWidthStr !== '.' &&
      topWidthStr !== '.' &&
      bottomLengthStr !== '.'
    ) {
      return (
        parseFloat(heightStr) *
        ((parseFloat(bottomWidthStr) - parseFloat(topWidthStr)) / 2) *
        ((parseFloat(bottomLengthStr) -
          parseFloat(getPileTopLength(values, conversionNeeded))) /
          2)
      );
    }
  }
  return 0;
};

const getPileVolume = (values, conversionNeeded = false) => {
  return (
    getPileCenterRectangle(values, conversionNeeded) +
    getPileOutsideTriangles(values, conversionNeeded) +
    getPileEndTriangles(values, conversionNeeded) +
    getPileFourCorners(values, conversionNeeded)
  );
};

export const getPileTonsDM = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY] &&
    !stringIsEmpty(unit)
  ) {
    const silageStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY],
      !conversionNeeded,
    ).toString();
    let pileVolume = getPileVolume(values, conversionNeeded);

    if (silageStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        return (parseFloat(pileVolume) * parseFloat(silageStr)) / 2000;
      } else {
        return (parseFloat(pileVolume) * parseFloat(silageStr)) / 1000;
      }
    }
  }
  return 0;
};

export const getPileTonsAF = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();
    let pileTonsDM = getPileTonsDM(values, unit, conversionNeeded);

    if (dryMatterStr !== '.') {
      if (parseFloat(dryMatterStr)) {
        return parseFloat(pileTonsDM) / (parseFloat(dryMatterStr) / 100);
      }
    }
  }
  return 0;
};

export const getPileSilageAFDensity = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER]
  ) {
    const silageStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();
    if (silageStr !== '.' && dryMatterStr !== '.') {
      if (parseFloat(dryMatterStr)) {
        return parseFloat(silageStr) / parseFloat(dryMatterStr);
      }
    }
  }
  return 0;
};

export const getPileSlope = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT]
  ) {
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();

    if (bottomWidthStr !== '.' && topWidthStr !== '.' && heightStr !== '.') {
      if (parseFloat(heightStr)) {
        return (
          (parseFloat(bottomWidthStr) - parseFloat(topWidthStr)) /
          2 /
          parseFloat(heightStr)
        );
      }
    }
  }
  return 0;
};

export const getPileFeedoutSurfaceArea = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT]
  ) {
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();

    if (bottomWidthStr !== '.' && topWidthStr !== '.' && heightStr !== '.') {
      return (
        parseFloat(heightStr) *
          ((parseFloat(bottomWidthStr) - parseFloat(topWidthStr)) / 2) +
        parseFloat(heightStr) * parseFloat(topWidthStr)
      );
    }
  }
  return 0;
};

export const getPileDM = (values, conversionNeeded = false) => {
  if (values[FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY]) {
    const silageStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY],
      !conversionNeeded,
    ).toString();

    if (silageStr !== '.') {
      return (
        parseFloat(silageStr) *
        getPileFeedoutSurfaceArea(values, conversionNeeded)
      );
    }
  }
  return 0;
};

export const getPileTonsPerDay = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && cowsToBeFedStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        return (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 2000;
      } else {
        return (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 1000;
      }
    }
  }
  return 0;
};

export const getPileInchesPerDay = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (
      feedingRateStr !== '.' &&
      cowsToBeFedStr !== '.' &&
      dryMatterStr !== '.'
    ) {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const DM = getPileDM(values, conversionNeeded);
        if (DM) {
          return (
            ((parseFloat(cowsToBeFedStr) *
              ((parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100)) /
              DM) *
            12
          );
        }
      } else {
        const DM = getPileDM(values, conversionNeeded);
        if (DM) {
          return (
            (parseFloat(cowsToBeFedStr) *
              (parseFloat(feedingRateStr) * parseFloat(dryMatterStr))) /
            DM
          );
        }
      }
    }
  }
  return 0;
};

export const getPile3InchesPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && dryMatterStr !== '.') {
      const denominator =
        (parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100;
      if (denominator) {
        const DM = getPileDM(values, conversionNeeded);

        if (unit === UNIT_OF_MEASURE.IMPERIAL) {
          return DM / 3 / denominator;
        } else {
          return ((DM / 100) * 7) / denominator;
        }
      }
    }
  }
  return 0;
};

export const getPile6InchesPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && dryMatterStr !== '.') {
      const denominator =
        (parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100;
      if (denominator) {
        const DM = getPileDM(values, conversionNeeded);
        if (unit === UNIT_OF_MEASURE.IMPERIAL) {
          return DM / 6 / denominator;
        } else {
          return ((DM / 100) * 15) / denominator;
        }
      }
    }
  }
  return 0;
};

export const getPileEndDate = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_PILE_FIELDS.START_DATE] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && cowsToBeFedStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 2000;
        if (denominator) {
          const tonsAF = getPileTonsAF(values, unit, conversionNeeded);
          if (tonsAF) {
            return addDays(
              new Date(values[FORAGE_INVENTORIES_PILE_FIELDS.START_DATE]),
              tonsAF / denominator,
            );
          }
        }
      } else {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 1000;
        if (denominator) {
          const tonsAF = getPileTonsAF(values, unit, conversionNeeded);
          if (tonsAF) {
            return addDays(
              new Date(values[FORAGE_INVENTORIES_PILE_FIELDS.START_DATE]),
              tonsAF / denominator,
            );
          }
        }
      }
    }
  }
  return 0;
};

export const getPileReferencesObject = () => {
  let obj = {};
  for (const key in FORAGE_INVENTORIES_PILE_FIELDS) {
    obj[FORAGE_INVENTORIES_PILE_FIELDS[key]] = null;
  }
  return obj;
};

export const populateEditPileForm = (values, unit) => {
  const startDate = values.startDate ? new Date(values.startDate) : null;

  return {
    [FORAGE_INVENTORIES_PILE_FIELDS.PILE_NAME]: values.name,
    // Capacity
    [FORAGE_INVENTORIES_PILE_FIELDS.HEIGHT]:
      values.heightInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.heightInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.heightInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_PILE_FIELDS.TOP_WIDTH]:
      values.topWidthInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.topWidthInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.topWidthInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_WIDTH]:
      values.bottomWidthInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.bottomWidthInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.bottomWidthInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_PILE_FIELDS.BOTTOM_LENGTH]:
      values.bottomLengthInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.bottomLengthInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.bottomLengthInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_PILE_FIELDS.DRY_MATTER]:
      values.dryMatterPercentage != null
        ? convertNumberToString(values.dryMatterPercentage.toString())
        : null,
    [FORAGE_INVENTORIES_PILE_FIELDS.SILAGE_DM_DENSITY]:
      values.silageDMDensityInKgPerMetersCubed != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDensityValue(
                  values.silageDMDensityInKgPerMetersCubed,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.silageDMDensityInKgPerMetersCubed.toFixed(1).toString(),
          )
        : null,
    // Feedout
    [FORAGE_INVENTORIES_PILE_FIELDS.FEEDING_RATE]:
      values.feedOutInclusionRate != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltFeedOutValue(
                  values.feedOutInclusionRate,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.feedOutInclusionRate.toString(),
          )
        : null,
    [FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED]:
      values.cowsToBeFed != null
        ? convertNumberToString(values.cowsToBeFed.toString())
        : null,
    [FORAGE_INVENTORIES_PILE_FIELDS.START_DATE]: startDate
      ? dateHelper.getUnixTimestamp(startDate?.toISOString())
      : null,
  };
};

export const updateInventoryObject = (
  oldValues,
  values,
  unit,
  selectedInventoryIndex,
) => {
  let pileValues = '';
  // For Pile
  if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[0].id) {
    pileValues = prepareCreateUpdatePileValues(values, unit);
  }
  // For Bunker
  else if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[1].id) {
    pileValues = prepareCreateUpdateBunkerValues(values, unit);
  }
  // For Bag
  else if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[4].id) {
    pileValues = prepareCreateUpdateBagValues(values, unit);
  }
  // For Top Unloading
  else if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[2].id) {
    pileValues = prepareCreateUpdateTopUnloadingSiloValues(values, unit);
  }
  // For Bottom Unloading
  else if (selectedInventoryIndex == FORAGE_INVENTORIES_INVENTORY[3].id) {
    pileValues = prepareCreateUpdateBottomUnloadingSiloValues(values, unit);
  }

  const obj = {
    ...oldValues,
    ...pileValues,
  };
  return obj;
};

//#endregion

//#region  BUNKER
export const prepareCreateUpdateBunkerValues = (values, unit) => {
  let startDateValue = null;
  if (values[FORAGE_INVENTORIES_BUNKER_FIELDS.START_DATE]) {
    const startDate = new Date(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.START_DATE],
    );
    startDateValue = startDate.toISOString();
  }

  const bottomWidthInMeters = values[
    FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH],
          ),
        )
    : null;

  const bottomLengthInMeters = values[
    FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH],
          ),
        )
    : null;

  const topWidthInMeters = values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH],
          ),
        )
    : null;

  const heightInMeters = values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT],
          ),
        )
    : null;

  const silageDMDensityInKgPerMetersCubed = values[
    FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDensityValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY],
          ),
        )
    : null;

  const feedOutInclusionRate = values[
    FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltFeedOutValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE],
          ),
        )
    : null;

  const dryMatterPercentage = values[
    FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER
  ]
    ? parseFloat(
        convertStringToNumber(
          values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER],
        ),
      )
    : null;

  const obj = {
    name: values[FORAGE_INVENTORIES_BUNKER_FIELDS.BUNKER_NAME],

    topWidthInMeters: topWidthInMeters,

    bottomWidthInMeters: bottomWidthInMeters,

    heightInMeters: heightInMeters,

    bottomLengthInMeters: bottomLengthInMeters,

    dryMatterPercentage: dryMatterPercentage,

    silageDMDensityInKgPerMetersCubed: silageDMDensityInKgPerMetersCubed,

    feedOutInclusionRate: feedOutInclusionRate,

    cowsToBeFed: values[FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED]
      ? parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED],
          ),
        )
      : null,

    dryMatterOfFeedPerCowPerDay: null,

    startDate: startDateValue,
  };

  // calculation for #footPrintArea-BUNKER
  const footPrintArea = calculateFootPrintArea(
    bottomLengthInMeters,
    topWidthInMeters,
  );
  obj.footPrintArea = footPrintArea || null;

  // calculations for #tonnesAsFed-BUNKER
  const tonnesAsFed = getBunkerTonsAF(values, unit, true).toFixed(1).toString();
  // calculations for #tonnesAsFedPerMeterSquaredFootPrintArea-BUNKER
  obj.tonnesAsFedPerMeterSquaredFootPrintArea =
    calculateTonnesAsFedPerMeterSquaredFootPrintArea(
      tonnesAsFed,
      footPrintArea,
    );

  // calculations for #slope-BUNKER
  const slope = calculateSlope(
    topWidthInMeters,
    bottomWidthInMeters,
    heightInMeters,
  );
  obj.slope = slope || null;

  // calculations for #silageAsFedDensity-BUNKER
  obj.silageAsFedDensity =
    calculateSilageAsFedDensity(
      silageDMDensityInKgPerMetersCubed,
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER]
        ? parseFloat(values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER])
        : null,
    ) || null;

  // calculations for #feedOutSurfaceAreaMetersSquared-BUNKER
  const feedOutSurfaceAreaMetersSquared =
    CalculateFeedOutSurfaceAreaMetersSquaredBunker(
      heightInMeters,
      bottomWidthInMeters,
      topWidthInMeters,
    );
  obj.feedOutSurfaceAreaMetersSquared = feedOutSurfaceAreaMetersSquared || null;

  // calculations for #kgDMIn1MValue-BUNKER
  const kgDMIn1MValue = calculateKilogramsDryMatterInOneMeter(
    feedOutSurfaceAreaMetersSquared,
    silageDMDensityInKgPerMetersCubed,
  );

  if (kgDMIn1MValue && !stringIsEmpty(kgDMIn1MValue)) {
    obj.kilogramsDryMatterInOneMeter = kgDMIn1MValue;
  }

  // calculations for #cowsPerDayNeededAtLowerFeedRate-BUNKER
  obj.cowsPerDayNeededAtLowerFeedRate =
    calculateCowsPerDayNeededAtLowerFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentage,
    );

  // calculations for #cowsPerDayNeededAtHigherFeedRate-BUNKER
  obj.cowsPerDayNeededAtHigherFeedRate =
    calculateCowsPerDayNeededAtHigherFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentage,
    );

  // calculations for #metersPerDay-BUNKER
  obj.metersPerDay =
    getBunkerInchesPerDay(values, unit, true).toFixed(1).toString() || null;

  return obj;
};

const CalculateFeedOutSurfaceAreaMetersSquaredBunker = (
  heightInMeters,
  bottomWidthInMeters,
  topWidthInMeters,
) => {
  if (
    !stringIsEmpty(heightInMeters) &&
    !stringIsEmpty(bottomWidthInMeters) &&
    !stringIsEmpty(topWidthInMeters)
  ) {
    return Math.round(
      (heightInMeters * (topWidthInMeters - bottomWidthInMeters)) / 2 +
        bottomWidthInMeters * heightInMeters,
    );
  } else {
    return null;
  }
};

export const getBunkerReferencesObject = () => {
  let obj = {};
  for (const key in FORAGE_INVENTORIES_BUNKER_FIELDS) {
    obj[FORAGE_INVENTORIES_BUNKER_FIELDS[key]] = null;
  }
  return obj;
};

export const getDefaultBunkerFormValues = defaultBunkerName => {
  return {
    [FORAGE_INVENTORIES_BUNKER_FIELDS.BUNKER_NAME]: defaultBunkerName,
    // Capacity
    [FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT]: null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH]: null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH]: null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH]: null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER]: null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY]: null,
    // Feedout
    [FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.COWS_TO_BE_FED]: null,
    [FORAGE_INVENTORIES_PILE_FIELDS.START_DATE]: null,
  };
};

const getBunkerCenterRectangle = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH]
  ) {
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const bottomLengthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH],
      !conversionNeeded,
    ).toString();

    if (
      heightStr !== '.' &&
      bottomWidthStr !== '.' &&
      bottomLengthStr !== '.'
    ) {
      return (
        parseFloat(heightStr) *
        parseFloat(bottomWidthStr) *
        parseFloat(bottomLengthStr)
      );
    }
  }
  return 0;
};

const getBunkerOutsideTriangles = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT]
  ) {
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();
    const bottomLengthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH],
      !conversionNeeded,
    ).toString();
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();

    if (
      bottomWidthStr !== '.' &&
      topWidthStr !== '.' &&
      bottomLengthStr !== '.' &&
      heightStr !== '.'
    ) {
      return (
        parseFloat(heightStr) *
        ((parseFloat(topWidthStr) - parseFloat(bottomWidthStr)) / 2) *
        parseFloat(bottomLengthStr)
      );
    }
  }
  return 0;
};

const getBunkerVolume = (values, conversionNeeded = false) => {
  return (
    getBunkerCenterRectangle(values, conversionNeeded) +
    getBunkerOutsideTriangles(values, conversionNeeded)
  );
};

export const getBunkerTonsDM = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY] &&
    !stringIsEmpty(unit)
  ) {
    const silageStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY],
      !conversionNeeded,
    ).toString();

    let bunkerVolume = getBunkerVolume(values, conversionNeeded);

    if (silageStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        return (parseFloat(bunkerVolume) * parseFloat(silageStr)) / 2000;
      } else {
        return (parseFloat(bunkerVolume) * parseFloat(silageStr)) / 1000;
      }
    }
  }
  return 0;
};

export const getBunkerTonsAF = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();
    let bunkerTonsDM = getBunkerTonsDM(values, unit, conversionNeeded);

    if (dryMatterStr !== '.') {
      if (parseFloat(dryMatterStr)) {
        return parseFloat(bunkerTonsDM) / (parseFloat(dryMatterStr) / 100);
      }
    }
  }
  return 0;
};

export const getBunkerFeedoutSurfaceArea = (
  values,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT]
  ) {
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();

    if (bottomWidthStr !== '.' && topWidthStr !== '.' && heightStr !== '.') {
      return (
        parseFloat(heightStr) *
          ((parseFloat(topWidthStr) - parseFloat(bottomWidthStr)) / 2) +
        parseFloat(heightStr) * parseFloat(bottomWidthStr)
      );
    }
  }
  return 0;
};

export const getBunkerDM = (values, conversionNeeded = false) => {
  if (values[FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY]) {
    const silageStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY],
      !conversionNeeded,
    ).toString();
    let bunkerFeedoutSurfaceArea = getBunkerFeedoutSurfaceArea(
      values,
      conversionNeeded,
    );
    if (silageStr !== '.') {
      return parseFloat(silageStr) * bunkerFeedoutSurfaceArea;
    }
  }
  return 0;
};

export const getBunkerInchesPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (
      feedingRateStr !== '.' &&
      cowsToBeFedStr !== '.' &&
      dryMatterStr !== '.'
    ) {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const DM = getBunkerDM(values, conversionNeeded);
        if (DM) {
          return (
            ((parseFloat(cowsToBeFedStr) *
              ((parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100)) /
              DM) *
            12
          );
        }
      } else {
        const DM = getBunkerDM(values, conversionNeeded);
        if (DM) {
          return (
            (parseFloat(cowsToBeFedStr) *
              (parseFloat(feedingRateStr) * parseFloat(dryMatterStr))) /
            DM
          );
        }
      }
    }
  }
  return 0;
};

export const getBunkerTonsPerDay = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && cowsToBeFedStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        return (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 2000;
      } else {
        return (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 1000;
      }
    }
  }
  return 0;
};

export const getBunker3InchesPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && dryMatterStr !== '.') {
      const denominator =
        (parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100;
      if (denominator) {
        const DM = getBunkerDM(values, conversionNeeded);
        if (unit === UNIT_OF_MEASURE.IMPERIAL) {
          return DM / 4 / denominator;
        } else {
          return ((DM / 100) * 7) / denominator;
        }
      }
    }
  }
  return 0;
};

export const getBunker6InchesPerDay = (
  values,
  unit,
  conversionNeeded = false,
) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && dryMatterStr !== '.') {
      const denominator =
        (parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100;
      if (denominator) {
        const DM = getBunkerDM(values, conversionNeeded);
        if (unit === UNIT_OF_MEASURE.IMPERIAL) {
          return DM / 2 / denominator;
        } else {
          return ((DM / 100) * 15) / denominator;
        }
      }
    }
  }
  return 0;
};

export const getBunkerEndDate = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.START_DATE] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && cowsToBeFedStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 2000;
        if (denominator) {
          const tonsAF = getBunkerTonsAF(values, unit, conversionNeeded);
          if (tonsAF) {
            return addDays(
              new Date(values[FORAGE_INVENTORIES_BUNKER_FIELDS.START_DATE]),
              tonsAF / denominator,
            );
          }
        }
      } else {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 1000;
        if (denominator) {
          const tonsAF = getBunkerTonsAF(values, unit, conversionNeeded);
          if (tonsAF) {
            return addDays(
              new Date(values[FORAGE_INVENTORIES_BUNKER_FIELDS.START_DATE]),
              tonsAF / denominator,
            );
          }
        }
      }
    }
  }
  return 0;
};

export const getBunkerSilageAFDensity = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER]
  ) {
    const silageStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (silageStr !== '.' && dryMatterStr !== '.') {
      if (parseFloat(dryMatterStr)) {
        return parseFloat(silageStr) / parseFloat(dryMatterStr);
      }
    }
  }
  return 0;
};

export const getBunkerSlope = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH] &&
    values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT]
  ) {
    const bottomWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH],
      !conversionNeeded,
    ).toString();
    const topWidthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH],
      !conversionNeeded,
    ).toString();
    const heightStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT],
      !conversionNeeded,
    ).toString();

    if (bottomWidthStr !== '.' && topWidthStr !== '.' && heightStr !== '.') {
      if (parseFloat(heightStr)) {
        return (
          (parseFloat(bottomWidthStr) - parseFloat(topWidthStr)) /
          2 /
          parseFloat(heightStr)
        );
      }
    }
  }
  return 0;
};

export const populateEditBunkerForm = (values, unit) => {
  const startDate = values.startDate ? new Date(values.startDate) : null;

  return {
    [FORAGE_INVENTORIES_BUNKER_FIELDS.BUNKER_NAME]: values.name,
    // Capacity
    [FORAGE_INVENTORIES_BUNKER_FIELDS.HEIGHT]:
      values.heightInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.heightInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.heightInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.TOP_WIDTH]:
      values.topWidthInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.topWidthInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.topWidthInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_WIDTH]:
      values.bottomWidthInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.bottomWidthInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.bottomWidthInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.BOTTOM_LENGTH]:
      values.bottomLengthInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.bottomLengthInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.bottomLengthInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.DRY_MATTER]:
      values.dryMatterPercentage != null
        ? convertNumberToString(values.dryMatterPercentage).toString()
        : null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.SILAGE_DM_DENSITY]:
      values.silageDMDensityInKgPerMetersCubed != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDensityValue(
                  values.silageDMDensityInKgPerMetersCubed,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.silageDMDensityInKgPerMetersCubed.toFixed(1).toString(),
          )
        : null,
    // Feedout
    [FORAGE_INVENTORIES_BUNKER_FIELDS.FEEDING_RATE]:
      values.feedOutInclusionRate != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltFeedOutValue(
                  values.feedOutInclusionRate,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.feedOutInclusionRate.toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.COWS_TO_BE_FED]:
      values.cowsToBeFed != null
        ? convertNumberToString(values.cowsToBeFed).toString()
        : null,
    [FORAGE_INVENTORIES_BUNKER_FIELDS.START_DATE]: startDate
      ? dateHelper.getUnixTimestamp(startDate?.toISOString())
      : null,
  };
};
//#endregion

//#region  BAG
export const prepareCreateUpdateBagValues = (values, unit) => {
  let startDateValue = null;
  if (values[FORAGE_INVENTORIES_BAG_FIELDS.START_DATE]) {
    const startDate = new Date(
      values[FORAGE_INVENTORIES_BAG_FIELDS.START_DATE],
    );
    startDateValue = startDate.toISOString();
  }

  const diameterBagInMeters = values[FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(values[FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER]),
          unit,
        )
      : parseFloat(
          convertStringToNumber(values[FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER]),
        )
    : null;

  const silageDMDensityBagKgPerMeter = values[
    FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDensityValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY],
          ),
        )
    : null;

  const feedOutInclusionRate = values[
    FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE
  ]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltFeedOutValue(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE],
          ),
          unit,
        )
      : parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE],
          ),
        )
    : null;

  const dryMatterPercentageBag = values[
    FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER
  ]
    ? parseFloat(
        convertStringToNumber(values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER]),
      )
    : null;

  const lengthInMeters = values[FORAGE_INVENTORIES_BAG_FIELDS.LENGTH]
    ? unit === UNIT_OF_MEASURE.IMPERIAL
      ? getAltDistanceValue(
          convertStringToNumber(values[FORAGE_INVENTORIES_BAG_FIELDS.LENGTH]),
          unit,
        )
      : parseFloat(
          convertStringToNumber(values[FORAGE_INVENTORIES_BAG_FIELDS.LENGTH]),
        )
    : null;

  const obj = {
    name: values[FORAGE_INVENTORIES_BAG_FIELDS.BAG_NAME],

    lengthInMeters: lengthInMeters,

    diameterBagInMeters: diameterBagInMeters,

    dryMatterPercentageBag: dryMatterPercentageBag,

    silageDMDensityBagKgPerMeter: silageDMDensityBagKgPerMeter,

    feedOutInclusionRate: feedOutInclusionRate,

    cowsToBeFed: values[FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED]
      ? parseFloat(
          convertStringToNumber(
            values[FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED],
          ),
        )
      : null,
    startDate: startDateValue,
  };

  // calculation for #footPrintArea-BAG
  const footPrintArea = calculateFootPrintArea(
    diameterBagInMeters,
    lengthInMeters,
  );
  obj.footPrintArea = footPrintArea || null;

  // calculations for #tonnesAsFed-BAG
  const tonnesAsFed = getBagTonsAF(values, unit, true).toFixed(1).toString();

  // calculations for #tonnesAsFedPerMeterSquaredFootPrintArea-BAG
  obj.tonnesAsFedPerMeterSquaredFootPrintArea =
    calculateTonnesAsFedPerMeterSquaredFootPrintArea(
      tonnesAsFed,
      footPrintArea,
    );

  const feedOutSurfaceAreaMetersSquared =
    calculateFeedOutSurfaceAreaMetersSquaredSilo(diameterBagInMeters);

  // calculations for #kgDMIn1MValue-BAG
  const kgDMIn1MValue = calculateKilogramsDryMatterInOneMeter(
    feedOutSurfaceAreaMetersSquared,
    silageDMDensityBagKgPerMeter,
  );

  if (kgDMIn1MValue && !stringIsEmpty(kgDMIn1MValue)) {
    obj.kilogramsDryMatterInOneMeter = kgDMIn1MValue;
  }

  // calculations for #cowsPerDayNeededAtLowerFeedRate-BAG
  obj.cowsPerDayNeededAtLowerFeedRate =
    calculateCowsPerDayNeededAtLowerFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentageBag,
    );

  // calculations for #cowsPerDayNeededAtHigherFeedRate-BAG
  obj.cowsPerDayNeededAtHigherFeedRate =
    calculateCowsPerDayNeededAtHigherFeedRate(
      kgDMIn1MValue,
      feedOutInclusionRate,
      dryMatterPercentageBag,
    );

  // calculations for #silageAsFedDensityBag-BAG
  obj.silageAsFedDensityBag = calculateSilageAsFedDensityBag(
    silageDMDensityBagKgPerMeter,
    dryMatterPercentageBag,
  );

  // calculations for #metersPerDay-BAG
  obj.metersPerDay =
    getBagInchesPerDay(values, unit, true).toFixed(1).toString() || null;

  return obj;
};

export const populateEditBagForm = (values, unit) => {
  const startDate = values.startDate ? new Date(values.startDate) : null;

  return {
    [FORAGE_INVENTORIES_BAG_FIELDS.BAG_NAME]: values.name,
    // Capacity
    [FORAGE_INVENTORIES_BAG_FIELDS.LENGTH]:
      values.lengthInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.lengthInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.lengthInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER]:
      values.diameterBagInMeters != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDistanceValue(
                  values.diameterBagInMeters,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.diameterBagInMeters.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER]:
      values.dryMatterPercentageBag != null
        ? convertNumberToString(values.dryMatterPercentageBag.toString())
        : null,
    [FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY]:
      values.silageDMDensityBagKgPerMeter != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltDensityValue(
                  values.silageDMDensityBagKgPerMeter,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.silageDMDensityBagKgPerMeter.toFixed(1).toString(),
          )
        : null,
    // Feedout
    [FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE]:
      values.feedOutInclusionRate != null
        ? convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? getAltFeedOutValue(
                  values.feedOutInclusionRate,
                  UNIT_OF_MEASURE.METRIC,
                )
                  .toFixed(1)
                  .toString()
              : values.feedOutInclusionRate.toFixed(1).toString(),
          )
        : null,
    [FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED]:
      values.cowsToBeFed != null
        ? convertNumberToString(values.cowsToBeFed.toString())
        : null,
    [FORAGE_INVENTORIES_BAG_FIELDS.START_DATE]: startDate
      ? dateHelper.getUnixTimestamp(startDate?.toISOString())
      : null,
  };
};

const calculateSilageAsFedDensityBag = (
  silageDMDensityInKgPerMetersCubed,
  dryMatterPercentage,
) => {
  if (
    !stringIsEmpty(silageDMDensityInKgPerMetersCubed) &&
    !stringIsEmpty(dryMatterPercentage) &&
    dryMatterPercentage != 0
  ) {
    return Math.round(
      silageDMDensityInKgPerMetersCubed / (dryMatterPercentage / 100),
    );
  } else {
    return null;
  }
};

export const getBagTonsDM = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.LENGTH] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY] &&
    !stringIsEmpty(unit)
  ) {
    const diameterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER],
      !conversionNeeded,
    ).toString();
    const lengthStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.LENGTH],
      !conversionNeeded,
    ).toString();
    const dmDensityStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY],
      !conversionNeeded,
    ).toString();

    if (diameterStr !== '.' && lengthStr !== '.' && dmDensityStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        return (
          (3.1415926 *
            Math.pow(parseFloat(diameterStr) / 2, 2) *
            parseFloat(lengthStr) *
            parseFloat(dmDensityStr)) /
          2000
        );
      } else {
        return (
          (3.1415926 *
            Math.pow(parseFloat(diameterStr) / 2, 2) *
            parseFloat(lengthStr) *
            parseFloat(dmDensityStr)) /
          1000
        );
      }
    }
  }
  return 0;
};

export const getBagTonsAF = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (dryMatterStr !== '.') {
      if (parseFloat(dryMatterStr)) {
        return (
          getBagTonsDM(values, unit, conversionNeeded) /
          (parseFloat(dryMatterStr) / 100)
        );
      }
    }
  }
  return 0;
};

export const getBagDM = (values, conversionNeeded = false) => {
  if (values[FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY]) {
    const densityStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY],
      !conversionNeeded,
    ).toString();
    let bagFeedoutSurfaceArea = getBagFeedoutSurfaceArea(
      values,
      conversionNeeded,
    );

    if (densityStr !== '.') {
      return parseFloat(densityStr) * bagFeedoutSurfaceArea;
    }
  }
  return 0;
};

export const getBagFeedoutSurfaceArea = (values, conversionNeeded = false) => {
  if (values[FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER]) {
    const diameterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER],
      !conversionNeeded,
    ).toString();

    if (diameterStr !== '.') {
      return 3.1415926 * Math.pow(parseFloat(diameterStr) / 2, 2);
    }
  }
  return 0;
};

export const getBagInchesPerDay = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (
      feedingRateStr !== '.' &&
      cowsToBeFedStr !== '.' &&
      dryMatterStr !== '.'
    ) {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const DM = getBagDM(values, conversionNeeded);
        if (DM) {
          return (
            ((parseFloat(cowsToBeFedStr) *
              ((parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100)) /
              DM) *
            12
          );
        }
      } else {
        const DM = getBagDM(values, conversionNeeded);
        if (DM) {
          return (
            (parseFloat(cowsToBeFedStr) *
              (parseFloat(feedingRateStr) * parseFloat(dryMatterStr))) /
            DM
          );
        }
      }
    }
  }
  return 0;
};

export const getBagTonsPerDay = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFed = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && cowsToBeFed !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        return (parseFloat(feedingRateStr) * parseFloat(cowsToBeFed)) / 2000;
      } else {
        return (parseFloat(feedingRateStr) * parseFloat(cowsToBeFed)) / 1000;
      }
    }
  }

  return 0;
};

export const getBag3InchesPerDay = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && dryMatterStr !== '.') {
      const DM = getBagDM(values, conversionNeeded);
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100;
        if (denominator) {
          return ((DM / 12) * 3) / denominator;
        }
      } else {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100;
        if (denominator) {
          return ((DM / 100) * 7) / denominator;
        }
      }
    }
  }
  return 0;
};

export const getBag6InchesPerDay = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && dryMatterStr !== '.') {
      const DM = getBagDM(values, conversionNeeded);
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100;
        if (denominator) {
          return DM / 2 / denominator;
        }
      } else {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(dryMatterStr)) / 100;
        if (denominator) {
          return ((DM / 100) * 15) / denominator;
        }
      }
    }
  }
  return 0;
};

export const getBagEndDate = (values, unit, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.START_DATE] &&
    !stringIsEmpty(unit)
  ) {
    const feedingRateStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE],
      !conversionNeeded,
    ).toString();
    const cowsToBeFedStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED],
      !conversionNeeded,
    ).toString();

    if (feedingRateStr !== '.' && cowsToBeFedStr !== '.') {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 2000;
        if (denominator) {
          const tonsAF = getBagTonsAF(values, unit, conversionNeeded);
          if (tonsAF) {
            return addDays(
              new Date(values[FORAGE_INVENTORIES_BAG_FIELDS.START_DATE]),
              tonsAF / denominator,
            );
          }
        }
      } else {
        const denominator =
          (parseFloat(feedingRateStr) * parseFloat(cowsToBeFedStr)) / 1000;
        if (denominator) {
          const tonsAF = getBagTonsAF(values, unit, conversionNeeded);
          if (tonsAF) {
            return addDays(
              new Date(values[FORAGE_INVENTORIES_BAG_FIELDS.START_DATE]),
              tonsAF / denominator,
            );
          }
        }
      }
    }
  }
  return 0;
};

export const getBagSilageAFDensity = (values, conversionNeeded = false) => {
  if (
    values[FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY] &&
    values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER]
  ) {
    const dmDensityStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY],
      !conversionNeeded,
    ).toString();
    const dryMatterStr = convertStringToNumber(
      values[FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER],
      !conversionNeeded,
    ).toString();
    if (dmDensityStr !== '.' && dryMatterStr !== '.') {
      if (parseFloat(dryMatterStr)) {
        return parseFloat(dmDensityStr) / (parseFloat(dryMatterStr) / 100);
      }
    }
  }
  return 0;
};

export const getBagReferencesObject = () => {
  let obj = {};
  for (const key in FORAGE_INVENTORIES_BAG_FIELDS) {
    obj[FORAGE_INVENTORIES_BAG_FIELDS[key]] = null;
  }
  return obj;
};

export const getDefaultBagFormValues = defaultBagName => {
  return {
    [FORAGE_INVENTORIES_BAG_FIELDS.BAG_NAME]: defaultBagName,
    // Capacity
    [FORAGE_INVENTORIES_BAG_FIELDS.LENGTH]: null,
    [FORAGE_INVENTORIES_BAG_FIELDS.DIAMETER]: null,
    [FORAGE_INVENTORIES_BAG_FIELDS.DRY_MATTER]: null,
    [FORAGE_INVENTORIES_BAG_FIELDS.DM_DENSITY]: null,
    // Feedout
    [FORAGE_INVENTORIES_BAG_FIELDS.FEEDING_RATE]: null,
    [FORAGE_INVENTORIES_BAG_FIELDS.COWS_TO_BE_FED]: null,
    [FORAGE_INVENTORIES_BAG_FIELDS.START_DATE]: null,
  };
};
//#endregion

//#region  Offline DB Helpers
export const prepareAddInventoryDBObject = (record, toolData) => {
  let pileBunkerData = record.pileAndBunker;
  if (pileBunkerData && !stringIsEmpty(pileBunkerData)) {
    if (pileBunkerData.pileBunkers) {
      pileBunkerData.pileBunkers = [
        ...pileBunkerData.pileBunkers,
        {
          ...toolData,
        },
      ];
    } else {
      pileBunkerData.pileBunkers = [
        {
          ...toolData,
        },
      ];
    }
  } else {
    pileBunkerData = {
      pileBunkers: [
        {
          ...toolData,
        },
      ],
    };
  }
  pileBunkerData.mobileLastUpdatedTime = dateHelper.getUnixTimestamp(
    new Date(),
  );
  return pileBunkerData;
};

export const prepareUpdateInventoryDBObject = (record, toolData, dbIndex) => {
  let pileBunkerData = record.pileAndBunker;
  if (pileBunkerData && !stringIsEmpty(pileBunkerData)) {
    if (pileBunkerData.pileBunkers) {
      const tempArray = [...pileBunkerData.pileBunkers];
      tempArray[dbIndex] = { ...toolData };
      pileBunkerData.pileBunkers = tempArray;
    }
  }
  pileBunkerData.mobileLastUpdatedTime = dateHelper.getUnixTimestamp(
    new Date(),
  );
  return pileBunkerData;
};

export const prepareDeleteInventoryDBObject = (record, dbIndex) => {
  let pileBunkerData = record.pileAndBunker;
  if (pileBunkerData && !stringIsEmpty(pileBunkerData)) {
    if (pileBunkerData.pileBunkers) {
      const tempArray = [...pileBunkerData.pileBunkers];
      tempArray.splice(dbIndex, 1);
      pileBunkerData.pileBunkers = tempArray;
    }
  }
  pileBunkerData.mobileLastUpdatedTime = dateHelper.getUnixTimestamp(
    new Date(),
  );
  return pileBunkerData;
};

export const getFormImageByLocale = (inventoryType, styles) => {
  let lang = getLanguage();

  switch (inventoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      return {
        en: <PILE_ENGLISH {...styles} />,
        fr: <PILE_FR {...styles} />,
        frca: <PILE_FRCA {...styles} />,
        it: <PILE_ITALIAN {...styles} />,
        ko: <PILE_KOREAN {...styles} />,
        pl: <PILE_POLISH {...styles} />,
        pt: <PILE_PORTUGUES {...styles} />,
        ru: <PILE_RUSSIAN {...styles} />,
        zh: <PILE_CHINESE {...styles} />,
      }[lang];
      break;

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      return {
        en: <BUNKER_ENGLISH {...styles} />,
        fr: <BUNKER_FR {...styles} />,
        frca: <BUNKER_FRCA {...styles} />,
        it: <BUNKER_ITALIAN {...styles} />,
        ko: <BUNKER_KOREAN {...styles} />,
        pl: <BUNKER_POLISH {...styles} />,
        pt: <BUNKER_PORTUGUES {...styles} />,
        ru: <BUNKER_RUSSIAN {...styles} />,
        zh: <BUNKER_CHINESE {...styles} />,
      }[lang];
      break;

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      return {
        en: <TOP_L_SILO_ENGLISH {...styles} />,
        fr: <TOP_L_SILO_FR {...styles} />,
        frca: <TOP_L_SILO_FRCA {...styles} />,
        it: <TOP_L_SILO_ITALIAN {...styles} />,
        ko: <TOP_L_SILO_KOREAN {...styles} />,
        pl: <TOP_L_SILO_POLISH {...styles} />,
        pt: <TOP_L_SILO_PORTUGUES {...styles} />,
        ru: <TOP_L_SILO_RUSSIAN {...styles} />,
        zh: <TOP_L_SILO_CHINESE {...styles} />,
      }[lang];
      break;

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      return {
        en: <BOTTOM_L_SILO_ENGLISH {...styles} />,
        fr: <BOTTOM_L_SILO_FR {...styles} />,
        frca: <BOTTOM_L_SILO_FRCA {...styles} />,
        it: <BOTTOM_L_SILO_ITALIAN {...styles} />,
        ko: <BOTTOM_L_SILO_KOREAN {...styles} />,
        pl: <BOTTOM_L_SILO_POLISH {...styles} />,
        pt: <BOTTOM_L_SILO_PORTUGUES {...styles} />,
        ru: <BOTTOM_L_SILO_RUSSIAN {...styles} />,
        zh: <BOTTOM_L_SILO_CHINESE {...styles} />,
      }[lang];
      break;

    case FORAGE_INVENTORIES_TYPES.BAG:
      return {
        en: <BAG_ENGLISH {...styles} />,
        fr: <BAG_FR {...styles} />,
        frca: <BAG_FRCA {...styles} />,
        it: <BAG_ITALIAN {...styles} />,
        ko: <BAG_KOREAN {...styles} />,
        pl: <BAG_POLISH {...styles} />,
        pt: <BAG_PORTUGUES {...styles} />,
        ru: <BAG_RUSSIAN {...styles} />,
        zh: <BAG_CHINESE {...styles} />,
      }[lang];
      break;

    default:
      break;
  }
};
//#endregion

/**
 * @description
 * helper model function to map on previous silos and filter unnecessary keys and data
 * function using in restoring previous silos
 *
 * @param {Object} silo silo model object
 * @returns {Object} mapped silo model
 */
export const remapSiloForReuseInNewVisit = silo => {
  if (silo) {
    const payload = {
      name: silo?.name,
      filledHeightInMeters: silo?.filledHeightInMeters,
      silageLeftInMeters: silo?.silageLeftInMeters,
      diameterInMeters: silo?.diameterInMeters,
      dryMatterPercentage: silo?.dryMatterPercentage,
      dryMatterPercentageSilo: silo?.dryMatterPercentageSilo,
      feedOutInclusionRate: silo?.feedOutInclusionRate,
      cowsToBeFed: silo?.cowsToBeFed,
      startDate: silo?.startDate,
      silageDMDensityInKgPerMetersCubed:
        silo?.silageDMDensityInKgPerMetersCubed,
      footPrintArea: silo?.footPrintArea,
      tonnesOfDryMatter: silo?.tonnesOfDryMatter,
      tonnesAsFed: silo?.tonnesAsFed,
      tonnesAsFedPerMeterSquaredFootPrintArea:
        silo?.tonnesAsFedPerMeterSquaredFootPrintArea,
      silageAsFedDensity: silo?.silageAsFedDensity,
      cowsPerDayNeededAtLowerFeedRate: silo?.cowsPerDayNeededAtLowerFeedRate,
      cowsPerDayNeededAtHigherFeedRate: silo?.cowsPerDayNeededAtHigherFeedRate,
      metersPerDay: silo?.metersPerDay,
      isPileOrBunker: silo?.isPileOrBunker,
      topWidthInMeters: silo?.topWidthInMeters,
      bottomWidthInMeters: silo?.bottomWidthInMeters,
      heightInMeters: silo?.heightInMeters,
      bottomLengthInMeters: silo?.bottomLengthInMeters,
      topLengthInMeters: silo?.topLengthInMeters,
      dryMatterOfFeedPerCowPerDay: silo?.dryMatterOfFeedPerCowPerDay,
      slope: silo?.slope,
      feedOutSurfaceAreaMetersSquared: silo?.feedOutSurfaceAreaMetersSquared,
      kilogramsDryMatterInOneMeter: silo?.kilogramsDryMatterInOneMeter,
      lengthInMeters: silo?.lengthInMeters,
      diameterBagInMeters: silo?.diameterBagInMeters,
      dryMatterPercentageBag: silo?.dryMatterPercentageBag,
      silageDMDensityBagKgPerMeter: silo?.silageDMDensityBagKgPerMeter,
      silageAsFedDensityBag: silo?.silageAsFedDensityBag,
    };

    return payload;
  }

  return null;
};
