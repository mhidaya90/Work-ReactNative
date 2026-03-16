//constants
import {
  DATE_FORMATS,
  TOOL_ANALYSIS_TYPES,
  VISIT_TABLE_FIELDS,
} from '../../constants/AppConstants';

//localization
import i18n from '../../localization/i18n';
import store from '../../store';

//helpers
import { getFormattedDate } from '../dateHelper';
import { isEmpty } from '../genericHelper';
import {
  getManureAvgForLactationStage,
  getManureScoreAvg,
  getManureScoreStdDeviation,
  heardGoalsInitialized,
  mapGraphDataForHerdAnalysisExport,
  parsePenLactationStages,
  parsePensData,
  pensInPercent,
} from '../manureScoreHelper';
import { addSpace } from '../genericHelper';
import { getFormattedLactationStage } from '../toolHelper';
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

export const getRumenHealthManureScoreBody = ({
  tool,
  visitDetails,
  sitePens,
}) => {
  const rumenHealthManureScoreData = visitDetails?.rumenHealthManureScore
    ? JSON.parse(visitDetails?.rumenHealthManureScore)
    : null;
  if (!rumenHealthManureScoreData) {
    return {};
  }
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );

  selectedAnalysis.forEach(analysis => {
    if (
      analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      rumenHealthManureScoreData?.pens?.length > 0
    ) {
      const penAnalysisData = handlePenAnalysisSelection({
        tool,
        rumenHealthManureScoreData,
        sitePens,
      });

      if (!isEmpty(penAnalysisData)) {
        body.penAnalysis = penAnalysisData;
      }
    } else if (analysis.value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS) {
      const herdAnalysisData = handleHerdAnalysisSelection({
        tool,
        rumenHealthManureScoreData,
        sitePens,
      });
      if (!isEmpty(herdAnalysisData)) {
        body.herdAnalysis = herdAnalysisData;
      }
    }
  });
  return body;
};

/** Start Pen Analysis */
const handlePenAnalysisSelection = ({
  tool,
  rumenHealthManureScoreData,
  sitePens,
}) => {
  const pensList = filterPensBySelection(
    tool,
    rumenHealthManureScoreData?.pens,
    sitePens,
  );
  const penAnalysisArray = [];
  pensList.forEach(pen => {
    const sitePen = findFromSitePensById(sitePens, pen);

    if (pen && pen?.penId) {
      const stdValue = getManureScoreStdDeviation(pen.manureScores);
      const avg = getManureScoreAvg(pen.manureScores)?.toFixed(2);
      const penDetailsBody = getPenDetailsBody(pen);
      const categoriesGraph = getBodyForCategoriesGraph(
        tool?.recentVisits,
        pen,
      );

      const penObj = {
        penName: pen?.penName || sitePen?.name || '',
        penId: pen?.penId || sitePen?.sv_id || sitePen?.id || sitePen?.localId,
        standardDeviation: Number(stdValue?.toFixed(2)) || 0,
        average: Number(avg) || 0,
        penDetails: isEmpty(penDetailsBody) ? null : penDetailsBody,
        categoriesGraph: isEmpty(categoriesGraph) ? null : categoriesGraph,
      };
      penAnalysisArray.push(penObj);
    }
  });
  return penAnalysisArray;
};

const getPenDetailsBody = pen => {
  if (pen.manureScores && pen.manureScores?.items?.length > 0) {
    const eachPensData = pen.manureScores?.items.map((item, index) => {
      const penPercent = pensInPercent(index, pen.manureScores.items);
      return [
        createDynamicObjForReqBody(
          i18n.t('category'),
          item?.scoreCategory?.toFixed(1),
        ),
        createDynamicObjForReqBody(i18n.t('penPercent'), penPercent),
        createDynamicObjForReqBody(
          i18n.t('animalsObserved'),
          item?.animalNumbers || 0,
        ),
      ];
    });
    return eachPensData;
  }
  return [];
};

const getBodyForCategoriesGraph = (recentVisits, pen) => {
  if (recentVisits && recentVisits?.length > 0) {
    const graphData = [];
    const sortedVisits = sortRecentVisits(recentVisits);
    sortedVisits.forEach((visit, index) => {
      const parsedManureScore = getRecentVisitToolData(
        visit,
        VISIT_TABLE_FIELDS.RUMEN_HEALTH_MANURE_SCORE,
      );

      if (parsedManureScore) {
        const recentVisitPen = getRecentVisitPen(parsedManureScore?.pens, pen);
        const avg = getManureScoreAvg(recentVisitPen?.manureScores)?.toFixed(2);
        const point = {
          visitDate:
            getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd_YY) +
            addSpace(index),
          categoryAverage: Number(avg) || 0,
        };

        recentVisitPen && graphData.push(point);
      }
    });

    return graphData;
  }
  return [];
};
/** End pen Analysis */

/** Start Herd Analysis */
const handleHerdAnalysisSelection = ({
  tool,
  rumenHealthManureScoreData,
  sitePens,
}) => {
  const result = {};
  const herdAnalysisDetails = getBodyForHerdAnalysisDetails({
    tool,
    rumenHealthManureScoreData,
    sitePens,
  });
  if (!isEmpty(herdAnalysisDetails)) {
    result.herdAnalysisDetails = herdAnalysisDetails;
  }

  const graphsData = getBodyForHerdGraphs(
    rumenHealthManureScoreData,
    sitePens,
    tool,
  );

  if (!isEmpty(graphsData)) {
    result.graph = graphsData;
  }
  return result;
};

