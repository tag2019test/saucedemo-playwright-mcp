import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { getTestEnvironment } from '../utils/env';

test.describe('Inventory and cart', () => {
  test.beforeEach(async ({ page }) => {
    const env = getTestEnvironment();
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(env.username, env.password);
    await inventoryPage.waitForUrlContains('/inventory.html');
  });

  test('should list products on inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const products = await inventoryPage.getProducts();

    expect(products.length).toBeGreaterThan(0);
  });

  test('should add selected item to cart and display it in the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const products = await inventoryPage.getProducts();
    const firstProduct = products[0];

    await inventoryPage.addItemToCart(firstProduct);
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText(firstProduct)).toBeVisible();
  });
});

