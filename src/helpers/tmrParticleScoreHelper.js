// constants
import {
  DATE_FORMATS,
  SCORER_ENUMS,
  TOOL_ANALYSIS_TYPES,
  VISIT_TABLE_FIELDS,
} from '../constants/AppConstants';
import { RUMEN_HEALTH_TMR_PARTICLE_SCORE } from '../constants/FormConstants';
import {
  MID_1_SCALE_TMR_SCORE_GOAL,
  MID_2_SCALE_TMR_SCORE_GOAL,
  MID_2_SCALE_TMR_SCORE_GOAL_SCREEN_NEW,
  TMR_GOALS_TYPES,
  TMR_GOAL_TYPE,
  TMR_SUMMARY_COLUMN_HEADINGS,
  TOP_SCALE_TMR_SCORE_GOAL_SCREEN_NEW_OLD,
  TOP_SCALE_TMR_SCORE_GOAL_THREE_SCREEN,
  TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_NEW,
  TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_OLD,
  TRAY_SCALE_TMR_SCORE_GOAL_THREE_SCREEN,
} from '../constants/toolsConstants/TMRParticleScoreConstants';
import colors from '../constants/theme/variables/customColor';

// localization
import i18n from '../localization/i18n';

// helpers
import { dateHelper, getFormattedDate } from './dateHelper';
import {
  convertNumberToString,
  convertNumbersToEnFormat,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import { getNumberFormatSettings } from 'react-native-localize';
import { addSpace, getParsedToolData } from './genericHelper';
import { logEvent } from './logHelper';

// return initial tmr score model
export const rumenHealthTmrParticleScorePayload = ({
  visitId,
  selectedScorer,
}) => {
  const tmrParticleScoreData = {
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.VISIT_ID]: '',
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]: [],
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER]:
      selectedScorer || 'NoneSelected',
  };

  let tmrParticleScoreGoals = [
    // TOP_SCALE_TMR_SCORE_GOAL,
    // MID_1_SCALE_TMR_SCORE_GOAL,
    // TRAY_SCALE_TMR_SCORE_GOAL,
  ];

  if ([SCORER_ENUMS.THREE_SCREEN].includes(selectedScorer)) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_THREE_SCREEN,
      MID_1_SCALE_TMR_SCORE_GOAL,
      TRAY_SCALE_TMR_SCORE_GOAL_THREE_SCREEN,
    ];
  } else if ([SCORER_ENUMS.FOUR_SCREEN_OLD].includes(selectedScorer)) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_SCREEN_NEW_OLD,
      MID_1_SCALE_TMR_SCORE_GOAL,
      MID_2_SCALE_TMR_SCORE_GOAL,
      TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_OLD,
    ];
  } else if ([SCORER_ENUMS.FOUR_SCREEN_NEW].includes(selectedScorer)) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_SCREEN_NEW_OLD,
      MID_1_SCALE_TMR_SCORE_GOAL,
      MID_2_SCALE_TMR_SCORE_GOAL_SCREEN_NEW,
      TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_NEW,
    ];
  }

  return {
    tmrParticleScoreData,
    tmrParticleScoreGoals,
  };
};

export const parseOnInitializeTMRDataForAccordions = tmrParticleScore => {
  const tmrScores = [];

  if (
    tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]?.length > 0
  ) {
    tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]?.map(
      item => {
        const scorer = {
          ...item,
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT
              ] || 0,
            ),
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT
              ] || 0,
            ),
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ),

          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT
              ] || 0,
            ),

          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT
              ] || 0,
            ),

          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ),

          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT
              ] || 0,
            ),

          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT
              ] || 0,
            ),

          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS]:
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ),
        };

        if (
          tmrParticleScore?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ] !== SCORER_ENUMS?.THREE_SCREEN
        ) {
          scorer[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT] =
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT
              ] || 0,
            );
          scorer[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT] =
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT
              ] || 0,
            );
          scorer[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS] =
            convertNumberToString(
              item?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            );
        }

        tmrScores.push(scorer);
      },
    );
    tmrParticleScore[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES] = tmrScores;
  }

  return tmrParticleScore;
};

export const tmrAccordionModel = ({
  selectedPen,
  selectedScorer,
  tmrParticleScoreState,
  tmrParticleScoreGoals,
}) => {
  let filteredPenScorer = [];
  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    filteredPenScorer = tmrParticleScoreState?.[
      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
    ]?.filter(
      item =>
        item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
        (selectedPen?.sv_id || selectedPen?.id),
      // (selectedPen?.id || selectedPen?.localId),
    );
  }

  const tmrScoreId =
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length + 1;

  const tmrScoreName = `${i18n.t('tmrScore')} ${filteredPenScorer?.length + 1}`;

  const obj = {
    // [RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID]: !stringIsEmpty(selectedPen?.id)
    //   ? selectedPen?.id
    //   : selectedPen?.localId,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID]: !stringIsEmpty(selectedPen?.sv_id)
      ? selectedPen?.sv_id
      : selectedPen?.id,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_NAME]:
      selectedPen?.name || selectedPen?.value || '',
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.CREATE_TIME_UTC]:
      dateHelper.getUnixTimestamp(new Date()),
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.LAST_MODIFIED_TIME_UTC]:
      dateHelper.getUnixTimestamp(new Date()),
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.VISITS_SELECTED]: [],
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.IS_TOOL_ITEM_NEW]: true,

    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS]: null,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT]:
      tmrParticleScoreGoals[0]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT
      ],
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT]:
      tmrParticleScoreGoals[0]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT
      ],

    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS]: null,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT]:
      tmrParticleScoreGoals[1]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT
      ],
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT]:
      tmrParticleScoreGoals[1]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT
      ],

    // adding extra fields for CDP integration
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCREEN_TARE_AMOUNT_IN_GRAMS]: null,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCREEN_TARE_AMOUNT_IN_GRAMS]: null,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCREEN_TARE_AMOUNT_IN_GRAMS]: null,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCREEN_TARE_AMOUNT_IN_GRAMS]: null,

    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOOL_STATUS]: 'NotStarted',
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.DAYS_IN_MILK]:
      selectedPen?.daysInMilk || null,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.IS_FIRST_TIME_WITH_SCORE]: true,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_NAME]: tmrScoreName || '',
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_ID]: tmrScoreId || null,
  };

  if (selectedScorer?.key !== SCORER_ENUMS.THREE_SCREEN) {
    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS] = null;
    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT] =
      tmrParticleScoreGoals[2]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT
      ];
    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT] =
      tmrParticleScoreGoals[2]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT
      ];

    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS] = null;
    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT] =
      tmrParticleScoreGoals[3]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT
      ];
    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT] =
      tmrParticleScoreGoals[3]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT
      ];
  } else {
    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS] = null;
    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT] =
      tmrParticleScoreGoals[2]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT
      ];
    obj[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT] =
      tmrParticleScoreGoals[2]?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT
      ];
  }

  return obj;
};

