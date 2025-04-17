import { action, Action, Thunk, thunk } from 'easy-peasy';
import { Howl, Howler } from 'howler';
import { audioObject, jsxProperties, configModel, stringObject } from '../interface/playerInterface';
import { PlayerStoreModel } from '../interface/storeInterface';
import { getBase64FromUrl } from '../helpers/httpUtils';

const PlayerStore: PlayerStoreModel = {
  /**
   * Destructuring PlayerStoreModel properties
   */
  loading: 1,
  valuesObj: {
    tabs: {},
    generalConfig: undefined,
  },
  language: 'en',
  images: {},
  audios: {},
  videos: {},

  /**
   *  set action of PlayerStoreModel properties
   */
  setLoading: action((state, _bool) => {
    state.loading += _bool ? 1 : -1;
  }),

  setLanguage: action((state, _lang) => {
    state.language = _lang;
  }),

  setNewValues: action((state, _obj) => {
    state.valuesObj = { ...state.valuesObj, ..._obj };
  }),

  setImages: action((state, _obj) => {
    state.images = { ...state.images, ..._obj };
  }),
  setAudios: action((state, _obj) => {
    state.audios = { ...state.audios, ..._obj };
  }),
  setVideos: action((state, _obj) => {
    state.videos = { ...state.videos, ..._obj };
  }),

  /**
   * create thunk of config and fetch json data of config
   */
  fetchConfig: thunk((action, payload, { getStoreState }) => {
    // const { fetchInitialSetting } = getStoreActions().activity;
    action.setLoading(true);
    return new Promise((resolve, reject) => {
      fetch(`./config.json`, {
        headers: { 'Content-type': 'application/json' },
      })
        .then((_data) => _data.json())
        .then(async (_response: configModel) => {
          // fetchInitialSetting();
          await action.fetchImages(_response.images);
          await action.fetchAudios(_response.audios);
          await action.setVideos(_response.videos);
          const _lang = await action.fetchLanguageFile();
          action.setNewValues(_response.gameConfig);
          resolve({ lab: _response, lang: _lang });
          action.setLoading(false);
        })
        .catch((err) => {
          console.error('Error Occurred at 58', err);
          reject(err);
        });
    });
  }),
  /**
   * create thunk of LanguageFile and fetch json data of translation
   */
  fetchLanguageFile: thunk((action, payload, { getStoreState }) => {
    const { language } = getStoreState().player;
    return new Promise((resolve, reject) => {
      fetch(`./locale/${language}.json`, {
        headers: { 'Content-type': 'text/plain; charset=UTF-8' },
      })
        .then((_data) => _data.arrayBuffer())
        .then((_response) => {
          const decoder = new TextDecoder('UTF-8');
          const text = decoder.decode(_response);
          resolve(JSON.parse(text));
        })
        .catch((err) => {
          console.error('Error Occurred at 73', err);
          reject(err);
        });
    });
  }),
  /**
   * create thunk of Images and passed base64Url to the image
   */
  fetchImages: thunk((action, payload) => {
    return new Promise(async (resolve, reject) => {
      const _imageObj: {
        [key: string]: {
          url: string;
          width: number;
          height: number;
        };
      } = {};
      const _promiseObj: Promise<null>[] = [];
      if (payload) {
        Object.keys(payload).forEach((_key) => {
          _promiseObj.push(
            new Promise(async (resolve, reject) => {
              getBase64FromUrl(payload[_key])
                .then((_a: { url: string; width: number; height: number }) => {
                  _imageObj[_key] = {
                    url: _a.url,
                    width: _a.width,
                    height: _a.height,
                  };

                  resolve(null);
                })
                .catch((er) => {
                  console.error('No file found for ', _key, payload[_key]);
                  reject(er);
                });
            })
          );
        });
        await Promise.all(_promiseObj);
        action.setImages(_imageObj);
      }
      resolve(null);
    });
  }),
  /**
   * create thunk of Audios and passed base64Url to the audio
   */
  fetchAudios: thunk((action, payload) => {
    return new Promise(async (resolve, reject) => {
      const _auioObj: audioObject = {};
      const _promiseObj: Promise<null>[] = [];
      if (payload) {
        Object.keys(payload).forEach((_key) => {
          _promiseObj.push(
            new Promise(async (resolve, reject) => {
              _auioObj[_key] = new Howl({
                src: [payload[_key]],
              });
              _auioObj[_key].on('load', () => {
                resolve(null);
              });
              _auioObj[_key].load();
              _auioObj[_key].pause();
              // _auioObj[_key].addEventListener('canplaythrough', () => {
              // });
              // _auioObj[_key].load();
            })
          );
        });
        await Promise.all(_promiseObj);
        action.setAudios(_auioObj);
      }
      resolve(null);
    });
  }),
};

export default PlayerStore;

