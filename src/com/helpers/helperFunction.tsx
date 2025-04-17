import React, { JSX, useEffect, useRef } from 'react';
import { jsxProperties, playerInterface } from '../interface/playerInterface';
import fonts from '../styles/fonts.scss';

/**
 * Sets up the children elements with additional data.
 * @param {JSX.Element | JSX.Element[]} children - The child elements to be processed.
 * @param {{ [key: string]: any }} [_extraData] - Additional data to be passed to each child element.
 * @returns {JSX.Element | JSX.Element[]} The processed child elements.
 */
export const setupChildren = (
  children?: JSX.Element | JSX.Element[],
  _extraData?: { [key: string]: any }
) => {
  if (children) {
    if (Array.isArray(children)) {
      return children.map((_ch) => {
        if (React.isValidElement(_ch)) {
          return React.cloneElement<playerInterface>(_ch, {
            ..._extraData,
          });
        }
        return <></>;
      });
    } else if (React.isValidElement(children)) {
      return React.cloneElement<playerInterface>(children, {
        ..._extraData,
      });
    }
  }

  return <></>;
};

/**
 * Helper function to get the font according the values passed in the functions
 * @param {boolean} for bold
 * @param {boolean} for italic
 */
export const getFontFamily = (
  _initFontStyle = 'regular',
  _bold: boolean = false,
  _italic: boolean = false
) => {
  if (_bold && _italic) {
    return fonts.fontFamilyBoldItalic;
  }
  if (_bold) {
    return fonts.fontFamilyBold;
  }
  if (_italic) {
    return fonts.fontFamilyItalic;
  }
  switch (_initFontStyle) {
    case 'regular':
      return fonts.fontFamilyRegular;
    case 'medium':
      return fonts.fontFamilyMedium;
    case 'bold':
      return fonts.fontFamilyBold;
    case 'italic':
      return fonts.fontFamilyItalic;
    case 'boldItalic':
      return fonts.fontFamilyBoldItalic;
    case 'semiBold':
      return fonts.fontFamilySemiBold;
    case 'mediumItalic':
      return fonts.fontFamilyMediumItalic;
    case 'extraBold':
      return fonts.fontFamilyExtraBold;
    case 'extraLight':
      return fonts.fontFamilyExtraLight;
    case 'digital':
      return fonts.fontFamilyDigital;
    default:
      return fonts.fontFamilyRegular;
  }
};

/**
 * Sleep function to make sure that all sync operations are done
 * @param {number} sleepTime to use any other sleep time
 */
export const sleep = (sleepTime: number = 10) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sleepTime);
  });
};

/**
 * function to props and valuesObj of a component
 * @param {Object}
 * @param {Object}
 */
export const mergeObj = (
  _obj1: { [key: string]: any },
  _obj2: { [key: string]: any }
): jsxProperties => {
  return { x: 0, y: 0, ..._obj1, ..._obj2 };
};

export const printHandler = (instructions: string[]) => {
  var printWindow = window.open('', '', 'height=700,width=1000');
  printWindow.document.write('<html><head>');
  printWindow.document.write(
    '<link rel="stylesheet" type="text/css" href="../common/print.css" />'
  );
  printWindow.document.write(
    '<link rel="stylesheet" type="text/css" href="../common/fonts/fonts.css" />'
  );

  printWindow.document.write(
    '<script>var total=1,loaded=0;function check(){loaded++; if(loaded >= total){setTimeout(function() {window.print();}, 200);}}</script>'
  );
  printWindow.document.write(`</head><body>`);

  // Required content is printed here
  instructions.forEach((_inst, _i) => {
    printWindow.document.write(_inst);
  });

  printWindow.document.write('</body ></html > ');
  printWindow.onload = () => {
    setTimeout(function () {
      printWindow.print();
    }, 500);
  };

  printWindow.document.close();
  return printWindow;
};

export const hitTest = (
  _obj: any,
  _x: number,
  _y: number,
  _regAlignment: string = 'center'
) => {
  let _bool = false;
  if (_regAlignment !== 'center') {
    if (
      _x / window.devicePixelRatio > _obj.x &&
      _x / window.devicePixelRatio < _obj.x + _obj.width &&
      _y / window.devicePixelRatio > _obj.y &&
      _y / window.devicePixelRatio < _obj.y + _obj.height
    ) {
      _bool = true;
    }
  } else if (
    _x / window.devicePixelRatio > _obj.x - _obj.width / 2 &&
    _x / window.devicePixelRatio < _obj.x + _obj.width / 2 &&
    _y / window.devicePixelRatio > _obj.y - _obj.height / 2 &&
    _y / window.devicePixelRatio < _obj.y + _obj.height / 2
  ) {
    _bool = true;
  }
  return _bool;
};

