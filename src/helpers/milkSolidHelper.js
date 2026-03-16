//constants
import {
  DATE_FORMATS,
  MilkSoldEvaluationDefaultOutputsValue,
  MILK_UREA_CONSTANT,
  MUN_CONSTANT,
  VISIT_STATUS,
  UNIT_OF_MEASURE,
  KG_REGEX,
  COUNTRY_IDs,
} from '../constants/AppConstants';
import {
  MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_CA,
  MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_GL,
  MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_IN,
  MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_CA,
  MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_GL,
  MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_IN,
  MILK_SOLD_GRAPH_COMPARISON,
} from '../constants/toolsConstants/MilkSoldEvaluationConstants';
import {
  MILK_SOLID_EVALUATION_FIELDS,
  PICKUP_FIELDS,
} from '../constants/FormConstants';

// localization
import i18n from '../localization/i18n';
import store from '../store';

//helpers
import {
  convertNumberToString,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import {
  convertDenominatorWeightToImperial,
  convertDenominatorWeightToMetric,
  convertStringToFixedDecimals,
  convertWeightToImperial,
  convertWeightToMetric,
  getCurrency,
} from './appSettingsHelper';
import { dateHelper, getFormattedDate } from './dateHelper';
import { logEvent } from './logHelper';
import { addSpace } from './genericHelper';

const initializeOutPut = outputData => {
  let obj = {
    averageBacteriaCount: outputData?.averageBacteriaCount || 0,
    averageMilkFatPer: outputData?.averageMilkFatPer || 0,
    averageMilkProduction: outputData?.averageMilkProduction || null,
    averageMilkProductionAnimalsTank:
      outputData?.averageMilkProductionAnimalsTank || null,
    averageMilkProteinPer: outputData?.averageMilkProteinPer || 0,
    averageMilkSolidNonFat: outputData?.averageMilkSolidNonFat || null,
    averageSCC: outputData?.averageSCC || 0,
    componentEfficiency: outputData?.componentEfficiency || null,
    evaluationDays: outputData?.evaluationDays || 0,
    feedEfficiency: outputData?.feedEfficiency || null,
    milkFatProteinYield: outputData?.milkFatProteinYield || 0,
    milkFatYield: outputData?.milkFatYield || 0,
    milkProteinYield: outputData?.milkProteinYield || 0,
    milkSolidNonFat: outputData?.milkSolidNonFat || null,
    mun: outputData?.mun || 0,
  };
  return obj;
};
// milk sold evaluation initial values set to Formik initial state Data
export const createMilkSolidEvaluationFromValues = (
  data,
  visitData,
  userData,
  publishVisit,
  unit,
  conversionNeeded = false,
) => {
  let milkSoldData = {};
  if (!stringIsEmpty(visitData)) {
    milkSoldData =
      typeof visitData == 'string' ? JSON.parse(visitData) : visitData;
    if (milkSoldData?.visitMilkEvaluationData) {
      milkSoldData = milkSoldData?.visitMilkEvaluationData;
    }
  }
  const obj = {
    [MILK_SOLID_EVALUATION_FIELDS.CURRENT_MILK_PRICE]:
      VISIT_STATUS.PUBLISHED == publishVisit
        ? convertNumberToString(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertDenominatorWeightToImperial(
              milkSoldData?.currentMilkPrice,
              3,
            )
            : convertStringToFixedDecimals(milkSoldData?.currentMilkPrice, 3),
          !conversionNeeded,
        )
        : convertNumberToString(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertDenominatorWeightToImperial(data?.currentMilkPrice, 3)
            : convertStringToFixedDecimals(data?.currentMilkPrice, 3),
          !conversionNeeded,
        ) || '',

    [MILK_SOLID_EVALUATION_FIELDS.LACTATING_ANIMALS]:
      VISIT_STATUS.PUBLISHED == publishVisit
        ? convertNumberToString(
          milkSoldData?.lactatingAnimal || milkSoldData?.lactatingAnimals,
          !conversionNeeded,
        )
        : convertNumberToString(
          data?.lactatingAnimal || data?.lactatingAnimals,
          !conversionNeeded,
        ) || '',

    [MILK_SOLID_EVALUATION_FIELDS.ANIMALS_IN_TANK]:
      VISIT_STATUS.PUBLISHED == publishVisit
        ? convertNumberToString(
          milkSoldData?.animalsInTank || milkSoldData?.animalsinTank,
          !conversionNeeded,
        ) || ''
        : !stringIsEmpty(
          milkSoldData?.animalsInTank || milkSoldData?.animalsinTank,
          !conversionNeeded,
        )
          ? convertNumberToString(
            milkSoldData?.animalsInTank || milkSoldData?.animalsinTank,
            !conversionNeeded,
          )
          : convertNumberToString(
            data?.lactatingAnimal || data?.lactatingAnimals,
            !conversionNeeded,
          ) || '',

    [MILK_SOLID_EVALUATION_FIELDS.DAYS_IN_MILK]:
      VISIT_STATUS.PUBLISHED == publishVisit
        ? convertNumberToString(milkSoldData?.daysInMilk, !conversionNeeded)
        : convertNumberToString(data?.daysInMilk, !conversionNeeded) || '',

    [MILK_SOLID_EVALUATION_FIELDS.DRY_MATTER_INTAKE]:
      VISIT_STATUS.PUBLISHED == publishVisit
        ? convertNumberToString(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToImperial(milkSoldData?.dryMatterIntake, 1)
            : convertStringToFixedDecimals(milkSoldData?.dryMatterIntake, 1),
          !conversionNeeded,
        )
        : convertNumberToString(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToImperial(data?.dryMatterIntake, 1)
            : convertStringToFixedDecimals(data?.dryMatterIntake, 1),
          !conversionNeeded,
        ) || '',

    [MILK_SOLID_EVALUATION_FIELDS.AS_FED_INTAKE]:
      VISIT_STATUS.PUBLISHED == publishVisit
        ? convertNumberToString(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToImperial(milkSoldData?.asFedIntake, 1)
            : convertStringToFixedDecimals(milkSoldData?.asFedIntake, 1),
          !conversionNeeded,
        )
        : convertNumberToString(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToImperial(data?.asFedIntake, 1)
            : convertStringToFixedDecimals(data?.asFedIntake, 1),
          !conversionNeeded,
        ) || '',

    [MILK_SOLID_EVALUATION_FIELDS.NEL_DAIRY]:
      VISIT_STATUS.PUBLISHED == publishVisit
        ? convertNumberToString(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertDenominatorWeightToImperial(
              milkSoldData?.netEnergyOfLactationDairy,
              3,
            )
            : convertStringToFixedDecimals(
              milkSoldData?.netEnergyOfLactationDairy,
              3,
            ),
          !conversionNeeded,
        )
        : convertNumberToString(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertDenominatorWeightToImperial(
              data?.netEnergyOfLactationDairy,
              3,
            )
            : convertStringToFixedDecimals(
              data?.netEnergyOfLactationDairy,
              3,
            ),
          !conversionNeeded,
        ) || '',

    [MILK_SOLID_EVALUATION_FIELDS.RATION_COST]:
      VISIT_STATUS.PUBLISHED == publishVisit
        ? convertNumberToString(milkSoldData?.rationCost, !conversionNeeded)
        : convertNumberToString(
          convertStringToFixedDecimals(data?.rationCost, 2),
          !conversionNeeded,
        ) || '',

    [MILK_SOLID_EVALUATION_FIELDS.MILK_PICK_UP]: stringIsEmpty(
      milkSoldData?.milkPickup,
    )
      ? userData?.defaultMilkPickup
      : milkSoldData?.milkPickup,
    [MILK_SOLID_EVALUATION_FIELDS.MILK_UREA_MEASURE]: stringIsEmpty(
      milkSoldData?.milkUreaMeasure,
    )
      ? userData?.defaultMilkUreaMeasure
      : milkSoldData?.milkUreaMeasure,

    [MILK_SOLID_EVALUATION_FIELDS.PICK_UP]: pickupInitialFromValues(
      milkSoldData?.pickups,
      conversionNeeded,
    ),
    [MILK_SOLID_EVALUATION_FIELDS.OUT_PUT]: initializeOutPut(
      milkSoldData?.outputs,
    ),
  };
  return obj;
};

export const pickupInitialFromValues = (data, conversionNeeded = false) => {
  let result = [];
  if (data?.length > 0) {
    data?.forEach(element => {
      const obj = pickupInitialValues(element, null, null, conversionNeeded);
      result.push(obj);
    });
  }
  return result;
};
// initialized pickup values
export const pickupInitialValues = (
  data,
  milkSoldData,
  unit,
  conversionNeeded = false,
) => {
  const obj = {
    [PICKUP_FIELDS.MILK_SOLID]: !stringIsEmpty(data?.milkSold)
      ? convertNumberToString(
        unit === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToImperial(
            convertStringToNumber(data?.milkSold, !conversionNeeded),
            2,
          )
          : data?.milkSold,
        !conversionNeeded,
      )
      : '',
    [PICKUP_FIELDS.ANIMALS_IN_TANK]: !stringIsEmpty(data?.animalsInTank)
      ? convertNumberToString(data?.animalsInTank, !conversionNeeded)
      : convertNumberToString(milkSoldData?.animalsInTank, !conversionNeeded),
    [PICKUP_FIELDS.DAYS_IN_TANK]: !stringIsEmpty(data?.daysInTank)
      ? convertNumberToString(data?.daysInTank, !conversionNeeded)
      : milkSoldData &&
        milkSoldData[MILK_SOLID_EVALUATION_FIELDS.MILK_PICK_UP] == 'Daily'
        ? '1'
        : '2',
    [PICKUP_FIELDS.MILK_FAT]: !stringIsEmpty(data?.milkFatPer)
      ? convertNumberToString(data?.milkFatPer, !conversionNeeded)
      : '',
    [PICKUP_FIELDS.MILK_PROTEIN]: !stringIsEmpty(data?.milkProteinPer)
      ? convertNumberToString(data?.milkProteinPer, !conversionNeeded)
      : '',
    [PICKUP_FIELDS.NON_FAT_SOLID]: !stringIsEmpty(data?.nonFatSolid)
      ? convertNumberToString(data?.nonFatSolid, !conversionNeeded)
      : '',
    [PICKUP_FIELDS.MUN_Milk_Urea]: !stringIsEmpty(data?.mun)
      ? convertNumberToString(data?.mun, !conversionNeeded)
      : '',
    [PICKUP_FIELDS.SOMATIC_CELL_COUNT]: !stringIsEmpty(data?.somaticCellCount)
      ? convertNumberToString(data?.somaticCellCount, !conversionNeeded)
      : '',
    [PICKUP_FIELDS.BACTERIA_CELL_COUNT]: !stringIsEmpty(data?.bacteriaCellCount)
      ? convertNumberToString(data?.bacteriaCellCount, !conversionNeeded)
      : '',
    [PICKUP_FIELDS.MASTITIS]: !stringIsEmpty(data?.mastitis)
      ? convertNumberToString(data?.mastitis, !conversionNeeded)
      : '',
  };
  return obj;
};
// save Milk Sold Evaluation data
export const onUpdateMilkSoldData = (
  data,
  visitData,
  siteData,
  weightUnit,
  unit,
) => {
  let visitDataConvertToNumber = getVisitDataConvertToNumber(data);

  if (data?.pickups?.length > 0) {
    let setPickupDataConvertToNumber = pickupDataConvertToNumbers(
      data?.pickups,
    );
    visitDataConvertToNumber.pickups = setPickupDataConvertToNumber;
  }

  let getCalculatedOutPut = getCalculatedOutPutData(
    visitDataConvertToNumber,
    siteData,
    unit,
  );

  visitDataConvertToNumber.outputs = getCalculatedOutPut;
  getOutputData(visitDataConvertToNumber, siteData, weightUnit);

  return visitDataConvertToNumber;
};
// Milk Sold Evaluation save data fields values convert String To Number
const getVisitDataConvertToNumber = (data, unit = null) => {
  let obj = {
    currentMilkPrice: stringIsEmpty(data?.currentMilkPrice)
      ? null
      : unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToMetric(
          convertStringToNumber(data?.currentMilkPrice),
        )
        : convertStringToNumber(data?.currentMilkPrice),
    lactatingAnimals: stringIsEmpty(data?.lactatingAnimal)
      ? null
      : convertStringToNumber(data?.lactatingAnimal),
    animalsinTank: stringIsEmpty(data?.animalsInTank)
      ? null
      : convertStringToNumber(data?.animalsInTank),

    milkPickup: data?.milkPickup,
    dryMatterIntake: stringIsEmpty(data?.dryMatterIntake)
      ? null
      : unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(convertStringToNumber(data?.dryMatterIntake))
        : convertStringToNumber(data?.dryMatterIntake),
    daysInMilk: stringIsEmpty(data?.daysInMilk)
      ? null
      : convertStringToNumber(data?.daysInMilk),

    milkUreaMeasure: data?.milkUreaMeasure,
    asFedIntake: stringIsEmpty(data?.asFedIntake)
      ? null
      : unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(convertStringToNumber(data?.asFedIntake))
        : convertStringToNumber(data?.asFedIntake),

    netEnergyOfLactationDairy: stringIsEmpty(data?.netEnergyOfLactationDairy)
      ? null
      : unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToMetric(
          convertStringToNumber(data?.netEnergyOfLactationDairy),
        )
        : convertStringToNumber(data?.netEnergyOfLactationDairy),

    rationCost: stringIsEmpty(data?.rationCost)
      ? null
      : convertStringToNumber(data?.rationCost),
  };
  return obj;
};

// Milk Sold Evaluation save pickups fields values convert String To Number
export const pickupDataConvertToNumbers = pickupData => {
  try {
    let pickups = pickupData?.map((x, index) => {
      return {
        ...x,
        milkSold: !stringIsEmpty(x?.milkSold)
          ? convertStringToNumber(x?.milkSold)
          : '',

        animalsInTank: !stringIsEmpty(x?.animalsInTank)
          ? convertStringToNumber(x?.animalsInTank)
          : '',

        daysInTank: !stringIsEmpty(x?.daysInTank)
          ? convertStringToNumber(x?.daysInTank)
          : '',

        bacteriaCellCount: !stringIsEmpty(x?.bacteriaCellCount)
          ? convertStringToNumber(x?.bacteriaCellCount)
          : null,

        mastitis: !stringIsEmpty(x?.mastitis)
          ? convertStringToNumber(x?.mastitis)
          : null,
        milkFatPer: !stringIsEmpty(x?.milkFatPer)
          ? convertStringToNumber(x?.milkFatPer)
          : null,
        milkProteinPer: !stringIsEmpty(x?.milkProteinPer)
          ? convertStringToNumber(x?.milkProteinPer)
          : null,

        mun: !stringIsEmpty(x?.mun) ? convertStringToNumber(x?.mun) : null,

        nonFatSolid: !stringIsEmpty(x?.nonFatSolid)
          ? convertStringToNumber(x?.nonFatSolid)
          : null,
        somaticCellCount: !stringIsEmpty(x?.somaticCellCount)
          ? convertStringToNumber(x?.somaticCellCount)
          : null,

        pickupId: 'pickupId' + (index + 1),
      };
    });

    return pickups;
  } catch (error) {
    logEvent(
      'helpers -> milkSoldHelper -> pickupDataConvertToNumbers exception',
      error,
    );
  }
};

export const getCalculatedOutPutData = (milkSoldData, siteData, unit) => {
  let evaluationDays = getEvaluationDays(milkSoldData);
  let averageMilkProduction = getAverageMilkProductions(
    milkSoldData,
    siteData,
    unit,
  );

  let averageMilkProductionAnimalsInTank =
    getAverageMilkProductionsAnimalsInTank(milkSoldData, siteData, unit);
  let averageMilkFat = getAverageMilkFat(milkSoldData, siteData);
  let averageMilkYield = getAverageMilkFatYield(milkSoldData, siteData, unit);
  let milkProteinYield = getAverageMilkProtein(milkSoldData, siteData);
  let averageMilkProtein = getAverageMilkProteinYield(
    milkSoldData,
    siteData,
    unit,
  );
  let milkFatProteinYield = getMilkFatProteinYield(
    milkSoldData,
    siteData,
    unit,
  );
  let componentEfficiency = getComponentsEfficiency(
    milkSoldData,
    siteData,
    unit,
  );
  let milkSolidNonFat = getMilkSoldNonFat(milkSoldData, siteData, unit);
  let feedEfficiencyRatio = getFeedEfficiencyRatio(
    milkSoldData,
    siteData,
    unit,
  );
  let MUNMilkUrea = getCalculateMuuMilkUrea(milkSoldData, siteData);
  let averageSomaticCellCount = getCalculateAverageSomaticCellCount(
    milkSoldData,
    siteData,
  );
  let averageBacteriaCellCount = getCalculateAverageBacteriaCellCount(
    milkSoldData,
    siteData,
  );
  let obj = {
    averageBacteriaCount: !stringIsEmpty(averageBacteriaCellCount)
      ? Number(averageBacteriaCellCount)
      : null,
    averageMilkFatPer: !stringIsEmpty(averageMilkFat)
      ? Number(averageMilkFat)
      : null,
    averageMilkProduction: !stringIsEmpty(averageMilkProduction)
      ? Number(averageMilkProduction)
      : null,
    averageMilkProductionAnimalsTank: !stringIsEmpty(
      averageMilkProductionAnimalsInTank,
    )
      ? Number(averageMilkProductionAnimalsInTank)
      : null,
    averageMilkProteinPer: !stringIsEmpty(averageMilkProtein)
      ? Number(averageMilkProtein)
      : null,
    averageMilkSolidNonFat: !stringIsEmpty(milkSolidNonFat)
      ? Number(milkSolidNonFat)
      : null,
    averageSCC: !stringIsEmpty(averageSomaticCellCount)
      ? Number(averageSomaticCellCount)
      : null,
    componentEfficiency: !stringIsEmpty(componentEfficiency)
      ? Number(componentEfficiency)
      : null,
    evaluationDays: !stringIsEmpty(evaluationDays)
      ? Number(evaluationDays)
      : null,
    feedEfficiency: !stringIsEmpty(feedEfficiencyRatio)
      ? Number(feedEfficiencyRatio)
      : null,
    milkFatProteinYield: !stringIsEmpty(milkFatProteinYield)
      ? Number(milkFatProteinYield)
      : null,
    milkFatYield: !stringIsEmpty(averageMilkYield)
      ? Number(averageMilkYield)
      : null,
    milkProteinYield: !stringIsEmpty(milkProteinYield)
      ? Number(milkProteinYield)
      : null,
    milkSolidNonFat: !stringIsEmpty(milkSolidNonFat)
      ? Number(milkSolidNonFat)
      : null,
    mun: !stringIsEmpty(MUNMilkUrea) ? Number(MUNMilkUrea) : null,
  };

  return obj;
};

export const getOutputData = (milkSoldData, siteData, weightUnit, unit) => {
  let data = [];
  const {
    userPreferences: { userPreferences },
    enums: {
      enum: { currencies = [] },
    },
  } = store.getState();

  const currency = getCurrency(currencies, userPreferences);
  let evaluationDays = getEvaluationDays(milkSoldData);

  let averageMilkProduction = getAverageMilkProductions(
    milkSoldData,
    siteData,
    unit,
  );
  let averageMilkProductionAnimalsInTank =
    getAverageMilkProductionsAnimalsInTank(milkSoldData, siteData, unit);

  let averageMilkFat = getAverageMilkFat(milkSoldData, siteData);

  let averageMilkYield = getAverageMilkFatYield(milkSoldData, siteData, unit);
  let milkProteinYield = getAverageMilkProtein(milkSoldData, siteData);

  let averageMilkProtein = getAverageMilkProteinYield(
    milkSoldData,
    siteData,
    unit,
  );
  let milkFatProteinYield = getMilkFatProteinYield(
    milkSoldData,
    siteData,
    unit,
  );
  let componentEfficiency = getComponentsEfficiency(
    milkSoldData,
    siteData,
    unit,
  );
  let milkSolidNonFat = getMilkSoldNonFat(milkSoldData, siteData, unit);

  let feedEfficiencyRatio = getFeedEfficiencyRatio(
    milkSoldData,
    siteData,
    unit,
  );
  let MUNMilkUrea = getCalculateMuuMilkUrea(milkSoldData, siteData);

  let averageSomaticCellCount = getCalculateAverageSomaticCellCount(
    milkSoldData,
    siteData,
  );
  let averageBacteriaCellCount = getCalculateAverageBacteriaCellCount(
    milkSoldData,
    siteData,
  );

  let iofc = getIOFC(averageMilkProductionAnimalsInTank, milkSoldData);

  data.push({ label: i18n.t('evaluationDays'), value: evaluationDays });
  data.push({
    label: `${i18n.t('averageMilkProductionKg')}`?.replace(
      KG_REGEX,
      weightUnit,
    ),
    value: averageMilkProduction,
  });

  data.push({
    label: `${i18n.t('averageMilkProductionAnimalsInTank')} (${weightUnit})`,
    value: averageMilkProductionAnimalsInTank,
  });

  data.push({ label: i18n.t('averageMilkFat'), value: averageMilkFat });
  data.push({
    label: `${i18n.t('averageMilkYield')} (${weightUnit})`,
    value: averageMilkYield,
  });

  data.push({
    label: `${i18n.t('averageMilkProtein')} (${i18n.t('%')})`,
    value: milkProteinYield,
  });
  data.push({
    label: `${i18n.t('milkProteinYield')} (${weightUnit})`,
    value: averageMilkProtein,
  });

  data.push({
    label: `${i18n.t('milkFatProteinYield')} (${weightUnit})`,
    value: milkFatProteinYield,
  });
  data.push({
    label: i18n.t('componentEfficiencyOfDMI'),
    value: componentEfficiency,
  });

  data.push({
    label: `${i18n.t('milkSolidNonFat')} (${weightUnit})`,
    value: milkSolidNonFat,
  });
  data.push({
    label: i18n.t('feedEfficiencyRatio'),
    value: feedEfficiencyRatio,
  });
  data.push({
    label: renderMilkUreaLabel(milkSoldData?.milkUreaMeasure),
    value: MUNMilkUrea,
  });
  data.push({
    label: i18n.t('averageSomaticCellCount'),
    value: averageSomaticCellCount,
  });
  data.push({
    label: i18n.t('averageBacteriaCellCount'),
    value: averageBacteriaCellCount,
  });
  data.push({
    label: `${i18n.t('IOFC')} (${currency}/${i18n.t('cow')})`,
    value: iofc,
  });
  return data;
};

//get Calculate Evaluation Days
export const getEvaluationDays = data => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  if (data?.pickups?.length > 0) {
    value += data?.pickups?.reduce((accumulator, object) => {
      return accumulator + Number(object?.daysInTank);
    }, 0);
    if (!value || Math.abs(value) == Infinity) {
      value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
    } else {
      value = Number(value)?.toFixed(2);
    }
  }
  return value;
};

