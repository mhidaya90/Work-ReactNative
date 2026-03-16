// modules
import { arc } from 'd3-shape';

// constants
import {
  DATE_FORMATS,
  TOOL_TYPES,
  UNIT_OF_MEASURE,
  VISIT_STATUS,
} from '../constants/AppConstants';
import { CALF_HEIFER_GROWTH_FIELDS } from '../constants/FormConstants';
import {
  CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS,
  CALF_HEIFER_TARGETS_GAUGES,
  CALF_HEIFER_ZONE_THRESHOLDS,
  DEFAULT_SETTINGS_FORM_VALUES,
  GRAPH_MONTHS_RANGE,
  GROWTH_SCALE_OPTIONS,
  SUMMARY_MONTHS_RANGE,
  VISUALIZATION_OPTIONS,
} from '../constants/toolsConstants/CalfHeiferGrowthConstants';
import customColor from '../constants/theme/variables/customColor';

// helpers
import { logEvent } from './logHelper';
import { dateHelper } from './dateHelper';
import {
  getParsedToolData,
  convertInputNumbersToRegionalBasis,
  parseStringToObject,
} from './genericHelper';
import {
  convertCommaValueToDotValue,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';

// localization
import i18n from '../localization/i18n';

import customFont from '../constants/theme/variables/customFont';
import {
  convertWeightToMetric,
  convertWeightToImperial,
  convertHeightToImperial,
  convertHeightToMetric,
  getWeightUnitByMeasure,
  getHeightUnitByMeasure,
} from './appSettingsHelper';

// Initialize calfHeiferGrowthCharts tool data with static model structure
export function initializeCalfHeiferGrowthChartsToolData(
  toolData = {},
  growthScales = '',
  visualizationOptions = [],
  siteDataKeys = null,
  siteAnimals = null,
  visitStatus = null,
) {
  try {
    if (visitStatus === VISIT_STATUS.PUBLISHED) {
      return toolData;
    }

    const siteKeys = getParsedToolData(siteDataKeys);
    const siteKeysForCalfHeiferGrowth = getParsedToolData(
      siteKeys?.[TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS],
    );

    let defaultGrowthScale = growthScales || GROWTH_SCALE_OPTIONS.BODY_WEIGHT;

    if (siteKeysForCalfHeiferGrowth?.growthType) {
      defaultGrowthScale =
        siteKeysForCalfHeiferGrowth?.growthType ||
        growthScales ||
        GROWTH_SCALE_OPTIONS.BODY_WEIGHT;
    }

    const defaultVisualizationOption =
      visualizationOptions?.length > 0
        ? visualizationOptions[0]?.key
        : DEFAULT_SETTINGS_FORM_VALUES[CALF_HEIFER_GROWTH_FIELDS.VISUALIZATION];

    const model = {
      [CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE]:
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE] ||
        defaultGrowthScale,

      [CALF_HEIFER_GROWTH_FIELDS.VISUALIZATION]:
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.VISUALIZATION] ||
        defaultVisualizationOption,

      // init settings screen data
      [CALF_HEIFER_GROWTH_FIELDS.SETTINGS]: {
        [CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
            CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
          ] ||
          siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
            CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
          ] ||
          DEFAULT_SETTINGS_FORM_VALUES?.[
            CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
          ],

        [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
          ] ||
          siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
          ] ||
          null,
        [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
            CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
          ] ||
          siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
            CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
          ] ||
          null,
        [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
          ] ||
          siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
          ] ||
          null,
        [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
            CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
          ] ||
          siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
            CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
          ] ||
          null,
      },

      // init animals data
      [CALF_HEIFER_GROWTH_FIELDS.ANIMALS]:
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || siteAnimals || [],

      // init reference height data
      [CALF_HEIFER_GROWTH_FIELDS.REFERENCE_HEIGHT]: {
        [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.REFERENCE_HEIGHT]?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
          ] ||
          DEFAULT_SETTINGS_FORM_VALUES?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
          ],
        [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.REFERENCE_HEIGHT]?.[
            CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
          ] ||
          DEFAULT_SETTINGS_FORM_VALUES?.[
            CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
          ],
      },

      // init reference weight data
      [CALF_HEIFER_GROWTH_FIELDS.REFERENCE_WEIGHT]: {
        [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.REFERENCE_WEIGHT]?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
          ] ||
          DEFAULT_SETTINGS_FORM_VALUES?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
          ],
        [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]:
          toolData?.[CALF_HEIFER_GROWTH_FIELDS.REFERENCE_WEIGHT]?.[
            CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
          ] ||
          DEFAULT_SETTINGS_FORM_VALUES?.[
            CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
          ],
      },

      [CALF_HEIFER_GROWTH_FIELDS.SUMMARY]: {
        [CALF_HEIFER_GROWTH_FIELDS.ZERO_TO_TWO_MONTHS]: {
          [CALF_HEIFER_GROWTH_FIELDS.NUMBER_OF_OBSERVATIONS]: null,
          [CALF_HEIFER_GROWTH_FIELDS.PERCENTAGE_OF_TOTAL]: null,
          [CALF_HEIFER_GROWTH_FIELDS.FARM_AVG_BH_CM]: null,
        },
        [CALF_HEIFER_GROWTH_FIELDS.TWO_TO_FOUR_MONTHS]: {
          [CALF_HEIFER_GROWTH_FIELDS.NUMBER_OF_OBSERVATIONS]: null,
          [CALF_HEIFER_GROWTH_FIELDS.PERCENTAGE_OF_TOTAL]: null,
          [CALF_HEIFER_GROWTH_FIELDS.FARM_AVG_BH_CM]: null,
        },
        [CALF_HEIFER_GROWTH_FIELDS.FOUR_TO_EIGHT_MONTHS]: {
          [CALF_HEIFER_GROWTH_FIELDS.NUMBER_OF_OBSERVATIONS]: null,
          [CALF_HEIFER_GROWTH_FIELDS.PERCENTAGE_OF_TOTAL]: null,
          [CALF_HEIFER_GROWTH_FIELDS.FARM_AVG_BH_CM]: null,
        },
        [CALF_HEIFER_GROWTH_FIELDS.EIGHT_TO_TWELVE_MONTHS]: {
          [CALF_HEIFER_GROWTH_FIELDS.NUMBER_OF_OBSERVATIONS]: null,
          [CALF_HEIFER_GROWTH_FIELDS.PERCENTAGE_OF_TOTAL]: null,
          [CALF_HEIFER_GROWTH_FIELDS.FARM_AVG_BH_CM]: null,
        },
        [CALF_HEIFER_GROWTH_FIELDS.TWELVE_TO_SIXTEEN_MONTHS]: {
          [CALF_HEIFER_GROWTH_FIELDS.NUMBER_OF_OBSERVATIONS]: null,
          [CALF_HEIFER_GROWTH_FIELDS.PERCENTAGE_OF_TOTAL]: null,
          [CALF_HEIFER_GROWTH_FIELDS.FARM_AVG_BH_CM]: null,
        },
        [CALF_HEIFER_GROWTH_FIELDS.SIXTEEN_TO_TWENTY_MONTHS]: {
          [CALF_HEIFER_GROWTH_FIELDS.NUMBER_OF_OBSERVATIONS]: null,
          [CALF_HEIFER_GROWTH_FIELDS.PERCENTAGE_OF_TOTAL]: null,
          [CALF_HEIFER_GROWTH_FIELDS.FARM_AVG_BH_CM]: null,
        },
        [CALF_HEIFER_GROWTH_FIELDS.TWENTY_TO_TWENTY_FOUR_MONTHS]: {
          [CALF_HEIFER_GROWTH_FIELDS.NUMBER_OF_OBSERVATIONS]: null,
          [CALF_HEIFER_GROWTH_FIELDS.PERCENTAGE_OF_TOTAL]: null,
          [CALF_HEIFER_GROWTH_FIELDS.FARM_AVG_BH_CM]: null,
        },
        [CALF_HEIFER_GROWTH_FIELDS.GREATER_THAN_TWENTY_FOUR_MONTHS]: {
          [CALF_HEIFER_GROWTH_FIELDS.NUMBER_OF_OBSERVATIONS]: null,
          [CALF_HEIFER_GROWTH_FIELDS.PERCENTAGE_OF_TOTAL]: null,
          [CALF_HEIFER_GROWTH_FIELDS.FARM_AVG_BH_CM]: null,
        },
      },
    };

    // init settings model based on growth scale
    // for growth scale of body weight
    if (
      model[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE] ===
      GROWTH_SCALE_OPTIONS.BODY_WEIGHT
    ) {
      model[CALF_HEIFER_GROWTH_FIELDS.SETTINGS][
        CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
      ] =
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
        ] ||
        siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
        ] ||
        DEFAULT_SETTINGS_FORM_VALUES?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
        ];

      model[CALF_HEIFER_GROWTH_FIELDS.SETTINGS][
        CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
      ] =
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
        ] ||
        siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
        ] ||
        DEFAULT_SETTINGS_FORM_VALUES?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
        ];
    }

    // for growth scale of body height
    if (
      model[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE] ===
      GROWTH_SCALE_OPTIONS.BODY_HEIGHT
    ) {
      model[CALF_HEIFER_GROWTH_FIELDS.SETTINGS][
        CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
      ] =
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
        ] ||
        siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
        ] ||
        DEFAULT_SETTINGS_FORM_VALUES?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
        ];

      model[CALF_HEIFER_GROWTH_FIELDS.SETTINGS][
        CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
      ] =
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
        ] ||
        siteKeysForCalfHeiferGrowth?.toolSettingDefaults?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
        ] ||
        DEFAULT_SETTINGS_FORM_VALUES?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
        ];
    }

    // init animals data
    // model[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] = model[
    //   CALF_HEIFER_GROWTH_FIELDS.ANIMALS
    // ]?.map(animal => {
    //   return {
    //     ...animal,
    //     [CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT]:
    //       convertInputNumbersToRegionalBasis(
    //         animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT],
    //         1,
    //         true,
    //       ),
    //   };
    // });

    return model;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> initializeCalfHeiferGrowthChartsToolData Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> initializeCalfHeiferGrowthChartsToolData Exception: ',
      e,
    );
    return null;
  }
}

