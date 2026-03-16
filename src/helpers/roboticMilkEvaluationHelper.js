// modules
import { format } from 'date-fns';
import { arc } from 'd3-shape';

// localization
import i18n from '../localization/i18n';

// constants
import {
  DATE_FORMATS,
  KG_REGEX,
  UNIT_OF_MEASURE,
} from '../constants/AppConstants';
import { ROBOTIC_MILK_EVALUATION } from '../constants/FormConstants';
import {
  AMS_UTILIZATION,
  AMS_UTILIZATION_GRAPH_TABS,
  COW_EFFICIENCY,
  ROBOTIC_MILK_ANALYSIS,
  ROBOTIC_MILK_FIELDS,
  GRAPH_TYPES_VALUES,
  GRAPH_COLORS,
} from '../constants/toolsConstants/RoboticMilkConstants';
import colors from '../constants/theme/variables/customColor';
import fonts, { normalize } from '../constants/theme/variables/customFont';

// helpers
import {
  convertNumberToString,
  convertStringToNumber,
  stringIsEmpty,
} from './alphaNumericHelper';
import { dateHelper } from './dateHelper';
import {
  convertWeightToImperial,
  convertWeightToMetric,
} from './appSettingsHelper';
import { addSpace } from './genericHelper';

// get initial robotic milk evaluation form values
export const getInitialRoboticMilkFormData = ({
  visitId,
  robotType,
  cowFlowDesign,
  siteState,
  defaultValues,
  isEditable,
  unitOfMeasure,
}) => {
  const initialRoboticMilkPayload = {
    [ROBOTIC_MILK_EVALUATION.VISIT_ID]: '',
    [ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA]: {
      [ROBOTIC_MILK_EVALUATION.OUTPUTS]: {
        [ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT]: null,
        [ROBOTIC_MILK_EVALUATION.MILKINGS_PER_ROBOT]: null,
        // [ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME]: '',
        [ROBOTIC_MILK_EVALUATION.MILK_PER_ROBOT]: null,
        // [ROBOTIC_MILK_EVALUATION.MILKINGS]: '',
        // [ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS]: '',
        [ROBOTIC_MILK_EVALUATION.MILKING_FAILURES]: null,
        // [ROBOTIC_MILK_EVALUATION.MILKING_SPEED]: '',
        // [ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME]: '',
        // [ROBOTIC_MILK_EVALUATION.MAXIMUM_CONCENTRATE]: '',
        // [ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE]: '',
        // [ROBOTIC_MILK_EVALUATION.MINIMUM_CONCENTRATE]: '',
        // [ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK]: '',
        // [ROBOTIC_MILK_EVALUATION.REST_FEED]: '',
      },
      [ROBOTIC_MILK_EVALUATION.SELECTED_VISITS]: [],
      [ROBOTIC_MILK_EVALUATION.ROBOT_TYPE]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.ROBOT_TYPE
      ]
        ? defaultValues?.[ROBOTIC_MILK_EVALUATION.ROBOT_TYPE]
        : robotType?.key || '',
      [ROBOTIC_MILK_EVALUATION.COW_FLOW_DESIGN]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.COW_FLOW_DESIGN
      ]
        ? defaultValues?.[ROBOTIC_MILK_EVALUATION.COW_FLOW_DESIGN]
        : cowFlowDesign?.key || '',
      [ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD],
          )
        : null,
      [ROBOTIC_MILK_EVALUATION.LACTATING_COWS]: convertNumberToString(
        isEditable
          ? siteState?.lactatingAnimal
          : defaultValues?.lactatingAnimal,
      ),

      [ROBOTIC_MILK_EVALUATION.MILKINGS]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.MILKINGS
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.MILKINGS],
          )
        : null,
      [ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME],
          )
        : null,
      [ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS],
          )
        : null,
      [ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.REST_FEED]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.REST_FEED
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.REST_FEED],
          )
        : null,

      //  unit of measure imperial handling
      [ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD]: convertNumberToString(
        isEditable
          ? unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
            ? convertWeightToImperial(siteState?.milk, 1)
            : siteState?.milk
          : unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
          ? convertWeightToImperial(
              defaultValues?.milk || defaultValues?.averageMilkYield,
              1,
            )
          : defaultValues?.milk || defaultValues?.averageMilkYield,
      ),

      [ROBOTIC_MILK_EVALUATION.MILKING_SPEED]: defaultValues?.milkingSpeed
        ? convertNumberToString(
            unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL
              ? convertWeightToImperial(defaultValues.milkingSpeed, 2)
              : defaultValues.milkingSpeed,
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.MAXIMUM_CONCENTRATE]:
        defaultValues?.maximumConcentrate
          ? convertNumberToString(
              unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL
                ? convertWeightToImperial(defaultValues?.maximumConcentrate, 1)
                : defaultValues?.maximumConcentrate,
            )
          : null,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED]:
        defaultValues?.averageConcentrateFed
          ? convertNumberToString(
              unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL
                ? convertWeightToImperial(
                    defaultValues?.averageConcentrateFed,
                    1,
                  )
                : defaultValues?.averageConcentrateFed,
            )
          : null,

      [ROBOTIC_MILK_EVALUATION.MINIMUM_CONCENTRATE]:
        defaultValues?.minimumConcentrate
          ? convertNumberToString(
              unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL
                ? convertWeightToImperial(defaultValues?.minimumConcentrate, 1)
                : defaultValues?.minimumConcentrate,
            )
          : null,

      [ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK]:
        defaultValues?.concentratePer100KGMilk
          ? convertNumberToString(
              unitOfMeasure == UNIT_OF_MEASURE.IMPERIAL
                ? defaultValues?.concentratePer100KGMilk
                : defaultValues?.concentratePer100KGMilk,
            )
          : null,
    },
  };

  return initialRoboticMilkPayload;
};

