import {
  DATE_FORMATS,
  VISIT_STATUS,
  VISIT_TABLE_FIELDS,
} from '../constants/AppConstants';
import {
  convertNumberToString,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import {
  MANURE_SCREENER_TOOL,
  MUNARE_SCREENING_FIELDS,
} from '../constants/FormConstants';
import {
  MANURE_SCREENER_GOALS_TYPES,
  MANURE_SCREENER_GOALS_VALUES,
  MANURE_SCREENER_SUMMARY_ROW_HEADINGS,
} from '../constants/toolsConstants/ManureScreenerConstants';
import { dateHelper, getFormattedDate } from './dateHelper';
import { addSpace } from './genericHelper';
import i18n from '../localization/i18n';

// colors
import colors from '../constants/theme/variables/customColor';
import { getNumberFormatSettings } from 'react-native-localize';
import { getParsedToolData } from './genericHelper';
import { logEvent } from './logHelper';

const FIELD_LABELS = [
  MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS,
  MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS,
  MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS,
];

export const getDefaultFormValues = (
  pens = [],
  selectedVisits = [],
  overRideScores = [],
) => {
  return {
    [MUNARE_SCREENING_FIELDS.MST_SCORES]: pens?.map(pen => {
      if (overRideScores?.length) {
        let matchedScore = overRideScores?.find(
          score => score?.penId === pen?.sv_id || score?.penId === pen?.id,
        );

        if (matchedScore) {
          matchedScore.penId = !stringIsEmpty(pen?.sv_id)
            ? pen?.sv_id
            : pen?.id;
          matchedScore.name = pen?.name;
          return matchedScore;
        }
      }

      return {
        [MUNARE_SCREENING_FIELDS.VISITS_SELECTED]: [],
        [MUNARE_SCREENING_FIELDS.PEN_ID]: !stringIsEmpty(pen?.sv_id)
          ? pen?.sv_id
          : pen?.id,
        [MUNARE_SCREENING_FIELDS.PEN_NAME]: pen?.name,
        [MUNARE_SCREENING_FIELDS.MST_SCORE_ID]: '',
        [MUNARE_SCREENING_FIELDS.IS_TOOL_ITEM_NEW]: true,

        [MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS]: '',
        [MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS]: '',
        [MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS]: '',

        [MUNARE_SCREENING_FIELDS.MST_SCORE_NAME]: 'Manure Screener',
        [MUNARE_SCREENING_FIELDS.IS_FIRST_TIME_WITH_SCORE]: true,

        [MUNARE_SCREENING_FIELDS.OBSERVATION]: '',
        [MUNARE_SCREENING_FIELDS.TOOL_STATUS]: 'NotStarted',
      };
    }),

    [MUNARE_SCREENING_FIELDS.OBSERVATION]: '',
  };
};

//ok
export const parseManureScreenerData = (data, selectedVisits = []) => {
  return {
    [MUNARE_SCREENING_FIELDS.VISITS_SELECTED]: [],
    [MUNARE_SCREENING_FIELDS.PEN_ID]: !stringIsEmpty(data?.sv_id)
      ? data?.sv_id
      : data?.id,
    [MUNARE_SCREENING_FIELDS.PEN_NAME]: data?.name,
    [MUNARE_SCREENING_FIELDS.MST_SCORE_ID]: '',
    [MUNARE_SCREENING_FIELDS.IS_TOOL_ITEM_NEW]: true,

    [MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS]:
      convertNumberToString(
        parseFloat(data?.[MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS]),
      ) || '',
    [MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS]:
      convertNumberToString(
        parseFloat(data?.[MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS]),
      ) || '',
    [MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS]:
      convertNumberToString(
        parseFloat(
          data?.[MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS],
        ),
      ) || '',

    [MUNARE_SCREENING_FIELDS.MST_SCORE_NAME]:
      data?.[MUNARE_SCREENING_FIELDS.MST_SCORE_NAME] ||
      i18n.t('ManureScreening'),
    [MUNARE_SCREENING_FIELDS.IS_FIRST_TIME_WITH_SCORE]: true,

    [MUNARE_SCREENING_FIELDS.OBSERVATION]: data?.observation || '',
    [MUNARE_SCREENING_FIELDS.TOOL_STATUS]: 'NotStarted',
  };
};

//ok
export const saveManureScreenerData = (data, penList) => {
  let result = {};

  const pen = !!penList?.length
    ? penList.filter(el => el.id === data?.penId)
    : [];

  result = {
    [MUNARE_SCREENING_FIELDS.VISITS_SELECTED]: [],
    [MUNARE_SCREENING_FIELDS.PEN_ID]: data?.[MUNARE_SCREENING_FIELDS.PEN_ID],
    [MUNARE_SCREENING_FIELDS.PEN_NAME]:
      data?.[MUNARE_SCREENING_FIELDS.PEN_NAME],
    [MUNARE_SCREENING_FIELDS.MST_SCORE_ID]:
      data?.[MUNARE_SCREENING_FIELDS.MST_SCORE_ID],
    [MUNARE_SCREENING_FIELDS.IS_TOOL_ITEM_NEW]:
      data?.[MUNARE_SCREENING_FIELDS.MST_SCORE_ID],

    [MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS]: parseFloat(
      convertStringToNumber(
        data?.[MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS] || 0,
      ),
    ),
    [MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS]: parseFloat(
      convertStringToNumber(
        data?.[MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS] || 0,
      ),
    ),
    [MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS]: parseFloat(
      convertStringToNumber(
        data?.[MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS] || 0,
      ),
    ),

    [MUNARE_SCREENING_FIELDS.MST_SCORE_NAME]:
      data?.[MUNARE_SCREENING_FIELDS.MST_SCORE_NAME],
    [MUNARE_SCREENING_FIELDS.IS_FIRST_TIME_WITH_SCORE]:
      data?.[MUNARE_SCREENING_FIELDS.IS_FIRST_TIME_WITH_SCORE],

    [MUNARE_SCREENING_FIELDS.OBSERVATION]:
      data?.[MUNARE_SCREENING_FIELDS.OBSERVATION],
    [MUNARE_SCREENING_FIELDS.TOOL_STATUS]:
      data?.[MUNARE_SCREENING_FIELDS.TOOL_STATUS],
  };

  if (!!pen?.length) {
    if (!stringIsEmpty(pen[0].sv_id)) {
      result.penId = pen[0].sv_id;
    } else {
      result.penId = pen[0].id;
    }
    result.penName = pen[0]?.name;
  }

  return result;
};

const initialPenAnalysis = pen => {
  let penObj = {
    // daysInMilk: 0,
    penId: !stringIsEmpty(pen?.sv_id) ? pen.sv_id : pen?.id,
    // manureScores: { items: setCategory(), averageValue: 0 },
  };
  return penObj;
};

export const getSelectedPen = (allPensWithPenAnalysis, selectedPen) => {
  let currentToolAllPens = allPensWithPenAnalysis;
  if (currentToolAllPens?.length > 0) {
    currentToolAllPens = currentToolAllPens?.find(x => {
      if (
        !stringIsEmpty(x.penId) &&
        (x.penId === selectedPen.sv_id || x.penId === selectedPen.id)
      ) {
        return x;
      }
    });
  }
  if (
    !stringIsEmpty(currentToolAllPens) &&
    Array.isArray(allPensWithPenAnalysis)
  ) {
    return currentToolAllPens;
  } else {
    return initialPenAnalysis(selectedPen);
  }
};

// parsing manure score data
export const setManureScorePenData = manureScreenerTool => {
  if (manureScreenerTool?.length > 0) {
    let pens = JSON.parse(manureScreenerTool)?.pens;
    return pens;
  }
};

export const allPenAnalysis = value => {
  let pens = setManureScorePenData(value?.[MANURE_SCREENER_TOOL]);
  if (pens?.length > 0) {
    pens?.map(a => {
      return {
        ...a,
        penId: a.penId,
      };
    });
    return pens;
  } else {
    return initialPenAnalysis();
  }
};

export const parseManureScreenerInputs = manureScreener => {
  if (typeof manureScreener == 'string') {
    manureScreener = JSON.parse(manureScreener);
  }

  let obj = {};
  const arr = [];
  const data = manureScreener?.[MUNARE_SCREENING_FIELDS.MST_SCORES];
  data?.forEach(el => {
    obj = {
      ...el,
      [MUNARE_SCREENING_FIELDS.VISITS_SELECTED]: [],
      [MUNARE_SCREENING_FIELDS.PEN_ID]: el?.[MUNARE_SCREENING_FIELDS.PEN_ID],
      [MUNARE_SCREENING_FIELDS.PEN_NAME]:
        el?.[MUNARE_SCREENING_FIELDS.PEN_NAME],
      [MUNARE_SCREENING_FIELDS.MST_SCORE_ID]:
        el?.[MUNARE_SCREENING_FIELDS.MST_SCORE_ID],
      [MUNARE_SCREENING_FIELDS.IS_TOOL_ITEM_NEW]:
        el?.[MUNARE_SCREENING_FIELDS.MST_SCORE_ID],

      [MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS]: parseFloat(
        el?.[MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS] || 0,
      ),
      [MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS]: parseFloat(
        el?.[MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS] || 0,
      ),
      [MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS]: parseFloat(
        el?.[MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS] || 0,
      ),

      [MUNARE_SCREENING_FIELDS.TOP_GOAL_MAXIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.TOP_GOAL_MAXIMUM_PERCENT],
      [MUNARE_SCREENING_FIELDS.MID_GOAL_MAXIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.MID_GOAL_MAXIMUM_PERCENT],
      [MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MAXIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MAXIMUM_PERCENT],

      [MUNARE_SCREENING_FIELDS.TOP_GOAL_MINIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.TOP_GOAL_MINIMUM_PERCENT],
      [MUNARE_SCREENING_FIELDS.MID_GOAL_MINIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.MID_GOAL_MINIMUM_PERCENT],
      [MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MINIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MINIMUM_PERCENT],

      [MUNARE_SCREENING_FIELDS.MST_SCORE_NAME]:
        el?.[MUNARE_SCREENING_FIELDS.MST_SCORE_NAME],
      [MUNARE_SCREENING_FIELDS.IS_FIRST_TIME_WITH_SCORE]:
        el?.[MUNARE_SCREENING_FIELDS.IS_FIRST_TIME_WITH_SCORE],

      [MUNARE_SCREENING_FIELDS.OBSERVATION]:
        el?.[MUNARE_SCREENING_FIELDS.OBSERVATION],
      [MUNARE_SCREENING_FIELDS.TOOL_STATUS]:
        el?.[MUNARE_SCREENING_FIELDS.TOOL_STATUS],

      [MUNARE_SCREENING_FIELDS.TOP_GOAL_MAXIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.TOP_GOAL_MAXIMUM_PERCENT],
      [MUNARE_SCREENING_FIELDS.TOP_GOAL_MINIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.TOP_GOAL_MINIMUM_PERCENT],

      [MUNARE_SCREENING_FIELDS.MID_GOAL_MAXIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.MID_GOAL_MAXIMUM_PERCENT],
      [MUNARE_SCREENING_FIELDS.MID_GOAL_MINIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.MID_GOAL_MINIMUM_PERCENT],

      [MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MAXIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MAXIMUM_PERCENT],
      [MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MINIMUM_PERCENT]:
        el?.[MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MINIMUM_PERCENT],
    };
    arr.push(obj);
    obj = {};
  });
  return arr;
};

export const onUpdatedManureScreenerObj = ({
  data,
  localVisitId,
  visitData,
}) => {
  try {
    let { manureScreener } = visitData;
    let selectedPenData = data;
    let result = '';
    if (!stringIsEmpty(manureScreener)) {
      let parseToolData = '';
      if (typeof manureScreener == 'string') {
        parseToolData = JSON.parse(manureScreener);
      } else {
        parseToolData = manureScreener;
      }
      if (parseToolData?.pens?.length > 0) {
        let selectedIndex = parseToolData?.pens?.findIndex(
          a => a.penId == selectedPenData?.penId,
        );
        if (selectedIndex > -1) {
          parseToolData.pens[selectedIndex] = selectedPenData;
        } else {
          parseToolData?.pens.push(selectedPenData);
        }
      } else {
        parseToolData.pens = [];
        parseToolData?.pens.push(selectedPenData);
      }
      result = parseToolData;
    }
    // newly very first time pen analysis perform
    else {
      let newlyAdded = {
        localVisit: visitData.id,
        visitId: visitData.sv_id,
        pens: [selectedPenData],
      };
      result = newlyAdded;
    }
    return result;
  } catch (error) {
    logEvent(
      'helpers -> manureScreenerHelper -> onUpdatedManureScreenerObj Error:',
      error,
    );
  }
};

export const getInitialGoalsValue = (pen, selectedVisits) => {
  let goals = {
    [MUNARE_SCREENING_FIELDS.PEN_ID]: !stringIsEmpty(pen?.sv_id)
      ? pen?.sv_id
      : pen?.id || pen?.localId || '',
    [MUNARE_SCREENING_FIELDS.PEN_NAME]: pen?.name || '',
    [MUNARE_SCREENING_FIELDS.TOOL_STATUS]: VISIT_STATUS.IN_PROGRESS,

    [MUNARE_SCREENING_FIELDS.TOP_GOAL_MAXIMUM_PERCENT]:
      MANURE_SCREENER_GOALS_VALUES.TOP_GOAL_MAX,
    [MUNARE_SCREENING_FIELDS.TOP_GOAL_MINIMUM_PERCENT]:
      MANURE_SCREENER_GOALS_VALUES.TOP_GOAL_MIN,

    [MUNARE_SCREENING_FIELDS.MID_GOAL_MAXIMUM_PERCENT]:
      MANURE_SCREENER_GOALS_VALUES.MIDDLE_GOAL_MAX,
    [MUNARE_SCREENING_FIELDS.MID_GOAL_MINIMUM_PERCENT]:
      MANURE_SCREENER_GOALS_VALUES.MIDDLE_GOAL_MIN,

    [MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MAXIMUM_PERCENT]:
      MANURE_SCREENER_GOALS_VALUES.BOTTOM_GOAL_MAX,
    [MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MINIMUM_PERCENT]:
      MANURE_SCREENER_GOALS_VALUES.BOTTOM_GOAL_MIN,
  };
  return goals;
};

export const parseGoalsData = arr => {
  const goals = [];
  let obj = {};
  arr?.forEach((e, index) => {
    e?.goals?.forEach(v => {
      obj = {
        goalMax: !!e?.goalMax ? parseFloat(e?.goalMax) : 0,
        goalMin: !!e?.goalMax ? parseFloat(e?.goalMin) : 0,
        ...v,
      };
      goals.push(obj);
    });
  });
  return goals;
};

export const mstGoalsDataMapper = goal => {
  const TOP_GOAL = {
    id: MANURE_SCREENER_GOALS_TYPES.TOP,
    goalMin: convertNumberToString(
      goal?.[MUNARE_SCREENING_FIELDS.TOP_GOAL_MINIMUM_PERCENT] ||
        MANURE_SCREENER_GOALS_VALUES.TOP_GOAL_MIN,
    ),
    goalMax: convertNumberToString(
      goal?.[MUNARE_SCREENING_FIELDS.TOP_GOAL_MAXIMUM_PERCENT] ||
        MANURE_SCREENER_GOALS_VALUES.TOP_GOAL_MAX,
    ),
    label: MANURE_SCREENER_SUMMARY_ROW_HEADINGS[0],
  };
  const MID_GOAL = {
    id: MANURE_SCREENER_GOALS_TYPES.MIDDLE,
    goalMin: convertNumberToString(
      goal?.[MUNARE_SCREENING_FIELDS.MID_GOAL_MINIMUM_PERCENT] ||
        MANURE_SCREENER_GOALS_VALUES.MIDDLE_GOAL_MIN,
    ),
    goalMax: convertNumberToString(
      goal?.[MUNARE_SCREENING_FIELDS.MID_GOAL_MAXIMUM_PERCENT] ||
        MANURE_SCREENER_GOALS_VALUES.MIDDLE_GOAL_MAX,
    ),
    label: MANURE_SCREENER_SUMMARY_ROW_HEADINGS[1],
  };
  const BOTTOM_GOAL = {
    id: MANURE_SCREENER_GOALS_TYPES.BOTTOM,
    goalMin: convertNumberToString(
      goal?.[MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MINIMUM_PERCENT] ||
        MANURE_SCREENER_GOALS_VALUES.BOTTOM_GOAL_MIN,
    ),
    goalMax: convertNumberToString(
      goal?.[MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MAXIMUM_PERCENT] ||
        MANURE_SCREENER_GOALS_VALUES.BOTTOM_GOAL_MAX,
    ),
    label: MANURE_SCREENER_SUMMARY_ROW_HEADINGS[2],
  };

  return [TOP_GOAL, MID_GOAL, BOTTOM_GOAL];
};

export const mstGoalsToModel = (goalValues, selectedPen) => {
  if (goalValues?.length > 0) {
    const mstGoal = goalValues?.reduce((acu, current) => {
      switch (current?.id) {
        case MANURE_SCREENER_GOALS_TYPES.TOP:
          return {
            ...acu,
            [MUNARE_SCREENING_FIELDS.TOP_GOAL_MINIMUM_PERCENT]: parseFloat(
              convertStringToNumber(current?.goalMin) || 0,
            ),
            [MUNARE_SCREENING_FIELDS.TOP_GOAL_MAXIMUM_PERCENT]: parseFloat(
              convertStringToNumber(current?.goalMax) || 0,
            ),
          };

        case MANURE_SCREENER_GOALS_TYPES.MIDDLE:
          return {
            ...acu,
            [MUNARE_SCREENING_FIELDS.MID_GOAL_MINIMUM_PERCENT]: parseFloat(
              convertStringToNumber(current?.goalMin) || 0,
            ),
            [MUNARE_SCREENING_FIELDS.MID_GOAL_MAXIMUM_PERCENT]: parseFloat(
              convertStringToNumber(current?.goalMax) || 0,
            ),
          };

        case MANURE_SCREENER_GOALS_TYPES.BOTTOM:
          return {
            ...acu,
            [MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MINIMUM_PERCENT]: parseFloat(
              convertStringToNumber(current?.goalMin) || 0,
            ),
            [MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MAXIMUM_PERCENT]: parseFloat(
              convertStringToNumber(current?.goalMax) || 0,
            ),
          };

        default:
          return current;
      }
    }, {});

    if (selectedPen) {
      mstGoal.penId = selectedPen?.sv_id || selectedPen?.id;
      mstGoal.penName = selectedPen?.name;
    }

    return mstGoal;
  }
};

export const getUpdatedMinGoal = (value = '0', goalValues, goal) => {
  const regionSettings = getNumberFormatSettings();

  const updatedGoals = goalValues?.map(item => {
    if (item?.id === goal?.id) {
      if (
        value &&
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

export const getUpdatedMaxGoal = (value = '0', goalValues, goal) => {
  const regionSettings = getNumberFormatSettings();

  const updatedGoals = goalValues?.map(item => {
    if (item?.id === goal?.id) {
      if (
        value &&
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

export const calculateOnScreenPercent = ({ sumAll, score, isEditable }) => {
  if (stringIsEmpty(score)) {
    if (!isEditable) {
      return '-';
    }
    return 0;
  }
  const output = (parseFloat(score) / sumAll) * 100;
  return Number(output.toFixed(1));
};

const sumAllScores = (scaleValues = []) =>
  scaleValues?.reduce((acc, cur) => {
    if (stringIsEmpty(cur)) {
      return acc + 0;
    }
    const sum = parseFloat(cur) + parseFloat(acc);
    return parseFloat(sum?.toFixed(1)) || 0;
  }, 0);

const getGoalValues = (goalType, score, DEFAULT_GOAL_VALUE) => {
  return score?.[goalType] ? parseFloat(score?.[goalType]) : DEFAULT_GOAL_VALUE;
};

const scorePayload = (score = {}, sumAll, scaleValues = [], isEditable) => {
  return {
    [MANURE_SCREENER_GOALS_TYPES.TOP]: {
      goalMax: getGoalValues(
        MUNARE_SCREENING_FIELDS.TOP_GOAL_MAXIMUM_PERCENT,
        score,
        MANURE_SCREENER_GOALS_VALUES.TOP_GOAL_MAX,
      ),
      goalMin: getGoalValues(
        MUNARE_SCREENING_FIELDS.TOP_GOAL_MINIMUM_PERCENT,
        score,
        MANURE_SCREENER_GOALS_VALUES.TOP_GOAL_MIN,
      ),
      onScreenPercent: calculateOnScreenPercent({
        sumAll,
        score: scaleValues[0],
        isEditable,
      }),
    },
    [MANURE_SCREENER_GOALS_TYPES.MIDDLE]: {
      goalMax: getGoalValues(
        MUNARE_SCREENING_FIELDS.MID_GOAL_MAXIMUM_PERCENT,
        score,
        MANURE_SCREENER_GOALS_VALUES.MIDDLE_GOAL_MAX,
      ),
      goalMin: getGoalValues(
        MUNARE_SCREENING_FIELDS.MID_GOAL_MINIMUM_PERCENT,
        score,
        MANURE_SCREENER_GOALS_VALUES.MIDDLE_GOAL_MIN,
      ),
      onScreenPercent: calculateOnScreenPercent({
        sumAll,
        score: scaleValues[1],
        isEditable,
      }),
    },
    [MANURE_SCREENER_GOALS_TYPES.BOTTOM]: {
      goalMin: getGoalValues(
        MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MINIMUM_PERCENT,
        score,
        MANURE_SCREENER_GOALS_VALUES.BOTTOM_GOAL_MIN,
      ),

      goalMax: getGoalValues(
        MUNARE_SCREENING_FIELDS.BOTTOM_GOAL_MAXIMUM_PERCENT,
        score,
        MANURE_SCREENER_GOALS_VALUES.BOTTOM_GOAL_MAX,
      ),
      onScreenPercent: calculateOnScreenPercent({
        sumAll,
        score: scaleValues[2],
        isEditable,
      }),
    },
  };
};

export const getSummaryData = ({ labels, score, isEditable = false }) => {
  const scaleValues = [
    score?.[MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS],
    score?.[MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS],
    score?.[MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS],
  ];
  const sumAll = sumAllScores(scaleValues);
  const payload = scorePayload(score, sumAll, scaleValues, isEditable);

  const [TOP, MIDDLE, BOTTOM] = [0, 1, 2];
  const result = labels?.map((label, index) => {
    switch (index) {
      case TOP:
        return { ...label, ...payload?.[MANURE_SCREENER_GOALS_TYPES.TOP] };
      case MIDDLE:
        return { ...label, ...payload?.[MANURE_SCREENER_GOALS_TYPES.MIDDLE] };
      case BOTTOM:
        return { ...label, ...payload?.[MANURE_SCREENER_GOALS_TYPES.BOTTOM] };
      default:
        break;
    }
  });
  return result?.length ? result : [];
};

export const isOddByThree = (index, landscapeModalVisible) =>
  index % 3 && !landscapeModalVisible;

export const setPenAnalysisGraphData = graphData => {
  try {
    let penData = graphData?.map((visit, index) => {
      return {
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
      };
    });
    let penAnalysisGraph = {
      data: penData,
      domain: { y: [0, 100] },
      gradientId: 'default',
      gradientStyles: [],
    };
    return [penAnalysisGraph];
  } catch (error) {
    logEvent(
      'helpers -> manureScreenerHelper -> setPenAnalysisGraphData Error:',
      error,
    );
  }
};

//graph working
export const getFormattedRecentVisits = recentVisits => {
  const data = recentVisits.map(visitObj => {
    const allData = visitObj?.[MANURE_SCREENER_TOOL]
      ? JSON.parse(visitObj?.[MANURE_SCREENER_TOOL])
      : null;
    return {
      manureScreener: allData || null,
      visitId: visitObj?.id,
      date: visitObj?.visitDate,
      mobileLastUpdatedTime: visitObj?.mobileLastUpdatedTime,
    };
  });
  return data;
};

export const parseManureScoreGraphData = (
  recentVisits,
  selectedManure,
  goals,
  name,
) => {
  const topDataPoints = getTopDataPoints(recentVisits, selectedManure);
  const middleDataPoints = getMiddleDataPoints(recentVisits, selectedManure);
  const bottomDataPoints = getBottomDataPoints(recentVisits, selectedManure);

  const data = [
    {
      dataPoints: topDataPoints,
      minDataPoints: getTopMinDataPoints(recentVisits, selectedManure),
      maxDataPoints: getTopMaxDataPoints(
        recentVisits,
        selectedManure,
        topDataPoints,
      ),
      onScreeColor: colors.topScaleColor,
      minColor: colors.topGoalMinColor,
      maxColor: colors.topGoalMaxColor,
    },
    {
      dataPoints: middleDataPoints,
      maxDataPoints: getMiddleMaxDataPoints(
        recentVisits,
        selectedManure,
        middleDataPoints,
      ),
      minDataPoints: getMiddleMinDataPoints(recentVisits, selectedManure),
      onScreeColor: colors.middleScaleColor,
      minColor: colors.middleGoalMinColor,
      maxColor: colors.middleGoalMaxColor,
    },
    {
      dataPoints: bottomDataPoints,
      maxDataPoints: getBottomMaxDataPoints(
        recentVisits,
        selectedManure,
        bottomDataPoints,
      ),
      minDataPoints: getBottomMinDataPoints(recentVisits, selectedManure),
      onScreeColor: colors.bottomScaleColor,
      minColor: colors.bottomGoalMinColor,
      maxColor: colors.bottomGoalMaxColor,
    },
  ];
  return data;
};

export const getTopMaxDataPoints = (
  recentVisits,
  selectedManure,
  topDataPoints,
) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const goals = visit?.manureScreener?.mstGoal;
    const mstScores = visit?.manureScreener?.mstScores;

    const topValue = topDataPoints[index]?.y || 0;
    let topGoalMax = parseFloat(goals?.topGoalMaximumPercent || 0);

    let y = topGoalMax;
    if (topGoalMax > topValue) {
      y = topGoalMax - topValue;
    } else {
      y = 0;
    }

    if (y > 0 && y > goals?.topGoalMinimumPercent) {
      y = y - goals?.topGoalMinimumPercent;
    }

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (pen) {
      data.push({
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y,
      });
    }
  });
  return data;
};

export const getMiddleMaxDataPoints = (
  recentVisits,
  selectedManure,
  middleDataPoints,
) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const goals = visit?.manureScreener?.mstGoal;
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (pen) {
      const middleValue = middleDataPoints[index]?.y || 0;
      let midGoalMax = parseFloat(goals?.midGoalMaximumPercent || 0);

      let y = midGoalMax;
      if (midGoalMax > middleValue) {
        y = midGoalMax - middleValue;
      } else {
        y = 0;
      }

      if (y > 0 && y >= goals?.midGoalMinimumPercent) {
        y = y - goals?.midGoalMinimumPercent;
      }

      data.push({
        x: getFormattedDate(visit?.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y,
      });
    }
  });
  return data;
};

export const getBottomMaxDataPoints = (
  recentVisits,
  selectedManure,
  bottomDataPoints,
) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const goals = visit?.manureScreener?.mstGoal;
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (pen) {
      const bottomValue = bottomDataPoints[index]?.y || 0;
      let bottomGoalMax = parseFloat(goals?.bottomGoalMaximumPercent || 0);

      let y = bottomGoalMax;
      if (bottomGoalMax > bottomValue) {
        y = bottomGoalMax - bottomValue;
      } else {
        y = 0;
      }

      if (y > 0 && y > goals?.bottomGoalMinimumPercent) {
        y = y - goals?.bottomGoalMinimumPercent;
      }
      data.push({
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y,
      });
    }
  });
  return data;
};

export const getTopMinDataPoints = (recentVisits, selectedManure) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const goals = visit?.manureScreener?.mstGoal;
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (pen) {
      data.push({
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y: goals?.topGoalMinimumPercent,
      });
    }
  });
  return data;
};

