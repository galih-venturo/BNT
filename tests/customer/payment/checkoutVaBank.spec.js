'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../../helpers/loginUser');
const { prepareCart } = require('../../../helpers/prepareCart');

test.describe('Checkout From Catalog All Payment', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  })

  test('checkout From Catalog with VA bank', async ({ page }) => {
    await prepareCart(page);

    async function pilihVirtualAccount(page, bankName) {
      await page.getByText('Virtual Account').click();
      await page.locator('div[role="button"]')
        .filter({ hasText: `${bankName} Virtual Account` })
        .click();
    }

    //pilih salah satu
    await pilihVirtualAccount(page, 'BCA');
    //await pilihVirtualAccount(page, 'BNI');
    //await pilihVirtualAccount(page, 'BRI');
    //await pilihVirtualAccount(page, 'BSI');
    //await pilihVirtualAccount(page, 'Mandiri');

    const buttonBayar = '[data-testid="pilih-pembayaran-button-btn-pilih-pembayaran-1"]';
    await page.locator(buttonBayar).click();

    const buttonKponfirmasi = '[class="swal2-confirm swal2-styled"]';
    await page.locator(buttonKponfirmasi).click();

    // Verifikasi halaman Virtual Account tampil dengan nomor VA + total.
    await page.waitForURL(/\/payment\/virtual-account\?orderId=\d+/, { timeout: 30_000 });
    await expect(page.getByText('Nomor Virtual Account').first()).toBeVisible();
    await expect(page.getByText('Salin Nomor VA')).toBeVisible();      // tombol salin nomor VA
    await expect(page.getByText('Total Pembayaran')).toBeVisible();    // label total
  })

});
