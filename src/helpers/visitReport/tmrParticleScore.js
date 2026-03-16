//constants
import {
  DATE_FORMATS,
  SCORER_ENUMS,
  TOOL_ANALYSIS_TYPES,
} from '../../constants/AppConstants';
import { RUMEN_HEALTH_TMR_PARTICLE_SCORE } from '../../constants/FormConstants';
import {
  PEN_ANALYSIS_TABLE_CONSTANTS,
  TMR_SUMMARY_COLUMN_HEADINGS,
} from '../../constants/toolsConstants/TMRParticleScoreConstants';

//localization
import i18n from '../../localization/i18n';
import colors from '../../constants/theme/variables/customColor';

//store
import store from '../../store';

//helpers
import { getParsedToolData, isEmpty, addSpace } from '../genericHelper';
import {
  extractGoalsFromTmrParticleScore,
  mapGraphDataForHerdAnalysisExport,
  parseTmrScoreDataForExport,
  tmrParticleScoreTableData,
} from '../tmrParticleScoreHelper';
import {
  createDynamicObjForReqBody,
  filterPensBySelection,
  getSelectedAnalysisCategories,
  sortRecentVisits,
} from './visitReportHelper';
import { convertArrayOfObjValuesToNumber } from '../alphaNumericHelper';
import { getFormattedDate } from '../dateHelper';

export const getGraphMinMax = (items, item) => {
  let goalTopPercent = [];
  let goalMid1Percent = [];
  let goalMid2Percent = [];
  let goalTrayPercent = [];
  item?.onScreenPercentage.map(x => {
    let selectedVisit = items?.recentVisitsummaryDetails.visitObj?.find(
      c => c.visitDetail.id == x.visitId,
    );

    goalTopPercent.push({
      min: selectedVisit?.topGoalMinimumPercent,
      max: selectedVisit?.topGoalMaximumPercent,
    });

    goalMid1Percent.push({
      min: selectedVisit?.mid1GoalMinimumPercent,
      max: selectedVisit?.mid1GoalMaximumPercent,
    });

    goalMid2Percent.push({
      min: selectedVisit?.mid2GoalMinimumPercent,
      max: selectedVisit?.mid2GoalMaximumPercent,
    });

    goalTrayPercent.push({
      min: selectedVisit?.trayGoalMinimumPercent,
      max: selectedVisit?.trayGoalMaximumPercent,
    });
  });
  return {
    goalTopPercent,
    goalMid1Percent,
    goalMid2Percent,
    goalTrayPercent,
  };
};

export const getBodyForTMRParticleScore = ({
  tool,
  visitDetails,
  sitePens,
}) => {
  const tmrParticleScoreData = getParsedToolData(
    visitDetails?.tmrParticleScore,
  );
  const enumsState = store.getState()?.enums?.enum || {};
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );

  selectedAnalysis.forEach(analysis => {
    if (
      analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      tmrParticleScoreData?.tmrScores?.length > 0
    ) {
      const penAnalysisData = handlePenSelection({
        tool,
        tmrParticleScoreData,
        sitePens,
        scorerEnums: enumsState?.scorers,
      });

      if (!isEmpty(penAnalysisData)) {
        body.penAnalysis = penAnalysisData;
      }
    } else if (
      analysis.value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS &&
      tmrParticleScoreData?.tmrScores?.length > 0
    ) {
      let selectedPen = tool?.selectedPens;

      let filteredPens = [];
      if (selectedPen.length > 0 && selectedPen[0] != 'all') {
        let idSet = new Set(tool.selectedPens);
        filteredPens = sitePens.filter(
          item => idSet.has(String(item?.id)) || idSet.has(item?.sv_id),
        );
      } else {
        filteredPens = sitePens;
      }
      const herdAnalysisData = handleHerdAnalysisSelection({
        tmrParticleScoreData,
        filteredPens,
      });
      if (!isEmpty(herdAnalysisData)) {
        body.herdAnalysis = herdAnalysisData;
      }
    }
  });
  return body;
};

