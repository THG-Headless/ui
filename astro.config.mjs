import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ['sharp']
      }
    }
  },
  integrations: [starlight({
    title: 'Altitude Standalone Components',
    customCss: ["/src/styles.css", "@fontsource-variable/inter"],
     logo: {
        replacesTitle: true,
        light: "/src/assets/logo-long-light.svg",
        dark: "/src/assets/logo-long.svg",
        link: "https://thgaltitude.com/",
      },
    sidebar: [
      {
        label: 'Getting Started',
        autogenerate: { directory: 'setup' }
      },
      {
        label: 'Components',
        autogenerate: { directory: 'components' }
      },
      
    ],
  })],
});