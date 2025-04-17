// ProgressBar.tsx
import React from 'react';
import styles from '../styles/ProgressBarsFinal.scss';
import '../../../public/common/assets/fonts/fonts.css';
import globalStore from '../thunk';
import { t } from '../helpers/LanguageTranslator';

interface ProgressBarProps {
  tab1?: number;
  tab2?: number;
  tab3?: number;
  tab4?: number;
  tab5?: number;
}

const ProgressBar = (props: ProgressBarProps) => {
  const { valuesObj } = globalStore.useStoreState((store) => store.player);
  const getColorClass = (score: number) => {
    return score < valuesObj.generalConfig.passingCriteria ? styles.progressBarOrange : styles.progressBarGreen;
  };

  return (
    <div className={styles.progressContainer}>
      {Object.keys(valuesObj.tabs).map((_t, _ind) => {
        let _val = props[('tab' + (_ind + 1)) as keyof ProgressBarProps] || 0;
        return (
          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>{t(valuesObj.tabs[_t].title)}</div>
            <div className={styles.progressBarContainer}>
              <div className={getColorClass(_val)} style={{ width: `${_val}%` }}></div>
            </div>
            <div className={styles.progressPercentage}>{_val.toFixed(0)}%</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;

