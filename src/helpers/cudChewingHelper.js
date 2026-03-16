import { VISIT_TABLE_FIELDS } from '../constants/AppConstants';
import { getParsedToolData } from './genericHelper';
import { logEvent } from './logHelper';

const extractUsedPensFromCudChewingTool = (
  cudChewingPenAnalysisData = null,
) => {
  try {
    const usedPensPayload = [];

    if (
      cudChewingPenAnalysisData &&
      cudChewingPenAnalysisData?.pens?.length > 0
    ) {
      cudChewingPenAnalysisData?.pens?.map(pen =>
        usedPensPayload.push(pen?.penId),
      );
    }

    const payload = {
      [VISIT_TABLE_FIELDS.RUMEN_HEALTH]: usedPensPayload,
    };

    return payload;
  } catch (error) {
    console.log('error extractUsedPensFromCudChewingTool', error);
    return null;
  }
};

function deletePenDataInsideCudChewingTool(cudChewingData, pen) {
  try {
    const parsedCudChewingData = getParsedToolData(cudChewingData);

    if (parsedCudChewingData) {
      const filteredPens = [];

      parsedCudChewingData?.pens?.map(item => {
        if (item.penId !== pen) {
          filteredPens.push(item);
        }
      });

      parsedCudChewingData.pens = filteredPens;
    }

    if (parsedCudChewingData?.pens?.length <= 0) {
      return null;
    }

    return parsedCudChewingData;
  } catch (error) {
    logEvent(
      'helpers -> cudChewingHelper -> deletePenDataInsideCudChewingTool error',
      error,
    );
    return cudChewingData;
  }
}

export { extractUsedPensFromCudChewingTool, deletePenDataInsideCudChewingTool };
