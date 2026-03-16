import * as Yup from 'yup';
import { PICKUP_FIELDS } from '../../constants/FormConstants';

//constants
import {
  DECIMAL_REGEX,
  INTEGER_REGEX_VALIDATE,
} from '../../constants/AppConstants';
import i18n from '../../localization/i18n';

const addPickupValidationSchema = Yup.object().shape({
  [PICKUP_FIELDS.MILK_SOLID]: Yup.string()
    .required(i18n.t('required'))
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),

  [PICKUP_FIELDS.ANIMALS_IN_TANK]: Yup.string()
    .required(i18n.t('required'))
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),

  [PICKUP_FIELDS.DAYS_IN_TANK]: Yup.string()
    .required(i18n.t('required'))
    .matches(INTEGER_REGEX_VALIDATE, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),

  [PICKUP_FIELDS.MILK_FAT]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PICKUP_FIELDS.MILK_PROTEIN]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PICKUP_FIELDS.NON_FAT_SOLID]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PICKUP_FIELDS.MUN_Milk_Urea]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PICKUP_FIELDS.SOMATIC_CELL_COUNT]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),

  [PICKUP_FIELDS.BACTERIA_CELL_COUNT]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),

  [PICKUP_FIELDS.MASTITIS]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
});

export default addPickupValidationSchema;