//get Calculate Average Milk Production
export const getAverageMilkProductions = (data, siteData, unit) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  let newValue = MilkSoldEvaluationDefaultOutputsValue;
  if (data?.pickups?.length > 0) {
    value = data?.pickups?.reduce((accumulator, object) => {
      let milkSoldVal = Number(object.milkSold);
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        milkSoldVal = convertWeightToImperial(milkSoldVal);
      }
      //TODO:@Shahood
      return (
        accumulator +
        milkSoldVal / (data?.lactatingAnimal || data?.lactatingAnimals)
      );
    }, 0);

    newValue = value / Number(getEvaluationDays(data));
    if (!newValue || Math.abs(value) == Infinity) {
      newValue = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
    } else {
      newValue = newValue?.toFixed(2);
    }
  } else {
    newValue = !stringIsEmpty(siteData?.milk)
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToImperial(siteData?.milk, 2) + ''
        : siteData?.milk?.toFixed(2)
      : MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return newValue;
};

//get Calculate Average Milk Production
export const getAverageMilkProductionsAnimalsInTank = (
  data,
  siteData,
  unit,
) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  let newValue = MilkSoldEvaluationDefaultOutputsValue;
  if (data?.pickups?.length > 0) {
    value = data?.pickups?.reduce((accumulator, object) => {
      let milkSoldVal = Number(object.milkSold);
      if (unit === UNIT_OF_MEASURE.IMPERIAL) {
        milkSoldVal = convertWeightToImperial(milkSoldVal);
      }
      return accumulator + milkSoldVal / object?.animalsInTank;
    }, 0);
    newValue = value / getEvaluationDays(data);
    if (!newValue || Math.abs(value) == Infinity) {
      newValue = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
    } else {
      newValue = newValue?.toFixed(2);
    }
  } else {
    newValue = !stringIsEmpty(siteData?.milk)
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToImperial(siteData?.milk, 2) + ''
        : siteData?.milk?.toFixed(2)
      : MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return newValue;
};

