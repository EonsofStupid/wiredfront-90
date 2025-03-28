
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import './index.css';
import './styles/mobile.css';
import './mobile/styles/mobile.css';
import './components/chat/styles/chat-variables.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
