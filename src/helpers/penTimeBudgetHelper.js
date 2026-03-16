//localization
import i18n from '../localization/i18n';

//helpers
import {
  convertNumberToString,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import { dateHelper, getFormattedDate } from './dateHelper';
import { convertDenominatorWeightToImperial } from './appSettingsHelper';

//constants
import { PEN_TIME_BUDGET_KEYS } from '../constants/FormConstants';
import {
  DATE_FORMATS,
  UNIT_OF_MEASURE,
  VISIT_TABLE_FIELDS,
} from '../constants/AppConstants';
import { PEN_TIME_CATEGORIES } from '../constants/toolsConstants/PenTimeBudget';
import { getParsedToolData } from './genericHelper';
import { logEvent } from './logHelper';

export const parsePenTimeBudgetData = (pen, result, isEditable) => {
  let obj = {};
  obj.id = pen?.penId || pen?.sv_id;
  obj[PEN_TIME_BUDGET_KEYS.SELECTED_PEN_ID] = pen?.id;
  obj[PEN_TIME_BUDGET_KEYS.MILKING_FREQUENCY] =
    convertNumberToString(pen?.milkingFrequency) || '';
  obj[PEN_TIME_BUDGET_KEYS.NO_OF_STALLS] =
    convertNumberToString(pen?.stalls) || '';
  obj[PEN_TIME_BUDGET_KEYS.ANIMALS_IN_PENS] =
    convertNumberToString(pen?.animals) || '';
  obj[PEN_TIME_BUDGET_KEYS.WALKING_TIME_TO_PARLOR] =
    convertNumberToString(pen?.walkingTimeToParlor) || '';

  obj[PEN_TIME_BUDGET_KEYS.WALKING_TIME_FROM_PARLOR] =
    convertNumberToString(pen?.walkingTimeFromParlor) || '';
  obj[PEN_TIME_BUDGET_KEYS.TIME_IN_PARLOR] =
    convertNumberToString(pen?.timeInParlor) || '';

  obj[PEN_TIME_BUDGET_KEYS.TOTAL_STALLS_IN_PARLOR] =
    convertNumberToString(pen?.stallsInParlor) || '';
  obj[PEN_TIME_BUDGET_KEYS.RESTING_REQUIREMENT] =
    convertNumberToString(pen?.restingRequirement) || '';
  obj[PEN_TIME_BUDGET_KEYS.TIME_IN_LOCK_UP] =
    convertNumberToString(pen?.timeInLockUp) || '';
  obj[PEN_TIME_BUDGET_KEYS.OTHER_NON_REST_TIME] =
    convertNumberToString(pen?.otherNonRestTime) || '';
  obj[PEN_TIME_BUDGET_KEYS.EATING_TIME] =
    convertNumberToString(pen?.eatingTime) || '';
  obj[PEN_TIME_BUDGET_KEYS.DRINKING_GROOMING_TIME] =
    convertNumberToString(pen?.drinkingGroomingTime) || '';

  return obj;
};

export const parseTimeBudgetData = (data, penList) => {
  let result = {};
  const keys = Object.keys(data);
  const pen = !!penList?.length
    ? penList.filter(el => el.id === data?.selectedPenId)
    : [];

  for (let key of keys) {
    if (key != PEN_TIME_BUDGET_KEYS.SELECTED_PEN_ID) {
      result[key] = !!data[key]
        ? parseFloat(convertStringToNumber(data[key]))
        : null;
    }
  }
  delete result?.id;

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

export const getFormattedPenTimeBudgetRecentVisits = (recentVisits = []) => {
  const data = recentVisits.map(visitObj => {
    const allData = visitObj.penTimeBudgetTool
      ? JSON.parse(visitObj.penTimeBudgetTool)
      : null;
    return {
      penTimeBudget: allData || null,
      visitId: visitObj.id,
      date: visitObj.visitDate,
      mobileLastUpdatedTime: visitObj?.mobileLastUpdatedTime,
    };
  });
  return data;
};

export const parsePenTimeBudgetSummaryData = (
  recentVisits,
  selectedPen,
  selectedVisits,
  unitOfMeasure,
) => {
  const arr = [];
  const summaryData = [];

  selectedVisits = selectedVisits.slice(0, 2);
  recentVisits = recentVisits?.filter(visit =>
    selectedVisits.includes(visit.visitId),
  );

  recentVisits?.forEach(visit => {
    let obj = getSummaryData(visit, selectedPen, unitOfMeasure);
    summaryData.push(obj);
  });

  const keys = Object.values(PEN_TIME_CATEGORIES);
  for (let key of keys) {
    let obj = {
      category: i18n.t(key),
      currentValue: !!summaryData?.[0]?.[key] ? summaryData?.[0]?.[key] : '-',
      previousValue: !!summaryData?.[1]?.[key] ? summaryData?.[1]?.[key] : '-',
    };
    if (
      key === PEN_TIME_CATEGORIES.POTENTIAL_MILK_LOSS_GAIN ||
      key === PEN_TIME_CATEGORIES.BODY_WEIGHT_CHANGE
    ) {
      if (unitOfMeasure === UNIT_OF_MEASURE.METRIC) {
        obj.category = `${obj.category} (${i18n.t('kgs')})`;
      } else if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
        obj.category = `${obj.category} (${i18n.t('lbs')})`;
      }
    }
    arr.push(obj);
  }
  return arr;
};

export const getSummaryData = (visit, selectedPen, unitOfMeasure) => {
  let obj = {};

  const pens = visit.penTimeBudget
    ? visit.penTimeBudget?.pens
    : visit.penTimeBudgetTool
    ? JSON.parse(visit.penTimeBudgetTool)?.pens
    : [];

  const pen = pens?.find(
    el =>
      el?.penId == selectedPen?.id ||
      el?.penId === selectedPen?.selectedPenId ||
      el?.penId === selectedPen?.penId,
  );

  const animals = parseFloat(pen?.animals) || 0;
  const noOfStalls = parseFloat(pen?.stallsInPen) || 0;
  const milkingFrequency =
    parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.MILKING_FREQUENCY]) || 0;

  obj.animalsInPen = animals;
  let overCrowding = null;
  if (noOfStalls > 0 && animals >= 0) {
    overCrowding = (animals / noOfStalls) * 100;
    overCrowding = parseFloat(overCrowding)?.toFixed(1);
  } else {
    overCrowding = null;
  }
  obj.overCrowding = overCrowding;

  const timePerMilking = getTimePerMilkingValue(pen);
  obj.timePerMilking = timePerMilking?.toFixed(2);

  // (Animals in pen/Time in parlor/Total stalls in parlor
  let parlorTurnsPerHour = 0;
  const timeInParlor = pen?.[PEN_TIME_BUDGET_KEYS.TIME_IN_PARLOR];
  const totalStalls = pen?.[PEN_TIME_BUDGET_KEYS.TOTAL_STALLS_IN_PARLOR];
  if (animals >= 0 && !!timeInParlor && !!totalStalls) {
    parlorTurnsPerHour = getParlorTurnsPerHour(
      animals,
      timeInParlor,
      totalStalls,
    );
  } else {
    parlorTurnsPerHour = 0;
  }

  obj.parlorTurnsPerHour = parlorTurnsPerHour?.toFixed(2);
  // Animals in pen/Time in parlor (all from inputs)
  let animalsMilkedPerHour = 0;
  if (animals >= 0 && !!timeInParlor) {
    animalsMilkedPerHour = parseFloat(animals / timeInParlor);
  } else animalsMilkedPerHour = 0;

  obj.animalsMilkedPerHour = animalsMilkedPerHour?.toFixed(2);

  const totalTimeMilking = parseFloat(timePerMilking * milkingFrequency);
  obj.totalTimeMilking = totalTimeMilking?.toFixed(2);

  const walkingToFindStall = getWalkingToFindStall(overCrowding);
  obj.walkingToFindStall = walkingToFindStall;

  const totalNonRestingTime = getTotalNonRestingTimeValue(
    walkingToFindStall,
    totalTimeMilking,
    pen,
  );

  obj.totalNonRestingTime = totalNonRestingTime?.toFixed(1);

  const timeRemainingForResting = parseFloat(24 - totalNonRestingTime);
  obj.timeRemainingForResting = timeRemainingForResting?.toFixed(2);

  const timeRequiredForResting =
    pen?.[PEN_TIME_BUDGET_KEYS.RESTING_REQUIREMENT] || 0;
  obj.timeRequiredForResting = timeRequiredForResting;

  const restingDifference = parseFloat(
    timeRemainingForResting - timeRequiredForResting,
  );

  obj.restingDifference = restingDifference?.toFixed(2);

  let potentialMilkLossGain = parseFloat(restingDifference * 1.5873);

  if (unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL) {
    const el = parseFloat(restingDifference * 1.5873);
    potentialMilkLossGain = parseFloat(
      convertDenominatorWeightToImperial(el, 1),
    );
  }
  obj.potentialMilkLossGain = potentialMilkLossGain?.toFixed(1);

  const energyChange = parseFloat(potentialMilkLossGain * 0.7276);
  obj.energyChange = energyChange?.toFixed(1);

  let bodyWeightChange = parseFloat(energyChange / 4.9171);

  if (unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL) {
    const e = parseFloat(energyChange / 4.9171);
    bodyWeightChange = parseFloat(e * 2.2);
  }

  obj.bodyWeightChange = bodyWeightChange?.toFixed(2);
  const bodyConditionScoreChange = parseFloat(bodyWeightChange * 1.8375);
  obj.bodyConditionScoreChange = bodyConditionScoreChange?.toFixed(2);

  return obj;
};

