import { format } from 'date-fns';
//constants
import {
  DATE_FORMATS,
  TOOL_ANALYSIS_TYPES,
  VISIT_TABLE_FIELDS,
} from '../../constants/AppConstants';

//localization

import i18n from '../../localization/i18n';

//helpers
import {
  getAvgChewsCount,
  getDeviationForNoOfChews,
  getScoreAnalysisState,
  herdAnalysisChewsAvg,
  herdAnalysisCudChewingGraph,
  mapGraphDataForHerdAnalysisExport,
} from '../rumenHealthHelper';
import {
  createDynamicObjForReqBody,
  filterPensBySelection,
  getRecentVisitPen,
  getRecentVisitToolData,
  getSelectedAnalysisCategories,
  sortRecentVisits,
} from './visitReportHelper';
import { isEmpty, addSpace } from '../genericHelper';
import { convertObjectValuesToNumber } from '../alphaNumericHelper';
import { dateHelper } from '../dateHelper';
import { getParsedToolData } from '../genericHelper';
import colors from '../../constants/theme/variables/customColor';

export const getRumenHealthBody = ({ tool, rumenHealth, sitePens }) => {
  const rumenHealthData = rumenHealth ? JSON.parse(rumenHealth) : null;
  if (!rumenHealthData) {
    return {};
  }
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  selectedAnalysis.forEach(analysis => {
    if (
      analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      rumenHealthData?.pens?.length > 0
    ) {
      const penAnalysisData = handlePenAnalysisSelection({
        tool,
        rumenHealthData,
        sitePens,
      });
      if (!isEmpty(penAnalysisData)) {
        body.penAnalysis = penAnalysisData;
      }
    } else if (
      analysis.value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS &&
      sitePens?.length > 0
    ) {
      const herdAnalysisData = handleHerdAnalysisSelection({
        rumenHealthData,
        sitePens,
      });
      if (!isEmpty(herdAnalysisData)) {
        body.herdAnalysis = herdAnalysisData;
      }
    }
  });
  return body;
};

/** Start  Pen Analysis */
const handlePenAnalysisSelection = ({ tool, rumenHealthData, sitePens }) => {
  const pensList = filterPensBySelection(tool, rumenHealthData?.pens, sitePens);
  const penAnalysisArray = pensList.reduce((result, pen) => {
    if (pen) {
      const chewingCount = pen?.cudChewingCowsCount?.countYes;
      const notChewingCount = pen?.cudChewingCowsCount?.countNo;
      const penObj = {
        penName: pen?.penName || '',
        chewing: chewingCount ? chewingCount?.toString() : '0',
        notChewing: notChewingCount ? notChewingCount?.toString() : '0',
        noOfChews: pen?.cudChewsCount?.map(cow => {
          return {
            cowName: `${i18n.t('cow')} ${cow?.cowNumber}` || '',
            numberOfChews: cow?.chewsCount?.toString() || '0',
          };
        }),
        cudChewingChart: {
          chewingPercentages: createBodyForChewingPercentages(
            tool.recentVisits,
            pen,
          ),
        },
        noOfChewsChart: createBodyForNoOfChewsChart(tool.recentVisits, pen),
      };

      result.push(penObj);
    }
    return result;
  }, []);
  return penAnalysisArray;
};

