/**
 * OKLCH Polyfill for Altitude Components
 * Provides OKLCH color space support for browsers that don't natively support it
 */

import { ColorConverter } from './color-converter.js';
import { CSSParser } from './css-parser.js';
import { RelativeColors } from './relative-colors.js';

class AltitudeOklchPolyfill {
  constructor() {
    this.version = '1.0.0';
    this.isPolyfilled = false;
    this.supported = this.checkNativeSupport();
    this.initialized = false;
    this.rgbFallbacks = new Map();
    
    // Bind methods to maintain context
    this.refresh = this.refresh.bind(this);
    this.handleMutation = this.handleMutation.bind(this);
  }

  /**
   * Check if browser natively supports OKLCH
   */
  checkNativeSupport() {
    if (typeof CSS === 'undefined' || !CSS.supports) return false;
    
    try {
      return CSS.supports('color', 'oklch(0.7 0.15 250)') && 
             CSS.supports('color', 'oklch(from red l c h)');
    } catch (e) {
      return false;
    }
  }

  /**
   * Initialize the polyfill
   */
  init() {
    if (this.initialized) return;
    
    console.debug('Altitude OKLCH Polyfill v' + this.version + ' - Native support:', this.supported);
    
    if (!this.supported) {
      console.debug('Initializing OKLCH polyfill...');
      this.isPolyfilled = true;
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.activate());
      } else {
        this.activate();
      }
    }
    
    this.initialized = true;
  }

  /**
   * Activate the polyfill
   */
  activate() {
    try {
      this.processOklchColors();
      this.setupMutationObserver();
      console.debug('OKLCH polyfill activated successfully');
    } catch (error) {
      console.error('Failed to activate OKLCH polyfill:', error);
    }
  }

  /**
   * Process all OKLCH colors and apply RGB fallbacks
   */
  processOklchColors() {
    // Extract all OKLCH properties from CSS
    const oklchProperties = CSSParser.extractOklchProperties();
    console.debug(`Found ${oklchProperties.size} OKLCH properties`);

    if (oklchProperties.size === 0) {
      console.debug('No OKLCH properties found in CSS');
      return;
    }

    // Process relative colors and generate RGB fallbacks
    const rgbColors = RelativeColors.processRelativeColors(oklchProperties);
    
    // Generate shade variants for base colors
    this.generateBaseColorShades(rgbColors);
    
    // Apply RGB fallbacks to CSS custom properties
    this.applyRgbFallbacks(rgbColors);
    
    console.debug(`Applied ${rgbColors.size} RGB fallbacks`);
  }

  /**
   * Generate shade variants for base colors
   */
  generateBaseColorShades(rgbColors) {
    const baseColors = CSSParser.getBaseColors();
    
    for (const [baseProperty, oklchColor] of baseColors) {
      const colorName = baseProperty.replace('--color-', '');
      const shadeVariants = RelativeColors.generateShadeVariants(oklchColor, colorName);
      
      // Add shade variants to RGB colors map
      for (const [shadeProperty, rgbValue] of shadeVariants) {
        rgbColors.set(shadeProperty, rgbValue);
      }
    }
  }

  /**
   * Apply RGB fallbacks to CSS custom properties
   */
  applyRgbFallbacks(rgbColors) {
    const root = document.documentElement;
    
    for (const [property, rgbValue] of rgbColors) {
      if (rgbValue && typeof rgbValue === 'object' && 'r' in rgbValue) {
        const rgbString = `rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`;
        root.style.setProperty(property, rgbString);
        this.rgbFallbacks.set(property, rgbString);
      }
    }
  }

  /**
   * Setup mutation observer to handle dynamic changes
   */
  setupMutationObserver() {
    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      let shouldRefresh = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'style') {
          shouldRefresh = true;
          break;
        }
        
        if (mutation.type === 'childList' && 
            (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && 
                (node.tagName === 'STYLE' || node.tagName === 'LINK')) {
              shouldRefresh = true;
              break;
            }
          }
        }
      }
      
      if (shouldRefresh) {
        // Debounce refresh calls
        clearTimeout(this.refreshTimeout);
        this.refreshTimeout = setTimeout(() => this.refresh(), 100);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
      childList: true,
      subtree: true
    });
  }

  /**
   * Refresh polyfill (useful for dynamic color changes)
   */
  refresh() {
    if (!this.isPolyfilled) return;
    
    console.debug('Refreshing OKLCH polyfill...');
    this.processOklchColors();
  }

  /**
   * Handle mutation events
   */
  handleMutation() {
    this.refresh();
  }

  /**
   * Get polyfill status information
   */
  getStatus() {
    return {
      version: this.version,
      supported: this.supported,
      isPolyfilled: this.isPolyfilled,
      initialized: this.initialized,
      fallbackCount: this.rgbFallbacks.size
    };
  }

  /**
   * Manual color conversion utility
   * @param {string} oklchString - OKLCH color string
   * @returns {string} RGB color string
   */
  convertColor(oklchString) {
    return ColorConverter.parseOklchToRgb(oklchString);
  }
}

// Create polyfill instance
const polyfill = new AltitudeOklchPolyfill();

// Make polyfill available globally BEFORE auto-init
if (typeof window !== 'undefined') {
  window.AltitudeOklchPolyfill = polyfill;
  // Also expose the class for debugging
  window.AltitudeOklchPolyfillClass = AltitudeOklchPolyfill;
}

// Auto-initialize when script loads
polyfill.init();

export default polyfill;