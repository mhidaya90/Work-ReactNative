const CALF_HEIFER_TABS = {
  FIRST: 1,
  SECOND: 2,
};

const CALF_HEIFER_CATEGORIES_TYPES = {
  CalfHeiferColostrum: 'CalfHeiferColostrum',
  CalfHeiferPreweaned: 'CalfHeiferPreweaned',
  CalfHeiferPostweaned: 'CalfHeiferPostweaned',
  CalfHeiferGrowerPuberty: 'CalfHeiferGrowerPuberty',
  CalfHeiferKeyBenchmarks: 'CalfHeiferKeyBenchmarks',

  grower: 'grower',
  puberty: 'puberty',
  pregnancy: 'pregnancy',
  closeUp: 'closeUp',
};

const CALF_HEIFER_QUESTION_KEYS = {
  COLOSTRUM: [
    'Colostrum_CleanAndDryCalvingArea',
    'Colostrum_RefrigeratedColostrumStoredLess',
    'Colostrum_NumberOfCowsInCalvingArea',
    'Colostrum_PasteurizeColostrumBeforeFeeding',
    'Colostrum_PercentageOfNavelsDippedInSevenPercent',
    'Colostrum_BrixPercentOfColostrumFed',
    'Colostrum_HoursTillCalfReceivesColostrum',
    'Colostrum_AmountOfColostrumOrFed',
    'Colostrum_HoursTillCalfIsRemovedFromMother',
    'Colostrum_CleanAndSanitizeCalfFeedingEquipment',
    'Colostrum_CleanCalfCartToTransportCalf',
  ],
  COLOSTRUM_ANSWERS: {
    YES: 'yes',
    NO: 'no',
    ONE: '1',
    BETWEEN_2_TO_5: 'twoToFive',
    GREATER_THAN_5: 'greaterThanFive',
    HUNDRED_PERCENT: 'hundredPercent',
    BETWEEN_50_TO_100_PERCENT: 'fiftyToHundredPercent',
    LESS_THAN_50_PERCENT: 'lessThanFiftyPercent',
    GREATER_THAN_22_PERCENT: 'greaterThanTwentyTwoPercent',
    BETWEEN_20_TO_21_PERCENT: 'twentyToTwentyOnePercent',
    LESS_THAN_20_PERCENT: 'lessThen20OrNotTested',
    LESS_THAN_1: 'lessThanOne',
    BETWEEN_2_TO_3: 'twoToThree',
    BETWEEN_3_TO_5: 'threeToFive',
    GREATER_THAN_3_L: 'greaterThanThreeL',
    BETWEEN_2_TO_3_L: 'twoToThreeL',
    LESS_THAN_2_L: 'lessThanTwoL',
    IN_1_TO_3: 'oneToSix',
    GREATER_THAN_6: 'greaterThanSix',
    PASTEURIZED_MILK_FED: 'pasteurizedMilkFed',
  },
  PRE_WEANED: [
    'Preweaned_CleanAndDryPen',
    'Preweaned_SizeOfPenAdequatePerHeifer',
    'Preweaned_WellVentilatedPenWithNoDraftOnCalf',
    'Preweaned_ForageAvailability',
    'Preweaned_CleanAndSanitizeCalfFeedingEquipment',
    'Preweaned_CMRIsProperlyMixedAndAdequatelyFed',
    'Preweaned_ConsistentFeedingTimesAndProtocols',
    'Preweaned_FreeChoiceCleanWaterIsAvailable',
    'Preweaned_FreeChoiceFreshCalfStarterIsAvailable',
    'Preweaned_WeaningAtIntakeOfOnekgStarterPerDay',
    'Preweaned_EvidenceOfScoursOrPneumonia',
  ],
  PRE_WEANED_ANSWERS: {
    TEXTURE_FEED: 'textureFeed',
    PASTEURIZED_MILK_FED: 'pasteurizedMilkFed',
  },
  POST_WEANED: [
    'Preweaned_CleanAndDryPen',
    'Preweaned_WellVentilatedPenWithNoDraftOnCalf',
    'Postweaned_SizeOfPenAdequate',
    'Postweaned_SizeOfBunkSpace',
    'Postweaned_FreshQualityStarterAvailable',
    'Postweaned_FeedBunkIsCleanedDaily',
    'Preweaned_ForageAvailability',
    'Preweaned_FreeChoiceCleanWaterIsAvailable',
    'Postweaned_EvidenceOfAcidosisInManure',
    'Preweaned_EvidenceOfScoursOrPneumonia',
  ],
  GROWER_PUBERTY_PREGNANCY_CLOSEUP: [
    'Preweaned_CleanAndDryPen',
    'Preweaned_SizeOfPenAdequatePerHeifer',
    'GrowerPubertyPregnancyCloseup_PercentageOfOverCrowding',
    'GrowerPubertyPregnancyCloseup_SizeOfBunkSpace',
    'GrowerPubertyPregnancyCloseup_GroupWithUniformHeiferSize',
    'GrowerPubertyPregnancyCloseup_EvidenceOfLooseManure',
    'GrowerPubertyPregnancyCloseup_RationsBalanceForGrowth',
    'GrowerPubertyPregnancyCloseup_FeedBunkIsCleanedDaily',
    'Preweaned_FreeChoiceCleanWaterIsAvailable',
    'GrowerPubertyPregnancyCloseup_DesiredBCSIsAchieved',
  ],
  KEY_BENCHMARKS: [
    'KeyBenchmarks_SerumlgG',
    'KeyBenchmarks_NintyDaysMorbidity',
    'KeyBenchmarks_NintyDaysMortality',
    'KeyBenchmarks_FifteenPercentOfMatureBodyWeight',
    'KeyBenchmarks_FiftyFivePercentOfMatureBodyWeight',
    'KeyBenchmarks_NintyFourPercentOfMatureBodyWeight',
    'KeyBenchmarks_PercentOfHeifersPregnant',
    'KeyBenchmarks_AgeInMonthAtFirstCalving',
    'KeyBenchmarks_HeiferPeakProduce',
    'KeyBenchmarks_CalvingAndHeiferRecord',
  ],
  KEY_BENCHMARKS_ANSWERS: {
    GREATER_THAN_10: 'greaterThan10',
    BETWEEN_8_TO_10: 'between8To10',
    LESS_THAN_10: 'lessThan10',
    LESS_THAN_5_PERCENT: 'lessThan5Percent',
    BETWEEN_5_TO_10_PERCENT: 'between5To10Percent',
    LESS_THAN_11_PERCENT: 'lessThan11Percent',
    BETWEEN_11_TO_13_PERCENT: 'between11To13Percent',
    BETWEEN_14_TO_16_PERCENT: 'between14To16Percent',
    BETWEEN_16_TO_17_PERCENT: 'between16To17Percent',
    GREATER_THAN_17_PERCENT: 'greaterThan17Percent',
    LESS_THAN_51_PERCENT: 'lessThan51Percent',
    BETWEEN_51_TO_53_PERCENT: 'between51To53Percent',
    BETWEEN_54_TO_55_PERCENT: 'between54To55Percent',
    BETWEEN_56_TO_57_PERCENT: 'between56To57Percent',
    GREATER_THAN_57_PERCENT: 'greaterThan57Percent',
    LESS_THAN_90_PERCENT: 'lessThan90Percent',
    BETWEEN_91_TO_93_PERCENT: 'between91To93Percent',
    BETWEEN_94_TO_95_PERCENT: 'between94To95Percent',
    BETWEEN_96_TO_97_PERCENT: 'between96To97Percent',
    GREATER_THAN_97_PERCENT: 'greaterThan97Percent',
    LESS_THAN_60_PERCENT: 'lessThan60Percent',
    BETWEEN_60_TO_75_PERCENT: 'between60To75Percent',
    GREATER_THAN_75_PERCENT: 'greaterThan75Percent',
    LESS_THAN_24_M: 'lessThan24M',
    BETWEEN_24_TO_26_M: 'between24To26M',
    GREATER_THAN_26_M: 'greaterThan26M',
    BETWEEN_70_TO_75_PERCENT: 'between70To75Percent',
    BETWEEN_60_TO_70_PERCENT: 'between60To70Percent',
  },
  GENERAL_ANSWERS: {
    YES: 'yes',
    NO: 'no',
    LESS_THAN_10_PERCENT: 'lessThan10Percent',
    BETWEEN_11_TO_30_PERCENT: 'between11To30Percent',
    GREATER_THAN_30_PERCENT: 'greaterThan30Percent',
    LESS_THAN_15_PERCENT: 'lessThan15Percent',
    GREATER_THAN_15_PERCENT: 'greaterThan15Percent',
  },
};

