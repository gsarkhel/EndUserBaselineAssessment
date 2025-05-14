import React, { useEffect, useRef, useState } from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/AssessmentInstrPage.scss';
import parentStyles from '../styles/commonStyles.scss';
import parse from 'html-react-parser';
import ButtonComponent from './ButtonComponent';
import "../../../public/common/assets/fonts/fonts.css";
import VideoPlayer from './VideoPlayer';

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
    // @ts-ignore
    document.querySelector(".thumb").addEventListener("click", (e) => {
      showPopUp(true);
    })
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
        <div className={styles.disContainer}>{parse(t(description) || '')}</div>
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