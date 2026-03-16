import * as Yup from 'yup';
import { VISIT_FIELDS } from '../../constants/FormConstants';
import { VISIT_NAME_REGEX } from '../../constants/AppConstants';
import i18n from '../../localization/i18n';

const newVisitValidationSchema = Yup.object().shape({
  [VISIT_FIELDS.CUSTOMER_PROSPECT]: Yup.string().required(i18n.t('required')),
  [VISIT_FIELDS.SITE]: Yup.string().required(i18n.t('required')),
  [VISIT_FIELDS.VISIT_NAME]: Yup.string()
    .matches(VISIT_NAME_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidName'),
    })
    .required(i18n.t('required')),
});

export default newVisitValidationSchema;
