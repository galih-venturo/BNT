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
const { register } = require('../helpers/register');

// ----------------------------------------------------------
// GROUP: Alur Register
// ----------------------------------------------------------
test.describe('Verifikasi Alur Register', () => {

  // --------------------------------------------------------
  // TEST: Login User
  // --------------------------------------------------------
  test('register sebagai User', async ({ page }) => {
    await register(page);

    // Verifikasi URL tepat setelah login
    await expect(page).toHaveURL('https://test.bnt-global.com/login-v2');
  });
});