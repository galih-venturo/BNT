// tests/admin/notif/aktivasi-akun/reject.spec.js
// ============================================================
// Test: Verifikasi Aktivasi Akun -> TOLAK (Reject)
// ============================================================
// Jalankan:
//   npx playwright test tests/admin/notif/aktivasi-akun/reject.spec.js
// ============================================================

'use strict';

const { test } = require('@playwright/test');
const { loginAdmin } = require('../../../../helpers/loginAdmin');
const { rejectAktivasiAkun } = require('../../../../helpers/rejectAktivasiAkun');

test.describe('Verifikasi Aktivasi Akun - Tolak', () => {

  test('admin menolak aktivasi akun pengguna @admin', async ({ page }) => {
    await loginAdmin(page);
    await rejectAktivasiAkun(page);
  });
});
