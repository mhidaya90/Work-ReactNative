//constants
import {
  METABOLIC_INCIDENCE_CASES,
  TOOL_ANALYSIS_TYPES,
  UNIT_OF_MEASURE,
} from '../../constants/AppConstants';

//localization
import i18n from '../../localization/i18n';

//store
import store from '../../store';

//helpers
import { getParsedToolData, isEmpty } from '../genericHelper';
import {
  formatVisitsForDisorderGraph,
  getAnnualImpactSummaryVisitReport,
  getDefaultGoalValues,
  getFormattedRecentVisits,
  getMetabolicIncidenceGraphGoal,
  getMetabolicIncidenceGraphIncidencePercent,
  getTotalAnnualImpactSummaryVisitReport,
  mapDataForIncidencePercentExport,
  mapDataForMetabolicDisorderExport,
  populateMetabolicIncidenceData,
} from '../metabolicIncidenceHelper';
import { sortRecentVisitsForGraph } from '../toolHelper';
import {
  createDynamicObjForReqBody,
  getSelectedAnalysisCategories,
} from './visitReportHelper';
import {
  convertDenominatorWeightToImperial,
  convertWeightToImperial,
  getCurrencyForTools,
  getWeightUnitByMeasure,
} from '../appSettingsHelper';

export const getMetabolicIncidenceBody = ({ tool, visitDetails }) => {
  const metabolicIncidenceBody = getParsedToolData(
    visitDetails?.metabolicIncidence,
  );
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  const { currencies = [] } = store.getState()?.enums?.enum;
  const currencySymbol = getCurrencyForTools(
    currencies,
    visitDetails?.selectedCurrency,
  );

  if (
    selectedAnalysis?.length > 0 &&
    selectedAnalysis[0].value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS &&
    metabolicIncidenceBody?.visitMetabolicIncidenceData
  ) {
    /** Start Herd */
    const herdInfoLeftTable = getBodyForHerdLevelInformationLeftTable(
      metabolicIncidenceBody?.visitMetabolicIncidenceData,
      visitDetails?.unitOfMeasure,
      currencySymbol,
    );
    body.herdLevelInformationLeftTable = herdInfoLeftTable;

    const herdInfoRightTable = getBodyForHerdLevelInformationRightTable(
      metabolicIncidenceBody?.visitMetabolicIncidenceData,
      currencySymbol,
    );
    body.herdLevelInformationRightTable = herdInfoRightTable;
    /**End Herd */

    /** Start Metabolic Cases */
    const metabolicIncidenceCaseLeftTable = getBodyForMetabolicCaseLeftTable(
      metabolicIncidenceBody?.visitMetabolicIncidenceData,
    );
    body.metabolicIncidenceCasesLeftTable = metabolicIncidenceCaseLeftTable;

    const metabolicIncidenceCaseRightTable = getBodyForMetabolicCaseRightTable(
      metabolicIncidenceBody?.visitMetabolicIncidenceData,
    );
    body.metabolicIncidenceCasesRightTable = metabolicIncidenceCaseRightTable;
    /** End Metabolic Cases */

    /**Start Performance and Treatment Cost */
    const metabolicPerformanceTreatmentCostTable =
      getBodyForPerformanceCostingTable(
        metabolicIncidenceBody?.visitMetabolicIncidenceData,
        visitDetails?.unitOfMeasure,
        currencySymbol,
      );
    body.performanceAndTreatmentCost = metabolicPerformanceTreatmentCostTable;
    /** End Performance and Treatment Cost */

    /**Start Graphs */
    const graphsBody = getBodyForGraphs(
      tool?.recentVisits,
      metabolicIncidenceBody,
    );
    if (!isEmpty(graphsBody)) {
      body.graph = graphsBody;
    }
    /**End Graphs */
  }
  return body;
};

/** Start Herd */
const getBodyForHerdLevelInformationLeftTable = (
  metabolicIncidenceData,
  unitOfMeasure,
  currency,
) => {
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  const { totalFreshCowsPerYear, milkPrice } = metabolicIncidenceData || {};
  return {
    [i18n.t('totalFreshCowsPerYear')]: totalFreshCowsPerYear || '0',
    [`${i18n.t('milkPrice')} (${currency}/${weightUnit})`]: getMilkPrice(
      milkPrice,
      unitOfMeasure,
    ),
  };
};

const getMilkPrice = (milkPrice, unitOfMeasure) => {
  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    return (
      convertDenominatorWeightToImperial(milkPrice, 3) ||
      i18n.t('numberPlaceholder')
    );
  } else {
    return milkPrice || i18n.t('numberPlaceholder');
  }
};

