//constants
import {
  DATE_FORMATS,
  MANURE_SCORE_CATEGORY_LIST,
  TOOL_ANALYSIS_TYPES,
  VISIT_TABLE_FIELDS,
} from '../../constants/AppConstants';

//localization
import i18n from '../../localization/i18n';

//store
import store from '../../store';

//helpers
import { getFormattedDate } from '../dateHelper';
import { getParsedToolData, isEmpty } from '../genericHelper';
import {
  getFormattedLactationStage,
  getManureAvgForLactationStage,
  getManureScoreAvg,
  getManureScoreStdDeviation,
  heardGoalsInitialized,
  mapGraphDataForHerdAnalysisExport,
  parsePenLactationStages,
  parsePensData,
  pensInPercent,
} from '../rumenFillHelper';
import { addSpace } from '../genericHelper';
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

import colors from '../../constants/theme/variables/customColor';

export const getRumenFillBody = ({ tool, visitDetails, sitePens }) => {
  const rumenFillData = getParsedToolData(visitDetails?.rumenFill);
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  selectedAnalysis.forEach(analysis => {
    if (
      analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      rumenFillData?.pens?.length > 0
    ) {
      const penAnalysisData = handlePenSelection({
        tool,
        rumenFillData,
        sitePens,
      });
      if (!isEmpty(penAnalysisData)) {
        body.penAnalysis = penAnalysisData;
      }
    } else if (analysis.value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS) {
      const herdAnalysisData = handleHerdAnalysisSelection({
        tool,
        rumenFillData,
        sitePens,
      });

      if (!isEmpty(herdAnalysisData)) {
        body.herdAnalysis = herdAnalysisData;
      }
    }
  });
  return body;
};

// Start Pen Analysis
const handlePenSelection = ({ tool, rumenFillData, sitePens }) => {
  const pensList = filterPensBySelection(tool, rumenFillData?.pens, sitePens);
  const penAnalysisArray = [];
  pensList.forEach(pen => {
    const sitePen = findFromSitePensById(sitePens, pen);
    const std = getManureScoreStdDeviation(pen.rumenFillScores)?.toFixed(2);
    const avg = getManureScoreAvg(pen.rumenFillScores)?.toFixed(2);
    const penDetails = getPenDetailsBody(pen);
    const penBody = getPenDetailsBodyByVisit(pen, tool?.recentVisits);
    const chartBody = getChartBody(tool?.recentVisits, pen);
    if (pen) {
      const penObj = {
        penName: sitePen?.name || pen?.penName || '',
        standardDeviation: std ? parseFloat(std) : 0,
        average: avg ? parseFloat(avg) : 0,
        penDetails: isEmpty(penDetails) ? null : penDetails,
        chart: isEmpty(chartBody) ? null : chartBody,
        penBody: isEmpty(penBody) ? null : penBody,
      };
      penAnalysisArray.push(penObj);
    }
  });
  return penAnalysisArray;
};

const getPenDetailsBody = pen => {
  if (pen?.rumenFillScores?.items?.length > 0) {
    const singlePenData = pen.rumenFillScores.items.map((item, index) => {
      const penPercent = pensInPercent(index, pen.rumenFillScores.items);
      return [
        createDynamicObjForReqBody(
          i18n.t('category'),
          item.scoreCategory?.toFixed(1),
        ),
        createDynamicObjForReqBody(i18n.t('penPercent'), penPercent),
        createDynamicObjForReqBody(
          i18n.t('animalsObserved'),
          item?.animalNumbers || 0,
        ),
      ];
    });
    return singlePenData;
  }
  return [];
};

const getPenDetailsBodyByVisit = (pen, recentVisits) => {
  if (recentVisits?.length > 0) {
    const sortedRecentVisit = sortRecentVisits(recentVisits);

    let visitDates = [];
    let rumenFillAvgScore = [];

    let categories = {};

    sortedRecentVisit.forEach((visit, index) => {
      const parsedRumenFillData = getRecentVisitToolData(
        visit,
        VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE,
      );

      if (parsedRumenFillData) {
        const foundPen = getRecentVisitPen(parsedRumenFillData?.pens, pen);
        if (foundPen) {
          visitDates.push(
            getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd_YY) +
              addSpace(index),
          );

          const avg = getManureScoreAvg(foundPen.rumenFillScores)?.toFixed(2);
          rumenFillAvgScore.push(avg);

          foundPen.rumenFillScores.items.map((item, index) => {
            const penPercent = pensInPercent(
              index,
              foundPen.rumenFillScores.items,
            );

            const categoryKey = parseFloat(item.scoreCategory)?.toFixed(1);
            if (categories[categoryKey]) {
              categories[categoryKey] = [
                ...categories[categoryKey],
                penPercent != '-' || item?.animalNumbers != 0
                  ? `${penPercent}${i18n.t('%')} | ${item?.animalNumbers}`
                  : '-',
              ];
            } else {
              categories[categoryKey] = [
                penPercent != '-' || item?.animalNumbers != 0
                  ? `${penPercent}${i18n.t('%')} | ${item?.animalNumbers}`
                  : '-',
              ];
            }
          });
        }
      }
    });

    return {
      categories,
      visitDates,
      rumenFillAvgScore,
    };
  }
  return {};
};

