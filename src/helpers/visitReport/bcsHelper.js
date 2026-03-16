//constants
import {
  DATE_FORMATS,
  TOOL_ANALYSIS_TYPES,
  UNIT_OF_MEASURE,
  VISIT_TABLE_FIELDS,
} from '../../constants/AppConstants';

//localization
import i18n from '../../localization/i18n';

//store
import store from '../../store';

//helpers
import { getFormattedDate } from '../dateHelper';
import { isEmpty } from '../genericHelper';
import { addSpace } from '../genericHelper';
import {
  getBCSAvg,
  getBCSAvgForLactationStage,
  getBCSStdDev,
  getFormattedLactationStage,
  getLactationStageKey,
  getMilkYieldAvgForLactationStage,
  getPenPercent,
  initializeBCSGoals,
  mapGraphDataForBCSHerdAnalysisExport,
} from '../toolHelper';
import {
  createDynamicObjForReqBody,
  filterPensBySelection,
  findFromSitePensById,
  findPenFromToolData,
  getRecentVisitPen,
  getRecentVisitToolData,
  getSelectedAnalysisCategories,
  sortRecentVisits,
} from './visitReportHelper';
import {
  convertWeightToImperial,
  getWeightUnitByMeasure,
} from '../appSettingsHelper';
import { convertNumberToString } from '../alphaNumericHelper';
import { getAnimalAnalysisBody } from './animalHelper';

export const getBcsBody = ({ tool, visitDetails, sitePens, earTags }) => {
  const body = {};

  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  let isAnimalAnalysisSelected = selectedAnalysis.filter(
    analysis => analysis.value === TOOL_ANALYSIS_TYPES.ANIMAL_ANALYSIS,
  );

  if (isAnimalAnalysisSelected.length > 0 && visitDetails?.animalAnalysis) {
    let animalAnalysis = getAnimalAnalysisBody(
      tool,
      visitDetails,
      sitePens,
      earTags,
    );
    if (!isEmpty(animalAnalysis)) {
      let eachPageAnimalCount = 5;
      let arrayOfArrays = [];
      for (let i = 0; i < animalAnalysis.length; i += eachPageAnimalCount) {
        arrayOfArrays.push(animalAnalysis.slice(i, i + eachPageAnimalCount));
      }

      body.animalAnalysis = arrayOfArrays;
    }
  }

  const bodyCondition = visitDetails?.bodyCondition;
  const bodyConditionData = bodyCondition ? JSON.parse(bodyCondition) : null;
  if (!bodyConditionData) {
    return body;
  }

  if (visitDetails?.selectedPointScale) {
    body.bcsPointScale = visitDetails?.selectedPointScale
      ? i18n.t(visitDetails?.selectedPointScale) ||
        visitDetails?.selectedPointScale
      : '';
  }

  selectedAnalysis.forEach(analysis => {
    if (
      analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      bodyConditionData?.pens?.length > 0
    ) {
      const penAnalysisData = handlePenAnalysisSelection({
        tool,
        bodyConditionData,
        sitePens,
      });
      if (!isEmpty(penAnalysisData)) {
        body.penAnalysis = penAnalysisData;
      }
    } else if (
      analysis.value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS
      // && sitePens?.length > 0
    ) {
      const herdAnalysisData = handleHerdAnalysisSelection({
        tool,
        bodyConditionData,
        sitePens,
        uom: visitDetails?.unitOfMeasure,
      });

      if (!isEmpty(herdAnalysisData)) {
        body.herdAnalysis = herdAnalysisData;
      }
    }
  });
  return body;
};

/** Start Pen Analysis */
const handlePenAnalysisSelection = ({ tool, bodyConditionData, sitePens }) => {
  const pensList = filterPensBySelection(
    tool,
    bodyConditionData?.pens,
    sitePens,
  );
  const penAnalysisArray = [];
  pensList.forEach(pen => {
    /** As bcs tool is not storing pen name or other pen details in it's JSON so that's why have to do in this way */
    const sitePen = findFromSitePensById(sitePens, pen);

    if (pen && (pen.penId || pen.localPenId)) {
      const std = getBCSStdDev(pen).toFixed(2);
      const avg = getBCSAvg(pen).toFixed(2);
      const penDetails = getScoreAnalysisBody(pen);
      const categoriesChart = getDataForCategoriesChart(
        tool?.recentVisits,
        pen,
      );
      const penObj = {
        penName: pen?.penName || sitePen?.name || '',
        penId:
          pen?.penId ||
          pen?.localPenId ||
          sitePen?.sv_id ||
          sitePen?.id ||
          sitePen?.localId,
        standardDeviation: std ? parseFloat(std) : 0,
        average: avg ? parseFloat(avg) : 0,
        penDetails: isEmpty(penDetails) ? null : penDetails,
        categoriesChart: isEmpty(categoriesChart) ? null : categoriesChart,
      };
      penAnalysisArray.push(penObj);
    }
  });
  return penAnalysisArray;
};

