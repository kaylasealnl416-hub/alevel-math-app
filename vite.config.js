import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 分割 React 核心
          'react-vendor': ['react', 'react-dom'],
          // 分割 KaTeX 数学渲染库
          'katex': ['katex'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
