import React from 'react';
import styles from '../styles/backgroundComp.scss';
import globalStore from '../thunk';

interface backgroundPropsInterface {
  src?: string;
  alt?: string;
  className?: string;
}

const Background = (props: backgroundPropsInterface) => {
  const { src = 'bgImage', alt = 'background', className = '' } = props;
  const { images } = globalStore.useStoreState((store) => store.player);

  return (
    <img
      src={images[src]?.url}
      alt={alt}
      className={`${styles.backgroundImage} ${className}`}
    />
  );
};

export default Background;

