//constants
import {
  DATE_FORMATS,
  DECIMAL_PLACES,
  ENUM_CONSTANTS,
  UNIT_OF_MEASURE,
  VISIT_TABLE_FIELDS,
} from '../constants/AppConstants';
import {
  MILK_SOLID_EVALUATION_FIELDS,
  ROF_FIELDS,
} from '../constants/FormConstants';
import {
  ROF_MILKING_INGREDIENTS_TYPES,
  ROF_PRICE_LIST_TYPES,
  ROF_DECIMAL_PLACES,
  ROF_FORM_TYPES,
  ROF_FEEDING_INGREDIENTS_TYPES,
  ROF_GRAPH_TYPES,
  DEFAULT_BREED,
} from '../constants/toolsConstants/ROFConstants';

import customColor from '../constants/theme/variables/customColor';

//localization
import i18n from '../localization/i18n';

//helpers
import {
  convertNumberToString,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import { dateHelper, getFormattedDate } from './dateHelper';
import { getParsedToolData, isEmpty } from './genericHelper';
import { logEvent } from './logHelper';
import {
  convertDenominatorWeightToImperial,
  convertDenominatorWeightToMetric,
  convertWeightToImperial,
  convertWeightToMetric,
} from './appSettingsHelper';

//#region initialize ROF data

export const getParsedROFDataFromVisit = (visit, formType) => {
  try {
    visit = visit?.[VISIT_TABLE_FIELDS.ROF] || {};

    if (visit && typeof visit == 'string' && !stringIsEmpty(visit)) {
      visit = getParsedToolData(visit);
      visit = formType ? visit[formType] || {} : visit || {};
    } else {
      visit = visit ? (formType ? visit[formType] || {} : visit) : {};
    }
    return visit;
  } catch (e) {
    console.log('getParsedROFDataFromVisit error', { e, formType });
    logEvent('getParsedROFDataFromVisit error', { e, formType });
  }
};

export const initializeROFFormData = (
  formType,
  siteData = {},
  visitData = {},
  enumState,
  unit,
  isEditable,
  rofPriceList,
  previousROFVisitData = {},
) => {
  try {
    let toolData = visitData?.[VISIT_TABLE_FIELDS.ROF];

    if (typeof toolData == 'string' && !stringIsEmpty(toolData)) {
      toolData = getParsedToolData(toolData);
      toolData = toolData[formType] || {};
    } else {
      toolData = toolData ? toolData[formType] : {};
    }

    if (previousROFVisitData) {
      previousROFVisitData = getParsedROFDataFromVisit(
        previousROFVisitData,
        formType,
      );
    }

    let milkOutputMaxAllowed =
      toolData[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[ROF_FIELDS.MAX_ALLOWED] ??
      previousROFVisitData[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[
      ROF_FIELDS.MAX_ALLOWED
      ];

    let formObject = {
      [ROF_FIELDS.HERD_PROFILE]: getHerdProfileInitialFormValues(
        toolData,
        previousROFVisitData,
      ),

      //feeding
      [ROF_FIELDS.FEEDING]: getFeedingInitialFormValues(
        toolData,
        unit,
        siteData,
        enumState,
        isEditable,
        rofPriceList,
        previousROFVisitData,
        formType,
      ),
      [ROF_FIELDS.MILK_PRODUCTION]: getMilkProductionInitialFormValues(
        toolData,
        unit,
        visitData,
        rofPriceList,
        previousROFVisitData,
        siteData,
      ),
      [ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]: {
        [ROF_FIELDS.MAX_ALLOWED]: milkOutputMaxAllowed
          ? convertNumberToString(milkOutputMaxAllowed)
          : getMaxAllowedValue(rofPriceList),
      },
    };

    return formObject;
  } catch (e) {
    console.log('initializeROFFormData fail', e);
    logEvent('initializeROFFormData fail', {
      e,
      formType,
      visitData,
      previousROFVisitData,
    });
  }
};

const getHerdProfileInitialFormValues = (
  toolData = null,
  previousROFVisitData = null,
) => {
  try {
    let toolHerdProfileData = toolData[ROF_FIELDS.HERD_PROFILE] || {};
    let previousVisitHerdProfileData =
      previousROFVisitData?.[ROF_FIELDS.HERD_PROFILE] || {};
    let dataToShow = isEmpty(toolHerdProfileData)
      ? previousVisitHerdProfileData
      : toolHerdProfileData;

    return {
      [ROF_FIELDS.BREED]: dataToShow?.[ROF_FIELDS.BREED] || DEFAULT_BREED,
      [ROF_FIELDS.OTHER_BREED_TYPE]:
        dataToShow?.[ROF_FIELDS.OTHER_BREED_TYPE] || '',
      [ROF_FIELDS.FEEDING_TYPE]: dataToShow?.[ROF_FIELDS.FEEDING_TYPE] || '',
      [ROF_FIELDS.NUMBER_OF_TMR_GROUPS]: dataToShow?.[
        ROF_FIELDS.NUMBER_OF_TMR_GROUPS
      ]
        ? convertNumberToString(dataToShow?.[ROF_FIELDS.NUMBER_OF_TMR_GROUPS])
        : '',
      [ROF_FIELDS.TYPE_OF_SUPPLEMENT]:
        dataToShow?.[ROF_FIELDS.TYPE_OF_SUPPLEMENT] || '',
      [ROF_FIELDS.COOL_AID]: dataToShow?.[ROF_FIELDS.COOL_AID] || false,
      [ROF_FIELDS.FORTISSA_FIT]: dataToShow?.[ROF_FIELDS.FORTISSA_FIT] || false,
      [ROF_FIELDS.MUN]: dataToShow?.[ROF_FIELDS.MUN]
        ? convertNumberToString(dataToShow?.[ROF_FIELDS.MUN])
        : '',
      [ROF_FIELDS.MILKING_PER_DAY]: dataToShow?.[ROF_FIELDS.MILKING_PER_DAY]
        ? convertNumberToString(dataToShow?.[ROF_FIELDS.MILKING_PER_DAY])
        : '',
    };
  } catch (error) {
    console.log('getHerdProfileInitialFormValues fail', error);
    logEvent('getHerdProfileInitialFormValues fail', error);
  }
};

const getFeedingInitialFormValues = (
  toolData = null,
  unit,
  siteData,
  enumState,
  isEditable,
  rofPriceList,
  previousROFVisitData = null,
  formType,
) => {
  try {
    let toolFeedingData = toolData?.[ROF_FIELDS.FEEDING] || {};
    let previousVisitFeedingData =
      previousROFVisitData?.[ROF_FIELDS.FEEDING] || {};
    let dataToShow = isEmpty(toolFeedingData)
      ? previousVisitFeedingData
      : toolFeedingData;
    let lactatingCows =
      isEmpty(dataToShow?.[ROF_FIELDS.LACTATING_COWS]) &&
      siteData?.lactatingAnimal
        ? siteData?.lactatingAnimal
        : !isEmpty(dataToShow?.[ROF_FIELDS.LACTATING_COWS])
        ? dataToShow?.[ROF_FIELDS.LACTATING_COWS]
        : null;

    return {
      [ROF_FIELDS.LACTATING_COWS]:
        isEmpty(dataToShow?.[ROF_FIELDS.LACTATING_COWS]) &&
          siteData?.lactatingAnimal
          ? convertNumberToString(siteData?.lactatingAnimal)
          : !isEmpty(dataToShow?.[ROF_FIELDS.LACTATING_COWS])
            ? convertNumberToString(dataToShow?.[ROF_FIELDS.LACTATING_COWS])
            : '',
      [ROF_FIELDS.DAYS_IN_MILK]:
        isEmpty(dataToShow?.[ROF_FIELDS.DAYS_IN_MILK]) && siteData?.daysInMilk
          ? convertNumberToString(siteData?.daysInMilk)
          : !isEmpty(dataToShow?.[ROF_FIELDS.DAYS_IN_MILK])
            ? convertNumberToString(dataToShow?.[ROF_FIELDS.DAYS_IN_MILK])
            : '',

      //feeding ingredients
      [ROF_FIELDS.HOME_GROWN_FORAGES]: getFeedingIngredientsByType(
        ROF_FIELDS.HOME_GROWN_FORAGES,
        toolData,
        enumState,
        isEditable,
        rofPriceList[ROF_PRICE_LIST_TYPES.HOME_GROWN_FORAGES],
        previousVisitFeedingData,
        unit,
        lactatingCows,
        formType,
      ),
      [ROF_FIELDS.HOME_GROWN_GRAINS]: getFeedingIngredientsByType(
        ROF_FIELDS.HOME_GROWN_GRAINS,
        toolData,
        enumState,
        isEditable,
        rofPriceList[ROF_PRICE_LIST_TYPES.HOME_GROWN_GRAINS],
        previousVisitFeedingData,
        unit,
        lactatingCows,
        formType,
      ),
      [ROF_FIELDS.PURCHASE_BULK_FEED]: getFeedingIngredientsByType(
        ROF_FIELDS.PURCHASE_BULK_FEED,
        toolData,
        enumState,
        isEditable,
        [],
        previousVisitFeedingData,
        unit,
        lactatingCows,
        formType,
      ),
      [ROF_FIELDS.PURCHASE_BAG_FEED]: getFeedingIngredientsByType(
        ROF_FIELDS.PURCHASE_BAG_FEED,
        toolData,
        enumState,
        isEditable,
        [],
        previousVisitFeedingData,
        unit,
        lactatingCows,
        formType,
      ),
    };
  } catch (error) {
    console.log('getFeedingInitialFormValues fail', error);
    logEvent('getFeedingInitialFormValues fail', error);
  }
};

const getFeedingIngredientsByType = (
  type,
  toolData = {},
  enumState,
  isEditable = false,
  rofPriceList = [],
  previousVisitFeedingData = {},
  unit,
  lactatingCows = 0,
  formType,
) => {
  let data = [];

  try {
    toolData[ROF_FIELDS.FEEDING]?.[type]?.length > 0 &&
      toolData[ROF_FIELDS.FEEDING]?.[type]?.map(item => {
        data.push(
          getFeedingIngredientsFormValues(
            type,
            enumState,
            item,
            rofPriceList,
            unit,
            lactatingCows,
            formType,
            toolData[ROF_FIELDS.FEEDING]?.[type]
          ),
        );
      });

    if (isEditable) {
      if (data.length == 0) {
        // fetch feeding from previous visit if there's none from current
        previousVisitFeedingData?.[type]?.length > 0 &&
          previousVisitFeedingData?.[type]?.map(item => {
            data.push(
              getFeedingIngredientsFormValues(
                type,
                enumState,
                item,
                rofPriceList,
                unit,
                lactatingCows,
                formType,
                previousVisitFeedingData?.[type]
              ),
            );
          });

        //create default ones for following if nothing comes from previous visit too
        if (
          data.length == 0 &&
          type == ROF_FIELDS.HOME_GROWN_FORAGES
        ) {
          //add atleast one form for home grown forages if form is editable
          data.push(
            getFeedingIngredientsFormValues(
              type,
              enumState,
              {},
              rofPriceList,
              unit,
              lactatingCows,
              formType,
              toolData[ROF_FIELDS.FEEDING]?.[type]
            ),
          );
        }
      }
    }
  } catch (e) {
    console.log('getFeedingIngredientsByType fail', e);
    logEvent('getFeedingIngredientsByType fail', e);
  } finally {
    return data;
  }
};

const getFeedingIngredientsFormValues = (
  type,
  enumState,
  item = {},
  rofPriceList = [],
  unit,
  lactatingCows = 0,
  formType,
  ingredientsList = [],
) => {
  try {
    let formObject = {};
    let pricePerTon = 0;
    switch (type) {
      case ROF_FIELDS.HOME_GROWN_FORAGES:
        formObject[ROF_FIELDS.HOME_GROWN_FORAGE_TYPE] =
          item[ROF_FIELDS.HOME_GROWN_FORAGE_TYPE] ||
          enumState?.[ENUM_CONSTANTS.HOME_GROWN_FORAGE_TYPES][0].key;
        const forageTypeKey = formObject[ROF_FIELDS.HOME_GROWN_FORAGE_TYPE];
        const forageTypeList =
          enumState?.[ENUM_CONSTANTS.HOME_GROWN_FORAGE_TYPES] || [];
        const forageTypeMatch = forageTypeList.find(
          forage =>
            forage?.key === forageTypeKey ||
            forage?.name === forageTypeKey ||
            forage?.value === forageTypeKey,
        );
        const forageBaseName =
          (forageTypeMatch?.name ||
            forageTypeMatch?.value ||
            forageTypeKey ||
            '')
            .toString() || 'forage';

        const existingForageNames = (ingredientsList || [])
          .map(ingredient =>
            (ingredient?.[ROF_FIELDS.FORAGE_NAME] || '').toString().trim(),
          )
          .filter(Boolean);

        const existingForageNamesLower = existingForageNames.map(name =>
          name.toLowerCase(),
        );

        let forageName =
          (item[ROF_FIELDS.FORAGE_NAME] || '').toString().trim() || '';

        // Only generate a new name if forage name is empty or is a duplicate
        // If forage name already exists with a value, keep it
        if (!forageName) {
          const numberMatches = existingForageNames
            .map(name => {
              const match = name.match(
                new RegExp(`^${forageBaseName}\\s*(\\d+)$`, 'i'),
              );
              return match ? parseInt(match[1], 10) : null;
            })
            .filter(num => Number.isInteger(num));

          const usedNumbers = new Set(numberMatches);
          let nextNumber = 1;
          while (usedNumbers.has(nextNumber)) {
            nextNumber += 1;
          }

          forageName = `${forageBaseName} ${nextNumber}`;

          while (existingForageNamesLower.includes(forageName.toLowerCase())) {
            nextNumber += 1;
            forageName = `${forageBaseName} ${nextNumber}`;
          }
        }

        formObject[ROF_FIELDS.FORAGE_NAME] = forageName;
        pricePerTon = rofPriceList?.filter(p => {
          return p.name == formObject[ROF_FIELDS.HOME_GROWN_FORAGE_TYPE];
        })[0]?.price;

        break;
      case ROF_FIELDS.HOME_GROWN_GRAINS:
        formObject[ROF_FIELDS.HOME_GROWN_GRAINS_TYPE] =
          item[ROF_FIELDS.HOME_GROWN_GRAINS_TYPE] ||
          enumState?.[ENUM_CONSTANTS.HOME_GROWN_GRAIN_TYPES][0].key;
        formObject[ROF_FIELDS.GRAINS_NAME] = item[ROF_FIELDS.GRAINS_NAME] || '';
        pricePerTon = rofPriceList?.filter(p => {
          return p.name == formObject[ROF_FIELDS.HOME_GROWN_GRAINS_TYPE];
        })[0]?.price;
        break;
      case ROF_FIELDS.PURCHASE_BULK_FEED:
      case ROF_FIELDS.PURCHASE_BAG_FEED:
        formObject[ROF_FIELDS.FEED_NAME] = item[ROF_FIELDS.FEED_NAME] || '';
        break;
    }

    let totalHerdPerDay =
      item[ROF_FIELDS.TOTAL_HERD_PER_DAY] &&
      (unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToImperial(item[ROF_FIELDS.TOTAL_HERD_PER_DAY])
        : item[ROF_FIELDS.TOTAL_HERD_PER_DAY]);
    let dryMatter = item[ROF_FIELDS.DRY_MATTER];

    let totalDryMatter =
      calculateTotalKgOfDryMatter(
        totalHerdPerDay,
        dryMatter,
        lactatingCows,
        false,
        formType,
      ) || item[ROF_FIELDS.TOTAL_DRY_MATTER];

    formObject[ROF_FIELDS.TOTAL_HERD_PER_DAY] =
      (totalHerdPerDay && convertNumberToString(totalHerdPerDay)) || '';
    formObject[ROF_FIELDS.DRY_MATTER] =
      convertNumberToString(item[ROF_FIELDS.DRY_MATTER]) || '';
    formObject[ROF_FIELDS.TOTAL_DRY_MATTER] =
      (totalDryMatter && convertNumberToString(totalDryMatter)) || '';
    
    // Handle PRICE_PER_TON: prioritize saved value from item, fallback to pricePerTon from price list
    let pricePerTonValue = '';
    if (item?.[ROF_FIELDS.PRICE_PER_TON] !== undefined && item?.[ROF_FIELDS.PRICE_PER_TON] !== null && item?.[ROF_FIELDS.PRICE_PER_TON] !== '') {
      // If item has a price (could be string or number), use it
      pricePerTonValue = convertNumberToString(item[ROF_FIELDS.PRICE_PER_TON]);
    } else if (pricePerTon) {
      // Fallback to pricePerTon from price list (for forages/grains)
      pricePerTonValue = convertNumberToString(pricePerTon);
    }
    formObject[ROF_FIELDS.PRICE_PER_TON] = pricePerTonValue;

    return formObject;
  } catch (e) {
    console.log('getFeedingIngredientsFormValues fail', e);
    logEvent('getFeedingIngredientsFormValues fail', e);
  }
};

const getMilkPricePerTonValueByType = (rofPriceList = [], type, unit) => {
  try {
    let item = rofPriceList?.[ROF_PRICE_LIST_TYPES.MILK_PRICE_PER_TON]?.find(
      i => i.name === type,
    );
    let itemPrice =
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToImperial(item.price)
        : item.price;
    return item
      ? convertNumberToString(parseFloat(itemPrice.toFixed(DECIMAL_PLACES)))
      : '';
  } catch (e) {
    console.log('getMilkPricePerTonValueByType fail', e);
    logEvent('getMilkPricePerTonValueByType fail', e);
  }
};

const getPercentageKgPerHlValueByType = (rofPriceList = [], type) => {
  try {
    let item = rofPriceList?.[ROF_PRICE_LIST_TYPES.PERCENTAGE_KG_PER_HL]?.find(
      i => i.name === type,
    );

    return item
      ? convertNumberToString(parseFloat(item.value.toFixed(DECIMAL_PLACES)))
      : '';
  } catch (e) {
    console.log('getPercentageKgPerHlValueByType fail', e);
    logEvent('getPercentageKgPerHlValueByType fail', e);
  }
};

const getMilkProductionInitialFormValues = (
  toolData = {},
  unit,
  visitData,
  rofPriceList = [],
  previousROFVisitData = {},
  siteData = {},
) => {
  try {
    let toolMilkProductionData = toolData?.[ROF_FIELDS.MILK_PRODUCTION] || {};
    let previousVisitMilkProductionData =
      previousROFVisitData?.[ROF_FIELDS.MILK_PRODUCTION] || {};
    let dataToShow = isEmpty(toolMilkProductionData)
      ? previousVisitMilkProductionData
      : toolMilkProductionData;

    let feedingDataToShow = isEmpty(toolData?.[ROF_FIELDS.FEEDING])
      ? previousROFVisitData?.[ROF_FIELDS.FEEDING]
      : toolData?.[ROF_FIELDS.FEEDING];

    let milkSoldEvaluationData = {};
    //handle milk sold data
    if (!stringIsEmpty(visitData?.[VISIT_TABLE_FIELDS.MILK_SOLD_EVALUATION])) {
      milkSoldEvaluationData =
        typeof visitData?.[VISIT_TABLE_FIELDS.MILK_SOLD_EVALUATION] == 'string'
          ? JSON.parse(visitData?.[VISIT_TABLE_FIELDS.MILK_SOLD_EVALUATION])
          : visitData?.[VISIT_TABLE_FIELDS.MILK_SOLD_EVALUATION];
    }

    let averageMilkProductionAnimalsInTankKg =
      isEmpty(dataToShow?.[ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG]) &&
        milkSoldEvaluationData?.[MILK_SOLID_EVALUATION_FIELDS.OUT_PUT]
          ?.averageMilkProductionAnimalsTank
        ? milkSoldEvaluationData?.[MILK_SOLID_EVALUATION_FIELDS.OUT_PUT]
          ?.averageMilkProductionAnimalsTank
        : !isEmpty(dataToShow?.[ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG])
          ? dataToShow?.[ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG]
          : 0,
      lactatingCows =
        isEmpty(feedingDataToShow?.[ROF_FIELDS.LACTATING_COWS]) &&
          siteData?.lactatingAnimal
          ? siteData?.lactatingAnimal
          : !isEmpty(feedingDataToShow?.[ROF_FIELDS.LACTATING_COWS])
            ? feedingDataToShow?.[ROF_FIELDS.LACTATING_COWS]
            : 0,
      averageMilkProductionLitresPerCowPerDay =
        calculateAverageMilkProductionPerCowPerDay(
          averageMilkProductionAnimalsInTankKg,
          lactatingCows,
        ),
      kgOfQuotaPerDay =
        unit === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToImperial(
              dataToShow?.[ROF_FIELDS.KG_OF_QUOTA_PER_DAY],
            )
          : dataToShow?.[ROF_FIELDS.KG_OF_QUOTA_PER_DAY],
      totalQuotaKgPerDay = calculateTotalQuotaKgPerDay(
        kgOfQuotaPerDay,
        dataToShow?.[ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY],
        false,
      );

    return {
      [ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG]: convertNumberToString(
        averageMilkProductionAnimalsInTankKg,
      ),
      [ROF_FIELDS.MILK_PRODUCTION_KG]: convertNumberToString(
        averageMilkProductionLitresPerCowPerDay,
      ),
      [ROF_FIELDS.KG_OF_QUOTA_PER_DAY]: dataToShow?.[
        ROF_FIELDS.KG_OF_QUOTA_PER_DAY
      ]
        ? convertNumberToString(kgOfQuotaPerDay)
        : '',
      [ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY]: dataToShow?.[
        ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY
      ]
        ? convertNumberToString(
          dataToShow?.[ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY],
        )
        : '',
      [ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY]: dataToShow?.[
        ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY
      ]
        ? convertNumberToString(dataToShow?.[ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY])
        : '',
      [ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY]:
        (totalQuotaKgPerDay && convertNumberToString(totalQuotaKgPerDay)) || '',
      [ROF_FIELDS.CURRENT_QUOTA_UTILIZATION_KG_PER_DAY]: convertNumberToString(
        calculateCurrentQuotaUtilizationKgPerDay(
          averageMilkProductionAnimalsInTankKg,
          dataToShow?.[ROF_FIELDS.BUTTERFAT]?.[ROF_FIELDS.PERCENTAGE_PER_HL],
        ),
      ),
      [ROF_FIELDS.BUTTERFAT]: {
        [ROF_FIELDS.PRICE_PER_KG]: dataToShow?.[ROF_FIELDS.BUTTERFAT]?.[
          ROF_FIELDS.PRICE_PER_KG
        ]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.BUTTERFAT][ROF_FIELDS.PRICE_PER_KG],
          )
          : getMilkPricePerTonValueByType(rofPriceList, ROF_FIELDS.BUTTERFAT),
        [ROF_FIELDS.PERCENTAGE_PER_HL]: dataToShow?.[ROF_FIELDS.BUTTERFAT]?.[
          ROF_FIELDS.PERCENTAGE_PER_HL
        ]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.BUTTERFAT][ROF_FIELDS.PERCENTAGE_PER_HL],
          )
          : getPercentageKgPerHlValueByType(rofPriceList, ROF_FIELDS.BUTTERFAT),
        [ROF_FIELDS.KG_PER_COW]: convertNumberToString(
          calculateKgPerCow(
            averageMilkProductionLitresPerCowPerDay,
            dataToShow?.[ROF_FIELDS.BUTTERFAT]?.[ROF_FIELDS.PERCENTAGE_PER_HL],
          ),
        ),
      },

      [ROF_FIELDS.PROTEIN]: {
        [ROF_FIELDS.PRICE_PER_KG]: dataToShow?.[ROF_FIELDS.PROTEIN]?.[
          ROF_FIELDS.PRICE_PER_KG
        ]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.PROTEIN][ROF_FIELDS.PRICE_PER_KG],
          )
          : getMilkPricePerTonValueByType(rofPriceList, ROF_FIELDS.PROTEIN),
        [ROF_FIELDS.PERCENTAGE_PER_HL]: dataToShow?.[ROF_FIELDS.PROTEIN]?.[
          ROF_FIELDS.PERCENTAGE_PER_HL
        ]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.PROTEIN][ROF_FIELDS.PERCENTAGE_PER_HL],
          )
          : getPercentageKgPerHlValueByType(rofPriceList, ROF_FIELDS.PROTEIN),

        [ROF_FIELDS.KG_PER_COW]: convertNumberToString(
          calculateKgPerCow(
            averageMilkProductionLitresPerCowPerDay,
            dataToShow?.[ROF_FIELDS.PROTEIN]?.[ROF_FIELDS.PERCENTAGE_PER_HL],
          ),
        ),
      },

      [ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS]: {
        [ROF_FIELDS.PRICE_PER_KG]: dataToShow?.[
          ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
        ]?.[ROF_FIELDS.PRICE_PER_KG]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS][
            ROF_FIELDS.PRICE_PER_KG
            ],
          )
          : getMilkPricePerTonValueByType(
            rofPriceList,
            ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS,
          ),
        [ROF_FIELDS.PERCENTAGE_PER_HL]: dataToShow?.[
          ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
        ]?.[ROF_FIELDS.PERCENTAGE_PER_HL]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS][
            ROF_FIELDS.PERCENTAGE_PER_HL
            ],
          )
          : getPercentageKgPerHlValueByType(
            rofPriceList,
            ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS,
          ),

        [ROF_FIELDS.KG_PER_COW]: convertNumberToString(
          calculateKgPerCow(
            averageMilkProductionLitresPerCowPerDay,
            dataToShow?.[ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS]?.[
            ROF_FIELDS.PERCENTAGE_PER_HL
            ],
          ),
        ),
      },

      [ROF_FIELDS.CLASS2_PROTEIN]: {
        [ROF_FIELDS.PRICE_PER_KG]: dataToShow?.[ROF_FIELDS.CLASS2_PROTEIN]?.[
          ROF_FIELDS.PRICE_PER_KG
        ]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.CLASS2_PROTEIN][ROF_FIELDS.PRICE_PER_KG],
          )
          : getMilkPricePerTonValueByType(
            rofPriceList,
            ROF_FIELDS.CLASS2_PROTEIN,
          ),
      },

      [ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS]: {
        [ROF_FIELDS.PRICE_PER_KG]: dataToShow?.[
          ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS
        ]?.[ROF_FIELDS.PRICE_PER_KG]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS][
            ROF_FIELDS.PRICE_PER_KG
            ],
          )
          : getMilkPricePerTonValueByType(
            rofPriceList,
            ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS,
          ),
      },

      [ROF_FIELDS.DEDUCTIONS]: {
        [ROF_FIELDS.PRICE_PER_KG]: dataToShow?.[ROF_FIELDS.DEDUCTIONS]?.[
          ROF_FIELDS.PRICE_PER_KG
        ]
          ? convertNumberToString(
            dataToShow?.[ROF_FIELDS.DEDUCTIONS][ROF_FIELDS.PRICE_PER_KG],
          )
          : getMilkPricePerTonValueByType(rofPriceList, ROF_FIELDS.DEDUCTIONS),
      },
    };
  } catch (error) {
    console.log('getMilkProductionInitialFormValues fail', error);
    logEvent('getMilkProductionInitialFormValues fail', error);
  }
};