/**
 * Normalize settings form values before submit.
 * If unit is Imperial, convert mature body weight value back to metric (kg).
 * Returns a new object and does not mutate the input.
 */
export function normalizeCalfHeiferGrowthSettingsOnSubmit(values) {
  try {
    const output = { ...values };
    const unit = values?.unitOfMeasure;
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      const key = CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG;
      const raw = values?.[key];
      if (raw !== undefined && raw !== null && raw !== '') {
        // Normalize string, convert lbs -> kg using shared helper, round to integer
        const normalized = convertCommaValueToDotValue(String(raw));
        const kgFloat = convertWeightToMetric(normalized);
        // Keep the conversion precision (2 decimals from helper) to avoid drift
        output[key] = kgFloat;
      }
      const birthKey = CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG;
      const birthRaw = values?.[birthKey];
      if (birthRaw !== undefined && birthRaw !== null && birthRaw !== '') {
        const normalizedBirth = convertCommaValueToDotValue(String(birthRaw));
        const birthKgFloat = convertWeightToMetric(normalizedBirth);
        // Keep the conversion precision (2 decimals from helper) to avoid drift
        output[birthKey] = birthKgFloat;
      }
      // Convert heights from inches back to cm
      const matureHeightKey =
        CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM;
      const rawMatureHeight = values?.[matureHeightKey];
      if (
        rawMatureHeight !== undefined &&
        rawMatureHeight !== null &&
        rawMatureHeight !== ''
      ) {
        const normalizedHeight = convertCommaValueToDotValue(
          String(rawMatureHeight),
        );
        const cmFloat = convertHeightToMetric(normalizedHeight);
        output[matureHeightKey] = cmFloat;
      }
      const birthHeightKey = CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM;
      const rawBirthHeight = values?.[birthHeightKey];
      if (
        rawBirthHeight !== undefined &&
        rawBirthHeight !== null &&
        rawBirthHeight !== ''
      ) {
        const normalizedBirthHeight = convertCommaValueToDotValue(
          String(rawBirthHeight),
        );
        const birthCmFloat = convertHeightToMetric(normalizedBirthHeight);
        output[birthHeightKey] = birthCmFloat;
      }
    } else {
      // Metric unit: normalize localized decimal and keep one-decimal precision
      const key = CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG;
      const raw = values?.[key];
      if (raw !== undefined && raw !== null && raw !== '') {
        const normalized = convertCommaValueToDotValue(String(raw));
        const kgFloat = Number(normalized);
        output[key] = parseFloat(Number(kgFloat).toFixed(1));
      }
      const birthKey = CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG;
      const birthRaw = values?.[birthKey];
      if (birthRaw !== undefined && birthRaw !== null && birthRaw !== '') {
        const normalizedBirth = convertCommaValueToDotValue(String(birthRaw));
        const birthKgFloat = Number(normalizedBirth);
        output[birthKey] = parseFloat(Number(birthKgFloat).toFixed(1));
      }
      // Heights: sanitize comma decimals and keep one decimal
      const matureHeightKey =
        CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM;
      const rawMatureHeight = values?.[matureHeightKey];
      if (
        rawMatureHeight !== undefined &&
        rawMatureHeight !== null &&
        rawMatureHeight !== ''
      ) {
        const normalizedHeight = convertCommaValueToDotValue(
          String(rawMatureHeight),
        );
        const cmFloat = Number(normalizedHeight);
        output[matureHeightKey] = parseFloat(Number(cmFloat).toFixed(1));
      }
      const birthHeightKey = CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM;
      const rawBirthHeight = values?.[birthHeightKey];
      if (
        rawBirthHeight !== undefined &&
        rawBirthHeight !== null &&
        rawBirthHeight !== ''
      ) {
        const normalizedBirthHeight = convertCommaValueToDotValue(
          String(rawBirthHeight),
        );
        const birthCmFloat = Number(normalizedBirthHeight);
        output[birthHeightKey] = parseFloat(Number(birthCmFloat).toFixed(1));
      }
    }
    return output;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> normalizeCalfHeiferGrowthSettingsOnSubmit Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> normalizeCalfHeiferGrowthSettingsOnSubmit Exception: ',
      e,
    );
    return values;
  }
}

/**
 * Normalize add-animal form values before storing in tool data.
 * Converts only bodyWeight and bodyHeight to metric when unit is Imperial.
 * Sanitizes localized decimals for Metric inputs and keeps one-decimal precision.
 * Returns a new object; does not mutate input.
 */
export function normalizeCalfHeiferGrowthAnimalOnSubmit(values) {
  try {
    const output = { ...values };
    const unit = values?.unitOfMeasure;

    // Normalize Body Weight
    const weightKey = CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT;
    const rawWeight = values?.[weightKey];
    if (rawWeight !== undefined && rawWeight !== null && rawWeight !== '') {
      const normalizedWeight = convertCommaValueToDotValue(String(rawWeight));
      output[weightKey] =
        unit === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToMetric(normalizedWeight)
          : parseFloat(Number(normalizedWeight).toFixed(1));
    }

    // Normalize Body Height
    const heightKey = CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT;
    const rawHeight = values?.[heightKey];
    if (rawHeight !== undefined && rawHeight !== null && rawHeight !== '') {
      const normalizedHeight = convertCommaValueToDotValue(String(rawHeight));
      output[heightKey] =
        unit === UNIT_OF_MEASURE.IMPERIAL
          ? convertHeightToMetric(normalizedHeight)
          : parseFloat(Number(normalizedHeight).toFixed(1));
    }

    return output;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> normalizeCalfHeiferGrowthAnimalOnSubmit Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> normalizeCalfHeiferGrowthAnimalOnSubmit Exception: ',
      e,
    );
    return values;
  }
}

export const initializeCalfHeiferGrowthSettingsFormData = (
  calfHeiferGrowthToolData = {},
  unit,
) => {
  try {
    const formObject = {
      [CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE]:
        calfHeiferGrowthToolData?.[
          CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE
        ],
      // Include unit of measure for conditional validation
      unitOfMeasure: unit,

      // Age at first calving (months)
      [CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS]:
        calfHeiferGrowthToolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
        ],
    };

    // Populate weight or height fields based on growth type
    if (
      calfHeiferGrowthToolData?.[
        CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE
      ] === GROWTH_SCALE_OPTIONS.BODY_HEIGHT
    ) {
      const matureCm =
        calfHeiferGrowthToolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
        ];
      const birthCm =
        calfHeiferGrowthToolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
        ];

      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        // Display in inches with one decimal
        const matureIn = convertHeightToImperial(matureCm, 1);
        const birthIn = convertHeightToImperial(birthCm, 1);
        formObject[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM] =
          convertInputNumbersToRegionalBasis(matureIn, 1, false);
        formObject[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM] =
          convertInputNumbersToRegionalBasis(birthIn, 1, false);
      } else {
        // Metric: allow one decimal and respect locale separators
        formObject[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM] =
          convertInputNumbersToRegionalBasis(matureCm, 1, false);
        formObject[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM] =
          convertInputNumbersToRegionalBasis(birthCm, 1, false);
      }
    }

    // Populate weight fields with unit-aware, locale-formatted values
    if (
      calfHeiferGrowthToolData?.[
        CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE
      ] === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
    ) {
      const matureBodyWeightInKg =
        calfHeiferGrowthToolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
        ];
      const birthWeightInKg =
        calfHeiferGrowthToolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
        ];

      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        // Display in lbs with one decimal
        const matureLbs = convertWeightToImperial(matureBodyWeightInKg, 1);
        const birthLbs = convertWeightToImperial(birthWeightInKg, 1);
        formObject[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG] =
          convertInputNumbersToRegionalBasis(matureLbs, 1, false);
        formObject[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG] =
          convertInputNumbersToRegionalBasis(birthLbs, 1, false);
      } else {
        // Metric: allow one decimal and respect locale separators
        formObject[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG] =
          convertInputNumbersToRegionalBasis(matureBodyWeightInKg, 1, false);
        formObject[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG] =
          convertInputNumbersToRegionalBasis(birthWeightInKg, 1, false);
      }
    }

    return formObject;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> initializeCalfHeiferGrowthSettingsFormData Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> initializeCalfHeiferGrowthSettingsFormData Exception: ',
      e,
    );
    return null;
  }
};

