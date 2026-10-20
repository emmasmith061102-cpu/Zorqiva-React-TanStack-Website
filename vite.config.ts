import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    ...(command === 'build' ? [nitro({ preset: 'vercel' })] : []),
    react(),
  ],
  resolve: { tsconfigPaths: true },
  server: { port: 3000, host: true },
}))
