//theme
import colors from '../constants/theme/variables/customColor';

/** Start Heat Stress */
export const STRESS_THRESHOLD_COLOR = {
  STRESS_THRESHOLD_GREEN: 'STRESS_THRESHOLD_GREEN',
  STRESS_THRESHOLD_YELLOW: 'STRESS_THRESHOLD_YELLOW',
  STRESS_THRESHOLD_ORANGE: 'STRESS_THRESHOLD_ORANGE',
  STRESS_THRESHOLD_RED: 'STRESS_THRESHOLD_RED',
};

/** End Heat Stress */

/** Start Forage Audit */
export const progressBarColors = [
  colors.progressRed,
  colors.leadingTitleColor,
  colors.progressGreen,
];

export const MAX_LIMIT_FORAGE_AUDI_QUESTIONS = 12;
/** End  Forage Audit */

/**
 * start calf heifer scorecard
 */
export const MAX_LIMIT_CALF_HEIFER_SCORECARD_QUESTIONS = 12;

export const SITE_INPUTS = {
  ALL: 'all',
  CURRENT_MILK_PRICE: 'current_milk_price',
  MILKING_SYSTEM: 'milking_system',
  TOTAL_STALLS: 'total_stalls',
  PEN_COUNT: 'penCount',
  LACTATING_ANIMALS: 'lactating_animals',
  DAYS_IN_MILK: 'animalInputs',
  MILK_YIELD: 'milk_yield',
  MILK_FAT: 'milk_fat',
  MILK_PROTEIN: 'milk_protein',
  MILK_OTHER_SOLIDS: 'milk_other_solids',
  SOMATIC_CELL_COUNT: 'somatic_cell_count',
  BACTERIA_CELL_COUNT: 'bacteria_cell_count',
  DRY_MATTER_INTAKE: 'dry_matter_intake',
  AS_FED_INTAKE: 'as_fed_intake',
  NEL_DAIRY: 'NEL_dairy',
  RATION_COST: 'ration_cost',
};
