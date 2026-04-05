import { test, expect } from '@playwright/test';

const baseUrl = process.env.E2E_BASE_URL || 'https://dangkhoaow.github.io/av-foundation-frontend-web/';
const basePath = new URL(baseUrl).pathname.replace(/\/$/, '');

const buildUrl = (path: string) => {
  const normalized = path === '/' ? '' : path;
  const pathWithSlash = normalized ? (normalized.startsWith('/') ? normalized : `/${normalized}`) : '';
  const fullPath = `${basePath}${pathWithSlash}`;
  const finalPath = path === '/' && basePath ? `${basePath}/` : (fullPath || '/');
  return `${new URL(baseUrl).origin}${finalPath}`;
};

const toPathRegex = (path: string) => {
  const normalized = path === '/' ? '' : path;
  const pathWithSlash = normalized ? (normalized.startsWith('/') ? normalized : `/${normalized}`) : '';
  const fullPath = `${basePath}${pathWithSlash}` || '/';
  const escaped = fullPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}/?$`);
};

console.info('[E2E] Base URL resolved', { baseUrl, basePath });

test('homepage loads with locale routing', async ({ page }) => {
  await page.goto(buildUrl('/'));

  await expect(page).toHaveURL(toPathRegex('/vi'));
  await expect(page.locator('.ds-header')).toBeVisible();
  await expect(page.locator('.hero-with-content')).toBeVisible();
});

test('language toggle switches locale', async ({ page }) => {
  await page.goto(buildUrl('/vi'));
  await page.locator('.sidebar__language').click();

  await expect(page).toHaveURL(toPathRegex('/en'));
});
