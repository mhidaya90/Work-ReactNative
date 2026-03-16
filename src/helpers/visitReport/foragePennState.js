//constants
import {
  DATE_FORMATS,
  SCORER_ENUMS,
  TOOL_ANALYSIS_TYPES,
} from '../../constants/AppConstants';
import {
  FORAGE_PEN_SCORERS,
  FORAGE_PEN_SCORERS_FIELD_INDEX,
  FORAGE_PENN_OTHER_DEFAULT_GOALS,
  OTHER,
} from '../../constants/toolsConstants/ForagePenState';
import colors from '../../constants/theme/variables/customColor';

//localization
import i18n from '../../localization/i18n';

//store
import store from '../../store';

//helpers
import {
  exportForagePennGraphData,
  getForagePennStateGraphs,
  getFormattedRecentVisits,
  getInitialGoalsValue,
  getOnScreenPercent,
  parseSilageList,
} from '../foragePennHelper';
import { getParsedToolData, isEmpty } from '../genericHelper';
import { sortRecentVisitsForGraph } from '../toolHelper';
import {
  convertArrayOfObjValuesToNumber,
  stringIsEmpty,
} from '../alphaNumericHelper';
import {
  getSelectedAnalysisCategories,
  createDynamicObjForReqBody,
} from './visitReportHelper';
import { getFormattedDate } from '../dateHelper';

export const getBodyForForagePennState = ({ tool, visitDetails }) => {
  const foragePennStateData = getParsedToolData(visitDetails?.foragePennState);
  const body = {};
  const enumsState = store.getState()?.enums?.enum || {};
  const silageTypes = getSilageTypes(enumsState);
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );

  if (
    selectedAnalysis?.length > 0 &&
    selectedAnalysis[0].value === TOOL_ANALYSIS_TYPES.HERD_ANALYSIS &&
    foragePennStateData
  ) {
    body.scorerLabel = getScorerName(enumsState, foragePennStateData);
    const toolDetails = getToolDetails(foragePennStateData, silageTypes);

    const offlineReportToolDetails = getToolDetailsBody(
      foragePennStateData,
      tool?.recentVisits,
      silageTypes,
    );
    body.offlineReportToolDetails = isEmpty(offlineReportToolDetails)
      ? null
      : offlineReportToolDetails;

    body.details = isEmpty(toolDetails) ? null : toolDetails;
    // const graphsBody = getGraphBody(
    //   foragePennStateData,
    //   tool?.recentVisits,
    //   enumsState,
    //   silageTypes,
    // );

    const graphsBody = getOfflineGraphBody(foragePennStateData, silageTypes);

    body.graphs = graphsBody;
  }
  return body;
};

const getScorer = (key, scorerEnums) => {
  const scorer =
    scorerEnums &&
    scorerEnums?.length > 0 &&
    scorerEnums.find(el => el.key == key)?.value;
  return scorer || '';
};

const getScorerName = (enumsState, scorerData) => {
  const scorerEnums = enumsState?.scorers || [];
  const name = `${i18n.t('scorer')}: ${getScorer(
    scorerData?.scorer,
    scorerEnums,
  )}`;
  return name;
};

const getSilageTypes = enumsState => {
  const silageState = store.getState().silage;
  const silageEnums = enumsState?.silageType || [];
  const silages = parseSilageList(silageState?.silageList) || [];
  const silageTypes = [...silageEnums, ...silages];
  return silageTypes;
};

/** Start details */
const getToolDetails = (foragePennStateData, silageTypes) => {
  if (foragePennStateData?.inputs?.length > 0) {
    const data = foragePennStateData.inputs.map((item, index) => {
      return {
        [`${i18n.t('PSP')} ${index + 1} - ${getSilageName(item, silageTypes)}`]:
          getSilageDetails(item),
      };
    });
    return data;
  }
  return null;
};

const getSilageName = (el, silageTypes) => {
  const data = silageTypes?.find(silage => silage.key == el?.silage);
  const filteredSilage = silageTypes?.find(
    silage => silage.key === el?.silageId,
  );
  if (el?.silage == OTHER) {
    const value = `${data?.value || ''} - ${
      el?.silageName || filteredSilage?.value || ''
    }`;
    return value || '';
  }
  return data?.value || '';
};

