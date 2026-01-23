import './index.css'; // CRITICAL: Connects PostCSS/Tailwind build pipeline
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

// Diagnostic: Verify environment
console.log('%c V-ENGINE ', 'background: #4f46e5; color: #fff; font-weight: bold; padding: 2px 4px;', `React ${React.version} Initialized`);

const rootElement = document.getElementById('root');

const init = () => {
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </React.StrictMode>
      );
    } catch (err: any) {
      console.error('React Root Error:', err);
      rootElement.innerHTML = `
        <div style="padding:40px;font-family:sans-serif;text-align:center;background:#f8fafc;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <h2 style="color:#e11d48;font-weight:900;font-size:24px;margin-bottom:12px;">Bootstrap Failure</h2>
          <p style="color:#64748b;font-weight:500;max-width:320px;line-height:1.6;">The application failed to initialize the React root. This is likely due to version conflicts or blocked scripts.</p>
          <code style="display:block;margin-top:24px;padding:12px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;font-size:12px;color:#ef4444;">${err?.message || 'Check Browser Console for Details'}</code>
          <button onclick="location.reload()" style="margin-top:32px;background:#4f46e5;color:white;border:none;padding:12px 24px;border-radius:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;">Retry Load</button>
        </div>
      `;
    }
  } else {
    console.error('Failed to find root element');
  }
};

// Ensure DOM is ready before init
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}