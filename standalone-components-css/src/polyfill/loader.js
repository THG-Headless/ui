/**
 * OKLCH Polyfill Auto-Loader
 * Automatically detects if OKLCH polyfill is needed and loads it
 */

(function() {
  'use strict';

  // Check if polyfill is needed
  function needsPolyfill() {
    if (typeof CSS === 'undefined' || !CSS.supports) return true;
    
    try {
      return !CSS.supports('color', 'oklch(0.7 0.15 250)') || 
             !CSS.supports('color', 'oklch(from red l c h)');
    } catch (e) {
      return true;
    }
  }

  // Load polyfill script
  function loadPolyfill() {
    // Check if already loaded
    if (window.AltitudeOklchPolyfill) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.onload = function() {
      console.debug('Altitude OKLCH polyfill loaded');
    };
    script.onerror = function() {
      console.warn('Failed to load OKLCH polyfill');
    };
    
    // Try to determine the correct path
    const currentScript = document.currentScript;
    let basePath = '';
    
    if (currentScript && currentScript.src) {
      basePath = currentScript.src.replace(/\/[^/]*$/, '/');
    } else {
      // Fallback: look for link to main.css
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      for (const link of cssLinks) {
        if (link.href.includes('altitude') || link.href.includes('main.css')) {
          basePath = link.href.replace(/\/[^/]*$/, '/');
          break;
        }
      }
    }
    
    script.src = basePath + 'oklch-polyfill.min.js';
    
    // Insert before first script or at end of head
    const firstScript = document.querySelector('script');
    if (firstScript) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      (document.head || document.documentElement).appendChild(script);
    }
  }

  // Auto-initialize
  if (needsPolyfill()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadPolyfill);
    } else {
      loadPolyfill();
    }
  }

})();