export const getMiddleMinDataPoints = (recentVisits, selectedManure) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const goals = visit?.manureScreener?.mstGoal;
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (pen) {
      data.push({
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y: goals?.midGoalMinimumPercent,
      });
    }
  });
  return data;
};

export const getBottomMinDataPoints = (recentVisits, selectedManure) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const goals = visit?.manureScreener?.mstGoal;
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (pen) {
      data.push({
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y: goals?.bottomGoalMinimumPercent,
      });
    }
  });
  return data;
};
export const getTopDataPoints = (recentVisits, selectedManure) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const goals = visit?.manureScreener?.mstGoal;
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (pen) {
      const top = !!(
        pen?.topScaleAmountInGrams >= 0 && pen?.topScaleAmountInGrams != null
      )
        ? parseFloat(
            getOnScreenPercent(
              MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS,
              pen,
            ),
          )
        : null;

      let topValue = top;

      data.push({
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y: topValue,
        onScreen: topValue > 0 ? top : 0,
      });
    }
  });
  return data;
};

export const getMiddleDataPoints = (recentVisits, selectedManure) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    const mid = !!(
      pen?.midScaleAmountInGrams >= 0 && pen?.midScaleAmountInGrams != null
    )
      ? parseFloat(
          getOnScreenPercent(
            MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS,
            pen,
          ),
        )
      : null;

    let midValue = mid;

    if (pen) {
      data.push({
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y: midValue,
        onScreen: midValue > 0 ? mid : 0,
      });
    }
  });
  return data;
};