const getMaxAllowedValue = (rofPriceList = []) => {
  try {
    let maxAllowed = rofPriceList?.[ROF_PRICE_LIST_TYPES.OTHERS]?.find(
      i => i.name === ROF_FIELDS.MAX_ALLOWED,
    );

    return maxAllowed
      ? convertNumberToString(
        parseFloat(maxAllowed.value.toFixed(DECIMAL_PLACES)),
      )
      : '';
  } catch (e) {
    console.log('getMaxAllowedValue fail', e);
    logEvent('getMaxAllowedValue fail', e);
  }
};

/**
 * @description
 * helper function to map milk production output fields in milk production object.
 *
 * @param {Object} toolData
 * @returns
 */
export const getMilkProductionOutputsInitialFormValues = (
  values = null,
  toolData = null,
  unit,
  formType = ROF_FORM_TYPES.TMR,
  setFieldValue,
  conversionNeeded = false,
) => {
  try {
    //#region fetch params
    //KG/HL
    let proteinKgHl =
      toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
        ROF_FIELDS.PERCENTAGE_PER_HL
      ] ||
      convertStringToNumber(
        values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
        ROF_FIELDS.PERCENTAGE_PER_HL
        ],
      ) || 0;
    let lactoseAndOtherSolidsKgHl = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[
      ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
      ]?.[ROF_FIELDS.PERCENTAGE_PER_HL],
    );
    let butterfatKgHl = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.BUTTERFAT]?.[
      ROF_FIELDS.PERCENTAGE_PER_HL
      ],
    );

    //kg/cow
    let butterfatKgCow = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.BUTTERFAT]?.[
      ROF_FIELDS.KG_PER_COW
      ],
    );
    let proteinKgCow = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
      ROF_FIELDS.KG_PER_COW
      ],
    );
    let lactoseAndOtherSolidsKgCow = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[
      ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
      ]?.[ROF_FIELDS.KG_PER_COW],
    );

    // price/kg
    let butterfatPricePerKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.BUTTERFAT]?.[
      ROF_FIELDS.PRICE_PER_KG
      ],
    );
    let deductionsPricePerKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.DEDUCTIONS]?.[
      ROF_FIELDS.PRICE_PER_KG
      ],
    );
    let proteinPricePerKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
      ROF_FIELDS.PRICE_PER_KG
      ],
    );
    let class2ProteinPricePerKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.CLASS2_PROTEIN]?.[
      ROF_FIELDS.PRICE_PER_KG
      ],
    );
    let lactoseAndOtherSolidsPricePerKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[
      ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
      ]?.[ROF_FIELDS.PRICE_PER_KG],
    );
    let class2LactoseAndOtherSolidsPricePerKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[
      ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS
      ]?.[ROF_FIELDS.PRICE_PER_KG],
    );

    //milk production
    let milkProductionKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.MILK_PRODUCTION_KG],
    );
    //lactating cows
    let lactatingCows = convertStringToNumber(
      values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.LACTATING_COWS],
    );

    let forages = parseFeedingIngredientsForDB(
      values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.HOME_GROWN_FORAGES],
      unit,
      lactatingCows,
      formType,
    ),
      grains = parseFeedingIngredientsForDB(
        values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.HOME_GROWN_GRAINS],
        unit,
        lactatingCows,
        formType,
      ),
      bulkFeed = parseFeedingIngredientsForDB(
        values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.PURCHASE_BULK_FEED],
        unit,
        lactatingCows,
        formType,
      ),
      bagsFeed = parseFeedingIngredientsForDB(
        values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.PURCHASE_BAG_FEED],
        unit,
        lactatingCows,
        formType,
      );

    //kg/cow
    // let butterfatKgCow =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.BUTTERFAT]?.[
    //     ROF_FIELDS.KG_PER_COW
    //   ] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.BUTTERFAT]?.[
    //       ROF_FIELDS.KG_PER_COW
    //     ],
    //   );
    // let proteinKgCow =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
    //     ROF_FIELDS.KG_PER_COW
    //   ] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
    //       ROF_FIELDS.KG_PER_COW
    //     ],
    //   );
    // let lactoseAndOtherSolidsKgCow =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[
    //     ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
    //   ]?.[ROF_FIELDS.KG_PER_COW] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[
    //       ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
    //     ]?.[ROF_FIELDS.KG_PER_COW],
    //   );

    // price/kg
    // let butterfatPricePerKg =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.BUTTERFAT]?.[
    //     ROF_FIELDS.PRICE_PER_KG
    //   ] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.BUTTERFAT]?.[
    //       ROF_FIELDS.PRICE_PER_KG
    //     ],
    //   );
    // let deductionsPricePerKg =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.DEDUCTIONS]?.[
    //     ROF_FIELDS.PRICE_PER_KG
    //   ] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.DEDUCTIONS]?.[
    //       ROF_FIELDS.PRICE_PER_KG
    //     ],
    //   );
    // let proteinPricePerKg =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
    //     ROF_FIELDS.PRICE_PER_KG
    //   ] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
    //       ROF_FIELDS.PRICE_PER_KG
    //     ],
    //   );
    // let class2ProteinPricePerKg =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.CLASS2_PROTEIN]?.[
    //     ROF_FIELDS.PRICE_PER_KG
    //   ] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.CLASS2_PROTEIN]?.[
    //       ROF_FIELDS.PRICE_PER_KG
    //     ],
    //   );
    // let lactoseAndOtherSolidsPricePerKg =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[
    //     ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
    //   ]?.[ROF_FIELDS.PRICE_PER_KG] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[
    //       ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
    //     ]?.[ROF_FIELDS.PRICE_PER_KG],
    //   );
    // let class2LactoseAndOtherSolidsPricePerKg =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[
    //     ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS
    //   ]?.[ROF_FIELDS.PRICE_PER_KG] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[
    //       ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS
    //     ]?.[ROF_FIELDS.PRICE_PER_KG],
    //   );

    //milk production
    // let milkProductionKg =
    //   toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.MILK_PRODUCTION_KG] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.MILK_PRODUCTION_KG],
    //   );
    //lactating cows
    // let lactatingCows =
    //   toolData?.[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.LACTATING_COWS] ||
    //   convertStringToNumber(
    //     values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.LACTATING_COWS],
    //   );

    // let forages =
    //     toolData?.[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.HOME_GROWN_FORAGES] ||
    //     parseFeedingIngredientsForDB(
    //       values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.HOME_GROWN_FORAGES],
    //       !conversionNeeded && unit,
    //       lactatingCows,
    //       formType,
    //     ),
      // grains =
      //   toolData?.[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.HOME_GROWN_GRAINS] ||
      //   parseFeedingIngredientsForDB(
      //     values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.HOME_GROWN_GRAINS],
      //     !conversionNeeded && unit,
      //     lactatingCows,
      //     formType,
      //   ),
      // bulkFeed =
      //   toolData?.[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.PURCHASE_BULK_FEED] ||
      //   parseFeedingIngredientsForDB(
      //     values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.PURCHASE_BULK_FEED],
      //     !conversionNeeded && unit,
      //     lactatingCows,
      //     formType,
      //   ),
      // bagsFeed =
      //   toolData?.[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.PURCHASE_BAG_FEED] ||
      //   parseFeedingIngredientsForDB(
      //     values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.PURCHASE_BAG_FEED],
      //     !conversionNeeded && unit,
      //     lactatingCows,
      //     formType,
      //   );

    //current quota
    let currentQuotaUtilization = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[
      ROF_FIELDS.CURRENT_QUOTA_UTILIZATION_KG_PER_DAY
      ],
    );
    //totalQuota
    let totalQuota =
      toolData?.[ROF_FIELDS.MILK_PRODUCTION]?.[
        ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY
      ] ||
      convertStringToNumber(
        values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY],
      );

    //DB calculation values
    let totalFeedCostKgDMPerDay =
      convertStringToNumber(
        calculateTotalFeedCostKgDMPerDay(
          forages,
          grains,
          bulkFeed,
          bagsFeed,
          lactatingCows,
        ).toFixed(ROF_DECIMAL_PLACES),
        true,
      ) || 0;

    let totalFeedCostPerCowPerDay =
      convertStringToNumber(
        calculateTotalFeedCostPerCowPerDay(
          forages,
          grains,
          bulkFeed,
          bagsFeed,
          lactatingCows,
          formType,
        ).toFixed(ROF_DECIMAL_PLACES),
        true,
      ) || 0;

    let totalPurchasedCostPerCowPerDay =
      convertStringToNumber(
        calculateTotalPurchasedCostPerCowPerDay(
          bulkFeed,
          bagsFeed,
          lactatingCows,
          formType,
        ).toFixed(ROF_DECIMAL_PLACES),
        true,
      ) || 0;

    let totalConcentrateCostPerCowPerDay =
      convertStringToNumber(
        calculateTotalConcentrateCostPerCowPerDay(
          grains,
          bulkFeed,
          bagsFeed,
          lactatingCows,
          formType,
        ).toFixed(ROF_DECIMAL_PLACES),
        true,
      ) || 0;

    // some field values calculated here as we need it multiple times in diff formulas
    let rationOrButterFat = calculateRationOrButterFat(
      proteinKgHl,
      lactoseAndOtherSolidsKgHl,
      butterfatKgHl,
      conversionNeeded,
    );

    let maxAllowed =
      toolData?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS][ROF_FIELDS.MAX_ALLOWED] ||
      convertStringToNumber(
        values[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS][ROF_FIELDS.MAX_ALLOWED],
      );

    //totalRevenuePerCowPerDay not sending conversion needed as we need this as number for now
    let totalRevenuePerCowPerDay = calculateTotalRevenuePerCowPerDay(
      milkProductionKg,
      butterfatKgHl,
      butterfatPricePerKg,
      proteinPricePerKg,
      proteinKgHl,
      class2ProteinPricePerKg,
      lactoseAndOtherSolidsKgHl,
      lactoseAndOtherSolidsPricePerKg,
      deductionsPricePerKg,
      conversionNeeded
        ? convertStringToNumber(rationOrButterFat)
        : rationOrButterFat,
      maxAllowed,
      proteinKgCow,
      lactoseAndOtherSolidsKgCow,
      class2LactoseAndOtherSolidsPricePerKg,
      butterfatKgCow,
    );

    let totalRevenuePerHl = calculateTotalRevenuePerHl(
      milkProductionKg,
      totalRevenuePerCowPerDay,
      conversionNeeded,
    );
    //#endregion

    //output obj
    let milkProductionOutputs = {
      [ROF_FIELDS.RATIO_SNF_PER_BUTTERFAT]: rationOrButterFat,
      [ROF_FIELDS.MAX_ALLOWED]: conversionNeeded
        ? convertNumberToString(maxAllowed, !conversionNeeded) || ''
        : maxAllowed || 0,
      [ROF_FIELDS.TOTAL_FAT_PROTEIN]: calculateTotalFatProtein(
        proteinKgCow,
        butterfatKgCow,
        conversionNeeded,
      ),
      [ROF_FIELDS.DAIRY_EFFICIENCY]: calculateDairyEfficiency(
        milkProductionKg,
        butterfatKgHl,
        proteinKgHl,
        totalFeedCostKgDMPerDay,
        conversionNeeded,
      ),
      [ROF_FIELDS.COMPONENT_EFFICIENCY]: calculateComponentEfficiency(
        proteinKgCow,
        butterfatKgCow,
        totalFeedCostKgDMPerDay,
        conversionNeeded,
      ),
      [ROF_FIELDS.TOTAL_REVENUE_PER_HL]: totalRevenuePerHl,
      [ROF_FIELDS.FEED_COST_PER_HL]: calculateFeedCostPerHl(
        totalFeedCostPerCowPerDay,
        milkProductionKg,
        conversionNeeded,
      ),
      [ROF_FIELDS.PURCHASED_FEED_COST_PER_HL]: calculatePurchasedFeedCostPerHl(
        totalPurchasedCostPerCowPerDay,
        milkProductionKg,
        conversionNeeded,
      ),
      [ROF_FIELDS.CONCENTRATE_COST_PER_HL]: calculateConcentrateCostPerHl(
        totalConcentrateCostPerCowPerDay,
        milkProductionKg,
        conversionNeeded,
      ),
      [ROF_FIELDS.CONCENTRATE_COST_PER_KG_BF]:
        calculateConcentrateCostPerKgButterFat(
          totalConcentrateCostPerCowPerDay,
          butterfatKgCow,
          conversionNeeded,
        ),
      [ROF_FIELDS.BF_REVENUE]: calculateButterFatRevenue(
        milkProductionKg,
        butterfatKgHl,
        butterfatPricePerKg,
        conversionNeeded,
      ),
      [ROF_FIELDS.PROTEIN_REVENUE]: calculateProteinRevenue(
        milkProductionKg,
        proteinPricePerKg,
        proteinKgHl,
        class2ProteinPricePerKg,
        butterfatKgHl,
        lactoseAndOtherSolidsKgHl,
        conversionNeeded,
      ),
      [ROF_FIELDS.OTHER_SOLIDS_REVENUE]: calculateOtherSolidsRevenue(
        milkProductionKg,
        lactoseAndOtherSolidsPricePerKg,
        lactoseAndOtherSolidsKgHl,
        class2LactoseAndOtherSolidsPricePerKg,
        butterfatKgHl,
        proteinKgHl,
        conversionNeeded,
      ),
      [ROF_FIELDS.DEDUCTIONS_PRICE_PER_COW_PER_DAY]:
        calculateDeductionsPerCowPerDay(
          milkProductionKg,
          deductionsPricePerKg,
          conversionNeeded,
        ),
      [ROF_FIELDS.SNF_NON_PAYMENT]: calculateSNFNonPayments(
        convertStringToNumber(rationOrButterFat),
        maxAllowed,
        proteinKgCow,
        lactoseAndOtherSolidsKgCow,
        class2ProteinPricePerKg,
        class2LactoseAndOtherSolidsPricePerKg,
        butterfatKgCow,
        conversionNeeded,
      ),
      [ROF_FIELDS.TOTAL_REVENUE_KG_FAT]: calculateTotalRevenuePerKgFat(
        totalRevenuePerCowPerDay,
        butterfatKgCow,
        conversionNeeded,
      ),
      //handling it diff as its calculated above to be used in diff calculations
      [ROF_FIELDS.TOTAL_REVENUE_COW_DAY]: conversionNeeded
        ? convertNumberToString(totalRevenuePerCowPerDay, !conversionNeeded)
        : totalRevenuePerCowPerDay,
      [ROF_FIELDS.UNDER_QUOTA_LOST_REVENUE]:
        calculateUnderQuotaLostRevenuePerMonth(
          currentQuotaUtilization,
          totalQuota,
          convertStringToNumber(totalRevenuePerHl),
          butterfatKgHl,
          conversionNeeded,
        ),
      [ROF_FIELDS.ROF_KG_BUTTER_FAT]: calculateROFPerKgButterFat(
        totalRevenuePerCowPerDay,
        butterfatKgCow,
        totalFeedCostPerCowPerDay,
        conversionNeeded,
      ),
      [ROF_FIELDS.ROF]: calculateMilkProdOutputROF(
        totalRevenuePerCowPerDay,
        totalFeedCostPerCowPerDay,
        conversionNeeded,
      ),
    };

    if (setFieldValue) {
      //if needed at form level
      setFieldValue(ROF_FIELDS.MILK_PRODUCTION_OUTPUTS, milkProductionOutputs);
    } else {
      // else needed at save to db or get data level
      return milkProductionOutputs;
    }
  } catch (error) {
    console.log('getMilkProductionOutputsInitialFormValues fail', error);
    logEvent('getMilkProductionOutputsInitialFormValues fail', error);
  }
};

