'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../helpers/loginUser');
const { depositUser } = require('../helpers/depositUser');

// ----------------------------------------------------------
// GROUP: Alur Login
// ----------------------------------------------------------
test.describe('Verifikasi Alur Deposit', () => {

   // --------------------------------------------------------
   // TEST: Login User
   // --------------------------------------------------------
   test('login sebagai User harus redirect ke /dashboard @user', async ({ page }) => {
      await loginUser(page);

      // Verifikasi URL tepat setelah login
      await expect(page).toHaveURL('https://test.bnt-global.com/dashboard');

      await page.waitForTimeout(2000); // Tunggu 2 detik untuk memastikan halaman sudah stabil

      await depositUser(page);

   });

});