// constants
import { format } from 'date-fns';
import {
  COUNTER,
  DATE_FORMATS,
  LACTATION_STAGE,
  LACTATION_STAGE_KEY,
  TOOL_ANALYSIS_TYPES,
} from '../constants/AppConstants';
import { RUMEN_HEALTH_CUD_CHEWING_FIELDS } from '../constants/FormConstants';

// styles
import colors from '../constants/theme/variables/customColor';

// localization
import i18n from '../localization/i18n';

// helpers
import { stringIsEmpty } from './alphaNumericHelper';
import { getLactationStage, getLactationStageKey } from './toolHelper';
import { dateHelper } from './dateHelper';
import { PEN_ANALYSIS_CUD_CHEWING_DROPDOWN } from '../constants/toolsConstants/RumenHealthCudChewingConstants';
import {
  addSpace,
  convertInputNumbersToRegionalBasis,
  getParsedToolData,
} from './genericHelper';
import { logEvent } from './logHelper';

export const initializeRumenHealthCudChewingPayload = ({
  visitId,
  pen,
  enumState,
}) => {
  const goals = initializeGoals(enumState);

  if (pen?.id || pen?.localId) {
    const cudChewingPayload = {
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.VISIT_ID]: '',
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]: [
        {
          [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID]: pen?.id || pen?.localId,
          [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_NAME]:
            pen?.value || pen?.name || '',
          // [RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK]:
          //   pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK] || null,
          [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT]: [
            {
              [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COW_NUMBER]: 1,
              [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT]: 0,
            },
          ],
          [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT]: {
            [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES]: 0,
            [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_NO]: 0,
            [RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT]: 0,
            [RUMEN_HEALTH_CUD_CHEWING_FIELDS.YES_PERCENT]: 0,
            [RUMEN_HEALTH_CUD_CHEWING_FIELDS.NO_PERCENT]: 0,
          },
        },
      ],
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.GOALS]: goals || [],
    };

    return cudChewingPayload;
  } else {
    return null;
  }
};

export const saveRumenHealthCudChewingHerdData = (
  pensList,
  penAnalysisData,
  selectedPen = {},
) => {
  //TODO: create better naming convention
  const e = penAnalysisData?.pens?.[0] || {};
  // const pen = pensList?.[0] || {};
  const pen =
    pensList?.length > 0
      ? pensList?.filter(
        pen =>
          // e?.penId ==
          // (pen?.sv_id || pen?.id || pen?.localId || pen?.localPenId),
          pen?.sv_id == e?.penId ||
          pen?.id == e?.penId ||
          pen?.localId == e?.penId ||
          pen?.localPenId == e?.penId,
      )[0]
      : {};
  let penObj = {};
  if (
    e.penId == pen?.sv_id ||
    e.penId == pen?.id ||
    e.penId == pen?.localId ||
    e.penId == pen?.localPenId
  ) {
    penObj = {
      ...e,
      daysInMilk: pen?.daysInMilk ? pen?.daysInMilk : null,
    };
  } else {
    penObj = {
      daysInMilk: pen?.daysInMilk ? pen?.daysInMilk : null,
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_NAME]: pen?.value || '',
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID]: pen?.id || pen?.localId,
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT]: [
        {
          [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COW_NUMBER]: 1,
          [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT]: 0,
        },
      ],
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT]: {
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES]: 0,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_NO]: 0,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT]: 0,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.YES_PERCENT]: 0,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.NO_PERCENT]: 0,
      },
    };
  }

  if (Object.keys(penObj)?.length) {
    let pens = penAnalysisData?.pens || [];
    const filteredPenIndex = pens?.findIndex(
      penItem => penItem?.penId == penObj?.penId,
    );
    if (filteredPenIndex > -1) {
      pens[filteredPenIndex] = { ...penObj };
    } else {
      pens.push({ ...penObj });
    }
    //OVERWRITES PEN-X OBJECT HERE WITH PEN1 OBJECT - YIELDS WRONG DATA
    // pens[0] = { ...penObj };

    const obj = {
      ...penAnalysisData,
      pens: [...pens],
    };
    return obj;
  } else {
    return { ...penAnalysisData };
  }
};

export const addCudChewingPenHelper = ({ pen }) => {
  //invoked function in additional places - causes it to have an empty pen argument at times
  //if pen is empty/null then don't create "ghost" object of pen
  if ((!pen?.id && !pen?.localId && !pen?.sv_id) || !pen?.name) {
    // if ((!pen?.id && !pen?.localId && !pen?.sv_id) || !pen?.value) {
    // if ((!pen?.sv_id && !pen?.id) || !pen?.name) {
    return;
  }
  const penData = {
    [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID]:
      pen?.id || pen?.localId || pen?.sv_id || '',
    // [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID]: pen?.sv_id || pen?.id || '',
    [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_NAME]: pen?.value || pen?.name || '',
    // [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_NAME]: pen?.name || '',
    [RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK]:
      pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK] || null,
    [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT]: [
      {
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COW_NUMBER]: 1,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT]: 0,
      },
    ],
    [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT]: {
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES]: 0,
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_NO]: 0,
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT]: 0,
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.YES_PERCENT]: 0,
      [RUMEN_HEALTH_CUD_CHEWING_FIELDS.NO_PERCENT]: 0,
    },
  };

  return penData;
};

