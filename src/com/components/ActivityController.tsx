import React, { useEffect, useState } from 'react';
import NavigationTabs from './NavigationTabs';
import styles from '../styles/Segmentsummary.scss';
import globalStore from '../thunk';
import { extendedTabs } from '../interface/helperInterface';
import SummaryScreen from './SummaryScreen';
import ResultsCard from './ResultsCard';
import MainAssessment from './MainAssessment';
import { t } from '../helpers/LanguageTranslator';
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
  const { setLocation, setData, setInterations, setScore, setActiveSession } = globalStore.useStoreActions(
    (store) => store.scromInfo
  );
  const { setShowProgress, setProgress, setStartTime, setShowAttempt } = globalStore.useStoreActions(
    (store) => store.activity
  );
  const { startTime, recheckMode } = globalStore.useStoreState((store) => store.activity);

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
        totalScore: 100,
        bgImage: valuesObj.tabs[_key].bgImage,
      });
    });
    setTabs(_tabs);
  }, [valuesObj]);

  useEffect(() => {
    let _ind = scormData.tabs[tabs[activeTab]?.id]?.questions?.[activeQuestion];
    let _qData = valuesObj.tabs[tabs[activeTab]?.id]?.questionBank?.[_ind];
    if (_qData) {
      if (typeof _qData.ans === 'object') {
        console.log(
          'Answers :- ',
          _qData.ans.map((_op: number) => t(_qData.opt[_op]))
        );
      } else {
        console.log('Answers :- ', t(_qData.opt[_qData.ans]));
      }
    }
  }, [activeQuestion]);

  const handleTabChange = (tabId: string) => {
    const _i = tabs.findIndex((_v) => _v.id == tabId);
    setActiveTab(_i);
  };

  const generateQuestionAndStart = () => {
    const _general = valuesObj.generalConfig;
    const _tabs = valuesObj.tabs;
    const _t = tabs[activeTab]?.id;

    const _ques = _tabs[_t].numberOfQuestions || _general.numberOfQuestions;
    const _scormRep = { ...scormData };
    let questions: number[];
    console.log('questionGenerate 2', _t);

    if (typeof _ques == 'number') {
      if (valuesObj.generalConfig.shuffleQuestions) {
        questions = generateShuffledNumbers(0, _tabs[_t].questionBank?.length - 1 || 0, _ques);
      } else {
        questions = Array(_ques)
          .fill(3)
          .map((_v, _ind) => _ind);
      }
    } else {
      questions = [];

      Object.entries(_ques).forEach(([category, count]) => {
        const categoryQuestions =
          _tabs[_t].questionBank
            ?.map((q, _ind) => (q.pool === category ? _ind : undefined))
            .filter((_k) => _k !== undefined) || [];
        let categoryIndices: number[];
        if (valuesObj.generalConfig.shuffleQuestions) {
          categoryIndices = generateShuffledFromArray(categoryQuestions, count as number);
        } else {
          categoryIndices = Array(count)
            .fill(3)
            .map((_v, _ind) => categoryQuestions[_ind]);
        }
        questions.push(...categoryIndices);
      });
    }
    if (_scormRep?.tabs == undefined) {
      _scormRep.tabs = {};
    }
    if (_scormRep.tabs?.[_t] == undefined) {
      _scormRep.tabs[_t] = {
        questions: [],
        score: 0,
        correctCount: 0,
      };
    }
    _scormRep.tabs[_t].questions = questions;
    _scormRep.tabs[_t].score = 0;
    _scormRep.tabs[_t].correctCount = 0;
    setData(_scormRep);
    setLocation(`mainActivity_${activeTab}_start`);
  };

  const evaluateAndNext = (_selected: number[]) => {
    const _nQues = Number(activeQuestion) + 1;
    const _qId = scormData.tabs[tabs[activeTab]?.id].questions[activeQuestion];
    const _ques = valuesObj.tabs[tabs[activeTab]?.id].questionBank[_qId];
    let _score = 0;
    let _optStr: string[];
    const _tScore = 100 / scormData.tabs[tabs[activeTab]?.id].questions.length;
    let _w = 1;
    if (_ques.weightage) {
      _w = _ques.weightage[_selected[0]];
      _score = _tScore * _w;
      _optStr = [_ques.opt[_selected[0]]];
    } else if (typeof _ques.ans === 'object') {
      _score = JSON.stringify(_selected.sort()) == JSON.stringify(_ques.ans) ? _tScore : 0;
      _optStr = _selected.map((_t) => _ques.opt[_t]);
    } else {
      _score = _selected[0] == _ques.ans ? _tScore : 0;
      _optStr = [_ques.opt[_selected[0]]];
    }

    console.log(_score, 'score');

    let _qCount = activeQuestion || 0;
    Object.keys(scormData.tabs).forEach((_t, _ind) => {
      if (_ind < activeTab) {
        _qCount += scormData.tabs[_t].questions.length;
      }
    });

    // `Scene2_QuestionDraw11_Slide6_MultiChoice_0_0`
    setInterations({
      index: _qCount,
      data: {
        id: `attempt_${scormData.totalAttempts + 1}_${t(tabs[activeTab]?.title)
          .replaceAll(' ', '_')
          .replaceAll('&', 'n')
          .replaceAll(',', '')}_${_nQues}`,
        response: _optStr.map((_t) => t(_t)),
        feedback:
          _ques.weightage !== undefined
            ? _ques.weightage == 0
              ? 'incorrect'
              : _ques.weightage == 1
              ? 'correct'
              : 'neutral'
            : _score > 0
            ? 'correct'
            : 'incorrect',
        answer: (typeof _ques.ans === 'object'
          ? _ques.ans
          : _ques.ans == undefined
          ? _ques.opt.map((_v: any, _i: any) => _i)
          : [_ques.ans]
        ).map((_t: string) => t(_ques.opt[_t])),
        question: t(_ques.q),
        weightage: _w,
      },
    });

    scormData.tabs[tabs[activeTab]?.id].score += _score;
    scormData.tabs[tabs[activeTab]?.id].correctCount += _score > 0 ? 1 : 0;
    if (scormData.tabs[tabs[activeTab]?.id].answers == undefined) {
      scormData.tabs[tabs[activeTab]?.id].answers = [];
    }
    scormData.tabs[tabs[activeTab]?.id].answers[activeQuestion] = _selected;
    let _loc = '';
    if (scormData.tabs[tabs[activeTab]?.id].questions.length <= _nQues) {
      scormData.tabs[tabs[activeTab]?.id].result =
        scormData.tabs[tabs[activeTab]?.id].score > valuesObj.generalConfig.passingCriteria ? 'passed' : 'failed';
      _loc = `mainActivity_${activeTab}_result`;
    } else {
      _loc = `mainActivity_${activeTab}_activity_${_nQues}`;
    }

    const _fObj: { [key: string]: number } = {};
    let _avg = 0;
    Object.keys(scormData.tabs).forEach((_t) => {
      _fObj[_t] = scormData.tabs[_t].score;
      _avg += scormData.tabs[_t].score;
    });
    _avg = _avg / Object.keys(scormData.tabs).length;
    // setScore(_avg);
    setData(scormData);
    setLocation(_loc);
  };

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
      setLocation(`results`);
    } else if (scormData.totalAttempts > 0) {
      setLocation(`mainActivity_${i}_resultRetake`);
    } else {
      setLocation(`mainActivity_${i}_start`);
    }
  };

  let centeralArea;
  if (tabs.length == 0) {
    centeralArea = 'No Tabs Data';
  } else if (page == 'start') {
    centeralArea = (
      <SummaryScreen
        title={tabs[activeTab]?.title}
        description={tabs[activeTab]?.description}
        src={tabs[activeTab]?.bgImage}
        // src="summery"
        clickHandler={() => {
          setLocation(`mainActivity_${activeTab}_activity_0`);
        }}
      />
    );
  } else if (page == 'activity') {
    let _ind = scormData.tabs[tabs[activeTab].id].questions[activeQuestion];
    let _qData = valuesObj.tabs[tabs[activeTab].id].questionBank[_ind];

    centeralArea = (
      <MainAssessment
        qText={_qData.q}
        options={_qData.opt}
        optionType={_qData.optType}
        type={['MCSS', 'WeightMCSS'].includes(_qData.type) ? 'radio' : 'checkbox'}
        clickHandler={evaluateAndNext}
        selectedAns={recheckMode ? scormData.tabs[tabs[activeTab]?.id]?.answers?.[activeQuestion] : undefined}
      />
    );
  } else if (page == 'result') {
    centeralArea = (
      <ResultsCard
        clickHandler={finalLocation}
        title={tabs[activeTab]?.title}
        questionsAttempted={scormData.tabs[tabs[activeTab]?.id].questions.length}
        correctResponses={scormData.tabs[tabs[activeTab]?.id].correctCount}
        percentage={scormData.tabs[tabs[activeTab]?.id].score}
      />
    );
  } else if (page == 'resultRetake') {
    centeralArea = (
      <ResultsCardRetake
        clickHandler={generateQuestionAndStart}
        title={tabs[activeTab]?.title}
        questionsAttempted={scormData.tabs[tabs[activeTab]?.id].questions.length}
        correctResponses={scormData.tabs[tabs[activeTab]?.id].correctCount}
        percentage={scormData.tabs[tabs[activeTab]?.id].score}
      />
    );
  }

  return (
    <div className={styles.ecostruxurePage}>
      <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} resultPage={page == 'result'} />
      {centeralArea}
    </div>
  );
};

export default ActivityController;

