import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import uuid from 'react-native-uuid';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';

import {
  DATE_FORMATS,
  P_PHOTO_CONSTANT,
  V_VIDEO_CONSTANT,
  NOTEBOOK_MEDIA_MAX_AUDIO_COUNT,
  NOTEBOOK_MEDIA_MAX_PHOTO_COUNT,
  NOTEBOOK_MEDIA_MAX_VIDEO_COUNT,
  PHOTO_CONSTANT,
  VIDEO_CONSTANT,
  MEDIA_TYPES,
  MEDIA_EXTENSIONS,
} from '../constants/AppConstants';
import ROUTE_CONSTANTS from '../constants/RouteConstants';

import i18n from '../localization/i18n';

import { stringIsEmpty } from './alphaNumericHelper';
import { dateHelper, getFormattedDate } from './dateHelper';
import {
  getLocalNoteMediaBasePath,
  getMediaNoteBookAbsolutePath,
  getMediaRelativePath,
  isHttpUrl,
} from './genericHelper';
import { logEvent } from './logHelper';
import { requestModelForFetchingMedia } from '../services/models/s3Media';

export const trimString = ({
  text,
  allowedCharLength = 10,
  startIndex = 0,
  isTailEllipsize = false,
}) => {
  if (!text?.trim()) {
    return;
  }
  const ellipsize = isTailEllipsize ? '...  ' : '';
  const subString = text.substring(startIndex, allowedCharLength);

  return `${subString}${ellipsize}`;
};

// export const convertToHtml = text => {
//   console.log('convertToHtml', text);

//   if (!text?.trim()) {
//     return;
//   }

//   let html = '';
//   let textOnly = sanitizeNoteHtml(text);

//   const parseHTML = (start, end) => {
//     text = textOnly?.substring(start, end);
//     return text.replace(/\n/g, '<br>');
//   };

//   if (textOnly.length > NOTEBOOK_VISIT_REPORT_TEXT_LENGTH) {
//     html += `<span>${parseHTML(0, NOTEBOOK_VISIT_REPORT_TEXT_LENGTH)}</span>`;
//     html += `<span id="extra" style="color:red;">${parseHTML(
//       NOTEBOOK_VISIT_REPORT_TEXT_LENGTH,
//       textOnly.length,
//     )}</span>`;
//   } else {
//     html += `${parseHTML(0, textOnly.length)}`;
//   }
// console.log('object', `<div>${html}</div>`);
//   return `<div>${html}</div>`;
// };

export const convertToHtml = text => {
  if (!text?.trim()) {
    return;
  }
  const html = text.replace(/\n/g, '<br>');

  return `<div>${html}</div>`;
};

export const MILLISECONDS_PER_MINUTE = 60 * 1000;
export const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
export const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

export const TIME_PICKER_CONST = {
  HOUR: 'hour',
  MIN: 'min',
  SEC: 'sec',
};

export const getTimePickerValueFor = (timeValue, part) => {
  if (!timeValue) {
    return;
  }
  switch (part) {
    case TIME_PICKER_CONST.HOUR:
      return Math.floor(timeValue / MILLISECONDS_PER_HOUR);
    case TIME_PICKER_CONST.MIN:
      return Math.floor(
        (timeValue % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE,
      );
    case TIME_PICKER_CONST.SEC:
      return Math.floor((timeValue % MILLISECONDS_PER_MINUTE) / 1000);

    default:
      return {
        hour: Math.floor(timeValue / MILLISECONDS_PER_HOUR),
        min: Math.floor(
          (timeValue % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE,
        ),
        sec: Math.floor((timeValue % MILLISECONDS_PER_MINUTE) / 1000),
      };
  }
};

export const onNoteBookFavObj = (noteBook, fav) => {
  let obj = {
    id: noteBook?.id,
    localId: noteBook?.id,
    sv_id: noteBook?.sv_id,
    favourite: fav,
    updated: true,
    updatedDate: new Date(),
  };
  return obj;
};

export const convertHtmlListToText = (list, reverse) => {
  if (!list?.trim()) {
    return '';
  }

  if (reverse) {
    if (!list.includes('•')) {
      return list;
    }
    const lines = list.split(/\r?\n/);
    let inList = false;
    let htmlList = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('• ')) {
        if (!inList) {
          htmlList += '<ul>';
          inList = true;
        }
        const listItemText = line.replace(/^•\s*/g, '');
        htmlList += `<li>${listItemText}</li>`;
      } else {
        if (inList) {
          htmlList += '</ul>';
          inList = false;
          htmlList += line;
        } else {
          htmlList += '\n' + line;
        }
      }
    }

    if (inList) {
      htmlList += '</ul>';
    }

    return htmlList;
  }

  const regex = /<ul>([\s\S]*?)<\/ul>/g;
  let bulletText = list.replace(regex, value => '\n' + value);
  bulletText = bulletText.replace(regex, (match, p1) => {
    const listItemRegex = /<li>(.*?)<\/li>/g;
    let bulletItems = '';
    let listItem;

    while ((listItem = listItemRegex.exec(p1)) !== null) {
      bulletItems += `• ${listItem[1]}\n`;
    }

    return bulletItems;
  });

  return bulletText;
};

