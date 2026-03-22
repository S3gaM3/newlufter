import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** Для GitHub Pages: 404.html = index.html (SPA fallback) и .nojekyll */
function githubPagesPlugin() {
  return {
    name: 'github-pages',
    closeBundle() {
      const outDir = join(__dirname, 'dist')
      try {
        copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'))
        writeFileSync(join(outDir, '.nojekyll'), '')
      } catch {}
    },
  }
}

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), githubPagesPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
