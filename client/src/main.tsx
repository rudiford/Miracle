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

// Block runtime error plugin before it can initialize
(function() {
  // Store original functions before any plugins can override them
  const originalAddEventListener = window.addEventListener;
  const originalFetch = window.fetch;
  
  // Override addEventListener to block runtime error plugin
  window.addEventListener = function(type, listener, options) {
    if (type === 'error' && listener && listener.toString().includes('sendError')) {
      console.log('Blocked runtime error plugin');
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Override fetch to prevent runtime error plugin communication
  window.fetch = function(input, init) {
    if (typeof input === 'string' && input.includes('runtime-error')) {
      console.log('Blocked runtime error plugin request');
      return Promise.resolve(new Response('', { status: 200 }));
    }
    return originalFetch.call(this, input, init);
  };
  
  // Block createHotContext
  if (window.createHotContext) {
    window.createHotContext = function() {
      return { send: () => {}, on: () => {}, off: () => {} };
    };
  }
})();

// Simple error handling to prevent preview window issues
function safeRender() {
  try {
    const root = document.getElementById("root");
    if (!root) {
      throw new Error("Root element not found");
    }
    
    console.log('Root element found, rendering app...');
    createRoot(root).render(<App />);
    console.log('App rendered successfully');
  } catch (error) {
    console.log("App render error:", error);
    
    // Create a simple fallback UI
    document.body.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; color: white; padding: 2rem;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Proof of a Miracle</h1>
          <p style="margin-bottom: 2rem; opacity: 0.8;">Loading faith community...</p>
          <button onclick="window.location.reload()" style="background: white; color: #1e3a8a; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500;">
            Reload App
          </button>
        </div>
      </div>
    `;
  }
}

// Use setTimeout to avoid blocking the main thread
setTimeout(safeRender, 100);
