import React, { useEffect } from 'react';
import globalStore from '../com/thunk';
import HomePage from '../com/components/HomePage';
import PrivacynoticePage from '../com/components/PrivacynoticePage';
import AssessmentInstrPage from '../com/components/AssessmentInstrPage';
import ActivityController from '../com/components/ActivityController';
import {
  generateShuffledFromArray,
  generateShuffledNumbers,
} from '../com/helpers/helperFunction';
import CertificationCard from '../com/components/CertificationCard';
import PdfButton from '../com/components/PdfButton';
import PDFContent from '../com/components/PDFContent';
import AssessmentReport from '../com/components/AssesmentReport/AssessmentReportMain';

const App = () => {
  const { setStartTime } = globalStore.useStoreActions(
    (store) => store.activity
  );
  const { valuesObj, images } = globalStore.useStoreState(
    (store) => store.player
  );
  const { setLocation, saveData } = globalStore.useStoreActions(
    (store) => store.scromInfo
  );
  const { location, scormData } = globalStore.useStoreState(
    (store) => store.scromInfo
  );

  useEffect(() => {
    // @ts-ignore
    window.setPage = (_str: string) => {
      setLocation(_str);
    };
  }, []);

  const generateQuestions = () => {
    const _general = valuesObj.generalConfig;
    const _tabs = valuesObj.tabs;
    const _scormRep = { ...scormData };

    Object.keys(_tabs).map((_t) => {
      if (
        _scormRep?.tabs?.[_t] == undefined ||
        (_scormRep?.tabs?.[_t]?.questions && _scormRep?.tabs?.[_t]?.score < 65)
      ) {
        const _ques = _tabs[_t].numberOfQuestions || _general.numberOfQuestions;
        let questions: number[];
        if (typeof _ques == 'number') {
          if (valuesObj.generalConfig.shuffleQuestions) {
            questions = generateShuffledNumbers(
              0,
              _tabs[_t].questionBank?.length - 1 || 0,
              _ques
            );
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
              categoryIndices = generateShuffledFromArray(
                categoryQuestions,
                count as number
              );
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
      }
    });
    console.log(_scormRep, '_scormRep');

    saveData(_scormRep);
  };

  const startAssessment = () => {
    generateQuestions();
    const tabs = Object.keys(valuesObj.tabs);
    let i = 0;
    for (i = 0; i < tabs.length; i++) {
      if (scormData.tabs[tabs[i]].score < 65) {
        break;
      }
    }
    setStartTime(new Date());
    setLocation(`mainActivity_${i}_start`);
  };

  const extractScore = () => {
    // var _arr = [70, 60, 48, 75, 60]; // Debug purpose only.
    const _fObj: { [key: string]: number } = {};
    let _avg = 0;
    Object.keys(scormData.tabs).forEach((_t, _i) => {
      // scormData.tabs[_t].score = _arr[_i]; // Debug purpose only.
      _fObj[_t] = scormData.tabs[_t].score;
      _avg += scormData.tabs[_t].score;
    });
    _avg = Math.round(_avg / Object.keys(scormData.tabs).length);
    return {
      scores: _fObj,
      average: _avg,
    };
  };

  if (location.includes('mainActivity')) {
    const selectedTab = location.split('_')[1];
    const page = location.split('_')[2];
    const question = location.split('_')[3];
    return (
      <ActivityController
        page={page}
        selectedTab={selectedTab}
        activeQuestion={Number(question)}
      />
    );
  }

  switch (location) {
    case 'home':
      return (
        <HomePage
          title='colocation'
          heading='associateCertification'
          description='homeDescription'
          clickHandler={() => {
            setLocation('privacy');
          }}
        />
      );
    case 'privacy':
      return (
        <PrivacynoticePage
          title='privacytitleText'
          description='privacynoticeText'
          clickHandler={() => {
            setLocation('assessmentInstr');
          }}
        />
      );
    case 'assessmentInstr':
      return (
        <AssessmentInstrPage
          title='assessmentInstructionsTitle'
          description='assessmentInstructions'
          clickHandler={startAssessment}
        />
      );

    case 'results':
      return <CertificationCard {...extractScore()} />;
    case 'pdf':
      return <PDFContent />;
    case 'pdfContent':
      const assessmentData = {
        overallScore: 23,
        sectionScores: [
          { label: 'Segment', score: 80 },
          { label: 'EcoStruxure Domain', score: 75 },
          { label: 'Sustainability, Software & Services', score: 67 },
          { label: 'Sales Sills', score: 70 },
          { label: 'Sales Tools & Processes', score: 98 },
        ],
        passingScore: {
          overall: 50,
          section: 15,
        },
      };
      return (
        <div style={{ overflowY: 'auto', height: 'inherit' }}>
          <AssessmentReport data={assessmentData} images={images} />
        </div>
      );
  }
};

export default App;
