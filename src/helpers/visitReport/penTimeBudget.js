//constants
import {
  DATE_FORMATS,
  TOOL_ANALYSIS_TYPES,
  VISIT_TABLE_FIELDS,
} from '../../constants/AppConstants';

//helpers
import {
  convertArrayOfObjValuesToNumber,
  convertNumberToString,
} from '../alphaNumericHelper';
import { getParsedToolData, isEmpty } from '../genericHelper';
import {
  getFormattedPenTimeBudgetRecentVisits,
  getSummaryData,
  getTimeRequiredGraphData,
  parseExportPotentialMilkLoss,
  parseExportTimeAvailableForResting,
  parsePenTimeBudgetData,
  parsePenTimeBudgetSummaryData,
} from '../penTimeBudgetHelper';
import { sortRecentVisitsForGraph } from '../toolHelper';
import {
  getSelectedAnalysisCategories,
  createDynamicObjForReqBody,
  filterPensBySelection,
  sortRecentVisits,
  getRecentVisitPen,
  getRecentVisitToolData,
} from './visitReportHelper';

//localization
import i18n from '../../localization/i18n';
import { getFormattedDate } from '../dateHelper';
import { addSpace } from '../genericHelper';

export const getPenTimeBudgetBody = ({ tool, visitDetails, sitePens }) => {
  const penTimeBudgetData = getParsedToolData(visitDetails?.penTimeBudgetTool);
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  selectedAnalysis.forEach(analysis => {
    if (
      analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      penTimeBudgetData?.pens?.length > 0
    ) {
      const penAnalysisData = handlePenSelection(
        tool,
        penTimeBudgetData,
        sitePens,
        visitDetails?.unitOfMeasure,
      );

      if (!isEmpty(penAnalysisData)) {
        body.penAnalysis = penAnalysisData;
      }
    }
  });
  return body;
};

/** Start Pen Selection */
const handlePenSelection = (
  tool,
  penTimeBudgetData,
  sitePens,
  unitOfMeasure,
) => {
  const pensList = filterPensBySelection(
    tool,
    penTimeBudgetData?.pens,
    sitePens,
  );
  const formattedRecentVisits = getFormattedPenTimeBudgetRecentVisits(
    tool?.recentVisits,
  );
  const sortedRecentVisits = sortRecentVisitsForGraph(formattedRecentVisits);

  const penDetails = pensList?.map(pen => {
    return {
      penName: pen.penName,
      penDetails: getPenBody(pen),
      penBody: getPenDetailsBodyByVisit(pen, tool?.recentVisits, unitOfMeasure),
      timeAvailableForRestingGraph: getBodyForTimeAvailableGraph(
        pen,
        sortedRecentVisits,
        unitOfMeasure,
      ),
      potentialMilkLossGainGraph: getBodyForPotentialMilkLoss(
        pen,
        sortedRecentVisits,
        unitOfMeasure,
      ),
    };
  });
  return penDetails;
};

