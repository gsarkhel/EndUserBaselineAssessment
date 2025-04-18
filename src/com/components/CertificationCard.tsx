import React, { useEffect, useState } from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/certificationCard.scss';
import styles2 from '../styles/FinalResultPage2.scss';

import styles3 from '../styles/FinalResultPage3.scss';

import parentStyles from '../styles/commonStyles.scss';
import ButtonComponent from './ButtonComponent';
import globalStore from '../thunk';
import parse from 'html-react-parser';
import ResultProgressCircle from './ProgressCircle';
import ProgressBar from './ProgressBarsFinal';
// for pdf generations
import { useRef } from 'react';
import '../../../public/common/assets/fonts/fonts.css';
import ConfirmationModal from './ConfirmationModalProps';
import { Margin, usePDF } from 'react-to-pdf';
import AssessmentReport from './AssesmentReport/AssessmentReportMain';
// import ResultProgressCircle

interface CertificationCardPropsInterface {
  scores: { [key: string]: number };
  average: number;
  clickHandler?: Function;
  emailAddress?: string;
}

const CertificationCard = (props: CertificationCardPropsInterface) => {
  const {
    clickHandler,
    scores = {},
    average = 0,
    emailAddress = 'commercial.excellence.academy@se.com',
  } = props;

  const targetRef = useRef<HTMLDivElement>();

  const { images } = globalStore.useStoreState((st) => st.player);
  const { valuesObj } = globalStore.useStoreState((store) => store.player);
  const { scormData, startScreen } = globalStore.useStoreState(
    (store) => store.scromInfo
  );
  const { setLocation, setData, setComplition, setStartScreen } =
    globalStore.useStoreActions((store) => store.scromInfo);
  const { setRecheckMode } = globalStore.useStoreActions(
    (store) => store.activity
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const _general = valuesObj.generalConfig;
  const isPassed =
    _general.passingCriteria < average &&
    Object.keys(scores).every((_i) => scores[_i] > _general.passingCriteria);

  const lastAttemptDate = new Date(
    scormData.lastAttempt || new Date().toISOString()
  );
  const timeIntervalInMs = _general.timeForNext * 60 * 1000; // Convert minutes to milliseconds
  // const hasTimeIntervalPassed = startScreen == 'results' && scormData.totalAttempts > 0 ? true : Date.now() >= lastAttemptDate?.getTime() + timeIntervalInMs;
  const hasTimeIntervalPassed =
    scormData.totalAttempts > 0
      ? true
      : Date.now() >= lastAttemptDate?.getTime() + timeIntervalInMs;
  console.log(startScreen);

  const pdfRef = useRef<HTMLDivElement>(null);

  const confirmationPopup = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalStart = () => {
    setData({
      ...scormData,
      totalAttempts: scormData.totalAttempts + 1,
      lastAttempt: new Date().toISOString(),
    });
    setIsModalOpen(false);
    let i = 0;
    let tabs = Object.keys(scormData.tabs);
    for (0; i < tabs.length; i++) {
      if (
        scormData.tabs[tabs[i]].score < valuesObj.generalConfig.passingCriteria
      ) {
        break;
      }
    }
    setLocation(`mainActivity_${i}_resultRetake`);
    setStartScreen(`mainActivity_${i}_resultRetake`);
    // setLocation('assessmentInstr');
  };

  useEffect(() => {
    //@ts-ignore
    window.setPastTime = () => {
      const timeForNextMs = _general.timeForNext * 60 * 1000;
      const pastDate = new Date(Date.now() - timeForNextMs - 1000);

      setData({
        ...scormData,
        lastAttempt: pastDate.toISOString(),
      });
    };

    //@ts-ignore
    window.passAssignment = () => {
      let _sc = { ...scormData };
      Object.keys(_sc.tabs).forEach((_y, _ind) => {
        _sc.tabs[_y].score = Math.random() * 35 + 65;
      });
      console.log(_sc);

      setData(_sc);
    };

    //@ts-ignore
    window.recheck = () => {
      setRecheckMode(true);
      setLocation(`mainActivity_0_activity_0`);
    };
  });

  const downloadPdf = () => {
    const targetElement = targetRef.current;
    if (targetElement) {
      // Create a new container for print content
      const printContainer = document.createElement('div');
      printContainer.innerHTML = targetElement.innerHTML;

      // Store original elements
      const originalBody = document.body.cloneNode(true);
      const originalElements = Array.from(
        document.body.children
      ) as HTMLDivElement[];

      // Hide original content
      originalElements.forEach((element) => {
        element.style.display = 'none';
      });

      // Add print content and styles
      document.body.appendChild(printContainer);
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body { margin: 0; }
          @page { size: 230mm 265mm; margin: 0; }
        }
      `;
      document.head.appendChild(style);

      // Print
      window.print();

      // Cleanup: remove print elements and restore original
      printContainer.remove();
      style.remove();
      originalElements.forEach((element) => {
        element.style.display = '';
      });
    }
  };

  const getFormattedTimeRemaining = () => {
    const timeRemainingMs = Math.max(
      0,
      lastAttemptDate?.getTime() + timeIntervalInMs - Date.now()
    );

    // Round up to nearest hour first
    const totalHoursRoundedUp = Math.ceil(timeRemainingMs / (60 * 60 * 1000));
    const totalMs = totalHoursRoundedUp * 60 * 60 * 1000;

    const days = Math.floor(totalMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (totalMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );

    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : '0 hours';
  };

  useEffect(() => {
    setComplition(average);
  }, []);

  const closeCourse = () => {
    window.top.close();
  };

  let centralArea = (
    <div className={styles2.rightSection}>
      <div className={styles2.badgeContainer}>
        <div className={styles2.imgCont}>
          <img src={images.warningPng?.url} alt={t('badgeAlt')} />
        </div>
        <div className={styles2.mainDivContainer}>
          <h2 className={styles2.congratsTitle}>{t('failText')}</h2>
        </div>
      </div>

      <p className={styles2.messageText}>
        {parse(t('finalResult2Text1') || '')}
      </p>

      <div className='text-center mt-4'></div>

      <div
        className={`${parentStyles.fullWidth} ${parentStyles.displayCenter} ${styles2.button1}`}
      >
        <ButtonComponent text={t('buttonText')} clickHandler={downloadPdf} />
      </div>
      <p className={styles2.messageText1} style={{ marginBottom: '11px' }}>
        {parse(t('finalResult2Text2') || '')}
      </p>
      <p className={styles2.messageText}>
        {parse(t('finalResult2Text3') || '')}
      </p>
      {scormData.totalAttempts < 6 ? (
        <div className={styles2.countdownSection}>
          <div className={styles2.clockIconContainer}>
            <img src={images.stopWatch?.url} alt='Clock Icon' />
          </div>
          <p className={styles2.countdownText}>
            {parse(
              t('timerText').replace('{days}', getFormattedTimeRemaining()) ||
                ''
            )}
          </p>
        </div>
      ) : null}
    </div>
  );

  if (isPassed) {
    centralArea = (
      <div className={styles.rightSection}>
        <div className={styles.badgeContainer}>
          <div className={styles.imgCont}>
            <img src={images.key1?.url} alt={t('badgeAlt')} />
          </div>
          <h2 className={styles.congratsTitle}>{t('congratsText')}</h2>
        </div>

        <p className={styles.messageText}>{parse(t('message1') || '')}</p>

        <div className='text-center mt-4'></div>

        <div
          className={`${parentStyles.fullWidth} ${parentStyles.displayCenter} ${styles.button1}`}
        >
          <ButtonComponent text={t('buttonText')} clickHandler={downloadPdf} />
        </div>
      </div>
    );
  } else if (
    hasTimeIntervalPassed &&
    _general.totalAttempts > scormData.totalAttempts
  ) {
    centralArea = (
      <div className={styles3.rightSection}>
        <div className={styles3.badgeContainer}>
          <div className={styles3.imgCont}>
            <img src={images.warningPng?.url} alt={t('badgeAlt')} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h2 className={styles3.congratsTitle}>{t('failText')}</h2>
          </div>
        </div>

        <p className={styles3.messageText}>
          {parse(t('finalResult2Text1') || '')}
        </p>

        <div className='text-center mt-4'></div>

        <div
          className={`${parentStyles.fullWidth} ${parentStyles.displayCenter} ${styles3.button1}`}
        >
          <ButtonComponent text={t('buttonText')} clickHandler={downloadPdf} />
        </div>
        <p className={styles3.messageText1} style={{ marginBottom: '11px' }}>
          {parse(t('finalResult2Text2') || '')}
        </p>

        <p className={styles3.messageText}>
          {parse(t('finalResult2Text3') || '')}
        </p>

        <div
          className={`${parentStyles.fullWidth} ${parentStyles.displayCenter} ${styles3.button2}`}
        >
          <ButtonComponent
            text={t('finalResult3Text1')
              ?.replace('{total}', `${_general.totalAttempts}`)
              ?.replace(
                '{current}',
                `${_general.totalAttempts - scormData.totalAttempts}`
              )}
            clickHandler={confirmationPopup}
          />
        </div>
      </div>
    );
  }

  const _fObj: { label: string; score: number }[] = [];
  let _avg = 0;
  Object.keys(valuesObj.tabs).forEach((_t) => {
    _fObj.push({
      label: t(valuesObj.tabs[_t].title),
      score: scormData.tabs[_t]?.score || 0,
    });
    _avg += scormData.tabs[_t]?.score || 0;
  });
  console.log(_avg, Object.keys(valuesObj.tabs).length);

  _avg = _avg / Object.keys(valuesObj.tabs).length;

  const assessmentData = {
    overallScore: _avg,
    sectionScores: _fObj,
    passingScore: {
      overall: valuesObj.generalConfig.passingCriteria,
    },
  };

  console.log(assessmentData, 'assessmentData');

  return (
    <div className={styles.certificationCard}>
      <div style={{ width: '100%', display: 'flex', height: '425px' }}>
        <div className={styles.leftSection}>
          <div className={styles.boxContainer}>
            <ResultProgressCircle score={average || 0} />
          </div>
          <div className={styles.boxContainer1}>
            <ProgressBar {...scores} />
          </div>
          {/* <p className={styles.contactText}>
          {t(contactText)} <span className={styles.emailText}>{emailAddress}</span>
        </p> */}
        </div>
        {centralArea}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStart={handleModalStart}
      />

      <div style={{ width: '100%', height: '100%' }}>
        <p className={styles.contactText}>
          {t('contactText')}{' '}
          <span className={styles.emailText}>{emailAddress}</span>
        </p>
      </div>
      <div
        className='PDFDIV'
        style={{ position: 'absolute', top: -10000, left: -10000 }}
      >
        <div ref={targetRef}>
          <AssessmentReport
            data={assessmentData}
            images={images}
            isPassed={isPassed}
          />
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;
