// tests/admin/notif/pendaftaran/approve.spec.js
// ============================================================
// Test: Verifikasi Pendaftaran -> TERIMA (Approve)
// ============================================================
// Jalankan:
//   npx playwright test tests/admin/notif/pendaftaran/approve.spec.js
// ============================================================

'use strict';

const { test } = require('@playwright/test');
const { loginAdmin } = require('../../../../helpers/loginAdmin');
const { approvePendaftaran } = require('../../../../helpers/approvePendaftaran');

test.describe('Verifikasi Pendaftaran - Terima', () => {

  test('admin menyetujui pendaftaran pengguna baru @admin', async ({ page }) => {
    await loginAdmin(page);
    await approvePendaftaran(page);
  });
});
