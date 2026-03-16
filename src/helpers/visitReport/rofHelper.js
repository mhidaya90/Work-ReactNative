import { getParsedToolData } from '../genericHelper';
import { createDataPointsForROFGraphs } from '../rofHelper';
import { logEvent } from '../logHelper';

import i18n from '../../localization/i18n';

import { ENUM_CONSTANTS } from '../../constants/AppConstants';
import { ROF_FIELDS } from '../../constants/FormConstants';
import {
  ROF_FEEDING_INGREDIENTS_TYPES,
  ROF_FORM_TYPES,
  ROF_GRAPH_TYPES,
} from '../../constants/toolsConstants/ROFConstants';

const getEnumDisplayValue = (enumData, key) => {
  if (!enumData || !key) return key || '-';

  const enumItem = enumData.find(item => item.key === key);
  return enumItem.value || key;
};

export const getAvailableFormTypes = (analysis = {}) => {
  const rof = getParsedToolData(analysis?.visitDetails?.returnOverFeed);
  const formTypes = [];

  const analysisCategories = analysis?.tool?.analysisCategories || [];

  analysisCategories.forEach(category => {
    if (category.isSelected) {
      if (category.value === ROF_FORM_TYPES.TMR && rof?.tmr) {
        formTypes.push({
          key: ROF_FORM_TYPES.TMR,
          label: category.title || 'TMR',
        });
      } else if (
        category.value === ROF_FORM_TYPES.INDIVIDUAL_COWS &&
        rof?.individualCow
      ) {
        formTypes.push({
          key: ROF_FORM_TYPES.INDIVIDUAL_COWS,
          label: category.title || 'Individual Cow',
        });
      }
    }
  });

  if (formTypes.length === 0) {
    if (rof?.tmr) {
      formTypes.push({ key: ROF_FORM_TYPES.TMR, label: 'TMR' });
    }

    if (rof?.individualCow) {
      formTypes.push({
        key: ROF_FORM_TYPES.INDIVIDUAL_COWS,
        label: 'Individual Cow',
      });
    }
  }

  return formTypes;
};

export const getHerdProfileTableData = (
  analysis = {},
  enums,
  formType = ROF_FORM_TYPES.TMR,
  previousROFVisitData = {},
) => {
  const tableHeader = [];

  const rof = getParsedToolData(analysis?.visitDetails?.returnOverFeed);
  const herdProfile = rof?.[formType]?.herdProfile || {};
  const prevHerdProfile = previousROFVisitData?.[formType]?.herdProfile || {};
  const feeding = rof?.[formType]?.feeding || {};
  const prevFeeding = previousROFVisitData?.[formType]?.feeding || {};

  const tableData = [
    [
      ROF_FIELDS.BREED,
      herdProfile[ROF_FIELDS.BREED] === 'Other'
        ? herdProfile[ROF_FIELDS.OTHER_BREED_TYPE] || '-'
        : getEnumDisplayValue(
            enums?.[ENUM_CONSTANTS.BREED_RETURN_OVER_FEED],
            herdProfile[ROF_FIELDS.BREED],
          ),
      prevHerdProfile[ROF_FIELDS.BREED] === 'Other'
        ? prevHerdProfile[ROF_FIELDS.OTHER_BREED_TYPE] || '-'
        : getEnumDisplayValue(
            enums?.[ENUM_CONSTANTS.BREED_RETURN_OVER_FEED],
            prevHerdProfile[ROF_FIELDS.BREED],
          ),
    ],
    [
      ROF_FIELDS.FEEDING,
      getEnumDisplayValue(
        enums?.[ENUM_CONSTANTS.FEEDING],
        herdProfile[ROF_FIELDS.FEEDING_TYPE],
      ),
      getEnumDisplayValue(
        enums?.[ENUM_CONSTANTS.FEEDING],
        prevHerdProfile[ROF_FIELDS.FEEDING_TYPE],
      ),
    ],
    [
      ROF_FIELDS.NUMBER_OF_TMR_GROUPS,
      herdProfile[ROF_FIELDS.NUMBER_OF_TMR_GROUPS] ?? '-',
      prevHerdProfile[ROF_FIELDS.NUMBER_OF_TMR_GROUPS] ?? '-',
    ],
    [
      ROF_FIELDS.SELECTED,
      getEnumDisplayValue(
        enums?.[ENUM_CONSTANTS.SUPPLEMENT_TYPES],
        herdProfile[ROF_FIELDS.TYPE_OF_SUPPLEMENT],
      ),
      getEnumDisplayValue(
        enums?.[ENUM_CONSTANTS.SUPPLEMENT_TYPES],
        prevHerdProfile[ROF_FIELDS.TYPE_OF_SUPPLEMENT],
      ),
    ],
    [
      ROF_FIELDS.LACTATING_COWS,
      feeding[ROF_FIELDS.LACTATING_COWS] || '-',
      prevFeeding[ROF_FIELDS.LACTATING_COWS] || '-',
    ],
    [
      ROF_FIELDS.COOL_AID,
      herdProfile[ROF_FIELDS.COOL_AID] ? i18n.t('yes') : i18n.t('no'),
      prevHerdProfile[ROF_FIELDS.COOL_AID] ? i18n.t('yes') : i18n.t('no'),
    ],
    [
      ROF_FIELDS.FORTISSA_FIT,
      herdProfile[ROF_FIELDS.FORTISSA_FIT] ? i18n.t('yes') : i18n.t('no'),
      prevHerdProfile[ROF_FIELDS.FORTISSA_FIT] ? i18n.t('yes') : i18n.t('no'),
    ],
    [
      ROF_FIELDS.MUN,
      herdProfile[ROF_FIELDS.MUN] || '-',
      prevHerdProfile[ROF_FIELDS.MUN] || '-',
    ],
    [
      ROF_FIELDS.MILKING_PER_DAY,
      herdProfile[ROF_FIELDS.MILKING_PER_DAY] ?? '-',
      prevHerdProfile[ROF_FIELDS.MILKING_PER_DAY] ?? '-',
    ],
    [
      ROF_FIELDS.DAYS_IN_MILK,
      feeding[ROF_FIELDS.DAYS_IN_MILK] || '-',
      prevFeeding[ROF_FIELDS.DAYS_IN_MILK] || '-',
    ],
  ];

  return { tableHeader, tableData };
};

