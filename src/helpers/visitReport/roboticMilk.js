//constants
import {
  DATE_FORMATS,
  KG_REGEX,
  TOOL_ANALYSIS_TYPES,
  UNIT_OF_MEASURE,
} from '../../constants/AppConstants';
import {
  AMS_UTILIZATION_GRAPH_TABS,
  GRAPH_TYPES_VALUES,
  ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS,
} from '../../constants/toolsConstants/RoboticMilkConstants';

//localization
import i18n from '../../localization/i18n';

//store
import store from '../../store';

//helpers
import {
  getCommaSeparatedValues,
  getParsedToolData,
  isEmpty,
} from '../genericHelper';
import {
  createRoboticMilkGraphData,
  getRoboticMilkAnalysis,
  getRoboticMilkGraphTabsByTrend,
  parseImperialRoboticMilkFormData,
  roboticMilkGraphDataExportModeller,
} from '../roboticMilkEvaluationHelper';
import {
  getSelectedAnalysisCategories,
  sortRecentVisits,
} from './visitReportHelper';
import { convertToString, roundNumber } from '../alphaNumericHelper';
import { getWeightUnitByMeasure } from '../appSettingsHelper';
import { getFormattedDate } from '../dateHelper';

export const getRoboticMilkBody = ({ tool, visitDetails }) => {
  let roboticMilkEvaluationBody = getParsedToolData(
    visitDetails?.roboticMilkEvaluation,
  );

  if (visitDetails?.unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    roboticMilkEvaluationBody = parseImperialRoboticMilkFormData({
      data: roboticMilkEvaluationBody,
    });
  }

  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  if (
    selectedAnalysis?.length > 0 &&
    selectedAnalysis[0].value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS &&
    roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData
  ) {
    //herd level info
    const herdInfoLeftTable = getBodyForHerdLevelInformationLeftTable(
      roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
      visitDetails,
    );
    body.herdLevelInformationLeftTable = herdInfoLeftTable;

    const herdInfoRightTable = getBodyForHerdLevelInformationRightTable(
      roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
      visitDetails,
    );
    body.herdLevelInformationRightTable = herdInfoRightTable;

    //outputs

    const outputTable = getBodyForOutputTable(
      roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
      visitDetails?.unitOfMeasure,
    );
    body.outputTable = outputTable;

    //Analysis

    const analysisGraphBody = getBodyForAnalysisGraphBody(
      roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
      visitDetails?.unitOfMeasure,
    );
    if (!isEmpty(analysisGraphBody)) {
      body.analysisDialGraphs = analysisGraphBody;
    }

    //graphs
    const graphsBody = getBodyForGraphs(
      tool?.recentVisits,
      roboticMilkEvaluationBody,
      visitDetails?.unitOfMeasure,
    );

    if (!isEmpty(graphsBody)) {
      body.graphs = graphsBody;
    }
  }
  return body;
};

//Start Herd level info
const getBodyForHerdLevelInformationLeftTable = (
  roboticMilkEvaluationBody,
  visitDetails,
) => {
  const {
    robotType,
    cowFlowDesign,
    robotsInHerd,
    lactatingCows,
    robotFreeTime,
    averageMilkYield,
    averageBoxTime,
    milkings,
  } = roboticMilkEvaluationBody || {};
  const { unitOfMeasure } = visitDetails;
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  return {
    [i18n.t('robotType')]: robotType || '',
    [i18n.t('cowFlowDesign')]: cowFlowDesign || '',
    [i18n.t('robotsInHerd')]: robotsInHerd || '0',
    [i18n.t('lactatingCows')]: convertToString(lactatingCows) || '0',
    [getLabelAccordingToUOM(weightUnit, i18n.t('averageMilkYieldLely'))]:
      convertToString(averageMilkYield) || '0',
    [i18n.t('averageBoxTimeLely')]: convertToString(averageBoxTime) || '0',
    [i18n.t('milkingsLely')]: convertToString(milkings) || '0',
    [i18n.t('robotFreeTimeLely')]: convertToString(robotFreeTime) || '0',
  };
};

const getLabelAccordingToUOM = (weightUnit, label) => {
  return !!label?.length ? label.replace(KG_REGEX, weightUnit) : '';
};

