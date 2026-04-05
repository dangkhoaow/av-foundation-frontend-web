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

test('collection list loads and opens modal', async ({ page }) => {
  await page.goto(buildUrl('/vi/collection'));

  const readyStateHandle = await page.waitForFunction(() => {
    const isVisible = (selector: string) => Array.from(document.querySelectorAll(selector)).some((element) => {
      const htmlElement = element as HTMLElement;
      const style = window.getComputedStyle(htmlElement);
      return style.display !== 'none' && style.visibility !== 'hidden' && htmlElement.getClientRects().length > 0;
    });

    if (isVisible('.collection-page__empty')) {
      return 'empty';
    }

    if (isVisible('.artwork-card-grid')) {
      return 'items';
    }

    return false;
  }, { timeout: 120_000 });

  const readyState = await readyStateHandle.jsonValue() as 'items' | 'empty';

  if (readyState === 'empty') {
    return;
  }

  const firstCard = page.locator('.artwork-card-grid').first();

  await expect(firstCard).toBeVisible({ timeout: 120_000 });

  await firstCard.scrollIntoViewIfNeeded();
  await firstCard.click({ force: true });
  await expect(page.locator('.artwork-modal')).toBeVisible({ timeout: 30_000 });
});
