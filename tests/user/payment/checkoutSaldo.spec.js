'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../../helpers/loginUser');

test.describe('Checkout From Catalog All Payment', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  })
  
  test('checkout From Catalog with saldo', async ({ page }) => {
    const buttonKatalog = '#mobile-top-nav > div > div:nth-child(2)';
    await page.locator(buttonKatalog).click();

    const iconKeranjang = '[data-icon="akar-icons:cart"]';
    await page.locator(iconKeranjang).click();

    const checkAll = '[data-testid="keranjang-belanja-input-order_---i---"]';
    await page.locator(checkAll).click();

    const buttonCheckout = '[data-testid="keranjang-belanja-button-btn-keranjang-belanja-5"]';
    await page.locator(buttonCheckout).click();

    const buttonPayment = '#btn-checkout-1';
    await page.locator(buttonPayment).click();

    //pilih metode
    const checkboxEwallet = page.locator('[data-testid="pilih-pembayaran-input-e-wallet"]').first();
    await checkboxEwallet.waitFor({ state: 'visible' });
    await checkboxEwallet.click({ force: true });

    const buttonBayar = '[data-testid="pilih-pembayaran-button-btn-pilih-pembayaran-1"]';
    await page.locator(buttonBayar).click();

    const buttonKponfirmasi = '[class="swal2-confirm swal2-styled"]';
    await page.locator(buttonKponfirmasi).click();
    await expect(page.getByText('Pembayaran Berhasil !')).toBeVisible();

    const buttonPesanan = '[data-testid="pembayaran-berhasil-button-btn-pembayaran-berhasil-1"] ';
    await page.locator(buttonPesanan).click();
  })

});