import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: { target: 'esnext' },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    include: ['@walletconnect/ethereum-provider', '@walletconnect/modal'],
    esbuildOptions: { define: { global: 'globalThis' } },
  },
})
