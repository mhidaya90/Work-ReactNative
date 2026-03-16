import {
  DATE_FORMATS,
  LOCOMOTION_CATEGORY_LIST,
  TOOL_ANALYSIS_TYPES,
  UNIT_OF_MEASURE,
  VISIT_TABLE_FIELDS,
} from '../constants/AppConstants';
import i18n from '../localization/i18n';
import {
  checkIntegerAndDecimalValidation,
  convertNumberToString,
  convertNumbersToEnFormat,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';

// styles
import colors from '../constants/theme/variables/customColor';
import { normalize } from '../constants/theme/variables/customFont';
import { dateHelper, getFormattedDate } from './dateHelper';
import { addSpace } from './genericHelper';
import { logEvent } from './logHelper';
import {
  convertDenominatorWeightToImperial,
  convertDenominatorWeightToMetric,
  convertWeightToImperial,
  convertWeightToMetric,
} from './appSettingsHelper';
import {
  getRecentVisitPen,
  getRecentVisitToolData,
  sortRecentVisits,
} from './visitReport/visitReportHelper';
import {
  convertInputNumbersToRegionalBasis,
  getParsedToolData,
  upsertItem,
} from './genericHelper';
import { isEqual } from 'lodash';
// locomotion pen analysis region start

//  return initial pen object
const initialPenAnalysis = pen => {
  let penObj = {
    daysInMilk: pen?.daysInMilk || 0,
    milkProductionInKg: pen?.milk || 0,
    milkScoreFive: 0,
    milkScoreFour: 0,
    milkScoreThree: 0,
    // penId: !stringIsEmpty(pen?.sv_id) ? pen?.sv_id : pen?.id,
    penId: pen?.id || pen?.localId || pen?.sv_id,
    totalAnimalsInPen: pen?.animals || 0,
    categories: setCategory(),
    penName: pen?.name || pen?.value || '',
    isToolItemNew: true,
  };
  return penObj;
};

export const onSavePenData = (allPens, animalAnalysis, penAnalysis) => {
  if (!stringIsEmpty(penAnalysis)) {
    let temp = JSON.parse(penAnalysis);
    let pens = [];
    if (temp?.pens == undefined || temp?.pens?.length == 0) {
      allPens.map((item, index) => {
        animalAnalysis?.animals?.map((val, ind) => {
          if (
            val?.penId == item?.id ||
            val?.penId == item?.sv_id ||
            val?.localPenId == item?.id ||
            val?.localPenId == item?.sv_id
          ) {
            let obj = {
              daysInMilk: null,
              milkProductionInKg: 0,
              totalAnimalsInPen: 0,
              milkScoreFive: 0,
              milkScoreFour: 0,
              milkScoreThree: 0,
              penId: !stringIsEmpty(val?.penId) ? val?.penId : val?.localPenId,
              categories: setAnimalAnalysisCategory(val, animalAnalysis),
              penName: item?.name || '',
            };
            pens.push(obj);
          }
        });
      });
      let obj = {
        herd: temp?.herd,
        localVisit: temp?.localVisit,
        pens: pens,
      };
      return obj;
    }
  }
};

const onInitialPenAnalysisWithAnimalObserved = (
  selectedPen,
  animalAnalysis,
) => {
  let penObj = {
    daysInMilk: 0,
    milkProductionInKg: 0,
    milkScoreFive: 0,
    milkScoreFour: 0,
    milkScoreThree: 0,
    penId: !stringIsEmpty(selectedPen?.sv_id)
      ? selectedPen?.sv_id
      : selectedPen?.id,
    totalAnimalsInPen: 0,
    categories: setAnimalAnalysisCategory(selectedPen, animalAnalysis),
    penName: selectedPen?.name || '',
  };
  return penObj;
};

// pen setup input validation
export const onValueChange = (
  v,
  min,
  max,
  isInteger = false,
  toFixOne = 0,
  isNegative = false,
) => {
  const isValid = checkIntegerAndDecimalValidation(
    v === '' || v === null ? '0' : v,
    isInteger,
    min,
    max,
    toFixOne,
    false,
    null,
    isNegative,
  );

  return isValid;
};

// parsing Locomotion data
const setLocomotionPenData = locomotionPenData => {
  if (locomotionPenData?.length > 0) {
    let pens = JSON.parse(locomotionPenData)?.pens;
    return pens;
  }
};

// get selected pen form locomotion pen data otherwise return initial pen state
export const getSelectedPen = (
  allPensWithPenAnalysis,
  selectedPen,
  animalAnalysis,
) => {
  let currentToolAllPens = allPensWithPenAnalysis;
  currentToolAllPens =
    currentToolAllPens?.length > 0 &&
    currentToolAllPens?.find(a => {
      // if (!stringIsEmpty(a.penId) && a.penId == selectedPen.sv_id) {
      if (
        !stringIsEmpty(a.penId) &&
        (a?.penId == selectedPen?.sv_id || a?.penId == selectedPen?.id)
      ) {
        return a;
      }
    });
  if (!stringIsEmpty(currentToolAllPens)) {
    let cat = currentToolAllPens?.categories;
    delete currentToolAllPens?.categories;
    currentToolAllPens.categories = setCategory(cat);
    return currentToolAllPens;
  } else {
    if (
      !Array.isArray(allPensWithPenAnalysis) &&
      !stringIsEmpty(animalAnalysis)
    ) {
      let initialPenAnalysisWithAnimalObserved =
        onInitialPenAnalysisWithAnimalObserved(selectedPen, animalAnalysis);
      return initialPenAnalysisWithAnimalObserved;
    } else {
      return initialPenAnalysis(selectedPen);
    }
    // if (
    //   !Array.isArray(allPensWithPenAnalysis) &&
    //   !stringIsEmpty(animalAnalysis)
    // ) {
    //   let initialPenAnalysisWithAnimalObserved = onInitialPenAnalysisWithAnimalObserved(selectedPen,animalAnalysis)
    //   return initialPenAnalysisWithAnimalObserved
    // } else {
    //   return initialPenAnalysis(selectedPen);
    // }
    return initialPenAnalysis(selectedPen);
  }
};

const setAnimalAnalysisCategory = (selectedPen, animalAnalysis) => {
  let id = stringIsEmpty(selectedPen?.sv_id)
    ? selectedPen?.id
    : selectedPen?.sv_id;
  let selectedPenAnimalAnalysis = animalAnalysis?.animals?.find(
    a => a?.penId == id || a?.localPenId == id,
  );
  return LOCOMOTION_CATEGORY_LIST.map(v => ({
    category: Number(v?.category),
    lossCow: v?.lossCow,
    animalsObserved: setAnimalObserved(selectedPenAnimalAnalysis, v?.category),
  }));
};

const setAnimalObserved = (animalAnalysisData, category) => {
  let count = 0;
  animalAnalysisData?.animalDetails?.map(val => {
    if (Number(val?.locomotionScore) == category) {
      count = count + 1;
    }
  });
  return count;
};

// locomotion category tools within pens lossCow and category
const setCategory = value => {
  if (value?.length > 0) {
    let temp = value;
    temp = temp?.map((val, index) => {
      return {
        lossCow: LOCOMOTION_CATEGORY_LIST[index].lossCow,
        animalsObserved: !stringIsEmpty(val?.animalsObserved)
          ? val?.animalsObserved
          : 0,
        category: Number(LOCOMOTION_CATEGORY_LIST[index]?.category),
        pens: pensInPercent(index, value),
        // animalsInPen: animalInPerPen(index, value, 31),
      };
    });

    return temp;
  } else {
    return LOCOMOTION_CATEGORY_LIST?.map(v => ({
      category: Number(v?.category),
      lossCow: v?.lossCow,
      animalsObserved: 0,
    }));
  }
};

//  check pen exist and newly pen then added locomotion constant attributes
export const allPenAnalysis = value => {
  let pens = setLocomotionPenData(value?.locomotionScore);
  if (pens?.length > 0) {
    pens?.map(a => {
      return {
        daysInMilk: a?.daysInMilk,
        milkProductionInKg: a?.milkProductionInKg,
        milkScoreFive: a?.milkScoreFive,
        milkScoreFour: a?.milkScoreFour,
        milkScoreThree: a?.milkScoreThree,
        penId: a?.penId,
        totalAnimalsInPen: a?.totalAnimalsInPen || 0,
        categories: setCategory(a?.category),
        penName: a?.penName || '',
      };
    });
    return pens;
  } else {
    return initialPenAnalysis();
  }
};

// save db mapper pen categories
const mappedStateToDb = item => {
  return item?.map(v => ({
    category: v?.category,
    animalsObserved: v?.animalsObserved,
  }));
};

// save pen analysis using locomotion tools
export const onUpdatedLocomotionScoreObj = ({
  data,
  localVisitId,
  visitData,
}) => {
  try {
    let { locomotionScore } = visitData;
    let selectedPenData = data;
    let result = '';
    let categories = mappedStateToDb(selectedPenData?.categories);
    selectedPenData.categories = categories;
    if (!stringIsEmpty(locomotionScore)) {
      // if(typeof(locomotionScore))
      let parseLocomotion = '';
      if (typeof locomotionScore == 'string') {
        parseLocomotion = JSON.parse(locomotionScore);
      } else {
        parseLocomotion = locomotionScore;
      }
      if (parseLocomotion?.pens?.length > 0) {
        let selectedIndex = parseLocomotion?.pens?.findIndex(
          a => a.penId == selectedPenData?.penId,
        );
        if (selectedIndex > -1) {
          parseLocomotion.pens[selectedIndex] = selectedPenData;
        } else {
          parseLocomotion?.pens.push(selectedPenData);
        }
      } else {
        parseLocomotion.pens = [];
        parseLocomotion?.pens.push(selectedPenData);
      }
      result = parseLocomotion;
    }
    // newly very first time pen analysis perform
    else {
      let newlyAdded = {
        localVisit: visitData.id,
        visitId: visitData.sv_id,
        pens: [selectedPenData],
      };
      result = newlyAdded;
    }
    return result;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> saveLocomotionScore Exception',
      error,
    );
    console.log('saveLocomotionScore Exception', error);
  }
};

