//constants
import {
  ALL,
  NOT_APPLICABLE,
  TOOL_ANALYSIS_TYPES,
  TOOL_TYPES,
  UNIT_OF_MEASURE,
} from '../../constants/AppConstants';

//localization
import i18n from '../../localization/i18n';

//helpers
import { getImage } from '../dashboardHelper';
import { getParameterCaseInsensitive, isToolInProgress } from '../visitHelper';
import { convertNumberToString, stringIsEmpty } from '../alphaNumericHelper';
import { getParsedToolData, isEmpty } from '../genericHelper';
import { getTitleOfQuestionList } from './forageAudit';
import {
  convertWeightToImperial,
  getCurrency,
  getCurrencyByWeightUnit,
  getUnitOfMeasure,
  getWeightUnit,
} from '../appSettingsHelper';
import { getNELDairyUnit } from '../siteHelper';
import { setOrSpliceFromArray } from '..';

//store
import store from '../../store';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { SITE_INPUTS } from '../../constants/VisitReportConstants';

export const getCustomerOrProspectImage = visitDetails => {
  if (visitDetails?.customerName) {
    const item = {
      imageToUploadBase64: visitDetails.customerImageToUploadBase64,
      localMediaUrl: visitDetails.customerLocalMediaUrl,
    };
    const customerImage = getImage(item);
    return customerImage;
  } else {
    const item = {
      imageToUploadBase64: visitDetails?.prospectImageToUploadBase64,
      localMediaUrl: visitDetails?.prospectLocalMediaUrl,
    };
    const prospectImage = getImage(item);
    return prospectImage;
  }
};

export const getSelectedSiteDetailsValue = (selectedOptions = []) => {
  const siteInputs = getSiteInputs();
  if (selectedOptions && selectedOptions?.length === 1) {
    const site = siteInputs.find(input => input.value === selectedOptions[0]);
    return site.title;
  } else if (selectedOptions && selectedOptions?.length > 1) {
    return `${selectedOptions.length} ${i18n.t('siteInputsSelected')}`;
  }
  return i18n.t('noneSelected');
};

export const getSelectedPenValue = (pensList = [], selectedPensList = []) => {
  if (selectedPensList && selectedPensList?.length === 1) {
    const penItem = pensList.find(pen => pen.value === selectedPensList[0]);
    return penItem?.title || '';
  } else if (selectedPensList && selectedPensList?.length > 1) {
    return `${selectedPensList?.length} ${i18n.t('pensSelected')}`;
  }
  return i18n.t('noneSelected');
};

export const getSelectedAnimalValue = (
  animalsList = [],
  selectedAnimalList = [],
) => {
  if (selectedAnimalList && selectedAnimalList?.length === 1) {
    const penItem = animalsList.find(
      animal => animal.value === selectedAnimalList[0],
    );
    return penItem?.title || '';
  } else if (selectedAnimalList && selectedAnimalList?.length > 1) {
    return `${selectedAnimalList?.length} ${i18n.t('animalsSelected')}`;
  }
  return i18n.t('noneSelected');
};

export const getToolsListingInfo = (countryTools, visit) => {
  const tools = [];
  Object.values(countryTools).forEach(tool => {
    if (isToolInProgress(visit, tool.toolId)) {
      const toolInfo = getParameterCaseInsensitive(visit, tool.toolId);
      if (toolInfo) {
        tools.push({
          name: tool.name,
          toolId: tool.toolId,
          toolGroupId: tool.toolGroupId,
          updatedAt: getToolLastUpdatedTime(visit, tool, toolInfo),
        });
      }
    }
  });
  return tools;
};