const getAllUniquePensFromTMRScores = (penTMRScores = []) => {
  const distinctPens = [
    ...new Map(penTMRScores.map(item => [item.penId, item])).values(),
  ];
  return distinctPens;
};

/** Start  Pen Analysis */

const handlePenSelection = ({
  tool,
  tmrParticleScoreData,
  sitePens,
  scorerEnums,
}) => {
  const pensList = filterPensBySelection(
    tool,
    tmrParticleScoreData?.tmrScores,
    sitePens,
  );
  const distinctPens = getAllUniquePensFromTMRScores(pensList);
  const penAnalysisArray = distinctPens.reduce((result, pen) => {
    if (pen && pen.penId) {
      const filteredPenScores = tmrParticleScoreData?.tmrScores?.filter(
        item => item?.penId == pen?.penId,
      );
      const penObj = {
        scorerLabel: getScorerLabel(
          scorerEnums,
          tmrParticleScoreData?.selectedScorer,
        ),
        penName: pen.penName,
        penId: pen?.penId,
        penAnalysisDetails: getPenAnalysisDetails(
          filteredPenScores,
          tmrParticleScoreData?.selectedScorer,
        ),
        summaryDetails: getSummaryDetails(tmrParticleScoreData, pen),
        recentVisitsummaryDetails: getSummaryDetailsRecentVisit(
          tmrParticleScoreData,
          pen,
          tool?.recentVisits,
        ),
        graph: getPenAnalysisGraphBody(
          filteredPenScores,
          tmrParticleScoreData?.selectedScorer,
          tool?.recentVisits,
        ),
        standardDeviation: getScaleAmountStdDeviation(filteredPenScores),
        selectedScorer: tmrParticleScoreData?.selectedScorer,
      };
      result.push(penObj);
    }

    return result;
  }, []);
  return penAnalysisArray;
};

const getScaleAmountStdDeviation = data => {
  try {
    // Flatten the scale amount values into a single array, excluding null or undefined values
    let values = [];
    if (data && Array.isArray(data)) {
      data.forEach(item => {
        values.push(item?.mid1ScaleAmountInGrams);
        values.push(item?.mid2ScaleAmountInGrams);
        values.push(item?.topScaleAmountInGrams);
        values.push(item?.trayScaleAmountInGrams);
      });
    }
    // Filter out null or undefined values
    values = values.filter(value => value !== null && value !== undefined);

    if (values.length === 0) {
      return 0.0; // Return 0 if no valid values
    }

    // Calculate the average (mean)
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

    // Calculate the sum of squared errors weighted by count
    let sumSquaredError = 0;
    values.forEach(value => {
      const error = value - mean;
      const squaredError = error * error;
      sumSquaredError += squaredError;
    });

    // Calculate the standard deviation
    const count = values.length;
    let stdDeviation = 0;
    if (count > 1) {
      stdDeviation = Math.sqrt(sumSquaredError / (count - 1));
    } else if (count === 1) {
      stdDeviation = Math.sqrt(sumSquaredError / count);
    }

    return stdDeviation.toFixed(2);
  } catch (error) {
    console.error('Error calculating standard deviation:', error);
    return 0.0;
  }
};

const getScorerLabel = (scorerEnums, selectedScorer) => {
  const scoreLabel = scorerEnums?.find(item => item?.key === selectedScorer);
  return scoreLabel?.value || '';
};

const getPenAnalysisDetails = (filteredPenScores, selectedScorer) => {
  if (filteredPenScores?.length > 0) {
    const data = filteredPenScores.reduce((result, penScore) => {
      if (penScore.tmrScoreName) {
        const singleItem = getSinglePenDetails(penScore, selectedScorer);
        result.push(singleItem);
      }
      return result;
    }, []);
    return data;
  }
  return null;
};

