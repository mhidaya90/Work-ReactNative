import * as Yup from 'yup';

//constants
import {
  DECIMAL_REGEX,
  INTEGER_REGEX_VALIDATE,
} from '../../constants/AppConstants';

import { PROFITABILITY_ANALYSIS_FIELDS } from '../../constants/FormConstants';

//localization
import i18n from '../../localization/i18n';

const ProfitabilityValidationSchema = Yup.object().shape({
  // animal inputs
  [PROFITABILITY_ANALYSIS_FIELDS.ANIMALS_IN_HERD]: Yup.number()
    .required(i18n.t('required'))
    .moreThan(0),

  [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_COWS]: Yup.number()
    .required(i18n.t('required'))
    .moreThan(0),

  [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_NUMBER_OF_LACTATING_ANIMALS]:
    Yup.number().required(i18n.t('required')).moreThan(0),

  [PROFITABILITY_ANALYSIS_FIELDS.BREED]: Yup.string().required(
    i18n.t('required'),
  ),

  [PROFITABILITY_ANALYSIS_FIELDS.PRODUCTION_SYSTEM]: Yup.string().required(
    i18n.t('required'),
  ),

  // milk information
  [PROFITABILITY_ANALYSIS_FIELDS.NUMBER_ON_MILKINGS]: Yup.string().required(
    i18n.t('required'),
  ),

  [PROFITABILITY_ANALYSIS_FIELDS.TOTAL_PRODUCTION_HERD]: Yup.string().required(
    i18n.t('required'),
  ),

  [PROFITABILITY_ANALYSIS_FIELDS.MILK_PRICE]: Yup.string().required(
    i18n.t('required'),
  ),

  [PROFITABILITY_ANALYSIS_FIELDS.DIM]: Yup.number().required(
    i18n.t('required'),
  ),

  [PROFITABILITY_ANALYSIS_FIELDS.MILK_FAT_PERCENTAGE]: Yup.string().required(
    i18n.t('required'),
  ),

  [PROFITABILITY_ANALYSIS_FIELDS.MILK_PROTEIN_PERCENTAGE]:
    Yup.string().required(i18n.t('required')),

  [PROFITABILITY_ANALYSIS_FIELDS.SOMANTIC_CELL_COUNT]: Yup.number()
    .required(i18n.t('required'))
    .moreThan(0),

  [PROFITABILITY_ANALYSIS_FIELDS.BACTERIA_CELL_COUNT]: Yup.string().required(
    i18n.t('required'),
  ),

  [PROFITABILITY_ANALYSIS_FIELDS.MUN]: Yup.string().required(
    i18n.t('required'),
  ),

  // feeding information
  [PROFITABILITY_ANALYSIS_FIELDS.AIR_RU_PERCENTAGE]: Yup.string().required(
    i18n.t('required'),
  ),

  // Yup.string()
  //   .required(i18n.t('required'))
  //   .matches(DECIMAL_REGEX, {
  //     excludeEmptyString: true,
  //     message: i18n.t('invalidNumber'),
  //   }),
});

export default ProfitabilityValidationSchema;
