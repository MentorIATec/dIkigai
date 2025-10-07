import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('goal generator preview flow renders without violations', async (
  { page }: { page: Page },
  testInfo: TestInfo,
) => {
  await page.goto('/goal-bank?preview=1&periodo=FJ-2026');

  const screenshotPath = testInfo.outputPath('goal-bank.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('goal-bank', { path: screenshotPath, contentType: 'image/png' });

  const axe = new AxeBuilder({ page });
  const results = await axe.analyze();
  expect(results.violations).toEqual([]);
});