export const onUpdatePen = (
  animalsInPen,
  daysInMilk,
  milkProduction,
  selectedPenObj,
) => {
  let updatedPenObj = {};
  updatedPenObj.name = selectedPenObj?.name;
  updatedPenObj.animals = Number(animalsInPen);
  updatedPenObj.daysInMilk = daysInMilk ? Number(daysInMilk) : null;
  updatedPenObj.milk = Number(milkProduction);
  updatedPenObj.sv_id = selectedPenObj?.sv_id;
  updatedPenObj.localId = selectedPenObj?.id;
  updatedPenObj.updated = true;
  return updatedPenObj;
};

//calculate penInPercent at runtime  to change animal observed
export const pensInPercent = (index, data) => {
  try {
    let selectedCategoryTotalCountYes = 0;
    const totalAnimalObserved = data?.reduce((accumulator, object) => {
      return accumulator + object?.animalsObserved;
    }, 0);

    selectedCategoryTotalCountYes = data[index].animalsObserved;
    if (selectedCategoryTotalCountYes > 0) {
      let calculatePenInPercent =
        (selectedCategoryTotalCountYes / totalAnimalObserved) * 100;
      return calculatePenInPercent > 0
        ? calculatePenInPercent.toFixed(2)
        : calculatePenInPercent;
    }
    return '-';
  } catch (error) {
    logEvent('helpers -> locomotionHelper -> pensInPercent exception', error);
    console.log('pensInPercent exception', error);
    return '-';
  }
};

//calculate animalInPerPen at runtime  to change animal observed
export const animalInPerPen = (index, data, animalsInPen) => {
  let animalInPenCount = 0;
  let penInPercent = pensInPercent(index, data);
  if (penInPercent > 0) {
    animalInPenCount = (penInPercent * animalsInPen) / 100;
    return animalInPenCount > 0
      ? animalInPenCount.toFixed(2)
      : animalInPenCount;
  }
  return animalInPenCount;
};

// run time total calculate milk loss value
export const calculateMilkLoss = (data, milkProduction) => {
  milkProduction = convertNumbersToEnFormat(milkProduction);
  let calculatedMilkLossValue = 0;
  if (!stringIsEmpty(data)) {
    data = data?.map((a, index) => {
      return {
        ...a,
        lossCow: LOCOMOTION_CATEGORY_LIST[index].lossCow,
      };
    });
    let categoryWithLossCow = data?.filter(a => a.lossCow != '');
    const totalAnimalObserved = data?.reduce((accumulator, object) => {
      return accumulator + object?.animalsObserved;
    }, 0);
    let totalMilkLoss = 0;
    categoryWithLossCow.forEach(element => {
      totalMilkLoss +=
        element?.animalsObserved *
        Number(milkProduction) *
        (element?.lossCow / 100);
    });
    if (!stringIsEmpty(totalAnimalObserved) && totalAnimalObserved > 0) {
      let totalMilkLossAnimalObserved = totalMilkLoss / totalAnimalObserved;
      calculatedMilkLossValue = totalMilkLossAnimalObserved.toFixed(4);
    }

    return calculatedMilkLossValue;
  }
};

export const getAllLocomotionScoreData = locomotionScore => {
  if (
    locomotionScore &&
    locomotionScore?.pens &&
    locomotionScore?.pens?.length > 0
  ) {
    return locomotionScore?.pens;
  }
  return [];
};

export const getLocomotionAvg = pen => {
  let avg = 0;
  if (pen && pen?.categories && pen?.categories?.length > 0) {
    pen?.categories?.map((a, index) => {
      avg += calculateAvg(a, index, pen.categories);
    });
  }
  return avg;
};

const calculateAvg = (a, index, categories) => {
  let avg = 0;
  let pens = pensInPercent(index, categories);
  let b = (pens / 100) * +Number(a?.category);
  if (!stringIsEmpty(b) && b >= 0) {
    avg = b;
  }
  return avg;
};

// locomotion standard deviation formula
export const getLocomotionStdDeviation = pen => {
  try {
    let avg = getLocomotionAvg(pen).toFixed(2);
    let sum = 0;
    let totalAnimals = 0;
    if (pen && pen?.categories && pen?.categories?.length > 0) {
      pen?.categories.map(data => {
        const animals = data?.animalsObserved;
        totalAnimals += animals;
        const category = +Number(data?.category);
        const error = category - avg;
        const squaredError = error * error;
        const val = squaredError * animals;
        sum += val;
      });
    }
    if (totalAnimals > 1) {
      return Math.sqrt(sum / (totalAnimals - 1));
    } else if (totalAnimals == 1) {
      return Math.sqrt(sum / totalAnimals);
    }
    return 0;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> getLocomotionStdDeviation error',
      error,
    );
    return 0;
  }
};

