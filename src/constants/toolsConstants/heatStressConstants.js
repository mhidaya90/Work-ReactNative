// modules
import React from 'react';
import { Platform } from 'react-native';

// localization
import i18n from '../../localization/i18n';

// constants
import { INPUT_FIELD_TYPE, LACTATING_ANIMALS_MAX_VALUE, LACTATING_ANIMALS_MIN_VALUE } from '../AppConstants';
import { HEAT_STRESS_FIELDS } from '../FormConstants';

const returnKeyType = Platform.OS === 'ios' ? 'done' : 'next';

export const HEAT_STRESS_MIN_METRIC = 20;
export const HEAT_STRESS_MIN_IMPERIAL = 68;

export const HEAT_STRESS_INPUTS = [
  {
    key: HEAT_STRESS_FIELDS.LACTATING_ANIMALS,
    placeholder: i18n.t('numberPlaceholder'),
    label: i18n.t('lactatingAnimals'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: LACTATING_ANIMALS_MIN_VALUE,
    maxValue: LACTATING_ANIMALS_MAX_VALUE,
    required: false,
    hasCommas: true,
    isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.CURRENT_MILK_PRICE,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('currentMilkPrice'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 10000,
    decimalPoints: 3,
    required: false,
    hasCommas: true,

    // isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.MILK_YIELD,
    placeholder: i18n.t('singleDecimalNumberPlaceholder'),
    label: i18n.t('milkProduction'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 999,
    decimalPoints: 1,
    required: false,
    hasCommas: false,

    // isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.DRY_MATTER_INTAKE,
    placeholder: i18n.t('singleDecimalNumberPlaceholder'),
    label: i18n.t('dryMatterIntakeIn(Kg)'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 100,
    decimalPoints: 1,
    required: true,
    hasCommas: false,

    // isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.NEL_DAIRY,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('NELDairy(Kg)'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 99,
    decimalPoints: 3,
    required: false,
    hasCommas: false,

    // isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.MILK_FAT,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('milkFat(%)'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 100,
    decimalPoints: 2,
    required: false,
    hasCommas: false,

    // isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.MILK_PROTEIN,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('milkProtein(%)'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 100,
    decimalPoints: 2,
    required: false,
    hasCommas: false,

    // isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.TEMPERATURE,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('temperature(C)'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 100,
    decimalPoints: 2,
    required: false,
    hasCommas: false,

    // isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.HUMIDITY,
    placeholder: i18n.t('decimalNumberPlaceholder'),
    label: i18n.t('humidity(%)'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 100,
    decimalPoints: 2,
    required: false,
    hasCommas: false,

    // isInteger: true,
  },
  {
    key: HEAT_STRESS_FIELDS.HOURS_OF_SUN,
    placeholder: i18n.t('numberPlaceholder'),
    label: i18n.t('hoursOfSun'),
    inputRef: React.createRef(),
    fieldType: INPUT_FIELD_TYPE.INPUT,
    returnKeyType,
    minValue: 0,
    maxValue: 24,
    decimalPoints: 0,
    required: false,
    hasCommas: false,

    isInteger: true,
  },
];

export const HEAT_STRESS_FIELD_CONSTANTS = {
  THI_CELSIUS: 'temperatureHumidityInCelsius',
  THI_FARENHEIT: 'temperatureHumidityInFarenheit',
  INTAKE_ADJUSTMENT: 'intakeAdjustmentPercent',
  DMI_PERCENT: 'dmiReductionPercent',
  EST_DRY_MATTER_WEIGHT: 'estimatedDryMatterIntakeWeightInkg',
  REDUCTION_IN_DMI_WEIGHT: 'reductionInDMIWeightInkg',
  LOSS_OF_ENERGY_CONSUMED: 'lossOfEnergyConsumedInMcal',
  ENERGY_EQUIVALENT_MILK_LOSS_WEIGHT: 'energyEquivalentMilkLossWeightInkg',
  MILK_LOSS_VALUE_DAY: 'milkValueLossPerDay',
  MILK_LOSS_VALUE_MONTH: 'milkValueLossPerMonth',
};

export const HEAT_STRESS_DISPLAY_CONSTANTS = {
  THI_CELSIUS: 'temperatureHumidityInCelsius',
  THI_FARENHEIT: 'temperatureHumidityInFarenheit',
  INTAKE_ADJUSTMENT: 'intakeAdjustmentPercent',
  DMI_PERCENT: 'dmiReductionPercent',
  EST_DRY_MATTER_WEIGHT: 'estimatedDryMatterIntakeWeightInkg',
  EST_DRY_MATTER_WEIGHT_LBS: 'estimatedDryMatterIntakeWeightInLbs',
  REDUCTION_IN_DMI_WEIGHT: 'reductionInDMIWeightInkg',
  REDUCTION_IN_DMI_WEIGHT_LBS: 'reductionInDMIWeightInLbs',
  LOSS_OF_ENERGY_CONSUMED: 'lossOfEnergyConsumedInMcal',
  ENERGY_EQUIVALENT_MILK_LOSS_WEIGHT: 'energyEquivalentMilkLossWeightInkg',
  ENERGY_EQUIVALENT_MILK_LOSS_WEIGHT_LBS: 'energyEquivalentMilkLossWeightInLbs',
  MILK_LOSS_VALUE_DAY: 'milkValueLossPerDay',
  MILK_LOSS_VALUE_MONTH: 'milkValueLossPerMonth',
};

export const HEAT_STRESS_COLOR_CONSTANTS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  ORANGE: 'ORANGE',
  RED: 'RED',
};

export const HEAT_STRESS_COLOR_TEXT = {
  GREEN: i18n.t('stressThreshold'),
  YELLOW: i18n.t('mildModerateStress'),
  ORANGE: i18n.t('moderateSevereStress'),
  RED: i18n.t('severeStress'),
};
