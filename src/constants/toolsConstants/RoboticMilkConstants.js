// modules
import React from 'react';
import { Platform } from 'react-native';

// localization
import i18n from '../../localization/i18n';

// constants
import { INPUT_FIELD_TYPE, ROBOT_TYPE } from '../AppConstants';
import { ROBOTIC_MILK_EVALUATION, KEYBOARD_TYPE } from '../FormConstants';
import colors from '../../constants/theme/variables/customColor';

export const INITIAL_ROBOTIC_MILK_STEP = 1;
export const TOTAL_ROBOTIC_MILK_STEPS = 2;

export const ROBOTIC_MILK_STEPS = [
  {
    id: 0x001,
    step: 1,
    name: i18n.t('dataInput'),
  },
  {
    id: 0x002,
    step: 2,
    name: i18n.t('results'),
  },
];

const returnKeyType = Platform.OS === 'ios' ? 'done' : 'next';

export const GRAPH_COLORS = {
  SANDY_BROWN: 'SANDY_BROWN',
  LIGHT_SEA_GREEN: 'LIGHT_SEA_GREEN',
  PINK: 'PINK',
  CORNFLOWER_BLUE: 'CORNFLOWER_BLUE',
  ROYAL_BLUE: 'ROYAL_BLUE',
  PEACH_PUFF: 'PEACH_PUFF',
  MEDIUM_PURPLE: 'MEDIUM_PURPLE',
  FOREST_GREEN: 'FOREST_GREEN',
};

export const AMS_UTILIZATION = {
  [ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT]: i18n.t('cowsPerRobot'),
  [ROBOTIC_MILK_EVALUATION.MILKINGS_PER_ROBOT]: i18n.t('milkingsPerRobot'),
  [ROBOTIC_MILK_EVALUATION.MILK_PER_ROBOT]: i18n.t('milkPerRobot'),
};

export const COW_EFFICIENCY = {
  [ROBOTIC_MILK_EVALUATION.MILKING_FAILURES]: i18n.t('milkingFailures'),
};

export const ROBOTIC_MILK_RESULTS_TYPES = {
  SUMMARY: 'summary',
  ANALYSIS: 'analysis',
  GRAPH: 'graph',
};

export const ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS = {
  AMS_UTILIZATION: 'AMSUtilization',
  COW_EFFICIENCY: 'CowEfficiency',
  CONCENTRATE_DISTRIBUTION: 'ConcentrateDistribution',
};

export const AMS_UTILIZATION_GRAPH_TABS = [
  {
    includesIn: ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.AMS_UTILIZATION,
    key:
      ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME +
      ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
    value: i18n.t('robotFreeTimeLely') + ' ' + i18n.t('averageBoxTimeLely'),
    leftAxis: ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME,
    rightAxis: ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
  },
  {
    includesIn: ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.AMS_UTILIZATION,
    key: ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT,
    value: i18n.t('cowsPerRobot'),
  },
  {
    includesIn: ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.COW_EFFICIENCY,
    key:
      ROBOTIC_MILK_EVALUATION.MILKINGS +
      ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
    value: i18n.t('milkingsLely') + ' ' + i18n.t('milkingRefusalsLely'),
    leftAxis: ROBOTIC_MILK_EVALUATION.MILKINGS,
    rightAxis: ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
  },
  {
    includesIn: ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.COW_EFFICIENCY,
    key: ROBOTIC_MILK_EVALUATION.MILKING_FAILURES,
    value: i18n.t('milkingFailures'),
  },
  {
    includesIn: ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.CONCENTRATE_DISTRIBUTION,
    key:
      ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE +
      ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
    value:
      i18n.t('avgConcentrate') + ' ' + i18n.t('concentratePer100KGMilkLely'),
    leftAxis: ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED,
    rightAxis: ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
  },
];

export const ROBOTIC_MILK_RESULT_TABS = [
  {
    id: 0x1,
    key: ROBOTIC_MILK_RESULTS_TYPES.SUMMARY,
    value: i18n.t('summary'),
  },
  {
    id: 0x2,
    key: ROBOTIC_MILK_RESULTS_TYPES.ANALYSIS,
    value: i18n.t('analysis'),
  },
  {
    id: 0x3,
    key: ROBOTIC_MILK_RESULTS_TYPES.GRAPH,
    value: i18n.t('graph'),
  },
];

