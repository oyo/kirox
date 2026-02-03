import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/kirox/',
  plugins: [tsconfigPaths()],
  server: {
    host: true,
    port: 3000,
  },
})
