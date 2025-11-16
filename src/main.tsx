
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Failed to find the root element! The DOM might not be ready or the element doesn't exist.");
  // Create an element to show the error visibly to users
  const errorElement = document.createElement('div');
  errorElement.innerHTML = '<h1>Application Error</h1><p>Failed to find root element</p>';
  document.body.appendChild(errorElement);
} else {
  console.log("Root element found, mounting React");
  
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React mounted successfully");
  } catch (error) {
    console.error("Error mounting React application:", error);
    
    // Show error message visibly in the UI
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Application Error</h1>
        <p>Something went wrong while loading the application</p>
        <pre style="text-align: left; background: #f0f0f0; padding: 10px; border-radius: 4px;">${error}</pre>
      </div>
    `;
  }
}
