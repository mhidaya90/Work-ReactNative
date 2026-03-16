import { UNIT_OF_MEASURE, USER_CREATED_PEN } from '../constants/AppConstants';
import { PEN_FIELDS } from '../constants/FormConstants';
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
} from './appSettingsHelper';
import { getParsedToolData } from './genericHelper';
import { logEvent } from './logHelper';

export const getDefaultFormValues = diet => {
  return {
    [PEN_FIELDS.PEN_NAME]: '',
    [PEN_FIELDS.DIET]: '',
    [PEN_FIELDS.ANIMAL_CLASS]: '',
    [PEN_FIELDS.BARN_NAME]: '',
    [PEN_FIELDS.HOUSING_SYSTEM]: '',
    [PEN_FIELDS.DAYS_IN_MILK]: '',
    [PEN_FIELDS.NUMBER_OF_STALLS]: '',
    [PEN_FIELDS.FEEDING_SYSTEM]: '',
    [PEN_FIELDS.MILKING_FREQUNCY]: '',
    [PEN_FIELDS.ANIMLA_PER_PEN]: '',
    [PEN_FIELDS.MILK_YIELD]: '',
    [PEN_FIELDS.DRY_MATTER_INTAKE]: '',
    [PEN_FIELDS.AS_FED_INTAKE]: '',
    [PEN_FIELDS.NEL_DAIRY]: '',
    [PEN_FIELDS.RATION_COST]: '',
    // added optimization type key and diet source key for Max validation and DDW
    [PEN_FIELDS.OPTIMIZATION_TYPE]: null,
    [PEN_FIELDS.DIET_SOURCE]: null,
  };
};

/**
 *
 * @description
 * function to generate initial form values for pen form
 * added @param {Boolean} isSystemGenerated for checking is dietSource is @constant SYSTEM_GENERATED then we need to remove diet from pen setup
 *
 * @param {Object} values values of pen object to set in initial form values
 * @param {String} unit unit to check if calculations showing is in imperial or metrics system
 * @param {Boolean} isSystemGeneratedDiet boolean add to validate if Pen's diet source is SYSTEM_GENERATE
 * @returns {Object} Pen object to set in initial form values
 */
export const viewPenObject = (values, unit, isSystemGeneratedDiet) => {
  return {
    [PEN_FIELDS.PEN_NAME]: values?.name,
    // added for the case of DDW work
    [PEN_FIELDS.DIET]:
      isSystemGeneratedDiet === true
        ? null
        : !stringIsEmpty(values?.dietId)
        ? values?.dietId
        : null,
    [PEN_FIELDS.DIET_SOURCE]: !stringIsEmpty(values?.[PEN_FIELDS.DIET_SOURCE])
      ? values?.[PEN_FIELDS.DIET_SOURCE]
      : null,
    [PEN_FIELDS.ANIMAL_CLASS]: values?.animalClassId,
    [PEN_FIELDS.BARN_NAME]: values?.barnName,
    [PEN_FIELDS.HOUSING_SYSTEM]: values?.housingSystemType,
    [PEN_FIELDS.DAYS_IN_MILK]:
      values?.daysInMilk !== '' && values?.daysInMilk != null
        ? values?.daysInMilk?.toString()
        : '',
    [PEN_FIELDS.NUMBER_OF_STALLS]: convertNumberToString(
      values?.numberOfStalls,
    ),
    [PEN_FIELDS.FEEDING_SYSTEM]: values?.feedingSystemType,
    [PEN_FIELDS.MILKING_FREQUNCY]: convertNumberToString(
      values?.milkingFrequency,
    ),
    [PEN_FIELDS.ANIMLA_PER_PEN]: convertNumberToString(values?.animals),
    [PEN_FIELDS.MILK_YIELD]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(convertWeightToImperial(values?.milk, 1))
        : convertNumberToString(values?.milk),
    [PEN_FIELDS.DRY_MATTER_INTAKE]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(
            convertWeightToImperial(values?.dryMatterIntake, 1),
          )
        : convertNumberToString(
            convertStringToFixedDecimals(values?.dryMatterIntake, 1),
          ),
    [PEN_FIELDS.AS_FED_INTAKE]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(convertWeightToImperial(values?.asFedIntake, 1))
        : convertNumberToString(
            convertStringToFixedDecimals(values?.asFedIntake, 1),
          ),
    [PEN_FIELDS.NEL_DAIRY]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(
            convertDenominatorWeightToImperial(
              values?.netEnergyOfLactationDairy,
              2,
            ),
          )
        : convertNumberToString(
            convertStringToFixedDecimals(values?.netEnergyOfLactationDairy, 2),
          ),
    [PEN_FIELDS.RATION_COST]: convertNumberToString(
      convertStringToFixedDecimals(values?.rationCostPerAnimal, 2),
    ),
    // retrieving optimization type other wise setting default to null
    [PEN_FIELDS.OPTIMIZATION_TYPE]: !stringIsEmpty(
      values?.[PEN_FIELDS.OPTIMIZATION_TYPE],
    )
      ? values?.[PEN_FIELDS.OPTIMIZATION_TYPE]
      : null,
    updated: true,
  };
};

