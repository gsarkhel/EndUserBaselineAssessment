import { Scorm, scorm } from '@gamestdio/scorm';
import LogWindowHelper from './LogWindowHelper';
declare global {
  interface Window {
    mainScrom: any;
    logger: any;
  }
}

/**
 * Global utility function to sanitize strings for SCORM compatibility
 * Replaces problematic characters that might cause issues in SCORM data
 * @param str - The string to sanitize
 * @returns The sanitized string
 */
export const sanitizeString = (str: string): string => {
  if (!str) return '';
  
  return str
    // Basic replacements for SCORM compatibility
    .replaceAll(' ', '_')
    .replaceAll('&', 'n')
    .replaceAll(',', '')
    .replaceAll('(', '')
    .replaceAll(')', '')
    // Additional problematic characters
    .replaceAll(':', '_')  // Colon can cause issues in some systems
    .replaceAll(';', '_')  // Semicolon can be problematic
    .replaceAll('"', '')   // Double quotes can break JSON/XML
    .replaceAll("'", '')   // Single quotes can break JSON/XML
    .replaceAll('<', '')   // Less than can break XML/HTML
    .replaceAll('>', '')   // Greater than can break XML/HTML
    .replaceAll('[', '')   // Square brackets can cause parsing issues
    .replaceAll(']', '')   // Square brackets can cause parsing issues
    .replaceAll('{', '')   // Curly braces can cause parsing issues
    .replaceAll('}', '')   // Curly braces can cause parsing issues
    .replaceAll('|', '_')  // Pipe can be problematic in some contexts
    .replaceAll('\\', '_') // Backslash can cause path issues
    .replaceAll('/', '_')  // Forward slash can cause path issues
    .replaceAll('?', '')   // Question mark can cause URL issues
    .replaceAll('*', '')   // Asterisk can cause file system issues
    .replaceAll('#', '')   // Hash can cause URL issues
    .replaceAll('%', '')   // Percent can cause URL encoding issues
    .replaceAll('@', 'at') // At symbol can cause email parsing issues
    .replaceAll('!', '')   // Exclamation mark can cause parsing issues
    .replaceAll('$', '')   // Dollar sign can cause variable parsing issues
    .replaceAll('^', '')   // Caret can cause regex issues
    .replaceAll('+', 'plus') // Plus can cause URL encoding issues
    .replaceAll('=', '')   // Equals can cause parsing issues
    .replaceAll('~', '')   // Tilde can cause URL issues
    .replaceAll('`', '')   // Backtick can cause code injection issues
    .replaceAll('°', 'deg') // Degree symbol
    .replaceAll('©', 'c')  // Copyright symbol
    .replaceAll('®', 'r')  // Registered trademark
    .replaceAll('™', 'tm') // Trademark
    .replaceAll('–', '-')  // En dash
    .replaceAll('—', '-')  // Em dash
    .replaceAll('…', '...') // Ellipsis
    // Handle smart quotes and apostrophes with regex to avoid syntax issues
    .replace(/[""]/g, '')   // Smart quotes
    .replace(/['']/g, '')   // Smart apostrophes
    // Remove any remaining non-ASCII characters
    .replace(/[^\x00-\x7F]/g, '')
    // Clean up multiple consecutive underscores
    .replace(/_+/g, '_')
    // Remove leading/trailing underscores
    .replace(/^_+|_+$/g, '');
};

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
  LogWindowHelper.setLoggerEnabled(false);
  
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
