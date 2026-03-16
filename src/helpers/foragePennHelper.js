//constants
import {
  FORAGE_PENN_STATE,
  FORAGE_PENN_STATE_FIELDS,
} from '../constants/FormConstants';
import { OTHER } from '../constants/toolsConstants/ForagePenState';
import {
  DATE_FORMATS,
  SILAGE_TYPE_CORN,
  SCORER_ENUMS,
  TOOL_TYPES,
  ENUM_CONSTANTS,
} from '../constants/AppConstants';

//helpers
import {
  convertNumberToString,
  convertNumbersToEnFormat,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import { dateHelper, getFormattedDate } from './dateHelper';

// colors
import colors from '../constants/theme/variables/customColor';

//localization
import i18n from '../localization/i18n';

//lodash
import _ from 'lodash';

export const getInitialAccordionModelValues = (silageType, scorer) => {
  const obj = {};
  Object.keys(FORAGE_PENN_STATE_FIELDS)?.forEach(key => {
    obj[FORAGE_PENN_STATE_FIELDS[key]] = '';
  });

  if (scorer === SCORER_ENUMS.THREE_SCREEN) {
    delete obj[FORAGE_PENN_STATE_FIELDS.MID2];
  }

  const cornSilage = silageType?.find(item => item.key === SILAGE_TYPE_CORN);
  obj[FORAGE_PENN_STATE_FIELDS.SILAGE] = cornSilage
    ? cornSilage?.key
    : silageType[0]?.key || '';

  return obj;
};

export const getInitialScorerValue = (foragePenn, enumState, site) => {
  //for visits that are already in use
  if (!stringIsEmpty(foragePenn?.scorer)) {
    return foragePenn?.scorer;
  }
  const siteData = site;

  //for first time use of tool in visit
  if (!_.isEmpty(siteData?.keys)) {
    let keys = siteData.keys;
    if (typeof keys === 'string') {
      keys = JSON.parse(keys);
    }
    const obj = keys[TOOL_TYPES.FORAGE_PENN_STATE];
    if (!_.isEmpty(obj)) {
      if (typeof obj === 'string') {
        const el = JSON.parse(obj);
        return el && el.scorer ? el?.scorer : '';
      } else {
        return obj.scorer ? obj?.scorer : '';
      }
    }
  }
  const { scorers = [] } = enumState || [];
  const scorer =
    scorers &&
    scorers?.length > 0 &&
    scorers.find(el => el?.key === SCORER_ENUMS.FOUR_SCREEN_NEW);

  // if (!!foragePenn?.scorer) {
  //   return foragePenn?.scorer;
  // }
  return scorer?.key;
};

export const getInitialGoalsValue = (conversionNeeded = false, scoreType) => {
  const includeMid2 = scoreType !== SCORER_ENUMS.THREE_SCREEN;

  const createMid2Goal = (min, max) => ({
    silageRange: i18n.t('mid2_4mm'),
    goalMin: convertNumberToString(min, !conversionNeeded),
    goalMax: convertNumberToString(max, !conversionNeeded),
  });

  const goals = [
    {
      silageType: 'Straw',
      goals: [
        {
          silageRange: i18n.t('top_19mm'),
          goalMin: convertNumberToString(25.0, !conversionNeeded),
          goalMax: convertNumberToString(40.0, !conversionNeeded),
        },
        {
          silageRange: i18n.t('mid1_18mm'),
          goalMin: convertNumberToString(25.0, !conversionNeeded),
          goalMax: convertNumberToString(40.0, !conversionNeeded),
        },
        ...(includeMid2 ? [createMid2Goal(10.0, 25.0)] : []),
        {
          silageRange: i18n.t('tray'),
          goalMin: convertNumberToString(0.0, !conversionNeeded),
          goalMax: convertNumberToString(10.0, !conversionNeeded),
        },
      ],
    },
    {
      silageType: 'Dryhay',
      goals: [
        {
          silageRange: i18n.t('top_19mm'),
          goalMin: convertNumberToString(25.0, !conversionNeeded),
          goalMax: convertNumberToString(40.0, !conversionNeeded),
        },
        {
          silageRange: i18n.t('mid1_18mm'),
          goalMin: convertNumberToString(25.0, !conversionNeeded),
          goalMax: convertNumberToString(40.0, !conversionNeeded),
        },
        ...(includeMid2 ? [createMid2Goal(10.0, 25.0)] : []),
        {
          silageRange: i18n.t('tray'),
          goalMin: convertNumberToString(0.0, !conversionNeeded),
          goalMax: convertNumberToString(10.0, !conversionNeeded),
        },
      ],
    },
    {
      silageType: 'Haylage',
      goals: [
        {
          silageRange: i18n.t('top_19mm'),
          goalMin: convertNumberToString(5.0, !conversionNeeded),
          goalMax: convertNumberToString(15.0, !conversionNeeded),
        },
        {
          silageRange: i18n.t('mid1_18mm'),
          goalMin: convertNumberToString(50.0, !conversionNeeded),
          goalMax: convertNumberToString(75.0, !conversionNeeded),
        },
        ...(includeMid2 ? [createMid2Goal(20.0, 30.0)] : []),
        {
          silageRange: i18n.t('tray'),
          goalMin: convertNumberToString(0.0, !conversionNeeded),
          goalMax: convertNumberToString(5.0, !conversionNeeded),
        },
      ],
    },
    {
      silageType: 'Corn',
      goals: [
        {
          silageRange: i18n.t('top_19mm'),
          goalMin: convertNumberToString(3.0, !conversionNeeded),
          goalMax: convertNumberToString(8.0, !conversionNeeded),
        },
        {
          silageRange: i18n.t('mid1_18mm'),
          goalMin: convertNumberToString(50.0, !conversionNeeded),
          goalMax: convertNumberToString(65.0, !conversionNeeded),
        },
        ...(includeMid2 ? [createMid2Goal(30.0, 40.0)] : []),
        {
          silageRange: i18n.t('tray'),
          goalMin: convertNumberToString(0, !conversionNeeded),
          goalMax: convertNumberToString(5.0, !conversionNeeded),
        },
      ],
    },
  ];
  return goals;
};

export const parseGoalsData = (arr, conversionNeeded = false) => {
  const goals = [];
  let obj = {};
  arr?.forEach((e, index) => {
    e?.goals?.forEach(v => {
      obj = {};
      obj = {
        ...v,
        silage: e.silageType,
        goalMax: !!v?.goalMax
          ? parseFloat(convertStringToNumber(v?.goalMax, !conversionNeeded))
          : 0,
        goalMin: !!v?.goalMin
          ? parseFloat(convertStringToNumber(v?.goalMin, !conversionNeeded))
          : 0,
      };
      goals.push(obj);
    });
  });

  return goals;
};

export const parseOtherGoalsTypeData = (data, enumState) => {
  const { silageType = [] } = enumState || [];
  const keys = silageType ? silageType?.map(el => el.key.toLowerCase()) : [];

  const result = [];
  data?.forEach(el => {
    if (!keys.includes(el?.silage?.toLowerCase())) {
      result.push({
        ...el,
        [FORAGE_PENN_STATE_FIELDS.SILAGE]: OTHER,
      });
    } else {
      result.push({
        ...el,
      });
    }
  });
  return result;
};

const getAllDefaultGoals = goals => {
  const defaultGoals = goals?.reduce((groups, item) => {
    let type = item?.silage;
    if (!groups[type]) {
      groups[type] = { silageType: type, goals: [] };
    }
    item.goalMin = convertNumberToString(item.goalMin);
    item.goalMax = convertNumberToString(item.goalMax);
    groups[type].goals.push(item);
    return groups;
  }, {});

  const groupedGoals = Object.values(defaultGoals || {});

  return groupedGoals;
};

export const getGoalsValues = (foragePenn, enumState, herdInputs) => {
  // goals values
  const { goals = [] } = foragePenn?.foragePennState || [];

  // get default keys of silage enum
  const { silageType = [] } = enumState || [];
  const keys = silageType ? silageType?.map(el => el.key.toLowerCase()) : [];

  // get selected silages form inputs
  const inputs = herdInputs?.foragePennState;
  if (!inputs.length) {
    let result = getAllDefaultGoals(goals ? goals : []);
    if (foragePenn?.foragePennState?.scorer === SCORER_ENUMS.THREE_SCREEN) {
      result = result.map(item => ({
        ...item,
        goals: removeGoals(item.goals),
      }));
    }
    return result;
  }
  // grouping goals on the base of silage type
  const result =
    goals &&
    goals?.reduce((groups, item) => {
      let type = item?.silage;

      if (type == OTHER) {
        type = item?.silageId;
      }

      if (!groups[type]) {
        groups[type] = { silageType: type, goals: [] };
      }

      item.goalMin = convertNumberToString(item.goalMin);
      item.goalMax = convertNumberToString(item.goalMax);

      groups[type].goals.push(item);
      return groups;
    }, {});

  const obj = {};
  const inputData = inputs?.map(e => {
    if (!keys.includes(e?.silage?.toLowerCase())) {
      return {
        ...e,
        silage: OTHER,
        silageId: e?.silage,
      };
    }
    return { ...e };
  });

  inputData?.forEach(e => {
    result &&
      Object.keys(result).forEach(el => {
        if (e?.silageId === el && e.silage == OTHER) {
          obj[el] = result[el];
        } else if (e?.silage == OTHER && e?.silageId !== el) {
          if (_.isEmpty(obj[e.silageId])) {
            obj[e.silageId] = getOtherGoalsDefaultValues(
              e?.silageId || e.silage,
              e.silageId,
            );
          }
        } else if (e.silage === el) {
          obj[el] = result[el];
        } else if (!(el in obj)) {
          //if dryhay etc aren't in obj then add them from result
          obj[el] = result[el];
        }
      });
  });

  // Object.keys(result).forEach(el => {
  //   // if (silages.includes(el.toLowerCase())) {
  //   //   obj[el] = result[el];
  //   // }
  //   inputs?.forEach(e => {
  //     if (e?.silage == OTHER) {
  //       if (_.isEmpty(obj[e.silageId])) {
  //         obj[e.silageId] = getOtherGoalsDefaultValues(e.silage, e.silageId);
  //       } else if (!_.isEmpty(obj[e.silageId])) {
  //         obj[el] = result[el];
  //       }
  //     }
  //   });
  // });

  // // handle other goals
  // inputs?.forEach(el => {
  //   if (el.silage == OTHER) {
  //     if (_.isEmpty(obj[el.silage])) {
  //       obj[el.silage] = getOtherGoalsDefaultValues(el.silage, el.silageId);
  //     }
  //   } else if (!keys.includes(el?.silage?.toLowerCase())) {
  //     const newSilage = silageTypes?.find(
  //       silageType => silageType.key === el.silage,
  //     );
  //     if (!!newSilage) {
  //       if (_.isEmpty(obj[newSilage.key])) {
  //         obj[newSilage.key] = getOtherGoalsDefaultValues(
  //           newSilage.key,
  //           newSilage.key,
  //         );
  //       }
  //     }
  //   }
  // });

  let groupedGoals = Object.values(obj || {});

  if (foragePenn?.foragePennState?.scorer === SCORER_ENUMS.THREE_SCREEN) {
    groupedGoals = groupedGoals.map(item => ({
      ...item,
      goals: removeGoals(item.goals),
    }));
  }
  return groupedGoals || [];
};

const removeGoals = goals => {
  return goals.filter(
    goal => ![i18n.t('mid2_4mm'), i18n.t('mid2(4mm)')].includes(goal.silageRange),
  );
};

export const getOtherGoalsDefaultValues = (type, silageId) => {
  const obj = {
    silageType: type,
    goals: [
      {
        silageRange: i18n.t('top(19mm)'),
        silageId: silageId,
        goalMax: convertNumberToString(0.0),
        goalMin: convertNumberToString(0),
      },
      {
        silageRange: i18n.t('mid1(18mm)'),
        silageId: silageId,
        goalMin: convertNumberToString(0.0),
        goalMax: convertNumberToString(0.0),
      },
      {
        silageRange: i18n.t('mid2(4mm)'),
        silageId: silageId,
        goalMin: convertNumberToString(0.0),
        goalMax: convertNumberToString(0.0),
      },
      {
        silageRange: i18n.t('tray(g)'),
        silageId: silageId,
        goalMin: convertNumberToString(0.0),
        goalMax: convertNumberToString(0.0),
      },
    ],
  };
  return obj;
};

const getDefaultGoalsBySilage = (type, conversionNeeded = false) => {
  const goals = [
    {
      silageRange: i18n.t('top(19mm)'),
      silage: type,
      goalMin: convertNumberToString(0, !conversionNeeded),
      goalMax: convertNumberToString(0.0, !conversionNeeded),
    },
    {
      silageRange: i18n.t('mid1(18mm)'),
      silage: type,
      goalMin: convertNumberToString(0.0, !conversionNeeded),
      goalMax: convertNumberToString(0.0, !conversionNeeded),
    },
    {
      silageRange: i18n.t('mid2(4mm)'),
      silage: type,
      goalMin: convertNumberToString(0.0, !conversionNeeded),
      goalMax: convertNumberToString(0.0, !conversionNeeded),
    },
    {
      silageRange: i18n.t('tray(g)'),
      silage: type,
      goalMin: convertNumberToString(0.0, !conversionNeeded),
      goalMax: convertNumberToString(0.0, !conversionNeeded),
    },
  ];
  return goals;
};

export const parseForageHerdInputValues = (
  data,
  visitData,
  silages,
  silageTypes,
) => {
  const arr = [];
  let { foragePennState } = visitData;
  const keys = silages?.map(el => el.key?.toLowerCase());

  data?.[FORAGE_PENN_STATE]?.forEach((el, index) => {
    const obj = {};
    obj[FORAGE_PENN_STATE_FIELDS.SILAGE] = !stringIsEmpty(
      el?.[FORAGE_PENN_STATE_FIELDS.SILAGE],
    )
      ? el?.[FORAGE_PENN_STATE_FIELDS.SILAGE]
      : '';
    if (el?.[FORAGE_PENN_STATE_FIELDS.SILAGE] === OTHER) {
      obj['silageId'] = el?.silageId;
      obj[FORAGE_PENN_STATE_FIELDS.SILAGE_NAME] =
        el?.[FORAGE_PENN_STATE_FIELDS.SILAGE_NAME];
    }

    if (!keys.includes(el?.silage?.toLowerCase())) {
      const newSilage = silageTypes.find(silage => silage?.key === el?.silage);

      obj[FORAGE_PENN_STATE_FIELDS.SILAGE_ID] = el?.silage;
      obj[FORAGE_PENN_STATE_FIELDS.SILAGE] = OTHER;
    }

    //top
    obj[FORAGE_PENN_STATE_FIELDS.TOP] = !stringIsEmpty(
      el?.[FORAGE_PENN_STATE_FIELDS.TOP],
    )
      ? parseFloat(convertStringToNumber(el?.[FORAGE_PENN_STATE_FIELDS.TOP]))
      : null;

    obj[FORAGE_PENN_STATE_FIELDS.MID1] = !stringIsEmpty(
      el?.[FORAGE_PENN_STATE_FIELDS.MID1],
    )
      ? parseFloat(convertStringToNumber(el?.[FORAGE_PENN_STATE_FIELDS.MID1]))
      : null;

    obj[FORAGE_PENN_STATE_FIELDS.MID2] = !stringIsEmpty(
      el?.[FORAGE_PENN_STATE_FIELDS.TOP],
    )
      ? parseFloat(convertStringToNumber(el?.[FORAGE_PENN_STATE_FIELDS.MID2]))
      : null;

    obj[FORAGE_PENN_STATE_FIELDS.TRAY] = !stringIsEmpty(
      el?.[FORAGE_PENN_STATE_FIELDS.TOP],
    )
      ? parseFloat(convertStringToNumber(el?.[FORAGE_PENN_STATE_FIELDS.TRAY]))
      : null;

    arr.push(obj);
  });

  return {
    inputs: [...arr],
    [FORAGE_PENN_STATE_FIELDS.SCORER]: data?.scorer || '',
  };
};

export const parseForagePennInputs = (forage, silageType, silageTypes) => {
  if (typeof forage == 'string') {
    forage = JSON.parse(forage);
  }
  let obj = {};
  const arr = [];
  const data = forage?.inputs;
  const keys = silageType?.map(el => el.key?.toLowerCase());
  data?.forEach((el, index) => {
    obj = {
      [FORAGE_PENN_STATE_FIELDS.SILAGE]: el?.[FORAGE_PENN_STATE_FIELDS.SILAGE],
      [FORAGE_PENN_STATE_FIELDS.TOP]: convertNumberToString(
        el?.[FORAGE_PENN_STATE_FIELDS.TOP],
      ),
      [FORAGE_PENN_STATE_FIELDS.MID1]: convertNumberToString(
        el?.[FORAGE_PENN_STATE_FIELDS.MID1],
      ),
      [FORAGE_PENN_STATE_FIELDS.MID2]: convertNumberToString(
        el?.[FORAGE_PENN_STATE_FIELDS.MID2],
      ),
      [FORAGE_PENN_STATE_FIELDS.TRAY]: convertNumberToString(
        el?.[FORAGE_PENN_STATE_FIELDS.TRAY],
      ),
    };
    if (el?.[FORAGE_PENN_STATE_FIELDS.SILAGE] === OTHER) {
      const silage = silageTypes?.find(obj => obj?.key === el.silageId);

      // filter silageTypes array using silage id and set name
      obj[FORAGE_PENN_STATE_FIELDS.SILAGE_ID] = el?.silageId;
      obj[FORAGE_PENN_STATE_FIELDS.SILAGE_NAME] = silage?.value;
    }

    // if (!keys.includes(el?.silage?.toLowerCase())) {
    //   obj[FORAGE_PENN_STATE_FIELDS.SILAGE] =
    //     el?.[FORAGE_PENN_STATE_FIELDS.SILAGE_ID];
    // }
    arr.push(obj);
    obj = {};
  });
  return arr;
};

const getSummaryTitle = (index, type, silageTypes, keys, el) => {
  let silage = silageTypes?.find(silage => silage?.key == type);
  if (!keys.includes(type?.toLowerCase())) {
    return `${i18n.t('PSP')} ${index + 1} - ${i18n.t('other')} - ${
      silage?.value || ''
    }`;
  }
  const title = `${i18n.t('PSP')} ${index + 1} - ${silage?.value || ''}`;
  return title;
};

export const parseSummaryData = (inputs, goals, silageTypes, silageType) => {
  let obj = {};
  const summary = [];
  const keys = silageType?.map(el => el.key?.toLowerCase());
  const inputData = inputs?.foragePennState?.map(e => {
    if (!keys.includes(e?.silage?.toLowerCase())) {
      return {
        ...e,
        silage: OTHER,
        silageId: e?.silage,
      };
    }

    return { ...e };
  });

  inputData?.forEach((el, index) => {
    obj = {};
    obj.title = getSummaryTitle(
      index,
      el.silage == OTHER ? el?.silageId : el?.silage,
      silageTypes,
      keys,
      el,
    );
    const goalsValues = getGoalsBySilageType(
      goals ? goals : parseGoalsData(getInitialGoalsValue()),
      el.silage == OTHER ? el?.silageId : el?.silage,
      silageTypes,
      keys,
    );
    obj.summary = getSummaryByType(el, goalsValues, inputs?.scorer);
    summary.push(obj);
  });
  return summary;
};

const getGoalsBySilageType = (goals, type, silageTypes, keys) => {
  let silage = silageTypes?.find(silage => silage?.key == type)?.key;
  let results = [];
  if (!keys.includes(silage?.toLowerCase())) {
    results = goals?.filter(goal => goal?.silageId === silage);
  } else {
    results = goals?.filter(
      goal => goal?.silage?.toLowerCase() === silage?.toLowerCase(),
    );
  }

  if (!results?.length) {
    results = getDefaultGoalsBySilage(type);
  }
  return results;
};

const getSummaryByType = (el, goals, scorerType) => {
  let newEl = el;
  let filteredGoals = goals;
  if (scorerType && scorerType === SCORER_ENUMS.THREE_SCREEN) {
    newEl = Object.fromEntries(
      Object.entries(el).filter(([key]) => !key.startsWith('mid2')),
    );
    filteredGoals = filteredGoals.filter(
      goal => ![i18n.t('mid2_4mm'), i18n.t('mid2(4mm)')].includes(goal.silageRange),
    );
  }

  let obj = {};
  const data = [];
  filteredGoals?.forEach((goal, index) => {
    obj = {};
    obj.silageRange = goal?.silageRange;
    obj.goalMin = goal.goalMin;
    obj.goalMax = goal.goalMax;
    obj.onScreenValue = getOnScreenPercent(index, newEl, false, scorerType);
    data.push(obj);
  });
  return data;
};

export const getOnScreenPercent = (
  index,
  el,
  conversionNeeded = false,
  scorerType = null,
) => {
  let fieldLabels = FIELD_LABELS;
  if (scorerType && scorerType === SCORER_ENUMS.THREE_SCREEN) {
    fieldLabels = fieldLabels.filter(item => item !== 'mid2');
  }
  let sum = 0;
  const value =
    Number(
      convertNumbersToEnFormat(el[fieldLabels[index]], conversionNeeded),
    ) || 0;

  for (const key in el) {
    if (typeof el[key] == 'number' || fieldLabels.includes(key)) {
      if (!!el[key]) {
        let val =
          key != 'silage'
            ? Number(convertNumbersToEnFormat(el[key], conversionNeeded))
            : el[key];
        sum = sum + parseFloat(val);
      }
    }
  }
  if (!!sum) {
    const onScreen = (value / sum) * 100;
    return onScreen.toFixed(1);
  } else {
    return 0;
  }
};

export const getFormattedRecentVisits = recentVisits => {
  const data = recentVisits.map(visitObj => {
    const allData = visitObj.foragePennState
      ? JSON.parse(visitObj.foragePennState)
      : null;
    return {
      scorerData: allData || null,
      visitId: visitObj.id,
      date: visitObj.visitDate,
      mobileLastUpdatedTime: visitObj?.mobileLastUpdatedTime,
    };
  });
  return data;
};

export const getForagePenTopDataPoints = (
  recentVisits,
  selectedGraph,
  keys,
  scorerData,
) => {
  let data = [];
  recentVisits?.map(visit => {
    const scorer = visit?.scorerData?.inputs?.[selectedGraph?.id];
    if (visit?.scorerData?.scorer == scorerData?.scorer) {
      if (scorer?.silage == OTHER) {
        if (scorer?.silageId === selectedGraph?.key) {
          data.push({
            x:
              getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
              visit?.mobileLastUpdatedTime,
            y: !!(scorer?.top >= 0 && scorer?.top != null)
              ? parseFloat(getOnScreenPercent(FIELD_INDEX.TOP, scorer, true))
              : null,
          });
        } else {
          data.push({
            x:
              getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
              visit?.mobileLastUpdatedTime,
            y: null,
          });
        }
      } else if (scorer?.silage === selectedGraph?.key) {
        data.push({
          x:
            getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
            visit?.mobileLastUpdatedTime,
          y: !!(scorer?.top >= 0 && scorer?.top != null)
            ? parseFloat(getOnScreenPercent(FIELD_INDEX.TOP, scorer, true))
            : null,
        });
      } else {
        data.push({
          x:
            getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
            visit?.mobileLastUpdatedTime,
          y: null,
        });
      }
    }
  });
  return data;
};

export const getForagePenMid1DataPoints = (
  recentVisits,
  selectedGraph,
  keys,
  scorerData,
) => {
  let data = [];
  recentVisits?.map(visit => {
    const scorer = visit?.scorerData?.inputs?.[selectedGraph?.id];
    if (visit?.scorerData?.scorer == scorerData?.scorer) {
      // if silage name added in the list
      if (scorer?.silage == OTHER) {
        if (scorer?.silageId === selectedGraph?.key) {
          data.push({
            x:
              getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
              visit?.mobileLastUpdatedTime,
            y: !!(scorer?.mid1 >= 0 && scorer?.mid1 != null)
              ? parseFloat(getOnScreenPercent(FIELD_INDEX.MID1, scorer, true))
              : null,
          });
        } else {
          data.push({
            x:
              getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
              visit?.mobileLastUpdatedTime,
            y: null,
          });
        }
      }

      if (scorer?.silage === selectedGraph?.key) {
        data.push({
          x:
            getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
            visit?.mobileLastUpdatedTime,
          y: !!(scorer?.mid1 >= 0 && scorer?.mid1 != null)
            ? parseFloat(getOnScreenPercent(FIELD_INDEX.MID1, scorer, true))
            : null,
        });
      } else {
        data.push({
          x:
            getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
            visit?.mobileLastUpdatedTime,
          y: null,
        });
      }
    }
  });
  return data;
};

export const getForagePenMid2DataPoints = (
  recentVisits,
  selectedGraph,
  keys,
  scorerData,
) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const scorer = visit?.scorerData?.inputs?.[selectedGraph?.id];
    if (visit?.scorerData?.scorer == scorerData?.scorer) {
      if (scorer?.silage == OTHER) {
        if (scorer?.silageId === selectedGraph?.key) {
          data.push({
            x:
              getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
              visit?.mobileLastUpdatedTime,
            y: !!(scorer?.mid2 >= 0 && scorer?.mid2 != null)
              ? parseFloat(getOnScreenPercent(FIELD_INDEX.MID2, scorer, true))
              : null,
          });
        } else {
          data.push({
            x:
              getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
              visit?.mobileLastUpdatedTime,
            y: null,
          });
        }
      }

      if (scorer?.silage === selectedGraph?.key) {
        data.push({
          x:
            getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
            visit?.mobileLastUpdatedTime,
          y: !!(scorer?.mid2 >= 0 && scorer?.mid2 != null)
            ? parseFloat(getOnScreenPercent(FIELD_INDEX.MID2, scorer, true))
            : null,
        });
      } else {
        data.push({
          x:
            getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
            visit?.mobileLastUpdatedTime,
          y: null,
        });
      }
    }
  });
  return data;
};

