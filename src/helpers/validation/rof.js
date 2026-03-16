import * as Yup from 'yup';

import { ROF_FIELDS } from '../../constants/FormConstants';

//localization
import i18n from '../../localization/i18n';
import { DECIMAL_REGEX, INTEGER_REGEX } from '../../constants/AppConstants';

const ROFValidationSchema = Yup.object().shape({
  //#region herd profile
  [ROF_FIELDS.HERD_PROFILE]: Yup.object().shape({
    [ROF_FIELDS.BREED]: Yup.string().required(i18n.t('required')),
    [ROF_FIELDS.OTHER_BREED_TYPE]: Yup.string().when([ROF_FIELDS.BREED], {
      is: breed => {
        return breed == 'Other';
      },
      then: () => Yup.string().required(i18n.t('required')),
    }),
  }),

  //#endregion

  //#region feeding
  [ROF_FIELDS.FEEDING]: Yup.object().shape({
    [ROF_FIELDS.LACTATING_COWS]: Yup.string()
      .required(i18n.t('required'))
      .matches(INTEGER_REGEX, {
        excludeEmptyString: true,
        message: i18n.t('invalidNumber'),
      }),

    [ROF_FIELDS.HOME_GROWN_FORAGES]: Yup.array().of(
      Yup.object().shape({
        [ROF_FIELDS.HOME_GROWN_FORAGE_TYPE]: Yup.string().required(
          i18n.t('required'),
        ),
        [ROF_FIELDS.FORAGE_NAME]: Yup.string().required(i18n.t('required')),
        [ROF_FIELDS.TOTAL_HERD_PER_DAY]: Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_REGEX, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          }),
        [ROF_FIELDS.DRY_MATTER]: Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_REGEX, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          }),
      }),
    ),
    [ROF_FIELDS.HOME_GROWN_GRAINS]: Yup.array().of(
      Yup.object().shape({
        [ROF_FIELDS.HOME_GROWN_GRAINS_TYPE]: Yup.string().required(
          i18n.t('required'),
        ),
        [ROF_FIELDS.GRAINS_NAME]: Yup.string().required(i18n.t('required')),
        [ROF_FIELDS.TOTAL_HERD_PER_DAY]: Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_REGEX, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          }),
        [ROF_FIELDS.DRY_MATTER]: Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_REGEX, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          }),
      }),
    ),
    [ROF_FIELDS.PURCHASE_BULK_FEED]: Yup.array().of(
      Yup.object().shape({
        [ROF_FIELDS.FEED_NAME]: Yup.string().required(i18n.t('required')),
        [ROF_FIELDS.TOTAL_HERD_PER_DAY]: Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_REGEX, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          }),
        [ROF_FIELDS.DRY_MATTER]: Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_REGEX, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          }),
      }),
    ),
    [ROF_FIELDS.PURCHASE_BAG_FEED]: Yup.array().of(
      Yup.object().shape({
        [ROF_FIELDS.FEED_NAME]: Yup.string().required(i18n.t('required')),
        [ROF_FIELDS.TOTAL_HERD_PER_DAY]: Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_REGEX, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          }),
        [ROF_FIELDS.DRY_MATTER]: Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_REGEX, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          }),
      }),
    ),
  }),
  //#endregion

  //#region milk production
  [ROF_FIELDS.MILK_PRODUCTION]: Yup.object().shape({
    [ROF_FIELDS.AVERAGE_MILK_PRODUCTION_KG]: Yup.string()
      .required(i18n.t('required'))
      .matches(DECIMAL_REGEX, {
        excludeEmptyString: true,
        message: i18n.t('invalidNumber'),
      }),
    [ROF_FIELDS.BUTTERFAT]: Yup.object().shape({
      [ROF_FIELDS.PERCENTAGE_PER_HL]: Yup.string()
        .required(i18n.t('required'))
        .matches(DECIMAL_REGEX, {
          excludeEmptyString: true,
          message: i18n.t('invalidNumber'),
        }),
    }),
    [ROF_FIELDS.PROTEIN]: Yup.object().shape({
      [ROF_FIELDS.PERCENTAGE_PER_HL]: Yup.string()
        .required(i18n.t('required'))
        .matches(DECIMAL_REGEX, {
          excludeEmptyString: true,
          message: i18n.t('invalidNumber'),
        }),
    }),
    [ROF_FIELDS.LACTOSE_AND_OTHER_SOLIDS]: Yup.object().shape({
      [ROF_FIELDS.PERCENTAGE_PER_HL]: Yup.string()
        .required(i18n.t('required'))
        .matches(DECIMAL_REGEX, {
          excludeEmptyString: true,
          message: i18n.t('invalidNumber'),
        }),
    }),
  }),
  //#endregion

  //#region milk production outputs
  [ROF_FIELDS.MILK_PRODUCTION_OUTPUTS]: Yup.object().shape({}),
  //#endregion
});

export default ROFValidationSchema;
