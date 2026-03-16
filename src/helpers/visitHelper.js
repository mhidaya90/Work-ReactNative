import React from 'react';
import {
  ANIMALS,
  ANIMAL_ANALYSIS_STR,
  DATE_FORMATS,
  MANURE_SCREENER_TOOL_ID,
  PROFITABILITY_ANALYSIS_TOOL_ID,
  PUBLISHED_VISIT_DAYS_LIMIT,
  RUMEN_FILL_TOOL_ID,
  TOOL_CATEGORIES,
  TOOL_TYPES,
  VISIT_STATUS,
  VISIT_TABLE_FIELDS,
} from '../constants/AppConstants';
import {
  CALF_HEIFER_ICON,
  COMFORT_ICON,
  HEALTH_ICON,
  NUTRITION_ICON,
  PRODUCTIVITY_ICON,
} from '../constants/AssetSVGConstants';
import {
  MUNARE_SCREENING_FIELDS,
  RUMEN_HEALTH_TMR_PARTICLE_SCORE,
  VISIT_FIELDS,
  VISIT_TYPES,
} from '../constants/FormConstants';
import { normalize } from '../constants/theme/variables/customFont';
import colors from '../constants/theme/variables/customColor';
import { CUD_CHEWING_TYPES } from '../constants/toolsConstants/RumenHealthCudChewingConstants';
import { setActiveCategoryToolRequest } from '../store/actions/tool';
import {
  resetSaveActivePenRequest,
  resetSaveActiveScreenRequest,
  saveActivePenRequest,
} from '../store/actions/toolSwitching';
import { stringIsEmpty } from './alphaNumericHelper';
import {
  getBCSScale,
  getCurrencyKey,
  getUnitOfMeasure,
} from './appSettingsHelper';
import { dateHelper, getFormattedDate } from './dateHelper';
import { logEvent } from './logHelper';
import { getAllAnimalAnalysisData } from './toolHelper';
import { getParsedToolData } from './genericHelper';
import { deletePenDataInsideCudChewingTool } from './cudChewingHelper';
import { deletePenDataInsideLocomotionTool } from './locomotionHelper';
import { deletePenDataInsideBCSTool } from './bcsHelper';
import { deletePenDataInsideAnimalAnalysisTool } from './animalHelper';
import { deletePenDataInsideManureScoreTool } from './manureScoreHelper';
import { deletePenDataInsideRumenFillTool } from './rumenFillHelper';
import { deletePenDataInsidePenTimeBudgetTool } from './penTimeBudgetHelper';
import { deletePenDataInsideManureScreenerTool } from './manureScreenerHelper';
import { deletePenDataInsideTmrParticleScoreTool } from './tmrParticleScoreHelper';

export const getDefaultFormValues = () => {
  return {
    [VISIT_FIELDS.CUSTOMER_PROSPECT]: '',
    [VISIT_FIELDS.SITE]: '',
    [VISIT_FIELDS.VISIT_NAME]: '',
  };
};

export const createInitialVisitFormValues = (accountId, siteId, visitName) => {
  return {
    [VISIT_FIELDS.CUSTOMER_PROSPECT]: accountId,
    [VISIT_FIELDS.SITE]: siteId,
    [VISIT_FIELDS.VISIT_NAME]: visitName,
  };
};