const getChartBody = (recentVisits, pen) => {
  if (recentVisits && recentVisits?.length > 0) {
    const sortedRecentVisit = sortRecentVisits(recentVisits);
    const graphData = [];
    sortedRecentVisit.forEach((visit, index) => {
      const parsedRumenFillData = getRecentVisitToolData(
        visit,
        VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE,
      );

      if (parsedRumenFillData) {
        const foundPen = getRecentVisitPen(parsedRumenFillData?.pens, pen);
        const point = {
          visitDate:
            getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd_YY) +
            addSpace(index),
          categoryAverage:
            Number(getManureScoreAvg(foundPen?.rumenFillScores)?.toFixed(2)) ||
            0,
        };
        foundPen && graphData.push(point);
      }
    });
    return graphData;
  }
  return [];
};
// End Pen Analysis

// Start Herd Analysis

const handleHerdAnalysisSelection = ({ tool, rumenFillData, sitePens }) => {
  const result = {};
  const herdAnalysisDetails = getBodyForHerdAnalysisDetails(
    tool,
    rumenFillData,
    sitePens,
  );
  if (!isEmpty(herdAnalysisDetails)) {
    result.herdAnalysisDetails = herdAnalysisDetails;
  }
  const graphsData = getBodyForHerdGraphs(rumenFillData, sitePens, tool);
  if (!isEmpty(graphsData)) {
    result.graph = graphsData;
  }
  return result;
};

const getBodyForHerdAnalysisDetails = (tool, rumenFillData, sitePens) => {
  const pensList = filterPensBySelection(tool, rumenFillData?.pens, sitePens);

  const data = pensList.map(pen => {
    let avg = 0;

    const sitePen = findFromSitePensById(sitePens, pen);
    const toolPen = findPenFromToolData(rumenFillData?.pens, sitePen);

    if (toolPen) {
      avg = getManureScoreAvg(toolPen?.rumenFillScores)?.toFixed(2);
      return [
        createDynamicObjForReqBody(
          i18n.t('pen'),
          toolPen?.penName || sitePen?.name || '',
        ),
        createDynamicObjForReqBody(i18n.t('RumenFill'), avg || 0),
        createDynamicObjForReqBody(
          i18n.t('DIM'),
          toolPen?.daysInMilk?.toString() ||
            sitePen?.daysInMilk?.toString() ||
            '-',
        ),
      ];
    }
  });
  return data;
};

const getBodyForHerdGraphs = (rumenFillData, sitePens, tool) => {
  const enums = store.getState().enums;

  // let filterPenList = [];

  const pensList = filterPensBySelection(tool, rumenFillData?.pens, sitePens);

  // pensList?.map(pen => {
  //   const sitePen = findFromSitePensById(sitePens, pen);
  //   if (sitePen) {
  //     filterPenList.push(sitePen);
  //   }
  // });

  // Parse pen data with daysInMilk from sitePens
  let penData = parsePensData(pensList, rumenFillData.pens, true);

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
  const goalsArray = heardGoalsInitialized(rumenFillData, enums);
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
    averageRumenFillScore: model.averageRumenFillScore,
    min: model.min,
    max: model.max,
  };
};
// End Herd Analysis

export const mapDataToVictoryChart = (chartData = []) => {
  if (chartData?.length > 0) {
    const data = chartData?.map(item => ({
      x: item.visitDate,
      y: item.categoryAverage,
    }));

    // The current visit is the last item in the sorted array
    const currentVisitIndex = chartData.length > 0 ? chartData.length - 1 : null;

    const graphObject = {
      data: data,
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

    return [graphObject];
  }
  return {};
};

export const mapRumenFillHerdGraphData = (graphData = {}) => {
  const graphKeys = graphData && Object.keys(graphData);

  if (graphKeys?.length > 0) {
    let finalData = {};

    graphKeys?.map(lineKey => {
      const lineData = graphData[lineKey];
      if (lineData) {
        const graphLineKeys = Object.keys(lineData);

        if (!finalData[lineKey]) {
          const mappedData = graphLineKeys?.map(item => ({
            x: item,
            y: lineData[item],
          }));

          finalData[lineKey] = mappedData;
        }
      }
    });

    return finalData;
  }

  return [];
};