const getSilageDetails = item => {
  return [
    createDynamicObjForReqBody(i18n.t('top_19mm'), item?.top || ''),
    createDynamicObjForReqBody(i18n.t('mid1_18mm'), item?.mid1 || ''),
    createDynamicObjForReqBody(i18n.t('mid2_4mm'), item?.mid2 || ''),
    createDynamicObjForReqBody(i18n.t('tray'), item?.tray || ''),
  ];
};

/** End details */

/** Start graphs */

const getGraphBody = (scorerData, recentVisits, enumsState, silageTypes) => {
  if (recentVisits && recentVisits?.length > 0) {
    const foragePenData = { foragePennState: scorerData.inputs };
    const graphTypes = getForagePennStateGraphs(
      foragePenData,
      enumsState,
      silageTypes,
    );
    const formattedRecentVisits = getFormattedRecentVisits(recentVisits);
    const srotedRecentVisits = sortRecentVisitsForGraph(formattedRecentVisits);
    const graphsData = graphTypes.map(grpahItem => {
      const model = exportForagePennGraphData(
        null,
        srotedRecentVisits,
        enumsState,
        grpahItem,
        getScorerName(enumsState, scorerData),
        scorerData,
      );
      return {
        pspsLabel: model?.pspsLabel || '',
        onScreenPercentage:
          convertArrayOfObjValuesToNumber(model.onScreenPercentage) || null,
      };
    });
    return graphsData;
  }
  return null;
};

/** End fraphs */

const getToolDetailsBody = (foragePennStateData, recentVisits, silageTypes) => {
  if (foragePennStateData?.inputs?.length > 0) {
    const formattedRecentVisits = getFormattedRecentVisits(recentVisits);
    const sortedRecentVisits = sortRecentVisitsForGraph(formattedRecentVisits);

    const data = foragePennStateData.inputs.map((item, index) => {
      const data = getPSPSFromRecentVisits(
        sortedRecentVisits,
        item,
        foragePennStateData?.scorer,
        index,
      );

      return {
        PSLabel: `${i18n.t('PSP')} ${index + 1} - ${getSilageName(
          item,
          silageTypes,
        )}`,

        scorer: foragePennStateData?.scorer,

        visitDates: data.visitDates,

        top: data.top,
        mid1: data.mid1,
        mid2: data.mid2,
        tray: data.tray,
        ...data,
      };
    });

    return data;
  }
};
const checkIsScorerInputEmpty = input => {
  let arrOfScorers = FORAGE_PEN_SCORERS;
  let isEmpty = true;

  arrOfScorers.map(i => {
    if (input[i] !== null) {
      isEmpty = false;
    }
  });
  return isEmpty;
};

