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
  weightagePresent?: boolean;
  clickHandler?: () => void;
}

const ResultsCard = (props: ResultsCardProps) => {
  const {
    questionsAttempted = 15,
    correctResponses = 2,
    title = '',
    clickHandler,
    weightagePresent = false,
  } = props;

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const { valuesObj } = globalStore.useStoreState((store) => store.player);

  const percentage = Math.round(
    props.percentage ||
      Number(((correctResponses / questionsAttempted) * 100).toFixed(0))
  );
  
  const isPassed = percentage >= valuesObj.generalConfig.passingCriteria;
  const statusMessage = isPassed
    ? t('youPassed')
    : t('youFailed1').replace(
        '{passing}',
        `${valuesObj.generalConfig.passingCriteria}`
      );
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
        <h1 className={`${styles.title}`}>
          {t(title)}: {t('sectionSummary')}
        </h1>

        <div className={styles.card}>
          {/* Left Section - Statistics */}
          <div className={styles.statsSection}>
            <div className={styles.statRow}>
              <h2 className={styles.statLabel}>{t('questionsAttempted')}</h2>
              <span className={styles.statValue}>{questionsAttempted}</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.statRow}>
              <h2 className={styles.statLabel}>
                {weightagePresent ? t('pointsValue') : t('correctResponses')}
              </h2>
              <span className={styles.statValue}>{correctResponses}</span>
            </div>
            <div className={styles.divider}></div>
            {weightagePresent && (
              <div className={styles.noteRow}>
                <span className={styles.noteValue}>{t('pointsNote')}</span>
              </div>
            )}
          </div>

          {/* Right Section - Progress Circle */}
          <div className={styles.progressSection}>
            <h3 style={{ marginTop: '0', marginBottom: '13px' }}>
              {t('yourScore')}
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

            <p className={styles.statusText} style={{ color: '#fff' }}>
              {statusMessage}
            </p>
          </div>
        </div>

        {/* Button Component */}
        <div
          className={`${styles.fullWidth} ${styles.displayCenter} ${styles.buttonContainer}`}
        >
          <ButtonComponent text={t('continue')} clickHandler={clickHandler} />
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
