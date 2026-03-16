import * as Yup from 'yup';
import {
  DECIMAL_REGEX,
  INTEGER_REGEX_VALIDATE,
} from '../../constants/AppConstants';
import { SITE_FIELDS } from '../../constants/FormConstants';
import i18n from '../../localization/i18n';

const addSiteValidationSchema = Yup.object().shape({
  [SITE_FIELDS.SITE_NAME]: Yup.string()
    .trim(i18n.t('required'))
    .required(i18n.t('required')),
  [SITE_FIELDS.CURRENT_MILK_PRICE]: Yup.string()
    .required(i18n.t('required'))
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),
  [SITE_FIELDS.MILKING_SYSTEM]: Yup.string().required(i18n.t('required')),
  [SITE_FIELDS.TOTAL_STALLS]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.LACTATING_ANIMALS]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.DAYS_IN_MILK]: Yup.string().matches(INTEGER_REGEX_VALIDATE, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.MILK_YIELD]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.MILK_FAT]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.MILK_PROTEIN]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.MILK_OTHER_SOLIDS]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.SOMATIC_CELL_COUNT]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.BACTERIA_CELL_COUNT]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.DRY_MATTER_INTAKE]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.AS_FED_INTAKE]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.NEL_DAIRY]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [SITE_FIELDS.RATION_COST]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
});

export default addSiteValidationSchema;
