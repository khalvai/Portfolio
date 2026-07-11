import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://khalvai.com',

  vite: {
    plugins: [tailwindcss()],
  },
});
