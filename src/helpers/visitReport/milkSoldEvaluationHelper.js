//constants
import {
  TOOL_ANALYSIS_TYPES,
  UNIT_OF_MEASURE,
} from '../../constants/AppConstants';
import { MILK_SOLD_GRAPH_COMPARISON } from '../../constants/toolsConstants/MilkSoldEvaluationConstants';

//helpers
import { isEmpty } from '../genericHelper';

//localization
import i18n from '../../localization/i18n';

//store
import store from '../../store';

//helpers
import {
  createMilkSolidEvaluationFromValues,
  getOutputData,
  getSetGraphValue,
  renderMilkUreaLabel,
} from '../milkSolidHelper';
import {
  createDynamicObjForReqBody,
  getSelectedAnalysisCategories,
  sortRecentVisits,
} from './visitReportHelper';
import {
  convertWeightToImperial,
  getCurrencyForTools,
  getWeightUnitByMeasure,
} from '../appSettingsHelper';
import { stringIsEmpty } from '../alphaNumericHelper';

export const getMilkSoldEvaluationBody = ({ tool, visitDetails }) => {
  const userData = store.getState().userPreferences?.userPreferences;
  const milkSoldEvaluationString = visitDetails?.milkSoldEvaluation;
  const visitData = milkSoldEvaluationString
    ? JSON.parse(milkSoldEvaluationString)
    : null;
  const milkSoldEvaluationData = createMilkSolidEvaluationFromValues(
    visitDetails,
    visitData,
    userData,
    visitDetails?.visitStatus,
    visitDetails?.unitOfMeasure,
    // true,
  );
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  const { currencies = [], milkPickup } = store.getState()?.enums?.enum;
  const currencySymbol = getCurrencyForTools(
    currencies,
    visitDetails?.selectedCurrency,
  );
  const weightUnit = getWeightUnitByMeasure(visitDetails?.unitOfMeasure);
  if (
    selectedAnalysis?.length > 0 &&
    selectedAnalysis[0].value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS &&
    milkSoldEvaluationData
  ) {
    const herdInfoLeftTable = getBodyForHerdLevelInformationLeftTable(
      milkSoldEvaluationData,
      visitDetails.unitOfMeasure,
      currencySymbol,
      milkPickup,
    );
    body.herdLevelInformationLeftTable = herdInfoLeftTable;

    const herdInfoRightTable = getBodyForHerdLevelInformationRightTable(
      milkSoldEvaluationData,
      visitDetails.unitOfMeasure,
      currencySymbol,
    );
    body.herdLevelInformationRightTable = herdInfoRightTable;

    const outputs = getOutputData(
      milkSoldEvaluationData,
      visitDetails,
      weightUnit,
      visitDetails?.unitOfMeasure,
      visitDetails?.visitStatus,
    );
    const outputLeftTable = getBodyForOutputLeftTable(outputs);
    body.outputLeftTable = outputLeftTable;

    const outputRightTable = getBodyForOutputRightTable(outputs);
    body.outputRightTable = outputRightTable;

    const milkProcessorInfo = getBodyForMilkProcessorInfo(
      milkSoldEvaluationData,
      visitDetails.unitOfMeasure,
    );
    if (!isEmpty(milkProcessorInfo)) {
      body.milkProcessorInformation = milkProcessorInfo;
    }

    const graphsBody = getBodyForGraphs({
      milkSoldEvaluationData,
      userData,
      visitDetails,
      recentVisits: tool?.recentVisits,
      weightUnit: weightUnit,
    });

    if (!isEmpty(graphsBody)) {
      body.graphs = graphsBody;
    }
  }
  return body;
};

const getBodyForHerdLevelInformationLeftTable = (
  milkSoldEvaluationData,
  unitOfMeasure,
  currency,
  milkPickupEnum,
) => {
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  const {
    currentMilkPrice,
    lactatingAnimal,
    animalsInTank,
    dryMatterIntake,
    milkPickup,
  } = milkSoldEvaluationData || {};

  const milkPickupLabel = milkPickupEnum.filter(e => e.key == milkPickup);

  return {
    [`${i18n.t('currentMilkPrice')} (${currency}/${weightUnit})`]:
      currentMilkPrice?.toString() || '0',
    [i18n.t('lactatingAnimals')]: lactatingAnimal?.toString() || '0',
    [i18n.t('animalsInTank')]: animalsInTank?.toString() || '0',
    [i18n.t('milkPickUp')]:
      (milkPickupLabel && milkPickupLabel.length > 0
        ? milkPickupLabel[0].value
        : milkPickup?.toString()) || '',
    [`${i18n.t('dryMatterIntake(Kg)')} (${weightUnit})`]:
      dryMatterIntake?.toString() || '0',
  };
};

const getBodyForHerdLevelInformationRightTable = (
  milkSoldEvaluationData,
  unitOfMeasure,
  currency,
) => {
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  const {
    daysInMilk,
    milkUreaMeasure,
    asFedIntake,
    netEnergyOfLactationDairy,
    rationCost,
  } = milkSoldEvaluationData || {};
  return {
    [i18n.t('daysInMilk')]: daysInMilk?.toString() || '0',
    [i18n.t('milkUreaMeasure')]:
      renderMilkUreaLabel(milkUreaMeasure)?.toString() || '',
    [`${i18n.t('asFedIntake')} (${weightUnit})`]:
      asFedIntake?.toString() || '0',
    [`${i18n.t('NELDairy(Kg)')} (Mcal/${weightUnit})`]:
      netEnergyOfLactationDairy?.toString() || '0',
    [`${i18n.t('rationCostPerAnimal')} (${currency})`]:
      rationCost?.toString() || '0',
  };
};

