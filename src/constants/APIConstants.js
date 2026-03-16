import { stringIsEmpty } from '../helpers/alphaNumericHelper';
import AccessToken from '../services/api';

export default {
  //#region user and auth
  FETCH_ACCESS_TOKEN: (authServer, accessToken) =>
    `auth/fetchAccessToken/${authServer}?accessToken=${accessToken}`,
  LOGOUT: 'auth/logout',
  GET_USER_BY_EMAIL: username => `user/by/${AccessToken.idToken}`,
  FETCH_AND_UPDATE_USER_INFO: 'user/fetchAndUpdateUserInfo',
  // `user/email/${username}?idToken=${AccessToken.idToken}`,
  REFRESH_TOKEN: 'security/oauth/token',
  UPDATE_USER_PREFERENCES: 'userPreferences',
  PUT_USER_BUILD_INFO: 'user',
  //#endregion

  //#region geolocation
  GET_COUNTRIES: (lastSyncTime, pageNo, size) =>
    `geoLocation/countries/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=id`,
  GET_STATES_BY_COUNTRY_CODE: (countryCodes, lastSyncTime, pageNo, size) =>
    `geoLocation/statesByCountryCodes/paginated?countryCodes=${countryCodes}&lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=id`,
  GET_CITIES: (lastSyncTime, pageNo, size) =>
    `geoLocation/cities/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=id`,
  //#endregion

  //#region AWS
  GET_PRESIGNED_URLS: 'aws/s3/generatePresignedUrls',
  //#endregion

  //#region animalClass
  GET_ANIMAL_CLASS: 'pens/getAnimalClasses',
  //#endregion

  //#region rof price list
  GET_ROF_PRICE_LIST: 'pricing?returnOverFeedType=ALL',
  //#endregion

  //#region enums
  GET_ENUMS: 'enums',
  // multilingual enums
  GET_MULTILINGUAL_ENUMS: 'enums/multilingual',
  //#endregion

  //#region  download report
  DOWNLOAD_TOOL_GRAPH_EXCEL: reportType =>
    `reports/exportToExcel/${reportType}`,
  DOWNLOAD_TOOL_GRAPH_IMAGE: reportType =>
    `reports/exportToImage/${reportType}`,
  //#endregion

  //#region customer prospect
  GET_CUSTOMER: (accountType, email, lasySyncTime, pageNo, size) =>
    `account/paginated?accountType=${accountType}&email=${email}&lastSyncTime=${lasySyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  GET_PROSPECT: (accountType, email, lasySyncTime, pageNo, size) =>
    `account/paginated?accountType=${accountType}&email=${email}&lastSyncTime=${lasySyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  SAVE_PROSPECT: 'account',
  SAVE_CUSTOMER: 'account',
  // get all accounts
  GET_ALL_ACCOUNTS: () => `account/filteredAccounts`,
  //#endregion

  //#region segment
  GET_SEGMENTS: 'segment',
  //#endregion

  //#region sites
  // get all sites that are valid
  GET_ALL_SITES: () => `site/filteredSites`,
  GET_SITES: (lastSyncTime, pageNo, size) =>
    `site/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  SAVE_SITE: 'site',
  DOWNLOAD_SHARE_POINT_REPORT: siteId =>
    `ddwReports/latestSummaryReport/${siteId}`,
  DOWNLOAD_SHARE_POINT_DETAIL_REPORT: siteId =>
    `ddwReports/latestDetailedReport/${siteId}`,
  //#endregion

  //#region pens
  GET_PENS: (lastSyncTime, pageNo, size) =>
    `pens/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  UPDATE_PEN: 'pens',
  SAVE_PEN: 'pens',
  GET_PEN_DIETS: (lastSyncTime, pageNo, size) =>
    `pens/diets?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  //#endregion

  //#region visits
  GET_VISITS: (lastSyncTime, pageNo, size) =>
    `visit/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  SAVE_VISIT: 'visit',
  UPDATE_VISIT: 'visit',

  GET_AUTOPUBLISH_VISITS: () => `visit/autopublish`,

  //filtered visit history
  GET_FILTERED_VISITS: (
    lastSyncTime,
    pageNo,
    size,
    startDate,
    endDate,
    visitStatus,
    customerIds,
    siteIds,
    tools,
  ) => {
    //TODO: wasi update this logic and move to models or helper
    let url = `visit/paginated/online?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=id&sorting=desc`;
    for (const index in visitStatus)
      if (!stringIsEmpty(visitStatus[index]))
        url += `&visitStatus=${visitStatus[index]}`;

    for (const index in customerIds)
      if (!stringIsEmpty(customerIds[index]))
        url += `&customerId=${customerIds[index]}`;

    for (const index in siteIds)
      if (!stringIsEmpty(siteIds[index])) url += `&siteId=${siteIds[index]}`;

    for (const index in tools)
      if (!stringIsEmpty(tools[index])) url += `&tools=${tools[index]}`;

    url += `&to=${endDate}`;
    url += `&from=${startDate}`;

    return url;
  },

  DOWNLOAD_VISIT_REPORT: 'reports/visitReport',

  VISIT_REPORT_SHARE_POINT: 'reports/sharepoint/visitReport',

  //#endregion

  //#region tools
  GET_EAR_TAGS: (lastSyncTime, pageNo, size) =>
    `earTags/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  SAVE_EAR_TAG: 'earTags',

  GET_SILAGES: (lastSyncTime, pageNo, size) =>
    `silage/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  SAVE_SILAGE: 'silage',
  //#endregion

  //#region notebook
  GET_NOTE_BOOK: (lastSyncTime, pageNo, size) =>
    `notes/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=id&sorting=asc`,
  SAVE_NOTEBOOK: 'notes',
  //#endregion

  //#region  notifications
  GET_NOTIFICATIONS: (lastSyncTime, pageNo, size) =>
    `notification/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  GET_DASHBOARD_NOTIFICATIONS: (lastSyncTime, pageNo, size) =>
    `notification/dashboardNotifications/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}`,
  SAVE_NOTIFICATION: 'notification',
  MARK_NOTIFICATIONS: 'notification/read',
  // get all notifications that are valid
  GET_ALL_NOTIFICATIONS: () => `notification/filteredNotifications`,

  //#endregion

  //#region get latest versions and force udpate config
  GET_VERSION_CONFIG: `diagnostics/buildInfo`,
  //#endregion

  //#region calf heifer growth site animals
  GET_CALF_HEIFER_GROWTH_SITE_ANIMALS: (lastSyncTime, pageNo, size) =>
    `visit/calfHeiferGrowthAnimals/paginated?lastSyncTime=${lastSyncTime}&page=${pageNo}&size=${size}&sortBy=updated_date&sorting=asc`,
  //#endregion
};