export const parseImperialRoboticMilkFormData = ({ data }) => {
  const defaultValues = data?.visitRoboticMilkEvaluationData;

  const initialRoboticMilkPayload = {
    [ROBOTIC_MILK_EVALUATION.VISIT_ID]: '',
    [ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA]: {
      ...defaultValues,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD]:
        defaultValues?.averageMilkYield
          ? convertWeightToImperial(defaultValues?.averageMilkYield, 1)
          : null,

      [ROBOTIC_MILK_EVALUATION.MILKING_SPEED]: defaultValues?.milkingSpeed
        ? convertWeightToImperial(defaultValues?.milkingSpeed, 2)
        : null,

      [ROBOTIC_MILK_EVALUATION.MAXIMUM_CONCENTRATE]:
        defaultValues?.maximumConcentrate
          ? convertWeightToImperial(defaultValues?.maximumConcentrate, 1)
          : null,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED]:
        defaultValues?.averageConcentrateFed
          ? convertWeightToImperial(defaultValues?.averageConcentrateFed, 1)
          : null,

      [ROBOTIC_MILK_EVALUATION.MINIMUM_CONCENTRATE]:
        defaultValues?.minimumConcentrate
          ? convertWeightToImperial(defaultValues?.minimumConcentrate, 1)
          : null,

      [ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK]:
        defaultValues?.concentratePer100KGMilk
          ? defaultValues?.concentratePer100KGMilk
          : null,
    },
  };

  return initialRoboticMilkPayload;
};

export const convertRoboticDataOnInitialize = data => {
  const defaultValues = data?.visitRoboticMilkEvaluationData;

  const obj = {
    [ROBOTIC_MILK_EVALUATION.VISIT_ID]: '',
    [ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA]: {
      ...defaultValues,

      [ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.LACTATING_COWS]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.LACTATING_COWS
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.LACTATING_COWS],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD]:
        defaultValues?.averageMilkYield
          ? convertNumberToString(defaultValues?.averageMilkYield)
          : null,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.MILKINGS]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.MILKINGS
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.MILKINGS],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.MILKING_SPEED]: defaultValues?.milkingSpeed
        ? convertNumberToString(defaultValues?.milkingSpeed)
        : null,

      [ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES],
          )
        : null,

      [ROBOTIC_MILK_EVALUATION.MAXIMUM_CONCENTRATE]:
        defaultValues?.maximumConcentrate
          ? convertNumberToString(defaultValues?.maximumConcentrate)
          : null,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED]:
        defaultValues?.averageConcentrateFed
          ? convertNumberToString(defaultValues?.averageConcentrateFed)
          : null,

      [ROBOTIC_MILK_EVALUATION.MINIMUM_CONCENTRATE]:
        defaultValues?.minimumConcentrate
          ? convertNumberToString(defaultValues?.minimumConcentrate)
          : null,

      [ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK]:
        defaultValues?.concentratePer100KGMilk
          ? convertNumberToString(defaultValues?.concentratePer100KGMilk)
          : null,

      [ROBOTIC_MILK_EVALUATION.REST_FEED]: defaultValues?.[
        ROBOTIC_MILK_EVALUATION.REST_FEED
      ]
        ? convertNumberToString(
            defaultValues?.[ROBOTIC_MILK_EVALUATION.REST_FEED],
          )
        : null,
    },
  };

  return obj;
};

export const getCircleLabels = fieldConfig => {
  if (fieldConfig?.innerValues && fieldConfig?.innerValues?.length > 0) {
    let labels = [];

    fieldConfig?.innerValues?.map(item => {
      const config = {
        x: item?.positionX,
        y: item?.positionY,
        value: item?.value,
        fontSize: 9,
        strokeWidth: 0,
        fill: colors.grey9,
        fontFamily: fonts.HelveticaNeueRegular,
      };

      labels.push(config);
    });

    return labels;
  } else {
    return [];
  }
};

export const generateFieldSvgCircleData = fieldConfig => {
  if (fieldConfig?.gaugeColors && fieldConfig?.gaugeColors?.length > 0) {
    let arcCurves = [];
    fieldConfig?.gaugeColors?.map((item, index) => {
      const circlePath = arc()
        .innerRadius(67)
        .outerRadius(80)
        .startAngle(item?.startAngle || 0)
        .endAngle(item?.endAngle || 0);

      const config = {
        key: index,
        d: circlePath(),
        fill: item?.color,
        x: item?.x,
        y: item?.y,
        value: fieldConfig?.minValue + index * 5,
      };

      arcCurves.push(config);
    });

    return arcCurves;
  } else {
    return [];
  }
};

export const getSummaryColumnWithRowLabels = (
  currentVisitRoboticMilk,
  recentVisits,
  unitOfMeasure,
  weightUnit,
) => {
  let tableHeaders = [''];
  let summaryValueType = [];

  if (recentVisits?.length > 0 && currentVisitRoboticMilk) {
    recentVisits[0].roboticMilkEvaluation = currentVisitRoboticMilk;

    recentVisits?.map(visit => {
      tableHeaders.push(format(visit?.visitDate, DATE_FORMATS.MM_dd));
    });

    tableHeaders[1] = tableHeaders[1] + `\n ${i18n.t('current')}`;

    const filteredKeys = Object.keys(
      currentVisitRoboticMilk?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ],
    )?.filter(
      item =>
        ![
          ROBOTIC_MILK_EVALUATION.OUTPUTS,
          ROBOTIC_MILK_EVALUATION.SELECTED_VISITS,
        ].includes(item),
    );

    // added dropdown keys
    filteredKeys?.map(item => {
      if (
        [
          ROBOTIC_MILK_EVALUATION.ROBOT_TYPE,
          ROBOTIC_MILK_EVALUATION.COW_FLOW_DESIGN,
        ].includes(item)
      ) {
        summaryValueType.push(i18n.t(item));
      }
    });

    // get labels for vertical table
    ROBOTIC_MILK_FIELDS?.map(field => {
      if (field?.key === ROBOTIC_MILK_EVALUATION.LACTATING_COWS) {
        let label = field.label;
        if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
          label = label.replace(KG_REGEX, weightUnit);
        }
        summaryValueType.push(label);
        return;
      }

      filteredKeys?.map(item => {
        if (field?.key === item) {
          let label = [
            ROBOTIC_MILK_EVALUATION.ROBOT_TYPE,
            ROBOTIC_MILK_EVALUATION.COW_FLOW_DESIGN,
            ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD,
            ROBOTIC_MILK_EVALUATION.MAXIMUM_CONCENTRATE,
            ROBOTIC_MILK_EVALUATION.MINIMUM_CONCENTRATE,
          ].includes(item)
            ? i18n.t(item)
            : i18n.t(
                item +
                  currentVisitRoboticMilk?.[
                    ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
                  ]?.[ROBOTIC_MILK_EVALUATION.ROBOT_TYPE],
              );

          if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
            label = !!label?.length ? label?.replace(KG_REGEX, weightUnit) : '';
          }
          summaryValueType.push(label);
        }
      });
    });

    const outputObject =
      currentVisitRoboticMilk?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS] || null;

    if (outputObject && Object.keys(outputObject)?.length > 0) {
      const outputKeysLabels = { ...AMS_UTILIZATION, ...COW_EFFICIENCY };

      Object.keys(outputObject)?.map(item => {
        const keys = Object.keys(outputKeysLabels);
        if (keys.includes(item)) {
          let label = outputKeysLabels?.[item];
          if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
            label = label.replace(KG_REGEX, weightUnit);
          }
          summaryValueType.push(label);
        }
      });
    }
  }

  return { tableHeaders, summaryValueType };
};