//get Calculate Average Milk Fat
export const getAverageMilkFat = (data, siteData) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  if (data?.pickups?.length > 0) {
    value += data?.pickups?.reduce((accumulator, object) => {
      const milkFatPer =
        typeof object?.milkFatPer === 'string'
          ? parseFloat(Number(object?.milkFatPer))
          : object?.milkFatPer;

      return accumulator + milkFatPer;
    }, 0);

    if (!value || Math.abs(value) == Infinity) {
      value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
    } else {
      value = value / data?.pickups?.length;
      value = value?.toFixed(2);
    }
  } else {
    value = !stringIsEmpty(siteData?.milkFatPercent)
      ? siteData?.milkFatPercent?.toFixed(2)
      : MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return value;
};

//get Calculate Average Milk Fat Yield
export const getAverageMilkFatYield = (data, siteData, unit) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  let value1 = MilkSoldEvaluationDefaultOutputsValue;
  let avgMilkProduction = getAverageMilkProductionsAnimalsInTank(
    data,
    siteData,
    unit,
  );
  if (avgMilkProduction) {
    value = Number(avgMilkProduction);
    value1 = value * (Number(getAverageMilkFat(data, siteData)) / 100);
  }
  if (!value1 || Math.abs(value1) == Infinity) {
    value1 = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  } else {
    value1 = value1?.toFixed(2);
  }
  return value1;
};

