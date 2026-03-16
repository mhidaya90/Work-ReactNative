import * as Yup from 'yup';

// constants
import {
  DECIMAL_REGEX,
  INTEGER_REGEX,
  UNIT_OF_MEASURE,
  DECIMAL_TOFIXED_REGEX_VALIDATE,
  INTEGER_REGEX_VALIDATE,
} from '../../constants/AppConstants';
import { CALF_HEIFER_GROWTH_FIELDS } from '../../constants/FormConstants';
import {
  SETTINGS_FORM_MIN_MAX_VALUES,
  ANIMAL_FORM_MIN_MAX_VALUES,
  GROWTH_SCALE_OPTIONS,
} from '../../constants/toolsConstants/CalfHeiferGrowthConstants';
import { convertCommaValueToDotValue } from '../../helpers/alphaNumericHelper';

//localization
import i18n from '../../localization/i18n';

// Settings form validation schema (dynamic based on scale)
export const CalfHeiferGrowthSettingsFormValidationSchema = Yup.object().shape({
  // Age at first calving
  [CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS]: Yup.string()
    .required(i18n.t('required'))
    .matches(INTEGER_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    })
    .test(
      'min',
      `${i18n.t('min')} ${
        SETTINGS_FORM_MIN_MAX_VALUES[
          CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
        ].min
      }`,
      value => {
        if (value === undefined || value === null || value === '') return false;
        return (
          Number(value) >=
          SETTINGS_FORM_MIN_MAX_VALUES[
            CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
          ].min
        );
      },
    )
    .test(
      'max',
      `${i18n.t('max')} ${
        SETTINGS_FORM_MIN_MAX_VALUES[
          CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
        ].max
      }`,
      value => {
        if (value === undefined || value === null || value === '') return false;
        return (
          Number(value) <=
          SETTINGS_FORM_MIN_MAX_VALUES[
            CALF_HEIFER_GROWTH_FIELDS.AGE_AT_FIRST_CALVING_MONTHS
          ].max
        );
      },
    ),

  // Mature body weight (conditional on scale)
  [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]: Yup.string().when(
    CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    {
      is: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
      then: () =>
        Yup.string()
          .required(i18n.t('required'))
          .test('number-format', function (value) {
            if (value === undefined || value === null || value === '')
              return false;
            const regex = DECIMAL_TOFIXED_REGEX_VALIDATE;
            return (
              regex.test(String(value)) ||
              this.createError({ message: i18n.t('invalidNumber') })
            );
          })
          .test('min', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMin =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
              ].min;
            const min =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMin * 2.2 : baseMin;

            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num >= min ||
              this.createError({
                message: `${i18n.t('min')} ${min.toFixed(0)}`,
              })
            );
          })
          .test('max', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMax =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
              ].max;
            const max =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMax * 2.2 : baseMax;

            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num <= max ||
              this.createError({
                message: `${i18n.t('max')} ${max.toFixed(1)}`,
              })
            );
          }),
      otherwise: () => Yup.string().notRequired(),
    },
  ),

  // Birth weight (conditional on scale)
  [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]: Yup.string().when(
    CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    {
      is: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
      then: () =>
        Yup.string()
          .required(i18n.t('required'))
          .test('number-format', function (value) {
            if (value === undefined || value === null || value === '')
              return false;
            const regex = DECIMAL_TOFIXED_REGEX_VALIDATE;
            return (
              regex.test(String(value)) ||
              this.createError({ message: i18n.t('invalidNumber') })
            );
          })
          .test('min', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMin =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
              ].min;
            const min =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMin * 2.2 : baseMin;

            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num >= min ||
              this.createError({
                message: `${i18n.t('min')} ${min.toFixed(1)}`,
              })
            );
          })
          .test('max', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMax =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
              ].max;
            const max =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMax * 2.2 : baseMax;

            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num <= max ||
              this.createError({
                message: `${i18n.t('max')} ${max.toFixed(1)}`,
              })
            );
          }),
      otherwise: () => Yup.string().notRequired(),
    },
  ),

  // Mature body height (conditional on scale)
  [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]: Yup.string().when(
    CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    {
      is: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
      then: () =>
        Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_TOFIXED_REGEX_VALIDATE, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          })
          .test('min', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMin =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
              ].min;
            const min =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMin / 2.54 : baseMin;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num >= min ||
              this.createError({
                message: `${i18n.t('min')} ${min.toFixed(1)}`,
              })
            );
          })
          .test('max', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMax =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
              ].max;
            const max =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMax / 2.54 : baseMax;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num <= max ||
              this.createError({
                message: `${i18n.t('max')} ${max.toFixed(1)}`,
              })
            );
          }),
      otherwise: () => Yup.string().notRequired(),
    },
  ),

  // Birth height (conditional on scale)
  [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]: Yup.string().when(
    CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    {
      is: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
      then: () =>
        Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_TOFIXED_REGEX_VALIDATE, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          })
          .test('min', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMin =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
              ].min;
            const min =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMin / 2.54 : baseMin;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num >= min ||
              this.createError({
                message: `${i18n.t('min')} ${min.toFixed(1)}`,
              })
            );
          })
          .test('max', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMax =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
              ].max;
            const max =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMax / 2.54 : baseMax;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num <= max ||
              this.createError({
                message: `${i18n.t('max')} ${max.toFixed(1)}`,
              })
            );
          }),
      otherwise: () => Yup.string().notRequired(),
    },
  ),
});