export const getSummaryTableData = (
  currentVisitRoboticMilk,
  recentVisits,
  cowFlowDesignEnums,
  unitOfMeasure,
) => {
  if (recentVisits?.length > 0 && currentVisitRoboticMilk) {
    let tableData = [];

    recentVisits[0].roboticMilkEvaluation = currentVisitRoboticMilk;

    recentVisits?.map((visit, index) => {
      let roboticMilkData = visit?.roboticMilkEvaluation;

      if (
        !stringIsEmpty(visit?.roboticMilkEvaluation) &&
        typeof visit?.roboticMilkEvaluation == 'string'
      ) {
        roboticMilkData = JSON.parse(visit?.roboticMilkEvaluation);
      }

      if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && index != 0) {
        roboticMilkData = parseImperialRoboticMilkFormData({
          data: roboticMilkData,
        });
      }

      const filteredKeys = Object.keys(
        roboticMilkData?.[
          ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
        ],
      )?.filter(
        item =>
          ![
            ROBOTIC_MILK_EVALUATION.OUTPUTS,
            ROBOTIC_MILK_EVALUATION.SELECTED_VISITS,
          ].includes(item),
      );

      let rowData = [];

      // added dropdown keys
      filteredKeys?.map(evaluationKey => {
        if (
          [
            ROBOTIC_MILK_EVALUATION.ROBOT_TYPE,
            ROBOTIC_MILK_EVALUATION.COW_FLOW_DESIGN,
          ].includes(evaluationKey)
        ) {
          rowData.push(
            roboticMilkData?.[
              ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
            ]?.[evaluationKey] || 0,
          );
        }
      });

      rowData?.forEach((item, index) => {
        cowFlowDesignEnums?.forEach(obj => {
          if (item === obj.key) {
            rowData[index] = obj.value;
          }
        });
      });

      ROBOTIC_MILK_FIELDS?.map(field => {
        filteredKeys?.map(evaluationKey => {
          if (field?.key === evaluationKey) {
            rowData.push(
              roboticMilkData?.[
                ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
              ]?.[evaluationKey] || 0,
            );
          }
        });
      });

      const outputObject =
        roboticMilkData?.[
          ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
        ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS] || null;

      const outputKeys = Object.keys(outputObject || {});

      if (outputKeys && outputKeys?.length > 0) {
        const filteredRecentVisitOutput = outputKeys?.filter(item =>
          [
            ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT,
            ROBOTIC_MILK_EVALUATION.MILKINGS_PER_ROBOT,
            ROBOTIC_MILK_EVALUATION.MILK_PER_ROBOT,
            ROBOTIC_MILK_EVALUATION.MILKING_FAILURES,
          ].includes(item),
        );

        filteredRecentVisitOutput?.map(item => {
          if (item) {
            const outputValue = getOutputValueByKey(item, roboticMilkData);
            if (outputValue && outputValue?.value > 0) {
              rowData.push(
                convertNumberToString(
                  parseFloat(outputValue?.value)?.toFixed(2),
                ),
              );
            } else {
              rowData.push(0);
            }
          }
        });
      }

      tableData.push(rowData);
    });

    return tableData;
  }
};

const getCowsPerRobot = roboticMilkState => {
  const lactatingCows = roboticMilkState?.[
    ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
  ]?.[ROBOTIC_MILK_EVALUATION.LACTATING_COWS]
    ? roboticMilkState?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ]?.[ROBOTIC_MILK_EVALUATION.LACTATING_COWS]
    : 0;

  if (lactatingCows === 0) {
    return 0;
  }

  const robotInHerds = roboticMilkState?.[
    ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
  ]?.[ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD]
    ? roboticMilkState?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ]?.[ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD]
    : 0;

  if (robotInHerds === 0) {
    return null;
  }

  const result =
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.LACTATING_COWS] /
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD];

  return result;
};

export const getOutputValueByKey = (key, roboticMilkState) => {
  if (
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS]
  ) {
    switch (key) {
      case ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT: {
        const label = AMS_UTILIZATION?.[ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT];

        const value = getCowsPerRobot(roboticMilkState);

        return {
          label,
          key: key,
          value: value ? value : null,
        };
      }

      case ROBOTIC_MILK_EVALUATION.MILKINGS_PER_ROBOT: {
        const label =
          AMS_UTILIZATION?.[ROBOTIC_MILK_EVALUATION.MILKINGS_PER_ROBOT];

        let milkings = convertStringToNumber(
          roboticMilkState?.[
            ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
          ]?.[ROBOTIC_MILK_EVALUATION.MILKINGS],
        );
        const cowsPerRobot = getCowsPerRobot(roboticMilkState);

        const value = cowsPerRobot * milkings;

        return {
          label,
          key: key,
          value: value ? value : null,
        };
      }

      case ROBOTIC_MILK_EVALUATION.MILK_PER_ROBOT: {
        const label = AMS_UTILIZATION?.[ROBOTIC_MILK_EVALUATION.MILK_PER_ROBOT];

        let avgMilking = convertStringToNumber(
          roboticMilkState?.[
            ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
          ]?.[ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD],
        );
        const cowsPerRobot = getCowsPerRobot(roboticMilkState);

        const value = cowsPerRobot * avgMilking;

        return {
          label,
          key: key,
          value: value ? value : null,
        };
      }

      case ROBOTIC_MILK_EVALUATION.MILKING_FAILURES: {
        const label =
          COW_EFFICIENCY?.[ROBOTIC_MILK_EVALUATION.MILKING_FAILURES];

        let value = null;

        if (
          roboticMilkState?.[
            ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
          ]?.[ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES] > 0 &&
          roboticMilkState?.[
            ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
          ]?.[ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD] > 0
        ) {
          value =
            convertStringToNumber(
              roboticMilkState?.[
                ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
              ]?.[ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES],
            ) /
            convertStringToNumber(
              roboticMilkState?.[
                ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
              ]?.[ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD],
            );
        }

        return {
          label,
          key: key,
          value,
        };
      }

      default:
        return {
          label: '',
          value: '-',
        };
    }
  }
};

