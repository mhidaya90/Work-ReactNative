// constants
import {
  DATE_FORMATS,
  METABOLIC_INCIDENCE_CASES,
  METABOLIC_INCIDENCE_REPORT_TYPES,
  UNIT_OF_MEASURE,
} from '../constants/AppConstants';
import { METABOLIC_INCIDENCE_FIELDS } from '../constants/FormConstants';

// localization
import i18n from '../localization/i18n';

// helpers
import {
  convertNumberToString,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import {
  convertDenominatorWeightToImperial,
  convertDenominatorWeightToMetric,
  convertWeightToImperial,
  convertWeightToMetric,
} from './appSettingsHelper';
import { dateHelper, getFormattedDate } from './dateHelper';
import { sortRecentVisitsForGraph } from './toolHelper';

export const getReferencesObject = () => {
  let obj = {};
  for (const key in METABOLIC_INCIDENCE_FIELDS) {
    obj[METABOLIC_INCIDENCE_FIELDS[key]] = null;
  }
  return obj;
};

export const getDefaultFormValues = unit => {
  return {
    [METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_PER_YEAR]: null,
    [METABOLIC_INCIDENCE_FIELDS.MILK_PRICE]: null,
    [METABOLIC_INCIDENCE_FIELDS.REPLACEMENT_COW_COST]: null,
    [METABOLIC_INCIDENCE_FIELDS.COST_OF_EXTRA_DAYS_OPEN]: null,
    // Metabolic Incidence Cases
    [METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_EVALUATION]: null,
    [METABOLIC_INCIDENCE_FIELDS.RETAINED_PLACENTA]: null,
    [METABOLIC_INCIDENCE_FIELDS.METRITIS]: null,
    [METABOLIC_INCIDENCE_FIELDS.DISPLACED_ABOMASUM]: null,
    [METABOLIC_INCIDENCE_FIELDS.KETOSIS]: null,
    [METABOLIC_INCIDENCE_FIELDS.MILK_FEVER]: null,
    [METABOLIC_INCIDENCE_FIELDS.DYSTOCIA]: null,
    [METABOLIC_INCIDENCE_FIELDS.DEATH_LOSS]: null,
    // Performance & Treatment Costs
    [METABOLIC_INCIDENCE_FIELDS.RETAINED_PLACENTA_MILK_PER_COW]:
      convertNumberToString(
        unit === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToImperial(264, 2)
          : 264,
      ),
    [METABOLIC_INCIDENCE_FIELDS.RETAINED_PLACENTA_DAYS_OPEN]: 16,
    [METABOLIC_INCIDENCE_FIELDS.RETAINED_PLACENTA_TREATMENT_DEFAULT]:
      convertNumberToString(97.0),

    [METABOLIC_INCIDENCE_FIELDS.METRITIS_MILK_PER_COW]: convertNumberToString(
      unit === UNIT_OF_MEASURE.IMPERIAL ? convertWeightToImperial(18, 2) : 18,
    ),
    [METABOLIC_INCIDENCE_FIELDS.METRITIS_DAYS_OPEN]: 16,
    [METABOLIC_INCIDENCE_FIELDS.METRITIS_TREATMENT_DEFAULT]:
      convertNumberToString(126.0),

    [METABOLIC_INCIDENCE_FIELDS.DISPLACED_ABOMASUM_MILK_PER_COW]:
      convertNumberToString(
        unit === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToImperial(595, 2)
          : 595,
      ),
    [METABOLIC_INCIDENCE_FIELDS.DISPLACED_ABOMASUM_DAYS_OPEN]: 16,
    [METABOLIC_INCIDENCE_FIELDS.DISPLACED_ABOMASUM_TREATMENT_DEFAULT]:
      convertNumberToString(270.0),

    [METABOLIC_INCIDENCE_FIELDS.KETOSIS_MILK_PER_COW]: convertNumberToString(
      unit === UNIT_OF_MEASURE.IMPERIAL ? convertWeightToImperial(72, 2) : 72,
    ),
    [METABOLIC_INCIDENCE_FIELDS.KETOSIS_DAYS_OPEN]: 10,
    [METABOLIC_INCIDENCE_FIELDS.KETOSIS_TREATMENT_DEFAULT]:
      convertNumberToString(47.0),

    [METABOLIC_INCIDENCE_FIELDS.MILK_FEVER_MILK_PER_COW]: convertNumberToString(
      unit === UNIT_OF_MEASURE.IMPERIAL ? convertWeightToImperial(130, 2) : 130,
    ),
    [METABOLIC_INCIDENCE_FIELDS.MILK_FEVER_DAYS_OPEN]: 21,
    [METABOLIC_INCIDENCE_FIELDS.MILK_FEVER_TREATMENT_DEFAULT]:
      convertNumberToString(153.0),

    [METABOLIC_INCIDENCE_FIELDS.DYSTOCIA_MILK_PER_COW]: convertNumberToString(
      unit === UNIT_OF_MEASURE.IMPERIAL ? convertWeightToImperial(177, 2) : 177,
    ),
    [METABOLIC_INCIDENCE_FIELDS.DYSTOCIA_DAYS_OPEN]: 12,
    [METABOLIC_INCIDENCE_FIELDS.DYSTOCIA_TREATMENT_DEFAULT]:
      convertNumberToString(123.0),

    [METABOLIC_INCIDENCE_FIELDS.DEATH_LOSS_MILK_PER_COW]: convertNumberToString(
      unit === UNIT_OF_MEASURE.IMPERIAL ? convertWeightToImperial(391, 2) : 391,
    ),
    [METABOLIC_INCIDENCE_FIELDS.DEATH_LOSS_DAYS_OPEN]: 15,
    [METABOLIC_INCIDENCE_FIELDS.DEATH_LOSS_TREATMENT_DEFAULT]:
      convertNumberToString(112.0),
  };
};

export const populateMetabolicIncidenceData = (
  data,
  screenDisabled,
  unit,
  conversionNeeded = false,
) => {
  const toolData = data?.visitMetabolicIncidenceData || {};
  return {
    [METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_PER_YEAR]:
      convertNumberToString(toolData.totalFreshCowsPerYear, !conversionNeeded),
    [METABOLIC_INCIDENCE_FIELDS.REPLACEMENT_COW_COST]: convertNumberToString(
      toolData.replacementCowCost,
      !conversionNeeded,
    ),
    [METABOLIC_INCIDENCE_FIELDS.COST_OF_EXTRA_DAYS_OPEN]: convertNumberToString(
      toolData.costOfExtraDaysOpen,
      !conversionNeeded,
    ),

    // Metabolic Incidence Cases
    [METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_EVALUATION]:
      convertNumberToString(
        toolData.totalFreshCowsForEvaluation,
        !conversionNeeded,
      ),
    [METABOLIC_INCIDENCE_FIELDS.RETAINED_PLACENTA]: convertNumberToString(
      toolData.retainedPlacentaIncidence,
      !conversionNeeded,
    ),
    [METABOLIC_INCIDENCE_FIELDS.METRITIS]: convertNumberToString(
      toolData.metritisIncidence,
      !conversionNeeded,
    ),
    [METABOLIC_INCIDENCE_FIELDS.DISPLACED_ABOMASUM]: convertNumberToString(
      toolData.displacedAbomasumIncidence,
      !conversionNeeded,
    ),
    [METABOLIC_INCIDENCE_FIELDS.KETOSIS]: convertNumberToString(
      toolData.ketosisIncidence,
      !conversionNeeded,
    ),
    [METABOLIC_INCIDENCE_FIELDS.MILK_FEVER]: convertNumberToString(
      toolData.milkFeverIncidence,
      !conversionNeeded,
    ),
    [METABOLIC_INCIDENCE_FIELDS.DYSTOCIA]: convertNumberToString(
      toolData.dystociaIncidence,
      !conversionNeeded,
    ),
    [METABOLIC_INCIDENCE_FIELDS.DEATH_LOSS]: convertNumberToString(
      toolData.deathLossIncidence,
      !conversionNeeded,
    ),
    [METABOLIC_INCIDENCE_FIELDS.MILK_PRICE]: convertNumberToString(
      unit === UNIT_OF_MEASURE.IMPERIAL
        ? convertDenominatorWeightToImperial(toolData?.milkPrice, 3)
        : toolData?.milkPrice,
      !conversionNeeded,
    ),

    // Performance & Treatment Costs
    ...METABOLIC_INCIDENCE_CASES.reduce((combinedObj, item) => {
      return {
        ...combinedObj,
        [METABOLIC_INCIDENCE_FIELDS[`${item.caseType}_MILK_PER_COW`]]:
          convertNumberToString(
            unit === UNIT_OF_MEASURE.IMPERIAL
              ? convertWeightToImperial(toolData[`${item.dbKey}Weight`], 2)
              : toolData[`${item.dbKey}Weight`],
            !conversionNeeded,
          ),
        [METABOLIC_INCIDENCE_FIELDS[`${item.caseType}_DAYS_OPEN`]]:
          convertNumberToString(
            toolData[`${item.dbKey}DaysOpen`],
            !conversionNeeded,
          ),
        [METABOLIC_INCIDENCE_FIELDS[`${item.caseType}_TREATMENT_DEFAULT`]]:
          convertNumberToString(
            toolData[`${item.dbKey}Cost`],
            !conversionNeeded,
          ),
      };
    }, {}),
  };
};

const metabolicIncidenceCase = (values, dbFieldName, fieldName, unit) => {
  return {
    [`${dbFieldName}Weight`]:
      values[METABOLIC_INCIDENCE_FIELDS[`${fieldName}_MILK_PER_COW`]] != null &&
        !stringIsEmpty(
          values[METABOLIC_INCIDENCE_FIELDS[`${fieldName}_MILK_PER_COW`]],
        )
        ? parseFloat(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToMetric(
              convertStringToNumber(
                values[
                METABOLIC_INCIDENCE_FIELDS[`${fieldName}_MILK_PER_COW`]
                ],
              ),
            )
            : convertStringToNumber(
              values[
              METABOLIC_INCIDENCE_FIELDS[`${fieldName}_MILK_PER_COW`]
              ],
            ),
        )
        : null,
    [`${dbFieldName}DaysOpen`]:
      values[METABOLIC_INCIDENCE_FIELDS[`${fieldName}_DAYS_OPEN`]] != null &&
        !stringIsEmpty(
          values[METABOLIC_INCIDENCE_FIELDS[`${fieldName}_DAYS_OPEN`]],
        )
        ? parseInt(
          convertStringToNumber(
            values[METABOLIC_INCIDENCE_FIELDS[`${fieldName}_DAYS_OPEN`]],
          ),
        )
        : null,
    [`${dbFieldName}Cost`]:
      values[METABOLIC_INCIDENCE_FIELDS[`${fieldName}_TREATMENT_DEFAULT`]] !=
        null &&
        !stringIsEmpty(
          values[METABOLIC_INCIDENCE_FIELDS[`${fieldName}_TREATMENT_DEFAULT`]],
        )
        ? parseFloat(
          convertStringToNumber(
            values[
            METABOLIC_INCIDENCE_FIELDS[`${fieldName}_TREATMENT_DEFAULT`]
            ],
          ),
        )
        : null,
  };
};

export const createMetabolicIncidenceObject = (
  values,
  unit,
  metabolicIncidenceState,
) => {
  const obj = {
    totalFreshCowsPerYear: parseInt(
      convertStringToNumber(
        values[METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_PER_YEAR],
      ),
    ),
    replacementCowCost:
      values[METABOLIC_INCIDENCE_FIELDS.REPLACEMENT_COW_COST] != null
        ? parseFloat(
          convertStringToNumber(
            values[METABOLIC_INCIDENCE_FIELDS.REPLACEMENT_COW_COST],
          ),
        )
        : null,
    costOfExtraDaysOpen:
      values[METABOLIC_INCIDENCE_FIELDS.COST_OF_EXTRA_DAYS_OPEN] != null
        ? parseFloat(
          convertStringToNumber(
            values[METABOLIC_INCIDENCE_FIELDS.COST_OF_EXTRA_DAYS_OPEN],
          ),
        )
        : null,
    // Metabolic Incidence Cases
    totalFreshCowsForEvaluation:
      values[METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_EVALUATION] != null
        ? parseInt(
          convertStringToNumber(
            values[METABOLIC_INCIDENCE_FIELDS.TOTAL_FRESH_COWS_EVALUATION],
          ),
        )
        : null,
    retainedPlacentaIncidence:
      values[METABOLIC_INCIDENCE_FIELDS.RETAINED_PLACENTA] != null
        ? parseInt(
          convertStringToNumber(
            values[METABOLIC_INCIDENCE_FIELDS.RETAINED_PLACENTA],
          ),
        )
        : null,
    metritisIncidence:
      values[METABOLIC_INCIDENCE_FIELDS.METRITIS] != null
        ? parseInt(
          convertStringToNumber(values[METABOLIC_INCIDENCE_FIELDS.METRITIS]),
        )
        : null,
    displacedAbomasumIncidence:
      values[METABOLIC_INCIDENCE_FIELDS.DISPLACED_ABOMASUM] != null
        ? parseInt(
          convertStringToNumber(
            values[METABOLIC_INCIDENCE_FIELDS.DISPLACED_ABOMASUM],
          ),
        )
        : null,
    ketosisIncidence:
      values[METABOLIC_INCIDENCE_FIELDS.KETOSIS] != null
        ? parseInt(
          convertStringToNumber(values[METABOLIC_INCIDENCE_FIELDS.KETOSIS]),
        )
        : null,
    milkFeverIncidence:
      values[METABOLIC_INCIDENCE_FIELDS.MILK_FEVER] != null
        ? parseInt(
          convertStringToNumber(
            values[METABOLIC_INCIDENCE_FIELDS.MILK_FEVER],
          ),
        )
        : null,
    dystociaIncidence:
      values[METABOLIC_INCIDENCE_FIELDS.DYSTOCIA] != null
        ? parseInt(
          convertStringToNumber(values[METABOLIC_INCIDENCE_FIELDS.DYSTOCIA]),
        )
        : null,
    deathLossIncidence:
      values[METABOLIC_INCIDENCE_FIELDS.DEATH_LOSS] != null
        ? parseInt(
          convertStringToNumber(
            values[METABOLIC_INCIDENCE_FIELDS.DEATH_LOSS],
          ),
        )
        : null,
    milkPrice:
      values[METABOLIC_INCIDENCE_FIELDS.MILK_PRICE] != null
        ? parseFloat(
          unit === UNIT_OF_MEASURE.IMPERIAL
            ? convertDenominatorWeightToMetric(
              convertStringToNumber(
                values[METABOLIC_INCIDENCE_FIELDS.MILK_PRICE],
              ),
            )
            : convertStringToNumber(
              values[METABOLIC_INCIDENCE_FIELDS.MILK_PRICE],
            ),
        )
        : null,
    // Performance & Treatment Costs
    ...METABOLIC_INCIDENCE_CASES.reduce((combinedObj, item) => {
      return {
        ...combinedObj,
        ...metabolicIncidenceCase(values, item.dbKey, item.caseType, unit),
      };
    }, {}),
  };

  // if (
  //   !metabolicIncidenceState ||
  //   metabolicIncidenceState === null ||
  //   stringIsEmpty(metabolicIncidenceState)
  // ) {
  //   obj.outputs = getDefaultGoalValues();
  // }

  return obj;
};

export const getDefaultGoalValues = (conversionNeeded = false) => {
  return {
    retainedPlacentaGoal: convertNumberToString(6.0, !conversionNeeded),
    metritisGoal: convertNumberToString(6.0, !conversionNeeded),
    displacedAbomasumGoal: convertNumberToString(4.0, !conversionNeeded),
    ketosisGoal: convertNumberToString(4.0, !conversionNeeded),
    milkFeverGoal: convertNumberToString(4.0, !conversionNeeded),
    deathLossGoal: convertNumberToString(0.0, !conversionNeeded),
    dystociaGoal: convertNumberToString(0.0, !conversionNeeded),
  };
};

export const parseGoalValues = goals => {
  goals && Object.keys(goals).length > 0
    ? Object.keys(goals).map(key => {
      goals[key] = convertNumberToString(goals[key]);
    })
    : goals;

  return goals;
};

export const createGoalsObject = data => {
  let obj = {};
  for (const key in data) {
    if (data[key] === '') {
      obj[key] = null;
    } else {
      obj[key] = parseFloat(convertStringToNumber(data[key]));
    }
  }
  return obj;
};

// Offline DB Helpers
export const prepareMetabolicIncidenceDBObject = (record, toolData) => {
  let metabolicIncidenceData = record.metabolicIncidence;
  if (metabolicIncidenceData && !stringIsEmpty(metabolicIncidenceData)) {
    if (metabolicIncidenceData.visitMetabolicIncidenceData) {
      metabolicIncidenceData.visitMetabolicIncidenceData = {
        ...metabolicIncidenceData.visitMetabolicIncidenceData,
        ...toolData,
      };
    } else {
      metabolicIncidenceData.visitMetabolicIncidenceData = {
        ...toolData,
      };
    }
  } else {
    metabolicIncidenceData = {
      visitMetabolicIncidenceData: {
        ...toolData,
      },
    };
  }
  metabolicIncidenceData.mobileLastUpdatedTime = dateHelper.getUnixTimestamp(
    new Date(),
  );
  return metabolicIncidenceData;
};

export const prepareGoalsDBObject = (record, goalsData) => {
  let metabolicIncidenceData = record?.metabolicIncidence;
  if (metabolicIncidenceData && !stringIsEmpty(metabolicIncidenceData)) {
    if (metabolicIncidenceData.visitMetabolicIncidenceData) {
      metabolicIncidenceData.visitMetabolicIncidenceData = {
        ...metabolicIncidenceData.visitMetabolicIncidenceData,
        outputs: { ...goalsData },
      };
    } else {
      metabolicIncidenceData.visitMetabolicIncidenceData = {
        outputs: { ...goalsData },
      };
    }
  } else {
    metabolicIncidenceData = {
      visitMetabolicIncidenceData: {
        outputs: {
          ...goalsData,
        },
      },
    };
  }
  metabolicIncidenceData.mobileLastUpdatedTime = dateHelper.getUnixTimestamp(
    new Date(),
  );
  return metabolicIncidenceData;
};

// Graph Helpers
export const formatSummaryValue = (value, decimalPoints) => {
  if (value != null) {
    value = typeof value != 'number' ? Number(value) : value;
    return value.toFixed(decimalPoints).toString();
  }
  return '-';
};

export const getGoalPercent = (toolData, incidenceCase) => {
  if (toolData) {
    return toolData[`${incidenceCase}Goal`];
  }
  return null;
};

export const getIncidencePercent = (
  toolData,
  incidenceCase,
  conversionNeeded = false,
) => {
  if (toolData) {
    if (
      toolData[incidenceCase] != null &&
      toolData?.totalFreshCowsEvaluation != 0 &&
      toolData?.totalFreshCowsEvaluation != null
    ) {
      const value =
        (parseFloat(
          convertStringToNumber(toolData[incidenceCase], !conversionNeeded),
        ) /
          parseFloat(
            convertStringToNumber(
              toolData.totalFreshCowsEvaluation,
              !conversionNeeded,
            ),
          )) *
        100;

      return parseFloat(value.toFixed(1));
    }
  }
  return null;
};

export const getIncidenceDifference = (incidenceValue, goalValue) => {
  if (incidenceValue != null && goalValue != null) {
    const value = parseFloat(incidenceValue) - parseFloat(goalValue);
    return parseFloat(value.toFixed(1));
  }
  return null;
};

export const getMetabolicIncidenceSummary = (toolData, goalsData) => {
  return METABOLIC_INCIDENCE_CASES.map(incidenceCase => {
    let incidencePercent = getIncidencePercent(toolData, incidenceCase.dbKey);
    let goalPercent = getGoalPercent(goalsData, incidenceCase.dbKey);
    let diffValue = getIncidenceDifference(incidencePercent, goalPercent);

    if (incidencePercent < 0) {
      incidencePercent = 0;
    }
    if (goalPercent < 0) {
      goalPercent = 0;
    }
    if (diffValue < 0) {
      diffValue = 0;
    }
    if (isNaN(diffValue)) {
      diffValue = 0;
    }
    if (isNaN(incidencePercent)) {
      incidencePercent = 0;
    }
    return [
      incidenceCase.title,
      formatSummaryValue(incidencePercent, 1),
      formatSummaryValue(goalPercent, 1),
      formatSummaryValue(diffValue, 1),
    ];
  });
};

export const calculateMilkLossValue = (
  toolData,
  goalsData,
  milkPrice,
  incidenceCase,
  conversionNeeded = false,
) => {
  if (toolData) {
    const diffValue = getIncidenceDifference(
      getIncidencePercent(toolData, incidenceCase, conversionNeeded),
      getGoalPercent(goalsData, incidenceCase),
    );
    if (
      toolData.totalFreshCowsPerYear != null &&
      diffValue != null &&
      milkPrice != null &&
      toolData[`${incidenceCase}MilkPerCow`] != null &&
      !stringIsEmpty(toolData[`${incidenceCase}MilkPerCow`])
    ) {
      const value =
        ((parseFloat(
          convertStringToNumber(
            toolData.totalFreshCowsPerYear,
            !conversionNeeded,
          ),
        ) *
          diffValue) /
          100) *
        parseFloat(convertStringToNumber(milkPrice, !conversionNeeded)) *
        parseFloat(
          convertStringToNumber(
            toolData[`${incidenceCase}MilkPerCow`],
            !conversionNeeded,
          ),
        );

      return parseFloat(value.toFixed(2));
    }
  }
  return null;
};

const calculateCasesPerYear = (
  toolData,
  incidenceCase,
  conversionNeeded = false,
) => {
  if (toolData) {
    const incidencePercent = getIncidencePercent(
      toolData,
      incidenceCase,
      conversionNeeded,
    );
    if (toolData.totalFreshCowsPerYear != null && incidencePercent != null) {
      const value =
        parseFloat(
          convertStringToNumber(
            toolData.totalFreshCowsPerYear,
            !conversionNeeded,
          ),
        ) *
        (incidencePercent / 100);
      return parseFloat(value);
    }
  }
  return null;
};

const calculateGoalCasesPerYear = (
  toolData,
  goalsData,
  incidenceCase,
  conversionNeeded = false,
) => {
  if (toolData && goalsData) {
    const goalPercent = getGoalPercent(goalsData, incidenceCase);
    if (toolData.totalFreshCowsPerYear != null && goalPercent != null) {
      const value =
        parseFloat(
          convertStringToNumber(
            toolData.totalFreshCowsPerYear,
            !conversionNeeded,
          ),
        ) *
        (goalPercent / 100);
      return parseFloat(value);
    }
  }
  return null;
};

export const calculateIncreasedDaysOpen = (
  toolData,
  goalsData,
  incidenceCase,
  conversionNeeded = false,
) => {
  if (toolData) {
    const casesPerYear = calculateCasesPerYear(
      toolData,
      incidenceCase,
      conversionNeeded,
    );
    const goalCasesPerYear = calculateGoalCasesPerYear(
      toolData,
      goalsData,
      incidenceCase,
      conversionNeeded,
    );
    if (
      casesPerYear != null &&
      goalCasesPerYear != null &&
      toolData[`${incidenceCase}DaysOpen`] != null &&
      !stringIsEmpty(toolData[`${incidenceCase}DaysOpen`]) &&
      toolData.costOfExtraDaysOpen != null
    ) {
      const value =
        (casesPerYear - goalCasesPerYear) *
        parseFloat(toolData[`${incidenceCase}DaysOpen`]) *
        parseFloat(toolData.costOfExtraDaysOpen);
      return parseFloat(value.toFixed(1));
    }
  }
  return null;
};

export const calculateTreatmentCost = (
  toolData,
  goalsData,
  incidenceCase,
  conversionNeeded = false,
) => {
  if (toolData) {
    const casesPerYear = calculateCasesPerYear(
      toolData,
      incidenceCase,
      conversionNeeded,
    );
    const goalCasesPerYear = calculateGoalCasesPerYear(
      toolData,
      goalsData,
      incidenceCase,
      conversionNeeded,
    );
    if (
      casesPerYear != null &&
      goalCasesPerYear != null &&
      toolData[`${incidenceCase}TreatmentDefault`] != null &&
      !stringIsEmpty(toolData[`${incidenceCase}TreatmentDefault`])
    ) {
      const value =
        (casesPerYear - goalCasesPerYear) *
        parseFloat(
          convertStringToNumber(
            toolData[`${incidenceCase}TreatmentDefault`],
            !conversionNeeded,
          ),
        );
      return parseFloat(value.toFixed(1));
    }
  }
  return null;
};

export const calculateAnnualLoss = (data, index) => {
  let sum = 0;
  data?.forEach(item => {
    const val = item[index];
    if (val !== '-') {
      sum += parseFloat(val);
    }
  });

  return sum;
};

export const getAnnualImpactSummary = (
  toolData,
  goalsData,
  milkPrice,
  conversionNeeded = false,
) => {
  const annualImpactSummaryData = METABOLIC_INCIDENCE_CASES.map(
    incidenceCase => {
      let milkLoss = calculateMilkLossValue(
        toolData,
        goalsData,
        milkPrice,
        incidenceCase.dbKey,
        conversionNeeded,
      );
      let increasedDaysOpen = calculateIncreasedDaysOpen(
        toolData,
        goalsData,
        incidenceCase.dbKey,
        conversionNeeded,
      );
      let treatmentCost = calculateTreatmentCost(
        toolData,
        goalsData,
        incidenceCase.dbKey,
        conversionNeeded,
      );
      if (milkLoss < 0) {
        milkLoss = 0;
      }

      if (increasedDaysOpen < 0) {
        increasedDaysOpen = 0;
      }

      if (treatmentCost < 0) {
        treatmentCost = 0;
      }

      if (isNaN(milkLoss)) {
        milkLoss = 0;
      }

      if (isNaN(increasedDaysOpen)) {
        increasedDaysOpen = 0;
      }

      if (isNaN(treatmentCost)) {
        treatmentCost = 0;
      }
      return [
        incidenceCase.title,
        formatSummaryValue(milkLoss, 0),
        formatSummaryValue(increasedDaysOpen, 0),
        formatSummaryValue(treatmentCost, 0),
      ];
    },
  );
  annualImpactSummaryData.pop();
  annualImpactSummaryData.push([
    i18n.t('totalAnnualLosses'),
    formatSummaryValue(calculateAnnualLoss(annualImpactSummaryData, 1), 0),
    formatSummaryValue(calculateAnnualLoss(annualImpactSummaryData, 2), 0),
    formatSummaryValue(calculateAnnualLoss(annualImpactSummaryData, 3), 0),
  ]);
  // annualImpactSummaryData.map(row => {
  //   row[1] = currency + row[1];
  //   row[2] = currency + row[2];
  //   row[3] = currency + row[3];
  // });
  return annualImpactSummaryData;
};

export const calculateTotalCost = array => {
  let sum = 0;
  array.forEach(val => {
    if (val != null) {
      sum += parseFloat(val);
    }
  });
  return sum;
};

export const getCurrentCostPerCow = (
  toolData,
  totalCost,
  conversionNeeded = false,
) => {
  if (toolData) {
    if (
      toolData.totalFreshCowsPerYear != null &&
      toolData.totalFreshCowsPerYear != 0
    ) {
      const value =
        totalCost /
        parseFloat(
          convertStringToNumber(
            toolData.totalFreshCowsPerYear,
            !conversionNeeded,
          ),
        );
      return parseFloat(value.toFixed(2));
    }
  }
  return null;
};

export const getDeathLossTotalCost = (
  toolData,
  goalsData,
  incidenceCase,
  conversionNeeded = false,
) => {
  if (toolData && goalsData) {
    const incidencePercent = getIncidencePercent(
      toolData,
      incidenceCase,
      conversionNeeded,
    );
    const goalPercent = getGoalPercent(goalsData, incidenceCase);
    const diffValue = getIncidenceDifference(
      incidencePercent,
      goalPercent,
      conversionNeeded,
    );
    if (
      toolData.totalFreshCowsPerYear != null &&
      toolData.replacementCowCost != null
    ) {
      const value =
        ((parseFloat(
          convertStringToNumber(
            toolData.totalFreshCowsPerYear,
            !conversionNeeded,
          ),
        ) *
          diffValue) /
          100) *
        parseFloat(
          convertStringToNumber(toolData.replacementCowCost, !conversionNeeded),
        );
      return parseFloat(value.toFixed(2));
    }
  }
  return null;
};

export const getTotalAnnualImpactSummary = (
  toolData,
  goalsData,
  milkPrice,
  conversionNeeded = false,
) => {
  const annualTotalImpactSummaryData = METABOLIC_INCIDENCE_CASES.map(
    (incidenceCase, index) => {
      let totalCost = 0;
      if (index < METABOLIC_INCIDENCE_CASES.length - 1) {
        const milkLoss = calculateMilkLossValue(
          toolData,
          goalsData,
          milkPrice,
          incidenceCase.dbKey,
          conversionNeeded,
        );
        const increasedDaysOpen = calculateIncreasedDaysOpen(
          toolData,
          goalsData,
          incidenceCase.dbKey,
          conversionNeeded,
        );
        const treatmentCost = calculateTreatmentCost(
          toolData,
          goalsData,
          incidenceCase.dbKey,
          conversionNeeded,
        );
        totalCost = calculateTotalCost([
          milkLoss,
          increasedDaysOpen,
          treatmentCost,
        ]);
      } else {
        totalCost = getDeathLossTotalCost(
          toolData,
          goalsData,
          incidenceCase.dbKey,
          true,
        );
        totalCost = totalCost == null ? 0 : totalCost;
      }
      return [
        incidenceCase?.title,
        formatSummaryValue(totalCost, 0),
        formatSummaryValue(getCurrentCostPerCow(toolData, totalCost), 2),
      ];
    },
  );

  annualTotalImpactSummaryData.map((row, index) => {
    if (row[1] < 0) {
      row[1] = 0;
    }
    if (row[2] < 0) {
      row[2] = 0;
    }
    if (isNaN(row[1])) {
      row[1] = 0;
    }
    if (isNaN(row[2])) {
      row[2] = 0;
    }
    row[1] = row[1];
    row[2] = row[2];
  });
  annualTotalImpactSummaryData.push([
    i18n.t('totalAnnualLosses'),
    formatSummaryValue(calculateAnnualLoss(annualTotalImpactSummaryData, 1), 0),
    formatSummaryValue(calculateAnnualLoss(annualTotalImpactSummaryData, 2), 2),
  ]);
  annualTotalImpactSummaryData.map(row => {
    if (row[1] < 0) {
      row[1] = 0;
    }
    if (row[2] < 0) {
      row[2] = 0;
    }
    // row[1] = currency + row[1];
    // row[2] = currency + row[2];
  });
  return annualTotalImpactSummaryData;
};

export const getGraphLegends = () => {
  return METABOLIC_INCIDENCE_CASES.map(incidenceCase => incidenceCase.title);
};

// MetabolicIncidenceGraph
export const getMetabolicIncidenceGraphIncidencePercent = (toolData, includeAnimalCount = false) => {
  return METABOLIC_INCIDENCE_CASES.map(incidenceCase => {
    let incidencePercent = getIncidencePercent(toolData, incidenceCase.dbKey);
    if (incidencePercent < 0) {
      incidencePercent = 0;
    }

    // Get animal count for this category
    const animalCount = toolData && toolData[incidenceCase.dbKey] != null
      ? parseInt(toolData[incidenceCase.dbKey])
      : 0;

    return {
      x: incidenceCase.title,
      y: incidencePercent,
      animalCount: includeAnimalCount ? animalCount : undefined,
    };
  });
};

export const getMetabolicIncidenceGraphAnimalCount = (toolData) => {
  return METABOLIC_INCIDENCE_CASES.map(incidenceCase => {
    const animalCount = toolData && toolData[incidenceCase.dbKey] != null
      ? parseInt(toolData[incidenceCase.dbKey])
      : 0;

    return {
      x: incidenceCase.title,
      y: animalCount,
    };
  });
};

export const getMetabolicIncidenceGraphGoal = goalsData => {
  return METABOLIC_INCIDENCE_CASES.map(incidenceCase => {
    let goalPercent = getGoalPercent(goalsData, incidenceCase.dbKey);
    if (goalPercent < 0) {
      goalPercent = 0;
    }
    return {
      x: incidenceCase.title,
      y: goalPercent != null ? parseFloat(goalPercent) : null,
    };
  });
};

// Metabolic Disorder Graph
export const getMetabolicDisorderGraphValue = (
  toolData,
  goalsData,
  milkPrice,
  conversionNeeded = false,
) => {
  let tempToolData = { ...toolData };
  if (!('totalFreshCowsEvaluation' in tempToolData)) {
    tempToolData.totalFreshCowsEvaluation =
      tempToolData.totalFreshCowsForEvaluation;
  }

  METABOLIC_INCIDENCE_CASES.map(incidenceCase => {
    if (!(incidenceCase.dbKey in tempToolData)) {
      tempToolData[incidenceCase.dbKey] =
        tempToolData[`${incidenceCase.dbKey}Incidence`];
    }
    if (!(`${incidenceCase.dbKey}MilkPerCow` in tempToolData)) {
      tempToolData[`${incidenceCase.dbKey}MilkPerCow`] =
        tempToolData[`${incidenceCase.dbKey}Weight`];
    }
    if (!(`${incidenceCase.dbKey}TreatmentDefault` in tempToolData)) {
      tempToolData[`${incidenceCase.dbKey}TreatmentDefault`] =
        tempToolData[`${incidenceCase.dbKey}Cost`];
    }
  });
  return METABOLIC_INCIDENCE_CASES.map(incidenceCase => {
    const milkLoss = calculateMilkLossValue(
      tempToolData,
      goalsData,
      milkPrice,
      incidenceCase.dbKey,
      conversionNeeded,
    );
    const increasedDaysOpen = calculateIncreasedDaysOpen(
      tempToolData,
      goalsData,
      incidenceCase.dbKey,
      conversionNeeded,
    );
    const treatmentCost = calculateTreatmentCost(
      tempToolData,
      goalsData,
      incidenceCase.dbKey,
      conversionNeeded,
    );
    const totalCost = calculateTotalCost([
      milkLoss,
      increasedDaysOpen,
      treatmentCost,
    ]);
    let currentCostPerCow = getCurrentCostPerCow(tempToolData, totalCost, true);
    if (currentCostPerCow < 0) {
      currentCostPerCow = 0;
    }

    return {
      x: incidenceCase?.title,
      y: currentCostPerCow != null ? parseFloat(currentCostPerCow) : null,
    };
  });
};

export const getDisorderGraphLegend = visitData => {
  if (visitData?.currentVisit) {
    return i18n.t('current');
  } else {
    return getFormattedDate(visitData.date, DATE_FORMATS.MM_dd);
  }
};

export const getFormattedRecentVisits = recentVisits => {
  const data =
    !!recentVisits?.length &&
    recentVisits?.map(visitObj => {
      const allData = visitObj.metabolicIncidence
        ? JSON.parse(visitObj.metabolicIncidence)
        : null;
      return {
        toolData: allData?.visitMetabolicIncidenceData || null,
        goalsData:
          allData?.visitMetabolicIncidenceData?.outputs ||
          getDefaultGoalValues(),
        visitId: visitObj.id,
        date: visitObj.visitDate,
      };
    });
  return data || [];
};

export const formatVisitsForDisorderGraph = (
  visit,
  toolData,
  goalsData,
  recentVisits,
  selectedVisits,
) => {
  const currentVisitObj = {
    toolData: toolData || null,
    goalsData: goalsData,
    visitId: visit?.id,
    date: visit?.visitDate,
    currentVisit: true,
  };
  const visitList = [...recentVisits];
  let selectedRecentVisits = visitList.slice(1);
  selectedRecentVisits = selectedRecentVisits.filter(visit =>
    selectedVisits?.includes(visit.visitId),
  );
  selectedRecentVisits.push(currentVisitObj);
  selectedRecentVisits = sortRecentVisitsForGraph(selectedRecentVisits);
  return selectedRecentVisits;
};

// Export graph helpers
export const mapDataForIncidencePercentExport = (
  visitState,
  toolData,
  goalsData,
  animalCountData,
) => {
  let incidenceModel = {};
  toolData?.map(item => {
    let updatedKey = formatKeyForExport(item.x);
    incidenceModel[updatedKey] = item.y;
  });
  let goalsModel = {};
  goalsData?.map(item => {
    let updatedKey = formatKeyForExport(item.x);
    goalsModel[updatedKey] = item.y;
  });
  let animalCountModel = {};
  animalCountData?.map(item => {
    let updatedKey = formatKeyForExport(item.x);
    animalCountModel[updatedKey] = item.y;
  });
  const model = {
    fileName:
      visitState?.visitName + '-MetabolicIncidence-MetabolicIncidencePercent',
    visitName: visitState?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('MetabolicIncidence'),
    graphType: METABOLIC_INCIDENCE_REPORT_TYPES.METABOLIC_INCIDENCE_PERCENT,
    incidencePercentage: incidenceModel,
    goalPercentage: goalsModel,
    animalCount: animalCountModel,
  };

  return model;
};

export const mapDataForMetabolicDisorderExport = (
  visitState,
  toolData,
  milkPrice,
  label,
  conversionNeeded = false,
) => {
  const data = toolData?.map(visit => {
    return {
      dataPoints: getMetabolicDisorderGraphValue(
        visit.toolData,
        visit.goalsData,
        visit.toolData?.milkPrice,
        conversionNeeded,
      ),
      visitDate: visit.date,
      currentVisit: visit.currentVisit || null,
    };
  });
  let dict = {};
  for (const visit of data) {
    for (const point of visit.dataPoints) {
      if (point.x in dict) {
        const obj = {
          visitDate: new Date(visit.visitDate),
          cost: point.y,
        };
        if (visit.currentVisit) {
          obj.currentVisit = true;
        }
        dict[point.x].push(obj);
      } else {
        const obj = {
          visitDate: new Date(visit.visitDate),
          cost: point.y,
        };
        if (visit.currentVisit) {
          obj.currentVisit = true;
        }
        dict[point.x] = [obj];
      }
    }
  }
  let newDict = {};
  for (const key in dict) {
    let updatedKey = formatKeyForExport(key);
    newDict[updatedKey] = dict[key];
  }

  const model = {
    fileName:
      visitState?.visitName + '-MetabolicIncidence-MetabolicDisorderCostPerCow',
    visitName: visitState?.visitName,
    visitDate: dateHelper.getFormattedDate(
      visitState?.visitDate,
      DATE_FORMATS.MMM_DD_YY_H_MM,
    ),
    toolName: i18n.t('MetabolicIncidence'),
    graphType: METABOLIC_INCIDENCE_REPORT_TYPES.METABOLIC_DISORDER_COST_PER_COW,
    metabolicDisorderCostPerCowLabel: label,
    metabolicDisorderCostPerCow: newDict,
  };

  return model;
};

export const getUpdatedSiteData = (data, siteData) => {
  let siteDataObj = {
    currentMilkPrice: parseFloat(data?.milkPrice),
    updated: true,
    id: siteData?.id,
    siteName: siteData?.siteName,
  };

  return siteDataObj;
};

export const formatKeyForExport = input => {
  let arr = input.split(' ');
  for (let i = 0; i < arr?.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join('');
};

export const getAnnualImpactSummaryVisitReport = (
  toolData,
  goalsData,
  milkPrice,
  currency,
) => {
  const annualImpactSummaryData = METABOLIC_INCIDENCE_CASES.map(
    incidenceCase => {
      let milkLoss = calculateMilkLossValue(
        toolData,
        goalsData,
        milkPrice,
        incidenceCase.dbKey,
      );
      let increasedDaysOpen = calculateIncreasedDaysOpen(
        toolData,
        goalsData,
        incidenceCase.dbKey,
      );
      let treatmentCost = calculateTreatmentCost(
        toolData,
        goalsData,
        incidenceCase.dbKey,
      );
      if (milkLoss < 0) {
        milkLoss = 0;
      }

      if (increasedDaysOpen < 0) {
        increasedDaysOpen = 0;
      }

      if (treatmentCost < 0) {
        treatmentCost = 0;
      }

      if (isNaN(milkLoss)) {
        milkLoss = 0;
      }

      if (isNaN(increasedDaysOpen)) {
        increasedDaysOpen = 0;
      }

      if (isNaN(treatmentCost)) {
        treatmentCost = 0;
      }
      if (incidenceCase.dbKey != 'deathLoss') {
        return {
          key: incidenceCase.dbKey,
          value: [
            formatSummaryValue(milkLoss, 0),
            formatSummaryValue(increasedDaysOpen, 0),
            formatSummaryValue(treatmentCost, 0),
          ],
        };
      } else {
        return {
          key: incidenceCase.dbKey,
          value: [0, 0, 0],
        };
      }
    },
  );
  // annualImpactSummaryData.pop();
  annualImpactSummaryData.push({
    key: 'totalAnnualLosses',
    value: [
      formatSummaryValue(
        calculateAnnualLossForVisitReport(annualImpactSummaryData, 0),
        0,
      ),
      formatSummaryValue(
        calculateAnnualLossForVisitReport(annualImpactSummaryData, 1),
        0,
      ),
      formatSummaryValue(
        calculateAnnualLossForVisitReport(annualImpactSummaryData, 2),
        0,
      ),
    ],
  });
  return annualImpactSummaryData;
};

export const getTotalAnnualImpactSummaryVisitReport = (
  toolData,
  goalsData,
  milkPrice,
  currency,
) => {
  const annualTotalImpactSummaryData = METABOLIC_INCIDENCE_CASES.map(
    (incidenceCase, index) => {
      let totalCost = 0;
      if (index < METABOLIC_INCIDENCE_CASES.length - 1) {
        const milkLoss = calculateMilkLossValue(
          toolData,
          goalsData,
          milkPrice,
          incidenceCase.dbKey,
        );
        const increasedDaysOpen = calculateIncreasedDaysOpen(
          toolData,
          goalsData,
          incidenceCase.dbKey,
        );
        const treatmentCost = calculateTreatmentCost(
          toolData,
          goalsData,
          incidenceCase.dbKey,
        );
        totalCost = calculateTotalCost([
          milkLoss,
          increasedDaysOpen,
          treatmentCost,
        ]);
      } else {
        totalCost = getDeathLossTotalCost(
          toolData,
          goalsData,
          incidenceCase.dbKey,
        );
        totalCost = totalCost == null ? 0 : totalCost;
      }

      return {
        key: incidenceCase.dbKey,
        value: [
          formatSummaryValue(totalCost, 0),
          formatSummaryValue(getCurrentCostPerCow(toolData, totalCost), 2),
        ],
      };
    },
  );

  annualTotalImpactSummaryData.map((row, index) => {
    if (row[1] < 0) {
      row[1] = 0;
    }
    if (row[2] < 0) {
      row[2] = 0;
    }
    if (isNaN(row[1])) {
      row[1] = 0;
    }
    if (isNaN(row[2])) {
      row[2] = 0;
    }
    row[1] = row[1];
    row[2] = row[2];
  });
  // annualTotalImpactSummaryData.pop();
  annualTotalImpactSummaryData.push({
    key: 'totalAnnualLosses',
    value: [
      formatSummaryValue(
        calculateAnnualLossForVisitReport(annualTotalImpactSummaryData, 0),
        0,
      ),
      formatSummaryValue(
        calculateAnnualLossForVisitReport(annualTotalImpactSummaryData, 1),
        2,
      ),
    ],
  });
  annualTotalImpactSummaryData.map(row => {
    if (row[1] < 0) {
      row[1] = 0;
    }
    if (row[2] < 0) {
      row[2] = 0;
    }
  });
  return annualTotalImpactSummaryData;
};

export const calculateAnnualLossForVisitReport = (data, index) => {
  let sum = 0;
  data?.forEach(item => {
    const val = item?.value[index];

    if (val !== '-') {
      sum += parseFloat(val);
    }
  });
  return sum;
};
