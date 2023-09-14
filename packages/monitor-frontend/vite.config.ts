import solid from 'solid-start/vite'
import { defineConfig } from 'vite'
import vercel from 'solid-start-vercel'

const config = process.env.VERCEL
  ? { adapter: vercel(), ssr: false }
  : { ssr: false }

export default defineConfig({
  plugins: [solid(config)],
})
