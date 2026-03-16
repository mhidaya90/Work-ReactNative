import * as Yup from 'yup';
import {
  DECIMAL_REGEX,
  INTEGER_REGEX_VALIDATE,
} from '../../constants/AppConstants';
import { PEN_FIELDS } from '../../constants/FormConstants';
import i18n from '../../localization/i18n';

const addPenValidationSchema = Yup.object().shape({
  [PEN_FIELDS.PEN_NAME]: Yup.string()
    .trim(i18n.t('required'))
    .required(i18n.t('required')),
  [PEN_FIELDS.ANIMAL_CLASS]: Yup.string().required(i18n.t('required')),
  [PEN_FIELDS.HOUSING_SYSTEM]: Yup.string().required(i18n.t('required')),
  [PEN_FIELDS.FEEDING_SYSTEM]: Yup.string().required(i18n.t('required')),
  [PEN_FIELDS.NUMBER_OF_STALLS]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PEN_FIELDS.MILKING_FREQUNCY]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PEN_FIELDS.ANIMLA_PER_PEN]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PEN_FIELDS.DAYS_IN_MILK]: Yup.string().matches(INTEGER_REGEX_VALIDATE, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PEN_FIELDS.MILK_YIELD]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PEN_FIELDS.DRY_MATTER_INTAKE]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PEN_FIELDS.AS_FED_INTAKE]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PEN_FIELDS.NEL_DAIRY]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
  [PEN_FIELDS.RATION_COST]: Yup.string().matches(DECIMAL_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
});

export default addPenValidationSchema;
