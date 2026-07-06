// tests/admin/notif/pendaftaran/reject.spec.js
// ============================================================
// Test: Verifikasi Pendaftaran -> TOLAK (Reject)
// ============================================================
// Jalankan:
//   npx playwright test tests/admin/notif/pendaftaran/reject.spec.js
// ============================================================

'use strict';

const { test } = require('@playwright/test');
const { loginAdmin } = require('../../../../helpers/loginAdmin');
const { rejectPendaftaran } = require('../../../../helpers/rejectPendaftaran');

test.describe('Verifikasi Pendaftaran - Tolak', () => {

  test('admin menolak pendaftaran pengguna baru @admin', async ({ page }) => {
    await loginAdmin(page);
    await rejectPendaftaran(page);
  });
});