export const createAddVisitObject = (
  values,
  customersProspectsList,
  sitesList,
  isEditable,
  userData,
  currentAuthUser,
) => {
  const date = new Date();
  const formattedDate = getFormattedDate(
    date.toString(),
    DATE_FORMATS.MM_dd_YYYY,
  );
  const data = {
    visitName: values[VISIT_FIELDS.VISIT_NAME],
    visitDate: formattedDate,
  };
  if (customersProspectsList.length > 0) {
    const filteredList = customersProspectsList.filter(
      item => item.id === values[VISIT_FIELDS.CUSTOMER_PROSPECT],
    );
    if (filteredList && filteredList.length > 0) {
      const obj = filteredList[0];
      if (obj.sv_id) {
        data.customerId = obj.sv_id;
      } else {
        data.localCustomerId = obj.id;
      }
    }
  }
  if (sitesList.length > 0) {
    const filteredList = sitesList.filter(
      item => item.id === values[VISIT_FIELDS.SITE],
    );
    if (filteredList && filteredList.length > 0) {
      const obj = filteredList[0];
      if (obj.sv_id) {
        data.siteId = obj.sv_id;
      } else {
        data.localSiteId = obj.id;
      }
      const siteKeys = obj.keys;
      if (typeof siteKeys === 'string' && !stringIsEmpty(siteKeys)) {
        const keysObj = JSON.parse(siteKeys);
        if (
          keysObj.selectedPointScale &&
          !stringIsEmpty(keysObj.selectedPointScale)
        ) {
          data.selectedPointScale = keysObj.selectedPointScale;
        } else {
          data.selectedPointScale = getBCSScale(userData);
        }
      } else {
        data.selectedPointScale = getBCSScale(userData);
      }
    }
  }
  data.animalAnalysis = null;
  data.bodyCondition = null;
  data.updated_at = dateHelper.getUnixTimestamp(new Date());
  data.visitDate = dateHelper.getUnixTimestamp(new Date());
  data.isEditable = isEditable;
  data.updated = true;
  data.visitStatus = VISIT_STATUS.IN_PROGRESS;
  data.mobileLastUpdatedTime = dateHelper.getUnixTimestamp(new Date());
  data.accessIdentifier = currentAuthUser?.email || null;
  data.deleted = false;
  /**
   * @description
   * added create_user key with userId
   * should not update on update visit
   */
  data.createUser = userData?.userId || null;
  const currency = getCurrencyKey(userData);
  if (currency) {
    data.selectedCurrency = currency;
  }
  const unitOfMeasure = getUnitOfMeasure(userData);
  if (unitOfMeasure) {
    data.unitOfMeasure = unitOfMeasure;
  }
  return data;
};

export const editableVisit = (visitDate, visitStatus, currentDate) => {
  let isToolEditable = false;
  if (visitStatus == VISIT_STATUS.PUBLISHED) {
    return isToolEditable;
  }
  let diffDays = dateHelper.getDifferenceBetweenDates(
    visitDate,
    dateHelper.getUnixTimestamp(
      new Date(!currentDate ? new Date() : currentDate),
    ),
  );
  if (diffDays < PUBLISHED_VISIT_DAYS_LIMIT) {
    isToolEditable = true;
  }
  return isToolEditable;
};

export const VisitStatusLabel = (visitDate, visitStatus) => {
  let visitStatusLabel = '';
  if (visitStatus != VISIT_STATUS.PUBLISHED) {
    let isToolEditable = editableVisit(visitDate);
    if (!isToolEditable) {
      visitStatusLabel = VISIT_STATUS.PUBLISHED;
    }
  } else {
    visitStatusLabel = visitStatus;
  }
  return visitStatusLabel;
};

export const getParameterCaseInsensitive = (object, key) => {
  const asLowercase = key.toLowerCase();
  const answer =
    object[Object.keys(object).find(k => k.toLowerCase() === asLowercase)];
  return answer ? answer : getAnimalAnalysisProgress(object, key);
};

