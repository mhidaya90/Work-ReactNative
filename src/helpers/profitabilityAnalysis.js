// modules
import { format } from 'date-fns';

// constants
import {
  BACTERIA_CELL_COUNT_DECIMAL_PLACE,
  DATE_FORMATS,
  TOOL_TYPES,
  UNIT_OF_MEASURE,
} from '../constants/AppConstants';
import { PROFITABILITY_ANALYSIS_FIELDS } from '../constants/FormConstants';
import {
  GRAPH_TYPES_KEYS,
  MILKING_NUMBERS,
  PRODUCTION_150_DIM_FORMULA_VALUES,
} from '../constants/toolsConstants/ProfitabilityAnalysisConstants';

// localization
import i18n from '../localization/i18n';

// helpers
import {
  convertInputNumbersToRegionalBasis,
  getParsedToolData,
  isEmpty,
} from './genericHelper';
import { dateHelper, getFormattedDate } from './dateHelper';
import { addSpace } from './genericHelper';
import {
  convertNumberToString,
  convertStringToNumber,
} from './alphaNumericHelper';
import { getWeightUnitByMeasure } from './appSettingsHelper';

const initialProfitabilityFormData = (
  siteData = null,
  toolData = null,
  heatStressToolData = null,
  weightUnit,
) => {
  // get JSON parsed object of heat stress tool data
  const heatStressData = getParsedToolData(heatStressToolData);

  // parse JSON data of current tool
  toolData = getParsedToolData(toolData);

  const tempHumidityIndex =
    toolData?.thi || heatStressData?.temperatureHumidityInCelsius || '';

  const dataPayload = {
    // animal information
    [PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD]:
      convertNumberToString(
        toolData?.animalsInHerd || siteData?.lactatingAnimal,
      ) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_COWS]:
      convertNumberToString(toolData?.totalNumberOfCows) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_LACTATING_ANIMALS]:
      convertNumberToString(toolData?.totalNumberOfLactatingAnimals) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.BREED]: toolData?.breed || '',

    [PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_SYSTEM]:
      toolData?.productionSystem || '',

    // milking information
    [PROFITABILITY_ANALYSIS_FIELDS.NUMBER_ON_MILKINGS]:
      toolData?.numberOfMilkings || '',

    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD]:
      convertNumberToString(toolData?.totalProductionHerd || ''),

    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION]:
      convertNumberToString(toolData?.totalProduction) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE]:
      convertNumberToString(
        toolData?.milkPrice || siteData?.currentMilkPrice,
      ) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.DIM]:
      convertNumberToString(toolData?.dim || siteData?.daysInMilk) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM]:
      convertNumberToString(toolData?.productionIn150DIM) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE]:
      convertNumberToString(
        toolData?.milkFatPercentage || siteData?.milkFatPercent,
      ) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.MILK_PROTEIN_PERCENTAGE]:
      convertNumberToString(
        toolData?.milkProteinPercentage || siteData?.milkProteinPercent,
      ) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT]:
      convertNumberToString(
        toolData?.somanticCellCount || siteData?.milkSomaticCellCount,
      ) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT]:
      convertNumberToString(
        toolData?.bacteriaCellCount || siteData?.bacteriaCellCount,
      ) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.MUN]:
      convertNumberToString(toolData?.mun) || '',

    // feeding information
    [PROFITABILITY_ANALYSIS_FIELDS.COMMERCIAL_CONCENTRATE_TOGGLE]:
      toolData?.commercialConcentrateToggle || false,

    [PROFITABILITY_ANALYSIS_FIELDS.COMMERCIAL_CONCENTRATE]:
      convertNumberToString(toolData?.commercialConcentrate) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX]:
      toolData?.mineralBaseMix || false,

    [PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX_VALUE]:
      convertNumberToString(toolData?.mineralBaseMixValue) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.NUTRITEK]: toolData?.nutritek || false,

    [PROFITABILITY_ANALYSIS_FIELDS.XPC_ULTRA]: toolData?.xpcUltra || false,

    [PROFITABILITY_ANALYSIS_FIELDS.ACTIFOR_BOOST]:
      toolData?.actiforBoost || false,

    [PROFITABILITY_ANALYSIS_FIELDS.BUFFER]: toolData?.buffer || false,

    [PROFITABILITY_ANALYSIS_FIELDS.NUTRIGORDURA_LAC]:
      toolData?.nutrigorduraLac || false,

    [PROFITABILITY_ANALYSIS_FIELDS.ICE]: toolData?.ice || false,

    [PROFITABILITY_ANALYSIS_FIELDS.ENERGY_ICE]: toolData?.energyIce || false,

    [PROFITABILITY_ANALYSIS_FIELDS.MONENSIN]: toolData?.monensin || false,

    [PROFITABILITY_ANALYSIS_FIELDS.SOY_PASS_BR]: toolData?.soyPassBr || false,

    [PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED]:
      convertNumberToString(toolData?.concentrateTotalConsumed) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.SILAGE]: toolData?.silage || '',

    [PROFITABILITY_ANALYSIS_FIELDS.HAYLAGE]: toolData?.haylage || '',

    [PROFITABILITY_ANALYSIS_FIELDS.HAY]: toolData?.hay || '',

    [PROFITABILITY_ANALYSIS_FIELDS.PASTURE]: toolData?.pasture || '',

    [PROFITABILITY_ANALYSIS_FIELDS.WATER_QUALITY]: toolData?.waterQuality || '',

    [PROFITABILITY_ANALYSIS_FIELDS.BEDDING_QUALITY]:
      toolData?.beddingQuality || '',

    [PROFITABILITY_ANALYSIS_FIELDS.VENTILATION]: toolData?.ventilation || false,

    [PROFITABILITY_ANALYSIS_FIELDS.SPRINKLER]: toolData?.sprinkler || false,

    [PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C]:
      convertNumberToString(
        weightUnit === UNIT_OF_MEASURE.IMPERIAL
          ? toolData?.temperatureInC * 1.8 + 32
          : toolData?.temperatureInC,
      ) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE]:
      convertNumberToString(toolData?.airRuPercentage) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.THI]:
      convertNumberToString(tempHumidityIndex),

    [PROFITABILITY_ANALYSIS_FIELDS.RESPIRATORY_MOVEMENT]:
      convertNumberToString(toolData?.respiratoryMovement) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.COW_LAYING_DOWN_PERCENTAGE]:
      convertNumberToString(toolData?.cowLyingDownPercentage) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST]:
      convertNumberToString(toolData?.totalDietCost) || '',

    [PROFITABILITY_ANALYSIS_FIELDS.REVENUE_PER_COW_PER_DAY]:
      convertNumberToString(
        !isEmpty(toolData?.revenuePerCowPerDay)
          ? toolData?.revenuePerCowPerDay.toFixed(2)
          : toolData?.revenuePerCowPerDay,
      ) || '',
  };

  return dataPayload;
};