export const setAnimalAnalysisGraphData = (graphData, currentVisitData = null) => {
  try {
    let currentVisitIndex = null;

    let animals = graphData?.map((visit, index) => {
      // Find the current visit by comparing visitId or date
      if (currentVisitData &&
          (visit?.visitId === currentVisitData?.visitId ||
           visit?.date === currentVisitData?.date)) {
        currentVisitIndex = index;
      }

      return {
        x: getFormattedDate(visit?.date, DATE_FORMATS.MM_dd) + addSpace(index),
        y: getLocomotionAvg(visit),
      };
    });

    let animalAnalysisGraph = {
      data: animals,
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
    return [animalAnalysisGraph];
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> setAnimalAnalysisGraphData error',
      error,
    );
  }
};
// locomotion pen analysis region end

// locomotion Herd Analysis region start

export const initialHerdAnalysisForm = () => {
  return LOCOMOTION_CATEGORY_LIST.map(v => ({
    category: v.category,
    lossCow: v.lossCow,
    animalsObserved: 0,
    animalsInPen: 0,
    pens: 0,
  }));
};

const initialHerdAnalysis = herdData => {
  let herd = herdData?.herd;
  let herdObj = {
    categories: setHerdCategory(herdData),
    daysInMilk: !stringIsEmpty(herd?.daysInMilk) ? herd?.daysInMilk : '',
    milkPriceAtSiteLevel: !stringIsEmpty(herd?.milkPriceAtSiteLevel)
      ? convertNumberToString(herd?.milkPriceAtSiteLevel)
      : null,
    milkProductionInKg: !stringIsEmpty(herd?.milkProductionInKg)
      ? convertNumberToString(herd?.milkProductionInKg)
      : '',
    pensForVisit: herdData?.pens?.length > 0 ? herdData?.pens : [],
    totalAnimalsInHerd: !stringIsEmpty(herd?.totalAnimalsInHerd)
      ? herd?.totalAnimalsInHerd
      : '',
  };

  return herdObj;
};

const setHerdCategory = value => {
  let herd = value?.herd;
  if (herd?.categories?.length > 0) {
    let temp = herd?.categories;
    temp = temp?.map((val, index) => {
      return {
        lossCow: LOCOMOTION_CATEGORY_LIST[index]?.lossCow,
        category: LOCOMOTION_CATEGORY_LIST[index]?.category,
        herdGoal:
          convertNumberToString(val?.herdGoal) ||
          LOCOMOTION_CATEGORY_LIST[index].herdGoal,
        // pens: pensInPercent(index, value),
        // animalsInPen: animalInPerPen(index, value, 31),
      };
    });

    return temp;
  } else {
    return LOCOMOTION_CATEGORY_LIST.map(v => ({
      category: v.category,
      herdGoal: convertNumberToString(v.herdGoal, true),
    }));
  }
};

export const herdDataInitialized = locomotionScore => {
  let data = {};
  let result = {};

  if (
    !stringIsEmpty(locomotionScore) &&
    locomotionScore &&
    Object.keys(locomotionScore).length !== 0
  ) {
    data = JSON.parse(locomotionScore);
  } else {
    // locomotion score data empty
    result = initialHerdAnalysis();
  }
  if (!stringIsEmpty(data)) {
    result = initialHerdAnalysis(data);
  }
  return result;
};

export const calculateTotalAnimalObservedInAllPens = data => {
  let totalAnimalObservedInAllPens = 0;
  if (data?.pensForVisit?.length > 0) {
    totalAnimalObservedInAllPens = getAllAnimalObservedInAllPens(
      data?.pensForVisit,
    );
  }
  return totalAnimalObservedInAllPens;
};

// calculate All animals observed from all pens in pen analysis
const getAllAnimalObservedInAllPens = allPens => {
  let total = 0;
  allPens.forEach(a => {
    total += a.categories?.reduce((accumulator, object) => {
      return accumulator + object?.animalsObserved;
    }, 0);
  });

  return total;
};

// get Calculate categories wise Animal Observed
export const getCategoryWiseAnimalObserved = (item, herdData) => {
  try {
    let totalAnimalObservedInCategory = 0;
    if (herdData?.pensForVisit.length > 0) {
      herdData?.pensForVisit.forEach(p => {
        p?.categories.map(a => {
          if (a?.category == item?.category) {
            totalAnimalObservedInCategory += a?.animalsObserved;
          }
        });
      });
    }
    return totalAnimalObservedInCategory;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> getCategoryWiseAnimalObserved Exception',
      error,
    );
    console.log('getCategoryWiseAnimalObserved Exception', error);
  }
};

// calculate herd Average
export const getCalculateHerdAverage = (item, herdData) => {
  try {
    let herdAverage = 0;
    let categoryWiseAnimalObserved = getCategoryWiseAnimalObserved(
      item,
      herdData,
    );
    let allAnimalObserved = calculateTotalAnimalObservedInAllPens(herdData);
    if (categoryWiseAnimalObserved > 0) {
      herdAverage = (categoryWiseAnimalObserved / allAnimalObserved) * 100;
      if (herdAverage > 0) {
        return herdAverage.toFixed(2);
      }
    }
    return herdAverage;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> getCalculateHerdAverage Exception ',
      error,
    );
    console.log('getCalculateHerdAverage Exception ', error);
  }
};
// calculate Total Animals
export const getCalculateTotalAnimals = (item, herdData, animalsInSite) => {
  let totalAnimal = 0;
  try {
    let herdGoal = 0;

    herdGoal = getCalculateHerdAverage(item, herdData);
    if (herdGoal > 0 && Number(animalsInSite) > 0) {
      totalAnimal = (herdGoal / 100) * animalsInSite;
      totalAnimal = totalAnimal.toFixed(0);
      totalAnimal.toFixed(0);
    } else {
      totalAnimal = 0;
    }
    return totalAnimal;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> getCalculateTotalAnimals error',
      error,
    );
    return totalAnimal;
  }
};
// calculate Total Milk Loss
export const getCalculateMilkLoss = (
  herdData,
  milkProduction,
  conversionNeeded = false,
) => {
  milkProduction = convertStringToNumber(milkProduction, !conversionNeeded);
  try {
    let totalMilkLoss = 0;
    for (let i = 2; i < herdData?.categories?.length; i++) {
      let herdAverage = getCalculateHerdAverage(
        herdData?.categories[i],
        herdData,
      );
      totalMilkLoss +=
        herdAverage *
        milkProduction *
        (LOCOMOTION_CATEGORY_LIST[i].lossCow / 100);
    }
    totalMilkLoss = totalMilkLoss / 100;
    return totalMilkLoss.toFixed(4);
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> getCalculateMilkLoss error',
      error,
    );
  }
};

const getFormattedHerdGoal = model => {
  return model?.categories?.map(val => {
    return {
      ...val,
      herdGoal: convertStringToNumber(val?.herdGoal),
    };
  });
};

