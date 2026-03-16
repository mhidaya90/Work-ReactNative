import React from 'react';
//constants
import {
  DATE_FORMATS,
  LACTATION_STAGE,
  LACTATION_STAGE_KEY,
  TOOL_ANALYSIS_TYPES,
  TOOL_CATEGORIES,
  TOOL_TYPES,
  VISIT_STATUS,
  VISIT_TABLE_FIELDS,
} from '../constants/AppConstants';
import {
  CALF_HEIFER_ICON,
  COMFORT_ICON,
  HEALTH_ICON,
  NUTRITION_ICON,
  PRODUCTIVITY_ICON,
} from '../constants/AssetSVGConstants.js';
import { normalize } from '../constants/theme/variables/customFont';

// localization
import i18n, { getLanguage } from '../localization/i18n';

//colors
import colors from '../constants/theme/variables/customColor';

//helpers
import {
  convertNumberToString,
  convertStringToNumber,
  getFormattedScoreData,
  stringIsEmpty,
} from './alphaNumericHelper';
import { dateHelper, getFormattedDate } from './dateHelper';
import { convertInputNumbersToRegionalBasis } from './genericHelper';
import { extractLocomotionPens } from './locomotionHelper';
import { extractBCSPens } from './bcsHelper';
import { extractManureScorePens } from './manureScoreHelper';
import { extractPenTimeBudgetPens } from './penTimeBudgetHelper';
import { extractManureScreenerPens } from './manureScreenerHelper';
import { extractRumenFillPens } from './rumenFillHelper';
import { extractTmrPenStatePens } from './tmrParticleScoreHelper';
import { extractRumenHealthPens } from './rumenHealthHelper';
import { ROF_FORM_TYPES } from '../constants/toolsConstants/ROFConstants.js';
import { logEvent } from './logHelper';

export const getAllBCSData = bcsPenAnalysis => {
  if (bcsPenAnalysis && bcsPenAnalysis.pens && bcsPenAnalysis.pens.length > 0) {
    return bcsPenAnalysis.pens;
  }
  return [];
};

export const getAllAnimalAnalysisData = animalAnalysisInp => {
  const animalAnalysis =
    typeof animalAnalysisInp == 'string'
      ? JSON.parse(animalAnalysisInp)
      : animalAnalysisInp;
  if (
    animalAnalysis &&
    animalAnalysis.animals &&
    animalAnalysis.animals.length > 0
  ) {
    return animalAnalysis.animals;
  }
  return [];
};

export const getEmptyPenObject = (categoriesData, pen) => {
  // Prepare empty pen object when data for selected pen doesn't exist in database
  const penObject = {
    bodyConditionScores: categoriesData?.map(category => {
      return {
        bcsCategory: category.id,
        animalsObserved: 0,
      };
    }),
    daysInMilk: pen?.daysInMilk,
    milk: pen?.milk,
    penName: pen?.name || pen?.value,
  };
  if (pen.sv_id) {
    penObject.penId = pen.sv_id;
  } else {
    penObject.localPenId = pen.id;
  }
  return penObject;
};

/**
 * This function will return formatted data for the selected pen
 */
export const getPenBCSData = (allData, pen, enumData, selectedScale) => {
  let categoriesData = [];
  if (selectedScale && enumData && enumData[selectedScale.key]) {
    // Create categories data array to display data on screen
    categoriesData = getFormattedScoreData(enumData[selectedScale.key]);
    let penObject = null;
    if (allData.length > 0) {
      let filteredPenArray = [];
      if (!stringIsEmpty(pen.sv_id)) {
        filteredPenArray = allData.filter(
          penObj =>
            penObj.penId === pen.sv_id || penObj.localPenId === pen.sv_id,
        );
      } else {
        filteredPenArray = allData.filter(
          penObj => penObj.localPenId === pen.id,
        );
      }
      if (filteredPenArray && filteredPenArray.length > 0) {
        const currentPenObject = filteredPenArray[0];

        // Set previous data already entered either on screen or in database
        penObject = {
          ...currentPenObject,
          bodyConditionScores: categoriesData.map(category => {
            let animalsObserved = 0;
            if (
              currentPenObject.bodyConditionScores &&
              currentPenObject.bodyConditionScores.length > 0
            ) {
              const filteredBCSData =
                currentPenObject.bodyConditionScores.filter(
                  bcsObject => +bcsObject.bcsCategory == +category.id,
                );
              if (filteredBCSData && filteredBCSData.length > 0) {
                animalsObserved = filteredBCSData[0].animalsObserved;
              }
            }
            return {
              bcsCategory: category.id,
              animalsObserved: animalsObserved,
            };
          }),
        };
      } else {
        penObject = getEmptyPenObject(categoriesData, pen);
      }
    } else {
      // Set empty pen object when no data was entered previously
      penObject = getEmptyPenObject(categoriesData, pen);
    }
    return penObject;
  }
};

