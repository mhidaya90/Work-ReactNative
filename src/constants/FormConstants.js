export const INPUT_TYPE = {
  PASSWORD: 'password',
  TEXT: 'text',
  DECIMAL: 'decimal',
  NUMERIC: 'numeric',
};

export const KEYBOARD_TYPE = {
  DEFAULT: 'default',
  NUMBER: 'numeric',
  NUMBERS_AND_PUNCTUATION: 'numbers-and-punctuation',
  NUMBER_PAD: 'number-pad',
  DECIMAL: 'decimal-pad',
  PHONE: 'phone-pad',
};

export const BUTTON_TYPE = {
  PRIMARY: 'Primary',
  SECONDARY: 'Secondary',
};

export const TOAST_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  NOTEBOOK_LIMIT: 'notebookLimit'
};

export const BOTTOM_SHEET_TYPE = {
  SIMPLE: 'Simple',
  SINGLE_SELECT_DROPDOWN: 'SingleSelectDropDown',
  IMAGE_LIST_ITEM: 'ImageListItem',
  CUSTOMER_PROSPECT: 'CustomerProspect',
  EAR_TAG: 'EarTag',
  CATEGORY_TOOLS: 'CategoryTools',
  SIMPLE_LIST: 'SimpleList',
  MULTI_SELECT_LIST: 'MultiSelectList',
  HERD_ANALYSIS_GOALS: 'HerdAnalysisGoals',
  HERD_ANALYSIS_REVENUE: 'HerdAnalysisRevenue',
};

export const PROSPECT_CUSTOMER_TAG = {
  PROSPECT: 'Prospect',
  CUSTOMER: 'Customer',
};

export const LOGIN_FIELDS = {
  EMAIL: 'email',
  PASSWORD: 'password',
};

export const PROSPECT_FIELDS = {
  BUSINESS_NAME: 'business_name',
  CUSTOMER_CODE: 'customer_code',
  TYPE: 'type',
  COUNTRY: 'country',
  COUNTRY_NAME: 'country_name',
  COUNTRY_CODE: 'country_code',
  BUSSINESS_ADDRESS: 'bussiness_address',
  SEGMENT: 'segment',
  SEGMENT_ID: 'segment_id',
  ADDRESS: 'address',
  CITY: 'city',
  STATE: 'state',
  STATE_ID: 'state_id',
  POSTAL: 'postal',
  PRIMARY_CONTACT_FULL_NAME: 'primary_contact_full_name',
  PRIMARY_CONTACT_FIRST_NAME: 'primary_contact_first_name',
  PRIMARY_CONTACT_LAST_NAME: 'primary_contact_last_name',
  PRIMARY_CONTACT_EMAIL: 'primary_contact_email',
  PRIMARY_CONTACT_PHONE: 'primary_contact_phone',
  STATE_PROVINCE_REGION: 'state_province_region',
  PRIMARY_CONTACT_ID: 'primary_contact_id',
};