export const convertHtmlListToTextEmail = (list, reverse) => {
  if (!list?.trim()) {
    return '';
  }
  if (reverse) {
    if (!list.includes('•')) {
      return list;
    }
    const lines = list.split(/\r?\n/);
    let inList = false;
    let htmlList = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('• ')) {
        if (!inList) {
          htmlList += '<ul>';
          inList = true;
        }
        const listItemText = line.replace(/^•\s*/g, '');
        htmlList += `<li>${listItemText}</li>`;
      } else {
        if (inList) {
          htmlList += '</ul>';
          inList = false;
          htmlList += line;
        } else {
          htmlList += '<br></br>' + line;
        }
      }
    }

    if (inList) {
      htmlList += '</ul>';
    }

    return htmlList;
  }

  const regex = /<ul>([\s\S]*?)<\/ul>/g;
  let bulletText = list.replace(regex, value => '\n' + value);
  bulletText = bulletText.replace(regex, (match, p1) => {
    const listItemRegex = /<li>(.*?)<\/li>/g;
    let bulletItems = '';
    let listItem;

    while ((listItem = listItemRegex.exec(p1)) !== null) {
      bulletItems += `• ${listItem[1]}<br/>`;
    }

    return bulletItems;
  });

  return bulletText;
};

export const htmlAllTagsRemover = htmlText => {
  const regex = /(<([^>]+)>)/gi;
  let plainText = htmlText.replace(regex, '');
  plainText = plainText.replaceAll('&nbsp;', ' ');

  return plainText;
};

export const newlineHandler = noteHTML => {
  const regex = /<br\s*\/?>|<\/div>/g;
  const convertedText = noteHTML.replace(regex, '\n');

  return convertedText;
};

