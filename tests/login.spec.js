// tests/login.spec.js
// ============================================================
// Test Dedicated: Verifikasi Alur Login User & Admin
// ============================================================
// File ini khusus menguji proses login itu sendiri,
// memastikan helper berjalan dengan benar.
//
// Jalankan:
//   npx playwright test tests/login.spec.js
// ============================================================

'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser }  = require('../helpers/loginUser');
const { loginAdmin } = require('../helpers/loginAdmin');

// ----------------------------------------------------------
// GROUP: Alur Login
// ----------------------------------------------------------
test.describe('Verifikasi Alur Login', () => {

  // --------------------------------------------------------
  // TEST: Login User
  // --------------------------------------------------------
  test('login sebagai User harus redirect ke /dashboard @user', async ({ page }) => {
    await loginUser(page);

    // Verifikasi URL tepat setelah login
    await expect(page).toHaveURL('https://test.bnt-global.com/dashboard');
  });

  // --------------------------------------------------------
  // TEST: Login Admin
  // --------------------------------------------------------
  test('login sebagai Admin harus redirect ke /backoffice/home @admin', async ({ page }) => {
    await loginAdmin(page);

    // Verifikasi URL tepat setelah login
    await expect(page).toHaveURL('https://test.bnt-global.com/backoffice/home');
  });

  // --------------------------------------------------------
  // TEST: Login User kemudian logout (contoh skenario lanjutan)
  // --------------------------------------------------------
  // test('user dapat logout setelah login @user', async ({ page }) => {
  //   // Login menggunakan helper
  //   await loginUser(page);

  //   // Pastikan sudah di dashboard
  //   await expect(page).toHaveURL(/.*\/dashboard/);

  //   // Contoh klik logout - sesuaikan selector dengan UI aktual
  //   const btnLogout = page.locator('button:has-text("Keluar"), a:has-text("Keluar"), button:has-text("Logout")').first();

  //   if (await btnLogout.isVisible()) {
  //     await btnLogout.click();
  //     // Verifikasi kembali ke halaman utama / halaman login
  //     await expect(page).toHaveURL(/(login|\/|home)/);
  //   } else {
  //     console.warn('[login.spec] Tombol logout tidak ditemukan, skip verifikasi logout.');
  //     test.skip();
  //   }
  // });

});