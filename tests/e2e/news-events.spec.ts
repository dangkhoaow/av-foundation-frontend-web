import { test, expect } from '@playwright/test';

test('news list opens detail', async ({ page }) => {
  await page.goto('/vi/news');

  const firstNews = page.locator('.news-item-row').first();
  await expect(firstNews).toBeVisible({ timeout: 30_000 });

  await firstNews.click();
  await expect(page.locator('.news-detail-page')).toBeVisible({ timeout: 30_000 });
});

test('events list opens detail', async ({ page }) => {
  await page.goto('/vi/events');

  const firstEvent = page.locator('.event-card-link').first();
  await expect(firstEvent).toBeVisible({ timeout: 30_000 });

  await firstEvent.click();
  await expect(page.locator('.event-detail-page')).toBeVisible({ timeout: 30_000 });
});