// Returns true if value is invalid for age at first calving
export function isInvalidAgeAtFirstCalving(value, minMax) {
  const num = Number(value);
  return value === '' || isNaN(num) || num < minMax.min || num > minMax.max;
}

// Returns true if value is invalid for mature body weight
export function isInvalidMatureBodyWeight(value, minMax, unit) {
  const num = Number(convertCommaValueToDotValue(String(value)));
  const min = unit === UNIT_OF_MEASURE.IMPERIAL ? minMax.min * 2.2 : minMax.min;
  const max = unit === UNIT_OF_MEASURE.IMPERIAL ? minMax.max * 2.2 : minMax.max;
  return value === '' || isNaN(num) || num < min || num > max;
}

// Validation helpers
export function isInvalidBirthWeight(value, minMax, unit) {
  const num = Number(convertCommaValueToDotValue(String(value)));
  const min = unit === UNIT_OF_MEASURE.IMPERIAL ? minMax.min * 2.2 : minMax.min;
  const max = unit === UNIT_OF_MEASURE.IMPERIAL ? minMax.max * 2.2 : minMax.max;
  return value === '' || isNaN(num) || num < min || num > max;
}

export function isInvalidMatureBodyHeight(value, minMax, unit) {
  const num = Number(convertCommaValueToDotValue(String(value)));
  const min =
    unit === UNIT_OF_MEASURE.IMPERIAL ? minMax.min / 2.54 : minMax.min;
  const max =
    unit === UNIT_OF_MEASURE.IMPERIAL ? minMax.max / 2.54 : minMax.max;
  return value === '' || isNaN(num) || num < min || num > max;
}

export function isInvalidBirthHeight(value, minMax, unit) {
  const num = Number(convertCommaValueToDotValue(String(value)));
  const min =
    unit === UNIT_OF_MEASURE.IMPERIAL ? minMax.min / 2.54 : minMax.min;
  const max =
    unit === UNIT_OF_MEASURE.IMPERIAL ? minMax.max / 2.54 : minMax.max;
  return value === '' || isNaN(num) || num < min || num > max;
}

export function isInvalidAnimalId(value, existingIds = []) {
  return !value || existingIds.includes(value);
}

export function isInvalidDate(date, now = new Date()) {
  // date: JS Date or ISO string
  const d = new Date(date);
  return isNaN(d.getTime()) || d > now;
}

export function getSwitchGrowthModelData(formValues) {
  try {
    const unit = formValues?.unitOfMeasure;
    const model = {
      [CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE]:
        formValues?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE],
      [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]:
        formValues?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG],
      [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]:
        formValues?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG],
      [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]:
        formValues?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM],
      [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]:
        formValues?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM],
    };

    if (
      model[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE] ===
      GROWTH_SCALE_OPTIONS.BODY_WEIGHT
    ) {
      // Normalize weights back to metric if present
      const matureW =
        formValues?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG];
      if (matureW !== undefined && matureW !== null && matureW !== '') {
        const normalized = convertCommaValueToDotValue(String(matureW));
        model[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG] =
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToMetric(normalized)
            : parseFloat(Number(normalized).toFixed(1));
      }

      const birthW = formValues?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG];
      if (birthW !== undefined && birthW !== null && birthW !== '') {
        const normalized = convertCommaValueToDotValue(String(birthW));
        model[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG] =
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToMetric(normalized)
            : parseFloat(Number(normalized).toFixed(1));
      }
    }

    if (
      model[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE] ===
      GROWTH_SCALE_OPTIONS.BODY_HEIGHT
    ) {
      // Normalize heights back to metric if present
      const matureH =
        formValues?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM];
      if (matureH !== undefined && matureH !== null && matureH !== '') {
        const normalized = convertCommaValueToDotValue(String(matureH));
        model[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM] =
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertHeightToMetric(normalized)
            : parseFloat(Number(normalized).toFixed(1));
      }

      const birthH = formValues?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM];
      if (birthH !== undefined && birthH !== null && birthH !== '') {
        const normalized = convertCommaValueToDotValue(String(birthH));
        model[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM] =
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertHeightToMetric(normalized)
            : parseFloat(Number(normalized).toFixed(1));
      }
    }

    return model;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> getSwitchGrowthModelData Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> getSwitchGrowthModelData Exception: ',
      e,
    );
    return null;
  }
}

export function updateModelDataForSwitchingGrowthType(
  calfHeiferGrowthToolData,
  updatedModelData,
) {
  try {
    const model = {
      ...calfHeiferGrowthToolData,
      [CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE]:
        updatedModelData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE],
      [CALF_HEIFER_GROWTH_FIELDS.REFERENCE_HEIGHT]: {
        [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]:
          updatedModelData?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM],
        [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]:
          updatedModelData?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
          ],
      },
      [CALF_HEIFER_GROWTH_FIELDS.REFERENCE_WEIGHT]: {
        [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]:
          updatedModelData?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG],
        [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]:
          updatedModelData?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
          ],
      },
      [CALF_HEIFER_GROWTH_FIELDS.SETTINGS]: {
        ...calfHeiferGrowthToolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS],
        [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]:
          updatedModelData?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG],
        [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]:
          updatedModelData?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
          ],
        [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]:
          updatedModelData?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM],
        [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]:
          updatedModelData?.[
            CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
          ],
      },
    };

    return model;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> updateModelDataForSwitchingGrowthType Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> updateModelDataForSwitchingGrowthType Exception: ',
      e,
    );
  }
}

export function setInitialFormValuesForSwitchGrowthType(
  toolData,
  growthTypeEnums,
  unit,
) {
  try {
    const switchingGrowthType = growthTypeEnums?.find(
      item =>
        item.key !==
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE],
    );

    const formObject = {
      [CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE]:
        switchingGrowthType?.key,
      unitOfMeasure: unit,
      [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]:
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.REFERENCE_WEIGHT]?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
        ],
      [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]:
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.REFERENCE_WEIGHT]?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
        ],
      [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]:
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.REFERENCE_HEIGHT]?.[
          CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
        ],
      [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]:
        toolData?.[CALF_HEIFER_GROWTH_FIELDS.REFERENCE_HEIGHT]?.[
          CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
        ],
    };

    // Populate reference values for the target switch type, unit-aware
    if (switchingGrowthType?.key === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
      const matureKg =
        formObject?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG];
      const birthKg =
        formObject?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG];

      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        formObject[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG] =
          convertWeightToImperial(matureKg, 1);
        formObject[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG] =
          convertWeightToImperial(birthKg, 1);
      } else {
        formObject[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG] =
          matureKg;
        formObject[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG] = birthKg;
      }
    }

    if (switchingGrowthType?.key === GROWTH_SCALE_OPTIONS.BODY_HEIGHT) {
      const matureCm =
        formObject?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM];
      const birthCm =
        formObject?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM];

      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        formObject[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM] =
          convertHeightToImperial(matureCm, 1);
        formObject[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM] =
          convertHeightToImperial(birthCm, 1);
      } else {
        formObject[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM] =
          matureCm;
        formObject[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM] = birthCm;
      }
    }

    return formObject;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> setInitialFormValuesForSwitchGrowthType Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> setInitialFormValuesForSwitchGrowthType Exception: ',
      e,
    );
    return null;
  }
}

