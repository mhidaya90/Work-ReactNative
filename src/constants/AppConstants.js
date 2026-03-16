/**
 * This file contains all the constants used in the code
 */

import { getNumberFormatSettings } from 'react-native-localize';
import i18n from '../localization/i18n';
import navigationService from '../services/navigationService';
import ROUTE_CONSTANTS from './RouteConstants';
import colors from './theme/variables/customColor';

const regionSettings = getNumberFormatSettings();

export const ENVIRONMENT = {
  PRODUCTION: 'prod',
  INTERNAL_PROD: 'internalProd',
  STAGING: 'staging',
  QA: 'qa',
  DEV: 'development',
};

export const DEVICE_TYPES = {
  TABLET: 'Tablet',
  HANDSET: 'Handet',
};

export const IMAGE_FILE_UPLOAD_ALLOWED_TYPES = ['jpeg', 'jpg', 'png'];
export const DECIMAL_PLACES = 2;
export const ATTACHMENT_SIZE_LIMIT = 15728640; //Max size allowed for the attachment that is 15MB
export const MAX_IMAGE_SIZE_MB = 20;
export const DEFAULT_MAX_LENGTH = 1000;

export const MAX_MEDIA_IMAGE_SIZE = 5242880;
export const MAX_MEDIA_VIDEO_SIZE = 52428800;
export const NOTEBOOK_EDITOR_TEXT_LENGTH = 2000;
export const NOTEBOOK_VISIT_REPORT_TEXT_LENGTH = 250;

export const VIDEO_CONSTANT = 'video';
export const V_VIDEO_CONSTANT = 'Video';
export const PHOTO_CONSTANT = 'photo';
export const P_PHOTO_CONSTANT = 'Photo';
export const PHOTO_MIME_TYPE = 'image/jpeg';
export const NOTEBOOK_MEDIA_MAX_PHOTO_COUNT = 2;
export const NOTEBOOK_MEDIA_MAX_VIDEO_COUNT = 3;
export const NOTEBOOK_MEDIA_MAX_AUDIO_COUNT = 5;

// export const NUMBER_DEFAULT_MAX_LENGTH = 7;
export const NUMBER_DEFAULT_MAX_LENGTH = 10;
export const GENERAL_INPUT_MAX_LIMIT = 25;
export const ADDRESS_MAX_LIMIT = 255;
export const CITY_MAX_LIMIT = 25;
export const STATE_MAX_LIMIT = 25;
export const POSTAL_CODE_MAX_LIMIT = 15;
export const NUMERIC_INPUT_MAX_LIMIT = 20;
export const SITE_NAME_MAX_LIMIT = 36;
export const PEN_PILL_MAX_LIMIT = 15;
export const VISIT_NAME_COMPONENT_LENGTH = 7;
export const COUNTER_MAX_LIMIT = 999;
export const COUNTER_MIN_LIMIT = 0;
export const GOALS_MIN_LIMIT = 0;
export const GOALS_MAX_LIMIT = 5;
export const METABOLIC_INCIDENCE_CASES_MIN_LIMIT = 0;
export const METABOLIC_INCIDENCE_CASES_MAX_LIMIT = 9999;
export const METABOLIC_INCIDENCE_REPLACEMENT_COW_COST_MAX_LIMIT = 999999;
export const METABOLIC_INCIDENCE_TOTAL_FRESH_COWS_MIN_LIMIT = 0;
export const METABOLIC_INCIDENCE_TOTAL_FRESH_COWS_MAX_LIMIT = 99999;
export const METABOLIC_INCIDENCE_MILK_PRICE_MIN_LIMIT = 0;
export const METABOLIC_INCIDENCE_MILK_PRICE_MAX_LIMIT = 10000;
export const PERCENTAGE_MIN_LIMIT = 0;
export const PERCENTAGE_MAX_LIMIT = 100;
export const FORAGE_INVENTORIES_INPUT_MIN_LIMIT = 0;
export const FORAGE_INVENTORIES_INPUT_MAX_LIMIT = 999;
export const FORAGE_INVENTORIES_SILO_HEIGHT_MAX_LIMIT_METRIC = 36.5;
export const FORAGE_INVENTORIES_SILO_HEIGHT_MAX_LIMIT_IMPERIAL = 120;
export const FORAGE_INVENTORIES_FEEDOUT_MAX_LIMIT = 9999;
export const FORAGE_INVENTORIES_INPUT_DECIMAL_PLACES = 1;
export const FORAGE_INVENTORIES_INPUT_DECIMAL_PLACES_ONE = 1;
export const FORAGE_INVENTORIES_DRY_MATTER_MIN_LIMIT = 0;
export const FORAGE_INVENTORIES_DRY_MATTER_MAX_LIMIT = 100;

export const RATION_COST_MAX_VALUE = 99999;
export const SOMATIC_CELL_COUNT_MAX_VALUE = 99999;
export const BACTERIA_CELL_COUNT_MAX_VALUE = 99999;
export const BACTERIA_CELL_COUNT_DECIMAL_PLACE = 1;
export const DAYS_IN_MILK_MIN_VALUE = -100;
export const DAYS_IN_MILK_MAX_VALUE = 999;
export const LACTATING_ANIMALS_MIN_VALUE = 0;
export const LACTATING_ANIMALS_MAX_VALUE = 99999;
export const ANIMALS_IN_TANK_MAX_VALUE = 99999;

