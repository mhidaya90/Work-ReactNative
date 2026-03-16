//helpers
import {
  getBag3InchesPerDay,
  getBag6InchesPerDay,
  getBagDM,
  getBagEndDate,
  getBagFeedoutSurfaceArea,
  getBagInchesPerDay,
  getBagTonsAF,
  getBagTonsDM,
  getBagTonsPerDay,
  getBottomUnloadingAt3InchesDay,
  getBottomUnloadingAt6InchesDay,
  getBottomUnloadingEndDate,
  getBottomUnloadingFeedOutSurfaceArea,
  getBottomUnloadingInchesCmPerDay,
  getBottomUnloadingLbsDmInFoot,
  getBottomUnloadingTonsAF,
  getBottomUnloadingTonsDM,
  getBottomUnloadingTonsPerDay,
  getBunker3InchesPerDay,
  getBunker6InchesPerDay,
  getBunkerDM,
  getBunkerEndDate,
  getBunkerFeedoutSurfaceArea,
  getBunkerInchesPerDay,
  getBunkerTonsAF,
  getBunkerTonsDM,
  getBunkerTonsPerDay,
  getLabelWithUnit,
  getPile3InchesPerDay,
  getPile6InchesPerDay,
  getPileDM,
  getPileEndDate,
  getPileFeedoutSurfaceArea,
  getPileInchesPerDay,
  getPileTonsAF,
  getPileTonsDM,
  getPileTonsPerDay,
  getTopUnloadingAt3InchesDay,
  getTopUnloadingAt6InchesDay,
  getTopUnloadingEndDate,
  getTopUnloadingFeedOutSurfaceArea,
  getTopUnloadingInchesCmPerDay,
  getTopUnloadingLbsDmInFoot,
  getTopUnloadingTonsAF,
  getTopUnloadingTonsDM,
  getTopUnloadingTonsPerDay,
  getUnitOfMeasure,
  populateEditBagForm,
  populateEditBottomUnloadingForm,
  populateEditBunkerForm,
  populateEditPileForm,
  populateEditTopUnloadingForm,
} from '../forageInventoriesHelper';
import { getParsedToolData } from '../genericHelper';
import { createDynamicObjForReqBody } from './visitReportHelper';
import { convertNumberToString } from '../alphaNumericHelper';
import { dateHelper } from '../dateHelper';

//store
import store from '../../store';

//localization
import i18n from '../../localization/i18n';

//constants
import {
  AF,
  DM,
  FORAGE_INVENTORIES_TYPES,
} from '../../constants/toolsConstants/ForageInventories';
import { DATE_FORMATS, UNIT_OF_MEASURE } from '../../constants/AppConstants';

export const getBodyForForageInventories = ({ visitDetails }) => {
  const forageInventoryData = getParsedToolData(visitDetails?.pileAndBunker);
  const body = {};
  const selectedUnit = visitDetails?.unitOfMeasure || {};
  if (forageInventoryData?.pileBunkers?.length > 0) {
    const detailsArray = [];
    const mappedPileAndBunkers = getMappedPileAndBunkers(
      forageInventoryData?.pileBunkers,
      selectedUnit,
    );
    detailsArray.push(
      {
        [i18n.t('capacity')]: getCapacityDetails(
          mappedPileAndBunkers,
          selectedUnit,
        ),
      },
      {
        [i18n.t('feedOutRateInformation')]: getFeedOutDetails(
          mappedPileAndBunkers,
          selectedUnit,
        ),
      },
      {
        [i18n.t('cowsDayNeeded')]: getCowsDayNeededDetails(
          mappedPileAndBunkers,
          selectedUnit,
        ),
        [i18n.t('days')]: getDaysDetails(mappedPileAndBunkers, selectedUnit),
      },
    );

    body.details = detailsArray;
  }
  return body;
};

const getMappedPileAndBunkers = (pileBunkers, selectedUnit) => {
  const mappedData = pileBunkers.map(item => {
    return mapDataToRespectiveForm(item, selectedUnit);
  });
  return mappedData;
};

