import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import type { UserConfig } from 'vitest/config';

const config: UserConfig = {
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('./src', import.meta.url))),
    },
  },
};

export default config;