//get Calculate Average Milk Protein
export const getAverageMilkProtein = (data, siteData) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  if (data?.pickups?.length > 0) {
    value = data?.pickups?.reduce((accumulator, object) => {
      const milkProteinPer =
        typeof object?.milkProteinPer === 'string'
          ? parseFloat(Number(object?.milkProteinPer))
          : object?.milkProteinPer;

      return accumulator + milkProteinPer;
    }, 0);
    if (!value || value == Infinity) {
      value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
    } else {
      value = value / data?.pickups?.length;
      value = value?.toFixed(2);
    }
  } else {
    value = !stringIsEmpty(siteData?.milkProteinPercent)
      ? siteData?.milkProteinPercent?.toFixed(2)
      : MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return value;
};

//get Calculate Average Milk Protein Yield
export const getAverageMilkProteinYield = (data, siteData, unit) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  let value1 = MilkSoldEvaluationDefaultOutputsValue;
  let avgMilkProduction = Number(
    getAverageMilkProductionsAnimalsInTank(data, siteData, unit),
  );

  if (avgMilkProduction) {
    value1 =
      (avgMilkProduction * Number(getAverageMilkProtein(data, siteData))) / 100;
  }

  if (!value1 || value1 == Infinity) {
    value1 = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  } else {
    value1 = value1?.toFixed(2);
  }
  return value1;
};

