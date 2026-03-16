// constants
import { FORAGE_AUDIT_SCORECARD } from '../constants/FormConstants';
import { FORAGE_AUDIT_SCORE_CARD_SECTIONS } from '../constants/toolsConstants/ForageAuditConstants';
import enJson from '../localization/locales/en.json';

// return initial tmr score model
export const forageAuditScorecardPayload = visitId => {
  const newForageAuditData = FORAGE_AUDIT_SCORE_CARD_SECTIONS.map(a => {
    return { ...a };
  });

  const forageAuditScorecardData = {
    [FORAGE_AUDIT_SCORECARD.VISIT_ID]: '',
    [FORAGE_AUDIT_SCORECARD.SECTIONS]: newForageAuditData,
  };

  return forageAuditScorecardData;
};

export const isTotalSectionAnswered = section => {
  if (
    section?.[FORAGE_AUDIT_SCORECARD.SCORECARD_SILAGES] &&
    section?.[FORAGE_AUDIT_SCORECARD.SCORECARD_SILAGES]?.length > 0
  ) {
    let totalQuestions = 0;
    let totalAnswers = 0;

    for (
      let silageIndex = 0;
      silageIndex < section?.[FORAGE_AUDIT_SCORECARD.SCORECARD_SILAGES]?.length;
      silageIndex++
    ) {
      const scorecardSilage =
        section?.[FORAGE_AUDIT_SCORECARD.SCORECARD_SILAGES]?.[silageIndex];

      totalQuestions =
        totalQuestions +
        scorecardSilage?.[FORAGE_AUDIT_SCORECARD.QUESTIONS]?.length;

      if (
        scorecardSilage?.[FORAGE_AUDIT_SCORECARD.QUESTIONS] &&
        scorecardSilage?.[FORAGE_AUDIT_SCORECARD.QUESTIONS]?.length > 0
      ) {
        const scorecardQuestions =
          scorecardSilage?.[FORAGE_AUDIT_SCORECARD.QUESTIONS] || [];
        for (
          let questionIndex = 0;
          questionIndex < scorecardQuestions?.length;
          questionIndex++
        ) {
          const question = scorecardQuestions[questionIndex];
          if (
            question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] &&
            question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] != null &&
            question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] != undefined
          ) {
            totalAnswers = totalAnswers + 1;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }
    if (totalQuestions === totalAnswers) {
      return true;
    }
    return false;
  }
  return false;
};

export const getScorecardQuestionsDetails = scorecard => {
  if (
    scorecard &&
    scorecard?.[FORAGE_AUDIT_SCORECARD.QUESTIONS] &&
    scorecard?.[FORAGE_AUDIT_SCORECARD.QUESTIONS]?.length > 0
  ) {
    let totalAnswers = 0;

    scorecard?.[FORAGE_AUDIT_SCORECARD.QUESTIONS]?.map(question => {
      if (
        question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] &&
        question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] != null &&
        question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] != undefined
      ) {
        totalAnswers = totalAnswers + 1;
      }
    });

    return totalAnswers;
  }
  return 0;
};

export const updateQuestionWithAnswer = (question, selectedAnswer) => {
  if (question && selectedAnswer) {
    const updateQuestion = {
      ...question,
      [FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER]: selectedAnswer,
    };

    return updateQuestion;
  }

  return null;
};

export const updateSilageState = (selectedSilage, updatedQuestion) => {
  let newSilageState = null;
  if (
    selectedSilage &&
    selectedSilage?.[FORAGE_AUDIT_SCORECARD.QUESTIONS] &&
    selectedSilage?.[FORAGE_AUDIT_SCORECARD.QUESTIONS]?.length > 0
  ) {
    const newQuestionsList =
      selectedSilage?.[FORAGE_AUDIT_SCORECARD.QUESTIONS]?.map(question => {
        if (
          question?.[FORAGE_AUDIT_SCORECARD.INDEX] ===
          updatedQuestion?.[FORAGE_AUDIT_SCORECARD.INDEX]
        ) {
          return updatedQuestion;
        } else {
          return question;
        }
      }) || [];

    newSilageState = {
      ...selectedSilage,
      [FORAGE_AUDIT_SCORECARD.QUESTIONS]: newQuestionsList,
    };

    return newSilageState;
  }
};

