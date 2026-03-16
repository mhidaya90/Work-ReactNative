// localization
import i18n from '../../localization/i18n';
import enJson from '../../localization/locales/en.json';

export const STROKE = 'stroke';

export const POINTS_TABLE = {
  TEN_POINTS: 10,
  FIVE_POINTS: 5,
  FOUR_POINTS: 4,
  THREE_POINTS: 3,
  TWO_POINTS: 2,
  ONE_POINTS: 1,
  ZERO_POINTS: 0,
};

const CIRCLE_RADIUS = 45;
export const CIRCLE_CIRCUMFERENCE = CIRCLE_RADIUS * Math.PI * 2;
export const CIRCLE_ANIMATION_DURATION = 3000;
export const CIRCLE_COLOR_INTERPOLATION_RANGE = [75, 90, 100];
export const TEXT_TRANSITION_DURATION = 1000;

/**
 * @description
 * all corn silage questions and answers
 */
const CORN_SILAGE_QUESTIONS = [
  {
    index: 0,
    questionText: enJson.cornSilageQuestion1,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.quarterly,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.semiAnnual,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.annual,
        pointValue: POINTS_TABLE.ONE_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: enJson.cornSilageQuestion2,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion3,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion4,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion5,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion6,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion7,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion8,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion9,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThanFourDays,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.fourToSevenDays,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.greaterThanSevenDays,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion10,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion11,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.moreThan40Percent,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['20To40Percent'],
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan20Percent,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.notMeasured,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 3,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 11,
    questionText: enJson.cornSilageQuestion12,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.noWholeKernels,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan5Kernels,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan5Kernels,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.notMeasured,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 3,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 12,
    questionText: enJson.cornSilageQuestion13,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan15,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.between15And20,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan20,
        pointValue: POINTS_TABLE.ONE_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 13,
    questionText: enJson.cornSilageQuestion14,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 14,
    questionText: enJson.cornSilageQuestion15,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan5,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan5,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 15,
    questionText: enJson.cornSilageQuestion16,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.moreThan3,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan3,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

/**
 * @description
 * all haylage questions and answers
 */
const HAYLAGE_QUESTIONS = [
  {
    index: 0,
    questionText: enJson.cornSilageQuestion1,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.quarterly,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.semiAnnual,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.annual,
        pointValue: POINTS_TABLE.ONE_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: enJson.cornSilageQuestion2,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion3,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion4,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion5,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.haylageQuestion6,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.haylageQuestion7,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThanFourDays,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.fourToSevenDays,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.greaterThanSevenDays,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.haylageQuestion8,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion11,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.moreThan40Percent,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['20To40Percent'],
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan20Percent,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.notMeasured,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 3,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 9,
    questionText: enJson.haylageQuestion9,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion15,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan10Percent,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['10To13Percent'],
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan13Percent,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 11,
    questionText: enJson.haylageQuestion10,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan1Percent,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['1To3Percent'],
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan3Percent,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 12,
    questionText: enJson.cornSilageQuestion16,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.moreThan3,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan3,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

/**
 * @description
 * all haylage questions and answers
 */
const OTHER_SILAGE_QUESTIONS = [
  {
    index: 0,
    questionText: enJson.cornSilageQuestion1,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.quarterly,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.semiAnnual,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.annual,
        pointValue: POINTS_TABLE.ONE_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: enJson.cornSilageQuestion2,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion3,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion4,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion5,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.haylageQuestion6,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.haylageQuestion7,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThanFourDays,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.fourToSevenDays,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.greaterThanSevenDays,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.otherSilageQuestion8,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion11,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.moreThan40Percent,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['20To40Percent'],
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan20Percent,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.notMeasured,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 3,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 9,
    questionText: enJson.haylageQuestion9,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.cornSilageQuestion15,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan10Percent,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['10To13Percent'],
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan13Percent,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 11,
    questionText: enJson.haylageQuestion10,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan1Percent,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['1To3Percent'],
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan3Percent,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 12,
    questionText: enJson.cornSilageQuestion16,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.moreThan3,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan3,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const FORAGE_MANAGEMENT_SCORE_CARD_SILAGES = [
  {
    sectionIndex: 0,
    sectionSilageType: 0,
    silageTypeName: enJson.cornSilage,
    questions: CORN_SILAGE_QUESTIONS,
  },
  {
    sectionIndex: 0,
    sectionSilageType: 1,
    silageTypeName: enJson.haylage,
    questions: HAYLAGE_QUESTIONS,
  },
  {
    sectionIndex: 0,
    sectionSilageType: 2,
    silageTypeName: enJson.otherSilage,
    questions: OTHER_SILAGE_QUESTIONS,
  },
];

/**
 * @description
 * all forage quality in rations question
 */
const FORAGE_QUALITY_RATION_QUESTIONS = [
  {
    index: 0,
    questionText: enJson.forageQualityRationQuestion1,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.forageQualityRationQuestion2,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.forageQualityRationQuestion3,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.forageQualityRationQuestion4,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.removedAndMeasured,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.removedOnly,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.notRemoved,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const FORAGE_QUALITY_RATION_SCORE_CARD_SILAGES = [
  {
    sectionIndex: 1,
    sectionSilageType: 0,
    silageTypeName: '',
    questions: FORAGE_QUALITY_RATION_QUESTIONS,
  },
];

/**
 * @description
 * all bunker and piles questions and answers
 * as all questions are similar in corn silage, haylage and other silage
 * we are creating a single array for all of them
 */
const BUNKER_PILES_QUESTIONS = [
  {
    index: 0,
    questionText: enJson.bunkerPilesQuestion1,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.good,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.average,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.poor,
        pointValue: POINTS_TABLE.ONE_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 1,
    questionText: enJson.bunkerPilesQuestion2,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.bunkerPilesQuestion3,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan40PercentDM,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan40PercentDM,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.bunkerPilesQuestion4,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.bunkerPilesQuestion5,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.bunkerPilesQuestion6,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.bunkerPilesQuestion7,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.bunkerPilesQuestion8,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan1Hour,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.withIn8Hours,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan8Hours,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.bunkerPilesQuestion9,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.bunkerPilesQuestion10,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson['1To6Hours'],
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['6To12Hours'],
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan12Hours,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 10,
    questionText: enJson.bunkerPilesQuestion11,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson['12InchesOrMore'],
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['6To12Inches'],
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan12Inches,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 11,
    questionText: enJson.bunkerPilesQuestion12,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson['3xWeek'],
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['2xWeek'],
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['1xWeek'],
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
  {
    index: 12,
    questionText: enJson.bunkerPilesQuestion13,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const BUNKER_PILES_SCORE_CARD_SILAGES = [
  {
    sectionIndex: 2,
    sectionSilageType: 0,
    silageTypeName: enJson.cornSilage,
    questions: BUNKER_PILES_QUESTIONS,
  },
  {
    sectionIndex: 2,
    sectionSilageType: 1,
    silageTypeName: enJson.haylage,
    questions: BUNKER_PILES_QUESTIONS,
  },
  {
    sectionIndex: 2,
    sectionSilageType: 2,
    silageTypeName: enJson.otherSilage,
    questions: BUNKER_PILES_QUESTIONS,
  },
];

/**
 * @description
 * all forage quality in rations question
 */
const TOWER_SILOS_QUESTIONS = [
  {
    index: 0,
    questionText: enJson.towerSilosQuestion1,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.towerSilosQuestion2,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.towerSilosQuestion3,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const TOWER_SILOS_SCORE_CARD_SILAGES = [
  {
    sectionIndex: 3,
    sectionSilageType: 0,
    silageTypeName: '',
    questions: TOWER_SILOS_QUESTIONS,
  },
];

/**
 * @description
 * all silage bags questions and answers
 * as all questions are similar in corn silage, haylage and other silage
 * we are creating a single array for all of them
 */
const SILAGE_BAGS_QUESTIONS = [
  {
    index: 0,
    questionText: enJson.silageBagsQuestion1,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.silageBagsQuestion2,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.silageBagsQuestion3,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.silageBagsQuestion4,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.weekly,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.biWeekly,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.monthly,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.silageBagsQuestion5,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.moreThan30cm,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['15To30cm'],
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan15cm,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.silageBagsQuestion6,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FOUR_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.silageBagsQuestion7,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.lessThan40PercentDM,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.moreThan40PercentDM,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const SILAGE_BAGS_SCORE_CARD_SILAGES = [
  {
    sectionIndex: 4,
    sectionSilageType: 0,
    silageTypeName: enJson.cornSilage,
    questions: SILAGE_BAGS_QUESTIONS,
  },
  {
    sectionIndex: 4,
    sectionSilageType: 1,
    silageTypeName: enJson.haylage,
    questions: SILAGE_BAGS_QUESTIONS,
  },
  {
    sectionIndex: 4,
    sectionSilageType: 2,
    silageTypeName: enJson.otherSilage,
    questions: SILAGE_BAGS_QUESTIONS,
  },
];

/**
 * @description
 * all baleage questions and answers
 * as all questions are similar in corn silage, haylage and other silage
 * we are creating a single array for all of them
 */
const BALEAGE_QUESTIONS = [
  {
    index: 0,
    questionText: enJson.baleageQuestion1,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.baleageQuestion2,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.baleageQuestion3,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.THREE_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.baleageQuestion4,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.yes,
        pointValue: POINTS_TABLE.TWO_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.no,
        pointValue: POINTS_TABLE.ZERO_POINTS,
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
    questionText: enJson.baleageQuestion5,
    isQuestionRequired: true,
    availableAnswers: [
      {
        answerText: enJson.moreThan8layersPlastic,
        pointValue: POINTS_TABLE.TEN_POINTS,
        index: 0,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson['6To8layersPlastic'],
        pointValue: POINTS_TABLE.FIVE_POINTS,
        index: 1,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
      {
        answerText: enJson.lessThan6layersPlastic,
        pointValue: POINTS_TABLE.ZERO_POINTS,
        index: 2,
        globalize: true,
        isItemOfConcern: true,
        selected: true,
      },
    ],
    selectedAnswer: null,
  },
];

const BALEAGE_SCORE_CARD_SILAGES = [
  {
    sectionIndex: 5,
    sectionSilageType: 0,
    silageTypeName: enJson.cornSilage,
    questions: BALEAGE_QUESTIONS,
  },
  {
    sectionIndex: 5,
    sectionSilageType: 1,
    silageTypeName: enJson.haylage,
    questions: BALEAGE_QUESTIONS,
  },
  {
    sectionIndex: 5,
    sectionSilageType: 2,
    silageTypeName: enJson.otherSilage,
    questions: BALEAGE_QUESTIONS,
  },
];

export const FORAGE_AUDIT_SCORE_CARD_SECTIONS = [
  {
    index: 0,
    sectionName: enJson.forageManagement,
    scorecardSilages: FORAGE_MANAGEMENT_SCORE_CARD_SILAGES,
  },
  {
    index: 1,
    sectionName: enJson.forageQualityRation,
    scorecardSilages: FORAGE_QUALITY_RATION_SCORE_CARD_SILAGES,
  },
  {
    index: 2,
    sectionName: enJson.bunkerAndPiles,
    scorecardSilages: BUNKER_PILES_SCORE_CARD_SILAGES,
  },
  {
    index: 3,
    sectionName: enJson.towerSilos,
    scorecardSilages: TOWER_SILOS_SCORE_CARD_SILAGES,
  },
  {
    index: 4,
    sectionName: enJson.silageBags,
    scorecardSilages: SILAGE_BAGS_SCORE_CARD_SILAGES,
  },
  {
    index: 5,
    sectionName: enJson.baleage,
    scorecardSilages: BALEAGE_SCORE_CARD_SILAGES,
  },
];

export const FORAGE_AUDIT_TABS = {
  FIRST: 1,
  SECOND: 2,
};

export const FORAGE_AUDIT_RESULTS = {
  FORAGE_AUDIT_RESPONSES: 'responses',
  FORAGE_AUDIT_SCORE: 'score',
};

export const FORAGE_AUDIT_RESULTS_TABS = [
  {
    key: FORAGE_AUDIT_RESULTS.FORAGE_AUDIT_SCORE,
    value: i18n.t('score'), //enJson.score,
  },
  {
    key: FORAGE_AUDIT_RESULTS.FORAGE_AUDIT_RESPONSES,
    value: i18n.t('responses'), // enJson.responses,
  },
];
