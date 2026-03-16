// localization
import i18n from '../../localization/i18n';

// constants
import { TOOL_RESULTS_TABS } from '../AppConstants';

export const PROFITABILITY_TOOL_BODY = {
  FORM: 'FORM',
  RESULTS: 'RESULTS',
};

export const PROFITABILITY_FORM_TYPES = {
  ANIMAL_INPUTS: 'ANIMAL_INPUTS',
  MILK_INFORMATION: 'MILK_INFORMATION',
  FEEDING_INFORMATION: 'FEEDING_INFORMATION',
};

export const PROFITABILITY_RESULTS_TABS = [
  {
    key: TOOL_RESULTS_TABS.SUMMARY,
    value: i18n.t('summary'),
  },
  {
    key: TOOL_RESULTS_TABS.GRAPH,
    value: i18n.t('graph'),
  },
];

export const GRAPH_TYPES_KEYS = {
  FIRST: 'TPxTPH/CTC',
  SECOND: 'P150DIMxIOFC',
  THIRD: 'MPxFCPLM',
  FORTH: 'RPCPDxTDC',
};

export const PROFITABILITY_GRAPH_TYPES = [
  {
    key: GRAPH_TYPES_KEYS.FIRST,
    value: `${i18n.t('totalProduction')} x ${i18n.t(
      'totalProduction',
    )}/${i18n.t('concentrateTotalConsumed')}`,
    graphType: 'PROFITABILITY_ANALYSIS_TOTAL_PRODUCTION',
  },
  {
    key: GRAPH_TYPES_KEYS.SECOND,
    value: `${i18n.t('productionIn150Dim')} x ${i18n.t('IOFC')}`,
    graphType: 'PROFITABILITY_ANALYSIS_PRODUCTION_IN_150_DIM',
  },
  {
    key: GRAPH_TYPES_KEYS.THIRD,
    value: `${i18n.t('milkPrice')} x ${i18n.t('feedingCostPerLiterMilk')}`,
    graphType: 'PROFITABILITY_ANALYSIS_MILK_PRICE_FEEDING_COST',
  },
  {
    key: GRAPH_TYPES_KEYS.FORTH,
    value: `${i18n.t('revenuePerCowPerDay')} x ${i18n.t('totalDietCost')}`,
    graphType: 'PROFITABILITY_ANALYSIS_REVENUE_PER_COW_PER_DAY',
  },
];

export const PROFITABILITY_GRAPH_LEGENDS = [
  {
    key: 'TPxTPH/CTC',
    firstLegend: `${i18n.t('totalProduction')} (${i18n.t('cow')}/${i18n.t(
      'day',
    )})`,
    secondLegend: `${i18n.t('totalProduction')} / ${i18n.t(
      'concentrateTotalConsumed',
    )}`,
  },
  {
    key: 'P150DIMxIOFC',
    firstLegend: i18n.t('productionIn150Dim'),
    secondLegend: i18n.t('IOFC'),
  },
  {
    key: 'MPxFCPLM',
    firstLegend: i18n.t('milkPrice'),
    secondLegend: i18n.t('feedingCostPerLiterMilk'),
  },
  {
    key: 'RPCPDxTDC',
    firstLegend: i18n.t('revenuePerCowPerDay'),
    secondLegend: `${i18n.t('totalDietCost')} `,
  },
];

export const PRODUCTION_150_DIM_FORMULA_VALUES = {
  INITIAL_MULTIPLY_VALUE: 0.432,
  SECONDARY_MULTIPLY_VALUE: 16.25,
  FINAL_MULTIPLY_VALUE: 0.0029,
  MINUS_DIM_VALUE: 150,
};

export const MILKING_NUMBERS = [
  {
    key: '1',
    value: '1',
  },
  {
    key: '2',
    value: '2',
  },
  {
    key: '3',
    value: '3',
  },
  {
    key: '4',
    value: '3+',
  },
];
