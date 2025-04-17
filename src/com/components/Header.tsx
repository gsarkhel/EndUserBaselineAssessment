import React from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/headerComp.scss';
import globalStore from '../thunk';
import '../../../public/common/assets/fonts/fonts.css';

// const Header = () => {
//   return (
//     <div className={styles.headerContainer}>
//       <h1 className={styles.header}>{t('headerText')}</h1>
//     </div>
//   );
// };

// export default Header;

interface AssessmentHeaderProps {
  // title: string;
  showAttempt?: boolean;
  attemptCount?: number;
  attemptTotal?: number;
  showScore?: boolean;
  score?: number;
  showProgress?: boolean;
  progress?: number;
}

const Header: React.FC<AssessmentHeaderProps> = () => {
  const {
    // title,
    showAttempt,
    showScore,
    score,
    showProgress,
    progress,
  } = globalStore.useStoreState((store) => store.activity);

  const { valuesObj } = globalStore.useStoreState((store) => store.player);
  const { scormData } = globalStore.useStoreState((store) => store.scromInfo);
  const _general = valuesObj.generalConfig;

  const attemptCount = scormData.totalAttempts;
  const attemptTotal = _general.totalAttempts;

  return (
    <div className={styles.assessmentHeader}>
      <h1 className={styles.assessmentTitle}>{t('headerText')}</h1>
      <div className={styles.assessmentMetrics}>
        {showAttempt && attemptCount > 0 && (
          <div className={styles.metricItem}>
            <span className={styles.metricText}>
              Attempt {attemptCount}/{attemptTotal}
            </span>
          </div>
        )}

        {showScore && (
          <div className={styles.metricItem}>
            <span className={styles.metricText}>Total Score: {score}%</span>
          </div>
        )}

        {showProgress && (
          <div className={styles.metricItem1}>
            <div className={styles.progressContainer}>
              <span className={styles.progressText}>Assessment Progress: {progress.toFixed(0)}%</span>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

// how to use
{
  /* <Header 
  showAttempt={true}
  attemptCount={2}
  attemptTotal={5}
  showScore={true}
  score={80}
  showProgress={true}
  progress={50}
/> */
}

