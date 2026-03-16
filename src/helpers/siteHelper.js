import {
  MILKING_SYSTEM_CONSTANTS,
  MOBILE_APP_SITE_ORIGINATION,
  UNIT_OF_MEASURE,
} from '../constants/AppConstants';
import { SITE_FIELDS } from '../constants/FormConstants';
import i18n from '../localization/i18n';

import {
  stringIsEmpty,
  convertStringToNumber,
  convertNumberToString,
} from './alphaNumericHelper';
import {
  convertDenominatorWeightToImperial,
  convertDenominatorWeightToMetric,
  convertStringToFixedDecimals,
  convertWeightToImperial,
  convertWeightToMetric,
  getUnitOfMeasure,
} from './appSettingsHelper';

export const getDefaultFormValues = milkingSystemEnum => {
  //need to set it by default
  let parlor = milkingSystemEnum?.find(
    i => i.key === MILKING_SYSTEM_CONSTANTS.PARLOR,
  );

  return {
    // Step 1: General Customer
    [SITE_FIELDS.SITE_NAME]: '',
    [SITE_FIELDS.CURRENT_MILK_PRICE]: '',
    [SITE_FIELDS.MILKING_SYSTEM]: parlor ? parlor.key : '', //i18n.t('parlor'),
    [SITE_FIELDS.TOTAL_STALLS]: '',
    // Step 2: Animal Inputs
    [SITE_FIELDS.LACTATING_ANIMALS]: '',
    [SITE_FIELDS.DAYS_IN_MILK]: '',
    [SITE_FIELDS.MILK_YIELD]: '',
    [SITE_FIELDS.MILK_FAT]: '',
    [SITE_FIELDS.MILK_PROTEIN]: '',
    [SITE_FIELDS.MILK_OTHER_SOLIDS]: '',
    [SITE_FIELDS.SOMATIC_CELL_COUNT]: '',
    [SITE_FIELDS.BACTERIA_CELL_COUNT]: '',
    // Step 3: Diet Inputs
    [SITE_FIELDS.DRY_MATTER_INTAKE]: '',
    [SITE_FIELDS.AS_FED_INTAKE]: '',
    [SITE_FIELDS.NEL_DAIRY]: '',
    [SITE_FIELDS.RATION_COST]: '',
  };
};

export const createAddSiteObject = (
  values,
  accountId,
  localAccountId,
  unit,
  currentAuthUser,
) => {
  const data = {
    siteName: values[SITE_FIELDS.SITE_NAME],
    currentMilkPrice:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToMetric(
            values[SITE_FIELDS.CURRENT_MILK_PRICE],
          )
        : convertStringToNumber(values[SITE_FIELDS.CURRENT_MILK_PRICE]),
    milkingSystemType: values[SITE_FIELDS.MILKING_SYSTEM],
    numberOfParlorStalls: convertStringToNumber(
      values[SITE_FIELDS.TOTAL_STALLS],
    ),
    lactatingAnimal: !stringIsEmpty(values[SITE_FIELDS.LACTATING_ANIMALS])
      ? convertStringToNumber(values[SITE_FIELDS.LACTATING_ANIMALS])
      : null,
    daysInMilk: !stringIsEmpty(values[SITE_FIELDS.DAYS_IN_MILK])
      ? convertStringToNumber(values[SITE_FIELDS.DAYS_IN_MILK])
      : null,
    milk: !stringIsEmpty(values[SITE_FIELDS.MILK_YIELD])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[SITE_FIELDS.MILK_YIELD])
        : convertStringToNumber(values[SITE_FIELDS.MILK_YIELD])
      : null,
    milkFatPercent: convertStringToNumber(values[SITE_FIELDS.MILK_FAT]),
    milkProteinPercent: convertStringToNumber(values[SITE_FIELDS.MILK_PROTEIN]),
    milkOtherSolidsPercent: convertStringToNumber(
      values[SITE_FIELDS.MILK_OTHER_SOLIDS],
    ),
    milkSomaticCellCount: convertStringToNumber(
      values[SITE_FIELDS.SOMATIC_CELL_COUNT],
    ),
    bacteriaCellCount: convertStringToNumber(
      values[SITE_FIELDS.BACTERIA_CELL_COUNT],
    ),
    dryMatterIntake: !stringIsEmpty(values[SITE_FIELDS.DRY_MATTER_INTAKE])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[SITE_FIELDS.DRY_MATTER_INTAKE])
        : convertStringToNumber(values[SITE_FIELDS.DRY_MATTER_INTAKE])
      : null,
    asFedIntake: !stringIsEmpty(values[SITE_FIELDS.AS_FED_INTAKE])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[SITE_FIELDS.AS_FED_INTAKE])
        : convertStringToNumber(values[SITE_FIELDS.AS_FED_INTAKE])
      : null,
    netEnergyOfLactationDairy: !stringIsEmpty(values[SITE_FIELDS.NEL_DAIRY])
      ? unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToMetric(values[SITE_FIELDS.NEL_DAIRY])
        : convertStringToNumber(values[SITE_FIELDS.NEL_DAIRY])
      : null,
    rationCost: !stringIsEmpty(values[SITE_FIELDS.RATION_COST])
      ? convertStringToNumber(values[SITE_FIELDS.RATION_COST])
      : null,
    origination: MOBILE_APP_SITE_ORIGINATION,
    penCount: 0,
    accessIdentifier: currentAuthUser?.email || null,
  };
  if (accountId && !stringIsEmpty(accountId)) {
    data.accountId = accountId;
  } else {
    data.localAccountId = localAccountId;
  }
  return data;
};

