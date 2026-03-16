import React from 'react';
//helpers
import { capitalizeFirstLowercaseRest } from './alphaNumericHelper';

//localization
import i18n, { getLanguage } from '../localization/i18n';

import * as dateFNSLocale from 'date-fns/locale';

//lodash
import _ from 'lodash';

//constants
import {
  OLDER,
  TODAY,
  HAS_PUBLISHED,
  NOTIFICATION_TYPE,
  YOUR_VISIT,
  YOUR_ACTION,
  DUE_BY_TODAY,
  DUE_BY_TOMORROW,
  CLICK_TO_SEE_DETAILS,
} from '../constants/AppConstants';

//date-fns
import { isSameDay, formatDistanceToNow } from 'date-fns';
import {
  APP_NOT_SYNC,
  MARKETING_CAMPAIGN,
  ONE_HOUR_BEFORE_ACTION,
  RELEASE_NOTES,
  SPECIAL_ACTIONS,
  TWENTY_FOURS_BEFORE_ACTION,
  VISIT_AUTO_PUBLISH,
} from '../constants/AssetSVGConstants';
import { isHttpUrl } from './genericHelper';
import { requestModelForFetchingMedia } from '../services/models/s3Media';
import { logEvent } from './logHelper';

export const parseNotificationData = notificationState => {
  let notifications = [];

  const locale = getSelectedLocale();
  let result = notificationState.notificationData?.reduce((group, el) => {
    let title = null;
    const raw = el;

    // format the time
    let time = '';
    if (
      el.type === NOTIFICATION_TYPE.ONE_HOUR_BEFORE_ACTION_IS_DUE ||
      el.type === NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_BEFORE_ACTION_IS_DUE
    ) {
      time = formatDistanceToNow(
        raw?.scheduleTime || raw?.mobileCreatedAt,
        new Date(),
        {
          addSuffix: true,
          includeSeconds: true,
          locale: dateFNSLocale[locale],
        },
      );
    } else {
      time = formatDistanceToNow(
        raw.mobileCreatedAt || raw.createdDate,
        new Date(),
        {
          addSuffix: true,
          includeSeconds: true,
          locale: dateFNSLocale[locale],
        },
      );
    }

    // show notification in today and older section
    let days = false;
    if (
      el.type === NOTIFICATION_TYPE.ONE_HOUR_BEFORE_ACTION_IS_DUE ||
      el.type === NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_BEFORE_ACTION_IS_DUE
    ) {
      days = isSameDay(new Date().getTime(), raw.scheduleTime);
    } else {
      days = isSameDay(
        new Date().getTime(),
        raw.mobileCreatedAt || raw.createdDate,
      );
    }

    if (
      !!days &&
      [
        NOTIFICATION_TYPE.ONE_HOUR_BEFORE_ACTION_IS_DUE,
        NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_BEFORE_ACTION_IS_DUE,
        NOTIFICATION_TYPE.RELEASES_NOTES,
        NOTIFICATION_TYPE.SPECIAL_ACTIONS,
        NOTIFICATION_TYPE.MARKETING_CAMPAIGN,
      ].includes(el.type)
    ) {
      const scheduledTime = new Date(raw.scheduleTime).getTime();
      const currentTime = new Date().getTime();
      if (scheduledTime <= currentTime) {
        title = TODAY;
      }
    }

    if (!days) {
      title = OLDER;
    } else if (
      !!days &&
      [
        NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_AND_NO_SYNC,
        NOTIFICATION_TYPE.VISIT_AUTO_PUBLISHED,
        NOTIFICATION_TYPE.RELEASES_NOTES,
        NOTIFICATION_TYPE.MARKETING_CAMPAIGN,
        NOTIFICATION_TYPE.SPECIAL_ACTIONS,
      ].includes(el.type)
    ) {
      title = TODAY;
    }

    if (title && !group[title]) {
      group[title] = { title: title, data: [] };
    }
    const result = {
      ...raw,
      ago: capitalizeFirstLowercaseRest(time),
    };

    // ONE_HOUR_BEFORE_ACTION_IS_DUE
    // TWENTY_FOUR_HOURS_BEFORE_ACTION_IS_DUE
    if (
      el.type == NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_BEFORE_ACTION_IS_DUE ||
      el.type == NOTIFICATION_TYPE.ONE_HOUR_BEFORE_ACTION_IS_DUE
    ) {
      if (raw.scheduleTime) {
        const scheduledTime = new Date(raw.scheduleTime).getTime();
        const currentTime = new Date().getTime();
        // Show notification if current time is at or past the scheduled time
        if (currentTime >= scheduledTime) {
          group[title].data.push(result);
        }
      }
    }

    // VISIT_AUTO_PUBLISHED
    // TWENTY_FOUR_HOURS_AND_NO_SYNC
    if (
      [
        NOTIFICATION_TYPE.VISIT_AUTO_PUBLISHED,
        NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_AND_NO_SYNC,
        NOTIFICATION_TYPE.RELEASES_NOTES,
        NOTIFICATION_TYPE.SPECIAL_ACTIONS,
        NOTIFICATION_TYPE.MARKETING_CAMPAIGN,
      ].includes(el.type)
    ) {
      group[title].data.push(result);
    }

    return group;
  }, {});
  notifications = Object.values(result);
  notifications = _.orderBy(notifications, ['title'], ['desc']);
  return notifications;
};

