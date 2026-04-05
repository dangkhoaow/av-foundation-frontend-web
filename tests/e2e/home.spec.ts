import { test, expect } from '@playwright/test';

test('homepage loads with locale routing', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/vi\/?$/);
  await expect(page.locator('.ds-header')).toBeVisible();
  await expect(page.locator('.hero-with-content')).toBeVisible();
});

test('language toggle switches locale', async ({ page }) => {
  await page.goto('/vi');
  await page.locator('.sidebar__language').click();

  await expect(page).toHaveURL(/\/en\/?$/);
});
