import React, { useEffect, useState } from 'react';
import globalStore from '../thunk';
import { languageTranslator } from '../interface/helperInterface';

let file: any, language: string;

/**
 * Language Translator Component that update file as per selected language
 * @param {JSX.Element} children
 */
const LanguageTranslator = (props: languageTranslator) => {
  /**
   *  Destructuring the state from playerStore
   */
  const { language: lang } = globalStore.useStoreState((store) => store.player);
  const { languageFile } = props;

  const [currentLang, setCurrentLang] = useState<string>('');

  /**
   *  update file as per selected language
   */
  // useEffect(() => {
  file = languageFile;
  language = lang;
  // }, [])

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  return <>{props.children}</>;
};

/**
 *  Fetching text from text json by provided ID string as per selected language
 * @param {string} _string
 */
const t = (_string: string): string => {
  return file?.[_string] ?? undefined;
};

export { LanguageTranslator, t };

