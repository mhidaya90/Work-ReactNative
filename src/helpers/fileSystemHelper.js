import { logEvent } from "./logHelper";

export const getBase64ImageConverted = imageInBase64 => {
  try {
    return `data:image/jpeg;base64,${imageInBase64}`;
  } catch (error) {
    logEvent('helpers -> fileSystemHelper -> getBase64ImageConverted error', error);
    console.log('getBase64ImageConverted', error);
  }
};

export const getBase64TextConverted = textInBase64 => {
  try {
    return `data:text/plain;utf8,${textInBase64}`;
  } catch (error) {
    logEvent('helpers -> fileSystemHelper -> getBase64TextConverted error', error);
    console.log('getBase64TextConverted', error);
  }
};

// const getBase64File = async fileName => {
//   const file = await RNFS.readFile(fileName, 'base64');
//   return file;
// };

// const showPermissionAlertForIOSGallery = () => {
//   if (Platform.OS === 'ios') {
//     showAlertMsg(
//       localization[getLocale()].ALERT,
//       localization[getLocale()].IOS_CAMERA_PERMISSION_ALERT,
//       [
//         {
//           text: localization[getLocale()].CANCEL,
//           onPress: () => {
//             style: 'cancel';
//           },
//         },
//         {
//           text: localization[getLocale()].OK,
//           onPress: () => {
//             //redirect to settings
//             Linking.openURL('app-settings:');
//           },
//         },
//       ],
//     );
//   }
// };
