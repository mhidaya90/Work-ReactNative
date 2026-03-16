import i18n from '../../localization/i18n';
import { MUN_CONSTANT, TOOL_RESULTS_TABS } from '../AppConstants';

export const MILK_SOLD_GRAPH_HEADER_TITLE = {
  MILK_PRODUCTION_AND_DIM: i18n.t('milkProductionDim'),
  COMPONENT_YIELD_AND_EFFICIENCY: i18n.t('componentYieldEfficiency'),
  MILK_FAT_PERCENT_AND_MILK_PROTEIN_PERCENT: i18n.t('milkFatMilkProtein'),
  SOMATIC_CELL_COUNT_AND_MILK_UREA: i18n.t('somaticCellCountMilkUrea'),
  DRY_MATTER_INTAKE_AND_FEED_EFFICIENCY: i18n.t('dryMatterIntakeEfficiency'),
};

export const MILK_SOLD_GRAPH_COMPARISON = (data, weightUnit = '') => {
  return [
    {
      name: i18n.t('milkProductionDim'),
      dbKey1: 'averageMilkProductionAnimalsTank',
      dbKey2: 'daysInMilk',
      label1: `${i18n.t('milkProductionKg')} (${weightUnit})`,
      label2: `${i18n.t('DIM')} (${i18n.t('days')})`,
      graphType: 'MILK_PRODUCTION_AND_DIM',
    },

    {
      name: i18n.t('componentYieldEfficiency'),
      dbKey1: 'milkFatProteinYield',
      dbKey2: 'componentEfficiency',
      label1: `${i18n.t('componentYield')} (${weightUnit})`,
      label2: `${i18n.t('componentEfficiency')} (${i18n.t('%')})`,
      graphType: 'COMPONENT_YIELD_AND_EFFICIENCY',
    },

    {
      name: i18n.t('milkFatMilkProtein'),
      dbKey1: 'averageMilkFatPer',
      dbKey2: 'milkProteinYield',
      label1: i18n.t('milkFat(%)'),
      label2: i18n.t('milkProtein(%)'),
      graphType: 'MILK_FAT_PERCENT_AND_MILK_PROTEIN_PERCENT',
    },

    {
      name:
        data == MUN_CONSTANT
          ? i18n.t('somaticCellCountMilkMun')
          : i18n.t('somaticCellCountMilkUrea'),
      dbKey1: 'averageSCC',
      dbKey2: 'mun',
      label1: i18n.t('somaticCellCount') + ' (x1000)',
      label2: data == MUN_CONSTANT ? i18n.t('mun') : i18n.t('milkUrea'),
      graphType: 'SOMATIC_CELL_COUNT_AND_MILK_UREA',
    },

    {
      name: i18n.t('dryMatterIntakeEfficiency'),
      dbKey1: 'dryMatterIntake',
      dbKey2: 'feedEfficiency',
      label1: `${i18n.t('dryMatterIntake')} (${weightUnit})`,
      label2: i18n.t('feedEfficiency'),
      graphType: 'DRY_MATTER_INTAKE_AND_FEED_EFFICIENCY',
    },
  ];
};

export const MILK_SOLD_RESULTS_TABS = [
  {
    key: TOOL_RESULTS_TABS.SUMMARY,
    value: i18n.t('summary'),
  },
  {
    key: TOOL_RESULTS_TABS.GRAPH,
    value: i18n.t('graph'),
  },
];

export const MILK_SOLD_STEPS = [
  {
    id: 0x002,
    step: 1,
    name: i18n.t('dataInput'),
  },
  {
    id: 0x003,
    step: 2,
    name: i18n.t('results'),
  },
];

export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE = -100;
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE = 999;

//Global
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_GL = 125;
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_GL = 250;

//india
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_IN = 20;
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_IN = 350;

//canada
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_CA = 125;
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_CA = 250;

//south africa
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MIN_VALUE_SA = 80;
export const MILK_SOLD_EVALUATION_DAYS_IN_MILK_MAX_VALUE_SA = 250;
