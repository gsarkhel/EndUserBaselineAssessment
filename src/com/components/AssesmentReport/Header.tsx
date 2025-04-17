import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/PdfHeader.scss';
import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div  className={styles.headerContainer}>
      <h1  className={styles.headerTitle}>Overall Score:{title}</h1>
    </div>
    // <View>
    //   <View>
    //     <Text>{title}</Text>
    //   </View>
    // </View>
  );
};

export default Header;