//#endregion

//#region handle feeding

export const getSubLabelForPricePerTon = type => {
  try {
    if (
      type == ROF_FEEDING_INGREDIENTS_TYPES.HOME_GROWN_FORAGES ||
      type == ROF_FEEDING_INGREDIENTS_TYPES.HOME_GROWN_GRAINS
    ) {
      return i18n.t('DM');
    } else {
      return i18n.t('asFed');
    }
  } catch (e) {
    logEvent('getSubLabelForPricePerTon error', type);
  }
};

const calculateTotalKgOfDryMatter = (
  totalHerdPerDay = 0,
  dryMatter = 0,
  lactatingCows = 0,
  conversionNeeded,
  formType = ROF_FORM_TYPES.TMR,
) => {
  try {
    let totalDryMatter = 0;

    if (conversionNeeded) {
      totalHerdPerDay = convertStringToNumber(totalHerdPerDay);
      dryMatter = convertStringToNumber(dryMatter);
    }

    if (formType == ROF_FORM_TYPES.TMR) {
      totalDryMatter = (totalHerdPerDay * dryMatter) / 100;
    } else {
      // ((totalHerdPerDay * dryMatter) / 100) * lactating animals;
      totalDryMatter = ((totalHerdPerDay * dryMatter) / 100) * lactatingCows;
    }

    totalDryMatter = parseFloat(totalDryMatter.toFixed(ROF_DECIMAL_PLACES));

    return totalDryMatter;
  } catch (e) {
    logEvent('calculateTotalKgOfDryMatter fail', e);
  }
};

export const setIngredientFieldsByTypeInArray = (
  formType,
  setFieldValue,
  values,
  type,
  field,
  value,
  index,
  rofPriceList = [],
  conversionNeeded = false,
  enumState,
  ingredientsList,
) => {
  try {
    let ingredientArray = values[ROF_FIELDS.FEEDING][type];
    let lactatingCows = values[ROF_FIELDS.FEEDING][ROF_FIELDS.LACTATING_COWS];
    //add specific field value is added to array item on index
    if (field) {
      if (
        field === ROF_FIELDS.FORAGE_NAME ||
        field === ROF_FIELDS.GRAINS_NAME ||
        field === ROF_FIELDS.FEED_NAME
      ) {
        //make names unique in same visit for same type else dont let user enter the value
        let isSimilarName = false;
        ingredientArray?.forEach(element => {
          if (element[field] == value) {
            isSimilarName = true;
            return;
          }
        });
        if (isSimilarName) {
          return;
        }
      }
      //set current field value
      ingredientArray[index][field] = value;

      if (
        field === ROF_FIELDS.HOME_GROWN_FORAGE_TYPE ||
        field === ROF_FIELDS.HOME_GROWN_GRAINS_TYPE
      ) {
        //on changing feeding type change price per ton as per API
        let pricePerTon = rofPriceList?.filter(p => {
          return p.name == ingredientArray[index][field];
        })[0]?.price;

        ingredientArray[index][ROF_FIELDS.PRICE_PER_TON] = pricePerTon;

        // Update forage/grain name based on new type
        if (field === ROF_FIELDS.HOME_GROWN_FORAGE_TYPE) {
          const forageTypeKey = ingredientArray[index][field];
          const forageTypeList =
            enumState?.[ENUM_CONSTANTS.HOME_GROWN_FORAGE_TYPES] || [];
          const forageTypeMatch = forageTypeList.find(
            forage =>
              forage?.key === forageTypeKey ||
              forage?.name === forageTypeKey ||
              forage?.value === forageTypeKey,
          );
          const forageBaseName =
            (forageTypeMatch?.name ||
              forageTypeMatch?.value ||
              forageTypeKey ||
              '')
              .toString() || 'forage';

          // Get all existing names for this type
          const existingNames = ingredientArray
            .map(ingredient =>
              (ingredient?.[ROF_FIELDS.FORAGE_NAME] || '').toString().trim(),
            )
            .filter(Boolean);

          const existingNamesLower = existingNames.map(name =>
            name.toLowerCase(),
          );

          // Find next available number for the new type
          const numberMatches = existingNames
            .map(name => {
              const match = name.match(
                new RegExp(`^${forageBaseName}\\s*(\\d+)$`, 'i'),
              );
              return match ? parseInt(match[1], 10) : null;
            })
            .filter(num => Number.isInteger(num));

          const usedNumbers = new Set(numberMatches);
          let nextNumber = 1;
          while (usedNumbers.has(nextNumber)) {
            nextNumber += 1;
          }

          let newForageName = `${forageBaseName} ${nextNumber}`;

          while (existingNamesLower.includes(newForageName.toLowerCase())) {
            nextNumber += 1;
            newForageName = `${forageBaseName} ${nextNumber}`;
          }

          ingredientArray[index][ROF_FIELDS.FORAGE_NAME] = newForageName;
        }
      }

      if (
        field === ROF_FIELDS.TOTAL_HERD_PER_DAY ||
        field === ROF_FIELDS.DRY_MATTER
      ) {
        //save totalDryMatter as per formula on changing of these fields

        let totalHerdPerDay =
          ingredientArray[index][ROF_FIELDS.TOTAL_HERD_PER_DAY];
        let dryMatter = ingredientArray[index][ROF_FIELDS.DRY_MATTER];

        let totalDryMatter = calculateTotalKgOfDryMatter(
          totalHerdPerDay,
          dryMatter,
          lactatingCows,
          conversionNeeded,
          formType,
        );

        ingredientArray[index][ROF_FIELDS.TOTAL_DRY_MATTER] = conversionNeeded
          ? convertNumberToString(totalDryMatter)
          : totalDryMatter;
      }
    } else {
      //to delete the index
      if (index != null) {
        // //if these are the types we need to keep one index atleast
        // if (
        //   (type == ROF_FIELDS.HOME_GROWN_FORAGES ||
        //     type == ROF_FIELDS.HOME_GROWN_GRAINS) &&
        //   ingredientArray.length == 1
        // ) {
        //   return;
        // } else {
        ingredientArray.splice(index, 1);
        // }
      } else {
        //add new item to array
        ingredientArray.push(
          getFeedingIngredientsFormValues(type, enumState, {}, rofPriceList, null, null, null, ingredientsList),
        );
      }
    }
    //save whole obj in array as a single value
    setFieldValue(values[ROF_FIELDS.FEEDING][type], ingredientArray);
  } catch (e) {
    console.log('handleFormFieldInTypeArray fail', e);
    logEvent('handleFormFieldInTypeArray fail', e);
  }
};

export const recalculateTotalDryMatterInFeeding = (
  values,
  lactatingCows = 0,
  setFieldValue,
) => {
  try {
    let feedingValues = values[ROF_FIELDS.FEEDING];

    Object.values(ROF_FEEDING_INGREDIENTS_TYPES).map(type => {
      let ingredientArray = feedingValues[type];

      ingredientArray.length > 0 &&
        ingredientArray?.map(ingredient => {
          let totalDryMatter = 0;

          let totalHerdPerDay = ingredient[ROF_FIELDS.TOTAL_HERD_PER_DAY];
          let dryMatter = ingredient[ROF_FIELDS.DRY_MATTER];

          totalHerdPerDay = convertStringToNumber(totalHerdPerDay);
          dryMatter = convertStringToNumber(dryMatter);

          // ((totalHerdPerDay * dryMatter) / 100) * lactating animals;
          totalDryMatter =
            ((totalHerdPerDay * dryMatter) / 100) * lactatingCows;

          totalDryMatter = parseFloat(
            totalDryMatter.toFixed(ROF_DECIMAL_PLACES),
          );

          ingredient[ROF_FIELDS.TOTAL_DRY_MATTER] =
            convertNumberToString(totalDryMatter);
        });

      setFieldValue(values[ROF_FIELDS.FEEDING][type], ingredientArray);
    });
  } catch (e) {
    console.log('recalculateTotalDryMatterInFeeding fail', e);
    logEvent('recalculateTotalDryMatterInFeeding fail', e);
  }
};
//#endregion