export const getForagePenTrayDataPoints = (
  recentVisits,
  selectedGraph,
  keys,
  scorerData,
) => {
  let data = [];
  recentVisits?.map((visit, index) => {
    const scorer = visit?.scorerData?.inputs?.[selectedGraph?.id];
    if (visit?.scorerData?.scorer == scorerData?.scorer) {
      if (scorer?.silage == OTHER) {
        if (scorer?.silageId === selectedGraph?.key) {
          data.push({
            x:
              getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
              visit?.mobileLastUpdatedTime,
            y: !!(scorer?.tray >= 0 && scorer?.tray != null)
              ? parseFloat(getOnScreenPercent(FIELD_INDEX.TRAY, scorer, true))
              : null,
          });
        } else {
          data.push({
            x:
              getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
              visit?.mobileLastUpdatedTime,
            y: null,
          });
        }
      }

      if (scorer?.silage === selectedGraph?.key) {
        data.push({
          x:
            getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
            visit?.mobileLastUpdatedTime,
          y: !!(scorer?.tray >= 0 && scorer?.tray != null)
            ? parseFloat(getOnScreenPercent(FIELD_INDEX.TRAY, scorer, true))
            : null,
        });
      } else {
        data.push({
          x:
            getFormattedDate(visit.date, DATE_FORMATS.MM_dd) +
            visit?.mobileLastUpdatedTime,
          y: null,
        });
      }
    }
  });
  return data;
};