const getParlorTurnsPerHour = (animals, timeInParlor, totalStalls) => {
  const value = animals / timeInParlor / totalStalls;
  return parseFloat(value);
};

const getTimePerMilkingValue = pen => {
  const value =
    parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.WALKING_TIME_FROM_PARLOR] || 0) +
    parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.WALKING_TIME_TO_PARLOR] || 0) +
    parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.TIME_IN_PARLOR] || 0);

  if (value >= 0) {
    return parseFloat(value);
  }
  return value || 0;
};

const getTotalNonRestingTimeValue = (
  walkingToFindStall,
  totalTimeMilking,
  pen,
) => {
  const value =
    +walkingToFindStall +
    +totalTimeMilking +
    parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.EATING_TIME] || 0) +
    parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.DRINKING_GROOMING_TIME] || 0) +
    parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.OTHER_NON_REST_TIME] || 0) +
    parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.TIME_IN_LOCK_UP] || 0);
  if (value >= 0) {
    return parseFloat(value);
  }
  return value || 0;
};

const getWalkingToFindStall = value => {
  let walking = null;
  if (value != null) {
    if (value >= 130) {
      walking = 2.5;
    } else if (value >= 115 && value <= 129) {
      walking = 2.3;
    } else if (value >= 95 && value <= 114) {
      walking = 2.0;
    } else {
      walking = 1.8;
    }
  }
  return walking;
};

