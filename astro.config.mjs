import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from '@astrojs/tailwind';

export default defineConfig({
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
        label: 'Components',
        autogenerate: { directory: 'components' }
      },
    ],
  }), tailwind()],
});