//get Calculate Average Milk Fat Protein Yield
export const getMilkFatProteinYield = (data, siteData, unit) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  value =
    Number(getAverageMilkProteinYield(data, siteData, unit)) +
    Number(getAverageMilkFatYield(data, siteData, unit));
  if (value) {
    value = value?.toFixed(2);
  } else {
    value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return value;
};

//get Calculate Component Efficiency Protein Yield
export const getComponentsEfficiency = (data, siteData, unit) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  value = Number(getMilkFatProteinYield(data, siteData, unit));
  value = (value / data?.dryMatterIntake) * 100;
  if (!value || Math.abs(value) == Infinity) {
    value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  } else {
    value = value?.toFixed(2);
  }
  return value;
};
//get Calculate  Milk Sold Non Fat
export const getMilkSoldNonFat = (data, siteData, unit) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  value = Number(getAverageMilkProductionsAnimalsInTank(data, siteData, unit));

  let count = 0;
  if (data?.pickups?.length > 0) {
    count = data?.pickups?.reduce((accumulator, object) => {
      return accumulator + Number(object?.nonFatSolid);
    }, 0);
    value = (value * count) / data?.pickups?.length;
    value = value / 100;
  }
  if (value) {
    value = value?.toFixed(2);
  } else {
    value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return value;
};