const mapDataToRespectiveForm = (item, selectedUnit) => {
  switch (item?.isPileOrBunker) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      return {
        ...populateEditPileForm(item, selectedUnit),
        categoryName: item.name,
        categoryType: item.isPileOrBunker,
      };

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      return {
        ...populateEditBunkerForm(item, selectedUnit),
        categoryName: item.name,
        categoryType: item.isPileOrBunker,
      };

    case FORAGE_INVENTORIES_TYPES.BAG:
      return {
        ...populateEditBagForm(item, selectedUnit),
        categoryName: item.name,
        categoryType: item.isPileOrBunker,
      };

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      return {
        ...populateEditTopUnloadingForm(item, selectedUnit),
        categoryName: item.name,
        categoryType: item.isPileOrBunker,
      };

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      return {
        ...populateEditBottomUnloadingForm(item, selectedUnit),
        categoryName: item.name,
        categoryType: item.isPileOrBunker,
      };
  }
};

/** Start capacity details*/
const getCapacityDetails = (mappedPileAndBunkers, selectedUnit) => {
  const metricTonsDMDetails = getMetricTonsDMDetails(
    mappedPileAndBunkers,
    selectedUnit,
  );
  const metricTonsAFDetails = getMetricTonsAFDetails(
    mappedPileAndBunkers,
    selectedUnit,
  );
  const data = [
    [
      createDynamicObjForReqBody(i18n.t('details'), i18n.t('tonsDM')),
      ...metricTonsDMDetails,
    ],
    [
      createDynamicObjForReqBody(i18n.t('details'), i18n.t('tonsAF')),
      ...metricTonsAFDetails,
    ],
  ];
  return data;
};

const getMetricTonsDMDetails = (mappedPileAndBunkers, selectedUnit) => {
  const data = mappedPileAndBunkers.map(item => {
    const tonDMValue = getTonValue(item, selectedUnit, DM);
    return createDynamicObjForReqBody(item.categoryName, tonDMValue);
  });
  return data;
};

const getTonValue = (item, selectedUnit, type) => {
  switch (item.categoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      const pileDMValue =
        type === DM
          ? getPileTonsDM(item, selectedUnit, true)
          : getPileTonsAF(item, selectedUnit, true);
      return pileDMValue?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      const bunkerDMValue =
        type === DM
          ? getBunkerTonsDM(item, selectedUnit, true)
          : getBunkerTonsAF(item, selectedUnit, true);
      return bunkerDMValue?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.BAG:
      const bagDMValue =
        type === DM
          ? getBagTonsDM(item, selectedUnit, true)
          : getBagTonsAF(item, selectedUnit, true);
      return bagDMValue?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      const topUnloadingDMValue =
        type === DM
          ? getTopUnloadingTonsDM(item, selectedUnit, true)
          : getTopUnloadingTonsAF(item, selectedUnit, true);
      return topUnloadingDMValue?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      const bottomUnloadingDMValue =
        type === DM
          ? getBottomUnloadingTonsDM(item, selectedUnit, true)
          : getBottomUnloadingTonsAF(item, selectedUnit, true);
      return bottomUnloadingDMValue?.toFixed(1)?.toString();
  }
};

const getMetricTonsAFDetails = (pileBunkers, selectedUnit) => {
  const data = pileBunkers.map(item => {
    const tonDMValue = getTonValue(item, selectedUnit, AF);
    return createDynamicObjForReqBody(item.categoryName, tonDMValue);
  });
  return data;
};
/** End capacity details*/