//milk sold Evaluation validation min max limit
export const MILK_SOLD_EVALUATION_DECIMAL_PLACES = 3;
export const MILK_SOLD_EVALUATION_ONE_DECIMAL_PLACES = 1;
export const MILK_SOLD_EVALUATION_TWO_DECIMAL_PLACES = 2;
export const MILK_SOLD_EVALUATION_INITIAL_MIN_VALUE = 0;
export const MILK_SOLD_EVALUATION_TOTAL_MILK_PRICE_MAX_VALUE = 10000;
export const MILK_SOLD_EVALUATION_DRY_MATTER_INTAKE_MAX_VALUE = 100;
export const MILK_SOLD_EVALUATION_DAYS_AS_FED_INTAKE_MAX_VALUE = 999;
export const MILK_SOLD_EVALUATION_DAYS_NEL_DAIRY_MAX_VALUE = 99;
export const MILK_SOLD_EVALUATION_DAYS_RATION_COST_MAX_VALUE = 99999;
export const MILK_SOLD_EVALUATION_PICKUP_MILK_SOLD_MAX_VALUE = 99999;
export const MILK_SOLD_EVALUATION_PICKUP_DAYS_IN_TANK_MAX_VALUE = 999;
export const MILK_SOLD_EVALUATION_PICKUP_MILK_FAT_MAX_VALUE = 100;
export const MILK_SOLD_EVALUATION_PICKUP_MILK_PROTEIN_MAX_VALUE = 100;
export const MILK_SOLD_EVALUATION_PICKUP_NON_FAT_SOLID_MAX_VALUE = 100;
export const MILK_SOLD_EVALUATION_PICKUP_MUN_Milk_Urea_MAX_VALUE = 999;
export const MILK_SOLD_EVALUATION_PICKUP_SOMATIC_CELL_COUNT_MAX_VALUE = 999;
export const MILK_SOLD_EVALUATION_PICKUP_BACTERIA_CELL_COUNT_MAX_VALUE = 999;
export const MILK_SOLD_EVALUATION_PICKUP_MASTITIS_MAX_VALUE = 9999;

export const PER_PAGE_RECORD = 100; // As per discussion with BE
export const DEFAULT_LAST_SYNC_TIME = '1970-01-01T00:00:00Z';

export const nillUUID = '00000000-0000-0000-0000-000000000000';

export const GUID_REGEX =
  /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;

export const S3_PHOTOID_REGEX =
  /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;

export const URL_REGEX =
  /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
/**
 * email validation Regex
 */
export const EMAIL_REGEX =
  /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;

export const DECIMAL_REGEX =
  regionSettings.decimalSeparator == '.'
    ? /^-?\d*(\.\d*)?$/
    : /^-?\d*(\,\d*)?$/;
export const DECIMAL_TOFIXED_REGEX =
  regionSettings.decimalSeparator == '.'
    ? /^-?\d*(\.\d{0,1})?$/
    : /^-?\d*(\,\d{0,1})?$/;
export const TWO_DECIMAL_TOFIXED_REGEX =
  regionSettings.decimalSeparator == '.'
    ? /^-?\d*(\.\d{0,2})?$/
    : /^-?\d*(\,\d{0,2})?$/;
export const THREE_DECIMAL_TOFIXED_REGEX =
  regionSettings.decimalSeparator == '.'
    ? /^-?\d*(\.\d{0,3})?$/
    : /^-?\d*(\,\d{0,3})?$/;

export const INTEGER_REGEX = /^-?\d*$/;

export const DECIMAL_REGEX_VALIDATE =
  regionSettings.decimalSeparator == '.'
    ? /^-?\d*(\.\d*)?$/
    : /^-?\d*(\,\d*)?$/;

export const DECIMAL_TOFIXED_REGEX_VALIDATE =
  regionSettings.decimalSeparator == '.'
    ? /^-?\d+(\.\d{0,1})?$/
    : /^-?\d+(\,\d{0,1})?$/;

export const INTEGER_REGEX_VALIDATE = /^-?\d+$/;
export const COMMA_SEPARATED_NUMBER = /\B(?=(\d{3})+(?!\d))/g;

export const KG_REGEX = /kgs?/gi;

/**
 * special characters validation Regex
 */
// export const SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
export const SPECIAL_CHARACTERS_REGEX = /[\/\\:*?"<>|&]+/;
export const TITLE_REGEX = /[\/\\:*?"<>|]+/;

/**
 * base64 validation Regex
 */
export const BASE64_REGEX =
  /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

export const WEEK_DAYS = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 3,
  WEDNESDAY: 4,
  THURSDAY: 5,
  FRIDAY: 6,
  SATURDAY: 7,
};

export const MONTHS = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

export const MONTH_INITIALS = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'July',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

export const DAYS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
  { value: 17, label: '17' },
  { value: 18, label: '18' },
  { value: 19, label: '19' },
  { value: 20, label: '20' },
  { value: 21, label: '21' },
  { value: 22, label: '22' },
  { value: 23, label: '23' },
  { value: 24, label: '24' },
  { value: 25, label: '25' },
  { value: 26, label: '26' },
  { value: 27, label: '27' },
  { value: 28, label: '28' },
  { value: 29, label: '29' },
  { value: 30, label: '30' },
];