export const parseRoboticMilkValuesForDB = roboticMilkData => {
  let _visitRoboticMilkEvaluationData =
    roboticMilkData?.visitRoboticMilkEvaluationData;

  const objectKeys = Object.keys(_visitRoboticMilkEvaluationData || {});

  if (objectKeys?.length > 0) {
    objectKeys?.map(item => {
      if (
        [
          ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD,
          ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
          ROBOTIC_MILK_EVALUATION.MILKINGS,
          ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME,
          ROBOTIC_MILK_EVALUATION.MILKING_SPEED,
          ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
          ROBOTIC_MILK_EVALUATION.MAXIMUM_CONCENTRATE,
          ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED,
          ROBOTIC_MILK_EVALUATION.MINIMUM_CONCENTRATE,
          ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
          ROBOTIC_MILK_EVALUATION.REST_FEED,
        ].includes(item)
      ) {
        if (!stringIsEmpty(_visitRoboticMilkEvaluationData?.[item])) {
          _visitRoboticMilkEvaluationData[item] = parseFloat(
            convertStringToNumber(_visitRoboticMilkEvaluationData[item]),
          );
        } else {
          _visitRoboticMilkEvaluationData[item] = null;
        }
      } else if (
        [
          ROBOTIC_MILK_EVALUATION.ROBOTS_IN_HERD,
          ROBOTIC_MILK_EVALUATION.TOTAL_MILKING_FAILURES,
        ].includes(item)
      ) {
        if (!stringIsEmpty(_visitRoboticMilkEvaluationData?.[item])) {
          _visitRoboticMilkEvaluationData[item] = parseInt(
            convertStringToNumber(_visitRoboticMilkEvaluationData?.[item]),
          );
        } else {
          _visitRoboticMilkEvaluationData[item] = null;
        }
      } else {
        _visitRoboticMilkEvaluationData[item] =
          _visitRoboticMilkEvaluationData?.[item];
      }
    });
  }

  return {
    visitId: roboticMilkData?.visitId,
    visitRoboticMilkEvaluationData: _visitRoboticMilkEvaluationData,
  };
};

export const parseRoboticMilkValuesPoundsIntoKgForDB = roboticMilkData => {
  const defaultValues = roboticMilkData?.visitRoboticMilkEvaluationData;
  const initialRoboticMilkPayload = {
    [ROBOTIC_MILK_EVALUATION.VISIT_ID]: '',
    [ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA]: {
      ...defaultValues,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD]:
        defaultValues?.averageMilkYield
          ? convertWeightToMetric(defaultValues?.averageMilkYield)
          : null,

      [ROBOTIC_MILK_EVALUATION.MILKING_SPEED]: defaultValues?.milkingSpeed
        ? convertWeightToMetric(defaultValues.milkingSpeed)
        : null,

      [ROBOTIC_MILK_EVALUATION.MAXIMUM_CONCENTRATE]:
        defaultValues?.maximumConcentrate
          ? convertWeightToMetric(defaultValues?.maximumConcentrate)
          : null,

      [ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED]:
        defaultValues?.averageConcentrateFed
          ? convertWeightToMetric(defaultValues?.averageConcentrateFed)
          : null,

      [ROBOTIC_MILK_EVALUATION.MINIMUM_CONCENTRATE]:
        defaultValues?.minimumConcentrate
          ? convertWeightToMetric(defaultValues?.minimumConcentrate)
          : null,

      [ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK]:
        defaultValues?.concentratePer100KGMilk
          ? defaultValues?.concentratePer100KGMilk
          : null,
    },
  };

  return initialRoboticMilkPayload;
};

export const getResultsValues = roboticMilkState => {
  const outputObject =
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS];

  let amsUtilizationResults = [];
  let cowEfficiencyResults = [];

  const outputKeys = outputObject ? Object.keys(outputObject) : [];

  const amsUtilizationKeys = outputKeys?.filter(item =>
    Object.keys(AMS_UTILIZATION)?.includes(item),
  );

  if (amsUtilizationKeys?.length > 0) {
    amsUtilizationKeys?.map(item => {
      const resultObject = getOutputValueByKey(item, roboticMilkState);

      if (resultObject) {
        amsUtilizationResults.push(resultObject);
      }
    });
  }

  const cowEfficiencyKeys = outputKeys?.filter(item =>
    Object.keys(COW_EFFICIENCY)?.includes(item),
  );

  if (cowEfficiencyKeys?.length > 0) {
    cowEfficiencyKeys?.map(item => {
      const resultObject = getOutputValueByKey(item, roboticMilkState);

      if (resultObject) {
        cowEfficiencyResults.push(resultObject);
      }
    });
  }

  return {
    amsUtilizationResults,
    cowEfficiencyResults,
  };
};

export const getNeedleAngle = (
  field,
  roboticMilkEvaluationData,
  conversionNeeded = false,
  isVisitReport = false,
) => {
  let fieldKeyValue = convertStringToNumber(
    roboticMilkEvaluationData?.[field?.key] ||
      roboticMilkEvaluationData?.outputs?.[field?.key],
    !conversionNeeded,
  );

  if (
    (roboticMilkEvaluationData?.outputs?.[field?.key] &&
      roboticMilkEvaluationData?.outputs?.[field?.key] >= field?.maxValue) ||
    fieldKeyValue >= field?.maxValue
  ) {
    return 140;
  }

  if (
    (roboticMilkEvaluationData?.outputs?.[field?.key] &&
      roboticMilkEvaluationData?.outputs?.[field?.key] <= field?.minValue) ||
    fieldKeyValue <= field?.minValue
  ) {
    return -140;
  }

  const value = parseFloat(
    roboticMilkEvaluationData?.outputs?.[field?.key]
      ? roboticMilkEvaluationData?.outputs?.[field?.key]
      : roboticMilkEvaluationData?.[field?.key] || 0,
  );
  let needleConstantForCalculation = isVisitReport ? 120 : 140;

  const ans =
    -needleConstantForCalculation +
    ((value - field?.minValue) / (field?.maxValue - field?.minValue)) *
      (needleConstantForCalculation * 2);

  return ans;
};

