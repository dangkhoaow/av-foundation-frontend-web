import { test, expect } from '@playwright/test';

test('collection list loads and opens modal', async ({ page }) => {
  await page.goto('/vi/collection');

  const firstCard = page.locator('.artwork-card-grid').first();
  await expect(firstCard).toBeVisible({ timeout: 30_000 });

  await firstCard.click();
  await expect(page.locator('.artwork-modal')).toBeVisible({ timeout: 30_000 });
});
