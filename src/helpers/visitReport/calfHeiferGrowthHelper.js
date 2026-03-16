// constants
import { CALF_HEIFER_GROWTH_FIELDS } from '../../constants/FormConstants';
import { GROWTH_SCALE_OPTIONS } from '../../constants/toolsConstants/CalfHeiferGrowthConstants';

// localization
import i18n from '../../localization/i18n';

// helpers
import {
  convertInputNumbersToRegionalBasis,
  getParsedToolData,
} from '../genericHelper';
import {
  getCalfHeiferGrowthSummary,
  getCalfHeiferGrowthTargets,
  getCalfHeiferGrowthGraphData,
} from '../calfHeiferGrowthHelper';

/**
 * Prepares Calf & Heifer Growth data for visit report
 * Calculates summary directly from visitDetails without relying on Redux state
 * @param {Object} visitDetails - Visit details from Redux state
 * @returns {Object} - Prepared data for report rendering including calculated summary
 */
export const getCalfHeiferGrowthBody = visitDetails => {
  const calfHeiferGrowthData = getParsedToolData(
    visitDetails?.calfHeiferGrowth,
  );

  const result = {
    settings: null,
    animals: [],
    growthType: null,
    summary: null,
    visualizationOption: null,
  };

  if (!calfHeiferGrowthData) {
    return result;
  }

  // Get growth type
  result.growthType =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

  // Visualization option
  result.visualizationOption =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.VISUALIZATION];

  // Get settings
  const settings = calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS];
  if (settings) {
    result.settings = {
      ageAtFirstCalving:
        settings?.[CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS],
      // matureBodyWeight:
      //   settings?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG],
      // birthWeight: settings?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG],
      // matureBodyHeight:
      //   settings?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM],
      // birthHeight: settings?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM],
    };

    if (
      calfHeiferGrowthData?.[
        CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE
      ] === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
    ) {
      result.settings.matureBodyWeight =
        settings?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG];
      result.settings.birthWeight =
        settings?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG];
    } else {
      result.settings.matureBodyHeight =
        settings?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM];
      result.settings.birthHeight =
        settings?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM];
    }
  }

  // Get animals based on growth type
  let animalsArray =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];
  // if (result.growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
  //   animalsArray =
  //     calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT] || [];
  // } else if (result.growthType === GROWTH_SCALE_OPTIONS.BODY_HEIGHT) {
  //   animalsArray =
  //     calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT] || [];
  // }

  // Filter out deleted animals
  const activeAnimals = animalsArray.filter(
    animal => !animal?.[CALF_HEIFER_GROWTH_FIELDS.IS_DELETED],
  );

  // Format animals data for report
  result.animals = activeAnimals.map(animal => ({
    animalId: animal?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID],
    dateWeighed: animal?.[CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED],
    dateOfBirth: animal?.[CALF_HEIFER_GROWTH_FIELDS.DATE_OF_BIRTH],
    ageInMonths: animal?.[CALF_HEIFER_GROWTH_FIELDS.AGE_IN_MONTHS],
    bodyWeight: animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT],
    bodyHeight: animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT],
  }));

  // Calculate summary directly from tool data and animals
  // This uses the same logic as the tool's Results/Summary screen
  if (activeAnimals.length > 0) {
    result.summary = getCalfHeiferGrowthSummary(
      calfHeiferGrowthData,
      activeAnimals,
    );
  }

  if (
    calfHeiferGrowthData?.[
      CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE
    ] === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
  ) {
    result.summary.targets = [65, 106, 174, 261, 347, 430, 508, 578];
  }

  return result;
};

/**
 * Formats settings data for display in report
 * @param {Object} settings - Settings object
 * @param {String} growthType - Growth type (Body Weight or Body Height)
 * @returns {Array} - Formatted settings data
 */
export const getSettingsTableData = (settings, growthType) => {
  if (!settings) {
    return [];
  }

  const data = [];

  data.push([i18n.t('ageAtFirstCalving'), settings?.ageAtFirstCalving || '-']);

  if (growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
    data.push([i18n.t('matureBodyWeight'), settings?.matureBodyWeight || '-']);
    data.push([i18n.t('birthWeight'), settings?.birthWeight || '-']);
  } else {
    data.push([i18n.t('matureBodyHeight'), settings?.matureBodyHeight || '-']);
    data.push([i18n.t('birthHeight'), settings?.birthHeight || '-']);
  }

  return data;
};

/**
 * Formats summary table data for display in report
 * @param {Object} summary - Summary object from Redux state
 * @param {String} growthType - Growth type (Body Weight or Body Height)
 * @returns {Array} - Formatted summary data for table
 */