const initializeGoals = enumState => {
  const data = [];

  if (enumState?.lactationStages && enumState?.lactationStages?.length > 0) {
    enumState?.lactationStages?.map((item, index) => {
      if (index >= 7) return;
      const payload = {
        id: index,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.STAGE]: item?.key,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PERCENT_CHEWING]: 60,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS]: 65,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.RANGE_STRING]: '',
      };

      data.push(payload);
    });
  }

  return data;
};

// generate new cow data and returns new pens array
export const addNewCowHelper = (penAnalysisData, penId) => {
  if (
    penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS] &&
    penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.length > 0
  ) {
    const updatedPensArray = penAnalysisData?.[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS
    ]?.map(pen => {
      if (pen?.penId === penId) {
        const cowPayload = {
          [RUMEN_HEALTH_CUD_CHEWING_FIELDS.COW_NUMBER]:
            pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT]?.length +
            COUNTER.INCREMENT_ONE,
          [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT]: 0,
        };

        pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT]?.push(
          cowPayload,
        );

        return pen;
      }
      return pen;
    });

    return updatedPensArray || [];
  } else {
    return [];
  }
};

// update chews count for selected cow
export const updatedChewsCount = (
  cowNumber,
  cudChewingPenData,
  countValue = 0,
) => {
  cudChewingPenData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT]?.map(
    item => {
      if (item?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.COW_NUMBER] === cowNumber) {
        item[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT] += countValue;
      }
    },
  );

  return cudChewingPenData;
};

// update chews count for selected cow
export const updatedChewsCountInput = (
  cowNumber,
  cudChewingPenData,
  countValue = 0,
) => {
  let _previousCount = 0;
  cudChewingPenData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT]?.map(
    item => {
      if (item?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.COW_NUMBER] === cowNumber) {
        _previousCount = item[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT];
        item[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT] = countValue;
      }
    },
  );

  return { updateCowChewsPen: cudChewingPenData, _previousCount };
};

// sum function
const updateTotalCount = (yesCount, noCount) => {
  return yesCount + noCount;
};

// generic percentage function
const getPercentage = (value, totalCount) => {
  if (value === 0 && totalCount === 0) return 0;
  return (value / totalCount) * 100;
};

// @description function to return array of updated countYes value in cud chewing pens
export const updatedChewingPensCountYes = (
  cudChewingCowsCount,
  countValue = 0,
) => {
  if (cudChewingCowsCount) {
    // update yes count value
    cudChewingCowsCount[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES
    ] += countValue;

    // update total count value
    cudChewingCowsCount[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT
    ] = updateTotalCount(
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES],
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_NO],
    );

    // update yes percentage
    cudChewingCowsCount[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.YES_PERCENT
    ] = getPercentage(
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES],
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT],
    );

    // update no percentage
    cudChewingCowsCount[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.NO_PERCENT
    ] = getPercentage(
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_NO],
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT],
    );
  }

  return cudChewingCowsCount || 0;
};

// @description function to return array of updated countNo value in cud chewing pens
export const updatedChewingPensCountNo = (
  cudChewingCowsCount,
  countValue = 0,
) => {
  if (cudChewingCowsCount) {
    cudChewingCowsCount[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_NO
    ] += countValue;

    // update total count value
    cudChewingCowsCount[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT
    ] = updateTotalCount(
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES],
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_NO],
    );

    // update yes percentage
    cudChewingCowsCount[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.YES_PERCENT
    ] = getPercentage(
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES],
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT],
    );

    // update no percentage
    cudChewingCowsCount[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.NO_PERCENT
    ] = getPercentage(
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_NO],
      cudChewingCowsCount[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
      ][RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT],
    );
  }

  return cudChewingCowsCount || 0;
};

// validate if selected pen exist in pen analysis data
export const isPenExist = ({ pen, penAnalysisData }) => {
  const penData = penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.find(
    item =>
      item?.penId === pen?.id ||
      item?.penId === pen?.localId ||
      item?.penId === pen?.sv_id,
    // item => item?.penId === (pen?.sv_id || pen?.id),
  );

  return penData;
};

export const replaceCudChewingObject = ({
  penId,
  cudChewingCount,
  pensList,
}) => {
  const indexOfPen = pensList.findIndex(pen => pen?.penId === penId);

  pensList.splice(indexOfPen, 1, cudChewingCount);

  return pensList;
};

export const replaceCudChewsCountObject = ({
  penId,
  updateCowChewsPen,
  pensList,
}) => {
  const indexOfPen = pensList?.findIndex(pen => pen?.penId === penId);

  if (indexOfPen != -1) {
    pensList?.splice(indexOfPen, 1, updateCowChewsPen);
  }

  return pensList;
};

// generate graph data array of pens cud chewing
export const getChewingDataArray = pens => {
  let data = [];
  pens?.map(item =>
    data.push(
      item?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT][
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.YES_PERCENT
      ],
    ),
  );
  return data;
};

