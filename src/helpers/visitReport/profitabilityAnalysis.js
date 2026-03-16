// constants
import { DATE_FORMATS, UNIT_OF_MEASURE } from '../../constants/AppConstants';
import { PROFITABILITY_ANALYSIS_FIELDS } from '../../constants/FormConstants';
import {
  GRAPH_TYPES_KEYS,
  MILKING_NUMBERS,
} from '../../constants/toolsConstants/ProfitabilityAnalysisConstants';

// localization
import i18n from '../../localization/i18n';

// helpers
import { getFormattedDate } from '../dateHelper';
import {
  convertInputNumbersToRegionalBasis,
  getParsedToolData,
} from '../genericHelper';
import { addSpace } from '../genericHelper';

const getProfitabilityDataFromVisit = visit => {
  const data = visit?.ProfitabilityAnalysis || visit?.profitabilityAnalysis;
  return getParsedToolData(data);
};

export const recentVisitsSummaryOfAnimalAndMilking = tool => {
  if (tool?.recentVisits?.length > 0) {
    let compareDates = [];

    const animaInputs = {
      [PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_COWS]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_LACTATING_ANIMALS]: [],
    };

    const milkingInformation = {
      [PROFITABILITY_ANALYSIS_FIELDS.NUMBER_ON_MILKINGS]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.DIM]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.MILK_PROTEIN_PERCENTAGE]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.MUN]: [],
    };

    tool?.recentVisits?.map((visit, index) => {
      const parsedToolData = getProfitabilityDataFromVisit(visit);

      if (parsedToolData) {
        compareDates.push(
          getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd),
        );

        // animal inputs information
        animaInputs[PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD],
            null,
            true,
          ),
        );
        animaInputs[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_COWS].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_COWS],
            null,
            true,
          ),
        );
        animaInputs[
          PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_LACTATING_ANIMALS
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_LACTATING_ANIMALS
            ],
            null,
            true,
          ),
        );

        // mapping milking information data
        const numberOfMilkings = MILKING_NUMBERS?.find(
          milkNumber =>
            milkNumber.key ===
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.NUMBER_ON_MILKINGS],
        );
        // milking information
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.NUMBER_ON_MILKINGS
        ].push(numberOfMilkings?.value);
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD],
            2,
            true,
          ),
        );
        milkingInformation[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION],
            2,
            true,
          ),
        );
        milkingInformation[PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE],
            3,
            true,
          ),
        );
        milkingInformation[PROFITABILITY_ANALYSIS_FIELDS.DIM].push(
          parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.DIM],
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_IN_150_DIM],
            2,
            true,
          ),
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE],
            2,
            true,
          ),
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
          ),
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT],
            null,
            true,
          ),
        );
        milkingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT],
            2,
            true,
          ),
        );
        milkingInformation[PROFITABILITY_ANALYSIS_FIELDS.MUN].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.MUN],
            2,
            true,
          ),
        );
      }
    });

    return {
      compareDates,
      animaInputs,
      milkingInformation,
    };
  }

  return {};
};

