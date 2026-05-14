// Standalone entry point — only runs when opened directly in the browser.
// When embedded in the Angular shell, mount() in App.jsx is called instead.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
