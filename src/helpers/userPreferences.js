import { favouritesEmptyObj } from '../database/mapperModels/user';
import i18n from '../localization/i18n';
import { parseJsonData } from './genericHelper';
import { logEvent } from './logHelper';

export const countryToolsModel = (
  countryTools = [],
  fav = favouritesEmptyObj,
) => {
  //doing this so that its easier to handle favourite tools. will run when login and the same format for all over the app.
  //always update favourite array too. as this will be generated from favourite.tools array data
  let favouriteTools = fav?.tools;

  countryTools.forEach(tool => {
    tool.name = i18n.t(tool.toolId);
    tool.isFavourite = favouriteTools?.includes(tool?.toolId);
  });
  return countryTools;
};

/**
 * Sanitizes user preferences before syncing with the backend.
 * Ensures only the required country tool fields are sent downstream.
 * @param {object|null} userPreferences - Raw user preference payload from local storage or API.
 * @returns {object|null} Sanitized user preferences ready for backend sync.
 */
export function getUserPreferencesSyncModel(userPreferences = null) {
  try {
    if (userPreferences) {
      userPreferences = parseJsonData(userPreferences);

      const countryTools = userPreferences?.countryTools?.map(item => {
        return {
          toolGroupId: item.toolGroupId,
          toolId: item.toolId,
        };
      });
      userPreferences.countryTools = countryTools;
    }

    return userPreferences;
  } catch (error) {
    console.log(
      'helpers -> userPreferences -> getUserPreferencesSyncModel Exception: ',
      error,
    );
    logEvent(
      'helpers -> userPreferences -> getUserPreferencesSyncModel Exception: ',
      error,
    );
  }
}
