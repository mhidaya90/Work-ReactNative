import { getNumberFormatSettings } from 'react-native-localize';
import { ANIMAL_FIELDS } from '../constants/FormConstants';
import { stringIsEmpty } from './alphaNumericHelper';
import {
  convertInputNumbersToRegionalBasis,
  getParsedToolData,
} from './genericHelper';
import { VISIT_TABLE_FIELDS } from '../constants/AppConstants';
import { logEvent } from './logHelper';

export const getDefaultFormValues = selectedTool => {
  return {
    [ANIMAL_FIELDS.EAR_TAG]: '',
    [ANIMAL_FIELDS.SELECTED_TOOL]: selectedTool,
    [ANIMAL_FIELDS.BCS]: '',
    [ANIMAL_FIELDS.LOCOMOTION_SCORE]: '',
    [ANIMAL_FIELDS.DAYS_IN_MILK]: '',
  };
};

export const createInitialAnimalFormValues = (data, earTagList) => {
  const object = {
    [ANIMAL_FIELDS.EAR_TAG]: data.localEarTagId,
    [ANIMAL_FIELDS.BCS]: data.bcsCategory.toString().includes('.')
      ? data.bcsCategory
      : data.bcsCategory + '.0',
    [ANIMAL_FIELDS.LOCOMOTION_SCORE]: data.locomotionScore
      .toString()
      .includes('.')
      ? data.locomotionScore
      : data.locomotionScore + '.0',
    [ANIMAL_FIELDS.DAYS_IN_MILK]: data.daysInMilk,
  };
  if (!stringIsEmpty(data.localEarTagId)) {
    object[ANIMAL_FIELDS.EAR_TAG] = data.localEarTagId;
  } else {
    if (earTagList) {
      const filteredTagList = earTagList.filter(
        earTag => earTag.sv_id === data.earTagId,
      );
      if (filteredTagList && filteredTagList.length > 0) {
        let earTag = filteredTagList[0];
        object[ANIMAL_FIELDS.EAR_TAG] = earTag.id;
      }
    }
  }
  return object;
};

export const getAddAnimalObject = (values, pen, earTagList, visit, date) => {
  const data = {
    bcsCategory: values[ANIMAL_FIELDS.BCS],
    locomotionScore: values[ANIMAL_FIELDS.LOCOMOTION_SCORE],
    daysInMilk: values[ANIMAL_FIELDS.DAYS_IN_MILK],
    isToolItemNew: true,
    penName: pen?.name || pen?.value || '',
  };
  let obj = {};

  if (!stringIsEmpty(pen.sv_id)) {
    data.penId = pen.sv_id;
    obj.penId = pen.sv_id;
  } else {
    data.localPenId = pen.id;
    obj.localPenId = pen.id;
  }
  const filteredTagList = earTagList.filter(
    earTag => earTag.id === values[ANIMAL_FIELDS.EAR_TAG],
  );
  if (filteredTagList && filteredTagList.length > 0) {
    let earTag = filteredTagList[0];
    if (!stringIsEmpty(earTag.sv_id)) {
      data.earTagId = earTag.sv_id;
    } else {
      data.localEarTagId = earTag.id;
    }
  }
  // if (!stringIsEmpty(visit.sv_id)) {
  //   data.visitsSelected = [visit.sv_id];
  // } else {
  //   data.localVisitsSelected = [visit.id];
  // }
  obj.animal = data;
  obj.penName = pen?.name || pen?.value || '';
  obj.localVisitId = visit.id;
  obj.updated_at = date;
  obj.mobileLastUpdatedTime = date;

  return obj;
};

export const parseEarTags = earTags => {
  const regionSettings = getNumberFormatSettings();
  let data = [];

  if (
    regionSettings?.decimalSeparator != '.' &&
    earTags &&
    earTags.length > 0
  ) {
    earTags?.map((tag, index) => {
      data.push({
        ...tag,
        earTagName: convertInputNumbersToRegionalBasis(
          tag?.earTagName || tag?.name,
        ),
        name: convertInputNumbersToRegionalBasis(tag?.earTagName || tag?.name),
      });
    });
  } else {
    return earTags;
  }

  return data;
};

export const extractUsedPensFromAnimalAnalysisTool = (
  animalAnalysisData = null,
  currentVisit,
) => {
  try {
    let usedPensPayload = [];
    if (animalAnalysisData) {
      const parsedVisitUsedPens = getParsedToolData(currentVisit?.usedPens);

      if (
        parsedVisitUsedPens &&
        parsedVisitUsedPens?.[VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS]?.length > 0
      ) {
        usedPensPayload =
          parsedVisitUsedPens?.[VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS];

        const parsedAnimalAnalysis = getParsedToolData(
          currentVisit.animalAnalysis,
        );

        const isPenExist = parsedAnimalAnalysis?.animals?.find(
          item =>
            item?.penId === animalAnalysisData?.penId ||
            item?.localPenId === animalAnalysisData?.localPenId,
        );
        if (!isPenExist) {
          usedPensPayload.push(
            animalAnalysisData?.penId || animalAnalysisData?.localPenId,
          );
        } else {
          usedPensPayload.push(
            animalAnalysisData?.penId || animalAnalysisData?.localPenId,
          );
        }
        // else {
        //   usedPensPayload.push(
        //     animalAnalysisData?.penId || animalAnalysisData?.localPenId,
        //   );
        // }
      } else {
        usedPensPayload.push(
          animalAnalysisData?.penId || animalAnalysisData?.localPenId,
        );
      }
    }

    const payload = {
      [VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS]: usedPensPayload,
    };

    if (animalAnalysisData?.toolType) {
      payload[animalAnalysisData?.toolType] = usedPensPayload;
    }

    return payload;
  } catch (error) {
    logEvent(
      'helpers -> animalHelper -> extractUsedPensFromAnimalAnalysisTool error',
      error,
    );
    return null;
  }
};

export function deletePenDataInsideAnimalAnalysisTool(animalAnalysisData, pen) {
  try {
    const parsedAnimalAnalysisData = getParsedToolData(animalAnalysisData);

    if (parsedAnimalAnalysisData) {
      const filteredPens = [];

      parsedAnimalAnalysisData.animals?.map(item => {
        if (stringIsEmpty(item?.penId) && item?.localPenId !== pen) {
          filteredPens.push(item);
        } else if (stringIsEmpty(item?.localPenId) && item?.penId !== pen) {
          filteredPens.push(item);
        }
      });

      parsedAnimalAnalysisData.animals = filteredPens;

      if (parsedAnimalAnalysisData.animals?.length <= 0) {
        return null;
      }
    }

    return parsedAnimalAnalysisData;
  } catch (error) {
    logEvent(
      'helpers -> animalHelper -> deletePenDataInsideAnimalAnalysisTool error',
      error,
    );
    return animalAnalysisData;
  }
}
