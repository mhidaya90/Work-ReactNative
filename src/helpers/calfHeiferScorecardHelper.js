import { CALF_HEIFER_SCORECARD } from '../constants/FormConstants';
import {
  CALF_HEIFER_SURVEY_CATEGORIES,
  COLOSTRUM_QUESTIONS,
  GROWER_PUBERTY_PREGNANCY_CLOSEUP_QUESTIONS,
  KEY_BENCHMARKS_QUESTIONS,
  POST_WEANED_QUESTIONS,
  PRE_WEANED_QUESTIONS,
} from '../constants/toolsConstants/CalfHeiferScorecardConstants';

/**
 * Initializes the Calf Heifer Scorecard data by mapping survey categories to their corresponding questions.
 *
 * @returns {Array} - An array of objects representing the initialized scorecard data.
 */
function initializeCalfHeiferScorecardData() {
  try {
    const toolPayload = CALF_HEIFER_SURVEY_CATEGORIES?.map(item => {
      switch (item.index) {
        case 0:
          return {
            ...item,
            questions: [...COLOSTRUM_QUESTIONS],
          };

        case 1:
          return {
            ...item,
            questions: [...PRE_WEANED_QUESTIONS],
          };

        case 2:
          return {
            ...item,
            questions: [...POST_WEANED_QUESTIONS],
          };

        case 3:
          return {
            ...item,
            questions: [...GROWER_PUBERTY_PREGNANCY_CLOSEUP_QUESTIONS],
          };

        case 4:
          return {
            ...item,
            questions: [...KEY_BENCHMARKS_QUESTIONS],
          };

        default:
          break;
      }
    });

    const calfHeiferScorecardData = {
      [CALF_HEIFER_SCORECARD.SECTIONS]: toolPayload,
    };

    return calfHeiferScorecardData;
  } catch (error) {
    console.log('initializeCalfHeiferScorecardData', error);

    return null;
  }
}

/**
 * Finds and updates the specified section with the updated answered question.
 *
 * @param {Array} toolState - The current state of the tool.
 * @param {Object} activeSection - The active section.
 * @param {Object} updatedQuestion - The updated question.
 * @returns {Array} - The updated tool state.
 */
function findAndUpdateSectionWithUpdateAnsweredQuestion(
  toolState,
  activeSection,
  updatedQuestion,
) {
  try {
    if (
      toolState?.[CALF_HEIFER_SCORECARD.SECTIONS]?.length > 0 &&
      activeSection &&
      updatedQuestion
    ) {
      const sectionIndex = toolState?.[
        CALF_HEIFER_SCORECARD.SECTIONS
      ]?.findIndex(
        item =>
          item?.[CALF_HEIFER_SCORECARD.INDEX] ===
          activeSection?.[CALF_HEIFER_SCORECARD.INDEX],
      );

      if (sectionIndex !== -1) {
        const sectionQuestions =
          toolState?.[CALF_HEIFER_SCORECARD.SECTIONS][sectionIndex]?.[
            CALF_HEIFER_SCORECARD.QUESTIONS
          ] || [];

        const questionIndex = sectionQuestions?.findIndex(
          question =>
            question?.[CALF_HEIFER_SCORECARD.INDEX] ===
            updatedQuestion?.[CALF_HEIFER_SCORECARD.INDEX],
        );

        if (questionIndex !== -1) {
          toolState[CALF_HEIFER_SCORECARD.SECTIONS][sectionIndex][
            CALF_HEIFER_SCORECARD.QUESTIONS
          ][questionIndex] = updatedQuestion;
        }
      }

      return toolState;
    }

    return toolState;
  } catch (error) {
    console.log('error findAndUpdateSectionWithUpdateAnsweredQuestion', error);

    return toolState;
  }
}

/**
 * Calculates the score for a single section of the survey.
 *
 * @param {Array} surveyQuestions - The questions in the section.
 * @returns {number} - The calculated score.
 */
function singleSectionSurveyScore(surveyQuestions = []) {
  try {
    if (surveyQuestions?.length > 0) {
      let totalQuestionsWeight = 0,
        totalAnswerWeight = 0;

      surveyQuestions?.map(question => {
        if (!question?.availableAnswers?.length) return;

        const optimalAnswers = question?.availableAnswers?.filter(
          answer => answer?.isItemOfConcern === false,
        );

        if (!optimalAnswers?.length) return;

        optimalAnswers?.map(item => (totalQuestionsWeight += item.pointValue));

        if (question?.[CALF_HEIFER_SCORECARD.SELECTED_ANSWER]) {
          totalAnswerWeight +=
            question?.[CALF_HEIFER_SCORECARD.SELECTED_ANSWER]?.[
              CALF_HEIFER_SCORECARD.POINT_VALUE
            ] || 0;
        }
      });

      if (totalAnswerWeight === 0) return 0;

      if (totalAnswerWeight <= totalQuestionsWeight) {
        return ((totalAnswerWeight / totalQuestionsWeight) * 100).toFixed(1);
      }
    }

    return 0;
  } catch (error) {
    console.log('error singleSectionSurveyScore', error);

    return 0;
  }
}

function supportedQuestionInKeyBenchmarks(
  scorecardToolState,
  supportedQuestionIndex = [],
) {
  try {
    if (scorecardToolState) {
      const benchmarkSectionQuestions = scorecardToolState?.sections?.find(
        item => item?.index === 4,
      );

      const supportedQuestions = benchmarkSectionQuestions?.questions?.filter(
        question => supportedQuestionIndex.includes(question.index),
      );

      return supportedQuestions;
    }
    return null;
  } catch (error) {
    console.log('error supportedQuestionInKeyBenchmarks', error);

    return null;
  }
}

export {
  initializeCalfHeiferScorecardData,
  findAndUpdateSectionWithUpdateAnsweredQuestion,
  singleSectionSurveyScore,
  supportedQuestionInKeyBenchmarks,
};
