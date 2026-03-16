import i18n from '../../localization/i18n';
import { CALF_HEIFER_GROWTH_FIELDS } from '../FormConstants';
import customColor from '../theme/variables/customColor';

export const CALF_HEIFER_HERD_TYPES = {
  SETTINGS: 'settings',
  FARM_VISUALIZATION: 'farmVisualization',
  SUMMARY: 'summary',
  TARGETS: 'targets',
  GRAPH: 'graph',
};

export const CALF_HEIFER_GROWTH_CHARTS_TABS = [
  {
    key: CALF_HEIFER_HERD_TYPES.SETTINGS,
    value: i18n.t('settings'),
  },
  {
    key: CALF_HEIFER_HERD_TYPES.FARM_VISUALIZATION,
    value: i18n.t('farmVisualisation'),
  },
];

export const CALF_HEIFER_GROWTH_RESULTS_TABS = [
  {
    key: CALF_HEIFER_HERD_TYPES.SUMMARY,
    value: i18n.t('summary'),
  },
  {
    key: CALF_HEIFER_HERD_TYPES.TARGETS,
    value: i18n.t('targets'),
  },
  {
    key: CALF_HEIFER_HERD_TYPES.GRAPH,
    value: i18n.t('graph'),
  },
];

export const CALF_HEIFER_RESULTS_STEPS = {
  SUMMARY: CALF_HEIFER_HERD_TYPES.SUMMARY,
  TARGETS: CALF_HEIFER_HERD_TYPES.TARGETS,
  GRAPH: CALF_HEIFER_HERD_TYPES.GRAPH,
};

export const CALF_HEIFER_VIEWING_STEPS = {
  INPUT_FORM: 1,
  RESULT: 2,
};

export const CALF_HEIFER_GROWTH_STEPS = {
  TOTAL_STEPS: 2,
  INITIAL_STEP: 1,
  BACK_TOOL_LISTING_STEP: 0,
};

export const CALF_HEIFER_BOTTOM_SHEET_STEPS = [
  {
    step: 1,
    name: i18n.t('dataInput'),
  },
  {
    step: 2,
    name: i18n.t('results'),
  },
];

// Scale options
export const GROWTH_SCALE_OPTIONS = {
  BODY_WEIGHT: 'BodyWeight',
  BODY_HEIGHT: 'BodyHeight',
};

export const SCALE_OPTIONS_LIST = [
  {
    key: 'bodyWeight',
    value: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
    id: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
    name: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
  },
  {
    key: 'bodyHeight',
    value: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
    id: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
    name: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
  },
];

// Default values for the settings form
export const DEFAULT_SETTINGS_FORM_VALUES = {
  // general tool defaults
  [CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE]:
    GROWTH_SCALE_OPTIONS.BODY_WEIGHT,

  // settings defaults
  [CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS]: 24,
  [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]: 650,
  [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]: Math.round(0.06 * 650), // 39
  [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]: 141,
  [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]: Math.round(0.55 * 141), // 79
  [CALF_HEIFER_GROWTH_FIELDS.VISUALIZATION]: 'CURRENT_VISIT',
};

export const SETTINGS_FORM_MIN_MAX_VALUES = {
  [CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS]: {
    min: 18,
    max: 30,
  },
  [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]: {
    min: 500,
    max: 850,
  },
  [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]: {
    min: Math.round(0.06 * 500), // 30
    max: Math.round(0.06 * 850), // 51
  },
  [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]: {
    min: 133,
    max: 157,
  },
  [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]: {
    min: Math.round(0.55 * 133), // 73
    max: Math.round(0.55 * 157), // 86
  },
};

// Animal form validation ranges
export const ANIMAL_FORM_MIN_MAX_VALUES = {
  [CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT]: {
    min: 0,
    max: 1000,
    decimals: 1,
  },
  [CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT]: {
    min: 50,
    max: 150,
    decimals: 0,
  },
  [CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS]: {
    min: 0,
    max: 100,
    decimals: 1,
  },
};

// Age calculation constant (days per month)
export const DAYS_PER_MONTH = 30.437;

// end settings form

export const SORTING_FILTER_OPTIONS = [
  { id: 'asc', name: i18n.t('acsToDesc'), value: 'asc' },
  { id: 'desc', name: i18n.t('descToAsc'), value: 'desc' },
];