export function getInitialValuesForAddAnimalForm(toolData, editingData, unit) {
  const growthType =
    toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

  const model = {
    unitOfMeasure: unit,
    [CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID]: editingData
      ? editingData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID]
      : '',
    [CALF_HEIFER_GROWTH_FIELDS.DATE_OF_BIRTH]: editingData
      ? editingData?.[CALF_HEIFER_GROWTH_FIELDS.DATE_OF_BIRTH]
      : null,
    [CALF_HEIFER_GROWTH_FIELDS.AGE_IN_MONTHS]: editingData
      ? editingData?.[CALF_HEIFER_GROWTH_FIELDS.AGE_IN_MONTHS]
      : '',
    [CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE]: growthType,
    [CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT]: editingData
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertInputNumbersToRegionalBasis(
            convertWeightToImperial(
              editingData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT],
              1,
            ),
            1,
            false,
          )
        : editingData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT]
      : '',
    [CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED]: editingData
      ? editingData?.[CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED]
      : null,
    [CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT]: editingData
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertInputNumbersToRegionalBasis(
            convertHeightToImperial(
              editingData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT],
              1,
            ),
            1,
            false,
          )
        : editingData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT]
      : '',
    [CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT]: editingData
      ? editingData?.[CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT]
      : null,
  };

  if (growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
    model[CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED] = editingData
      ? editingData?.[CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED]
      : new Date();
  } else {
    model[CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT] = editingData
      ? editingData?.[CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT]
      : new Date();
  }

  return model;
}

export function addNewAnimalToToolData(toolData, newAnimal) {
  try {
    // Generate a new ID for the animal
    const animalWithId = {
      ...newAnimal,
    };

    const updatedAnimalsList = [
      ...toolData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS],
      animalWithId,
    ];

    const updatedToolData = {
      ...toolData,
      [CALF_HEIFER_GROWTH_FIELDS.ANIMALS]: updatedAnimalsList,
    };

    return updatedToolData;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> addNewAnimalToToolData Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> addNewAnimalToToolData Exception: ',
      e,
    );
    return toolData;
  }
}

export function getAnimalsByGrowthType(toolData) {
  const growthType =
    toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

  return growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
    ? toolData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT] || []
    : toolData?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT] || [];
}

export function getUpdateAnimalsList(
  filteredAnimalsList,
  updatedAnimal,
  oldAnimalData,
) {
  try {
    const updatedAnimalsList = filteredAnimalsList?.map(animal => {
      if (
        animal?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] ===
        oldAnimalData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID]
      ) {
        updatedAnimal.updated = true;
        return updatedAnimal;
      } else {
        return animal;
      }
    });

    return updatedAnimalsList;
  } catch (error) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> getUpdateAnimalsList Exception: ',
      error,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> getUpdateAnimalsList Exception: ',
      error,
    );
  }
}

/**
 * Convert filtered animals' body weight (kg -> lbs) and body height (cm -> in)
 * to imperial units when unitOfMeasure is Imperial. Leaves metric values
 * unchanged when unitOfMeasure is Metric.
 * Returns a new array; does not mutate the input.
 */
export function convertFilteredAnimalsToImperial(
  filteredAnimals = [],
  unitOfMeasure,
) {
  try {
    const isImperial = unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL;
    if (!filteredAnimals?.length) return filteredAnimals || [];

    return filteredAnimals.map(animal => {
      let bw = animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT];
      let bh = animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT];

      if (bw !== undefined && bw !== null && bw !== '') {
        const bwNumber = Number(convertCommaValueToDotValue(String(bw)));
        bw = isImperial ? convertWeightToImperial(bwNumber, 1) : bwNumber;
      }

      if (bh !== undefined && bh !== null && bh !== '') {
        const bhNumber = Number(convertCommaValueToDotValue(String(bh)));
        bh = isImperial ? convertHeightToImperial(bhNumber, 1) : bhNumber;
      }

      return {
        ...animal,
        [CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT]: Number(bw),
        [CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT]: Number(bh),
      };
    });
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> convertFilteredAnimalsToImperial Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> convertFilteredAnimalsToImperial Exception: ',
      e,
    );
    return filteredAnimals;
  }
}

export function updateAnimalDataModel(
  previousAnimalData,
  updatedAnimalData,
  unitOfMeasure,
) {
  try {
    const weightKey = CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT;
    const heightKey = CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT;
    const rawWeight = updatedAnimalData?.[weightKey];
    const rawHeight = updatedAnimalData?.[heightKey];

    let updatedBodyWeight = previousAnimalData?.[weightKey];
    if (rawWeight === '') {
      updatedBodyWeight = null;
    } else if (rawWeight !== undefined && rawWeight !== null) {
      const normalizedWeight = convertCommaValueToDotValue(String(rawWeight));
      updatedBodyWeight =
        unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToMetric(normalizedWeight)
          : parseFloat(Number(normalizedWeight).toFixed(1));
    }

    let updatedBodyHeight = previousAnimalData?.[heightKey];
    if (rawHeight === '') {
      updatedBodyHeight = null;
    } else if (rawHeight !== undefined && rawHeight !== null) {
      const normalizedHeight = convertCommaValueToDotValue(String(rawHeight));
      updatedBodyHeight =
        unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
          ? convertHeightToMetric(normalizedHeight)
          : parseFloat(Number(normalizedHeight).toFixed(1));
    }

    const updatedAnimal = {
      ...previousAnimalData,
      [CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED]:
        updatedAnimalData[CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED] ||
        previousAnimalData?.[CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED],
      [CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT]: updatedBodyWeight,
      [CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT]:
        updatedAnimalData[CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT] ||
        previousAnimalData?.[CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT],
      [CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT]: updatedBodyHeight,
      updated: true,
    };

    const payload = {
      updatedAnimalData: updatedAnimal,
      oldAnimalData: previousAnimalData,
    };

    return payload;
  } catch (error) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> updateAnimalDataModel Exception: ',
      error,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> updateAnimalDataModel Exception: ',
      error,
    );
    return null;
  }
}

function filterAnimalsById(animals, animalId) {
  return animals?.filter(
    animal => animal?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] !== animalId,
  );
}

export function updateAnimalInToolData(toolData, updatedAnimal, oldAnimalData) {
  try {
    let updatedToolData = toolData;

    const allAnimals = toolData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];
    allAnimals.map(item => {
      if (
        item?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] ===
        oldAnimalData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID]
      ) {
        const filteredAnimals = filterAnimalsById(
          allAnimals,
          oldAnimalData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID],
        );

        updatedToolData = {
          ...toolData,
          [CALF_HEIFER_GROWTH_FIELDS.ANIMALS]: [
            ...filteredAnimals,
            updatedAnimal,
          ],
        };
      }
    });

    return updatedToolData;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> updateAnimalInToolData Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> updateAnimalInToolData Exception: ',
      e,
    );
    return toolData;
  }
}

export function deleteAnimalFromToolData(toolData, animalId) {
  try {
    let updatedToolData = toolData;

    const allAnimals = toolData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];
    const filteredAnimals = allAnimals.filter(
      animal => animal?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] != animalId,
    );
    updatedToolData = {
      ...toolData,
      [CALF_HEIFER_GROWTH_FIELDS.ANIMALS]: filteredAnimals,
    };
    return updatedToolData;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> deleteAnimalFromToolData Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> deleteAnimalFromToolData Exception: ',
      e,
    );
    return toolData;
  }
}

export function getCalfHeiferGrowthSummary(
  toolData,
  allAnimals = [],
  unitOfMeasure,
) {
  try {
    const growthType =
      toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

    const header = [
      i18n.t('months'),
      i18n.t('noOfObservations'),
      i18n.t('percentTotal'),
      `${i18n.t('farmAvg')}\n
      ${
        growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
          ? i18n.t('bw') + `, ${getWeightUnitByMeasure(unitOfMeasure)}`
          : i18n.t('bh') + `, ${getHeightUnitByMeasure(unitOfMeasure)}`
      }`,
    ];

    const months = [
      CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.ZERO_TO_TWO_MONTHS,
      CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.TWO_TO_FOUR_MONTHS,
      CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.FOUR_TO_EIGHT_MONTHS,
      CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.EIGHT_TO_TWELVE_MONTHS,
      CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.TWELVE_TO_SIXTEEN_MONTHS,
      CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.SIXTEEN_TO_TWENTY_MONTHS,
      CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.TWENTY_TO_TWENTY_FOUR_MONTHS,
      CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.GREATER_THAN_TWENTY_FOUR_MONTHS,
    ];

    const currentVisitSummary = getCurrentVisitSummary(
      allAnimals,
      toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE],
    );

    return {
      header,
      months,
      ...currentVisitSummary,
    };
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthSummary Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthSummary Exception: ',
      e,
    );
    return null;
  }
}

