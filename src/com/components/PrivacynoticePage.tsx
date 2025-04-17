import React from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/PrivacynoticePage.scss';
import parentStyles from '../styles/commonStyles.scss';
import parse from 'html-react-parser';
import ButtonComponent from './ButtonComponent';
import "../../../public/common/assets/fonts/fonts.css"

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
      <div className={styles.disContainer}>{parse(t(description) || '')}</div>
      <div className={`${parentStyles.fullWidth} ${parentStyles.displayCenter}`}>
        <ButtonComponent text={t('agreeAndContinue')} clickHandler={clickHandler} />
      </div>
    </div>
  );
};

export default PrivacynoticePage;