const getScoreAnalysisBody = pen => {
  if (pen.bodyConditionScores && pen.bodyConditionScores?.length > 0) {
    const eachPensData = pen.bodyConditionScores.map(score => {
      const penPercent = getPenPercent(score, pen.bodyConditionScores).toFixed(
        2,
      );
      return [
        createDynamicObjForReqBody(i18n.t('category'), score.bcsCategory),
        createDynamicObjForReqBody(i18n.t('penPercent'), penPercent),
        createDynamicObjForReqBody(
          i18n.t('animalsObserved'),
          score.animalsObserved,
        ),
      ];
    });
    return eachPensData;
  }
};

export const getDataForCategoriesChart = (recentVisits = [], pen) => {
  const graphData = [];
  const datesDict = {};
  if (recentVisits && recentVisits?.length > 0) {
    const sortedRecentVisits = sortRecentVisits(recentVisits);

    const mappedPenId = { ...pen, localId: pen?.localPenId };

    sortedRecentVisits.forEach(visit => {
      const parsedBCS = getRecentVisitToolData(
        visit,
        VISIT_TABLE_FIELDS.BODY_CONDITION,
      );

      if (parsedBCS) {
        const mappedBCSParsedData = parsedBCS?.pens?.map(item => ({
          ...item,
          penId: item?.localPenId,
        }));

        const recentVisitPen = getRecentVisitPen(
          mappedBCSParsedData,
          mappedPenId,
        );

        if (recentVisitPen) {
          const point = {
            visitDate: getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd),
            bcsCategoryAverage:
              Number(getBCSAvg(recentVisitPen)?.toFixed(2)) || 0,
          };

          if (point.visitDate in datesDict) {
            const tempXVal =
              point.visitDate + addSpace(datesDict[point.visitDate]);
            datesDict[point.visitDate] = datesDict[point.visitDate] + 1;
            point.visitDate = tempXVal;
          } else {
            datesDict[point.visitDate] = 1;
          }
          graphData.push(point);
        }
      }
    });

    return graphData;
  }
  return [];
};
/** End Pen Analysis */

/** Start Herd Analysis */

const handleHerdAnalysisSelection = ({
  tool,
  bodyConditionData,
  sitePens = [],
  uom = '',
}) => {
  const result = {};
  const herdAnalysisDetails = getBodyForHerdAnalysisDetails(
    tool,
    bodyConditionData,
    sitePens,
    uom,
  );
  if (!isEmpty(herdAnalysisDetails)) {
    result.herdAnalysisDetails = herdAnalysisDetails;
  }

  const graphsData = getBodyForHerdGraphs(bodyConditionData, sitePens, tool);
  if (graphsData) {
    result.graph = {
      milkHdDay: graphsData?.milkHdDay,
      bcsAverage: graphsData?.bcsAverage,
      bcsMin: graphsData?.bcsMin,
      bcsMax: graphsData?.bcsMax,
    };
  }
  return result;
};

const getBodyForHerdAnalysisDetails = (
  tool,
  bodyConditionData,
  sitePens = [],
  uom,
) => {
  const weightUnit = getWeightUnitByMeasure(uom);

  const pensList = filterPensBySelection(
    tool,
    bodyConditionData?.pens,
    sitePens,
  );

  let data = [];
  pensList.map(pen => {
    let avg = 0;

    const sitePen = findFromSitePensById(sitePens, pen);
    const toolPen = findPenFromToolData(bodyConditionData?.pens, sitePen);
    if (toolPen) {
      avg = getBCSAvg(toolPen).toFixed(2);
    }
    data.push([
      createDynamicObjForReqBody(
        i18n.t('pen'),
        toolPen?.penName || sitePen?.name || '',
      ),
      createDynamicObjForReqBody(
        i18n.t('DIM'),
        toolPen?.daysInMilk || sitePen?.daysInMilk || 0,
      ),
      createDynamicObjForReqBody(
        `${i18n.t('milkYield')} (${weightUnit})`,
        getWeightValue(uom, toolPen?.milk || sitePen?.milk),
      ),
      createDynamicObjForReqBody(i18n.t('BCS'), parseFloat(avg || 0)),
    ]);
  });
  return data;
};

