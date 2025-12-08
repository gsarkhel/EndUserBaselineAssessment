import React, { useEffect, useState } from 'react';
import NavigationTabs from './NavigationTabs';
import styles from '../styles/Segmentsummary.scss';
import globalStore from '../thunk';
import { extendedTabs } from '../interface/helperInterface';
import SummaryScreen from './SummaryScreen';
import ResultsCard from './ResultsCard';
import MainAssessment from './MainAssessment';
import { t } from '../helpers/LanguageTranslator';
import { sanitizeString } from '../helpers/scrom';
import ResultsCardRetake from './ResultsCardRetake';
import { generateShuffledFromArray, generateShuffledNumbers } from '../helpers/helperFunction';

interface activityControllerPropsInterface {
  page?: string;
  selectedTab?: string;
  activeQuestion?: number;
}

const ActivityController = (props: activityControllerPropsInterface) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<extendedTabs[]>([]);

  const { page, selectedTab, activeQuestion } = props;

  const { valuesObj } = globalStore.useStoreState((st) => st.player);
  const { scormData } = globalStore.useStoreState((store) => store.scromInfo);

  const { setLocation, setData, setInterations, setActiveSession } =
    globalStore.useStoreActions((store) => store.scromInfo);

  const { setShowProgress, setProgress, setStartTime, setShowAttempt } =
    globalStore.useStoreActions((store) => store.activity);

  const { startTime, recheckMode } = globalStore.useStoreState((store) => store.activity);

  // ---------------------------------------------------------
  // NEW: Select correct question bank based on attempt number
  // ---------------------------------------------------------
  const getActiveQuestionBank = (tabId: string) => {
    const tab = valuesObj.tabs[tabId];
    const attempt = scormData.totalAttempts || 0;

    if (attempt === 0) {
      console.log('Using original question bank for first attempt');
      return tab.questionBank;
    }

    if (!tab.retryQuestionBank || tab.retryQuestionBank.length === 0) {
      console.log('No retry question bank found, using original question bank');
      return tab.questionBank;
    }
    console.log('Using retry question bank for attempt number:', attempt);
    return tab.retryQuestionBank;
  };

  // ---------------------------------------------------------
  // NEW: Transform retry questions for testing (_newSet added)
  // ---------------------------------------------------------
  const transformQuestionForRetry = (question: any, isRetry: boolean) => {
    if (!question || !isRetry) return question;
    // console.log('Transforming question for retry:', question);
    return {
      ...question,
      q: question.q,
      opt: question.opt.map((o: string) => o)
    };
  };

  // ---------------------------------------------------------
  // LIFECYCLE
  // ---------------------------------------------------------
  useEffect(() => {
    setShowProgress(true);
    setShowAttempt(true);
    return () => {
      setShowProgress(false);
      setShowAttempt(false);
    };
  }, []);

  useEffect(() => {
    if (startTime == undefined) {
      setStartTime(new Date());
    }
  }, []);

  useEffect(() => {
    if (tabs.length > 0 && page == 'activity') {
      let _act = activeQuestion || 0;
      let _qCount = _act;
      let _totalCount = 0;

      Object.keys(scormData.tabs).forEach((_t, _ind) => {
        _totalCount += scormData.tabs[_t].questions.length;
        if (_ind < activeTab) {
          _qCount += scormData.tabs[_t].questions.length;
        }
      });

      setProgress((_qCount / (_totalCount - 1)) * 100);
    }
  }, [activeQuestion, activeTab, tabs]);

  useEffect(() => {
    setActiveTab(Number(selectedTab));
  }, [selectedTab]);

  useEffect(() => {
    const _tabs: extendedTabs[] = [];
    Object.keys(valuesObj.tabs).map((_key) => {
      _tabs.push({
        id: _key,
        title: valuesObj.tabs[_key].title,
        description: valuesObj.tabs[_key].description,
        numberOfQuestions: 0,
        questionBank: [],
        retryQuestionBank: [],
        totalScore: 100,
        bgImage: valuesObj.tabs[_key].bgImage
      });
    });
    setTabs(_tabs);
  }, [valuesObj]);

  // ---------------------------------------------------------
  // Debug answer log
  // ---------------------------------------------------------
  useEffect(() => {
    if (tabs.length === 0) return;

    const tabId = tabs[activeTab]?.id;
    const bank = getActiveQuestionBank(tabId);
    const isRetry = (scormData.totalAttempts || 0) > 0;

    const index = scormData.tabs[tabId]?.questions?.[activeQuestion];
    const qRaw = bank?.[index];
    const q = transformQuestionForRetry(qRaw, isRetry);

    if (q) {
      if (typeof q.ans === "object") {
        console.log("Answers:", q.ans.map((op: number) => t(q.opt[op])));
      } else {
        console.log("Answers:", t(q.opt[q.ans]));
      }
    }
  }, [activeQuestion]);

  // ---------------------------------------------------------
  // Tab Change Handler
  // ---------------------------------------------------------
  const handleTabChange = (tabId: string) => {
    const _i = tabs.findIndex((_v) => _v.id == tabId);
    setActiveTab(_i);
  };

  // ---------------------------------------------------------
  // Generate Questions (Start or Retake)
  // ---------------------------------------------------------
  const generateQuestionAndStart = () => {
    const _general = valuesObj.generalConfig;
    const _tabs = valuesObj.tabs;
    const _t = tabs[activeTab]?.id;

    const _ques = _tabs[_t].numberOfQuestions || _general.numberOfQuestions;
    const _scormRep = { ...scormData };

    const bank = getActiveQuestionBank(_t); // NEW
    let questions: number[];

    if (typeof _ques == 'number') {
      if (valuesObj.generalConfig.shuffleQuestions) {
        questions = generateShuffledNumbers(0, bank.length - 1, _ques);
      } else {
        questions = Array(_ques).fill(0).map((_, i) => i);
      }
    } else {
      questions = [];

      Object.entries(_ques).forEach(([category, count]) => {
        const catItems = bank
          ?.map((q, i) => (q.pool === category ? i : undefined))
          .filter((x) => x !== undefined);

        let selected;

        if (valuesObj.generalConfig.shuffleQuestions) {
          selected = generateShuffledFromArray(catItems, count as number);
        } else {
          selected = Array(count).fill(0).map((_, i) => catItems[i]);
        }

        questions.push(...selected);
      });
    }

    if (!_scormRep.tabs) _scormRep.tabs = {};
    if (!_scormRep.tabs[_t]) {
      _scormRep.tabs[_t] = { questions: [], score: 0, correctCount: 0 };
    }

    _scormRep.tabs[_t].questions = questions;
    _scormRep.tabs[_t].score = 0;
    _scormRep.tabs[_t].correctCount = 0;

    setData(_scormRep);
    setLocation(`mainActivity_${activeTab}_start`);
  };

  // ---------------------------------------------------------
  // Evaluate Question
  // ---------------------------------------------------------
  const evaluateAndNext = (_selected: number[]) => {
    const tabId = tabs[activeTab]?.id;
    const bank = getActiveQuestionBank(tabId);
    const isRetry = (scormData.totalAttempts || 0) > 0;

    const qIndex = scormData.tabs[tabId].questions[activeQuestion];
    const raw = bank[qIndex];
    const _ques = transformQuestionForRetry(raw, isRetry); // NEW

    const next = activeQuestion + 1;
    let _score = 0;
    let _optStr: string[];

    const _tScore = 100 / scormData.tabs[tabId].questions.length;
    let _w = 1;

    if (_ques.weightage) {
      _w = _ques.weightage[_selected[0]];
      _score = _tScore * _w;
      _optStr = [_ques.opt[_selected[0]]];
    } else if (typeof _ques.ans === "object") {
      _score = JSON.stringify(_selected.sort()) === JSON.stringify(_ques.ans) ? _tScore : 0;
      _optStr = _selected.map((i) => _ques.opt[i]);
      _w = _score > 0 ? 1 : 0;
    } else {
      _score = _selected[0] === _ques.ans ? _tScore : 0;
      _optStr = [_ques.opt[_selected[0]]];
      _w = _score > 0 ? 1 : 0;
    }

    // Record answer
    scormData.tabs[tabId].score += _score;
    scormData.tabs[tabId].correctCount += _score > 0 ? 1 : 0;

    if (!scormData.tabs[tabId].answers) scormData.tabs[tabId].answers = [];
    scormData.tabs[tabId].answers[activeQuestion] = _selected;

    let nextLoc;

    if (scormData.tabs[tabId].questions.length <= next) {
      scormData.tabs[tabId].result =
        scormData.tabs[tabId].score > valuesObj.generalConfig.passingCriteria ? "passed" : "failed";
      nextLoc = `mainActivity_${activeTab}_result`;
    } else {
      nextLoc = `mainActivity_${activeTab}_activity_${next}`;
    }

    setData(scormData);
    setLocation(nextLoc);
  };

  // ---------------------------------------------------------
  // Final Result Navigation
  // ---------------------------------------------------------
  const finalLocation = () => {
    let i = activeTab + 1;
    for (0; i < tabs.length; i++) {
      if (scormData.tabs[tabs[i]?.id].score < valuesObj.generalConfig.passingCriteria) {
        break;
      }
    }

    if (tabs.length <= i) {
      setData({ ...scormData, lastAttempt: new Date().toISOString() });
      setActiveSession(true);
      setLocation("results");
    } else if (scormData.totalAttempts > 0) {
      setLocation(`mainActivity_${i}_resultRetake`);
    } else {
      setLocation(`mainActivity_${i}_start`);
    }
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  let centeralArea;

  const weightagePresent =
    valuesObj.tabs[tabs[activeTab]?.id]?.questionBank?.some((q) => q.weightage !== undefined);

  if (tabs.length === 0) {
    centeralArea = "No Tabs Data";
  }

  else if (page === "start") {
    centeralArea = (
      <SummaryScreen
        title={tabs[activeTab]?.title}
        description={tabs[activeTab]?.description}
        src={tabs[activeTab]?.bgImage}
        clickHandler={() => setLocation(`mainActivity_${activeTab}_activity_0`)}
      />
    );
  }

  else if (page === "activity") {
    const tabId = tabs[activeTab].id;
    const bank = getActiveQuestionBank(tabId);
    const isRetry = (scormData.totalAttempts || 0) > 0;

    const qIndex = scormData.tabs[tabId].questions[activeQuestion];
    const raw = bank[qIndex];
    const qData = transformQuestionForRetry(raw, isRetry);

    centeralArea = (
      <MainAssessment
        qText={qData.q}
        options={qData.opt}
        optionType={qData.optType}
        type={["MCSS", "WeightMCSS"].includes(qData.type) ? "radio" : "checkbox"}
        clickHandler={evaluateAndNext}
        selectedAns={
          recheckMode ? scormData.tabs[tabId]?.answers?.[activeQuestion] : undefined
        }
      />
    );
  }

  else if (page === "result") {
    centeralArea = (
      <ResultsCard
        clickHandler={finalLocation}
        title={tabs[activeTab]?.title}
        questionsAttempted={scormData.tabs[tabs[activeTab]?.id].questions.length}
        correctResponses={
          weightagePresent
            ? scormData.tabs[tabs[activeTab]?.id].score / 10
            : scormData.tabs[tabs[activeTab]?.id].correctCount
        }
        percentage={scormData.tabs[tabs[activeTab]?.id].score}
        weightagePresent={weightagePresent}
      />
    );
  }

  else if (page === "resultRetake") {
    centeralArea = (
      <ResultsCardRetake
        clickHandler={generateQuestionAndStart}
        title={tabs[activeTab]?.title}
        questionsAttempted={scormData.tabs[tabs[activeTab]?.id].questions.length}
        correctResponses={
          weightagePresent
            ? scormData.tabs[tabs[activeTab]?.id].score / 10
            : scormData.tabs[tabs[activeTab]?.id].correctCount
        }
        percentage={scormData.tabs[tabs[activeTab]?.id].score}
        weightagePresent={weightagePresent}
      />
    );
  }

  return (
    <div className={styles.ecostruxurePage}>
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
        resultPage={page === "result"}
      />
      {centeralArea}
    </div>
  );
};

export default ActivityController;
