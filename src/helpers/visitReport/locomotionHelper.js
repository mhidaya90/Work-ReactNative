//Constants
import {
  DATE_FORMATS,
  LOCOMOTION_CATEGORY_LIST,
  TOOL_ANALYSIS_TYPES,
  VISIT_TABLE_FIELDS,
} from '../../constants/AppConstants';

//localization
import i18n from '../../localization/i18n';

//helpers
import { getFormattedDate } from '../dateHelper';
import { isEmpty } from '../genericHelper';
import {
  animalInPerPen,
  calculateRevenueLossDay,
  calculateRevenueLossYear,
  getCalculateHerdAverage,
  getCalculateHerdAvgLocomotionScore,
  getCalculateMilkLoss,
  getCalculateTotalAnimals,
  getCategoryWiseAnimalObserved,
  getLocomotionAvg,
  getLocomotionStdDeviation,
  getRecentVisitCategoriesBody,
  mapGraphDataForHerdAnalysisExport,
  pensInPercent,
  setHerdGraphData,
} from '../locomotionHelper';
import { addSpace } from '../genericHelper';
import { getAnimalAnalysisBody } from './animalHelper';
import {
  createDynamicObjForReqBody,
  filterPensBySelection,
  findFromSitePensById,
  getRecentVisitPen,
  getRecentVisitToolData,
  getSelectedAnalysisCategories,
  sortRecentVisits,
} from './visitReportHelper';

export const getLocomotionScoreBody = ({
  tool,
  visitDetails,
  sitePens,
  earTags,
}) => {
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

  const locomotionScoreString = visitDetails?.locomotionScore;
  const locomotionScoreData = locomotionScoreString
    ? JSON.parse(locomotionScoreString)
    : null;

  if (!locomotionScoreData) {
    return body;
  }

  if (locomotionScoreData?.selectedPointScale) {
    body.bcsPointScale = locomotionScoreData?.selectedPointScale || '';
  }

  selectedAnalysis.forEach(analysis => {
    if (
      analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      locomotionScoreData?.pens?.length > 0
    ) {
      const penAnalysisData = handlePenAnalysisSelection({
        tool,
        locomotionScoreData,
        sitePens,
      });

      if (!isEmpty(penAnalysisData)) {
        body.penAnalysis = penAnalysisData;
      }
    } else if (
      analysis.value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS
    ) {
      let herdData = locomotionScoreData?.herd;
      if (!herdData && locomotionScoreData?.pens?.length > 0) {
        const herdCategories = LOCOMOTION_CATEGORY_LIST.map(v => ({
          category: v.category,
          herdGoal: v.herdGoal,
          lossCow: v.lossCow,
        }));

        herdData = {
          categories: herdCategories,
          pensForVisit: locomotionScoreData?.pens,
          daysInMilk: visitDetails?.daysInMilk,
          totalAnimalsInHerd: visitDetails?.lactatingAnimal,
          milkProductionInKg: visitDetails?.milk,
          milkPriceAtSiteLevel: visitDetails?.currentMilkPrice,
        };
      }

      if (herdData) {
        const herdAnalysisData = handleHerdAnalysisSelection({
          locomotionScoreData: { ...locomotionScoreData, herd: herdData },
          visitDetails,
        });

        if (!isEmpty(herdAnalysisData)) {
          body.herdAnalysis = herdAnalysisData;
        }
      }
    }
    // else if (
    //   analysis.value === TOOL_ANALYSIS_TYPES.ANIMAL_ANALYSIS &&
    //   visitDetails?.animalAnalysis
    // ) {
    //   let animalAnalysis = getAnimalAnalysisBody(
    //     tool,
    //     visitDetails,
    //     sitePens,
    //     earTags,
    //   );
    //   if (!isEmpty(animalAnalysis)) {
    //     body.animalAnalysis = animalAnalysis;
    //   }
    // }
  });
  return body;
};

/** Start Pen Analysis */