export const CalfHeiferGrowthSwitchTypeValidationSchema = Yup.object().shape({
  // Mature body weight (conditional on scale)
  [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG]: Yup.string().when(
    CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    {
      is: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
      then: () =>
        Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_TOFIXED_REGEX_VALIDATE, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          })
          .test('min', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMin =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
              ].min;
            const min =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMin * 2.2 : baseMin;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num >= min ||
              this.createError({
                message: `${i18n.t('min')} ${min.toFixed(1)}`,
              })
            );
          })
          .test('max', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMax =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_WEIGHT_IN_KG
              ].max;
            const max =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMax * 2.2 : baseMax;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num <= max ||
              this.createError({
                message: `${i18n.t('max')} ${max.toFixed(1)}`,
              })
            );
          }),
      otherwise: () => Yup.string().notRequired(),
    },
  ),

  // Birth weight (conditional on scale)
  [CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG]: Yup.string().when(
    CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    {
      is: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
      then: () =>
        Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_TOFIXED_REGEX_VALIDATE, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          })
          .test('min', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMin =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
              ].min;
            const min =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMin * 2.2 : baseMin;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num >= min ||
              this.createError({
                message: `${i18n.t('min')} ${min.toFixed(1)}`,
              })
            );
          })
          .test('max', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMax =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.BIRTH_WEIGHT_IN_KG
              ].max;
            const max =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMax * 2.2 : baseMax;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num <= max ||
              this.createError({
                message: `${i18n.t('max')} ${max.toFixed(1)}`,
              })
            );
          }),
      otherwise: () => Yup.string().notRequired(),
    },
  ),

  // Mature body height (conditional on scale)
  [CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM]: Yup.string().when(
    CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    {
      is: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
      then: () =>
        Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_TOFIXED_REGEX_VALIDATE, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          })
          .test('min', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMin =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
              ].min;
            const min =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMin / 2.54 : baseMin;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num >= min ||
              this.createError({
                message: `${i18n.t('min')} ${min.toFixed(1)}`,
              })
            );
          })
          .test('max', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMax =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.MATURE_BODY_HEIGHT_IN_CM
              ].max;
            const max =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMax / 2.54 : baseMax;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num <= max ||
              this.createError({
                message: `${i18n.t('max')} ${max.toFixed(1)}`,
              })
            );
          }),
      otherwise: () => Yup.string().notRequired(),
    },
  ),

  // Birth height (conditional on scale)
  [CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM]: Yup.string().when(
    CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    {
      is: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
      then: () =>
        Yup.string()
          .required(i18n.t('required'))
          .matches(DECIMAL_TOFIXED_REGEX_VALIDATE, {
            excludeEmptyString: true,
            message: i18n.t('invalidNumber'),
          })
          .test('min', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMin =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
              ].min;
            const min =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMin / 2.54 : baseMin;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num >= min ||
              this.createError({
                message: `${i18n.t('min')} ${min.toFixed(1)}`,
              })
            );
          })
          .test('max', function (value) {
            const unit = this.parent?.unitOfMeasure;
            const baseMax =
              SETTINGS_FORM_MIN_MAX_VALUES[
                CALF_HEIFER_GROWTH_FIELDS.BIRTH_HEIGHT_IN_CM
              ].max;
            const max =
              unit === UNIT_OF_MEASURE.IMPERIAL ? baseMax / 2.54 : baseMax;
            if (value === undefined || value === null || value === '')
              return false;
            const num = Number(convertCommaValueToDotValue(String(value)));
            return (
              num <= max ||
              this.createError({
                message: `${i18n.t('max')} ${max.toFixed(1)}`,
              })
            );
          }),
      otherwise: () => Yup.string().notRequired(),
    },
  ),
});

/**
 * Create validation schema for Add Animal form with dynamic unique animal ID validation
 * @param {Array} existingAnimalIds - Array of existing animal IDs in the site
 * @param {string} currentAnimalId - Current animal ID (for edit mode, to exclude from uniqueness check)
 * @returns {Yup.ObjectSchema} Validation schema
 */
