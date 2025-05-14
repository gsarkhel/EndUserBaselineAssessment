import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../styles/PdfHeader.scss";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { t } from "../../helpers/LanguageTranslator";

interface HeaderProps {
  title: string;
}

const Header = (props: HeaderProps) => {
  const { title } = props;
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>
        {t("overallScore")} : {title}
      </h1>
    </div>
  );
};

export default Header;