const getSinglePenDetails = (pen, selectedScorer) => {
  return {
    [pen.tmrScoreName]: [
      createDynamicObjForReqBody(
        i18n.t('top_19mm'),
        pen?.topScaleAmountInGrams || '',
      ),
      createDynamicObjForReqBody(
        i18n.t('mid1_18mm'),
        pen?.mid1ScaleAmountInGrams || '',
      ),
      ...(selectedScorer !== SCORER_ENUMS.THREE_SCREEN
        ? [
            createDynamicObjForReqBody(
              i18n.t('mid2_4mm'),
              pen?.mid2ScaleAmountInGrams || '',
            ),
          ]
        : []),
      createDynamicObjForReqBody(
        i18n.t('tray'),
        pen?.trayScaleAmountInGrams || '',
      ),
    ],
  };
};

const getPenAnalysisGraphBody = (
  filteredPenScores,
  selectedScorer,
  recentVisits,
) => {
  if (recentVisits && recentVisits?.length > 0) {
    const graphData = filteredPenScores.map(penScore => {
      return {
        tmrLabel: penScore.tmrScoreName,
        onScreenPercentage: getOnScreenPercentageArray(
          recentVisits,
          selectedScorer,
          penScore.tmrScoreId,
          penScore,
        ),
      };
    });
    return graphData;
  }
  return null;
};

const getOnScreenPercentageArray = (
  recentVisits,
  selectedScorer,
  graphType,
  selectedPen,
) => {
  const tmrState = { selectedScorer: selectedScorer };
  const selectedGraph = { key: graphType, name: graphType };
  const sortedRecentVisits = sortRecentVisits(recentVisits);
  const selectedPenWithPenId = {
    ...selectedPen,
    id: selectedPen?.penId,
  };
  const penExportGraphPayload = parseTmrScoreDataForExport(
    sortedRecentVisits,
    tmrState,
    selectedGraph,
    selectedPenWithPenId,
  );

  const numberFormattedGraphData = convertArrayOfObjValuesToNumber(
    penExportGraphPayload,
  );
  return numberFormattedGraphData;
};

//reuse same graph/summary functions in visit report so reusability
const getSummaryDetails = (tmrParticleScoreData, pen) => {
  let tableHeaders = [i18n.t('top_19mm'), i18n.t('mid1_18mm'), i18n.t('tray')];
  if (
    tmrParticleScoreData?.[RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER] !==
    SCORER_ENUMS.THREE_SCREEN
  ) {
    tableHeaders.splice(3, 0, i18n.t('mid2_4mm'));
  }

  let summaryDetail = [];

  let tmrParticleScoreGoals =
    extractGoalsFromTmrParticleScore(tmrParticleScoreData);

  let tableData = tmrParticleScoreTableData(
    tmrParticleScoreData,
    tmrParticleScoreGoals,
    pen,
  );

  Object.values(TMR_SUMMARY_COLUMN_HEADINGS).map(
    (summaryDetailKey, summaryDetailKeyIndex) => {
      let detail = [];

      tableHeaders.map((title, titleIndex) => {
        let value = tableData[summaryDetailKeyIndex][titleIndex];

        detail.push({ column: title, value });
      });

      summaryDetail.push({ [summaryDetailKey]: detail });
    },
  );

  return summaryDetail;
};
const getSummaryDetailsRecentVisit = (tmrParticleScoreData, pen, tools) => {
  let recentVisit = tools.map(x => {
    return {
      ...x,
      tmrParticleScores: JSON.parse(x.tmrParticleScore),
    };
  });
  let visitObj = [];
  recentVisit.forEach(element => {
    visitObj.push({
      mid1GoalMinimumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.mid1GoalMinimumPercent,
      mid2GoalMinimumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.mid2GoalMinimumPercent,
      topGoalMinimumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.topGoalMinimumPercent,
      trayGoalMinimumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.trayGoalMinimumPercent,

      mid1GoalMaximumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.mid1GoalMaximumPercent,
      mid2GoalMaximumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.mid2GoalMaximumPercent,
      topGoalMaximumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.topGoalMaximumPercent,
      topGoalMinimumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.topGoalMinimumPercent,
      trayGoalMaximumPercent:
        element?.tmrParticleScores?.tmrScores[0]?.trayGoalMaximumPercent,
      visitDetail: element,
      visitDate: getFormattedDate(element?.visitDate, DATE_FORMATS.MM_dd),
      visitName: element?.visitName,
    });
  });
  return {
    visitObj,
  };
};