export const parseSummaryHeader = (recentVisits, selectedVisits) => {
  selectedVisits = selectedVisits.slice(0, 2);
  recentVisits = recentVisits?.filter(visit =>
    selectedVisits.includes(visit.visitId),
  );

  const dates =
    recentVisits?.map(visit =>
      getFormattedDate(visit.date, DATE_FORMATS.MM_dd),
    ) || [];

  const tableHeader = [];
  tableHeader.push(i18n.t('categories'));
  dates?.forEach((element, index) => {
    let date = element;
    if (!index) {
      date = element + `\n${i18n.t('current')}`;
    }
    tableHeader.push(date);
  });

  if (tableHeader?.length < 3) {
    tableHeader.push('-');
  }

  return tableHeader;
};

export const joinPenTimeAnalysisGraph = (labels, values) => {
  let formattedData = [];
  for (let i = 0; i < labels.length; i++) {
    formattedData.push({
      x: labels[i],
      y: values[i],
    });
  }
  return formattedData;
};

export const getTimeRequiredGraphData = (
  recentVisits,
  selectedPen,
  unitOfMeasure,
) => {
  const data = [];
  recentVisits?.forEach(visit => {
    let obj = {};
    const pens = visit?.penTimeBudget?.pens;
    const pen = pens?.find(
      el =>
        el?.penId == selectedPen?.id ||
        el?.penId === selectedPen?.selectedPenId,
    );
    const visitDate = getFormattedDate(visit?.date, DATE_FORMATS.MM_dd);
    const animals = parseFloat(pen?.animals) || 0;
    const noOfStalls = parseFloat(pen?.stallsInPen) || 0;
    const milkingFrequency =
      parseFloat(pen?.[PEN_TIME_BUDGET_KEYS.MILKING_FREQUENCY]) || 0;

    obj.visitDate = visitDate;
    obj.animalsInPen = animals;
    let overCrowding = null;
    if (noOfStalls > 0 && animals >= 0) {
      overCrowding = (animals / noOfStalls) * 100;
      overCrowding = parseFloat(overCrowding)?.toFixed(1);
    } else {
      overCrowding = null;
    }
    obj.overCrowding = overCrowding;

    const timePerMilking = getTimePerMilkingValue(pen);
    obj.timePerMilking = timePerMilking?.toFixed(2);

    // (Animals in pen/Time in parlor/Total stalls in parlor
    let parlorTurnsPerHour = 0;
    const timeInParlor = pen?.[PEN_TIME_BUDGET_KEYS.TIME_IN_PARLOR];
    const totalStalls = pen?.[PEN_TIME_BUDGET_KEYS.TOTAL_STALLS_IN_PARLOR];
    if (animals >= 0 && !!timeInParlor && !!totalStalls) {
      parlorTurnsPerHour = getParlorTurnsPerHour(
        animals,
        timeInParlor,
        totalStalls,
      );
    } else {
      parlorTurnsPerHour = 0;
    }

    obj.parlorTurnsPerHour = parlorTurnsPerHour?.toFixed(2);
    // Animals in pen/Time in parlor (all from inputs)
    let animalsMilkedPerHour = 0;
    if (animals >= 0 && !!timeInParlor) {
      animalsMilkedPerHour = parseFloat(animals / timeInParlor);
    } else animalsMilkedPerHour = 0;

    obj.animalsMilkedPerHour = animalsMilkedPerHour?.toFixed(2);

    const totalTimeMilking = parseFloat(timePerMilking * milkingFrequency);
    obj.totalTimeMilking = totalTimeMilking?.toFixed(2);

    const walkingToFindStall = getWalkingToFindStall(overCrowding);
    obj.walkingToFindStall = walkingToFindStall;

    const totalNonRestingTime = getTotalNonRestingTimeValue(
      walkingToFindStall,
      totalTimeMilking,
      pen,
    );

    obj.totalNonRestingTime = totalNonRestingTime?.toFixed(1);

    const timeRemainingForResting = parseFloat(24 - totalNonRestingTime);
    obj.timeRemainingForResting = timeRemainingForResting?.toFixed(2);

    const timeRequiredForResting =
      pen?.[PEN_TIME_BUDGET_KEYS.RESTING_REQUIREMENT] || 0;
    obj.timeRequiredForResting = timeRequiredForResting;

    const restingDifference = parseFloat(
      timeRemainingForResting - timeRequiredForResting,
    );

    obj.restingDifference = restingDifference?.toFixed(2);

    let potentialMilkLossGain = parseFloat(restingDifference * 1.5873);

    if (unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL) {
      const el = parseFloat(restingDifference * 1.5873);
      potentialMilkLossGain = parseFloat(el / 2.2);
    }
    obj.potentialMilkLossGain = potentialMilkLossGain?.toFixed(1);

    const energyChange = parseFloat(potentialMilkLossGain * 0.7276);
    obj.energyChange = energyChange?.toFixed(1);

    let bodyWeightChange = parseFloat(energyChange / 4.9171);

    if (unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL) {
      const e = parseFloat(energyChange / 4.9171);
      bodyWeightChange = parseFloat(e * 2.2);
    }

    obj.bodyWeightChange = bodyWeightChange?.toFixed(2);
    const bodyConditionScoreChange = parseFloat(bodyWeightChange * 1.8375);
    obj.bodyConditionScoreChange = bodyConditionScoreChange?.toFixed(2);
    data.push(obj);
    obj = {};
  });

  return data;
};