export const getGoalsByScorer = scorer => {
  let tmrParticleScoreGoals = [];

  if ([SCORER_ENUMS.THREE_SCREEN].includes(scorer?.key)) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_THREE_SCREEN,
      MID_1_SCALE_TMR_SCORE_GOAL,
      TRAY_SCALE_TMR_SCORE_GOAL_THREE_SCREEN,
    ];
  } else if ([SCORER_ENUMS.FOUR_SCREEN_OLD].includes(scorer?.key)) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_SCREEN_NEW_OLD,
      MID_1_SCALE_TMR_SCORE_GOAL,
      MID_2_SCALE_TMR_SCORE_GOAL,
      TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_OLD,
    ];
  } else if ([SCORER_ENUMS.FOUR_SCREEN_NEW].includes(scorer?.key)) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_SCREEN_NEW_OLD,
      MID_1_SCALE_TMR_SCORE_GOAL,
      MID_2_SCALE_TMR_SCORE_GOAL_SCREEN_NEW,
      TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_NEW,
    ];
  }

  return tmrParticleScoreGoals;
};

export const tmrGoalsDataMapper = goals => {
  if (goals && goals?.length > 0) {
    const getGoalLabel = type => {
      switch (type) {
        case TMR_GOALS_TYPES.TOP:
          return i18n.t('top(19mm)');
        case TMR_GOALS_TYPES.MID_1:
          return i18n.t('mid1(18mm)');
        case TMR_GOALS_TYPES.MID_2:
          return i18n.t('mid2(4mm)');
        case TMR_GOALS_TYPES.TRAY:
          return i18n.t('tray(g)');
        default:
          return '';
      }
    };

    const mappedGoals = goals?.map((goal, index) => {
      const goalKeys = Object.keys(goal);

      const payload = {
        id: index,
        label: getGoalLabel(goal[TMR_GOAL_TYPE]),
        goalMin: goal?.[goalKeys[1]] || 0,
        goalMax: goal?.[goalKeys[2]] || 0,
        [TMR_GOAL_TYPE]: goal[TMR_GOAL_TYPE],
      };

      return payload;
    });

    return mappedGoals;
  }
};

export const tmrGoalsToModel = goalValues => {
  if (goalValues?.length > 0) {
    const tmrParticleScoreGoals = [];

    goalValues?.map(goal => {
      switch (goal?.tmrGoalType) {
        case TMR_GOALS_TYPES.TOP:
          tmrParticleScoreGoals.push({
            [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TOP,
            [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT]:
              goal?.goalMin || 0,
            [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT]:
              goal?.goalMax || 0,
          });
          break;

        case TMR_GOALS_TYPES.MID_1:
          tmrParticleScoreGoals.push({
            [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.MID_1,
            [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT]:
              goal?.goalMin || 0,
            [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT]:
              goal?.goalMax || 0,
          });
          break;

        case TMR_GOALS_TYPES.MID_2:
          tmrParticleScoreGoals.push({
            [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.MID_2,
            [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT]:
              goal?.goalMin || 0,
            [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT]:
              goal?.goalMax || 0,
          });
          break;

        case TMR_GOALS_TYPES.TRAY:
          tmrParticleScoreGoals.push({
            [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TRAY,
            [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT]:
              goal?.goalMin || 0,
            [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT]:
              goal?.goalMax || 0,
          });
          break;

        default:
          break;
      }
    });

    return tmrParticleScoreGoals;
  }
};

export const updateGoalsOfTmrScores = (tmrParticleScoreState, tmrGoals) => {
  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    const updatedScores = tmrParticleScoreState?.[
      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
    ]?.map(scorer => {
      if (tmrGoals?.length > 0) {
        tmrGoals?.map(goal => {
          scorer = {
            ...scorer,
            ...goal,
          };
        });

        delete scorer[TMR_GOAL_TYPE];
      }

      return scorer;
    });

    return updatedScores;
  }
  return (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES] || []
  );
};

export const getUpdatedTMRMinGoal = (value = '0', goalValues, goal) => {
  const regionSettings = getNumberFormatSettings();

  const updatedGoals = goalValues?.map(item => {
    if (item[TMR_GOAL_TYPE] === goal[TMR_GOAL_TYPE]) {
      if (
        value?.length > 1 &&
        value != `0${regionSettings.decimalSeparator}` &&
        value?.[0] == '0'
      ) {
        item.goalMin =
          convertNumberToString(parseFloat(convertStringToNumber(value))) ||
          null;
      } else {
        item.goalMin = value || null;
      }
    }
    return item;
  });
  return updatedGoals;
};

export const getUpdatedTMRMaxGoal = (value = '0', goalValues, goal) => {
  const regionSettings = getNumberFormatSettings();

  const updatedGoals = goalValues?.map(item => {
    if (item[TMR_GOAL_TYPE] === goal[TMR_GOAL_TYPE]) {
      if (
        value?.length > 1 &&
        value != `0${regionSettings.decimalSeparator}` &&
        value?.[0] == '0'
      ) {
        item.goalMax =
          convertNumberToString(parseFloat(convertStringToNumber(value))) ||
          null;
      } else {
        item.goalMax = value || null;
      }
    }
    return item;
  });
  return updatedGoals;
};

export const updateTmrScoresData = (
  value,
  fieldType,
  scorer,
  tmrParticleScoreState,
) => {
  const existedScorer = tmrParticleScoreState?.[
    RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
  ]?.find(
    item =>
      item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_ID] ===
      scorer?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_ID],
  );

  switch (fieldType) {
    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_NAME:
      existedScorer[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_NAME] = value;
      break;

    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS:
      existedScorer[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS] =
        value;
      break;

    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS:
      existedScorer[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
      ] = value;
      break;

    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS:
      existedScorer[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
      ] = value;
      break;

    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS:
      existedScorer[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
      ] = value;
      break;

    default:
      break;
  }

  const tmrScores = tmrParticleScoreState?.[
    RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
  ]?.map(item => {
    if (
      item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_ID] ===
      scorer?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_ID]
    ) {
      return existedScorer;
    }
    return item;
  });

  return tmrScores;
};

export const getSummaryColumnWithRowLabels = (
  tmrParticleScoreState,
  selectedPen,
) => {
  let tableHeaders = [''];
  let summaryValueType = TMR_SUMMARY_COLUMN_HEADINGS;
  let tmrScreenHeaders = [];
  let tmrScreenTableValues = [];

  tableHeaders = ['', i18n.t('top_19mm'), i18n.t('mid1_18mm'), i18n.t('tray')];

  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER] !==
    SCORER_ENUMS.THREE_SCREEN
  ) {
    tableHeaders.splice(3, 0, i18n.t('mid2_4mm'));
  }

  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    const filteredPenScores = tmrParticleScoreState?.[
      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
    ]?.filter(
      item =>
        item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
        (selectedPen?.sv_id || selectedPen?.id),
      // (selectedPen?.id || selectedPen?.localId),
    );

    if (filteredPenScores?.length > 0) {
      filteredPenScores?.map(item => {
        tmrScreenHeaders.push(
          item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_NAME],
        );

        let row = [];
        const scoreKeys = Object.keys(item);
        scoreKeys?.map(scorer => {
          if (
            [
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS,
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS,
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS,
              tmrParticleScoreState?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
              ] !== SCORER_ENUMS.THREE_SCREEN &&
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS,
            ].includes(scorer)
          ) {
            row.push(
              calculateOnScreenPercentTMR(item, scorer, tmrParticleScoreState),
            );
          }
        });
        tmrScreenTableValues.push(row);
      });
    }
  }

  return {
    tableHeaders,
    summaryValueType,
    tmrScreenHeaders,
    tmrScreenTableValues,
  };
};

