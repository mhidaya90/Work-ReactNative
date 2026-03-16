import * as Yup from 'yup';
import { INTEGER_REGEX, TOOL_TYPES } from '../../constants/AppConstants';
import { ANIMAL_FIELDS } from '../../constants/FormConstants';
import i18n from '../../localization/i18n';

const addAnimalValidationSchema = Yup.object().shape({
  [ANIMAL_FIELDS.EAR_TAG]: Yup.string().required(i18n.t('required')),
  [ANIMAL_FIELDS.BCS]: Yup.string().when([ANIMAL_FIELDS.SELECTED_TOOL], {
    is: tool => tool === TOOL_TYPES.BODY_CONDITION,
    then: () => Yup.string().required(i18n.t('required')),
  }),
  [ANIMAL_FIELDS.LOCOMOTION_SCORE]: Yup.string().when(
    [ANIMAL_FIELDS.SELECTED_TOOL],
    {
      is: tool => tool === TOOL_TYPES.LOCOMOTION_SCORE,
      then: () => Yup.string().required(i18n.t('required')),
    },
  ),
  [ANIMAL_FIELDS.DAYS_IN_MILK]: Yup.string().matches(INTEGER_REGEX, {
    excludeEmptyString: true,
    message: i18n.t('invalidNumber'),
  }),
});

export default addAnimalValidationSchema;