export const createRoboticMilkGraphData = (
  recentVisits,
  selectedTab,
  roboticMilkState,
  unitOfMeasure,
  conversionNeeded = false,
) => {
  if (recentVisits?.length > 0) {
    recentVisits[recentVisits?.length - 1].roboticMilkEvaluation =
      roboticMilkState;

    const graphConfig = [
      {
        stroke: null,
        strokeWidth: normalize(2),
        gradientId: null,
        gradientStyles: [],
      },
      {
        stroke: null,
        strokeWidth: normalize(2),
        gradientId: null,
        gradientStyles: [],
      },
    ];

    switch (selectedTab?.key) {
      case ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME +
        ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME: {
        const graphData = robotFreeTimeAndAverageBoxTime(
          recentVisits,
          unitOfMeasure,
          conversionNeeded,
        );

        graphConfig[0].stroke = colors.secondary2;
        graphConfig[0].gradientId = ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME;
        graphConfig[0].gradientStyles = [
          {
            offset: '0%',
            stopColor: colors.activeTabColor,
          },
          {
            offset: '100%',
            stopColor: colors.white,
          },
        ];

        graphConfig[1].stroke = colors.metabolicIncidencePercentBar;
        graphConfig[1].gradientId = ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME;
        graphConfig[1].gradientStyles = [
          {
            offset: '0%',
            stopColor: colors.metabolicIncidencePercentBar,
          },
          {
            offset: '100%',
            stopColor: colors.white,
          },
        ];

        return {
          graphConfig: graphConfig || null,
          graphData: graphData || null,
        };
      }

      case ROBOTIC_MILK_EVALUATION.MILKINGS +
        ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS: {
        const graphData = getMilkingRefusalsGraphData(
          recentVisits,
          unitOfMeasure,
          conversionNeeded,
        );

        graphConfig[0].stroke =
          colors.roboticMilkRobotMilkingRefusalsGraphColor;
        graphConfig[0].gradientId = ROBOTIC_MILK_EVALUATION.MILKINGS;
        graphConfig[0].gradientStyles = [
          {
            offset: '0%',
            stopColor: colors.roboticMilkRobotMilkingRefusalsGraphColor,
          },
          {
            offset: '100%',
            stopColor: colors.white,
          },
        ];

        graphConfig[1].stroke = colors.roboticMilkRobotMilkingGraphColor;
        graphConfig[1].gradientId = ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS;
        graphConfig[1].gradientStyles = [
          {
            offset: '0%',
            stopColor: colors.roboticMilkRobotMilkingGraphColor,
          },
          {
            offset: '100%',
            stopColor: colors.white,
          },
        ];

        return {
          graphConfig: graphConfig || null,
          graphData: graphData || null,
        };
      }

      case ROBOTIC_MILK_EVALUATION.MILKING_FAILURES: {
        const graphData = getMilkingFailuresGraphData(
          recentVisits,
          unitOfMeasure,
        );

        graphConfig[0].stroke = colors.roboticMilkMilkingFailureGraphColor;
        graphConfig[0].gradientId = ROBOTIC_MILK_EVALUATION.MILKING_FAILURES;
        graphConfig[0].gradientStyles = [
          {
            offset: '0%',
            stopColor: colors.roboticMilkMilkingFailureGraphColor,
          },
          {
            offset: '100%',
            stopColor: colors.white,
          },
        ];

        return {
          graphConfig: graphConfig || null,
          graphData: graphData || null,
        };
      }

      case ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT: {
        const graphData = getCowsPerRobotGraphData(recentVisits, unitOfMeasure);

        graphConfig[0].stroke = colors.roboticMilkCowsPerRobotGraphColor;
        graphConfig[0].gradientId = ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT;
        graphConfig[0].gradientStyles = [
          {
            offset: '0%',
            stopColor: colors.roboticMilkCowsPerRobotGraphColor,
          },
          {
            offset: '100%',
            stopColor: colors.white,
          },
        ];

        return {
          graphConfig: graphConfig || null,
          graphData: graphData || null,
        };
      }

      case ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE +
        ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK: {
        const graphData = getConcentrateGraphData(
          recentVisits,
          unitOfMeasure,
          conversionNeeded,
        );

        graphConfig[0].stroke = colors.roboticMilkAvgConcentrateGraphColor;
        graphConfig[0].gradientId = ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE;
        graphConfig[0].gradientStyles = [
          {
            offset: '0%',
            stopColor: colors.roboticMilkAvgConcentrateGraphColor,
          },
          {
            offset: '100%',
            stopColor: colors.white,
          },
        ];

        graphConfig[1].stroke = colors.roboticMilkConcen100KgGraphColor;
        graphConfig[1].gradientId =
          ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK;
        graphConfig[1].gradientStyles = [
          {
            offset: '0%',
            stopColor: colors.roboticMilkConcen100KgGraphColor,
          },
          {
            offset: '100%',
            stopColor: colors.white,
          },
        ];

        return {
          graphConfig: graphConfig || null,
          graphData: graphData || null,
        };
      }

      default:
        break;
    }
  }
};

const robotFreeTimeAndAverageBoxTime = (
  recentVisits,
  unitOfMeasure,
  conversionNeeded = false,
) => {
  let robotFreeTime = [];
  let averageBoxTime = [];

  recentVisits?.map((visit, index) => {
    let parsedVisitData =
      typeof visit?.roboticMilkEvaluation === 'string'
        ? JSON.parse(visit?.roboticMilkEvaluation)
        : visit?.roboticMilkEvaluation;

    if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && index == 0) {
      parsedVisitData = parseImperialRoboticMilkFormData({
        data: parsedVisitData,
      });
    }

    if (
      parsedVisitData &&
      parsedVisitData?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ]
    ) {
      const robotTime = {
        x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(index)}`,
        y:
          parseFloat(
            convertStringToNumber(
              parsedVisitData?.[
                ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
              ]?.[ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME],
              !conversionNeeded,
            ),
          ) || 0,
      };

      const boxTime = {
        x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(index)}`,
        y:
          parseFloat(
            convertStringToNumber(
              parsedVisitData?.[
                ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
              ]?.[ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME],
              !conversionNeeded,
            ),
          ) || 0,
      };

      robotFreeTime.push(robotTime);
      averageBoxTime.push(boxTime);
    }
  });

  return [robotFreeTime, averageBoxTime];
};

