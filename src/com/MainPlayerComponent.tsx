import React, { useEffect, useRef, useState } from 'react';
import globalStore from './thunk';
import { configModel, playerInterface } from './interface/playerInterface';
import { LanguageTranslator } from './helpers/LanguageTranslator';
import { setupChildren } from './helpers/helperFunction';
import Background from './components/Background';
import Header from './components/Header';
import style from './styles/mainPlayer.scss';
import Footer from './components/Footer';

/**
 * Main Player Component that every App renders
 */
const MainPlayerComponent = (props: playerInterface) => {
  /**
   *  Destructuring the shell size, scale and padding from ScalingStore
   */
  const { scale, width, height, xPadding, yPadding } = globalStore.useStoreState((store) => store.scaling);

  /**
   *  Destructuring store action from ScalingStore
   */
  const { setScale, updateScaleForDevelopment } = globalStore.useStoreActions((store) => store.scaling);

  /**
   *  Destructuring store action from PlayerStore
   */
  const { fetchConfig, setLanguage, setLoading } = globalStore.useStoreActions((store) => store.player);

  /**
   *  Destructuring store action from PlayerStore
   */
  const { altString } = globalStore.useStoreState((store) => store.activity);

  /**
   *  Destructuring store action from ScormStore
   */
  const { initializeAndSetData, terminateScorm, setScore } = globalStore.useStoreActions((store) => store.scromInfo);
  const { scormData } = globalStore.useStoreState((store) => store.scromInfo);

  /**
   *  Destructuring store state from the PlayerStore
   */
  const { loading, language } = globalStore.useStoreState((store) => store.player);

  /**
   *  UseState for languageFile state
   */
  const [languageFile, setLanguageFile] = useState();

  /**
   *  UseState for html element
   */
  const loaderDiv = useRef<HTMLElement>(null);

  useEffect(() => {
    initializeAndSetData().then(() => {
      fetchConfig().then((json: { lab: configModel; lang: any }) => {
        const { lang } = json;

        setLanguageFile(lang);
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    const _url = new URLSearchParams(window.location.search);
    const _language = _url.get('lang');
    if (_language) setLanguage(_language);
    const _noScale = _url.get('noScale');
    if (_noScale) updateScaleForDevelopment();
  }, []);

  useEffect(() => {
    const unload = () => {
      setScore(undefined);
      terminateScorm();
    };
    window.addEventListener('unload', unload);
    window.addEventListener('beforeunload', unload);
    return () => {
      window.removeEventListener('unload', unload);
      window.removeEventListener('beforeunload', unload);
    };
  }, []);

  /**
   *  Setting up the initial Scale and adding resizing listners
   */
  useEffect(() => {
    const windowResize = () => {
      setScale({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', windowResize);
    windowResize();

    return () => {
      window.removeEventListener('resize', windowResize);
    };
  }, []);

  /**
   *  Setting up the Loader
   */
  useEffect(() => {
    const _loader = document.getElementById('loader');
    _loader && (loaderDiv.current = _loader);
  }, []);

  /**
   *  Removing the Loader when the state changes to 1
   *  @param {number} loading
   */
  useEffect(() => {
    if (loaderDiv.current) {
      if (loading > 0) {
        loaderDiv.current.hidden = false;
      } else {
        loaderDiv.current.hidden = true;
      }
    }
  }, [loading]);

  useEffect(() => {
    document.documentElement.removeAttribute('dir');
    if (['ar'].includes(language)) {
      document.documentElement.setAttribute('dir', 'rtl');
    }
  }, [language]);

  /**
   *  it is used to show and hide loading div
   */
  if (loading) {
    return <div id="loading" data-testid="loading"></div>;
  }
  /**
   *  render Language Translator element
   */
  return (
    <LanguageTranslator languageFile={languageFile}>
      <div
        id="mainDiv"
        data-testid="main-div"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
          position: 'absolute',
          top: yPadding,
          left: xPadding,
          display: 'block',
          // width: 0,
          // height: 0,
          width: width,
          height: height,
          overflow: 'hidden',
        }}
      >
        <div aria-live="polite" tabIndex={-1} className={style.infoDiv}>
          {altString}
        </div>
        <Background />
        <div style={{ position: 'absolute', top: 0, left: 0, width: width, height: height }}>
          <Header />
          {setupChildren(props.children, {})}
          <Footer />
        </div>
      </div>
    </LanguageTranslator>
  );
};

export default MainPlayerComponent;