const getBodyForHerdLevelInformationRightTable = (
  roboticMilkEvaluationBody,
  visitDetails,
) => {
  const {
    milkingSpeed,
    milkingRefusals,
    totalMilkingFailures,
    maximumConcentrate,
    averageConcentrateFed,
    minimumConcentrate,
    concentratePer100KGMilk,
    restFeed,
  } = roboticMilkEvaluationBody || {};
  const { unitOfMeasure } = visitDetails;
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);

  return {
    [getLabelAccordingToUOM(weightUnit, i18n.t('milkingSpeedLely'))]:
      convertToString(milkingSpeed),
    [i18n.t('milkingRefusalsLely')]: convertToString(milkingRefusals) || '0',
    [i18n.t('totalMilkingFailuresLely')]:
      convertToString(totalMilkingFailures) || '0',
    [getLabelAccordingToUOM(weightUnit, i18n.t('maximumConcentrate'))]:
      convertToString(maximumConcentrate) || i18n.t('numberPlaceholder'),
    [getLabelAccordingToUOM(weightUnit, i18n.t('averageConcentrateFedLely'))]:
      convertToString(averageConcentrateFed) || i18n.t('numberPlaceholder'),
    [getLabelAccordingToUOM(weightUnit, i18n.t('minimumConcentrate'))]:
      convertToString(minimumConcentrate) || i18n.t('numberPlaceholder'),
    [getLabelAccordingToUOM(weightUnit, i18n.t('concentratePer100KGMilkLely'))]:
      convertToString(concentratePer100KGMilk) || i18n.t('numberPlaceholder'),
    [i18n.t('restFeedLely')]: convertToString(restFeed) || '0',
  };
};

//End Herd level info

//Start outputs
const getBodyForOutputTable = (roboticMilkEvaluationBody, unitOfMeasure) => {
  const { cowsPerRobot, milkPerRobot, milkingFailures, milkingsPerRobot } =
    roboticMilkEvaluationBody?.outputs || {};
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  return {
    [i18n.t('amsUtilization')]: {
      [i18n.t('cowsPerRobot')]: convertToString(cowsPerRobot) || '0',
      [i18n.t('milkingsPerRobot')]: convertToString(milkingsPerRobot) || '0',
      [getLabelAccordingToUOM(weightUnit, i18n.t('milkPerRobot'))]:
        convertToString(milkPerRobot) || '0',
    },
    [i18n.t('cowEfficiency')]: {
      [i18n.t('milkingFailures')]: convertToString(milkingFailures) || '0',
    },
  };
};

//End outputs

//Start Analysis

const getBodyForAnalysisGraphBody = (
  roboticMilkEvaluationBody,
  unitOfMeasure,
) => {
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  const analysisList = getRoboticMilkAnalysis(roboticMilkEvaluationBody);
  const result = analysisList.map(analysisField => {
    return {
      ...analysisField,
      label:
        unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL
          ? getLabelInPounds(analysisField?.label, weightUnit)
          : analysisField?.label || '-',
      gaugeColors: getFormattedGaugeColors(analysisField),
      gaugeTotal: getGaugeTotal(analysisField),
      value:
        parseFloat(
          getValueForAnalysis(roboticMilkEvaluationBody, analysisField),
        ) || 0,
    };
  });
  return result;
};

const getLabelInPounds = (label, weightUnit) => {
  if (label?.length) {
    label = label?.replace(KG_REGEX, weightUnit);
    return label;
  } else {
    return '';
  }
};

const getValueForAnalysis = (roboticMilkEvaluationBody, analysisField) => {
  return roundNumber(
    roboticMilkEvaluationBody?.outputs?.[analysisField?.key] ||
      roboticMilkEvaluationBody?.[analysisField?.key],
    1,
  );
};

const getGaugeTotal = analysisField => {
  const max = analysisField?.gaugeColors?.reduce((prev, current) => {
    return prev.endAngle > current.endAngle ? prev : current;
  });
  return max?.endAngle || 1;
};

const getFormattedGaugeColors = analysisField => {
  const colorsArray = [...analysisField?.gaugeColors] || [];
  colorsArray.forEach(obj => {
    obj.hexColor = obj.color;
  });
  return colorsArray;
};

