import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Verify the environment is using the locked version 18
console.log('BOOT: Initializing React Workspace...');
console.log('BOOT: Kernel Version ->', React.version);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Final check: If React 19 managed to bypass the locks, block the render
if (React.version.startsWith('19')) {
  rootElement.innerHTML = `
    <div style="padding: 60px; font-family: 'Inter', sans-serif; text-align: center; background: #fff1f2; min-h: 100vh;">
      <div style="background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); max-width: 500px; margin: 0 auto;">
        <h1 style="font-weight: 900; color: #e11d48; font-size: 24px; margin-bottom: 16px;">SECURITY BREACH</h1>
        <p style="color: #4b5563; font-weight: 500; line-height: 1.6;">An unauthorized environment (React ${React.version}) attempted to load. This application is locked to React 18 for stability.</p>
        <button onclick="window.location.reload()" style="margin-top: 24px; background: #e11d48; color: white; padding: 12px 24px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer;">Reset Kernel</button>
      </div>
    </div>
  `;
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}