export const createUpdateSiteObject = (values, site, unit, currentAuthUser) => {
  return {
    id: site.id,
    accountId: site.accountId,
    localAccountId: site.localAccountId,
    siteName: values[SITE_FIELDS.SITE_NAME],
    currentMilkPrice:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToMetric(
            values[SITE_FIELDS.CURRENT_MILK_PRICE],
          )
        : convertStringToNumber(values[SITE_FIELDS.CURRENT_MILK_PRICE]),
    milkingSystemType: values[SITE_FIELDS.MILKING_SYSTEM],
    numberOfParlorStalls: convertStringToNumber(
      values[SITE_FIELDS.TOTAL_STALLS],
    ),
    lactatingAnimal: convertStringToNumber(
      values[SITE_FIELDS.LACTATING_ANIMALS],
    ),
    daysInMilk: convertStringToNumber(values[SITE_FIELDS.DAYS_IN_MILK]),
    milk:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[SITE_FIELDS.MILK_YIELD])
        : convertStringToNumber(values[SITE_FIELDS.MILK_YIELD]),
    milkFatPercent: convertStringToNumber(values[SITE_FIELDS.MILK_FAT]),
    milkProteinPercent: convertStringToNumber(values[SITE_FIELDS.MILK_PROTEIN]),
    milkOtherSolidsPercent: convertStringToNumber(
      values[SITE_FIELDS.MILK_OTHER_SOLIDS],
    ),
    milkSomaticCellCount: convertStringToNumber(
      values[SITE_FIELDS.SOMATIC_CELL_COUNT],
    ),
    bacteriaCellCount: convertStringToNumber(
      values[SITE_FIELDS.BACTERIA_CELL_COUNT],
    ),
    dryMatterIntake:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[SITE_FIELDS.DRY_MATTER_INTAKE])
        : convertStringToNumber(values[SITE_FIELDS.DRY_MATTER_INTAKE]),
    asFedIntake:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(values[SITE_FIELDS.AS_FED_INTAKE])
        : convertStringToNumber(values[SITE_FIELDS.AS_FED_INTAKE]),
    netEnergyOfLactationDairy:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToMetric(values[SITE_FIELDS.NEL_DAIRY])
        : convertStringToNumber(values[SITE_FIELDS.NEL_DAIRY]),
    rationCost: convertStringToNumber(values[SITE_FIELDS.RATION_COST]),
    origination: MOBILE_APP_SITE_ORIGINATION,
    penCount: site.penCount,
    updated: true,
    accessIdentifier: currentAuthUser?.email || null,
  };
};