export const renderNoteListDate = createdDate => {
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

const setAudioPath = path => {
  let newPath = '';
  path = getMediaNoteBookAbsolutePath(path);
  if (Platform.OS == 'ios') {
    newPath = 'file:///' + path;
  } else {
    path = path.replace('file://', '');
    newPath = 'file://' + path;
  }
  newPath = newPath.replace('mpeg', 'mp4');
  return newPath;
};

export const setByAudio = (param = []) => {
  return param
    ?.filter(
      a =>
        a.type == 'audio' ||
        a.type == 'VoiceNotes' ||
        a.mediaType == 'VoiceNotes',
    )
    .map(b => ({
      ...b,
      play: false,
      duration: 0,
      position: 0,
      path: setAudioPath(b?.path),
    }));
};

export const setByImages = param => {
  if (param?.length > 0) {
    param = param?.filter(
      a =>
        a.type === 'image' ||
        a.type === VIDEO_CONSTANT ||
        a.type === P_PHOTO_CONSTANT ||
        a.type === V_VIDEO_CONSTANT ||
        a.mediaType === P_PHOTO_CONSTANT ||
        a.mediaType === V_VIDEO_CONSTANT,
    );
    param = param.map(b => ({
      ...b,
      path: getMediaNoteBookAbsolutePath(b.mediaName),
      isPlaying: false,
    }));
    return param;
  }
  return [];
};

export const moveLocalNoteMediaToInternalStorage = async (
  recordings = [],
  images = [],
  videos = [],
) => {
  try {
    let mediaItems = [];

    const directoryPath = getLocalNoteMediaBasePath();

    const galleryItems = [...images, ...videos];
    if (galleryItems?.length > 0) {
      for (const media of galleryItems) {
        if (media.isUpload === false) {
          const destinationPath = directoryPath + `/${media.mediaName}`;

          try {
            // Check if source and destination are the same
            if (media.path === destinationPath) {
              media.path = getMediaRelativePath(media.mediaName);
              mediaItems.push(media);
              continue;
            }

            if (
              media.mediaType === VIDEO_CONSTANT ||
              media.mediaType === V_VIDEO_CONSTANT
            ) {
              const mediaPath = Platform.select({
                ios: media.path.replace('file://', ''),
                android: media.path,
              });

              await ReactNativeBlobUtil.fs.cp(mediaPath, destinationPath);
              await ReactNativeBlobUtil.fs.unlink(media.path);
            } else {
              await ReactNativeBlobUtil.fs.cp(media.path, destinationPath);
              await ReactNativeBlobUtil.fs.unlink(media.path);
            }

            media.path = getMediaRelativePath(media.mediaName);
          } catch (cpError) {
            console.log(
              'helpers -> notebookHelper -> moveLocalNoteMediaToInternalStorage -> galleryItems Exception: ',
              cpError,
            );
            logEvent(
              'helpers -> notebookHelper -> moveLocalNoteMediaToInternalStorage -> galleryItems Exception: ',
              {
                from: media.path,
                to: destinationPath,
                error: cpError.message,
              },
            );
          }
        }

        mediaItems.push(media);
      }
    }

    if (recordings?.length > 0) {
      for (const audio of recordings) {
        try {
          if (audio.isUpload === false) {
            let destinationPath = directoryPath + `/${audio.mediaName}`;
            destinationPath = destinationPath.replace('mpeg', 'mp4');

            // Check if source and destination are the same
            if (audio.path === destinationPath) {
              audio.path = destinationPath;
              mediaItems.push(audio);
              continue;
            }

            await ReactNativeBlobUtil.fs.mv(
              Platform.select({
                ios: audio.path.replace('file://', ''),
                android: audio.path,
              }),
              destinationPath,
            );
            await ReactNativeBlobUtil.fs.unlink(
              Platform.select({
                ios: audio.path,
                android: audio.path.replace('/', 'file:///'),
              }),
            );

            audio.path = destinationPath;
          }

          mediaItems.push(audio);
        } catch (error) {
          console.log(
            'helpers -> notebookHelper -> moveLocalNoteMediaToInternalStorage -> audioRecordings Exception: ',
            error,
          );
          logEvent(
            'helpers -> notebookHelper -> moveLocalNoteMediaToInternalStorage -> audioRecordings Exception: ',
            error,
          );
        }
      }
    }

    return mediaItems;
  } catch (error) {
    console.log(
      'helpers -> notebookHelper -> moveLocalNoteMediaToInternalStorage Exception: ',
      error,
    );
    logEvent(
      'helpers -> notebookHelper -> moveLocalNoteMediaToInternalStorage Exception: ',
      error,
    );
    return [];
  }
};
export const navigateToNoteBookEditor = (
  navigation,
  visitDetails,
  toolInfo,
) => {
  navigation.navigate(ROUTE_CONSTANTS.NOTE_BOOK_EDITOR, {
    siteId: visitDetails?.siteId,
    localSiteId: visitDetails?.localSiteId,
    accountId: visitDetails?.customerId,
    localAccountId: visitDetails?.localCustomerId,
    visitId: visitDetails?.serverId,
    localVisitId: visitDetails?.localId,
    sectionId: '',
    section: toolInfo?.toolId,
    sectionTitle: toolInfo?.name,
    isNew: true,
  });
};

export const setAudioObj = (
  filePath,
  labyrinthContentTypes,
  notesMediaTypes,
  userId,
) => {
  let mediaId = uuid.v4();
  let obj = {
    path: filePath,
    type: 'audio',
    mime: 'audio/mpeg',
    duration: 0,
    position: 0,
    play: false,
    filename: `${Date.now()}.mp4`,
    mediaId: mediaId,

    mediaType: notesMediaTypes?.length > 0 ? notesMediaTypes[4] : 'VoiceNotes',
    latitude: 0.0,
    longitude: 0.0,
    labyrinthContentTypes: '',
    mediaName: mediaId + '.mpeg',
    reportType: 'Tool',
    isNew: true,
    noteId: '',
    isUpload: false,
    isLocal: true,
    userId: userId,
  };
  return obj;
};
export const setMediaObj = (
  video,
  labyrinthContentTypes,
  notesMediaTypes,
  userId,
) => {
  let mediaId = uuid.v4();
  let obj = {
    ...video,
    ...setMediaType(video, labyrinthContentTypes, notesMediaTypes, mediaId),
    mediaId: mediaId,

    latitude: 0.0,
    longitude: 0.0,
    reportType: 'Tool',
    isNew: true,
    noteId: '',
    isUpload: false,
    isLocal: true,
    userId: userId,
  };
  return obj;
};

const setMediaType = (
  video,
  labyrinthContentTypes,
  notesMediaTypes,
  mediaId,
) => {
  try {
    if (video?.type == PHOTO_CONSTANT) {
      return {
        mediaName: mediaId + '.' + video.mime.split('/')[1],
        mediaType:
          notesMediaTypes.length > 0 ? notesMediaTypes[0] : P_PHOTO_CONSTANT,
        labyrinthContentTypes:
          labyrinthContentTypes?.length > 0
            ? labyrinthContentTypes[0]
            : 'Image',
      };
    } else {
      return {
        mediaName: mediaId + '.mp4',
        mediaType:
          notesMediaTypes.length > 0 ? notesMediaTypes[1] : V_VIDEO_CONSTANT,
        labyrinthContentTypes:
          labyrinthContentTypes?.length > 0
            ? labyrinthContentTypes[1]
            : V_VIDEO_CONSTANT,
      };
    }
  } catch (e) {
    console.log('Exception setMediaType e', e);
    logEvent('Exception setMediaType fail', e);
  }
};

export const requestMicrophonePermission = async () => {
  if (Platform.OS === 'ios') {
    const permissionStatus = await check(PERMISSIONS.IOS.MICROPHONE);
    if (permissionStatus === RESULTS.GRANTED) {
      return RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      return result;
    }
  } else {
    const permissionStatus = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (permissionStatus === RESULTS.GRANTED) {
      return RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      return result;
    }
  }
};
export const requestCameraPermission = async () => {
  if (Platform.OS === 'ios') {
    const permissionStatus = await check(PERMISSIONS.IOS.CAMERA);
    if (permissionStatus === RESULTS.GRANTED) {
      return RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      return result;
    }
  } else {
    const permissionStatus = await check(PERMISSIONS.ANDROID.CAMERA);
    if (permissionStatus === RESULTS.GRANTED) {
      return RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      return result;
    }
  }
};

export const requestGalleryPermission = async permission => {
  try {
    if (Platform.OS === 'ios') {
      const permissionStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (permissionStatus === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        return result;
      }
    } else {
      const permissionStatus = await check(
        permission || PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      );

      logEvent('android requestGalleryPermission ', {
        permission,
        permissionStatus,
      });
      if (permissionStatus === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else if (permissionStatus === RESULTS.UNAVAILABLE) {
        return requestGalleryPermission(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
      } else {
        const result = await request(
          permission || PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        );
        logEvent('android requestGalleryPermission req result', result);

        return result;
      }
    }
  } catch (e) {
    console.log('requestGalleryPermission fail', e);
    logEvent('requestGalleryPermission fail', e);
  }
};

export const formatTime = timeInSeconds => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export const renderTime = elapsedTime => {
  if (elapsedTime >= 60) {
    return formatTime(elapsedTime);
  } else {
    return `${formatTime(elapsedTime)}`;
  }
};

export const getNotebookMediaPath = (item = {}) => {
  try {
    let path =
      item?.isNew && !item?.noteLocalId
        ? item?.sourceURL || item?.path
        : getMediaNoteBookAbsolutePath(item?.mediaName);

    return path;
  } catch (error) {}
  return null;
};

export const filePathExist = async item => {
  let isExist = false;
  try {
    let pathToCheck = item?.path;

    // Handle file:// URI format (e.g., from image picker: file:///path/to/file.mp4)
    if (pathToCheck?.startsWith('file://')) {
      const cleanPath = pathToCheck.replace('file://', '');
      isExist = await ReactNativeBlobUtil.fs.exists(cleanPath);
      if (isExist) {
        return isExist;
      }
    }

    // Check original path and media notebook absolute path as fallback
    isExist =
      (await ReactNativeBlobUtil.fs.exists(item?.path)) ||
      (await ReactNativeBlobUtil.fs.exists(
        getMediaNoteBookAbsolutePath(item?.path),
      ));
    return isExist;
  } catch (error) {}
  return isExist;
};

export const getMaxCountMedia = (mediaArray, selectedMedia) => {
  try {
    let count = 0;
    let mediaCount = [];

    if (stringIsEmpty(selectedMedia)) {
      count = NOTEBOOK_MEDIA_MAX_AUDIO_COUNT - mediaArray.length;
    } else if (selectedMedia === PHOTO_CONSTANT) {
      mediaCount = mediaArray.filter(
        a => a.type === PHOTO_CONSTANT || a.mediaType === P_PHOTO_CONSTANT,
      );
      count = NOTEBOOK_MEDIA_MAX_PHOTO_COUNT - mediaCount.length;
    } else if (selectedMedia === VIDEO_CONSTANT) {
      mediaCount = mediaArray.filter(
        a => a.type === VIDEO_CONSTANT || a.mediaType === V_VIDEO_CONSTANT,
      );
      count = NOTEBOOK_MEDIA_MAX_VIDEO_COUNT - mediaCount.length;
    }
    return count;
  } catch (e) {
    logEvent('getMaxCountMedia error', e);
  }
};

export const sanitizeNoteHtml = (noteHTML = '') => {
  const note = htmlAllTagsRemover(
    newlineHandler(convertHtmlListToText(noteHTML)),
  );

  return note || noteHTML;
};

/**
 *
 * @param {Array} mediaItems array of media items to loop for grouped by sorting
 * @returns
 */
export const groupedMediaByTypes = (mediaItems = []) => {
  if (mediaItems.length > 0) {
    let groupedMedia = {
      [MEDIA_TYPES.IMAGES]: [],
      [MEDIA_TYPES.VIDEOS]: [],
      [MEDIA_TYPES.AUDIOS]: [],
    };

    mediaItems.map(media => {
      switch (media?.mediaType) {
        case PHOTO_CONSTANT:
        case P_PHOTO_CONSTANT:
          groupedMedia[MEDIA_TYPES.IMAGES].push(media);
          break;

        case VIDEO_CONSTANT:
        case V_VIDEO_CONSTANT:
          groupedMedia[MEDIA_TYPES.VIDEOS].push(media);
          break;

        case MEDIA_TYPES.AUDIOS:
        case MEDIA_TYPES.VOICE_NOTES:
          //TODO: PROD delete following after 2.0.0 PROD
          let mediaExt = media?.path.split('.')[1];
          if ('.' + mediaExt == MEDIA_EXTENSIONS.MPEG) {
            media.path = media?.path.replace('mpeg', 'mp4');
          }
          //end
          groupedMedia[MEDIA_TYPES.AUDIOS].push(media);
          break;

        default:
          break;
      }
    });

    return groupedMedia;
  }

  return null;
};

export const getFilterCapsuleMeta = filters => {
  let arrayKeys = [
    'filterAccounts',
    'filterSites',
    'filterTools',
    'filterVisit',
    'filterTypes',
    'filterCreator',
    'filterNoteCommentType',
  ];

  let _data = [];
  Object.keys(filters).map(i => {
    if (i == 'startDate' && filters[i] != '') {
      _data.push({
        text: `${getFormattedDate(
          filters.startDate,
          DATE_FORMATS.EEE_MMM_d,
        )} - ${getFormattedDate(filters.endDate, DATE_FORMATS.EEE_MMM_d)}`,
      });
    } else if (i == 'updatedStartDate' && filters[i] != '') {
      _data.push({
        text: `${getFormattedDate(
          filters.updatedStartDate,
          DATE_FORMATS.EEE_MMM_d,
        )} - ${getFormattedDate(
          filters.updatedEndDate,
          DATE_FORMATS.EEE_MMM_d,
        )}`,
      });
    } else if (arrayKeys.indexOf(i) != -1) {
      filters[i].map(a => {
        if (i == 'filterTypes' || i == 'filterNoteCommentType') {
          _data.push({ text: a });
        } else {
          _data.push({ ...a, text: a.businessName || a.name });
        }
      });
    }
  });
  return _data;
};

/**
 * @description
 * mapper function for mapping notebook media items to fetch
 * @param {Array} mediaData of media items from notebook that needs to be fetched
 * @returns
 */
export function mapNotebookMediaToFetch(mediaData = []) {
  try {
    const mediaIdToFetch = [];
    const dataToFetch = [];
    mediaData?.forEach(element => {
      let id = '';
      if (!stringIsEmpty(element?.mediaName)) {
        if (!stringIsEmpty(element?.accountId)) {
          id = `${element?.accountId}/${element.mediaName}`;
        } else {
          id = `${element?.userId}/${element.mediaName}`;
        }
        let isURL = isHttpUrl(id);
        if (!isURL) {
          mediaIdToFetch.push(requestModelForFetchingMedia(id));
          dataToFetch.push(element);
        }
      }
    });

    return { dataToFetch, mediaIdToFetch };
  } catch (error) {
    console.log('error - mapNotebookMediaToFetch', error);
    return null;
  }
}
