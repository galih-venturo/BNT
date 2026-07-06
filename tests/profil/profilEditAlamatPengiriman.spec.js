'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../helpers/loginUser');
const { editAlamatPengiriman } = require('../../helpers/editAlamatPengiriman');

// ----------------------------------------------------------
// GROUP: Alur Edit Alamat KTP
// ----------------------------------------------------------
test.describe('Alur Edit Alamat KTP', () => {

   // --------------------------------------------------------
   // TEST: Login User
   // --------------------------------------------------------
   test('login sebagai User harus redirect ke /dashboard @user', async ({ page }) => {
      await loginUser(page);

      // Verifikasi URL tepat setelah login
      await expect(page).toHaveURL('https://test.bnt-global.com/dashboard');

      await page.waitForTimeout(2000); // Tunggu 2 detik untuk memastikan halaman sudah stabil

      await editAlamatPengiriman(page);

   });

});