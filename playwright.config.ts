import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  expect: {
    timeout: process.env.CI ? 10000 : 5000,
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
  reporter: process.env.CI ? 'html' : 'line',
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'yarn static-webserver',
      port: 3000,
    },
  ],
  workers: process.env.CI ? 1 : undefined,
}

export default config