export const getEarTagById = (item, earTagList) => {
  let filteredList = [];
  if (item.localEarTagId) {
    filteredList = earTagList.filter(
      earTag => earTag.id === item.localEarTagId,
    );
  } else {
    filteredList = earTagList.filter(earTag => earTag.sv_id === item.earTagId);
  }
  if (filteredList && filteredList.length > 0) {
    return filteredList[0].earTagName;
  }
  return '';
};

export const getFormattedAnimalData = (animalList, earTagList) => {
  return animalList.map(animal => ({
    ...animal,
    name: getEarTagById(animal, earTagList),
  }));
};

export const getPenPercent = (item, bcsArray) => {
  let total = 0;
  bcsArray.forEach(bcsCat => {
    total += bcsCat.animalsObserved;
  });
  if (total === 0) {
    return 0;
  }
  return (item.animalsObserved * 100) / total;
};

export const getBCSAvg = pen => {
  let avg = 0;
  if (pen && pen?.bodyConditionScores && pen?.bodyConditionScores.length > 0) {
    pen.bodyConditionScores.map(bcs => {
      avg +=
        (getPenPercent(bcs, pen?.bodyConditionScores) / 100) * +bcs.bcsCategory;
    });
  }
  return avg;
};

export const getBCSStdDev = pen => {
  const avg = getBCSAvg(pen);
  let sum = 0;
  let totalAnimals = 0;
  if (pen && pen.bodyConditionScores && pen.bodyConditionScores.length > 0) {
    pen.bodyConditionScores.map(bcs => {
      const animals = bcs.animalsObserved;
      totalAnimals += animals;
      const category = +bcs.bcsCategory;
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
};

export const saveBCSHerdData = (
  pensList,
  bodyConditionScore,
  enumData,
  selectedScale,
) => {
  if (typeof bodyConditionScore == 'string') {
    bodyConditionScore = JSON.parse(bodyConditionScore);
  }

  const data = [];
  let categoriesData = [];
  const bcsPens = bodyConditionScore?.pens || [];

  if (selectedScale && enumData && enumData[selectedScale.key]) {
    categoriesData = getFormattedScoreData(enumData[selectedScale.key]);
  }

  !!pensList?.length &&
    pensList?.forEach(pen => {
      let penObj = {};
      const el = bcsPens?.find(
        e =>
          e.penId == pen?.sv_id ||
          e.penId == pen?.id ||
          e?.localPenId == pen?.id,
      );
      if (!!el && !stringIsEmpty(el)) {
        penObj = {
          ...el,
          daysInMilk: pen?.daysInMilk,
          milk: pen?.milk,
          penName: pen?.name || pen?.value,
        };
        data.push(penObj);
      } else {
        return;
        penObj = getEmptyPenObject(categoriesData, pen);
      }
      // data.push(penObj);
    });

  return data;
};

export const sortRecentVisitsForGraph = recentVisits => {
  const sortedRecentVisits = recentVisits?.sort(function (a, b) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  });
  return sortedRecentVisits;
};

export const getAnimalBCSCategory = (
  animalData,
  selectedAnimal,
  isLocomotion,
) => {
  let category = 0;
  if (
    animalData &&
    animalData.animalDetails &&
    animalData.animalDetails.length > 0 &&
    selectedAnimal
  ) {
    const filteredAnimals = animalData.animalDetails.filter(animal => {
      if (animal.earTagId) {
        return animal.earTagId === selectedAnimal.earTagId;
      } else if (animal.localEarTagId) {
        return animal.localEarTagId === selectedAnimal.localEarTagId;
      }
    });
    if (filteredAnimals && filteredAnimals.length > 0) {
      if (isLocomotion) {
        category = +filteredAnimals[0].locomotionScore;
      } else {
        category = +filteredAnimals[0].bcsCategory;
      }
    }
  }
  return category;
};

export const getAnimalBCSDIM = (animalData, selectedAnimal) => {
  let dim = -1000;
  if (
    animalData &&
    animalData.animalDetails &&
    animalData.animalDetails.length > 0 &&
    selectedAnimal
  ) {
    const filteredAnimals = animalData.animalDetails.filter(animal => {
      if (animal.earTagId) {
        return animal.earTagId === selectedAnimal.earTagId;
      } else if (animal.localEarTagId) {
        return animal.localEarTagId === selectedAnimal.localEarTagId;
      }
    });
    if (filteredAnimals && filteredAnimals.length > 0) {
      const animal = filteredAnimals[0];
      if (!stringIsEmpty(animal.daysInMilk)) {
        dim = +animal.daysInMilk;
      }
    }
  }
  return dim;
};

// lactation stage based on days in milk for a pen
export const getLactationStage = dim => {
  if (dim < -21) {
    return LACTATION_STAGE.FAR_OFF_DRY;
  } else if (dim >= -21 && dim <= -1) {
    return LACTATION_STAGE.CLOSE_UP_DRY;
  } else if (dim >= 0 && dim <= 15) {
    return LACTATION_STAGE.FRESH;
  } else if (dim >= 16 && dim <= 60) {
    return LACTATION_STAGE.EARLY_LACTATION;
  } else if (dim >= 61 && dim <= 120) {
    return LACTATION_STAGE.PEAK_MILK;
  } else if (dim >= 121 && dim <= 200) {
    return LACTATION_STAGE.MID_LACTATION;
  } else if (dim > 200) {
    return LACTATION_STAGE.LATE_LACTATION;
  } else {
    return '';
  }
};

// lactation stage based on days in milk for a pen
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

export const initializeBCSGoals = (enumState, conversionNeeded = false) => {
  let data = [];
  if (enumState?.enum?.lactationStages) {
    const lactationStages = enumState?.enum?.lactationStages || [];
    if (!!lactationStages?.length) {
      data = [
        {
          lactationStage: lactationStages[0].key,
          goalMin: convertNumberToString(3.25, !conversionNeeded),
          goalMax: convertNumberToString(3.75, !conversionNeeded),
        },
        {
          lactationStage: lactationStages[1].key,
          goalMin: convertNumberToString(3.25, !conversionNeeded),
          goalMax: convertNumberToString(3.75, !conversionNeeded),
        },
        {
          lactationStage: lactationStages[2].key,
          goalMin: convertNumberToString(2.75, !conversionNeeded),
          goalMax: convertNumberToString(3.25, !conversionNeeded),
        },
        {
          lactationStage: lactationStages[3].key,
          goalMin: convertNumberToString(2.5, !conversionNeeded),
          goalMax: convertNumberToString(3.0, !conversionNeeded),
        },
        {
          lactationStage: lactationStages[4].key,
          goalMin: convertNumberToString(2.5, !conversionNeeded),
          goalMax: convertNumberToString(3.0, !conversionNeeded),
        },
        {
          lactationStage: lactationStages[5].key,
          goalMin: convertNumberToString(2.75, !conversionNeeded),
          goalMax: convertNumberToString(3.25, !conversionNeeded),
        },
        {
          lactationStage: lactationStages[6].key,
          goalMin: convertNumberToString(3.0, !conversionNeeded),
          goalMax: convertNumberToString(3.75, !conversionNeeded),
        },
      ];
    }
  }

  return data;
};

export const convertBCSGoals = goals => {
  let data = [];
  if (goals && goals.length > 0) {
    goals?.map((goal, index) => {
      goals[index].lactationStage = goals[index].lactationStage;
      goals[index].goalMin = convertNumberToString(goals[index].goalMin);
      goals[index].goalMax = convertNumberToString(goals[index].goalMax);
      data.push(goals[index]);
    });
  }

  return data;
};

export const parseBCSGoals = goals => {
  let data = [];
  if (goals && goals.length > 0) {
    goals?.map((goal, index) => {
      let g = {};
      g.lactationStage = goals[index].lactationStage;
      g.goalMin = convertStringToNumber(goals[index].goalMin);
      g.goalMax = convertStringToNumber(goals[index].goalMax);
      data.push(g);
    });
  }

  return data;
};

export const getBCSAvgForLactationStage = (data, conversionNeeded = false) => {
  if (data && data.length > 0) {
    let total = 0;
    data.map(obj => {
      total += parseFloat(convertStringToNumber(obj.avgBCS, !conversionNeeded));
    });
    return total / data.length;
  }
  return 0;
};

export const getMilkYieldAvgForLactationStage = (
  data,
  conversionNeeded = false,
) => {
  if (data && data.length > 0) {
    let total = 0;
    data.map(obj => {
      total += convertStringToNumber(obj.milk, !conversionNeeded);
    });
    return total / data.length;
  }
  return 0;
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

function toSentenceCase(str) {
  const lower = str.toLowerCase();
  const first = lower.charAt(0).toUpperCase();
  const subStr = first + lower.slice(1);
  return subStr;
}

export const getFormattedGoalsDataForBCS = (goalsArray, enumState) => {
  const mappedArray = goalsArray.map((goal, index) => {
    return {
      lactationStage: goal.lactationStage,
      lactationStageStr: enumState?.enum
        ? getFormattedLactationStage(enumState, goal.lactationStage)
        : [],
      firstInputValue: goal.goalMin,
      secondInputValue: goal.goalMax,
      rangeString: '(' + i18n.t(`lactationRange${index + 1}`) + ')',
    };
  });

  return mappedArray || [];
};

export const unformatGoalsDataForBCS = goals => {
  let mappedArray = [];
  if (goals && goals?.length > 0) {
    mappedArray = goals?.map(item => {
      return {
        lactationStage: item?.lactationStage,
        goalMin: item?.firstInputValue || 0,
        goalMax: item?.secondInputValue || 0,
      };
    });

    return mappedArray;
  }
  return mappedArray;
};

export const joinDataForBCSHerdAnalysisGraph = (labels, values) => {
  let formattedData = [];
  for (let i = 0; i < labels.length; i++) {
    formattedData.push({
      x: labels[i],
      y: values[i],
    });
  }
  return formattedData;
};

export const getDomain = data => {
  if (data && data.length > 0) {
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    return [minVal, maxVal];
  }
  return [0, 0];
};

export const bcsHerdGoalsFormatData = dataList => {
  return dataList.map(item => {
    return {
      ...item,
      ...(!!item?.goal && { goal: item?.goal?.toString() || '' }),
      firstInputValue: item?.firstInputValue?.toString() || '',
      secondInputValue: item?.secondInputValue?.toString() || '',
    };
  });
};

export const bcsHerdGoalsUnformatData = dataList => {
  return dataList.map(item => {
    return {
      ...item,
      // ...( !!item?.goal && { goal: parseFloat(item?.goal) || 0}),
      firstInputValue:
        parseFloat(convertStringToNumber(item?.firstInputValue)) || 0,
      secondInputValue:
        parseFloat(convertStringToNumber(item?.secondInputValue)) || 0,
    };
  });
};

export const mapGraphDataForBCSPenAnalysisExport = (
  visitState,
  graphData,
  penId,
  penName,
  avg,
  stdDev,
) => {
  let mappedArray = [];
  if (graphData?.length > 0) {
    graphData[0]?.data?.map(item => {
      mappedArray.push({
        visitDate: item?.x,
        bcsCategoryAverage: item?.y || 0,
      });
    });
  }

  const model = {
    standardDeviation: parseFloat(stdDev) || 0,
    average: parseFloat(avg) || 0,
    fileName: visitState.visitName + '-BCSPenAnalysis',
    visitName: visitState.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('BCS'),
    analysisType: i18n.t('penAnalysis'),
    penName,
    penId: penId || null,
    categories: mappedArray,

    standardDeviation: parseFloat(stdDev) || 0,
    average: parseFloat(avg) || 0,

    // for addition field comma separated value
    averageLabel: convertInputNumbersToRegionalBasis(
      Number(avg).toFixed(2),
      2,
      true,
    ),
    standardDeviationLabel: convertInputNumbersToRegionalBasis(
      Number(stdDev).toFixed(2),
      2,
      true,
    ),
  };

  return model;
};

export const mapGraphDataForBCSHerdAnalysisExport = (
  visitState,
  graphData,
  lactationStages,
) => {
  const { avgBCSData, minGoalsData, maxGoalsData, milkData } = graphData;
  const bcsDict = {},
    milkDict = {},
    minBCSDict = {},
    maxBCSDict = {};
  for (let i = 0; i < lactationStages.length; i++) {
    bcsDict[lactationStages[i]] = avgBCSData?.[i];
    milkDict[lactationStages[i]] = milkData?.[i];
    minBCSDict[lactationStages[i]] = minGoalsData?.[i];
    maxBCSDict[lactationStages[i]] = maxGoalsData?.[i];
    if (i <= 1) {
      milkDict[lactationStages?.[i]] = null;
    }
  }
  const model = {
    fileName: visitState?.visitName + '-BCSHerdAnalysis',
    visitName: visitState?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('BCS'),
    analysisType: i18n.t('herdAnalysis'),
    bcsAverage: bcsDict,
    bcsMin: minBCSDict,
    bcsMax: maxBCSDict,
    milkHdDay: milkDict,
  };

  return model;
};

export const addLastUpdatedInfoInTool = data => {
  const updatedObj = { ...data };
  updatedObj.needsSync = true;
  updatedObj.updated = true;
  updatedObj.updated_at = dateHelper.getUnixTimestamp(new Date());
  updatedObj.mobileLastUpdatedTime = dateHelper.getUnixTimestamp(new Date());
  return updatedObj;
};

export const customTick = tick => {
  const language = getLanguage();
  if (['ko', 'zh'].includes(language)) {
    return tick?.slice(0, 3) + '...';
  } else if (['pl', 'frca', 'fr', 'it'].includes(language)) {
    return tick?.slice(0, 5) + '...';
  } else if (['ru', 'pt'].includes(language)) {
    return tick?.slice(0, 6) + '...';
  }
  return tick?.length > 10
    ? tick?.slice(0, 7) + '...'
    : typeof tick === 'string'
    ? tick?.replace(' ', '\n')
    : tick;
};

export const getToolIcon = toolCategory => {
  switch (toolCategory) {
    case TOOL_CATEGORIES.CALF_HEIFER:
      return <CALF_HEIFER_ICON width={normalize(26)} height={normalize(20)} />;
    case TOOL_CATEGORIES.COMFORT:
      return <COMFORT_ICON width={normalize(22)} height={normalize(22)} />;
    case TOOL_CATEGORIES.HEALTH:
      return (
        <HEALTH_ICON
          width={normalize(22)}
          height={normalize(19)}
          stroke={colors.productivityColor}
          fill={colors.productivityColor}
        />
      );
    case TOOL_CATEGORIES.NUTRITION:
      return (
        <NUTRITION_ICON
          width={normalize(19)}
          height={normalize(22)}
          stroke={colors.nutritionColor}
          fillWidth={1}
        />
      );
    case TOOL_CATEGORIES.PRODUCTIVITY:
      return (
        <PRODUCTIVITY_ICON
          width={normalize(9)}
          height={normalize(20)}
          fill={colors.productivityColor}
        />
      );
  }
};

export const getToolAnalysisCategories = toolId => {
  const PEN_ANALYSIS = {
    title: i18n.t('pen'),
    value: TOOL_ANALYSIS_TYPES.PEN_ANALYSIS,
  };
  const HERD_ANALYSIS = {
    title: i18n.t('herd'),
    value: TOOL_ANALYSIS_TYPES.HERD_ANALYSIS,
  };
  const ANIMAL_ANALYSIS = {
    title: i18n.t('animalAnalysis'),
    value: TOOL_ANALYSIS_TYPES.ANIMAL_ANALYSIS,
  };
  const TMR_ANALYSIS = {
    title: i18n.t('tmr'),
    value: ROF_FORM_TYPES.TMR,
  };
  const INDIVIDUAL_COW_ANALYSIS = {
    title: i18n.t('individualCow'),
    value: ROF_FORM_TYPES.INDIVIDUAL_COWS,
  };
  switch (toolId) {
    case TOOL_TYPES.RUMEN_HEALTH:
    case TOOL_TYPES.TMR_PARTICLE_SCORE:
    case TOOL_TYPES.RUMEN_FILL:
    case TOOL_TYPES.RUMEN_HEALTH_MANURE_SCORE:
      return [PEN_ANALYSIS, HERD_ANALYSIS];
    case TOOL_TYPES.LOCOMOTION_SCORE:
    case TOOL_TYPES.BODY_CONDITION:
      return [ANIMAL_ANALYSIS, PEN_ANALYSIS, HERD_ANALYSIS];
    case TOOL_TYPES.METABOLIC_INCIDENCE:
    case TOOL_TYPES.MILK_SOLD_EVALUATION:
    case TOOL_TYPES.ROBOTIC_MILK_EVALUATION:
    case TOOL_TYPES.FORAGE_PENN_STATE:
    case TOOL_TYPES.CALF_HEIFER_GROWTH_CHARTS:
      return [HERD_ANALYSIS];
    case TOOL_TYPES.MANURE_SCREENER:
    case TOOL_TYPES.PEN_TIME_BUDGET_TOOL:
      return [PEN_ANALYSIS];
    case TOOL_TYPES.ROF:
      return [TMR_ANALYSIS, INDIVIDUAL_COW_ANALYSIS];
    default:
      return [];
  }
};

export const onCheckPileBunkerEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.feedStorageType &&
      enums?.enum?.feedStorageType?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};

export const onCheckMilkSoldEvaluationEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.milkPickup &&
      enums?.enum?.milkPickup?.length > 0 &&
      enums?.enum?.milkUreaMeasure &&
      enums?.enum?.milkUreaMeasure?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};

export const onCheckRumenHealthManureScoreEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.lactationStages &&
      enums?.enum?.lactationStages?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};
export const onCheckRumenHealthManureScreenerEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.lactationStages &&
      enums?.enum?.lactationStages?.length > 0 &&
      enums?.enum?.silageType &&
      enums?.enum?.silageType?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};
export const onCheckRumenHealthEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.lactationStages &&
      enums?.enum?.lactationStages?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};

export const onCheckRumenFillManureScoreEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.lactationStages &&
      enums?.enum?.lactationStages?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};
export const onCheckBCSEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.lactationStages?.length > 0 &&
      enums?.enum?.bcsPointScales?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};
export const onCheckForagePenStateEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.silageType?.length > 0 &&
      enums?.enum?.scorers?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};
export const onCheckRoboticMilkEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.robotType?.length > 0 &&
      enums?.enum?.cowFlowDesign?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};
export const onCheckTMRParticleEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.scorers?.length > 0 &&
      enums?.enum?.cowFlowDesign?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};
export const onCheckProfitabilityAnalysisEnums = enums => {
  let disabled = true;
  try {
    if (
      enums?.enum?.waterQuality?.length > 0 &&
      enums?.enum?.productionSystem?.length > 0 &&
      enums?.enum?.breed?.length > 0 &&
      enums?.enum?.profitabilityQualityAnalysis?.length > 0
    ) {
      disabled = false;
    }
    return disabled;
  } catch (error) {
    return disabled;
  }
};

