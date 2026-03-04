import { defineConfig } from '@sc-voice/vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.js'],
    exclude: ['node_modules/**', '.git/**'],
  },
});
