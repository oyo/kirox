import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/kirox/',
  plugins: [tsconfigPaths()],
  server: {
    port: 3000,
  },
})
