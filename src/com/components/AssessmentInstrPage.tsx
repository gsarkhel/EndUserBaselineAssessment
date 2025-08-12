import React, { useEffect, useRef, useState } from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/AssessmentInstrPage.scss';
import parentStyles from '../styles/commonStyles.scss';
import parse from 'html-react-parser';
import ButtonComponent from './ButtonComponent';
import "../../../public/common/assets/fonts/fonts.css";
import VideoPlayer from './VideoPlayer';
import ErrorBoundary from './ErrorBoundary';

interface AssessmentInterface {
  title?: string;
  description?: string;
  clickHandler?: Function;
}

const AssessmentInstrPage = (props: AssessmentInterface) => {
  const { title = '', description = '', clickHandler } = props;
  const [isPopUpShown, showPopUp] = useState(false);
  const popUpRef = useRef(null)
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10; // Try for about 2 seconds (10 * 200ms)
    const interval = 200; // Check every 200ms
    
    const checkForThumbElement = () => {
      const thumbElement = document.querySelector(".thumb");
      if (thumbElement) {
        thumbElement.addEventListener("click", (e) => {
          showPopUp(true);
        });
        return true; // Element found, stop polling
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        console.warn("Element with class 'thumb' not found after multiple attempts");
        return true; // Stop polling after max attempts
      }
      
      return false; // Element not found, continue polling
    };
    
    // Initial check
    if (!checkForThumbElement()) {
      // If not found immediately, start polling
      const pollInterval = setInterval(() => {
        if (checkForThumbElement()) {
          clearInterval(pollInterval);
        }
      }, interval);
      
      // Cleanup function to clear interval if component unmounts
      return () => clearInterval(pollInterval);
    }
  }, []);

  useEffect(() => {
    if (isPopUpShown) {
      // popUpRef.current.addEventListener("click", (e: Event) => {
      //   showPopUp(false);
      // })
    }
  }, [isPopUpShown])

  const closeHandler = (e: Event) => {
    showPopUp(false);
  }

  return (
    <div className={styles.main}>
      <div className={styles.mainContainer}>
        <h2 className={styles.title}>{t(title)}</h2>
        <ErrorBoundary 
          errorMessage="Instructions are currently unavailable. Please contact support if this issue persists."
          onError={(error, errorInfo) => {
            console.error('Instruction parsing error:', error, errorInfo);
          }}
          fallback={
            <div className={styles.disContainer}>
              <p>Instructions are temporarily unavailable. Please try refreshing the page or contact support.</p>
            </div>
          }
        >
          <div className={styles.disContainer}>{parse(t(description) || '')}</div>
        </ErrorBoundary>
        <div className={`${parentStyles.fullWidth} ${parentStyles.displayCenter}`}>
          <ButtonComponent text={t('begin')} clickHandler={clickHandler} />
        </div>
      </div>
      {
        isPopUpShown ? <div className={styles.popUpHolder} ref={popUpRef}><VideoPlayer src='./assets/videos/' closeHandler={closeHandler}></VideoPlayer></div> : <></>
      }

    </div>
  );
};

export default AssessmentInstrPage;