export const getGraphLegends = recentVisits => {
  return recentVisits?.map(
    visit =>
      getFormattedDate(visit.date || visit.visitDate, DATE_FORMATS.MM_dd) +
      visit?.mobileLastUpdatedTime,
  );
};

export const parseForagePennGraphData = (
  recentVisits,
  selectedGraph,
  enumState,
  scorerData,
) => {
  const { silageType = [] } = enumState || [];
  const keys = silageType?.map(el => el.key?.toLowerCase());

  const data = [
    {
      dataPoints: getForagePenTopDataPoints(
        recentVisits,
        selectedGraph,
        keys,
        scorerData,
      ),
      barColor: colors.topColor,
    },
    {
      dataPoints: getForagePenMid1DataPoints(
        recentVisits,
        selectedGraph,
        keys,
        scorerData,
      ),
      barColor: colors.mid1Color,
    },
  ];

  if (scorerData?.scorer !== SCORER_ENUMS.THREE_SCREEN) {
    data.push({
      dataPoints: getForagePenMid2DataPoints(
        recentVisits,
        selectedGraph,
        keys,
        scorerData,
      ),
      barColor: colors.mid2Color,
    });
  }

  data.push({
    dataPoints: getForagePenTrayDataPoints(
      recentVisits,
      selectedGraph,
      keys,
      scorerData,
    ),
    barColor: colors.trayColor,
  });

  return data;
};

