import React from 'react';
import AssessmentReport from './AssesmentReport/AssessmentReportMain';
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
    <div>
      {title && <h2>{title}</h2>}
      {heading && <h3>{heading}</h3>}
      {description && <p>{description}</p>}
      
      <PDFViewer width="100%" height="650px">
        <AssessmentReport 
          data={{
            overallScore: 0,
            sectionScores: [],
            passingScore: { overall: 70 }
          }}
          images={{
            certificateBG: { url: '' },
            pdflogo: { url: '' }
          }}
          isPassed={false}
        />
      </PDFViewer>
      
      {clickHandler && (
        <button onClick={() => clickHandler()}>
          Generate PDF
        </button>
      )}
    </div>
  );
};

export default PdfButton;

