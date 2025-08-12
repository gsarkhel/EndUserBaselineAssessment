import React, { forwardRef } from 'react';
import ResultProgressCircle from './ProgressCircle';
import AssessmentReport from './AssesmentReport/AssessmentReportMain';
import { PDFViewer } from '@react-pdf/renderer';
import globalStore from '../thunk';
import { t } from '../helpers/LanguageTranslator';
import ErrorBoundary from './ErrorBoundary';

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
    <ErrorBoundary 
      errorMessage="PDF could not be generated. Please try again or contact support."
      onError={(error, errorInfo) => {
        console.error('PDF generation error:', error, errorInfo);
      }}
      fallback={
        <div style={{
          width: '791px',
          height: '1123px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div>
            <h3>PDF Generation Failed</h3>
            <p>The certificate PDF could not be generated. Please try refreshing the page or contact support.</p>
          </div>
        </div>
      }
    >
      <PDFViewer width="791" height="1123">
        <AssessmentReport data={assessmentData} images={images} />
      </PDFViewer>
    </ErrorBoundary>
  );
});

export default PDFContent;

