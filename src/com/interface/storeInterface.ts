import { Action, Thunk } from 'easy-peasy';
import { anyObject, audioObject, jsxProperties, stringObject } from './playerInterface';
import { generalConfigInterface, tabsInterface } from './helperInterface';

export interface PlayerStoreModel {
  loading: number;
  valuesObj: {
    tabs: { [key: string]: tabsInterface };
    generalConfig: generalConfigInterface;
  };
  language: string;
  images: {
    [key: string]: {
      url: string;
      width: number;
      height: number;
    };
  };
  audios: audioObject;
  videos: stringObject;

  setLoading: Action<PlayerStoreModel, boolean>;
  setLanguage: Action<PlayerStoreModel, string>;
  setNewValues: Action<PlayerStoreModel, { [key: string]: tabsInterface }>;
  setVideos: Action<PlayerStoreModel, stringObject>;
  setImages: Action<
    PlayerStoreModel,
    {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    }
  >;
  setAudios: Action<PlayerStoreModel, audioObject>;

  fetchConfig: Thunk<PlayerStoreModel, undefined, undefined, storeModel>;
  fetchLanguageFile: Thunk<PlayerStoreModel, undefined, undefined, storeModel>;
  fetchImages: Thunk<PlayerStoreModel, stringObject>;
  fetchAudios: Thunk<PlayerStoreModel, stringObject>;
}

export interface ScalingStoreModel {
  width: number;
  height: number;
  scale: number;
  xPadding: number;
  yPadding: number;
  noScale: boolean;

  setScale: Action<ScalingStoreModel, { width: number; height: number }>;
  setNoScale: Action<ScalingStoreModel, boolean>;
  updateScaleForDevelopment: Thunk<ScalingStoreModel>;
}

export interface ActivityDataStoreModel {
  altString: string;
  showAttempt: boolean;
  attemptCount: number;
  attemptTotal: number;
  showScore: boolean;
  score: number;
  showProgress: boolean;
  progress: number;
  startTime: Date;
  recheckMode: boolean;

  setStartTime: Action<ActivityDataStoreModel, Date>;
  setShowScore: Action<ActivityDataStoreModel, boolean>;
  setAltString: Action<ActivityDataStoreModel, string>;
  setShowAttempt: Action<ActivityDataStoreModel, boolean>;
  setShowProgress: Action<ActivityDataStoreModel, boolean>;
  setRecheckMode: Action<ActivityDataStoreModel, boolean>;
  setProgress: Action<ActivityDataStoreModel, number>;
  setScore: Action<ActivityDataStoreModel, number>;
  setAttemptInfo: Action<ActivityDataStoreModel, { count?: number; total?: number }>;
}

export interface interactionData {
  id: string;
  response: string[];
  feedback: string;
  answer: string[];
  question: string;
  weightage?: number;
}

export interface ScromInfoModel {
  startScreen: string;
  resumed: boolean;
  initialized: boolean;
  isSessionActive: boolean;
  scormData: {
    tabs: {
      [key: string]: {
        questions: number[];
        answers?: number[][];
        score: number;
        correctCount: number;
        result?: string;
      };
    };
    totalScore: number;
    lastAttempt: string;
    totalAttempts: number;
  };
  location: string;

  setInitalize: Action<ScromInfoModel, boolean>;
  setResumed: Action<ScromInfoModel, boolean>;
  setStartScreen: Action<ScromInfoModel, string>;
  setData: Action<ScromInfoModel, ScromInfoModel['scormData']>;
  setLocation: Action<ScromInfoModel, string>;
  setScore: Action<ScromInfoModel, number>;
  setActiveSession: Action<ScromInfoModel, boolean>;

  setComplition: Thunk<ScromInfoModel, { score: number; isPassed: boolean }, undefined, storeModel>;
  getComplition: Thunk<ScromInfoModel>;
  setInterations: Thunk<ScromInfoModel, { index: number; data: interactionData }, undefined, storeModel>;

  initializeAndSetData: Thunk<ScromInfoModel, undefined, undefined, storeModel>;
  terminateScorm: Thunk<ScromInfoModel, undefined, undefined, storeModel>;
  resetDataFromScorm: Thunk<ScromInfoModel>;
  saveData: Thunk<ScromInfoModel, any, undefined, storeModel>;
  getData: Thunk<ScromInfoModel>;
}

export interface storeModel {
  player: PlayerStoreModel;
  scaling: ScalingStoreModel;
  activity: ActivityDataStoreModel;
  scromInfo: ScromInfoModel;
}