/** End  Pen Analysis */

/** Start  Herd Analysis */
const handleHerdAnalysisSelection = ({
  tmrParticleScoreData,
  filteredPens,
}) => {
  const herdAnalysisBody = {};
  const herdAnalysisDetails = getHerdAnalysisDetails(
    tmrParticleScoreData,
    filteredPens,
  );

  if (!isEmpty(herdAnalysisDetails)) {
    herdAnalysisBody.herdAnalysisDetails = herdAnalysisDetails;

    const graphBody = getHerdAnalysisGraphBody(
      herdAnalysisDetails,
      tmrParticleScoreData,
    );
    if (!isEmpty(graphBody)) {
      herdAnalysisBody.graph = graphBody;
    }

    return herdAnalysisBody;
  } else {
    return null;
  }
};

const getHerdAnalysisDetails = (tmrParticleScoreData, sitePens) => {
  let distinctPens = getAllUniquePensFromTMRScores(
    tmrParticleScoreData?.tmrScores,
  );

  const data = [];
  distinctPens?.map(pen => {
    let tmrParticleScoreGoals =
      extractGoalsFromTmrParticleScore(tmrParticleScoreData);

    let tableData = tmrParticleScoreTableData(
      tmrParticleScoreData,
      tmrParticleScoreGoals,
      pen,
      // true,
    );

    if (tableData) {
      data.push([pen?.penName || pen?.name, pen?.daysInMilk, ...tableData[0]]);
    }
  });

  return data;
};

const getHerdAnalysisGraphBody = (
  herdAnalysisDetails,
  tmrParticleScoreData,
) => {
  if (herdAnalysisDetails) {
    const graphExportPayload = parseTmrHerdAnalysisDataForVisitReportGraph(
      herdAnalysisDetails,
      tmrParticleScoreData,
    );
    const model = mapGraphDataForHerdAnalysisExport(null, graphExportPayload);
    return { dataPoints: model.dataPoints };
  }
  return null;
};

export const getSTDPenAnalysis = (penAnalysis = [], index) => {
  const tableHeader = [i18n.t('top_19mm'), i18n.t('mid1_18mm'), i18n.t('tray')];

  let tableData = [];

  if (
    penAnalysis[index]?.summaryDetails?.length >= 2 &&
    penAnalysis[index]?.summaryDetails?.[1]?.[
      PEN_ANALYSIS_TABLE_CONSTANTS.STANDARD_DEVIATION
    ]
  ) {
    const standardDeviationArray =
      penAnalysis[index].summaryDetails[1][
        PEN_ANALYSIS_TABLE_CONSTANTS.STANDARD_DEVIATION
      ];

    const stdRowData = [
      standardDeviationArray.find(
        item => item.column === PEN_ANALYSIS_TABLE_CONSTANTS.TOP,
      )?.value || '0.00',
      standardDeviationArray.find(
        item => item.column === PEN_ANALYSIS_TABLE_CONSTANTS.MID1,
      )?.value || '0.00',
      standardDeviationArray.find(
        item => item.column === PEN_ANALYSIS_TABLE_CONSTANTS.TRAY,
      )?.value || '0.00',
    ];

    if (penAnalysis[index]?.selectedScorer !== SCORER_ENUMS.THREE_SCREEN) {
      tableHeader.splice(2, 0, i18n.t('mid2_4mm'));
      stdRowData.splice(
        2,
        0,
        standardDeviationArray.find(
          item => item.column === PEN_ANALYSIS_TABLE_CONSTANTS.MID2,
        )?.value || '0.00',
      );
    }

    tableData.push(stdRowData);
  } else {
    tableData.push(['0.00', '0.00', '0.00', '0.00']);
  }

  return { tableHeader, tableData };
};