const getMilkingRefusalsGraphData = (
  recentVisits,
  unitOfMeasure,
  conversionNeeded = false,
) => {
  let milkings = [];
  let milkingRefusals = [];

  recentVisits?.map((visit, index) => {
    let parsedVisitData =
      typeof visit?.roboticMilkEvaluation === 'string' &&
      !stringIsEmpty(visit?.roboticMilkEvaluation)
        ? JSON.parse(visit?.roboticMilkEvaluation)
        : visit?.roboticMilkEvaluation;

    if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && index == 0) {
      parsedVisitData = parseImperialRoboticMilkFormData({
        data: parsedVisitData,
      });
    }

    if (
      parsedVisitData &&
      parsedVisitData?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ]
    ) {
      const milkingObj = {
        x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(index)}`,
        y:
          parseFloat(
            parsedVisitData?.[
              ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
            ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS]?.[
              ROBOTIC_MILK_EVALUATION.MILKINGS
            ] ||
              convertStringToNumber(
                parsedVisitData?.[
                  ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
                ]?.[ROBOTIC_MILK_EVALUATION.MILKINGS],
                !conversionNeeded,
              ),
          ) || 0,
      };

      const refusalObj = {
        x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(index)}`,
        y:
          parseFloat(
            parsedVisitData?.[
              ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
            ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS]?.[
              ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS
            ] ||
              convertStringToNumber(
                parsedVisitData?.[
                  ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
                ]?.[ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS],
                !conversionNeeded,
              ),
          ) || 0,
      };

      milkings.push(milkingObj);
      milkingRefusals.push(refusalObj);
    }
  });
  return [milkings, milkingRefusals];
};

const getMilkingFailuresGraphData = (recentVisits, unitOfMeasure) => {
  let milkingFailures = [];

  recentVisits?.map((visit, index) => {
    let parsedVisitData =
      typeof visit?.roboticMilkEvaluation === 'string' &&
      !stringIsEmpty(visit?.roboticMilkEvaluation)
        ? JSON.parse(visit?.roboticMilkEvaluation)
        : visit?.roboticMilkEvaluation;

    if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && index == 0) {
      parsedVisitData = parseImperialRoboticMilkFormData({
        data: parsedVisitData,
      });
    }

    if (
      parsedVisitData &&
      parsedVisitData?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ]
    ) {
      const obj = {
        x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(index)}`,
        y:
          parseFloat(
            parsedVisitData?.[
              ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
            ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS]?.[
              ROBOTIC_MILK_EVALUATION.MILKING_FAILURES
            ],
          ) || 0,
      };

      milkingFailures.push(obj);
    }
  });

  return [milkingFailures];
};

const getCowsPerRobotGraphData = (recentVisits, unitOfMeasure) => {
  let cowsPerRobot = [];

  recentVisits?.map((visit, index) => {
    let parsedVisitData =
      typeof visit?.roboticMilkEvaluation === 'string' &&
      !stringIsEmpty(visit?.roboticMilkEvaluation)
        ? JSON.parse(visit?.roboticMilkEvaluation)
        : visit?.roboticMilkEvaluation;

    if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && index == 0) {
      parsedVisitData = parseImperialRoboticMilkFormData({
        data: parsedVisitData,
      });
    }

    if (
      parsedVisitData &&
      parsedVisitData?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ]
    ) {
      const obj = {
        x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(index)}`,
        y:
          parseFloat(
            parsedVisitData?.[
              ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
            ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS]?.[
              ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT
            ],
          ) || 0,
      };
      cowsPerRobot.push(obj);
    }
  });

  return [cowsPerRobot];
};

