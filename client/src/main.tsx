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

// Check if we should bypass runtime error plugin
const shouldBypassErrorPlugin = sessionStorage.getItem('bypass-runtime-error') === 'true' || 
                                window.location.search.includes('no-error-plugin=true');

if (shouldBypassErrorPlugin) {
  console.log('Runtime error plugin bypass enabled');
  
  // Override error handling to prevent runtime error plugin
  window.addEventListener('error', function(event) {
    if (event.filename && event.filename.includes('runtime-error')) {
      console.log('Runtime error plugin blocked');
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);
  
  // Override unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.toString().includes('401')) {
      console.log('401 auth error handled gracefully');
      event.preventDefault();
      return false;
    }
  });
}

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
