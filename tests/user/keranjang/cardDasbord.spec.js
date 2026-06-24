// tests/user.cart-from-dashboard.spec.js
// ============================================================
// Test: Add Product to Cart from Dashboard
// Role: user
// Scope: Verifies that a logged-in user can add a product to
//        the shopping cart directly from the Dashboard page
//        using the "+" (add) button on each product card.
// ============================================================

'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../../helpers/loginUser');


test.describe('Add to Cart from Dashboard @user', () => {

  // ── Setup ──────────────────────────────────────────────────
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    // At this point, page is at /dashboard and fully authenticated
  });

  // ── Test Cases ─────────────────────────────────────────────
  test('Keranjang untuk produk top 1', async ({ page }) => {
    const productCard = '[id=btn-top-produk-0]';

    await page.locator(productCard).first().click();
    await expect(page.getByText('Product added to cart')).toBeVisible();
  })

  test('Keranjang untuk produk top 2', async ({ page }) => {
    const productCard = '[id=btn-top-produk-1]';

    await page.locator(productCard).first().click();
    await expect(page.getByText('Product added to cart')).toBeVisible();
  })

    test('Keranjang untuk produk top 3', async ({ page }) => {
    const productCard = '[id=btn-top-produk-2]';

    await page.locator(productCard).first().click();
    await expect(page.getByText('Product added to cart')).toBeVisible();
  })

    test('Keranjang untuk produk top 4', async ({ page }) => {
    const productCard = '[id=btn-top-produk-3]';

    await page.locator(productCard).first().click();
    await expect(page.getByText('Product added to cart')).toBeVisible();
  })


});