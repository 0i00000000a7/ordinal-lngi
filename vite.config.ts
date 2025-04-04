import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	base: process.env.NODE_ENV === 'production' ? '/ordinal-lngi/' : '/', // 例如仓库名是 my-app
  build: {
    outDir: 'dist' // 默认构建目录，确保与 GitHub Pages 设置一致
  }
});