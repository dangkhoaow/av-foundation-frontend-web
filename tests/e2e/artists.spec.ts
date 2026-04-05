import { test, expect } from '@playwright/test';

test('artists list loads and opens detail', async ({ page }) => {
  await page.goto('/vi/artists');

  const firstArtist = page.locator('.artist-card').first();
  await expect(firstArtist).toBeVisible({ timeout: 30_000 });

  await firstArtist.click();
  await expect(page.locator('.artist-detail-page')).toBeVisible({ timeout: 30_000 });
});