export const createInitialSiteFormValues = (data, unit) => {
  return {
    // Step 1: General Customer
    [SITE_FIELDS.SITE_NAME]: data?.siteName || '',
    [SITE_FIELDS.CURRENT_MILK_PRICE]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(
            convertDenominatorWeightToImperial(data?.currentMilkPrice, 3),
          )
        : convertNumberToString(
            convertStringToFixedDecimals(data?.currentMilkPrice, 3),
          ) || '',
    [SITE_FIELDS.MILKING_SYSTEM]: data?.milkingSystemType,
    [SITE_FIELDS.TOTAL_STALLS]:
      convertNumberToString(data?.numberOfParlorStalls) || '',
    // Step 2: Animal Inputs
    [SITE_FIELDS.LACTATING_ANIMALS]:
      convertNumberToString(data?.lactatingAnimal) || '',
    [SITE_FIELDS.DAYS_IN_MILK]: convertNumberToString(data?.daysInMilk) || '',
    [SITE_FIELDS.MILK_YIELD]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(convertWeightToImperial(data?.milk, 1))
        : convertNumberToString(convertStringToFixedDecimals(data?.milk, 1)) ||
          '',
    [SITE_FIELDS.MILK_FAT]: convertNumberToString(data?.milkFatPercent) || '',
    [SITE_FIELDS.MILK_PROTEIN]:
      convertNumberToString(data?.milkProteinPercent) || '',
    [SITE_FIELDS.MILK_OTHER_SOLIDS]:
      convertNumberToString(data?.milkOtherSolidsPercent) || '',
    [SITE_FIELDS.SOMATIC_CELL_COUNT]:
      convertNumberToString(data?.milkSomaticCellCount) || '',
    [SITE_FIELDS.BACTERIA_CELL_COUNT]:
      convertNumberToString(data?.bacteriaCellCount) || '',
    // Step 3: Diet Inputs
    [SITE_FIELDS.DRY_MATTER_INTAKE]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(
            convertWeightToImperial(data?.dryMatterIntake, 1),
          )
        : convertNumberToString(
            convertStringToFixedDecimals(data?.dryMatterIntake, 1),
          ) || '',
    [SITE_FIELDS.AS_FED_INTAKE]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(convertWeightToImperial(data?.asFedIntake, 1))
        : convertNumberToString(
            convertStringToFixedDecimals(data?.asFedIntake, 1),
          ) || '',
    [SITE_FIELDS.NEL_DAIRY]:
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertNumberToString(
            convertDenominatorWeightToImperial(
              data?.netEnergyOfLactationDairy,
              3,
            ),
          )
        : convertNumberToString(
            convertStringToFixedDecimals(data?.netEnergyOfLactationDairy, 3),
          ) || '',
    [SITE_FIELDS.RATION_COST]:
      convertNumberToString(
        convertStringToFixedDecimals(data?.rationCost, 2),
      ) || '',
  };
};

// get  pen search Box visible
export const getSearchBoxVisible = (filters, sitesList) => {
  let value = false;
  if (stringIsEmpty(filters?.startDate) && stringIsEmpty(filters?.endDate)) {
    value = true;
    return value;
  }
  if (!stringIsEmpty(filters?.search)) {
    value = true;
    return value;
  }
  if (filters?.pageNo != 0) {
    value = true;
    return value;
  }
  if (sitesList?.length > 0) {
    value = true;
  }
  return value;
};

export const getNELDairyUnit = userData => {
  const unit = getUnitOfMeasure(userData);
  if (unit) {
    if (unit === UNIT_OF_MEASURE.IMPERIAL) {
      return i18n.t('imperialNELDairyUnit');
    }
    return i18n.t('NELDairyUnit');
  }
  return '';
};