const getWeightValue = (unitOfMeasure, milkVal) => {
  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    const convertedValue = convertWeightToImperial(milkVal, 1);
    return convertNumberToString(convertedValue) || i18n.t('numberPlaceholder');
  }
  return convertNumberToString(milkVal) || i18n.t('numberPlaceholder');
};

const getBodyForHerdGraphs = (bodyConditionData, sitePens, tool) => {
  const enums = store.getState().enums;
  const goals = getBodyConditionGoals(bodyConditionData?.goals, enums);
  const pensList = filterPensBySelection(
    tool,
    bodyConditionData?.pens,
    sitePens,
  );
  const pensData = getPensData(pensList, bodyConditionData?.pens);
  const graphData = getGraphData(goals, enums, pensData);
  const goalLactationStages = [...goals.map(goal => goal.lactationStage)];
  const model = mapGraphDataForBCSHerdAnalysisExport(
    null,
    graphData,
    goalLactationStages,
  );
  return model;
};

const getBodyConditionGoals = (goalsBodyConditionData = [], enums) => {
  let goals = [];
  if (goalsBodyConditionData && goalsBodyConditionData.length > 0) {
    goals = goalsBodyConditionData;
  } else {
    goals = initializeBCSGoals(enums);
  }
  return goals;
};

const getPensData = (sitePens = [], toolPens = []) => {
  const pensData = sitePens.map(pen => {
    let avg = 0;
    const toolPen = findPenFromToolData(toolPens, pen);
    if (toolPen) {
      avg = getBCSAvg(toolPen).toFixed(2);
    }
    return { ...pen, avgBCS: avg };
  });
  return pensData;
};

const getGraphData = (goals, enums, pensData = []) => {
  let dict = {};
  if (enums?.enum && pensData && pensData.length > 0) {
    pensData.map(penObj => {
      if (penObj.daysInMilk || penObj.daysInMilk == 0) {
        const stage = getFormattedLactationStage(
          enums,
          getLactationStageKey(penObj.daysInMilk),
        );
        if (stage in dict) {
          dict[stage].push(penObj);
        } else {
          dict[stage] = [penObj];
        }
      }
    });
  }

  const goalsArray = [...goals];
  const lactationStages = enums?.enum
    ? [
        ...goalsArray.map(goal =>
          getFormattedLactationStage(enums, goal.lactationStage),
        ),
      ]
    : [];
  const avgBCSData = lactationStages.map(stage => {
    if (Object.keys(dict).includes(stage)) {
      return getBCSAvgForLactationStage(dict[stage])?.toFixed(2);
    }
    return null;
  });
  const avgMilkYieldData = lactationStages.map(stage => {
    if (Object.keys(dict).includes(stage)) {
      return getMilkYieldAvgForLactationStage(dict[stage])?.toFixed(2);
    }
    return null;
  });

  const graphData = {
    avgBCSData: avgBCSData,
    minGoalsData: [...goals.map(goal => goal.goalMin)],
    maxGoalsData: [...goals.map(goal => goal.goalMax)],
    milkData: avgMilkYieldData,
  };

  return graphData;
};

/** End Herd Analysis */

//#region new offline visit report helpers

