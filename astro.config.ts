import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Think of this as main.ts / app.module.ts in NestJS:
// it bootstraps the application and wires plugins into the build pipeline.
export default defineConfig({
  site: 'https://khalvai.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
