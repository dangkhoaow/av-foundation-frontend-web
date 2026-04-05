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

console.info('[E2E] Base URL resolved', { baseUrl, basePath });

test('news list opens detail', async ({ page }) => {
  await page.goto(buildUrl('/vi/news'));

  const firstNews = page.locator('.news-item-row').first();
  const emptyState = page.locator('.news-page__empty');

  await Promise.any([
    firstNews.waitFor({ state: 'visible', timeout: 30_000 }),
    emptyState.waitFor({ state: 'visible', timeout: 30_000 }),
  ]);

  if (await emptyState.isVisible()) {
    console.warn('[E2E] No news items available, skipping detail test.');
    await expect(emptyState).toBeVisible();
    return;
  }

  await expect(firstNews).toBeVisible({ timeout: 30_000 });

  await firstNews.click();
  await expect(page.locator('.news-detail-page')).toBeVisible({ timeout: 30_000 });
});

test('events list opens detail', async ({ page }) => {
  await page.goto(buildUrl('/vi/events'));

  const firstEvent = page.locator('.event-card-link').first();
  const emptyState = page.locator('.events-page__empty');

  await Promise.any([
    firstEvent.waitFor({ state: 'visible', timeout: 30_000 }),
    emptyState.waitFor({ state: 'visible', timeout: 30_000 }),
  ]);

  if (await emptyState.isVisible()) {
    console.warn('[E2E] No events available, skipping detail test.');
    await expect(emptyState).toBeVisible();
    return;
  }

  await expect(firstEvent).toBeVisible({ timeout: 30_000 });

  await firstEvent.click();
  await expect(page.locator('.event-detail-page')).toBeVisible({ timeout: 30_000 });
});
