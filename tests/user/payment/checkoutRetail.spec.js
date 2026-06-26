'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../../helpers/loginUser');

test.describe('Checkout From Catalog All Payment', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  })

  test('Checkout payment with Retail', async ({ page }) => {

        const buttonKatalog = '#mobile-top-nav > div > div:nth-child(2)';
    await page.locator(buttonKatalog).click();

    const iconKeranjang = '[data-icon="akar-icons:cart"]';
    await page.locator(iconKeranjang).click();

    const checkboxes = page.locator('[id^="chk-pilih-principle-"]');
    
    // Tunggu sampai minimal 1 checkbox muncul
    await checkboxes.first().waitFor({
      state: 'visible',
      timeout: 15000, // 10 detik
});

    const total = await checkboxes.count();

    for (let i = 0; i < total; i++) {
    if (!(await checkboxes.nth(i).isChecked())) {
        await checkboxes.nth(i).check();
    }
}


    const buttonCheckout = '[data-testid="keranjang-belanja-btn-checkout"]';
    await page.locator(buttonCheckout).click();

    const buttonPayment = '#btn-checkout-1';
    await page.locator(buttonPayment).click();

    async function pilihRetail(page, retailName) {
    // Buka menu Pembayaran Retail
    await page.getByRole('button', { name: /^Pembayaran Retail/ }).click();

    // Pilih retail
    await page.locator('div[role="button"]')
        .filter({ hasText: retailName })
        .click();
    }

    await pilihRetail(page, 'Alfamart');
    //await pilihRetail(page, 'Indomaret');

    const buttonBayar = '[data-testid="pilih-pembayaran-button-btn-pilih-pembayaran-1"]';
    await page.locator(buttonBayar).click();

    const buttonKponfirmasi = '[class="swal2-confirm swal2-styled"]';
    await page.locator(buttonKponfirmasi).click();

    const prosesPay = '[id="proceed-button"]';
    await page.locator(prosesPay).click();  

  })


});