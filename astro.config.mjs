import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://components.thgaltitude.com",
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: "css-reload",
        enforce: "post",
        handleHotUpdate({ file, server }) {
          if (
            file.endsWith(".css") &&
            file.includes("standalone-components-css")
          ) {
            server.ws.send({ type: "full-reload" });
            return [];
          }
        },
      },
    ],
    server: {
      watch: {
        ignored: ["!**/standalone-components-css/**"],
      },
      hmr: {
        protocol: "ws",
        host: "localhost",
      },
    },
    css: {
      devSourcemap: true,
    },
  },
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    starlight({
      title: "Altitude Standalone Components",
      customCss: ["/src/styles.css", "@fontsource-variable/inter"],
      logo: {
        replacesTitle: true,
        light: "/src/assets/logo-long-light.svg",
        dark: "/src/assets/logo-long.svg",
        link: "https://thgaltitude.com/",
      },
      sidebar: [
        {
          label: "Getting Started",
          autogenerate: { directory: "setup" },
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
      ],
    }),
  ],
});
