// localization
import i18n from '../../localization/i18n';

// constants
export const INITIAL_CUD_CHEWING_STEP = 1;
export const TOTAL_CUD_CHEWING_STEPS = 3;
export const BACK_TOOL_LISTING_STEP = 0;

export const CUD_CHEWING_BOTTOM_SHEET_STEPS = [
  {
    id: 0x001,
    step: 1,
    name: i18n.t('analysisSelection'),
  },
  {
    id: 0x002,
    step: 2,
    name: i18n.t('dataInput'),
  },
  {
    id: 0x003,
    step: 3,
    name: i18n.t('results'),
  },
];

export const CUD_CHEWING_TYPES = {
  CUD_CHEWING: 'CUD_CHEWING',
  NUMBER_OF_CHEWS: 'NUMBER_OF_CHEWS',
};

export const PEN_ANALYSIS_CUD_CHEWING_DROPDOWN = [
  {
    id: 0x0005,
    name: i18n.t('cudChewing'),
    value: i18n.t('cudChewing'),
    type: CUD_CHEWING_TYPES.CUD_CHEWING,
  },
  {
    id: 0x0007,
    name: i18n.t('noOfChews'),
    value: i18n.t('noOfChews'),
    type: CUD_CHEWING_TYPES.NUMBER_OF_CHEWS,
  },
];

export const CUD_CHEWING_HERD_ANALYSIS_RESULTS_TABS = [
  {
    id: 'cudChewing%',
    key: CUD_CHEWING_TYPES.CUD_CHEWING,
    value: i18n.t('cudChewingPercent'),
  },

  {
    id: 'noOfChews',
    key: CUD_CHEWING_TYPES.NUMBER_OF_CHEWS,
    value: i18n.t('noOfChews'),
  },
];

export const CUD_CHEW_HERD_ANALYSIS_TYPES = {
  CHEWING: 'chewing',
  CHEWS_PER_CUD: 'chews_per_cud',
  SCORE_ANALYSIS: 'score_analysis',
  SUMMARY: 'summary',
  GRAPH: 'graph',
};

export const CUD_CHEW_HERD_ANALYSIS_TABS = [
  {
    id: 'scoreAnalysis',
    key: CUD_CHEW_HERD_ANALYSIS_TYPES.SCORE_ANALYSIS,
    value: i18n.t('scoreAnalysis'),
  },

  {
    id: 'chewing',
    key: CUD_CHEW_HERD_ANALYSIS_TYPES.CHEWING,
    value: `${i18n.t('chewing')} %`,
  },
  {
    id: 'chewsPerCud',
    key: CUD_CHEW_HERD_ANALYSIS_TYPES.CHEWS_PER_CUD,
    value: i18n.t('noOfChews'),
  },
];
