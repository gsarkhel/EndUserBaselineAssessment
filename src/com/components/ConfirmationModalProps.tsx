import React from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/confirmationModalPopup.scss';
import globalStore from '../thunk';
// import styles from '../styles/ConfirmationModalProps.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onStart }) => {
  if (!isOpen) return null;

  const { valuesObj } = globalStore.useStoreState((store) => store.player);
  const { scormData } = globalStore.useStoreState((store) => store.scromInfo);
  const _general = valuesObj.generalConfig;

  return (
    <div className={styles.overlayStyle}>
      <div className={styles.modalStyle}>
        <h2 className={styles.titleStyle}>{t('confirmationTitle')}</h2>

        <div className={styles.dividerStyle}></div>

        <p className={styles.messageStyle}>
          {t('confirmationMessage').replace('{current}', `${_general.totalAttempts - scormData.totalAttempts}`)}
        </p>

        <div className={styles.buttonContainerStyle}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>

          <button onClick={onStart} className={styles.startBtn}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