export const getBCSPenAnalysisTableDataByRecentVisits = (
  recentVisits = [],
  penData,
) => {
  let tableHeader = [];
  let tableData = [];
  let avgBCSData = [];
  let lessThan2Agg = [];
  let greaterThan4Agg = [];

  recentVisits.map(visit => {
    if (
      visit?.penId === penData?.penId ||
      visit?.localPenId === penData?.penId
    ) {
      let result = getPerPenCategoryDataFromRecentVisits(tableData, visit);
      if (result) {
        tableData = result?.tdata;
        result?.lessThan && lessThan2Agg.push(result?.lessThan);
        result?.greaterThan && greaterThan4Agg.push(result?.greaterThan);
        tableHeader.push(getFormattedDate(visit.date, DATE_FORMATS.MM_dd_YY));
        avgBCSData.push(getBCSAvg(visit).toFixed(2));
      }
    }
  });

  // remove translation for visit report categories not translated into commoas
  tableData?.unshift([i18n.t('lessThanEqualTo2'), ...lessThan2Agg]);
  tableData.push([i18n.t('greaterThanEqualTo4'), ...greaterThan4Agg]);

  return { tableHeader, tableData, avgBCSData };
};

export const getPerPenCategoryDataFromRecentVisits = (tableData, visit) => {
  if (visit.bodyConditionScores && visit.bodyConditionScores?.length > 0) {
    let minAggPenPercent = 0;
    let minAggAnimalsObserved = 0;
    let minCount = 0;
    let maxAggPenPercent = 0;
    let maxAggAnimalsObserved = 0;
    let maxCount = 0;
    let index = 0;
    let lessThan = '-';
    let greaterThan = '-';

    visit.bodyConditionScores.map(score => {
      index = score.bcsCategory > 2 ? index : 0;
      const penPercent = getPenPercent(
        score,
        visit.bodyConditionScores,
      ).toFixed(2);
      let entry = '-';

      if (score.bcsCategory > 2 && score.bcsCategory < 4) {
        //hiding cat other thn this range
        if (!tableData[index]) {
          tableData[index] = [score.bcsCategory];
        }
        if (penPercent != '0.00' && score.animalsObserved != 0) {
          entry = `${penPercent}% | ${score.animalsObserved}`;
        }
        tableData[index]?.push(entry);
        index++;
      } else {
        //showing agg for bcs cat on new visit report
        if (score.bcsCategory <= 2) {
          minAggPenPercent += Number(penPercent);
          minAggAnimalsObserved += score.animalsObserved;
          minCount++;
        } else if (score.bcsCategory >= 4) {
          maxAggPenPercent += Number(penPercent);
          maxAggAnimalsObserved += score.animalsObserved;
          maxCount++;
        }
      }
    });

    if (minCount && minAggPenPercent && minAggAnimalsObserved) {
      minAggPenPercent = minAggPenPercent / minCount;
      minAggAnimalsObserved = minAggAnimalsObserved / minCount;
      lessThan = [
        `${minAggPenPercent.toFixed(2)}% | ${minAggAnimalsObserved.toFixed(2)}`,
      ];
    }

    if (maxCount && maxAggPenPercent && maxAggAnimalsObserved) {
      maxAggPenPercent = maxAggPenPercent / maxCount;
      maxAggAnimalsObserved = maxAggAnimalsObserved / maxCount;
      greaterThan = [
        `${maxAggPenPercent.toFixed(2)}% | ${maxAggAnimalsObserved.toFixed(2)}`,
      ];
    }

    return { tdata: tableData, lessThan, greaterThan };
  }
};

export const getBCSGraphDataParsed = (enumState, herdAnalysisGraphData) => {
  let _avgBCSData = [];
  let _avgMilkYieldData = [];
  if (enumState?.enum?.lactationStages) {
    enumState?.enum?.lactationStages?.map((item, index) => {
      if (typeof herdAnalysisGraphData.bcsAverage[item.key] != undefined) {
        _avgBCSData.push(herdAnalysisGraphData.bcsAverage[item.key] || null);
      }
      if (typeof herdAnalysisGraphData.milkHdDay[item.key] != undefined) {
        _avgMilkYieldData.push(
          herdAnalysisGraphData.milkHdDay[item.key] || null,
        );
      }
    });
  }
  return { _avgBCSData, _avgMilkYieldData };
};

export const getBCSHerdAnalysisTableData = (herdAnalysis = [], weightUnit) => {
  const tableHeader = [
    i18n.t('DIM'),
    `${i18n.t('milkProductionKg')} (${weightUnit})`,
    i18n.t('BCSAvg'),
  ];
  let tableData = [];

  herdAnalysis?.map(penData => {
    let value = [];
    penData?.map(p => {
      value.push(p.value);
    });
    tableData.push(value);
  });

  return { tableHeader, tableData };
};

//#endregion