export const getBottomDataPoints = (recentVisits, selectedManure) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);
    const bottom = !!(
      pen?.bottomScaleAmountInGrams >= 0 &&
      pen?.bottomScaleAmountInGrams != null
    )
      ? parseFloat(
          getOnScreenPercent(
            MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS,
            pen,
          ),
        )
      : null;
    let bottomValue = bottom;

    if (pen) {
      data.push({
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y: bottomValue,
        onScreen: bottomValue ? bottom : 0,
      });
    }
  });
  return data;
};

const getOnScreenPercent = (index, el) => {
  let sum = 0;
  const value = el?.[index] || 0;

  for (const key in el) {
    if (typeof el[key] == 'number' || FIELD_LABELS.includes(key)) {
      if (!!el[key]) sum = sum + parseFloat(el[key]);
    }
  }

  if (!!sum) {
    const onScreen = (value / sum) * 100;
    return parseFloat(onScreen)?.toFixed(1);
  } else {
    return 0;
  }
};

export const getGraphLegends = recentVisits => {
  return recentVisits?.map(
    (visit, index) =>
      getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
  );
};

export const exportManureScreenerGraph = (
  visitState,
  recentVisits,
  selectedManure,
  goals,
  name,
) => {
  const { visit } = visitState || {};
  const visitDate = dateHelper.getFormattedDate(
    visit?.visitDate,
    DATE_FORMATS.MMM_DD_YY_H_MM,
  );

  let data = [];
  recentVisits?.map(visit => {
    const goals = visit?.manureScreener?.mstGoal;
    const mstScores = visit?.manureScreener?.mstScores;

    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (!!pen) {
      data.push({
        visitDate: getFormattedDate(visit?.date, DATE_FORMATS.MM_dd),
        topGoalMin: goals?.topGoalMinimumPercent || 0,
        topGoalMax: goals?.topGoalMaximumPercent || 0,
        middleGoalMin: goals?.midGoalMinimumPercent || 0,
        middleGoalMax: goals?.midGoalMaximumPercent || 0,
        bottomGoalMin: goals?.bottomGoalMinimumPercent || 0,
        bottomGoalMax: goals?.bottomGoalMaximumPercent || 0,
        bottom: !!(
          pen?.bottomScaleAmountInGrams >= 0 &&
          pen?.bottomScaleAmountInGrams != null
        )
          ? parseFloat(
              getOnScreenPercent(
                MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS,
                pen,
              ),
            )
          : null,

        // middle
        middle: !!(
          pen?.midScaleAmountInGrams >= 0 && pen?.midScaleAmountInGrams != null
        )
          ? parseFloat(
              getOnScreenPercent(
                MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS,
                pen,
              ),
            )
          : null,

        //top
        top: !!(
          pen?.topScaleAmountInGrams >= 0 && pen?.topScaleAmountInGrams != null
        )
          ? parseFloat(
              getOnScreenPercent(
                MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS,
                pen,
              ),
            )
          : null,
      });
    }
  });

  return {
    fileName: `${visit?.visitName}-${i18n.t('ManureScreener')}`,
    visitName: visit?.visitName,
    visitDate: visitDate,
    penName: name || '',
    toolName: i18n.t('ManureScreener'),
    analysisType: i18n.t('penAnalysis'),
    onScreenPercentage: [...data],
  };
};

