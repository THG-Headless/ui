# Altitude Standalone Components CSS

Reusable pure CSS styling for components with OKLCH fallback support for maximum browser compatibility.

## Features

- **Pure CSS components** - No JavaScript dependencies
- **OKLCH color space support** - Modern color capabilities with automatic fallbacks
- **Cross-browser compatibility** - Works in all modern browsers
- **Lightweight** - Minimal bundle size impact
- **Multi-tenant ready** - CSS custom properties for theming

## Installation

```bash
npm install @thg-altitude/standalone-components-css
```

## Usage

### Basic CSS Import

```css
@import '@thg-altitude/standalone-components-css/dist/main.css';
```

### OKLCH Polyfill

The package includes an automatic OKLCH polyfill that provides color fallbacks for browsers without native OKLCH support. The polyfill:

- **Auto-detects** browser OKLCH support
- **Loads only when needed** - Zero impact on modern browsers
- **Handles complex color operations** - Relative colors, color-mix functions
- **Maintains visual parity** - >98% color accuracy vs native OKLCH

The polyfill is automatically loaded via CSS when OKLCH is not supported:

```css
/* Automatically included in main.css */
@supports not (color: oklch(0.7 0.15 250)) {
  /* Polyfill loaded automatically */
}
```

### Manual Polyfill Loading

If you need to load the polyfill manually:

```html
<script src="https://cdn.jsdelivr.net/npm/@thg-altitude/standalone-components-css@latest/dist/oklch-polyfill.min.js"></script>
```

## Browser Support

- **Modern browsers**: Native OKLCH support
- **Legacy browsers**: Automatic RGB fallbacks via polyfill
- **Performance**: <10KB total bundle (CSS + polyfill when needed)

## Color System

Uses OKLCH color space for:
- Better perceptual uniformity
- More predictable color variations
- Superior accessibility contrast ratios
- Future-proof color definitions

## Component Categories

- **Buttons** - Interactive elements
- **Forms** - Input fields, dropdowns, text areas
- **Alerts** - Status messages and notifications
- **Modals** - Dialog and overlay components
- **Navigation** - Breadcrumbs, pagination
- **Progress** - Loading and progress indicators
- **Ratings** - Star ratings and review components

## Development

See main repository for development setup and contribution guidelines.