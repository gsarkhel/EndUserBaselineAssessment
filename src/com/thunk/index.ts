import { createContextStore, persist } from 'easy-peasy';
import Scaling from './ScalingStore';
import PlayerStore from './PlayerStore';
import ActivityDataStore from './ActivityDataStore';
import { storeModel } from '../interface/storeInterface';
import ScromInfo from './ScormStore';

/**
 * create store model which contains PlayerStoreModel and ScalingStoreModel proerties
 */
const statesObj: storeModel = {
  player: PlayerStore,
  scaling: Scaling,
  activity: ActivityDataStore,
  scromInfo: ScromInfo,
};
/**
 *  this is used to create context of stateObj
 */
const globalStore = createContextStore(statesObj);

export default globalStore;

