import * as Yup from 'yup';

//constants
import {
  DECIMAL_REGEX,
  INTEGER_REGEX_VALIDATE,
} from '../../constants/AppConstants';
import { HEAT_STRESS_FIELDS } from '../../constants/FormConstants';

//localization
import i18n from '../../localization/i18n';

const HeatStressSchema = Yup.object().shape({
  [HEAT_STRESS_FIELDS.DRY_MATTER_INTAKE]: Yup.string()
    .required(i18n.t('required'))
    .matches(DECIMAL_REGEX, {
      excludeEmptyString: true,
      message: i18n.t('invalidNumber'),
    }),
});

export default HeatStressSchema;