//End Analysis

//Start Graphs

const getBodyForGraphs = (
  recentVisit = [],
  roboticMilkEvaluationBody,
  unitOfMeasure,
) => {
  const sortedRecentVisits = sortRecentVisits(recentVisit);
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  const graphBody = [];
  const enumState = store.getState().enums?.enum;
  if (sortRecentVisits?.length > 0 && enumState) {
    const filteredTrends = getFilteredRoboticMilkTrends(enumState);
    filteredTrends.forEach(trend => {
      const trendObj = { categoryLabel: GRAPH_TYPES_VALUES[trend.key] };
      const tabs = getRoboticMilkGraphTabsByTrend(
        trend.key,
        roboticMilkEvaluationBody,
      );
      tabs.forEach(tab => {
        const model = roboticMilkGraphDataExportModeller(
          trend.key,
          tab,
          sortedRecentVisits,
          roboticMilkEvaluationBody,
          unitOfMeasure,
          weightUnit,
        );
        if (model?.dualYaxisGraph) {
          trendObj.dualYaxisGraph = model.dualYaxisGraph;
        }
        if (model?.singleYaxisGraph) {
          trendObj.singleYaxisGraph = model.singleYaxisGraph;
        }
      });
      graphBody.push(trendObj);
    });
  }
  return graphBody;
};

const getFilteredRoboticMilkTrends = enumState => {
  const roboticMilkTrendsListTypeEnums = enumState.roboticMilkTrendsListType;
  const filteredRoboticMilkTrendsListTypeEnums =
    roboticMilkTrendsListTypeEnums?.filter(item =>
      [
        ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.AMS_UTILIZATION,
        ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.COW_EFFICIENCY,
        ROBOTIC_MILK_TREND_TYPE_ENUM_KEYS.CONCENTRATE_DISTRIBUTION,
      ].includes(item?.key),
    );
  return filteredRoboticMilkTrendsListTypeEnums;
};
//End Graphs

// Start Offline Visit Report

export const getRoboticGraphData = ({ tool, visitDetails }) => {
  let roboticMilkEvaluationBody = getParsedToolData(
    visitDetails?.roboticMilkEvaluation,
  );

  let recentVisit = tool?.recentVisits;

  let amsUtilization = createRoboticMilkGraphData(
    recentVisit,
    AMS_UTILIZATION_GRAPH_TABS[0],
    roboticMilkEvaluationBody,
    visitDetails.unitOfMeasure,
  );
  amsUtilization.selectedResultsTab = AMS_UTILIZATION_GRAPH_TABS[0];
  let amsUtilization1 = createRoboticMilkGraphData(
    recentVisit,
    AMS_UTILIZATION_GRAPH_TABS[1],
    roboticMilkEvaluationBody,
    visitDetails.unitOfMeasure,
  );
  amsUtilization1.selectedResultsTab = AMS_UTILIZATION_GRAPH_TABS[1];

  let cowEfficiency = createRoboticMilkGraphData(
    recentVisit,
    AMS_UTILIZATION_GRAPH_TABS[2],
    roboticMilkEvaluationBody,
    visitDetails.unitOfMeasure,
  );
  cowEfficiency.selectedResultsTab = AMS_UTILIZATION_GRAPH_TABS[2];

  let cowEfficiency1 = createRoboticMilkGraphData(
    recentVisit,
    AMS_UTILIZATION_GRAPH_TABS[3],
    roboticMilkEvaluationBody,
    visitDetails.unitOfMeasure,
  );
  cowEfficiency1.selectedResultsTab = AMS_UTILIZATION_GRAPH_TABS[3];
  let concentrateDistribution = createRoboticMilkGraphData(
    recentVisit,
    AMS_UTILIZATION_GRAPH_TABS[4],
    roboticMilkEvaluationBody,
    visitDetails.unitOfMeasure,
  );
  concentrateDistribution.selectedResultsTab = AMS_UTILIZATION_GRAPH_TABS[4];
  return {
    amsUtilization,
    amsUtilization1,
    cowEfficiency,
    cowEfficiency1,
    concentrateDistribution,
    unitOfMeasure: visitDetails?.unitOfMeasure || {},
    weightUnit: getWeightUnitByMeasure(visitDetails?.unitOfMeasure || {}),
    roboticMilkState: roboticMilkEvaluationBody,
    selectedRecentVisits: recentVisit,
  };
};

