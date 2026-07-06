// tests/admin/notif/deposit/approve.spec.js
// ============================================================
// Test: Verifikasi Setoran Dana E-Wallet -> SETUJUI (Approve)
// ============================================================
// Jalankan:
//   npx playwright test tests/admin/notif/deposit/approve.spec.js
// ============================================================

'use strict';

const { test } = require('@playwright/test');
const { loginAdmin } = require('../../../../helpers/loginAdmin');
const { approveDeposit } = require('../../../../helpers/approveDeposit');

test.describe('Verifikasi Deposit - Setujui', () => {

  test('admin menyetujui setoran dana e-wallet @admin', async ({ page }) => {
    await loginAdmin(page);
    await approveDeposit(page);
  });
});