export const onUpdateHerdObj = (
  herdData,
  milkProduction,
  daysInMilk,
  animalsInHerd,
  visitData,
  milkPrice,
) => {
  let result = {};
  let { locomotionScore } = visitData;
  let obj = { ...herdData };
  obj.categories = getFormattedHerdGoal(obj);

  obj.daysInMilk =
    !stringIsEmpty(daysInMilk) && daysInMilk != '-' ? daysInMilk : null;
  obj.milkProductionInKg = milkProduction;
  obj.totalAnimalsInHerd = animalsInHerd;
  obj.milkPriceAtSiteLevel = milkPrice || '';
  // already herd data
  if (!stringIsEmpty(locomotionScore)) {
    locomotionScore = JSON.parse(locomotionScore);
    locomotionScore.herd = obj;
    result = locomotionScore;
  }
  // very first time herd analysis perform
  else {
    let newlyAdded = {
      localVisit: visitData.id,
      visitId: visitData.sv_id,
      herd: obj,
    };
    result = newlyAdded;
  }

  return result;
};

export const onUpdateSiteObj = (
  siteObj,
  milkProduction,
  daysInMilk,
  animalsInHerd,
) => {
  let obj = {};
  obj.siteName = siteObj?.siteName;
  obj.daysInMilk = daysInMilk ? convertStringToNumber(daysInMilk) : null;
  obj.milk = convertStringToNumber(milkProduction);
  obj.lactatingAnimal = convertStringToNumber(animalsInHerd);
  obj.updated = true;
  obj.id = siteObj.id;
  return obj;
};

export const onUpdatePriceSiteObj = (siteObj, milkPrice) => {
  let obj = {};
  obj.currentMilkPrice = convertStringToNumber(milkPrice);
  obj.updated = true;
  obj.id = siteObj.id;
  obj.siteName = siteObj?.siteName;
  return obj;
};

export const getCalculateAvgLocomotionScore = data => {
  let avg = 0;
  if (!stringIsEmpty(data) && data?.pensForVisit.length > 0) {
    data?.pensForVisit.forEach(element => {
      avg += getLocomotionAvg(element);
    });
    if (avg > 0) {
      avg = avg / data?.pensForVisit.length;
      return avg.toFixed(2);
    }
  }
  return avg;
};

const getCalculateAllPensInAnimal = data => {
  let total = 0;
  total += data?.pensForVisit?.reduce((accumulator, object) => {
    let val = !stringIsEmpty(object?.totalAnimalsInPen)
      ? Number(object?.totalAnimalsInPen)
      : 0;
    return accumulator + val;
  }, 0);
  return total;
};

export const getCalculateHerdAvgLocomotionScore = data => {
  let avg = 0;
  let allAnimalsWithInAllPen = getCalculateAllPensInAnimal(data);
  if (!stringIsEmpty(data) && data?.pensForVisit?.length > 0) {
    data?.pensForVisit.forEach(element => {
      avg += getLocomotionAvg(element) * element?.totalAnimalsInPen;
    });

    if (avg > 0) {
      avg = avg / allAnimalsWithInAllPen;
      return avg.toFixed(2);
    }
  }
  return avg;
};

export const calculateRevenueLossDay = (milkPrice, animals, milkLossDay) => {
  let revenueLossPerDay = 0;
  // revenueLossPerDay = milkPrice * animals * Number(milkLossDay);
  revenueLossPerDay = milkPrice * Number(milkLossDay);
  if (revenueLossPerDay < 0) {
    return 0;
  }
  return revenueLossPerDay.toFixed(2);
};

export const calculateRevenueLossYear = (milkPrice, animals, milkLossYear) => {
  let revenueLossPerDay = 0;
  // revenueLossPerDay = milkPrice * animals * milkLossYear;
  revenueLossPerDay = milkPrice * milkLossYear;
  if (revenueLossPerDay < 0) {
    return 0;
  }
  return revenueLossPerDay.toFixed(2);
};

export const revenueData = (
  herdData,
  siteData,
  price,
  currency,
  weightUnit,
  unit,
) => {
  let arr = [];
  let animals = 0;

  animals = siteData?.lactatingAnimal ? siteData?.lactatingAnimal : 0;

  let milkProductionKg = (
    unit === UNIT_OF_MEASURE.IMPERIAL
      ? convertWeightToImperial(siteData?.milk)
      : siteData?.milk
  )?.toFixed(1);

  let milkLoss = getCalculateMilkLoss(herdData, milkProductionKg);

  // let allAnimalObserved = calculateTotalAnimalObservedInAllPens(herdData);

  let milkLossDay = milkLoss * animals;
  milkLossDay = milkLossDay.toFixed(2);

  let milkLossYear = (milkLossDay * 365).toFixed(2);

  milkLoss = Number(milkLoss).toFixed(2);

  let milkPrice = convertStringToNumber(price);
  let revenueLossDay = calculateRevenueLossDay(milkPrice, animals, milkLossDay);
  let revenueLossYear = calculateRevenueLossYear(
    milkPrice,
    animals,
    milkLossYear,
  );

  let avgLocomotionScore = getCalculateHerdAvgLocomotionScore(herdData);

  arr.push({
    label: `${i18n.t('milkProductionKg')} (${weightUnit})`,
    value: milkProductionKg,
  });
  arr.push({
    label: i18n.t('herdLocomotionScore'),
    value: avgLocomotionScore,
  });
  arr.push({ label: `${i18n.t('MilkLoss')} (${weightUnit})`, value: milkLoss });
  arr.push({
    label: `${i18n.t('milkLossKGDay')} (${weightUnit}/day)`,
    value: milkLossDay,
  });
  arr.push({
    label: `${i18n.t('milkLossKGYear')} (${weightUnit}/year)`,
    value: milkLossYear,
  });
  arr.push({
    label: `${i18n.t('RevenueLossDay')} (${currency}/day)`,
    value: revenueLossDay,
  });
  arr.push({
    label: `${i18n.t('RevenueLossYear')} (${currency}/year)`,
    value: revenueLossYear,
  });
  return arr;
};

export const setMilkPriceValue = (
  herdData,
  siteData,
  unitOfMeasure,
  isEditable,
) => {
  let value = '';

  if (!isEditable) {
    if (!stringIsEmpty(herdData?.milkPriceAtSiteLevel)) {
      value = convertStringToNumber(herdData?.milkPriceAtSiteLevel);
    }
  } else {
    value = siteData?.currentMilkPrice;
  }
  if (value) {
    if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
      value = convertDenominatorWeightToImperial(value, 3).toString();
    }
  }
  return convertNumberToString(value);
};

export const getLocomotionHerdStdDeviation = herdData => {
  try {
    let avg = getCalculateHerdAvgLocomotionScore(herdData);
    let sum = 0;
    let totalAnimalObserved = 0;

    if (
      herdData &&
      herdData?.categories &&
      herdData?.categories?.length > 0 &&
      avg > 0
    ) {
      herdData?.categories.map(data => {
        // const herdGoal = Number(data?.herdGoal);
        const animalObservedInCategoryWise = getCategoryWiseAnimalObserved(
          data,
          herdData,
        );
        totalAnimalObserved += animalObservedInCategoryWise;
        const category = +data?.category;
        const error = category - avg;
        const squaredError = error * error;
        const val = squaredError * animalObservedInCategoryWise;
        sum += val;
      });
    }
    if (totalAnimalObserved > 1) {
      return Math.sqrt(sum / (totalAnimalObserved - 1));
    } else if (totalAnimalObserved == 1) {
      return Math.sqrt(sum / totalAnimalObserved);
    }
    return 0;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> getLocomotionHerdStdDeviation error',
      error,
    );
    console.log('getLocomotionHerdStdDeviation error', error);
    return 0;
  }
};

