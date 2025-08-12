import { Scorm, scorm } from '@gamestdio/scorm';
import LogWindowHelper from './LogWindowHelper';
declare global {
  interface Window {
    mainScrom: any;
    logger: any;
  }
}

/**
 * Wrapper function for scorm.set that captures the callback and shows error alerts
 * when the operation fails (returns false)
 */
const safeScormSet = (parameter: string, value?: string | boolean | number): boolean => {
  const result = scorm.set(parameter, value);
  
  if (result === false) {
    const errorMessage = `SCORM Set Error: Failed to set '${parameter}' to '${value}'. This may indicate a SCORM communication issue.`;
    console.error(errorMessage);
    window.logger?.log(`ERROR: ${errorMessage}`);
    
    // Show user-friendly alert
    alert(`Warning: Unable to save progress for '${parameter}'. Your progress may not be saved properly. Please contact support if this issue persists.`);
  }
  
  return result;
};

/**
 * Wrapper function for scorm.get that captures errors and shows alerts
 * when the operation fails or returns unexpected values
 */
const safeScormGet = (parameter: string): string | null => {
  const result = scorm.get(parameter);
  
  if (result === null || result === undefined) {
    const errorMessage = `SCORM Get Error: Failed to get '${parameter}'. This may indicate a SCORM communication issue.`;
    console.error(errorMessage);
    window.logger?.log(`ERROR: ${errorMessage}`);
    
    // Show user-friendly alert for critical parameters
    if (parameter.includes('cmi.core') || parameter.includes('cmi.completion') || parameter.includes('cmi.success')) {
      alert(`Warning: Unable to retrieve progress data for '${parameter}'. Your progress may not be loaded properly. Please contact support if this issue persists.`);
    }
  }
  
  return result;
};

/**
 * Wrapper function for scorm.initialize that captures errors and shows alerts
 * when the operation fails
 */
const safeScormInitialize = (): boolean => {
  const result = scorm.initialize();
  
  if (result === false) {
    const errorMessage = `SCORM Initialize Error: Failed to initialize SCORM. This may indicate a SCORM communication issue.`;
    console.error(errorMessage);
    window.logger?.log(`ERROR: ${errorMessage}`);
    
    // Show user-friendly alert
    alert(`Warning: Unable to initialize the learning system. Please refresh the page or contact support if this issue persists.`);
  }
  
  return result;
};

/**
 * Wrapper function for scorm.terminate that captures errors and shows alerts
 * when the operation fails
 */
const safeScormTerminate = (): boolean => {
  const result = scorm.terminate();
  
  if (result === false) {
    const errorMessage = `SCORM Terminate Error: Failed to terminate SCORM. This may indicate a SCORM communication issue.`;
    console.error(errorMessage);
    window.logger?.log(`ERROR: ${errorMessage}`);
    
    // Show user-friendly alert
    alert(`Warning: Unable to properly close the learning session. Your progress may not be saved. Please contact support if this issue persists.`);
  }
  
  return result;
};

/**
 * Wrapper function for scorm.commit that captures errors and shows alerts
 * when the operation fails
 */
const safeScormCommit = (): boolean => {
  const result = scorm.commit();
  
  if (result === false) {
    const errorMessage = `SCORM Commit Error: Failed to commit data. This may indicate a SCORM communication issue.`;
    console.error(errorMessage);
    window.logger?.log(`ERROR: ${errorMessage}`);
    
    // Show user-friendly alert
    alert(`Warning: Unable to save your progress. Please try again or contact support if this issue persists.`);
  }
  
  return result;
};

export const initalizeScrom = () => {
  // Enable logger
  LogWindowHelper.setLoggerEnabled(true);
  
  // scorm.handleExitMode is to remove the default feature of marking cmi.exit
  window.logger = new LogWindowHelper();
  const windowOpened = window.logger.open();
  if (!windowOpened && LogWindowHelper.isEnabled()) {
    console.warn('SCORM: Log window could not be opened, but logging will continue in buffer');
  }
  scorm.handleExitMode = false;
  window.mainScrom = scorm;
  const resp = safeScormInitialize();
  window.logger.log(`Initialise ${resp}`);
  return resp;
};

export const setData = (
  _params: string,
  _value?: string | boolean | number
) => {
  if (scorm.isActive) {
    const result = safeScormSet(_params, _value);
    const commitResult = safeScormCommit();
    window.logger.log(`Set ${_params}, ${_value} = ${result}`);
    window.logger.log(`Commit ${commitResult}`);
    // scorm.set(_params, _value);
    // scorm.commit();
  }
};

export const setMultipleData = (
  _obj: { _params: string; _value?: string | boolean | number }[]
) => {
  if (scorm.isActive) {
    try {
      _obj.forEach(({ _params, _value }) => {
        // scorm.set(_params, _value);
        const result = safeScormSet(_params, _value);
        window.logger.log(`SET ${_params}, ${_value} = ${result}`);
      });
    } catch (e) {
      console.error('Error saving Data', e);
      window.logger.log(`Error saving data: ${e}`);
    } finally {
      // scorm.commit();
      const commitResult = safeScormCommit();
      window.logger.log(`Commit ${commitResult}`);
    }
  }
};

export const getData = (_params: string) => {
  let getVal = null;
  if (scorm.isActive) {
    getVal = safeScormGet(_params);
    window.logger.log(`GET ${_params} = ${getVal}`);
  }
  return getVal;
};

export const terminate = () => {
  let termVal = null;
  if (scorm.isActive) {
    termVal = safeScormTerminate();
    window.logger.log(`Terminate ${termVal}`);
  }
  return termVal;
};