// number of chews data in percentage
export const getCowsDataArray = cudChews => {
  let data = [];

  const totalCows = cudChews?.length;

  let totalChewsCount = 0;

  cudChews?.map(
    item =>
      (totalChewsCount += item?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT]),
  );

  const avg = totalChewsCount / totalCows;

  data.push(avg);

  return data;
};

// get chewing percent data array for herd analysis chewing percent
export const getChewingPercentGraphData = ({ penList, penAnalysisData }) => {
  const data = [];

  penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.map(
    (penData, index) => {
      if (
        penData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT]?.[
        RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT
        ] >= 10
      ) {
        const penForDim = penList?.find(
          item =>
            item?.id === penData?.penId ||
            item?.localId === penData?.penId ||
            item?.sv_id === penData?.penId ||
            item?.penId === penData?.penId,
          // item => (item?.sv_id || item?.id) === penData?.penId,
        );
        if (penForDim && penForDim?.daysInMilk != null) {
          const lactationStage =
            getLactationStage(penForDim?.daysInMilk)?.length > 5
              ? getLactationStage(penForDim?.daysInMilk)
              : `${getLactationStage(penForDim?.daysInMilk)}${addSpace(
                9,
              )}\u200E`;

          const graphObject = {
            id: index,
            value: 0,
            label: lactationStage,
            lactation: getLactationStageKey(penForDim?.daysInMilk),
            frontColor: colors.primaryMain,
            dim: penForDim?.daysInMilk,
          };

          graphObject.value =
            parseFloat(
              penData?.[
                RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
              ]?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.YES_PERCENT]?.toFixed(2),
            ) || 0;

          data.push(graphObject);
        }
      }
    },
  );

  const updateGraphData = [];

  data.map(item => {
    const isAlreadyExist = updateGraphData.find(
      mappedItem => mappedItem.lactation == item.lactation,
    );
    if (isAlreadyExist) return;
    else {
      const filteredSimilarDims = data.filter(
        filterItem => filterItem?.lactation == item?.lactation,
      );
      if (filteredSimilarDims?.length > 1) {
        let totalValue = 0;
        filteredSimilarDims?.map(item => (totalValue += item?.value));
        item.value =
          parseFloat((totalValue / filteredSimilarDims.length)?.toFixed(2)) ||
          0;
        updateGraphData.push(item);
      } else {
        updateGraphData.push(item);
      }
    }
  });

  return updateGraphData;
};

// get avg of chews count in pen
export const getAvgChewsCount = cudChews => {
  const totalCows = cudChews?.length;

  let totalChewsCount = 0;

  cudChews?.map(
    item =>
      (totalChewsCount += item?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT]),
  );

  return totalChewsCount / totalCows;
};

// get cud chews count data array for herd analysis chews per cud
export const getCudChewsAvgGraphData = ({ penList, penAnalysisData }) => {
  const data = [];

  penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.map(
    (penData, index) => {
      const penObject = penList?.find(
        item =>
          item?.id === penData?.penId ||
          item?.localId === penData?.penId ||
          item?.sv_id === penData?.penId,
        // item => (item?.sv_id || item?.id) === penData?.penId,
      );

      const chewsAvg = getAvgChewsCount(
        penData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT],
      );

      if (penObject && penObject?.daysInMilk != null && chewsAvg > 0) {
        const lactationStage =
          getLactationStage(penObject?.daysInMilk)?.length > 5
            ? getLactationStage(penObject?.daysInMilk)
            : `${getLactationStage(penObject?.daysInMilk)}${addSpace(9)}\u200E`;

        const graphObject = {
          id: index,
          value: 0,
          label: lactationStage,
          lactation: getLactationStage(penObject?.daysInMilk),
          frontColor: colors.primaryMain,
          dim: penObject?.daysInMilk,
        };

        if (chewsAvg != 0) {
          graphObject.value = parseFloat(chewsAvg?.toFixed(2)) || 0;
        }

        data.push(graphObject);
      }
    },
  );

  const updateGraphData = [];

  data.map(item => {
    const isAlreadyExist = updateGraphData.find(
      mappedItem => mappedItem.lactation == item.lactation,
    );
    if (isAlreadyExist) return;
    else {
      const filteredSimilarDims = data.filter(
        filterItem => filterItem?.lactation == item?.lactation,
      );
      if (filteredSimilarDims?.length > 1) {
        let totalValue = 0;
        filteredSimilarDims?.map(item => (totalValue += item?.value));
        item.value =
          parseFloat((totalValue / filteredSimilarDims.length)?.toFixed(2)) ||
          0;
        updateGraphData.push(item);
      } else {
        updateGraphData.push(item);
      }
    }
  });

  return updateGraphData;
};

// get average of cud chews
const getCudChewsAvg = cudChews => {
  const totalCows = cudChews?.length;

  let totalChewsCount = 0;

  cudChews?.map(
    item =>
      (totalChewsCount += item?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CHEWS_COUNT]),
  );

  const avg = totalChewsCount / totalCows;

  return avg;
};

