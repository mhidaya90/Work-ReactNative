import {
  DATE_FORMATS,
  MANURE_SCORE_CATEGORY_LIST,
  LACTATION_STAGE_KEY,
  TOOL_ANALYSIS_TYPES,
  VISIT_TABLE_FIELDS,
} from '../constants/AppConstants';
import { convertNumberToString, stringIsEmpty } from './alphaNumericHelper';

// styles
import colors from '../constants/theme/variables/customColor';

import { dateHelper, getFormattedDate } from './dateHelper';
import { addSpace } from './genericHelper';

import i18n from '../localization/i18n';
import { logEvent } from './logHelper';
import {
  convertInputNumbersToRegionalBasis,
  getParsedToolData,
} from './genericHelper';

// get selected pen form manure score pen data otherwise return initial pen state
export const getSelectedPen = (allPensWithPenAnalysis, selectedPen) => {
  let currentToolAllPens = allPensWithPenAnalysis;
  if (currentToolAllPens?.length > 0) {
    currentToolAllPens = currentToolAllPens?.find(x => {
      if (
        !stringIsEmpty(x.penId) &&
        (x.penId == selectedPen.sv_id || x.penId == selectedPen.id)
      ) {
        x.penName = selectedPen?.name || '';
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

//  check pen exist and newly pen then added locomotion constant attributes
export const allPenAnalysis = value => {
  let pens = setManureScorePenData(value?.rumenFill);
  if (pens?.length > 0) {
    pens?.map(a => {
      return {
        // daysInMilk: a?.daysInMilk,
        penId: a.penId,
        penName: a?.name || '',
        rumenFillScores: { items: setCategory(a), averageValue: 0 },
      };
    });
    return pens;
  } else {
    return initialPenAnalysis();
  }
};

// parsing manure score data
export const setManureScorePenData = rumenFill => {
  if (typeof rumenFill === 'string') {
    if (rumenFill?.length > 0) {
      let pens = JSON.parse(rumenFill)?.pens;
      return pens;
    }
  } else {
    return rumenFill?.pens;
  }
};

const initialPenAnalysis = pen => {
  let penObj = {
    // daysInMilk: pen?.daysInMilk,
    penId: !stringIsEmpty(pen?.sv_id) ? pen.sv_id : pen?.id,
    penName: pen?.name || '',
    rumenFillScores: { items: setCategory(), averageValue: 0 },
  };
  return penObj;
};

export const getInitialPensData = pensList => {
  let pens = [];
  if (!!pensList?.length) {
    pens = pensList?.map(el => {
      return {
        daysInMilk: el?.daysInMilk,
        penId: !stringIsEmpty(el?.sv_id) ? el.sv_id : el?.id,
        rumenFillScores: { items: setCategory(), averageValue: 0 },
      };
    });
  }
  return pens;
};

export const saveManureHerdData = (
  pensList,
  rumenFillManureScore,
  selectedPen = {},
) => {
  if (typeof rumenFillManureScore == 'string') {
    rumenFillManureScore = getParsedToolData(rumenFillManureScore);
  }
  const manurePens = rumenFillManureScore?.pens || [];
  const data = [];

  if (manurePens?.length === 0) {
    // return data;
  }

  !!pensList?.length &&
    pensList?.forEach(pen => {
      let penObj = {};
      const el = manurePens?.find(
        e =>
          e.penId == pen?.sv_id ||
          e.penId == pen?.id ||
          e.penId == pen?.localPenId,
      );
      if (!!el) {
        penObj = {
          ...el,
          daysInMilk: pen?.daysInMilk ? pen?.daysInMilk : null,
        };
      } else {
        return; //prevents creation/saving of payload of pens with dummy data that weren't touched
        penObj = {
          daysInMilk: pen?.daysInMilk ? pen?.daysInMilk : null,
          penId: !stringIsEmpty(pen?.sv_id) ? pen.sv_id : pen?.id,
          rumenFillScores: { items: setCategory(), averageValue: 0 },
        };
      }
      data.push(penObj);
    });
  return data;
};

// manureScore category tools within pens lossCow and category
export const setCategory = (
  value,
  isEditable = false,
  selectedPen,
  pensAnalysisData,
) => {
  if (value?.length > 0) {
    let temp = value;
    temp = temp?.map((val, index) => {
      return {
        scoreCategory: MANURE_SCORE_CATEGORY_LIST[index].category,
        animalNumbers: getAnimalsObservedValues(
          val?.animalsObserved,
          val?.animalNumbers,
          isEditable,
          selectedPen,
          pensAnalysisData,
        ),
        percentOfPen: pensInPercent(index, value),
      };
    });

    return temp;
  } else {
    return MANURE_SCORE_CATEGORY_LIST.map(v => ({
      scoreCategory: Number(v.category),
      percentOfPen: 0,
      animalNumbers: 0,
    }));
  }
};

const getAnimalsObservedValues = (
  animalsObserved,
  animalNumbers,
  isEditable,
  selectedPen,
  pensAnalysisData,
) => {
  if (
    !isEditable &&
    !penExistsInPublishedVisit(isEditable, pensAnalysisData, selectedPen)
  ) {
    return '-';
  }
  return !stringIsEmpty(animalsObserved || animalNumbers)
    ? animalsObserved || animalNumbers
    : 0;
};

//calculate penInPercent at runtime  to change animal observed
export const pensInPercent = (index, data) => {
  try {
    let selectedCategoryTotalCountYes = 0;
    const totalAnimalObserved = data?.reduce((accumulator, object) => {
      return accumulator + object.animalNumbers;
    }, 0);

    selectedCategoryTotalCountYes = data[index].animalNumbers;
    if (selectedCategoryTotalCountYes > 0) {
      let calculatePenInPercent =
        (selectedCategoryTotalCountYes / totalAnimalObserved) * 100;
      return calculatePenInPercent > 0
        ? calculatePenInPercent?.toFixed(2)
        : calculatePenInPercent;
    }
    return '-';
  } catch (error) {
    logEvent('helpers -> rumenFillHelper -> pensInPercent exception', error);
    console.log('pensInPercent exception', error);
    return '-';
  }
};

export const getManureScoreAvg = pen => {
  let avg = 0;
  if (pen && pen.items && pen.items.length > 0) {
    pen.items.map((a, index) => {
      avg += calculateAvg(a, index, pen.items);
    });
  }
  return avg;
};

const calculateAvg = (a, index, categories) => {
  let avg = 0;
  let pens = pensInPercent(index, categories);
  let b = (pens / 100) * +Number(a.scoreCategory);
  if (!stringIsEmpty(b) && b >= 0) {
    avg = b;
  }
  return avg;
};

// ManureScore standard deviation formula
export const getManureScoreStdDeviation = pen => {
  try {
    let avg = getManureScoreAvg(pen)?.toFixed(2);
    let sum = 0;
    let totalAnimals = 0;
    if (pen && pen?.items && pen?.items.length > 0) {
      pen?.items.map(data => {
        const animals = data?.animalNumbers;
        totalAnimals += animals;
        const category = +Number(data?.scoreCategory);
        const error = category - avg;
        const squaredError = error * error;
        const val = squaredError * animals;
        sum += val;
      });
    }
    if (totalAnimals > 1) {
      return Math.sqrt(sum / (totalAnimals - 1));
    } else if (totalAnimals == 1) {
      return Math.sqrt(sum / totalAnimals);
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

// save pen analysis using manure score tools
export const onUpdatedManureScoreObj = ({ data, localVisitId, visitData }) => {
  try {
    let { rumenFill } = visitData || {};
    let selectedPenData = data;
    let result = '';
    if (!stringIsEmpty(rumenFill)) {
      let parseToolData = '';
      if (typeof rumenFill == 'string') {
        parseToolData = JSON.parse(rumenFill);
      } else {
        parseToolData = rumenFill;
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
      'helpers -> rumenFillHelper -> onUpdatedManureScoreObj Exception',
      error,
    );
    console.log('saveLocomotionScore Exception', error);
  }
};

// save db mapper pen categories
const mappedStateToDb = item => {
  return item?.map(v => ({
    animalNumbers: v.animalNumbers,
    percentOfPen: v.percentOfPen,
    scoreCategory: v.scoreCategory,
  }));
};

export const getAllManureScoreData = data => {
  if (data && data?.pens?.length > 0) {
    return data?.pens;
  }
  return [];
};

export const setPenAnalysisGraphData = (graphData, currentVisitData = null) => {
  try {
    let currentVisitIndex = null;

    let animals = graphData?.map((visit, index) => {
      // Find the current visit by comparing visitId or date
      if (currentVisitData &&
          (visit?.visitId === currentVisitData?.visitId ||
           visit?.date === currentVisitData?.date)) {
        currentVisitIndex = index;
      }

      return {
        x: getFormattedDate(visit.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y: getManureScoreAvg(visit?.rumenFillScores),
      };
    });
    let animalAnalysisGraph = {
      data: animals,
      domain: { y: [1, 5] },
      gradientId: 'default',
      gradientStyles: [
        {
          offset: '0%',
          stopColor: colors.secondary2,
        },
        {
          offset: '100%',
          stopColor: colors.white,
        },
      ],
      customLineStyles: {
        stroke: colors.secondary2,
      },
      customScatterStyles: {
        fill: colors.secondary2,
      },
      dotLabelStyles: {
        fill: colors.secondary2,
      },
      currentVisitIndex,
    };
    return [animalAnalysisGraph];
  } catch (error) {}
};

export const heardGoalsInitialized = (value, enumState) => {
  let data = [];
  let manureObj = {};

  if (typeof value == 'string' && !stringIsEmpty(value)) {
    manureObj = JSON.parse(value);
  } else {
    manureObj = value;
  }

  if (!stringIsEmpty(manureObj?.goals)) {
    data = getRumenFillHerdGoals(manureObj);
    return data;
  } else {
    data = initializeManureGoalsData(enumState);
    return data;
  }
};

const getRumenFillHerdGoals = manureObj => {
  let data = [];
  data = manureObj?.goals?.map(goal => {
    return {
      lactationStage: goal?.lactationStage,
      // goal: ((goal?.goalMin + goal?.goalMax) / 2) ,
      goalMin: goal?.goalMin || 0,
      goalMax: goal?.goalMax || 0,
    };
  });
  return data;
};

export const getFormattedGoalsData = (goalsArray, enumState) => {
  const mappedArray = goalsArray?.map((goal, index) => {
    return {
      lactationStage: goal.lactationStage,
      lactationStageStr: enumState?.enum
        ? getFormattedLactationStage(enumState, goal.lactationStage)
        : [],
      // goal: goal?.goal,
      firstInputValue: convertNumberToString(goal.goalMin),
      secondInputValue: convertNumberToString(goal.goalMax),
      rangeString: '(' + i18n.t(`lactationRange${index + 1}`) + ')',
    };
  });

  return mappedArray || [];
};

export const unformatGoalsData = goals => {
  let mappedArray = [];
  if (goals && goals?.length > 0) {
    mappedArray = goals?.map(item => {
      return {
        lactationStage: item.lactationStage,
        goal: item?.goal || 0,
        goalMin: item?.firstInputValue || 0,
        goalMax: item?.secondInputValue || 0,
      };
    });

    return mappedArray;
  }
  return mappedArray;
};

export const getFormattedLactationStage = (enumState, lactationKey) => {
  if (enumState?.enum?.lactationStages) {
    const filteredEnum = enumState?.enum?.lactationStages?.filter(
      (item, index) => {
        return lactationKey === item.key;
      },
    );
    if (filteredEnum && filteredEnum.length > 0) {
      return filteredEnum[0].value;
    }
  }
};

export const parseRumenFillGoalsData = goals => {
  let mappedArray = [];
  if (goals && goals?.length > 0) {
    mappedArray = goals?.map(item => {
      return {
        // goal: item?.goal,
        goalMin: item?.firstInputValue || 0,
        goalMax: item?.secondInputValue || 0,
        lactationStage: item?.lactationStage,
      };
    });

    return mappedArray;
  }

  return mappedArray;
};

export const getManureAvgForLactationStage = data => {
  if (data && data.length > 0) {
    let total = 0;
    data.map(obj => {
      total += parseFloat(obj?.avgManureScore);
    });
    return total / data.length;
  }
  return 0;
};

export const joinManureHerdAnalysisGraph = (labels, values) => {
  let formattedData = [];
  for (let i = 0; i < labels.length; i++) {
    formattedData.push({
      x: labels[i],
      y: values[i],
    });
  }
  return formattedData;
};

export const initializeManureGoalsData = enumState => {
  let data = [];
  if (enumState?.enum?.lactationStages) {
    const lactationStages = enumState?.enum?.lactationStages;
    if (lactationStages) {
      data = [
        {
          lactationStage: lactationStages[0].key,
          // goal: 3.50,
          goalMin: 3.75,
          goalMax: 4.25,
        },
        {
          lactationStage: lactationStages[1].key,
          // goal: 3.00,
          goalMin: 3.75,
          goalMax: 4.25,
        },
        {
          lactationStage: lactationStages[2].key,
          // goal: 2.50,
          goalMin: 2.0,
          goalMax: 2.5,
        },
        {
          lactationStage: lactationStages[3].key,
          // goal: 2.75,
          goalMin: 2.5,
          goalMax: 3.0,
        },
        {
          lactationStage: lactationStages[4].key,
          // goal: 2.75,
          goalMin: 2.75,
          goalMax: 3.25,
        },
        {
          lactationStage: lactationStages[5].key,
          // goal: 3.00,
          goalMin: 2.75,
          goalMax: 3.25,
        },
        {
          lactationStage: lactationStages[6].key,
          // goal: 3.25,
          goalMin: 3.5,
          goalMax: 4.25,
        },
      ];
    }
  }

  return data;
};

export const mapGraphDataForPenAnalysisExport = (
  visitState,
  graphData,
  penName,
  penData,
) => {
  let average = getManureScoreAvg(penData)?.toFixed(2) || 0.0;
  let stdDeviation = getManureScoreStdDeviation(penData)?.toFixed(2) || 0.0;
  let mappedArray = [];
  if (graphData?.length > 0) {
    graphData[0]?.data?.map(item => {
      mappedArray.push({
        visitDate: item?.x,
        categoryAverage: Number(item?.y?.toFixed(2)) || 0,
      });
    });
  }
  const model = {
    fileName: visitState?.visitName + '-RumenFillPenAnalysis',
    visitName: visitState?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('RumenFill'),
    analysisType: i18n.t('penAnalysis'),
    penName,
    average: average,
    standardDeviation: stdDeviation,
    categories: mappedArray,

    // for addition field comma separated value
    averageLabel: convertInputNumbersToRegionalBasis(
      Number(average)?.toFixed(2),
      2,
      true,
    ),
    standardDeviationLabel: convertInputNumbersToRegionalBasis(
      Number(stdDeviation)?.toFixed(2),
      2,
      true,
    ),
  };
  return model;
};

export const mapGraphDataForHerdAnalysisExport = (
  visitState,
  graphData,
  lactationStages,
) => {
  const { avgManureData, minGoalsData, maxGoalsData, goalsData } =
    graphData || {};
  const manureDict = {},
    goalDict = {},
    minGoalDict = {},
    maxGoalDict = {};
  const len = lactationStages?.length;
  for (let i = 0; i < len; i++) {
    manureDict[lactationStages[i]] = avgManureData[i];
    goalDict[lactationStages[i]] = goalsData[i];
    minGoalDict[lactationStages[i]] = minGoalsData[i];
    maxGoalDict[lactationStages[i]] = maxGoalsData[i];
    if (i <= 1) {
      goalDict[lactationStages[i]] = null;
    }
  }
  const model = {
    fileName: visitState?.visitName + '-RumenFillHerdAnalysis',
    visitName: visitState?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('RumenFill'),
    analysisType: i18n.t('herdAnalysis'),
    averageRumenFillScore: manureDict,
    min: minGoalDict,
    max: maxGoalDict,
    // goal: goalDict,
  };

  return model;
};

export const parsePenLactationStages = (penData, enumState) => {
  let dict = {};
  if (enumState?.enum && penData && penData.length > 0) {
    penData?.map(penObj => {
      if (penObj?.daysInMilk || penObj?.daysInMilk == 0) {
        const stage = enumState
          ? getFormattedLactationStage(
              enumState,
              getLactationStageKey(penObj.daysInMilk),
            )
          : [];
        if (stage in dict) {
          dict[stage].push(penObj);
        } else {
          dict[stage] = [penObj];
        }
      }
    });
  }
  return dict;
};

export const getLactationStageKey = dim => {
  if (dim < -21) {
    return LACTATION_STAGE_KEY.FAR_OFF_DRY;
  } else if (dim >= -21 && dim <= -1) {
    return LACTATION_STAGE_KEY.CLOSE_UP_DRY;
  } else if (dim >= 0 && dim <= 15) {
    return LACTATION_STAGE_KEY.FRESH;
  } else if (dim >= 16 && dim <= 60) {
    return LACTATION_STAGE_KEY.EARLY_LACTATION;
  } else if (dim >= 61 && dim <= 120) {
    return LACTATION_STAGE_KEY.PEAK_MILK;
  } else if (dim >= 121 && dim <= 200) {
    return LACTATION_STAGE_KEY.MID_LACTATION;
  } else if (dim > 200) {
    return LACTATION_STAGE_KEY.LATE_LACTATION;
  } else {
    return '';
  }
};

export const parsePensData = (pens, rumenScorePens, isEditable) => {
  const data = [];
  //refactored to only get those pens that were touched in pen-analysis
  pens?.filter(pen => {
    let avg = 0;
    let filteredPenArray = [];
    if (!stringIsEmpty(pen?.sv_id)) {
      filteredPenArray = rumenScorePens?.filter(
        penObj => penObj.penId === pen.sv_id,
      );
    } else {
      filteredPenArray = rumenScorePens?.filter(
        penObj =>
          penObj.penId === (pen.id || pen.localId || pen?.penId) ||
          penObj.localPenId === (pen.id || pen.localId || pen?.penId),
      );
    }
    if (filteredPenArray && filteredPenArray.length > 0) {
      const currentPenObject = filteredPenArray[0];
      avg = getManureScoreAvg(currentPenObject?.rumenFillScores).toFixed(2);
      data.push({
        ...pen,
        avgManureScore: avg,
        daysInMilk: getUpdatedDaysInMilk(isEditable, pen, filteredPenArray),
      });
    }
  });
  return data;
};

const getUpdatedDaysInMilk = (isEditable, pen, filteredPenArray) => {
  return isEditable ? pen?.daysInMilk : filteredPenArray?.[0]?.daysInMilk;
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

const calculatePensSum = penAnalysisArray => {
  let sum = 0;
  penAnalysisArray?.rumenFillScores?.items?.map(item => {
    sum += item.animalNumbers;
  });
  return sum > 0;
};

const calculateHerdSum = penAnalysisArray => {
  return penAnalysisArray?.length > 0;
};

export const shouldEnableResultsButton = (toolType, penAnalysisArray = []) => {
  switch (toolType) {
    case TOOL_ANALYSIS_TYPES.PEN_ANALYSIS:
      return calculatePensSum(penAnalysisArray);
    case TOOL_ANALYSIS_TYPES.HERD_ANALYSIS:
      return calculateHerdSum(penAnalysisArray);
    default:
      return true;
  }
};

export const extractUsedPensFromRumenFillTool = (rumenFillData = null) => {
  try {
    const usedPensPayload = [];

    if (rumenFillData?.pens?.length > 0) {
      rumenFillData?.pens?.map(pen => usedPensPayload.push(pen?.penId));
    }

    const payload = {
      [VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE]: usedPensPayload,
    };

    return payload;
  } catch (error) {
    console.log('error extractUsedPensFromRumenFillTool', error);
    return null;
  }
};

export function deletePenDataInsideRumenFillTool(rumenFillData, pen) {
  try {
    const parsedRumenFillData = getParsedToolData(rumenFillData);

    if (parsedRumenFillData) {
      const filteredPens = [];

      parsedRumenFillData.pens?.map(item => {
        if (item.penId !== pen) filteredPens.push(item);
      });

      parsedRumenFillData.pens = filteredPens;

      if (parsedRumenFillData.pens?.length <= 0) {
        return null;
      }
    }

    return parsedRumenFillData;
  } catch (error) {
    logEvent(
      'helpers -> rumenFillHelper -> deletePenDataInsideRumenFillTool error',
      error,
    );
    return rumenFillData;
  }
}
export const getTotalCowsCountRumenFill = penAnalysis => {
  let totalCowsCount = 0;
  try {
    if (penAnalysis) {
      penAnalysis?.rumenFillScores?.items?.forEach(element => {
        let _categoryCount = element?.animalNumbers;
        totalCowsCount += _categoryCount;
      });
    }
    return totalCowsCount;
  } catch (e) {
    console.log('getTotalCowsCountRumenFill fail', e);
    logEvent('getTotalCowsCountRumenFill fail', e);
    return totalCowsCount;
  }
};

export const extractRumenFillPens = (penList, rumenFillData) => {
  try {
    if (rumenFillData) {
      const extractedPens = [];

      const parsedRumenFillData = getParsedToolData(rumenFillData);
      parsedRumenFillData?.pens?.map(pen => {
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
    logEvent('helpers -> rumenFillHelper -> extractRumenFillPens error', error);
    return [];
  }
};
