import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // Use App.css for global styling
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals(); // Keep this for performance monitoring