export const setHerdGraphData = herdData => {
  let data = [];
  let herdAvg = herdData?.categories?.map(a => {
    return {
      x: a.category,
      y: Number(getCalculateHerdAverage(a, herdData)),
    };
  });
  let herdGoal = herdData?.categories?.map(a => {
    return {
      x: a?.category,
      y: convertStringToNumber(a?.herdGoal),
    };
  });
  let herdAvgGraphObj = {
    data: herdAvg,

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

  let herdGoalGraphObj = {
    data: herdGoal,

    gradientId: 'firstLine',
    gradientStyles: [
      {
        offset: '0%',
        stopColor: colors.graphHerdGoal,
      },
      {
        offset: '100%',
        stopColor: colors.white,
      },
    ],
    customLineStyles: {
      stroke: colors.graphHerdGoal,
      strokeWidth: normalize(1),
      strokeDasharray: '4, 4',
    },
    customScatterStyles: {
      fill: colors.graphHerdGoal,
    },
    dotLabelStyles: {
      fill: colors.graphHerdGoal,
    },
  };
  data.push(herdGoalGraphObj);
  data.push(herdAvgGraphObj);
  return data;
};

export const mapGraphDataForPenAnalysisExport = (
  visitState,
  graphData,
  penName,
  penData,
) => {
  let average = getLocomotionAvg(penData).toFixed(2) || 0.0;
  let stdDeviation = getLocomotionStdDeviation(penData).toFixed(2) || 0.0;
  let mappedArray = [];
  if (graphData?.length > 0) {
    graphData[0]?.data?.map(item => {
      mappedArray.push({
        visitDate: item?.x,
        locomotionCategoryScoreAverage: Number(item?.y.toFixed(2)) || 0,
      });
    });
  }
  const model = {
    fileName: visitState?.visitName + '-LocomotionPenAnalysis',
    visitName: visitState?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('locomotion'),
    analysisType: i18n.t('penAnalysis'),
    penName,
    average: average,
    standardDeviation: stdDeviation,
    categories: mappedArray,

    // for addition field comma seprated value
    averageLabel: convertInputNumbersToRegionalBasis(average, 2, true),
    standardDeviationLabel: convertInputNumbersToRegionalBasis(
      stdDeviation,
      2,
      true,
    ),
  };
  return model;
};
export const mapGraphDataForHerdAnalysisExport = (
  visitState,
  graphData,
  herdData,
) => {
  try {
    let stdDeviation =
      getLocomotionHerdStdDeviation(herdData).toFixed(2) || 0.0;
    let average = getCalculateHerdAvgLocomotionScore(herdData) || 0.0;
    let goals = {};
    let herdValue = [];
    let goalsValue = [];
    let herdAvg = {};
    herdValue = graphData[1]?.data?.map(a => {
      return {
        ...a,
        category: a?.x?.toFixed(1),
      };
    });
    goalsValue = graphData[0]?.data?.map(a => {
      return {
        ...a,
        category: a?.x?.toFixed(1),
      };
    });
    herdValue?.map(item => {
      herdAvg[item?.category] = Number(item?.y?.toFixed(2));
      return herdAvg;
    });
    goalsValue?.map(item => {
      goals[item?.category] = Number(item?.y.toFixed(2));
      return goals;
    });
    const model = {
      fileName: visitState?.visitName + '-LocomotionHerdAnalysis',
      visitName: visitState?.visitName,
      visitDate: dateHelper.getFormattedDate(
        visitState?.visitDate,
        DATE_FORMATS.MMM_DD_YY_H_MM,
      ),
      toolName: i18n.t('locomotion'),
      analysisType: i18n.t('herdAnalysis'),
      average: average,
      standardDeviation: stdDeviation,
      herdAvg: herdAvg,

      goals: goals,
      // for addition field comma seprated value
      averageLabel: convertInputNumbersToRegionalBasis(average, 2, true),
      standardDeviationLabel: convertInputNumbersToRegionalBasis(
        stdDeviation,
        2,
        true,
      ),
    };
    return model;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> mapGraphDataForHerdAnalysisExport error',
      error,
    );
    console.log('mapGraphDataForHerdAnalysisExport => error', error);
  }
};

export const mapGraphDataForAnimalAnalysisExport = (
  visitState,
  graphData,
  selectedAnimal,
  selectedPen,
  isBCS,
) => {
  try {
    let mappedArray = [];
    if (graphData?.length > 0) {
      graphData?.map(item => {
        // Safely extract and convert locomotionScore
        let locomotionScore = null;
        if (!stringIsEmpty(item?.locomotionScore)) {
          const score = Number(item?.locomotionScore);
          if (!isNaN(score)) {
            locomotionScore = Number(score.toFixed(2));
          }
        }

        // Safely extract and convert dim (from 'label' property in chartData)
        let dim = null;
        if (item?.label != null) {
          const dimValue = Number(item?.label);
          if (!isNaN(dimValue)) {
            dim = Number(dimValue.toFixed(2));
          }
        }

        // Safely extract and convert bcs
        let bcs = null;
        if (!stringIsEmpty(item?.bcs)) {
          const bcsValue = Number(item?.bcs);
          if (!isNaN(bcsValue)) {
            bcs = Number(bcsValue.toFixed(2));
          }
        }

        mappedArray.push({
          visitDate: item?.date,
          locomotionScore: locomotionScore,
          dim: dim,
          penName: selectedPen?.name,
          bcs: bcs,
        });
      });
    }
    const model = {
      fileName:
        visitState?.visitName +
        `-${isBCS ? 'BCS' : 'Locomotion'}AnimalAnalysis`,
      visitName: visitState?.visitName,
      visitDate: dateHelper.getFormattedDate(
        visitState?.visitDate,
        DATE_FORMATS.MMM_DD_YY_H_MM,
      ),
      multipleFiles: true,
      toolName: isBCS ? i18n.t('BCS') : i18n.t('locomotion'),
      analysisType: i18n.t('animalAnalysis'),
      animalTagName: convertInputNumbersToRegionalBasis(selectedAnimal?.name),
      animalAnalysis: mappedArray,
    };

    return model;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> mapGraphDataForAnimalAnalysisExport error',
      error,
    );
    console.log('mapGraphDataForHerdAnalysisExport => error', error);
  }
};

const calculatePensSum = penAnalysisArray => {
  let sum = 0;
  penAnalysisArray?.categories?.map(item => {
    sum += item.animalsObserved;
  });
  return sum > 0;
};

const calculateHerdSum = (penAnalysisArray = []) => {
  let sum = 0;
  if (penAnalysisArray?.categories?.length > 0) {
    penAnalysisArray?.categories?.map(item => {
      sum += convertStringToNumber(item?.herdGoal);
    });
  }
  return sum > 0;
};

export const shouldEnableResultsButton = (toolType, penAnalysisArray) => {
  switch (toolType) {
    case TOOL_ANALYSIS_TYPES.PEN_ANALYSIS:
      return calculatePensSum(penAnalysisArray);
    case TOOL_ANALYSIS_TYPES.HERD_ANALYSIS:
      return calculateHerdSum(penAnalysisArray);
    default:
      return true;
  }
};

