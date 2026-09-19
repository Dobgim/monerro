import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // original.css is the site's untouched WordPress/plugin CSS, which still contains
    // legacy IE hacks (e.g. `*height:0`). Browsers skip them; let the minifier skip them too.
    lightningcss: { errorRecovery: true },
  },
  server: { port: 5190 },
})