//#region handle milk production calculations

export const calculateAverageMilkProductionPerCowPerDay = (
  avgMilkProductionKg = 0,
  lactatingCows = 0,
  conversionNeeded = false,
) => {
  try {
    if (conversionNeeded) {
      avgMilkProductionKg = convertStringToNumber(avgMilkProductionKg);
      lactatingCows = convertStringToNumber(lactatingCows);
    }

    let averageMilkProductionLitresPerCowPerDay = lactatingCows
      ? parseFloat(
        (avgMilkProductionKg / lactatingCows).toFixed(ROF_DECIMAL_PLACES),
      )
      : 0;
    return conversionNeeded
      ? convertNumberToString(averageMilkProductionLitresPerCowPerDay)
      : averageMilkProductionLitresPerCowPerDay;
  } catch (error) {
    console.log('calculateAverageMilkProductionPerCowPerDay fail', error);
    logEvent('calculateAverageMilkProductionPerCowPerDay fail', error);
  }
};

export const calculateCurrentQuotaUtilizationKgPerDay = (
  averageMilkProductionKg = 0,
  butterFatPercentagePerHl = 0,
  conversionNeeded = false,
) => {
  try {
    // ((Average Milk Production - Animals in Tank * Butterfat kg/hl )/100)
    if (conversionNeeded) {
      averageMilkProductionKg = convertStringToNumber(averageMilkProductionKg);
      butterFatPercentagePerHl = convertStringToNumber(
        butterFatPercentagePerHl,
      );
    }
    if (averageMilkProductionKg && butterFatPercentagePerHl) {
      let currentQuotaUtilizationKgPerDay = parseFloat(
        ((averageMilkProductionKg * butterFatPercentagePerHl) / 100).toFixed(
          ROF_DECIMAL_PLACES,
        ),
      );
      return conversionNeeded
        ? convertNumberToString(currentQuotaUtilizationKgPerDay)
        : currentQuotaUtilizationKgPerDay;
    } else {
      return conversionNeeded ? convertNumberToString(0.0) : 0;
    }
  } catch (e) {
    console.log('calculateCurrentQuotaUtilizationKgPerDay fail', e);
    logEvent('calculateCurrentQuotaUtilizationKgPerDay fail', e);
  }
};

export const calculateTotalQuotaKgPerDay = (
  kgOfQuotaPerDay = 0,
  incentiveDaysKgPerDay = 0,
  conversionNeeded = false,
) => {
  try {
    // = kgOfQuotaPerDay + (incentiveDaysKgPerDay * kgOfQuotaPerDay / 30.4)
    if (conversionNeeded) {
      kgOfQuotaPerDay = convertStringToNumber(kgOfQuotaPerDay);
      incentiveDaysKgPerDay = convertStringToNumber(incentiveDaysKgPerDay);
    }

    let totalQuotaKgPerDay = parseFloat(
      (
        kgOfQuotaPerDay +
        (incentiveDaysKgPerDay * kgOfQuotaPerDay) / 30.4
      ).toFixed(ROF_DECIMAL_PLACES),
    );

    return conversionNeeded
      ? convertNumberToString(totalQuotaKgPerDay)
      : totalQuotaKgPerDay ||
      (conversionNeeded ? convertNumberToString(0.0) : 0);
  } catch (e) {
    console.log('calculateTotalQuotaKgPerDay fail', e);
    logEvent('calculateTotalQuotaKgPerDay fail', e);
  }
};

export const calculateKgPerCow = (
  milkProduction = 0,
  percentagePerHl = 0,
  conversionNeeded = false,
  unit,
) => {
  try {
    // (Milk Production * kg/hl)/100
    if (conversionNeeded) {
      milkProduction = convertStringToNumber(milkProduction);
      percentagePerHl = convertStringToNumber(percentagePerHl);
    }
    if (milkProduction && percentagePerHl) {
      let kgPerCow = parseFloat(
        ((milkProduction * percentagePerHl) / 100).toFixed(ROF_DECIMAL_PLACES),
      );
      return conversionNeeded ? convertNumberToString(kgPerCow) : kgPerCow;
    } else {
      return conversionNeeded ? convertNumberToString(0.0) : 0;
    }
  } catch (e) {
    console.log('calculateKgPerCow fail', e);
    logEvent('calculateKgPerCow fail', e);
  }
};

export const handleKgPerCowInAllMilkingIngredients = (
  setFieldValue,
  milkProductionKg,
  toolMilkProductionData,
) => {
  try {
    //set this value in all milking fields and set value
    Object.values(ROF_MILKING_INGREDIENTS_TYPES).map(milkingType => {
      let kgPerCow = calculateKgPerCow(
        milkProductionKg,
        toolMilkProductionData?.[milkingType][ROF_FIELDS.PERCENTAGE_PER_HL],
        true,
      );
      setFieldValue(
        `${ROF_FIELDS.MILK_PRODUCTION}.${milkingType}.${ROF_FIELDS.KG_PER_COW}`,
        kgPerCow,
      );
    });
  } catch (e) {
    console.log('handleKgPerCowInAllMilkingIngredients fail', e);
    logEvent('handleKgPerCowInAllMilkingIngredients fail', e);
  }
};

//#endregion

