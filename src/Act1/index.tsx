import { createRoot } from 'react-dom/client';
import App from './App';
import Player from '../com/Player';
import React from 'react';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  
  <Player>
    <App />
  </Player>
);