//get Calculate feed Efficiency ratio
export const getFeedEfficiencyRatio = (data, siteData, unit) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  value =
    Number(getAverageMilkProductionsAnimalsInTank(data, siteData, unit)) /
    Number(data?.dryMatterIntake);
  if (!value || Math.abs(value) == Infinity) {
    value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  } else {
    value = value?.toFixed(2);
  }
  return value;
};

//get Calculate Muu Milk Urea
export const getCalculateMuuMilkUrea = data => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  if (data?.pickups?.length > 0) {
    value += data?.pickups?.reduce((accumulator, object) => {
      const mun =
        typeof object?.mun === 'string'
          ? parseFloat(Number(object?.mun))
          : object?.mun;

      return accumulator + mun;
    }, 0);
    if (!value || Math.abs(value) == Infinity) {
      value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
    } else {
      value = value / data?.pickups?.length;
      value = value?.toFixed(2);
    }
  } else {
    value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return value;
};

//get Calculate Somatic Cell Count
export const getCalculateAverageSomaticCellCount = (data, siteData) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  if (data?.pickups?.length > 0) {
    value += data?.pickups?.reduce((accumulator, object) => {
      return accumulator + Number(object?.somaticCellCount);
    }, 0);
    if (!value || Math.abs(value) == Infinity) {
      value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
    } else {
      value = value / data?.pickups?.length;
      value = value?.toFixed(2);
    }
  } else {
    value = !stringIsEmpty(siteData?.milkSomaticCellCount)
      ? siteData?.milkSomaticCellCount?.toFixed(2)
      : MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return value;
};