//#region handle milk production outputs calculations
export const handleMaxAllowedChange = (values, value, setFieldValue) => {
  try {
    //handle SNF nonpayments on this change

    let rationOrButterFat = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS][
      ROF_FIELDS.RATIO_SNF_PER_BUTTERFAT
      ],
    );
    let butterfatKgCow = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.BUTTERFAT]?.[
      ROF_FIELDS.KG_PER_COW
      ],
    );
    let proteinKgCow = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.PROTEIN]?.[
      ROF_FIELDS.KG_PER_COW
      ],
    );
    let lactoseAndOtherSolidsKgCow = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[
      ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
      ]?.[ROF_FIELDS.KG_PER_COW],
    );

    let class2ProteinPricePerKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[ROF_FIELDS.CLASS2_PROTEIN]?.[
      ROF_FIELDS.PRICE_PER_KG
      ],
    );
    let class2LactoseAndOtherSolidsPricePerKg = convertStringToNumber(
      values[ROF_FIELDS.MILK_PRODUCTION]?.[
      ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS
      ]?.[ROF_FIELDS.PRICE_PER_KG],
    );
    let maxAllowed = convertStringToNumber(value);

    let snfNonPayments = calculateSNFNonPayments(
      rationOrButterFat,
      maxAllowed,
      proteinKgCow,
      lactoseAndOtherSolidsKgCow,
      class2ProteinPricePerKg,
      class2LactoseAndOtherSolidsPricePerKg,
      butterfatKgCow,
      true,
    );

    setFieldValue(
      `${ROF_FIELDS.MILK_PRODUCTION_OUTPUTS}.${ROF_FIELDS.SNF_NON_PAYMENT}`,
      snfNonPayments,
    );
  } catch (e) {
    console.log('handleMaxAllowedChange fail', e);
    logEvent('handleMaxAllowedChange fail', e);
  }
};
export const calculateRationOrButterFat = (
  proteinKgHl = 0,
  lactoseAndOtherSolidsKgHl = 0,
  butterfatKgHl = 0,
  keepString = false,
) => {
  try {
    // (protein kg/hl + lactose and other solids kg/hl) / butterfat kg/hl
    let rationOrButterFat = butterfatKgHl
      ? (proteinKgHl + lactoseAndOtherSolidsKgHl) / butterfatKgHl
      : 0;
    rationOrButterFat = parseFloat(
      rationOrButterFat.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? rationOrButterFat
      : convertNumberToString(rationOrButterFat);
  } catch (e) {
    console.log('getRationOrButterFat fail', e);
    logEvent('getRationOrButterFat fail', e);
  }
};
export const calculateTotalFatProtein = (
  proteinKgCow = 0,
  butterfatKgCow = 0,
  keepString = false,
) => {
  try {
    // Butterfat kg/cow + protein kg/cow
    let totalFatProtein = butterfatKgCow + proteinKgCow;
    totalFatProtein = parseFloat(totalFatProtein.toFixed(ROF_DECIMAL_PLACES));
    return !keepString
      ? totalFatProtein
      : convertNumberToString(totalFatProtein);
  } catch (e) {
    console.log('getTotalFatProtein fail', e);
    logEvent('getTotalFatProtein fail', e);
  }
};
export const calculateDairyEfficiency = (
  milkProductionKg = 0,
  butterfatKgHl = 0,
  proteinKgHl = 0,
  totalFeedCostKgDMPerDay = 0, //db calculations
  keepString = false,
) => {
  try {
    // ((milk production *1.03*0.2594)+(12.1975*(butterfat kg/hl /100*(milk production *1.03)))+(7.707*(protein kg/hl /100*(milk production *1.03))))/total feed cost kg DM per day
    let dairyEfficiency = totalFeedCostKgDMPerDay
      ? (milkProductionKg * 1.03 * 0.2594 +
        12.1975 * ((butterfatKgHl / 100) * (milkProductionKg * 1.03)) +
        7.707 * ((proteinKgHl / 100) * (milkProductionKg * 1.03))) /
      totalFeedCostKgDMPerDay
      : 0;
    dairyEfficiency = parseFloat(dairyEfficiency.toFixed(ROF_DECIMAL_PLACES));
    return !keepString
      ? dairyEfficiency
      : convertNumberToString(dairyEfficiency);
  } catch (e) {
    console.log('getDairyEfficiency fail', e);
    logEvent('getDairyEfficiency fail', e);
  }
};
export const calculateComponentEfficiency = (
  proteinKgCow = 0,
  butterfatKgCow = 0,
  totalFeedCostKgDMPerDay = 0, //DB calculations
  keepString = false,
) => {
  try {
    // ((butterfat kg/cow + protein kg/cow))/total feed cost kg DM per day *100
    let componentEfficiency = totalFeedCostKgDMPerDay
      ? ((butterfatKgCow + proteinKgCow) / totalFeedCostKgDMPerDay) * 100
      : 0;
    componentEfficiency = parseFloat(
      componentEfficiency.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? componentEfficiency
      : convertNumberToString(componentEfficiency);
  } catch (e) {
    console.log('getComponentEfficiency fail', e);
    logEvent('getComponentEfficiency fail', e);
  }
};
export const calculateFeedCostPerHl = (
  totalFeedCostPerCowPerDay = 0, //DB calculations
  milkProductionKg = 0,
  keepString = false,
) => {
  try {
    // total feed cost cost per cow per day (from the backend/milk production
    let feedCostPerHlMilk = milkProductionKg
      ? (totalFeedCostPerCowPerDay / milkProductionKg) * 100
      : 0;

    feedCostPerHlMilk = parseFloat(
      feedCostPerHlMilk.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? feedCostPerHlMilk
      : convertNumberToString(feedCostPerHlMilk);
  } catch (e) {
    console.log('getFeedCost fail', e);
    logEvent('getFeedCost fail', e);
  }
};
export const calculatePurchasedFeedCostPerHl = (
  totalPurchasedCostPerCowPerDay = 0, //DB calculations
  milkProductionKg = 0,
  keepString = false,
) => {
  try {
    // Total Purchased Cost for cost/cow/day from DB Calculations / milk production from milk production tab
    let purchasedFeedCostPerHl = milkProductionKg
      ? (totalPurchasedCostPerCowPerDay / milkProductionKg) * 100
      : 0;
    purchasedFeedCostPerHl = parseFloat(
      purchasedFeedCostPerHl.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? purchasedFeedCostPerHl
      : convertNumberToString(purchasedFeedCostPerHl);
  } catch (e) {
    console.log('getPurchasedFeedCost fail', e);
    logEvent('getPurchasedFeedCost fail', e);
  }
};
export const calculateConcentrateCostPerHl = (
  totalConcentrateCostPerCowPerDay = 0, //DB calculations
  milkProductionKg = 0,
  keepString = false,
) => {
  try {
    // total concentrate cost of cost/cow/day from db calculations / milk production from milk production tab
    let concentrateCostPerHl = milkProductionKg
      ? (totalConcentrateCostPerCowPerDay / milkProductionKg) * 100
      : 0;
    concentrateCostPerHl = parseFloat(
      concentrateCostPerHl.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? concentrateCostPerHl
      : convertNumberToString(concentrateCostPerHl);
  } catch (e) {
    console.log('getConcentrateCost fail', e);
    logEvent('getConcentrateCost fail', e);
  }
};
export const calculateConcentrateCostPerKgButterFat = (
  totalConcentrateCostPerCowPerDay = 0, //DB calculations
  butterfatKgCow = 0,
  keepString = false,
) => {
  try {
    // total concentrate cost of cost/cow/day from db calculations  / Price (kg/cow) of Butterfat
    let concentrateCostPerButterFat = butterfatKgCow
      ? totalConcentrateCostPerCowPerDay / butterfatKgCow
      : 0;
    concentrateCostPerButterFat = parseFloat(
      concentrateCostPerButterFat.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? concentrateCostPerButterFat
      : convertNumberToString(concentrateCostPerButterFat);
  } catch (e) {
    console.log('getConcentrateCostPerButterFat fail', e);
    logEvent('getConcentrateCostPerButterFat fail', e);
  }
};
export const calculateButterFatRevenue = (
  milkProductionKg = 0,
  butterfatKgHl = 0,
  butterfatPricePerKg = 0,
  keepString = false,
) => {
  try {
    // milk production from milk production tab * (Price (kg/hl of Butterfat/100) * Price (currency/kg of Butterfat)
    let butterFatRevenue =
      milkProductionKg * (butterfatKgHl / 100) * butterfatPricePerKg;
    butterFatRevenue = parseFloat(butterFatRevenue.toFixed(ROF_DECIMAL_PLACES));
    return !keepString
      ? butterFatRevenue
      : convertNumberToString(butterFatRevenue);
  } catch (e) {
    console.log('getButterFatRevenue fail', e);
    logEvent('getButterFatRevenue fail', e);
  }
};

const getProteines = (
  proteinKgHl = 0,
  butterfatKgHl = 0,
  lactoseAndOtherSolidsKgHl = 0,
) => {
  try {
    // IF ((Butterfat kg/hl*2)*(Protein kg/hl/(Protein kg/hl + Lactose and other solids kg/hl))) is greater than Protein kg/hl, Return Protein kg/hl
    // Else (Butterfat kg/hl*2)*(Protein kg/hl / (Protein kg/hl+Lactose and other solids kg/hl))

    let condition1 =
      proteinKgHl + lactoseAndOtherSolidsKgHl
        ? butterfatKgHl *
        2 *
        (proteinKgHl / (proteinKgHl + lactoseAndOtherSolidsKgHl))
        : 0;

    if (condition1 > proteinKgHl) {
      return parseFloat(proteinKgHl.toFixed(ROF_DECIMAL_PLACES));
    } else {
      return parseFloat(condition1.toFixed(ROF_DECIMAL_PLACES));
    }
  } catch (e) {
    console.log('getProteines fail', e);
    logEvent('getProteines fail', e);
  }
};
export const calculateProteinRevenue = (
  milkProductionKg = 0,
  proteinPricePerKg = 0,
  proteinKgHl = 0,
  class2ProteinPricePerKg = 0,
  butterfatKgHl = 0,
  lactoseAndOtherSolidsKgHl = 0,
  keepString = false,
) => {
  try {
    // (milk production from milk production tab*(protéines/100) * Price (currency/kg of Protein)+(milk production from milk production tab*(protein kg/hl - protéines/100) * Price (currency/kg of Class 2 Protein)
    //where protéines = is from above function as per condition

    let proteines = getProteines(
      proteinKgHl,
      butterfatKgHl,
      lactoseAndOtherSolidsKgHl,
    );

    let proteinRevenue =
      milkProductionKg * (proteines / 100) * proteinPricePerKg +
      milkProductionKg *
      ((proteinKgHl - proteines) / 100) *
      class2ProteinPricePerKg;

    proteinRevenue = parseFloat(proteinRevenue.toFixed(ROF_DECIMAL_PLACES));
    return !keepString ? proteinRevenue : convertNumberToString(proteinRevenue);
  } catch (e) {
    console.log('getProteinRevenue fail', e);
    logEvent('getProteinRevenue fail', e);
  }
};

const getLactoses = (
  butterfatKgHl = 0,
  lactoseAndOtherSolidsKgHl = 0,
  proteinKgHl = 0,
) => {
  try {
    // IF((Butterfat kg/hl*2)*(Lactose and other solids kg/hl /(Protein kg/hl+Lactose and other solids kg/hl))>Lactose and other solids kg/hl, Return Lactose and other solids kg/hl
    // ELSE (Butterfat kg/hl*2)*(Lactose and other solids kg/hl/(Protein kg/hl+D76)))

    let condition1 =
      proteinKgHl + lactoseAndOtherSolidsKgHl
        ? butterfatKgHl *
        2 *
        (lactoseAndOtherSolidsKgHl /
          (proteinKgHl + lactoseAndOtherSolidsKgHl))
        : 0;

    if (condition1 > lactoseAndOtherSolidsKgHl) {
      return parseFloat(lactoseAndOtherSolidsKgHl.toFixed(ROF_DECIMAL_PLACES));
    } else {
      return parseFloat(condition1.toFixed(ROF_DECIMAL_PLACES));
    }
  } catch (e) {
    console.log('getLactoses fail', e);
    logEvent('getLactoses fail', e);
  }
};
export const calculateOtherSolidsRevenue = (
  milkProductionKg = 0,
  lactoseAndOtherSolidsPricePerKg = 0,
  lactoseAndOtherSolidsKgHl = 0,
  class2LactoseAndOtherSolidsPricePerKg = 0,
  butterfatKgHl = 0,
  proteinKgHl = 0,
  keepString = false,
) => {
  try {
    // (milk production from milk production tab*(lactoses/100) * Price (currency/kg of Lactose and other solids)+(milk production from milk production tab*(Lactose & other solids kg/hl - lactoses/100)* Price (currency/kg of Class 2 Lactose and other solids)
    //where Lactoses = is from above function as per condition

    let lactoses = getLactoses(
      butterfatKgHl,
      lactoseAndOtherSolidsKgHl,
      proteinKgHl,
    );
    let otherSolidsRevenue =
      milkProductionKg * (lactoses / 100) * lactoseAndOtherSolidsPricePerKg +
      milkProductionKg *
      ((lactoseAndOtherSolidsKgHl - lactoses) / 100) *
      class2LactoseAndOtherSolidsPricePerKg;

    otherSolidsRevenue = parseFloat(
      otherSolidsRevenue.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? otherSolidsRevenue
      : convertNumberToString(otherSolidsRevenue);
  } catch (e) {
    console.log('getOtherSolidsRevenue fail', e);
    logEvent('getOtherSolidsRevenue fail', e);
  }
};
export const calculateDeductionsPerCowPerDay = (
  milkProductionKg = 0,
  deductionsPricePerKg = 0,
  keepString = false,
) => {
  try {
    // milk production from milk production tab * Price (currency/kg of Deductions
    let deductionsPricePerCowPerDay = milkProductionKg * deductionsPricePerKg;
    deductionsPricePerCowPerDay = parseFloat(
      deductionsPricePerCowPerDay.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? deductionsPricePerCowPerDay
      : convertNumberToString(deductionsPricePerCowPerDay);
  } catch (e) {
    console.log('getDeductionsPerCowPerDay fail', e);
    logEvent('getDeductionsPerCowPerDay fail', e);
  }
};
export const calculateSNFNonPayments = (
  rationOrButterFat = 0,
  maxAllowed = 0,
  proteinKgCow = 0,
  lactoseAndOtherSolidsKgCow = 0,
  class2ProteinPricePerKg = 0,
  class2LactoseAndOtherSolidsPricePerKg = 0,
  butterfatKgCow = 0,
  keepString = false,
) => {
  try {
    // If:(Ratio S.N.F./Butterfat > Max Allowed ----> Use the following formula:
    // Protein Nonpayment + Other Solids Nonpayment
    // Else: Return 0

    if (rationOrButterFat > maxAllowed) {
      // Protein Nonpayment = (Protein kg/cow / (Protein kg/cow+Other solids kg/cow))*SNF Over*Class 2 protein $/kg
      // Other Solids Nonpayment = (Other solids kg/cow / (Other solids kg/cow+Protein kg/cow))*SNF Over*Class 2 lactose and other solids $/kg
      // SNF Over = (Other solids kg/cow+Protein kg/cow)-(Butterfat kg/cow*Max Allowed)
      let SNFOver =
        lactoseAndOtherSolidsKgCow + proteinKgCow - butterfatKgCow * maxAllowed;

      let proteinNonpayment =
        (proteinKgCow / (lactoseAndOtherSolidsKgCow + proteinKgCow)) *
        SNFOver *
        class2ProteinPricePerKg;

      let otherSolidsNonpayment =
        (lactoseAndOtherSolidsKgCow /
          (lactoseAndOtherSolidsKgCow + proteinKgCow)) *
        SNFOver *
        class2LactoseAndOtherSolidsPricePerKg;

      let snfNonPayments =
        lactoseAndOtherSolidsKgCow + proteinKgCow
          ? proteinNonpayment + otherSolidsNonpayment
          : 0;

      snfNonPayments = parseFloat(snfNonPayments.toFixed(ROF_DECIMAL_PLACES));
      return !keepString
        ? snfNonPayments
        : convertNumberToString(snfNonPayments);
    }
    return !keepString ? 0 : convertNumberToString(0.0);
  } catch (e) {
    console.log('getSNFNonPayments fail', e);
    logEvent('getSNFNonPayments fail', e);
  }
};
export const calculateTotalRevenuePerCowPerDay = (
  milkProductionKg = 0,
  butterfatKgHl = 0,
  butterfatPricePerKg = 0,
  proteinPricePerKg = 0,
  proteinKgHl = 0,
  class2ProteinPricePerKg = 0,
  lactoseAndOtherSolidsKgHl = 0,
  lactoseAndOtherSolidsPricePerKg = 0,
  deductionsPricePerKg = 0,
  rationOrButterFat = 0,
  maxAllowed = 0,
  proteinKgCow = 0,
  lactoseAndOtherSolidsKgCow = 0,
  class2LactoseAndOtherSolidsPricePerKg = 0,
  butterfatKgCow = 0,
) => {
  try {
    // BF Revenue + Protein Revenue + Other Solids Revenue - Deductions - SNF nonpayment

    let butterFatRevenue = calculateButterFatRevenue(
      milkProductionKg,
      butterfatKgHl,
      butterfatPricePerKg,
    );
    let proteinRevenue = calculateProteinRevenue(
      milkProductionKg,
      proteinPricePerKg,
      proteinKgHl,
      class2ProteinPricePerKg,
      butterfatKgHl,
      lactoseAndOtherSolidsKgHl,
    );
    let otherSolidsRevenue = calculateOtherSolidsRevenue(
      milkProductionKg,
      lactoseAndOtherSolidsPricePerKg,
      lactoseAndOtherSolidsKgHl,
      class2ProteinPricePerKg,
      butterfatKgHl,
      proteinKgHl,
    );
    let deductions = calculateDeductionsPerCowPerDay(
      milkProductionKg,
      deductionsPricePerKg,
    );
    let snfNonPayments = calculateSNFNonPayments(
      rationOrButterFat,
      maxAllowed,
      proteinKgCow,
      lactoseAndOtherSolidsKgCow,
      class2ProteinPricePerKg,
      class2LactoseAndOtherSolidsPricePerKg,
      butterfatKgCow,
    );
    let totalRevenuePerCowPerDay =
      butterFatRevenue +
      proteinRevenue +
      otherSolidsRevenue -
      deductions -
      snfNonPayments;
    //not handling conversion here as its being used in other fields. will convert when needed on field level
    return (
      parseFloat(totalRevenuePerCowPerDay.toFixed(ROF_DECIMAL_PLACES)) || 0
    );
  } catch (e) {
    console.log('getTotalRevenuePerCowPerDay fail', e);
    logEvent('getTotalRevenuePerCowPerDay fail', e);
  }
};
export const calculateTotalRevenuePerKgFat = (
  totalRevenuePerCowPerDay = 0,
  butterfatKgCow = 0,
  keepString = false,
) => {
  try {
    // Total Revenue ($/cow/day) / Price (kg/cow) of Butterfat

    let totalRevenuePricePerKgFat = butterfatKgCow
      ? totalRevenuePerCowPerDay / butterfatKgCow
      : 0;
    totalRevenuePricePerKgFat = parseFloat(
      totalRevenuePricePerKgFat.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? totalRevenuePricePerKgFat
      : convertNumberToString(totalRevenuePricePerKgFat);
  } catch (e) {
    console.log('getTotalRevenuePerKgFat fail', e);
    logEvent('getTotalRevenuePerKgFat fail', e);
  }
};
export const calculateTotalRevenuePerHl = (
  milkProductionKg = 0,
  totalRevenuePerCowPerDay = 0,
  keepString = false,
) => {
  try {
    // (Total Revenue ($/cow/d)/milk production)

    let totalRevenuePerHl = milkProductionKg
      ? (totalRevenuePerCowPerDay / milkProductionKg) * 100
      : 0;

    totalRevenuePerHl = parseFloat(
      totalRevenuePerHl.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? totalRevenuePerHl
      : convertNumberToString(totalRevenuePerHl);
  } catch (e) {
    console.log('getTotalRevenue fail', e);
    logEvent('getTotalRevenue fail', e);
  }
};
export const calculateUnderQuotaLostRevenuePerMonth = (
  currentQuotaUtilization = 0,
  totalQuota = 0,
  totalRevenuePerHl = 0,
  butterfatKgHl = 0,
  keepString = false,
) => {
  try {
    // If: Current quota utilization > Total quota, RETURN 0
    // Else:-(Total quota-Current quota utilization)*((Total Revenue per Litre*100/Butterfat kg/hl)*30.4))

    if (currentQuotaUtilization > totalQuota) {
      return !keepString ? 0.0 : convertNumberToString(0.0);
    } else {
      let underQuotaLostRevenuePerMonth = butterfatKgHl
        ? -(totalQuota - currentQuotaUtilization) *
        (((totalRevenuePerHl * 100) / butterfatKgHl) * 30.4)
        : 0;

      underQuotaLostRevenuePerMonth = parseFloat(
        underQuotaLostRevenuePerMonth.toFixed(ROF_DECIMAL_PLACES),
      );

      return !keepString
        ? underQuotaLostRevenuePerMonth
        : convertNumberToString(underQuotaLostRevenuePerMonth);
    }
  } catch (e) {
    console.log('getLostRevenuePerMonth fail', e);
    logEvent('getLostRevenuePerMonth fail', e);
  }
};
export const calculateROFPerKgButterFat = (
  totalRevenuePerCowPerDay = 0,
  butterfatKgCow = 0,
  totalFeedCostPerCowPerDay = 0, //DB calculations
  keepString = false,
) => {
  try {
    // (Total Revenue ($/cow/day) / Price (kg/cow) of Butterfat) - (Total feed cost of cost/cow/day/Price (kg/cow) of Butterfat)

    let rofPerKgButterFat = butterfatKgCow
      ? totalRevenuePerCowPerDay / butterfatKgCow -
      totalFeedCostPerCowPerDay / butterfatKgCow
      : 0;

    rofPerKgButterFat = parseFloat(
      rofPerKgButterFat.toFixed(ROF_DECIMAL_PLACES),
    );
    return !keepString
      ? rofPerKgButterFat
      : convertNumberToString(rofPerKgButterFat);
  } catch (e) {
    console.log('getROFPerKgButterFat fail', e);
    logEvent('getROFPerKgButterFat fail', e);
  }
};
export const calculateMilkProdOutputROF = (
  totalRevenuePerCowPerDay = 0,
  totalFeedCostPerCowPerDay = 0, //DB calculations
  keepString = false,
) => {
  try {
    // Total Revenue ($/cow/day) - Total feed cost of cost/cow/day

    let returnOnFeed = totalRevenuePerCowPerDay - totalFeedCostPerCowPerDay;
    returnOnFeed = parseFloat(returnOnFeed.toFixed(ROF_DECIMAL_PLACES));
    return !keepString ? returnOnFeed : convertNumberToString(returnOnFeed);
  } catch (e) {
    console.log('getMilkProdOutputROF fail', e);
    logEvent('getMilkProdOutputROF fail', e);
  }
};
//#endregion

//#region DB calculations

//#region calculateFeedCostPerDay
const calculateFeedCostPerDay = (
  totalDryMatterOrHerdPerDay = 0,
  pricePerTon = 0,
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
  isBulkOrBag = false,
) => {
  if (isBulkOrBag && formType == ROF_FORM_TYPES.INDIVIDUAL_COWS) {
    return calculateFeedCostPerDayIndividualCowsBulkAndBags(
      totalDryMatterOrHerdPerDay,
      pricePerTon,
      lactatingCows,
    );
  } else {
    return totalDryMatterOrHerdPerDay * (pricePerTon / 1000);
  }
};

const calculateFeedCostPerDayIndividualCowsBulkAndBags = (
  totalHerdPerDay = 0,
  pricePerTon = 0,
  lactatingCows = 0,
) => {
  return lactatingCows * totalHerdPerDay * (pricePerTon / 1000);
};

const calculateTotalCost = (
  items = [],
  isBulkOrBag = false,
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
) => {
  return items.reduce((total, item) => {
    return (
      total +
      calculateFeedCostPerDay(
        isBulkOrBag ? item?.totalHerdPerDay : item?.totalDryMatter,
        item?.pricePerTon,
        lactatingCows,
        formType,
        isBulkOrBag,
      )
    );
  }, 0);
};

const calculateTotalPurchasedCostPerDay = (
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
) => {
  return (
    calculateTotalCost(bulkFeed, true, lactatingCows, formType) +
    calculateTotalCost(bagsFeed, true, lactatingCows, formType)
  );
};

const calculateTotalConcentrateCostPerDay = (
  grains = [],
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
) => {
  return (
    calculateTotalCost(grains) +
    calculateTotalCost(bulkFeed, true, lactatingCows, formType) +
    calculateTotalCost(bagsFeed, true, lactatingCows, formType)
  );
};

const calculateTotalFeedCostPerDay = (
  forages = [],
  grains = [],
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
) => {
  return (
    calculateTotalCost(forages) +
    calculateTotalCost(grains) +
    calculateTotalPurchasedCostPerDay(
      bulkFeed,
      bagsFeed,
      lactatingCows,
      formType,
    )
  );
};
//#endregion

//#region calculateCostPerCowPerDay
const calculateCostPerCowPerDay = (feedCost = 0, lactatingCows = 0) => {
  return lactatingCows ? feedCost / lactatingCows : 0;
};

const calculateTotalCostPerCowPerDay = (
  items = [],
  lactatingCows = 0,
  isBulkOrBag = false,
  formType = ROF_FORM_TYPES.TMR,
) => {
  return items.reduce((total, item) => {
    return (
      total +
      calculateCostPerCowPerDay(
        calculateFeedCostPerDay(
          isBulkOrBag ? item?.totalHerdPerDay : item?.totalDryMatter,
          item?.pricePerTon,
          lactatingCows,
          formType,
          isBulkOrBag,
        ),
        lactatingCows,
      )
    );
  }, 0);
};

const calculateTotalPurchasedCostPerCowPerDay = (
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
) => {
  return (
    convertStringToNumber(
      calculateTotalCostPerCowPerDay(
        bulkFeed,
        lactatingCows,
        true,
        formType,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    ) +
    convertStringToNumber(
      calculateTotalCostPerCowPerDay(
        bagsFeed,
        lactatingCows,
        true,
        formType,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    )
  );
};

const calculateTotalConcentrateCostPerCowPerDay = (
  grains = [],
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
) => {
  return (
    convertStringToNumber(
      calculateTotalCostPerCowPerDay(
        grains,
        lactatingCows,
        false,
        formType,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    ) +
    convertStringToNumber(
      calculateTotalCostPerCowPerDay(
        bulkFeed,
        lactatingCows,
        true,
        formType,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    ) +
    convertStringToNumber(
      calculateTotalCostPerCowPerDay(
        bagsFeed,
        lactatingCows,
        true,
        formType,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    )
  );
};

const calculateTotalFeedCostPerCowPerDay = (
  forages = [],
  grains = [],
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
) => {
  return (
    convertStringToNumber(
      calculateTotalCostPerCowPerDay(
        forages,
        lactatingCows,
        false,
        formType,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    ) +
    convertStringToNumber(
      calculateTotalCostPerCowPerDay(
        grains,
        lactatingCows,
        false,
        formType,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    ) +
    convertStringToNumber(
      calculateTotalPurchasedCostPerCowPerDay(
        bulkFeed,
        bagsFeed,
        lactatingCows,
        formType,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    )
  );
};
//#endregion

//#region calculateKgDMPerDay
const calculateKgDMPerDay = (totalDryMatter = 0, lactatingCows = 0) => {
  return lactatingCows ? totalDryMatter / lactatingCows : 0;
};

const calculateTotalCostKgDMPerDay = (items = [], lactatingCows = 0) => {
  return items.reduce((total, item) => {
    return total + calculateKgDMPerDay(item?.totalDryMatter, lactatingCows);
  }, 0);
};

const calculateTotalPurchasedCostKgDMPerDay = (
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
) => {
  return (
    convertStringToNumber(
      calculateTotalCostKgDMPerDay(bulkFeed, lactatingCows).toFixed(
        ROF_DECIMAL_PLACES,
      ),
      true,
    ) +
    convertStringToNumber(
      calculateTotalCostKgDMPerDay(bagsFeed, lactatingCows).toFixed(
        ROF_DECIMAL_PLACES,
      ),
      true,
    )
  );
};

const calculateTotalConcentrateCostKgDMPerDay = (
  grains = [],
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
) => {
  return (
    calculateTotalCostKgDMPerDay(grains, lactatingCows) +
    calculateTotalCostKgDMPerDay(bulkFeed, lactatingCows) +
    calculateTotalCostKgDMPerDay(bagsFeed, lactatingCows)
  );
};

const calculateTotalFeedCostKgDMPerDay = (
  forages = [],
  grains = [],
  bulkFeed = [],
  bagsFeed = [],
  lactatingCows = 0,
) => {
  return (
    convertStringToNumber(
      calculateTotalCostKgDMPerDay(forages, lactatingCows).toFixed(
        ROF_DECIMAL_PLACES,
      ),
      true,
    ) +
    convertStringToNumber(
      calculateTotalCostKgDMPerDay(grains, lactatingCows).toFixed(
        ROF_DECIMAL_PLACES,
      ),
      true,
    ) +
    convertStringToNumber(
      calculateTotalPurchasedCostKgDMPerDay(
        bulkFeed,
        bagsFeed,
        lactatingCows,
      ).toFixed(ROF_DECIMAL_PLACES),
      true,
    )
  );
};

//#endregion

//#region forage percentage
const calculatePercentForage = (
  forages = [],
  grains = [],
  bulkFeed = [],
  bagsFeed = [],
) => {
  const forageDM = forages.reduce((sum, item) => sum + item.totalDryMatter, 0);
  const totalDM =
    forageDM +
    grains.reduce((sum, item) => sum + item.totalDryMatter, 0) +
    bulkFeed.reduce((sum, item) => sum + item.totalDryMatter, 0) +
    bagsFeed.reduce((sum, item) => sum + item.totalDryMatter, 0);

  return totalDM ? (forageDM / totalDM) * 100 : 0;
};
//#endregion

export const getCalculatedOutputsForTool = (
  values,
  formType = ROF_FORM_TYPES.TMR,
) => {
  try {
    let forages = values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.HOME_GROWN_FORAGES],
      grains = values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.HOME_GROWN_GRAINS],
      purchasedBulk =
        values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.PURCHASE_BULK_FEED],
      purchasedBags =
        values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.PURCHASE_BAG_FEED],
      lactatingCows = values[ROF_FIELDS.FEEDING]?.[ROF_FIELDS.LACTATING_COWS];

    let calculatedOutputs = {
      [ROF_FIELDS.FORAGE_FEED_COST_PER_DAY]: calculateTotalCost(forages),
      [ROF_FIELDS.GRAINS_FEED_COST_PER_DAY]: calculateTotalCost(grains),
      [ROF_FIELDS.PURCHASED_BULK_FEED_COST_PER_DAY]: calculateTotalCost(
        purchasedBulk,
        true,
        lactatingCows,
        formType,
      ),
      [ROF_FIELDS.PURCHASED_BAGS_FEED_COST_PER_DAY]: calculateTotalCost(
        purchasedBags,
        true,
        lactatingCows,
        formType,
      ),
      [ROF_FIELDS.TOTAL_PURCHASED_COST_PER_DAY]:
        calculateTotalPurchasedCostPerDay(
          purchasedBulk,
          purchasedBags,
          lactatingCows,
          formType,
        ),
      [ROF_FIELDS.TOTAL_CONCENTRATE_COST_PER_DAY]:
        calculateTotalConcentrateCostPerDay(
          grains,
          purchasedBulk,
          purchasedBags,
          lactatingCows,
          formType,
        ),
      [ROF_FIELDS.TOTAL_FEED_COST_PER_DAY]: calculateTotalFeedCostPerDay(
        forages,
        grains,
        purchasedBulk,
        purchasedBags,
        lactatingCows,
        formType,
      ),
      //FEED_COST_PER_COW_PER_DAY
      [ROF_FIELDS.FORAGE_FEED_COST_PER_COW_PER_DAY]:
        calculateTotalCostPerCowPerDay(forages, lactatingCows, false, formType),
      [ROF_FIELDS.GRAINS_COST_PER_COW_PER_DAY]: calculateTotalCostPerCowPerDay(
        grains,
        lactatingCows,
        false,
        formType,
      ),
      [ROF_FIELDS.PURCHASED_BULK_FEED_PER_COW_PER_DAY]:
        calculateTotalCostPerCowPerDay(
          purchasedBulk,
          lactatingCows,
          true,
          formType,
        ),
      [ROF_FIELDS.PURCHASED_BAGS_FEED_PER_COW_PER_DAY]:
        calculateTotalCostPerCowPerDay(
          purchasedBags,
          lactatingCows,
          true,
          formType,
        ),
      [ROF_FIELDS.TOTAL_PURCHASED_COST_PER_COW_PER_DAY]:
        calculateTotalPurchasedCostPerCowPerDay(
          purchasedBulk,
          purchasedBags,
          lactatingCows,
          formType,
        ),
      [ROF_FIELDS.TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY]:
        calculateTotalConcentrateCostPerCowPerDay(
          grains,
          purchasedBulk,
          purchasedBags,
          lactatingCows,
          formType,
        ),
      [ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY]:
        calculateTotalFeedCostPerCowPerDay(
          forages,
          grains,
          purchasedBulk,
          purchasedBags,
          lactatingCows,
          formType,
        ),
      //KG_DM_PER_DAY
      [ROF_FIELDS.FORAGE_KG_DM_PER_DAY]: calculateTotalCostKgDMPerDay(
        forages,
        lactatingCows,
      ),
      [ROF_FIELDS.GRAINS_KG_DM_PER_DAY]: calculateTotalCostKgDMPerDay(
        grains,
        lactatingCows,
      ),
      [ROF_FIELDS.PURCHASED_BULK_KG_DM_PER_DAY]: calculateTotalCostKgDMPerDay(
        purchasedBulk,
        lactatingCows,
      ),
      [ROF_FIELDS.PURCHASED_BAGS_KG_DM_PER_DAY]: calculateTotalCostKgDMPerDay(
        purchasedBags,
        lactatingCows,
      ),
      [ROF_FIELDS.TOTAL_PURCHASED_COST_KG_DM_PER_DAY]:
        calculateTotalPurchasedCostKgDMPerDay(
          purchasedBulk,
          purchasedBags,
          lactatingCows,
        ),
      [ROF_FIELDS.TOTAL_CONCENTRATE_COST_KG_DM_PER_DAY]:
        calculateTotalConcentrateCostKgDMPerDay(
          grains,
          purchasedBulk,
          purchasedBags,
          lactatingCows,
        ),
      [ROF_FIELDS.TOTAL_FEED_COST_KG_DM_PER_DAY]:
        calculateTotalFeedCostKgDMPerDay(
          forages,
          grains,
          purchasedBulk,
          purchasedBags,
          lactatingCows,
        ),
      //FORAGE_PERCENTAGE
      [ROF_FIELDS.FORAGE_PERCENTAGE]: calculatePercentForage(
        forages,
        grains,
        purchasedBulk,
        purchasedBags,
      ),
    };
    return calculatedOutputs;
  } catch (error) {
    console.log('getCalculatedOutputsForTool fail', error);
    logEvent('getCalculatedOutputsForTool fail', error);
  }
};
//#endregion

//#region handle summary calculations

const calculateNoOfCowsToFillQuota = (totalQuota = 0, butterfatKgCow = 0) => {
  try {
    return butterfatKgCow
      ? parseFloat((totalQuota / butterfatKgCow).toFixed(ROF_DECIMAL_PLACES))
      : 0;
  } catch (error) {
    console.log('calculateNoOfCowsToFillQuota fail', error);
    logEvent('calculateNoOfCowsToFillQuota fail', error);
  }
};

const calculateTotalRevenuePerKgButterFat = (
  totalRevenuePerCowPerDay = 0,
  butterfatKgCow = 0,
) => {
  try {
    return butterfatKgCow
      ? parseFloat(
        (totalRevenuePerCowPerDay / butterfatKgCow).toFixed(
          ROF_DECIMAL_PLACES,
        ),
      )
      : 0;
  } catch (error) {
    console.log('calculateTotalRevenuePerKgButterFat fail', error);
    logEvent('calculateTotalRevenuePerKgButterFat fail', error);
  }
};

const calculateFeedCostPerKgOfBF = (
  totalFeedCostPerCowPerDay = 0,
  butterfatKgCow = 0,
) => {
  try {
    return butterfatKgCow
      ? parseFloat(
        (totalFeedCostPerCowPerDay / butterfatKgCow).toFixed(
          ROF_DECIMAL_PLACES,
        ),
      )
      : 0;
  } catch (error) {
    console.log('calculateFeedCostPerKgOfBF fail', error);
    logEvent('calculateFeedCostPerKgOfBF fail', error);
  }
};

const calculateFeedCostPerHlMilk = (
  totalFeedCostPerCowPerDay = 0,
  averageMilkProductionLitresPerCowPerDay = 0,
) => {
  try {
    return averageMilkProductionLitresPerCowPerDay
      ? parseFloat(
        (
          (totalFeedCostPerCowPerDay /
            averageMilkProductionLitresPerCowPerDay) *
          100
        ).toFixed(ROF_DECIMAL_PLACES),
      )
      : 0;
  } catch (error) {
    console.log('calculateFeedCostPerHlMilk fail', error);
    logEvent('calculateFeedCostPerHlMilk fail', error);
  }
};

const calculateROFPerCowPerDay = (
  totalRevenuePerCowPerDay = 0,
  totalFeedCostPerCowPerDay = 0,
) => {
  try {
    return totalRevenuePerCowPerDay - totalFeedCostPerCowPerDay || 0;
  } catch (error) {
    console.log('calculateROFPerCowPerDay fail', error);
    logEvent('calculateROFPerCowPerDay fail', error);
  }
};

const calculateROFPerHl = (revenuePerLiter = 0, feedCostPerHlMilk = 0) => {
  try {
    return revenuePerLiter - feedCostPerHlMilk || 0;
  } catch (error) {
    console.log('calculateROFPerHl fail', error);
    logEvent('calculateROFPerHl fail', error);
  }
};

export const getROFSummaryResultValues = (values, calculatedOutputs) => {
  try {
    let toolHerdProfileData = values[ROF_FIELDS.HERD_PROFILE] || {};
    let toolFeedingData = values[ROF_FIELDS.FEEDING] || {};
    let toolMilkProductionData = values[ROF_FIELDS.MILK_PRODUCTION] || {};
    let toolMilkProductionOutputsData =
      values[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS] || {};

    let averageMilkProductionLitresPerCowPerDay =
      calculateAverageMilkProductionPerCowPerDay(
        toolMilkProductionData?.[ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG],
        toolFeedingData[ROF_FIELDS.LACTATING_COWS],
      );

    let feedCostPerHlMilk = calculateFeedCostPerHlMilk(
      calculatedOutputs[ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY],
      averageMilkProductionLitresPerCowPerDay,
    );
    let feedCostPerKgOfBF = calculateFeedCostPerKgOfBF(
      calculatedOutputs[ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY],
      toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT][ROF_FIELDS.KG_PER_COW],
    );

    return {
      [ROF_FIELDS.HERD_BASELINE]: {
        [ROF_FIELDS.LACTATING_COWS]: toolFeedingData[ROF_FIELDS.LACTATING_COWS],
        [ROF_FIELDS.DAYS_IN_MILK]: toolFeedingData[ROF_FIELDS.DAYS_IN_MILK],
        [ROF_FIELDS.MUN]: toolHerdProfileData[ROF_FIELDS.MUN] || 0,
      },
      [ROF_FIELDS.QUOTA]: {
        [ROF_FIELDS.KG_OF_QUOTA]:
          toolMilkProductionData?.[ROF_FIELDS.KG_OF_QUOTA_PER_DAY] || 0,
        [ROF_FIELDS.INCENTIVE_DAYS]:
          toolMilkProductionData?.[ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY] || 0,
        [ROF_FIELDS.TOTAL_QUOTA]:
          toolMilkProductionData?.[ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY] || 0,
        [ROF_FIELDS.NO_OF_COWS_TO_FILL_QUOTA]: calculateNoOfCowsToFillQuota(
          toolMilkProductionData?.[ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY] || 0,
          toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT][ROF_FIELDS.KG_PER_COW],
        ),
        [ROF_FIELDS.TOTAL_FAT_PROTEIN]:
          toolMilkProductionOutputsData[ROF_FIELDS.TOTAL_FAT_PROTEIN] || 0,
        [ROF_FIELDS.RATIO_SNF_PER_BUTTERFAT]:
          toolMilkProductionOutputsData[ROF_FIELDS.RATIO_SNF_PER_BUTTERFAT] ||
          0,
        [ROF_FIELDS.MAX_ALLOWED]:
          toolMilkProductionOutputsData[ROF_FIELDS.MAX_ALLOWED] || 0,
      },
      [ROF_FIELDS.MILK_PRODUCTION]: {
        [ROF_FIELDS.AVERAGE_MILK_PRODUCTION_ANIMALS_IN_TANK]:
          toolMilkProductionData?.[ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG] || 0,
        [ROF_FIELDS.AVERAGE_MILK_PRODUCTION_LITRES_COW_DAY]:
          averageMilkProductionLitresPerCowPerDay,
        [ROF_FIELDS.DAIRY_EFFICIENCY]:
          toolMilkProductionOutputsData[ROF_FIELDS.DAIRY_EFFICIENCY] || 0,
        [ROF_FIELDS.BUTTERFAT]: {
          [ROF_FIELDS.PERCENTAGE_PER_HL]:
            toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT][
            ROF_FIELDS.PERCENTAGE_PER_HL
            ],
          [ROF_FIELDS.KG_PER_COW]:
            toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT][
            ROF_FIELDS.KG_PER_COW
            ],
        },
        [ROF_FIELDS.PROTEIN]: {
          [ROF_FIELDS.PERCENTAGE_PER_HL]:
            toolMilkProductionData?.[ROF_FIELDS.PROTEIN][
            ROF_FIELDS.PERCENTAGE_PER_HL
            ],
          [ROF_FIELDS.KG_PER_COW]:
            toolMilkProductionData?.[ROF_FIELDS.PROTEIN][ROF_FIELDS.KG_PER_COW],
        },
        [ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS]: {
          [ROF_FIELDS.PERCENTAGE_PER_HL]:
            toolMilkProductionData?.[ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS][
            ROF_FIELDS.PERCENTAGE_PER_HL
            ],
          [ROF_FIELDS.KG_PER_COW]:
            toolMilkProductionData?.[ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS][
            ROF_FIELDS.KG_PER_COW
            ],
        },
      },
      [ROF_FIELDS.REVENUE]: {
        [ROF_FIELDS.BF_REVENUE]:
          toolMilkProductionOutputsData[ROF_FIELDS.BF_REVENUE] || 0,
        [ROF_FIELDS.PROTEIN_REVENUE]:
          toolMilkProductionOutputsData[ROF_FIELDS.PROTEIN_REVENUE] || 0,
        [ROF_FIELDS.OTHER_SOLIDS_REVENUE]:
          toolMilkProductionOutputsData[ROF_FIELDS.OTHER_SOLIDS_REVENUE] || 0,
        [ROF_FIELDS.SUBTOTAL]:
          toolMilkProductionOutputsData[ROF_FIELDS.BF_REVENUE] +
          toolMilkProductionOutputsData[ROF_FIELDS.PROTEIN_REVENUE] +
          toolMilkProductionOutputsData[ROF_FIELDS.OTHER_SOLIDS_REVENUE],
        [ROF_FIELDS.DEDUCTIONS_PRICE_PER_COW_PER_DAY]:
          toolMilkProductionOutputsData[
          ROF_FIELDS.DEDUCTIONS_PRICE_PER_COW_PER_DAY
          ] || 0,
        [ROF_FIELDS.SNF_NON_PAYMENT]:
          toolMilkProductionOutputsData[ROF_FIELDS.SNF_NON_PAYMENT] || 0,
        [ROF_FIELDS.TOTAL_REVENUE_COW_DAY]:
          toolMilkProductionOutputsData[ROF_FIELDS.TOTAL_REVENUE_COW_DAY] || 0,
        [ROF_FIELDS.TOTAL_REVENUE_PER_KG_BUTTERFAT]:
          calculateTotalRevenuePerKgButterFat(
            toolMilkProductionOutputsData[ROF_FIELDS.TOTAL_REVENUE_COW_DAY],
            toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT][
            ROF_FIELDS.KG_PER_COW
            ],
          ) || 0,
        [ROF_FIELDS.TOTAL_REVENUE_PER_HL]:
          toolMilkProductionOutputsData[ROF_FIELDS.TOTAL_REVENUE_PER_HL] || 0,
      },
      [ROF_FIELDS.FEED_COSTS]: {
        [ROF_FIELDS.FORAGE_FEED_COST_PER_COW_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.FORAGE_FEED_COST_PER_COW_PER_DAY] || 0,
        [ROF_FIELDS.GRAINS_COST_PER_COW_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.GRAINS_COST_PER_COW_PER_DAY] || 0,
        [ROF_FIELDS.TOTAL_ON_FARM_FEED_COST_PER_COW_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.FORAGE_FEED_COST_PER_COW_PER_DAY] +
          calculatedOutputs[ROF_FIELDS.GRAINS_COST_PER_COW_PER_DAY] || 0,
        [ROF_FIELDS.PURCHASED_BULK_FEED_PER_COW_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.PURCHASED_BULK_FEED_PER_COW_PER_DAY] ||
          0,
        [ROF_FIELDS.PURCHASED_BAGS_FEED_PER_COW_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.PURCHASED_BAGS_FEED_PER_COW_PER_DAY] ||
          0,
        [ROF_FIELDS.TOTAL_PURCHASED_COST_PER_COW_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.TOTAL_PURCHASED_COST_PER_COW_PER_DAY] ||
          0,
        [ROF_FIELDS.TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY]:
          calculatedOutputs[
          ROF_FIELDS.TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY
          ] || 0,
        [ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY] || 0,
        [ROF_FIELDS.FEED_COST_PER_KG_OF_BF]: feedCostPerKgOfBF,
        [ROF_FIELDS.FEED_COST_PER_HL_OF_MILK]: feedCostPerHlMilk,
        [ROF_FIELDS.FORAGE_PERCENTAGE]:
          calculatedOutputs[ROF_FIELDS.FORAGE_PERCENTAGE] || 0,
      },
      [ROF_FIELDS.FEEDING_KG_DM_PER_DAY]: {
        [ROF_FIELDS.FORAGE_KG_DM_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.FORAGE_KG_DM_PER_DAY] || 0,
        [ROF_FIELDS.GRAINS_KG_DM_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.GRAINS_KG_DM_PER_DAY] || 0,
        [ROF_FIELDS.PURCHASED_BULK_KG_DM_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.PURCHASED_BULK_KG_DM_PER_DAY] || 0,
        [ROF_FIELDS.PURCHASED_BAGS_KG_DM_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.PURCHASED_BAGS_KG_DM_PER_DAY] || 0,
        [ROF_FIELDS.TOTAL_FEED_COST_KG_DM_PER_DAY]:
          calculatedOutputs[ROF_FIELDS.TOTAL_FEED_COST_KG_DM_PER_DAY] || 0,
      },
      [ROF_FIELDS.CURRENT_RETURN_OVER_FEED_COSTS]: {
        [ROF_FIELDS.RETURN_OVER_FEED_COST_PER_COW_PER_DAY]:
          calculateROFPerCowPerDay(
            toolMilkProductionOutputsData[ROF_FIELDS.TOTAL_REVENUE_COW_DAY],
            calculatedOutputs[ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY],
          ),
        [ROF_FIELDS.RETURN_OVER_FEED_COST_PER_KG_OF_BF]:
          calculateROFPerKgButterFat(
            toolMilkProductionOutputsData[ROF_FIELDS.TOTAL_REVENUE_COW_DAY],
            toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT][
            ROF_FIELDS.KG_PER_COW
            ],
            calculatedOutputs[ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY],
          ),
        [ROF_FIELDS.RETURN_OVER_FEED_COST_PER_HL]: calculateROFPerHl(
          toolMilkProductionOutputsData[ROF_FIELDS.TOTAL_REVENUE_PER_HL],
          feedCostPerHlMilk,
        ),
      },
    };
  } catch (error) {
    console.log('getROFSummaryResultValues fail', error);
    logEvent('getROFSummaryResultValues fail', error);
  }
};

//#endregion

//#region handle ROF DB model
const parseFeedingIngredientsForDB = (
  items = [],
  unit,
  lactatingCows = 0,
  formType = ROF_FORM_TYPES.TMR,
) => {
  try {
    let data = [];
    items?.map(item => {
      //having unit as null when we dont want UoM conversion at tool UI level
      let totalHerdPerDay =
          unit && unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToMetric(
                convertStringToNumber(item[ROF_FIELDS.TOTAL_HERD_PER_DAY]),
              )
            : convertStringToNumber(item[ROF_FIELDS.TOTAL_HERD_PER_DAY]),
        dryMatter = convertStringToNumber(item[ROF_FIELDS.DRY_MATTER]);

      let obj = {
        ...item,
        [ROF_FIELDS.TOTAL_HERD_PER_DAY]: totalHerdPerDay,
        [ROF_FIELDS.DRY_MATTER]: dryMatter,
        [ROF_FIELDS.TOTAL_DRY_MATTER]: calculateTotalKgOfDryMatter(
          totalHerdPerDay,
          dryMatter,
          lactatingCows,
          false,
          formType,
        ),
        [ROF_FIELDS.PRICE_PER_TON]: convertStringToNumber(
          item[ROF_FIELDS.PRICE_PER_TON],
        ),
      };
      data.push(obj);
    });
    return data;
  } catch (error) {
    console.log('parseFeedingIngredientsForDB fail', error);
    logEvent('parseFeedingIngredientsForDB fail', error);
  }
};

export const getROFToolDataForDB = (
  values,
  unit,
  formType = ROF_FORM_TYPES.TMR,
) => {
  try {
    let toolHerdProfileData = values[ROF_FIELDS.HERD_PROFILE] || {};
    let toolFeedingData = values[ROF_FIELDS.FEEDING] || {};
    let toolMilkProductionData = values[ROF_FIELDS.MILK_PRODUCTION] || {};

    let lactatingCows = toolFeedingData[ROF_FIELDS.LACTATING_COWS]
        ? convertStringToNumber(toolFeedingData[ROF_FIELDS.LACTATING_COWS])
        : null,
      averageMilkProductionAnimalsInTankKg = toolMilkProductionData?.[
        ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG
      ]
        ? unit === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToMetric(
              convertStringToNumber(
                toolMilkProductionData?.[ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG],
              ),
            )
          : convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG],
            )
        : null,
      averageMilkProductionLitresPerCowPerDay =
        calculateAverageMilkProductionPerCowPerDay(
          averageMilkProductionAnimalsInTankKg,
          lactatingCows,
        ),
      kgOfQuotaPerDay = toolMilkProductionData?.[ROF_FIELDS.KG_OF_QUOTA_PER_DAY]
        ? unit === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToMetric(
              convertStringToNumber(
                toolMilkProductionData?.[ROF_FIELDS.KG_OF_QUOTA_PER_DAY],
              ),
            )
          : convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.KG_OF_QUOTA_PER_DAY],
            )
        : null,
      incentiveDaysKgPerDay = toolMilkProductionData?.[
        ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY
      ]
        ? convertStringToNumber(
            toolMilkProductionData?.[ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY],
          )
        : null,
      totalQuotaKgPerDay = calculateTotalQuotaKgPerDay(
        kgOfQuotaPerDay,
        incentiveDaysKgPerDay,
      );

    let toolData = {
      [ROF_FIELDS.HERD_PROFILE]: {
        [ROF_FIELDS.BREED]: toolHerdProfileData[ROF_FIELDS.BREED] || null,
        [ROF_FIELDS.OTHER_BREED_TYPE]:
          toolHerdProfileData[ROF_FIELDS.OTHER_BREED_TYPE] || null,
        [ROF_FIELDS.FEEDING_TYPE]:
          toolHerdProfileData[ROF_FIELDS.FEEDING_TYPE] || null,
        [ROF_FIELDS.NUMBER_OF_TMR_GROUPS]: toolHerdProfileData[
          ROF_FIELDS.NUMBER_OF_TMR_GROUPS
        ]
          ? convertStringToNumber(
            toolHerdProfileData[ROF_FIELDS.NUMBER_OF_TMR_GROUPS],
          )
          : null,
        [ROF_FIELDS.TYPE_OF_SUPPLEMENT]:
          toolHerdProfileData[ROF_FIELDS.TYPE_OF_SUPPLEMENT] || null,
        [ROF_FIELDS.COOL_AID]:
          toolHerdProfileData[ROF_FIELDS.COOL_AID] || false,
        [ROF_FIELDS.FORTISSA_FIT]:
          toolHerdProfileData[ROF_FIELDS.FORTISSA_FIT] || false,
        [ROF_FIELDS.MUN]: toolHerdProfileData[ROF_FIELDS.MUN]
          ? convertStringToNumber(toolHerdProfileData[ROF_FIELDS.MUN])
          : null,
        [ROF_FIELDS.MILKING_PER_DAY]: toolHerdProfileData[
          ROF_FIELDS.MILKING_PER_DAY
        ]
          ? convertStringToNumber(
            toolHerdProfileData[ROF_FIELDS.MILKING_PER_DAY],
          )
          : null,
      },
      [ROF_FIELDS.FEEDING]: {
        [ROF_FIELDS.LACTATING_COWS]: lactatingCows,
        [ROF_FIELDS.DAYS_IN_MILK]: toolFeedingData[ROF_FIELDS.DAYS_IN_MILK]
          ? convertStringToNumber(toolFeedingData[ROF_FIELDS.DAYS_IN_MILK])
          : null,
        [ROF_FIELDS.HOME_GROWN_FORAGES]: parseFeedingIngredientsForDB(
          toolFeedingData[ROF_FIELDS.HOME_GROWN_FORAGES],
          unit,
          lactatingCows,
          formType,
        ),
        [ROF_FIELDS.HOME_GROWN_GRAINS]: parseFeedingIngredientsForDB(
          toolFeedingData[ROF_FIELDS.HOME_GROWN_GRAINS],
          unit,
          lactatingCows,
          formType,
        ),
        [ROF_FIELDS.PURCHASE_BULK_FEED]: parseFeedingIngredientsForDB(
          toolFeedingData[ROF_FIELDS.PURCHASE_BULK_FEED],
          unit,
          lactatingCows,
          formType,
        ),
        [ROF_FIELDS.PURCHASE_BAG_FEED]: parseFeedingIngredientsForDB(
          toolFeedingData[ROF_FIELDS.PURCHASE_BAG_FEED],
          unit,
          lactatingCows,
          formType,
        ),
      },
      [ROF_FIELDS.MILK_PRODUCTION]: {
        [ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG]: toolMilkProductionData?.[
          ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG
        ]
          ? convertStringToNumber(
            toolMilkProductionData?.[ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG],
          )
          : null,
        [ROF_FIELDS.MILK_PRODUCTION_KG]: toolMilkProductionData?.[
          ROF_FIELDS.MILK_PRODUCTION_KG
        ]
          ? convertStringToNumber(
            toolMilkProductionData?.[ROF_FIELDS.MILK_PRODUCTION_KG],
          )
          : null,
        [ROF_FIELDS.KG_OF_QUOTA_PER_DAY]: toolMilkProductionData?.[
          ROF_FIELDS.KG_OF_QUOTA_PER_DAY
        ]
          ? convertStringToNumber(
            toolMilkProductionData?.[ROF_FIELDS.KG_OF_QUOTA_PER_DAY],
          )
          : null,
        [ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY]: toolMilkProductionData?.[
          ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY
        ]
          ? convertStringToNumber(
            toolMilkProductionData?.[ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY],
          )
          : null,
        [ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY]: toolMilkProductionData?.[
          ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY
        ]
          ? convertStringToNumber(
            toolMilkProductionData?.[ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY],
          )
          : null,
        [ROF_FIELDS.CURRENT_QUOTA_UTILIZATION_KG_PER_DAY]:
          convertStringToNumber(
            calculateCurrentQuotaUtilizationKgPerDay(
              averageMilkProductionAnimalsInTankKg,
              toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT]?.[
              ROF_FIELDS.PERCENTAGE_PER_HL
              ],
              true,
            ),
          ) || null,

        [ROF_FIELDS.BUTTERFAT]: {
          [ROF_FIELDS.PRICE_PER_KG]: toolMilkProductionData?.[
            ROF_FIELDS.BUTTERFAT
          ]?.[ROF_FIELDS.PRICE_PER_KG]
            ? convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT][
              ROF_FIELDS.PRICE_PER_KG
              ],
            )
            : null,
          [ROF_FIELDS.PERCENTAGE_PER_HL]: toolMilkProductionData?.[
            ROF_FIELDS.BUTTERFAT
          ]?.[ROF_FIELDS.PERCENTAGE_PER_HL]
            ? convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT][
              ROF_FIELDS.PERCENTAGE_PER_HL
              ],
            )
            : null,
          [ROF_FIELDS.KG_PER_COW]:
            calculateKgPerCow(
              averageMilkProductionLitresPerCowPerDay,
              convertStringToNumber(
                toolMilkProductionData?.[ROF_FIELDS.BUTTERFAT]?.[
                ROF_FIELDS.PERCENTAGE_PER_HL
                ],
              ),
            ) || null,
        },

        [ROF_FIELDS.PROTEIN]: {
          [ROF_FIELDS.PRICE_PER_KG]: toolMilkProductionData?.[
            ROF_FIELDS.PROTEIN
          ]?.[ROF_FIELDS.PRICE_PER_KG]
            ? convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.PROTEIN][
              ROF_FIELDS.PRICE_PER_KG
              ],
            )
            : null,
          [ROF_FIELDS.PERCENTAGE_PER_HL]: toolMilkProductionData?.[
            ROF_FIELDS.PROTEIN
          ]?.[ROF_FIELDS.PERCENTAGE_PER_HL]
            ? convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.PROTEIN][
              ROF_FIELDS.PERCENTAGE_PER_HL
              ],
            )
            : null,
          [ROF_FIELDS.KG_PER_COW]:
            calculateKgPerCow(
              averageMilkProductionLitresPerCowPerDay,
              convertStringToNumber(
                toolMilkProductionData?.[ROF_FIELDS.PROTEIN]?.[
                ROF_FIELDS.PERCENTAGE_PER_HL
                ],
              ),
            ) || null,
        },

        [ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS]: {
          [ROF_FIELDS.PRICE_PER_KG]: toolMilkProductionData?.[
            ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
          ]?.[ROF_FIELDS.PRICE_PER_KG]
            ? convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS][
              ROF_FIELDS.PRICE_PER_KG
              ],
            )
            : null,
          [ROF_FIELDS.PERCENTAGE_PER_HL]: toolMilkProductionData?.[
            ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS
          ]?.[ROF_FIELDS.PERCENTAGE_PER_HL]
            ? convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS][
              ROF_FIELDS.PERCENTAGE_PER_HL
              ],
            )
            : null,
          [ROF_FIELDS.KG_PER_COW]:
            calculateKgPerCow(
              averageMilkProductionLitresPerCowPerDay,
              convertStringToNumber(
                toolMilkProductionData?.[ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS]?.[
                ROF_FIELDS.PERCENTAGE_PER_HL
                ],
              ),
            ) || null,
        },

        [ROF_FIELDS.CLASS2_PROTEIN]: {
          [ROF_FIELDS.PRICE_PER_KG]: toolMilkProductionData?.[
            ROF_FIELDS.CLASS2_PROTEIN
          ]?.[ROF_FIELDS.PRICE_PER_KG]
            ? convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.CLASS2_PROTEIN][
              ROF_FIELDS.PRICE_PER_KG
              ],
            )
            : null,
        },

        [ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS]: {
          [ROF_FIELDS.PRICE_PER_KG]: toolMilkProductionData?.[
            ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS
          ]?.[ROF_FIELDS.PRICE_PER_KG]
            ? convertStringToNumber(
              toolMilkProductionData?.[
              ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS
              ][ROF_FIELDS.PRICE_PER_KG],
            )
            : null,
        },

        [ROF_FIELDS.DEDUCTIONS]: {
          [ROF_FIELDS.PRICE_PER_KG]: toolMilkProductionData?.[
            ROF_FIELDS.DEDUCTIONS
          ]?.[ROF_FIELDS.PRICE_PER_KG]
            ? convertStringToNumber(
              toolMilkProductionData?.[ROF_FIELDS.DEDUCTIONS][
              ROF_FIELDS.PRICE_PER_KG
              ],
            )
            : null,
        },
      },
      [ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]: {
        [ROF_FIELDS.MAX_ALLOWED]: convertStringToNumber(
          values[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[ROF_FIELDS.MAX_ALLOWED],
        ),
      },
    };

    let milkProductionOutputData = getMilkProductionOutputsInitialFormValues(
      values,
      toolData,
      unit,
      formType,
    );
    toolData[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS] = milkProductionOutputData;

    let calculatedOutputs = getCalculatedOutputsForTool(toolData, formType);
    let summaryValues = getROFSummaryResultValues(toolData, calculatedOutputs);

    toolData[ROF_FIELDS.SUMMARY] = summaryValues;
    toolData[ROF_FIELDS.CALCULATED_OUTPUTS] = calculatedOutputs;

    return toolData;
  } catch (e) {
    console.log('getROFToolDataForDB fail', e);
    logEvent('getROFToolDataForDB fail', { e, values, unit, formType });
  }
};
//#endregion

