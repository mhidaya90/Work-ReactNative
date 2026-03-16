import { RESULTS_TABS_TYPES } from '../AppConstants';
import { ROF_FIELDS } from '../FormConstants';

import i18n from '../../localization/i18n';

import colors from '../../constants/theme/variables/customColor';

export const INITIAL_ROF_STEP = 1;
export const TOTAL_ROF_STEPS = 3;
export const BACK_TOOL_LISTING_STEP = 0;

export const DEFAULT_BREED = 'Holstein';

export const ROF_STEPS = [
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

export const ROF_FORM_TYPES = {
  TMR: ROF_FIELDS.TMR,
  INDIVIDUAL_COWS: ROF_FIELDS.INDIVIDUAL_COW,
};

export const ROF_FORM_ACCORDIONS = {
  HERD_PROFILE: 1,
  FEEDING: 2,
  MILK_PRODUCTION: 3,
  MILK_PRODUCTION_OUTPUTS: 4,
};

export const ROF_FEEDING_INGREDIENTS_TYPES = {
  HOME_GROWN_FORAGES: ROF_FIELDS.HOME_GROWN_FORAGES,
  HOME_GROWN_GRAINS: ROF_FIELDS.HOME_GROWN_GRAINS,
  PURCHASE_BULK_FEED: ROF_FIELDS.PURCHASE_BULK_FEED,
  PURCHASE_BAG_FEED: ROF_FIELDS.PURCHASE_BAG_FEED,
};

export const ROF_MILKING_INGREDIENTS_TYPES = {
  BUTTERFAT: ROF_FIELDS.BUTTERFAT,
  PROTEIN: ROF_FIELDS.PROTEIN,
  LACTOSE_AND_OTHER_SOLIDS: ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS,
  CLASS2_PROTEIN: ROF_FIELDS.CLASS2_PROTEIN,
  CLASS2_LACTOSE_AND_OTHER_SOLIDS: ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS,
  DEDUCTIONS: ROF_FIELDS.DEDUCTIONS,
};

export const ROF_PRICE_LIST_TYPES = {
  HOME_GROWN_FORAGES: 'HOME_GROWN_FORAGES',
  HOME_GROWN_GRAINS: 'HOME_GROWN_GRAINS',
  MILK_PRICE_PER_TON: 'MILK_PRICE_PER_TON',
  PERCENTAGE_KG_PER_HL: 'PERCENTAGE_KG_PER_HL',
  OTHERS: 'OTHERS',
};

export const ROF_INTEGER_MIN_VALUE = 0;
export const ROF_INTEGER_MAX_VALUE = 999;
export const ROF_DRY_MATTER_MAX_VALUE = 100;

export const ROF_ONE_MIN_VALUE = 1;
export const ROF_COMMA_SEPARATED_MAX_VALUE = 9999;

export const TOTAL_HERD_PER_DAY_MAX_VALUE = 999999;

export const ROF_DECIMAL_PLACES = 2;
export const ROF_THREE_DECIMAL_PLACES = 3;

export const DB_CALCULATIONS_TYPES = {
  TOTAL_COST_PER_DAY: 'TOTAL_COST_PER_DAY',
  TOTAL_PURCHASED_COST_PER_DAY: 'TOTAL_PURCHASED_COST_PER_DAY',
  TOTAL_CONCENTRATE_COST_PER_DAY: 'TOTAL_CONCENTRATE_COST_PER_DAY',
  TOTAL_COST_PER_COW_PER_DAY: 'TOTAL_COST_PER_COW_PER_DAY',
  TOTAL_PURCHASED_COST_PER_COW_PER_DAY: 'TOTAL_PURCHASED_COST_PER_COW_PER_DAY',
  TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY:
    'TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY',
  TOTAL_COST_KG_DM_PER_DAY: 'TOTAL_COST_KG_DM_PER_DAY',
  TOTAL_PURCHASED_COST_KG_DM_PER_DAY: 'TOTAL_PURCHASED_COST_KG_DM_PER_DAY',
  TOTAL_CONCENTRATE_COST_KG_DM_PER_DAY: 'TOTAL_CONCENTRATE_COST_KG_DM_PER_DAY',

  TOTAL_FEED_COST_PER_DAY: 'TOTAL_FEED_COST_PER_DAY',
  TOTAL_FEED_COST_PER_COW_PER_DAY: 'TOTAL_FEED_COST_PER_COW_PER_DAY',
  TOTAL_FEED_COST_KG_DM_PER_DAY: 'TOTAL_FEED_COST_KG_DM_PER_DAY',

  FORAGE_PERCENTAGE: 'forage_percentage',
};

export const ROF_GRAPH_TYPES = (currencySymbol = '', weightUnit = '') => {
  return [
    {
      name: i18n.t('ReturnOverFeed'),
      graphType: 'RETURN_OVER_FEED',
    },
    {
      name: i18n
        .t('rofPerKgFat')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      graphType: 'RETURN_OVER_FEED_PER_KG_BUTTERFAT',
    },
  ];
};

export const ROF_GRAPH_LEGENDS = {
  RETURN_OVER_FEED: [
    {
      color: colors.topScaleColor,
      title: i18n.t('ReturnOverFeed'),
    },
    {
      color: colors.metabolicDisorderColor2,
      title: i18n.t('totalConcentrateCostPerCowPerDay'),
    },
    {
      color: colors.middleScaleColor,
      title: i18n.t('totalFeedCostPerCowPerDay'),
    },
    {
      color: colors.mid2Color,
      title: i18n.t('totalRevenueCowDay'),
    },
  ],
  RETURN_OVER_FEED_PER_KG_BUTTERFAT: [
    {
      color: colors.topScaleColor,
      title: i18n.t('rofPerKgButterFat'),
    },
    {
      color: colors.metabolicDisorderColor2,
      title: i18n.t('concentrateCostPerKgBF'),
    },
    {
      color: colors.middleScaleColor,
      title: i18n.t('feedCostPerKgOfBF'),
    },
    {
      color: colors.mid2Color,
      title: i18n.t('totalRevenuePricePerKgFat'),
    },
  ],
};