//get Calculate Bacteria Cell Count
export const getCalculateAverageBacteriaCellCount = (data, siteData) => {
  let value = MilkSoldEvaluationDefaultOutputsValue;
  if (data?.pickups?.length > 0) {
    value += data?.pickups?.reduce((accumulator, object) => {
      return accumulator + Number(object?.bacteriaCellCount);
    }, 0);
    if (!value || Math.abs(value) == Infinity) {
      value = MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
    } else {
      value = value / data?.pickups?.length;
      value = value?.toFixed(2);
    }
  } else {
    value = !stringIsEmpty(siteData?.bacteriaCellCount)
      ? siteData?.bacteriaCellCount?.toFixed(2)
      : MilkSoldEvaluationDefaultOutputsValue.toFixed(2);
  }
  return value;
};

export const getIOFC = (averageMilkProductionAnimalsInTank, data) => {
  let milkPrice = data.currentMilkPrice;
  let totalDietCost = data.rationCost;

  if (milkPrice && totalDietCost && averageMilkProductionAnimalsInTank) {
    let revenuePerCowPerDay = parseFloat(
      (parseFloat(averageMilkProductionAnimalsInTank) * milkPrice).toFixed(2),
    );
    return revenuePerCowPerDay - totalDietCost;
  }
  return 0;
};

export const onUpdatedSiteData = (data, siteData, unit = null) => {
  let siteDataObj = {
    currentMilkPrice:
      unit === UNIT_OF_MEASURE.IMPERIAL && data?.netEnergyOfLactationDairy
        ? convertDenominatorWeightToMetric(data?.currentMilkPrice)
        : data?.currentMilkPrice,
    lactatingAnimal: data?.lactatingAnimal
      ? data?.lactatingAnimal
      : data?.lactatingAnimals,
    daysInMilk: data?.daysInMilk,
    dryMatterIntake:
      unit === UNIT_OF_MEASURE.IMPERIAL && data?.dryMatterIntake
        ? convertWeightToMetric(data?.dryMatterIntake)
        : data?.dryMatterIntake,
    asFedIntake:
      unit === UNIT_OF_MEASURE.IMPERIAL && data?.asFedIntake
        ? convertWeightToMetric(data?.asFedIntake)
        : data?.asFedIntake,
    netEnergyOfLactationDairy:
      unit === UNIT_OF_MEASURE.IMPERIAL && data?.netEnergyOfLactationDairy
        ? convertDenominatorWeightToMetric(data?.netEnergyOfLactationDairy)
        : data?.netEnergyOfLactationDairy,
    rationCost: data?.rationCost,
    updated: true,
    id: siteData?.id,
    siteName: siteData?.siteName,
  };

  return siteDataObj;
};

export const getAllMilkSoldOutPutData = milkSoldData => {
  if (
    milkSoldData &&
    milkSoldData?.outputs &&
    !stringIsEmpty(milkSoldData?.outputs) &&
    Object.keys(milkSoldData?.outputs)?.length > 0
  ) {
    return milkSoldData;
  } else if (
    milkSoldData?.visitMilkEvaluationData &&
    !stringIsEmpty(milkSoldData?.visitMilkEvaluationData?.outputs) &&
    Object.keys(milkSoldData?.visitMilkEvaluationData?.outputs)?.length > 0
  )
    return milkSoldData?.visitMilkEvaluationData;
  else {
    return {};
  }
};