export const ROBOTIC_MILK_ANALYSIS = [
  {
    key: ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT,
    minValue: 40,
    maxValue: 80,
    totalGaugeLabels: 9,
    redRange: i18n.t('robotic_milk_evaluation_cows_per_robot_redRange'),
    greenRange: i18n.t('robotic_milk_evaluation_cows_per_robot_greenRange'),
    yellowRange: i18n.t('robotic_milk_evaluation_cows_per_robot_yellowRange'),
    label: i18n.t('cowsPerRobot'),
    innerValues: [
      {
        value: 40,
        positionX: 60,
        positionY: 130,
      },
      {
        value: 45,
        positionX: 40,
        positionY: 97,
      },
      {
        value: 50,
        positionX: 45,
        positionY: 62,
      },
      {
        value: 55,
        positionX: 63,
        positionY: 37,
      },
      {
        value: 60,
        positionX: 97,
        positionY: 27,
      },
      {
        value: 65,
        positionX: 128,
        positionY: 37,
      },
      {
        value: 70,
        positionX: 145,
        positionY: 62,
      },
      {
        value: 75,
        positionX: 150,
        positionY: 97,
      },
      {
        value: 80,
        positionX: 130,
        positionY: 130,
      },
    ],
    gaugeColors: [
      {
        color: colors.redIndicatorColor,
        startAngle: 0.1,
        endAngle: 1.275,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 1.275,
        endAngle: 1.8625,
      },
      {
        color: colors.greenIndicatorColor,
        startAngle: 1.8625,
        endAngle: 2.685,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 2.685,
        endAngle: 3.625,
      },
      {
        color: colors.redIndicatorColor,
        startAngle: 3.625,
        endAngle: 4.86,
      },
    ],
  },
  {
    key: ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME,
    minValue: 0,
    maxValue: 25,
    totalGaugeLabels: 6,
    redRange: i18n.t('robotic_milk_evaluation_robot_free_time_redRange'),
    greenRange: i18n.t('robotic_milk_evaluation_robot_free_time_greenRange'),
    yellowRange: i18n.t('robotic_milk_evaluation_robot_free_time_yellowRange'),
    // label: i18n.t('robotFreeTimeOther'),
    label: ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME,
    labeledKey: ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME,
    innerValues: [
      {
        value: 0,
        positionX: 60,
        positionY: 130,
      },
      {
        value: 5,
        positionX: 40,
        positionY: 80,
      },
      {
        value: 10,
        positionX: 60,
        positionY: 35,
      },
      {
        value: 15,
        positionX: 120,
        positionY: 30,
      },
      {
        value: 20,
        positionX: 150,
        positionY: 80,
      },
      {
        value: 25,
        positionX: 130,
        positionY: 130,
      },
    ],
    gaugeColors: [
      {
        color: colors.redIndicatorColor,
        startAngle: 0.1,
        endAngle: 1.98,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 1.98,
        endAngle: 2.356,
      },
      {
        color: colors.greenIndicatorColor,
        startAngle: 2.356,
        endAngle: 3.484,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 3.484,
        endAngle: 3.86,
      },
      {
        color: colors.redIndicatorColor,
        startAngle: 3.86,
        endAngle: 4.86,
      },
    ],
  },
  {
    key: ROBOTIC_MILK_EVALUATION.MILKINGS,
    minValue: 1,
    maxValue: 4,
    totalGaugeLabels: 5,
    redRange: i18n.t('robotic_milk_evaluation_milkings_redRange'),
    greenRange: i18n.t('robotic_milk_evaluation_milkings_greenRange'),
    yellowRange: i18n.t('robotic_milk_evaluation_milkings_yellowRange'),
    // label: i18n.t('milkingsOther'),
    label: ROBOTIC_MILK_EVALUATION.MILKINGS,
    labeledKey: ROBOTIC_MILK_EVALUATION.MILKINGS,
    innerValues: [
      {
        value: 1,
        positionX: 60,
        positionY: 130,
      },
      {
        value: 1.75,
        positionX: 40,
        positionY: 70,
      },
      {
        value: 2.5,
        positionX: 95,
        positionY: 30,
      },
      {
        value: 3.25,
        positionX: 140,
        positionY: 70,
      },
      {
        value: 4,
        positionX: 130,
        positionY: 130,
      },
    ],
    gaugeColors: [
      {
        color: colors.redIndicatorColor,
        startAngle: 0.1,
        endAngle: 2.5,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 2.5,
        endAngle: 3,
      },
      {
        color: colors.greenIndicatorColor,
        startAngle: 3,
        endAngle: 4.85,
      },
    ],
  },
  {
    key: ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
    minValue: 0,
    maxValue: 4,
    totalGaugeLabels: 5,
    redRange: i18n.t('robotic_milk_evaluation_milking_refusals_redRange'),
    greenRange: i18n.t('robotic_milk_evaluation_milking_refusals_greenRange'),
    yellowRange: i18n.t('robotic_milk_evaluation_milking_refusals_yellowRange'),
    // label: i18n.t('milkingRefusalsOther'),
    label: ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
    labeledKey: ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
    innerValues: [
      {
        value: 0,
        positionX: 60,
        positionY: 130,
      },
      {
        value: 0.8,
        positionX: 40,
        positionY: 80,
      },
      {
        value: 1.6,
        positionX: 60,
        positionY: 35,
      },
      {
        value: 2.4,
        positionX: 125,
        positionY: 35,
      },
      {
        value: 3.2,
        positionX: 150,
        positionY: 80,
      },
      {
        value: 4,
        positionX: 130,
        positionY: 130,
      },
    ],
    gaugeColors: [
      {
        color: colors.redIndicatorColor,
        startAngle: 0.1,
        endAngle: 1.04,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 1.04,
        endAngle: 1.3925,
      },
      {
        color: colors.greenIndicatorColor,
        startAngle: 1.3925,
        endAngle: 1.6275,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 1.6275,
        endAngle: 1.98,
      },
      {
        color: colors.redIndicatorColor,
        startAngle: 1.98,
        endAngle: 4.86,
      },
    ],
  },
  {
    key: ROBOTIC_MILK_EVALUATION.MILKING_FAILURES,
    minValue: 0,
    maxValue: 15,
    totalGaugeLabels: 6,
    redRange: i18n.t('robotic_milk_evaluation_milking_failures_redRange'),
    greenRange: i18n.t('robotic_milk_evaluation_milking_failures_greenRange'),
    yellowRange: i18n.t('robotic_milk_evaluation_milking_failures_yellowRange'),
    // label: i18n.t('milkingFailures'),
    label: ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES,
    labeledKey: ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES,
    innerValues: [
      {
        value: 0,
        positionX: 60,
        positionY: 130,
      },
      {
        value: 3,
        positionX: 40,
        positionY: 80,
      },
      {
        value: 6,
        positionX: 65,
        positionY: 35,
      },
      {
        value: 9,
        positionX: 130,
        positionY: 35,
      },
      {
        value: 12,
        positionX: 150,
        positionY: 80,
      },
      {
        value: 15,
        positionX: 130,
        positionY: 130,
      },
    ],
    gaugeColors: [
      {
        color: colors.greenIndicatorColor,
        startAngle: 0.1,
        endAngle: 1.04,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 1.04,
        endAngle: 1.98,
      },
      {
        color: colors.redIndicatorColor,
        startAngle: 1.98,
        endAngle: 4.85,
      },
    ],
  },
  {
    key: ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
    minValue: 0,
    maxValue: 15,
    totalGaugeLabels: 6,
    redRange: i18n.t('robotic_milk_evaluation_average_box_time_redRange'),
    greenRange: i18n.t('robotic_milk_evaluation_average_box_time_greenRange'),
    yellowRange: i18n.t('robotic_milk_evaluation_average_box_time_yellowRange'),
    // label: i18n.t('avgBoxTime'),
    label: ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
    labeledKey: ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
    innerValues: [
      {
        value: 0,
        positionX: 60,
        positionY: 130,
      },
      {
        value: 3,
        positionX: 40,
        positionY: 80,
      },
      {
        value: 6,
        positionX: 65,
        positionY: 35,
      },
      {
        value: 9,
        positionX: 130,
        positionY: 35,
      },
      {
        value: 12,
        positionX: 150,
        positionY: 80,
      },
      {
        value: 15,
        positionX: 130,
        positionY: 130,
      },
    ],
    gaugeColors: [
      {
        color: colors.greenIndicatorColor,
        startAngle: 0.1,
        endAngle: 1.978,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 1.978,
        endAngle: 2.604,
      },
      {
        color: colors.redIndicatorColor,
        startAngle: 2.604,
        endAngle: 4.85,
      },
    ],
  },
  {
    key: ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED,
    minValue: 0,
    maxValue: 12,
    redRange: i18n.t(
      'robotic_milk_evaluation_average_concentrated_fed_redRange',
    ),
    greenRange: i18n.t(
      'robotic_milk_evaluation_average_concentrated_fed_greenRange',
    ),
    yellowRange: i18n.t(
      'robotic_milk_evaluation_average_concentrated_fed_yellowRange',
    ),
    totalGaugeLabels: 7,
    // label: i18n.t('avgConcentrate'),
    label: ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED,
    labeledKey: ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED,
    innerValues: [
      {
        value: 0,
        positionX: 60,
        positionY: 130,
      },
      {
        value: 2,
        positionX: 40,
        positionY: 85,
      },
      {
        value: 4,
        positionX: 55,
        positionY: 45,
      },
      {
        value: 6,
        positionX: 95,
        positionY: 25,
      },
      {
        value: 8,
        positionX: 140,
        positionY: 45,
      },
      {
        value: 10,
        positionX: 150,
        positionY: 85,
      },
      {
        value: 12,
        positionX: 130,
        positionY: 130,
      },
    ],
    gaugeColors: [
      {
        color: colors.redIndicatorColor,
        startAngle: 0.1,
        endAngle: 1.273,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 1.273,
        endAngle: 1.664,
      },
      {
        color: colors.greenIndicatorColor,
        startAngle: 1.664,
        endAngle: 2.45,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 2.45,
        endAngle: 3.28, //2.837,0.782
      },
      {
        color: colors.redIndicatorColor,
        startAngle: 3.28, //2.837,
        endAngle: 4.86,
      },
    ],
  },
  {
    key: ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
    minValue: 0,
    maxValue: 25,
    redRange: i18n.t(
      'robotic_milk_evaluation_concentrate_per_100_kg_milk_redRange',
    ),
    greenRange: i18n.t(
      'robotic_milk_evaluation_concentrate_per_100_kg_milk_greenRange',
    ),
    yellowRange: i18n.t(
      'robotic_milk_evaluation_concentrate_per_100_kg_milk_yellowRange',
    ),
    totalGaugeLabels: 6,
    // label: i18n.t('concentratePer100KGMilkOther'),
    label: ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
    labeledKey: ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
    innerValues: [
      {
        value: 0,
        positionX: 60,
        positionY: 130,
      },
      {
        value: 5,
        positionX: 40,
        positionY: 80,
      },
      {
        value: 10,
        positionX: 60,
        positionY: 35,
      },
      {
        value: 15,
        positionX: 120,
        positionY: 30,
      },
      {
        value: 20,
        positionX: 150,
        positionY: 80,
      },
      {
        value: 25,
        positionX: 130,
        positionY: 130,
      },
    ],
    gaugeColors: [
      {
        color: colors.greenIndicatorColor,
        startAngle: 0.1,
        endAngle: 2.3328,
      },
      {
        color: colors.yellowIndicatorColor,
        startAngle: 2.3328,
        endAngle: 2.7216,
      },
      {
        color: colors.redIndicatorColor,
        startAngle: 2.7216,
        endAngle: 4.86,
      },
    ],
  },
];