export const getAnimalAnalysisProgress = (data, toolId) => {
  if (
    toolId === TOOL_TYPES.BODY_CONDITION ||
    toolId === TOOL_TYPES.LOCOMOTION_SCORE
  ) {
    if (!stringIsEmpty(data.animalAnalysis)) {
      const allData = getAllAnimalAnalysisData(data.animalAnalysis);
      for (const allDataObj of allData) {
        for (const animal of allDataObj.animalDetails) {
          if (
            !stringIsEmpty(animal.bcsCategory) &&
            toolId === TOOL_TYPES.BODY_CONDITION
          ) {
            return true;
          } else if (
            !stringIsEmpty(animal.locomotionScore) &&
            toolId === TOOL_TYPES.LOCOMOTION_SCORE
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const isToolInProgress = (data, toolId) => {
  return data
    ? !stringIsEmpty(getParameterCaseInsensitive(data, toolId))
    : false;
};

export const inProgressToolCount = data => {
  let count = 0;

  Object.values(TOOL_TYPES).forEach(tool => {
    if (isToolInProgress(data, tool)) {
      count++;
    }
  });

  return count;
};

export const getEnabledDisabledCategoriesCategoryByTools = tools => {
  let enabledDisabledCategories = [];

  Object.values(TOOL_CATEGORIES).map(c => {
    let category = {
      name: c,
      enabled: true,
    };
    //TODO: need to work on this if category is disabled
    // if (tools.findIndex(tool => tool.toolGroupId == c) != -1) {
    //   category.enabled = true;
    // }
    enabledDisabledCategories.push(category);
  });
  return enabledDisabledCategories;
};

export const getMappedToolModifiedDate = (data, visit) => {
  try {
    data = data.map(i => {
      let animalAnalysisLastUpdatedTime = null;
      if (
        i.toolId === TOOL_TYPES.BODY_CONDITION ||
        i.toolId === TOOL_TYPES.LOCOMOTION_SCORE
      ) {
        let animalAnalysis = getParameterCaseInsensitive(
          visit,
          ANIMAL_ANALYSIS_STR,
        );
        if (animalAnalysis) {
          if (typeof animalAnalysis !== 'object') {
            animalAnalysis = JSON.parse(animalAnalysis);
          }
          animalAnalysisLastUpdatedTime = animalAnalysis?.mobileLastUpdatedTime;
        }
      }
      let tool = getParameterCaseInsensitive(visit, i.toolId);
      // variable 'tool' occasionally comes as string
      if (typeof tool === 'string') {
        tool = JSON.parse(tool);
      }
      let lastUpdatedTime = null;
      if (!stringIsEmpty(tool) && tool.mobileLastUpdatedTime) {
        lastUpdatedTime = tool.mobileLastUpdatedTime;
      }
      if (animalAnalysisLastUpdatedTime) {
        if (lastUpdatedTime) {
          lastUpdatedTime =
            lastUpdatedTime > animalAnalysisLastUpdatedTime
              ? lastUpdatedTime
              : animalAnalysisLastUpdatedTime;
        } else {
          lastUpdatedTime = animalAnalysisLastUpdatedTime;
        }
      }
      if (lastUpdatedTime) {
        i.subtitle = getFormattedDate(
          lastUpdatedTime,
          DATE_FORMATS.MMM_DD_l_YY_H_MM,
        );
      } else {
        i.subtitle = '';
      }

      return i;
    });

    return data;
  } catch (e) {
    logEvent('helpers -> visitHelper -> getMappedToolModifiedDate fail', e);
    console.log('getMappedToolModifiedDate fail', e);
  }
};

//#region TOOL SWITCHING

//saves selected pen from a tool in reducer
export const saveSelectedPenInReducer = (actionDispatcher, pen, toolName) => {
  actionDispatcher(resetSaveActivePenRequest());
  actionDispatcher(saveActivePenRequest(pen));
};

//extracts same pen from pensList which was selected in previous tool on tool change
export const pickPenInReducerFromPensList = (
  pensList,
  healthCurrentActivePen,
  setSelectedPen,
  toolName,
  hasNoSetState = false,
) => {
  if (healthCurrentActivePen && pensList?.length > 0) {
    const singlePen = pensList?.filter(
      pen =>
        (!stringIsEmpty(pen?.id) &&
          !stringIsEmpty(healthCurrentActivePen?.id) &&
          pen?.id === healthCurrentActivePen?.id) ||
        (!stringIsEmpty(pen?.id) &&
          !stringIsEmpty(healthCurrentActivePen?.sv_id) &&
          pen?.id === healthCurrentActivePen?.sv_id) ||
        (!stringIsEmpty(pen?.localId) &&
          !stringIsEmpty(healthCurrentActivePen?.id) &&
          pen?.localId === healthCurrentActivePen?.id) ||
        (!stringIsEmpty(pen?.id) &&
          !stringIsEmpty(healthCurrentActivePen?.localId) &&
          pen?.id === healthCurrentActivePen?.localId) ||
        (!stringIsEmpty(pen?.localId) &&
          !stringIsEmpty(healthCurrentActivePen?.localId) &&
          pen?.localId === healthCurrentActivePen?.localId),
    );

    if (singlePen && singlePen.length > 0) {
      if (hasNoSetState) {
        return singlePen[0];
      }
      setSelectedPen(singlePen[0]);
    } else {
      setSelectedPen(pensList[0]);
    }
  }
};

//sets tool screen (animal / pen / herd analysis) from the previous tool to the new tool upon switch
export const healthToolScreenAutoSelect = (
  actionDispatcher,
  healthCurrentActiveScreen,
  currentStep,
  setCurrentStep,
  toolAnalysisType = null,
) => {
  if (healthCurrentActiveScreen?.toolType !== toolAnalysisType) {
    actionDispatcher(setActiveCategoryToolRequest(healthCurrentActiveScreen));
    setCurrentStep(currentStep + 1);
  } else {
    actionDispatcher(resetSaveActiveScreenRequest());
  }
};

//prepares sql where clause when visit history filter is applied
export const prepareWhereClauseForFilter = (
  model,
  queryForVisitWithLocalStatusChanged = false,
  extraWhereClause = '',
  currentAuthUser,
) => {
  let publishVisitDate = dateHelper
    .getDateNDaysOlder(PUBLISHED_VISIT_DAYS_LIMIT)
    .getTime();

  let searchQueries = [];

  currentAuthUser &&
    searchQueries.push(`v.accessIdentifier = '${currentAuthUser?.email}' `);

  let customerIdsArray = [];
  let siteIdsArray = [];

  let faCustomerId = ''; //fa = filterAccounts
  let faLocalCustomerId = '';
  let fsSvId = ''; //fs = filterSites
  let fslocalSiteId = '';
  for (const key in model) {
    if (key == 'search' && model[key].length > 0) {
      searchQueries.push(`visitName like '%${model.search}%'`);
    }

    if (
      key == 'startDate' &&
      !stringIsEmpty(model[key]) &&
      !stringIsEmpty(model['endDate'])
    ) {
      const startDate = dateHelper.getUnixTimestamp(
        new Date(model['startDate']),
      );
      const endDate = dateHelper.getUnixTimestamp(new Date(model['endDate']));
      searchQueries.push(
        `(v.visitDate > ${startDate} AND v.visitDate < ${endDate})`,
      );
    }

    if (key == 'filterAccounts' && model[key].length > 0) {
      let keyOne = []; //model[key][0].localAccountId;
      keyOne = model[key].map(obj => {
        return {
          localAccountId: obj.localAccountId,
          accountId: obj.accountId,
        };
      });

      if (keyOne.length > 0) {
        faLocalCustomerId = 'v.localCustomerId IN (';
        keyOne.forEach((obj, index) => {
          obj?.accountId !== '' && customerIdsArray.push(obj.accountId);
          faLocalCustomerId += `'${obj.localAccountId}'`;
          faLocalCustomerId += index < keyOne.length - 1 ? ', ' : ')';
        });
      }
    }

    if (key == 'filterSites' && model[key].length > 0) {
      let keyOne = []; //model[key][0].localAccountId;
      keyOne = model[key].map(obj => {
        return {
          localSiteId: obj.localSiteId,
          siteId: obj.siteId,
        };
      });

      if (keyOne.length > 0) {
        fslocalSiteId = 'v.localSiteId IN (';
        keyOne.forEach((obj, index) => {
          obj?.siteId !== '' && siteIdsArray.push(obj.siteId);
          fslocalSiteId += `'${obj.localSiteId}'`;
          fslocalSiteId += index < keyOne.length - 1 ? ', ' : ')';
        });
      }
    }

    if (customerIdsArray.length > 0) {
      faCustomerId = 'v.customerId IN (';
      customerIdsArray.forEach((customerId, index) => {
        faCustomerId += `'${customerId}'`;
        faCustomerId += index < customerIdsArray.length - 1 ? ', ' : ')';
      });
    }

    if (siteIdsArray.length > 0) {
      fsSvId = 'v.siteId IN (';
      siteIdsArray.forEach((siteId, index) => {
        fsSvId += `'${siteId}'`;
        fsSvId += index < siteIdsArray.length - 1 ? ', ' : ')';
      });
    }

    //if preparing query to get those visits which were synced and updated later after sync
    if (queryForVisitWithLocalStatusChanged) {
      if (key == 'visitType' && model[key].length > 0) {
        if (model[key].length == 2) {
          searchQueries.push(
            `(v.visitStatus == '${model[key][0]}' OR v.visitStatus == '${model[key][1]}')`,
          );
        } else if (model[key].length == 1) {
          if (model[key][0] === VISIT_TYPES.PUBLISHED) {
            searchQueries.push(`(v.visitStatus == '${model[key][0]}')`);
          } else {
            searchQueries.push(
              `(v.visitStatus == '${model[key][0]}' AND v.visitDate > ${publishVisitDate})`, //get only those in-progress visits that are within the last 5 days
            );
          }
        }
      }
    } else {
      if (key == 'visitType' && model[key].length > 0) {
        if (model[key].length == 2) {
          searchQueries.push(
            `(v.visitStatus == '${model[key][0]}' OR v.visitStatus == '${model[key][1]}')`,
          );
        } else if (model[key].length == 1) {
          searchQueries.push(`(v.visitStatus == '${model[key][0]}')`);
        }
      }
    }

    if (key == 'filterTools' && model[key].length > 0) {
      let keyOne = []; //model[key][0].localAccountId;
      keyOne = model[key].map(obj => obj.toolId);
      keyOne.forEach(toolId => {
        searchQueries.push(`${toolId} != ''`);
      });
    }
  }

  if (faCustomerId !== '' || faLocalCustomerId !== '') {
    if (faCustomerId === '') {
      searchQueries.push(faLocalCustomerId);
    } else if (faLocalCustomerId === '') {
      searchQueries.push(faCustomerId);
    } else {
      searchQueries.push(`(${faCustomerId} OR ${faLocalCustomerId})`);
    }
  }

  if (fsSvId !== '' || fslocalSiteId !== '') {
    if (fsSvId === '') {
      searchQueries.push(fslocalSiteId);
    } else if (fslocalSiteId === '') {
      searchQueries.push(fsSvId);
    } else {
      searchQueries.push(`(${fsSvId} OR ${fslocalSiteId})`);
    }
  }

  let whereClause = '';
  if (searchQueries.length > 0) {
    searchQueries?.forEach((element, index) => {
      whereClause +=
        element + (searchQueries.length - 1 != index ? ' and ' : '  ');
    });
  }

  if (extraWhereClause !== '') {
    whereClause += extraWhereClause;
  }
  return whereClause;
};

export const getParamsForVisitHistoryFilter = (
  lastSyncTime,
  filters,
  filteredToolsArray,
) => {
  try {
    return {
      lastSyncTime,
      page: filters.page - 1,
      filters: {
        visitStatus: filters.visitType,
        from:
          filters.startDate == ''
            ? ''
            : dateHelper.convertToUtcTimezone(filters.startDate),
        to:
          filters.endDate == ''
            ? ''
            : dateHelper.convertToUtcTimezone(filters.endDate),
        customerId: filters.filterAccounts.map(
          element => element.accountId || 'Not set',
        ),
        siteId: filters.filterSites.map(element => element.siteId),
        // tools: filters.filterTools.map(element => element.toolId),
        tools: filteredToolsArray,
      },
    };
  } catch (e) {
    logEvent('getParamsForVisitHistoryFilter fail', e);
  }
};

export const getToolNameAsPerServer = (filteredTools = []) => {
  try {
    return filteredTools?.map(id => {
      if (id === TOOL_TYPES.MANURE_SCREENER) {
        return MANURE_SCREENER_TOOL_ID;
      } else if (id === TOOL_TYPES.RUMEN_FILL) {
        return RUMEN_FILL_TOOL_ID;
      } else if (id === TOOL_TYPES.PROFITABILITY_ANALYSIS) {
        return PROFITABILITY_ANALYSIS_TOOL_ID;
      }
      return id;
    });
  } catch (e) {
    logEvent('getToolNameAsPerServer fail', e);
  }
};

//filters recent visits based on if they contain the same pen data that we have chosen on the graphs' screen
export const refactorRecentVisitList = (
  recentVisits, //recent visits - array
  tool, //tool name - string
  selectedPen, //currently selected pen info - object
  selectedVisit, //currently selected visit info - object
  chewType = null, //cud chewing type for cud chewing tool only - string
) => {
  let newList = [];
  if (recentVisits && recentVisits?.length > 0) {
    newList = recentVisits.filter(item => {
      let element = item;
      let penExistsInVisit = false;
      //if iterating over same object as current visit then no need to check for pens
      if (
        (!stringIsEmpty(element?.sv_id) &&
          !stringIsEmpty(selectedVisit?.sv_id) &&
          element?.sv_id === selectedVisit?.sv_id) ||
        (!stringIsEmpty(element?.id) &&
          !stringIsEmpty(selectedVisit?.id) &&
          element?.id === selectedVisit?.id)
      ) {
        penExistsInVisit = true;
      } else {
        //else if iterating over object other than current visit
        if (element?.[tool]) {
          let toolData = element[tool];
          if (typeof toolData === 'string') {
            toolData = JSON.parse(toolData);
          }
          let key = 'pens';
          if (tool === VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS) {
            key = ANIMALS;
          } else if (tool === VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL) {
            key = MUNARE_SCREENING_FIELDS.MST_SCORES;
          } else if (tool === VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE) {
            key = RUMEN_HEALTH_TMR_PARTICLE_SCORE.TMR_SCORES;
          }
          //checking if the recent visit item object has the same pen that we are on when comparing graphs
          if (toolData?.[key] && toolData?.[key]?.length > 0) {
            toolData?.[key]?.forEach(penObj => {
              if (
                (!stringIsEmpty(penObj?.penId) &&
                  !stringIsEmpty(selectedPen?.sv_id) &&
                  penObj?.penId === selectedPen?.sv_id) ||
                (!stringIsEmpty(penObj?.penId) &&
                  !stringIsEmpty(selectedPen?.id) &&
                  penObj?.penId === selectedPen?.id) ||
                (!stringIsEmpty(penObj?.penId) &&
                  !stringIsEmpty(selectedPen?.localId) &&
                  penObj?.penId === selectedPen?.localId) ||
                (!stringIsEmpty(penObj?.localPenId) &&
                  !stringIsEmpty(selectedPen?.id) &&
                  penObj?.localPenId === selectedPen?.id) ||
                (!stringIsEmpty(penObj?.localPenId) &&
                  !stringIsEmpty(selectedPen?.sv_id) &&
                  penObj?.localPenId === selectedPen?.sv_id) ||
                (!stringIsEmpty(penObj?.penId) &&
                  !stringIsEmpty(selectedPen?.selectedPenId) &&
                  penObj?.penId === selectedPen?.selectedPenId) ||
                (!stringIsEmpty(penObj?.localPenId) &&
                  !stringIsEmpty(selectedPen?.selectedPenId) &&
                  penObj?.localPenId === selectedPen?.selectedPenId)
              ) {
                //if tool is cud chewing, further check if total chew count is >= 10
                if (tool === VISIT_TABLE_FIELDS.RUMEN_HEALTH) {
                  if (
                    chewType &&
                    chewType === CUD_CHEWING_TYPES.CUD_CHEWING &&
                    penObj?.cudChewingCowsCount?.totalCount >= 10
                  ) {
                    penExistsInVisit = true;
                    return;
                  } else if (
                    chewType &&
                    chewType === CUD_CHEWING_TYPES.NUMBER_OF_CHEWS
                  ) {
                    let chewsCountSum = 0;
                    penObj?.cudChewsCount?.map(
                      item => (chewsCountSum += item?.chewsCount),
                    );
                    if (chewsCountSum > 0) {
                      penExistsInVisit = true;
                      return;
                    }
                  }
                } else {
                  penExistsInVisit = true;
                }
                return;
              }
            });
          }
        }
      }

      if (penExistsInVisit) {
        return true;
      } else {
        return false;
      }
    });
  }
  return newList;
};

//#end region

export const getToolCategoryIcon = (toolCategory = '', disabled = false) => {
  switch (toolCategory) {
    case TOOL_CATEGORIES.CALF_HEIFER:
      return <CALF_HEIFER_ICON width={normalize(26)} height={normalize(20)} />;
    case TOOL_CATEGORIES.COMFORT:
      return (
        <COMFORT_ICON
          stroke={disabled ? colors.grey19 : ''}
          fill={disabled ? colors.grey19 : ''}
          width={normalize(15)}
          height={normalize(15)}
        />
      );
    case TOOL_CATEGORIES.HEALTH:
      return (
        <HEALTH_ICON
          stroke={disabled ? colors.grey19 : colors.productivityColor}
          fill={disabled ? colors.grey19 : colors.productivityColor}
          width={normalize(15)}
          height={normalize(15)}
        />
      );
    case TOOL_CATEGORIES.NUTRITION:
      return (
        <NUTRITION_ICON
          stroke={disabled ? colors.grey19 : colors.nutritionColor}
          fill={disabled ? colors.grey19 : ''}
          fillWidth={1}
          width={normalize(15)}
          height={normalize(15)}
        />
      );
    case TOOL_CATEGORIES.PRODUCTIVITY:
      return (
        <PRODUCTIVITY_ICON
          stroke={disabled ? colors.grey19 : ''}
          fill={disabled ? colors.grey19 : colors.productivityColor}
          width={normalize(15)}
          height={normalize(15)}
        />
      );
  }
};

/**
 * @description
 * extra mapper model for mapping profitability tool data to direct apply all values
 *
 * @param {Object} profitabilityAnalysisTool
 * @returns
 */
export const profitabilityToolModelAfterSyncForOfflineData =
  profitabilityAnalysisTool => {
    const payload = {
      ...profitabilityAnalysisTool?.animalInput,
      ...profitabilityAnalysisTool?.milkInformation,
      ...profitabilityAnalysisTool?.feedingInformation,

      mobileLastUpdatedTime: profitabilityAnalysisTool?.mobileLastUpdatedTime,
    };

    return payload;
  };

export const getSiteAndAccountIdFromVisit = visit => {
  const siteId =
    (!stringIsEmpty(visit?.siteId) ? visit.siteId : visit.localSiteId) || '';

  const accountId =
    (!stringIsEmpty(visit?.customerId)
      ? visit.customerId
      : visit.localCustomerId) || '';

  return {
    siteId,
    accountId,
  };
};

/**
 * @description
 * using this function to add migrated data inside visit.
 * what it's doing is checking @param {Object} visit contains tools @type {Object} which is not empty and is using, e.x have data
 * then find the penId inside that tool and extract it to separate @type {Object} with it's tool name and only penId inside array.
 *
 * @param {Object} visit
 * @returns {Object}
 */
export async function getUsedPensFromVisitTools(visit) {
  try {
    const usedPensPayload = {};

    // rumen health cud chewing tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.RUMEN_HEALTH])) {
      const parsedRumenHealth = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.RUMEN_HEALTH],
      );

      if (parsedRumenHealth?.pens && parsedRumenHealth?.pens?.length > 0) {
        usedPensPayload[VISIT_TABLE_FIELDS.RUMEN_HEALTH] = [];

        parsedRumenHealth?.pens?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.RUMEN_HEALTH].push(pen?.penId);
        });
      }
    }

    // locomotion score tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.LOCOMOTION_SCORE])) {
      const parsedLocomotionScore = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.LOCOMOTION_SCORE],
      );

      if (
        parsedLocomotionScore?.pens &&
        parsedLocomotionScore?.pens?.length > 0
      ) {
        usedPensPayload[VISIT_TABLE_FIELDS.LOCOMOTION_SCORE] = [];

        parsedLocomotionScore?.pens?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.LOCOMOTION_SCORE].push(pen?.penId);
        });
      }
    }

    // body condition score tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.BODY_CONDITION])) {
      const parsedBodyConditionScore = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.BODY_CONDITION],
      );

      if (
        parsedBodyConditionScore?.pens &&
        parsedBodyConditionScore?.pens?.length > 0
      ) {
        usedPensPayload[VISIT_TABLE_FIELDS.BODY_CONDITION] = [];

        parsedBodyConditionScore?.pens?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.BODY_CONDITION].push(
            pen?.penId || pen?.localPenId,
          );
        });
      }
    }

    // rumen health manure score tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.RUMEN_HEALTH_MANURE_SCORE])) {
      const parsedManureScore = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.RUMEN_HEALTH_MANURE_SCORE],
      );

      if (parsedManureScore?.pens && parsedManureScore?.pens?.length > 0) {
        usedPensPayload[VISIT_TABLE_FIELDS.RUMEN_HEALTH_MANURE_SCORE] = [];

        parsedManureScore?.pens?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.RUMEN_HEALTH_MANURE_SCORE].push(
            pen?.penId,
          );
        });
      }
    }

    // rumen fill manure score tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE])) {
      const parsedRumenFill = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE],
      );

      if (parsedRumenFill?.pens && parsedRumenFill?.pens?.length > 0) {
        usedPensPayload[VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE] = [];

        parsedRumenFill?.pens?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE].push(
            pen?.penId,
          );
        });
      }
    }

    // rumen health manure screening tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL])) {
      const parsedManureScreening = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL],
      );

      if (
        parsedManureScreening?.mstScores &&
        parsedManureScreening?.mstScores?.length > 0
      ) {
        usedPensPayload[VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL] = [];

        parsedManureScreening?.mstScores?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL].push(
            pen?.penId,
          );
        });
      }
    }

    // pen time budget tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL])) {
      const parsedPenTimeBudget = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL],
      );

      if (parsedPenTimeBudget?.pens && parsedPenTimeBudget?.pens?.length > 0) {
        usedPensPayload[VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL] = [];

        parsedPenTimeBudget?.pens?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL].push(
            pen?.penId,
          );
        });
      }
    }

    // tmr particle score tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE])) {
      const parsedTmrParticleScore = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE],
      );

      if (
        parsedTmrParticleScore?.tmrScores &&
        parsedTmrParticleScore?.tmrScores?.length > 0
      ) {
        usedPensPayload[VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE] = [];

        parsedTmrParticleScore?.tmrScores?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE].push(
            pen?.penId,
          );
        });
      }
    }

    // animal analysis tool penId extraction
    if (!stringIsEmpty(visit?.[VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS])) {
      const parsedAnimalAnalysis = getParsedToolData(
        visit?.[VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS],
      );

      if (
        parsedAnimalAnalysis?.animals &&
        parsedAnimalAnalysis?.animals?.length > 0
      ) {
        usedPensPayload[VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS] = [];

        parsedAnimalAnalysis?.animals?.map(pen => {
          usedPensPayload[VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS].push(
            pen?.penId || pen?.localPenId,
          );
        });
      }
    }

    return usedPensPayload;
  } catch (error) {
    console.log('error getUsedPensFromVisitTools', error);
    logEvent(
      'helpers -> visitHelper -> getUsedPensFromVisitTools error',
      error,
    );
    return null;
  }
}