export const updatePenObject = (values, pen, unit) => {
  return {
    id: pen?.sv_id,
    localId: pen?.id,
    accountId: pen?.accountId,
    siteId: pen?.siteId,
    barnId: pen?.barnId,
    dietId: values[PEN_FIELDS.DIET],
    animalClassId: values[PEN_FIELDS.ANIMAL_CLASS],
    name: values[PEN_FIELDS.PEN_NAME],
    barnName: values[PEN_FIELDS.BARN_NAME],
    housingSystemType: values[PEN_FIELDS.HOUSING_SYSTEM],
    feedingSystemType: values[PEN_FIELDS.FEEDING_SYSTEM],
    numberOfStalls: convertStringToNumber(values[PEN_FIELDS.NUMBER_OF_STALLS]),
    milkingFrequency: convertStringToNumber(
      values[PEN_FIELDS.MILKING_FREQUNCY],
    ),
    animals: convertStringToNumber(values[PEN_FIELDS.ANIMLA_PER_PEN]),
    daysInMilk:
      values?.[PEN_FIELDS.DAYS_IN_MILK] !== '' &&
      values?.[PEN_FIELDS.DAYS_IN_MILK] != null
        ? convertStringToNumber(values[PEN_FIELDS.DAYS_IN_MILK])
        : null,
    milk: !stringIsEmpty(values[PEN_FIELDS.MILK_YIELD])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[PEN_FIELDS.MILK_YIELD])
        : convertStringToNumber(values[PEN_FIELDS.MILK_YIELD])
      : null,
    dryMatterIntake: !stringIsEmpty(values[PEN_FIELDS.DRY_MATTER_INTAKE])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[PEN_FIELDS.DRY_MATTER_INTAKE])
        : convertStringToNumber(values[PEN_FIELDS.DRY_MATTER_INTAKE])
      : null,
    asFedIntake: !stringIsEmpty(values[PEN_FIELDS.AS_FED_INTAKE])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[PEN_FIELDS.AS_FED_INTAKE])
        : convertStringToNumber(values[PEN_FIELDS.AS_FED_INTAKE])
      : null,
    rationCostPerAnimal: convertStringToNumber(values[PEN_FIELDS.RATION_COST]),
    isDeleted: pen?.isDeleted,
    isMapped: pen?.isMapped,
    associatedPens: pen?.associatedPens,
    createUser: pen?.createUser,
    netEnergyOfLactationDairy: !stringIsEmpty(values[PEN_FIELDS.NEL_DAIRY])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToMetric(values[PEN_FIELDS.NEL_DAIRY])
        : convertStringToNumber(values[PEN_FIELDS.NEL_DAIRY])
      : null,
    // setting new optimization type if user select diet also added diet source
    optimizationType: !stringIsEmpty(values[PEN_FIELDS.OPTIMIZATION_TYPE])
      ? values[PEN_FIELDS.OPTIMIZATION_TYPE]
      : null,
    dietSource: values[PEN_FIELDS.DIET_SOURCE],
    groupId: pen?.groupId,
    updatedDate: new Date(),
    status: pen?.status,
    message: pen?.message,
    updated: true,
  };
};