// Helper function to create feeding section data
const createFeedingSectionData = (
  feedingItem,
  sectionType,
  enums,
  formType,
  prevFeedingIngredient = [],
) => {
  try {
    if (!feedingItem || Object.keys(feedingItem).length === 0) return [];

    let titleText = '';
    let nameText = '';
    let name = '';
    let prevFeedingItemName = '';
    let prevFeedingItem = {};

    switch (sectionType) {
      case ROF_FIELDS.HOME_GROWN_FORAGES:
        titleText = `${i18n.t('homeGrownForages')} | ${getEnumDisplayValue(
          enums?.[ENUM_CONSTANTS.HOME_GROWN_FORAGE_TYPES],
          feedingItem?.[ROF_FIELDS.HOME_GROWN_FORAGE_TYPE],
        )}`;
        nameText = ROF_FIELDS.FORAGE_NAME;
        name = feedingItem[ROF_FIELDS.FORAGE_NAME];

        prevFeedingItem = prevFeedingIngredient.find(i => {
          return (
            i?.[ROF_FIELDS.HOME_GROWN_FORAGE_TYPE] ===
              feedingItem?.[ROF_FIELDS.HOME_GROWN_FORAGE_TYPE] &&
            i[ROF_FIELDS.FORAGE_NAME] === feedingItem[ROF_FIELDS.FORAGE_NAME]
          );
        });
        prevFeedingItemName = prevFeedingItem?.[ROF_FIELDS.FORAGE_NAME];
        break;
      case ROF_FIELDS.HOME_GROWN_GRAINS:
        titleText = `${i18n.t('homeGrownGrains')} | ${getEnumDisplayValue(
          enums?.[ENUM_CONSTANTS.HOME_GROWN_GRAIN_TYPES],
          feedingItem?.[ROF_FIELDS.HOME_GROWN_GRAINS_TYPE],
        )}`;
        nameText = ROF_FIELDS.GRAINS_NAME;
        name = feedingItem[ROF_FIELDS.GRAINS_NAME];

        prevFeedingItem = prevFeedingIngredient.find(i => {
          return (
            i?.[ROF_FIELDS.HOME_GROWN_GRAINS_TYPE] ===
              feedingItem?.[ROF_FIELDS.HOME_GROWN_GRAINS_TYPE] &&
            i[ROF_FIELDS.GRAINS_NAME] === feedingItem[ROF_FIELDS.GRAINS_NAME]
          );
        });
        prevFeedingItemName = prevFeedingItem?.[ROF_FIELDS.GRAINS_NAME];

        break;
      case ROF_FIELDS.PURCHASE_BULK_FEED:
        titleText = i18n.t('purchaseBulkFeed');
        nameText = ROF_FIELDS.FEED_NAME;
        name = feedingItem[ROF_FIELDS.FEED_NAME];
        prevFeedingItem = prevFeedingIngredient.find(i => {
          return i[ROF_FIELDS.FEED_NAME] === feedingItem[ROF_FIELDS.FEED_NAME];
        });
        prevFeedingItemName = prevFeedingItem?.[ROF_FIELDS.FEED_NAME];

        break;
      case ROF_FIELDS.PURCHASE_BAG_FEED:
        titleText = i18n.t('purchaseBagsFeed');
        nameText = ROF_FIELDS.FEED_NAME;
        name = feedingItem[ROF_FIELDS.FEED_NAME];
        prevFeedingItem = prevFeedingIngredient.find(i => {
          return i[ROF_FIELDS.FEED_NAME] === feedingItem[ROF_FIELDS.FEED_NAME];
        });
        prevFeedingItemName = prevFeedingItem?.[ROF_FIELDS.FEED_NAME];

        break;
    }

    const baseData = [
      ['title', titleText],
      [nameText, name, prevFeedingItemName],
    ];

    return [
      ...baseData,
      [
        formType === ROF_FORM_TYPES.TMR
          ? ROF_FIELDS.TOTAL_HERD_PER_DAY
          : 'totalCowPerDay',
        feedingItem[ROF_FIELDS.TOTAL_HERD_PER_DAY] || '-',
        prevFeedingItem?.[ROF_FIELDS.TOTAL_HERD_PER_DAY] || '-',
      ],
      [
        ROF_FIELDS.DRY_MATTER,
        feedingItem[ROF_FIELDS.DRY_MATTER] || '-',
        prevFeedingItem?.[ROF_FIELDS.DRY_MATTER] || '-',
      ],
      [
        ROF_FIELDS.TOTAL_DRY_MATTER,
        feedingItem[ROF_FIELDS.TOTAL_DRY_MATTER] || '-',
        prevFeedingItem?.[ROF_FIELDS.TOTAL_DRY_MATTER] || '-',
      ],
      [
        ROF_FIELDS.PRICE_PER_TON,
        feedingItem[ROF_FIELDS.PRICE_PER_TON] || '-',
        prevFeedingItem?.[ROF_FIELDS.PRICE_PER_TON] || '-',
      ],
    ];
  } catch (e) {
    logEvent('createFeedingSectionData error', e);
    console.log('createFeedingSectionData error', e);
  }
};

