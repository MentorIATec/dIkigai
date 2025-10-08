import { test, expect, type Page } from '@playwright/test';

async function getPath(page: Page): Promise<string> {
  return (await page.evaluate(() => window.location.pathname)) as string;
}

async function clearSession(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });
}

test('private routes redirect unauthenticated users to login', async ({ page }) => {
  await clearSession(page);
  await page.goto('/dashboard');
  const path = await getPath(page);
  expect(path).toBe('/login');
});

test('student session cannot access admin dashboard', async ({ page }) => {
  await clearSession(page);
  await page.goto('/login');
  await page.evaluate(async () => {
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'student@example.com', role: 'student' }),
    });
  });
  await page.goto('/dashboard');
  let path = await getPath(page);
  expect(path).toBe('/dashboard');
  const hasAdminLink = (await page.evaluate(() => !!document.querySelector('a[href="/admin/dashboard"]'))) as boolean;
  expect(hasAdminLink).toBe(false);
  await page.goto('/admin/dashboard');
  path = await getPath(page);
  expect(path).toBe('/');
});

test('admin session can access admin dashboard', async ({ page }) => {
  await clearSession(page);
  await page.goto('/login');
  await page.evaluate(async () => {
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', role: 'admin' }),
    });
  });
  await page.goto('/admin/dashboard');
  const path = await getPath(page);
  expect(path).toBe('/admin/dashboard');
  const hasAdminLink = (await page.evaluate(() => !!document.querySelector('a[href="/admin/dashboard"]'))) as boolean;
  expect(hasAdminLink).toBe(true);
});
