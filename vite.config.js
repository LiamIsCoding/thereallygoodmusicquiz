import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // only used by `npm run dev`: sends cloud quiz requests to the live Netlify site,
  // so quizzes load locally too (the Netlify function doesn't run on your own computer)
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'https://thereallygoodmusicquiz.netlify.app',
        changeOrigin: true,
      },
    },
  },
})
