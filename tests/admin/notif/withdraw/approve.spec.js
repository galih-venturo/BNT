// tests/admin/notif/withdraw/approve.spec.js
// ============================================================
// Test: Verifikasi Penarikan Dana -> SETUJUI (Approve)
// ============================================================
// Jalankan:
//   npx playwright test tests/admin/notif/withdraw/approve.spec.js
// ============================================================

'use strict';

const { test } = require('@playwright/test');
const { loginAdmin } = require('../../../../helpers/loginAdmin');
const { approveWithdraw } = require('../../../../helpers/approveWithdraw');

test.describe('Verifikasi Withdraw - Setujui', () => {

  test('admin menyetujui penarikan dana @admin', async ({ page }) => {
    await loginAdmin(page);
    await approveWithdraw(page);
  });
});
