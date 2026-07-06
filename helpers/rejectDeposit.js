// helpers/rejectDeposit.js
// ============================================================
// Helper REJECT (Tolak) Verifikasi Setoran Dana E-Wallet
// untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   const { rejectDeposit } = require('../helpers/rejectDeposit');
//   await loginAdmin(page);
//   await rejectDeposit(page);
//
// Prasyarat:
//   - Sudah login sebagai Admin (loginAdmin) sebelum memanggil helper ini.
//   - Minimal ada 1 deposit berstatus "Pending".
//
// Alur (mengikuti UI notifikasi/deposit/konfirm-transfer):
//   1. Buka halaman Pemberitahuan (sidelist)
//   2. Klik menu "Konfirmasi Transfer"
//   3. Filter status = "Menunggu" (Pending) -> klik "Cari"
//   4. Klik tombol "Tolak" pada baris pertama
//   5. Modal tolak terbuka -> isi alasan (min 10 karakter)
//   6. Klik "Tolak Deposit"
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
  // Tombol tolak per-baris: konfirmtransfer-button-tolak-<id>
  BTN_TOLAK_ANY: '[data-testid^="konfirmtransfer-button-tolak-"]',
  TEXTAREA_NOTE: '[data-testid="konfirmtransfer-textarea-reject-note"]',
  BTN_MODAL_SIMPAN: '[data-testid="konfirmtransfer-button-modalreject-simpan"]',
};

/**
 * Menolak deposit pada baris pertama berstatus Pending.
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 */
async function rejectDeposit(page) {
  console.log('[rejectDeposit] Membuka halaman Pemberitahuan...');
  await page.goto(URL.SIDELIST);
  await page.waitForLoadState('networkidle');

  // LANGKAH 1: Klik menu "Konfirmasi Transfer"
  const menu = page.locator(SELECTOR.MENU_KONFIRMASI_TRANSFER).first();
  await menu.waitFor({ state: 'visible' });
  await menu.click();
  console.log('[rejectDeposit] Mengklik menu "Konfirmasi Transfer"...');

  // LANGKAH 2: Filter status = "Menunggu" (Pending)
  const selectStatus = page.locator(SELECTOR.SELECT_STATUS).first();
  await selectStatus.waitFor({ state: 'visible' });
  await selectStatus.click();
  const optPending = page.locator(SELECTOR.OPTION, { hasText: 'Menunggu' }).first();
  await optPending.waitFor({ state: 'visible' });
  await optPending.click();
  console.log('[rejectDeposit] Memilih status "Menunggu"...');

  // LANGKAH 3: Klik "Cari"
  const btnCari = page.locator(SELECTOR.BTN_CARI).first();
  await btnCari.click();
  console.log('[rejectDeposit] Mengklik tombol "Cari"...');

  // LANGKAH 4: Klik "Tolak" baris pertama
  const btnTolak = page.locator(SELECTOR.BTN_TOLAK_ANY).first();
  await btnTolak.waitFor({ state: 'visible', timeout: 15_000 });
  await btnTolak.click();
  console.log('[rejectDeposit] Mengklik "Tolak" baris pertama...');

  // LANGKAH 5: Isi alasan penolakan (minimal 10 karakter)
  const textareaNote = page.locator(SELECTOR.TEXTAREA_NOTE).first();
  await textareaNote.waitFor({ state: 'visible' });
  await textareaNote.fill('Nominal bukti transfer tidak sesuai dengan pengajuan setoran.');
  console.log('[rejectDeposit] Mengisi alasan penolakan...');

  // LANGKAH 6: Klik "Tolak Deposit"
  const btnSimpan = page.locator(SELECTOR.BTN_MODAL_SIMPAN).first();
  await btnSimpan.waitFor({ state: 'visible' });
  await btnSimpan.click();
  console.log('[rejectDeposit] Mengklik "Tolak Deposit"...');

  // LANGKAH 7: Verifikasi alert sukses
  await expect(page.locator('.swal2-popup').first()).toBeVisible({ timeout: 15_000 });
  console.log('[rejectDeposit] ✅ Deposit berhasil ditolak.');
}

module.exports = { rejectDeposit };