function getCurrentVisitSummary(animals, growthType) {
  try {
    const numberOfObservations = [0, 0, 0, 0, 0, 0, 0, 0];
    const percentTotal = [];
    const farmAvg = [0, 0, 0, 0, 0, 0, 0, 0];
    const avgCount = [0, 0, 0, 0, 0, 0, 0, 0];
    const animalsMonths = [0, 0, 0, 0, 0, 0, 0, 0];
    const avgAge = [];

    animals?.map(item => {
      const ageInMonths = Number(
        item?.[CALF_HEIFER_GROWTH_FIELDS.AGE_IN_MONTHS],
      );

      // @fix added for comma supported number
      const weightHeightValue =
        growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
          ? Number(
              convertCommaValueToDotValue(
                item?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT],
              ),
            )
          : Number(
              convertCommaValueToDotValue(
                item?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT],
              ),
            );

      if (
        ageInMonths >= SUMMARY_MONTHS_RANGE.ZERO_TO_TWO_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.ZERO_TO_TWO_MONTHS.max
      ) {
        numberOfObservations[0] = numberOfObservations[0] + 1;
        animalsMonths[0] = animalsMonths[0] + ageInMonths;
        farmAvg[0] = farmAvg[0] + weightHeightValue;
        avgCount[0] = avgCount[0] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.TWO_TO_FOUR_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.TWO_TO_FOUR_MONTHS.max
      ) {
        numberOfObservations[1] = numberOfObservations[1] + 1;
        animalsMonths[1] = animalsMonths[1] + ageInMonths;
        farmAvg[1] = farmAvg[1] + weightHeightValue;
        avgCount[1] = avgCount[1] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.FOUR_TO_EIGHT_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.FOUR_TO_EIGHT_MONTHS.max
      ) {
        numberOfObservations[2] = numberOfObservations[2] + 1;
        animalsMonths[2] = animalsMonths[2] + ageInMonths;
        farmAvg[2] = farmAvg[2] + weightHeightValue;
        avgCount[2] = avgCount[2] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.EIGHT_TO_TWELVE_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.EIGHT_TO_TWELVE_MONTHS.max
      ) {
        numberOfObservations[3] = numberOfObservations[3] + 1;
        animalsMonths[3] = animalsMonths[3] + ageInMonths;
        farmAvg[3] = farmAvg[3] + weightHeightValue;
        avgCount[3] = avgCount[3] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.TWELVE_TO_SIXTEEN_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.TWELVE_TO_SIXTEEN_MONTHS.max
      ) {
        numberOfObservations[4] = numberOfObservations[4] + 1;
        animalsMonths[4] = animalsMonths[4] + ageInMonths;
        farmAvg[4] = farmAvg[4] + weightHeightValue;
        avgCount[4] = avgCount[4] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.SIXTEEN_TO_TWENTY_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.SIXTEEN_TO_TWENTY_MONTHS.max
      ) {
        numberOfObservations[5] = numberOfObservations[5] + 1;
        animalsMonths[5] = animalsMonths[5] + ageInMonths;
        farmAvg[5] = farmAvg[5] + weightHeightValue;
        avgCount[5] = avgCount[5] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.TWENTY_TO_TWENTY_FOUR_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.TWENTY_TO_TWENTY_FOUR_MONTHS.max
      ) {
        numberOfObservations[6] = numberOfObservations[6] + 1;
        animalsMonths[6] = animalsMonths[6] + ageInMonths;
        farmAvg[6] = farmAvg[6] + weightHeightValue;
        avgCount[6] = avgCount[6] + 1;
      }
      if (
        ageInMonths >
          SUMMARY_MONTHS_RANGE.GREATER_THAN_TWENTY_FOUR_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.GREATER_THAN_TWENTY_FOUR_MONTHS.max
      ) {
        numberOfObservations[7] = numberOfObservations[7] + 1;
        animalsMonths[7] = animalsMonths[7] + ageInMonths;
        farmAvg[7] = farmAvg[7] + weightHeightValue;
        avgCount[7] = avgCount[7] + 1;
      }
    });

    numberOfObservations?.map(item => {
      percentTotal.push((item / animals?.length) * 100 || 0);
    });

    farmAvg.map((item, index) => {
      if (avgCount[index] !== 0) {
        farmAvg[index] = item / avgCount[index];
      }
    });

    animalsMonths.map((item, index) => {
      if (item != 0 && numberOfObservations[index] != 0) {
        avgAge[index] = item / numberOfObservations[index];
      }
    });

    return {
      numberOfObservations,
      percentTotal,
      farmAvg,
      avgAge,
    };
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> getCurrentVisitSummary Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> getCurrentVisitSummary Exception: ',
      e,
    );
    return [];
  }
}

export function getCalfHeiferGrowthTargets(toolData, allAnimals) {
  try {
    const growthType =
      toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

    const numberOfObservations = [0, 0, 0, 0, 0, 0, 0, 0];
    const farmAvg = [0, 0, 0, 0, 0, 0, 0, 0];
    const avgCount = [0, 0, 0, 0, 0, 0, 0, 0];
    const animalsMonths = [0, 0, 0, 0, 0, 0, 0, 0];
    const avgAge = [];

    allAnimals?.map(item => {
      const ageInMonths = Number(
        item?.[CALF_HEIFER_GROWTH_FIELDS.AGE_IN_MONTHS],
      );

      const weightHeightValue =
        growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
          ? Number(
              convertCommaValueToDotValue(
                item?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT],
              ),
            )
          : Number(
              convertCommaValueToDotValue(
                item?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT],
              ),
            );

      if (
        ageInMonths >= SUMMARY_MONTHS_RANGE.ZERO_TO_TWO_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.ZERO_TO_TWO_MONTHS.max
      ) {
        numberOfObservations[0] = numberOfObservations[0] + 1;
        animalsMonths[0] = animalsMonths[0] + ageInMonths;
        farmAvg[0] = farmAvg[0] + weightHeightValue;
        avgCount[0] = avgCount[0] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.ZERO_TO_FOUR_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.ZERO_TO_FOUR_MONTHS.max
      ) {
        numberOfObservations[1] = numberOfObservations[1] + 1;
        animalsMonths[1] = animalsMonths[1] + ageInMonths;
        farmAvg[1] = farmAvg[1] + weightHeightValue;
        avgCount[1] = avgCount[1] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.ZERO_TO_SIX_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.ZERO_TO_SIX_MONTHS.max
      ) {
        numberOfObservations[2] = numberOfObservations[2] + 1;
        animalsMonths[2] = animalsMonths[2] + ageInMonths;
        farmAvg[2] = farmAvg[2] + weightHeightValue;
        avgCount[2] = avgCount[2] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.SIX_TO_TWELVE_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.SIX_TO_TWELVE_MONTHS.max
      ) {
        numberOfObservations[3] = numberOfObservations[3] + 1;
        animalsMonths[3] = animalsMonths[3] + ageInMonths;
        farmAvg[3] = farmAvg[3] + weightHeightValue;
        avgCount[3] = avgCount[3] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.ZERO_TO_TWELVE_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.ZERO_TO_TWELVE_MONTHS.max
      ) {
        numberOfObservations[4] = numberOfObservations[4] + 1;
        animalsMonths[4] = animalsMonths[4] + ageInMonths;
        farmAvg[4] = farmAvg[4] + weightHeightValue;
        avgCount[4] = avgCount[4] + 1;
      }
      if (
        ageInMonths > SUMMARY_MONTHS_RANGE.TWELVE_TO_TWENTY_FOUR_MONTHS.min &&
        ageInMonths <= SUMMARY_MONTHS_RANGE.TWELVE_TO_TWENTY_FOUR_MONTHS.max
      ) {
        numberOfObservations[5] = numberOfObservations[5] + 1;
        animalsMonths[5] = animalsMonths[5] + ageInMonths;
        farmAvg[5] = farmAvg[5] + weightHeightValue;
        avgCount[5] = avgCount[5] + 1;
      }
    });

    farmAvg.map((item, index) => {
      if (avgCount[index] !== 0) {
        farmAvg[index] = item / avgCount[index];
      }
    });

    animalsMonths.map((item, index) => {
      if (item != 0 && numberOfObservations[index] != 0) {
        avgAge[index] = item / numberOfObservations[index];
      }
    });

    // const farmAvg = summary.farmAvg;
    // const avgAge = summary.avgAge;

    const targetValues = farmAvg.map((item, index) => {
      if (growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
        item =
          item -
          Number(
            toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
              CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
            ],
          );
        const avgAgeValue = avgAge[index] * 30.437;
        item = item / avgAgeValue;

        return isNaN(item) ? '-' : item.toFixed(2);
      } else {
        item =
          item -
          Number(
            toolData?.[CALF_HEIFER_GROWTH_FIELDS.SETTINGS]?.[
              CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
            ],
          );
        const avgAgeValue = avgAge[index] * 30.437;
        item = item / avgAgeValue;

        return isNaN(item) ? '-' : item.toFixed(2);
      }
    });

    const targets = CALF_HEIFER_TARGETS_GAUGES?.map((item, index) => {
      let label = null;
      if (index == 0) {
        label =
          growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
            ? `${i18n.t('DWG')} (${i18n.t('dailyWeightGain')}, ${i18n.t(
                'g_d',
              )}) ${item?.months}`
            : `${i18n.t('DHG')} (${i18n.t('dailyHeightGain')}, ${i18n.t(
                'cm_d',
              )}) ${item?.months}`;
      } else {
        label =
          growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
            ? `${i18n.t('DWG')} (${i18n.t('g_d')}) ${item?.months}`
            : `${i18n.t('DHG')} (${i18n.t('cm_d')}) ${item?.months}`;
      }

      // Extract min/max values from innerValues based on growth type
      // innerValues[0] contains min values, innerValues[1] contains max values
      const innerValuesMin = item?.innerValues?.[0] || {};
      const innerValuesMax = item?.innerValues?.[1] || {};

      const minValue =
        growthType === GROWTH_SCALE_OPTIONS.BODY_HEIGHT
          ? innerValuesMin?.heightMin ?? 0
          : innerValuesMin?.weightMin ?? item?.minValue;
      const maxValue =
        growthType === GROWTH_SCALE_OPTIONS.BODY_HEIGHT
          ? innerValuesMax?.heightMax ?? 0
          : innerValuesMax?.weightMax ?? item?.maxValue;

      // Use appropriate gauge colors based on growth type
      const gaugeColors =
        growthType === GROWTH_SCALE_OPTIONS.BODY_HEIGHT
          ? item?.heightGaugeColors
          : item?.gaugeColors;

      return {
        ...item,
        label,
        value: targetValues[index],
        // Override minValue/maxValue based on growth type for needle calculation
        minValue,
        maxValue,
        // Override gaugeColors based on growth type
        gaugeColors,
        growthType, // Pass growthType for needle angle calculation
        redRange: i18n.t(`calfHeiferGrowth${growthType}${item.key}MO_redRange`),
        greenRange: i18n.t(
          `calfHeiferGrowth${growthType}${item.key}MO_greenRange`,
        ),
        yellowRange: i18n.t(
          `calfHeiferGrowth${growthType}${item.key}MO_yellowRange`,
        ),
      };
    });

    return targets;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthTargets Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthTargets Exception: ',
      e,
    );
    return [];
  }
}