export const ROBOTIC_MILK_FIELDS = [
  {
    key: ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD,
    placeholder: i18n.t('numberPlaceholder'),
    label: i18n.t('robotsInHerd'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 2,
    minValue: 0,
    maxValue: 99,
    required: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.LACTATING_COWS,
    placeholder: i18n.t('numberPlaceholder'),
    label: i18n.t('lactatingAnimals'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    // maxLimit: 4,
    minValue: 0,
    maxValue: 99999,
    required: true,
    hasCommas: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('averageMilkYieldLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 4,
    minValue: 0,
    maxValue: 999,
    lbsMaxValue: 220,
    decimalPoints: 2,
    required: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('averageBoxTimeLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 5,
    minValue: 0,
    maxValue: 30,
    decimalPoints: 2,
    required: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.MILKINGS,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('milkingsLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 4,
    minValue: 0,
    maxValue: 9,
    decimalPoints: 2,
    required: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME,
    placeholder: i18n.t('singleDecimalNumberPlaceholder'),
    label: i18n.t('robotFreeTimeLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 5,
    minValue: 0,
    maxValue: 100,
    decimalPoints: 1,
    required: true,
    moreInfo: {
      [ROBOT_TYPE.GEA]: [
        i18n.t('robotFreeGeaInfoUtilizationTime'),
        i18n.t('robotFreeGeaInfoUtilizationFreeTime'),
      ],
    },
  },
  {
    key: ROBOTIC_MILK_EVALUATION.MILKING_SPEED,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('milkingSpeedLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 5,
    minValue: 0,
    maxValue: 20,
    lbsMaxValue: 44.09,
    decimalPoints: 2,
    required: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('milkingRefusalsLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 5,
    minValue: 0,
    maxValue: 99,
    decimalPoints: 2,
    required: true,
    moreInfo: {
      [ROBOT_TYPE.DE_LAVAL]: [i18n.t('milkingFailuresLavalInfo')],
      [ROBOT_TYPE.GEA]: [i18n.t('milkingFailuresGeaInfo')],
    },
  },
  {
    key: ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES,
    placeholder: i18n.t('numberPlaceholder'),
    label: i18n.t('totalMilkingFailuresLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 9,
    maxValue: 99999,
    required: true,
    moreInfo: {
      [ROBOT_TYPE.DE_LAVAL]: [i18n.t('totalMilkingFailuresLavalInfo')],
      [ROBOT_TYPE.GEA]: [i18n.t('totalMilkingFailuresGeaInfo')],
    },

    hasCommas: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.MAXIMUM_CONCENTRATE,
    placeholder: i18n.t('singleDecimalNumberPlaceholder'),
    label: i18n.t('maximumConcentrate'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 4,
    minValue: 0,
    maxValue: 50,
    decimalPoints: 1,
    required: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED,
    placeholder: i18n.t('singleDecimalNumberPlaceholder'),
    label: i18n.t('averageConcentrateFedLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 4,
    minValue: 0,
    maxValue: 50,
    decimalPoints: 1,
    required: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.MINIMUM_CONCENTRATE,
    placeholder: i18n.t('singleDecimalNumberPlaceholder'),
    label: i18n.t('minimumConcentrate'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 4,
    minValue: 0,
    maxValue: 50,
    decimalPoints: 1,
    required: true,
  },
  {
    key: ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
    placeholder: i18n.t('singleDecimalNumberPlaceholder'),
    label: i18n.t('concentratePer100KGMilkLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    maxLimit: 4,
    minValue: 0,
    maxValue: 75,
    decimalPoints: 1,
    required: true,
    moreInfo: {
      [ROBOT_TYPE.DE_LAVAL]: [i18n.t('100KGMilkLaval')],
      [ROBOT_TYPE.LELY]: [i18n.t('100KGMilkLaval')],
    },
  },
  {
    key: ROBOTIC_MILK_EVALUATION.REST_FEED,
    placeholder: i18n.t('singleDecimalNumberPlaceholder'),
    label: i18n.t('restFeedLely'),
    customLabel: true,
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType: 'done',
    maxLimit: 4,
    minValue: 0,
    maxValue: 20,
    decimalPoints: 1,
    required: true,
    moreInfo: {
      [ROBOT_TYPE.DE_LAVAL]: [i18n.t('restFeedLavalInfo')],
      [ROBOT_TYPE.GEA]: [i18n.t('restFeedGeaInfo')],
    },
  },
];

export const GRAPH_TYPES_VALUES = {
  [ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.AMS_UTILIZATION]: i18n.t('amsUtilization'),
  [ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.COW_EFFICIENCY]: i18n.t('cowEfficiency'),
  [ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.CONCENTRATE_DISTRIBUTION]: i18n.t(
    'concentrateDistribution',
  ),
};