const getBodyForHerdLevelInformationRightTable = (
  metabolicIncidenceData,
  currency,
) => {
  const { replacementCowCost, costOfExtraDaysOpen } =
    metabolicIncidenceData || {};
  return {
    [`${i18n.t('replacementCowCost')} (${currency})`]:
      replacementCowCost || i18n.t('decimalNumberPlaceholder'),
    [`${i18n.t('costOfExtraDaysOpen')} (${currency})`]:
      costOfExtraDaysOpen || i18n.t('decimalNumberPlaceholder'),
  };
};

/**End Herd */

/** Start Metabolic Cases */
const getBodyForMetabolicCaseLeftTable = metabolicIncidenceData => {
  const {
    totalFreshCowsForEvaluation,
    retainedPlacentaIncidence,
    metritisIncidence,
    displacedAbomasumIncidence,
  } = metabolicIncidenceData || {};
  return {
    [i18n.t('totalFreshCowsEvaluation')]: totalFreshCowsForEvaluation || '0',
    [i18n.t('retainedPlacenta')]: retainedPlacentaIncidence || '0',
    [i18n.t('metritis')]: metritisIncidence || '0',
    [i18n.t('displacedAbomasum')]: displacedAbomasumIncidence || '0',
  };
};

const getBodyForMetabolicCaseRightTable = metabolicIncidenceData => {
  const {
    ketosisIncidence,
    milkFeverIncidence,
    dystociaIncidence,
    deathLossIncidence,
  } = metabolicIncidenceData || {};
  return {
    [i18n.t('ketosis')]: ketosisIncidence || '0',
    [i18n.t('milkFever')]: milkFeverIncidence || '0',
    [i18n.t('dystocia')]: dystociaIncidence || '0',
    [i18n.t('deathLoss')]: deathLossIncidence || '0',
  };
};
/** End Metabolic Cases */

/** Start Performance and Treatment Cost */
const getBodyForPerformanceCostingTable = (
  metabolicIncidenceData,
  unitOfMeasure,
  currency,
) => {
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  const performanceCostingBody = METABOLIC_INCIDENCE_CASES.map(item => {
    return [
      createDynamicObjForReqBody(i18n.t('cases'), item?.title),
      createDynamicObjForReqBody(
        `${i18n.t('milkPerCow')} (${weightUnit})`,
        getWeightValue(
          unitOfMeasure,
          metabolicIncidenceData[`${item.dbKey}Weight`],
        ),
      ),
      createDynamicObjForReqBody(
        i18n.t('daysOpen'),
        metabolicIncidenceData[`${item.dbKey}DaysOpen`],
      ),
      createDynamicObjForReqBody(
        `${i18n.t('treatmentDefault')} (${currency})`,
        metabolicIncidenceData[`${item.dbKey}Cost`],
      ),
    ];
  });
  return performanceCostingBody;
};

const getWeightValue = (unit, value) => {
  if (unit === UNIT_OF_MEASURE.IMPERIAL) {
    return convertWeightToImperial(value, 2);
  } else {
    return value;
  }
};
/** End Performance and Treatment Cost */

/**Start Graphs */
const getBodyForGraphs = (recentVisits, metabolicIncidence) => {
  const metabolicIncidenceData = getPercentageGraphData(metabolicIncidence);
  const metabolicDisorderCostData = getDisorderDataForGraphs(recentVisits);
  if (isEmpty(metabolicIncidence)) {
    return {};
  }
  return {
    graphType: 'BOTH',
    incidencePercentage: metabolicIncidenceData.incidencePercentage,
    goalPercentage: metabolicIncidenceData.goalPercentage,
    metabolicDisorderCostPerCow: isEmpty(metabolicDisorderCostData)
      ? null
      : metabolicDisorderCostData.metabolicDisorderCostPerCow,
    metabolicDisorderCostPerCowLabel: isEmpty(metabolicDisorderCostData)
      ? null
      : metabolicDisorderCostData.metabolicDisorderCostPerCowLabel,
  };
};

const getPercentageGraphData = metabolicIncidence => {
  const metabolicIncidenceData =
    metabolicIncidence?.visitMetabolicIncidenceData;
  const goalsData =
    metabolicIncidenceData?.outputs && !isEmpty(metabolicIncidenceData?.outputs)
      ? metabolicIncidenceData?.outputs
      : getDefaultGoalValues();
  const formatMetabolicData =
    populateMetabolicIncidenceData(metabolicIncidence);
  const model = mapDataForIncidencePercentExport(
    null,
    getMetabolicIncidenceGraphIncidencePercent(formatMetabolicData, false),
    getMetabolicIncidenceGraphGoal(goalsData),
  );
  return {
    incidencePercentage: model?.incidencePercentage,
    goalPercentage: model?.goalPercentage,
  };
};