export const SUMMARY_MONTHS_RANGE = {
  ZERO_TO_TWO_MONTHS: {
    min: 0,
    max: 2,
  },
  TWO_TO_FOUR_MONTHS: {
    min: 2.0001,
    max: 4,
  },
  FOUR_TO_EIGHT_MONTHS: {
    min: 4.0001,
    max: 8,
  },
  EIGHT_TO_TWELVE_MONTHS: {
    min: 8.0001,
    max: 12,
  },
  TWELVE_TO_SIXTEEN_MONTHS: {
    min: 12.0001,
    max: 16,
  },
  SIXTEEN_TO_TWENTY_MONTHS: {
    min: 16.0001,
    max: 20,
  },
  TWENTY_TO_TWENTY_FOUR_MONTHS: {
    min: 20.0001,
    max: 24,
  },
  GREATER_THAN_TWENTY_FOUR_MONTHS: {
    min: 24.0001,
    max: 100,
  },
  ZERO_TO_FOUR_MONTHS: {
    min: 0,
    max: 4,
  },
  ZERO_TO_SIX_MONTHS: {
    min: 0,
    max: 6,
  },
  SIX_TO_TWELVE_MONTHS: {
    min: 6,
    max: 12,
  },
  ZERO_TO_TWELVE_MONTHS: {
    min: 0,
    max: 12,
  },
  TWELVE_TO_TWENTY_FOUR_MONTHS: {
    min: 12,
    max: 24,
  },
};

export const GRAPH_MONTHS_RANGE = {
  ZERO_TO_TWO_MONTHS: {
    min: 0,
    max: 2,
  },
  TWO_TO_FOUR_MONTHS: {
    min: 2.01,
    max: 4,
  },
  FOUR_TO_EIGHT_MONTHS: {
    min: 4.01,
    max: 8,
  },
  EIGHT_TO_TWELVE_MONTHS: {
    min: 8.01,
    max: 12,
  },
  TWELVE_TO_SIXTEEN_MONTHS: {
    min: 12.01,
    max: 16,
  },
  SIXTEEN_TO_TWENTY_MONTHS: {
    min: 16.01,
    max: 20,
  },
  TWENTY_TO_TWENTY_FOUR_MONTHS: {
    min: 20.01,
    max: 24,
  },
  GREATER_THAN_TWENTY_FOUR_MONTHS: {
    min: 24.01,
    max: 100,
  },
  ZERO_TO_FOUR_MONTHS: {
    min: 0,
    max: 4,
  },
  ZERO_TO_SIX_MONTHS: {
    min: 0,
    max: 6,
  },
  SIX_TO_TWELVE_MONTHS: {
    min: 6,
    max: 12,
  },
  ZERO_TO_TWELVE_MONTHS: {
    min: 0,
    max: 12,
  },
  TWELVE_TO_TWENTY_FOUR_MONTHS: {
    min: 12,
    max: 24,
  },
};

export const CALF_HEIFER_GROWTH_MONTHS_RANGE_LABELS = {
  ZERO_TO_TWO_MONTHS: i18n.t('0_2MO'),
  TWO_TO_FOUR_MONTHS: i18n.t('2_4MO'),
  FOUR_TO_EIGHT_MONTHS: i18n.t('4_8MO'),
  EIGHT_TO_TWELVE_MONTHS: i18n.t('8_12MO'),
  TWELVE_TO_SIXTEEN_MONTHS: i18n.t('12_16MO'),
  SIXTEEN_TO_TWENTY_MONTHS: i18n.t('16_20MO'),
  TWENTY_TO_TWENTY_FOUR_MONTHS: i18n.t('20_24MO'),
  GREATER_THAN_TWENTY_FOUR_MONTHS: i18n.t('more_than24MO'),
  ZERO_TO_FOUR_MONTHS: i18n.t('0_4MO'),
  ZERO_TO_SIX_MONTHS: i18n.t('0_6MO'),
  SIX_TO_TWELVE_MONTHS: i18n.t('6_12MO'),
  ZERO_TO_TWELVE_MONTHS: i18n.t('0_12MO'),
  TWELVE_TO_TWENTY_FOUR_MONTHS: i18n.t('12_24MO'),
};

export const VISUALIZATION_OPTIONS = {
  CURRENT_VISIT: 'CURRENT_VISIT',
  UPTO_THREE_MONTHS: 'UPTO_THREE_MONTHS',
  UPTO_SIX_MONTHS: 'UPTO_SIX_MONTHS',
  UPTO_TWELVE_MONTHS: 'UPTO_TWELVE_MONTHS',
};

// Arc angle calculation for equal-sized arc segments:
// - Total arc span: 0.3 to 4.7 radians = 4.4 radians (~252 degrees)
// - 3 equal segments: each 4.4/3 ≈ 1.467 radians (~84 degrees)
// - Red zone: 0.3 to 1.767 (values < 0.675)
// - Green zone: 1.767 to 3.233 (values 0.675 to 0.900)
// - Blue zone: 3.233 to 4.7 (values > 0.900)
// - Small overlap between arcs for visual smoothness