export const BrowserDetect: any = {
  platformAndroid() {
    return !!navigator.userAgent.match(/Android/i);
  },
  platformBlackBerry() {
    return !!navigator.userAgent.match(/BlackBerry/i);
  },
  platformIOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
      ? true
      : navigator.maxTouchPoints > 0 && typeof window.orientation !== 'undefined';
  },
  platformWindows() {
    return !!navigator.userAgent.match(/IEMobile/i);
  },
  platformMac() {
    return !!navigator.userAgent.match(/Mac|iPhone|iPod|iPad/i);
  },
  isIPhone() {
    return navigator.userAgent.match(/iPhone|iPod/i)
      ? true
      : navigator.maxTouchPoints > 0 && typeof window.orientation !== 'undefined';
  },
  isIpad() {
    return navigator.userAgent.match(/iPad/i)
      ? true
      : navigator.maxTouchPoints > 0 && typeof window.orientation !== 'undefined';
  },
  isMobile() {
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.search('android') > -1 && userAgent.search('mobile') > -1) return true;
    else if (userAgent.search('android') > -1 && !(userAgent.search('mobile') > -1))
      return false;
    else
      return /iphone|ipod|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent
      );
  },
  isTablet() {
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.search('android') > -1 && !(userAgent.search('mobile') > -1))
      return true;
    else if (BrowserDetect.isIpad()) return true;
    else
      return /ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(
        userAgent.toLowerCase()
      );
  },
  isDevice() {
    return (
      BrowserDetect.platformAndroid() ||
      BrowserDetect.platformBlackBerry() ||
      BrowserDetect.platformIOS() ||
      BrowserDetect.platformWindows()
    );
  },
  ie9() {
    return !!navigator.userAgent.match(/MSIE 9.0/i);
  },
  ie10() {
    return !!navigator.userAgent.match(/MSIE 10.0/i);
  },
  ie() {
    return (
      navigator.appName === 'Microsoft Internet Explorer' ||
      !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) ||
      navigator.userAgent.indexOf('MSIE') > 0 ||
      !!navigator.userAgent.match(/Edge\/\d./i) ||
      !!navigator.userAgent.match(/MSIE 9.0/i) ||
      !!navigator.userAgent.match(/MSIE 10.0/i)
    );
  },
  getOrientation() {
    let returnObj: any = {
      type: 'D', // values - M - Mobile / T - tablet / D - Desktop / Othe - not yet recognised as device or desktop
      orientation: undefined, // undfined for Destop / L - landscape / P - Portrait
    };
    if (BrowserDetect.isDevice()) {
      returnObj.orientation = window.orientation === 0 ? 'P' : 'L';
      returnObj.type = BrowserDetect.isMobile()
        ? 'M'
        : BrowserDetect.isTablet()
        ? 'T'
        : 'Other';
    }
    return returnObj;
  },
};

export const useEffectWithoutInitialRender = (
  func: React.EffectCallback,
  deps?: React.DependencyList
) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export const negativeSymbol = (num: number, allowPlusSymbol: boolean = false) => {
  return (num >= 0 ? (allowPlusSymbol ? '+' : '') : '−') + Math.abs(num);
};

/*
  this function will return the step value at given frame for any number animation,
  */
export const getStepValue = (
  start: number,
  end: number,
  steps: number,
  currentFrame: number
) => {
  return start + ((end - start) / steps) * currentFrame;
};
/**
 *
 * @param x number
 * @returns string with number seperated with comma
 */
export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/*
  function to add two angle 
*/
export const addAngle = (val1: number, val2: number) => {
  let addition = val1 + val2;
  if (addition > 360) {
    addition = addition - 360;
  }

  return addition;
};

/*
  function to sub two angle 
*/
export const subAngle = (val1: number, val2: number) => {
  let sub = val1 - val2;
  if (sub < 0) {
    sub = sub + 360;
  }

  return sub;
};

/*
  function to fix angle range bet 0 and 360
*/
export const fixAngle = (val: number) => {
  if (val < 0) {
    val = val + 360;
  }
  if (val > 360) {
    val = val - 360;
  }
  return val;
};

// Fisher-Yates shuffle algorithm
const shuffle = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Generates an array of unique random numbers within a range and shuffles them
 * @param min Minimum number in range (inclusive)
 * @param max Maximum number in range (inclusive)
 * @param count Number of items to generate
 * @returns Array of shuffled unique numbers
 */
export const generateShuffledNumbers = (
  min: number,
  max: number,
  count: number
): number[] => {
  // Create array of all possible numbers in range
  const allNumbers = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  // Shuffle all numbers
  const shuffled = shuffle(allNumbers);

  // Return requested count or all numbers if count > available numbers
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Generates an array of shuffled items from the source array
 * @param sourceArray Source array to pick items from
 * @param count Number of items to generate
 * @returns Array of shuffled items from source array
 */
export const generateShuffledFromArray = (sourceArray: any[], count: number) => {
  const arrayCopy = shuffle([...sourceArray]);

  return arrayCopy.slice(0, Math.min(count, arrayCopy.length));
};