const getToolLastUpdatedTime = (visit, tool, toolInfo) => {
  if (toolInfo === true) {
    if (tool.toolId === TOOL_TYPES.BODY_CONDITION) {
      const locomotionTool = getParameterCaseInsensitive(
        visit,
        TOOL_TYPES.LOCOMOTION_SCORE,
      );
      const parsedToolData = getParsedToolData(locomotionTool);
      return parsedToolData?.mobileLastUpdatedTime;
    } else {
      const bodyConditionTool = getParameterCaseInsensitive(
        visit,
        TOOL_TYPES.BODY_CONDITION,
      );
      const parsedToolData = getParsedToolData(bodyConditionTool);
      return parsedToolData?.mobileLastUpdatedTime;
    }
  } else {
    const parsedToolData = getParsedToolData(toolInfo);
    return parsedToolData?.mobileLastUpdatedTime;
  }
};

export const isPenAnalysisSelected = analysisCategories => {
  const foundIndex = analysisCategories.findIndex(
    category =>
      category.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      category.isSelected === true,
  );
  return foundIndex !== -1;
};

export const isAnimalAnalysisSelected = analysisCategories => {
  const foundIndex = analysisCategories.findIndex(
    category =>
      category.value === TOOL_ANALYSIS_TYPES.ANIMAL_ANALYSIS &&
      category.isSelected === true,
  );
  return foundIndex !== -1;
};

/** filter notes which are not deleted */

export const getUndeletedNotes = (notes = [], deletedNotes = []) => {
  if (deletedNotes.length > 0) {
    return notes.filter(
      note => !deletedNotes.includes(note.id || note.localId),
    );
  }
  return notes;
};

export const getIndexOfTool = (tools, toolId) => {
  const foundIndex = tools.findIndex(t => t.basicInfo?.toolId === toolId);
  return foundIndex;
};

export const getCustomerOrProspectName = (
  customerName = '',
  prospectName = '',
) => {
  if (customerName || prospectName) {
    return customerName
      ? { name: customerName, type: i18n.t('customer') }
      : { name: prospectName, type: i18n.t('prospect') };
  }
  return { name: NOT_APPLICABLE, type: '' };
};

export const getSelectedSiteInputs = (selectedSiteDetails = []) => {
  const siteInputs = getSiteInputs();
  if (selectedSiteDetails && selectedSiteDetails.length > 0) {
    if (selectedSiteDetails.length === 1 && selectedSiteDetails[0] === ALL) {
      return siteInputs;
    } else {
      const selectedSiteInputs = siteInputs.filter(input =>
        selectedSiteDetails.includes(input.value),
      );
      return selectedSiteInputs;
    }
  }
  return [];
};

export const groupSitesByType = (sites, visitDetails) => {
  const result = sites.reduce((acc, cur) => {
    if (cur.value === ALL) {
      return acc;
    }
    if (acc[cur.type]) {
      acc[cur.type] = {
        ...acc[cur.type],
        [cur.title]: visitDetails?.[cur.value] || cur.defaultValue,
      };
    } else {
      acc[cur.type] = {
        [cur.title]: visitDetails?.[cur.value] || cur.defaultValue,
      };
    }
    return acc;
  }, {});
  return result;
};

export const getSelectedAnalysisCategories = (analysisCategories = []) => {
  if (analysisCategories && analysisCategories.length > 0) {
    return analysisCategories.filter(category => category?.isSelected);
  }
  return [];
};

/**
 *
 * @tool {*} the tool added by user in the visit report
 * @toolPens {*} pens stored in visit table for every tool
 * @sitePens {*} all the pens which are included in site
 * @returns only those pens from the tool column in visit table which are selected by user for visit report
 */
export const filterPensBySelection = (tool, toolPens = [], sitePens = []) => {
  if (tool?.selectedPens?.length === 1 && tool?.selectedPens?.[0] === ALL) {
    return toolPens;
  } else if (toolPens && toolPens?.length > 0) {
    const list = toolPens.filter(pen => {
      if (!pen) {
        return false;
      }
      /** As pens inside tool analysis can have either local id or server id in penId */
      const penItem = sitePens.find(
        singlePen =>
          pen?.penId ===
            (singlePen?.sv_id || singlePen?.id || singlePen?.localId) ||
          pen?.localPenId === (singlePen?.id || singlePen?.localId),
      );
      return penItem ? tool?.selectedPens?.includes(penItem.id) : false;
    });
    return list;
  }
  return [];
};