export const getAllFeedingSectionsData = (
  analysis = [],
  enums,
  formType = ROF_FORM_TYPES.TMR,
  previousROFVisitData = {},
) => {
  try {
    const rof = getParsedToolData(analysis?.visitDetails?.returnOverFeed);
    const feeding = rof?.[formType]?.[ROF_FIELDS.FEEDING] || {};
    const _feeding =
      previousROFVisitData?.[formType]?.[ROF_FIELDS.FEEDING] || {};

    const allSections = [];

    Object.values(ROF_FEEDING_INGREDIENTS_TYPES).map(feedingIngredient => {
      if (feeding?.[feedingIngredient]?.length > 0) {
        feeding[feedingIngredient]?.forEach(item => {
          const sectionData = createFeedingSectionData(
            item,
            feedingIngredient,
            enums,
            formType,
            _feeding[feedingIngredient],
          );

          if (sectionData.length > 0) {
            allSections.push({
              type: feedingIngredient,
              data: sectionData,
            });
          }
        });
      }
    });

    return allSections;
  } catch (e) {
    logEvent('getAllFeedingSectionsData error', e);
  }
};

// Function to organize feeding sections into pages
export const organizeFeedingSectionsIntoPages = allSections => {
  try {
    if (allSections.length === 0) return [];
    let pages = [
      {
        leftColumn: allSections.slice(0, 3),
        rightColumn: allSections.slice(3, 6),
        isFirstPage: true,
      },
    ];

    if (allSections.length > 6) {
      pages.push({
        leftColumn: allSections.slice(6, 13),
        rightColumn: allSections.slice(13, 20),
        isFirstPage: false,
      });
    }
    return pages;
  } catch (e) {
    logEvent('organizeFeedingSectionsIntoPages error', e);
  }
};

