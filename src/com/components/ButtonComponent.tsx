import React, { useEffect, useState, useRef } from 'react';
import globalStore from '../thunk';
import styles from '../styles/buttonComponent.scss';
import '../../../public/common/assets/fonts/fonts.css';

interface ButtonComponentPropsInterface {
  text?: string;
  defaultCSS?: string;
  normalCSS?: string;
  hoverCSS?: string;
  disabledCSS?: string;
  clickHandler?: Function;
  disabled?: boolean;
  position?: string;
  value?: string;
  ariaHidden?: boolean;
  visibility?: boolean;
  role?: string;
  reference?: React.Ref<HTMLButtonElement>;
  title?: string;
  ariaLabel?: string;
  dataId?: string;
  rollOverDisabled?: boolean;
  imgSrc?: string;
  imgWidth?: number;
  imgHeight?: number | string;
  noAudio?: boolean;
  avoidDefaultStyle?: boolean;
  onKeyDown?: any;
  avoidDisableClass?: boolean;
  buttonInnerElements?: any;
}

const ButtonComponent = (props: ButtonComponentPropsInterface) => {
  let {
    text = '',
    defaultCSS = '',
    normalCSS = '',
    hoverCSS = '',
    disabledCSS = '',
    clickHandler = () => {},
    disabled = false,
    avoidDefaultStyle = false,
    avoidDisableClass = false,
  } = props;

  const [buttonHovered, setButtonHovered] = useState(false);

  const btnRef = useRef<HTMLButtonElement>();

  const { audios } = globalStore.useStoreState((store) => store.player);

  useEffect(() => {
    const _tempClick = function (event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        button.click();
      }
    };
    const button = btnRef.current;
    button?.addEventListener('keydown', _tempClick);
    return () => {
      button?.removeEventListener('keydown', _tempClick);
    };
  }, [btnRef]);

  return (
    <button
      data-position={props.position ? props.position : null}
      data-value={props.value ? props.value : new Date().getTime()}
      style={{ visibility: props.visibility ? 'hidden' : 'visible' }}
      role={props.role ? props.role : null}
      ref={props.reference ? props.reference : btnRef}
      title={props.title ? props.title : null}
      aria-label={props.ariaLabel ? props.ariaLabel : text}
      data-id={props.dataId ? props.dataId : null}
      className={`${defaultCSS} ${normalCSS} ${buttonHovered && !props.rollOverDisabled && `${hoverCSS} `}  ${
        disabled && `${disabledCSS}`
      }  ${!avoidDefaultStyle && (buttonHovered ? styles.defaultBtnHover : styles.defaultBtn)}`}
      aria-hidden={`${
        props.ariaHidden
          ? props.ariaHidden
          : defaultCSS.indexOf('disableButton') !== -1
          ? avoidDisableClass
            ? false
            : true
          : false
      }`}
      tabIndex={props.ariaHidden ? -1 : defaultCSS.indexOf('disableButton') !== -1 ? (avoidDisableClass ? 0 : -1) : 0}
      aria-disabled={defaultCSS.indexOf('disableButton') !== -1 ? true : false}
      disabled={disabled}
      onClick={(e) => {
        if ((e.target as HTMLButtonElement).classList.toString().indexOf('disableButton') !== -1) {
          return false;
        }
        if (!props.noAudio) {
          audios.click?.play();
        }
        setButtonHovered(false);
        clickHandler(e);
      }}
      //
      //  onMouseOut={(e) => {
      //   setButtonHovered(false);
      //  }}
      onKeyDown={props.onKeyDown}
    >
      {props.buttonInnerElements && props.buttonInnerElements}
      <span style={{ pointerEvents: 'none' }} aria-hidden={true}>
        {text}
      </span>
    </button>
  );
};

export default ButtonComponent;

