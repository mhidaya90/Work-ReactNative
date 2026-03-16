import ImagePicker from 'react-native-image-crop-picker';
import { showToast } from '../components/common/CustomToast';

import {
  ATTACHMENT_SIZE_LIMIT,
  MAX_MEDIA_IMAGE_SIZE,
  MEDIA_DIRECTORIES_PATH,
  PHOTO_CONSTANT,
} from '../constants/AppConstants';

import { logEvent } from './logHelper';

import i18n from '../localization/i18n';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { setMediaObj } from './noteBookHelper';
import { TOAST_TYPE } from '../constants/FormConstants';

const _options = {
  mediaType: 'photo',
  includeBase64: true,
  compressImageQuality: 0.4,
  // cropping: true,
};

const IMAGE_CANCEL_ERROR = 'User cancelled image selection';

export const openCamera = async (options, setImage, closeImageUploader) => {
  try {
    const image = await ImagePicker.openCamera(options ? options : _options);
    afterImageSelect(image, setImage, closeImageUploader);
  } catch (error) {
    logEvent('media helper -> ImageUploader -> openCamera error', error);
    console.log('openCamera error', error);
    if (error.message !== IMAGE_CANCEL_ERROR) {
      showToast(TOAST_TYPE.ERROR, error.message);
      closeImageUploader && closeImageUploader();
    } else {
      logEvent('media helper -> ImageUploader -> error', error);
      console.log(error.message);
    }
  }
};

export const openImageGallery = async (
  options,
  setImage,
  isNotebook = false,
  labyrinthContentTypesEnums,
  notesMediaTypesEnums,
  authenticatedUser,
) => {
  try {
    const image = await ImagePicker.openPicker(options ? options : _options);
    afterImageSelect(
      image,
      setImage,
      null,
      isNotebook,
      labyrinthContentTypesEnums,
      notesMediaTypesEnums,
      authenticatedUser,
    );
  } catch (error) {
    logEvent('media helper -> ImageUploader -> openImageGallery error', error);
    console.log('openImageGallery error', error);
    if (error.message !== IMAGE_CANCEL_ERROR) {
      showToast(TOAST_TYPE.ERROR, error.message);
      closeImageUploader && closeImageUploader();
    } else {
      logEvent('media helper -> ImageUploader -> error', error);
      console.log(error.message);
    }
  }
};

export const afterImageSelect = (
  imageList = [],
  setImage,
  closeImageUploader,
  isNotebook = false,
  labyrinthContentTypesEnums,
  notesMediaTypesEnums,
  authenticatedUser,
) => {
  try {
    let images = isNotebook
      ? imageValidationForNoteBook(
          imageList,
          labyrinthContentTypesEnums,
          notesMediaTypesEnums,
          authenticatedUser,
        )
      : imageList?.map(image => {
          if (image && image.data) {
            if (image && image.size && image.size > ATTACHMENT_SIZE_LIMIT) {
              closeImageUploader && closeImageUploader();
              showToast(TOAST_TYPE.ERROR, i18n.t('imageSizeError'));
            } else {
              return image;
            }
          } else {
            closeImageUploader && closeImageUploader();
            showToast(TOAST_TYPE.ERROR, i18n.t('somethingWentWrongError'));
          }
        });
    setImage(images);
  } catch (e) {
    logEvent('media helper -> ImageUploader -> afterImageSelect fail', e);
    console.log('afterImageSelect fail', e);
  }
};

export const getImageData = data => {
  return 'data:image/png;base64, ' + data;
};

export const getMediaDirectoryPath = (
  filename,
  directory = MEDIA_DIRECTORIES_PATH.NOTEBOOK_DIRECTORY,
) => {
  try {
    filename = filename.replace('mpeg', 'mp4');
    let dirs = ReactNativeBlobUtil.fs.dirs;
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    return Platform.OS === 'ios'
      ? dirs.DocumentDir + directory + filename
      : dirs.DocumentDir + directory + filename;
  } catch (e) {
    console.log('getMediaDirectoryPath', e);
    return '';
  }
};

export const imageValidationForNoteBook = (
  imagesSelected,
  labyrinthContentTypes,
  notesMediaTypes,
  authenticatedUser,
  closeImageUploader,
) => {
  try {
    let finalImages = [];
    imagesSelected.forEach(image => {
      if (image?.size > MAX_MEDIA_IMAGE_SIZE) {
        closeImageUploader && closeImageUploader();
        showToast(TOAST_TYPE.ERROR, i18n.t('imageMaxSizeValidation'));
        return;
      }
      if (image.path) {
        image.type = PHOTO_CONSTANT;

        const mediaObj = setMediaObj(
          image,
          labyrinthContentTypes,
          notesMediaTypes,
          authenticatedUser?.email,
        );

        finalImages.push(mediaObj);
      }
    });
    return finalImages;
  } catch (error) {
    console.log('error_imageValidationAndMetaData', error);
    logEvent('error_imageValidationAndMetaData', error);
  }
};