const FIELD_LABELS = [
  FORAGE_PENN_STATE_FIELDS.TOP,
  FORAGE_PENN_STATE_FIELDS.MID1,
  FORAGE_PENN_STATE_FIELDS.MID2,
  FORAGE_PENN_STATE_FIELDS.TRAY,
];

const FIELD_INDEX = {
  TOP: 0,
  MID1: 1,
  MID2: 2,
  TRAY: 3,
};

export const parseSilageList = silageList => {
  const data = [];
  silageList?.forEach(silage => {
    let obj = {};
    if (!stringIsEmpty(silage?.sv_id)) {
      obj.key = silage?.sv_id;
    } else {
      obj.key = silage?.id;
    }
    obj.value = silage?.silageName;
    data.push(obj);
  });
  return data;
};

export const getForagePennStateGraphs = (
  scorerData,
  enumState,
  silageTypes,
) => {
  const { silageType = [] } = enumState || [];
  const keys = silageType?.map(el => el.key?.toLowerCase());
  const data = scorerData?.foragePennState.map(e => {
    if (!keys.includes(e?.silage?.toLowerCase())) {
      return {
        ...e,
        silage: OTHER,
        silageId: e?.silage,
      };
    }
    return { ...e };
  });

  const result = data?.map((scorer, index) => {
    const type = scorer?.silage == OTHER ? scorer.silageId : scorer.silage;
    const name = getSilageName(keys, type, index, silageTypes);
    return {
      id: index,
      name: name,
      key: scorer?.silage == OTHER ? scorer.silageId : scorer.silage,
    };
  });

  return result;
};

