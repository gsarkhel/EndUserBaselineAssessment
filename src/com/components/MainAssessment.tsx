import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/ValueProposition.scss';
import parentStyles from '../styles/commonStyles.scss';
import { t } from '../helpers/LanguageTranslator';
import ButtonComponent from './ButtonComponent';
import globalStore from '../thunk';

interface AssessmentPropsInterface {
  clickHandler?: Function;
  qText?: string;
  options?: string[];
  optionType?: 'text' | 'image';
  type?: 'radio' | 'checkbox';
  selectedAns?: number[];
}

const MainAssessment = (props: AssessmentPropsInterface) => {
  const { clickHandler, qText = '', options = [], optionType = 'text', type, selectedAns } = props;
  const [selectedOption, setSelectedOption] = useState<number[]>([]);

  const { images } = globalStore.useStoreState((st) => st.player);
  const { recheckMode } = globalStore.useStoreState((st) => st.activity);

  const divRef = useRef<HTMLDivElement>();

  const handleOptionSelect = (index: number): void => {
    if (type == 'checkbox') {
      if (selectedOption.includes(index)) {
        setSelectedOption([...selectedOption.filter((_el) => _el !== index)]);
      } else {
        setSelectedOption([...selectedOption, index]);
      }
    } else {
      setSelectedOption([index]);
    }
  };

  useEffect(() => {
    setSelectedOption([]);
    divRef.current?.classList.add(styles.fadeInAnim);
    setTimeout(() => {
      divRef.current?.classList.remove(styles.fadeInAnim);
    }, 600);
    if (selectedAns) {
      setSelectedOption(selectedAns);
    }
    return () => {
      divRef.current?.classList.remove(styles.fadeInAnim);
    };
  }, [qText, JSON.stringify(options)]);

  return (
    <div>
      <div className={styles.contentArea}>
        <div ref={divRef} className={styles.contentContainer}>
          <div className={styles.mainContainer}>
            <h2 className={styles.title}>{t(qText)}</h2>

            <div className={styles.optionsContainer}>
              {options?.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.optionCard} ${selectedOption.includes(index) && styles.selected} ${
                    optionType == 'image' && styles.halfFlex
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  {/* <div className={styles.radioContainer}>
                  <input                    
                    type={type}
                    name="assessmentOption"
                    onChange={() => handleOptionSelect(index)}
                    value={String(selectedOption.includes(index))}
                    checked={selectedOption.includes(index)}
                    className={styles.customRadio}
                  />
                </div> */}
                  <div className={styles.radioContainer}>
                    <input
                      disabled={recheckMode}
                      type={type === 'checkbox' ? 'checkbox' : 'radio'}
                      name="assessmentOption"
                      onChange={() => !recheckMode && handleOptionSelect(index)}
                      value={String(selectedOption.includes(index))}
                      checked={selectedOption.includes(index)}
                      className={`${recheckMode ? styles.disabled : ''} ${
                        type === 'checkbox' ? styles.customCheckbox : styles.customRadio
                      }`}
                    />
                  </div>

                  <label htmlFor="assessmentOption" className={styles.optionText}>
                    {optionType == 'text' && t(option)}
                    {optionType == 'image' && (
                      <div className={styles.imageContainer}>
                        <img src={images[option]?.url} alt={`Option ${index + 1}`} className={styles.optionImage} />
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={`${parentStyles.fullWidth} ${parentStyles.displayCenter} ${styles.button1}`}>
            <ButtonComponent
              text={t('submit1')}
              disabled={selectedOption.length == 0}
              clickHandler={() => clickHandler(selectedOption)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainAssessment;