const getDisorderDataForGraphs = recentVisits => {
  const formattedRecentVisits = getFormattedRecentVisits(recentVisits);
  const metabolicSortedDisorderVisits = sortRecentVisitsForGraph(
    formattedRecentVisits,
  );
  /**
   * TODO: Make currency dynamic when app setting feature will get completed
   */
  if (isEmpty(metabolicSortedDisorderVisits)) {
    return {};
  }
  const currency = '$';
  const model = mapDataForMetabolicDisorderExport(
    null,
    metabolicSortedDisorderVisits,
    null,
    `${i18n.t('metabolicDisorderCostPerCow')} (${currency})`,
  );
  return {
    metabolicDisorderCostPerCow: model.metabolicDisorderCostPerCow,
    metabolicDisorderCostPerCowLabel: model.metabolicDisorderCostPerCowLabel,
  };
};
/**End Graphs */

export const getMetabolicIncidenceBodyVisitReport = ({
  tool,
  visitDetails,
}) => {
  const metabolicIncidenceBody = getParsedToolData(
    visitDetails?.metabolicIncidence,
  );
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  const { currencies = [] } = store.getState()?.enums?.enum;
  const currencySymbol = getCurrencyForTools(
    currencies,
    visitDetails?.selectedCurrency,
  );

  let goalsData = {};
  let milkPrice =
    metabolicIncidenceBody?.visitMetabolicIncidenceData?.milkPrice;
  if (metabolicIncidenceBody?.visitMetabolicIncidenceData?.outputs) {
    goalsData = metabolicIncidenceBody?.visitMetabolicIncidenceData?.outputs;
  } else {
    goalsData = getDefaultGoalValues();
  }
  let data = metabolicIncidenceBody?.visitMetabolicIncidenceData;
  let toolData = {
    costOfExtraDaysOpen: data?.costOfExtraDaysOpen,
    deathLoss: data?.deathLossIncidence,
    deathLossDaysOpen: data?.deathLossDaysOpen,
    deathLossMilkPerCow: data?.deathLossWeight,
    deathLossTreatmentDefault: data?.deathLossCost,

    displacedAbomasum: data?.displacedAbomasumIncidence,
    displacedAbomasumDaysOpen: data?.displacedAbomasumDaysOpen,
    displacedAbomasumMilkPerCow: data?.displacedAbomasumWeight,
    displacedAbomasumTreatmentDefault: data?.displacedAbomasumCost,

    dystocia: data?.dystociaIncidence,
    dystociaDaysOpen: data?.dystociaDaysOpen,
    dystociaMilkPerCow: data?.dystociaWeight,
    dystociaTreatmentDefault: data?.dystociaCost,

    ketosis: data?.ketosisIncidence,
    ketosisDaysOpen: data?.ketosisDaysOpen,
    ketosisMilkPerCow: data?.ketosisWeight,
    ketosisTreatmentDefault: data?.ketosisCost,

    metritis: data?.metritisIncidence,
    metritisDaysOpen: data?.metritisDaysOpen,
    metritisMilkPerCow: data?.metritisWeight,
    metritisTreatmentDefault: data?.metritisCost,

    milkFever: data?.milkFeverIncidence,
    milkFeverDaysOpen: data?.milkFeverDaysOpen,
    milkFeverMilkPerCow: data?.milkFeverWeight,
    milkFeverTreatmentDefault: data?.milkFeverCost,

    milkPrice: data?.milkPrice,
    replacementCowCost: data?.replacementCowCost,

    retainedPlacenta: data?.retainedPlacentaIncidence,
    retainedPlacentaDaysOpen: data?.retainedPlacentaDaysOpen,
    retainedPlacentaMilkPerCow: data?.retainedPlacentaWeight,
    retainedPlacentaTreatmentDefault: data?.retainedPlacentaCost,

    totalFreshCowsEvaluation: data?.totalFreshCowsForEvaluation,
    totalFreshCowsPerYear: data?.totalFreshCowsPerYear,
  };

  const annualImpactSummaryData = getAnnualImpactSummaryVisitReport(
    toolData,
    goalsData,
    milkPrice,
    currencySymbol,
  );

  const annualTotalImpactSummaryData = getTotalAnnualImpactSummaryVisitReport(
    toolData,
    goalsData,
    milkPrice,
    currencySymbol,
  );

  let recentVisit = tool?.recentVisits?.map(x => {
    return {
      date: x.visitDate,
      goalsData: JSON.parse(x.metabolicIncidence)?.visitMetabolicIncidenceData
        ?.outputs
        ? JSON.parse(x.metabolicIncidence)?.visitMetabolicIncidenceData?.outputs
        : getDefaultGoalValues(),
      toolData: JSON.parse(x.metabolicIncidence)?.visitMetabolicIncidenceData,
      visitId: x?.id,
    };
  });
  let selectedVisits = tool?.recentVisits?.map(x => x.id);
  const selectedRecentVisits = formatVisitsForDisorderGraph(
    visitDetails,
    toolData,
    goalsData,
    recentVisit,
    selectedVisits,
  );

  return {
    annualImpactSummaryData,
    annualTotalImpactSummaryData,
    currencySymbol,

    goalsData,
    toolData: toolData,
    selectedRecentVisits: selectedRecentVisits,
  };
};