export const getSetGraphValue = (
  recentVisit,
  selectedOption,
  conversionNeeded = false,
) => {
  let obj = {
    prop1: null,
    prop2: null,
    date: '',
  };
  let array = [];

  recentVisit?.map((a, ind) => {
    if (!stringIsEmpty(a.data) && !stringIsEmpty(a.outputs)) {
      // Check for existence of key, not just truthy value (0 is valid)
      const hasKey1InData = a.data?.[selectedOption.dbKey1] !== undefined;
      const hasKey1InOutputs = a.outputs?.[selectedOption.dbKey1] !== undefined;

      if (hasKey1InData || hasKey1InOutputs) {
        // Try to get value from data first, then fall back to outputs
        if (hasKey1InData) {
          const dataValue = convertStringToNumber(
            a.data[selectedOption.dbKey1],
            !conversionNeeded,
          );
          obj.prop1 = dataValue ?? 0;
        } else if (hasKey1InOutputs) {
          obj.prop1 = a.outputs[selectedOption.dbKey1] ?? 0;
        }

        if (selectedOption.dbKey1 === 'averageSCC') {
          obj.prop1 /= 1000;
        }
      }

      // Check for existence of key, not just truthy value (0 is valid)
      const hasKey2InData = a.data?.[selectedOption.dbKey2] !== undefined;
      const hasKey2InOutputs = a.outputs?.[selectedOption.dbKey2] !== undefined;

      if (hasKey2InData || hasKey2InOutputs) {
        // Try to get value from data first, then fall back to outputs
        if (hasKey2InData) {
          obj.prop2 = a.data[selectedOption.dbKey2] ?? 0;
        } else if (hasKey2InOutputs) {
          obj.prop2 = a.outputs[selectedOption.dbKey2] ?? 0;
        }
      }

      obj.date = getFormattedDate(a.date, DATE_FORMATS.MM_dd) + addSpace(ind);

      array.push(obj);
      obj = {
        prop1: null,
        prop2: null,
        date: '',
      };
    }
  });

  return array;
};

export const mapGraphDataForMilkSoldExport = (
  visitState,
  graphData,
  data,
  graphType,
  label1,
  label2,
) => {
  try {
    let mappedArray = [];
    mappedArray = graphData.map((item, ind) => {
      return {
        visitDate: item?.date,
        yaxisRight: item?.prop2,
        yaxisLeft: item?.prop1,
      };
    });
    const model = {
      fileName: visitState?.visitName + '-MilkSoldEvaluation1',
      visitName: visitState?.visitName,
      visitDate: dateHelper.getFormattedDate(
        visitState?.visitDate,
        DATE_FORMATS.MMM_DD_YY_H_MM,
      ),
      toolName: i18n.t('MilkSoldEvaluation'),
      chartType: graphType,
      dataPoints: mappedArray,
      yaxisLeftLabel: label1,
      yaxisRightLabel: label2,
    };
    return model;
  } catch (error) {
    logEvent(
      'helpers -> milkSoldHelper -> mapGraphDataForHerdAnalysisExport error',
      error,
    );
    console.log('mapGraphDataForHerdAnalysisExport => error', error);
  }
};

export const getDomain = data => {
  if (data && data.length > 0) {
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    return [minVal, maxVal];
  }
  return [0, 0];
};

export const renderMilkUreaLabel = milkUreaMeasureValue => {
  if (milkUreaMeasureValue == MUN_CONSTANT) return i18n.t('MUN(mg/dL)');
  else if (milkUreaMeasureValue == MILK_UREA_CONSTANT)
    return i18n.t('MilkUrea(mg/dL)');
  else return i18n.t('MUN(mg/dL)_Milk Urea(mg/dL)');
};

export const getDIMMinByCountry = countryId => {
  switch (countryId.toLowerCase()) {
    case COUNTRY_IDs.INDIA:
      return MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_IN;

    case COUNTRY_IDs.CANADA:
      return MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_CA;

    default:
      return MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_GL;
  }
};

export const getDIMMaxByCountry = countryId => {
  switch (countryId.toLowerCase()) {
    case COUNTRY_IDs.INDIA:
      return MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_IN;

    case COUNTRY_IDs.CANADA:
      return MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_CA;

    default:
      return MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_GL;
  }
};

export const getMinMaxByGraphType = (graphType, countryId) => {
  let graphArray = MILK_SOLD_GRAPH_COMPARISON();

  switch (graphType) {
    case graphArray[0].graphType:
      return {
        leftMinMax: {
          min: countryId.toLowerCase() == COUNTRY_IDs.INDIA ? 0 : 20,
          max: 60,
        },
        rightMinMax: {
          min: getDIMMinByCountry(countryId),
          max: getDIMMaxByCountry(countryId),
        },
      };

    case graphArray[1].graphType:
      return {
        leftMinMax: { min: 0, max: 5 },
        rightMinMax: {
          min: 8,
          max: 15,
        },
      };

    case graphArray[2].graphType:
      return {
        leftMinMax: { min: 2.5, max: 7 },
        rightMinMax: {
          min: 2.5,
          max: 7,
        },
      };

    case graphArray[3].graphType:
      return {
        leftMinMax: {
          min: 25,
          max: [
            COUNTRY_IDs.FRANCE,
            COUNTRY_IDs.ITALY,
            COUNTRY_IDs.RUSSIA,
          ].includes(countryId.toLowerCase())
            ? 600
            : 500,
        },
        rightMinMax: {
          min: 0,
          max: [
            COUNTRY_IDs.FRANCE,
            COUNTRY_IDs.ITALY,
            COUNTRY_IDs.RUSSIA,
          ].includes(countryId.toLowerCase())
            ? 35
            : 20,
        },
      };

    case graphArray[4].graphType:
      return {
        leftMinMax: { min: 15, max: 35 },
        rightMinMax: {
          min: 0.5,
          max: 2.25,
        },
      };

    default:
      return {
        leftMinMax: { min: 0, max: 0 },
        rightMinMax: { min: 0, max: 0 },
      };
  }
};