const manageTmrTextColor = (value, minValue, maxValue) => {
  return value >= minValue && value <= maxValue
    ? colors.pileGreenSlope
    : colors.tempRedColor;
};

export const calculateOnScreenPercentTMR = (
  scorer,
  scorerType,
  tmrParticleScoreState,
) => {
  const {
    TOP_GOAL_MINIMUM_PERCENT,
    TOP_GOAL_MAXIMUM_PERCENT,
    MID_1_GOAL_MINIMUM_PERCENT,
    MID_1_GOAL_MAXIMUM_PERCENT,
    TRAY_GOAL_MINIMUM_PERCENT,
    TRAY_GOAL_MAXIMUM_PERCENT,
    MID_2_GOAL_MINIMUM_PERCENT,
    MID_2_GOAL_MAXIMUM_PERCENT,
  } = RUMEN_HEALTH_TMR_PARTICLE_SCORE;

  switch (scorerType) {
    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS:
      if (scorer?.[scorerType]) {
        const sum =
          parseFloat(scorer?.[scorerType]) /
          (parseFloat(scorer?.[scorerType]) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ) +
            parseFloat(
              tmrParticleScoreState?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
              ] !== SCORER_ENUMS.THREE_SCREEN
                ? scorer?.[
                    RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
                  ] || 0
                : 0,
            ));
        const value = isNaN(sum) ? '0.0' : (sum * 100).toFixed(1);

        return {
          value,
          color: manageTmrTextColor(
            value,
            scorer[TOP_GOAL_MINIMUM_PERCENT],
            scorer[TOP_GOAL_MAXIMUM_PERCENT],
          ),
        };
      }

      return '0.0';

    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS:
      if (scorer?.[scorerType]) {
        const sum =
          parseFloat(scorer?.[scorerType]) /
          (parseFloat(scorer?.[scorerType]) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ) +
            parseFloat(
              tmrParticleScoreState?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
              ] !== SCORER_ENUMS.THREE_SCREEN
                ? scorer?.[
                    RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
                  ] || 0
                : 0,
            ));

        const value = isNaN(sum) ? '0.0' : (sum * 100).toFixed(1);

        return {
          value,
          color: manageTmrTextColor(
            value,
            scorer[MID_1_GOAL_MINIMUM_PERCENT],
            scorer[MID_1_GOAL_MAXIMUM_PERCENT],
          ),
        };
      }

      return '0.0';

    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS:
      if (scorer?.[scorerType]) {
        const sum =
          parseFloat(scorer?.[scorerType]) /
          (parseFloat(scorer?.[scorerType]) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ) +
            parseFloat(
              tmrParticleScoreState?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
              ] !== SCORER_ENUMS.THREE_SCREEN
                ? scorer?.[
                    RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
                  ] || 0
                : 0,
            ));

        const value = isNaN(sum) ? '0.0' : (sum * 100).toFixed(1);

        return {
          value,
          color: manageTmrTextColor(
            value,
            scorer[TRAY_GOAL_MINIMUM_PERCENT],
            scorer[TRAY_GOAL_MAXIMUM_PERCENT],
          ),
        };
      }

      return '0.0';

    case RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS:
      if (scorer?.[scorerType]) {
        const sum =
          parseFloat(scorer?.[scorerType]) /
          (parseFloat(scorer?.[scorerType]) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ) +
            parseFloat(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ));

        const value = isNaN(sum) ? '0.0' : (sum * 100).toFixed(1);

        return {
          value,
          color: manageTmrTextColor(
            value,
            scorer[MID_2_GOAL_MINIMUM_PERCENT],
            scorer[MID_2_GOAL_MAXIMUM_PERCENT],
          ),
        };
      }

      return '0.0';

    default:
      return 0.0;
  }
};

export const parseTmrParticleScoreForOfflineDB = tmrParticleScore => {
  const tmrScores = [];

  if (
    tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]?.length > 0
  ) {
    tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]?.map(
      item => {
        const scorer = {
          ...item,
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT
                ] || 0,
              ),
            ),
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT
                ] || 0,
              ),
            ),
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
                ] || 0,
              ),
            ),

          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT
                ] || 0,
              ),
            ),
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT
                ] || 0,
              ),
            ),
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
                ] || 0,
              ),
            ),

          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT
                ] || 0,
              ),
            ),
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT
                ] || 0,
              ),
            ),
          [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS]:
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
                ] || 0,
              ),
            ),
        };

        if (
          tmrParticleScore?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ] !== SCORER_ENUMS?.THREE_SCREEN
        ) {
          scorer[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT] =
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT
                ] || 0,
              ),
            );
          scorer[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT] =
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT
                ] || 0,
              ),
            );
          scorer[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS] =
            parseFloat(
              convertStringToNumber(
                item?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
                ] || 0,
              ),
            );
        }

        tmrScores.push(scorer);
      },
    );
  }

  const payload = {
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.VISIT_ID]: '',
    // tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.VISIT_ID] || '',
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER]:
      tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER] || '',
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]: tmrScores || [],
  };

  return payload;
};