const getSelectedLocale = () => {
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
  return selectedLocale;
};

export const getSyncNotificationMessage = lastSynced => {
  const el = {
    title: i18n.t('syncMessage'),
    type: NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_AND_NO_SYNC,
    createdDate: lastSynced,
    isRead: false,
    description: i18n.t('syncMessage'),
  };
  return el;
};

export const generateNotebookPayload = (
  model,
  message,
  time,
  type,
  formattedTime,
) => {
  const e = {
    type: type,
    isRead: false,
    title: model?.title,
    description: formattedTime,
    createdDate: model?.createdDate,
    scheduleTime: time,
    noteId: model?.sv_id,
    localNoteId: model?.id,
    keys: {
      noteId: model?.sv_id,
      localNoteId: model?.id,
      scheduleTime: time,
      accountId: model?.accountId,
      localAccountId: model?.localAccountId,
      visitId: model?.visitId,
      localVisitId: model?.localVisitId,
      siteId: model?.siteId,
      localSiteId: model?.localSiteId,
      section: model?.section,
      sectionTitle: model?.sectionTitle,
    },
  };
  return e;
};

export const notificationMessage = item => {
  const { type, description, title } = item;

  if (type === NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_AND_NO_SYNC) {
    return `${i18n.t('syncMessage')}`;
  } else if (type === NOTIFICATION_TYPE.VISIT_AUTO_PUBLISHED) {
    return `${i18n.t(YOUR_VISIT)} ${description} ${i18n.t(HAS_PUBLISHED)}`;
  } else if (type === NOTIFICATION_TYPE.ONE_HOUR_BEFORE_ACTION_IS_DUE) {
    return `${i18n.t(YOUR_ACTION)} ${title} ${i18n.t(
      DUE_BY_TODAY,
    )} ${description}. ${i18n.t(CLICK_TO_SEE_DETAILS)}`;
  } else if (
    type === NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_BEFORE_ACTION_IS_DUE
  ) {
    return `${i18n.t(YOUR_ACTION)} ${title} ${i18n.t(
      DUE_BY_TOMORROW,
    )} ${description}. ${i18n.t(CLICK_TO_SEE_DETAILS)}`;
  }
};