const getBodyForHerdAnalysisDetails = ({
  tool,
  rumenHealthManureScoreData,
  sitePens,
}) => {
  const pensList = filterPensBySelection(
    tool,
    rumenHealthManureScoreData?.pens,
    sitePens,
  );

  let data = [];
  pensList.map(pen => {
    let avg = 0;

    const sitePen = findFromSitePensById(sitePens, pen);
    const toolPen = findPenFromToolData(
      rumenHealthManureScoreData?.pens,
      sitePen,
    );

    if (toolPen) {
      avg = getManureScoreAvg(toolPen?.manureScores).toFixed(2);

      data.push([
        createDynamicObjForReqBody(
          i18n.t('pen'),
          toolPen?.penName || sitePen?.name || '',
        ),
        createDynamicObjForReqBody(i18n.t('manureScore'), avg || ''),
        createDynamicObjForReqBody(
          i18n.t('DIM'),
          toolPen?.daysInMilk?.toString() ||
            sitePen?.daysInMilk?.toString() ||
            '-',
        ),
      ]);
    }
  });
  return data;
};

const getBodyForHerdGraphs = (rumenHealthManureScoreData, sitePens, tool) => {
  const enums = store.getState().enums;

  const pensList = filterPensBySelection(
    tool,
    rumenHealthManureScoreData.pens,
    sitePens,
  );

  // Parse pen data with daysInMilk from sitePens
  let penData = parsePensData(
    pensList,
    rumenHealthManureScoreData.pens,
    true, // Use sitePens daysInMilk
  );

  // If daysInMilk is still undefined, manually merge from sitePens
  penData = penData.map(pen => {
    if (!pen.daysInMilk && pen.daysInMilk !== 0) {
      const sitePen = sitePens.find(
        sp => sp.sv_id === pen.penId || sp.id === pen.penId || sp.localId === pen.penId
      );
      return {
        ...pen,
        daysInMilk: sitePen?.daysInMilk,
      };
    }
    return pen;
  });

  let dict = parsePenLactationStages(penData, enums);
  const goalsArray = heardGoalsInitialized(rumenHealthManureScoreData, enums);

  const lactationStages = enums?.enum
    ? [
        ...goalsArray.map(goal =>
          getFormattedLactationStage(enums, goal?.lactationStage),
        ),
      ]
    : [];

  const avgManureData = lactationStages.map(stage => {
    if (Object.keys(dict)?.includes(stage)) {
      return (
        Number(getManureAvgForLactationStage(dict[stage])?.toFixed(2)) || 0
      );
    }
    return null;
  });

  const graphData = {
    avgManureData: avgManureData,
    goalsData: [...goalsArray?.map(e => e?.goal)],
    minGoalsData: [...goalsArray.map(goal => goal.goalMin)],
    maxGoalsData: [...goalsArray.map(goal => goal.goalMax)],
  };

  const goalLactationStages = [
    ...goalsArray?.map(goal => goal?.lactationStage),
  ];

  const model = mapGraphDataForHerdAnalysisExport(
    null,
    graphData,
    goalLactationStages,
  );

  return {
    averageManureScore: model.averageManureScore,
    min: model.min,
    max: model.max,
  };
};
/** End Herd Analysis */

//#region new offline visit report helpers

export const getManureScorePenAnalysisTableDataByRecentVisits = (
  recentVisits = [],
) => {
  let tableHeader = [];
  let tableData = [];
  let avgManureScore = [];

  recentVisits.map(visit => {
    let visitData = getPerPenCategoryDataFromRecentVisits(tableData, visit);
    //check if available
    if (visitData) {
      tableHeader.push(getFormattedDate(visit.date, DATE_FORMATS.MM_dd_YY));
      avgManureScore.push(getManureScoreAvg(visit.manureScores).toFixed(2));
      tableData = visitData;
    }
  });

  return { tableHeader, tableData, avgManureScore };
};

export const getPerPenCategoryDataFromRecentVisits = (tableData, visit) => {
  if (visit.manureScores && visit.manureScores?.items.length > 0) {
    visit.manureScores.items.map((score, index) => {
      let penPercent = pensInPercent(index, visit.manureScores?.items);
      penPercent = penPercent != '-' ? penPercent + '%' : '-';

      if (!tableData[index]) {
        tableData[index] = [parseFloat(score.scoreCategory)?.toFixed(1)];
      }
      tableData[index]?.push(
        penPercent != '-' || score?.animalNumbers != 0
          ? `${penPercent} | ${score.animalNumbers}`
          : '-',
      );
    });
    return tableData;
  }
};

export const getRumenHealthManureScoreGraphDataParsed = (
  enumState,
  herdAnalysisGraphData,
) => {
  let _avgManureData = [];
  let goalsData = [];

  if (enumState?.enum?.lactationStages) {
    enumState?.enum?.lactationStages?.map(item => {
      if (
        typeof herdAnalysisGraphData.averageManureScore[item.key] != undefined
      ) {
        _avgManureData.push(herdAnalysisGraphData.averageManureScore[item.key]);
        goalsData.push({
          goalMin: herdAnalysisGraphData.min[item.key],
          goalMax: herdAnalysisGraphData.max[item.key],
        });
      }
    });
  }
  return {
    _avgManureData,
    goalsData,
  };
};

export const getRumenHealthManureScoreHerdAnalysisTableData = (
  herdAnalysis = [],
) => {
  const tableHeader = [i18n.t('manureScore'), i18n.t('DIM')];
  let tableData = [];

  herdAnalysis?.map(penData => {
    if (!penData) return;
    let value = [];
    penData.map(p => {
      value.push(p.value);
    });
    tableData.push(value);
  });

  return { tableHeader, tableData };
};

//#endregion
