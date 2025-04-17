import React, { useState } from 'react';
import styles from '../styles/SoftwareArchitecture.scss';
import NavigationTabs from './NavigationTabs';
import { t } from '../helpers/LanguageTranslator';
import ButtonComponent from './ButtonComponent';
import parentStyles from '../styles/commonStyles.scss';

interface SoftwareArchitectureProps {
  clickHandler?: () => void;
}

const SoftwareArchitecture = ({ clickHandler }: SoftwareArchitectureProps) => {
  const [activeTab, setActiveTab] = useState('Segment');
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const options = [
    { id: 0, text: "Low cost of ownership" },
    { id: 1, text: "Increased autonomy" },
    { id: 2, text: "Evolutivity and scalability." }
  ];

  const handleOptionSelect = (index: number): void => {
    setSelectedOption(index);
  };

  return (      
      <div className={styles.contentArea}>
        <div className={styles.contentContainer}>
          <h2 className={styles.title}>{t('mainBenefitQuestion')}</h2>
          
          <div className={styles.optionsContainer}>
            {options.map((option, index) => (
              <div 
                key={option.id} 
                className={`${styles.optionCard} ${selectedOption === index ? styles.selected : ''}`}
                onClick={() => handleOptionSelect(index)}
              >
                <div className={styles.radioContainer}>
                  <div className={`${styles.radioButton} ${selectedOption === index ? styles.radioSelected : ''}`} />
                </div>
                <p className={styles.optionText}>{option.text}</p>
              </div>
            ))}
          </div>

          <div className={`${parentStyles.fullWidth} ${parentStyles.displayCenter} ${styles.button1}`}>
      <ButtonComponent text={t('submit')} clickHandler={clickHandler} />
    </div>[]
        </div>
      </div>
  );
};

export default SoftwareArchitecture;


// 10  chages  input type
