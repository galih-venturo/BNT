'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../../helpers/loginUser');
const { prepareCart } = require('../../../helpers/prepareCart');

test.describe('Checkout From Catalog All Payment', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  })

  test('Checkout payment with ewallet', async ({ page }) => {
    await prepareCart(page);

    async function pilihEWallet(page, walletName) {
      await page.getByRole('button', { name: /^E-Wallet/ }).click();
      await page.locator(
        `#btn-pilih-pembayaran-select-ewallet-${walletName.toUpperCase()}`
      ).click();
    }

    //pilih salah satu
    await pilihEWallet(page, 'DANA');
    //await pilihEWallet(page, 'OVO');
    //await pilihEWallet(page, 'AstraPay');
    //await pilihEWallet(page, 'ShopeePay');
    //await pilihEWallet(page, 'LinkAja');

    const buttonBayar = '[data-testid="pilih-pembayaran-button-btn-pilih-pembayaran-1"]';
    await page.locator(buttonBayar).click();

    const buttonKponfirmasi = '[class="swal2-confirm swal2-styled"]';
    await page.locator(buttonKponfirmasi).click();

    const prosesPay = '[id="proceed-button"]';
    await page.locator(prosesPay).click();
  })

});
