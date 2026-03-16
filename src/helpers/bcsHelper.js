import { DATE_FORMATS, VISIT_TABLE_FIELDS } from '../constants/AppConstants';
import { stringIsEmpty } from './alphaNumericHelper';
import { getFormattedDate } from './dateHelper';
import { addSpace } from './genericHelper';
import { getAllBCSData, getBCSAvg } from './toolHelper';

import colors from '../constants/theme/variables/customColor';
import { getParsedToolData } from './genericHelper';
import { logEvent } from './logHelper';

export const getBCSDataOfPenFromRecentVisits = (recentVisits, selectedPen) => {
  const data = recentVisits?.map(visitObj => {
    const allData = visitObj.bodyCondition
      ? getAllBCSData(JSON.parse(visitObj.bodyCondition))
      : [];
    if (allData.length > 0 && selectedPen) {
      let filteredPenArray = [];

      if (!stringIsEmpty(selectedPen?.sv_id)) {
        filteredPenArray = allData.filter(
          penObj => penObj.penId === selectedPen?.sv_id,
        );
      } else {
        filteredPenArray = allData.filter(penObj => {
          if (!stringIsEmpty(penObj.penId)) {
            return (
              penObj.penId === selectedPen.penId ||
              penObj.penId === selectedPen.id
            );
          } else if (!stringIsEmpty(penObj.localPenId)) {
            return (
              penObj.localPenId === selectedPen.penId ||
              penObj.localPenId === selectedPen.id
            );
          }
        });
      }

      if (filteredPenArray && filteredPenArray.length > 0) {
        const currentPenObject = filteredPenArray[0];
        return {
          ...currentPenObject,
          visitId: visitObj.id,
          date: visitObj.visitDate,
        };
      }
      return { visitId: visitObj.id, date: visitObj.visitDate };
    }
    return { visitId: visitObj.id, date: visitObj.visitDate };
  });

  return data;
};

export const getBCSGraphDataFromRecentVisits = (
  selectedRecentVisits,
  penData,
) => {
  const datesDict = {};
  let currentVal = null;
  let currentVisitIndex = null;
  let maxVal = 0;

  let graphData = [];

  selectedRecentVisits?.map((visit, index) => {
    if (
      (visit?.localPenId === penData?.penId ||
        visit?.penId === penData?.penId) &&
      visit?.bodyConditionScores &&
      visit?.bodyConditionScores?.length > 0
    ) {
      const point = {
        x: getFormattedDate(visit?.date, DATE_FORMATS.MM_dd),
        y: getBCSAvg(visit),
      };
      if (point.x in datesDict) {
        const tempXVal = point.x + addSpace(datesDict[point.x]);
        datesDict[point.x] = datesDict[point.x] + 1;
        point.x = tempXVal;
      } else {
        datesDict[point.x] = 1;
      }
      if (visit.visitId === penData.visitId) {
        currentVal = point.x;
        currentVisitIndex = graphData.length; // Use the current length as the index
      }
      if (maxVal < point.y) {
        maxVal = point.y;
      }

      graphData.push(point);
    }
  });

  return { graphData, currentVal, currentVisitIndex, maxVal };
};

export const getDefaultLineGraphDataForBCSPenAnalysis = () => {
  return {
    data: [],
    gradientId: 'gradient1',
    gradientStyles: [
      {
        offset: '0%',
        stopColor: colors.activeTabColor,
      },
      {
        offset: '100%',
        stopColor: colors.white,
      },
    ],
  };
};

export const extractUsedPensFromBCSTool = (bcsPenAnalysisData = null) => {
  try {
    const usedPensPayload = [];

    if (bcsPenAnalysisData?.length > 0) {
      bcsPenAnalysisData?.map(pen =>
        usedPensPayload.push(pen?.penId || pen?.localPenId),
      );
    }

    const payload = {
      [VISIT_TABLE_FIELDS.BODY_CONDITION]: usedPensPayload,
    };

    return payload;
  } catch (error) {
    console.log('error extractUsedPensFromBCSTool', error);
    return null;
  }
};

export function deletePenDataInsideBCSTool(bcsData, pen) {
  try {
    const parsedBCSData = getParsedToolData(bcsData);

    if (parsedBCSData) {
      const filteredPens = [];

      parsedBCSData?.pens?.map(item => {
        if (stringIsEmpty(item?.penId) && item?.localPenId !== pen) {
          filteredPens.push(item);
        } else if (stringIsEmpty(item?.localPenId) && item?.penId !== pen) {
          filteredPens.push(item);
        }
      });

      parsedBCSData.pens = filteredPens;

      if (parsedBCSData.pens?.length <= 0) {
        return null;
      }
    }

    return parsedBCSData;
  } catch (error) {
    logEvent('helpers -> bcsHelper -> deletePenDataInsideBCSTool error', error);
    return bcsData;
  }
}

export const getTotalCowsCountBCS = penAnalysis => {
  let totalCowsCount = 0;
  try {
    if (penAnalysis) {
      let newBodyConditionScoresArray = [...penAnalysis?.bodyConditionScores];
      newBodyConditionScoresArray.forEach(element => {
        let _categoryCount = element?.animalsObserved;
        totalCowsCount += _categoryCount;
      });
    }
    return totalCowsCount;
  } catch (e) {
    console.log('getTotalCowsCountBCS fail', e);
    logEvent('getTotalCowsCountBCS fail', e);
    return totalCowsCount;
  }
};

export const extractBCSPens = (penList, bcsData) => {
  try {
    if (bcsData) {
      const extractedPens = [];

      const parsedBodyConditionData = getParsedToolData(bcsData);
      parsedBodyConditionData?.pens?.map(pen => {
        const isPenExist = penList.find(item => item?.sv_id === pen?.penId);
        if (!isPenExist) {
          extractedPens.push({
            ...isPenExist,
            ...pen,
            // penId: pen?.localPenId,
          });
        } else {
          extractedPens.push(pen);
        }
      });

      return extractedPens;
    }
    return [];
  } catch (error) {
    logEvent('helpers -> bcsHelper -> extractBCSPens error', error);
    return [];
  }
};