const getConcentrateGraphData = (
  recentVisits,
  unitOfMeasure,
  conversionNeeded = false,
) => {
  let avgConcentrate = [];
  let concentrate100KG = [];

  recentVisits?.map((visit, index) => {
    let parsedVisitData =
      typeof visit?.roboticMilkEvaluation === 'string' &&
      !stringIsEmpty(visit?.roboticMilkEvaluation)
        ? JSON.parse(visit?.roboticMilkEvaluation)
        : visit?.roboticMilkEvaluation;

    if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL && index == 0) {
      parsedVisitData = parseImperialRoboticMilkFormData({
        data: parsedVisitData,
      });
    }

    if (
      parsedVisitData &&
      parsedVisitData?.[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ]
    ) {
      const avgConcentrateObject = {
        x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(index)}`,
        y:
          parseFloat(
            parsedVisitData?.[
              ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
            ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS]?.[
              ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE
            ] ||
              convertStringToNumber(
                parsedVisitData?.[
                  ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
                ]?.[ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED],
                !conversionNeeded,
              ),
          ) || 0,
      };

      const concentrateObject = {
        x: `${format(visit?.visitDate, DATE_FORMATS.MM_dd)}${addSpace(index)}`,
        y:
          parseFloat(
            parsedVisitData?.[
              ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
            ]?.[ROBOTIC_MILK_EVALUATION.OUTPUTS]?.[
              ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK
            ] ||
              convertStringToNumber(
                parsedVisitData?.[
                  ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
                ]?.[ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK],
                !conversionNeeded,
              ),
          ) || 0,
      };

      avgConcentrate.push(avgConcentrateObject);
      concentrate100KG.push(concentrateObject);
    }
  });
  return [avgConcentrate, concentrate100KG];
};

export const roboticMilkGraphDataExportModeller = (
  trendType,
  selectedGraph,
  recentVisits,
  roboticMilkState,
  unitOfMeasure,
  weightUnit,
) => {
  if (recentVisits?.length > 0) {
    const model = {
      fileName:
        recentVisits[recentVisits?.length - 1]?.visitName +
        '-' +
        i18n.t('RoboticMilkEvaluation'),
      visitName: recentVisits[recentVisits?.length - 1]?.visitName || '',
      visitDate: dateHelper.getFormattedDate(
        recentVisits[recentVisits?.length - 1]?.visitDate,
        DATE_FORMATS.MMM_DD_YY_H_MM,
      ),
      toolName: i18n.t('RoboticMilkEvaluation'),
      categoryLabel: GRAPH_TYPES_VALUES[trendType],
    };

    switch (selectedGraph?.key) {
      case ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME +
        ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME: {
        const graphData = robotFreeTimeAndAverageBoxTime(
          recentVisits,
          unitOfMeasure,
        );

        const dualYAxisGraph = {
          sheetName: selectedGraph?.value || '',
          yleftLabel:
            getLeftAxisLabel(
              selectedGraph,
              roboticMilkState,
              unitOfMeasure,
              weightUnit,
            ) || '',
          yrightLabel:
            getRightAxisLabel(
              selectedGraph,
              roboticMilkState,
              unitOfMeasure,
              weightUnit,
            ) || '',
          yrightLineColor: GRAPH_COLORS.SANDY_BROWN,
          yleftLineColor: GRAPH_COLORS.LIGHT_SEA_GREEN,
          yleftDataPoints: graphData[0],
          yrightDataPoints: graphData[1],
        };

        model.dualYaxisGraph = dualYAxisGraph;

        return model;
      }

      case ROBOTIC_MILK_EVALUATION.MILKINGS +
        ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS: {
        const graphData = getMilkingRefusalsGraphData(
          recentVisits,
          unitOfMeasure,
        );

        const dualYAxisGraph = {
          sheetName: selectedGraph?.value || '',
          yleftLabel:
            getLeftAxisLabel(
              selectedGraph,
              roboticMilkState,
              unitOfMeasure,
              weightUnit,
            ) || '',
          yrightLabel:
            getRightAxisLabel(
              selectedGraph,
              roboticMilkState,
              unitOfMeasure,
              weightUnit,
            ) || '',
          yrightLineColor: GRAPH_COLORS.PINK,
          yleftLineColor: GRAPH_COLORS.CORNFLOWER_BLUE,
          yleftDataPoints: graphData[0],
          yrightDataPoints: graphData[1],
        };

        model.dualYaxisGraph = dualYAxisGraph;

        return model;
      }

      case ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE +
        ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK: {
        const graphData = getConcentrateGraphData(recentVisits, unitOfMeasure);

        const dualYAxisGraph = {
          sheetName: selectedGraph?.value || '',
          yleftLabel:
            getLeftAxisLabel(
              selectedGraph,
              roboticMilkState,
              unitOfMeasure,
              weightUnit,
            ) || '',
          yrightLabel:
            getRightAxisLabel(
              selectedGraph,
              roboticMilkState,
              unitOfMeasure,
              weightUnit,
            ) || '',
          yrightLineColor: GRAPH_COLORS.ROYAL_BLUE,
          yleftLineColor: GRAPH_COLORS.PEACH_PUFF,
          yleftDataPoints: graphData[0],
          yrightDataPoints: graphData[1],
        };

        model.dualYaxisGraph = dualYAxisGraph;

        return model;
      }

      case ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT: {
        const graphData = getCowsPerRobotGraphData(recentVisits, unitOfMeasure);

        const singleYAxisGraph = {
          sheetName: selectedGraph?.value || '',
          yleftLabel:
            getLeftAxisLabel(
              selectedGraph,
              roboticMilkState,
              unitOfMeasure,
              weightUnit,
            ) || '',
          yleftLineColor: GRAPH_COLORS.MEDIUM_PURPLE,
          yleftDataPoints: graphData[0],
        };

        model.singleYaxisGraph = singleYAxisGraph;

        return model;
      }

      case ROBOTIC_MILK_EVALUATION.MILKING_FAILURES: {
        const graphData = getMilkingFailuresGraphData(
          recentVisits,
          unitOfMeasure,
        );

        const singleYAxisGraph = {
          sheetName: selectedGraph?.value || '',
          yleftLabel:
            getLeftAxisLabel(
              selectedGraph,
              roboticMilkState,
              unitOfMeasure,
              weightUnit,
            ) || '',
          yleftLineColor: GRAPH_COLORS.FOREST_GREEN,
          yleftDataPoints: graphData[0],
        };

        model.singleYaxisGraph = singleYAxisGraph;

        return model;
      }

      default:
        return null;
    }
  }
};

export const getLeftAxisLabel = (
  selectedResultsTab,
  roboticMilkState,
  unitOfMeasure,
  weightUnit,
) => {
  const robotType =
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.ROBOT_TYPE];

  let leftAxis = null;

  switch (selectedResultsTab?.key) {
    case ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME +
      ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME:
      leftAxis = i18n.t(ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME + robotType);
      break;

    case ROBOTIC_MILK_EVALUATION.MILKINGS +
      ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS:
      leftAxis = i18n.t(ROBOTIC_MILK_EVALUATION.MILKINGS + robotType);
      break;

    case ROBOTIC_MILK_EVALUATION.MILKING_FAILURES:
      leftAxis = i18n.t('milkingFailures');
      break;

    case ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT:
      leftAxis = i18n.t('cowsPerRobot');
      break;

    case ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE +
      ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK:
      leftAxis = i18n.t(
        ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED + robotType,
      );
      break;

    default:
      break;
  }

  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    leftAxis = !!leftAxis?.length ? leftAxis.replace(KG_REGEX, weightUnit) : '';
  }
  return leftAxis;
};

export const getRightAxisLabel = (
  selectedResultsTab,
  roboticMilkState,
  unitOfMeasure,
  weightUnit,
) => {
  const robotType =
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.ROBOT_TYPE];

  let rightAxis = null;

  switch (selectedResultsTab?.key) {
    case ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME +
      ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME:
      rightAxis = i18n.t(ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME + robotType);
      break;

    case ROBOTIC_MILK_EVALUATION.MILKINGS +
      ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS:
      rightAxis = i18n.t(ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS + robotType);
      break;

    case ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE +
      ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK:
      rightAxis = i18n.t(
        ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK + robotType,
      );
      break;

    default:
      break;
  }
  if (unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL) {
    rightAxis = !!rightAxis?.length
      ? rightAxis.replace(KG_REGEX, weightUnit)
      : '';
  }
  return rightAxis;
};

export const getRoboticMilkAnalysis = roboticMilkEvaluationData => {
  const analysisList = ROBOTIC_MILK_ANALYSIS?.map(analysisField => {
    if ([ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT].includes(analysisField?.key)) {
      return analysisField;
    }

    if (
      [
        ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME,
        ROBOTIC_MILK_EVALUATION.MILKINGS,
        ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
        ROBOTIC_MILK_EVALUATION.MILKING_FAILURES,
        ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
        ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATED_FED,
        ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
      ].includes(analysisField?.key)
    ) {
      analysisField.label = i18n.t(
        analysisField?.labeledKey +
          roboticMilkEvaluationData?.[ROBOTIC_MILK_EVALUATION.ROBOT_TYPE],
      );

      return analysisField;
    }
  });

  return analysisList || [];
};

export const getRoboticMilkGraphTabsByTrend = (trendType, roboticMilkState) => {
  const robotType =
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.ROBOT_TYPE];

  const filteredTabs = AMS_UTILIZATION_GRAPH_TABS?.filter(
    item => item.includesIn === trendType,
  );

  const tabs = filteredTabs?.map(tab => {
    if (
      [
        ROBOTIC_MILK_EVALUATION.ROBOT_FREE_TIME +
          ROBOTIC_MILK_EVALUATION.AVERAGE_BOX_TIME,
        ROBOTIC_MILK_EVALUATION.MILKINGS +
          ROBOTIC_MILK_EVALUATION.MILKING_REFUSALS,
        ROBOTIC_MILK_EVALUATION.AVERAGE_CONCENTRATE +
          ROBOTIC_MILK_EVALUATION.CONCENTRATE_PER_100_KG_MILK,
      ].includes(tab?.key)
    ) {
      tab.value = `${i18n.t(tab?.leftAxis + robotType)} ${i18n.t('&')} ${i18n.t(
        tab?.rightAxis + robotType,
      )}`;

      return tab;
    }

    if (
      [
        ROBOTIC_MILK_EVALUATION.COWS_PER_ROBOT,
        ROBOTIC_MILK_EVALUATION.MILKING_FAILURES,
      ].includes(tab?.key)
    ) {
      return tab;
    }
  });

  return tabs;
};

export const siteSetupKeysModel = (
  roboticMilkState,
  siteData,
  unitOfMeasure,
) => {
  const lactatingAnimal =
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.LACTATING_COWS] || 0;
  const milk =
    roboticMilkState?.[
      ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
    ]?.[ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD] || 0;

  let siteDataObj = {
    lactatingAnimal: lactatingAnimal ? parseFloat(lactatingAnimal) : null,
    milk: milk
      ? unitOfMeasure === UNIT_OF_MEASURE.IMPERIAL
        ? convertWeightToMetric(parseFloat(milk), 1)
        : parseFloat(milk)
      : null,
    updated: true,
    id: siteData?.id || '',
    siteName: siteData?.siteName || '',
  };

  return siteDataObj;
};

export const siteDataExtractKeys = (visitState, siteSetupKeysToUpdate) => {
  const payload = {
    customerId: visitState?.customerId || '',
    siteId: visitState?.siteId || '',
    lactatingAnimal: siteSetupKeysToUpdate?.lactatingAnimal || 0,
    milk: siteSetupKeysToUpdate?.milk || 0,
    visitId: stringIsEmpty(visitState?.sv_id)
      ? visitState?.id
      : visitState?.sv_id,
  };

  return payload;
};

export const updateVisitsDataInRoboticMilk = (visits, model) => {
  const updatedVisits = visits?.map(visit => {
    if (!stringIsEmpty(visit.roboticMilkEvaluation)) {
      const parsedRoboticMilkData = JSON.parse(visit.roboticMilkEvaluation);

      parsedRoboticMilkData[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ][ROBOTIC_MILK_EVALUATION.LACTATING_COWS] =
        model?.lactatingAnimal ||
        parsedRoboticMilkData?.[ROBOTIC_MILK_EVALUATION.LACTATING_COWS];

      parsedRoboticMilkData[
        ROBOTIC_MILK_EVALUATION.VISIT_ROBOTIC_MILK_EVALUATION_DATA
      ][ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD] =
        model?.milk ||
        parsedRoboticMilkData?.[ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD];

      visit.roboticMilkEvaluation = parsedRoboticMilkData;
      visit.needsSync = true;
      visit.updated = true;
      visit.updated_at = dateHelper.getUnixTimestamp(new Date());
      visit.mobileLastUpdatedTime = dateHelper.getUnixTimestamp(new Date());
    }

    return visit;
  });

  return updatedVisits || [];
};

export const filterPersistanceKeys = roboticMilkState => {
  const model = {};
  if (roboticMilkState?.visitRoboticMilkEvaluationData) {
    const visitEvaluationData =
      roboticMilkState?.visitRoboticMilkEvaluationData;
    for (const dataKey in visitEvaluationData) {
      if (
        ![
          ROBOTIC_MILK_EVALUATION.OUTPUTS,
          ROBOTIC_MILK_EVALUATION.SELECTED_VISITS,
          ROBOTIC_MILK_EVALUATION.LACTATING_COWS,
          ROBOTIC_MILK_EVALUATION.AVERAGE_MILK_YIELD,
        ].includes(dataKey)
      ) {
        model[dataKey] = visitEvaluationData[dataKey];
      }
    }
  }
  return model;
};

export const calculateHerdSum = roboticMilkState => {
  let result = true;
  for (const key in roboticMilkState?.visitRoboticMilkEvaluationData) {
    if (
      key !== ROBOTIC_MILK_EVALUATION.OUTPUTS &&
      key !== ROBOTIC_MILK_EVALUATION.SELECTED_VISITS &&
      key !== ROBOTIC_MILK_EVALUATION.COW_FLOW_DESIGN &&
      key !== ROBOTIC_MILK_EVALUATION.ROBOT_TYPE
    ) {
      if (
        !roboticMilkState?.visitRoboticMilkEvaluationData?.[key] ||
        stringIsEmpty(
          roboticMilkState?.visitRoboticMilkEvaluationData?.[key],
        ) ||
        roboticMilkState?.visitRoboticMilkEvaluationData?.[key] === null ||
        roboticMilkState?.visitRoboticMilkEvaluationData?.[key] === '.'
        // roboticMilkState?.visitRoboticMilkEvaluationData?.[key] === 0 ||
      ) {
        result = false;
        return;
      }
    }
  }
  return result;
};