export const updateForageAuditData = (forageAuditData, silageData) => {
  let localForageAuditState = { ...forageAuditData };
  if (
    localForageAuditState &&
    localForageAuditState?.[FORAGE_AUDIT_SCORECARD.SECTIONS] &&
    localForageAuditState?.[FORAGE_AUDIT_SCORECARD.SECTIONS]?.length > 0
  ) {
    for (
      let sectionCounter = 0;
      sectionCounter <
      localForageAuditState?.[FORAGE_AUDIT_SCORECARD.SECTIONS].length;
      sectionCounter++
    ) {
      const section =
        localForageAuditState?.[FORAGE_AUDIT_SCORECARD.SECTIONS]?.[
          sectionCounter
        ];

      if (
        section?.[FORAGE_AUDIT_SCORECARD.INDEX] ===
          silageData?.[FORAGE_AUDIT_SCORECARD.SECTION_INDEX] &&
        section?.[FORAGE_AUDIT_SCORECARD.SCORECARD_SILAGES] &&
        section?.[FORAGE_AUDIT_SCORECARD.SCORECARD_SILAGES]?.length > 0
      ) {
        const updatedScorecardSilages = section?.[
          FORAGE_AUDIT_SCORECARD.SCORECARD_SILAGES
        ]?.map(scorecard => {
          if (
            scorecard?.[FORAGE_AUDIT_SCORECARD.SECTION_SILAGE_TYPE] ==
            silageData?.[FORAGE_AUDIT_SCORECARD.SECTION_SILAGE_TYPE]
          ) {
            return silageData;
          } else {
            return scorecard;
          }
        });

        localForageAuditState[FORAGE_AUDIT_SCORECARD.SECTIONS][sectionCounter][
          FORAGE_AUDIT_SCORECARD.SCORECARD_SILAGES
        ] = updatedScorecardSilages;

        break;
      }
    }

    return localForageAuditState;
  }
};

export const getScorecardResults = selectedSilageState => {
  if (
    selectedSilageState &&
    selectedSilageState?.[FORAGE_AUDIT_SCORECARD.QUESTIONS]?.length > 0
  ) {
    let totalSelectedAnswersScore = 0;
    let totalQuestionScore = 0;

    selectedSilageState?.[FORAGE_AUDIT_SCORECARD.QUESTIONS]?.map(question => {
      if (
        question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] &&
        question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] != null &&
        question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER] != undefined
      ) {
        totalSelectedAnswersScore =
          totalSelectedAnswersScore +
            question?.[FORAGE_AUDIT_SCORECARD.SELECTED_ANSWER]?.[
              FORAGE_AUDIT_SCORECARD.POINT_VALUE
            ] || 0;
      }

      const optimalAnswer =
        question?.[FORAGE_AUDIT_SCORECARD.AVAILABLE_ANSWERS] &&
        question?.[FORAGE_AUDIT_SCORECARD.AVAILABLE_ANSWERS]?.length > 0 &&
        question?.[FORAGE_AUDIT_SCORECARD.AVAILABLE_ANSWERS]?.reduce(
          (prev, current) => {
            return prev?.[FORAGE_AUDIT_SCORECARD.POINT_VALUE] >
              current?.[FORAGE_AUDIT_SCORECARD.POINT_VALUE]
              ? prev
              : current;
          },
        );

      totalQuestionScore =
        totalQuestionScore +
          optimalAnswer?.[FORAGE_AUDIT_SCORECARD.POINT_VALUE] || 0;
    });

    return (
      Math.round((totalSelectedAnswersScore / totalQuestionScore) * 100) || 0
    );
  }
};

export const getKeyFromLocaleFile = (value = '') => {
  const key = Object.keys(enJson).find(k => enJson[k] === value);
  return key || null;
};
