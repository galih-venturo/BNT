// tests/admin/notif/deposit/reject.spec.js
// ============================================================
// Test: Verifikasi Setoran Dana E-Wallet -> TOLAK (Reject)
// ============================================================
// Jalankan:
//   npx playwright test tests/admin/notif/deposit/reject.spec.js
// ============================================================

'use strict';

const { test } = require('@playwright/test');
const { loginAdmin } = require('../../../../helpers/loginAdmin');
const { rejectDeposit } = require('../../../../helpers/rejectDeposit');

test.describe('Verifikasi Deposit - Tolak', () => {

  test('admin menolak setoran dana e-wallet @admin', async ({ page }) => {
    await loginAdmin(page);
    await rejectDeposit(page);
  });
});