/** Star Feed out details*/
const getFeedOutDetails = (mappedPileAndBunkers, selectedUnit) => {
  const feedRateDetails = getFeedRateDetails(mappedPileAndBunkers);
  const cowsToBeFedDetails = getCowsToBeFedDetails(mappedPileAndBunkers);
  const kgsDMDetails = getKgsDMDetails(mappedPileAndBunkers, selectedUnit);
  const feedOutSurfaceAreaDetails =
    getFeedOutSurfaceDetails(mappedPileAndBunkers);
  const cmInchesDetails = getCMInchesDetails(
    mappedPileAndBunkers,
    selectedUnit,
  );
  const tonsPerDayDetails = getTonsPerDayDetails(
    mappedPileAndBunkers,
    selectedUnit,
  );
  const data = [
    [
      createDynamicObjForReqBody(i18n.t('details'), i18n.t('feedingRate')),
      ...feedRateDetails,
    ],
    [
      createDynamicObjForReqBody(i18n.t('details'), i18n.t('cowsToBeFed')),
      ...cowsToBeFedDetails,
    ],
    [
      createDynamicObjForReqBody(
        i18n.t('details'),
        selectedUnit === UNIT_OF_MEASURE.IMPERIAL
          ? i18n.t('lbsDMIn1Foot')
          : i18n.t('kgsDMIn1M'),
      ),
      ...kgsDMDetails,
    ],
    [
      createDynamicObjForReqBody(
        i18n.t('details'),
        selectedUnit === UNIT_OF_MEASURE.IMPERIAL
          ? getLabelWithUnit(i18n.t('feedOutSurfaceArea'), i18n.t('footSquare'))
          : getLabelWithUnit(
              i18n.t('feedOutSurfaceArea'),
              i18n.t('meterSquare'),
            ),
      ),
      ...feedOutSurfaceAreaDetails,
    ],
    [
      createDynamicObjForReqBody(
        i18n.t('details'),
        selectedUnit === UNIT_OF_MEASURE.IMPERIAL
          ? i18n.t('inchesPerDay')
          : i18n.t('cmPerDay'),
      ),
      ...cmInchesDetails,
    ],
    [
      createDynamicObjForReqBody(i18n.t('details'), i18n.t('tonsPerDay')),
      ...tonsPerDayDetails,
    ],
  ];
  return data;
};

const getFeedRateDetails = mappedPileAndBunkers => {
  const details = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      convertNumberToString(item.feedingRate),
    );
  });
  return details;
};

const getCowsToBeFedDetails = mappedPileAndBunkers => {
  const details = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      convertNumberToString(item.cowsToBeFed),
    );
  });
  return details;
};

const getKgsDMDetails = (mappedPileAndBunkers, selectedUnit) => {
  const details = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      getDMValue(item, selectedUnit),
    );
  });
  return details;
};

const getDMValue = (item, selectedUnit) => {
  switch (item.categoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      return getPileDM(item, true)?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      return getBunkerDM(item, true)?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.BAG:
      return getBagDM(item, true)?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      return getTopUnloadingLbsDmInFoot(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      return getBottomUnloadingLbsDmInFoot(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();
  }
};

const getFeedOutSurfaceDetails = mappedPileAndBunkers => {
  const details = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      getFeedOutSurfaceArea(item),
    );
  });
  return details;
};

const getFeedOutSurfaceArea = item => {
  switch (item.categoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      return getPileFeedoutSurfaceArea(item, true)?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      return getBunkerFeedoutSurfaceArea(item, true)?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.BAG:
      return getBagFeedoutSurfaceArea(item, true)?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      return getTopUnloadingFeedOutSurfaceArea(item, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      return getBottomUnloadingFeedOutSurfaceArea(item, true)
        ?.toFixed(1)
        ?.toString();
  }
};

const getCMInchesDetails = (mappedPileAndBunkers, selectedUnit) => {
  const details = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      getCMInchesValue(item, selectedUnit),
    );
  });
  return details;
};

const getCMInchesValue = (item, selectedUnit) => {
  switch (item.categoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      return getPileInchesPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      return getBunkerInchesPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BAG:
      return getBagInchesPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      return getTopUnloadingInchesCmPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      return getBottomUnloadingInchesCmPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();
  }
};

const getTonsPerDayDetails = (mappedPileAndBunkers, selectedUnit) => {
  const details = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      getTonsPerDayValue(item, selectedUnit),
    );
  });
  return details;
};

const getTonsPerDayValue = (item, selectedUnit) => {
  switch (item.categoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      return getPileTonsPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      return getBunkerTonsPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BAG:
      return getBagTonsPerDay(item, selectedUnit, true)?.toFixed(1)?.toString();

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      return getTopUnloadingTonsPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      return getBottomUnloadingTonsPerDay(item, selectedUnit, true)
        ?.toFixed(1)
        ?.toString();
  }
};
/** End Feed out details */