export const extendsUsedPensInVisitWithToolPens = (visit, toolPens) => {
  try {
    const parsedUsedPens = getParsedToolData(visit.usedPens);

    const payload = {
      ...parsedUsedPens,
      ...toolPens,
    };

    return payload;
  } catch (error) {
    console.log('error extendsUsedPensInVisitWithToolPens', error);
    logEvent(
      'helpers -> visitHelper -> extendsUsedPensInVisitWithToolPens error',
      error,
    );
    return null;
  }
};

export function clearPenDataFromToolsInVisits(visit, deletingPenId) {
  try {
    const usedPens = getParsedToolData(visit?.usedPens);

    const usedPensTools = Object.keys(usedPens);

    let updatedToolsDataPayload = {};

    usedPensTools.map(toolKey => {
      const isPenUsed = usedPens[toolKey]?.find(item => item === deletingPenId);

      if (isPenUsed) {
        switch (toolKey) {
          case VISIT_TABLE_FIELDS.RUMEN_HEALTH: {
            const updatedCudChewingData = deletePenDataInsideCudChewingTool(
              visit[VISIT_TABLE_FIELDS.RUMEN_HEALTH],
              isPenUsed,
            );
            updatedToolsDataPayload[toolKey] = updatedCudChewingData;

            break;
          }
          case VISIT_TABLE_FIELDS.LOCOMOTION_SCORE: {
            const updatedLocomotionData = deletePenDataInsideLocomotionTool(
              visit[VISIT_TABLE_FIELDS.LOCOMOTION_SCORE],
              isPenUsed,
            );
            updatedToolsDataPayload[toolKey] = updatedLocomotionData;

            break;
          }
          case VISIT_TABLE_FIELDS.BODY_CONDITION: {
            const updatedBCSData = deletePenDataInsideBCSTool(
              visit[VISIT_TABLE_FIELDS.BODY_CONDITION],
              isPenUsed,
            );
            updatedToolsDataPayload[toolKey] = updatedBCSData;

            break;
          }
          case VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS: {
            const updatedAnimalAnalysisData =
              deletePenDataInsideAnimalAnalysisTool(
                visit[VISIT_TABLE_FIELDS.ANIMAL_ANALYSIS],
                isPenUsed,
              );
            updatedToolsDataPayload[toolKey] = updatedAnimalAnalysisData;

            break;
          }
          case VISIT_TABLE_FIELDS.RUMEN_HEALTH_MANURE_SCORE: {
            const updatedManureScoreData = deletePenDataInsideManureScoreTool(
              visit[VISIT_TABLE_FIELDS.RUMEN_HEALTH_MANURE_SCORE],
              isPenUsed,
            );
            updatedToolsDataPayload[toolKey] = updatedManureScoreData;

            break;
          }
          case VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE: {
            const updatedRumenFillData = deletePenDataInsideRumenFillTool(
              visit[VISIT_TABLE_FIELDS.RUMEN_FILL_MANURE_SCORE],
              isPenUsed,
            );
            updatedToolsDataPayload[toolKey] = updatedRumenFillData;

            break;
          }
          case VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL: {
            const updatedPenTimeBudgetData =
              deletePenDataInsidePenTimeBudgetTool(
                visit[VISIT_TABLE_FIELDS.PEN_TIME_BUDGET_TOOL],
                isPenUsed,
              );
            updatedToolsDataPayload[toolKey] = updatedPenTimeBudgetData;

            break;
          }
          case VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL: {
            const updatedManureScreenerData =
              deletePenDataInsideManureScreenerTool(
                visit[VISIT_TABLE_FIELDS.MANURE_SCREENER_TOOL],
                isPenUsed,
              );
            updatedToolsDataPayload[toolKey] = updatedManureScreenerData;

            break;
          }
          case VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE: {
            const updatedTmrScoreData = deletePenDataInsideTmrParticleScoreTool(
              visit[VISIT_TABLE_FIELDS.TMR_PARTICLE_SCORE],
              isPenUsed,
            );
            updatedToolsDataPayload[toolKey] = updatedTmrScoreData;

            break;
          }

          default:
            break;
        }
      }
    });

    return updatedToolsDataPayload;
  } catch (error) {
    logEvent(
      'helpers -> visitHelper -> clearPenDataFromToolsInVisits Error:',
      error,
    );
    return null;
  }
}