export const getRoboticAnalysis = ({ visitDetails }) => {
  let roboticMilkEvaluationBody = getParsedToolData(
    visitDetails?.roboticMilkEvaluation,
  );

  const roboticMilkEvaluationData =
    roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData;

  const unitOfMeasure = visitDetails?.unitOfMeasure || {};

  //data parsing
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);

  const analysisList = getRoboticMilkAnalysis(roboticMilkEvaluationData);

  return {
    analysisList,
    weightUnit,
    unitOfMeasure,
    roboticMilkEvaluationData,
  };
};

export const compareRecentVisit = ({ tool, visitDetails, robotTypeEnums }) => {
  const weightUnit = getWeightUnitByMeasure(visitDetails.unitOfMeasure);
  let recentVisit = [...tool?.recentVisits];
  recentVisit = recentVisit?.map(x => {
    return {
      ...x,
      roboticMilkEvaluation:
        typeof x.roboticMilkEvaluation == 'string'
          ? JSON.parse(x.roboticMilkEvaluation)
          : x.roboticMilkEvaluation,
    };
  });

  let visitObj = [];
  recentVisit.forEach(x => {
    const {
      lactatingCows,
      robotFreeTime,
      averageMilkYield,
      averageBoxTime,
      milkings,
      milkingSpeed,
      milkingRefusals,
      totalMilkingFailures,
      maximumConcentrate,
      averageConcentrateFed,
      minimumConcentrate,
      concentratePer100KGMilk,
      restFeed,
      robotType,
    } = x.roboticMilkEvaluation?.visitRoboticMilkEvaluationData || {};
    const rebotTypeKey =
      robotTypeEnums.find(x => x.value == robotType)?.key || '';
    const { cowsPerRobot, milkPerRobot, milkingFailures, milkingsPerRobot } =
      x.roboticMilkEvaluation?.visitRoboticMilkEvaluationData?.outputs || {};
    visitObj.push({
      visitDate: getFormattedDate(x?.visitDate, DATE_FORMATS.MM_dd_YY),
      visitId: x.id,
      lactatingCows: {
        key: i18n.t('animalInHerd'),
        value: convertToString(lactatingCows) || '0',
      },

      averageMilkYieldLely: {
        key: getLabelAccordingToUOM(
          weightUnit,
          i18n.t('averageMilkYield' + rebotTypeKey),
        ),
        value: convertToString(averageMilkYield) || '0',
      },

      averageBoxTimeLely: {
        key: i18n.t('averageBoxTime' + rebotTypeKey),
        value: convertToString(averageBoxTime) || '0',
      },

      robotFreeTimeLely: {
        key: i18n.t('robotFreeTime' + rebotTypeKey),
        value: convertToString(robotFreeTime) || '0',
      },
      milkingsLely: {
        key: i18n.t('milkings' + rebotTypeKey),
        value: convertToString(milkings) || '0',
      },

      milkingSpeedLely: {
        key: getLabelAccordingToUOM(
          weightUnit,
          i18n.t('milkingSpeed' + rebotTypeKey),
        ),
        value: convertToString(milkingSpeed),
      },

      milkingRefusalsLely: {
        key: i18n.t('milkingRefusals' + rebotTypeKey),
        value: convertToString(milkingRefusals) || '0',
      },

      totalMilkingFailuresLely: {
        key: i18n.t('totalMilkingFailures' + rebotTypeKey),
        value: convertToString(totalMilkingFailures) || '0',
      },

      concentratePer100KGMilkLely: {
        key: getLabelAccordingToUOM(
          weightUnit,
          i18n.t('concentratePer100KGMilk' + rebotTypeKey),
        ),
        value:
          convertToString(concentratePer100KGMilk) ||
          i18n.t('numberPlaceholder'),
      },

      maximumConcentrate: {
        key: getLabelAccordingToUOM(weightUnit, i18n.t('maximumConcentrate')),
        value:
          convertToString(maximumConcentrate) || i18n.t('numberPlaceholder'),
      },
      averageConcentrateFedLely: {
        key: getLabelAccordingToUOM(
          weightUnit,
          i18n.t('averageConcentrateFed' + rebotTypeKey),
        ),
        value:
          convertToString(averageConcentrateFed) || i18n.t('numberPlaceholder'),
      },
      minimumConcentrate: {
        key: getLabelAccordingToUOM(weightUnit, i18n.t('minimumConcentrate')),
        value:
          convertToString(minimumConcentrate) || i18n.t('numberPlaceholder'),
      },
      restFeedLely: {
        key: i18n.t('restFeed' + rebotTypeKey),
        value: convertToString(restFeed) || '0',
      },

      cowsPerRobot: {
        key: i18n.t('cowsPerRobot'),
        value: roundNumber(cowsPerRobot, 2) || '0',
      },

      milkingsPerRobot: {
        key: i18n.t('milkingsPerRobot'),
        value: roundNumber(milkingsPerRobot, 2) || '0',
      },
      milkPerRobot: {
        key: getLabelAccordingToUOM(weightUnit, i18n.t('milkPerRobot')),
        value: roundNumber(milkPerRobot, 2) || '0',
      },

      milkingFailures: {
        key: i18n.t('milkingFailures'),
        value: roundNumber(milkingFailures, 2) || '0',
      },
    });
  });
  return {
    recentVisit,
    compareVisit: visitObj,
  };
};