export function getCalfHeiferGrowthGraphData(
  toolData,
  allAnimals,
  unitOfMeasure,
) {
  try {
    const growthType =
      toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

    const tableData = [
      {
        frontColor: customColor.metabolicIncidencePercentBar,
        id: 0,
        label: CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.ZERO_TO_TWO_MONTHS,
        min: GRAPH_MONTHS_RANGE.ZERO_TO_TWO_MONTHS.min,
        max: GRAPH_MONTHS_RANGE.ZERO_TO_TWO_MONTHS.max,
      },
      {
        frontColor: customColor.metabolicIncidencePercentBar,
        id: 1,
        label: CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.TWO_TO_FOUR_MONTHS,
        min: GRAPH_MONTHS_RANGE.TWO_TO_FOUR_MONTHS.min,
        max: GRAPH_MONTHS_RANGE.TWO_TO_FOUR_MONTHS.max,
      },
      {
        frontColor: customColor.metabolicIncidencePercentBar,
        id: 2,
        label: CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.FOUR_TO_EIGHT_MONTHS,
        min: GRAPH_MONTHS_RANGE.FOUR_TO_EIGHT_MONTHS.min,
        max: GRAPH_MONTHS_RANGE.FOUR_TO_EIGHT_MONTHS.max,
      },
      {
        frontColor: customColor.metabolicIncidencePercentBar,
        id: 3,
        label: CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.EIGHT_TO_TWELVE_MONTHS,
        min: GRAPH_MONTHS_RANGE.EIGHT_TO_TWELVE_MONTHS.min,
        max: GRAPH_MONTHS_RANGE.EIGHT_TO_TWELVE_MONTHS.max,
      },
      {
        frontColor: customColor.metabolicIncidencePercentBar,
        id: 4,
        label: CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.TWELVE_TO_SIXTEEN_MONTHS,
        min: GRAPH_MONTHS_RANGE.TWELVE_TO_SIXTEEN_MONTHS.min,
        max: GRAPH_MONTHS_RANGE.TWELVE_TO_SIXTEEN_MONTHS.max,
      },
      {
        frontColor: customColor.metabolicIncidencePercentBar,
        id: 5,
        label: CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.SIXTEEN_TO_TWENTY_MONTHS,
        min: GRAPH_MONTHS_RANGE.SIXTEEN_TO_TWENTY_MONTHS.min,
        max: GRAPH_MONTHS_RANGE.SIXTEEN_TO_TWENTY_MONTHS.max,
      },
      {
        frontColor: customColor.metabolicIncidencePercentBar,
        id: 6,
        label:
          CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.TWENTY_TO_TWENTY_FOUR_MONTHS,
        min: GRAPH_MONTHS_RANGE.TWENTY_TO_TWENTY_FOUR_MONTHS.min,
        max: GRAPH_MONTHS_RANGE.TWENTY_TO_TWENTY_FOUR_MONTHS.max,
      },
      {
        frontColor: customColor.metabolicIncidencePercentBar,
        id: 7,
        label:
          CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS.GREATER_THAN_TWENTY_FOUR_MONTHS,
        min: GRAPH_MONTHS_RANGE.GREATER_THAN_TWENTY_FOUR_MONTHS.min,
        max: GRAPH_MONTHS_RANGE.GREATER_THAN_TWENTY_FOUR_MONTHS.max,
      },
    ];

    const graphData = tableData?.map(item => {
      const filteredAnimals = allAnimals?.filter(
        animal =>
          Number(animal?.[CALF_HEIFER_GROWTH_FIELDS.AGE_IN_MONTHS]) >=
            item.min &&
          Number(animal?.[CALF_HEIFER_GROWTH_FIELDS.AGE_IN_MONTHS]) <= item.max,
      );

      const isImperial = unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL;

      if (filteredAnimals?.length > 0) {
        item.value =
          growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
            ? filteredAnimals?.reduce((acc, curr) => {
                return (
                  Number(
                    isImperial
                      ? convertWeightToImperial(acc, 1)
                      : convertCommaValueToDotValue(acc),
                  ) +
                  Number(
                    isImperial
                      ? convertWeightToImperial(
                          convertCommaValueToDotValue(
                            curr?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT],
                          ),
                          1,
                        )
                      : convertCommaValueToDotValue(
                          curr?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT],
                        ),
                  )
                );
              }, 0) / Number(filteredAnimals?.length)
            : filteredAnimals?.reduce((acc, curr) => {
                return (
                  Number(
                    isImperial
                      ? convertHeightToImperial(acc, 1)
                      : convertCommaValueToDotValue(acc),
                  ) +
                  Number(
                    isImperial
                      ? convertHeightToImperial(
                          convertCommaValueToDotValue(
                            curr?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT],
                          ),
                          1,
                        )
                      : convertCommaValueToDotValue(
                          curr?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT],
                        ),
                  )
                );
              }, 0) / Number(filteredAnimals?.length);
      } else {
        item.value = null;
      }

      item.value = (item?.value && item?.value?.toFixed(1)) || null;

      return item;
    });

    return graphData;
  } catch (e) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthGraphData Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthGraphData Exception: ',
      e,
    );
    return [];
  }
}

export function getCalfHeiferGrowthGraphModelDataForDownload(
  graphData,
  currentToolData,
  visitData,
  growthEnums,
) {
  try {
    const growthType = growthEnums?.find(
      item =>
        item.key ===
        currentToolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE],
    );
    const dataPoints = graphData?.map(item => {
      return {
        x: item?.label,
        y: item?.value,
      };
    });

    const model = {
      fileName: `${i18n.t('CalfHeiferGrowth')} - ${growthType?.value}`,
      visitName: visitData ? visitData?.visitName : '',
      visitDate: visitData
        ? dateHelper.getFormattedDate(
            visitData?.visitDate,
            DATE_FORMATS.MMM_DD_YY_H_MM,
          )
        : '',
      toolName: i18n.t('CalfHeiferGrowth'),
      sheetName: `${i18n.t('farm')} ${growthType?.value}`,
      yAxisLabel: `${i18n.t('farm')} ${growthType?.value}`,
      xAxisLabel: i18n.t('ageRange'),
      barColorHex: '#EF9A9A',
      dataPoints: dataPoints,
    };

    return model;
  } catch (error) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthGraphModelDataForDownload Exception: ',
      e,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthGraphModelDataForDownload Exception: ',
      e,
    );
    return null;
  }
}

/**
 * Get all animals from visits where calfHeiferGrowthType matches growthType
 * @param {Array} visits - Array of visit objects
 * @param {Object} toolData - Current tool data
 * @returns {Array} animals - All matching animals
 */