export const getPensWithAnimalObserved = (animalAnalysis, pensList) => {
  try {
    let temp = [];
    if (animalAnalysis && animalAnalysis?.animals.length > 0) {
      animalAnalysis?.animals.forEach((val, index) => {
        let selectedVisitPen = pensList?.find(
          x =>
            x.sv_id == val.penId ||
            x.sv_id == val.localPenId ||
            x.id == val.penId ||
            x.id == val.localPenId,
        );
        let obj = {
          daysInMilk: selectedVisitPen?.daysInMilk,
          milkProductionInKg: selectedVisitPen?.milk,
          milkScoreFive: 0,
          milkScoreFour: 0,
          milkScoreThree: 0,
          penId: !stringIsEmpty(val?.penId) ? val?.penId : val?.localPenId,
          totalAnimalsInPen: selectedVisitPen?.animals,
          categories: LOCOMOTION_CATEGORY_LIST.map(v => ({
            category: Number(v?.category),
            lossCow: v?.lossCow,
            animalsObserved: setAnimalObserved(val, v?.category),
          })),
          penName: selectedVisitPen?.name || '',
        };
        temp.push(obj);
      });

      return temp;
    }
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> getPensWithAnimalObserved error',
      error,
    );
  }
};

export const getRecentVisitCategoriesBody = (pen, recentVisits) => {
  if (recentVisits?.length > 0) {
    const sortedRecentVisit = sortRecentVisits(recentVisits);

    let body = {
      visitDates: [],
      animalsInPen: [],
      dim: [],
      milkProduction: [],
      milkLoss: [],
      categories: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
      },
    };

    sortedRecentVisit?.map((visit, index) => {
      const parsedLocomotionData = getRecentVisitToolData(
        visit,
        VISIT_TABLE_FIELDS.LOCOMOTION_SCORE,
      );

      if (parsedLocomotionData) {
        const foundPen = getRecentVisitPen(parsedLocomotionData?.pens, pen);

        if (foundPen) {
          body.visitDates.push(
            getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd_YY),
          );

          body.animalsInPen.push(foundPen?.totalAnimalsInPen || '-');

          body.dim.push(foundPen?.daysInMilk || '-');

          body.milkProduction.push(foundPen?.milkProductionInKg || '-');

          const milkLoss = calculateMilkLoss(
            foundPen?.categories,
            foundPen?.milkProductionInKg,
          );

          body.milkLoss.push(milkLoss ? parseFloat(milkLoss)?.toFixed(2) : '-');

          foundPen?.categories?.map((item, index) => {
            const penPercent = pensInPercent(index, foundPen?.categories);

            const cellData =
              penPercent != '-' || item.animalsObserved != 0
                ? `${penPercent}% | ${item.animalsObserved}`
                : '-';

            body.categories[item.category].push(cellData);
          });
        }
      }
    });

    return body;
  }
};

export const offlineReportGraphModel = categories => {
  if (categories?.length > 0) {
    const graphData = categories?.map(item => {
      return {
        x: item.visitDate,
        y: item.locomotionCategoryScoreAverage,
      };
    });

    // The current visit is the last item in the sorted array
    const currentVisitIndex = categories.length > 0 ? categories.length - 1 : null;

    return { graphData, currentVisitIndex };
  }
  return { graphData: [], currentVisitIndex: null };
};

export const offlineReportHerdAnalysisModel = (herdDetails, newHerdDetails) => {
  if (herdDetails?.length > 0) {
    let body = {
      categories: [],
      percentPerHerd: [],
      numberOfHerd: [],
      animalsInHerd: '-',
      dim: '-',
      milkProduction: '-',
      milkPrice: '-',
      locomotionScore: '-',
      milkLoss: '-',
      revenue: {
        milkLossKgPerDay: '-',
        milkLossKgPerYear: '-',
        revenueLossPerDay: '-',
        revenueLossPerYear: '-',
      },
    };

    herdDetails?.map(herd => {
      if (herd?.length > 0) {
        herd?.map(item => {
          switch (item.column) {
            case i18n.t('category'):
              body.categories.push(item.value?.toFixed(1));
              break;
            case i18n.t('animalsObserved'):
              body.numberOfHerd.push(item.value);
              break;
            case `${i18n.t('herdAverage')} %`:
              body.percentPerHerd.push(item.value);
              break;

            default:
              break;
          }
        });
      }
    });

    if (newHerdDetails) {
      body.animalsInHerd = newHerdDetails.animalsInHerd;
      body.dim = newHerdDetails.daysInMilk;
      body.milkProduction = newHerdDetails.milkProductionInKg;
      body.milkPrice = newHerdDetails.milkPriceAtSiteLevel;
      body.locomotionScore = newHerdDetails.herdLocomotionScore;
      body.milkLoss = newHerdDetails.milkLossKg;
      body.revenue.milkLossKgPerDay = newHerdDetails.milkLossKgPerDay;
      body.revenue.milkLossKgPerYear = newHerdDetails.milkLossKgPerYear;
      body.revenue.revenueLossPerDay = newHerdDetails.revenueLossPerDay;
      body.revenue.revenueLossPerYear = newHerdDetails.revenueLossPerYear;
    }

    return body;
  }
};

export const extractUsedPensFromLocomotionScoreTool = (
  locomotionScoreData = null,
) => {
  try {
    const usedPensPayload = [];

    if (locomotionScoreData?.pens?.length > 0) {
      locomotionScoreData?.pens?.map(pen => usedPensPayload.push(pen?.penId));
    }

    const payload = {
      [VISIT_TABLE_FIELDS.LOCOMOTION_SCORE]: usedPensPayload,
    };

    return payload;
  } catch (error) {
    console.log('error extractUsedPensFromBCSTool', error);
    logEvent(
      'helpers -> locomotionHelper -> extractUsedPensFromLocomotionScoreTool error',
      error,
    );
    return null;
  }
};

export function deletePenDataInsideLocomotionTool(locomotionData, pen) {
  try {
    const parsedLocomotionData = getParsedToolData(locomotionData);

    if (parsedLocomotionData) {
      const filteredPens = [];
      const filteredHerdPensForVisit = [];

      parsedLocomotionData.pens?.map(item => {
        if (item.penId !== pen) {
          filteredPens.push(item);
        }
      });
      parsedLocomotionData.pens = filteredPens;

      if (
        parsedLocomotionData?.herd &&
        parsedLocomotionData?.herd?.pensForVisit
      ) {
        parsedLocomotionData?.herd?.pensForVisit?.map(item => {
          if (item.penId !== pen) {
            filteredHerdPensForVisit.push(item);
          }
        });
        parsedLocomotionData.herd.pensForVisit = filteredHerdPensForVisit;
      }

      if (parsedLocomotionData?.pens?.length <= 0) {
        return null;
      }
    }

    return parsedLocomotionData;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> deletePenDataInsideLocomotionTool error',
      error,
    );
    return locomotionData;
  }
}