// herd analysis results for cud chewing percentage
export const herdAnalysisCudChewingGraph = (penList, penAnalysisData) => {
  if (penList?.length > 0 && penAnalysisData) {
    const observedData = getChewingPercentGraphData({
      penList,
      penAnalysisData,
    });

    if (observedData && observedData?.length > 0) {
      const lactationKeys = Object.keys(LACTATION_STAGE_KEY);

      const data = [];

      penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.GOALS]?.map(
        (goal, index) => {
          const penData = observedData?.find(
            item =>
              item?.lactation === goal?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.STAGE],
          );

          const goalBarData = {
            value:
              goal?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PERCENT_CHEWING]?.toFixed(
                2,
              ),
            label: goal?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.STAGE],
            lactation: goal?.stage,
            spacing: penData ? 0 : 40,
            frontColor: colors.screenBackgroundColor2,
          };

          lactationKeys.find(item => {
            if (
              LACTATION_STAGE_KEY[item] ==
              goal?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.STAGE]
            ) {
              goalBarData.label =
                LACTATION_STAGE[item] + addSpace(10) + '\u200E';
            }
          });

          data.push(goalBarData);

          if (penData) {
            const penBarData = {
              value: penData?.value || 0,
              frontColor: colors.primaryMain,
              indicate: true,
              lactation: goal?.stage,
            };

            data.push(penBarData);
          }
        },
      );

      return data || [];
    }

    return [];
  } else {
    return [];
  }
};

// herd analysis results for chews average
export const herdAnalysisChewsAvg = (penList, penAnalysisData) => {
  if (penList?.length > 0 && penAnalysisData) {
    const lactationKeys = Object.keys(LACTATION_STAGE_KEY);

    const graphData = [];

    const goalsObject = {
      data: [],

      gradientId: 'gradient2',
      gradientStyles: [
        {
          offset: '0%',
          stopColor: colors.activeTabColor,
        },
        {
          offset: '0%',
          stopColor: colors.white,
        },
      ],

      customLineStyles: {
        stroke: colors.error4,
        strokeDasharray: '5, 5',
      },

      customScatterStyles: {
        fill: colors.transparent,
      },

      dotLabelStyles: {
        fill: colors.transparent,
      },
    };

    // set goals data in datasets
    penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.GOALS]?.map(goal => {
      const dataObject = {
        x: goal?.stage,
        y: goal?.cudChews,
        lactation: goal?.stage,
      };

      lactationKeys.find(item => {
        if (
          LACTATION_STAGE_KEY[item] ==
          goal?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.STAGE]
        ) {
          const separatedLabel = LACTATION_STAGE[item]?.includes(' ')
            ? LACTATION_STAGE[item]?.split(' ')
            : LACTATION_STAGE[item]?.split('-');
          const label = separatedLabel?.join('\n');
          dataObject.x = label || LACTATION_STAGE[item]; // + addSpace(10) + '\u200E';
        }
      });

      goalsObject.domain = { y: [50, 100] };
      goalsObject.data.push(dataObject);
    });

    graphData.push(goalsObject);

    const chewsGraphObject = {
      data: [],

      customLineStyles: {
        stroke: colors.primaryMain,
      },

      customScatterStyles: {
        fill: colors.primaryMain,
      },
      dotLabelStyles: {
        fill: colors.graphHeaderBulletPrimary,
      },
      gradientId: 'gradient1',
      gradientStyles: [
        {
          offset: '0%',
          stopColor: colors.activeTabColor,
        },
        {
          offset: '100%',
          stopColor: colors.white,
        },
      ],
    };

    const tempArray = [];

    penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.map(
      (item, index) => {
        const penForDim = penList?.find(
          penItem =>
            penItem?.id === item?.penId ||
            penItem?.localId === item?.penId ||
            penItem?.sv_id === item?.penId ||
            penItem?.penId === item?.penId,
          // (penItem?.id || penItem?.localId) === item?.penId,
        );

        if (penForDim && penForDim?.daysInMilk != null) {
          const lactation = getLactationStageKey(penForDim?.daysInMilk);

          const graphObject = {
            day: null,
            chew: null,
          };

          const isAlreadyExist = tempArray?.find(
            findItem => findItem.lactation === lactation,
          );

          if (isAlreadyExist) return;
          else {
            const filteredListItem = penAnalysisData?.[
              RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS
            ]?.filter(penData => {
              const getPenForLactation = penList?.find(
                penItem =>
                  penItem?.id === penData?.penId ||
                  penItem?.localId === penData?.penId ||
                  penItem?.sv_id === penData?.penId ||
                  penItem?.penId === penData?.penId,
                // (penItem?.id || penItem?.localId) === penData?.penId,
              );

              const dimLactation =
                getPenForLactation?.daysInMilk != null
                  ? getLactationStageKey(getPenForLactation?.daysInMilk)
                  : null;

              if (getPenForLactation && dimLactation == lactation) {
                return penData;
              }
            });

            if (filteredListItem?.length > 1) {
              let totalValue = 0;
              filteredListItem?.map(
                filteredItem =>
                (totalValue += getAvgChewsCount(
                  filteredItem?.[
                  RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT
                  ],
                )),
              );

              totalValue =
                totalValue != 0
                  ? parseFloat(
                    (totalValue / filteredListItem?.length)?.toFixed(2),
                  )
                  : null;

              graphObject.x = lactation;
              graphObject.y = totalValue
                ? parseFloat(totalValue?.toFixed(2))
                : null;
              graphObject.lactation = lactation;

              lactationKeys.find(item => {
                if (LACTATION_STAGE_KEY[item] == lactation) {
                  const separatedLabel = LACTATION_STAGE[item]?.split(' ');
                  const label = separatedLabel?.join('\n');
                  graphObject.x = label || LACTATION_STAGE[item]; // + addSpace(10) + '\u200E';
                }
              });
            } else {
              const chewsCount = getAvgChewsCount(
                item?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT],
              );

              graphObject.x = lactation;
              graphObject.y =
                chewsCount > 0 ? parseFloat(chewsCount?.toFixed(2)) : null;

              graphObject.lactation = lactation;
              lactationKeys.find(item => {
                if (LACTATION_STAGE_KEY[item] == lactation) {
                  const separatedLabel = LACTATION_STAGE[item]?.split(' ');
                  const label = separatedLabel?.join('\n');
                  graphObject.x = label || LACTATION_STAGE[item]; // + addSpace(10) + '\u200E';
                }
              });
            }
          }

          tempArray.push({
            lactation: lactation,
          });
          chewsGraphObject.data.push(graphObject);
        }
      },
    );

    graphData.push(chewsGraphObject);

    return graphData || [];
  } else {
    return [];
  }
};