const getPSPSFromRecentVisits = (recentVisits, foragePS, scorer, index) => {
  let PSPSBody = {
    visitDates: [],
    top: [],
    mid1: [],
    mid2: [],
    tray: [],
    goalTop: [],
    goalMid1: [],
    goalMid2: [],
    goalTray: [],
    recentVisitComparisonGraphData: [
      { dataPoints: [], barColor: colors.topColor },
      { dataPoints: [], barColor: colors.mid1Color },
      { dataPoints: [], barColor: colors.mid2Color },
      { dataPoints: [], barColor: colors.trayColor },
    ],
  };

  if (scorer === SCORER_ENUMS.THREE_SCREEN) {
    delete PSPSBody.mid2;
    delete PSPSBody.goalMid2;
    delete PSPSBody.recentVisitComparisonGraphData[2];
  }

  if (recentVisits?.length > 0) {
    let showPSPComparisonGraph = false;

    recentVisits?.map(item => {
      if (item.scorerData?.scorer === scorer) {
        const filteredVisitScorer = item?.scorerData?.inputs?.find(inp => {
          if (!stringIsEmpty(inp?.silageId)) {
            return inp?.silageId === foragePS?.silageId;
          }
          if (!stringIsEmpty(inp?.silage)) {
            return (
              inp?.silage === foragePS?.silage && foragePS?.silage !== OTHER
            );
          }
        });

        let defaultGoals = null;

        if (item?.scorerData?.goals?.length > 0) {
          const filteredGoals = item?.scorerData?.goals?.filter(
            goal => goal?.silage === filteredVisitScorer?.silage,
          );

          defaultGoals = filteredGoals;
        }

        if (foragePS?.silage === OTHER && filteredVisitScorer) {
          if (!defaultGoals || defaultGoals.length == 0) {
            defaultGoals = FORAGE_PENN_OTHER_DEFAULT_GOALS.goals;
          }

          PSPSBody.goalTop.push(
            `${defaultGoals[0]?.goalMin} | ${defaultGoals[0]?.goalMax}`,
          );
          PSPSBody.goalMid1.push(
            `${defaultGoals[1]?.goalMin} | ${defaultGoals[1]?.goalMax}`,
          );
          if (scorer !== SCORER_ENUMS.THREE_SCREEN) {
            PSPSBody.goalMid2.push(
              `${defaultGoals[2]?.goalMin} | ${defaultGoals[2]?.goalMax}`,
            );
          }
          PSPSBody.goalTray.push(
            `${
              defaultGoals[scorer !== SCORER_ENUMS.THREE_SCREEN ? 3 : 2]
                ?.goalMin
            } | ${
              defaultGoals[scorer !== SCORER_ENUMS.THREE_SCREEN ? 3 : 2]
                ?.goalMax
            }`,
          );

          // @todo to be remove
          // commenting to show on screen % of other silages
          // PSPSBody.top.push(filteredVisitScorer?.top || '-');
          // PSPSBody.mid1.push(filteredVisitScorer?.mid1 || '-');
          // if (scorer !== SCORER_ENUMS.THREE_SCREEN) {
          //   PSPSBody.mid2.push(filteredVisitScorer?.mid2 || '-');
          // }
          // PSPSBody.tray.push(filteredVisitScorer?.tray || '-');

          PSPSBody.top.push(getOnScreenPercent(0, filteredVisitScorer) || '-');
          PSPSBody.mid1.push(getOnScreenPercent(1, filteredVisitScorer) || '-');
          if (scorer !== SCORER_ENUMS.THREE_SCREEN) {
            PSPSBody.mid2.push(
              getOnScreenPercent(2, filteredVisitScorer) || '-',
            );
          }
          PSPSBody.tray.push(getOnScreenPercent(3, filteredVisitScorer) || '-');

          PSPSBody.visitDates.push(
            getFormattedDate(item.date, DATE_FORMATS.MM_dd),
          );

          let isScorerEmpty = checkIsScorerInputEmpty(filteredVisitScorer);

          if (!isScorerEmpty) {
            showPSPComparisonGraph = true;
          }

          PSPSBody.recentVisitComparisonGraphData[0].dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: !!(
              filteredVisitScorer?.top >= 0 && filteredVisitScorer?.top != null
            )
              ? parseFloat(
                  getOnScreenPercent(
                    FORAGE_PEN_SCORERS_FIELD_INDEX.TOP,
                    filteredVisitScorer,
                    true,
                  ),
                )
              : null,
          });

          PSPSBody.recentVisitComparisonGraphData[1].dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: !!(
              filteredVisitScorer?.mid1 >= 0 &&
              filteredVisitScorer?.mid1 != null
            )
              ? parseFloat(
                  getOnScreenPercent(
                    FORAGE_PEN_SCORERS_FIELD_INDEX.MID1,
                    filteredVisitScorer,
                    true,
                  ),
                )
              : null,
          });

          if (scorer !== SCORER_ENUMS.THREE_SCREEN) {
            PSPSBody.recentVisitComparisonGraphData[2].dataPoints.push({
              x:
                getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
                item?.mobileLastUpdatedTime,
              y: !!(
                filteredVisitScorer?.mid2 >= 0 &&
                filteredVisitScorer?.mid2 != null
              )
                ? parseFloat(
                    getOnScreenPercent(
                      FORAGE_PEN_SCORERS_FIELD_INDEX.MID2,
                      filteredVisitScorer,
                      true,
                    ),
                  )
                : null,
            });
          }

          PSPSBody.recentVisitComparisonGraphData[3].dataPoints.push({
            x:
              getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
              item?.mobileLastUpdatedTime,
            y: !!(
              filteredVisitScorer?.tray >= 0 &&
              filteredVisitScorer?.tray != null
            )
              ? parseFloat(
                  getOnScreenPercent(
                    FORAGE_PEN_SCORERS_FIELD_INDEX.TRAY,
                    filteredVisitScorer,
                    true,
                  ),
                )
              : null,
          });
        } else if (foragePS?.silage === filteredVisitScorer?.silage) {
          if (!defaultGoals) {
            const initialGoalsValue = getInitialGoalsValue();

            const filteredSilageGoals = initialGoalsValue?.filter(
              item => item.silageType === foragePS?.silage,
            );

            if (filteredSilageGoals?.length > 0) {
              const goals = filteredSilageGoals[0].goals;

              defaultGoals = goals;
            }
          }

          PSPSBody.goalTop.push(
            `${defaultGoals[0]?.goalMin} | ${defaultGoals[0]?.goalMax}`,
          );
          PSPSBody.goalMid1.push(
            `${defaultGoals[1]?.goalMin} | ${defaultGoals[1]?.goalMax}`,
          );
          if (scorer !== SCORER_ENUMS.THREE_SCREEN) {
            PSPSBody.goalMid2.push(
              `${defaultGoals[2]?.goalMin} | ${defaultGoals[2]?.goalMax}`,
            );
          }
          PSPSBody.goalTray.push(
            `${
              defaultGoals[scorer !== SCORER_ENUMS.THREE_SCREEN ? 3 : 2]
                ?.goalMin
            } | ${
              defaultGoals[scorer !== SCORER_ENUMS.THREE_SCREEN ? 3 : 2]
                ?.goalMax
            }`,
          );

          PSPSBody.top.push(getOnScreenPercent(0, filteredVisitScorer) || '-');
          PSPSBody.mid1.push(getOnScreenPercent(1, filteredVisitScorer) || '-');
          if (scorer !== SCORER_ENUMS.THREE_SCREEN) {
            PSPSBody.mid2.push(
              getOnScreenPercent(2, filteredVisitScorer) || '-',
            );
          }
          PSPSBody.tray.push(getOnScreenPercent(3, filteredVisitScorer) || '-');

          PSPSBody.visitDates.push(
            getFormattedDate(item.date, DATE_FORMATS.MM_dd),
          );

          let isScorerEmpty = checkIsScorerInputEmpty(filteredVisitScorer);

          if (!isScorerEmpty) {
            showPSPComparisonGraph = true;
            PSPSBody.recentVisitComparisonGraphData[0].dataPoints.push({
              x:
                getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
                item?.mobileLastUpdatedTime,
              y: !!(
                filteredVisitScorer?.top >= 0 &&
                filteredVisitScorer?.top != null
              )
                ? parseFloat(
                    getOnScreenPercent(
                      FORAGE_PEN_SCORERS_FIELD_INDEX.TOP,
                      filteredVisitScorer,
                      true,
                    ),
                  )
                : null,
            });

            PSPSBody.recentVisitComparisonGraphData[1].dataPoints.push({
              x:
                getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
                item?.mobileLastUpdatedTime,
              y: !!(
                filteredVisitScorer?.mid1 >= 0 &&
                filteredVisitScorer?.mid1 != null
              )
                ? parseFloat(
                    getOnScreenPercent(
                      FORAGE_PEN_SCORERS_FIELD_INDEX.MID1,
                      filteredVisitScorer,
                      true,
                    ),
                  )
                : null,
            });

            if (scorer !== SCORER_ENUMS.THREE_SCREEN) {
              PSPSBody.recentVisitComparisonGraphData[2].dataPoints.push({
                x:
                  getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
                  item?.mobileLastUpdatedTime,
                y: !!(
                  filteredVisitScorer?.mid2 >= 0 &&
                  filteredVisitScorer?.mid2 != null
                )
                  ? parseFloat(
                      getOnScreenPercent(
                        FORAGE_PEN_SCORERS_FIELD_INDEX.MID2,
                        filteredVisitScorer,
                        true,
                      ),
                    )
                  : null,
              });
            }

            PSPSBody.recentVisitComparisonGraphData[3].dataPoints.push({
              x:
                getFormattedDate(item.date, DATE_FORMATS.MM_dd) +
                item?.mobileLastUpdatedTime,
              y: !!(
                filteredVisitScorer?.tray >= 0 &&
                filteredVisitScorer?.tray != null
              )
                ? parseFloat(
                    getOnScreenPercent(
                      FORAGE_PEN_SCORERS_FIELD_INDEX.TRAY,
                      filteredVisitScorer,
                      true,
                    ),
                  )
                : null,
            });
          }
        }
      }
    });
    PSPSBody.recentVisitComparisonGraphData = showPSPComparisonGraph
      ? PSPSBody.recentVisitComparisonGraphData
      : [];
    return PSPSBody;
  }

  return PSPSBody;
};

