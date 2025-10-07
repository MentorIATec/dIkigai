import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.PREVIEW_BASE || 'http://localhost:3000';

const routes = [
  '/goal-bank?preview=1&periodo=AD-2025',
  '/goal-bank?preview=1&periodo=AD-2026',
  '/goal-bank?preview=1&periodo=AD-2027',
  '/goal-bank?preview=1&stage=primerSemestre',
];

(async () => {
  fs.mkdirSync('.previews', { recursive: true });
  const browser = await chromium.launch();
  const page = (await browser.newPage()) as any;
  if (typeof page.setViewportSize === 'function') {
    await page.setViewportSize({ width: 1280, height: 900 });
  }

  for (const route of routes) {
    const url = `${BASE}${route}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    if (route.includes('periodo=AD-2025')) {
      await page.waitForSelector('form fieldset');
      const fieldsets = page.locator('form fieldset');
      const count = await fieldsets.count();
      for (let index = 0; index < count; index += 1) {
        const radio = fieldsets
          .nth(index)
          .locator('[role="radio"]')
          .first();
        await radio.click({ force: true });
      }
      const generateButton = page.getByRole('button', { name: 'Generar metas sugeridas' });
      await generateButton.waitFor({ state: 'visible' });
      if (await generateButton.isEnabled()) {
        await generateButton.click();
        await page.waitForSelector('text=Metas sugeridas', { timeout: 5_000 }).catch(() => {});
      }
    }

    const name = route.replace(/[^\w-]+/g, '_');
    const screenshotPath = `.previews/${name}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Saved', screenshotPath);
  }

  await browser.close();
})();