const getBodyForOutputLeftTable = outputs => {
  const midIndex = Math.floor(outputs.length / 2);
  const halfArray = outputs.slice(0, midIndex);
  const leftTable = halfArray.reduce(
    (obj, item) => Object.assign(obj, { [item.label]: item.value }),
    {},
  );
  return leftTable;
};

const getBodyForOutputRightTable = outputs => {
  const midIndex = Math.floor(outputs.length / 2);
  const halfArray = outputs.slice(midIndex);
  const rightTable = halfArray.reduce(
    (obj, item) => Object.assign(obj, { [item.label]: item.value }),
    {},
  );
  return rightTable;
};

const getBodyForMilkProcessorInfo = (milkSoldEvaluationData, unitOfMeasure) => {
  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);
  const milkProcessInfoArray = milkSoldEvaluationData?.pickups || [];
  const data = milkProcessInfoArray.map((info, index) => {
    const {
      milkSold,
      animalsInTank,
      daysInTank,
      milkFatPer,
      milkProteinPer,
      nonFatSolid,
      mun,
      somaticCellCount,
      bacteriaCellCount,
      mastitis,
    } = info || {};

    const milkUreaMeasureKey =
      milkSoldEvaluationData?.milkUreaMeasure === 'MilkUrea'
        ? 'MilkUrea(mg/dL)'
        : 'MUN(mg/dL)';

    return {
      [`${i18n.t('pickup')} ${index + 1}`]: [
        createDynamicObjForReqBody(
          `${i18n.t('milkSolid(kg)')} (${weightUnit})`,
          !stringIsEmpty(milkSold)
            ? unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
              ? convertWeightToImperial(milkSold, 2)
              : milkSold
            : '',
        ),
        createDynamicObjForReqBody(
          i18n.t('animalsInTank'),
          animalsInTank?.toString() || '0',
        ),
        createDynamicObjForReqBody(
          i18n.t('daysInTank'),
          daysInTank?.toString() || '0',
        ),
        createDynamicObjForReqBody(
          `${i18n.t('milkFat')} ${i18n.t('%')}`,
          milkFatPer?.toString() || '-',
        ),
        createDynamicObjForReqBody(
          `${i18n.t('milkProtein')} ${i18n.t('%')}`,
          milkProteinPer?.toString() || '-',
        ),
        createDynamicObjForReqBody(
          i18n.t('nonFatSolid'),
          nonFatSolid?.toString() || '0',
        ),
        createDynamicObjForReqBody(
          i18n.t(milkUreaMeasureKey),
          mun?.toString() || '0',
        ),
        createDynamicObjForReqBody(
          i18n.t('somaticCellCount'),
          somaticCellCount?.toString() || '0',
        ),
        createDynamicObjForReqBody(
          i18n.t('bacteriaCellCount'),
          bacteriaCellCount?.toString() || '0',
        ),
        createDynamicObjForReqBody(
          i18n.t('mastitis'),
          mastitis?.toString() || '0',
        ),
      ],
    };
  });
  return data;
};

const getBodyForGraphs = ({
  milkSoldEvaluationData,
  userData,
  visitDetails,
  recentVisits,
  weightUnit,
}) => {
  const data = MILK_SOLD_GRAPH_COMPARISON(
    milkSoldEvaluationData.milkUreaMeasure,
    weightUnit,
  );
  const recentVisitsData = getRecentVisitsToolData(
    recentVisits,
    userData,
    visitDetails,
  );
  const graphsData = data.map(item => {
    const dataPointsArray = getSetGraphValue(recentVisitsData, item, true);
    return {
      chartType: item.graphType,
      dataPoints: formatDatPointsArray(dataPointsArray) || [],
      yaxisLeftLabel: item.label1,
      yaxisRightLabel: item.label2,
    };
  });
  return graphsData;
};

const formatDatPointsArray = (dataPointsArray = []) => {
  let mappedArray = [];
  dataPointsArray.map(item => {
    if (item?.prop1 !== null || item?.prop2 !== null) {
      mappedArray.push({
        visitDate: item?.date,
        yaxisRight: Number(item?.prop2) || null,
        yaxisLeft: Number(item?.prop1) || null,
      });
    }
  });
  return mappedArray;
};

const getRecentVisitsToolData = (recentVisits, userData, visitDetails) => {
  const sortedVisits = sortRecentVisits(recentVisits);
  const recentVisitsData = sortedVisits.map(visit => {
    const recentVisitMilkSoldData = visit?.milkSoldEvaluation
      ? JSON.parse(visit?.milkSoldEvaluation)
      : null;
    const milkSoldEvaluationData = createMilkSolidEvaluationFromValues(
      visitDetails,
      recentVisitMilkSoldData,
      userData,
      visit?.visitStatus,
      visit.unitOfMeasure,
      true,
    );
    return {
      date: visit?.visitDate || '',
      outputs: milkSoldEvaluationData.outputs,
      data: milkSoldEvaluationData || null,
    };
  });
  return recentVisitsData;
};
