import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Service worker registration temporarily disabled for browser compatibility
// Will be re-enabled once basic functionality is confirmed working
console.log('Service worker registration disabled for debugging');

// Enhanced debugging for browser compatibility
console.log('Browser Info:', {
  userAgent: navigator.userAgent,
  isIframe: window.self !== window.top,
  hasServiceWorker: 'serviceWorker' in navigator,
  location: window.location.href
});

// Override console.error to prevent runtime error overlay from showing
const originalConsoleError = console.error;
console.error = function(...args) {
  // Check if this is the runtime error overlay
  if (args[0] && typeof args[0] === 'string' && args[0].includes('runtime-error')) {
    console.log('Runtime error overlay suppressed:', ...args);
    return;
  }
  originalConsoleError.apply(console, args);
};

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Root element not found");
  }
  
  console.log('Root element found, rendering app...');
  createRoot(root).render(<App />);
  console.log('App rendered successfully');
} catch (error) {
  console.error("Failed to render app:", error);
  console.error("Error stack:", error.stack);
  
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>App Loading Error</h1>
      <p>There was an issue loading the application. Please try refreshing the page.</p>
      <p><strong>Error:</strong> ${error.message}</p>
      <p><strong>Browser:</strong> ${navigator.userAgent.split(' ')[0]}</p>
      <p>If using Brave browser, try disabling shields for this site or use Chrome.</p>
      <button onclick="window.location.reload()">Refresh Page</button>
      <button onclick="console.log(document.body.innerHTML)">Show Debug Info</button>
    </div>
  `;
}