export const getTotalCowsCountLocomotion = penAnalysis => {
  let totalCowsCount = 0;
  try {
    if (penAnalysis) {
      penAnalysis?.categories?.forEach(element => {
        let _categoryCount = element?.animalsObserved;
        totalCowsCount += _categoryCount;
      });
    }
    return totalCowsCount;
  } catch (e) {
    console.log('getTotalCowsCountLocomotion fail', e);
    logEvent(
      'helpers -> locomotionHelper -> getTotalCowsCountLocomotion error',
      e,
    );
    return totalCowsCount;
  }
};

/**
 * Initialize locomotion tool data with static model structure
 * Generates a static model with predefined structure for locomotion tool
 * @param {Array} pensList - List of available pens (optional, for future use)
 * @param {Object} animalAnalysis - Animal analysis data (optional, for future use)
 * @returns {Object} - Static locomotion data model
 */
export const initializeLocomotionToolData = (
  pensList = [],
  animalAnalysis = null,
  site = null,
) => {
  try {
    // const pen = pensList[0];

    // const penCategories = setAnimalAnalysisCategory(
    //   pensList[0],
    //   animalAnalysis,
    // );
    // const herdCategories = setHerdCategory();

    // Generate static model data with the exact structure required
    const locomotionModel = {
      // id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      // createUser: "string",
      // lastModifyUser: "string",
      // createTimeUtc: "2025-06-10T08:53:55.209Z",
      // lastModifiedTimeUtc: "2025-06-10T08:53:55.209Z",
      // mobileLastUpdatedTime: "2025-06-10T08:53:55.209Z",
      // lastSyncTimeUtc: "2025-06-10T08:53:55.209Z",
      // visitId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      pens: [
        // {
        //   milkScoreThree: 0,
        //   milkScoreFour: 0,
        //   milkScoreFive: 0,
        //   penId: pen?.id || pen?.localId || pen?.sv_id,
        //   penName: pen?.name || pen?.value,
        //   totalAnimalsInPen: pen?.animals,
        //   daysInMilk: pen?.daysInMilk,
        //   milkProductionInKg: pen?.milk,
        //   categories: penCategories,
        //   // visitsSelected: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        //   isToolItemNew: true,
        // },
      ],
      herd: null,
      // {
      // categories: herdCategories,
      // pensForVisit: [
      //   {
      //     milkScoreThree: 0,
      //     milkScoreFour: 0,
      //     milkScoreFive: 0,
      //     penId: pen?.id || pen?.localId || pen?.sv_id,
      //     penName: pen?.name || pen?.value,
      //     totalAnimalsInPen: pen?.animals,
      //     daysInMilk: pen?.daysInMilk,
      //     milkProductionInKg: pen?.milk,
      //     categories: penCategories,
      //     // visitsSelected: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      //     isToolItemNew: true,
      //   },
      // ],
      // daysInMilk: site?.daysInMilk,
      // totalAnimalsInHerd: site?.lactatingAnimal,
      // milkProductionInKg: site?.milk,
      // milkPriceAtSiteLevel: site?.currentMilkPrice,
      // },
      selectedPointScale: 'QuarterPointScale',
      new: true,
      deleted: false,
    };

    return locomotionModel;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> initializeLocomotionToolData error',
      error,
    );
    console.log(
      'helpers -> locomotionHelper -> initializeLocomotionToolData error',
      error,
    );

    return null;
  }
};

export function initializeLocomotionHerdData(locomotionData, siteData, unit) {
  try {
    if (locomotionData?.herd && Object.keys(locomotionData?.herd)?.length > 0) {
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const milkProductionInKg = convertDenominatorWeightToMetric(
          locomotionData?.herd?.milkProductionInKg,
        );
        locomotionData.herd.milkProductionInKg =
          convertNumberToString(milkProductionInKg);
      }

      return locomotionData?.herd;
    }

    if (locomotionData?.pens?.length > 0) {
      const herdCategories = setHerdCategory();

      let herdDataPayload = {
        categories: herdCategories,
        pensForVisit: locomotionData?.pens,
        daysInMilk: siteData?.daysInMilk,
        totalAnimalsInHerd: siteData?.lactatingAnimal,
        milkProductionInKg: siteData?.milk,
        milkPriceAtSiteLevel: siteData?.currentMilkPrice,
      };

      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const milkProductionInKg = convertDenominatorWeightToMetric(
          siteData?.milk,
        );
        herdDataPayload.milkProductionInKg =
          convertNumberToString(milkProductionInKg);
      }

      return herdDataPayload;
    }
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> initializeLocomotionHerdData error',
      error,
    );
    console.log(
      'helpers -> locomotionHelper -> initializeLocomotionHerdData error',
      error,
    );
    return null;
  }
}

export const isLocomotionPenUsed = (selectedPen, locomotionToolData) => {
  try {
    if (selectedPen) {
      const isPenExist = locomotionToolData?.pens?.find(
        item =>
          item?.penId === selectedPen?.id ||
          item?.penId === selectedPen?.localId ||
          item?.penId === selectedPen?.sv_id,
      );
      if (isPenExist) {
        return isPenExist;
      }
      return null;
    }
  } catch (error) {
    console.log('isLocomotionPenUsed error--', error);
    logEvent('helpers -> locomotionHelper -> isLocomotionPenUsed error', error);
    return null;
  }
};

export const initializeNewLocomotionPen = (selectedPen, animalAnalysis) => {
  try {
    if (selectedPen) {
      const penCategories = setAnimalAnalysisCategory(
        selectedPen,
        animalAnalysis,
      );

      const payload = {
        milkScoreThree: 0,
        milkScoreFour: 0,
        milkScoreFive: 0,
        penId: selectedPen?.id || selectedPen?.localId || selectedPen?.sv_id,
        penName: selectedPen?.name || selectedPen?.value,
        totalAnimalsInPen: selectedPen?.animals,
        daysInMilk: selectedPen?.daysInMilk,
        milkProductionInKg: selectedPen?.milk,
        categories: penCategories,
        isToolItemNew: true,
      };

      return payload;
    }
  } catch (error) {
    console.log('initializeNewLocomotionPen error--', error);
    logEvent(
      'helpers -> locomotionHelper -> initializeNewLocomotionPen error',
      error,
    );
    return null;
  }
};

// save pen analysis using locomotion tools
export const replaceSelectedPenInLocomotionData = (
  selectedPen,
  locomotionToolData,
) => {
  try {
    if (locomotionToolData?.pens) {
      const isPenExist = locomotionToolData?.pens?.find(
        item => item.penId === selectedPen?.penId,
      );
      if (!isPenExist) {
        locomotionToolData?.pens?.push(selectedPen);
      }

      locomotionToolData?.pens?.map(pen => {
        pen.categories = mappedStateToDb(pen?.categories);
      });
    }

    return locomotionToolData;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> replaceSelectedPenInLocomotionData error',
      error,
    );
    console.log('replaceSelectedPenInLocomotionData Exception', error);
  }
};

