# UI Component Library

Browser Compatibility Requirements

Important: This component library requires Tailwind V4 to function correctly. The components use modern CSS features that are only available through Tailwind V4's implementation, including:

* OKLCH color format
* Relative color syntax
* Color mixing functions
* Advanced CSS property definitions

## No Polyfills

We do not provide polyfills for older browsers. Components will not render correctly in environments without Tailwind V4 properly installed and configured.

Setup Requirements
To use these components in your project:

## Installation 
Make sure you have tailwind >v4 installed

```json
// package.json
"dependencies": {
  "tailwindcss": "^4.0.0" // minimum
}
```

Install browser components 
 
```sh
npm install @thg-altitude/standalone-components-css
```

Import our components after your Tailwind setup

```css
@import 'tailwindcss';
@import '@thg-altitude/standalone-components-css';
```

## Browser Support

These components are designed for modern browsers with full support for Tailwind V4 features. Users with outdated browsers may experience visual or functional issues that cannot be resolved through polyfills.

For questions about compatibility, please refer to the [Tailwind V4 documentation](https://tailwindcss.com/docs/compatibility) for current browser support information.