export const createCalfHeiferGrowthAddAnimalFormValidationSchema = (
  existingAnimalIds = [],
  currentAnimalId = null,
  unitOfMeasure,
) => {
  return Yup.object().shape({
    // Animal ID - required, alphanumeric, and must be unique within the site
    [CALF_HEIFER_GROWTH_FIELDS.ANIMAL_ID]: Yup.string()
      .required(i18n.t('required'))
      .matches(/^[a-zA-Z0-9]+$/, i18n.t('invalidId'))
      .test('unique-animal-id', i18n.t('animalIdAlreadyExists'), value => {
        // If no value, let required validation handle it
        if (!value) return true;

        // If editing and the value is the same as current animal ID, allow it
        if (currentAnimalId && value === currentAnimalId) return true;

        // Check if animal ID already exists in the site
        const isUnique = !existingAnimalIds.includes(value);
        return isUnique;
      }),

    // Date of birth - required, not future
    [CALF_HEIFER_GROWTH_FIELDS.DATE_OF_BIRTH]: Yup.date()
      .required(i18n.t('required'))
      .max(new Date(), i18n.t('invalidDateOfBirth')),

    // Date Weight - conditional on growth type
    [CALF_HEIFER_GROWTH_FIELDS.DATE_WEIGHED]: Yup.date().when(
      CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
      {
        is: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
        then: () =>
          Yup.date()
            .required(i18n.t('required'))
            .max(
              new Date(new Date().setHours(23, 59, 59, 999)),
              i18n.t('invalidDateOfBirth'),
            ),
        otherwise: () => Yup.date().notRequired(),
      },
    ),

    // Date Height - conditional on growth type
    [CALF_HEIFER_GROWTH_FIELDS.DATE_HEIGHT]: Yup.date().when(
      CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
      {
        is: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
        then: () =>
          Yup.date()
            .required(i18n.t('required'))
            .max(
              new Date(new Date().setHours(23, 59, 59, 999)),
              i18n.t('invalidDateOfBirth'),
            ),
        otherwise: () => Yup.date().notRequired(),
      },
    ),

    // Body weight - conditional on growth type
    // [CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT]: Yup.string().when(
    //   CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    //   {
    //     is: GROWTH_SCALE_OPTIONS.BODY_WEIGHT,
    //     then: () =>
    //       Yup.string()
    //         .matches(DECIMAL_REGEX, {
    //           excludeEmptyString: true,
    //           message: i18n.t('invalidNumber'),
    //         })
    //         .test(
    //           'min',
    //           `${i18n.t('min')} ${
    //             ANIMAL_FORM_MIN_MAX_VALUES[
    //               CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT
    //             ].min
    //           }`,
    //           value => {
    //             if (value === undefined || value === null || value === '')
    //               return false;
    //             return (
    //               Number(value) >=
    //               ANIMAL_FORM_MIN_MAX_VALUES[
    //                 CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT
    //               ].min
    //             );
    //           },
    //         )
    //         .test(
    //           'max',
    //           `${i18n.t('max')} ${
    //             ANIMAL_FORM_MIN_MAX_VALUES[
    //               CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT
    //             ].max
    //           }`,
    //           value => {
    //             if (value === undefined || value === null || value === '')
    //               return false;
    //             return (
    //               Number(value) <=
    //               ANIMAL_FORM_MIN_MAX_VALUES[
    //                 CALF_HEIFER_GROWTH_FIELDS.BODY_WEIGHT
    //               ].max
    //             );
    //           },
    //         ),
    //     otherwise: () => Yup.string().notRequired(),
    //   },
    // ),

    // Body height - conditional on scale
    // [CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT]: Yup.string().when(
    //   CALF_HEIFER_GROWTH_FIELDS.CALF_HEIFER_GROWTH_TYPE,
    //   {
    //     is: GROWTH_SCALE_OPTIONS.BODY_HEIGHT,
    //     then: () =>
    //       Yup.string()
    //         .matches(DECIMAL_REGEX, {
    //           excludeEmptyString: true,
    //           message: i18n.t('invalidNumber'),
    //         })
    //         .test(
    //           'min',
    //           `${i18n.t('min')} ${
    //             ANIMAL_FORM_MIN_MAX_VALUES[
    //               CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT
    //             ].min
    //           }`,
    //           value => {
    //             if (value === undefined || value === null || value === '')
    //               return false;
    //             return (
    //               Number(value) >=
    //               ANIMAL_FORM_MIN_MAX_VALUES[
    //                 CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT
    //               ].min
    //             );
    //           },
    //         )
    //         .test(
    //           'max',
    //           `${i18n.t('max')} ${
    //             ANIMAL_FORM_MIN_MAX_VALUES[
    //               CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT
    //             ].max
    //           }`,
    //           value => {
    //             if (value === undefined || value === null || value === '')
    //               return false;
    //             return (
    //               Number(value) <=
    //               ANIMAL_FORM_MIN_MAX_VALUES[
    //                 CALF_HEIFER_GROWTH_FIELDS.BODY_HEIGHT
    //               ].max
    //             );
    //           },
    //         ),
    //     otherwise: () => Yup.string().notRequired(),
    //   },
    // ),
  });
};