// #region graphs
function filterRecentVisitsWithComparingVisitsIds(
  recentVisits,
  comparingVisitIds,
) {
  try {
    // filter visits that are selected for comparing
    const filteredVisits = recentVisits?.filter(el =>
      comparingVisitIds?.includes(el.id || el.visitId),
    );

    let formattedRecentVisits = [];
    if (filteredVisits?.length > 0) {
      formattedRecentVisits = filteredVisits.map(visitObj => {
        const parsedVisitData = getParsedToolData(
          visitObj[VISIT_TABLE_FIELDS.ROF],
        );

        return {
          rof: parsedVisitData || null,
          visitId: visitObj?.id,
          date: visitObj?.visitDate,
          mobileLastUpdatedTime: visitObj?.mobileLastUpdatedTime,
        };
      });
    }

    return formattedRecentVisits;
  } catch (error) {
    logEvent(
      'helpers -> rofHelper -> filterRecentVisitsWithComparingVisitsIds error ',
      error,
    );
    return [];
  }
}

//#region data points
const createDataPointsForROFGraph = (
  currentToolData = {},
  formType = '',
  formattedRecentVisits = [],
) => {
  try {
    let graphData = [];

    if (formattedRecentVisits?.length > 0) {
      const currentVisitROF = {
        ...getParsedToolData(formattedRecentVisits[0]?.rof),
        ...currentToolData,
      };
      formattedRecentVisits[0].rof = currentVisitROF;

      const rof = {
        dataPoints: [],
        onScreeColor: customColor.topScaleColor,
      },
        totalConcentrateCost = {
          dataPoints: [],
          onScreeColor: customColor.metabolicDisorderColor2,
        },
        totalFeedCost = {
          dataPoints: [],
          onScreeColor: customColor.middleScaleColor,
        },
        totalRevenue = {
          dataPoints: [],
          onScreeColor: customColor.mid2Color,
        };

      formattedRecentVisits.map(item => {
        const toolFormData = item.rof?.[formType];
        if (toolFormData && Object.keys(toolFormData)?.length > 0) {
          rof.dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: toolFormData?.[ROF_FIELDS.SUMMARY]?.[
              ROF_FIELDS.CURRENT_RETURN_OVER_FEED_COSTS
            ]?.[ROF_FIELDS.RETURN_OVER_FEED_COST_PER_COW_PER_DAY],
            onScreen:
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[
              ROF_FIELDS.CURRENT_RETURN_OVER_FEED_COSTS
              ]?.[ROF_FIELDS.RETURN_OVER_FEED_COST_PER_COW_PER_DAY],
          });
          totalFeedCost.dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.FEED_COSTS]?.[
              ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY
            ],
            onScreen:
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.FEED_COSTS]?.[
              ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY
              ],
          });
          totalRevenue.dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.REVENUE]?.[
              ROF_FIELDS.TOTAL_REVENUE_COW_DAY
            ],
            onScreen:
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.REVENUE]?.[
              ROF_FIELDS.TOTAL_REVENUE_COW_DAY
              ],
          });
          totalConcentrateCost.dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: toolFormData?.[ROF_FIELDS.CALCULATED_OUTPUTS]?.[
              ROF_FIELDS.TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY
            ],
            onScreen:
              toolFormData?.[ROF_FIELDS.CALCULATED_OUTPUTS]?.[
              ROF_FIELDS.TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY
              ],
          });
        }
      });

      graphData.push(rof);
      graphData.push(totalConcentrateCost);
      graphData.push(totalFeedCost);
      graphData.push(totalRevenue);
    }

    return graphData;
  } catch (e) {
    console.log('createDataPointsForROFGraph error', e);
    logEvent('createDataPointsForROFGraph error', e);
  }
};