const handlePenAnalysisSelection = ({
  tool,
  locomotionScoreData,
  sitePens,
}) => {
  const pensList = filterPensBySelection(
    tool,
    locomotionScoreData?.pens,
    sitePens,
  );
  const penAnalysisArray = [];
  pensList.forEach(pen => {
    const sitePen = findFromSitePensById(sitePens, pen);
    if (pen) {
      const std = getLocomotionStdDeviation(pen).toFixed(2);
      const avg = getLocomotionAvg(pen).toFixed(2);
      const categoriesChart = getCategoriesChartBody(tool?.recentVisits, pen);
      const penDetails = getPenDetailsBody(pen);

      const visitsCategoriesPen = getRecentVisitCategoriesBody(
        pen,
        tool?.recentVisits,
      );

      const penObj = {
        penName: pen?.penName || sitePen?.name || '',
        standardDeviation: std ? parseFloat(std) : 0,
        average: avg ? parseFloat(avg) : 0,
        penDetails: isEmpty(penDetails) ? null : penDetails,
        categoriesChart: isEmpty(categoriesChart) ? null : categoriesChart,
        categoriesBody: visitsCategoriesPen,
      };
      penAnalysisArray.push(penObj);
    }
  });
  return penAnalysisArray;
};

const getPenDetailsBody = pen => {
  if (pen.categories && pen.categories?.length > 0) {
    const eachPensData = pen.categories.map((item, index) => {
      const penPercent = pensInPercent(index, pen.categories);
      return [
        createDynamicObjForReqBody(
          i18n.t('category'),
          item.category?.toFixed(1),
        ),
        createDynamicObjForReqBody(
          i18n.t('animalsInPen'),
          getAnimalsInPenPerCategory(
            index,
            pen.categories,
            pen.totalAnimalsInPen,
          ),
        ),
        createDynamicObjForReqBody(i18n.t('penPercent'), penPercent),
        createDynamicObjForReqBody(
          i18n.t('animalsObserved'),
          item?.animalsObserved || 0,
        ),
      ];
    });
    return eachPensData;
  }
  return [];
};

const getAnimalsInPenPerCategory = (index, categories, animalsInPen) => {
  let getAnimalsInPen = 0;
  getAnimalsInPen = animalInPerPen(index, categories, animalsInPen);
  if (getAnimalsInPen > 0) {
    getAnimalsInPen = Number(getAnimalsInPen).toFixed(2);
    return getAnimalsInPen;
  }
  return '-';
};

const getCategoriesChartBody = (recentVisits, pen) => {
  if (recentVisits && recentVisits?.length > 0) {
    const sortedRecentVisit = sortRecentVisits(recentVisits);
    const graphData = [];
    sortedRecentVisit.forEach((visit, index) => {
      const parsedLocomotionData = getRecentVisitToolData(
        visit,
        VISIT_TABLE_FIELDS.LOCOMOTION_SCORE,
      );
      if (parsedLocomotionData) {
        const foundPen = getRecentVisitPen(parsedLocomotionData?.pens, pen);
        if (foundPen) {
          const point = {
            visitDate:
              getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
              addSpace(index),
            locomotionCategoryScoreAverage:
              Number(getLocomotionAvg(foundPen)?.toFixed(2)) || 0,
          };
          graphData.push(point);
        }
      }
    });

    return graphData;
  }
  return [];
};
/**End Pen Analysis */

/** Start Herd Analysis */

const handleHerdAnalysisSelection = ({ locomotionScoreData, visitDetails }) => {
  const result = {};
  const herdAnalysisDetails = getBodyForHerdAnalysisDetails(
    locomotionScoreData,
    visitDetails,
  );
  if (!isEmpty(herdAnalysisDetails)) {
    result.herdAnalysisDetails = herdAnalysisDetails;
  }

  const newHerdAnalysisDetails =
    newLocomotionHerdAnalysisDetails(locomotionScoreData);
  if (!isEmpty(herdAnalysisDetails)) {
    result.newHerdAnalysisDetails = newHerdAnalysisDetails;
  }

  const graphsData = getBodyForHerdGraphs(locomotionScoreData);
  if (!isEmpty(graphsData)) {
    result.graph = graphsData;
  }

  // Include herd data for graph generation in component
  if (locomotionScoreData?.herd) {
    result.herdData = locomotionScoreData.herd;
  }

  return result;
};