export const tmrParticleScoreTableData = (
  tmrParticleScoreState,
  tmrParticleScoreGoals,
  selectedPen,
  // isVisitReportHerd = false,
) => {
  if (
    tmrParticleScoreState &&
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    let averageSummaryTable = [];

    let totalTmrScores = 0;

    const avgTmrScores = {
      topScaleTmrScoreAverage: 0,
      mid_1_ScaleTmrScoreAverage: 0,
      mid_2_ScaleTmrScoreAverage: 0,
      trayScaleTmrScoreAverage: 0,
    };

    const totalTmrScoreValues = {
      topScaleTmrScoreAverage: [],
      mid_1_ScaleTmrScoreAverage: [],
      mid_2_ScaleTmrScoreAverage: [],
      trayScaleTmrScoreAverage: [],
    };

    const filteredPenScores = tmrParticleScoreState?.[
      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
    ]?.filter(
      item =>
        item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
        (selectedPen?.sv_id ||
          selectedPen?.id ||
          selectedPen?.localId ||
          selectedPen?.penId), //updated this to handle same function for visit report too
    );

    totalTmrScores = filteredPenScores?.length;

    // if (isVisitReportHerd && totalTmrScores == 0) {
    //   return null;
    // }
    if (filteredPenScores?.length > 0) {
      filteredPenScores?.map(scorer => {
        let topScaleAmount = calculateOnScreenPercentTMR(
          scorer,
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS,
          tmrParticleScoreState,
        )?.value;

        let mid1ScaleAmount = calculateOnScreenPercentTMR(
          scorer,
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS,
          tmrParticleScoreState,
        )?.value;
        let trayScaleAmount = calculateOnScreenPercentTMR(
          scorer,
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS,
          tmrParticleScoreState,
        )?.value;
        avgTmrScores.topScaleTmrScoreAverage =
          avgTmrScores.topScaleTmrScoreAverage +
          (topScaleAmount != '0.0' ? parseFloat(topScaleAmount) : 0);
        totalTmrScoreValues.topScaleTmrScoreAverage.push(
          topScaleAmount != '0.0' ? parseFloat(topScaleAmount) : 0,
        );

        avgTmrScores.mid_1_ScaleTmrScoreAverage =
          avgTmrScores.mid_1_ScaleTmrScoreAverage +
          (mid1ScaleAmount != '0.0' ? parseFloat(mid1ScaleAmount) : 0);
        totalTmrScoreValues.mid_1_ScaleTmrScoreAverage.push(
          mid1ScaleAmount != '0.0' ? parseFloat(mid1ScaleAmount) : 0,
        );

        avgTmrScores.trayScaleTmrScoreAverage =
          avgTmrScores.trayScaleTmrScoreAverage +
          (trayScaleAmount != '0.0' ? parseFloat(trayScaleAmount) : 0);
        totalTmrScoreValues.trayScaleTmrScoreAverage.push(
          trayScaleAmount != '0.0' ? parseFloat(trayScaleAmount) : 0,
        );

        if (
          tmrParticleScoreState?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ] !== SCORER_ENUMS.THREE_SCREEN
        ) {
          let mid2ScaleAmount = calculateOnScreenPercentTMR(
            scorer,
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS,
            tmrParticleScoreState,
          )?.value;
          avgTmrScores.mid_2_ScaleTmrScoreAverage =
            avgTmrScores.mid_2_ScaleTmrScoreAverage +
            (mid2ScaleAmount != '0.0' ? parseFloat(mid2ScaleAmount) : 0);
          totalTmrScoreValues.mid_2_ScaleTmrScoreAverage.push(
            mid2ScaleAmount != '0.0' ? parseFloat(mid2ScaleAmount) : 0,
          );
        }
      });
    }

    if (
      tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
      ] === SCORER_ENUMS.THREE_SCREEN
    ) {
      delete avgTmrScores.mid_2_ScaleTmrScoreAverage;
      delete totalTmrScoreValues.mid_2_ScaleTmrScoreAverage;
    }

    // calculating average of all tmr scores available in current visit
    let averageRowData = [];
    const averageTmrKeys = Object.keys(avgTmrScores);
    averageTmrKeys?.map(key => {
      if (totalTmrScores > 0) {
        averageRowData.push(
          isNaN(avgTmrScores[key])
            ? (0).toFixed(2)
            : (avgTmrScores[key] / totalTmrScores).toFixed(2),
        );
      } else {
        return averageRowData.push((0).toFixed(2));
      }
    });

    averageSummaryTable.push(averageRowData);

    // calculating tmr scores standard deviation in current tmr scores
    let stdRowData = [];
    const totalTmrScoreKeys = Object.keys(totalTmrScoreValues);
    totalTmrScoreKeys?.map(key => {
      let deviation = null;
      const values = totalTmrScoreValues[key]?.map(item => item);
      if (values?.length > 0) {
        const sum = values?.reduce((acc, val) => {
          return (isNaN(acc) ? 0 : acc) + (isNaN(val) ? 0 : val);
        });

        const median = sum / values?.length;
        let variance = 0;
        values.forEach(num => {
          variance +=
            ((isNaN(num) ? 0 : Number(num)) - median) *
            ((isNaN(num) ? 0 : Number(num)) - median);
        });
        variance /= values?.length;
        deviation = Math.sqrt(variance)?.toFixed(2);
        stdRowData.push(
          isNaN(deviation) ? convertNumberToString('0.00') : deviation,
        );
      } else {
        stdRowData.push((0).toFixed(2));
      }
    });
    averageSummaryTable.push(stdRowData);

    // calculating goal min and max in available current visit
    let goalMin = [];
    let goalMax = [];
    tmrParticleScoreGoals?.map(goal => {
      goalMin.push(
        goal?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT] ||
          goal?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT] ||
          (tmrParticleScoreState?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ] !== SCORER_ENUMS.THREE_SCREEN &&
            goal?.[
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT
            ]) ||
          goal?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT] ||
          0?.toFixed(0),
      );
      goalMax.push(
        goal?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT] ||
          goal?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT] ||
          (tmrParticleScoreState?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ] !== SCORER_ENUMS.THREE_SCREEN &&
            goal?.[
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT
            ]) ||
          goal?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT] ||
          0?.toFixed(0),
      );
    });

    averageSummaryTable.push(goalMin);
    averageSummaryTable.push(goalMax);

    return averageSummaryTable;
  }
};

export const extractGoalsFromTmrParticleScore = tmrParticleScore => {
  if (
    tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]?.length > 0
  ) {
    const tmrScore =
      tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES];

    const goals = [
      {
        [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TOP,
        [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT]:
          tmrScore[0]?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MINIMUM_PERCENT
          ] || 0,
        [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT]:
          tmrScore[0]?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_GOAL_MAXIMUM_PERCENT
          ] || 0,
      },
      {
        [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.MID_1,
        [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT]:
          tmrScore[0]?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MINIMUM_PERCENT
          ] || 0,
        [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT]:
          tmrScore[0]?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_GOAL_MAXIMUM_PERCENT
          ] || 0,
      },
      {
        [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.TRAY,
        [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT]:
          tmrScore[0]?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MINIMUM_PERCENT
          ] || 0,
        [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT]:
          tmrScore[0]?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_GOAL_MAXIMUM_PERCENT
          ] || 0,
      },
    ];

    if (
      tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER] !==
      SCORER_ENUMS.THREE_SCREEN
    ) {
      const mid_2 = {
        [TMR_GOAL_TYPE]: TMR_GOALS_TYPES.MID_2,
        [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT]:
          tmrScore[0]?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MINIMUM_PERCENT
          ] || 0,
        [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT]:
          tmrScore[0]?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_GOAL_MAXIMUM_PERCENT
          ] || 0,
      };
      goals?.splice(2, 0, mid_2);
    }

    return goals;
  }

  let tmrParticleScoreGoals = [
    // TOP_SCALE_TMR_SCORE_GOAL,
    // MID_1_SCALE_TMR_SCORE_GOAL,
    // TRAY_SCALE_TMR_SCORE_GOAL,
  ];

  if (
    [SCORER_ENUMS.THREE_SCREEN].includes(
      tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER],
    )
  ) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_THREE_SCREEN,
      MID_1_SCALE_TMR_SCORE_GOAL,
      TRAY_SCALE_TMR_SCORE_GOAL_THREE_SCREEN,
    ];
  } else if (
    [SCORER_ENUMS.FOUR_SCREEN_OLD].includes(
      tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER],
    )
  ) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_SCREEN_NEW_OLD,
      MID_1_SCALE_TMR_SCORE_GOAL,
      MID_2_SCALE_TMR_SCORE_GOAL,
      TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_OLD,
    ];
  } else if (
    [SCORER_ENUMS.FOUR_SCREEN_NEW].includes(
      tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER],
    )
  ) {
    tmrParticleScoreGoals = [
      TOP_SCALE_TMR_SCORE_GOAL_SCREEN_NEW_OLD,
      MID_1_SCALE_TMR_SCORE_GOAL,
      MID_2_SCALE_TMR_SCORE_GOAL_SCREEN_NEW,
      TRAY_SCALE_TMR_SCORE_GOAL_SCREEN_NEW,
    ];
  }

  return tmrParticleScoreGoals || [];
};

