import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA functionality - with Brave browser compatibility
if ('serviceWorker' in navigator && !navigator.userAgent.includes('Brave')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
);
  });
}

try {
  const root = document.getElementById("root);
  if (!root) {
    throw new Error("Root element not found");
  }
  createRoot(root).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>App Loading Error</h1>
      <p>There was an issue loading the application. Please try refreshing the page.</p>
      <p>If using Brave browser, try disabling shields for this site or use Chrome.</p>
      <button onclick="window.location.reload()">Refresh Page</button>
    </div>
  `;
}