export const getBodyForToolNotes = (notes = []) => {
  const formattedNotes = notes.map(note => {
    const noteDate = note?.updatedDate || note?.createdDate;
    return {
      id: note?.sv_id || null,
      note: note?.note || '',
      title: note?.title || '',
      createTimeUtc: !stringIsEmpty(noteDate)
        ? new Date(noteDate).toISOString()
        : '',
    };
  });
  return isEmpty(formattedNotes) ? null : formattedNotes;
};

export const getPenDetailsBody = sitePens => {
  const {
    userPreferences: { userPreferences },
    enums: {
      enum: { currencies = [] },
    },
  } = store.getState();

  const currency = getCurrency(currencies, userPreferences);
  const selectedUnit = getUnitOfMeasure(userPreferences);
  const weightUnit = getWeightUnit(userPreferences);

  const penDetailsBody = sitePens.reduce((bodyArray, pen) => {
    if (pen?.name) {
      bodyArray.push([
        createDynamicObjForReqBody(i18n.t('penName'), pen?.name || ''),
        createDynamicObjForReqBody(i18n.t('animalsInPen'), pen?.animals || 0),
        createDynamicObjForReqBody(i18n.t('daysInMilk'), pen?.daysInMilk || 0),
        createDynamicObjForReqBody(
          `${i18n.t('milkYield')} (${weightUnit})`,
          selectedUnit === UNIT_OF_MEASURE.IMPERIAL
            ? convertNumberToString(convertWeightToImperial(pen?.milk, 1)) ||
                i18n.t('numberPlaceholder')
            : convertNumberToString(pen?.milk) || i18n.t('numberPlaceholder'),
        ),
        createDynamicObjForReqBody(
          `${i18n.t('dryMatterIntake')} (${weightUnit})`,
          selectedUnit === UNIT_OF_MEASURE.IMPERIAL
            ? convertNumberToString(
                convertWeightToImperial(pen?.dryMatterIntake, 1),
              ) || i18n.t('numberPlaceholder')
            : convertNumberToString(pen?.dryMatterIntake) ||
                i18n.t('numberPlaceholder'),
        ),
        createDynamicObjForReqBody(
          `${i18n.t('rationCostPerAnimal')} (${currency})`,
          pen?.rationCostPerAnimal || 0,
        ),
      ]);
    }
    return bodyArray;
  }, []);
  return penDetailsBody;
};

export const createDynamicObjForReqBody = (key, value) => {
  return { column: key, value: value };
};

export const findFromSitePensById = (sitePens, pen) => {
  return sitePens.find(
    siteItem =>
      pen.penId === (siteItem?.sv_id || siteItem?.id || siteItem?.localId) ||
      pen?.localPenId === (siteItem?.id || siteItem?.localId),
  );
};

export const findPenFromToolData = (toolPens = [], sitePen) => {
  return toolPens.find(
    toolPen =>
      toolPen.penId === (sitePen?.sv_id || sitePen?.id || sitePen?.localId) ||
      toolPen?.localPenId === (sitePen?.id || sitePen?.localId),
  );
};

export const sortRecentVisits = recentVisits => {
  const sortedRecentVisits = recentVisits?.sort((a, b) => {
    if (a.visitDate < b.visitDate) {
      return -1;
    }
    if (a.visitDate > b.visitDate) {
      return 1;
    }
    return 0;
  });
  return sortedRecentVisits;
};

export const getRecentVisitPen = (pens = [], pen) => {
  const visitPen = pens?.find(
    item => item?.penId === (pen?.penId || pen?.localId),
  );
  return visitPen;
};

export const getRecentVisitToolData = (visit, toolKey) => {
  let parsedToolData = null;
  if (visit?.[toolKey] && typeof visit?.[toolKey] === 'string') {
    parsedToolData = JSON.parse(visit?.[toolKey]);
  } else {
    parsedToolData = visit?.[toolKey];
  }
  return parsedToolData;
};

export const isToolDataNotEmpty = (toolAnalysisBody, notesData) => {
  return !(isEmpty(toolAnalysisBody) && isEmpty(notesData));
};