export const tmrGraphStateData = (tmrParticleScoreState, selectedPen) => {
  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    const filteredScoresByPen = tmrParticleScoreState?.[
      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
    ]?.filter(
      item =>
        item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
        (selectedPen?.sv_id || selectedPen?.id),
      // (selectedPen?.id || selectedPen?.localId),
    );
    if (filteredScoresByPen?.length > 0) {
      const results = filteredScoresByPen?.map(item => {
        return {
          id: item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_ID],
          name: item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_NAME],
          key: item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_NAME],
        };
      });
      return results;
    }
  }

  return [];
};

export const parseTmrScoreDataForGraph = (
  recentVisits,
  tmrParticleScoreState,
  selectedTmrScorer,
  selectedPen,
) => {
  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    if (recentVisits?.length > 0) {
      recentVisits[recentVisits?.length - 1].tmrParticleScore =
        tmrParticleScoreState;
    }

    const data = [
      {
        dataPoints: getTmrDataPoints(
          recentVisits,
          selectedTmrScorer,
          TMR_GOALS_TYPES.TOP,
          tmrParticleScoreState,
          selectedPen,
        ),
        barColor: colors.topColor,
      },
      {
        dataPoints: getTmrDataPoints(
          recentVisits,
          selectedTmrScorer,
          TMR_GOALS_TYPES.MID_1,
          tmrParticleScoreState,
          selectedPen,
        ),
        barColor: colors.mid1Color,
      },
    ];

    if (
      tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
      ] !== SCORER_ENUMS.THREE_SCREEN
    ) {
      data.push({
        dataPoints: getTmrDataPoints(
          recentVisits,
          selectedTmrScorer,
          TMR_GOALS_TYPES.MID_2,
          tmrParticleScoreState,
          selectedPen,
        ),
        barColor: colors.mid2Color,
      });
      data.push({
        dataPoints: getTmrDataPoints(
          recentVisits,
          selectedTmrScorer,
          TMR_GOALS_TYPES.TRAY,
          tmrParticleScoreState,
          selectedPen,
        ),
        barColor: colors.trayColor,
      });
    } else {
      data.push({
        dataPoints: getTmrDataPoints(
          recentVisits,
          selectedTmrScorer,
          TMR_GOALS_TYPES.TRAY,
          tmrParticleScoreState,
          selectedPen,
        ),
        barColor: colors.trayColor,
      });
    }

    return data;
  } else {
    return [];
  }
};

export const parseTmrScoreDataForExport = (
  selectedRecentVisits,
  tmrParticleScoreState,
  selectedGraph,
  selectedPen,
) => {
  const onScreenPercentage = [];
  selectedRecentVisits &&
    selectedRecentVisits?.length > 0 &&
    selectedRecentVisits?.forEach(item => {
      const payloadObject = {
        visitDate: getFormattedDate(item?.visitDate, DATE_FORMATS.MM_dd),
        top: null,
        mid1: null,
        mid2: null,
        tray: null,
        visitName: item.visitName,
        visitId: item.id,
      };

      if (stringIsEmpty(item?.tmrParticleScore)) {
        return;
      }
      const parsedItem = tmrParticleScoreInJson(item.tmrParticleScore);
      if (parsedItem?.tmrScores?.length === 0) {
        return;
      }
      if (
        parsedItem &&
        parsedItem?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER] ==
          tmrParticleScoreState?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ]
      ) {
        const matchedScorer = parsedItem?.[
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
        ]?.find(
          element =>
            element?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_ID] ==
              (selectedGraph?.id || selectedGraph?.key) &&
            element?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
              (selectedPen?.sv_id || selectedPen?.id),
          // (selectedPen?.id || selectedPen?.localId),
        );
        if (matchedScorer) {
          payloadObject.top = !stringIsEmpty(
            matchedScorer?.[
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
            ],
          )
            ? calculateOnScreenPercentTMR(
                matchedScorer,
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS,
                item.tmrParticleScore,
              )?.value
            : null;
          payloadObject.mid1 = !stringIsEmpty(
            matchedScorer?.[
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
            ],
          )
            ? calculateOnScreenPercentTMR(
                matchedScorer,
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS,
                item.tmrParticleScore,
              )?.value
            : null;
          payloadObject.mid2 = !stringIsEmpty(
            matchedScorer?.[
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
            ],
          )
            ? calculateOnScreenPercentTMR(
                matchedScorer,
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS,
                item.tmrParticleScore,
              )?.value
            : null;
          payloadObject.tray = !stringIsEmpty(
            matchedScorer?.[
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
            ],
          )
            ? calculateOnScreenPercentTMR(
                matchedScorer,
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS,
                item.tmrParticleScore,
              )?.value
            : null;
        } else {
          return;
        }

        if (
          tmrParticleScoreState?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ] === SCORER_ENUMS.THREE_SCREEN
        ) {
          delete payloadObject.mid2;
        }

        onScreenPercentage.push(payloadObject);
      }
    });

  return onScreenPercentage;
};

export const parseTmrHerdAnalysisDataForGraph = (
  pensList,
  tmrParticleScoreState,
) => {
  const data = [];
  if (
    pensList?.length > 0 &&
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    pensList?.map(pen => {
      const payloadObject = {
        penName: pen?.value,
        top: null,
        mid1: null,
        mid2: null,
        tray: null,
      };

      const filteredTmrScores = tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
      ]?.filter(
        // item => item?.penId === pen?.id || item?.penId === pen?.localId,
        item => item?.penId === pen?.sv_id || item?.penId === pen?.id,
      );
      if (filteredTmrScores?.length > 0) {
        filteredTmrScores?.map(element => {
          payloadObject.top += !stringIsEmpty(element?.topScaleAmountInGrams)
            ? parseFloat(
                convertNumbersToEnFormat(element?.topScaleAmountInGrams, false),
              )
            : null;
          payloadObject.mid1 += !stringIsEmpty(element?.mid1ScaleAmountInGrams)
            ? parseFloat(
                convertNumbersToEnFormat(
                  element?.mid1ScaleAmountInGrams,
                  false,
                ),
              )
            : null;
          payloadObject.mid2 += !stringIsEmpty(element?.mid2ScaleAmountInGrams)
            ? parseFloat(
                convertNumbersToEnFormat(
                  element?.mid2ScaleAmountInGrams,
                  false,
                ),
              )
            : null;
          payloadObject.tray += !stringIsEmpty(element?.trayScaleAmountInGrams)
            ? parseFloat(
                convertNumbersToEnFormat(
                  element?.trayScaleAmountInGrams,
                  false,
                ),
              )
            : null;
        });

        payloadObject.top =
          payloadObject.top != 0
            ? parseFloat(
                (payloadObject.top / filteredTmrScores.length).toFixed(2),
              )
            : null;
        payloadObject.mid1 =
          payloadObject.mid1 != 0
            ? parseFloat(
                (payloadObject.mid1 / filteredTmrScores.length).toFixed(2),
              )
            : null;
        payloadObject.mid2 =
          payloadObject.mid2 != 0
            ? parseFloat(
                (payloadObject.mid2 / filteredTmrScores.length).toFixed(2),
              )
            : null;
        payloadObject.tray =
          payloadObject.tray != 0
            ? parseFloat(
                (payloadObject.tray / filteredTmrScores.length).toFixed(2),
              )
            : null;

        if (
          tmrParticleScoreState?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ] === SCORER_ENUMS.THREE_SCREEN
        ) {
          delete payloadObject.mid2;
        }

        data.push(payloadObject);
      }
    });
  }
  return data;
};

