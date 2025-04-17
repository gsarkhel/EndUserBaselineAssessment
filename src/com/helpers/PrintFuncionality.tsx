import { Document, Page, pdf } from '@react-pdf/renderer';
import React from 'react';

const PrintFuncionality = async (jsxCode: JSX.Element) => {
  const _pdfElem = <Document>{jsxCode}</Document>;
  const _blob = await pdf(_pdfElem).toBlob();
  const _fileURL = URL.createObjectURL(_blob);
  const _pdfWindow = window.open();
  _pdfWindow.location.href = _fileURL;
};

export default PrintFuncionality;