export const parseExportTimeAvailableForResting = (visitState, graphData) => {
  const visit = visitState?.visit || {};

  // const timeRequired = graphData?.reduce(
  //   (obj, el) =>
  //     Object.assign(obj, {
  //       [el?.visitDate]: parseFloat(el?.timeRequiredForResting) || 0,
  //     }),
  //   {},
  // );

  // const timeRemaining = graphData?.reduce(
  //   (obj, el) =>
  //     Object.assign(obj, {
  //       [el?.visitDate]: parseFloat(el?.timeRemainingForResting) || 0,
  //     }),
  //   {},
  // );

  const timeRequired = graphData?.map(el => {
    return {
      x: el?.visitDate,
      y: parseFloat(el?.timeRequiredForResting) || 0,
    };
  });

  const timeRemaining = graphData?.map(el => {
    return {
      x: el?.visitDate,
      y: parseFloat(el?.timeRemainingForResting) || 0,
    };
  });

  const obj = {
    visitName: visit?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visit?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    fileName: visit?.visitName + 'PenTimeBudget',
    toolName: i18n.t('penTimeBudget'),
    categoryLabel: i18n.t('timeAvailableForResting'),
    sheetName: i18n.t('timeAvailableForResting'),
    label: i18n.t('hours'),
    timeRequired: [...timeRequired],
    timeRemaining: [...timeRemaining],
    // timeRequired: {
    //   ...timeRequired,
    // },
    // timeRemaining: {
    //   ...timeRemaining,
    // },
  };
  return obj;
};

