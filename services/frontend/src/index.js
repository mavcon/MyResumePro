import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Error handling for development
if (process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (/Failed prop type/.test(args[0])) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 