export const getRoboticMilkBodyVisitReport = ({
  tool,
  visitDetails,
  cowFlowDesignEnums,
  robotTypeEnums,
}) => {
  let roboticMilkEvaluationBody = getParsedToolData(
    visitDetails?.roboticMilkEvaluation,
  );

  if (visitDetails?.unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    roboticMilkEvaluationBody = parseImperialRoboticMilkFormData({
      data: roboticMilkEvaluationBody,
    });
  }

  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  if (
    selectedAnalysis?.length > 0 &&
    selectedAnalysis[0].value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS &&
    roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData
  ) {
    const robotType =
      roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData.robotType;
    const rebotTypeKey =
      robotTypeEnums.find(x => x.value == robotType)?.key || '';

    //herd level info
    const herdInfoLeftTable =
      getBodyForHerdLevelInformationLeftTableVisitReport(
        roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
        visitDetails,
        cowFlowDesignEnums,
        rebotTypeKey,
      );
    body.herdLevelInformationLeftTable = herdInfoLeftTable;

    const herdInfoRightTable =
      getBodyForHerdLevelInformationRightTableVisitReport(
        roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
        visitDetails,
        rebotTypeKey,
      );
    body.herdLevelInformationRightTable = herdInfoRightTable;

    //outputs

    const outputTable = getBodyForOutputTableVisitReport(
      roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
      visitDetails?.unitOfMeasure,
      rebotTypeKey,
    );
    body.outputTable = outputTable;

    const concreteDistribuition = getConcreteDistribuitionVisitReport(
      roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
      visitDetails,
      rebotTypeKey,
    );
    body.concreteDistribuition = concreteDistribuition;

    const analysisGraphBody = getBodyForAnalysisGraphBody(
      roboticMilkEvaluationBody?.visitRoboticMilkEvaluationData,
      visitDetails?.unitOfMeasure,
    );
    if (!isEmpty(analysisGraphBody)) {
      body.analysisDialGraphs = analysisGraphBody;
    }

    //graphs
    const graphsBody = getBodyForGraphs(
      tool?.recentVisits,
      roboticMilkEvaluationBody,
      visitDetails?.unitOfMeasure,
    );

    if (!isEmpty(graphsBody)) {
      body.graphs = graphsBody;
    }
  }

  return body;
};