export const penExistsInPublishedVisit = (
  isEditable = false,
  penAnalysisData = {}, //all pens and their data
  selectedPen = {}, //currently selected pen
  forLocomotion = false,
) => {
  if (!isEditable) {
    let selectedPenId = '';
    if (forLocomotion) {
      selectedPenId = selectedPen?.penId;
    } else {
      if (!stringIsEmpty(selectedPen?.sv_id)) {
        selectedPenId = selectedPen?.sv_id;
      } else if (!stringIsEmpty(selectedPen?.id)) {
        selectedPenId = selectedPen?.id;
      } else {
        selectedPenId = selectedPen?.localId;
      }
    }
    const filteredPen = penAnalysisData?.pens?.filter(
      penObj => (penObj?.penId || penObj?.localPenId) === selectedPenId,
    );
    if (filteredPen && filteredPen?.length > 0) {
      return true;
    }
    return false;
  }
  return true;
};

export const groupUsedUnusedTools = (visit, filteredCountryTools) => {
  if (visit) {
    const usedToolsList = [];
    const unusedToolsList = [];

    const visitKeys = Object.keys(visit);
    const toolValues = Object.values(TOOL_TYPES)?.map(item =>
      item.toLowerCase(),
    );

    for (let loopIndex = 0; loopIndex < visitKeys.length; loopIndex++) {
      const element = visitKeys[loopIndex]?.toLowerCase();

      if (
        [...toolValues].includes(element) &&
        !stringIsEmpty(visit[visitKeys[loopIndex]])
      ) {
        const filteredTool = filteredCountryTools?.find(
          item => item.toolId?.toLowerCase() === element,
        );

        if (filteredTool) {
          usedToolsList.push(filteredTool);
        }
      } else {
        const filteredTool = filteredCountryTools?.find(
          item => item.toolId?.toLowerCase() === element,
        );

        if (filteredTool) {
          unusedToolsList.push(filteredTool);
        }
      }
    }

    return { usedToolsList, unusedToolsList };
  }
};