const tmrParticleScoreInJson = tmrParticleScore => {
  if (typeof tmrParticleScore === 'string') {
    return JSON.parse(tmrParticleScore);
  }
  return tmrParticleScore;
};

//#region export and graph
export const mapGraphDataForHerdAnalysisExport = (
  visitState,
  graphExportData,
) => {
  const model = {
    fileName: visitState?.visitName + ' ' + i18n.t('TMRParticleScore'),
    visitName: visitState?.visitName || '',
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.dd_MMM_yy,
    ),
    toolName: i18n.t('TMRParticleScore'),
    analysisType: i18n.t('herdAnalysis'),
    dataPoints: graphExportData,
  };
  return model;
};

export const mapGraphDataForPenAnalysisExport = (
  visitState,
  onScreenPercentage,
  selectedGraph,
  scorerName,
  selectedPen,
) => {
  const model = {
    fileName: visitState?.visitName + ' ' + i18n.t('TMRParticleScore'),
    visitName: visitState?.visitName || '',
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.dd_MMM_yy,
    ),
    toolName: i18n.t('TMRParticleScore'),
    analysisType: i18n.t('penAnalysis'),
    scorerLabel: scorerName?.value || '',
    tmrLabel: selectedGraph?.name,
    penName: selectedPen?.name || '',
    onScreenPercentage,
  };
  return model;
};

const getTmrDataPoints = (
  recentVisits = [],
  selectedTmrScorer,
  valueType,
  tmrParticleScoreState,
  selectedPen,
) => {
  let visitData = [];

  recentVisits?.map((visit, index) => {
    let visitTmrData = null;
    if (
      !stringIsEmpty(visit?.tmrParticleScore) &&
      typeof visit?.tmrParticleScore === 'string'
    ) {
      visitTmrData = JSON.parse(visit?.tmrParticleScore);
    } else {
      visitTmrData = visit?.tmrParticleScore;
    }

    if (
      visitTmrData &&
      visitTmrData?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER] ==
        tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER]
    ) {
      const isTmrExist = visitTmrData?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
      ]?.find(item => {
        return (
          item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_ID] ==
            selectedTmrScorer?.id &&
          (item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
            selectedPen.sv_id ||
            item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] === selectedPen.id)
          // selectedPen.localId)
        );
      });

      if (isTmrExist) {
        switch (valueType) {
          case TMR_GOALS_TYPES.TOP:
            visitData.push({
              x:
                getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
                addSpace(index + 1),
              y: isTmrExist?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
              ]
                ? parseFloat(
                    calculateOnScreenPercentTMR(
                      isTmrExist,
                      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS,
                      visitTmrData,
                    )?.value,
                  )
                : null,
            });
            break;

          case TMR_GOALS_TYPES.MID_1:
            visitData.push({
              x:
                getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
                addSpace(index + 1),
              y: isTmrExist?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
              ]
                ? parseFloat(
                    calculateOnScreenPercentTMR(
                      isTmrExist,
                      RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS,
                      visitTmrData,
                    )?.value,
                  )
                : null,
            });
            break;

          case TMR_GOALS_TYPES.MID_2:
            visitData.push({
              x:
                getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
                addSpace(index + 1),
              y: isTmrExist?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
              ]
                ? parseFloat(
                    calculateOnScreenPercentTMR(
                      isTmrExist,
                      RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS,
                      visitTmrData,
                    )?.value,
                  )
                : null,
            });
            break;

          case TMR_GOALS_TYPES.TRAY:
            visitData.push({
              x:
                getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
                addSpace(index + 1),
              y: isTmrExist?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
              ]
                ? parseFloat(
                    calculateOnScreenPercentTMR(
                      isTmrExist,
                      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS,
                      visitTmrData,
                    )?.value,
                  )
                : null,
            });
            break;
        }
      } else {
        // visitData.push({
        //   x: getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd),
        //   y: null,
        // });
      }
    } else return;
  });

  return visitData;
};

export const getTmrScoreByPenId = (tmrParticleScore, pen) => {
  const emptyFilteredPayload = {
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS]: 0,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS]: 0,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS]: 0,
    [RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS]: 0,
  };

  if (
    tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]?.length > 0
  ) {
    const filteredTmrScore = tmrParticleScore?.[
      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
    ]?.filter(
      item =>
        item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
        pen?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID],
    );

    if (filteredTmrScore?.length > 0) {
      const avgTmrScores = {
        ...emptyFilteredPayload,
      };

      filteredTmrScore?.map(scorer => {
        avgTmrScores[
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
        ] =
          avgTmrScores[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
          ] +
          parseFloat(
            convertStringToNumber(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ),
          );

        avgTmrScores[
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
        ] =
          avgTmrScores[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
          ] +
          parseFloat(
            convertStringToNumber(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ),
          );

        avgTmrScores[
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
        ] =
          avgTmrScores[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
          ] +
          parseFloat(
            convertStringToNumber(
              scorer?.[
                RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
              ] || 0,
            ),
          );

        if (
          tmrParticleScore?.[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
          ] !== SCORER_ENUMS.THREE_SCREEN
        ) {
          avgTmrScores[
            RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
          ] =
            avgTmrScores[
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
            ] +
            parseFloat(
              convertStringToNumber(
                scorer?.[
                  RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
                ] || 0,
              ),
            );
        }
      });

      if (
        tmrParticleScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER] ===
        SCORER_ENUMS.THREE_SCREEN
      ) {
        delete avgTmrScores[
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
        ];
      }

      // calculating average of all tmr scores available in current visit
      const averageTmrKeys = Object.keys(avgTmrScores);
      averageTmrKeys?.map(key =>
        parseFloat(avgTmrScores[key])
          ? (avgTmrScores[key] = (
              parseFloat(avgTmrScores[key]) / filteredTmrScore?.length
            ).toFixed(2))
          : '-',
      );

      return avgTmrScores;
    } else {
      return emptyFilteredPayload;
    }
  }

  return emptyFilteredPayload;
};

export const extractPenIdsFromTmrScoreState = tmrParticleScoreState => {
  const penIds = [];
  const tmrScores =
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES];
  if (tmrScores && tmrScores?.length > 0) {
    tmrScores.forEach(score => {
      if (
        score?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] &&
        !penIds.includes(score?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID])
      ) {
        penIds.push(score[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID]);
      }
    });
  }
  return penIds;
};

