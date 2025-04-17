/** @format */

import { action, Action, Thunk, thunk } from 'easy-peasy';
import { getData, initalizeScrom, setData, setMultipleData, terminate } from '../helpers/scrom';
import { anyObject } from '../interface/playerInterface';
import { ScromInfoModel, storeModel } from '../interface/storeInterface';
import { t } from '../helpers/LanguageTranslator';

const ScromInfo: ScromInfoModel = {
  startScreen: 'home',
  resumed: false,
  initialized: false,
  isSessionActive: false,
  scormData: {
    tabs: {},
    totalScore: 0,
    lastAttempt: undefined,
    totalAttempts: 0,
  },
  location: 'home',

  setInitalize: action((state, _bool) => {
    state.initialized = _bool;
  }),

  setResumed: action((state, _bool) => {
    state.resumed = _bool;
  }),

  setStartScreen: action((state, _screen) => {
    state.startScreen = _screen;
    state.location = _screen;
  }),

  setData: action((state, payload) => {
    setData('cmi.suspend_data', JSON.stringify(payload));
    state.scormData = payload;
  }),

  setLocation: action((state, payload) => {
    setData('cmi.location', payload);
    state.location = payload;
  }),

  setScore: action((state, payload) => {
    setMultipleData([
      { _params: 'cmi.score.raw', _value: payload },
      { _params: 'cmi.score.scaled', _value: payload / 100 },
      { _params: 'cmi.success_status', _value: 'unknown' },
      { _params: 'cmi.completion_status', _value: 'incomplete' },
      { _params: 'cmi.score.max', _value: 100 },
      { _params: 'cmi.score.min', _value: 0 },
      // { _params: 'cmi.exit', _value: state.location === 'results' && state.isSessionActive ? 'normal' : 'suspend' },
    ]);
  }),
  setActiveSession: action((state, payload) => {
    state.isSessionActive = payload;
  }),

  getComplition: thunk((actions) => {
    let score;
    score = getData('cmi.score.raw');
    return score;
  }),
  setComplition: thunk((actions, score, { getStoreState }) => {
    const { valuesObj } = getStoreState().player;
    setMultipleData([
      { _params: 'cmi.completion_status', _value: 'completed' },
      { _params: 'cmi.score.raw', _value: score },
      { _params: 'cmi.score.scaled', _value: score / 100 },
      { _params: 'cmi.success_status', _value: score > valuesObj.generalConfig.passingCriteria ? 'passed' : 'failed' },
      { _params: 'cmi.score.max', _value: 100 },
      { _params: 'cmi.score.min', _value: 0 },
    ]);
  }),

  setInterations: thunk((action, payload, { getStoreState }) => {
    const { data } = payload;
    const { valuesObj } = getStoreState().player;
    const { startTime } = getStoreState().activity;

    const index = getData('cmi.interactions._count');

    const latencyMs = Date.now() - startTime?.getTime();
    const hours = Math.floor(latencyMs / (1000 * 60 * 60));
    const minutes = Math.floor((latencyMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = ((latencyMs % (1000 * 60)) / 1000).toFixed(2);

    let latencyTime = 'PT';
    if (hours > 0) latencyTime += `${hours}H`;
    if (minutes > 0) latencyTime += `${minutes}M`;
    if (seconds !== '0.00') latencyTime += `${seconds}S`;

    const now = new Date();
    const timeZoneOffset = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timeZoneOffset) / 60);
    const offsetMinutes = Math.abs(timeZoneOffset) % 60;
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}:${String(now.getSeconds()).padStart(2, '0')}.0${timeZoneOffset >= 0 ? '+' : '-'}${String(offsetHours).padStart(
      2,
      '0'
    )}:${String(offsetMinutes).padStart(2, '0')}`;

    setMultipleData([
      { _params: `cmi.interactions.${index}.id`, _value: data?.id },
      { _params: `cmi.interactions.${index}.type`, _value: 'choice' },
      {
        _params: `cmi.interactions.${index}.learner_response`,
        _value: (data?.response || [])
          ?.map((_o) => (_o || '').replaceAll(',', ''))
          .join('[,]')
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll(' ', '_'),
      },
      { _params: `cmi.interactions.${index}.result`, _value: data?.feedback },
      {
        _params: `cmi.interactions.${index}.correct_responses.0.pattern`,
        _value: (data?.answer || [])
          ?.map((_o) => (_o || '').replaceAll(',', ''))
          .join('[,]')
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll(' ', '_'),
      },
      {
        _params: `cmi.interactions.${index}.description`,
        _value: data?.question.replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '_'),
      },
      { _params: `cmi.interactions.${index}.weighting`, _value: data?.weightage || 10 },
      {
        _params: `cmi.interactions.${index}.objectives.0.id`,
        _value: t(valuesObj.generalConfig.activityName).replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '_'),
      },
      { _params: `cmi.interactions.${index}.timestamp`, _value: timestamp },
      { _params: `cmi.interactions.${index}.latency`, _value: latencyTime },
    ]);
    // + [23:31:20.966] SetValue('cmi.interactions.1.id', 'Scene2_QuestionDraw11_Slide6_MultiChoice_0_0') returned 'true' in 0 seconds
    // + [23:31:20.966] SetValue('cmi.interactions.1.type', 'choice') returned 'true' in 0 seconds
    // + [23:31:20.966] SetValue('cmi.interactions.1.learner_response', 'Inncom_by_Honeywell__VDA__Lutron__Interel') returned 'true' in 0.001 seconds
    // + [23:31:20.967] SetValue('cmi.interactions.1.result', 'correct') returned 'true' in 0 seconds
    // + [23:31:20.967] SetValue('cmi.interactions.1.correct_responses.0.pattern', 'Inncom_by_Honeywell__VDA__Lutron__Interel') returned 'true' in 0 seconds
    // + [23:31:20.967] SetValue('cmi.interactions.1.description', 'Who are the main competitors in Guest Room Management?') returned 'true' in 0 seconds
    // + [23:31:20.967] SetValue('cmi.interactions.1.weighting', '10') returned 'true' in 0 seconds
    // + [23:31:20.967] SetValue('cmi.interactions.1.latency', 'PT19.29S') returned 'true' in 0 seconds
    // + [23:31:20.967] SetValue('cmi.interactions.1.objectives.0.id', 'EU_Assessment_-_Hotels') returned 'true' in 0 seconds
    // + [23:31:20.968] SetValue('cmi.interactions.1.timestamp', '2025-03-27T23:31:20.0+05:30') returned 'true' in 0 seconds
  }),

  initializeAndSetData: thunk((actions, payload, { getStoreActions }) => {
    return new Promise(async (resolve, reject) => {
      const _initalize = await initalizeScrom();
      actions.setInitalize(_initalize);
      if (_initalize) {
        const {} = getStoreActions().scromInfo;
        const _screen = getData('cmi.location');

        const _suspendedData = getData('cmi.suspend_data');
        const _resumed = !['home', ''].includes(_screen);

        // checking for _suspendedData is present in object in scrom if present , setting data
        // const activityInfo = getStoreActions().activityInfo;
        if (_suspendedData && typeof JSON.parse(_suspendedData) === 'object')
          actions.setData(JSON.parse(_suspendedData));

        actions.setResumed(_resumed);
        if (_screen !== '') actions.setStartScreen(_screen);

        resolve(null);
      } else {
        resolve(null);
      }
    });
  }),

  resetDataFromScorm: thunk((actions, payload, { getState }) => {
    const acc = getState().scormData;

    setData('cmi.suspend_data', JSON.stringify({}));
  }),

  terminateScorm: thunk((actions, payload, { getStoreState }) => {
    const { startTime } = getStoreState().activity;
    const latencyMs = Date.now() - startTime?.getTime();
    const hours = Math.floor(latencyMs / (1000 * 60 * 60));
    const minutes = Math.floor((latencyMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = ((latencyMs % (1000 * 60)) / 1000).toFixed(2);

    let latencyTime = 'PT';
    if (hours > 0) latencyTime += `${hours}H`;
    if (minutes > 0) latencyTime += `${minutes}M`;
    if (seconds !== '0.00') latencyTime += `${seconds}S`;
    terminate();
  }),

  saveData: thunk((actions, payload, { getStoreState }) => {
    const { scormData } = getStoreState().scromInfo;
    const _suspendedData = { ...scormData, ...payload };
    actions.setData(_suspendedData);
    setData('cmi.suspend_data', JSON.stringify(_suspendedData));
  }),

  getData: thunk((actions) => {
    const _suspendedData = getData('cmi.suspend_data');
    return JSON.parse(_suspendedData);
  }),
};

export default ScromInfo;

