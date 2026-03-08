import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { getTestEnvironment } from '../utils/env';

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should login with valid credentials and navigate to inventory page', async ({ page }) => {
    const env = getTestEnvironment();
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(env.username, env.password);
    await inventoryPage.waitForUrlContains('/inventory.html');

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText(/products/i)).toBeVisible();
  });
});

