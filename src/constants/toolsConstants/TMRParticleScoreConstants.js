// localization
import i18n from '../../localization/i18n';

// constants
import colors from '../../constants/theme/variables/customColor';
import { RUMEN_HEALTH_TMR_PARTICLE_SCORE } from '../FormConstants';

export const INITIAL_TMR_STEP = 1;
export const TOTAL_TMR_STEPS = 3;
export const BACK_TOOL_LISTING_STEP = 0;

export const GOAL_VALUE_TYPES = {
  MINIMUM: 'min',
  MAXIMUM: 'max',
};

export const TMR_GOAL_TYPE = 'tmrGoalType';

export const TMR_GOALS_TYPES = {
  TOP: 'top',
  MID_1: 'mid1',
  MID_2: 'mid2',
  TRAY: 'tray',
};

export const TMR_STEPS_COUNT = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
};

export const TMR_PARTICLE_SCORE_STEPS = [
  {
    id: 0x01,
    step: 1,
    name: i18n.t('analysisSelection'),
  },
  {
    id: 0x02,
    step: 2,
    name: i18n.t('dataInput'),
  },
  {
    id: 0x03,
    step: 3,
    name: i18n.t('results'),
  },
];

export const TMR_PARTICLE_INPUT_VALIDATIONS = {
  MIN: 0,
  MAX: 999,
  DECIMAL_POINTS: 2,
  MAX_CHARACTERS: 25,
};

export const FORM_INPUT_REFERENCE = {
  FIELD_ONE: 1,
  FIELD_TWO: 2,
  FIELD_THREE: 3,
  FIELD_FOUR: 4,
};

export const TMR_RESULTS_TYPES = {
  SUMMARY: 'summary',
  GRAPH: 'graph',
};

export const TMR_RESULTS_TABS = [
  {
    id: 0x1,
    key: TMR_RESULTS_TYPES.SUMMARY,
    value: i18n.t('summary'),
  },
  {
    id: 0x2,
    key: TMR_RESULTS_TYPES.GRAPH,
    value: i18n.t('graph'),
  },
];

export const TMR_SUMMARY_COLUMN_HEADINGS = [
  i18n.t('avgTmrParticleScore'),
  i18n.t('standardDeviation'),
  i18n.t('goalMax%'),
  i18n.t('goalMin%'),
];

//graph legends
export const TMR_GRAPH_LEGENDS = [
  {
    key: TMR_GOALS_TYPES.TOP,
    color: colors.topColor,
    title: i18n.t('top_19mm'),
  },
  {
    key: TMR_GOALS_TYPES.MID_1,
    color: colors.mid1Color,
    title: i18n.t('mid1_18mm'),
  },
  {
    key: TMR_GOALS_TYPES.MID_2,
    color: colors.mid2Color,
    title: i18n.t('mid2_4mm'),
  },
  {
    key: TMR_GOALS_TYPES.TRAY,
    color: colors.trayColor,
    title: i18n.t('tray'),
  },
];

export const TOP_SCALE_TMR_SCORE_GOAL_THREE_SCREEN = {
  [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TOP,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT]: 6,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT]: 10,
};

export const TOP_SCALE_TMR_SCORE_GOAL_SCREEN_NEW_OLD = {
  [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TOP,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT]: 2,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT]: 8,
};

export const MID_1_SCALE_TMR_SCORE_GOAL = {
  [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.MID_1,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT]: 30,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT]: 50,
};

export const MID_2_SCALE_TMR_SCORE_GOAL = {
  [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.MID_2,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT]: '-',
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT]: '-',
};

export const MID_2_SCALE_TMR_SCORE_GOAL_SCREEN_NEW = {
  [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.MID_2,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT]: 10,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT]: 20,
};

export const TRAY_SCALE_TMR_SCORE_GOAL_THREE_SCREEN = {
  [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TRAY,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT]: 40,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT]: 60,
};

export const TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_OLD = {
  [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TRAY,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT]: 0,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT]: 20,
};

export const TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_NEW = {
  [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TRAY,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT]: 30,
  [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT]: 40,
};

export const PEN_ANALYSIS_TABLE_CONSTANTS = {
  STANDARD_DEVIATION: 'Standard deviation',
  TOP: 'Top',
  MID1: 'Mid 1',
  MID2: 'Mid 2',
  TRAY: 'Tray',
}