export const penAnalysisCudChewingData = ({
  selectedRecentVisits,
  selectedPen,
  penAnalysisData,
}) => {
  // TODO victory graph data mapper
  const graphData = [];
  let currentVisitIndex = null;

  const getSelectedPenFromVisitsPens = (parsedCudChewing, selectedPen) => {
    const visitPen = parsedCudChewing?.[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS
    ]?.find(
      item =>
        item?.penId === selectedPen?.id ||
        item?.penId === selectedPen?.localId ||
        item?.penId === selectedPen?.sv_id,
    );
    // ]?.find(item => item?.penId === (selectedPen?.sv_id || selectedPen?.id));

    return visitPen || null;
  };

  if (selectedRecentVisits?.length > 0) {
    selectedRecentVisits[0].rumenHealth = penAnalysisData;

    const graphObject = {
      data: [],
      gradientId: 'gradient1',
      gradientStyles: [
        {
          offset: '0%',
          stopColor: colors.activeTabColor,
        },
        {
          offset: '100%',
          stopColor: colors.white,
        },
      ],
    };

    selectedRecentVisits?.reverse()?.map((visit, index) => {
      let parsedCudChewing = null;

      if (visit?.rumenHealth && typeof visit?.rumenHealth == 'string')
        parsedCudChewing = JSON.parse(visit?.rumenHealth);
      else {
        parsedCudChewing = visit?.rumenHealth;
      }

      if (parsedCudChewing) {
        const visitPen = getSelectedPenFromVisitsPens(
          parsedCudChewing,
          selectedPen,
        );

        if (visitPen) {
          const dataObject = {
            x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(
              index,
            )}`,
            y: visitPen?.[
              RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
            ]?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.YES_PERCENT],
          };

          if (
            visitPen?.[
            RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT
            ]?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT] < 10
          ) {
            dataObject.y = 0;
          }

          // Track the current visit index (first item before reverse = last item after reverse)
          if (visit?.rumenHealth === penAnalysisData) {
            currentVisitIndex = graphObject.data.length;
          }

          graphObject.data.push(dataObject);
        }
      }
    });

    // adding dummy values for better graph ui when single pen data available
    if (graphObject.data?.length == 1) {
      const dataObject = {
        x: ' ',
        y: null,
      };
      graphObject.data.unshift(dataObject);
      // Adjust currentVisitIndex if dummy data was added
      if (currentVisitIndex !== null) {
        currentVisitIndex += 1;
      }
    }
    graphObject.domain = { y: [0, 100] };
    graphObject.currentVisitIndex = currentVisitIndex;

    graphData.push(graphObject);
  }

  return {
    data: graphData,
  };
};

// refactor with above code for reusability
export const penAnalysisChewsPerCudData = ({
  selectedRecentVisits,
  selectedPen,
  penAnalysisData,
}) => {
  // TODO victory graph data
  const graphData = [];
  let currentVisitIndex = null;

  const getSelectedPenFromVisitsPens = (visit, selectedPen) => {
    const visitPen = visit?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.find(
      item =>
        item?.penId === selectedPen?.id ||
        item?.penId === selectedPen?.localId ||
        item?.penId === selectedPen?.sv_id,
      // item => item?.penId === (selectedPen?.sv_id || selectedPen?.id),
    );

    return visitPen || null;
  };

  if (selectedRecentVisits?.length > 0) {
    selectedRecentVisits[0].rumenHealth = penAnalysisData;

    const graphObject = {
      data: [],
      gradientId: 'gradient1',
      gradientStyles: [
        {
          offset: '0%',
          stopColor: colors.activeTabColor,
        },
        {
          offset: '100%',
          stopColor: colors.white,
        },
      ],
    };

    selectedRecentVisits?.reverse()?.map((visit, index) => {
      let parsedCudChewing = null;

      if (visit?.rumenHealth && typeof visit?.rumenHealth == 'string')
        parsedCudChewing = JSON.parse(visit?.rumenHealth);
      else {
        parsedCudChewing = visit?.rumenHealth;
      }

      if (parsedCudChewing) {
        const visitPen = getSelectedPenFromVisitsPens(
          parsedCudChewing,
          selectedPen,
        );

        if (visitPen) {
          const dataObject = {
            x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(
              index,
            )}`,
            y: getAvgChewsCount(
              visitPen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT],
            ),
          };

          // Track the current visit index (first item before reverse = last item after reverse)
          if (visit?.rumenHealth === penAnalysisData) {
            currentVisitIndex = graphObject.data.length;
          }

          graphObject.data.push(dataObject);
        }
      }
    });

    // adding dummy values for better graph ui when single pen data available
    if (graphObject.data?.length == 1) {
      const dataObject = {
        x: ' ',
        y: null,
      };
      graphObject.data.unshift(dataObject);
      // Adjust currentVisitIndex if dummy data was added
      if (currentVisitIndex !== null) {
        currentVisitIndex += 1;
      }
    }
    graphObject.domain = { y: [0, 10] };
    graphObject.currentVisitIndex = currentVisitIndex;

    graphData.push(graphObject);
  }

  let deviation = null;

  if (graphData?.length > 0) {
    const data = graphData?.[0]?.data;
    const values = data?.map(item => item?.y);

    deviation = getDeviationForNoOfChews(values);
  }

  return {
    data: graphData,
    deviation,
  };
};