/**
 * @description
 * formulate function to run when a un-dependant field is changing and it requires calculation to perform on required field.
 *
 * @param {number} totalNumberOfLactatingAnimals
 * @param {number} totalProductionHerd
 * @param {number} milkFatPercent
 * @param {number} dim
 * @param {number} milkPrice
 * @returns {boolean}
 */
const sanitizedFormateProfitabilityFields = ({
  totalNumberOfLactatingAnimals = null,
  totalProductionHerd = null,
  milkFatPercentage = null,
  dim = null,
  milkPrice = null,
}) => {
  let totalProduction = null,
    productionIn150DIM = null,
    revenuePerCowPerDay = null;

  if (totalNumberOfLactatingAnimals && totalProductionHerd) {
    const localHerdProductionCopy = totalProductionHerd;

    totalProduction = parseFloat(
      (convertStringToNumber(localHerdProductionCopy) || 0) /
        (totalNumberOfLactatingAnimals || 0),
    );
  }

  if (totalProduction && milkFatPercentage && dim) {
    const localMilkFatPercentageCopy = milkFatPercentage;

    // removes comma from value
    const formattedMilkFatPer = convertStringToNumber(
      localMilkFatPercentageCopy,
    );

    productionIn150DIM =
      PRODUCTION_150_DIM_FORMULA_VALUES.INITIAL_MULTIPLY_VALUE *
        totalProduction +
      PRODUCTION_150_DIM_FORMULA_VALUES.SECONDARY_MULTIPLY_VALUE *
        totalProduction *
        (formattedMilkFatPer / 100) +
      (PRODUCTION_150_DIM_FORMULA_VALUES.FINAL_MULTIPLY_VALUE *
        totalProduction || 0) *
        (dim - PRODUCTION_150_DIM_FORMULA_VALUES.MINUS_DIM_VALUE);
  }

  if (milkPrice && totalProduction) {
    const localMilkPriceCopy = milkPrice;
    // removes comma from value
    const formattedMilkPrice = convertStringToNumber(localMilkPriceCopy);

    revenuePerCowPerDay = parseFloat(
      (totalProduction * formattedMilkPrice).toFixed(2),
    );
  }

  // reassign values to there variables
  totalProduction = convertNumberToString(totalProduction);
  productionIn150DIM = convertNumberToString(productionIn150DIM);
  revenuePerCowPerDay = convertNumberToString(revenuePerCowPerDay);

  return {
    totalProduction,
    productionIn150DIM,
    revenuePerCowPerDay,
  };
};

