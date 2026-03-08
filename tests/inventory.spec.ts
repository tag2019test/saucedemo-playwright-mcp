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

  test('should sort products by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortByPriceLowToHigh();
    const prices = await inventoryPage.getProductPrices();

    // Assert prices are in non-decreasing order
    for (let i = 0; i < prices.length - 1; i += 1) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test('should logout from inventory page and return to login', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.logout();

    await expect(page).toHaveURL(/.*\/$/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should complete checkout flow successfully', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const products = await inventoryPage.getProducts();
    const firstProduct = products[0];

    await inventoryPage.addItemToCart(firstProduct);
    await inventoryPage.completeCheckout('John', 'Doe', '12345');

    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(inventoryPage.getOrderCompletionMessageLocator()).toBeVisible();
  });
});