// Zone thresholds for Body Weight (absolute values in g/day, same for all gauges)
export const CALF_HEIFER_ZONE_THRESHOLDS = {
  RED_MAX: 0.675, // Below this = Red zone
  GREEN_MAX: 0.9, // Below this (and >= RED_MAX) = Green zone, above = Blue zone
};

// Equal arc segment angles for Body Weight (each segment is 1.467 radians)
const EQUAL_ARC_COLORS = [
  {
    color: customColor.calfHeiferGaugeRedColor,
    startAngle: 0.3,
    endAngle: 1.867, // 0.3 + 4.4/3 + 0.1 overlap
  },
  {
    color: customColor.greenIndicatorColor,
    startAngle: 1.767, // 0.3 + 4.4/3 - 0.1 overlap
    endAngle: 3.333, // 0.3 + 2*4.4/3 + 0.1 overlap
  },
  {
    color: customColor.blueIndicatorColor,
    startAngle: 3.133, // 0.3 + 2*4.4/3 - 0.1 overlap
    endAngle: 4.7,
  },
];

// Equal arc segment angles for Body Height (same visual arcs as Body Weight)
// Zone thresholds for Body Height are proportionally scaled
const EQUAL_ARC_COLORS_HEIGHT = [
  {
    color: customColor.calfHeiferGaugeRedColor,
    startAngle: 0.3,
    endAngle: 1.867, // 0.3 + 4.4/3 + 0.1 overlap
  },
  {
    color: customColor.greenIndicatorColor,
    startAngle: 1.767, // 0.3 + 4.4/3 - 0.1 overlap
    endAngle: 3.333, // 0.3 + 2*4.4/3 + 0.1 overlap
  },
  {
    color: customColor.blueIndicatorColor,
    startAngle: 3.133, // 0.3 + 2*4.4/3 - 0.1 overlap
    endAngle: 4.7,
  },
];