const createBodyForChewingPercentages = (recentVisits, pen) => {
  const sortedVisits = sortRecentVisits(recentVisits);
  const graphData = [];
  sortedVisits.forEach((visit, index) => {
    const parsedCudChewing = getRecentVisitToolData(
      visit,
      VISIT_TABLE_FIELDS.RUMEN_HEALTH,
    );
    if (parsedCudChewing) {
      const recentVisitPen = getRecentVisitPen(parsedCudChewing?.pens, pen);
      if (recentVisitPen) {
        const { cudChewingCowsCount = {} } = recentVisitPen;
        const dataObject = {
          visitDate: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(
            index,
          )}`,
          chewingPercentage:
            Number(cudChewingCowsCount?.yesPercent?.toFixed(2)) || 0,
        };

        if (cudChewingCowsCount?.totalCount < 10) {
          dataObject.chewingPercentage = 0;
        }

        graphData.push(dataObject);
      }
    }
  });
  return graphData;
};

const createBodyForNoOfChewsChart = (recentVisits, pen) => {
  const sortedVisits = sortRecentVisits(recentVisits);
  let graphData = [];

  sortedVisits.forEach((visit, index) => {
    const parsedCudChewing = getRecentVisitToolData(
      visit,
      VISIT_TABLE_FIELDS.RUMEN_HEALTH,
    );
    if (parsedCudChewing) {
      const recentVisitPen = getRecentVisitPen(parsedCudChewing?.pens, pen);

      if (
        index === sortedVisits?.length - 1 &&
        recentVisitPen?.cudChewsCount.length == 1 &&
        recentVisitPen?.cudChewsCount[0].chewsCount == 0
      ) {
        graphData = [];
      }

      if (
        recentVisitPen &&
        !(
          recentVisitPen?.cudChewsCount.length == 1 &&
          recentVisitPen?.cudChewsCount[0].chewsCount == 0
        )
      ) {
        const dataObject = {
          visitDate: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(
            index,
          )}`,
          noOfChews:
            Number(
              getAvgChewsCount(recentVisitPen?.cudChewsCount)?.toFixed(2),
            ) || 0,
        };
        graphData.push(dataObject);
      }
    }
  });

  const deviation = getDeviationForNoOfChewsChart(graphData);

  return {
    standardDeviation: Number(deviation) || 0,
    chewingPercentages: graphData,
  };
};

const getDeviationForNoOfChewsChart = data => {
  let deviation = null;

  if (data?.length > 0) {
    const values = data?.map(item => item?.noOfChews);
    values.unshift(null); //just for the consistency with tool level calculations

    deviation = getDeviationForNoOfChews(values);
  }
  return deviation;
};

/**End Pen Analysis */

/** Start Herd Selection */

const handleHerdAnalysisSelection = ({ rumenHealthData, sitePens }) => {
  const result = {};
  /**
   * @description
   * commenting pens formation because pens mapping are changing
   */
  const graphsBody = getBodyForGraphsOfHerdAnalysis(rumenHealthData, sitePens);
  if (graphsBody) {
    result.graphs = graphsBody;
  }
  const scoreAnalysisData = getBodyForScoreAnalysisOfHerd(
    rumenHealthData,
    sitePens,
  );
  if (!isEmpty(scoreAnalysisData)) {
    result.scoreAnalysis = scoreAnalysisData;
  }
  return result;
};

const getBodyForGraphsOfHerdAnalysis = (rumenHealthData, sitePens) => {
  const cudChewGraphData = herdAnalysisCudChewingGraph(
    sitePens,
    rumenHealthData,
  );
  const chewingPercentageGraphData = herdAnalysisChewsAvg(
    sitePens,
    rumenHealthData,
  );
  if (
    cudChewGraphData &&
    chewingPercentageGraphData &&
    cudChewGraphData?.length > 0 &&
    chewingPercentageGraphData?.length > 0
  ) {
    const model = mapGraphDataForHerdAnalysisExport(
      null,
      cudChewGraphData,
      chewingPercentageGraphData,
    );
    if (model.goalCudChewingPercentage) {
      model.goalCudChewingPercentage = convertObjectValuesToNumber(
        model.goalCudChewingPercentage,
      );
    }

    return {
      chewsPerRegurgitation: model.chewsPerRegurgitation,
      goalChews: model.goalChews,
      cudChewingPercentage: model.cudChewingPercentage,
      goalCudChewingPercentage: model.goalCudChewingPercentage,
    };
  }
};

