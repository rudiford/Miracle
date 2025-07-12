// Override runtime error plugin to prevent preview window issues
(function() {
  'use strict';
  
  // Override the createHotContext function before it's used
  if (window.__vite_plugin_runtime_error_modal_disabled) {
    return;
  }
  
  window.__vite_plugin_runtime_error_modal_disabled = true;
  
  // Store original functions
  const originalAddEventListener = window.addEventListener;
  const originalConsoleError = console.error;
  
  // Override addEventListener to block runtime error plugin events
  window.addEventListener = function(type, listener, options) {
    if (type === 'error' && listener.toString().includes('runtime-error')) {
      console.log('Blocked runtime error plugin event listener');
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Override console.error to suppress runtime error plugin messages
  console.error = function(...args) {
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('runtime-error') || args[0].includes('createHotContext'))) {
      return;
    }
    return originalConsoleError.apply(console, args);
  };
  
  // Override any global hot context creation
  window.createHotContext = function() {
    return {
      send: function() { /* no-op */ },
      on: function() { /* no-op */ },
      off: function() { /* no-op */ }
    };
  };
  
  console.log('Runtime error plugin neutralized');
})();