const getBodyForHerdAnalysisDetails = (locomotionScoreData, visitDetails) => {
  const herdCategories = locomotionScoreData?.herd?.categories || [];

  const data = herdCategories?.map(item => {
    const herdAvg = getCalculateHerdAverage(item, locomotionScoreData?.herd);
    const calculateTotalAnimals = getCalculateTotalAnimals(
      item,
      locomotionScoreData?.herd,
      visitDetails.lactatingAnimal,
    );
    return [
      createDynamicObjForReqBody(i18n.t('category'), item.category || 0),
      createDynamicObjForReqBody(
        i18n.t('animalObserved'),
        getCategoryWiseAnimalObserved(item, locomotionScoreData?.herd),
      ),
      createDynamicObjForReqBody(
        `${i18n.t('herdGoal')} ${i18n.t('%')}`,
        item?.herdGoal || '-',
      ),
      createDynamicObjForReqBody(
        `${i18n.t('herdAverage')} ${i18n.t('%')}`,
        herdAvg && parseFloat(herdAvg) > 0 ? parseFloat(herdAvg) : '-',
      ),
      createDynamicObjForReqBody(
        i18n.t('totalAnimals'),
        calculateTotalAnimals && parseFloat(calculateTotalAnimals) > 0
          ? parseFloat(calculateTotalAnimals)
          : '-',
      ),
    ];
  });
  return data;
};

const newLocomotionHerdAnalysisDetails = locomotionScoreData => {
  let data = {};

  data.animalsInHerd = locomotionScoreData?.herd?.totalAnimalsInHerd;

  data.daysInMilk = locomotionScoreData?.herd?.daysInMilk;

  data.milkProductionInKg = locomotionScoreData?.herd?.milkProductionInKg;

  data.milkPriceAtSiteLevel = locomotionScoreData?.herd?.milkPriceAtSiteLevel;

  data.herdLocomotionScore = getCalculateHerdAvgLocomotionScore(
    locomotionScoreData?.herd,
  );

  data.milkLossKg = getCalculateMilkLoss(
    locomotionScoreData?.herd,
    locomotionScoreData?.herd?.milkProductionInKg,
  );

  data.milkLossKgPerDay = parseFloat(
    data.milkLossKg * locomotionScoreData?.herd?.totalAnimalsInHerd,
  )?.toFixed(2);

  data.milkLossKgPerYear = parseFloat(data.milkLossKgPerDay * 365)?.toFixed(2);

  data.revenueLossPerDay = calculateRevenueLossDay(
    locomotionScoreData?.herd?.milkPriceAtSiteLevel,
    locomotionScoreData?.herd?.totalAnimalsInHerd,
    data.milkLossKgPerDay,
  );

  data.revenueLossPerYear = calculateRevenueLossYear(
    locomotionScoreData?.herd?.milkPriceAtSiteLevel,
    locomotionScoreData?.herd?.totalAnimalsInHerd,
    data.milkLossKgPerYear,
  );

  return data;
};

const getBodyForHerdGraphs = locomotionScoreData => {
  const graphData = setHerdGraphData(locomotionScoreData?.herd);
  const model = mapGraphDataForHerdAnalysisExport(
    null,
    graphData,
    locomotionScoreData?.herd,
  );
  if (model) {
    return {
      average: model.average ? parseFloat(model.average) : 0,
      standardDeviation: model.standardDeviation
        ? parseFloat(model.standardDeviation)
        : 0,
      herdAvg: model.herdAvg,
      goals: model.goals,
    };
  }
  return {};
};
/** End Herd Selection*/