/** End  Herd Analysis */

export const getTMRHerdAnalysisTableData = (
  herdAnalysis = [],
  isMid2Present = false,
) => {
  const tableHeader = [
    i18n.t('pen'),
    i18n.t('DIM'),
    i18n.t('top_19mm'),
    i18n.t('mid1_18mm'),
    ...(isMid2Present ? [i18n.t('mid2_4mm')] : []),
    i18n.t('tray'),
  ];
  let tableData = [];

  herdAnalysis?.forEach((element, i) => {
    let values = [];
    values.push(element[0]);
    values.push(element[1]);
    values.push(element[2] ? element[2] + '%' : '-');
    values.push(element[3] ? element[3] + '%' : '-');
    if (isMid2Present) {
      values.push(element[4] ? element[4] + '%' : '-');
      values.push(element[5] ? element[5] + '%' : '-');
    } else {
      values.push(element[4] ? element[4] + '%' : '-');
    }

    tableData.push(values);
  });

  return { tableHeader, tableData };
};

export const parseTmrHerdAnalysisDataForVisitReportGraph = (
  herdAnalysis = [],
  tmrParticleScoreState,
) => {
  let data = [];

  herdAnalysis?.forEach((element, i) => {
    const dataPoint = {
      top: null,
      mid1: null,
      mid2: null,
      tray: null,
      penName: null,
    };

    dataPoint.penName = element[0];
    dataPoint.top = element[2];
    dataPoint.mid1 = element[3];
    if (tmrParticleScoreState?.selectedScorer === SCORER_ENUMS.THREE_SCREEN) {
      dataPoint.tray = element[4];
    } else {
      dataPoint.mid2 = element[4];
      dataPoint.tray = element[5];
    }

    if (
      tmrParticleScoreState?.[
        RUMEN_HEALTH_TMR_PARTICLE_SCORE.SELECTED_SCORER
      ] === SCORER_ENUMS.THREE_SCREEN
    ) {
      delete dataPoint.mid2;
    }
    data.push(dataPoint);
  });

  return data;
};

export const getGraphResultData = data => {
  let temps = [
    { barColor: colors.topColor, dataPoints: [] },
    { barColor: colors.mid1Color, dataPoints: [] },
    { barColor: colors.mid2Color, dataPoints: [] },
    { barColor: colors.trayColor, dataPoints: [] },
  ];
  let isMid2Present = true;
  data?.graph?.dataPoints.forEach((element, index) => {
    temps.forEach(temp => {
      temp.dataPoints.push({ x: element.penName, y: 0 });
    });
    isMid2Present = element.hasOwnProperty('mid2');

    temps[0].dataPoints[index].y = element.top ? Number(element?.top) : null;
    temps[1].dataPoints[index].y = element.mid1 ? Number(element.mid1) : null;
    temps[2].dataPoints[index].y = element.mid2 ? Number(element.mid2) : null;
    temps[3].dataPoints[index].y = element.tray ? Number(element.tray) : null;
  });

  if (!isMid2Present) {
    temps.splice(2, 1);
  }
  return temps;
};

