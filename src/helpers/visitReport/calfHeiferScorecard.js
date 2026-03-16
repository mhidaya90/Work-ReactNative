// constants
import { TOOL_TYPES } from '../../constants/AppConstants';
import { KEY_BENCHMARKS_PHASES } from '../../constants/toolsConstants/CalfHeiferScorecardConstants';

// localization
import i18n from '../../localization/i18n';

// helpers
import { singleSectionSurveyScore } from '../calfHeiferScorecardHelper';
import { getParsedToolData } from '../genericHelper';

export const getCalfHeiferScorecardBody = (visitDetails, addedTools) => {
  const scorecardData = getParsedToolData(visitDetails?.calfHeiferScorecard);

  let sections = [];
  let keyBenchmarkSections = [];

  const addedScorecardData = addedTools?.find(
    item => item.basicInfo?.toolId === TOOL_TYPES.CALF_HEIFER_SCORECARD,
  );

  if (scorecardData?.sections && scorecardData.sections?.length > 0) {
    keyBenchmarkSections = keyBenchmarkScores(scorecardData);

    sections = mappedSectionBasedQuestions(addedScorecardData);
  }
  return { keyBenchmarkSections, sections };
};

const mappedSectionBasedQuestions = addedScorecardData => {
  let sections = [];

  addedScorecardData?.calfHeiferScorecardSections?.map(section => {
    const isSectionQuestionsChecked = section.data.filter(
      item => item.isChecked,
    );

    const sectionProgress = singleSectionSurveyScore(section?.data);

    if (parseFloat(sectionProgress) > 0) {
      let questions = [];

      isSectionQuestionsChecked?.map(question => {
        const questionData = {
          question: i18n.t(question.questionText),
          answerLeft: question?.selectedAnswer
            ? i18n.t(question?.selectedAnswer?.answerText)
            : '-',
          answerRight: i18n.t(getOptimalAnswer(question.availableAnswers)),
        };

        questions.push(questionData);
      });

      const payload = {
        sectionTitle: i18n.t(section?.title),
        sectionProgress: sectionProgress || 0,
        questions,
      };

      sections.push(payload);
    }
  });

  return sections;
};

const getOptimalAnswer = availableAnswers => {
  if (availableAnswers && availableAnswers.length > 0) {
    const answer = availableAnswers?.find(
      item => item?.isItemOfConcern === false,
    );

    return answer?.answerText || '';
  }
  return '';
};

const keyBenchmarkScores = scorecardData => {
  let keyBenchmarkSections = [];

  const benchmarkQuestions =
    scorecardData?.sections[scorecardData?.sections?.length - 1];

  KEY_BENCHMARKS_PHASES.map(item => {
    let sumPercentage = 0;

    item.sections.map(section => {
      const sectionQuestions = scorecardData?.sections?.find(
        scoreSection => scoreSection.index === section?.sectionIndex,
      );

      const sectionProgress = singleSectionSurveyScore(
        sectionQuestions?.questions,
      );

      sumPercentage += parseFloat(sectionProgress);

      if (section?.sectionIndex === 1) return;

      const supportedQuestions = benchmarkQuestions?.questions?.filter(quest =>
        item.supportedQuestionIndex.includes(quest.index),
      );

      const questions = supportedQuestions?.map(selectedItem => {
        let obj = {
          question: i18n.t(selectedItem.questionText),
          answerLeft: selectedItem?.selectedAnswer
            ? i18n.t(selectedItem?.selectedAnswer?.answerText)
            : '-',
          answerRight: i18n.t(getOptimalAnswer(selectedItem.availableAnswers)),
        };

        return obj;
      });

      // if (sumPercentage > 0) {
      if (section?.sectionIndex === 2) {
        const payload = {
          label:
            `${i18n.t('preWeaned')} ${i18n.t('&')} ${i18n.t('postWeaned')}` ||
            '',
          value: sumPercentage / item.sections?.length || 0,
          questions,
        };

        keyBenchmarkSections.push(payload);
      } else {
        const payload = {
          label: i18n.t(section?.sectionName) || '',
          value: sectionProgress,
          questions,
        };

        keyBenchmarkSections.push(payload);
      }
      // }
    });
  });

  return keyBenchmarkSections;
};
