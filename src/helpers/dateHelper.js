import {
  isValid,
  format,
  formatDistance,
  parseISO,
  getUnixTime,
  differenceInDays,
  subDays,
  isSameYear,
  getDay,
  isToday,
  isTomorrow,
  startOfDay,
  formatDistanceToNowStrict,
} from 'date-fns';
import { getLanguage } from '../localization/i18n';
import * as dateFNSLocale from 'date-fns/locale';
import {
  DATE_FORMATS,
  PUBLISHED_VISIT_DAYS_LIMIT,
} from '../constants/AppConstants';

//language locales
import { fr, frCA, it, ko, pl, pt, ru, en, zhCN } from 'date-fns/locale';
import { logEvent } from './logHelper';

const getDifferenceBetweenDates = (date1, date2) => {
  date1 = new Date(date1);
  date2 = new Date(date2);
  const diffDays = differenceInDays(date2, date1);
  return diffDays;
};

export const isCurrentYear = date => {
  return isSameYear(new Date(date), new Date());
};

const getCurrentDateWithCurrentTime = date => {
  const now = new Date();
  const currentDateTime = new Date(date);
  currentDateTime.setHours(
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    0,
  );
  return currentDateTime;
};

const getCurrentDayTimesTamp = () => {
  return new Date(subDays(new Date(), 0)).getTime();
};
const getLastSevenDaysTimesTamp = () => {
  return new Date(subDays(new Date(), 7)).getTime();
};
const getDateInFromNowFormat = (date, strictDistanceToNow = false) => {
  if (date) {
    // added locale to convert time to selected language
    // switch statement for country code difference
    let selectedLocale = 'en';
    switch (getLanguage()) {
      case 'frca':
        selectedLocale = 'frCA';
        break;
      case 'zh':
        selectedLocale = 'zhCN';
        break;
      default:
        selectedLocale = getLanguage();
        break;
    }
    date = parseISO(date);

    if (strictDistanceToNow) {
      return formatDistanceToNowStrict(date, {
        addSuffix: true,
        locale: dateFNSLocale[selectedLocale],
      });
    }
    return formatDistance(date, new Date(), {
      addSuffix: true,
      locale: dateFNSLocale[selectedLocale],
    });
  }
  return null;
};

export const getFormattedDateUTC = date => {
  try {
    if (date) {
      date = new Date(date);
      let formattedDate =
        date.getUTCMonth() +
        1 +
        '/' +
        date.getUTCDate() +
        '/' +
        date.getUTCFullYear().toString().slice(2);

      return formattedDate;
    }
  } catch (error) {
    logEvent('helpers -> dateHelper -> getFormattedDate UTC error', error);
    console.log('getFormattedDate UTC error', error);
  }
};

export const getFormattedDate = (
  dateString,
  dateFormat = 'MMM dd, yyyy',
  removeTimezone,
) => {
  try {
    if (removeTimezone) {
      dateString = dateString.slice(0, 19);
    }
    const date = new Date(dateString);
    if (isValid(date)) {
      //making it resuable
      return format(date, dateFormat, { locale: getLanguageLocale() });
    }
    return '';
  } catch (error) {
    logEvent('helpers -> dateHelper -> getFormattedDate error', error);
    console.log('error', error);
    return '';
  }
};

export const isTodayDate = date => {
  return isToday(date);
};

export const isTomorrowDate = date => {
  return isTomorrow(date);
};

export const getFormattedTime = (unixTime, timeFormat = 'hh:mm') => {
  if (unixTime) {
    const formattedTime = format(unixTime, timeFormat);
    return formattedTime;
  }
};

/**
 * @TODO remove when getting pen data from backend.
 * @DESC added for pen analysis line graph to show previous seven days
 */
export const getLastSevenDates = (numberOfDays = 7) => {
  const dates = [];
  for (let i = 0; i < numberOfDays; i++) {
    const newDate = new Date();
    const date = format(newDate.setDate(newDate.getDate() - i), 'MM/dd');
    dates.push(date);
  }
  return dates.reverse();
};

export const getUnixTimestamp = date => {
  return new Date(date).getTime();
};

export const convertToUtc = dateString => {
  try {
    const now = new Date();
    const ending = new Date(dateString);
    ending.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
    const date = new Date(ending);
    return new Date(date).toISOString();
  } catch (error) {
    logEvent('helpers -> dateHelper -> convertToUtc error', error);
    console.log('catch error', error);
    return dateString;
  }
};

export const convertToUtcTimezone = date => {
  try {
    const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utc.toISOString();
  } catch (error) {
    logEvent('helpers -> dateHelper -> convertToUtcTimezone error', error);
    console.log('catch error', error);
    return date;
  }
};

export const getDateFormattedByYear = date => {
  if (dateHelper.isCurrentYear(date)) {
    return dateHelper.getFormattedDate(date, DATE_FORMATS.MMM_DD_H_MM);
  } else {
    return dateHelper.getFormattedDate(date, DATE_FORMATS.MMM_DD_YY_H_MM);
  }
};

export const getLanguageLocale = () => {
  return {
    en: en,
    fr: fr,
    frca: frCA,
    it: it,
    ko: ko,
    pl: pl,
    pt: pt,
    ru: ru,
    zh: zhCN,
  }[getLanguage()];
};

export const getWeekDays = () => {
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
    // Get the date for the current day of the week
    const date = new Date();
    const dayOfWeek = getDay(date);
    const diff = index - dayOfWeek;
    date.setDate(date.getDate() + diff);

    // Format the weekday names in multiple languages
    return format(date, 'iii', { locale: getLanguageLocale() });
  });

  return weekdays;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getMonthNames = () => {
  // Format the month names in multiple languages
  const months = MONTH_NAMES?.map(monthName =>
    format(new Date(2000, MONTH_NAMES.indexOf(monthName)), 'MMMM', {
      locale: getLanguageLocale(),
    }),
  );

  return months;
};

export const getDateNDaysOlder = (noOfDays = PUBLISHED_VISIT_DAYS_LIMIT) => {
  let olderDate = subDays(new Date(), noOfDays);
  //if needed add if else clause for start of day/end of day with params (bool)
  return olderDate;
};

export const dateHelper = {
  getDifferenceBetweenDates,
  getDateInFromNowFormat,
  getFormattedDateUTC,
  getFormattedDate,
  getLastSevenDates,
  getUnixTimestamp,
  convertToUtc,
  getCurrentDayTimesTamp,
  getLastSevenDaysTimesTamp,
  getCurrentDateWithCurrentTime,
  isCurrentYear,
  isTodayDate,
  isTomorrowDate,
  convertToUtcTimezone,
  getDateNDaysOlder,
};