export const DATE_FORMATS = {
  // MM_DD_YYYY: 'MM/DD/YYYY',
  MM_DD_YY: 'MM/DD/YY',
  MM_DD: 'MM/DD',
  MMMM_YYYY: 'MMMM, YYYY',
  MMMM_DD_YYYY: 'MMMM DD, YYYY',
  MMM_DD_YYYY: 'MMM dd, yyyy',
  YYYY_MM_DD_HH_mm_ss: 'yyyy-MM-dd HH:mm:ss',
  YYYY_MM_DD: 'YYYY-MM-DD',
  MM_DD_YYYY_LT: 'MM/DD/YYYY LT',
  H_MM_A: 'h:mm A',
  MM_DD_YY_H_MM_A: 'MM/DD/YY h:mm A',
  EEE_MMM_d: 'EEE, MMM d',
  dd_MMM_yy: 'dd MMM yy',
  MMM_DD_H_MM: 'MMM dd H:mm',
  MMM_DD_YY_H_MM: 'MMM dd, yy H:mm',
  MM_dd_yyyy: 'MM/dd/yyyy',
  MM_dd: 'MM/dd',
  MM_dd_YYYY: 'MM/dd/yyyy',
  MM_DD_YYYY: 'MM-dd-yyyy',
  MMM_DD_l_YY_H_MM: 'MMM dd, yy | H:mm',
  EEEE_MMM_d: 'EEEE, MMM d',
  H_MM: 'h:mm',
  H_MM_a: 'h:mm a',
  MMM_d_H_MM_A: 'MMM d, h:mm A',
  HH_MM: 'kk:mm',
  dd_MMM_yyyy: 'dd MMM, yyyy',
  HH_mm: 'HH:mm',
  MM_dd_YY: 'MM/dd/yy',
  MM_dd_yy: 'MM-dd-yy',
  MMM_dd_HH_mm: 'MMM dd, HH:mm',
  MMM_dd_yy_HH_mm: 'MMM dd, yy HH:mm',
  dd_MMMM_yyyy: 'dd MMMM yyyy',
};

export const KEYBOARD_TYPES = {
  NUMBER: 'number-pad',
  DECIMAL: 'decimal-pad',
  DEFAULT: 'default',
};

// The visit statuses defined in quotes are temporary. Will
// update these once get actual status values from API.
export const VISIT_STATUS = {
  PUBLISHED: 'Published',
  IN_PROGRESS: 'InProgress',
  IS_DELETED: 'IsDeleted',
};

export const CUSTOMER_LISTING_TABS = {
  ALL: i18n.t('all'),
  PINNED: i18n.t('pinned'),
  RECENT: i18n.t('recent'),
};

export const DATABASE_OPTION_KEYS = {
  IS_FIRST_LOGIN: 'isFirstLogin',
  LOCALE: 'locale',
  IS_SYNC_FAILED: 'isSyncFailed',
  DATA_SYNC: 'dataSync',
  IS_EULA_ACCEPTED: 'isEulaAccepted',
  LATEST_VERSION: 'latestVersion',
  IS_FORCE_UPDATE_AVAILABLE: 'isForceUpdateAvailable',
};

export const AUTH_CLIENTS = {
  AZURE: 'azure',
  OKTA: 'okta',
};

export const AUTH_CLIENTS_SCOPES = [
  'openid',
  'email',
  'phone',
  'profile',
  'address',
  'offline_access',
];

export const ACCOUNT_TYPE = {
  CUSTOMER: 1,
  PROSPECT: 0,
  PROSPECT_TYPE_FARM_PRODUCER: 8,
};

export const EDIT_SCREEN_TYPE = {
  CUSTOMER: 'EDIT_CUSTOMER',
  PROSPECT: 'EDIT_PROSPECT',
};

export const CUSTOMER_PROSPECT_TABS = {
  SITES: 1,
  RECENT_VISITS: 0,
};

export const SITES_TABS = {
  RECENT_VISITS: 0,
  PENS: 1,
};

export const SITES_FORM_STEP_COUNT = 3;
export const PENS_FORM_STEP_COUNT = 2;

export const SITE_PAGE_INFO_NAMES = [
  i18n.t('generalCustomerSiteSetup'),
  i18n.t('animalInputSite'),
  i18n.t('dietInputSite'),
];

export const PEN_SETUP_STEP_INFO_NAMES = [i18n.t('animalInputPen')];

export const MOBILE_APP_SITE_ORIGINATION = 'LM_SITE';
export const ENUM_CONSTANTS = {
  HOUSING_SYSTEM: 'housingSystem',
  FEEDING_SYSTEM: 'feedingSystems',
  PEN_SOURCE: 'penSource',
  MILKING_SYSTEM: 'milkingSystem',
  HTTP_METHOD: 'httpMethods',
  VISIT_STATUS: 'visitStatus',
  BCS_POINT_SCALES: 'bcsPointScales',
  LOCOMOTION_SCORE: 'locomotionScore',
  MILK_PICKUP: 'milkPickup',
  MILK_UREA_MEASURE: 'milkUreaMeasure',
  BREED_RETURN_OVER_FEED: 'breedReturnOverFeed',
  FEEDING: 'feeding',
  SUPPLEMENT_TYPES: 'supplementTypes',
  HOME_GROWN_FORAGE_TYPES: 'homeGrownForageTypes',
  HOME_GROWN_GRAIN_TYPES: 'homegrownGrainTypes',
};

export const MILKING_SYSTEM_CONSTANTS = {
  PARLOR: 'Parlor',
};

export const ANIMAL_CLASS_CONSTANTS = {
  _CLASS: '_class',
  _SUBCLASS: '_subClass',
};

export const COUNTRIES_HAVING_STATES = ['US', 'BR', 'CA'];
export const BRAZIL_COUNTRY_CODE = 'BR';

export const COUNTRY_CODE_VALIDATION_REQUIRED_FROM_BRAZIL_COUNTRY =
  '51f500de-5d80-4fd7-ad45-8f20fe456071';