export const getSummaryTableData = (summary, growthType) => {
  if (!summary) {
    return [];
  }

  const data = [];

  // Get the months array
  const months = summary?.months || [];
  const numberOfObservations = summary?.numberOfObservations || [];
  const percentTotal = summary?.percentTotal || [];
  const farmAvg = summary?.farmAvg || [];
  const targetRange = summary?.targets || [];

  // Build rows for each month range
  months.forEach((month, index) => {
    const payload = [
      month || '-',
      numberOfObservations[index] || '-',
      // (percentTotal[index] && percentTotal[index]?.toFixed(1)) || '-',
      (percentTotal[index] &&
        convertInputNumbersToRegionalBasis(percentTotal[index], 1, true)) ||
        '-',
      // (farmAvg[index] && farmAvg[index]?.toFixed(1)) || '-',
      (farmAvg[index] &&
        convertInputNumbersToRegionalBasis(farmAvg[index], 1, true)) ||
        '-',
    ];

    if (targetRange && targetRange[index]) {
      payload.push(targetRange[index]);
    }

    data.push(payload);
  });

  return data;
};

/**
 * Gets summary table header based on growth type
 * @param {String} growthType - Growth type (Body Weight or Body Height)
 * @returns {Array} - Header row for summary table
 */
export const getSummaryTableHeader = growthType => {
  const unit =
    growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
      ? i18n.t('kg')
      : i18n.t('cm');
  const measurement =
    growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
      ? i18n.t('bw')
      : i18n.t('bh');

  const header = [
    i18n.t('months'),
    i18n.t('noOfObservations'),
    i18n.t('percentTotal'),
    `${i18n.t('farmAvg')} ${measurement} (${unit})`,
  ];

  if (growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
    header.push(`${i18n.t('targetRangeOf')} ${i18n.t('bw')}, ${i18n.t('kg')}`);
  }

  return header;
};

/**
 * Gets analysis/targets data for visit report
 * Calculates targets directly from visitDetails without Redux dependencies
 * @param {Object} visitDetails - Visit details from Redux
 * @returns {Object} - Object with targets array and growthType
 */
export const getAnalysisTableData = visitDetails => {
  const calfHeiferGrowthData = getParsedToolData(
    visitDetails?.calfHeiferGrowth,
  );

  const result = {
    targets: [],
    growthType: null,
    visualizationOption: null,
  };

  if (!calfHeiferGrowthData) {
    return result;
  }

  // Get growth type
  result.growthType =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

  result.visualizationOption =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.VISUALIZATION];

  // Get animals based on growth type
  let animalsArray =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];

  const activeAnimals = animalsArray.filter(
    animal => !animal?.[CALF_HEIFER_GROWTH_FIELDS.IS_DELETED],
  );

  // Calculate targets directly using the same logic as the tool
  if (activeAnimals.length > 0) {
    result.targets = getCalfHeiferGrowthTargets(
      calfHeiferGrowthData,
      activeAnimals,
    );
  }

  return result;
};

/**
 * Gets graph data for visit report
 * Calculates graph data directly from visitDetails without Redux dependencies
 * @param {Object} visitDetails - Visit details from Redux
 * @returns {Object} - Object with graphData, growthType, and visualizationOption
 */
export const getGraphPageData = visitDetails => {
  const calfHeiferGrowthData = getParsedToolData(
    visitDetails?.calfHeiferGrowth,
  );

  const result = {
    graphData: [],
    growthType: null,
    visualizationOption: null,
  };

  if (!calfHeiferGrowthData) {
    return result;
  }

  // Get growth type
  result.growthType =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

  result.visualizationOption =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.VISUALIZATION];

  // Get animals based on growth type
  let animalsArray =
    calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];
  // if (result.growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
  //   animalsArray =
  //     calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT] || [];
  // } else if (result.growthType === GROWTH_SCALE_OPTIONS.BODY_HEIGHT) {
  //   animalsArray =
  //     calfHeiferGrowthData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT] || [];
  // }

  const activeAnimals = animalsArray.filter(
    animal => !animal?.[CALF_HEIFER_GROWTH_FIELDS.IS_DELETED],
  );

  // Calculate graph data directly using the same logic as the tool
  if (activeAnimals.length > 0) {
    result.graphData = getCalfHeiferGrowthGraphData(
      calfHeiferGrowthData,
      activeAnimals,
      visitDetails?.unitOfMeasure,
    );
  }

  return result;
};
