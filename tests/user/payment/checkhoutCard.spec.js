'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../../helpers/loginUser');

test.describe('Checkout From Catalog All Payment', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  })
  
  test('checkout From Catalog with debit card', async ({ page }) => {
    const buttonKatalog = '#mobile-top-nav > div > div:nth-child(2)'; await page.locator(buttonKatalog).click();

    const iconKeranjang = '[data-icon="akar-icons:cart"]';
    await page.locator(iconKeranjang).click();

    const checkAll = '[data-testid="keranjang-belanja-input-order_---i---"]';
    await page.locator(checkAll).click();

    const buttonCheckout = '[data-testid="keranjang-belanja-button-btn-keranjang-belanja-5"]';
    await page.locator(buttonCheckout).click();

    const buttonPayment = '#btn-checkout-1';
    await page.locator(buttonPayment).click();

    //pilih metode pembayaran
    // Klik metode pembayaran Transfer Bank
    await page.locator('.radio-button.mr-2').click();

    // Tunggu modal daftar bank muncul
    await page.locator('.modal-body.pt-3').waitFor({ state: 'visible' });

    // Ambil semua pilihan bank
    const bankList = page.locator('.modal-body.pt-3 .w-100.d-flex.align-items-center');

    // Pilih bank pertama
    await bankList.nth(0).click();

    const buttonBayar = '[data-testid="pilih-pembayaran-button-btn-pilih-pembayaran-1"]';
    await page.locator(buttonBayar).click();

    const buttonKponfirmasi = '[class="swal2-confirm swal2-styled"]';
    await page.locator(buttonKponfirmasi).click();

    const buttonNomorRek = '#btn-pilih-pembayaran-6';
    await page.locator(buttonNomorRek).click();

    const uploadBukti = '[data-testid="pilih-pembayaran-button-btn-pilih-pembayaran-8"]';

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator(uploadBukti).click(),
    ]);

    await fileChooser.setFiles('./tests/assets/bukti_tf.jpeg');

    const buttonKirim = '[data-testid="pilih-pembayaran-button-btn-pilih-pembayaran-9"]'
    await page.locator(buttonKirim).click();
    await expect(page.getByText('Success')).toBeVisible();
  })

});     