const getOfflineGraphBody = (scorerData, silageTypes) => {
  if (scorerData?.inputs?.length > 0) {
    let labels = [];
    let showPSPComparisonGraph = false;
    let pspsComparisonData = [
      { dataPoints: [], barColor: colors.topColor },
      { dataPoints: [], barColor: colors.mid1Color },
      { dataPoints: [], barColor: colors.mid2Color },
      { dataPoints: [], barColor: colors.trayColor },
    ];

    if (scorerData.scorer === SCORER_ENUMS.THREE_SCREEN) {
      delete pspsComparisonData[2];
    }

    scorerData.inputs.map((item, index) => {
      let isScorerEmpty = checkIsScorerInputEmpty(item);

      if (!isScorerEmpty) {
        showPSPComparisonGraph = true;

        labels.push(
          `${i18n.t('PSP')} ${index + 1} - ${getSilageName(item, silageTypes)}`,
        );

        pspsComparisonData[0].dataPoints.push({
          x: `${i18n.t('PSP')} ${index + 1} - ${getSilageName(
            item,
            silageTypes,
          )}`,
          y: !!(item?.top >= 0 && item?.top != null)
            ? parseFloat(
                getOnScreenPercent(
                  FORAGE_PEN_SCORERS_FIELD_INDEX.TOP,
                  item,
                  true,
                ),
              )
            : null,
        });

        pspsComparisonData[1].dataPoints.push({
          x: `${i18n.t('PSP')} ${index + 1} - ${getSilageName(
            item,
            silageTypes,
          )}`,
          y: !!(item?.mid1 >= 0 && item?.mid1 != null)
            ? parseFloat(
                getOnScreenPercent(
                  FORAGE_PEN_SCORERS_FIELD_INDEX.MID1,
                  item,
                  true,
                ),
              )
            : null,
        });

        if (scorerData.scorer !== SCORER_ENUMS.THREE_SCREEN) {
          pspsComparisonData[2].dataPoints.push({
            x: `${i18n.t('PSP')} ${index + 1} - ${getSilageName(
              item,
              silageTypes,
            )}`,
            y: !!(item?.mid2 >= 0 && item?.mid2 != null)
              ? parseFloat(
                  getOnScreenPercent(
                    FORAGE_PEN_SCORERS_FIELD_INDEX.MID2,
                    item,
                    true,
                  ),
                )
              : null,
          });
        }

        pspsComparisonData[3].dataPoints.push({
          x: `${i18n.t('PSP')} ${index + 1} - ${getSilageName(
            item,
            silageTypes,
          )}`,
          y: !!(item?.tray >= 0 && item?.tray != null)
            ? parseFloat(
                getOnScreenPercent(
                  FORAGE_PEN_SCORERS_FIELD_INDEX.TRAY,
                  item,
                  true,
                ),
              )
            : null,
        });
      }
    });

    return {
      data: showPSPComparisonGraph ? pspsComparisonData : [],
      labels: labels,
    };
  }

  return [];
};
