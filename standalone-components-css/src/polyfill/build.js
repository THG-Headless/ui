/**
 * Simple build script for OKLCH polyfill
 * Combines all modules into a single file for distribution
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildPolyfill() {
  console.log('Building OKLCH polyfill...');
  
  // Read all source files
  const colorConverter = fs.readFileSync(path.join(__dirname, 'color-converter.js'), 'utf8');
  const cssParser = fs.readFileSync(path.join(__dirname, 'css-parser.js'), 'utf8');
  const relativeColors = fs.readFileSync(path.join(__dirname, 'relative-colors.js'), 'utf8');
  const polyfill = fs.readFileSync(path.join(__dirname, 'oklch-polyfill.js'), 'utf8');
  const loader = fs.readFileSync(path.join(__dirname, 'loader.js'), 'utf8');
  
  // Remove import/export statements and combine
  const bundle = `
/**
 * Altitude OKLCH Polyfill - Bundled Version
 * Auto-generated bundle of all polyfill modules
 */

(function() {
  'use strict';

  ${colorConverter.replace(/export\s+/g, '').replace(/import[^;]+;/g, '')}

  ${cssParser.replace(/export\s+/g, '').replace(/import[^;]+;/g, '')}

  ${relativeColors.replace(/export\s+/g, '').replace(/import[^;]+;/g, '')}

  ${polyfill.replace(/export\s+default[^;]+;/g, '').replace(/import[^;]+;/g, '')}

})();
`.trim();

  // Write bundled file
  const distDir = path.join(__dirname, '..', '..', 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(distDir, 'oklch-polyfill.js'), bundle);
  
  // Create minified version (simple minification)
  const minified = bundle
    .replace(/\/\*\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
    
  fs.writeFileSync(path.join(distDir, 'oklch-polyfill.min.js'), minified);
  
  console.log('✅ Polyfill built successfully');
  console.log(`   Full version: ${(bundle.length / 1024).toFixed(1)}KB`);
  console.log(`   Minified: ${(minified.length / 1024).toFixed(1)}KB`);
  
  // Create the auto-loading version by combining loader + polyfill
  createAutoLoadingVersion(loader, minified, distDir);
}

function createAutoLoadingVersion(loader, polyfillCode, distDir) {
  console.log('Creating auto-loading polyfill...');
  
  // Create a combined script that includes both the loader logic and the polyfill
  const autoLoadingScript = `
/**
 * Altitude OKLCH Auto-Loading Polyfill
 * Automatically detects OKLCH support and provides fallbacks when needed
 */

(function() {
  'use strict';

  // Feature detection
  function needsPolyfill() {
    if (typeof CSS === 'undefined' || !CSS.supports) return true;
    
    try {
      return !CSS.supports('color', 'oklch(0.7 0.15 250)') || 
             !CSS.supports('color', 'oklch(from red l c h)');
    } catch (e) {
      return true;
    }
  }

  // Only initialize if polyfill is needed
  if (needsPolyfill()) {
    console.debug('OKLCH not supported, initializing polyfill...');
    
    // Execute the polyfill code
    ${polyfillCode}
  } else {
    console.debug('Native OKLCH support detected');
  }

})();
`.trim();

  // Write the auto-loading version
  fs.writeFileSync(path.join(distDir, 'auto-polyfill.js'), autoLoadingScript);
  
  // Create minified version
  const minified = autoLoadingScript
    .replace(/\/\*\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/console\.debug[^;]+;/g, '') // Remove debug logs
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
    
  fs.writeFileSync(path.join(distDir, 'auto-polyfill.min.js'), minified);
  
  console.log('✅ Auto-loading polyfill built successfully');
  console.log(`   Auto-polyfill size: ${(minified.length / 1024).toFixed(1)}KB`);
  
  // Update main.css to reference the auto-loading script
  updateMainCssWithAutoLoader(distDir);
}

function updateMainCssWithAutoLoader(distDir) {
  console.log('Adding polyfill integration info to main.css...');
  
  const mainCssPath = path.join(distDir, 'main.css');
  
  if (!fs.existsSync(mainCssPath)) {
    console.warn('main.css not found, skipping');
    return;
  }
  
  let mainCss = fs.readFileSync(mainCssPath, 'utf8');
  
  // Remove any existing polyfill loader sections
  mainCss = mainCss.replace(/\/\* OKLCH Polyfill Auto-Loader \*\/[\s\S]*$/gm, '');
  
  // Add information about the automatic polyfill
  const polyfillInfo = `
/* OKLCH Polyfill Integration */
/* 
 * This package automatically provides OKLCH fallbacks for older browsers.
 * The polyfill is loaded automatically when you import this package in bundlers
 * that support side-effect imports (like Webpack, Vite, etc.)
 * 
 * For manual integration, include:
 * import '@thg-altitude/standalone-components-css/auto-polyfill';
 */

/* Detection marker for browsers that need polyfill */
@supports not (color: oklch(0.7 0.15 250)) {
  :root {
    --oklch-polyfill-needed: true;
  }
}`;
  
  // Append to the end of the CSS
  mainCss += '\n' + polyfillInfo;
  
  fs.writeFileSync(mainCssPath, mainCss);
  
  console.log('✅ Polyfill integration info added to main.css');
  
  // Create a combined CSS+JS file for automatic loading
  createCombinedAutoFile(distDir);
}

function createCombinedAutoFile(distDir) {
  console.log('Creating combined auto-loading file...');
  
  // Read the CSS and auto-polyfill
  const mainCss = fs.readFileSync(path.join(distDir, 'main.css'), 'utf8');
  const autoPolyfill = fs.readFileSync(path.join(distDir, 'auto-polyfill.min.js'), 'utf8');
  
  // Create a JavaScript file that imports CSS and loads polyfill
  const combinedFile = `
/**
 * Altitude Components with Auto-Loading OKLCH Polyfill
 * This file automatically loads both the CSS and polyfill when needed
 */

// Inject CSS into document
const css = \`${mainCss.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`;

function injectCSS() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }
}

// Auto-inject CSS
injectCSS();

// Load polyfill
${autoPolyfill}

// Export for module environments
export default { css, polyfill: true };
`;

  fs.writeFileSync(path.join(distDir, 'auto.js'), combinedFile);
  
  console.log('✅ Combined auto-loading file created');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildPolyfill();
}

export { buildPolyfill };