export const recentVisitsSummaryOfFeedingAndOtherInformation = (
  tool,
  waterQualityEnums = [],
  unitOfMeasure,
) => {
  if (tool?.recentVisits?.length > 0) {
    let compareDates = [];

    const feedingInformation = {
      [PROFITABILITY_ANALYSIS_FIELDS.COMMERCIAL_CONCENTRATE]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX_VALUE]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED]: [],
      ['IOFC']: [],
      ['milkLitersPerKgConcentrate']: [],
      [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST]: [],
    };

    const othersInformation = {
      [PROFITABILITY_ANALYSIS_FIELDS.WATER_QUALITY]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.BEDDING_QUALITY]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.VENTILATION]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.SPRINKLER]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.THI]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.RESPIRATORY_MOVEMENT]: [],
      [PROFITABILITY_ANALYSIS_FIELDS.COW_LAYING_DOWN_PERCENTAGE]: [],
    };

    tool?.recentVisits?.map((visit, index) => {
      const parsedToolData = getProfitabilityDataFromVisit(visit);

      if (parsedToolData) {
        compareDates.push(
          getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd),
        );

        // feeding information
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
              )
            : '-',
        );
        feedingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX_VALUE
        ].push(
          parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX]
            ? convertInputNumbersToRegionalBasis(
                parsedToolData[
                  PROFITABILITY_ANALYSIS_FIELDS.MINERAL_BASE_MIX_VALUE
                ],
                2,
                true,
              )
            : '-',
        );
        feedingInformation[
          PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[
              PROFITABILITY_ANALYSIS_FIELDS.CONCENTRATE_TOTAL_CONSUMED
            ],
            null,
            true,
          ),
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
          ),
        );

        feedingInformation[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TOTAL_DIET_COST],
            2,
            true,
          ),
        );

        const waterQuality = waterQualityEnums?.find(
          item =>
            item?.key ===
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.WATER_QUALITY],
        );
        const beddingQuality = waterQualityEnums?.find(
          item =>
            item?.key ===
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.BEDDING_QUALITY],
        );

        // milking information
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.WATER_QUALITY].push(
          waterQuality?.value,
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.BEDDING_QUALITY].push(
          beddingQuality?.value,
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.VENTILATION].push(
          parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.VENTILATION]
            ? i18n.t('yes')
            : i18n.t('no'),
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.SPRINKLER].push(
          parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.SPRINKLER]
            ? i18n.t('yes')
            : i18n.t('no'),
        );
        const temperature =
          unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
            ? parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C] *
                1.8 +
              32
            : parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C];

        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.TEMPERATURE_IN_C].push(
          convertInputNumbersToRegionalBasis(temperature, 2, true),
        );

        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE],
            2,
            true,
          ),
        );
        othersInformation[PROFITABILITY_ANALYSIS_FIELDS.THI].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.THI],
            2,
            true,
          ),
        );
        othersInformation[
          PROFITABILITY_ANALYSIS_FIELDS.RESPIRATORY_MOVEMENT
        ].push(
          convertInputNumbersToRegionalBasis(
            parsedToolData[PROFITABILITY_ANALYSIS_FIELDS.RESPIRATORY_MOVEMENT],
            2,
            true,
          ),
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
          ),
        );
      }
    });

    return {
      compareDates,
      feedingInformation,
      othersInformation,
    };
  }

  return {};
};

export const profitabilityGraphDataVisitReport = (
  selectedGraph,
  recentVisits,
  currencySymbol,
) => {
  const defaultReturn = {
    lineGraphData: [],
    barGraphData: [],
    graphConfig: { axis: [] },
  };

  if (recentVisits?.length > 0) {
    let lineGraphData = [];
    let barGraphData = [];
    let graphConfig = {
      axis: [],
    };

    recentVisits?.map((visit, index) => {
      const parseProfitabilityData = getProfitabilityDataFromVisit(visit);

      if (!parseProfitabilityData) {
        return;
      }

      let lineValue = 0;
      let barValue = 0;

      switch (selectedGraph) {
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
                ] || 0;
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

      const safeLineValue =
        typeof lineValue === 'number' && !isNaN(lineValue) ? lineValue : 0;
      const safeBarValue =
        typeof barValue === 'number' && !isNaN(barValue) ? barValue : 0;

      const linePayload = {
        x:
          getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
          addSpace(index),
        y: safeLineValue,
      };

      const barPayload = {
        x:
          getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd) +
          addSpace(index),
        y: safeBarValue,
      };

      lineGraphData.push(linePayload);
      barGraphData.push(barPayload);
    });

    if (lineGraphData.length > 0 || barGraphData.length > 0) {
      return {
        lineGraphData: lineGraphData.reverse(),
        barGraphData: barGraphData.reverse(),
        graphConfig,
      };
    }
  }

  return defaultReturn;
};
