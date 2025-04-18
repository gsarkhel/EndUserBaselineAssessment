import React, { useState, useEffect } from 'react';
import styles from '../styles/ResultsCard.scss';
import parentStyles from '../styles/commonStyles.scss';
import ButtonComponent from './ButtonComponent';
import { t } from '../helpers/LanguageTranslator';
import '../../../public/common/assets/fonts/fonts.css';
// import CircularProgressBar from './Re';
import CircularProgressBar from './ResultAnimatedCircle';
import globalStore from '../thunk';

interface ResultsCardProps {
  title?: string;
  questionsAttempted?: number;
  correctResponses?: number;
  percentage?: number;
  clickHandler?: () => void;
}

const ResultsCardRetake = (props: ResultsCardProps) => {
  const { questionsAttempted = 15, correctResponses = 2, title = '', clickHandler } = props;

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const { valuesObj } = globalStore.useStoreState((store) => store.player);
  const { scormData } = globalStore.useStoreState((store) => store.scromInfo);

  const percentage = props.percentage || Number(((correctResponses / questionsAttempted) * 100).toFixed(0));
  const isPassed = percentage > 65;
  const statusMessage = isPassed
    ? t('youPassed')
    : t('youFailed1').replace('{passing}', `${valuesObj.generalConfig.passingCriteria}`);
  const statusColor = isPassed ? '#4ade80' : '#f97316';

  useEffect(() => {
    let animationFrameId: number;
    const animateProgress = () => {
      if (animatedPercentage < percentage) {
        setAnimatedPercentage((prev) => {
          const next = Math.min(prev + 1, percentage);
          animationFrameId = requestAnimationFrame(animateProgress);
          return next;
        });
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [percentage]);

  const progressStyle: React.CSSProperties = {
    background: `conic-gradient(
      ${statusColor} ${animatedPercentage * 3.6}deg, 
      #000 ${animatedPercentage * 3.6}deg
    )`,
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  };

  return (
    <div className={styles.contentArea}>
      <div className={styles.contentContainer}>
        <h1 id="fontLoader4" className={`${styles.title}`}>
          {t(title)}: Section Summary
        </h1>

        <div className={styles.card}>
          {/* Left Section - Statistics */}
          <div className={styles.statsSection}>
            <div className={styles.statRow}>
              <h2 id="fontLoader4" className={styles.statLabel}>
                {t('questionsAttempted')}
              </h2>
              <span id="fontLoader4" className={styles.statValue}>
                {questionsAttempted}
              </span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.statRow}>
              <h2 id="fontLoader4" className={styles.statLabel}>
                {t('correctResponses')}
              </h2>
              <span id="fontLoader4" className={styles.statValue}>
                {correctResponses}
              </span>
            </div>
            <div className={styles.divider}></div>
          </div>

          {/* Right Section - Progress Circle */}
          <div className={styles.progressSection}>
            <h3 id="fontLoader4" style={{ marginTop: '0', marginBottom: '13px', fontWeight: '500' }}>
              Your score
            </h3>

            {/* <div className={styles.progressContainer}>
              <div className={styles.backgroundCircle}></div>
              <div 
                className={styles.progressCircle} 
                style={progressStyle}
              ></div>
              <div id="fontLoader2" className={styles.innerCircle}>
                <span id="fontLoader4" className={styles.percentageText}>
                  {Math.round(animatedPercentage)}%
                </span>
              </div>
            </div> */}
            <CircularProgressBar value={percentage} />
            {/* <Cir></Cir> */}

            <p id="fontLoader5" className={styles.statusText} style={{ color: '#fff' }}>
              {statusMessage}
            </p>
          </div>
        </div>

        {/* Button Component */}
        <div className={`${styles.fullWidth} ${styles.displayCenter} ${styles.buttonContainerRetake}`}>
          <ButtonComponent text={t('retake')} clickHandler={clickHandler} />
        </div>
      </div>
    </div>
  );
};

export default ResultsCardRetake;

