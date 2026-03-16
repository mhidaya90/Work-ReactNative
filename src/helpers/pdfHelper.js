import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

import { MIME_TYPE, MEDIA_EXTENSIONS } from '../constants/AppConstants';
import { TOAST_TYPE } from '../constants/FormConstants';
import { showToast } from '../components/common/CustomToast';
import { showAlertMsg } from '../components/common/Alerts';
import i18n from '../localization/i18n';
import { logEvent } from './logHelper';

export const downloadPdfResource = async (pdfUrl, fileName) => {
  try {
    if (!pdfUrl || !fileName) {
      showToast(TOAST_TYPE.ERROR, i18n.t('invalidFileDetails'));
      return;
    }

    const actualPath = pdfUrl.replace('bundle-assets://', '');

    if (Platform.OS === 'android') {
      const sourceAssetPath = actualPath;
      const base64Data = await ReactNativeBlobUtil.fs.readFile(
        ReactNativeBlobUtil.fs.asset(sourceAssetPath),
        'base64',
      );
      const sanitizedFileName = fileName.endsWith(MEDIA_EXTENSIONS.PDF)
        ? fileName
        : `${fileName}${MEDIA_EXTENSIONS.PDF}`;

      const filePayload = {
        name: sanitizedFileName,
        parentFolder: '',
        mimeType: MIME_TYPE.PDF,
      };
      const destPath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${sanitizedFileName}`;
      await ReactNativeBlobUtil.fs.writeFile(destPath, base64Data, 'base64');
      await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
        filePayload,
        'Download',
        destPath,
      );

      // For sharing with base64 data URL, pass filename without extension
      // The share system will add the extension based on MIME type
      const shareFileName = fileName.replace(/\.pdf$/i, '');

      const shareOptions = {
        type: MIME_TYPE.PDF,
        title: i18n.t('share'),
        message: '',
        failOnCancel: false,
        url: `data:application/pdf;base64,${base64Data}`,
        filename: shareFileName,
      };

      await Share.open(shareOptions).catch(() => { });

      showToast(TOAST_TYPE.SUCCESS, i18n.t('downloadedSuccessfully'));
    } else {
      const sourceAssetPath = actualPath;
      const sanitizedFileName = fileName.endsWith(MEDIA_EXTENSIONS.PDF)
        ? fileName
        : `${fileName}${MEDIA_EXTENSIONS.PDF}`;

      const tempPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${sanitizedFileName}`;

      const base64Data = await ReactNativeBlobUtil.fs.readFile(
        ReactNativeBlobUtil.fs.asset(sourceAssetPath),
        'base64',
      );

      await ReactNativeBlobUtil.fs.writeFile(tempPath, base64Data, 'base64');

      ReactNativeBlobUtil.ios.presentPreview(tempPath);
    }
  } catch (error) {
    console.log('downloadPdfResource error:', error);
    logEvent('helpers -> pdfHelper -> downloadPdfResource error', error);
    showToast(TOAST_TYPE.ERROR, i18n.t('downloadFailed'));
  }
};

export const sharePdfResource = async (
  pdfUrl,
  fileName,
  emailSubject = '',
) => {
  try {
    if (!pdfUrl || !fileName) {
      showToast(TOAST_TYPE.ERROR, i18n.t('invalidFileDetails'));
      return;
    }

    const actualPath = pdfUrl.replace('bundle-assets://', '');

    const base64Data = await ReactNativeBlobUtil.fs.readFile(
      ReactNativeBlobUtil.fs.asset(actualPath),
      'base64',
    );

    // For sharing with base64 data URL, pass filename without extension
    // The share system will add the extension based on MIME type
    const shareFileName = fileName.replace(/\.pdf$/i, '');

    const shareOptions = {
      type: MIME_TYPE.PDF,
      title: i18n.t('share'),
      message: '',
      subject: emailSubject || i18n.t('resourceFile'),
      social: Share.Social.EMAIL,
      failOnCancel: false,
      url: `data:application/pdf;base64,${base64Data}`,
      filename: shareFileName,
      excludedActivityTypes: [
        'airDrop',
        'assignToContact',
        'copyToPasteBoard',
        'markupAsPDF',
        'message',
        'saveToCameraRoll',
        'print',
        'postToWeibo',
        'postToVimeo',
        'postToTwitter',
        'postToTencentWeibo',
        'postToFlickr',
        'postToFacebook',
        'openInIBooks',
      ],
    };

    await Share.shareSingle(shareOptions);
  } catch (error) {
    if (error?.message !== 'User did not share') {
      console.log('sharePdfResource error:', error);
      logEvent('helpers -> pdfHelper -> sharePdfResource error', error);
      showAlertMsg(i18n.t('error'), i18n.t('ensureEmailConfigured'));
    }
  }
};

export const handlePdfResourceAction = async (
  action,
  pdfUrl,
  fileName,
  emailSubject = '',
) => {
  try {
    if (action === 'download') {
      await downloadPdfResource(pdfUrl, fileName);
    } else if (action === 'share') {
      await sharePdfResource(pdfUrl, fileName, emailSubject);
    }
  } catch (error) {
    console.log('handlePdfResourceAction error:', error);
    logEvent('helpers -> pdfHelper -> handlePdfResourceAction error', error);
  }
};
