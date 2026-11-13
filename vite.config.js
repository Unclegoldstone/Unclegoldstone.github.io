import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({ plugins: [vue()], base: './', build: { rollupOptions: { input: { main: fileURLToPath(new URL('./index.html', import.meta.url)), blog: fileURLToPath(new URL('./blog.html', import.meta.url)) } } } })