export const getPenGraphResult = (data, isThree) => {
  let temps = [
    { barColor: colors.topColor, dataPoints: [] },
    { barColor: colors.mid1Color, dataPoints: [] },
    { barColor: colors.mid2Color, dataPoints: [] },
    { barColor: colors.trayColor, dataPoints: [] },
  ];
  data?.onScreenPercentage?.forEach((element, index) => {
    temps.forEach(temp => {
      temp.dataPoints.push({
        x: element.visitDate + addSpace(index + 1),
        y: 0,
      });
    });

    temps[0].dataPoints[index].y = element.top ? element.top : null;
    temps[1].dataPoints[index].y = element.mid1 ? element.mid1 : null;
    temps[2].dataPoints[index].y = element.mid2 ? element.mid2 : null;

    temps[3].dataPoints[index].y = element.tray ? element.tray : null;
  });
  if (!isThree) {
    temps.splice(2, 1);
  }
  return temps;
};

export const getPenGraphResultData = data => {
  let array = [];
  data.forEach((item, inn) => {
    item?.graph?.forEach((element, index) => {
      let temps = [
        { barColor: colors.topColor, dataPoints: [] },
        { barColor: colors.mid1Color, dataPoints: [] },
        { barColor: colors.mid2Color, dataPoints: [] },
        { barColor: colors.trayColor, dataPoints: [] },
      ];
      element?.onScreenPercentage.forEach((row, i) => {
        temps.forEach(temp => {
          temp.dataPoints.push({ x: element.tmrLabel, y: 0 });
        });
        temps[0].dataPoints[i].y = row.top;
        temps[1].dataPoints[i].y = row.mid1;
        temps[2].dataPoints[i].y = row.mid2;
        temps[3].dataPoints[i].y = row.tray;
      });
      array.push(temps);
    });
  });

  return array;
};

const transformData = (input, localVisitId, scorer) => {
  let output = [];

  const colorCodes = {
    [`${i18n.t('top_19mm')}Color`]: colors.topColor,
    [`${i18n.t('mid1_18mm')}Color`]: colors.mid1Color,
    [`${i18n.t('mid2_4mm')}Color`]: colors.mid2Color,
    [`${i18n.t('tray')}Color`]: colors.trayColor,
  };

  const columns = [i18n.t('top_19mm'), i18n.t('mid1_18mm'), i18n.t('tray')];

  const columnsKeys = [
    RUMEN_HEALTH_TMR_PARTICLE_SCORE.TOP,
    RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID1,
    RUMEN_HEALTH_TMR_PARTICLE_SCORE.TRAY,
  ];

  if (
    [SCORER_ENUMS.FOUR_SCREEN_NEW, SCORER_ENUMS.FOUR_SCREEN_OLD].includes(
      scorer,
    )
  ) {
    columns.splice(2, 0, i18n.t('mid2_4mm'));
    columnsKeys.splice(2, 0, RUMEN_HEALTH_TMR_PARTICLE_SCORE.MID2);
  }

  for (let i = 0; i < columns.length; i++) {
    const dataPoints = [];

    for (let j = 0; j < input.length; j++) {
      let onScreenPercentages =
        input[j]?.onScreenPercentage.find(p => p.visitId == localVisitId) || [];
      let tmrLabel = input[j]?.tmrLabel;
      dataPoints.push({
        x: tmrLabel,
        y: onScreenPercentages[columnsKeys[i]],
      });
    }

    output.push({
      barColor: colorCodes[columns[i] + 'Color'],
      dataPoints,
    });
  }
  return output;
};

export const getCurrentVisitTmrComparison = (data, localVisitId, scorer) => {
  let result = transformData(data.graph, localVisitId, scorer);

  return result;
};

export const getRecentVisit = (tool, penAnalysis) => {
  let recentRecord = tool?.recentVisits?.map(x => {
    return {
      ...x,
      tmrParticleScore: JSON.parse(x.tmrParticleScore),
    };
  });
  let temp = [];

  if (recentRecord?.length > 0) {
    recentRecord.map(item => {
      item?.tmrParticleScore?.tmrScores?.forEach(x => {
        penAnalysis?.forEach(ele => {
          if (ele.penId == x.penId) {
            temp.push({
              x: x,
              y: ele,
            });
          }
        });
      });
    });
  }
};
