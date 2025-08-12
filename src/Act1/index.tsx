import { createRoot } from 'react-dom/client';
import App from './App';
import Player from '../com/Player';
import ErrorBoundary from '../com/components/ErrorBoundary';
import React from 'react';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <ErrorBoundary 
    errorMessage="The application encountered an error and cannot continue. Please refresh the page or contact support."
    onError={(error, errorInfo) => {
      // Log critical errors to any monitoring service
      console.error('Critical application error:', error, errorInfo);
    }}
  >
    <Player>
      <App />
    </Player>
  </ErrorBoundary>
);