export const penExistsInPublishedVisit = (
  isEditable = false,
  penAnalysisData = [], //all pens and their data
  selectedPen = {}, //currently selected pen
) => {
  if (!isEditable) {
    let selectedPenId = '';
    if (!stringIsEmpty(selectedPen?.sv_id)) {
      selectedPenId = selectedPen?.sv_id;
    } else if (!stringIsEmpty(selectedPen?.id)) {
      selectedPenId = selectedPen?.id;
    } else {
      selectedPenId = selectedPen?.localId;
    }
    const filteredPen = penAnalysisData?.mstScores?.filter(
      penObj => penObj?.penId === selectedPenId,
    );
    if (filteredPen && filteredPen?.length > 0) {
      return true;
    }
    return false;
  }
  return true;
};

export const calculatePensSum = penAnalysisObject => {
  let sum = 0;
  sum +=
    convertStringToNumber(
      penAnalysisObject?.[MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS],
    ) +
    convertStringToNumber(
      penAnalysisObject?.[MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS],
    ) +
    convertStringToNumber(
      penAnalysisObject?.[MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS],
    );
  return sum > 0;
};

export const exportManureScreenerPenBodyData = (
  recentVisits,
  selectedManure,
) => {
  let visitDates = [];
  let top = [],
    mid1 = [],
    mid2 = [],
    goalTop = [],
    goalMid = [],
    goalBottom = [];

  let penObj = selectedManure;

  recentVisits?.map(visit => {
    const mstScores = visit?.manureScreener?.mstScores;
    const pen =
      !!mstScores?.length &&
      mstScores?.find(el => el.penId == selectedManure?.penId);

    if (!!pen) {
      penObj = pen;
      const goals = visit?.manureScreener?.mstGoal || getInitialGoalsValue(pen);

      visitDates.push(getFormattedDate(visit?.date, DATE_FORMATS.MM_dd_YYYY));

      //top
      top.push(
        !!(
          pen?.topScaleAmountInGrams >= 0 && pen?.topScaleAmountInGrams != null
        )
          ? parseFloat(
              getOnScreenPercent(
                MUNARE_SCREENING_FIELDS.TOP_SCALE_AMOUNT_IN_GRAMS,
                pen,
              ),
            )
          : null,
      );

      // middle
      mid1.push(
        !!(
          pen?.midScaleAmountInGrams >= 0 && pen?.midScaleAmountInGrams != null
        )
          ? parseFloat(
              getOnScreenPercent(
                MUNARE_SCREENING_FIELDS.MID_SCALE_AMOUNT_IN_GRAMS,
                pen,
              ),
            )
          : null,
      );

      // bottom
      mid2.push(
        !!(
          pen?.bottomScaleAmountInGrams >= 0 &&
          pen?.bottomScaleAmountInGrams != null
        )
          ? parseFloat(
              getOnScreenPercent(
                MUNARE_SCREENING_FIELDS.BOTTOM_SCALE_AMOUNT_IN_GRAMS,
                pen,
              ),
            )
          : null,
      );

      goalTop.push(
        `${goals?.topGoalMinimumPercent || 0} | ${
          goals?.topGoalMaximumPercent || 0
        }`,
      );

      goalMid.push(
        `${goals?.midGoalMinimumPercent || 0} | ${
          goals?.midGoalMaximumPercent || 0
        }`,
      );

      goalBottom.push(
        `${goals?.bottomGoalMinimumPercent || 0} | ${
          goals?.bottomGoalMaximumPercent || 0
        }`,
      );
    }
  });

  return {
    screenerName: selectedManure?.mstScoreName || '',
    observation: selectedManure?.observation || '',
    toolName: i18n.t('ManureScreener'),
    analysisType: i18n.t('penAnalysis'),
    penName: penObj?.penName,
    penId: penObj?.penId,
    top,
    mid1,
    mid2,
    goalTop,
    goalMid,
    goalBottom,
    visitDates,
  };
};

