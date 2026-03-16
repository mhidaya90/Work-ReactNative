//constants
import { TOOL_ANALYSIS_TYPES } from '../../constants/AppConstants';

//localization
import i18n from '../../localization/i18n';

//helpers
import { getParsedToolData, isEmpty } from '../genericHelper';
import {
  exportManureScreenerGraph,
  exportManureScreenerGraphDataForVisitReport,
  exportManureScreenerPenBodyData,
  getFormattedRecentVisits,
} from '../manureScreenerHelper';
import { sortRecentVisitsForGraph } from '../toolHelper';
import { createDynamicObjForReqBody } from './visitReportHelper';
import { findFromSitePensById } from './visitReportHelper';
import {
  filterPensBySelection,
  getSelectedAnalysisCategories,
} from './visitReportHelper';

export const getManureScreenerBody = ({ tool, visitDetails, sitePens }) => {
  const manureScreenerData = getParsedToolData(visitDetails?.manureScreener);
  const body = {};
  const selectedAnalysis = getSelectedAnalysisCategories(
    tool?.analysisCategories,
  );
  selectedAnalysis.forEach(analysis => {
    if (
      analysis.value === TOOL_ANALYSIS_TYPES.PEN_ANALYSIS &&
      manureScreenerData.mstScores?.length > 0
    ) {
      const penAnalysisData = handlePenSelection(
        tool,
        manureScreenerData,
        sitePens,
      );

      if (!isEmpty(penAnalysisData)) {
        body.penAnalysis = penAnalysisData;
      }
    }
  });
  return body;
};

const handlePenSelection = (tool, manureScreenerData, sitePens) => {
  const penAnalysisBody = {};
  const pensList = filterPensBySelection(
    tool,
    manureScreenerData?.mstScores,
    sitePens,
  );

  if (pensList?.length > 0) {
    // useful for server generated pdf
    // const penDetailsArray = getPenDetailsArray(pensList, sitePens);

    const formattedRecentVisits = getFormattedRecentVisits(tool?.recentVisits);
    const sortedRecentVisits = sortRecentVisitsForGraph(formattedRecentVisits);

    const penDetailsArray = getPenDetailsArrayByVisit(
      pensList,
      sortedRecentVisits,
    );

    if (!isEmpty(penDetailsArray)) {
      penAnalysisBody.penAnalysisDetails = penDetailsArray;
    }

    const graphBody = getPenAnalysisGraphBody(
      pensList,
      sitePens,
      sortedRecentVisits,
      manureScreenerData,
    );
    if (!isEmpty(graphBody)) {
      penAnalysisBody.graph = graphBody;
    }
  }
  return penAnalysisBody;
};

/** Start Pen details */

const getPenDetailsArray = (pensList, sitePens) => {
  const data = pensList.reduce((result, pen) => {
    const sitePen = findFromSitePensById(sitePens, pen);
    if (sitePen) {
      const dynamicKey = `${sitePen?.name || ''}: ${pen.mstScoreName}`;
      const penObj = {
        [dynamicKey]: [
          createDynamicObjForReqBody(
            i18n.t('top'),
            pen?.topScaleAmountInGrams || '',
          ),
          createDynamicObjForReqBody(
            i18n.t('middle'),
            pen?.midScaleAmountInGrams || '',
          ),
          createDynamicObjForReqBody(
            i18n.t('bottom'),
            pen?.bottomScaleAmountInGrams || '',
          ),
        ],
      };
      result.push(penObj);
    }
    return result;
  }, []);
  return data;
};

/** End Pen details */

/** Start Graph details*/
const getPenAnalysisGraphBody = (
  pensList,
  sitePens,
  recentVisits = [],
  manureScreenerData,
) => {
  if (recentVisits?.length > 0) {
    // const formattedRecentVisits = getFormattedRecentVisits(recentVisits);
    // const sortedRecentVisits = sortRecentVisitsForGraph(formattedRecentVisits);
    const graphData = pensList.reduce((result, pen) => {
      const sitePen = findFromSitePensById(sitePens, pen);

      const model = exportManureScreenerGraphDataForVisitReport(
        recentVisits,
        pen,
      );

      const graphObj = {
        penName: sitePen?.name || pen?.penName || '',
        penId: sitePen?.penId || pen?.penId,
        onScreenPercentage: model || null,
      };

      result.push(graphObj);

      // if (sitePen) {
      // const model = exportManureScreenerGraph(
      //   null,
      //   recentVisits,
      //   pen,
      //   manureScreenerData.mstGoal,
      // );
      // const graphObj = {
      //   penName: sitePen?.name || '',
      //   onScreenPercentage: model?.onScreenPercentage || null,
      // };
      // }
      return result;
    }, []);
    return graphData;
  }
  return null;
};
/** End Graph details */

const getPenDetailsArrayByVisit = (pensList, recentVisits = []) => {
  if (recentVisits?.length > 0) {
    const penAnalysisArray = pensList?.map(pen => {
      const model = exportManureScreenerPenBodyData(recentVisits, pen);
      return model;
    });

    return penAnalysisArray;
  }

  return [];
};
