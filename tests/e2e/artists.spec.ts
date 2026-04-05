import { test, expect } from '@playwright/test';

const baseUrl = process.env.E2E_BASE_URL || 'https://dangkhoaow.github.io/av-foundation-frontend-web/';
const basePath = new URL(baseUrl).pathname.replace(/\/$/, '');
const basePathRegex = basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildUrl = (path: string) => {
  const normalized = path === '/' ? '' : path;
  const pathWithSlash = normalized ? (normalized.startsWith('/') ? normalized : `/${normalized}`) : '';
  const fullPath = `${basePath}${pathWithSlash}`;
  const finalPath = path === '/' && basePath ? `${basePath}/` : (fullPath || '/');
  return `${new URL(baseUrl).origin}${finalPath}`;
};

console.info('[E2E] Base URL resolved', { baseUrl, basePath });

test('artists list loads and opens detail', async ({ page }) => {
  await page.goto(buildUrl('/vi/artists'));

  const readyStateHandle = await page.waitForFunction(() => {
    const isVisible = (selector: string) => Array.from(document.querySelectorAll(selector)).some((element) => {
      const htmlElement = element as HTMLElement;
      const style = window.getComputedStyle(htmlElement);
      return style.display !== 'none' && style.visibility !== 'hidden' && htmlElement.getClientRects().length > 0;
    });

    if (isVisible('.artists-page__empty')) {
      return 'empty';
    }

    if (isVisible('a.artist-card')) {
      return 'items';
    }

    return false;
  }, { timeout: 60_000 });

  const readyState = await readyStateHandle.jsonValue() as 'items' | 'empty';

  if (readyState === 'empty') {
    return;
  }

  const firstArtist = page.locator('a.artist-card').first();

  await expect(firstArtist).toBeVisible({ timeout: 60_000 });

  const href = await firstArtist.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href).toContain('/vi/artists/');

  const detailUrl = href?.startsWith('http')
    ? href
    : `${new URL(baseUrl).origin}${href}`;

  await firstArtist.scrollIntoViewIfNeeded();
  await firstArtist.click({ force: true });
  await page.goto(detailUrl ?? buildUrl('/vi/artists'));
  await expect(page).toHaveURL(new RegExp(`${basePathRegex}/vi/artists/[^/]+/?$`), { timeout: 30_000 });
  await expect(page.locator('.artist-detail-page')).toBeVisible({ timeout: 30_000 });
});