export const createAddPenObject = (
  values,
  siteId,
  localSiteId,
  unit,
  currentAuthUser,
) => {
  const data = {
    name: values[PEN_FIELDS.PEN_NAME],
    dietId: values[PEN_FIELDS.DIET],
    // optimization type added on creating new pen and selecting diet init
    // adding source when pen is local created
    source: USER_CREATED_PEN,
    dietSource: values[PEN_FIELDS.DIET_SOURCE] || null,
    optimizationType: values[PEN_FIELDS.OPTIMIZATION_TYPE],
    animalClassId: values[PEN_FIELDS.ANIMAL_CLASS],
    barnName: values[PEN_FIELDS.BARN_NAME],
    housingSystemType: values[PEN_FIELDS.HOUSING_SYSTEM],
    numberOfStalls: convertStringToNumber(values[PEN_FIELDS.NUMBER_OF_STALLS]),
    feedingSystemType: values[PEN_FIELDS.FEEDING_SYSTEM],
    milkingFrequency: convertStringToNumber(
      values[PEN_FIELDS.MILKING_FREQUNCY],
    ),
    animals: convertStringToNumber(values[PEN_FIELDS.ANIMLA_PER_PEN]),
    // daysInMilk: convertStringToNumber(values[PEN_FIELDS.DAYS_IN_MILK]),
    daysInMilk:
      values?.[PEN_FIELDS.DAYS_IN_MILK] !== '' &&
      values?.[PEN_FIELDS.DAYS_IN_MILK] != null
        ? convertStringToNumber(values[PEN_FIELDS.DAYS_IN_MILK])
        : null,
    milk: !stringIsEmpty(values[PEN_FIELDS.MILK_YIELD])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[PEN_FIELDS.MILK_YIELD])
        : convertStringToNumber(values[PEN_FIELDS.MILK_YIELD])
      : null,
    dryMatterIntake: !stringIsEmpty(values[PEN_FIELDS.DRY_MATTER_INTAKE])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[PEN_FIELDS.DRY_MATTER_INTAKE])
        : convertStringToNumber(values[PEN_FIELDS.DRY_MATTER_INTAKE])
      : null,
    asFedIntake: !stringIsEmpty(values[PEN_FIELDS.AS_FED_INTAKE])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[PEN_FIELDS.AS_FED_INTAKE])
        : convertStringToNumber(values[PEN_FIELDS.AS_FED_INTAKE])
      : null,
    netEnergyOfLactationDairy: !stringIsEmpty(values[PEN_FIELDS.NEL_DAIRY])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToMetric(values[PEN_FIELDS.NEL_DAIRY])
        : convertStringToNumber(values[PEN_FIELDS.NEL_DAIRY])
      : null,
    rationCostPerAnimal: convertStringToNumber(values[PEN_FIELDS.RATION_COST]),
    accessIdentifier: currentAuthUser?.email || null,
  };
  if (siteId && !stringIsEmpty(siteId)) {
    data.siteId = siteId;
  } else {
    data.localSiteId = localSiteId;
  }
  return data;
};

// get  pen search Box visible
export const getSearchBoxVisible = (filters, penList) => {
  let value = false;
  if (filters?.animalClassfilter?.length > 0) {
    value = true;
    return value;
  }
  if (!stringIsEmpty(filters?.search)) {
    value = true;
    return value;
  }
  if (penList?.length > 0) {
    value = true;
  }
  return value;
};

export const filterPensByAnimalClass = (penList, animalClassFilter) => {
  if (penList?.length > 0 && animalClassFilter?.length > 0) {
    const filteredPens = penList.filter(item =>
      animalClassFilter.includes(item?.animalClassId),
    );

    return filteredPens;
  }

  return penList;
};

export const searchPensByPenName = (penList, searchTerm) => {
  if (penList?.length > 0 && searchTerm?.length > 0) {
    const filteredPens = penList.filter(item =>
      item.value.toLowerCase().match(searchTerm.toLowerCase()),
    );

    return filteredPens;
  }

  return penList;
};

export const checkAndFilterUsedPensInVisits = (visits = [], payload) => {
  try {
    let visitsUsingDeletingPen = [];
    visits.map(visitItem => {
      const parsedUsedPens = getParsedToolData(visitItem?.usedPens);

      if (parsedUsedPens) {
        const usedPensToolKeys = Object.keys(parsedUsedPens);

        let toolsUsingPen = [];

        usedPensToolKeys.map(toolKey => {
          const isToolUsingPen = parsedUsedPens[toolKey]?.find(
            penId => penId === payload?.penId || penId === payload?.localPenId,
          );
          if (isToolUsingPen) {
            toolsUsingPen.push(toolKey);
          }
        });

        if (toolsUsingPen.length > 0) {
          const visitUsingPenPayload = {
            visitLocalId: visitItem?.id,
            sv_id: visitItem?.sv_id,
            visitName: visitItem?.visitName,
            visitDate: visitItem?.visitDate,
            visitStatus: visitItem?.visitStatus,
            createUser: visitItem?.createUser,
            toolsUsingPen: toolsUsingPen,
          };

          visitsUsingDeletingPen.push(visitUsingPenPayload);
        }
      }
    });

    return visitsUsingDeletingPen;
  } catch (error) {
    console.log('error checkAndFilterUsedPensInVisits', error);
    logEvent(
      'helpers -> penHelper -> checkAndFilterUsedPensInVisits Error:',
      error,
    );
    return [];
  }
};