export const formatPublishedVisitToolsForSectionList = (
  visit,
  countryTools,
) => {
  try {
    // Defensive checks: ensure inputs are valid
    if (!visit || typeof visit !== 'object') {
      return [];
    }
    if (!Array.isArray(countryTools) || countryTools.length === 0) {
      return [];
    }

    const usedTools = [];
    const usedToolIds = new Set();

    // Find used tools by iterating over visit keys
    const visitKeys = Object?.keys(visit) || [];
    for (const key of visitKeys) {
      // Check if the key corresponds to a tool and has data
      if (!stringIsEmpty(visit[key])) {
        const tool = countryTools?.find(
          t => t?.toolId?.toLowerCase() === key?.toLowerCase(),
        );
        if (tool && tool?.toolId) {
          // Avoid duplicates
          if (!usedToolIds.has(tool.toolId)) {
            usedTools.push(tool);
            usedToolIds.add(tool.toolId);
          }
        }
      }
    }

    // Find unused tools by filtering all country tools
    const unusedTools =
      countryTools?.filter(
        tool => tool?.toolId && !usedToolIds.has(tool.toolId),
      ) || [];

    const sections = [];
    if (usedTools.length > 0) {
      sections.push({
        sectionKey: 'USED',
        title: i18n.t('used'),
        data: usedTools,
      });
    }
    if (unusedTools.length > 0) {
      sections.push({
        sectionKey: 'UNUSED',
        title: i18n.t('unused'),
        data: unusedTools,
      });
    }

    return sections;
  } catch (error) {
    logEvent(
      'helpers -> toolHelper -> formatPublishedVisitToolsForSectionList Exception: ',
      error,
    );
    console.log(
      'helpers -> toolHelper -> formatPublishedVisitToolsForSectionList Exception:',
      error,
    );
    return [];
  }
};

