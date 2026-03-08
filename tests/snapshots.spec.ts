import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { getTestEnvironment } from '../utils/env';

test.describe('Snapshot examples', () => {
  test('login page accessibility snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // Aria snapshot of the login page accessibility tree (stored as .aria.yml)
    await expect(page.locator('body')).toMatchAriaSnapshot({
      name: 'login-page.aria.yml'
    });
  });

  test('inventory page visual snapshot', async ({ page }) => {
    const env = getTestEnvironment();
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(env.username, env.password);
    await inventoryPage.waitForUrlContains('/inventory.html');

    // Visual snapshot of the inventory grid for regression comparison
    await expect(page.getByTestId('inventory-container')).toHaveScreenshot(
      'inventory-container.png'
    );
  });
});