export const getDeviationForNoOfChews = values => {
  let deviation = null;

  if (values?.length > 0) {
    const sum = values?.reduce((acc, val) => {
      return acc + val;
    });
    const median = sum / values?.length;
    let variance = 0;
    values.forEach(num => {
      variance += (num - median) * (num - median);
    });
    variance /= values?.length;
    deviation = Math.sqrt(variance)?.toFixed(2);
  }
  return deviation;
};

// get score analysis data
export const getScoreAnalysisState = (penAnalysisData, penList, isEditable) => {
  if (penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.length > 0) {
    const updatedPensArray = penAnalysisData?.[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS
    ]?.map(pen => {
      const penData = {
        percentage: null,
        avgChews: null,
        daysInMilk: null,
      };

      // get pen data percentage
      if (
        pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT]?.[
        RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT
        ] >= 10
      ) {
        penData.percentage = getPercentage(
          pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT]?.[
          RUMEN_HEALTH_CUD_CHEWING_FIELDS.COUNT_YES
          ],
          pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWING_COWS_COUNT]?.[
          RUMEN_HEALTH_CUD_CHEWING_FIELDS.TOTAL_COUNT
          ],
        );
      }

      // get average chews count
      penData.avgChews = getCudChewsAvg(
        pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS_COUNT],
      );

      // get pen data for days in milk
      const penForDim = penList?.find(
        item =>
          // (item?.id || item?.sv_id || item?.localId) ===
          // pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID],
          item?.id === pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID] ||
          item?.localId === pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID] ||
          item?.sv_id === pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID],
      );

      // set dim in penData
      if (isEditable) {
        // get pen data for days in milk
        const penForDim = penList?.find(
          item =>
            // (item?.id || item?.sv_id || item?.localId) ===
            // pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID],
            item?.id === pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID] ||
            item?.localId === pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID] ||
            item?.sv_id === pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID],
        );
        penData.daysInMilk =
          penForDim?.daysInMilk ||
          pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK];
      } else {
        penData.daysInMilk =
          pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK];
      }
      // if (penForDim) {
      //   penData.daysInMilk = isEditable
      //     ? penForDim?.daysInMilk
      //     : pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK];

      //   penData.penId = pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID];
      // }

      if (stringIsEmpty(pen?.penName)) {
        pen.penName = penForDim?.name;
      }

      return {
        ...pen,
        ...penData,
      };
    });

    return updatedPensArray;
  } else {
    return [];
  }
};

export const updateDimAndReplacePen = (listData, pen, dim) => {
  const updatedPenList = listData?.map(item => {
    if (
      item?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID] ===
      pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID]
    ) {
      item.daysInMilk = dim == '0' ? 0 : Number(dim) || dim;
    }

    return item;
  });

  return updatedPenList;
};

// mapped cud chewing goals for bottom sheet
export const mapCudChewingGoalsData = penAnalysisData => {
  const lactationKeys = Object.keys(LACTATION_STAGE_KEY);

  if (
    penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.GOALS] &&
    penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.GOALS]?.length > 0
  ) {
    const mappedArray = penAnalysisData?.[
      RUMEN_HEALTH_CUD_CHEWING_FIELDS.GOALS
    ]?.map((item, index) => {
      const mappedObject = {
        id: index,
        lactationStage: item?.stage || '',
        stage: item?.stage || '',
        firstInputValue: item?.percentChewing || 0,
        secondInputValue: item?.cudChews || 0,
        thirdInputValue: null,
        rangeString: i18n.t(`lactationRange${index + 1}`)
          ? `(${i18n.t(`lactationRange${index + 1}`)})`
          : '',
      };

      lactationKeys.find(lacItem => {
        if (LACTATION_STAGE_KEY[lacItem] == item?.stage) {
          mappedObject.lactationStage = LACTATION_STAGE[lacItem];
        }
      });

      return mappedObject;
    });

    return mappedArray || [];
  } else {
    return [];
  }
};

