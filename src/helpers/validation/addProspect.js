import * as Yup from 'yup';
import {
  BRAZIL_COUNTRY_CODE,
  COUNTRIES_HAVING_STATES,
  COUNTRY_CODE_VALIDATION_REQUIRED_FROM_BRAZIL_COUNTRY,
  COUNTRY_CODE_VALIDATION_REQUIRED_FROM_CANADA_COUNTRY,
  COUNTRY_CODE_VALIDATION_REQUIRED_FROM_US_COUNTRY,
} from '../../constants/AppConstants';
import { PROSPECT_FIELDS } from '../../constants/FormConstants';
import i18n from '../../localization/i18n';

const addProspectValidationSchema = Yup.object().shape({
  [PROSPECT_FIELDS.BUSINESS_NAME]: Yup.string()
    .trim(i18n.t('required'))
    .required(i18n.t('required')),
  [PROSPECT_FIELDS.TYPE]: Yup.string().required(i18n.t('required')),
  [PROSPECT_FIELDS.COUNTRY]: Yup.string().required(i18n.t('required')),
  /**
   * @description
   * changing STATE_ID validation to accept null value
   */
  // [PROSPECT_FIELDS.STATE_ID]: Yup.string()
  //   .nullable(true)
  //   .when([PROSPECT_FIELDS.COUNTRY], {
  //     is: country =>
  //       country === COUNTRY_CODE_VALIDATION_REQUIRED_FROM_BRAZIL_COUNTRY ||
  //       country === COUNTRY_CODE_VALIDATION_REQUIRED_FROM_CANADA_COUNTRY ||
  //       country === COUNTRY_CODE_VALIDATION_REQUIRED_FROM_US_COUNTRY,
  //     then: Yup.string().nullable(true).required(i18n.t('required')),
  //   }),
  [PROSPECT_FIELDS.STATE_ID]: Yup.string()
    .nullable(true)
    .when([PROSPECT_FIELDS.COUNTRY_CODE], {
      is: country => {
        return COUNTRIES_HAVING_STATES.includes(country);
      },
      then: () => Yup.string().nullable(true).required(i18n.t('required')),
    }),
  // [PROSPECT_FIELDS.CUSTOMER_CODE]: Yup.string().when(
  //   [PROSPECT_FIELDS.COUNTRY],
  //   {
  //     is: country =>
  //       country === COUNTRY_CODE_VALIDATION_REQUIRED_FROM_BRAZIL_COUNTRY,
  //     then: Yup.string().required(i18n.t('required')),
  //   },
  // ),
  [PROSPECT_FIELDS.CUSTOMER_CODE]: Yup.string().when(
    [PROSPECT_FIELDS.COUNTRY_CODE],
    {
      is: country => country === BRAZIL_COUNTRY_CODE,
      then: () => Yup.string().required(i18n.t('required')),
    },
  ),
  [PROSPECT_FIELDS.PRIMARY_CONTACT_FIRST_NAME]: Yup.string()
    .trim(i18n.t('required'))
    .required(i18n.t('required')),
  [PROSPECT_FIELDS.PRIMARY_CONTACT_LAST_NAME]: Yup.string()
    .trim(i18n.t('required'))
    .required(i18n.t('required')),
  [PROSPECT_FIELDS.PRIMARY_CONTACT_EMAIL]: Yup.string().email(
    i18n.t('emailValidationError'),
  ),
  /**
   * @description
   * changing STATE validation to accept null value
   */
  // [PROSPECT_FIELDS.STATE]: Yup.string()
  //   .nullable(true)
  //   .when([PROSPECT_FIELDS.COUNTRY], {
  //     is: country =>
  //       country === COUNTRY_CODE_VALIDATION_REQUIRED_FROM_BRAZIL_COUNTRY,
  //     then: Yup.string().nullable(true).required(i18n.t('required')),
  //   }),
  [PROSPECT_FIELDS.STATE]: Yup.string()
    .nullable(true)
    .when([PROSPECT_FIELDS.COUNTRY_CODE], {
      is: country => country === BRAZIL_COUNTRY_CODE,
      then: () => Yup.string().nullable(true).required(i18n.t('required')),
    }),
});

export default addProspectValidationSchema;
