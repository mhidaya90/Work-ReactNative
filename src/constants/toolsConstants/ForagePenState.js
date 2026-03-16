// modules
import React from 'react';
import { Platform } from 'react-native';
//colors
import colors from '../theme/variables/customColor';
// localization
import i18n from '../../localization/i18n';

export const FORAGE_PENN_VALIDATIONS = {
  MIN: 0,
  MAX: 999,
  DECIMAL_POINTS: 2,
};

export const THREE_SCREEN = '3 screen';
export const OTHER = 'Other';

//goals field
export const FORAGE_PENN_GOALS = 'forage_goals';

//graph legends
export const LEGENDS_ITEMS = [
  {
    key: 'top',
    color: colors.topColor,
    title: i18n.t('top'),
  },
  {
    key: 'mid1',
    color: colors.mid1Color,
    title: i18n.t('mid1'),
  },
  {
    key: 'mid2',
    color: colors.mid2Color,
    title: i18n.t('mid2'),
  },
  {
    key: 'tray',
    color: colors.trayColor,
    title: i18n.t('tray'),
  },
];

export const GOALS_MAX_VALUE = 100;
export const GOALS_MIN_VALUE = 0;
export const GOALS_DECIMAL_POINTS = 1;

export const FORAGE_PENN_OTHER_DEFAULT_GOALS = {
  silageType: OTHER,
  goals: [
    {
      silageRange: i18n.t('top_19mm'),
      goalMin: 0,
      goalMax: 0,
    },
    {
      silageRange: i18n.t('mid1_18mm'),
      goalMin: 0,
      goalMax: 0,
    },
    {
      silageRange: i18n.t('mid2_4mm'),
      goalMin: 0,
      goalMax: 0,
    },
    {
      silageRange: i18n.t('tray'),
      goalMin: 0,
      goalMax: 0,
    },
  ],
};

export const FORAGE_PEN_SCORERS = ['top', 'mid1', 'mid2', 'tray'];

export const FORAGE_PEN_SCORERS_FIELD_INDEX = {
  TOP: 0,
  MID1: 1,
  MID2: 2,
  TRAY: 3,
};
