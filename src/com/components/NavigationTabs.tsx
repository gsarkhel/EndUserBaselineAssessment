import React from 'react';
import styles from '../styles/NavigationTabs.scss';
import { extendedTabs, tabsInterface } from '../interface/helperInterface';
import { t } from '../helpers/LanguageTranslator';
import globalStore from '../thunk';

interface navigationTabsPropsInterface {
  activeTab: number;
  onTabChange: (tabId: string) => void;
  tabs?: extendedTabs[];
  resultPage?: boolean;
}

const NavigationTabs = (props: navigationTabsPropsInterface) => {
  const { activeTab, onTabChange, tabs = [], resultPage } = props;

  const { images, valuesObj } = globalStore.useStoreState((store) => store.player);
  const { scormData } = globalStore.useStoreState((store) => store.scromInfo);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div className={styles.navigationTabs}>
      {tabs.map((tab, _ind) => {
        const isShow = activeTab > _ind || scormData.totalAttempts > 0 || (resultPage && activeTab == _ind);
        const isCorrect = scormData.tabs[tab?.id]?.result == 'passed';
        return (
          <div
            key={_ind}
            className={`${styles.tab} ${tabs[activeTab].id === tab.id ? styles.active : ''}`}
            // onClick={() => handleTabClick(tab.id)}
          >
            {t(tab.title)}

            {isShow && valuesObj?.generalConfig?.showIcons && (
              <img
                src={isCorrect ? images.correct.url : images.incorrect.url}
                alt={isCorrect ? 'Correct' : 'Incorrect'}
                className={styles.statusIcon}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NavigationTabs;