const CALF_HEIFER_SURVEY_CATEGORIES = [
  {
    index: 0,
    sectionName: CALF_HEIFER_CATEGORIES_TYPES.CalfHeiferColostrum,
    questions: [],
  },
  {
    index: 1,
    sectionName: CALF_HEIFER_CATEGORIES_TYPES.CalfHeiferPreweaned,
    questions: [],
  },
  {
    index: 2,
    sectionName: CALF_HEIFER_CATEGORIES_TYPES.CalfHeiferPostweaned,
    questions: [],
  },
  {
    index: 3,
    sectionName: CALF_HEIFER_CATEGORIES_TYPES.CalfHeiferGrowerPuberty,
    questions: [],
  },
  {
    index: 4,
    sectionName: CALF_HEIFER_CATEGORIES_TYPES.CalfHeiferKeyBenchmarks,
    questions: [],
  },
];

const COLOSTRUM_QUESTIONS = [
  {
    index: 0,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[0],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[1],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 5,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 2,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[2],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.ONE,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.BETWEEN_2_TO_5,
        pointValue: 1,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.GREATER_THAN_5,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 3,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[3],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 4,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[4],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.HUNDRED_PERCENT,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.BETWEEN_50_TO_100_PERCENT,
        pointValue: 1,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.LESS_THAN_50_PERCENT,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 5,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[5],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.GREATER_THAN_22_PERCENT,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.BETWEEN_20_TO_21_PERCENT,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.LESS_THAN_20_PERCENT,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 6,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[6],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.LESS_THAN_1,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.BETWEEN_2_TO_3,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.BETWEEN_3_TO_5,
        pointValue: 3,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.GREATER_THAN_5,
        pointValue: 0,
        index: 3,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 7,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[7],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.GREATER_THAN_3_L,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.BETWEEN_2_TO_3_L,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.LESS_THAN_2_L,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 8,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[8],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.LESS_THAN_1,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.IN_1_TO_3,
        pointValue: 2,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.GREATER_THAN_6,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 9,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[9],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 10,
    questionText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM[10],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const PRE_WEANED_QUESTIONS = [
  {
    index: 0,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[0],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[1],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 2,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[2],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 3,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[3],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED_ANSWERS.TEXTURE_FEED,
        pointValue: 2,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 4,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[4],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 5,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[5],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 6,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.PASTEURIZED_MILK_FED,
        pointValue: 4,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 6,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[6],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 7,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[7],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 8,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[8],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 6,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 9,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[9],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.COLOSTRUM_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 10,
    questionText: CALF_HEIFER_QUESTION_KEYS.PRE_WEANED[10],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.LESS_THAN_10_PERCENT,
        pointValue: 8,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.BETWEEN_11_TO_30_PERCENT,
        pointValue: 4,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.GREATER_THAN_30_PERCENT,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const POST_WEANED_QUESTIONS = [
  {
    index: 0,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[0],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[1],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 2,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[2],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 3,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[3],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 4,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[4],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 8,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 5,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[5],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 6,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[6],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 7,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[7],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 8,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[8],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 0,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 2,
        index: 1,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 9,
    questionText: CALF_HEIFER_QUESTION_KEYS.POST_WEANED[9],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.LESS_THAN_10_PERCENT,
        pointValue: 8,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.BETWEEN_11_TO_30_PERCENT,
        pointValue: 4,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.GREATER_THAN_30_PERCENT,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const GROWER_PUBERTY_PREGNANCY_CLOSEUP_QUESTIONS = [
  {
    index: 0,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[0],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[1],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 2,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[2],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.LESS_THAN_15_PERCENT,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.GREATER_THAN_15_PERCENT,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 3,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[3],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 4,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[4],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 5,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[5],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 0,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 4,
        index: 1,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 6,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[6],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 8,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 7,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[7],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 2,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 8,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[8],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 9,
    questionText: CALF_HEIFER_QUESTION_KEYS.GROWER_PUBERTY_PREGNANCY_CLOSEUP[9],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 4,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },

      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const KEY_BENCHMARKS_QUESTIONS = [
  {
    index: 0,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[0],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.GREATER_THAN_10,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.BETWEEN_8_TO_10,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[1],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.LESS_THAN_10_PERCENT,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.BETWEEN_11_TO_30_PERCENT,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.GREATER_THAN_30_PERCENT,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 2,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[2],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.LESS_THAN_5_PERCENT,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_5_TO_10_PERCENT,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.GREATER_THAN_10,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 3,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[3],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.LESS_THAN_11_PERCENT,
        pointValue: 0,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_11_TO_13_PERCENT,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_14_TO_16_PERCENT,
        pointValue: 10,
        index: 2,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_16_TO_17_PERCENT,
        pointValue: 5,
        index: 3,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .GREATER_THAN_17_PERCENT,
        pointValue: 0,
        index: 4,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 4,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[4],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.LESS_THAN_51_PERCENT,
        pointValue: 0,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_51_TO_53_PERCENT,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_54_TO_55_PERCENT,
        pointValue: 10,
        index: 2,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_56_TO_57_PERCENT,
        pointValue: 5,
        index: 3,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .GREATER_THAN_57_PERCENT,
        pointValue: 0,
        index: 4,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 5,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[5],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.LESS_THAN_90_PERCENT,
        pointValue: 0,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_91_TO_93_PERCENT,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_94_TO_95_PERCENT,
        pointValue: 10,
        index: 2,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_96_TO_97_PERCENT,
        pointValue: 5,
        index: 3,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .GREATER_THAN_97_PERCENT,
        pointValue: 0,
        index: 4,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 6,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[6],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.LESS_THAN_60_PERCENT,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_60_TO_70_PERCENT,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .GREATER_THAN_75_PERCENT,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 7,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[7],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.LESS_THAN_24_M,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.BETWEEN_24_TO_26_M,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS.GREATER_THAN_26_M,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 8,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[8],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .GREATER_THAN_75_PERCENT,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_70_TO_75_PERCENT,
        pointValue: 5,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText:
          CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS_ANSWERS
            .BETWEEN_60_TO_70_PERCENT,
        pointValue: 0,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 9,
    questionText: CALF_HEIFER_QUESTION_KEYS.KEY_BENCHMARKS[9],
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.YES,
        pointValue: 10,
        index: 0,
        globalize: true,
        isItemOfConcern: false,
        selected: true,
      },

      {
        answerText: CALF_HEIFER_QUESTION_KEYS.GENERAL_ANSWERS.NO,
        pointValue: 0,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const KEY_BENCHMARKS_PHASES = [
  {
    index: 0,
    sections: [
      {
        sectionIndex: 0,
        sectionName: CALF_HEIFER_CATEGORIES_TYPES.CalfHeiferColostrum,
      },
    ],
    supportedQuestionIndex: [0],
  },
  {
    index: 1,
    sections: [
      {
        sectionIndex: 1,
        sectionName: CALF_HEIFER_CATEGORIES_TYPES.CalfHeiferPreweaned,
      },
      {
        sectionIndex: 2,
        sectionName: CALF_HEIFER_CATEGORIES_TYPES.CalfHeiferPostweaned,
      },
    ],
    supportedQuestionIndex: [1, 2, 3],
  },
  {
    index: 2,
    sections: [
      {
        sectionIndex: 3,
        sectionName: CALF_HEIFER_CATEGORIES_TYPES.grower,
      },
    ],
    supportedQuestionIndex: [3],
  },
  {
    index: 3,
    sections: [
      {
        sectionIndex: 3,
        sectionName: CALF_HEIFER_CATEGORIES_TYPES.puberty,
      },
    ],
    supportedQuestionIndex: [4],
  },
  {
    index: 4,
    sections: [
      {
        sectionIndex: 3,
        sectionName: CALF_HEIFER_CATEGORIES_TYPES.pregnancy,
      },
    ],
    supportedQuestionIndex: [6],
  },
  {
    index: 5,
    sections: [
      {
        sectionIndex: 3,
        sectionName: CALF_HEIFER_CATEGORIES_TYPES.closeUp,
      },
    ],
    supportedQuestionIndex: [5, 7, 8],
  },
];

// "sections": [
//     {
//       "index": 0,
//       "sectionName": "string",
//       "questions": [
//         {
//           "index": 0,
//           "questionText": "string",
//           "isQuestionRequired": true,
//           "availableAnswers": [
//             {
//               "answerText": "string",
//               "pointValue": 0,
//               "index": 0,
//               "globalize": true,
//               "isItemOfConcern": true,
//               "selected": true
//             }
//           ],
//           "selectedAnswer": {
//             "answerText": "string",
//             "pointValue": 0,
//             "index": 0,
//             "globalize": true,
//             "isItemOfConcern": true,
//             "selected": true
//           }
//         }
//       ],
//       "includeInOverallScorecardScore": true
//     }
//   ],

export {
  CALF_HEIFER_SURVEY_CATEGORIES,
  COLOSTRUM_QUESTIONS,
  PRE_WEANED_QUESTIONS,
  POST_WEANED_QUESTIONS,
  GROWER_PUBERTY_PREGNANCY_CLOSEUP_QUESTIONS,
  KEY_BENCHMARKS_QUESTIONS,
  CALF_HEIFER_TABS,
  KEY_BENCHMARKS_PHASES,
};
