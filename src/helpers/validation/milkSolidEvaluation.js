import * as Yup from 'yup';

//constants
import {
  DECIMAL_REGEX,
  INTEGER_REGEX_VALIDATE,
} from '../../constants/AppConstants';
import { MILK_SOLID_EVALUATION_FIELDS } from '../../constants/FormConstants';

//localization
import i18n from '../../localization/i18n';

const MilkSolidEvaluationSchema = Yup.object().shape({
  [MILK_SOLID_EVALUATION_FIELDS.CURRENT_MILK_PRICE]: Yup.string()
    .required(i18n.t('required'))
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),

  [MILK_SOLID_EVALUATION_FIELDS.LACTATING_ANIMALS]: Yup.string()
    .required(i18n.t('required'))
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),

  [MILK_SOLID_EVALUATION_FIELDS.DAYS_IN_MILK]: Yup.string()
    .required(i18n.t('required'))
    .matches(INTEGER_REGEX_VALIDATE, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),

  [MILK_SOLID_EVALUATION_FIELDS.DRY_MATTER_INTAKE]: Yup.string()
    .required(i18n.t('required'))
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),
  [MILK_SOLID_EVALUATION_FIELDS.AS_FED_INTAKE]: Yup.string().matches(
    DECIMAL_REGEX,
    {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    },
  ),
  [MILK_SOLID_EVALUATION_FIELDS.NEL_DAIRY]: Yup.string().matches(
    DECIMAL_REGEX,
    {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    },
  ),
  [MILK_SOLID_EVALUATION_FIELDS.RATION_COST]: Yup.string().matches(
    DECIMAL_REGEX,
    {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    },
  ),
  [MILK_SOLID_EVALUATION_FIELDS.ANIMALS_IN_TANK]: Yup.string()
    .required(i18n.t('required'))
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),
});

export default MilkSolidEvaluationSchema;
