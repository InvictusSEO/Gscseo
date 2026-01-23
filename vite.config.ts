import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      // Hard-bind react to the version in node_modules
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8788',
      '/auth': 'http://localhost:8788'
    }
  }
})