// helpers/approveDeposit.js
// ============================================================
// Helper APPROVE (Setujui) Verifikasi Setoran Dana E-Wallet
// untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   const { approveDeposit } = require('../helpers/approveDeposit');
//   await loginAdmin(page);
//   await approveDeposit(page);
//
// Prasyarat:
//   - Sudah login sebagai Admin (loginAdmin) sebelum memanggil helper ini.
//   - Minimal ada 1 deposit Transfer Bank berstatus "Pending".
//
// Alur (mengikuti UI notifikasi/deposit/konfirm-transfer):
//   1. Buka halaman Pemberitahuan (sidelist)
//   2. Klik menu "Konfirmasi Transfer"
//   3. Filter status = "Menunggu" (Pending) -> klik "Cari"
//   4. Klik tombol "Setujui" pada baris pertama (transfer bank)
//   5. Modal review terbuka -> klik "Setuju"
//   6. Konfirmasi SweetAlert "Ya, Setujui!"
//   7. Verifikasi alert sukses muncul
// ============================================================

'use strict';

const { expect } = require('@playwright/test');

const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  SIDELIST: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/backoffice/pemberitahuan/sidelist`,
};

const SELECTOR = {
  MENU_KONFIRMASI_TRANSFER: '[data-testid="sidelist-button-konfirmasi-transfer"]',
  SELECT_STATUS: 'ng-select[name="paramstatus"]',
  OPTION: '[role="option"]',
  BTN_CARI: '[data-testid="konfirmtransfer-button-cari"]',
  // Tombol setujui transfer bank per-baris: konfirmtransfer-button-setujui-<id>
  BTN_SETUJUI_ANY: '[data-testid^="konfirmtransfer-button-setujui-"]:not([data-testid*="xendit"])',
  BTN_MODAL_SIMPAN: '[data-testid="konfirmtransfer-button-modalubah-simpan"]',
  SWAL_CONFIRM: '.swal2-confirm',
};

/**
 * Menyetujui deposit (transfer bank) pada baris pertama berstatus Pending.
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 */
async function approveDeposit(page) {
  console.log('[approveDeposit] Membuka halaman Pemberitahuan...');
  await page.goto(URL.SIDELIST);
  await page.waitForLoadState('networkidle');

  // LANGKAH 1: Klik menu "Konfirmasi Transfer"
  const menu = page.locator(SELECTOR.MENU_KONFIRMASI_TRANSFER).first();
  await menu.waitFor({ state: 'visible' });
  await menu.click();
  console.log('[approveDeposit] Mengklik menu "Konfirmasi Transfer"...');

  // LANGKAH 2: Filter status = "Menunggu" (Pending)
  const selectStatus = page.locator(SELECTOR.SELECT_STATUS).first();
  await selectStatus.waitFor({ state: 'visible' });
  await selectStatus.click();
  const optPending = page.locator(SELECTOR.OPTION, { hasText: 'Menunggu' }).first();
  await optPending.waitFor({ state: 'visible' });
  await optPending.click();
  console.log('[approveDeposit] Memilih status "Menunggu"...');

  // LANGKAH 3: Klik "Cari"
  const btnCari = page.locator(SELECTOR.BTN_CARI).first();
  await btnCari.click();
  console.log('[approveDeposit] Mengklik tombol "Cari"...');

  // LANGKAH 4: Klik "Setujui" baris pertama (transfer bank)
  const btnSetujui = page.locator(SELECTOR.BTN_SETUJUI_ANY).first();
  await btnSetujui.waitFor({ state: 'visible', timeout: 15_000 });
  await btnSetujui.click();
  console.log('[approveDeposit] Mengklik "Setujui" baris pertama...');

  // LANGKAH 5: Modal review -> klik "Setuju"
  const btnSimpan = page.locator(SELECTOR.BTN_MODAL_SIMPAN).first();
  await btnSimpan.waitFor({ state: 'visible' });
  await btnSimpan.click();
  console.log('[approveDeposit] Mengklik "Setuju" pada modal review...');

  // LANGKAH 6: Konfirmasi SweetAlert "Ya, Setujui!"
  const swalConfirm = page.locator(SELECTOR.SWAL_CONFIRM).first();
  await swalConfirm.waitFor({ state: 'visible', timeout: 15_000 });
  await swalConfirm.click();
  console.log('[approveDeposit] Mengkonfirmasi "Ya, Setujui!"...');

  // LANGKAH 7: Verifikasi alert sukses
  await expect(page.locator('.swal2-popup').first()).toBeVisible({ timeout: 15_000 });
  console.log('[approveDeposit] ✅ Deposit berhasil disetujui.');
}

module.exports = { approveDeposit };