export function replaceAnimalAnalysisPenInLocomotionPens(
  animalAnalysisPens,
  locomotionToolData,
) {
  try {
    if (locomotionToolData?.pens?.length <= 0) {
      locomotionToolData.pens = animalAnalysisPens;

      return locomotionToolData;
    }

    if (animalAnalysisPens?.length > 0) {
      animalAnalysisPens?.map(item => {
        const isPenExist = locomotionToolData?.pens?.find(
          locomotionPen => locomotionPen?.penId === item?.penId,
        );
        if (isPenExist) {
          isPenExist?.categories?.map(catItem => {
            const sameCategory = item?.categories?.find(
              animalCategory => catItem?.category === animalCategory?.category,
            );
            catItem.animalsObserved =
              sameCategory?.animalsObserved + catItem.animalsObserved;
          });

          const updatedPenPayload = {
            ...isPenExist,
          };
          locomotionToolData?.pens?.find(pen => {
            if (pen?.penId === updatedPenPayload?.penId) {
              return updatedPenPayload;
            }
          });
        } else {
          locomotionToolData?.pens?.push(item);
        }
      });
    }

    return locomotionToolData;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> replaceAnimalAnalysisPenInLocomotionPens error',
      error,
    );
  }
}

export function initLocomotionSelectedPen(
  pensList,
  locomotionData,
  animalAnalysisData,
  unit,
) {
  try {
    /**
     * case 1:
     * if pens list have multiple pens and locomotion data also has multiple pens
     * in case of performing animal analysis this condition works
     */
    if (pensList?.length > 0 && locomotionData?.pens?.length > 0) {
      const selectedPen = locomotionData?.pens?.find(item =>
        pensList?.find(pen => {
          if (item.penId === pen?.id || item.penId === pen?.sv_id) {
            return item;
          }
        }),
      );

      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const milkProductionInKg = convertDenominatorWeightToMetric(
          selectedPen.milkProductionInKg,
        );
        selectedPen.milkProductionInKg =
          convertNumberToString(milkProductionInKg);
      } else {
        selectedPen.milkProductionInKg = convertNumberToString(
          selectedPen.milkProductionInKg,
        );
      }

      return selectedPen;
    }

    /**
     * @ignore
     * case 2:
     * if pens list have multiple pens and locomotion data does not have any pens used
     * and user visits animal analysis for locomotion
     * this case happens if user added any animal in animal analysis so we have at least one pen in animal analysis
     * @see this condition might not get executed ever because if animal analysis have animals
     * this locomotion pen already have some pens in it's data so in that condition the first CASE 1 will executed
     */
    const parsedAnimalAnalysisData = getParsedToolData(animalAnalysisData);
    if (
      pensList?.length > 0 &&
      locomotionData?.pens?.length <= 0 &&
      parsedAnimalAnalysisData?.animals &&
      parsedAnimalAnalysisData?.animals?.length > 0
    ) {
      const firstPen = pensList[0];

      const newSelectedPen = initializeNewLocomotionPen(
        firstPen,
        parsedAnimalAnalysisData,
      );
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const milkProductionInKg = convertDenominatorWeightToMetric(
          newSelectedPen.milkProductionInKg,
        );
        newSelectedPen.milkProductionInKg =
          convertNumberToString(milkProductionInKg);
      } else {
        newSelectedPen.milkProductionInKg = convertNumberToString(
          newSelectedPen.milkProductionInKg,
        );
      }

      return newSelectedPen;
    }

    /**
     * case 3:
     * if pens list have multiple pens and locomotion data does not have any pens used
     * this case happens if user does not add any animal in animal analysis so we do not have pens in locomotion data
     */
    if (pensList?.length > 0 && locomotionData?.pens?.length <= 0) {
      const firstPen = pensList[0];

      const newSelectedPen = initialPenAnalysis(firstPen);
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const milkProductionInKg = convertDenominatorWeightToMetric(
          newSelectedPen.milkProductionInKg,
        );
        newSelectedPen.milkProductionInKg =
          convertNumberToString(milkProductionInKg);
      } else {
        newSelectedPen.milkProductionInKg = convertNumberToString(
          newSelectedPen.milkProductionInKg,
        );
      }
      return newSelectedPen;
    }

    /**
     * case 4:
     * if there is no pens in pens List but locomotion data contains pens
     * this happens when user perform locomotion and add pens in locomotion but
     * after that user deletes this pen and site does not have any pens but locomotion data have pens
     */
    if (pensList?.length <= 0 && locomotionData?.pens?.length > 0) {
      const locomotionPen = locomotionData?.pens[0];
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        const milkProductionInKg = convertDenominatorWeightToMetric(
          locomotionPen.milkProductionInKg,
        );
        locomotionPen.milkProductionInKg =
          convertNumberToString(milkProductionInKg);
      } else {
        locomotionPen.milkProductionInKg = convertNumberToString(
          locomotionPen.milkProductionInKg,
        );
      }
      return locomotionPen;
    }

    return null;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> initLocomotionSelectedPen error',
      error,
    );
    console.log('initLocomotionSelectedPen Exception', error);
    return [];
  }
}

export function createLocomotionPenPayload(selectedPen, unitOfMeasure) {
  try {
    const milkProductionInKg =
      unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(
            convertStringToNumber(selectedPen?.milkProductionInKg),
          )
        : parseFloat(convertStringToNumber(selectedPen?.milkProductionInKg));

    const payload = {
      ...selectedPen,
      milkProductionInKg: milkProductionInKg,
    };

    return payload;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> createLocomotionPenPayload error',
      error,
    );
    console.log('createLocomotionPenPayload Exception', error);
  }
}

export function updateLocomotionPensModel(locomotionPens, selectedPen, unit) {
  try {
    selectedPen.milkProductionInKg =
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(
            convertStringToNumber(selectedPen?.milkProductionInKg),
          )
        : parseFloat(convertStringToNumber(selectedPen?.milkProductionInKg));

    let pens = upsertItem('penId', locomotionPens, selectedPen);

    return pens;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> updateLocomotionPensModel error',
      error,
    );
  }
}

export function updateLocomotionHerdModel(locomotionHerd, unitOfMeasure) {
  try {
    const herdData = { ...locomotionHerd };

    let milkProdKg = convertStringToNumber(locomotionHerd?.milkProductionInKg);
    if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
      milkProdKg = convertWeightToMetric(
        convertStringToNumber(locomotionHerd?.milkProductionInKg),
      );
    }

    herdData.categories = getFormattedHerdGoal(herdData);

    herdData.daysInMilk =
      !stringIsEmpty(locomotionHerd?.daysInMilk) &&
      locomotionHerd?.daysInMilk != '-'
        ? locomotionHerd?.daysInMilk
        : null;
    herdData.milkProductionInKg = locomotionHerd?.milkProductionInKg;
    herdData.totalAnimalsInHerd = locomotionHerd?.totalAnimalsInHerd;
    herdData.milkPriceAtSiteLevel = locomotionHerd?.milkPriceAtSiteLevel || '';

    return herdData;
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> updateLocomotionHerdModel error',
      error,
    );
    console.log('updateLocomotionHerdModel Exception', error);
  }
}

export const extractLocomotionPens = (penList, locomotionData) => {
  try {
    if (locomotionData) {
      const extractedPens = [];

      const parsedLocomotionData = getParsedToolData(locomotionData);
      parsedLocomotionData?.pens?.map(pen => {
        const isPenExist = penList.find(item => item?.sv_id === pen?.penId);
        if (!isPenExist) {
          extractedPens.push({
            ...isPenExist,
            ...pen,
          });
        } else {
          extractedPens.push(pen);
        }
      });

      return extractedPens;
    }

    return [];
  } catch (error) {
    logEvent(
      'helpers -> locomotionHelper -> extractLocomotionPens error',
      error,
    );
    return [];
  }
};