export const exportManureScreenerGraphDataForVisitReport = (
  recentVisits,
  selectedManure,
) => {
  const topDataPoints = getTopDataPoints(recentVisits, selectedManure);
  const middleDataPoints = getMiddleDataPoints(recentVisits, selectedManure);
  const bottomDataPoints = getBottomDataPoints(recentVisits, selectedManure);

  const graphArray = [
    {
      dataPoints: topDataPoints,
      minDataPoints: getTopMinDataPoints(recentVisits, selectedManure),
      maxDataPoints: getTopMaxDataPoints(
        recentVisits,
        selectedManure,
        topDataPoints,
      ),
      onScreeColor: colors.topScaleColor,
      minColor: colors.topGoalMinColor,
      maxColor: colors.topGoalMaxColor,
    },
    {
      dataPoints: middleDataPoints,
      maxDataPoints: getMiddleMaxDataPoints(
        recentVisits,
        selectedManure,
        middleDataPoints,
      ),
      minDataPoints: getMiddleMinDataPoints(recentVisits, selectedManure),
      onScreeColor: colors.middleScaleColor,
      minColor: colors.middleGoalMinColor,
      maxColor: colors.middleGoalMaxColor,
    },
    {
      dataPoints: bottomDataPoints,
      maxDataPoints: getBottomMaxDataPoints(
        recentVisits,
        selectedManure,
        bottomDataPoints,
      ),
      minDataPoints: getBottomMinDataPoints(recentVisits, selectedManure),
      onScreeColor: colors.bottomScaleColor,
      minColor: colors.bottomGoalMinColor,
      maxColor: colors.bottomGoalMaxColor,
    },
  ];

  return graphArray;
};

