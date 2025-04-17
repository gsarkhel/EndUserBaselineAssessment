import React from 'react';

import MainPlayerComponent from './MainPlayerComponent';
import globalStore from './thunk';
import { playerInterface } from './interface/playerInterface';

/**
 * Functional Component to wrap player inside GlobalStoreProvider and LanguageTranslator
 */
const Player = (props: playerInterface) => {
  const GlobalStoreProvider = globalStore.Provider;
  /**
   * render CreateJS MainPlayerComponent element
   */
  return (
    <>
      <GlobalStoreProvider>
        <MainPlayerComponent {...props} />
      </GlobalStoreProvider>
    </>
  );
};

export default Player;