export const extractPensFromPensListBasedOnPenIds = (
  pensList = [], //list of all pens
  activePensIds = [], //list of pens that have data entered in pen-analysis
) => {
  let filteredPensList = [];
  pensList?.forEach(pen => {
    if (
      activePensIds.includes(pen?.sv_id) ||
      activePensIds.includes(pen?.id)
      // activePensIds.includes(pen?.localId)
    ) {
      filteredPensList.push(pen);
    }
  });
  return filteredPensList;
};

export const parsePensTmrScoreForGraph = (tmrParticleScoreState, pensList) => {
  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    const data = [
      {
        dataPoints: getTopTmrPenData(tmrParticleScoreState, pensList),
        barColor: colors.topColor,
      },
      {
        dataPoints: getMid1TmrPenData(tmrParticleScoreState, pensList),
        barColor: colors.mid1Color,
      },
    ];

    if (
      tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
      ] !== SCORER_ENUMS.THREE_SCREEN
    ) {
      data.push({
        dataPoints: getMid2TmrPenData(tmrParticleScoreState, pensList),
        barColor: colors.mid2Color,
      });
      data.push({
        dataPoints: getTrayTmrPenData(tmrParticleScoreState, pensList),
        barColor: colors.trayColor,
      });
    } else {
      data.push({
        dataPoints: getTrayTmrPenData(tmrParticleScoreState, pensList),
        barColor: colors.trayColor,
      });
    }

    return data;
  } else {
    return [];
  }
};

const getTopTmrPenData = (tmrParticleScoreState, pensList) => {
  let pensData = [];
  pensList?.map(pen => {
    if (
      tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
        ?.length > 0
    ) {
      const filteredScores = tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
      ]?.filter(
        item =>
          item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
          (pen?.penId || pen?.sv_id || pen?.id),
        // (pen?.penId || pen?.id || pen?.localId),
      );

      if (filteredScores?.length > 0) {
        // let value = 0;
        let topScaleAmountPercent = 0;
        filteredScores?.map(item => {
          // value += parseFloat(
          //   convertStringToNumber(
          //     item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS],
          //   ) || 0,
          // );

          topScaleAmountPercent += parseFloat(
            calculateOnScreenPercentTMR(
              item,
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP_SCALE_AMOUNT_IN_GRAMS,
              tmrParticleScoreState,
            )?.value,
          );
        });

        pensData.push({
          x: pen?.value || pen?.name || '',
          y:
            topScaleAmountPercent > 0
              ? parseFloat(
                  (topScaleAmountPercent / filteredScores?.length)?.toFixed(1),
                )
              : null,
        });
      } else {
        pensData.push({
          x: pen?.value || pen?.name || '',
          y: null,
        });
      }
    }
  });

  return pensData;
};

const getMid1TmrPenData = (tmrParticleScoreState, pensList) => {
  let pensData = [];
  pensList?.map(pen => {
    if (
      tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
        ?.length > 0
    ) {
      const filteredScores = tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
      ]?.filter(
        item =>
          item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
          (pen?.penId || pen?.sv_id || pen?.id),
        // (pen?.penId || pen?.id || pen?.localId),
      );

      if (filteredScores?.length > 0) {
        // let value = 0;
        let mid1ScaleAmount = 0;
        filteredScores?.map(item => {
          // value += parseFloat(
          //   convertStringToNumber(
          //     item?.[
          //       RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS
          //     ],
          //   ) || 0,
          // );

          mid1ScaleAmount += parseFloat(
            calculateOnScreenPercentTMR(
              item,
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_1_SCALE_AMOUNT_IN_GRAMS,
              tmrParticleScoreState,
            )?.value,
          );
        });

        pensData.push({
          x: pen?.value || pen?.name || '',
          y:
            mid1ScaleAmount > 0
              ? parseFloat(
                  (mid1ScaleAmount / filteredScores?.length)?.toFixed(1),
                )
              : null,
        });
      } else {
        pensData.push({
          x: pen?.value || pen?.name || '',
          y: null,
        });
      }
    }
  });

  return pensData;
};

const getMid2TmrPenData = (tmrParticleScoreState, pensList) => {
  let pensData = [];
  pensList?.map(pen => {
    if (
      tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
        ?.length > 0
    ) {
      const filteredScores = tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
      ]?.filter(
        item =>
          item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
          (pen?.penId || pen?.sv_id || pen?.id),
        // (pen?.penId || pen?.id || pen?.localId),
      );

      if (filteredScores?.length > 0) {
        // let value = 0;
        let mid2ScaleAmount = 0;
        filteredScores?.map(item => {
          // value += parseFloat(
          //   convertStringToNumber(
          //     item?.[
          //       RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS
          //     ],
          //   ) || 0,
          // );

          mid2ScaleAmount += parseFloat(
            calculateOnScreenPercentTMR(
              item,
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID_2_SCALE_AMOUNT_IN_GRAMS,
              tmrParticleScoreState,
            )?.value,
          );
        });
        pensData.push({
          x: pen?.value || pen?.name || '',
          y:
            mid2ScaleAmount > 0
              ? parseFloat(
                  (mid2ScaleAmount / filteredScores?.length)?.toFixed(1),
                )
              : null,
        });
      } else {
        pensData.push({
          x: pen?.value || pen?.name || '',
          y: null,
        });
      }
    }
  });

  return pensData;
};

const getTrayTmrPenData = (tmrParticleScoreState, pensList) => {
  let pensData = [];
  pensList?.map(pen => {
    if (
      tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
        ?.length > 0
    ) {
      const filteredScores = tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
      ]?.filter(
        item =>
          item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
          (pen?.penId || pen?.sv_id || pen?.id),
        // (pen?.penId || pen?.id || pen?.localId),
      );

      if (filteredScores?.length > 0) {
        // let value = 0;
        let trayScaleAmount = 0;
        filteredScores?.map(item => {
          // value += parseFloat(
          //   convertStringToNumber(
          //     item?.[
          //       RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS
          //     ],
          //   ) || 0,
          // );

          trayScaleAmount += parseFloat(
            calculateOnScreenPercentTMR(
              item,
              RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY_SCALE_AMOUNT_IN_GRAMS,
              tmrParticleScoreState,
            )?.value,
          );
        });

        pensData.push({
          x: pen?.value || pen?.name || '',
          y:
            trayScaleAmount > 0
              ? parseFloat(
                  (trayScaleAmount / filteredScores?.length)?.toFixed(1),
                )
              : null,
        });
      } else {
        pensData.push({
          x: pen?.value || pen?.name || '',
          y: null,
        });
      }
    }
  });

  return pensData;
};

//#endregion

export const updateDimAndReplacePenInTmrParticleScore = (
  listData,
  pen,
  dim,
) => {
  const itemIndex = listData?.findIndex(item => {
    if (!stringIsEmpty(pen?.id) && !stringIsEmpty(item?.id)) {
      return item?.id === pen?.id;
    } else {
      return item?.localId === pen?.localId;
    }
  });

  if (itemIndex != -1) {
    listData[itemIndex].daysInMilk = dim == '0' ? 0 : Number(dim) || null;
    listData[itemIndex].isChanged = true;
  }

  return listData;
};

