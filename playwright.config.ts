import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:9002',
    trace: 'off',
    screenshot: 'only-on-failure',
    headless: true,
    launchOptions: {
      executablePath: '/nix/store/lmmhdyflbi4s2dkkhkwkg8n52m631hqx-chromium-unwrapped-138.0.7204.49/libexec/chromium/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
