//constants
import {
  FORAGE_PENN_STATE,
  FORAGE_PENN_STATE_FIELDS,
} from '../../constants/FormConstants';
import { OTHER } from '../../constants/toolsConstants/ForagePenState';

//i18n
import i18n from '../../localization/i18n';

//yup
import * as Yup from 'yup';

const foragePennStateSchema = Yup.object().shape({
  [FORAGE_PENN_STATE]: Yup.array().of(
    Yup.object().shape({
      [FORAGE_PENN_STATE_FIELDS.SILAGE_NAME]: Yup.string().when(
        [FORAGE_PENN_STATE_FIELDS.SILAGE],
        {
          is: silage => silage === OTHER,
          then: () => Yup.string().required(i18n.t('required')),
        },
      ),
    }),
  ),
});

export default foragePennStateSchema;