const getSilageName = (keys, silage, index, silageTypes) => {
  if (!keys.includes(silage?.toLowerCase())) {
    const newSilage = silageTypes?.find(el => el.key === silage);
    return `${i18n.t('PSP')} ${index + 1} - ${i18n.t('other')} - ${
      newSilage?.value || ''
    }`;
  }
  let silageValue = '';
  silageValue = silageTypes.find(x => x.key === silage);
  silageValue = silageValue?.value || silage;
  return `${i18n.t('PSP')} ${index + 1} - ${silageValue}`;
};

export const exportForagePennGraphData = (
  visitData,
  recentVisits,
  enumState,
  selectedGraph,
  scorerName,
  scorerData,
) => {
  const { silageType = [] } = enumState || [];
  const keys = silageType?.map(el => el.key?.toLowerCase());

  const model = {
    fileName: visitData?.visitName + 'ForagePennState',
    visitName: visitData?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitData?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('foragePennState'),
    analysisType: i18n.t('herdAnalysis'),
    scorerLabel: scorerName,
    pspsLabel: selectedGraph?.name,
    onScreenPercentage: getExportOnScreenPercentage(
      recentVisits,
      selectedGraph,
      scorerData,
    ),
  };
  return model;
};

const getExportOnScreenPercentage = (
  recentVisits,
  selectedGraph,
  scorerData,
) => {
  let results = [];
  recentVisits?.map(visit => {
    const scorer = visit?.scorerData?.inputs?.[selectedGraph?.id];

    if (visit?.scorerData?.scorer == scorerData?.scorer) {
      if (scorer?.silage === OTHER) {
        if (scorer?.silageId === selectedGraph?.key) {
          results.push({
            ...getSilageValues(visit.date, scorer, scorerData?.scorer),
          });
        } else {
          results.push({
            ...getDefaultExportValues(visit.date, scorerData?.scorer),
          });
        }
      }

      // if silage types are [corn, dry hay, straw, grass, other]
      else if (scorer?.silage === selectedGraph?.key) {
        results.push({
          ...getSilageValues(visit.date, scorer, scorerData?.scorer),
        });
      } else {
        results.push({
          ...getDefaultExportValues(visit.date, scorerData?.scorer),
        });
      }
    }
  });

  return results;
};