export const SITE_FIELDS = {
  SITE_NAME: 'site_name',
  CURRENT_MILK_PRICE: 'current_milk_price',
  MILKING_SYSTEM: 'milking_system',
  TOTAL_STALLS: 'total_stalls',
  LACTATING_ANIMALS: 'lactating_animals',
  DAYS_IN_MILK: 'days_in_milk',
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

export const PEN_FIELDS = {
  PEN_NAME: 'pen_name',
  DIET: 'diet',
  ANIMAL_CLASS: 'animal_class',
  BARN_NAME: 'barn_name',
  HOUSING_SYSTEM: 'housing_system',
  NUMBER_OF_STALLS: 'number_of_stalls',
  FEEDING_SYSTEM: 'feeding_system',
  MILKING_FREQUNCY: 'milking_frequncy',

  ANIMLA_PER_PEN: 'animal_per_pen',
  DAYS_IN_MILK: 'days_in_milk',
  MILK_YIELD: 'milk_yield',

  DRY_MATTER_INTAKE: 'dry_matter_intake',
  AS_FED_INTAKE: 'as_fed_intake',
  NEL_DAIRY: 'NEL_dairy',
  RATION_COST: 'ration_cost',

  OPTIMIZATION_TYPE: 'optimizationType',
  DIET_SOURCE: 'dietSource',
};

export const VISIT_FIELDS = {
  CUSTOMER_PROSPECT: 'customer_prospect',
  SITE: 'site',
  VISIT_NAME: 'visit_name',
};

export const ANIMAL_FIELDS = {
  EAR_TAG: 'ear_tag',
  SELECTED_TOOL: 'selected_tool',
  BCS: 'bcs',
  LOCOMOTION_SCORE: 'locomotion_score',
  DAYS_IN_MILK: 'days_in_milk',
};

export const RUMEN_HEALTH_CUD_CHEWING_FIELDS = {
  VISIT_ID: 'visitId',
  PENS: 'pens',
  PEN_ID: 'penId',
  PEN_NAME: 'penName',
  DAYS_IN_MILK: 'daysInMilk',
  CUD_CHEWS_COUNT: 'cudChewsCount',
  COW_NUMBER: 'cowNumber',
  CHEWS_COUNT: 'chewsCount',
  CUD_CHEWING_COWS_COUNT: 'cudChewingCowsCount',
  COUNT_YES: 'countYes',
  COUNT_NO: 'countNo',
  TOTAL_COUNT: 'totalCount',
  YES_PERCENT: 'yesPercent',
  NO_PERCENT: 'noPercent',
  GOALS: 'goals',
  STAGE: 'stage',
  PERCENT_CHEWING: 'percentChewing',
  CUD_CHEWS: 'cudChews',
  RANGE_STRING: 'rangeString',
};

export const ROBOTIC_MILK_EVALUATION = {
  VISIT_ID: 'visitId',
  VISIT_ROBOTIC_MILK_EVALUATION_DATA: 'visitRoboticMilkEvaluationData',
  ROBOT_TYPE: 'robotType',
  COW_FLOW_DESIGN: 'cowFlowDesign',
  ROBOTS_IN_HERD: 'robotsInHerd',
  LACTATING_COWS: 'lactatingCows',
  AVERAGE_MILK_YIELD: 'averageMilkYield',
  MILKINGS: 'milkings',
  ROBOT_FREE_TIME: 'robotFreeTime',
  MILKING_REFUSALS: 'milkingRefusals',
  TOTAL_MILKING_FAILURES: 'totalMilkingFailures',
  MAXIMUM_CONCENTRATE: 'maximumConcentrate',
  AVERAGE_CONCENTRATED_FED: 'averageConcentrateFed',
  MINIMUM_CONCENTRATE: 'minimumConcentrate',
  AVERAGE_BOX_TIME: 'averageBoxTime',
  MILKING_SPEED: 'milkingSpeed',
  CONCENTRATE_PER_100_KG_MILK: 'concentratePer100KGMilk',
  REST_FEED: 'restFeed',
  OUTPUTS: 'outputs',
  COWS_PER_ROBOT: 'cowsPerRobot',
  MILKINGS_PER_ROBOT: 'milkingsPerRobot',
  MILK_PER_ROBOT: 'milkPerRobot',
  MILKING_FAILURES: 'milkingFailures',
  AVERAGE_CONCENTRATE: 'averageConcentrate',
  SELECTED_VISITS: 'selectedVisits',
};

export const RUMEN_HEALTH_TMR_PARTICLE_SCORE = {
  VISIT_ID: 'visitId',
  PEN_ID: 'penId',
  PEN_NAME: 'penName',
  IS_TOOL_ITEM_NEW: 'isToolItemNew',
  TMR_SCORES: 'tmrScores',
  TOP_SCALE_AMOUNT_IN_GRAMS: 'topScaleAmountInGrams',
  TOP_GOAL_MINIMUM_PERCENT: 'topGoalMinimumPercent',
  TOP_GOAL_MAXIMUM_PERCENT: 'topGoalMaximumPercent',
  TOP_SCREEN_TARE_AMOUNT_IN_GRAMS: 'topScreenTareAmountInGrams',
  MID_1_SCALE_AMOUNT_IN_GRAMS: 'mid1ScaleAmountInGrams',
  MID_1_GOAL_MINIMUM_PERCENT: 'mid1GoalMinimumPercent',
  MID_1_GOAL_MAXIMUM_PERCENT: 'mid1GoalMaximumPercent',
  MID_1_SCREEN_TARE_AMOUNT_IN_GRAMS: 'mid1ScreenTareAmountInGrams',
  MID_2_SCALE_AMOUNT_IN_GRAMS: 'mid2ScaleAmountInGrams',
  MID_2_GOAL_MINIMUM_PERCENT: 'mid2GoalMinimumPercent',
  MID_2_GOAL_MAXIMUM_PERCENT: 'mid2GoalMaximumPercent',
  MID_2_SCREEN_TARE_AMOUNT_IN_GRAMS: 'mid2ScreenTareAmountInGrams',
  TRAY_SCALE_AMOUNT_IN_GRAMS: 'trayScaleAmountInGrams',
  TRAY_GOAL_MINIMUM_PERCENT: 'trayGoalMinimumPercent',
  TRAY_GOAL_MAXIMUM_PERCENT: 'trayGoalMaximumPercent',
  TRAY_SCREEN_TARE_AMOUNT_IN_GRAMS: 'trayScreenTareAmountInGrams',
  TOOL_STATUS: 'toolStatus',
  DAYS_IN_MILK: 'daysInMilk',
  IS_FIRST_TIME_WITH_SCORE: 'isFirstTimeWithScore',
  TMR_SCORE_NAME: 'tmrScoreName',
  TMR_SCORE_ID: 'tmrScoreId',
  CREATE_TIME_UTC: 'createTimeUtc',
  LAST_MODIFIED_TIME_UTC: 'lastModifiedTimeUtc',
  VISITS_SELECTED: 'visitsSelected',
  SELECTED_SCORER: 'selectedScorer',
  TOP: 'top',
  MID1: 'mid1',
  MID2: 'mid2',
  TRAY: 'tray',
};

export const FORAGE_AUDIT_SCORECARD = {
  VISIT_ID: 'visitId',
  SECTIONS: 'sections',
  SECTION_NAME: 'sectionName',
  SCORECARD_SILAGES: 'scorecardSilages',
  SILAGE_TYPE_NAME: 'silageTypeName',
  QUESTIONS: 'questions',
  SELECTED_ANSWER: 'selectedAnswer',
  INDEX: 'index',
  QUESTION_TEXT: 'questionText',
  AVAILABLE_ANSWERS: 'availableAnswers',
  ANSWER_TEXT: 'answerText',
  SECTION_INDEX: 'sectionIndex',
  SECTION_SILAGE_TYPE: 'sectionSilageType',
  POINT_VALUE: 'pointValue',
};

export const CALF_HEIFER_SCORECARD = {
  VISIT_ID: 'visitId',
  SECTIONS: 'sections',
  SECTION_NAME: 'sectionName',
  QUESTIONS: 'questions',
  SELECTED_ANSWER: 'selectedAnswer',
  INDEX: 'index',
  QUESTION_TEXT: 'questionText',
  AVAILABLE_ANSWERS: 'availableAnswers',
  ANSWER_TEXT: 'answerText',
  POINT_VALUE: 'pointValue',
  IS_QUESTION_REQUIRED: 'isQuestionRequired',
  GLOBALIZE: 'globalize',
  IS_ITEM_OF_CONCERN: 'isItemOfConcern',
  SELECTED: 'selected',
  INCLUDE_IN_OVERALL_SCORECARD_SCORE: 'includeInOverallScorecardScore',
};

export const INITIAL_COW_CUD_CHEWS = [
  {
    cowNumber: 1,
    chewsCount: 0,
  },
];

export const VISIT_TYPES = {
  PUBLISHED: 'Published',
  IN_PROGRESS: 'InProgress',
};

export const BCS_HERD_ANALYSIS_FIELDS = {
  DIM: 'DIM',
  MILK: 'MILK',
};

export const METABOLIC_INCIDENCE_FIELDS = {
  TOTAL_FRESH_COWS_PER_YEAR: 'totalFreshCowsPerYear',
  MILK_PRICE: 'milkPrice',
  REPLACEMENT_COW_COST: 'replacementCowCost',
  COST_OF_EXTRA_DAYS_OPEN: 'costOfExtraDaysOpen',
  // Metabolic Incidence Cases
  TOTAL_FRESH_COWS_EVALUATION: 'totalFreshCowsEvaluation',
  RETAINED_PLACENTA: 'retainedPlacenta',
  METRITIS: 'metritis',
  DISPLACED_ABOMASUM: 'displacedAbomasum',
  KETOSIS: 'ketosis',
  MILK_FEVER: 'milkFever',
  DYSTOCIA: 'dystocia',
  DEATH_LOSS: 'deathLoss',
  // Performance & Treatment Costs
  RETAINED_PLACENTA_MILK_PER_COW: 'retainedPlacentaMilkPerCow',
  RETAINED_PLACENTA_DAYS_OPEN: 'retainedPlacentaDaysOpen',
  RETAINED_PLACENTA_TREATMENT_DEFAULT: 'retainedPlacentaTreatmentDefault',
  METRITIS_MILK_PER_COW: 'metritisMilkPerCow',
  METRITIS_DAYS_OPEN: 'metritisDaysOpen',
  METRITIS_TREATMENT_DEFAULT: 'metritisTreatmentDefault',
  DISPLACED_ABOMASUM_MILK_PER_COW: 'displacedAbomasumMilkPerCow',
  DISPLACED_ABOMASUM_DAYS_OPEN: 'displacedAbomasumDaysOpen',
  DISPLACED_ABOMASUM_TREATMENT_DEFAULT: 'displacedAbomasumTreatmentDefault',
  KETOSIS_MILK_PER_COW: 'ketosisMilkPerCow',
  KETOSIS_DAYS_OPEN: 'ketosisDaysOpen',
  KETOSIS_TREATMENT_DEFAULT: 'ketosisTreatmentDefault',
  MILK_FEVER_MILK_PER_COW: 'milkFeverMilkPerCow',
  MILK_FEVER_DAYS_OPEN: 'milkFeverDaysOpen',
  MILK_FEVER_TREATMENT_DEFAULT: 'milkFeverTreatmentDefault',
  DYSTOCIA_MILK_PER_COW: 'dystociaMilkPerCow',
  DYSTOCIA_DAYS_OPEN: 'dystociaDaysOpen',
  DYSTOCIA_TREATMENT_DEFAULT: 'dystociaTreatmentDefault',
  DEATH_LOSS_MILK_PER_COW: 'deathLossMilkPerCow',
  DEATH_LOSS_DAYS_OPEN: 'deathLossDaysOpen',
  DEATH_LOSS_TREATMENT_DEFAULT: 'deathLossTreatmentDefault',
};

export const MILK_SOLID_EVALUATION_FIELDS = {
  CURRENT_MILK_PRICE: 'currentMilkPrice',
  MILK_PICK_UP: 'milkPickup',
  MILK_UREA_MEASURE: 'milkUreaMeasure',
  LACTATING_ANIMALS: 'lactatingAnimal',
  DAYS_IN_MILK: 'daysInMilk',
  AS_FED_INTAKE: 'asFedIntake',
  NEL_DAIRY: 'netEnergyOfLactationDairy',
  RATION_COST: 'rationCost',
  DRY_MATTER_INTAKE: 'dryMatterIntake',
  ANIMALS_IN_TANK: 'animalsInTank',

  PICK_UP: 'pickups',
  OUT_PUT: 'outputs',
};

export const HEAT_STRESS_FIELDS = {
  LACTATING_ANIMALS: 'lactatingAnimal',
  MILK_YIELD: 'milk',
  MILK_FAT: 'milkFatPercent',
  MILK_PROTEIN: 'milkProteinPercent',
  CURRENT_MILK_PRICE: 'currentMilkPrice',
  MILK_PRODUCTION: 'milk_production',
  NEL_DAIRY: 'netEnergyOfLactationDairy',
  DRY_MATTER_INTAKE: 'dryMatterIntake',
  TEMPERATURE: 'temperatureInCelsius',
  HUMIDITY: 'humidityPercent',
  HOURS_OF_SUN: 'hoursExposedToSun',
};

export const PICKUP_FIELDS = {
  MILK_SOLID: 'milkSold',
  ANIMALS_IN_TANK: 'animalsInTank',
  DAYS_IN_TANK: 'daysInTank',
  MILK_YIELD: 'milk_yield',
  MILK_FAT: 'milkFatPer',
  MILK_PROTEIN: 'milkProteinPer',
  NON_FAT_SOLID: 'nonFatSolid',
  MUN_Milk_Urea: 'mun',
  SOMATIC_CELL_COUNT: 'somaticCellCount',
  BACTERIA_CELL_COUNT: 'bacteriaCellCount',
  MASTITIS: 'mastitis',
};

export const FORAGE_INVENTORIES_TOP_UNLOADING_SILO_FIELDS = {
  SILO_NAME: 'siloName',
  //Capacity Tab
  FILLED_HEIGHT: 'filledHeight',
  HEIGHT_OF_SILAGE_LEFT: 'heightOfSilageLeftInSilo',
  DIAMETER: 'diameter',
  DRY_MATTER: 'dryMatter',
  SILAGE_DM_DENSITY: 'silageDMDensity',
  TONS_DM: 'tonsDM',
  TONS_AF: 'tonsAF',

  //FeedOut Tab
  FEEDING_RATE: 'feedingRate',
  COWS_TO_BE_FED: 'cowsToBeFed',
  LBS_KG_DM_IN_FOOT: 'lbsKgDmInFoot',
  FEED_OUT_SURFACE_AREA: 'feedOutSurfaceArea',
  INCHES_CM_PER_DAY: 'inchesCmPerDay',
  TONS_PER_DAY: 'tonsPerDay',
  AT_3_INCHES_DAY: 'at3InchesDay',
  AT_7_INCHES_DAY: 'at7InchesDay',
  AT_6_INCHES_DAY: 'at6InchesDay',
  AT_15_INCHES_DAY: 'at15InchesDay',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
};
export const FORAGE_INVENTORIES_BOTTOM_UNLOADING_SILO_FIELDS = {
  SILO_NAME: 'siloName',
  HEIGHT_OF_SILAGE_LEFT: 'heightOfSilageLeftInSilo',
  DIAMETER: 'diameter',
  DRY_MATTER: 'dryMatter',
  SILAGE_DM_DENSITY: 'silageDMDensity',
  TONS_DM: 'tonsDM',
  TONS_AF: 'tonsAF',

  //FeedOut Tab
  FEEDING_RATE: 'feedingRate',
  COWS_TO_BE_FED: 'cowsToBeFed',
  LBS_KG_DM_IN_FOOT: 'lbsKgDmInFoot',
  FEED_OUT_SURFACE_AREA: 'feedOutSurfaceArea',
  INCHES_CM_PER_DAY: 'inchesCmPerDay',
  TONS_PER_DAY: 'tonsPerDay',
  AT_3_INCHES_DAY: 'at3InchesDay',
  AT_7_INCHES_DAY: 'at7InchesDay',
  AT_6_INCHES_DAY: 'at6InchesDay',
  AT_15_INCHES_DAY: 'at15InchesDay',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
};

export const FORAGE_INVENTORIES_PILE_FIELDS = {
  PILE_NAME: 'pileName',
  // Capacity
  HEIGHT: 'height',
  TOP_WIDTH: 'topWidth',
  BOTTOM_WIDTH: 'bottomWidth',
  BOTTOM_LENGTH: 'bottomLength',
  DRY_MATTER: 'dryMatter',
  SILAGE_DM_DENSITY: 'silageDMDensity',
  // Feedout
  FEEDING_RATE: 'feedingRate',
  COWS_TO_BE_FED: 'cowsToBeFed',
  START_DATE: 'startDate',
};

export const FORAGE_INVENTORIES_BUNKER_FIELDS = {
  BUNKER_NAME: 'bunkerName',
  // Capacity
  HEIGHT: 'height',
  TOP_WIDTH: 'topWidth',
  BOTTOM_WIDTH: 'bottomWidth',
  BOTTOM_LENGTH: 'bottomLength',
  DRY_MATTER: 'dryMatter',
  SILAGE_DM_DENSITY: 'silageDMDensity',
  // Feedout
  FEEDING_RATE: 'feedingRate',
  COWS_TO_BE_FED: 'cowsToBeFed',
  START_DATE: 'startDate',
};

export const FORAGE_INVENTORIES_BAG_FIELDS = {
  BAG_NAME: 'bagName',
  // Capacity
  LENGTH: 'length',
  DIAMETER: 'diameter',
  DRY_MATTER: 'dryMatter',
  DM_DENSITY: 'DMDensity',
  // Feedout
  FEEDING_RATE: 'feedingRate',
  COWS_TO_BE_FED: 'cowsToBeFed',
  START_DATE: 'startDate',
};
export const FORAGE_PENN_STATE = 'foragePennState';
export const FORAGE_PENN_STATE_FIELDS = {
  SILAGE: 'silage',
  TOP: 'top',
  MID1: 'mid1',
  MID2: 'mid2',
  TRAY: 'tray',
  SCORER: 'scorer',
  SILAGE_NAME: 'silageName',
  SILAGE_ID: 'silageId',
};

export const MANURE_SCREENER_TOOL = 'manureScreener';

export const MUNARE_SCREENING_FIELDS = {
  VISIT_ID: 'visitId',
  PEN_ID: 'penId',
  PEN_NAME: 'penName',
  SCORER: 'scorer',
  MST_GOAL: 'mstGoal',
  MST_SCORES: 'mstScores',
  MST_SCORE_ID: 'mstScoreId',
  MST_SCORE_NAME: 'mstScoreName',
  IS_TOOL_ITEM_NEW: 'isToolItemNew',
  TOP_SCALE_AMOUNT_IN_GRAMS: 'topScaleAmountInGrams',
  TOP_GOAL_MINIMUM_PERCENT: 'topGoalMinimumPercent',
  TOP_GOAL_MAXIMUM_PERCENT: 'topGoalMaximumPercent',
  MID_SCALE_AMOUNT_IN_GRAMS: 'midScaleAmountInGrams',
  MID_GOAL_MINIMUM_PERCENT: 'midGoalMinimumPercent',
  MID_GOAL_MAXIMUM_PERCENT: 'midGoalMaximumPercent',
  BOTTOM_SCALE_AMOUNT_IN_GRAMS: 'bottomScaleAmountInGrams',
  BOTTOM_GOAL_MINIMUM_PERCENT: 'bottomGoalMinimumPercent',
  BOTTOM_GOAL_MAXIMUM_PERCENT: 'bottomGoalMaximumPercent',
  OBSERVATION: 'observation',
  TOOL_STATUS: 'toolStatus',
  MANURE_SCREENER_NAME: 'manureScreenerName',
  MANURE_SCREENER_ID: 'manureScreenerId',
  CREATE_TIME_UTC: 'createTimeUtc',
  LAST_MODIFIED_TIME_UTC: 'lastModifiedTimeUtc',
  VISITS_SELECTED: 'visitsSelected',
  SELECTED_SCREENER: 'selectedScreener',
  IS_FIRST_TIME_WITH_SCORE: 'isFirstTimeWithScore',
  DEFAULT_MANURE_NAME: 'Manure Screener',
};

export const PEN_TIME_BUDGET_KEYS = {
  ANIMALS_IN_PENS: 'animals',
  NO_OF_STALLS: 'stallsInPen',
  WALKING_TIME_TO_PARLOR: 'walkingTimeToParlor',
  TIME_IN_PARLOR: 'timeInParlor',
  WALKING_TIME_FROM_PARLOR: 'walkingTimeFromParlor',
  MILKING_FREQUENCY: 'milkingFrequency',
  TOTAL_STALLS_IN_PARLOR: 'stallsInParlor',
  TIME_IN_LOCK_UP: 'timeInLockUp',
  OTHER_NON_REST_TIME: 'otherNonRestTime',
  RESTING_REQUIREMENT: 'restingRequirement',
  EATING_TIME: 'eatingTime',
  DRINKING_GROOMING_TIME: 'drinkingGroomingTime',
  SELECTED_PEN_ID: 'selectedPenId',
};

export const DIETS_FIELDS = {
  ANALYZE_OPTIMIZATION: 'analyzeOptimization',
  FORMULATE_OPTIMIZATION: 'formulateOptimization',
  STATUS: 'status',
  OPTIMIZATION_TYPE: 'optimizationType',
};

export const CONTENT_TYPE = {
  NUMBER: 'number',
  EMAIL: 'email',
  TEXT: 'text',
};

export const PROFITABILITY_ANALYSIS_FIELDS = {
  // animal inputs
  ANIMALS_IN_HERD: 'animalsInHerd',
  TOTAL_NUMBER_OF_COWS: 'totalNumberOfCows',
  TOTAL_NUMBER_OF_LACTATING_ANIMALS: 'totalNumberOfLactatingAnimals',
  BREED: 'breed',
  PRODUCTION_SYSTEM: 'productionSystem',

  // milk information
  NUMBER_ON_MILKINGS: 'numberOfMilkings',
  TOTAL_PRODUCTION_HERD: 'totalProductionHerd',
  TOTAL_PRODUCTION: 'totalProduction',
  MILK_PRICE: 'milkPrice',
  DIM: 'dim',
  PRODUCTION_IN_150_DIM: 'productionIn150DIM',
  MILK_FAT_PERCENTAGE: 'milkFatPercentage',
  MILK_PROTEIN_PERCENTAGE: 'milkProteinPercentage',
  SOMANTIC_CELL_COUNT: 'somanticCellCount',
  BACTERIA_CELL_COUNT: 'bacteriaCellCount',
  MUN: 'mun',

  // feeding information
  COMMERCIAL_CONCENTRATE_TOGGLE: 'commercialConcentrateToggle',
  COMMERCIAL_CONCENTRATE: 'commercialConcentrate',
  MINERAL_BASE_MIX: 'mineralBaseMix',
  MINERAL_BASE_MIX_VALUE: 'mineralBaseMixValue',
  NUTRITEK: 'nutritek',
  XPC_ULTRA: 'xpcUltra',
  ACTIFOR_BOOST: 'actiforBoost',
  BUFFER: 'buffer',
  NUTRIGORDURA_LAC: 'nutrigorduraLac',
  ICE: 'ice',
  ENERGY_ICE: 'energyIce',
  MONENSIN: 'monensin',
  SOY_PASS_BR: 'soyPassBr',
  CONCENTRATE_TOTAL_CONSUMED: 'concentrateTotalConsumed',
  SILAGE: 'silage',
  HAYLAGE: 'haylage',
  HAY: 'hay',
  PASTURE: 'pasture',
  WATER_QUALITY: 'waterQuality',
  BEDDING_QUALITY: 'beddingQuality',
  VENTILATION: 'ventilation',
  SPRINKLER: 'sprinkler',
  TEMPERATURE_IN_C: 'temperatureInC',
  AIR_RU_PERCENTAGE: 'airRuPercentage',
  THI: 'thi',
  RESPIRATORY_MOVEMENT: 'respiratoryMovement',
  COW_LAYING_DOWN_PERCENTAGE: 'cowLyingDownPercentage',
  TOTAL_DIET_COST: 'totalDietCost',
  REVENUE_PER_COW_PER_DAY: 'revenuePerCowPerDay',
};

export const ROF_FIELDS = {
  TMR: 'tmr',
  INDIVIDUAL_COW: 'individualCow',
  //herd profile
  HERD_PROFILE: 'herdProfile',
  BREED: 'breed',
  OTHER_BREED_TYPE: 'otherBreedType',
  FEEDING_TYPE: 'feedingType',
  NUMBER_OF_TMR_GROUPS: 'numberOfTmrGroups',
  TYPE_OF_SUPPLEMENT: 'typeOfSupplement',
  COOL_AID: 'coolAid',
  FORTISSA_FIT: 'fortissaFit',
  MUN: 'mun',
  MILKING_PER_DAY: 'milkingPerDay',
  // feeding
  FEEDING: 'feeding',
  LACTATING_COWS: 'lactatingCows',
  DAYS_IN_MILK: 'daysInMilk',
  //feeding ingredients
  //forages
  HOME_GROWN_FORAGES: 'homeGrownForages',
  HOME_GROWN_FORAGE_TYPE: 'homeGrownForageType',
  FORAGE_NAME: 'forageName',
  //grains
  HOME_GROWN_GRAINS: 'homeGrownGrains',
  HOME_GROWN_GRAINS_TYPE: 'homeGrownGrainsType',
  GRAINS_NAME: 'grainName',

  //bulk
  PURCHASE_BULK_FEED: 'purchaseBulkFeed',
  //bag
  PURCHASE_BAG_FEED: 'purchaseBagsFeed',
  FEED_NAME: 'feedName',
  TOTAL_HERD_PER_DAY: 'totalHerdPerDay',
  DRY_MATTER: 'dryMatter',
  TOTAL_DRY_MATTER: 'totalDryMatter',
  PRICE_PER_TON: 'pricePerTon',

  // milk production
  MILK_PRODUCTION: 'milkProduction',
  AVERAGE_MILK_PRODUCTION_KG: 'averageMilkProductionKg',
  MILK_PRODUCTION_KG: 'milkProductionKg',
  KG_OF_QUOTA_PER_DAY: 'kgOfQuotaPerDay',
  INCENTIVE_DAYS_KG_PER_DAY: 'incentiveDaysKgPerDay',
  TOTAL_QUOTA_KG_PER_DAY: 'totalQuotaKgPerDay',
  CURRENT_QUOTA_UTILIZATION_KG_PER_DAY: 'currentQuotaUtilizationKgPerDay',
  BUTTERFAT: 'butterfat',
  PROTEIN: 'protein',
  LACTOSE_AND_OTHER_SOLIDS: 'lactoseAndOtherSolids',
  CLASS2_PROTEIN: 'class2Protein',
  CLASS2_LACTOSE_AND_OTHER_SOLIDS: 'class2LactoseAndOtherSolids',
  DEDUCTIONS: 'deductions',
  PRICE_PER_KG: 'pricePerKg',
  PERCENTAGE_PER_HL: 'percentagePerHl',
  KG_PER_COW: 'kgPerCow',
  // milk production outputs
  MILK_PRODUCTION_OUTPUTS: 'milkProductionOutputs',
  RATIO_SNF_PER_BUTTERFAT: 'ratioSNFPerButterfat',
  MAX_ALLOWED: 'maxAllowed',
  TOTAL_FAT_PROTEIN: 'totalFatProtein',
  DAIRY_EFFICIENCY: 'dairyEfficiency',
  COMPONENT_EFFICIENCY: 'componentEfficiency',
  TOTAL_REVENUE_PER_HL: 'totalRevenuePerHl',
  FEED_COST_PER_HL: 'feedCostPerHl',
  PURCHASED_FEED_COST_PER_HL: 'purchasedFeedCostPerHl',
  CONCENTRATE_COST_PER_HL: 'concentrateCostPerHl',
  CONCENTRATE_COST_PER_KG_BF: 'concentrateCostPerKgBF',
  BF_REVENUE: 'bfRevenue',
  PROTEIN_REVENUE: 'proteinRevenue',
  OTHER_SOLIDS_REVENUE: 'otherSolidsRevenue',
  DEDUCTIONS_PRICE_PER_COW_PER_DAY: 'deductionsPricePerCowPerDay',
  SNF_NON_PAYMENT: 'snfNonPayment',
  TOTAL_REVENUE_KG_FAT: 'totalRevenuePricePerKgFat',
  TOTAL_REVENUE_COW_DAY: 'totalRevenueCowDay',
  UNDER_QUOTA_LOST_REVENUE: 'underQuotaLostRevenuePerMonth',
  ROF_KG_BUTTER_FAT: 'rofPerKgButterFat',
  ROF: 'rof',
  //db calculations
  CALCULATED_OUTPUTS: 'calculatedOutputs',
  //FEED_COST_PER_DAY
  FORAGE_FEED_COST_PER_DAY: 'forageFeedCostPerDay',
  GRAINS_FEED_COST_PER_DAY: 'grainsFeedCostPerDay',
  PURCHASED_BULK_FEED_COST_PER_DAY: 'purchasedBulkFeedCostPerDay',
  PURCHASED_BAGS_FEED_COST_PER_DAY: 'purchasedBagsFeedCostPerDay',
  TOTAL_PURCHASED_COST_PER_DAY: 'totalPurchasedCostPerDay',
  TOTAL_CONCENTRATE_COST_PER_DAY: 'totalConcentrateCostPerDay',
  TOTAL_FEED_COST_PER_DAY: 'totalFeedCostPerDay',
  //FEED_COST_PER_COW_PER_DAY
  FORAGE_FEED_COST_PER_COW_PER_DAY: 'forageFeedCostPerCowPerDay',
  GRAINS_COST_PER_COW_PER_DAY: 'grainsCostPerCowPerDay',
  PURCHASED_BULK_FEED_PER_COW_PER_DAY: 'purchasedBulkFeedPerCowPerDay',
  PURCHASED_BAGS_FEED_PER_COW_PER_DAY: 'purchasedBagsFeedPerCowPerDay',
  TOTAL_PURCHASED_COST_PER_COW_PER_DAY: 'totalPurchasedCostPerCowPerDay',
  TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY: 'totalConcentrateCostPerCowPerDay',
  TOTAL_FEED_COST_PER_COW_PER_DAY: 'totalFeedCostPerCowPerDay',
  //KG_DM_PER_DAY
  FORAGE_KG_DM_PER_DAY: 'forageKgDMPerDay',
  GRAINS_KG_DM_PER_DAY: 'grainsKgDMPerDay',
  PURCHASED_BULK_KG_DM_PER_DAY: 'purchasedBulkKgDMPerDay',
  PURCHASED_BAGS_KG_DM_PER_DAY: 'purchasedBagsKgDMPerDay',
  TOTAL_PURCHASED_COST_KG_DM_PER_DAY: 'totalPurchasedCostKgDMPerDay',
  TOTAL_CONCENTRATE_COST_KG_DM_PER_DAY: 'totalConcentrateCostKgDMPerDay',
  TOTAL_FEED_COST_KG_DM_PER_DAY: 'totalFeedCostKgDMPerDay',
  //FORAGE_PERCENTAGE
  FORAGE_PERCENTAGE: 'foragePercentage',
  //summary
  SUMMARY: 'summary',
  HERD_BASELINE: 'herdBaseline',
  QUOTA: 'quota',
  KG_OF_QUOTA: 'kgOfQuota',
  INCENTIVE_DAYS: 'incentiveDays',
  TOTAL_QUOTA: 'totalQuota',
  NO_OF_COWS_TO_FILL_QUOTA: 'noOfCowsToFillQuota',
  AVERAGE_MILK_PRODUCTION_ANIMALS_IN_TANK:
    'averageMilkProductionAnimalsInTankKg',
  AVERAGE_MILK_PRODUCTION_LITRES_COW_DAY:
    'averageMilkProductionLitresPerCowPerDay',
  REVENUE: 'revenue',
  SUBTOTAL: 'subtotal',
  TOTAL_REVENUE_PER_KG_BUTTERFAT: 'totalRevenuePricePerKgButterFat',
  FEED_COSTS: 'feedCosts',
  TOTAL_ON_FARM_FEED_COST_PER_COW_PER_DAY: 'totalOnFarmFeedCostPerCowPerDay',
  FEED_COST_PER_KG_OF_BF: 'feedCostPerKgOfBF',
  FEED_COST_PER_HL_OF_MILK: 'feedCostPerHlOfMilk',
  FEEDING_KG_DM_PER_DAY: 'feedingKgDMPerDay',
  CURRENT_RETURN_OVER_FEED_COSTS: 'currentReturnOverFeedCosts',
  RETURN_OVER_FEED_COST_PER_COW_PER_DAY: 'returnOverFeedCostPerCowPerDay',
  RETURN_OVER_FEED_COST_PER_KG_OF_BF: 'returnOverFeedCostPerKgOfBF',
  RETURN_OVER_FEED_COST_PER_HL: 'returnOverFeedCostPerHl',
  SELECTED: 'selected',
};

export const CALF_HEIFER_GROWTH_FIELDS = {
  // Tool generals
  CALF_HEIFER_GROWTH_TYPE: 'calfHeiferGrowthType',
  REFERENCE_HEIGHT: 'referenceHeight',
  REFERENCE_WEIGHT: 'referenceWeight',

  // Settings fields
  SETTINGS: 'settings',
  AGE_AT_FIRST_CALVING_MONTHS: 'ageAtFirstCalvingMonths',
  MATURE_BODY_WEIGHT_IN_KG: 'matureBodyWeightInKg',
  BIRTH_WEIGHT_IN_KG: 'birthWeightInKg',
  MATURE_BODY_HEIGHT_IN_CM: 'matureHeightInCm',
  BIRTH_HEIGHT_IN_CM: 'birthHeightInCm',
  VISUALIZATION: 'visualization',

  // Animal fields
  ANIMALS: 'animals',
  ID: 'id',
  ANIMAL_ID: 'animalId',
  DATE_WEIGHED: 'dateWeighed',
  DATE_HEIGHT: 'dateHeight',
  DATE_MEASURED: 'dateMeasured',
  DATE_OF_BIRTH: 'dateOfBirth',
  BODY_WEIGHT: 'bodyWeight',
  BODY_HEIGHT: 'bodyHeight',
  AGE_IN_MONTHS: 'ageInMonths',
  IS_DELETED: 'isDeleted',

  // summary fields
  SUMMARY: 'summary',
  ZERO_TO_TWO_MONTHS: 'zeroToTwoMonths',
  TWO_TO_FOUR_MONTHS: 'twoToFourMonths',
  FOUR_TO_EIGHT_MONTHS: 'fourToEightMonths',
  EIGHT_TO_TWELVE_MONTHS: 'eightToTwelveMonths',
  TWELVE_TO_SIXTEEN_MONTHS: 'twelveToSixteenMonths',
  SIXTEEN_TO_TWENTY_MONTHS: 'sixteenToTwentyMonths',
  TWENTY_TO_TWENTY_FOUR_MONTHS: 'twentyToTwentyFourMonths',
  GREATER_THAN_TWENTY_FOUR_MONTHS: 'greaterThanTwentyFourMonths',
  NUMBER_OF_OBSERVATIONS: 'numberOfObservations',
  PERCENTAGE_OF_TOTAL: 'percentageOfTotal',
  FARM_AVG_BH_CM: 'farmAvgBhCm',
};