export const getNotificationData = item => {
  const description = item?.description;
  const title = item?.title;

  switch (item.type) {
    case NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_AND_NO_SYNC:
      return {
        icon: <APP_NOT_SYNC />,
        notificationMessage: i18n.t('syncMessage'),
      };

    case NOTIFICATION_TYPE.VISIT_AUTO_PUBLISHED:
      return {
        icon: <VISIT_AUTO_PUBLISH />,
        notificationMessage: `${i18n.t(YOUR_VISIT)} ${description} ${i18n.t(
          HAS_PUBLISHED,
        )}`,
      };

    case NOTIFICATION_TYPE.ONE_HOUR_BEFORE_ACTION_IS_DUE:
      return {
        icon: <TWENTY_FOURS_BEFORE_ACTION />,
        notificationMessage: `${i18n.t(YOUR_ACTION)} ${title} ${i18n.t(
          DUE_BY_TODAY,
        )} ${description}. ${i18n.t(CLICK_TO_SEE_DETAILS)}`,
      };

    case NOTIFICATION_TYPE.TWENTY_FOUR_HOURS_BEFORE_ACTION_IS_DUE:
      return {
        icon: <ONE_HOUR_BEFORE_ACTION />,
        notificationMessage: `${i18n.t(YOUR_ACTION)} ${title} ${i18n.t(
          DUE_BY_TOMORROW,
        )} ${description}. ${i18n.t(CLICK_TO_SEE_DETAILS)}`,
      };

    case NOTIFICATION_TYPE.MARKETING_CAMPAIGN:
      return {
        icon: <MARKETING_CAMPAIGN />,
        notificationMessage: `${title} ${description}.`,
      };

    case NOTIFICATION_TYPE.RELEASES_NOTES:
      return {
        icon: <RELEASE_NOTES />,
        notificationMessage: `${title}${'\n'}${description}.`,
      };

    case NOTIFICATION_TYPE.SPECIAL_ACTIONS:
      return {
        icon: <SPECIAL_ACTIONS />,
        notificationMessage: `${title}${'\n'}${description}.`,
      };

    default:
      return <></>;
  }
};

export const replaceUnreadNotificationToRead = (
  notificationToReplace,
  notificationList,
) => {
  const updatedList = notificationList?.map(item => {
    if (item?.id === notificationToReplace?.id) {
      if (item._raw) {
        item._raw.isRead = true;
      } else {
        item.isRead = true;
      }

      return item;
    }

    return item;
  });

  return updatedList || [];
};

export const getNoteBookModelFromNotificationKeys = keys => {
  const model = {
    localId: keys?.localNoteId,
    noteId: keys?.noteId,
    accountId: keys?.accountId,
    localAccountId: keys?.localAccountId,
    visitId: keys?.visitId,
    localVisitId: keys?.localVisitId,
    siteId: keys?.siteId,
    localSiteId: keys?.localSiteId,
    section: keys?.section,
    sectionTitle: keys?.sectionTitle,
  };

  return model;
};

/**
 * @description
 * mapper function for mapping dashboard notification media items to fetch
 * @param {Array} mediaData of media items from notifications that needs to be fetched
 * @returns
 */
export function mapDashboardNotificationsMediaToFetch(mediaData = []) {
  try {
    const mediaIdToFetch = [];
    const dataToFetch = [];
    mediaData?.forEach(element => {
      const id = `${element?.notificationId}/${element.mediaId}`;
      let isURL = isHttpUrl(id);
      if (!isURL) {
        mediaIdToFetch.push(requestModelForFetchingMedia(id));
        dataToFetch.push(element);
      }
    });

    return { dataToFetch, mediaIdToFetch };
  } catch (error) {
    console.log('error - mapNotebookMediaToFetch', error);
    return null;
  }
}

/**
 * @description
 * Function to process dashboard notifications and return formatted data
 * Filters notifications based on durationFrom and durationTo timeframe
 * @param {Array} notifications Array of dashboard notifications
 * @returns {Array} Array of processed notifications with updated status that are within the valid timeframe
 */
export function processDashboardNotifications(notifications = []) {
  try {
    if (!notifications || !notifications.length) {
      return [];
    }

    const currentDate = new Date();

    // Filter notifications that are within the valid timeframe
    const validNotifications = notifications.filter(notification => {
      // Skip notifications if either duration is missing, null, or empty
      if (
        !notification.durationFrom ||
        !notification.durationTo ||
        notification.durationFrom === null ||
        notification.durationTo === null ||
        notification.durationFrom === '' ||
        notification.durationTo === ''
      ) {
        return false;
      }

      const fromDate = new Date(notification.durationFrom);
      const toDate = new Date(notification.durationTo);

      // Validate if dates are valid
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return false;
      }

      // Check if current date falls within the timeframe
      const isAfterFrom = currentDate >= fromDate;
      const isBeforeTo = currentDate <= toDate;

      return isAfterFrom && isBeforeTo;
    });
    console.log('validNotifications', validNotifications);

    return validNotifications;
  } catch (error) {
    console.log('error - processDashboardNotifications', error);
    logEvent(
      'helpers -> notificationHelper -> processDashboardNotifications Exception: ',
      error,
    );
    return [];
  }
}
