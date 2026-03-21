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
  resolve: {
    alias: {
      // Required for WalletConnect in Vite
      'node:buffer': 'buffer',
      'node:process': 'process/browser',
      'node:stream': 'stream-browserify',
      'node:util': 'util',
    },
  },
  optimizeDeps: {
    include: [
      '@walletconnect/ethereum-provider',
      '@walletconnect/modal',
    ],
    esbuildOptions: {
      define: { global: 'globalThis' },
    },
  },
})
