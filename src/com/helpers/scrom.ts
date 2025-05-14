import { Scorm, scorm } from '@gamestdio/scorm';
declare global {
  interface Window {
    mainScrom: any;
  }
}

export const initalizeScrom = () => {
  // scorm.handleExitMode is to remove the default feature of marking cmi.exit
  scorm.handleExitMode = false;
  window.mainScrom = scorm;
  return scorm.initialize();
};

export const setData = (_params: string, _value?: string | boolean | number) => {
  if (scorm.isActive) {
    scorm.set(_params, _value);
    scorm.commit();
  }
};

export const setMultipleData = (_obj: { _params: string; _value?: string | boolean | number }[]) => {
  if (scorm.isActive) {
    try {
      _obj.forEach(({ _params, _value }) => {
        scorm.set(_params, _value);
      });
    } catch (e) {
      console.error('Error saving Data', e);
    } finally {
      scorm.commit();
    }
  }
};

export const getData = (_params: string) => {
  return scorm.isActive && scorm.get(_params);
};

export const terminate = () => {
  return scorm.isActive && scorm.terminate();
};