/** Start Cows day needed details */
const getCowsDayNeededDetails = (mappedPileAndBunkers, selectedUnit) => {
  const sevenCMDaysDetails = getSevenCMDetails(
    mappedPileAndBunkers,
    selectedUnit,
  );
  const fifteenCMDaysDetails = getFifteenCMDetails(
    mappedPileAndBunkers,
    selectedUnit,
  );
  const data = [
    [
      createDynamicObjForReqBody(
        i18n.t('details'),
        selectedUnit == UNIT_OF_MEASURE.IMPERIAL
          ? i18n.t('at3InchesDay')
          : i18n.t('at7CmDay'),
      ),
      ...sevenCMDaysDetails,
    ],
    [
      createDynamicObjForReqBody(
        i18n.t('details'),
        selectedUnit === UNIT_OF_MEASURE.IMPERIAL
          ? i18n.t('at6InchesPerDay')
          : i18n.t('at15cmPerDay'),
      ),
      ...fifteenCMDaysDetails,
    ],
  ];
  return data;
};

const getSevenCMDetails = (mappedPileAndBunkers, selectedUnit) => {
  const data = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      getSevenCMCowsDayNeededValue(item, selectedUnit),
    );
  });
  return data;
};

const getSevenCMCowsDayNeededValue = (item, selectedUnit) => {
  switch (item.categoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      return getPile3InchesPerDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      return getBunker3InchesPerDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BAG:
      return getBag3InchesPerDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      return getTopUnloadingAt3InchesDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      return getBottomUnloadingAt3InchesDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();
  }
};

const getFifteenCMDetails = (mappedPileAndBunkers, selectedUnit) => {
  const data = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      getFifteenCMCowsDayNeededValue(item, selectedUnit),
    );
  });
  return data;
};

const getFifteenCMCowsDayNeededValue = (item, selectedUnit) => {
  switch (item.categoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      return getPile6InchesPerDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      return getBunker6InchesPerDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BAG:
      return getBag6InchesPerDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      return getTopUnloadingAt6InchesDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      return getBottomUnloadingAt6InchesDay(item, selectedUnit, true)
        ?.toFixed(0)
        ?.toString();
  }
};
/** End Cows day needed details */

/** Start Days details */
const getDaysDetails = (mappedPileAndBunkers, selectedUnit) => {
  const startDaysDetails = getStartDaysDetails(mappedPileAndBunkers);
  const endDaysDetails = getEndDaysDetails(mappedPileAndBunkers, selectedUnit);
  const data = [
    [
      createDynamicObjForReqBody(i18n.t('details'), i18n.t('startDate')),
      ...startDaysDetails,
    ],
    [
      createDynamicObjForReqBody(i18n.t('details'), i18n.t('endDate')),
      ...endDaysDetails,
    ],
  ];
  return data;
};

const getStartDaysDetails = mappedPileAndBunkers => {
  const data = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      item.startDate
        ? dateHelper.getFormattedDate(item.startDate, DATE_FORMATS.MM_dd_yyyy)
        : '-',
    );
  });
  return data;
};

const getEndDaysDetails = (mappedPileAndBunkers, selectedUnit) => {
  const data = mappedPileAndBunkers.map(item => {
    return createDynamicObjForReqBody(
      item.categoryName,
      getEndDayValue(item, selectedUnit),
    );
  });
  return data;
};

