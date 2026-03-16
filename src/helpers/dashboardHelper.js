import { DATE_FORMATS } from '../constants/AppConstants';
import { dateHelper } from './dateHelper';
import i18n from '../localization/i18n';
import { getBase64ImageConverted } from './fileSystemHelper';
import { getMediaAbsolutePath } from './genericHelper';

export const getNoteTitle = value => {
  return value.length > 30
    ? value.substring(0, 30) +
        '...' +
        value.substring(value.length - 3, value.length)
    : value;
};

export const sortContacts = data => {
  return data.sort((item1, item2) =>
    item1.updated_at < item2.updated_at
      ? 1
      : item1.updated_at > item2.updated_at
      ? -1
      : 0,
  );
};

export const renderVisitDate = createdDate => {
  if (dateHelper.isCurrentYear(createdDate)) {
    if (dateHelper.isTodayDate(new Date(createdDate))) {
      return (
        i18n.t('today') +
        `, ${dateHelper.getFormattedDate(createdDate, DATE_FORMATS.HH_MM)}`
      );
    } else if (dateHelper.isTomorrowDate(new Date(createdDate))) {
      return (
        i18n.t('tomorrow') +
        `, ${dateHelper.getFormattedDate(createdDate, DATE_FORMATS.HH_MM)}`
      );
    }
    return dateHelper.getFormattedDate(createdDate, DATE_FORMATS.MMM_DD_H_MM);
  } else {
    return dateHelper.getFormattedDate(
      createdDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    );
  }
};

export const getImage = item => {
  if (item?.imageToUploadBase64 && item?.imageToUploadBase64 !== '') {
    return getBase64ImageConverted(item.imageToUploadBase64);
  } else if (item?.localMediaUrl && item?.localMediaUrl !== '') {
    return getMediaAbsolutePath(item.localMediaUrl);
  } else if (item?.imageURL && item?.imageURL !== '') {
    return item.imageURL;
  }
  return null;
};
