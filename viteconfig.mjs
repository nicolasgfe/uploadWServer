import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite/config'

export default defineConfig({
	plugins: [tsconfigPaths()]
})