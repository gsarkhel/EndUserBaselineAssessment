import React from 'react';
import { t } from '../helpers/LanguageTranslator';
import styles from '../styles/homePage.scss';
import parentStyles from '../styles/commonStyles.scss';
import parse from 'html-react-parser';
import ButtonComponent from './ButtonComponent';
import "../../../public/common/assets/fonts/fonts.css"
import AssessmentReport from './AssesmentReport/AssessmentReportMain';
import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from "@react-pdf/renderer";

interface homepagePropsInterface {
  title?: string;
  heading?: string;
  description?: string;
  clickHandler?: Function;
}

const PdfButton = (props: homepagePropsInterface) => {
  const { title = '', heading = '', description = '', clickHandler } = props;

  return (
    // <PDFViewer width="1000" height="650">
    <div>
        <AssessmentReport />
    </div>
    
  );
};

export default PdfButton;

