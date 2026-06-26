'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../helpers/loginUser');
const { withdrawUser } = require('../../helpers/withdrawUser');

// ----------------------------------------------------------
// GROUP: Alur Withdraw
// ----------------------------------------------------------
test.describe('Verifikasi Alur Withdraw', () => {

   // --------------------------------------------------------
   // TEST: Withdraw User
   // --------------------------------------------------------
   test('Withdraw User @user', async ({ page }) => {
      test.setTimeout(300_000); // 5 menit — butuh input OTP manual
      await loginUser(page);

      // Verifikasi URL tepat setelah login
      await expect(page).toHaveURL('https://test.bnt-global.com/dashboard');

      await page.waitForTimeout(2000); // Tunggu 2 detik untuk memastikan halaman sudah stabil

      await withdrawUser(page);

   });

});