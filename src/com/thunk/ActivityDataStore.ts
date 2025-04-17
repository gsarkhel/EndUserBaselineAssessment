import { action } from 'easy-peasy';
import { ActivityDataStoreModel } from '../interface/storeInterface';

const ActivityDataStore: ActivityDataStoreModel = {
  altString: '',
  showAttempt: false,
  attemptCount: 5,
  attemptTotal: 5,
  showScore: false,
  score: 50,
  showProgress: false,
  progress: 0,
  startTime: undefined,
  recheckMode: false,

  setAltString: action((state, payload) => {
    state.altString = payload;
  }),
  setStartTime: action((state, payload) => {
    state.startTime = payload;
  }),
  setRecheckMode: action((state, payload) => {
    state.recheckMode = payload;
  }),
  setShowAttempt: action((state, payload) => {
    state.showAttempt = payload;
  }),
  setShowProgress: action((state, payload) => {
    state.showProgress = payload;
  }),
  setShowScore: action((state, payload) => {
    state.showScore = payload;
  }),
  setScore: action((state, payload) => {
    state.score = payload;
  }),
  setAttemptInfo: action((state, payload) => {
    if (payload.count !== undefined) state.attemptCount = payload.count;
    if (payload.total !== undefined) state.attemptTotal = payload.total;
  }),

  setProgress: action((state, payload) => {
    state.progress = payload;
  }),
};

export default ActivityDataStore;

