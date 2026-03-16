import { getLanguage } from '../localization/i18n';

export const sortAccountsByName = (a, b) => {
  const nameA = a.value?.toLowerCase();
  const nameB = b.value?.toLowerCase();

  let currentLanguage = getLanguage();

  /**
   * @description
   * adding extra check for French Canada(language) which is frca in app,
   * but JS localCompare required region based language(fr-CA or en-US).
   *
   * @link to the issue of accounts are not showing on UI level because of JS local compare crash at run time.
   * change frca language to match French Canadian region in order to show accounts after comparing locales against there names(values).
   */
  if (currentLanguage.match('frca')) {
    currentLanguage = 'fr-CA';
  }

  return nameA?.localeCompare(nameB, currentLanguage, { numeric: true });
};
