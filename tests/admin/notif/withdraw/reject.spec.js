// tests/admin/notif/withdraw/reject.spec.js
// ============================================================
// Test: Verifikasi Penarikan Dana -> TOLAK (Reject)
// ============================================================
// Jalankan:
//   npx playwright test tests/admin/notif/withdraw/reject.spec.js
// ============================================================

'use strict';

const { test } = require('@playwright/test');
const { loginAdmin } = require('../../../../helpers/loginAdmin');
const { rejectWithdraw } = require('../../../../helpers/rejectWithdraw');

test.describe('Verifikasi Withdraw - Tolak', () => {

  test('admin menolak penarikan dana @admin', async ({ page }) => {
    await loginAdmin(page);
    await rejectWithdraw(page);
  });
});
