import { Dimensions, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function normalize(size) {
  let isTablet = DeviceInfo.isTablet();
  return isTablet ? normalizeOnTab(size) : normalizeOnPhone(size);
}

export function normalizeOnPhone(size) {
  const scale = SCREEN_WIDTH / 390;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function normalizeOnTab(size) {
  const scale = SCREEN_WIDTH / 600;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const defaultGenericSizes = {
  headerTitleSize: 20,
  cardTitleSize: 18,
  cardSubTitleSIze: 16,
  cardFieldSize: 14,
  submitButtonTextSize: 16,
  fieldLabel: 15,
  minSize: 12,
};

export const tabletFontSizes = {
  normal: 18,
  medium: 19,
  large: 20,
  xLarge: 22,
  xxLarge: 24,
  x5large: 30,
};

export const mobileFontSizes = {
  normal: 14,
  medium: 15,
  large: 16,
  xLarge: 18,
  xxLarge: 20,
  x5large: 26,
};

export default {
  HelveticaNeueRegular: 'Helvetica Neue',
  HelveticaNeueMedium: 'HelveticaNeue-Medium',
  HelveticaNeueBold: 'HelveticaNeue-Bold',
  RobotoRegular: 'Roboto-Regular',
  RobotoMedium: 'Roboto-Medium',
  RobotoBold: 'Roboto-Bold',
};