export const isDuplicateTmrName = (tmrParticleScoreState, tmrName) => {
  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    const tmrScores =
      tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES] || [];

    for (let index = 0; index < tmrScores?.length; index++) {
      if (
        tmrScores[index]?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORE_NAME] ==
        tmrName
      ) {
        return true;
      }
    }
    return false;
  }
  return false;
};

export const showHideScorerButton = (tmrScores, selectedPen) => {
  if (tmrScores?.length > 0) {
    const filteredPenScores = tmrScores?.filter(
      item =>
        item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
        (selectedPen?.sv_id || selectedPen?.id),
      // (selectedPen?.id || selectedPen?.localId),
    );

    if (filteredPenScores?.length >= 10) {
      return false;
    }
  }
  return true;
};

export const getFilteredPenScoresIndex = (
  tmrParticleScoreState,
  selectedPen,
) => {
  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    const filterList = tmrParticleScoreState?.[
      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
    ]?.filter(
      item =>
        item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
        (selectedPen?.id || selectedPen?.localId),
    );

    return filterList?.length + 1 || 1;
  }

  return 1;
};

export const updateTmrScoresDim = (tmrScoreState, payload) => {
  if (
    tmrScoreState &&
    tmrScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES] &&
    tmrScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]?.length > 0
  ) {
    const newTmrScores = tmrScoreState?.[
      RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
    ]?.map(item => {
      if (
        item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ===
        payload?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID]
      ) {
        item[RUMEN_HEALTH_TMR_PARTICLE_SCORE.DAYS_IN_MILK] =
          payload?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.DAYS_IN_MILK];
      }

      return item;
    });

    return newTmrScores;
  }
  return [];
};

export const filterSimilarTMRScoresByPens = (
  tmrParticleScoreState,
  pensList,
  isEditable = false,
) => {
  if (
    tmrParticleScoreState?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES]
      ?.length > 0
  ) {
    const filteredScores = [
      ...new Map(
        tmrParticleScoreState?.[
          RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES
        ]?.map(tmrScore => [
          tmrScore?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID],
          tmrScore,
        ]),
      )?.values(),
    ];

    if (isEditable && filteredScores?.length > 0) {
      filteredScores?.map(item => {
        const filteredPen = pensList?.find(
          pen =>
            // pen?.localId === item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ||
            pen?.sv_id === item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID] ||
            pen?.id === item?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.PEN_ID],
        );

        if (filteredPen) {
          item[RUMEN_HEALTH_TMR_PARTICLE_SCORE.DAYS_IN_MILK] =
            filteredPen?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.DAYS_IN_MILK];
        }
      });
    }

    return filteredScores;
  }

  return [];
};

const extractCurrentPenTmrFromState = (
  tmrParticleScore = {},
  selectedPen = {},
) => {
  const currentPenTmrScores = [];
  tmrParticleScore?.tmrScores?.forEach(tmrObj => {
    {
      if (
        tmrObj?.penId === selectedPen?.id ||
        tmrObj?.penId === selectedPen?.localId ||
        tmrObj?.penId === selectedPen?.sv_id
      ) {
        currentPenTmrScores.push(tmrObj);
      }
    }
  });
  return currentPenTmrScores;
};

const calculatePensSum = (tmrParticleScore, selectedPen) => {
  const currentPenTmrScores = extractCurrentPenTmrFromState(
    tmrParticleScore,
    selectedPen,
  );
  return currentPenTmrScores?.length > 0;
};

const calculateHerdSum = tmrParticleScore => {
  return tmrParticleScore?.length > 0;
};

export const shouldEnableResultsButton = (
  toolType,
  tmrParticleScore = [],
  selectedPen,
) => {
  switch (toolType) {
    case TOOL_ANALYSIS_TYPES.PEN_ANALYSIS:
      return calculatePensSum(tmrParticleScore, selectedPen);
    case TOOL_ANALYSIS_TYPES.HERD_ANALYSIS:
      return calculateHerdSum(tmrParticleScore);
    default:
      return true;
  }
};

export const extractUsedPensFromTMRParticleScoreTool = (
  tmrParticleScoreData = [],
  currentVisit,
) => {
  try {
    const usedPensPayload = [];

    if (tmrParticleScoreData?.length > 0) {
      const parsedVisitUsedPens = getParsedToolData(currentVisit?.usedPens);

      if (
        parsedVisitUsedPens &&
        parsedVisitUsedPens?.[VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE]?.length > 0
      ) {
        tmrParticleScoreData?.map(item => {
          const foundPen = usedPensPayload?.find(
            penId => penId === item?.penId,
          );

          if (foundPen) {
            return;
          } else {
            usedPensPayload.push(item?.penId);
          }
        });
      } else {
        const filteredWithSamePenId = tmrParticleScoreData?.filter(
          (o, index, arr) =>
            arr.findIndex(item => item?.penId === o?.penId) === index,
        );

        filteredWithSamePenId?.map(item => usedPensPayload.push(item?.penId));
      }
    }

    const payload = {
      [VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE]: usedPensPayload,
    };

    return payload;
  } catch (error) {
    console.log('error extractUsedPensFromTMRParticleScoreTool', error);
    logEvent(
      'helpers -> tmrParticleScoreHelper -> extractUsedPensFromTMRParticleScoreTool Error:',
      error,
    );
    return null;
  }
};

export function deletePenDataInsideTmrParticleScoreTool(
  tmrParticleScoreData,
  pen,
) {
  try {
    const parsedTmrScoreData = getParsedToolData(tmrParticleScoreData);

    if (parsedTmrScoreData) {
      const filteredPens = [];

      parsedTmrScoreData.tmrScores?.map(item => {
        if (item.penId !== pen) filteredPens.push(item);
      });

      parsedTmrScoreData.tmrScores = filteredPens;

      if (parsedTmrScoreData.tmrScores?.length <= 0) {
        return null;
      }
    }

    return parsedTmrScoreData;
  } catch (error) {
    logEvent(
      'helpers -> tmrParticleScoreHelper -> deletePenDataInsideTmrParticleScoreTool Error:',
      error,
    );
    return tmrParticleScoreData;
  }
}

export const extractTmrPenStatePens = (penList, tmrPenStateData) => {
  try {
    if (tmrPenStateData) {
      const extractedPens = [];

      const parsedTmrPenStateData = getParsedToolData(tmrPenStateData);
      const uniquePens = [
        ...new Map(
          (parsedTmrPenStateData?.tmrScores || [])?.map(item => [
            item?.penId,
            item,
          ]),
        ).values(),
      ];

      uniquePens.forEach(pen => {
        const isPenExist = penList.find(item => item?.sv_id === pen?.penId);
        if (!isPenExist) {
          extractedPens.push({
            ...isPenExist,
            ...pen,
          });
        } else {
          extractedPens.push(pen);
        }
      });

      return extractedPens;
    }

    return [];
  } catch (error) {
    logEvent(
      'helpers -> tmrParticleScoreHelper -> extractTmrPenStatePens error',
      error,
    );
    return [];
  }
};