/**
 *
 * @param {Object} values
 * @param {Object} siteData
 * @returns
 */
const updateSiteSetupDataModel = (values, siteData) => {
  const payload = {
    lactatingAnimal:
      convertStringToNumber(
        values[PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD] ||
          siteData?.lactatingAnimal,
      ) || null,

    currentMilkPrice:
      convertStringToNumber(
        values[PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE] ||
          siteData?.currentMilkPrice,
      ) || null,
    // unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && data?.currentMilkPrice
    //   ? convertDenominatorWeightToMetric(data?.currentMilkPrice)
    //   : data?.currentMilkPrice || null,

    milkFatPercent:
      convertStringToNumber(
        values[PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE] ||
          siteData?.milkFatPercent,
      ) || null,

    milkProteinPercent:
      convertStringToNumber(
        values[PROFITABILITY_ANALYSIS_FIELDS.MILK_PROTEIN_PERCENTAGE] ||
          siteData?.milkProteinPercent,
      ) || null,

    daysInMilk:
      convertStringToNumber(
        values[PROFITABILITY_ANALYSIS_FIELDS.DIM] || siteData?.daysInMilk,
      ) || null,

    milkSomaticCellCount:
      convertStringToNumber(
        values[PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT] ||
          siteData?.milkSomaticCellCount,
      ) || null,

    bacteriaCellCount:
      convertStringToNumber(
        values[PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT] ||
          siteData?.bacteriaCellCount,
      ) || null,

    // extra site details required for updating site values in db
    updated: true,
    id: siteData?.id || null,
    accountId: siteData?.accountId || null,
    localAccountId: siteData?.localAccountId || null,
    siteName: siteData?.siteName || '',
  };

  return payload;
};

/**
 * @description
 * helper function to generate output and summary table for profitability analysis tool
 *
 * @param {Object} formValues
 * @param {Array} recentVisits
 * @param {String} unitOfMeasure
 * @param {String} currencySymbol
 * @returns {Object} constants of values to show in table
 */
