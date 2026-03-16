import * as Yup from 'yup';
import { LOGIN_FIELDS } from '../../constants/FormConstants';
import i18n from '../../localization/i18n';

const loginValidationSchema = Yup.object().shape({
  [LOGIN_FIELDS.EMAIL]: Yup.string()
    .email(i18n.t('emailValidationError'))
    .required(i18n.t('required')),
  [LOGIN_FIELDS.PASSWORD]: Yup.string().required(i18n.t('required')),
});

export default loginValidationSchema;
