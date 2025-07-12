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
  location: window.location.href,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isFirefox: navigator.userAgent.includes('Firefox'),
  viewport: { width: window.innerWidth, height: window.innerHeight }
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

// Enhanced mobile detection and fallback
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
}

function shouldUseMobileFallback() {
  const userAgent = navigator.userAgent;
  const mobile = isMobile();
  
  // Force mobile fallback for ALL mobile browsers to avoid blank screens
  if (mobile) {
    console.log('Mobile browser detected, redirecting to mobile version');
    return true;
  }
  
  // Also redirect very small screens
  if (window.innerWidth <= 768 || window.innerHeight <= 600) {
    console.log('Small screen detected, redirecting to mobile version');
    return true;
  }
  
  return false;
}

// Simple error handling to prevent preview window issues
function safeRender() {
  try {
    // Check if we should redirect to mobile version
    if (shouldUseMobileFallback()) {
      console.log('Redirecting to mobile-optimized version');
      window.location.href = '/mobile.html';
      return;
    }
    
    const root = document.getElementById("root");
    if (!root) {
      throw new Error("Root element not found");
    }
    
    console.log('Root element found, rendering app...');
    createRoot(root).render(<App />);
    console.log('App rendered successfully');
  } catch (error) {
    console.log("App render error:", error);
    
    // Create a comprehensive fallback UI
    document.body.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <div style="text-align: center; color: white; max-width: 400px; width: 100%;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">✞</div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem; font-weight: bold;">Proof of a Miracle</h1>
          <p style="margin-bottom: 2rem; opacity: 0.8;">Faith Community App</p>
          <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <p style="margin-bottom: 15px;">The app failed to load. Please try:</p>
            <button onclick="window.location.reload()" style="background: #f59e0b; color: #1e3a8a; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; margin: 5px; width: 100%;">
              Reload App
            </button>
            <button onclick="window.location.href='/mobile.html'" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; margin: 5px; width: 100%;">
              Try Mobile Version
            </button>
          </div>
          <p style="font-size: 0.9rem; opacity: 0.7;">Browser: ${navigator.userAgent.substring(0, 50)}...</p>
        </div>
      </div>
    `;
  }
}

// Use setTimeout to avoid blocking the main thread
setTimeout(safeRender, 100);
