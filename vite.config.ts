import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['localhost', 'wsx']
  },

  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-styled-components', {}],
        babelrc: false,
        configFile: false
      }
    })
  ]
});