export const parseExportPotentialMilkLoss = (
  visitState,
  graphData,
  unitOfMeasure,
) => {
  const visit = visitState?.visit || {};

  const potentialMilkDifference = graphData?.map(el => {
    return {
      x: el?.visitDate,
      y: el?.potentialMilkLossGain || 0,
    };
  });

  const obj = {
    visitName: visit?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visit?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    fileName: visit?.visitName + 'PenTimeBudget',
    toolName: i18n.t('penTimeBudget'),
    categoryLabel: i18n.t('potentialMilkDifference'),
    sheetName: i18n.t('potentialMilkDifference'),
    Label:
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
        ? i18n.t('lbs')
        : i18n.t('kgs'),
    DataPoints: [...potentialMilkDifference],
  };
  return obj;
};

export const penExistsInPublishedVisit = (
  isEditable = false,
  penAnalysisData = [], //all pens and their data
  selectedPenId = '', //currently selected pen
) => {
  if (!isEditable) {
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

//UNUSED FUNCTION
export const checkIfFieldsAreFilled = values => {
  if (values) {
    for (const key in values) {
      if (
        key !== PEN_TIME_BUDGET_KEYS.TOTAL_STALLS_IN_PARLOR &&
        key !== 'id' &&
        key !== PEN_TIME_BUDGET_KEYS.SELECTED_PEN_ID
      ) {
        if (
          !values?.[key] ||
          stringIsEmpty(values?.[key]) ||
          values?.[key] === null ||
          values?.[key] === 0 ||
          values?.[key] === '0'
        ) {
          return false;
        }
      }
    }
  } else {
    return false;
  }
  return true;
};

const getUsableValue = val => {
  let itemValue = val;
  if (itemValue) {
    if (typeof itemValue === 'string') {
      if (itemValue === '-') {
        itemValue = 0;
      } else {
        itemValue = convertStringToNumber(itemValue);
      }
    }
  } else {
    itemValue = 0;
  }
  return itemValue;
};

export const checkIfGraphDependentValuesAreZero = (
  summaryDataForGraphTab = [], //summary data from which results are created - array
  setShouldEnableResultsButton, //setter for enabling/disabling graph tab button
) => {
  if (summaryDataForGraphTab?.length > 0) {
    let timeRemainingValue = 0;
    let timeRequiredValue = 0;
    let potentialMilkLossGainValue = 0;
    summaryDataForGraphTab?.forEach(item => {
      if (
        item?.category === 'Time remaining for resting (hrs)' ||
        item?.category === i18n.t('timeRemainingForResting')
      ) {
        timeRemainingValue = getUsableValue(item?.currentValue);
      } else if (
        item?.category === 'Time required for resting (hrs)' ||
        item?.category === i18n.t('timeRequiredForResting')
      ) {
        timeRequiredValue = getUsableValue(item?.currentValue);
      } else if (
        item?.category?.includes('Potential milk loss/gain') ||
        item?.category.includes(i18n.t('potentialMilkLossGain'))
      ) {
        potentialMilkLossGainValue = getUsableValue(item?.currentValue);
      }

      if (
        timeRemainingValue === 0 &&
        timeRequiredValue === 0 &&
        potentialMilkLossGainValue === 0
      ) {
        setShouldEnableResultsButton && setShouldEnableResultsButton(false);
      } else {
        setShouldEnableResultsButton && setShouldEnableResultsButton(true);
      }
    });
  } else {
    setShouldEnableResultsButton && setShouldEnableResultsButton(false);
  }
};

export const extractUsedPensFromPenTimeBudgetTool = (
  penTimeBudgetPen = null,
  currentVisit,
) => {
  try {
    let usedPensPayload = [];
    if (penTimeBudgetPen) {
      const parsedVisitUsedPens = getParsedToolData(currentVisit?.usedPens);

      if (
        parsedVisitUsedPens &&
        parsedVisitUsedPens?.[VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL]?.length >
          0
      ) {
        usedPensPayload =
          parsedVisitUsedPens?.[VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL];

        const parsedPenTimeBudget = getParsedToolData(
          currentVisit.penTimeBudgetTool,
        );

        const isPenExist = parsedPenTimeBudget?.pens?.find(
          item => item?.penId === penTimeBudgetPen?.penId,
        );
        if (!isPenExist) {
          usedPensPayload.push(penTimeBudgetPen?.penId);
        }
      } else {
        usedPensPayload.push(penTimeBudgetPen?.penId);
      }
    }

    const payload = {
      [VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL]: usedPensPayload,
    };
    return payload;
  } catch (error) {
    logEvent(
      'helpers -> penTimeBudgetHelper -> extractUsedPensFromPenTimeBudgetTool Error:',
      error,
    );
    return null;
  }
};

export function deletePenDataInsidePenTimeBudgetTool(penTimeData, pen) {
  try {
    const parsedPenTimeData = getParsedToolData(penTimeData);

    if (parsedPenTimeData) {
      const filteredPens = [];

      parsedPenTimeData.pens?.map(item => {
        if (item.penId !== pen) filteredPens.push(item);
      });

      parsedPenTimeData.pens = filteredPens;

      if (parsedPenTimeData.pens?.length <= 0) {
        return null;
      }
    }

    return parsedPenTimeData;
  } catch (error) {
    logEvent(
      'helpers -> penTimeBudgetHelper -> deletePenDataInsidePenTimeBudgetTool Error:',
      error,
    );
    return penTimeData;
  }
}

export const extractPenTimeBudgetPens = (penList, penTimeBudgetData) => {
  try {
    if (penTimeBudgetData) {
      const extractedPens = [];

      const parsedPenTimeBudgetData = getParsedToolData(penTimeBudgetData);
      parsedPenTimeBudgetData?.pens?.map(pen => {
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
      'helpers -> penTimeBudgetHelper -> extractPenTimeBudgetPens error',
      error,
    );
    return [];
  }
};
