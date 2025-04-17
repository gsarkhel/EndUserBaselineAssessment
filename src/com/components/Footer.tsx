import React from 'react';
import styles from '../styles/footerComp.scss';
import globalStore from '../thunk';

const Footer = () => {
  const { images } = globalStore.useStoreState((st) => st.player);
  return (
    <div className={styles.footerDiv}>
      <img src={images.logo.url} />
    </div>
  );
};

export default Footer;