const getSummaryHeaderAndRowData = (
  formValues,
  recentVisits,
  unitOfMeasure,
  currencySymbol,
  waterQualityEnums,
) => {
  let tableHeaders = [''];

  const weightUnit = getWeightUnitByMeasure(unitOfMeasure);

  // animal information rows label
  const animalInformation = {
    [PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD]: [i18n.t('animalInHerd')],
    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_COWS]: [
      i18n.t('totalNumberOfCows'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_LACTATING_ANIMALS]: [
      i18n.t('totalLactatingAnimals'),
    ],
  };

  // milk information rows label
  const milkingInformation = {
    [PROFITABILITY_ANALYSIS_FIELDS.NUMBER_ON_MILKINGS]: [
      i18n.t('milkingNumber'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD]: [
      `${i18n.t('totalProductionHerd')} (${weightUnit}/${i18n.t('day')})`,
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION]: [
      `${i18n.t('totalProduction')} (${weightUnit}/${i18n.t('cow')}/${i18n.t(
        'day',
      )})`,
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE]: [
      `${i18n.t('currentMilkPrice')} (${currencySymbol}/${weightUnit})`,
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.DIM]: [i18n.t('daysInMilk')],
    [PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM]: [
      i18n.t('productionIn150Dim'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE]: [i18n.t('milkFat(%)')],
    [PROFITABILITY_ANALYSIS_FIELDS.MILK_PROTEIN_PERCENTAGE]: [
      i18n.t('milkProtein(%)'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT]: [
      i18n.t('somaticCellCountWithUnit'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT]: [
      i18n.t('bacteriaCellCountWithUnit'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.MUN]: [i18n.t('MUN(mg/dL)')],
  };

  // feed information rows label
  const feedingInformation = {
    [PROFITABILITY_ANALYSIS_FIELDS.COMMERCIAL_CONCENTRATE]: [
      i18n.t('commercialConcentrate'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX]: [
      i18n.t('mineralBaseMix'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED]: [
      i18n.t('concentrateTotalConsumed'),
    ],
    ['IOFC']: [i18n.t('IOFC')],
    ['milkLitersPerKgConcentrate']: [i18n.t('milkLitersPerKgConcentrate')],
    [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST]: [
      `${i18n.t('totalDietCost')} (${weightUnit}/${i18n.t('cow')}/${i18n.t(
        'day',
      )})`,
    ],
  };

  // other information rows label
  const othersInformation = {
    [PROFITABILITY_ANALYSIS_FIELDS.WATER_QUALITY]: [i18n.t('waterQuality')],
    [PROFITABILITY_ANALYSIS_FIELDS.BEDDING_QUALITY]: [i18n.t('beddingQuality')],
    [PROFITABILITY_ANALYSIS_FIELDS.VENTILATION]: [i18n.t('ventilation')],
    [PROFITABILITY_ANALYSIS_FIELDS.SPRINKLER]: [i18n.t('sprinkler')],
    [PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C]: [
      i18n.t(
        unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
          ? 'temperature(F)'
          : 'temperature(C)',
      ),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE]: [i18n.t('airRU')],
    [PROFITABILITY_ANALYSIS_FIELDS.THI]: [i18n.t('THI')],
    [PROFITABILITY_ANALYSIS_FIELDS.RESPIRATORY_MOVEMENT]: [
      i18n.t('respiratoryMovement'),
    ],
    [PROFITABILITY_ANALYSIS_FIELDS.COW_LAYING_DOWN_PERCENTAGE]: [
      i18n.t('cowLayingDown'),
    ],
  };

  if (recentVisits?.length > 0 && formValues) {
    recentVisits[0][TOOL_TYPES.PROFITABILITY_ANALYSIS] = formValues;

    recentVisits?.map(visit => {
      tableHeaders.push(format(visit?.visitDate, DATE_FORMATS.MM_dd_YY));

      const parsedToolData = getParsedToolData(visit?.profitabilityAnalysis);

      if (parsedToolData) {
        // mapping animal information data
        animalInformation[PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD],
            null,
            true,
          ) || '-',
        );
        animalInformation[
          PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_COWS
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_COWS],
            null,
            true,
          ) || '-',
        );
        animalInformation[
          PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_LACTATING_ANIMALS
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_LACTATING_ANIMALS
            ],
            null,
            true,
          ) || '-',
        );

        // mapping milking information data
        const numberOfMilkings = MILKING_NUMBERS?.find(
          milkNumber =>
            milkNumber.key ===
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.NUMBER_ON_MILKINGS],
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.NUMBER_ON_MILKINGS
        ].push(numberOfMilkings?.value || '-');

        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD],
            2,
            true,
          ) || '-',
        );
        milkingInformation[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION],
            2,
            true,
          ) || '-',
        );
        milkingInformation[PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE],
            3,
            true,
          ) || '-',
        );
        milkingInformation[PROFITABILITY_ANALYSIS_FIELDS.DIM].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.DIM],
            null,
            true,
          ) || '-',
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM],
            2,
            true,
          ) || '-',
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE],
            2,
            true,
          ) || '-',
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.MILK_PROTEIN_PERCENTAGE
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.MILK_PROTEIN_PERCENTAGE
            ],
            2,
            true,
          ) || '-',
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT],
            null,
            true,
          ) || '-',
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT],
            BACTERIA_CELL_COUNT_DECIMAL_PLACE,
            true,
          ) || '-',
        );
        milkingInformation[PROFITABILITY_ANALYSIS_FIELDS.MUN].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.MUN],
            2,
            true,
          ) || '-',
        );

        // mapping feeding information data
        feedingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.COMMERCIAL_CONCENTRATE
        ].push(
          parsedToolData[
            PROFITABILITY_ANALYSIS_FIELDS.COMMERCIAL_CONCENTRATE_TOGGLE
          ]
            ? convertInputNumbersToRegionalBasis(
                parsedToolData[
                  PROFITABILITY_ANALYSIS_FIELDS.COMMERCIAL_CONCENTRATE
                ],
                2,
                true,
              ) || '-'
            : '-',
        );

        feedingInformation[PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX].push(
          parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX]
            ? convertInputNumbersToRegionalBasis(
                parsedToolData[
                  PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX_VALUE
                ],
                2,
                true,
              ) || '-'
            : '-',
        );

        feedingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED
            ],
            2,
            true,
          ) || '-',
        );

        feedingInformation.IOFC.push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.REVENUE_PER_COW_PER_DAY
            ] - parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST],
            2,
            true,
          ) || '-',
        );
        const milkLitersPerKgConcentrate = isFinite(
          parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION] /
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED
            ],
        )
          ? parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION] /
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED
            ]
          : '';

        feedingInformation.milkLitersPerKgConcentrate.push(
          convertInputNumbersToRegionalBasis(
            milkLitersPerKgConcentrate,
            2,
            true,
          ) || '-',
        );
        feedingInformation[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST],
            2,
            true,
          ) || '-',
        );

        const waterQualitySelected = waterQualityEnums?.find(
          enumItem =>
            enumItem.key ===
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.WATER_QUALITY],
        );

        const beddingQualitySelected = waterQualityEnums?.find(
          enumItem =>
            enumItem.key ===
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.BEDDING_QUALITY],
        );

        // mapping other information data
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.WATER_QUALITY].push(
          waterQualitySelected?.value || '-',
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.BEDDING_QUALITY].push(
          beddingQualitySelected?.value || '-',
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.VENTILATION].push(
          (parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.VENTILATION]
            ? i18n.t('yes')
            : i18n.t('no')) || '-',
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.SPRINKLER].push(
          (parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.SPRINKLER]
            ? i18n.t('yes')
            : i18n.t('no')) || '-',
        );

        const temperature =
          unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
            ? parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C] *
                1.8 +
              32
            : parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C];

        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C].push(
          convertInputNumbersToRegionalBasis(temperature, 2, true) || '-',
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE],
            2,
            true,
          ) || '-',
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.THI].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.THI],
            2,
            true,
          ) || '-',
        );
        othersInformation[
          PROFITABILITY_ANALYSIS_FIELDS.RESPIRATORY_MOVEMENT
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.RESPIRATORY_MOVEMENT],
            2,
            true,
          ) || '-',
        );
        othersInformation[
          PROFITABILITY_ANALYSIS_FIELDS.COW_LAYING_DOWN_PERCENTAGE
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.COW_LAYING_DOWN_PERCENTAGE
            ],
            2,
            true,
          ) || '-',
        );
      }
    });

    tableHeaders[1] = tableHeaders[1] + `\n ${i18n.t('current')}`;
  }

  return {
    tableHeaders,
    animalInformation,
    milkingInformation,
    feedingInformation,
    othersInformation,
  };
};