//get top, mid1, mid2, tray values of selected silage in graph dropdown
const getSilageValues = (date, scorer, scorerType) => {
  const silage = {
    visitDate: getFormattedDate(date, DATE_FORMATS.MM_dd),
    top: !!scorer?.top ? getOnScreenPercent(FIELD_INDEX.TOP, scorer) : 0,
    mid1: !!scorer?.mid1 ? getOnScreenPercent(FIELD_INDEX.MID1, scorer) : 0,
    ...(scorerType !== SCORER_ENUMS.THREE_SCREEN && {
      mid2: !!scorer?.mid2 ? getOnScreenPercent(FIELD_INDEX.MID2, scorer) : 0,
    }),
    tray: !!scorer?.tray ? getOnScreenPercent(FIELD_INDEX.TRAY, scorer) : 0,
  };
  return silage;
};

// if silage type not found in recent visits then return top,mid1,mid2,tray of values zero
const getDefaultExportValues = (date, scorerType) => {
  const obj = {
    visitDate: getFormattedDate(date, DATE_FORMATS.MM_dd),
    top: 0,
    mid1: 0,
    ...(scorerType !== SCORER_ENUMS.THREE_SCREEN && {
      mid2: 0,
    }),
    tray: 0,
  };
  return obj;
};

export const getSilageObjForFetchingData = visitDetails => {
  const { accountId, localAccountId, customerId, localCustomerId } =
    visitDetails;

  const silageObj = {};
  if (customerId && !stringIsEmpty(customerId)) {
    silageObj.accountId = customerId;
  } else if (accountId && !stringIsEmpty(accountId)) {
    silageObj.accountId = accountId;
  } else if (localCustomerId && !stringIsEmpty(localCustomerId)) {
    silageObj.localAccountId = localCustomerId;
  } else {
    silageObj.localAccountId = localAccountId;
  }

  return silageObj;
};

export const calculateForagePennArrayLength = (foragePennState = []) => {
  return foragePennState?.length > 0;
};
