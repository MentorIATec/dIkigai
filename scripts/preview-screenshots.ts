import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const shouldSkip = process.env.SKIP_PREVIEWS === '1' || process.env.VERCEL === '1';

if (shouldSkip) {
  console.log('[previews] Skipping screenshots (SKIP_PREVIEWS or VERCEL set).');
  process.exit(0);
}

const BASE = process.env.PREVIEW_BASE || 'http://localhost:3000';

const routes = [
  '/goal-bank?preview=1&periodo=AD-2025',
  '/goal-bank?preview=1&periodo=AD-2026',
  '/goal-bank?preview=1&periodo=AD-2027',
  '/goal-bank?preview=1&stage=primerSemestre',
];

function installBrowsers() {
  console.log('[previews] Installing Playwright chromium browser…');
  const result = spawnSync('npx', ['playwright', 'install', 'chromium'], {
    stdio: 'inherit',
  });
  return result.status === 0;
}

async function launchChromium(playwright: typeof import('playwright')) {
  try {
    return await playwright.chromium.launch();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[previews] Failed to launch chromium:', message);
    if (!/just installed or updated/i.test(message) && !/browser\s+not\s+found/i.test(message)) {
      return null;
    }
    if (!installBrowsers()) {
      console.warn('[previews] Browser installation failed. Skipping screenshots.');
      return null;
    }
    try {
      return await playwright.chromium.launch();
    } catch (retryError) {
      console.warn(
        '[previews] Chromium still unavailable after installation:',
        retryError instanceof Error ? retryError.message : String(retryError),
      );
      return null;
    }
  }
}

async function main() {
  fs.mkdirSync('.previews', { recursive: true });

  let playwright: typeof import('playwright');
  try {
    playwright = await import('playwright');
  } catch (error) {
    console.warn('[previews] Playwright module not available. Skipping screenshots.');
    return;
  }

  const browser = await launchChromium(playwright);
  if (!browser) {
    return;
  }

  try {
    const page = (await browser.newPage()) as any;
    if (typeof page.setViewportSize === 'function') {
      await page.setViewportSize({ width: 1280, height: 900 });
    }

    for (const route of routes) {
      const url = `${BASE}${route}`;
      console.log('[previews] Visiting', url);
      await page.goto(url, { waitUntil: 'networkidle' });

      if (route.includes('periodo=AD-2025')) {
        await page.waitForSelector('form fieldset').catch(() => {});
        const fieldsets = page.locator('form fieldset');
        const count = await fieldsets.count();
        for (let index = 0; index < count; index += 1) {
          const radio = fieldsets.nth(index).locator('[role="radio"]').first();
          await radio.click({ force: true }).catch(() => {});
        }
        const generateButton = page.getByRole('button', { name: 'Generar metas sugeridas' });
        await generateButton.waitFor({ state: 'visible' }).catch(() => {});
        if (await generateButton.isEnabled()) {
          await generateButton.click().catch(() => {});
          await page.waitForSelector('text=Metas sugeridas', { timeout: 5_000 }).catch(() => {});
        }
      }

      const name = route.replace(/[^\w-]+/g, '_');
      const screenshotPath = `.previews/${name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log('[previews] Saved', screenshotPath);
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

main().catch((error) => {
  console.warn('[previews] Error running previews:', error instanceof Error ? error.message : String(error));
  process.exit(0);
});
