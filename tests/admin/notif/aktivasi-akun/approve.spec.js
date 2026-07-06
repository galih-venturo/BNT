// tests/admin/notif/aktivasi-akun/approve.spec.js
// ============================================================
// Test: Verifikasi Aktivasi Akun -> TERIMA (Approve)
// ============================================================
// Jalankan:
//   npx playwright test tests/admin/notif/aktivasi-akun/approve.spec.js
// ============================================================

'use strict';

const { test } = require('@playwright/test');
const { loginAdmin } = require('../../../../helpers/loginAdmin');
const { approveAktivasiAkun } = require('../../../../helpers/approveAktivasiAkun');

test.describe('Verifikasi Aktivasi Akun - Terima', () => {

  test('admin menyetujui aktivasi akun pengguna @admin', async ({ page }) => {
    await loginAdmin(page);
    await approveAktivasiAkun(page);
  });
});