export const cudChewingGoalsFormToComponent = goals => {
  if (goals && goals?.length > 0) {
    const mappedArray = goals?.map(item => {
      const mappedObject = {
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.STAGE]: item?.stage || '',
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.PERCENT_CHEWING]:
          item?.firstInputValue || 0,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.CUD_CHEWS]:
          item?.secondInputValue || 0,
        [RUMEN_HEALTH_CUD_CHEWING_FIELDS.RANGE_STRING]: item?.rangeString || '',
      };

      return mappedObject;
    });

    return mappedArray || [];
  } else {
    return [];
  }
};

export const mapGraphDataForPenAnalysisExport = (
  visitState,
  graphData,
  penId,
  penName,
  standardDeviation,
  isNoOfChews,
) => {
  // new mapping because of using new line graph
  let mappedArray = [];
  if (graphData?.length > 0) {
    graphData[0]?.data?.map(item => {
      if (item?.y) {
        mappedArray.push({
          visitDate: item?.x,
          chewingPercentage: item?.y ? (item?.y).toFixed(2) : 0,
        });
      }
    });
  }

  const model = {
    fileName: visitState?.visitName + '-CudChewingPenAnalysis',
    visitName: visitState?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('RumenHealth'),
    analysisType: i18n.t('penAnalysis'),
    penName,
    chewingPercentages: mappedArray,
    standardDeviation,
    isNoOfChews,

    standardDeviationLabel: standardDeviation
      ? convertInputNumbersToRegionalBasis(
        Number(standardDeviation).toFixed(2),
        2,
        true,
      )
      : null,
  };

  return model;
};

export const mapGraphDataForHerdAnalysisExport = (
  visitState,
  cudChewGraphData,
  chewPercentGraphData,
) => {
  const lactationsStage = Object.values(LACTATION_STAGE_KEY);

  // cud chewing percent graph data
  const goalCudChewingPercentage = {};
  const cudChewingPercentage = {};

  cudChewGraphData?.map(item => {
    if (item?.indicate) {
      cudChewingPercentage[item.lactation] = item?.value;
    } else {
      goalCudChewingPercentage[item.lactation] = item?.value;
    }
  });

  const cudChewingKeys = Object.keys(cudChewingPercentage);

  lactationsStage?.map(item => {
    const isFound = cudChewingKeys?.find(chewKey => chewKey === item);
    if (!isFound) {
      cudChewingPercentage[item] = 0;
    }
  });

  // cud chews regurgitation graph data
  const goalChewsRegurgitation = {};
  const cudChewsRegurgitation = {};

  if (chewPercentGraphData && chewPercentGraphData?.length > 0) {
    chewPercentGraphData?.[0]?.data?.map(item => {
      goalChewsRegurgitation[item?.lactation] = item?.y;
    });

    chewPercentGraphData?.[1]?.data?.map(item => {
      cudChewsRegurgitation[item?.lactation] = item?.y;
    });

    const cudChewsKeys = Object.keys(cudChewsRegurgitation);

    lactationsStage?.map(item => {
      const isFound = cudChewsKeys?.find(chewKey => chewKey === item);
      if (!isFound) {
        cudChewsRegurgitation[item] = 0;
      }
    });
  }

  //TODO: implement this. currently its hard coded for testing
  const model = {
    fileName: visitState
      ? visitState?.visitName + '-CudChewingHerdAnalysis'
      : '',
    visitName: visitState ? visitState?.visitName : '',
    visitDate: visitState
      ? dateHelper.getFormattedDate(
        visitState?.visitDate,
        DATE_FORMATS.MMM_DD_YY_H_MM,
      )
      : '',
    multipleFiles: true,
    toolName: i18n.t('RumenHealth'),
    analysisType: i18n.t('herdAnalysis'),
    chewsPerRegurgitation: cudChewsRegurgitation,
    goalChews: goalChewsRegurgitation,
    cudChewingPercentage: cudChewingPercentage,
    goalCudChewingPercentage: goalCudChewingPercentage,
  };

  return model;
};

// site and account id function for pen analysis results component
export const getSiteAndAccountIdFromVisit = visit => {
  const siteId =
    (!stringIsEmpty(visit?.siteId) ? visit.siteId : visit.localSiteId) || '';

  const accountId =
    (!stringIsEmpty(visit?.customerId)
      ? visit.customerId
      : visit.localCustomerId) || '';

  return {
    siteId,
    accountId,
  };
};

export const updatePensInDim = (penAnalysisData, penData) => {
  if (
    penAnalysisData &&
    penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.length > 0
  ) {
    penAnalysisData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PENS]?.map(pen => {
      if (
        pen?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID] ===
        penData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.PEN_ID]
      ) {
        pen[RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK] =
          penData?.[RUMEN_HEALTH_CUD_CHEWING_FIELDS.DAYS_IN_MILK];
      }
    });
  }

  return penAnalysisData;
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
    } else if (!stringIsEmpty(selectedPen?.localId)) {
      selectedPenId = selectedPen?.localId;
    } else {
      selectedPenId = selectedPen?.id;
    }

    // if (!stringIsEmpty(selectedPen?.sv_id)) {
    //   selectedPenId = selectedPen?.sv_id;
    // } else {
    //   selectedPenId = selectedPen?.id;
    // }
    const filteredPen = penAnalysisData?.pens?.filter(
      penObj => penObj?.penId === selectedPenId,
    );
    if (filteredPen && filteredPen?.length > 0) {
      return true;
    }
    return false;
  }
  return true;
};