const getEndDayValue = (item, selectedUnit) => {
  switch (item.categoryType) {
    case FORAGE_INVENTORIES_TYPES.PILE:
      const pileEndDate = getPileEndDate(item, selectedUnit, true);
      return pileEndDate
        ? dateHelper.getFormattedDate(pileEndDate, DATE_FORMATS.MM_dd_yyyy)
        : '-';

    case FORAGE_INVENTORIES_TYPES.BUNKER:
      const bunkerEndDate = getBunkerEndDate(item, selectedUnit, true);
      return bunkerEndDate
        ? dateHelper.getFormattedDate(bunkerEndDate, DATE_FORMATS.MM_dd_yyyy)
        : '-';

    case FORAGE_INVENTORIES_TYPES.BAG:
      const bagEndDate = getBagEndDate(item, selectedUnit, true);
      return bagEndDate
        ? dateHelper.getFormattedDate(bagEndDate, DATE_FORMATS.MM_dd_yyyy)
        : '-';

    case FORAGE_INVENTORIES_TYPES.TOP_UNLOADING_SILO:
      const topUnloadingEndDate = getTopUnloadingEndDate(
        item,
        selectedUnit,
        true,
      );
      return topUnloadingEndDate
        ? dateHelper.getFormattedDate(
            topUnloadingEndDate,
            DATE_FORMATS.MM_dd_yyyy,
          )
        : '-';

    case FORAGE_INVENTORIES_TYPES.BOTTOM_UNLOADING_SILO:
      const bottomUnloadingEndDate = getBottomUnloadingEndDate(
        item,
        selectedUnit,
        true,
      );
      return bottomUnloadingEndDate
        ? dateHelper.getFormattedDate(
            bottomUnloadingEndDate,
            DATE_FORMATS.MM_dd_yyyy,
          )
        : '-';
  }
};
/** End Days Details */

export const getForageInventoriesTableData = ({
  visitDetails,
  perPageInventorySize,
}) => {
  //parsing data from already used/build function
  let details = getBodyForForageInventories({ visitDetails }).details;
  const forageInventoryData = getParsedToolData(visitDetails?.pileAndBunker);

  if (details.length > 0 && forageInventoryData?.pileBunkers?.length > 0) {
    let capacity = [];
    let feedOutRateInformation = [];
    let cowsDayNeeded = [];
    let days = [];

    let tableHeader = [];
    let tableData = [
      { rowName: i18n.t('capacity'), data: capacity },
      {
        rowName: i18n.t('feedOutRateInformation'),
        data: feedOutRateInformation,
      },
      { rowName: i18n.t('cowsDayNeeded'), data: cowsDayNeeded },
      { rowName: i18n.t('days'), data: days },
    ];

    forageInventoryData?.pileBunkers?.map(item => {
      tableHeader.push(item.name);
    });

    //capacity
    // details[0]['Capacity'].map((capacityColumns, index) => {
    // adding localization because it's key changes with localization
    details[0][i18n.t('capacity')].map((capacityColumns, index) => {
      capacity[index] = [];

      capacityColumns?.map(capacityColumn => {
        capacity[index].push(capacityColumn.value || '-');
      });
    });

    //feedOutRateInformation
    // details[1]['Feed out rate information'].map(
    details[1][i18n.t('feedOutRateInformation')].map(
      (feedOutRateInfoColumns, index) => {
        feedOutRateInformation[index] = [];

        feedOutRateInfoColumns?.map(feedOutRateInfoColumn => {
          feedOutRateInformation[index].push(
            feedOutRateInfoColumn.value || '-',
          );
        });
      },
    );

    //cowsDayNeeded
    // details[2]['Cows/day needed'].map((cowsDayNeededColumns, index) => {
    details[2][i18n.t('cowsDayNeeded')].map((cowsDayNeededColumns, index) => {
      cowsDayNeeded[index] = [];

      cowsDayNeededColumns?.map(cowsDayNeededColumn => {
        cowsDayNeeded[index].push(cowsDayNeededColumn.value || '-');
      });
    });

    //days
    // details[2]['Days'].map((daysColumns, index) => {
    details[2][i18n.t('days')].map((daysColumns, index) => {
      days[index] = [];

      daysColumns.map(daysColumn => {
        days[index].push(daysColumn.value || '-');
      });
    });

    let size = perPageInventorySize;
    let tableHeaderArrays = [];
    for (let i = 0; i < tableHeader.length; i += size) {
      tableHeaderArrays.push(tableHeader.slice(i, i + size));
    }

    return {
      tableHeaderArrays,
      tableData,
    };
  }
};
