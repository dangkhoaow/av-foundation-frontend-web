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

  const readyStateHandle = await page.waitForFunction(() => {
    const isVisible = (selector: string) => Array.from(document.querySelectorAll(selector)).some((element) => {
      const htmlElement = element as HTMLElement;
      const style = window.getComputedStyle(htmlElement);
      return style.display !== 'none' && style.visibility !== 'hidden' && htmlElement.getClientRects().length > 0;
    });

    if (isVisible('.news-page__empty')) {
      return 'empty';
    }

    if (isVisible('.news-item-row')) {
      return 'items';
    }

    return false;
  }, { timeout: 60_000 });

  const readyState = await readyStateHandle.jsonValue() as 'items' | 'empty';

  if (readyState === 'empty') {
    console.warn('[E2E] No news items available, skipping detail test.');
    return;
  }

  const firstNews = page.locator('.news-item-row').first();

  await expect(firstNews).toBeVisible({ timeout: 45_000 });

  await firstNews.click();
  await expect(page.locator('.news-detail-page')).toBeVisible({ timeout: 30_000 });
});

test('events list opens detail', async ({ page }) => {
  await page.goto(buildUrl('/vi/events'));

  const readyStateHandle = await page.waitForFunction(() => {
    const isVisible = (selector: string) => Array.from(document.querySelectorAll(selector)).some((element) => {
      const htmlElement = element as HTMLElement;
      const style = window.getComputedStyle(htmlElement);
      return style.display !== 'none' && style.visibility !== 'hidden' && htmlElement.getClientRects().length > 0;
    });

    if (isVisible('.events-page__empty')) {
      return 'empty';
    }

    if (isVisible('.event-card-link')) {
      return 'items';
    }

    return false;
  }, { timeout: 60_000 });

  const readyState = await readyStateHandle.jsonValue() as 'items' | 'empty';

  if (readyState === 'empty') {
    console.warn('[E2E] No events available, skipping detail test.');
    return;
  }

  const firstEvent = page.locator('.event-card-link').first();

  await expect(firstEvent).toBeVisible({ timeout: 45_000 });

  await firstEvent.click();
  await expect(page.locator('.event-detail-page')).toBeVisible({ timeout: 30_000 });
});