export const CALF_HEIFER_TARGETS_GAUGES = [
  {
    key: '0_2',
    ageRangeMin: 0, // Age range in months (min)
    ageRangeMax: 2, // Age range in months (max)
    minValue: 0.375, // Body Weight min (g/day)
    maxValue: 1.25, // Body Weight max (g/day)
    redRange: '',
    greenRange: '',
    yellowRange: '',
    totalGaugeLabels: 3,
    months: i18n.t('0_2MO'),
    innerValues: [
      {
        weightMin: 0,
        heightMin: 0.15,
        positionX: 50,
        positionY: 122,
      },
      {
        weightMax: 1.25,
        heightMax: 0.295,
        positionX: 132,
        positionY: 122,
      },
    ],
    gaugeColors: EQUAL_ARC_COLORS,
    heightGaugeColors: [
      {
        ...EQUAL_ARC_COLORS_HEIGHT[0],
        startAngle: 0.3,
        endAngle: 2.2, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[1],
        startAngle: 2.15, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.7, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[2],
        startAngle: 3.58, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
  },
  {
    key: '0_4',
    ageRangeMin: 0, // Age range in months (min)
    ageRangeMax: 4, // Age range in months (max)
    minValue: 0, // Body Weight min (g/day)
    maxValue: 1.3, // Body Weight max (g/day)
    redRange: '',
    greenRange: '',
    yellowRange: '',
    totalGaugeLabels: 3,
    months: i18n.t('0_4MO'),
    innerValues: [
      {
        weightMin: 0,
        heightMin: 0.15,
        positionX: 50,
        positionY: 122,
      },
      {
        weightMax: 1.3,
        heightMax: 0.265,
        positionX: 132,
        positionY: 122,
      },
    ],
    gaugeColors: [
      {
        color: customColor.calfHeiferGaugeRedColor,
        startAngle: 0.3,
        endAngle: 2, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        color: customColor.greenIndicatorColor,
        startAngle: 1.92, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.39, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        color: customColor.blueIndicatorColor,
        startAngle: 3.333, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
    heightGaugeColors: [
      {
        ...EQUAL_ARC_COLORS_HEIGHT[0],
        startAngle: 0.3,
        endAngle: 2.2, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[1],
        startAngle: 2.1, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.7, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[2],
        startAngle: 3.4, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
  },
  {
    key: '0_6',
    ageRangeMin: 0, // Age range in months (min)
    ageRangeMax: 6, // Age range in months (max)
    minValue: 0, // Body Weight min (g/day)
    maxValue: 1.35, // Body Weight max (g/day)
    redRange: '',
    greenRange: '',
    yellowRange: '',
    totalGaugeLabels: 3,
    months: i18n.t('0_6MO'),
    innerValues: [
      {
        weightMin: 0,
        heightMin: 0.1,
        positionX: 50,
        positionY: 122,
      },
      {
        weightMax: 1.35,
        heightMax: 0.285,
        positionX: 132,
        positionY: 122,
      },
    ],
    gaugeColors: [
      {
        ...EQUAL_ARC_COLORS[0],
        startAngle: 0.3,
        endAngle: 2.2, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS[1],
        startAngle: 2.1, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.52, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS[2],
        startAngle: 3.47, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
    heightGaugeColors: [
      {
        ...EQUAL_ARC_COLORS_HEIGHT[0],
        startAngle: 0.3,
        endAngle: 1.9, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[1],
        startAngle: 1.8, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.4, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[2],
        startAngle: 3.3, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
  },
  {
    key: '6_12',
    ageRangeMin: 6, // Age range in months (min)
    ageRangeMax: 12, // Age range in months (max)
    minValue: 0, // Body Weight min (g/day)
    maxValue: 1.45, // Body Weight max (g/day)
    redRange: '',
    greenRange: '',
    yellowRange: '',
    totalGaugeLabels: 3,
    months: i18n.t('6_12MO'),
    innerValues: [
      {
        weightMin: 0,
        heightMin: 0.08,
        positionX: 50,
        positionY: 122,
      },
      {
        weightMax: 1.45,
        heightMax: 0.145,
        positionX: 132,
        positionY: 122,
      },
    ],
    gaugeColors: [
      {
        ...EQUAL_ARC_COLORS[0],
        startAngle: 0.3,
        endAngle: 2.39, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS[1],
        startAngle: 2.28, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.92, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS[2],
        startAngle: 3.69, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
    heightGaugeColors: [
      {
        ...EQUAL_ARC_COLORS_HEIGHT[0],
        startAngle: 0.3,
        endAngle: 1.8, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[1],
        startAngle: 1.7, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.1, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[2],
        startAngle: 3, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
  },
  {
    key: '0_12',
    ageRangeMin: 0, // Age range in months (min)
    ageRangeMax: 12, // Age range in months (max)
    minValue: 0, // Body Weight min (g/day)
    maxValue: 1.4, // Body Weight max (g/day)
    redRange: '',
    greenRange: '',
    yellowRange: '',
    totalGaugeLabels: 3,
    months: i18n.t('0_12MO'),
    innerValues: [
      {
        weightMin: 0,
        heightMin: 0.05,
        positionX: 50,
        positionY: 122,
      },
      {
        weightMax: 1.4,
        heightMax: 0.215,
        positionX: 132,
        positionY: 122,
      },
    ],
    gaugeColors: [
      {
        ...EQUAL_ARC_COLORS[0],
        startAngle: 0.3,
        endAngle: 2.1, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS[1],
        startAngle: 2.05, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.7, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS[2],
        startAngle: 3.65, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
    heightGaugeColors: EQUAL_ARC_COLORS_HEIGHT,
  },
  {
    key: '12_24',
    ageRangeMin: 12, // Age range in months (min)
    ageRangeMax: 24, // Age range in months (max)
    minValue: 0, // Body Weight min (g/day)
    maxValue: 1.3, // Body Weight max (g/day)
    redRange: '',
    greenRange: '',
    yellowRange: '',
    totalGaugeLabels: 3,
    months: i18n.t('12_24MO'),
    innerValues: [
      {
        weightMin: 0,
        heightMin: 0,
        positionX: 50,
        positionY: 122,
      },
      {
        weightMax: 1.3,
        heightMax: 0.065,
        positionX: 132,
        positionY: 122,
      },
    ],
    gaugeColors: [
      {
        ...EQUAL_ARC_COLORS[0],
        startAngle: 0.3,
        endAngle: 1.96, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS[1],
        startAngle: 1.9, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.4, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS[2],
        startAngle: 3.3, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
    heightGaugeColors: [
      {
        ...EQUAL_ARC_COLORS_HEIGHT[0],
        startAngle: 0.3,
        endAngle: 2.35, // 0.3 + 4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[1],
        startAngle: 2.25, // 0.3 + 4.4/3 - 0.1 overlap
        endAngle: 3.1, // 0.3 + 2*4.4/3 + 0.1 overlap
      },
      {
        ...EQUAL_ARC_COLORS_HEIGHT[2],
        startAngle: 3, // 0.3 + 2*4.4/3 - 0.1 overlap
        endAngle: 4.7,
      },
    ],
  },
];
