//constants
import { progressBarColors } from '../../constants/VisitReportConstants';
import {
  CIRCLE_COLOR_INTERPOLATION_RANGE,
  FORAGE_AUDIT_SCORE_CARD_SECTIONS,
} from '../../constants/toolsConstants/ForageAuditConstants';
import i18n from '../../localization/i18n';

//helpers
import {
  getKeyFromLocaleFile,
  getScorecardResults,
} from '../forageAuditScorecard';
import { getParsedToolData, isEmpty } from '../genericHelper';

export const getForageAuditBody = (visitDetails, tool) => {
  const forageAuditData = getParsedToolData(visitDetails?.forageAuditScorecard);
  const body = {};
  let scores = [];
  let questions = [];

  if (forageAuditData?.sections && forageAuditData.sections?.length > 0) {
    const forageManagement = forageAuditData.sections.find(
      section => section.index === FORAGE_AUDIT_SCORE_CARD_SECTIONS[0].index,
    );
    if (forageManagement) {
      body.forageManagement = getDataForSilage(
        forageManagement,
        'forageManagement',
      );
      scores.push(...body.forageManagement);
    }

    const forageQualityRation = forageAuditData.sections.find(
      section => section.index === FORAGE_AUDIT_SCORE_CARD_SECTIONS[1].index,
    );
    if (forageQualityRation) {
      body.forageQualityRation = getDataForSilage(
        forageQualityRation,
        'forageQualityRation',
      );
      scores.push(...body.forageQualityRation);
    }

    const bunkerAndPiles = forageAuditData.sections.find(
      section => section.index === FORAGE_AUDIT_SCORE_CARD_SECTIONS[2].index,
    );
    if (bunkerAndPiles) {
      body.bunkerAndPiles = getDataForSilage(bunkerAndPiles, 'bunkerAndPiles');
      scores.push(...body.bunkerAndPiles);
    }

    const towerSilos = forageAuditData.sections.find(
      section => section.index === FORAGE_AUDIT_SCORE_CARD_SECTIONS[3].index,
    );
    if (towerSilos) {
      body.towerSilos = getDataForSilage(towerSilos, 'towerSilos');
      scores.push(...body.towerSilos);
    }

    const silageBags = forageAuditData.sections.find(
      section => section.index === FORAGE_AUDIT_SCORE_CARD_SECTIONS[4].index,
    );
    if (silageBags) {
      body.silageBags = getDataForSilage(silageBags, 'silageBags');
      scores.push(...body.silageBags);
    }

    const baleage = forageAuditData.sections.find(
      section => section.index === FORAGE_AUDIT_SCORE_CARD_SECTIONS[5].index,
    );
    if (baleage) {
      body.baleage = getDataForSilage(baleage, 'baleage');
      scores.push(...body.baleage);
    }

    // body.questionAnswers
    questions = getDataForQuestionAnswers(tool?.forageAuditSections);
  }
  return { scores, questions };
};

const getDataForSilage = (silageData, sectionKey) => {
  let data = [];
  silageData?.scorecardSilages.forEach((silage, index) => {
    const silageValue = getProgressValue(silage);
    if (silageValue) {
      data.push({
        label:
          i18n.t(getKeyFromLocaleFile(silage?.silageTypeName)) ||
          i18n.t(getKeyFromLocaleFile(silageData?.sectionName)) ||
          '',
        value: silageValue,
        hexColor: getStrokeColor(silageValue),
        sectionKey,
        showKey: index == 0 ? true : false,
      });
    }
  });
  return data;
};

const getProgressValue = selectedSilageState => {
  const progressValue = getScorecardResults(selectedSilageState);
  return progressValue ? progressValue : 0;
};

const getStrokeColor = value => {
  return value > CIRCLE_COLOR_INTERPOLATION_RANGE[1]
    ? progressBarColors[2]
    : value >= CIRCLE_COLOR_INTERPOLATION_RANGE[0]
    ? progressBarColors[1]
    : progressBarColors[0];
};

const getDataForQuestionAnswers = forageAuditSections => {
  const questionsAnswersList = {};
  let questions = [];
  forageAuditSections.forEach(section => {
    const selectedQuestions = section.data
      .filter(item => item.isChecked)
      .map((selectedItem, index) => {
        let obj = {
          question: i18n.t(getKeyFromLocaleFile(selectedItem.questionText)),
          answerLeft:
            i18n.t(
              getKeyFromLocaleFile(selectedItem?.selectedAnswer?.answerText),
            ) || '-',
          answerRight: i18n.t(
            getKeyFromLocaleFile(
              getOptimalAnswer(selectedItem.availableAnswers),
            ),
          ),
          sectionKey: section.title,
          showKey: index == 0 ? true : false,
        };
        questions.push(obj);
        return obj;
      });
    if (selectedQuestions.length > 0) {
      questionsAnswersList[section.title] = selectedQuestions;
    }
  });
  // return isEmpty(questionsAnswersList) ? null : questionsAnswersList;
  return isEmpty(questions) ? null : questions;
};

export const getTitleOfQuestionList = (
  sectionName = '',
  silageTypeName = '',
) => {
  let title = '';
  if (sectionName) {
    title += sectionName;
  }
  if (silageTypeName) {
    title += ` - ${silageTypeName}`;
  }
  return title;
};

const getOptimalAnswer = availableAnswers => {
  if (availableAnswers && availableAnswers.length > 0) {
    const answer = availableAnswers.reduce((prev, current) => {
      return prev.pointValue > current.pointValue ? prev : current;
    });
    return answer?.answerText || '';
  }
  return '';
};
