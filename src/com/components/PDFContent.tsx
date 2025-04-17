import React, { forwardRef } from 'react';
import ResultProgressCircle from './ProgressCircle';
import AssessmentReport from './AssesmentReport/AssessmentReportMain';
import { PDFViewer } from '@react-pdf/renderer';
import globalStore from '../thunk';
import { t } from '../helpers/LanguageTranslator';

const PDFContent = forwardRef<HTMLDivElement>((_, ref) => {
  const assessmentData = {
    overallScore: 66,
    sectionScores: [
      { label: 'Segment', score: 80 },
      { label: 'EcoStruxure Domain', score: 75 },
      { label: 'Sustainability, Software & Services', score: 67 },
      { label: 'Sales Skills', score: 70 },
      { label: 'Sales Tools & Processes', score: 98 },
    ],
    passingScore: {
      overall: 50,
      section: 15,
    },
  };
  const { images, valuesObj } = globalStore.useStoreState((st) => st.player);
  const { scormData } = globalStore.useStoreState((st) => st.scromInfo);
  // const { images } = globalStore.useStoreState((st) => st.player);
  assessmentData.sectionScores = Object.keys(valuesObj.tabs).map((_k) => {
    return {
      label: t(valuesObj.tabs[_k].title),
      score: scormData.tabs[_k]?.score || 0,
    };
  });

  return (
    <PDFViewer width="791" height="1123">
      <AssessmentReport data={assessmentData} images={images} />
    </PDFViewer>
  );
});

export default PDFContent;

