import { action, Action, Thunk, thunk } from 'easy-peasy';
import { ScalingStoreModel } from '../interface/storeInterface';

const ScalingStore: ScalingStoreModel = {
  /**
   * Destructring ScalingStoreModel properties
   */
  noScale: false,
  width: 1024,
  height: 576,
  scale: 1,
  xPadding: 0,
  yPadding: 0,

  /**
   *  set action of ScalingStoreModel properties
   */
  setScale: action((state, { width, height }) => {
    if (state.noScale) {
      state.scale = 1;
      state.xPadding = 0;
      state.yPadding = 0;
      return;
    }
    let _wScale = width / state.width;
    let _hScale = height / state.height;

    let _scale = 1;
    _scale = _wScale > _hScale ? _hScale : _wScale;

    let _xPadding = 1;
    let _yPadding = 1;

    _xPadding = (width - state.width * _scale) / 2;
    _yPadding = (height - state.height * _scale) / 2;

    // _xPadding = _xPadding / _scale;
    // _yPadding = _yPadding / _scale;

    state.xPadding = _xPadding;
    state.yPadding = _yPadding;

    state.scale = _scale;
  }),

  setNoScale: action((state, _bool) => {
    state.noScale = _bool;
  }),
  updateScaleForDevelopment: thunk((actions) => {
    actions.setNoScale(true);
    actions.setScale({ width: 0, height: 0 });
  }),
};

export default ScalingStore;

