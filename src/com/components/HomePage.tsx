import React from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/homePage.scss';
import parentStyles from '../styles/commonStyles.scss';
import parse from 'html-react-parser';
import ButtonComponent from './ButtonComponent';
import "../../../public/common/assets/fonts/fonts.css"

interface homepagePropsInterface {
  title?: string;
  heading?: string;
  description?: string;
  clickHandler?: Function;
}

const HomePage = (props: homepagePropsInterface) => {
  const { title = '', heading = '', description = '', clickHandler } = props;
  
  return (
    <div className={styles.main}>
      <div className={styles.mainContainer}>
        <h3>{t(heading)}</h3>
        <h1>{t(title)}</h1>
        <div className={styles.descriptionContainer}>
          <p>{parse(t(description) || '')}</p>
        </div>
        <div className={styles.buttonWrapper}>
          <ButtonComponent text={t('continue')} clickHandler={clickHandler} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;