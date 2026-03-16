import {
  ALL,
  DATE_FORMATS,
  TOOL_ANIMAL_ANALYSIS,
  TOOL_TYPES,
} from '../../constants/AppConstants';
import { getFormattedDate } from '../dateHelper';
import {
  getParsedToolData,
  convertInputNumbersToRegionalBasis,
} from '../genericHelper';
import { getEarTagById, getPenNameFromPenId } from '../toolHelper';

import i18n from '../../localization/i18n';
import {
  sortRecentVisits,
  findFromSitePensById,
  getRecentVisitToolData,
  createDynamicObjForReqBody,
} from './visitReportHelper';

export const getAnimalAnalysisFromRecentVisitsForTool = (
  recentVisits = [],
  animal,
) => {
  const data = recentVisits?.map(visitObj => {
    const visitAnimals = visitObj?.toolAnimalAnalysis
      ? getParsedToolData(visitObj?.toolAnimalAnalysis)?.animals || []
      : [];

    if (visitAnimals.length > 0 && animal) {
      let filteredAnimalArray = [];
      visitAnimals.forEach(visitAnimal => {
        let filteredAnimal = visitAnimal.animalDetails.filter(
          penAnimal =>
            penAnimal.earTagId === animal?.earTagId ||
            penAnimal.localEarTagId === animal?.earTagId,
        );
        if (filteredAnimal && filteredAnimal.length > 0) {
          return filteredAnimalArray.push({
            animal: filteredAnimal[0],
            visitId: visitObj.id,
            date: visitObj.visitDate,
            penName: visitAnimal?.penName,
          });
        }
      });

      if (filteredAnimalArray && filteredAnimalArray.length > 0) {
        return filteredAnimalArray[0];
      }
      return { visitId: visitObj.id, date: visitObj.visitDate };
    }
    return { visitId: visitObj.id, date: visitObj.visitDate };
  });

  return data;
};

export const getAnimalAnalysisTableData = (animalAnalysis = [], pens) => {
  const tableHeader = [];
  let tableData = [
    [i18n.t('pen')],
    [i18n.t('BCS')],
    [i18n.t('locomotion')],
    [i18n.t('DIM')],
  ];

  animalAnalysis.map(visitObj => {
    if (visitObj?.animal) {
      tableHeader.push(getFormattedDate(visitObj.date, DATE_FORMATS.MM_dd_YY));
      tableData[0].push(
        getPenNameFromPenId(
          pens,
          visitObj.animal.penId || visitObj.animal.localPenId,
        ) ||
          visitObj?.penName ||
          visitObj.animal?.penName,
      ) || '-';
      tableData[1].push(visitObj.animal.bcsCategory || '-');
      tableData[2].push(visitObj.animal.locomotionScore || '-');
      tableData[3].push(
        convertInputNumbersToRegionalBasis(
          visitObj.animal.daysInMilk,
          2,
          true,
        ) || '-',
      );
    }
  });

  return { tableHeader, tableData };
};

export const getAnimalAnalysisBody = (
  tool,
  visitDetails,
  sitePens,
  earTags,
) => {
  const parsedAnimalAnalysis = getParsedToolData(visitDetails?.animalAnalysis);
  return handleAnimalAnalysisSelection({
    sitePens,
    tool,
    animalAnalysis: parsedAnimalAnalysis,
    earTags,
  });
};

export const handleAnimalAnalysisSelection = ({
  sitePens,
  tool,
  animalAnalysis,
  earTags,
}) => {
  let data = [];
  const selectedAnimals = filterAnimalsBySelectedIds(
    tool,
    animalAnalysis.animals,
  );

  let toolId = tool.basicInfo.toolId;
  selectedAnimals?.forEach(animal => {
    const earTagName = getEarTagById(animal, earTags) || '';
    const pen = findFromSitePensById(sitePens, animal);

    if (
      (toolId == TOOL_TYPES.LOCOMOTION_SCORE && animal?.locomotionScore) ||
      (toolId == TOOL_TYPES.BODY_CONDITION && animal?.bcsCategory)
    ) {
      const penName = animalAnalysis?.animals?.find(
        item =>
          item?.penId === animal?.penId ||
          item?.localPenId === animal?.localPenId,
      )?.penName;

      data.push({
        earTagName: earTagName,
        animalDetails: [
          createDynamicObjForReqBody(i18n.t('earTag'), earTagName),
          createDynamicObjForReqBody(i18n.t('pen'), penName || pen?.name || ''),
          createDynamicObjForReqBody(i18n.t('BCS'), animal?.bcsCategory || ''),
          createDynamicObjForReqBody(
            i18n.t('locomotion'),
            animal?.locomotionScore || '',
          ),
          createDynamicObjForReqBody(i18n.t('DIM'), animal?.daysInMilk || ''),
        ],
        earTagId: animal.earTagId || animal.localEarTagId,
      });
    }
  });
  return data;
};

export const filterAnimalsBySelectedIds = (tool, toolAnimals = []) => {
  if (
    tool?.selectedAnimals?.length === 1 &&
    tool?.selectedAnimals?.[0] === ALL &&
    toolAnimals?.length > 0
  ) {
    const animalsList = getAnimalsList(toolAnimals, tool, true);
    return animalsList;
  } else if (toolAnimals && toolAnimals?.length > 0) {
    const animalsList = getAnimalsList(toolAnimals, tool);
    return animalsList;
  }
  return [];
};

const getAnimalsList = (toolAnimals = [], tool, shouldFetchAll = false) => {
  const animalsList = toolAnimals.reduce((result, animal) => {
    if (animal?.animalDetails && animal.animalDetails?.length > 0) {
      animal.animalDetails.forEach(singleAnimal => {
        if (
          shouldFetchAll ||
          tool?.selectedAnimals?.includes(
            singleAnimal?.earTagId || singleAnimal?.localEarTagId,
          )
        ) {
          result.push(singleAnimal);
        }
      });
    }
    return result;
  }, []);
  return animalsList;
};

const getGraphsDataForAnimalAnalysis = (recentVisits = [], animal, penName) => {
  if (recentVisits && recentVisits.length > 0) {
    const sortedRecentVisits = sortRecentVisits(recentVisits);
    const data = sortedRecentVisits.reduce((result, visit) => {
      const parsedAnimalAnalysis = getRecentVisitToolData(
        visit,
        TOOL_ANIMAL_ANALYSIS,
      );
      const tool = {
        selectedAnimals: [animal?.earTagId || animal?.localEarTagId],
      };
      const selectedAnimals = filterAnimalsBySelectedIds(
        tool,
        parsedAnimalAnalysis.animals,
      );
      selectedAnimals.forEach(resultAnimal => {
        result.push({
          visitDate: getFormattedDate(visit?.visitDate, DATE_FORMATS.MM_dd),
          penName: penName || '',
          dim: +resultAnimal.daysInMilk || 0,
          bcs: +resultAnimal.bcsCategory || 0,
          locomotionScore: +resultAnimal.locomotionScore || 0,
        });
      });
      return result;
    }, []);

    return data;
  }

  return [];
};

const getBodyForAnimalAnalysisGraph = (tool, selectedAnimal, penName) => {
  const recentVisits = tool.recentVisits || [];
  const result = getGraphsDataForAnimalAnalysis(
    recentVisits,
    selectedAnimal,
    penName,
  );
  return result;
};