export const getMilkProductionTableData = (
  analysis = {},
  formType = ROF_FORM_TYPES.TMR,
  previousROFVisitData = {},
) => {
  const rof = getParsedToolData(analysis?.visitDetails?.returnOverFeed);
  const milk = rof?.[formType]?.milkProduction || {};
  const prevMilkProd =
    previousROFVisitData?.[formType]?.[ROF_FIELDS.MILK_PRODUCTION] || {};

  const milkProductionSection = [
    [
      ROF_FIELDS.AVERAGE_MILK_PRODUCTION_ANIMALS_IN_TANK,
      parseFloat(milk?.averageMilkProductionKg ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.averageMilkProductionKg ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.MILK_PRODUCTION_KG,
      parseFloat(milk?.milkProductionKg ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.milkProductionKg ?? 0).toFixed(2),
    ],
  ];

  const butterfatSection = [
    ['title', ROF_FIELDS.BUTTERFAT],
    [
      ROF_FIELDS.PRICE_PER_KG,
      parseFloat(milk?.butterfat?.pricePerKg ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.butterfat?.pricePerKg ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.PERCENTAGE_PER_HL,
      parseFloat(milk?.butterfat?.percentagePerHl ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.butterfat?.percentagePerHl ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.KG_PER_COW,
      parseFloat(milk?.butterfat?.kgPerCow ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.butterfat?.kgPerCow ?? 0).toFixed(2),
    ],
  ];

  const secondColumnDataFirst = [
    [
      ROF_FIELDS.KG_OF_QUOTA_PER_DAY,
      parseFloat(milk?.kgOfQuotaPerDay ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.kgOfQuotaPerDay ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.INCENTIVE_DAYS_KG_PER_DAY,
      parseFloat(milk?.incentiveDaysKgPerDay ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.incentiveDaysKgPerDay ?? 0).toFixed(2),
    ],
  ];

  const lactoseAndOtherSolidsSection = [
    ['title', ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS],
    [
      ROF_FIELDS.PRICE_PER_KG,
      parseFloat(milk?.lactoseAndOtherSolids?.pricePerKg ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.lactoseAndOtherSolids?.pricePerKg ?? 0).toFixed(
        2,
      ),
    ],
    [
      ROF_FIELDS.PERCENTAGE_PER_HL,
      parseFloat(milk?.lactoseAndOtherSolids?.percentagePerHl ?? 0).toFixed(2),
      parseFloat(
        prevMilkProd?.lactoseAndOtherSolids?.percentagePerHl ?? 0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.KG_PER_COW,
      parseFloat(milk?.lactoseAndOtherSolids?.kgPerCow ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.lactoseAndOtherSolids?.kgPerCow ?? 0).toFixed(2),
    ],
  ];

  const thirdColumnDataFirst = [
    [
      ROF_FIELDS.TOTAL_QUOTA_KG_PER_DAY,
      parseFloat(milk?.totalQuotaKgPerDay ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.totalQuotaKgPerDay ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.CURRENT_QUOTA_UTILIZATION_KG_PER_DAY,
      parseFloat(milk?.currentQuotaUtilizationKgPerDay ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.currentQuotaUtilizationKgPerDay ?? 0).toFixed(2),
    ],
  ];

  const proteinSection = [
    ['title', ROF_FIELDS.PROTEIN],
    [
      ROF_FIELDS.PRICE_PER_KG,
      parseFloat(milk?.protein?.pricePerKg ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.protein?.pricePerKg ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.PERCENTAGE_PER_HL,
      parseFloat(milk?.protein?.percentagePerHl ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.protein?.percentagePerHl ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.KG_PER_COW,
      parseFloat(milk?.protein?.kgPerCow ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.protein?.kgPerCow ?? 0).toFixed(2),
    ],
  ];

  const class2LactoseAndOtherSolidsSection = [
    ['title', ROF_FIELDS.CLASS2_LACTOSE_AND_OTHER_SOLIDS],
    [
      ROF_FIELDS.PRICE_PER_KG,
      parseFloat(milk?.class2LactoseAndOtherSolids?.pricePerKg ?? 0).toFixed(2),
      parseFloat(
        prevMilkProd?.class2LactoseAndOtherSolids?.pricePerKg ?? 0,
      ).toFixed(2),
    ],
  ];

  const class2ProteinSection = [
    ['title', ROF_FIELDS.CLASS2_PROTEIN],
    [
      ROF_FIELDS.PRICE_PER_KG,
      parseFloat(milk?.class2Protein?.pricePerKg ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.class2Protein?.pricePerKg ?? 0).toFixed(2),
    ],
  ];

  const deductionsSection = [
    ['title', ROF_FIELDS.DEDUCTIONS],
    [
      ROF_FIELDS.PRICE_PER_KG,
      parseFloat(milk?.deductions?.pricePerKg ?? 0).toFixed(2),
      parseFloat(prevMilkProd?.deductions?.pricePerKg ?? 0).toFixed(2),
    ],
  ];

  return {
    milkProductionSection,
    butterfatSection,
    secondColumnDataFirst,
    lactoseAndOtherSolidsSection,
    thirdColumnDataFirst,
    proteinSection,
    class2LactoseAndOtherSolidsSection,
    class2ProteinSection,
    deductionsSection,
  };
};

export const getMilkProductionOutputsTableData = (
  analysis = {},
  formType = ROF_FORM_TYPES.TMR,
  previousROFVisitData = {},
) => {
  const rof = getParsedToolData(analysis?.visitDetails?.returnOverFeed);
  const milkOutputs =
    rof?.[formType]?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS] || {};
  const prevMilkProdOutputs =
    previousROFVisitData?.[formType]?.[ROF_FIELDS.MILK_PRODUCTION_OUTPUTS] ||
    {};

  const firstColumnSection = [
    [
      ROF_FIELDS.RATIO_SNF_PER_BUTTERFAT,
      parseFloat(milkOutputs?.ratioSNFPerButterfat ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.ratioSNFPerButterfat ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.MAX_ALLOWED,
      parseFloat(milkOutputs?.maxAllowed ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.maxAllowed ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_FAT_PROTEIN,
      parseFloat(milkOutputs?.totalFatProtein ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.totalFatProtein ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.DAIRY_EFFICIENCY,
      parseFloat(milkOutputs?.dairyEfficiency ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.dairyEfficiency ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.COMPONENT_EFFICIENCY,
      parseFloat(milkOutputs?.componentEfficiency ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.componentEfficiency ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_REVENUE_PER_HL,
      parseFloat(milkOutputs?.totalRevenuePerHl ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.totalRevenuePerHl ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.FEED_COST_PER_HL,
      parseFloat(milkOutputs?.feedCostPerHl ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.feedCostPerHl ?? 0).toFixed(2),
    ],
  ];

  const secondColumnSection = [
    [
      ROF_FIELDS.PURCHASED_FEED_COST_PER_HL,
      parseFloat(milkOutputs?.purchasedFeedCostPerHl ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.purchasedFeedCostPerHl ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.CONCENTRATE_COST_PER_HL,
      parseFloat(milkOutputs?.concentrateCostPerHl ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.concentrateCostPerHl ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.CONCENTRATE_COST_PER_KG_BF,
      parseFloat(milkOutputs?.concentrateCostPerKgBF ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.concentrateCostPerKgBF ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.BF_REVENUE,
      parseFloat(milkOutputs?.bfRevenue ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.bfRevenue ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.PROTEIN_REVENUE,
      parseFloat(milkOutputs?.proteinRevenue ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.proteinRevenue ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.OTHER_SOLIDS_REVENUE,
      parseFloat(milkOutputs?.otherSolidsRevenue ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.otherSolidsRevenue ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.DEDUCTIONS_PRICE_PER_COW_PER_DAY,
      parseFloat(milkOutputs?.deductionsPricePerCowPerDay ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.deductionsPricePerCowPerDay ?? 0).toFixed(
        2,
      ),
    ],
  ];

  const thirdColumnSection = [
    [
      ROF_FIELDS.SNF_NON_PAYMENT,
      parseFloat(milkOutputs?.snfNonPayment ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.snfNonPayment ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_REVENUE_KG_FAT,
      parseFloat(milkOutputs?.totalRevenuePricePerKgFat ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.totalRevenuePricePerKgFat ?? 0).toFixed(
        2,
      ),
    ],
    [
      ROF_FIELDS.TOTAL_REVENUE_COW_DAY,
      parseFloat(milkOutputs?.totalRevenueCowDay ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.totalRevenueCowDay ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.UNDER_QUOTA_LOST_REVENUE,
      parseFloat(milkOutputs?.underQuotaLostRevenuePerMonth ?? 0).toFixed(2),
      parseFloat(
        prevMilkProdOutputs?.underQuotaLostRevenuePerMonth ?? 0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.ROF_KG_BUTTER_FAT,
      parseFloat(milkOutputs?.rofPerKgButterFat ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.rofPerKgButterFat ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.ROF,
      parseFloat(milkOutputs?.rof ?? 0).toFixed(2),
      parseFloat(prevMilkProdOutputs?.rof ?? 0).toFixed(2),
    ],
  ];

  return {
    firstColumnSection,
    secondColumnSection,
    thirdColumnSection,
  };
};

export const getSummaryTablesData = (
  analysis = {},
  formType = ROF_FORM_TYPES.TMR,
  previousROFVisitData = {},
) => {
  const rof = getParsedToolData(analysis?.visitDetails?.returnOverFeed);

  const summary = rof?.[formType]?.[ROF_FIELDS.SUMMARY] || {};

  const prevSummary =
    previousROFVisitData?.[formType]?.[ROF_FIELDS.SUMMARY] || {};

  const feedCostsData = summary?.[ROF_FIELDS.FEED_COSTS] || {};
  const prevFeedCostsData = prevSummary?.[ROF_FIELDS.FEED_COSTS] || {};
  const feedCostsSection = [
    [
      ROF_FIELDS.FORAGE_FEED_COST_PER_COW_PER_DAY,
      parseFloat(feedCostsData?.forageFeedCostPerCowPerDay ?? 0).toFixed(2),
      parseFloat(prevFeedCostsData?.forageFeedCostPerCowPerDay ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.GRAINS_COST_PER_COW_PER_DAY,
      parseFloat(feedCostsData?.grainsCostPerCowPerDay ?? 0).toFixed(2),
      parseFloat(prevFeedCostsData?.grainsCostPerCowPerDay ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_ON_FARM_FEED_COST_PER_COW_PER_DAY,
      parseFloat(feedCostsData?.totalOnFarmFeedCostPerCowPerDay ?? 0).toFixed(
        2,
      ),
      parseFloat(
        prevFeedCostsData?.totalOnFarmFeedCostPerCowPerDay ?? 0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.PURCHASED_BULK_FEED_PER_COW_PER_DAY,
      parseFloat(feedCostsData?.purchasedBulkFeedPerCowPerDay ?? 0).toFixed(2),
      parseFloat(prevFeedCostsData?.purchasedBulkFeedPerCowPerDay ?? 0).toFixed(
        2,
      ),
    ],
    [
      ROF_FIELDS.PURCHASED_BAGS_FEED_PER_COW_PER_DAY,
      parseFloat(feedCostsData?.purchasedBagsFeedPerCowPerDay ?? 0).toFixed(2),
      parseFloat(prevFeedCostsData?.purchasedBagsFeedPerCowPerDay ?? 0).toFixed(
        2,
      ),
    ],
    [
      ROF_FIELDS.TOTAL_PURCHASED_COST_PER_COW_PER_DAY,
      parseFloat(feedCostsData?.totalPurchasedCostPerCowPerDay ?? 0).toFixed(2),
      parseFloat(
        prevFeedCostsData?.totalPurchasedCostPerCowPerDay ?? 0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_CONCENTRATE_COST_PER_COW_PER_DAY,
      parseFloat(feedCostsData?.totalConcentrateCostPerCowPerDay ?? 0).toFixed(
        2,
      ),
      parseFloat(
        prevFeedCostsData?.totalConcentrateCostPerCowPerDay ?? 0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_FEED_COST_PER_COW_PER_DAY,
      parseFloat(feedCostsData?.totalFeedCostPerCowPerDay ?? 0).toFixed(2),
      parseFloat(prevFeedCostsData?.totalFeedCostPerCowPerDay ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.FEED_COST_PER_KG_OF_BF,
      parseFloat(feedCostsData?.feedCostPerKgOfBF ?? 0).toFixed(2),
      parseFloat(prevFeedCostsData?.feedCostPerKgOfBF ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.FEED_COST_PER_HL_OF_MILK,
      parseFloat(feedCostsData?.feedCostPerHlOfMilk ?? 0).toFixed(2),
      parseFloat(prevFeedCostsData?.feedCostPerHlOfMilk ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.FORAGE_PERCENTAGE,
      parseFloat(feedCostsData?.foragePercentage ?? 0).toFixed(2),
      parseFloat(prevFeedCostsData?.foragePercentage ?? 0).toFixed(2),
    ],
  ];

  const revenueData = summary?.[ROF_FIELDS.REVENUE] || {};
  const prevRevenueData = prevSummary?.[ROF_FIELDS.REVENUE] || {};
  const revenueSection = [
    [
      ROF_FIELDS.BF_REVENUE,
      parseFloat(revenueData?.bfRevenue ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.bfRevenue ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.PROTEIN_REVENUE,
      parseFloat(revenueData?.proteinRevenue ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.proteinRevenue ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.OTHER_SOLIDS_REVENUE,
      parseFloat(revenueData?.otherSolidsRevenue ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.otherSolidsRevenue ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.SUBTOTAL,
      parseFloat(revenueData?.subtotal ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.subtotal ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.DEDUCTIONS_PRICE_PER_COW_PER_DAY,
      parseFloat(revenueData?.deductionsPricePerCowPerDay ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.deductionsPricePerCowPerDay ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.SNF_NON_PAYMENT,
      parseFloat(revenueData?.snfNonPayment ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.snfNonPayment ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_REVENUE_COW_DAY,
      parseFloat(revenueData?.totalRevenueCowDay ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.totalRevenueCowDay ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_REVENUE_PER_KG_BUTTERFAT,
      parseFloat(revenueData?.totalRevenuePricePerKgButterFat ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.totalRevenuePricePerKgButterFat ?? 0).toFixed(
        2,
      ),
    ],
    [
      ROF_FIELDS.TOTAL_REVENUE_PER_HL,
      parseFloat(revenueData?.totalRevenuePerHl ?? 0).toFixed(2),
      parseFloat(prevRevenueData?.totalRevenuePerHl ?? 0).toFixed(2),
    ],
  ];

  const feedingKgDMPerDayData = summary?.[ROF_FIELDS.FEEDING_KG_DM_PER_DAY];
  const prevFeedingKgDMPerDayData =
    prevSummary?.[ROF_FIELDS.FEEDING_KG_DM_PER_DAY];

  const feedingKgDMPerDaySection = [
    [
      ROF_FIELDS.FORAGE_KG_DM_PER_DAY,
      parseFloat(
        feedingKgDMPerDayData?.[ROF_FIELDS.FORAGE_KG_DM_PER_DAY] ?? 0,
      ).toFixed(2),
      parseFloat(
        prevFeedingKgDMPerDayData?.[ROF_FIELDS.FORAGE_KG_DM_PER_DAY] ?? 0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.GRAINS_KG_DM_PER_DAY,
      parseFloat(
        feedingKgDMPerDayData?.[ROF_FIELDS.GRAINS_KG_DM_PER_DAY] ?? 0,
      ).toFixed(2),
      parseFloat(
        prevFeedingKgDMPerDayData?.[ROF_FIELDS.GRAINS_KG_DM_PER_DAY] ?? 0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.PURCHASED_BULK_KG_DM_PER_DAY,
      parseFloat(
        feedingKgDMPerDayData?.[ROF_FIELDS.PURCHASED_BULK_KG_DM_PER_DAY] ?? 0,
      ).toFixed(2),
      parseFloat(
        prevFeedingKgDMPerDayData?.[ROF_FIELDS.PURCHASED_BULK_KG_DM_PER_DAY] ??
          0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.PURCHASED_BAGS_KG_DM_PER_DAY,
      parseFloat(
        feedingKgDMPerDayData?.[ROF_FIELDS.PURCHASED_BAGS_KG_DM_PER_DAY] ?? 0,
      ).toFixed(2),
      parseFloat(
        prevFeedingKgDMPerDayData?.[ROF_FIELDS.PURCHASED_BAGS_KG_DM_PER_DAY] ??
          0,
      ).toFixed(2),
    ],
    [
      ROF_FIELDS.TOTAL_FEED_COST_KG_DM_PER_DAY,
      parseFloat(
        feedingKgDMPerDayData?.[ROF_FIELDS.TOTAL_FEED_COST_KG_DM_PER_DAY] ?? 0,
      ).toFixed(2),
      parseFloat(
        prevFeedingKgDMPerDayData?.[ROF_FIELDS.TOTAL_FEED_COST_KG_DM_PER_DAY] ??
          0,
      ).toFixed(2),
    ],
  ];

  const currentReturnData =
    summary?.[ROF_FIELDS.CURRENT_RETURN_OVER_FEED_COSTS] || {};
  const prevReturnData =
    prevSummary?.[ROF_FIELDS.CURRENT_RETURN_OVER_FEED_COSTS] || {};
  const currentReturnSection = [
    [
      ROF_FIELDS.RETURN_OVER_FEED_COST_PER_COW_PER_DAY,
      parseFloat(
        currentReturnData?.returnOverFeedCostPerCowPerDay ?? 0,
      ).toFixed(2),
      parseFloat(prevReturnData?.returnOverFeedCostPerCowPerDay ?? 0).toFixed(
        2,
      ),
    ],
    [
      ROF_FIELDS.RETURN_OVER_FEED_COST_PER_KG_OF_BF,
      parseFloat(currentReturnData?.returnOverFeedCostPerKgOfBF ?? 0).toFixed(
        2,
      ),
      parseFloat(prevReturnData?.returnOverFeedCostPerKgOfBF ?? 0).toFixed(2),
    ],
    [
      ROF_FIELDS.RETURN_OVER_FEED_COST_PER_HL,
      parseFloat(currentReturnData?.returnOverFeedCostPerHl ?? 0).toFixed(2),
      parseFloat(prevReturnData?.returnOverFeedCostPerHl ?? 0).toFixed(2),
    ],
  ];

  return {
    feedCostsSection,
    revenueSection,
    feedingKgDMPerDaySection,
    currentReturnSection,
  };
};

export const prepareROFVisitReportData = (
  tool = {},
  visitDetails = {},
  formType = ROF_FORM_TYPES.TMR,
  recentVisits = [],
  comparingRofVisits = [],
  enums = {},
  previousROFVisitData = {},
) => {
  const analysis = { tool, visitDetails };

  const herdProfileData = getHerdProfileTableData(
    analysis,
    enums,
    formType,
    previousROFVisitData,
  );

  // Get all feeding sections for pagination
  const allFeedingSections = getAllFeedingSectionsData(
    analysis,
    enums,
    formType,
    previousROFVisitData,
  );

  const feedingPages = organizeFeedingSectionsIntoPages(allFeedingSections);

  const milkProductionData = getMilkProductionTableData(
    analysis,
    formType,
    previousROFVisitData,
  );
  const milkProductionOutputsData = getMilkProductionOutputsTableData(
    analysis,
    formType,
    previousROFVisitData,
  );

  const summaryTablesData = getSummaryTablesData(
    analysis,
    formType,
    previousROFVisitData,
  );

  const formTypes = getAvailableFormTypes(analysis, previousROFVisitData);

  const currentToolData = getParsedToolData(
    visitDetails?.returnOverFeed,
    previousROFVisitData,
  );

  let rawGraphData = [];
  ROF_GRAPH_TYPES().map(item => {
    rawGraphData.push({
      type: item.graphType,
      data: createDataPointsForROFGraphs(
        currentToolData,
        recentVisits,
        comparingRofVisits,
        formType,
        item.graphType,
      ),
    });
  });

  let graphData = {};
  let graphLabels = {};

  rawGraphData?.map(item => {
    let graphItemData =
      item.data?.map(series => ({
        ...series,
        barColor: series.onScreeColor,
      })) || [];

    graphData[item.type] = graphItemData;
    graphLabels[item.type] =
      graphItemData && graphItemData?.length > 0
        ? graphItemData?.[0].dataPoints.map(point => point.x)
        : [];
  }) || [];

  return {
    herdProfile: herdProfileData,
    feedingPages: feedingPages,

    // MilkProductionPages data
    milkProduction: milkProductionData,
    milkProductionOutputs: milkProductionOutputsData,

    // SummaryTablesPage data
    summaryTables: summaryTablesData,

    // ROFGraphPage data
    graph: {
      data: graphData,
      labels: graphLabels,
      formTypes: formTypes,
    },
  };
};
