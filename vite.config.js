import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    lib: {
      entry: './src/help-desk-element.jsx',
      name: 'HelpDeskApp',
      formats: ['es'],
      fileName: 'help-desk-app'
    },
    rollupOptions: {
      output: {
        format: 'es',
        inlineDynamicImports: true
      }
    }
  },
  server: {
    port: 3000,
    cors: true,
    host: '0.0.0.0'
  }
})
