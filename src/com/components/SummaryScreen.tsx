import React, { useEffect, useState } from 'react';
import styles from '../styles/Segmentsummary.scss';
import parentStyles from '../styles/commonStyles.scss';
import parse from 'html-react-parser';
import { t } from '../helpers/LanguageTranslator';
import globalStore from '../thunk';
import ButtonComponent from './ButtonComponent';
import '../../../public/common/assets/fonts/fonts.css';

interface summaryScreenPropsInterface {
  title: string;
  description: string;
  src: string;
  clickHandler?: Function;
}

const SummaryScreen = (props: summaryScreenPropsInterface) => {
  const { title = '', description = '', src = '', clickHandler } = props;
  const { images } = globalStore.useStoreState((store) => store.player);

  return (
    <div>
      <div className={styles.contentArea}>
        <div className={styles.contentContainer}>
          <h1 className={styles.segmentTitle}>
            {t(title)}
          </h1>
          <div className={styles.segmentDescription}>
            {parse(t(description) || '')}
          </div>
          <div className={`${parentStyles.fullWidth} ${parentStyles.displayCenter} ${styles.button1} `}>
            <ButtonComponent text={t('submit')} clickHandler={clickHandler} />
          </div>
        </div>

        <div className={styles.imageContainer}>
          <img src={images[src]?.url} alt={''} />
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;