export const formatForageAuditQuestions = (sections = []) => {
  const formattedArray = [];
  let currentIndex = 0;
  sections.forEach(section => {
    section.scorecardSilages?.forEach(silage => {
      currentIndex += 1;
      formattedArray.push({
        title: getTitleOfQuestionList(
          section?.sectionName,
          silage?.silageTypeName,
        ),
        data: silage.questions,
        sectionIndex: currentIndex,
      });
    });
  });
  return formattedArray;
};

export const formatCalfHeiferScorecardQuestions = (sections = []) => {
  const formattedArray = [];
  let currentIndex = 0;
  sections.forEach(section => {
    currentIndex += 1;
    formattedArray.push({
      title: getTitleOfQuestionList(section?.sectionName),
      data: section.questions,
      sectionIndex: currentIndex,
    });
  });
  return formattedArray;
};

export const getSiteInputs = () => {
  const {
    userPreferences: { userPreferences },
    enums: {
      enum: { currencies = [] },
    },
  } = store.getState();

  const currency = getCurrency(currencies, userPreferences);

  const weightUnit = getWeightUnit(userPreferences);
  const nelDairyUnit = getNELDairyUnit(userPreferences);
  return [
    { title: i18n.t('allDetails'), value: ALL },
    {
      title: `${i18n.t('currentMilkPrice')} ${getCurrencyByWeightUnit(
        currency,
        userPreferences,
      )}`,
      value: SITE_INPUTS.CURRENT_MILK_PRICE,
      type: 'generalDetails',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: i18n.t('milkingSystem'),
      value: SITE_INPUTS.MILKING_SYSTEM,
      type: 'generalDetails',
      defaultValue: '',
    },
    {
      title: i18n.t('totalStallsInParlor'),
      value: SITE_INPUTS.TOTAL_STALLS,
      type: 'generalDetails',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: i18n.t('animalInHerd'),
      value: SITE_INPUTS.LACTATING_ANIMALS,
      type: 'animalInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: i18n.t('daysInMilk'),
      value: SITE_INPUTS.DAYS_IN_MILK,
      type: 'animalInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: `${i18n.t('milkProduction')} (${weightUnit})`,
      value: SITE_INPUTS.MILK_YIELD,
      type: 'animalInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: i18n.t('milkFat(%)'),
      value: SITE_INPUTS.MILK_FAT,
      type: 'animalInputs',
      defaultValue: i18n.t('-'),
    },
    {
      title: i18n.t('milkProtein(%)'),
      value: SITE_INPUTS.MILK_PROTEIN,
      type: 'animalInputs',
      defaultValue: i18n.t('-'),
    },
    {
      title: `${i18n.t('milkOtherSolids')} ${i18n.t('%')}`,
      value: SITE_INPUTS.MILK_OTHER_SOLIDS,
      type: 'animalInputs',
      defaultValue: i18n.t('-'),
    },
    {
      title: i18n.t('somaticCellCountWithUnit'),
      value: SITE_INPUTS.SOMATIC_CELL_COUNT,
      type: 'animalInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: i18n.t('bacteriaCellCountWithUnit'),
      value: SITE_INPUTS.BACTERIA_CELL_COUNT,
      type: 'animalInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: `${i18n.t('dryMatterIntake')} (${weightUnit})`,
      value: SITE_INPUTS.DRY_MATTER_INTAKE,
      type: 'dietInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: `${i18n.t('asFedIntake')} (${weightUnit})`,
      value: SITE_INPUTS.AS_FED_INTAKE,
      type: 'dietInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: `${i18n.t('NELDairy')} (${nelDairyUnit})`,
      value: SITE_INPUTS.NEL_DAIRY,
      type: 'dietInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
    {
      title: `${i18n.t('rationCostPerAnimal')} (${currency})`,
      value: SITE_INPUTS.RATION_COST,
      type: 'dietInputs',
      defaultValue: i18n.t('numberPlaceholder'),
    },
  ];
};

export const onModalItemPress = (
  selectedTempOptions,
  item,
  setSelectedTempOptions,
  options,
) => {
  const selectedItems = [...selectedTempOptions];
  if (item?.value === ALL && !selectedItems.includes(ALL)) {
    setSelectedTempOptions([ALL]);
  } else if (selectedItems.includes(ALL) && item?.value !== ALL) {
    let updatedSelectedItems = setOrSpliceFromArray(selectedItems, ALL);
    const result = options.reduce((acc, cur) => {
      if (cur.value === ALL) {
        return acc;
      } else {
        acc.push(cur.value);
      }
      return acc;
    }, []);
    updatedSelectedItems = setOrSpliceFromArray([...result], item?.value);
    setSelectedTempOptions(updatedSelectedItems);
  } else {
    const updatedSelectedItems = setOrSpliceFromArray(
      selectedItems,
      item?.value,
    );
    if (updatedSelectedItems?.length === options?.length - 1) {
      setSelectedTempOptions([ALL]);
    } else {
      setSelectedTempOptions(updatedSelectedItems);
    }
  }
};

export const isReportDataExistInReducer = (
  currentVisitDetails,
  previousVisitReportData,
) => {
  if (previousVisitReportData?.length > 0) {
    const reportDataExist = previousVisitReportData?.find(item => {
      if (
        item?.visitDetails?.localId === currentVisitDetails?.localId ||
        (!stringIsEmpty(item?.visitDetails?.serverId) &&
          !stringIsEmpty(currentVisitDetails?.serverId) &&
          item?.visitDetails?.serverId === currentVisitDetails?.serverId)
      ) {
        return item;
      }
    });

    if (reportDataExist) {
      return reportDataExist;
    }

    return null;
  } else {
    return null;
  }
};

export const persistNewToolDataForVisitReport = (
  currentVisitDetails,
  currentToolData,
  previousVisitReportData,
) => {
  if (previousVisitReportData?.length > 0) {
    previousVisitReportData?.map(item => {
      if (
        item?.visitDetails?.sv_id === currentVisitDetails?.sv_id ||
        item?.visitDetails?.localId === currentVisitDetails?.localId
      ) {
        const isToolAlreadyAdded = item?.addedTools?.find(tool => {
          if (tool?.basicInfo?.toolId === currentToolData?.basicInfo?.toolId) {
            return tool;
          }
        });

        if (!isToolAlreadyAdded) {
          item.addedTools.push(currentToolData);
        }

        return item;
      } else {
        return item;
      }
    });

    return previousVisitReportData;
  }

  return [];
};

export const removePersistedToolDataForVisitReport = (
  currentVisitDetails,
  currentToolData,
  previousVisitReportData,
) => {
  if (previousVisitReportData?.length > 0) {
    previousVisitReportData?.map(item => {
      if (
        item?.visitDetails?.sv_id === currentVisitDetails?.sv_id ||
        item?.visitDetails?.localId === currentVisitDetails?.localId
      ) {
        const filteredTools = item?.addedTools?.filter(
          tool =>
            tool?.basicInfo?.toolId !== currentToolData?.basicInfo?.toolId,
        );

        if (filteredTools?.length > 0) {
          item.addedTools = filteredTools;
        } else {
          item.addedTools = [];
        }

        return item;
      } else {
        return item;
      }
    });

    return previousVisitReportData;
  }

  return [];
};

export const updatePersistedToolDataForVisitReport = (
  currentVisitDetails,
  currentToolData,
  previousVisitReportData,
  foundIndex,
) => {
  if (previousVisitReportData?.length > 0) {
    previousVisitReportData?.map(item => {
      if (
        item?.visitDetails?.sv_id === currentVisitDetails?.sv_id ||
        item?.visitDetails?.localId === currentVisitDetails?.localId
      ) {
        item.addedTools[foundIndex] = currentToolData;

        return item;
      } else {
        return item;
      }
    });

    return previousVisitReportData;
  }

  return [];
};

export const addUpdateAllToolsPersistance = (
  currentVisit,
  selectedVisitTools,
  persistedReportList,
) => {
  if (persistedReportList?.length > 0) {
    persistedReportList?.map(item => {
      if (
        item?.visitDetails?.sv_id === currentVisit?.sv_id ||
        item?.visitDetails?.localId === currentVisit?.localId
      ) {
        item.addedTools = selectedVisitTools;

        return item;
      } else {
        return item;
      }
    });

    return persistedReportList;
  }

  return [];
};

export const removePersistedToolsData = (currentVisit, persistedReportList) => {
  if (persistedReportList?.length > 0) {
    persistedReportList?.map(item => {
      if (
        item?.visitDetails?.sv_id === currentVisit?.sv_id ||
        item?.visitDetails?.localId === currentVisit?.localId
      ) {
        item.addedTools = [];

        return item;
      } else {
        return item;
      }
    });

    return persistedReportList;
  }

  return [];
};

export const convertImage = async (bufferImage, pdfDoc) => {
  try {
    const pngImage = await pdfDoc.embedPng(bufferImage);

    return pngImage;
  } catch (error) {
    console.log('ERROR_CAPTURE_REF', error);
    return error;
  }
};

export const pagePdfDocument = async pdfDocument => {
  try {
    await pdfDocument.save();

    const pdfDataUri = await pdfDocument.saveAsBase64(); //await pdfDoc.saveAsBase64({ dataUri: true });

    return pdfDataUri;
  } catch (error) {
    console.log('ERROR', error);
    return error;
  }
};

export const convertImageUsingStream = async uri => {
  try {
    return new Promise((resolve, reject) => {
      // Perform some asynchronous operation

      ReactNativeBlobUtil.fs.readStream(uri, 'base64').then(stream => {
        let data = '';
        stream.open();
        stream.onData(chunk => {
          data += chunk;
        });
        stream.onEnd(() => {
          resolve(data);
        });
      });
    });
  } catch (error) {
    console.log('error generating stream image', error);
  }
};

export const getIndexOfSelectedVisit = (visitsList, currentVisit) => {
  const foundIndex = visitsList.findIndex(
    t =>
      t.visitDetails?.localId === currentVisit?.localId ||
      (!stringIsEmpty(t.visitDetails?.serverId) &&
        !stringIsEmpty(currentVisit?.serverId) &&
        t.visitDetails?.serverId === currentVisit?.serverId),
  );
  return foundIndex;
};

export const getVisitSiteDetail = (detail, unit, selectedCurrency) => {
  let general = [];
  let animalInputs = [];
  let dietInput = [];
  general.push({
    key: `${i18n.t('current')} ${i18n.t('milkPrice')} (${unit})`,
    value: detail?.currentMilkPrice,
    id: SITE_INPUTS.CURRENT_MILK_PRICE,
  });
  general.push({
    key: `${i18n.t('milkingSystem')}`,
    value: detail?.milkingSystemType,
    id: SITE_INPUTS.MILKING_SYSTEM,
  });
  general.push({
    key: `${i18n.t('totalStallsInParlor')}`,
    value: detail?.numberOfParlorStalls,
    id: SITE_INPUTS.TOTAL_STALLS,
  });
  animalInputs.push({
    key: `${i18n.t('lactatingAnimal')}`,
    value: detail?.lactatingAnimal,
    id: SITE_INPUTS.LACTATING_ANIMALS,
  });
  animalInputs.push({
    key: `${i18n.t('daysInMilk')}`,
    value: detail?.daysInMilk,
    id: SITE_INPUTS.DAYS_IN_MILK,
  });
  animalInputs.push({
    key: `${i18n.t('milkYields')} (${unit})`,
    value: detail?.milk,
    id: SITE_INPUTS.MILK_YIELD,
  });
  animalInputs.push({
    key: `${i18n.t('milkFat')} ${i18n.t('%')}`,
    value: detail?.milkFatPercent,
    id: SITE_INPUTS.MILK_FAT,
  });
  animalInputs.push({
    key: `${i18n.t('milkProtein')} ${i18n.t('%')}`,
    value: detail?.milkProteinPercent,
    id: SITE_INPUTS.MILK_PROTEIN,
  });
  animalInputs.push({
    key: `${i18n.t('milkOtherSolids')} ${i18n.t('%')}`,
    value: detail?.milkOtherSolidsPercent,
    id: SITE_INPUTS.MILK_OTHER_SOLIDS,
  });
  animalInputs.push({
    key: `${i18n.t('somaticCellCountWithUnit')}`,
    value: detail?.milkSomaticCellCount,
    id: SITE_INPUTS.SOMATIC_CELL_COUNT,
  });
  animalInputs.push({
    key: `${i18n.t('bacteriaCellCountWithUnit')}`,
    value: detail?.bacteriaCellCount,
    id: SITE_INPUTS.BACTERIA_CELL_COUNT,
  });
  dietInput.push({
    key: `${i18n.t('dryMatterIntake')} (${unit})`,
    value: detail?.dryMatterIntake,
    id: SITE_INPUTS.DRY_MATTER_INTAKE,
  });
  dietInput.push({
    key: `${i18n.t('asFedIntake')} (${unit})`,
    value: detail?.asFedIntake,
    id: SITE_INPUTS.AS_FED_INTAKE,
  });
  dietInput.push({
    key: `${i18n.t('NELDairy')} (${unit})`,
    value: detail?.netEnergyOfLactationDairy,
    id: SITE_INPUTS.NEL_DAIRY,
  });
  dietInput.push({
    key: `${i18n.t('rationCostPerAnimal')} (${selectedCurrency})`,
    value: detail?.rationCost,
    id: SITE_INPUTS.RATION_COST,
  });

  return {
    dietInput: dietInput,
    animalInputs: animalInputs,
    general: general,
  };
};

export const getVisitPenDetail = detail => {
  let pens = [];
  detail?.forEach(element => {
    let temp = [];
    temp.push(element?.name);
    temp.push(element?.animals);
    temp.push(element?.daysInMilk || '-');
    temp.push(element?.milk);
    temp.push(element?.dryMatterIntake);
    temp.push(element?.rationCostPerAnimal);
    pens.push(temp);
  });
  return pens;
};

export const sortVisitReportPdfPages = (
  toolRefKeys,
  offlinePdfPageReferences,
) => {
  let sortedPagesData = {};

  toolRefKeys?.map(toolKey => {
    const toolPageList = offlinePdfPageReferences[toolKey];

    toolPageList?.sort((a, b) => {
      if (a.analysisType === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS) return -1;
      else if (a.analysisType === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS) return 1;
      return 0;
    });

    const sortedPageList = toolPageList?.sort((a, b) => {
      if (a.pageNumber < b.pageNumber) return -1;
      else if (a.pageNumber > b.pageNumber) return 1;
      return 0;
    });

    sortedPagesData[toolKey] = sortedPageList;
  });

  return sortedPagesData;
};

export const getPensWithWithoutData = (visit, pensList) => {
  let allPens = pensList.map(p => {
    return {
      name: p.name,
      id: p.sv_id || p.id,
      isUsed: false,
    };
  });

  let withDataPens = 0;

  const getToolFromVisit = toolId => {
    for (let p in visit) {
      if (visit.hasOwnProperty(p) && toolId == (p + '').toLowerCase()) {
        return visit[p] && typeof visit[p] == 'string'
          ? JSON.parse(visit[p])
          : null;
      }
    }
  };

  Object.values(TOOL_TYPES).map(t => {
    if (withDataPens != allPens.length) {
      let toolId = (t + '').toLowerCase();
      let tool = getToolFromVisit(toolId);

      if (!isEmpty(tool) && !isEmpty(tool.pens) && tool.pens.length > 0) {
        tool?.pens?.map(p => {
          let existedPenIndex = allPens.findIndex(ap => ap.id == p.penId);

          //setting pens with data
          if (existedPenIndex != -1) {
            if (!allPens[existedPenIndex].isUsed) {
              withDataPens++;
              allPens[existedPenIndex].isUsed = true;
            }
          }
        });
      }
    }
  });

  return allPens;
};