export const COUNTRY_CODE_VALIDATION_REQUIRED_FROM_CANADA_COUNTRY =
  'f2790a9f-1dfe-44bf-8303-1922c86b2d64';
export const COUNTRY_CODE_VALIDATION_REQUIRED_FROM_US_COUNTRY =
  'b0d0f19d-44f6-44a4-b2b1-b4535b48c8c2';

export const TOOL_SELECTION_TABS = {
  ALL: 0,
  FAVOURITE: 1,
  RECENT: 2,
};

export const TOOL_CATEGORIES = {
  CALF_HEIFER: 'CalfandHeifer',
  COMFORT: 'Comfort',
  HEALTH: 'Health',
  NUTRITION: 'Nutrition',
  PRODUCTIVITY: 'Productivity',
};

export const TOOL_TYPES = {
  RUMEN_HEALTH: 'RumenHealth',
  BODY_CONDITION: 'BodyCondition',
  LOCOMOTION_SCORE: 'LocomotionScore',
  TMR_PARTICLE_SCORE: 'TMRParticleScore',
  RUMEN_HEALTH_MANURE_SCORE: 'RumenHealthManureScore',
  CALF_HEIFER_SCORECARD: 'CalfHeiferScorecard',
  CALF_HEIFER_GROWTH_CHARTS: 'CalfHeiferGrowth',
  HEAT_STRESS: 'HeatStress',
  PEN_TIME_BUDGET_TOOL: 'PenTimeBudgetTool',
  MANURE_SCREENER: 'ManureScreener',
  RUMEN_FILL: 'RumenFill',
  URINE_PH_TOOL: 'UrinePHTool',
  METABOLIC_INCIDENCE: 'MetabolicIncidence',
  READY_TO_MILK: 'ReadyToMilk',
  FORAGE_AUDIT_SCORECARD: 'ForageAuditScorecard',
  PILE_AND_BUNKER: 'PileAndBunker',
  REVENUE: 'Revenue',
  MILK_SOLD_EVALUATION: 'MilkSoldEvaluation',
  ROBOTIC_MILK_EVALUATION: 'RoboticMilkEvaluation',
  FORAGE_PENN_STATE: 'ForagePennState',
  PROFITABILITY_ANALYSIS: 'profitabilityAnalysis',
  ROF: 'ReturnOverFeed',
};
export const ANIMAL_ANALYSIS_STR = 'AnimalAnalysis';

export const EXPORT_REPORT_TYPES = {
  BCS_HERD_ANALYSIS_REPORT: 'BCS_HERD_ANALYSIS_REPORT',
  BCS_PEN_ANALYSIS_REPORT: 'BCS_PEN_ANALYSIS_REPORT',
  BCS_ANIMAL_ANALYSIS_REPORT: 'BCS_ANIMAL_ANALYSIS_REPORT',
  CUD_CHEWING_PEN_ANALYSIS_REPORT: 'CUD_CHEWING_PEN_ANALYSIS_REPORT',
  CUD_CHEWING_HERD_ANALYSIS_REPORT: 'CUD_CHEWING_HERD_ANALYSIS_REPORT',
  LOCOMOTION_SCORE_PEN_ANALYSIS_REPORT: 'LOCOMOTION_SCORE_PEN_ANALYSIS_REPORT',
  LOCOMOTION_SCORE_HERD_ANALYSIS_REPORT:
    'LOCOMOTION_SCORE_HERD_ANALYSIS_REPORT',
  LOCOMOTION_SCORE_ANIMAL_ANALYSIS_REPORT:
    'LOCOMOTION_SCORE_ANIMAL_ANALYSIS_REPORT',
  METABOLIC_INCIDENCE_REPORT: 'METABOLIC_INCIDENCE_REPORT',
  RUMEN_HEALTH_MS_PEN_ANALYSIS_REPORT: 'RUMEN_HEALTH_MS_PEN_ANALYSIS_REPORT',
  RUMEN_HEALTH_MS_HERD_ANALYSIS_REPORT: 'RUMEN_HEALTH_MS_HERD_ANALYSIS_REPORT',
  MILK_SOLD_EVALUATION_REPORT: 'MILK_SOLD_EVALUATION_REPORT',
  ROBOTIC_MILK_EVALUATION_REPORT: 'ROBOTIC_MILK_EVALUATION_REPORT',
  FORAGE_PENN_STATE: 'FORAGE_PENN_STATE_HERD_ANALYSIS_REPORT',
  RUMEN_FILL_HEALTH_PEN_ANALYSIS_REPORT:
    'RUMEN_FILL_HEALTH_PEN_ANALYSIS_REPORT',
  RUMEN_FILL_HEALTH_HERD_ANALYSIS_REPORT:
    'RUMEN_FILL_HEALTH_HERD_ANALYSIS_REPORT',
  RUMEN_HEALTH_TMR_PARTICLE_SCORE_PEN_ANALYSIS_REPORT:
    'RUMEN_HEALTH_TMR_PARTICLE_SCORE_PEN_ANALYSIS_REPORT',
  RUMEN_HEALTH_TMR_PARTICLE_SCORE_HERD_ANALYSIS_REPORT:
    'RUMEN_HEALTH_TMR_PARTICLE_SCORE_HERD_ANALYSIS_REPORT',
  MANURE_SCREENER_TOOL: 'RUMEN_HEALTH_MANURE_SCREENING_PEN_ANALYSIS_REPORT',
  PEN_TIME_BUDGET_RESTING: 'PEN_TIME_BUDGET_TIME_AVAILABLE_FOR_RESTING_REPORT',
  PEN_TIME_BUDGET_POTENTIAL: 'PEN_TIME_BUDGET_POTENTIAL_MILK_LOSS_GAIN_REPORT',
  HEAT_STRESS_REPORT: 'HEAT_STRESS_REPORT',
  PROFITABILITY_ANALYSIS_TOTAL_PRODUCTION:
    'PROFITABILITY_ANALYSIS_TOTAL_PRODUCTION',
  RETURN_OVER_FEED: 'RETURN_OVER_FEED',
  CALF_HEIFER_GROWTH_REPORT: 'CALF_HEIFER_GROWTH_REPORT',
};

