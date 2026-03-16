// localization
import i18n from '../../localization/i18n';

// constants
import colors from '../../constants/theme/variables/customColor';
import { MUNARE_SCREENING_FIELDS } from '../FormConstants';

export const INITIAL_TMR_STEP = 1;
export const TOTAL_TMR_STEPS = 3;

export const GOAL_VALUE_TYPES = {
  MINIMUM: 'min',
  MAXIMUM: 'max',
};

export const MST_GOAL_TYPE = 'mstGoalType';

export const MANURE_SCREENER_GOALS_TYPES = {
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
};

export const MANURE_SCREENER_STEPS_COUNT = {
  FIRST: 1,
  SECOND: 2,
};

export const MST_STATE_STEPS = [
  {
    id: 0x002,
    step: 1,
    name: i18n.t('dataInput'),
  },
  {
    id: 0x003,
    step: 2,
    name: i18n.t('results'),
  },
];

export const MANURE_SCREENER_INPUT_VALIDATIONS = {
  MIN: 0,
  MAX: 99999,
  DECIMAL_POINTS: 1,
  TWO_DECIMAL_POINTS: 1,
  MAX_CHARACTERS: 35,
  TOP_GOAL_MIN: 0.0,
  MIDDLE_GOAL_MIN: 0.0,
  BOTTOM_GOAL_MIN: 50.0,
  TOP_GOAL_MAX: 10.0,
  MIDDLE_GOAL_MAX: 20.0,
  BOTTOM_GOAL_MAX: 100.0,
  MAX_LENGTH: 5,
  MAX_OBSERVATION: 150,
};

export const MANURE_SCREENER_GOALS_VALUES = {
  TOP_GOAL_MIN: 0.0,
  TOP_GOAL_MAX: 10.0,

  MIDDLE_GOAL_MIN: 0.0,
  MIDDLE_GOAL_MAX: 20.0,

  BOTTOM_GOAL_MIN: 50.0,
  BOTTOM_GOAL_MAX: 100.0,
};

export const FORM_INPUT_REFERENCE = {
  FIELD_ONE: 0,
  FIELD_TWO: 1,
  FIELD_THREE: 2,
  FIELD_FOUR: 3,
  FIELD_FIVE: 4,
};

export const MANURE_SCREENER_RESULTS_TYPES = {
  SUMMARY: 'summary',
  GRAPH: 'graph',
};

export const MANURE_SCREENER_RESULTS_TABS = [
  {
    id: 0x1,
    key: MANURE_SCREENER_RESULTS_TYPES.SUMMARY,
    value: i18n.t('summary'),
  },
  {
    id: 0x2,
    key: MANURE_SCREENER_RESULTS_TYPES.GRAPH,
    value: i18n.t('graph'),
  },
];

export const MANURE_SCREENER_SUMMARY_COLUMN_HEADINGS = [
  i18n.t('onScreen(%)'),
  i18n.t('goalMinPercent'),
  i18n.t('goalMaxPercent'),
];
export const MANURE_SCREENER_SUMMARY_ROW_HEADINGS = [
  i18n.t('top'),
  i18n.t('middle'),
  i18n.t('bottom'),
];

export const MAX_GOAL_VALUES = [
  MANURE_SCREENER_INPUT_VALIDATIONS.TOP_GOAL_MAX,
  MANURE_SCREENER_INPUT_VALIDATIONS.MIDDLE_GOAL_MAX,
  MANURE_SCREENER_INPUT_VALIDATIONS.BOTTOM_GOAL_MAX,
];

//graph legends
export const MANURE_SCREENER_GRAPH_LEGENDS = [
  {
    key: MANURE_SCREENER_GOALS_TYPES.TOP,
    color: colors.topScaleColor,
    title: i18n.t('top'),
  },
  {
    key: MANURE_SCREENER_GOALS_TYPES.MIDDLE,
    color: colors.middleScaleColor,
    title: i18n.t('middle'),
  },
  {
    key: MANURE_SCREENER_GOALS_TYPES.BOTTOM,
    color: colors.bottomScaleColor,
    title: i18n.t('bottom'),
  },
];