const getBodyForScoreAnalysisOfHerd = (rumenHealthData, sitePens) => {
  const data = getScoreAnalysisState(rumenHealthData, sitePens);
  const formattedScoreAnalysisArray = data.reduce((formattedArray, penItem) => {
    formattedArray.push([
      createDynamicObjForReqBody(i18n.t('pen'), penItem?.penName || ''),
      createDynamicObjForReqBody(
        `${i18n.t('chewing')} ${i18n.t('%')}`,
        penItem?.percentage?.toFixed(2) || '-',
      ),
      createDynamicObjForReqBody(
        i18n.t('avgChewsPerCud'),
        penItem?.avgChews?.toFixed(2) || '',
      ),
      createDynamicObjForReqBody(
        i18n.t('DIM'),
        penItem?.daysInMilk?.toString() || '',
      ),
    ]);
    return formattedArray;
  }, []);
  return formattedScoreAnalysisArray;
};

/** End Herd Selection*/

/** Start new visit report section */
export const getCudChewingToolBodyDetails = (
  toolInfo,
  visitDetails,
  sitePens,
) => {
  const body = {};

  if (toolInfo && toolInfo?.recentVisits?.length > 0) {
    const rumenHealthData = visitDetails?.rumenHealth
      ? JSON.parse(visitDetails?.rumenHealth)
      : null;
    if (!rumenHealthData) {
      return {};
    }

    // get selected analysis types e.g(pen analysis, herd analysis, animal analysis)
    const selectedAnalysis = getSelectedAnalysisCategories(
      toolInfo?.analysisCategories,
    );

    selectedAnalysis.forEach(analysis => {
      if (
        analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
        rumenHealthData?.pens?.length > 0
      ) {
        const penAnalysisData = handlePenAnalysisSectionData({
          tool: toolInfo,
          rumenHealthData,
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
          rumenHealthData,
          sitePens,
        });
        if (!isEmpty(herdAnalysisData)) {
          body.herdAnalysis = herdAnalysisData;
        }
      }
    });
  }

  return body;
};

/**
 *
 * @param {Object} tool
 * @param {Object} rumenHealthData
 * @param {Array} sitePens
 *
 * @returns {Array} - pens array contains page details of each pen
 */
const handlePenAnalysisSectionData = ({ tool, rumenHealthData, sitePens }) => {
  // filter selected pens from tool
  const pensList = filterPensBySelection(tool, rumenHealthData?.pens, sitePens);

  const penAnalysisArray = pensList.reduce((result, pen) => {
    if (pen) {
      const penForPenName = sitePens?.find(
        item => item?.id === pen?.penId || item?.sv_id === pen?.penId,
      );
      // get individual pen data from recent visits
      const recentVisitData = getRecentVisitCudChewingPensData(
        tool.recentVisits,
        pen,
      );

      const penObj = {
        penName: pen?.penName || penForPenName?.name || '',
        chewing: recentVisitData?.chewingCount || [],
        notChewing: recentVisitData?.notChewingCount || [],
        visitDates: recentVisitData?.visitDates || [],
        noOfChews: recentVisitData?.averageChews || [],
        cudChewingChart: {
          chewingPercentages: createBodyForChewingPercentages(
            tool.recentVisits,
            pen,
          ),
        },
        noOfChewsChart: createBodyForNoOfChewsChart(tool.recentVisits, pen),
        showAverageChewsGraph: recentVisitData.showAverageChewsGraph,
      };

      result.push(penObj);
    }
    return result;
  }, []);

  return penAnalysisArray;
};

/**
 *
 * @param {Array} recentVisits recent visit array
 * @param {object} pen selected pen object from visit tool data
 *
 * @returns {Object} contains chewing yes percentage(array) and not chewing percentage(array) and recent visit dates (array)
 */