export const TOOL_ANALYSIS_TYPES = {
  ANIMAL_ANALYSIS: 'animal_analysis',
  HERD_ANALYSIS: 'herd_analysis',
  PEN_ANALYSIS: 'pen_analysis',
};

export const LOCOMOTION_CATEGORY_LIST = [
  {
    category: 1.0,
    lossCow: '',
    herdGoal: 75,
  },
  {
    category: 2.0,
    lossCow: '',
    herdGoal: 15,
  },
  {
    category: 3.0,
    lossCow: 5.1,
    herdGoal: 9,
  },
  {
    category: 4.0,
    lossCow: 16.8,
    herdGoal: 0.5,
  },
  {
    category: 5.0,
    lossCow: 36.0,
    herdGoal: 0.5,
  },
];

export const MANURE_SCORE_CATEGORY_LIST = [
  {
    category: 1.0,
  },
  {
    category: 2.0,
  },
  {
    category: 3.0,
  },
  {
    category: 4.0,
  },
  {
    category: 5.0,
  },
];
export const BCS_STEPS = [
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

export const RESULTS_TABS_TYPES = {
  SUMMARY: 'summary',
  GRAPH: 'graph',
};

export const RESULTS_TABS = [
  {
    id: 'summary',
    key: RESULTS_TABS_TYPES.SUMMARY,
    value: i18n.t('summary'),
  },

  {
    id: 'graph',
    key: RESULTS_TABS_TYPES.GRAPH,
    value: i18n.t('graph'),
  },
];

export const GRAPH_HEADER_TITLE_CONSTANT = {
  CUD_CHEWING_SCORE_ANALYSIS: 'CUD_CHEWING_SCORE_ANALYSIS',
  CUD_CHEWING_CHEWING_PERCENT: 'CUD_CHEWING_CHEWING_PERCENT',
  CUD_CHEWING_CHEWS_PER_CUD: 'CUD_CHEWING_CHEWS_PER_CUD',

  CUD_CHEWING_PEN_ANALYSIS: 'CUD_CHEWING_PEN_ANALYSIS',
  CUD_CHEWING_HERD_ANALYSIS_BAR_RESULT: 'CUD_CHEWING_HERD_ANALYSIS_BAR_RESULT',
  CUD_CHEWING_HERD_ANALYSIS_LINE_RESULT:
    'CUD_CHEWING_HERD_ANALYSIS_LINE_RESULT',
};

export const LACTATION_STAGE = {
  FAR_OFF_DRY: i18n.t('farOffDry'),
  CLOSE_UP_DRY: i18n.t('closeUpDry'),
  FRESH: i18n.t('fresh'),
  EARLY_LACTATION: i18n.t('earlyLactation'),
  PEAK_MILK: i18n.t('peakMilk'),
  MID_LACTATION: i18n.t('midLactation'),
  LATE_LACTATION: i18n.t('lateLactation'),
};

export const LACTATION_STAGE_KEY = {
  FAR_OFF_DRY: 'FarOffDry',
  CLOSE_UP_DRY: 'CloseUpDry',
  FRESH: 'Fresh',
  EARLY_LACTATION: 'EarlyLactation',
  PEAK_MILK: 'PeakMilk',
  MID_LACTATION: 'MidLactation',
  LATE_LACTATION: 'LateLactation',
};

export const TOOL_SELECTION_TAB_LABELS = [
  i18n.t('all'),
  i18n.t('favourite'),
  i18n.t('recent'),
];

export const COUNTER = {
  INCREMENT_ONE: 1,
  DECREMENT_ONE: -1,
};

// temporary phones list for add bottom space in steps
export const IPHONE_LIST = [
  'iPhone SE',
  'iPhone 8',
  'iPhone 8 Plus',
  'iPhone 7',
  'iPhone 7 Plus',
  'iPhone 6',
  'iPhone 6 Plus',
  'iPhone 6s',
  'iPhone 6s Plus',
  'iPhone 6',
  'iPhone 6 Plus',
];
export const PUBLISHED_VISIT_DAYS_LIMIT = 5;

export const VISIT_TABLE_FIELDS = {
  ANIMAL_ANALYSIS: 'animalAnalysis',
  BODY_CONDITION: 'bodyCondition',
  LOCOMOTION_SCORE: 'locomotionScore',
  RUMEN_HEALTH: 'rumenHealth',
  RUMEN_HEALTH_MANURE_SCORE: 'rumenHealthManureScore',
  ROBOTIC_MILK_EVALUATION: 'roboticMilkEvaluation',
  MILK_SOLD_EVALUATION: 'milkSoldEvaluation',
  METABOLIC_INCIDENCE: 'metabolicIncidence',
  FORAGE_PENN_STATE: 'foragePennState',
  TMR_PARTICLE_SCORE: 'tmrParticleScore',
  RUMEN_FILL_MANURE_SCORE: 'rumenFill',
  MANURE_SCREENER_TOOL: 'manureScreener',
  PEN_TIME_BUDGET_TOOL: 'penTimeBudgetTool',
  FORAGE_AUDIT_SCORECARD: 'forageAuditScorecard',
  HEAT_STRESS: 'heatStress',
  PILE_AND_BUNKER: 'pileAndBunker',
  PROFITABILITY_ANALYSIS: 'profitabilityAnalysis',
  CALF_HEIFER_SCORECARD: 'calfHeiferScorecard',
  ROF: 'returnOverFeed',
  CALF_HEIFER_GROWTH_CHARTS: 'calfHeiferGrowth',
};

export const GRAPH_EXPORT_OPTIONS = {
  EXCEL: 1,
  IMAGE: 2,
  EMAIL: 3,
};

export const MEDIA_EXTENSIONS = {
  PNG: '.png',
  XLSX: '.xlsx',
  ZIP: '.zip',
  PDF: '.pdf',
  MPEG: '.mpeg',
};

export const MIME_TYPE = {
  TXT: 'text/plain',
  PNG: 'image/png',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ZIP: 'application/zip',
  PDF: 'application/pdf',
};

export const LEFT_TEXT_ALIGNMENT = 'left';

export const METABOLIC_INCIDENCE_STEPS = [
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

export const METABOLIC_INCIDENCE_FORM_ACCORDIONS = {
  METABOLIC_INCIDENCE_CASES: 1,
  PERFORMANCE_AND_TREATMENT_COSTS: 2,
};

export const TEXT_INPUT_ALIGNMENT = {
  LEFT: 'left',
};

export const METABOLIC_INCIDENCE_CASES = [
  {
    caseType: 'RETAINED_PLACENTA',
    title: i18n.t('retainedPlacenta'),
    dbKey: 'retainedPlacenta',
    label: 'Retained placenta',
  },
  {
    caseType: 'METRITIS',
    title: i18n.t('metritis'),
    dbKey: 'metritis',
    label: 'Metritis',
  },
  {
    caseType: 'DISPLACED_ABOMASUM',
    title: i18n.t('displacedAbomasum'),
    dbKey: 'displacedAbomasum',
    label: 'Displaced abomasum',
  },
  {
    caseType: 'KETOSIS',
    title: i18n.t('ketosis'),
    dbKey: 'ketosis',
    label: 'Ketosis',
  },
  {
    caseType: 'MILK_FEVER',
    title: i18n.t('milkFever'),
    dbKey: 'milkFever',
    label: 'Milk fever',
  },
  {
    caseType: 'DYSTOCIA',
    title: i18n.t('dystocia'),
    dbKey: 'dystocia',
    label: 'Dystocia',
  },
  {
    caseType: 'DEATH_LOSS',
    title: i18n.t('deathLoss'),
    dbKey: 'deathLoss',
    label: 'Death loss',
  },
];

export const TOOL_RESULTS_TABS = {
  SUMMARY: 0,
  GRAPH: 1,
};

export const METABOLIC_INCIDENCE_GRAPH_TYPES = {
  METABOLIC_INCIDENCE_PERCENT: i18n.t('metabolicIncidencePercent'),
  METABOLIC_DISORDER: i18n.t('metabolicDisorderCostPerCow'),
};

export const METABOLIC_INCIDENCE_GRAPHS = [
  {
    id: METABOLIC_INCIDENCE_GRAPH_TYPES.METABOLIC_INCIDENCE_PERCENT,
    name: METABOLIC_INCIDENCE_GRAPH_TYPES.METABOLIC_INCIDENCE_PERCENT,
  },
  {
    id: METABOLIC_INCIDENCE_GRAPH_TYPES.METABOLIC_DISORDER,
    name: METABOLIC_INCIDENCE_GRAPH_TYPES.METABOLIC_DISORDER,
  },
];

export const METABOLIC_DISORDER_GRAPH_COLORS = [
  colors.metabolicDisorderColor1,
  colors.metabolicDisorderColor2,
  colors.metabolicDisorderColor3,
  colors.metabolicDisorderColor4,
  colors.metabolicDisorderColor5,
  colors.metabolicDisorderColor6,
  colors.metabolicDisorderColor7,
];

export const METABOLIC_INCIDENCE_REPORT_TYPES = {
  METABOLIC_INCIDENCE_PERCENT: 'METABOLIC_INCIDENCE_PERCENT',
  METABOLIC_DISORDER_COST_PER_COW: 'METABOLIC_DISORDER_COST_PER_COW',
};

export const MIN_VALUE = -100;
export const MAX_VALUE = 999;

export const INPUT_FIELD_TYPE = {
  DROP_DOWN: 'dropDown',
  INPUT: 'input',
};

export const ROBOT_TYPE = {
  LELY: 'Lely',
  DE_LAVAL: 'DeLaval',
  GEA: 'GEA',
  OTHER: 'Other',
};

export const DONE = 'done';

// Privacy policy
export const PRIVACY_CONSTANTS = {
  ONLINE_PRIVACY: 'Online Privacy Policy | Cargill',
  ONLINE_PRIVACY_URL: 'https://www.cargill.com/privacy',
  EMPLOYMENT_NOTICE: 'Employment Information Notice - Personal Data | Cargill',
  EMPLOYMENT_NOTICE_URL:
    'https://www.cargill.com/page/employment-information-notice',
  BUSINESS_NOTICE: 'Business Information Notice',
  BUSINESS_NOTICE_URL: 'https://www.cargill.com/privacy/business-notice/',
  YOUR_NAME: 'Your Name',
  YOUR_PHOTOS: 'Your Photos and Videos (if shared with Cargill via the App)',
  YOUR_LOCATION: 'Your Location (via GPS or other similar technologies)',
};

export const defaultBcsPointScale = 'HalfPointScale';
export const defaultUnitOfMeasure = 'Imperial';
export const defaultBrandPlaceholder = 'Cargill';
export const defaultMilkUreaMeasure = 'MUN';
export const defaultMilkPickup = 'Daily';
export const defaultCalfHeiferGrowthScale = 'BodyWeight';

export const GRAPH_HEADER_OPTIONS = {
  SHARE: 1,
  DOWNLOAD: 2,
};

export const MUN_CONSTANT = 'MUN';
export const MILK_UREA_CONSTANT = 'MilkUrea';
export const MilkSoldEvaluationDefaultOutputsValue = 0;

export const NEXT_FIELD_TEXT = {
  NEXT: 'next',
  DONE: 'done',
};

export const FORAGE_INVENTORIES_TABS = {
  CAPACITY: 1,
  FEED_OUT: 2,
};

export const UNIT_OF_MEASURE = {
  IMPERIAL: 'Imperial',
  METRIC: 'Metric',
};

export const PILE_SLOPE_GOAL_VALUE = 3.5;
export const BUNKER_SLOPE_GOAL_VALUE = 3.5;

export const FORAGE_INVENTORIES_INVENTORY = [
  {
    id: 0,
    name: i18n.t('pile'),
  },
  {
    id: 1,
    name: i18n.t('bunker'),
  },
  {
    id: 2,
    name: i18n.t('topUnloadingSilo'),
  },
  {
    id: 3,
    name: i18n.t('bottomUnloadingSilo'),
  },
  {
    id: 4,
    name: i18n.t('bag'),
  },
];
export const FORAGE_PEN_STATE_STEPS = [
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

export const PEN_TIME_BUDGET_STEPS = [
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

export const SCORER_ENUMS = {
  NONE_SELECTED: 'NoneSelected',
  THREE_SCREEN: 'ThreeScreen',
  FOUR_SCREEN_NEW: 'FourScreenNew',
  FOUR_SCREEN_OLD: 'FourScreenOld',
};

export const PLATFORM_DEVICE_TYPE = {
  ios: 'IOS',
  android: 'ANDROID',
  web: 'WEB',
};

export const NOTEBOOK_TOOLBAR = {
  SHARE: 'share-notebook',
  MEDIA: 'media-notebook',
  ATTACHMENT: 'attachment-notebook',
  SIGNATURE: 'signature-notebook',
  AUDIO: 'audio-notebook',
};

export const NOTE_TYPE = {
  NEW: 'new',
  UPDATE: 'update',
};

export const NOTEBOOK_TYPE = {
  GENERAL: {
    type: 0,
    name: i18n.t('general'),
  },
  ACTION: {
    type: 1,
    name: i18n.t('action'),
  },
};

export const NOTEBOOK_ACTION_CATEGORY = 'Action';
export const NOTEBOOK_GENERAL_CATEGORY = 'General';

export const NOTEBOOK_NOTE = 'Note';
export const NOTEBOOK_GENERAL_COMMENT = 'Comment';

export const NOTEBOOK_TYPE_ENUMS_CATEGORY = {
  GENERAL: {
    type: 0,
    name: i18n.t('general'),
    noteBookType: NOTEBOOK_GENERAL_CATEGORY,
  },
  ACTION: {
    type: 1,
    name: i18n.t('action'),
    noteBookType: NOTEBOOK_ACTION_CATEGORY,
  },
};

export const NOTE_COMMENT_ENUMS_CATEGORY = {
  NOTE: {
    type: 0,
    name: i18n.t('notes'),
    noteBookType: NOTEBOOK_NOTE,
  },
  COMMENT: {
    type: 1,
    name: i18n.t('comments'),
    noteBookType: NOTEBOOK_GENERAL_COMMENT,
  },
};

export const NOTIFICATION_TYPE = {
  TWENTY_FOUR_HOURS_BEFORE_ACTION_IS_DUE: 'TwentyFourHoursBeforeActionIsDue',
  ONE_HOUR_BEFORE_ACTION_IS_DUE: 'OneHourBeforeActionIsDue',
  TWENTY_FOUR_HOURS_AND_NO_SYNC: 'TwentyFourHoursAndNoSync',
  VISIT_AUTO_PUBLISHED: 'VisitAutoPublished',

  // new notification type to show on dashboard
  RELEASES_NOTES: 'ReleaseNotes',
  SPECIAL_ACTIONS: 'SpecialAction',
  MARKETING_CAMPAIGN: 'MarketingCampaign',
};

export const ONE_HOUR = 1;
export const TWENTY_FOUR_HOURS = 24;
export const TODAY = 'Today';
export const TOMORROW = 'Tomorrow';
export const OLDER = 'Older';
export const AUTH_SERVER_KEY = 'AUTH_SERVER_KEY';

export const SHARE_POINT_SUMMARY_REPORT_NAME = 'Site Sharepoint Summary Report';
export const SHARE_POINT_DETAIL_REPORT_NAME = 'Site Sharepoint Detailed Report';

export const NOT_APPLICABLE = i18n.t('NA');
export const ALL = 'all';
export const HEAT_STRESS_STEPS = [
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
export const SHARE = 'share';
export const DOWNLOAD = 'download';

export const PEN_HERD_ANALYSIS_STEPS = [
  {
    id: 0x001,
    step: 1,
    name: i18n.t('analysisSection'),
  },
  {
    id: 0x002,
    step: 0,
    name: i18n.t('backToolListing'),
  },
];

export const PEN_ANALYSIS_STEPS = [
  {
    id: 0x001,
    step: 1,
    name: i18n.t('backPenAnalysis'),
  },
  {
    id: 0x002,
    step: 0,
    name: i18n.t('backToolListing'),
  },
];

export const TOOL_ANIMAL_ANALYSIS = 'toolAnimalAnalysis';
export const REFRESH_TOKEN_ALERT_BUTTONS = [
  {
    text: i18n.t('ok'),
    onPress: () => {
      navigationService.resetRoute(ROUTE_CONSTANTS.LOGIN);
    },
  },
];

export const MANURE_SCREENER_TOOL_ID = 'ManureScreenerTool';
export const RUMEN_FILL_TOOL_ID = 'RumenFillManureScore';
export const PROFITABILITY_ANALYSIS_TOOL_ID = 'ProfitabilityAnalysis';

export const NEW_LINE = '\r\n';
export const HEADING_DECORATION = ' - - - - - - - ';

export const DIETS_STATUS_ALLOWED = {
  ANALYZED: 'ANALYZED',
  UNSAFE: 'UNSAFE',
  FEASIBLE: 'FEASIBLE',
};

export const LOG_FOLDER_PATH = 'ExportLogs';
export const DEV_LOG_FILE_NAME = 'dev-logs';

export const ANIMALS = 'animals';

export const CURRENCY = {
  NOT_SET: 'NotSet',
  DEFAULT: 'USD',
  SAR: 'SAR',
};

export const ENTITY_TYPE = {
  CUSTOMER: 'CUSTOMER',
  PROSPECT: 'PROSPECT',
  SITE: 'SITE',
  VISIT: 'VISIT',
};

export const SYSTEM_GENERATED_DIET_SOURCE = 'SYSTEM_GENERATED';
export const MAX_DIET_SOURCE = 'MAX';
export const PEN_SOURCE_DDW = 'DDW';
export const PEN_SOURCES = { ddw: 'DDW', userCreated: 'UserCreated' };

export const VISIT_REPORT_TOAST_DURATION = 3000;

export const USER_CREATED_PEN = 'UserCreated';

export const NAME_KEY_FOR_FILTERING = 'name';

// Translation Constants
export const YOUR_VISIT = 'YourVisit';
export const HAS_PUBLISHED = 'HasBeenAutoPublished';
export const YOUR_ACTION = 'YourAction';
export const DUE_BY_TODAY = 'DueByToday';
export const DUE_BY_TOMORROW = 'DueByTomorrow';
export const CLICK_TO_SEE_DETAILS = 'ClickToSeeDetails';

export const COMMA_VALUES_BY_NUMBER_PATTERN = 'number';

export const INVALID_EMAIL_SUFFIX = '.invalid';
export const TECHNICAL_SPECIALIST_EMAIL_SUFFIX = '.TechnicalSpecialist';

export const ALPHABET_LIST = [
  '#',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export const SILAGE_TYPE_CORN = 'Corn';
export const MAX_API_CALL_RETRIES = 2;

export const HIT_SLOP = {
  top: 15,
  left: 15,
  right: 15,
  bottom: 15,
};

export const MEDIA_TYPES = {
  IMAGES: 'images',
  VIDEOS: 'videos',
  AUDIOS: 'audios',
  VOICE_NOTES: 'VoiceNotes',
};

export const NOTES_MAX_COUNT_VISIT_REPORT = 5;

export const SCORECARD_RESULTS_TYPES = {
  SCORECARD_RESPONSES: 'responses',
  SCORECARD_SCORE: 'score',
};

export const SCORECARD_RESULTS_HEADER_TABS = [
  {
    key: SCORECARD_RESULTS_TYPES.SCORECARD_SCORE,
    value: i18n.t('score'),
  },
  {
    key: SCORECARD_RESULTS_TYPES.SCORECARD_RESPONSES,
    value: i18n.t('responses'),
  },
];

export const SCORECARD_PROGRESS_ANIMATION_CONSTANTS = {
  STROKE: 'stroke',
  CIRCLE_RADIUS: 45,
  CIRCLE_ANIMATION_DURATION: 3000,
  CIRCLE_CIRCUMFERENCE: 45 * Math.PI * 2,
  CIRCLE_COLOR_INTERPOLATION_RANGE: [75, 90, 100],
  TEXT_TRANSITION_DURATION: 1000,
};

export const VISIT_NAME_REGEX = /^[^/\\]+$/;

export const COUNTRY_IDs = {
  INDIA: 'india',
  ITALY: 'italy',
  CANADA: 'canada',
  FRANCE: 'france',
  RUSSIA: 'russia',
  ITALY: 'italy',
  SOUTH_AFRICA: 'south africa',
};

export const BRAND_TYPE = {
  CARGILL: 'cargill',
  PROVIMI: 'provimi',
  PURINA: 'purina',
  RAGIODISOLE: 'ragiodisole',
  AGRIDEA: 'agridea',
};

export const MEDIA_DIRECTORIES_PATH = {
  NOTEBOOK_DIRECTORY: '/notes/',
  NOTIFICATION_DIRECTORY: '/notifications/',
};

export const ROF_ROUND_BALES_ENUM_KEY = 'RoundBales';