const getSelectedGraphData = (
  selectedGraph,
  recentVisits,
  toolValues,
  currencySymbol,
) => {
  if (toolValues && recentVisits?.length > 0) {
    recentVisits[0].profitabilityAnalysis = toolValues;

    let lineGraphData = [];
    let barGraphData = [];
    let graphConfig = {
      axis: [],
    };

    recentVisits?.map((visit, index) => {
      const parseProfitabilityData = getParsedToolData(
        visit?.profitabilityAnalysis,
      );

      let lineValue = 0;
      let barValue = 0;

      switch (selectedGraph?.key) {
        case GRAPH_TYPES_KEYS.FIRST:
          if (
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION
            ] &&
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED
            ]
          ) {
            lineValue =
              parseProfitabilityData[
                PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION
              ] /
              parseProfitabilityData[
                PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED
              ];
          }

          barValue =
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION
            ];

          graphConfig.leftAxisTicks = [10, 20, 30, 40, 50, 60];
          graphConfig.rightAxisTicks = [1, 2, 3, 4, 5, 6];
          graphConfig.leftAxisLabel = `${i18n.t('totalProduction')} (${i18n.t(
            'cow',
          )}/${i18n.t('day')})`;
          graphConfig.rightAxisLabel = `${i18n.t('totalProduction')} / ${i18n.t(
            'concentrateTotalConsumed',
          )}`;

          break;

        case GRAPH_TYPES_KEYS.SECOND:
          barValue =
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM
            ];

          if (
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.REVENUE_PER_COW_PER_DAY
            ] &&
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST
            ]
          ) {
            lineValue =
              parseProfitabilityData[
                PROFITABILITY_ANALYSIS_FIELDS.REVENUE_PER_COW_PER_DAY
              ] -
              parseProfitabilityData[
                PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST
              ];
          }

          graphConfig.leftAxisTicks = [10, 20, 30, 40, 50, 60];
          graphConfig.rightAxisTicks = [20, 45, 70, 95, 120, 145, 170];
          graphConfig.leftAxisLabel = i18n.t('productionIn150Dim');
          graphConfig.rightAxisLabel = i18n.t('IOFC');

          break;

        case GRAPH_TYPES_KEYS.THIRD:
          if (
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION
            ] &&
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST
            ]
          ) {
            lineValue =
              parseProfitabilityData[
                PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION
              ] /
              parseProfitabilityData[
                PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST
              ];
          }

          barValue =
            parseProfitabilityData[PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE];
          graphConfig.leftAxisTicks = [0, 1, 2, 3, 4, 5];
          graphConfig.rightAxisTicks = [0, 1, 2, 3, 4, 5];
          graphConfig.leftAxisLabel = `${i18n.t(
            'milkPrice',
          )} (${currencySymbol})`;
          graphConfig.rightAxisLabel = i18n.t('feedingCostPerLiterMilk');

          break;

        case GRAPH_TYPES_KEYS.FORTH:
          lineValue =
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST
            ];

          barValue =
            parseProfitabilityData[
              PROFITABILITY_ANALYSIS_FIELDS.REVENUE_PER_COW_PER_DAY
            ];

          graphConfig.leftAxisTicks = [0, 40, 80, 120, 160, 200];
          graphConfig.rightAxisTicks = [0, 40, 80, 120, 160, 200];
          graphConfig.leftAxisLabel = i18n.t('revenuePerCowPerDay');
          graphConfig.rightAxisLabel = `${i18n.t(
            'totalDietCost',
          )} (${currencySymbol}/${i18n.t('cow')}/${i18n.t('day')})`;

          break;

        default:
          break;
      }

      const linePayload = {
        x:
          getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
          addSpace(index),
        y: lineValue,
      };

      const barPayload = {
        x:
          getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
          addSpace(index),
        y: barValue || '',
      };

      lineGraphData.push(linePayload);
      barGraphData.push(barPayload);
    });

    return {
      lineGraphData: lineGraphData.reverse(),
      barGraphData: barGraphData.reverse(),
      graphConfig,
    };
  }

  return {};
};