const getRecentVisitCudChewingPensData = (recentVisits, pen) => {
  if (recentVisits?.length > 0) {
    const sortedVisits = sortRecentVisits(recentVisits);

    let chewingCount = [],
      notChewingCount = [],
      visitDates = [],
      averageChews = [],
      showAverageChewsGraph = false;

    sortedVisits?.map(visit => {
      // get tool data in json parsed form
      const toolData = getParsedToolData(visit?.rumenHealth);

      if (toolData) {
        // filter current pen data
        const toolPen = getRecentVisitPen(toolData?.pens, pen);

        if (
          toolPen &&
          (toolPen?.cudChewingCowsCount || toolPen?.cudChewsCount)
        ) {
          visitDates.push(
            dateHelper.getFormattedDate(
              visit?.visitDate,
              DATE_FORMATS.MM_dd_YY,
            ),
          );

          const yesPercent = toolPen?.cudChewingCowsCount?.yesPercent
            ? toolPen?.cudChewingCowsCount?.yesPercent?.toFixed(2)
            : '-';

          const noPercent = toolPen?.cudChewingCowsCount?.noPercent
            ? toolPen?.cudChewingCowsCount?.noPercent?.toFixed(2)
            : '-';

          chewingCount.push(yesPercent);
          notChewingCount.push(noPercent);

          let chewsAverage = 0;
          toolPen?.cudChewsCount?.map(cow => (chewsAverage += cow?.chewsCount));

          const avgChews =
            toolPen && chewsAverage
              ? parseFloat(
                chewsAverage / toolPen?.cudChewsCount?.length,
              )?.toFixed(2)
              : '-';

          if (avgChews != '-') {
            showAverageChewsGraph = true;
          }
          averageChews.push(avgChews);
        }
      }
    });

    return {
      chewingCount,
      notChewingCount,
      visitDates,
      averageChews,
      showAverageChewsGraph,
    };
  }

  return {};
};

/**
 *
 * @param {Object} cudChewingPercentChart chewing percent graph data
 * @param {Object} numberOfChewsChart number of chews in pens data
 * @returns {Object} graph data object for cudChewingPercentage and number of chews
 */
export const generateCudChewingPenAnalysisGraphsData = (
  cudChewingPercentChart,
  numberOfChewsChart,
) => {
  let graphOject = {};
  const cudChewingPercentData = [];
  const cudChewingNumberOfChewsData = [];

  if (cudChewingPercentChart?.chewingPercentages?.length > 0) {
    const visitLengths = cudChewingPercentChart?.chewingPercentages?.length;

    if (
      cudChewingPercentChart?.chewingPercentages[visitLengths - 1]
        ?.chewingPercentage > 0
    ) {
      graphOject.data = [];
      cudChewingPercentChart?.chewingPercentages?.map(item => {
        if (item.chewingPercentage === 0) {
          return;
        } else {
          graphOject.data.push({
            x: item.visitDate,
            y: item.chewingPercentage === 0 ? null : item.chewingPercentage,
          });
        }
      });

      // set y axis domain from top and bottom
      graphOject.domain = {
        y: [0, 100],
      };

      // set gradient color
      graphOject.gradientId = 'gradient1';
      graphOject.gradientStyles = [
        { offset: '0%', stopColor: colors.secondary2 },
        { offset: '100%', stopColor: colors.white },
      ];

      // set solid line style
      graphOject.customLineStyles = {
        stroke: colors.secondary2,
      };

      // The current visit is the last item in the data array
      graphOject.currentVisitIndex = graphOject.data.length > 0 ? graphOject.data.length - 1 : null;

      cudChewingPercentData.push(graphOject);
    }
  }

  graphOject = {};

  if (numberOfChewsChart?.chewingPercentages?.length > 0) {
    graphOject.data = numberOfChewsChart?.chewingPercentages?.map(item => ({
      x: item.visitDate,
      y: item.noOfChews === 0 ? null : item.noOfChews,
    }));

    // set y axis domain from top and bottom
    graphOject.domain = {
      y: [0, 100],
    };

    // set gradient color
    graphOject.gradientId = 'gradient1';
    graphOject.gradientStyles = [
      { offset: '0%', stopColor: colors.secondary2 },
      { offset: '100%', stopColor: colors.white },
    ];

    // set solid line style
    graphOject.customLineStyles = {
      stroke: colors.secondary2,
    };

    // The current visit is the last item in the sorted array
    graphOject.currentVisitIndex = numberOfChewsChart?.chewingPercentages?.length > 0
      ? numberOfChewsChart.chewingPercentages.length - 1
      : null;

    cudChewingNumberOfChewsData.push(graphOject);
  }

  return {
    cudChewingPercentData,
    cudChewingNumberOfChewsData,
  };
};