const getBodyForOutputTableVisitReport = (
  roboticMilkEvaluationBody,
  unitOfMeasure,
  rebotTypeKey,
) => {
  const { cowsPerRobot, milkPerRobot, milkingFailures, milkingsPerRobot } =
    roboticMilkEvaluationBody?.outputs || {};
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  return {
    [i18n.t('amsUtilization')]: {
      [i18n.t('cowsPerRobot')]: cowsPerRobot || '0',
      [i18n.t('milkingsPerRobot')]: milkingsPerRobot || '0',
      [getLabelAccordingToUOM(weightUnit, i18n.t('milkPerRobot'))]:
        milkPerRobot || '0',
    },
    [i18n.t('cowEfficiency')]: {
      [i18n.t('milkingFailures')]: milkingFailures || '0',
    },
  };
};

const getBodyForHerdLevelInformationLeftTableVisitReport = (
  roboticMilkEvaluationBody,
  visitDetails,
  cowFlowDesignEnums,
  rebotTypeKey,
) => {
  const {
    robotType,
    cowFlowDesign,
    robotsInHerd,
    lactatingCows,
    averageMilkYield,
    averageBoxTime,
  } = roboticMilkEvaluationBody || {};

  const { unitOfMeasure } = visitDetails;
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  let cowFlowDesignValue = cowFlowDesignEnums.find(
    x => x.key == cowFlowDesign,
  )?.value;

  return {
    [i18n.t('robotType')]: robotType || '',
    [i18n.t('cowFlowDesign')]: cowFlowDesignValue || '',
    [i18n.t('robotsInHerd')]: robotsInHerd || '0',
    [i18n.t('animalInHerd')]: convertToString(lactatingCows) || '0',
    [getLabelAccordingToUOM(
      weightUnit,
      i18n.t('averageMilkYield' + rebotTypeKey),
    )]: convertToString(averageMilkYield) || '0',
    [i18n.t('averageBoxTime' + rebotTypeKey)]:
      convertToString(averageBoxTime) || '0',
  };
};

const getBodyForHerdLevelInformationRightTableVisitReport = (
  roboticMilkEvaluationBody,
  visitDetails,
  rebotTypeKey,
) => {
  const {
    robotType,
    milkingSpeed,
    milkingRefusals,
    totalMilkingFailures,
    concentratePer100KGMilk,
    robotFreeTime,
    milkings,
  } = roboticMilkEvaluationBody || {};
  const { unitOfMeasure } = visitDetails;
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  return {
    [i18n.t('milkings' + rebotTypeKey)]: convertToString(milkings) || '0',
    [i18n.t('robotFreeTime' + rebotTypeKey)]:
      convertToString(robotFreeTime) || '0',

    [getLabelAccordingToUOM(weightUnit, i18n.t('milkingSpeedLely'))]:
      convertToString(milkingSpeed),
    [i18n.t('milkingRefusals' + rebotTypeKey)]:
      convertToString(milkingRefusals) || '0',
    [i18n.t('totalMilkingFailures' + rebotTypeKey)]:
      convertToString(totalMilkingFailures) || '0',

    [getLabelAccordingToUOM(
      weightUnit,
      i18n.t('concentratePer100KGMilk' + rebotTypeKey),
    )]: convertToString(concentratePer100KGMilk) || i18n.t('numberPlaceholder'),
  };
};
const getConcreteDistribuitionVisitReport = (
  roboticMilkEvaluationBody,
  visitDetails,
  rebotTypeKey,
) => {
  const {
    maximumConcentrate,
    averageConcentrateFed,
    minimumConcentrate,
    restFeed,
  } = roboticMilkEvaluationBody || {};
  const { unitOfMeasure } = visitDetails;
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);

  return {
    [i18n.t('concentrateDistribution')]: {
      [getLabelAccordingToUOM(weightUnit, i18n.t('maximumConcentrate'))]:
        convertToString(maximumConcentrate) || i18n.t('numberPlaceholder'),
      [getLabelAccordingToUOM(
        weightUnit,
        i18n.t('averageConcentrateFed' + rebotTypeKey),
      )]: convertToString(averageConcentrateFed) || i18n.t('numberPlaceholder'),
      [getLabelAccordingToUOM(weightUnit, i18n.t('minimumConcentrate'))]:
        convertToString(minimumConcentrate) || i18n.t('numberPlaceholder'),
      [i18n.t('restFeed' + rebotTypeKey)]: convertToString(restFeed) || '0',
    },
  };
};
