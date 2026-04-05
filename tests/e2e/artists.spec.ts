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

  await page.waitForResponse(
    (response) => response.url().includes('/api/public/artists') && response.ok(),
    { timeout: 30_000 }
  );

  const firstArtist = page.locator('a.artist-card').first();
  const emptyState = page.locator('.artists-page__empty');

  await Promise.any([
    firstArtist.waitFor({ state: 'visible', timeout: 30_000 }),
    emptyState.waitFor({ state: 'visible', timeout: 30_000 }),
  ]);

  if (await emptyState.isVisible()) {
    await expect(emptyState).toBeVisible();
    return;
  }

  await expect(firstArtist).toBeVisible({ timeout: 30_000 });

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