export function getAnimalsByGrowthTypeFromVisits(visits, toolData) {
  // Start with animals already in the current tool data
  const baseAnimals = [
    ...(toolData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || []),
  ];

  // Build a set of existing IDs to skip duplicates
  const existingIds = new Set(
    baseAnimals.map(
      a => a?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] || a?.animalId,
    ),
  );

  if (!Array.isArray(visits)) return [];
  // if (!Array.isArray(visits)) return baseAnimals;

  const growthType =
    toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

  const dedupedFromVisits = [];

  visits.forEach(visit => {
    const calfHeiferGrowth = getParsedToolData(visit.calfHeiferGrowth);
    const visitAnimals =
      calfHeiferGrowth?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];

    visitAnimals.forEach(animal => {
      const id =
        animal?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] || animal?.animalId;
      if (!id) return;
      // Skip if already present in tool data or already added from another visit
      // if (existingIds.has(id)) return;

      // Validation per growth type
      if (growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
        const dateWeighed = animal?.[CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED];
        const bodyWeight = animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT];
        const valid = dateWeighed && bodyWeight !== null && bodyWeight !== '';
        if (!valid) return;
      } else if (growthType === GROWTH_SCALE_OPTIONS.BODY_HEIGHT) {
        const dateHeight = animal?.[CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT];
        const bodyHeight = animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT];
        const valid = dateHeight && bodyHeight !== null && bodyHeight !== '';
        if (!valid) return;
      }

      existingIds.add(id);
      dedupedFromVisits.push(animal);
    });
  });

  // return dedupedFromVisits;
  return [...baseAnimals, ...dedupedFromVisits];
}

export function getCalfHeiferGrowthSiteAnimals(visits, syncedSiteAnimals) {
  try {
    const animals = [];
    const seenIds = new Set();

    visits?.forEach(visit => {
      const calfHeiferGrowth = getParsedToolData(visit.calfHeiferGrowth);
      if (!calfHeiferGrowth) return;

      const visitAnimals =
        calfHeiferGrowth?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];

      visitAnimals.forEach(animal => {
        const id =
          animal?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] || animal?.animalId;
        if (!id) return; // skip if no identifier
        if (seenIds.has(id)) return; // skip duplicates
        seenIds.add(id);
        animals.push(animal);
      });
    });

    if (syncedSiteAnimals?.length && syncedSiteAnimals?.length > 0) {
      syncedSiteAnimals.forEach(animal => {
        const id = animal?.animalId;
        if (!id) return; // skip if no identifier
        if (seenIds.has(id)) return; // skip duplicates
        seenIds.add(id);
        animals.push(animal);
      });
    }

    return animals;
  } catch (error) {
    console.log(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthSiteAnimals Exception: ',
      error,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelpers -> getCalfHeiferGrowthSiteAnimals Exception: ',
      error,
    );
    return null;
  }
}

export const getCalfHeiferGrowthMeterCirclePath = fieldConfig => {
  if (fieldConfig?.gaugeColors && fieldConfig?.gaugeColors?.length > 0) {
    let arcCurves = [];
    fieldConfig?.gaugeColors?.map((item, index) => {
      const circlePath = arc()
        .innerRadius(67)
        .outerRadius(80)
        .startAngle(item?.startAngle || 0)
        .endAngle(item?.endAngle || 0)
        .cornerRadius(
          index === 0 || index === fieldConfig?.gaugeColors?.length - 1
            ? 10
            : 0,
        );

      const config = {
        key: index,
        d: circlePath(),
        fill: item?.color,
        x: item?.x,
        y: item?.y,
        zIndex: index === 1 ? 1000 : 0,
        value: fieldConfig?.minValue + index * 5,
      };

      arcCurves.push(config);
    });

    return arcCurves;
  } else {
    return [];
  }
};

/**
 * Calculates the needle angle for the Calf & Heifer Growth speedometer
 *
 * Arc Configuration (from CalfHeiferGrowthConstants.js):
 * - Arc 1 (Red): startAngle: 0.3, endAngle: 2.0 (radians)
 * - Arc 2 (Green): startAngle: 1.9, endAngle: 3.2 (radians)
 * - Arc 3 (Blue): startAngle: 3.1, endAngle: 4.7 (radians)
 * - Total arc span: 0.3 to 4.7 radians = 4.4 radians ≈ 252 degrees
 *
 * Needle Rotation:
 * - The gauge spans approximately 252 degrees (-126° to +126°)
 * - Needle constant: 126 (half of 252)
 * - Min value → -126° (left side)
 * - Max value → +126° (right side)
 *
 * @param {Object} field - Field configuration with value, minValue, maxValue, growthType
 * @param {boolean} conversionNeeded - Whether to convert string to number
 * @param {boolean} isVisitReport - Whether this is for visit report (uses smaller constant)
 * @returns {number} - Needle angle in degrees (-126 to 126)
 */
export const getCalfHeiferGrowthTargetNeedleAngle = (
  field,
  conversionNeeded = false,
  isVisitReport = false,
) => {
  let fieldKeyValue = convertStringToNumber(field?.value, !conversionNeeded);

  // Needle constant for the 3-arc configuration:
  // Arc spans 0.3 to 4.7 radians = 4.4 radians = ~252 degrees
  // Half of 252 = 126 degrees
  let needleConstantForCalculation = isVisitReport ? 125 : 130;

  // Get growth type from field (passed from getCalfHeiferGrowthTargets)
  const growthType = field?.growthType;

  // Get min/max values from field (already set based on growth type)
  const minValue = field?.minValue ?? 0;
  const maxValue = field?.maxValue ?? 1;
  const valueRange = maxValue - minValue;

  // Calculate zone thresholds based on growth type
  // For Body Weight: use predefined thresholds from CALF_HEIFER_ZONE_THRESHOLDS
  // For Body Height: calculate as proportions of the value range (1/3 and 2/3)
  let RED_MAX, GREEN_MAX;

  if (growthType === GROWTH_SCALE_OPTIONS.BODY_HEIGHT) {
    // For Body Height, zones are proportional to the value range
    // Red zone: 0 to 1/3 of range, Green zone: 1/3 to 2/3, Blue zone: 2/3 to max
    RED_MAX = minValue + valueRange / 3;
    GREEN_MAX = minValue + (2 * valueRange) / 3;
  } else {
    // For Body Weight, use predefined absolute thresholds
    RED_MAX = CALF_HEIFER_ZONE_THRESHOLDS.RED_MAX;
    GREEN_MAX = CALF_HEIFER_ZONE_THRESHOLDS.GREEN_MAX;
  }

  // Each zone occupies 1/3 of the total arc (84 degrees each)
  const zoneAngle = (needleConstantForCalculation * 2) / 3; // 84 degrees per zone

  // Zone angle boundaries in degrees:
  // Red zone: -126 to -42
  // Green zone: -42 to +42
  // Blue zone: +42 to +126

  if (isNaN(fieldKeyValue)) {
    return -needleConstantForCalculation;
  }

  // Clamp value to minValue and maxValue
  if (fieldKeyValue >= maxValue) {
    return needleConstantForCalculation;
  }

  if (fieldKeyValue <= minValue) {
    return -needleConstantForCalculation;
  }

  // Determine which zone the value falls into and calculate position within that zone
  if (fieldKeyValue < RED_MAX) {
    // Red zone: map value from [minValue, RED_MAX) to [-126, -42)
    const zoneStart = -needleConstantForCalculation; // -126
    const ratio = (fieldKeyValue - minValue) / (RED_MAX - minValue);
    return zoneStart + ratio * zoneAngle;
  } else if (fieldKeyValue < GREEN_MAX) {
    // Green zone: map value from [RED_MAX, GREEN_MAX) to [-42, +42)
    const zoneStart = -needleConstantForCalculation + zoneAngle; // -42
    const ratio = (fieldKeyValue - RED_MAX) / (GREEN_MAX - RED_MAX);
    return zoneStart + ratio * zoneAngle;
  } else {
    // Blue zone: map value from [GREEN_MAX, maxValue] to [+42, +126]
    const zoneStart = -needleConstantForCalculation + 2 * zoneAngle; // +42
    const ratio = (fieldKeyValue - GREEN_MAX) / (maxValue - GREEN_MAX);
    return zoneStart + ratio * zoneAngle;
  }
};

/**
 * Validates Calf & Heifer Growth tool data
 * Validates ALL animals from BOTH bodyWeight AND bodyHeight arrays combined
 * Validation rules are applied based on the growthType parameter
 * @param {Object} toolData - Tool data from Redux state (calfHeiferGrowthModel)
 * @returns {Boolean} - True if all items in both arrays pass validation, false otherwise
 */