const calculateCowSum = (penAnalysisArray = []) => {
  return penAnalysisArray?.cudChewingCowsCount?.totalCount >= 10;
};

const calculateChewSum = (penAnalysisArray = []) => {
  let chewsCountSum = 0;
  penAnalysisArray?.cudChewsCount?.map(
    item => (chewsCountSum += item?.chewsCount),
  );
  return chewsCountSum > 0;
};

const calculateHerdSum = (penAnalysisArray = []) => {
  return penAnalysisArray?.length > 0;
};

export const shouldEnableResultsButton = (
  toolType,
  penAnalysisArray,
  chewingType = null,
) => {
  switch (toolType) {
    case TOOL_ANALYSIS_TYPES.PEN_ANALYSIS:
      return chewingType &&
        chewingType?.value === PEN_ANALYSIS_CUD_CHEWING_DROPDOWN[0]?.value
        ? calculateCowSum(penAnalysisArray)
        : calculateChewSum(penAnalysisArray);
    case TOOL_ANALYSIS_TYPES.HERD_ANALYSIS:
      return calculateHerdSum(penAnalysisArray);
    default:
      return true;
  }
};

export const getTotalCowsCountCudChew = (penAnalysis, selectedPen) => {
  let totalCowsCount = 0;
  try {
    if (penAnalysis && selectedPen) {
      let selectedPenAnalysis = penAnalysis?.pens?.filter(p => {
        return (
          p.penId === selectedPen?.localId ||
          p.penId === selectedPen?.id ||
          p.penId === selectedPen?.sv_id
        );
      });
      if (selectedPenAnalysis.length > 0) {
        totalCowsCount =
          selectedPenAnalysis[0]?.cudChewingCowsCount?.totalCount;
      }
    }
    return totalCowsCount;
  } catch (e) {
    console.log('getTotalCowsCountCudChew fail', e);
    logEvent('getTotalCowsCountCudChew fail', e);
    return totalCowsCount;
  }
};

export const getTotalCowsCountCowsChew = (penAnalysis, selectedPen) => {
  let totalCowsCount = 0;
  try {
    if (penAnalysis && selectedPen) {
      let selectedPenAnalysis = penAnalysis?.pens?.filter(p => {
        return (
          p.penId === selectedPen?.localId ||
          p.penId === selectedPen?.id ||
          p.penId === selectedPen?.sv_id
        );
      });
      if (selectedPenAnalysis.length > 0) {
        totalCowsCount = selectedPenAnalysis[0]?.cudChewsCount?.length || 0;
      }
    }
    return totalCowsCount;
  } catch (e) {
    console.log('getTotalCowsCountCowsChew fail', e);
    logEvent('getTotalCowsCountCowsChew fail', e);
    return totalCowsCount;
  }
};

// Return the total cow count from the visit (UPDATED FORMULA)
export const getTotalAnimalCountCudChew = (pens = '', index) => {
  try {
    const data = typeof pens === 'string' ? JSON.parse(pens) : pens;

    if (
      data &&
      Array.isArray(data.pens) &&
      data.pens.length > 0 &&
      data.pens[index]
    ) {
      // Use the same formula as the tool: countYes + countNo
      const penData = data.pens[index];
      const countYes = penData?.cudChewingCowsCount?.countYes || 0;
      const countNo = penData?.cudChewingCowsCount?.countNo || 0;
      return countYes + countNo;
    }
    return null;
  } catch (error) {
    console.log('getTotalAnimalCountCudChew fail', error);
    logEvent('getTotalAnimalCountCudChew fail', error);
    return null;
  }
};

// Return the total chew count from the visit (UPDATED FORMULA)
export const getTotalAnimalCountChew = (pens = '', index) => {
  try {
    const data = typeof pens === 'string' ? JSON.parse(pens) : pens;

    if (
      data &&
      Array.isArray(data.pens) &&
      data.pens.length > 0 &&
      data.pens[index]?.cudChewsCount
    ) {
      // Use the same formula as the tool: count only non-zero chewsCount entries
      const cudChewsCount = data.pens[index].cudChewsCount;
      const totalAnimals = cudChewsCount.filter(c => c.chewsCount > 0).length;
      return totalAnimals;
    }
    return null;
  } catch (error) {
    console.log('getTotalAnimalCountChew fail', error);
    logEvent('getTotalAnimalCountChew fail', error);
    return null;
  }
};

export const extractRumenHealthPens = (penList, rumenHealthData) => {
  try {
    if (rumenHealthData) {
      const extractedPens = [];

      const parsedRumenHealthData = getParsedToolData(rumenHealthData);
      parsedRumenHealthData?.pens?.map(pen => {
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
      'helpers -> rumenHealthHelper -> extractRumenHealthPens error',
      error,
    );
    return [];
  }
};