const mapProfitabilityGraphDataToVictoryNative = (
  leftAxisData,
  rightAxisData,
) => {
  // Handle undefined/null/empty inputs
  if (
    !leftAxisData ||
    !rightAxisData ||
    !Array.isArray(leftAxisData) ||
    !Array.isArray(rightAxisData) ||
    leftAxisData.length === 0 ||
    rightAxisData.length === 0
  ) {
    return [];
  }

  if (leftAxisData.length !== rightAxisData.length) {
    console.error(
      'Error: Production data and ratio data must have the same length.',
    );
    return [];
  }

  const combinedData = leftAxisData.map((leftValue, index) => {
    const rightValue = rightAxisData[index];

    if (!leftValue || !rightValue) {
      return null;
    }

    // Validate if the 'x' values match
    if (leftValue?.x?.trim() !== rightValue?.x?.trim()) {
      console.error(
        "Error: The 'x' values of production data and ratio data must match.",
      );
      return null;
    }

    const leftY = parseFloat(leftValue.y);
    const rightY = parseFloat(rightValue.y);

    return {
      date: leftValue.x, // 'x' is the same for both
      leftAxisValue: !isNaN(leftY) ? leftY : 0,
      rightAxisValue: !isNaN(rightY) ? rightY : 0,
    };
  });

  // Filter out null entries
  return combinedData.filter(item => item !== null);
};