export const getUpdateUpdatedToolTime = (visit, toolId) => {
  if (visit && visit?.visitStatus === VISIT_STATUS.PUBLISHED) {
    const visitKeys = Object.keys(visit);

    for (let loopIndex = 0; loopIndex < visitKeys.length; loopIndex++) {
      const element = visitKeys[loopIndex]?.toLowerCase();

      if (
        toolId?.toLowerCase() === element &&
        !stringIsEmpty(visit[visitKeys[loopIndex]])
      ) {
        const parsedToolData =
          typeof visit[visitKeys[loopIndex]] === 'string'
            ? JSON.parse(visit[visitKeys[loopIndex]])
            : visit[visitKeys[loopIndex]];

        if (parsedToolData) {
          if (dateHelper.isCurrentYear(parsedToolData?.mobileLastUpdatedTime)) {
            return dateHelper.getFormattedDate(
              parsedToolData?.mobileLastUpdatedTime,
              DATE_FORMATS.MMM_DD_H_MM,
            );
          } else {
            return dateHelper.getFormattedDate(
              parsedToolData?.mobileLastUpdatedTime,
              DATE_FORMATS.MMM_DD_YY_H_MM,
            );
          }
        }
      }
    }

    return null;
  }

  return null;
};

export const getPenNameFromPenId = (pens = [], penId) => {
  let filteredPen = pens.filter(pen => {
    if (!stringIsEmpty(pen.sv_id)) {
      return pen.sv_id == penId;
    } else {
      return pen.id == penId || pen.localId == penId;
    }
  });
  if (filteredPen && filteredPen.length > 0) {
    return filteredPen[0].name;
  }
};