const createDataPointsForROFPerFatGraph = (
  currentToolData = {},
  formType = '',
  formattedRecentVisits = [],
) => {
  try {
    let graphData = [];

    if (formattedRecentVisits?.length > 0) {
      const currentVisitROF = {
        ...getParsedToolData(formattedRecentVisits[0]?.rof),
        ...currentToolData,
      };
      formattedRecentVisits[0].rof = currentVisitROF;

      const rofPerKgButterFat = {
        dataPoints: [],
        onScreeColor: customColor.topScaleColor,
      },
        concentrateCostPerKgButterFat = {
          dataPoints: [],
          onScreeColor: customColor.metabolicDisorderColor2,
        },
        totalCostsPerKgPerFat = {
          dataPoints: [],
          onScreeColor: customColor.middleScaleColor,
        },
        totalRevenueDollarKgPerFat = {
          dataPoints: [],
          onScreeColor: customColor.mid2Color,
        };

      formattedRecentVisits.map(item => {
        const toolFormData = item.rof?.[formType];
        if (toolFormData && Object.keys(toolFormData)?.length > 0) {
          rofPerKgButterFat.dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: toolFormData?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[
              ROF_FIELDS.ROF_KG_BUTTER_FAT
            ],
            onScreen:
              toolFormData?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[
              ROF_FIELDS.ROF_KG_BUTTER_FAT
              ],
          });
          concentrateCostPerKgButterFat.dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: toolFormData?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[
              ROF_FIELDS.CONCENTRATE_COST_PER_KG_BF
            ],
            onScreen:
              toolFormData?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[
              ROF_FIELDS.CONCENTRATE_COST_PER_KG_BF
              ],
          });
          totalCostsPerKgPerFat.dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.FEED_COSTS]?.[
              ROF_FIELDS.FEED_COST_PER_KG_OF_BF
            ],
            onScreen:
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.FEED_COSTS]?.[
              ROF_FIELDS.FEED_COST_PER_KG_OF_BF
              ],
          });
          totalRevenueDollarKgPerFat.dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.REVENUE]?.[
              ROF_FIELDS.TOTAL_REVENUE_PER_KG_BUTTERFAT
            ],
            onScreen:
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.REVENUE]?.[
              ROF_FIELDS.TOTAL_REVENUE_PER_KG_BUTTERFAT
              ],
          });
        }
      });

      graphData.push(rofPerKgButterFat);
      graphData.push(concentrateCostPerKgButterFat);
      graphData.push(totalCostsPerKgPerFat);
      graphData.push(totalRevenueDollarKgPerFat);
    }

    return graphData;
  } catch (e) {
    console.log('createDataPointsForROFPerFatGraph error', e);
    logEvent('createDataPointsForROFPerFatGraph error', e);
  }
};

