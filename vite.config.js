import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { contentPlugin } from './build/contentPlugin.js'

export default defineConfig({ plugins: [contentPlugin(), vue()], base: './', build: { manifest: true, rollupOptions: { input: { works: fileURLToPath(new URL('./works.html', import.meta.url)), main: fileURLToPath(new URL('./index.html', import.meta.url)), blog: fileURLToPath(new URL('./blog.html', import.meta.url)) } } } })