/**
 * @description
 * helper function for scorecard tools that only update selected answer for the particular question
 * used in scorecard tools like.
 * 1. Forage audit scorecard
 * 2. Calf heifer scorecard
 *
 * @param {String} selectedAnswerKey key string that will update answer key inside question object.
 * @param {Object} question question object in which updated answer will be mapped.
 * @param {Object} selectedAnswer answer object which will mapped in question's answer key.
 * @returns
 */
export const updateSelectedQuestionWithAnswerInScorecardTool = ({
  selectedAnswerKey = '',
  question = null,
  selectedAnswer = null,
}) => {
  if (question && selectedAnswer) {
    const updateQuestion = {
      ...question,
      [selectedAnswerKey]: selectedAnswer,
    };

    return updateQuestion;
  }

  return null;
};
export const getTotalAnimalsCount = (data = []) => {
  try {
    return data.reduce((total, row) => {
      const animalObj = row.find(item => item.column === 'Animals observed');
      return total + (Number(animalObj?.value) || 0);
    }, 0);
  } catch (e) {
    logEvent('toolHelper - getTotalAnimalsCount Exception', e);
    console.log('toolHelper - getTotalAnimalsCount Exception', e);
    return 0;
  }
};

export const extractPenDataFromPublishedVisitTools = (
  pensList,
  toolType,
  toolData,
) => {
  try {
    let toolPens = [];

    switch (toolType) {
      case VISIT_TABLE_FIELDS.LOCOMOTION_SCORE: {
        toolPens = extractLocomotionPens(pensList, toolData);
        break;
      }
      case VISIT_TABLE_FIELDS.BODY_CONDITION: {
        toolPens = extractBCSPens(pensList, toolData);
        break;
      }
      case VISIT_TABLE_FIELDS.RUMEN_HEALTH_MANURE_SCORE: {
        toolPens = extractManureScorePens(pensList, toolData);
        break;
      }
      case VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL: {
        toolPens = extractPenTimeBudgetPens(pensList, toolData);
        break;
      }
      case VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL: {
        toolPens = extractManureScreenerPens(pensList, toolData);
        break;
      }
      case VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE: {
        toolPens = extractRumenFillPens(pensList, toolData);
        break;
      }
      case VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE: {
        toolPens = extractTmrPenStatePens(pensList, toolData);
        break;
      }
      case VISIT_TABLE_FIELDS.RUMEN_HEALTH: {
        toolPens = extractRumenHealthPens(pensList, toolData);
        break;
      }

      default:
        break;
    }

    const mappedPens = mapToolPensToPenList(toolPens, pensList);

    return mappedPens;
  } catch (error) {
    console.log('error extractPenDataFromPublishedVisitTools', error);
    logEvent(
      'helpers -> toolHelper - extractPenDataFromPublishedVisitTools Exception',
      error,
    );
    return null;
  }
};

function mapToolPensToPenList(toolPens, penList) {
  try {
    const pens = toolPens?.map(item => {
      let pen = penList?.find(
        p => p?.id == item?.penId || p?.sv_id == item?.penId,
      );
      const model = {
        ...item,
        id: pen?.id || item?.id || item?.penId,
        name: pen?.name || item?.penName,
        sv_id: item?.penId || '',
      };

      return model;
    });

    return pens || [];
  } catch (error) {
    logEvent('helpers -> toolHelper - mapToolPensToPenList Exception', error);
    return [];
  }
}
