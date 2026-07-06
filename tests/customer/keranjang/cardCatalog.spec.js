'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../../helpers/loginUser');


test.describe('Cart From Catalog', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('Semua produk yang dapat ditambahkan', async ({ page }) => {
    const buttonKatalog = '#mobile-top-nav > div > div:nth-child(2)';
    await page.locator(buttonKatalog).click();

    const productCard1 = '[id=btn-katalog-produk-11]';
    await page.locator(productCard1).first().click();
    await expect(page.getByText('Product added to cart')).toBeVisible();
  })

  test('Produk dari Hygiene 001', async ({ page }) => {
    const buttonKatalog = '#mobile-top-nav > div > div:nth-child(2)';
    await page.locator(buttonKatalog).click();

    const iconKeranjang = '[data-icon=akar-icons:cart]';
    await page.locator(iconKeranjang).click();
    // await expect(page.locator('[data-test=card]'));
    // await page.locator('[data-test=card]').first().click();

    // await page.locator('').click();


  })


  
});