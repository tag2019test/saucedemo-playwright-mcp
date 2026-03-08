import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async getProducts(): Promise<string[]> {
    const productNameLocator = this.page.locator('.inventory_item_name');
    return productNameLocator.allInnerTexts();
  }

  async addItemToCart(productName: string): Promise<void> {
    const item = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });

    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