export const validateCalfHeiferGrowthToolData = toolData => {
  try {
    // Handle null/undefined toolData
    if (!toolData) {
      return false;
    }

    // Get growthType from toolData
    const growthType =
      toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE];

    const allAnimals = [
      ...(toolData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || []),
    ];

    // If no animals exist, validation fails
    if (!Array.isArray(allAnimals) || allAnimals.length === 0) {
      return false;
    }

    // Validate each animal based on growthType
    const isValid = allAnimals.every(animal => {
      if (!animal) {
        return false;
      }

      // Validate based on growthType
      if (growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT) {
        // For body weight: both dateWeighed and bodyWeight must be filled
        const dateWeighed = animal?.[CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED];
        // const bodyWeight = animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT];

        return (
          dateWeighed !== null &&
          dateWeighed !== undefined &&
          dateWeighed !== ''
          // &&
          // bodyWeight !== null &&
          // bodyWeight !== undefined &&
          // bodyWeight !== ''
        );
      } else if (growthType === GROWTH_SCALE_OPTIONS.BODY_HEIGHT) {
        // For body height: both dateHeight and bodyHeight must be filled
        const dateHeight = animal?.[CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT];
        // const bodyHeight = animal?.[CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT];

        return (
          dateHeight !== null && dateHeight !== undefined && dateHeight !== ''
          // &&
          // bodyHeight !== null &&
          // bodyHeight !== undefined &&
          // bodyHeight !== ''
        );
      }

      return false;
    });

    return isValid;
  } catch (error) {
    console.log(
      'helpers -> calfHeiferGrowthHelper -> validateCalfHeiferGrowthToolData Exception: ',
      error,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelper -> validateCalfHeiferGrowthToolData Exception: ',
      error,
    );
    return false;
  }
};

/**
 * Synchronizes animal data between toolData and allAnimals array
 * Updates allAnimals with the latest data from toolData before creating summary
 * @param {Object} toolData - Tool data from Redux state containing bodyWeight and bodyHeight arrays
 * @param {Array} allAnimals - Array of animals from Redux reducer (resultAnimals)
 * @returns {Array} - Updated allAnimals array with synchronized data from toolData
 */
export const synchronizeAnimalDataWithToolData = (
  toolData,
  allAnimals = [],
) => {
  try {
    if (!toolData || !Array.isArray(allAnimals) || allAnimals.length === 0) {
      return allAnimals;
    }

    const toolDataAnimals = toolData?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];

    if (
      toolData?.[CALF_HEIFER_GROWTH_FIELDS.VISUALIZATION] ===
      VISUALIZATION_OPTIONS.CURRENT_VISIT
    ) {
      return toolDataAnimals;
    }

    const finalAnimals = allAnimals.map(item => {
      const isAnimalExist = toolDataAnimals.find(
        toolItem =>
          toolItem?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] ===
            item?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID] ||
          toolItem?.animalId === item?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID],
      );
      if (isAnimalExist) {
        return {
          ...isAnimalExist,
        };
      } else {
        return item;
      }
    });

    return finalAnimals;
  } catch (error) {
    console.log(
      'helpers -> calfHeiferGrowthHelper -> synchronizeAnimalDataWithToolData Exception: ',
      error,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelper -> synchronizeAnimalDataWithToolData Exception: ',
      error,
    );
    // Return original allAnimals if synchronization fails
    return allAnimals;
  }
};

/**
 * Get all existing animal IDs from a site across all visits
 * Used for validating unique animal IDs when adding new animals
 *
 * @param {Array} siteAnimals - Array of visit objects from the site
 * @returns {Array} Array of unique animal IDs in the site
 */
export function getAllExistingAnimalIdsFromSite(siteAnimals = []) {
  try {
    const animalIds = new Set();

    if (!Array.isArray(siteAnimals)) {
      return [];
    }

    siteAnimals.forEach(animal => {
      if (animal?.animalId) {
        animalIds.add(animal?.animalId);
      }

      // const calfHeiferGrowth = getParsedToolData(visit.calfHeiferGrowth);
      // console.log(`Visit ${visitIndex}:`, visit.id, 'calfHeiferGrowth:', calfHeiferGrowth);

      // if (calfHeiferGrowth) {
      // const animals =
      //   calfHeiferGrowth?.[CALF_HEIFER_GROWTH_FIELDS.ANIMALS] || [];

      // animals.forEach(animal => {
      //   const animalId = animal?.[CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID];
      //   if (animalId) {
      //     animalIds.add(animalId);
      //   }
      // });
    });

    const result = Array.from(animalIds);
    // console.log('getAllExistingAnimalIdsFromSite: Final result:', result);
    return result;
  } catch (error) {
    console.log(
      'helpers -> calfHeiferGrowthHelper -> getAllExistingAnimalIdsFromSite Exception: ',
      error,
    );
    logEvent(
      'helpers -> calfHeiferGrowthHelper -> getAllExistingAnimalIdsFromSite Exception: ',
      error,
    );
    return [];
  }
}

export const getCalfHeiferTargetLabels = (fieldConfig, growthType) => {
  if (fieldConfig?.innerValues && fieldConfig?.innerValues?.length > 0) {
    let labels = [];

    fieldConfig?.innerValues?.map((item, index) => {
      const config = {
        x: item?.positionX,
        y: item?.positionY,
        value:
          growthType === GROWTH_SCALE_OPTIONS.BODY_WEIGHT
            ? index == 0
              ? item?.weightMin
              : item?.weightMax
            : index == 0
            ? item?.heightMin
            : item?.heightMax,
        fontSize: 9,
        strokeWidth: 0,
        fill: customColor.grey9,
        fontFamily: customFont.HelveticaNeueRegular,
      };

      labels.push(config);
    });

    return labels;
  } else {
    return [];
  }
};

export function getCalfHeiferGrowthDefaultSiteModel(
  siteData,
  toolData,
  payload,
) {
  try {
    const keys = getParsedToolData(siteData?.keys);

    const siteDataObj = {
      updated: true,
      id: siteData?.id || '',
      siteName: siteData?.siteName || '',
      keys: {
        ...keys,
        [TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS]: {
          growthType:
            payload?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE] ||
            keys?.[TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS]?.growthType ||
            toolData?.[CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE],
          toolSettingDefaults: {
            [CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS]:
              payload?.[
                CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
              ] ||
              keys?.[TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS]?.toolSettingDefaults
                ?.ageAtFirstCalving ||
              null,
            [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]:
              payload?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG] ||
              keys?.[TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS]?.toolSettingDefaults
                ?.matureBodyWeight ||
              null,
            [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]:
              payload?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG] ||
              keys?.[TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS]?.toolSettingDefaults
                ?.birthWeight ||
              null,
            [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]:
              payload?.[CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM] ||
              keys?.[TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS]?.toolSettingDefaults
                ?.matureBodyHeight ||
              null,
            [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]:
              payload?.[CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM] ||
              keys?.[TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS]?.toolSettingDefaults
                ?.birthHeight ||
              null,
          },
        },
      },
    };

    return siteDataObj;
  } catch (error) {
    logEvent(
      'helpers -> calfHeiferGrowthHelper -> getCalfHeiferGrowthDefaultSiteModel Exception: ',
      error,
    );
    console.log(
      'helpers -> calfHeiferGrowthHelper -> getCalfHeiferGrowthDefaultSiteModel Exception: ',
      error,
    );
    return siteData;
  }
}

export function checkCalfHeiferGrowthDefaultsOnSiteSetup(siteDataKeys) {
  try {
    const keys = parseStringToObject(siteDataKeys);
    const calfHeiferGrowthKeys = parseStringToObject(
      keys?.[TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS],
    );

    if (
      calfHeiferGrowthKeys &&
      calfHeiferGrowthKeys?.toolSettingDefaults &&
      !stringIsEmpty(calfHeiferGrowthKeys?.toolSettingDefaults)
    ) {
      return true;
    }

    return false;
  } catch (error) {
    logEvent(
      'helpers -> calfHeiferGrowthHelper -> checkCalfHeiferGrowthDefaultsOnSiteSetup Exception: ',
      error,
    );
    console.log(
      'helpers -> calfHeiferGrowthHelper -> checkCalfHeiferGrowthDefaultsOnSiteSetup Exception: ',
      error,
    );
    return false;
  }
}

export function formatCalfHeiferGrowthDataForSyncing(toolData = null) {
  try {
    if (toolData) {
      toolData?.animals?.map(animal => {
        animal.bodyWeight =
          convertCommaValueToDotValue(animal?.bodyWeight) || animal?.bodyWeight;
      });

      delete toolData?.siteAnimals;
    }

    return toolData;
  } catch (error) {
    logEvent(
      'helpers -> calfHeiferGrowthHelper -> formatCalfHeiferGrowthDataForSyncing Exception: ',
      error,
    );
    console.log(
      'helpers -> calfHeiferGrowthHelper -> formatCalfHeiferGrowthDataForSyncing Exception: ',
      error,
    );
    return toolData;
  }
}