export const createDataPointsForROFGraphs = (
  currentToolData = {},
  recentVisits = [],
  comparingVisitIds = [],
  formType = '',
  graphType = ROF_GRAPH_TYPES()[0].graphType,
) => {
  try {
    const formattedRecentVisits = filterRecentVisitsWithComparingVisitsIds(
      recentVisits,
      comparingVisitIds,
    );

    const graphData =
      (graphType === ROF_GRAPH_TYPES()[0].graphType
        ? createDataPointsForROFGraph(
          currentToolData,
          formType,
          formattedRecentVisits,
        )
        : createDataPointsForROFPerFatGraph(
          currentToolData,
          formType,
          formattedRecentVisits,
        )) || [];

    return graphData;
  } catch (e) {
    logEvent('helpers -> rofHelper -> createDataPointsForROFGraphs fail', {
      e,
      currentToolData,
      formType,
      graphType,
    });
    return null;
  }
};

//#endregion

//#region rof graph export
const createModelForROFGraph = (
  currentVisit = {},
  formType = '',
  currencySymbol = '',
  weightUnit = '',
) => {
  try {
    const model = {
      visitName: currentVisit?.visitName,
      visitDate: dateHelper.getFormattedDate(
        currentVisit?.visitDate,
        DATE_FORMATS.dd_MMM_yy,
      ),
      fileName:
        currentVisit?.visitName +
        '-' +
        i18n.t('ReturnOverFeed') +
        '-' +
        i18n.t(formType),
      toolName: i18n.t('ReturnOverFeed'),
      returnOverFeedLabel: i18n.t('ReturnOverFeed'),
      secondLabel: i18n
        .t('totalFeedCostPerCowPerDay')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      thirdLabel: i18n
        .t('totalRevenueCowDay')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      fourthLabel: i18n
        .t('returnOverFeedCostPerCowPerDay')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit)
        .replaceAll("'", ''),
      xAxisLabel: i18n.t('visitDate'),
      totalConcentrateFeedCostLabel: i18n
        .t('totalConcentrateCostPerCowPerDay')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      dataPoints: [],
    };

    return model;
  } catch (e) {
    console.log('createModelForROFGraph error', e);
    logEvent('createModelForROFGraph error', e);
  }
};

const createModelForROFPerFatGraph = (
  currentVisit = {},
  formType = '',
  currencySymbol = '',
  weightUnit = '',
) => {
  try {
    const model = {
      visitName: currentVisit?.visitName,
      visitDate: dateHelper.getFormattedDate(
        currentVisit?.visitDate,
        DATE_FORMATS.dd_MMM_yy,
      ),
      fileName:
        currentVisit?.visitName +
        '-' +
        i18n
          .t('rofPerKgFat')
          .replaceAll('$', currencySymbol)
          .replaceAll('kg', weightUnit) +
        '-' +
        i18n.t(formType),
      toolName: i18n.t('ReturnOverFeed'),
      returnOverFeedKgPerFatLabel: i18n
        .t('rofPerKgFat')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      rofPerKgButterFatLabel: i18n
        .t('rofPerKgButterFat')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      concentrateCostPerKgButterFatLabel: i18n
        .t('concentrateCostPerKgBF')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      totalRevenueDollarKgPerFatLabel: i18n
        .t('totalRevenuePricePerKgFat')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      totalCostsPerKgPerFatLabel: i18n
        .t('feedCostPerKgOfBF')
        .replaceAll('$', currencySymbol)
        .replaceAll('kg', weightUnit),
      xAxisLabel: i18n.t('visitDate'),
      dataPoints: [],
    };

    return model;
  } catch (e) {
    console.log('createModelForROFPerFatGraph error', e);
    logEvent('createModelForROFPerFatGraph error', e);
  }
};

function createDataPointsForROFGraphsForExports(
  currentToolData = {},
  formType = '',
  formattedRecentVisits = [],
) {
  try {
    const dataPoints = [];

    if (formattedRecentVisits?.length > 0) {
      const currentVisitROF = {
        ...getParsedToolData(formattedRecentVisits[0]?.rof),
        ...currentToolData,
      };
      formattedRecentVisits[0].rof = currentVisitROF;

      formattedRecentVisits.map(item => {
        const toolFormData = item.rof?.[formType];

        if (toolFormData && Object.keys(toolFormData)?.length > 0) {
          dataPoints.push({
            visitDate: getFormattedDate(item.date, DATE_FORMATS.MM_dd),

            returnOverFeed: parseFloat(
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[
                ROF_FIELDS.CURRENT_RETURN_OVER_FEED_COSTS
              ]?.[ROF_FIELDS.RETURN_OVER_FEED_COST_PER_COW_PER_DAY].toFixed(
                ROF_DECIMAL_PLACES,
              ),
            ),

            totalConcentrateCost: parseFloat(
              toolFormData?.[ROF_FIELDS.CALCULATED_OUTPUTS]?.[
                ROF_FIELDS.TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY
              ].toFixed(ROF_DECIMAL_PLACES),
            ),

            totalFeedCost: parseFloat(
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.FEED_COSTS]?.[
                ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY
              ].toFixed(ROF_DECIMAL_PLACES),
            ),

            totalRevenue: parseFloat(
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.REVENUE]?.[
                ROF_FIELDS.TOTAL_REVENUE_COW_DAY
              ].toFixed(ROF_DECIMAL_PLACES),
            ),
          });
        }
      });
    }

    return dataPoints;
  } catch (e) {
    logEvent(
      'helpers -> rofHelper -> createDataPointsForROFGraphsForExports fail',
      e,
    );
    return null;
  }
}

const createDataPointsForROFPerFatGraphForExports = (
  currentToolData = {},
  formType = '',
  formattedRecentVisits = [],
) => {
  try {
    const dataPoints = [];

    if (formattedRecentVisits?.length > 0) {
      const currentVisitROF = {
        ...getParsedToolData(formattedRecentVisits[0]?.rof),
        ...currentToolData,
      };
      formattedRecentVisits[0].rof = currentVisitROF;

      formattedRecentVisits.map(item => {
        const toolFormData = item.rof?.[formType];

        if (toolFormData && Object.keys(toolFormData)?.length > 0) {
          dataPoints.push({
            visitDate: getFormattedDate(item.date, DATE_FORMATS.MM_dd),

            rofPerKgButterFat: parseFloat(
              toolFormData?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[
                ROF_FIELDS.ROF_KG_BUTTER_FAT
              ]?.toFixed(ROF_DECIMAL_PLACES),
            ),

            concentrateCostPerKgButterFat: parseFloat(
              toolFormData?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]?.[
                ROF_FIELDS.CONCENTRATE_COST_PER_KG_BF
              ].toFixed(ROF_DECIMAL_PLACES),
            ),

            totalCostsPerKgPerFat: parseFloat(
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.FEED_COSTS]?.[
                ROF_FIELDS.FEED_COST_PER_KG_OF_BF
              ].toFixed(ROF_DECIMAL_PLACES),
            ),

            totalRevenueDollarKgPerFat: parseFloat(
              toolFormData?.[ROF_FIELDS.SUMMARY]?.[ROF_FIELDS.REVENUE]?.[
                ROF_FIELDS.TOTAL_REVENUE_PER_KG_BUTTERFAT
              ].toFixed(ROF_DECIMAL_PLACES),
            ),
          });
        }
      });
    }

    return dataPoints;
  } catch (e) {
    console.log('createDataPointsForROFPerFatGraphForExports error', e);
    logEvent('createDataPointsForROFPerFatGraphForExports error', e);
  }
};

function createModelDataForROFGraphsForExports(
  currentToolData = {},
  recentVisits = [],
  comparingVisitIds = [],
  formType = '',
  graphType = ROF_GRAPH_TYPES()[0].graphType,
) {
  try {
    const formattedRecentVisits = filterRecentVisitsWithComparingVisitsIds(
      recentVisits,
      comparingVisitIds,
    );

    const dataPoints =
      (graphType === ROF_GRAPH_TYPES()[0].graphType
        ? createDataPointsForROFGraphsForExports(
          currentToolData,
          formType,
          formattedRecentVisits,
        )
        : createDataPointsForROFPerFatGraphForExports(
          currentToolData,
          formType,
          formattedRecentVisits,
        )) || [];

    return dataPoints;
  } catch (e) {
    logEvent(
      'helpers -> rofHelper -> createModelDataForROFGraphsForExports fail',
      e,
    );
    return null;
  }
}

/**
 * @description
 * helper function to model data for download or share using options like image or excel
 *
 * @returns
 */
export const downloadShareRofGraphDataModel = (
  rofToolData,
  currentVisit,
  comparingRofVisitsIds,
  recentVisits,
  formType,
  weightUnit,
  currencySymbol,
  graphType = ROF_GRAPH_TYPES()[0].graphType.graphType,
) => {
  try {
    if (rofToolData) {
      const model =
        (graphType === ROF_GRAPH_TYPES()[0].graphType
          ? createModelForROFGraph(
            currentVisit,
            formType,
            currencySymbol,
            weightUnit,
          )
          : createModelForROFPerFatGraph(
            currentVisit,
            formType,
            currencySymbol,
            weightUnit,
          )) || [];

      model.dataPoints = createModelDataForROFGraphsForExports(
        rofToolData,
        recentVisits,
        comparingRofVisitsIds,
        formType,
        graphType,
      );

      return model;
    }

    return null;
  } catch (e) {
    logEvent('downloadShareRofGraphDataModel error', {
      e,
      graphType,
      rofToolData,
      formType,
    });
  }
};

//#endregion
//#endregion
