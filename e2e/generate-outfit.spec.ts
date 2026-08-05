import { expect, test } from '@playwright/test';

const weatherResponse = {
  current: {
    temperature_2m: 72,
    apparent_temperature: 72,
    relative_humidity_2m: 58,
    wind_speed_10m: 6,
    weather_code: 1,
    time: '2026-08-04T10:00',
  },
  hourly: {
    time: ['2026-08-04T10:00', '2026-08-04T14:00', '2026-08-04T18:00'],
    temperature_2m: [72, 77, 68],
    precipitation_probability: [5, 10, 15],
    weather_code: [1, 1, 2],
  },
};

test('generates and regenerates an outfit from Atlanta weather', async ({ page }) => {
  let weatherRequestCount = 0;
  await page.route('**/api.open-meteo.com/**', async (route) => {
    weatherRequestCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 150));
    await route.fulfill({ json: weatherResponse });
  });

  await page.goto('/');

  await expect(page.getByRole('button')).toHaveCount(1);
  await expect(page.getByLabel('Weather change note')).toHaveCount(0);
  const dressButton = page.getByRole('button', { name: 'Dress Me' });
  await expect(dressButton).toBeDisabled();
  await expect(page.getByText('72°')).toBeVisible();
  await expect(page.getByText(/Atlanta, GA/)).toBeVisible();
  await expect(page.getByText('Precipitation')).toBeVisible();
  await expect(page.getByText('5%')).toBeVisible();
  await expect(page.getByText('Humidity')).toBeVisible();
  await expect(page.getByText('58%')).toBeVisible();
  await expect(page.getByText('Wind')).toBeVisible();
  await expect(page.getByText('6 mph')).toBeVisible();
  await expect(dressButton).toBeEnabled();
  expect(weatherRequestCount).toBe(1);

  await expect(dressButton).toHaveCSS('background-color', 'rgb(194, 24, 122)');
  await dressButton.click();
  await expect(dressButton).toBeDisabled();
  await expect(dressButton.getByRole('progressbar')).toBeVisible();

  const resultsModal = page.getByRole('dialog', { name: 'Dress for the day ahead.' });
  await expect(resultsModal).toBeVisible();
  await expect(resultsModal).toHaveAttribute('aria-modal', 'true');
  await expect(page.getByRole('button', { name: 'Close results' })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  expect(await resultsModal.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Tab');
  expect(await resultsModal.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await expect(page.getByRole('heading', { name: 'Dress for the day ahead.' })).toBeVisible();
  await expect(page.getByLabel('Weather change note')).toBeVisible();
  expect(weatherRequestCount).toBe(1);

  const recommendation = page.getByRole('heading', {
    name: /Atlanta in-between|Light-layer rhythm/,
  });
  await expect(recommendation).toBeVisible();
  const firstTitle = await recommendation.textContent();
  const generatedOutfit = page.getByLabel('Generated outfit recommendation');
  await expect(generatedOutfit.locator('img')).toHaveCount(0);
  await expect(generatedOutfit.getByText(/Black-owned/).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /^Shop for/ }).first()).toHaveAttribute('target', '_blank');
  expect(await resultsModal.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);

  await resultsModal.evaluate((element) => { element.scrollTop = 200; });
  const scrollPosition = await resultsModal.evaluate((element) => element.scrollTop);
  await page.getByRole('button', { name: 'Regenerate' }).dispatchEvent('click');
  await expect.poll(async () => recommendation.textContent()).not.toBe(firstTitle);
  const regeneratedScrollPosition = await resultsModal.evaluate((element) => element.scrollTop);
  expect(Math.abs(regeneratedScrollPosition - scrollPosition)).toBeLessThanOrEqual(8);

  await page.keyboard.press('Escape');
  await expect(resultsModal).toBeHidden();
  await expect(dressButton).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});