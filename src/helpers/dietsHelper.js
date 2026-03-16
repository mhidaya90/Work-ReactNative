// constants
import { DIETS_STATUS_ALLOWED } from '../constants/AppConstants';
import { DIETS_FIELDS } from '../constants/FormConstants';

// localization
import i18n from '../localization/i18n';

// const optimizationTypes = ['ANALYZE', 'FORMULATE'];

/**
 *
 * @description
 * main helper function for filtering diets by optimization
 * here we have multiple cases to consider
 * 1. if the diet is ANALYZED OR SAFE in analyze_optimization AND FEASIBLE in formulate_optimization
 * than we should show this diets twice
 * @example
 * Diet 1 (Analyzed)
 * Diet 1 (Formulated)
 * remember that the both diets have same ID. In order to distinguished on Pen setup we are adding a optimization_type.
 * those are coming from enums
 *
 * 2. if the diet is ANALYZED OR SAFE in analyze_optimization OR FEASIBLE in formulate_optimization
 * than show this diet as single diet
 *
 * @param {Array} diets list of diets filtered by siteId
 * @param {Array} enums enums for getting optimization types
 *
 * @returns {Array} list of filtered or new diets
 */
export const getFilteredDietsByOptimization = (diets, enums) => {
  if (enums?.optimizationTypes && enums?.optimizationTypes?.length > 0) {
    /**
     *
     * @description
     * calling a validation function to check if analyzeOptimization and formulateOptimization keys are exist
     *
     *
     * Valid diets types are in app constants file named @constant DIETS_STATUS_ALLOWED
     *
     * @param {Object} analyzeOptimization analyzeOptimization object from diet loop
     * @param {Object} formulateOptimization formulateOptimization object from diet loop
     *
     * @returns {Boolean}
     */
    function validateOptimization(
      analyzeOptimization = null,
      formulateOptimization = null,
    ) {
      if (
        analyzeOptimization &&
        Object.keys(analyzeOptimization)?.length > 0 &&
        formulateOptimization &&
        Object.keys(formulateOptimization)?.length > 0
      ) {
        return true;
      }

      return false;
    }

    const filteredDiets = [];

    if (diets?.length > 0) {
      for (let dietIndex = 0; dietIndex < diets.length; dietIndex++) {
        const currentLoopDiet = diets[dietIndex];

        if (
          validateOptimization(
            currentLoopDiet?.[DIETS_FIELDS.ANALYZE_OPTIMIZATION],
            currentLoopDiet?.[DIETS_FIELDS.FORMULATE_OPTIMIZATION],
          )
        ) {
          /**
           *
           * @description
           * checking if diet status is ANALYZED OR UNSAFE so that create same diet twice with optimization type
           */
          if (
            [
              DIETS_STATUS_ALLOWED.ANALYZED,
              DIETS_STATUS_ALLOWED.UNSAFE,
            ].includes(
              currentLoopDiet?.[DIETS_FIELDS.ANALYZE_OPTIMIZATION]?.[
                DIETS_FIELDS.STATUS
              ],
            ) &&
            [DIETS_STATUS_ALLOWED.FEASIBLE].includes(
              currentLoopDiet?.[DIETS_FIELDS.FORMULATE_OPTIMIZATION]?.[
                DIETS_FIELDS.STATUS
              ],
            )
          ) {
            /**
             *
             * @description
             * creating analyzed OR formulated diet object and adding param optimization type init from enums optimization
             */
            filteredDiets.push({
              ...currentLoopDiet,
              name: currentLoopDiet?.name + ` (${i18n.t('analyzed')})`,
              [DIETS_FIELDS.OPTIMIZATION_TYPE]:
                enums?.optimizationTypes[0] || null,
            });

            filteredDiets.push({
              ...currentLoopDiet,
              name: currentLoopDiet?.name + ` (${i18n.t('formulated')})`,
              [DIETS_FIELDS.OPTIMIZATION_TYPE]:
                enums?.optimizationTypes[1] || null,
            });
          } else if (
            /**
             * @description
             * checking if analyzeOptimization type is valid
             * checked is diet is valid then adding it in diets list
             * any of the valid status will add diet in filtered diet list
             */
            [
              DIETS_STATUS_ALLOWED.ANALYZED,
              DIETS_STATUS_ALLOWED.UNSAFE,
            ].includes(
              currentLoopDiet?.[DIETS_FIELDS.ANALYZE_OPTIMIZATION]?.[
                DIETS_FIELDS.STATUS
              ],
            )
          ) {
            filteredDiets.push({
              ...currentLoopDiet,
              name: currentLoopDiet?.name + ` (${i18n.t('analyzed')})`,
              [DIETS_FIELDS.OPTIMIZATION_TYPE]:
                enums?.optimizationTypes[0] || null,
            });
          } else if (
            /**
             * @description
             * checking if formulateOptimization type is valid
             * checked is diet is valid then adding it in diets list
             * any of the valid status will add diet in filtered diet list
             */
            [DIETS_STATUS_ALLOWED.FEASIBLE].includes(
              currentLoopDiet?.[DIETS_FIELDS.FORMULATE_OPTIMIZATION]?.[
                DIETS_FIELDS.STATUS
              ],
            )
          ) {
            filteredDiets.push({
              ...currentLoopDiet,
              name: currentLoopDiet?.name + ` (${i18n.t('formulated')})`,
              [DIETS_FIELDS.OPTIMIZATION_TYPE]:
                enums?.optimizationTypes[1] || null,
            });
          }
        }
      }
    }

    return filteredDiets || [];
  }

  return [];
};
