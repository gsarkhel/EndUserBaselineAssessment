import React from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/PrivacynoticePage.scss';
import parentStyles from '../styles/commonStyles.scss';
import parse from 'html-react-parser';
import ButtonComponent from './ButtonComponent';
import "../../../public/common/assets/fonts/fonts.css"
import ErrorBoundary from './ErrorBoundary';

interface privacynoticeInterface {
  title?: string;
  description?: string;
  clickHandler?: Function;
}

const PrivacynoticePage = (props: privacynoticeInterface) => {
  const { title = '', description = '', clickHandler } = props;

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.title}>{t(title)}</h2>
      <ErrorBoundary 
        errorMessage="Privacy notice could not be loaded. Please try refreshing the page or contact support."
        onError={(error, errorInfo) => {
          console.error('Privacy notice parsing error:', error, errorInfo);
        }}
        fallback={
          <div className={styles.disContainer}>
            <p>Privacy notice is temporarily unavailable. Please try refreshing the page or contact support.</p>
          </div>
        }
      >
        <div className={styles.disContainer}>{parse(t(description) || '')}</div>
      </ErrorBoundary>
      <div className={`${parentStyles.fullWidth} ${parentStyles.displayCenter}`}>
        <ButtonComponent text={t('agreeAndContinue')} clickHandler={clickHandler} />
      </div>
    </div>
  );
};

export default PrivacynoticePage;

