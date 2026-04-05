import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, devices } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveFromRoot = (value, fallback) => path.resolve(__dirname, value || fallback);
const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : fallback;
};

const baseURL = process.env.E2E_BASE_URL || 'https://dangkhoaow.github.io/av-foundation-frontend-web/';
const outputDir = resolveFromRoot(process.env.PLAYWRIGHT_OUTPUT_DIR, 'test-results');
const snapshotDir = resolveFromRoot(process.env.VISUAL_SNAPSHOT_DIR, '.agent/skills/test-runner/visual/snapshots');
const htmlOutputFolder = resolveFromRoot(process.env.PLAYWRIGHT_HTML_OUTPUT, path.join(outputDir, 'playwright-report'));
const jsonOutputFile = resolveFromRoot(process.env.PLAYWRIGHT_JSON_OUTPUT, path.join(outputDir, 'results.json'));
const maxDiffPixelRatio = parseNumber(process.env.VISUAL_MAX_DIFF_PIXEL_RATIO, 0.02);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: 1,
  outputDir,
  snapshotDir,
  snapshotPathTemplate: '{snapshotDir}/{projectName}/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: 0.2,
      maxDiffPixelRatio,
    },
  },
  reporter: [
    ['html', { open: 'never', outputFolder: htmlOutputFolder }],
    ['json', { outputFile: jsonOutputFile }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
});