/** Start Pen details */
const getPenBody = pen => {
  return [
    createDynamicObjForReqBody(
      i18n.t('animalsInPen'),
      convertNumberToString(pen?.animals, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('number_of_stalls'),
      convertNumberToString(pen?.stallsInPen, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('walkingTimeToParlor'),
      convertNumberToString(pen?.walkingTimeToParlor, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('timeInParlor'),
      convertNumberToString(pen?.timeInParlor, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('walkingTimeFromParlors'),
      convertNumberToString(pen?.walkingTimeFromParlor, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('milkingFrequency'),
      convertNumberToString(pen?.milkingFrequency, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('totalStallsInParlor'),
      convertNumberToString(pen?.stallsInParlor, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('timeInLockUp'),
      convertNumberToString(pen?.timeInLockUp, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('otherNonRestTime'),
      convertNumberToString(pen?.otherNonRestTime, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('restingRequirements'),
      convertNumberToString(pen?.restingRequirement, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('eatingTime'),
      convertNumberToString(pen?.eatingTime, true) || '0',
    ),
    createDynamicObjForReqBody(
      i18n.t('drinkingGroomingTime'),
      convertNumberToString(pen?.drinkingGroomingTime, true) || '0',
    ),
  ];
};

const getPenDetailsBodyByVisit = (pen, recentVisits, unitOfMeasure) => {
  if (recentVisits?.length > 0) {
    const sortedRecentVisit = sortRecentVisits(recentVisits);

    let visitDates = [];
    let animalsInPen = [];
    let animalsMilkedPerHour = [];
    let bodyConditionScoreChange = [];
    let bodyWeightChange = [];
    let energyChange = [];
    let overCrowding = [];
    let parlorTurnsPerHour = [];
    let potentialMilkLossGain = [];
    let restingDifference = [];
    let timePerMilking = [];
    let timeRemainingForResting = [];
    let timeRequiredForResting = [];
    let totalNonRestingTime = [];
    let totalTimeMilking = [];
    let walkingToFindStall = [];
    let chartData = [];

    sortedRecentVisit.forEach((visit, index) => {
      const parsedPenTimeData = getRecentVisitToolData(
        visit,
        VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL,
      );

      if (parsedPenTimeData) {
        const foundPen = getRecentVisitPen(parsedPenTimeData?.pens, pen);
        if (foundPen) {
          visitDates.push(
            getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
              addSpace(index),
          );

          let data = getSummaryData(visit, foundPen, unitOfMeasure);
          data.visitDate = getFormattedDate(
            visit?.visitDate,
            DATE_FORMATS.MM_dd,
          );

          animalsInPen.push(data.animalsInPen || '-');
          animalsMilkedPerHour.push(data.animalsMilkedPerHour || '-');
          bodyConditionScoreChange.push(data.bodyConditionScoreChange || '-');
          bodyWeightChange.push(data.bodyWeightChange || '-');
          energyChange.push(data.energyChange || '-');
          overCrowding.push(data.overCrowding || '-');
          parlorTurnsPerHour.push(data.parlorTurnsPerHour || '-');
          potentialMilkLossGain.push(data.potentialMilkLossGain || '-');
          restingDifference.push(data.restingDifference || '-');
          timePerMilking.push(data.timePerMilking || '-');
          timeRemainingForResting.push(data.timeRemainingForResting || '-');
          timeRequiredForResting.push(data.timeRequiredForResting || '-');
          totalNonRestingTime.push(data.totalNonRestingTime || '-');
          totalTimeMilking.push(data.totalTimeMilking || '-');
          walkingToFindStall.push(data.walkingToFindStall || '-');

          chartData.push(data);
        }
      }
    });

    return {
      visitDates,
      animalsInPen,
      animalsMilkedPerHour,
      bodyConditionScoreChange,
      bodyWeightChange,
      energyChange,
      overCrowding,
      parlorTurnsPerHour,
      potentialMilkLossGain,
      restingDifference,
      timePerMilking,
      timeRemainingForResting,
      timeRequiredForResting,
      totalNonRestingTime,
      totalTimeMilking,
      walkingToFindStall,
      chartData,
    };
  }
  return {};
};

/** End Pen details */

/** Start Graph details */
const getBodyForTimeAvailableGraph = (pen, sortedRecentVisits, uom) => {
  const penObj = parsePenTimeBudgetData(pen);
  const graphData = getTimeRequiredGraphData(sortedRecentVisits, penObj, uom);
  const model = parseExportTimeAvailableForResting(null, graphData);
  return {
    timeRequired: model.timeRequired,
    timeRemaining: model.timeRemaining,
  };
};

const getBodyForPotentialMilkLoss = (pen, sortedRecentVisits, uom) => {
  const penObj = parsePenTimeBudgetData(pen);
  const graphData = getTimeRequiredGraphData(sortedRecentVisits, penObj, uom);
  const model = parseExportPotentialMilkLoss(null, graphData, uom);
  return {
    label: model?.Label || '',
    dataPoints: convertArrayOfObjValuesToNumber(model?.DataPoints) || null,
  };
};
/** End Graph details */

/** End Pen Selection */

export const mapDataToVictoryChart = (chartData = []) => {
  if (chartData?.length > 0) {
    const data = chartData?.map(item => ({
      x: item.visitDate,
      y: item.categoryAverage,
    }));

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
    };

    return [graphObject];
  }
  return {};
};
