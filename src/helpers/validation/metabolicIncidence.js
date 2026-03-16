import * as Yup from 'yup';
import { METABOLIC_INCIDENCE_FIELDS } from '../../constants/FormConstants';
import i18n from '../../localization/i18n';
import { DECIMAL_REGEX } from '../../constants/AppConstants';

const metabolicIncidenceValidationSchema = Yup.object().shape({
  [METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_PER_YEAR]: Yup.number()
    .nullable()
    .required(i18n.t('required')),
  [METABOLIC_INCIDENCE_FIELDS.MILK_PRICE]: Yup.string()
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    })
    .nullable()
    .required(i18n.t('required')),
  [METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_EVALUATION]: Yup.number()
    .nullable()
    .required(i18n.t('required')),
});

export default metabolicIncidenceValidationSchema;