/**
 * @description
 * model function to convert decimal formatted form values into en-US format if values are not already
 *
 * @param {Object} values formik fom values
 * @returns {Object}
 */
const convertProfitabilityValuesInEnUSFormat = (values, unitOfMeasure) => {
  const localCopyOfFormObject = { ...values };
  // form object keys
  const formKeys = Object.keys(localCopyOfFormObject);

  formKeys?.map(itemKey => {
    if (
      [
        PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD,
        PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION,
        PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE,
        PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM,
        PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE,
        PROFITABILITY_ANALYSIS_FIELDS.MILK_PROTEIN_PERCENTAGE,
        PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT,
        PROFITABILITY_ANALYSIS_FIELDS.MUN,
        PROFITABILITY_ANALYSIS_FIELDS.COMMERCIAL_CONCENTRATE,
        PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C,
        PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE,
        PROFITABILITY_ANALYSIS_FIELDS.THI,
        PROFITABILITY_ANALYSIS_FIELDS.RESPIRATORY_MOVEMENT,
        PROFITABILITY_ANALYSIS_FIELDS.COW_LAYING_DOWN_PERCENTAGE,
        PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST,
        PROFITABILITY_ANALYSIS_FIELDS.REVENUE_PER_COW_PER_DAY,
        PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED,
        PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX_VALUE,
      ].includes(itemKey)
    ) {
      localCopyOfFormObject[itemKey] = convertStringToNumber(
        localCopyOfFormObject[itemKey],
      );

      if (
        itemKey === PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C &&
        unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
      ) {
        const temperature = convertNumberToString(
          localCopyOfFormObject[itemKey],
        );

        localCopyOfFormObject[itemKey] = (temperature - 32) / 1.8;
      }
    }
  });

  return localCopyOfFormObject;
};

/**
 * @description
 * helper function to model data for download or share using options like image or excel
 *
 * @param {Object} profitabilityData
 * @param {Object} currentVisit
 * @param {Array} selectedRecentVisits
 * @param {String} selectedGraph
 * @returns
 */
const downloadShareGraphDataModel = (
  profitabilityData,
  currentVisit,
  selectedRecentVisits,
  selectedGraph,
  currencySymbol,
) => {
  if (profitabilityData) {
    const model = {
      visitName: currentVisit?.visitName,
      visitDate: dateHelper.getFormattedDate(
        currentVisit?.visitDate,
        DATE_FORMATS.dd_MMM_yy,
      ),
      leftYAxis: [],
      rightYAxis: [],
      fileName: currentVisit?.visitName + ' ' + i18n.t('profitabilityAnalysis'),
      toolName: i18n.t('profitabilityAnalysis'),
      reportType: selectedGraph?.graphType,
      currency: currencySymbol,
    };

    const { lineGraphData, graphConfig, barGraphData } = getSelectedGraphData(
      selectedGraph,
      selectedRecentVisits,
      profitabilityData,
    );

    model.leftYAxis = barGraphData;
    model.rightYAxis = lineGraphData;

    return model;
  }

  return null;
};

export {
  initialProfitabilityFormData,
  sanitizedFormateProfitabilityFields,
  updateSiteSetupDataModel,
  getSummaryHeaderAndRowData,
  getSelectedGraphData,
  mapProfitabilityGraphDataToVictoryNative,
  convertProfitabilityValuesInEnUSFormat,
  downloadShareGraphDataModel,
};