export const extractUsedPensFromManureScreeningTool = (
  manureScreeningPen = null,
  currentVisit,
) => {
  try {
    let usedPensPayload = [];

    if (manureScreeningPen) {
      const parsedVisitUsedPens = getParsedToolData(currentVisit?.usedPens);

      if (
        parsedVisitUsedPens &&
        parsedVisitUsedPens?.[VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL]?.length >
          0
      ) {
        usedPensPayload =
          parsedVisitUsedPens?.[VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL];

        const parsedManureScreener = getParsedToolData(
          currentVisit.manureScreener,
        );

        const isPenExist = parsedManureScreener?.mstScores?.find(
          item => item?.penId === manureScreeningPen?.pen?.penId,
        );
        if (!isPenExist) {
          usedPensPayload.push(manureScreeningPen?.pen?.penId);
        }
      } else {
        usedPensPayload.push(manureScreeningPen?.pen?.penId);
      }
    }

    const payload = {
      [VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL]: usedPensPayload,
    };

    return payload;
  } catch (error) {
    logEvent(
      'helpers -> manureScreenerHelper -> extractUsedPensFromManureScreeningTool Error:',
      error,
    );
    return null;
  }
};

export function deletePenDataInsideManureScreenerTool(manureScreenerData, pen) {
  try {
    const parsedManureScreenerData = getParsedToolData(manureScreenerData);

    if (parsedManureScreenerData) {
      const filteredPens = [];

      parsedManureScreenerData.mstScores?.map(item => {
        if (item.penId !== pen) filteredPens.push(item);
      });

      parsedManureScreenerData.mstScores = filteredPens;

      if (parsedManureScreenerData.mstScores?.length <= 0) {
        return null;
      }
    }

    return parsedManureScreenerData;
  } catch (error) {
    logEvent(
      'helpers -> manureScreenerHelper -> deletePenDataInsideManureScreenerTool Error:',
      error,
    );
    return manureScreenerData;
  }
}

export const extractManureScreenerPens = (penList, manureScreenerData) => {
  try {
    if (manureScreenerData) {
      const extractedPens = [];

      const parsedManureScreenerData = getParsedToolData(manureScreenerData);
      parsedManureScreenerData?.mstScores?.map(pen => {
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
      'helpers -> manureScreenerHelper -> extractManureScreenerPens error',
      error,
    );
    return [];
  }
};
