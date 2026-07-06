// helpers/approvePendaftaran.js
// ============================================================
// Helper APPROVE (Terima) Pendaftaran Pengguna Baru
// untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   const { approvePendaftaran } = require('../helpers/approvePendaftaran');
//   await loginAdmin(page);
//   await approvePendaftaran(page);
//
// Prasyarat:
//   - Sudah login sebagai Admin (loginAdmin) sebelum memanggil helper ini.
//   - Minimal ada 1 data dengan status "Verifikasi Pendaftaran".
//
// Alur (mengikuti UI src/app/backend/notifikasi):
//   1. Buka halaman Pemberitahuan (sidelist)
//   2. Klik menu "Pengguna Baru"
//   3. Filter status = "Verifikasi Pendaftaran" -> klik "Cari"
//   4. Klik "Detail Data" pada baris pertama
//   5. Klik "Terima Pendaftaran"
//   6. Verifikasi alert sukses muncul
// ============================================================

'use strict';

const { expect } = require('@playwright/test');

// ----------------------------------------------------------
// Konstanta URL dan Selector
// (data-testid diambil dari template pengguna-baru & sidelist)
// ----------------------------------------------------------
const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  SIDELIST: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/backoffice/pemberitahuan/sidelist`,
};

const SELECTOR = {
  MENU_PENGGUNA_BARU: '[data-testid="sidelist-button-pengguna-baru"]',
  SELECT_STATUS: 'ng-select:has(.ng-placeholder:has-text("Status"))',
  OPTION: '[role="option"]',
  BTN_CARI: '[data-testid="penggunabaru-button-cari"]',
  // Tombol detail per-baris memakai id dinamis: penggunabaru-button-detail-<id>
  BTN_DETAIL_ANY: '[data-testid^="penggunabaru-button-detail-"]',
  BTN_TERIMA: '[data-testid="penggunabaru-button-terima-pendaftaran"]',
};

// ----------------------------------------------------------
// Fungsi Utama: approvePendaftaran
// ----------------------------------------------------------
/**
 * Menyetujui (Terima) pendaftaran pengguna baru pada baris pertama
 * yang berstatus "Verifikasi Pendaftaran".
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 */
async function approvePendaftaran(page) {
  console.log('[approvePendaftaran] Membuka halaman Pemberitahuan...');
  await page.goto(URL.SIDELIST);
  await page.waitForLoadState('networkidle');

  // LANGKAH 1: Klik menu "Pengguna Baru"
  const menu = page.locator(SELECTOR.MENU_PENGGUNA_BARU).first();
  await menu.waitFor({ state: 'visible' });
  await menu.click();
  console.log('[approvePendaftaran] Mengklik menu "Pengguna Baru"...');

  // LANGKAH 2: Filter status = "Verifikasi Pendaftaran"
  const selectStatus = page.locator(SELECTOR.SELECT_STATUS).first();
  await selectStatus.waitFor({ state: 'visible' });
  await selectStatus.click();
  const optVerif = page.locator(SELECTOR.OPTION, { hasText: 'Verifikasi Pendaftaran' }).first();
  await optVerif.waitFor({ state: 'visible' });
  await optVerif.click();
  console.log('[approvePendaftaran] Memilih status "Verifikasi Pendaftaran"...');

  // LANGKAH 3: Klik "Cari"
  const btnCari = page.locator(SELECTOR.BTN_CARI).first();
  await btnCari.click();
  console.log('[approvePendaftaran] Mengklik tombol "Cari"...');

  // LANGKAH 4: Klik "Detail Data" baris pertama
  const btnDetail = page.locator(SELECTOR.BTN_DETAIL_ANY).first();
  await btnDetail.waitFor({ state: 'visible', timeout: 15_000 });
  await btnDetail.click();
  console.log('[approvePendaftaran] Mengklik "Detail Data" baris pertama...');

  // LANGKAH 5: Klik "Terima Pendaftaran"
  const btnTerima = page.locator(SELECTOR.BTN_TERIMA).first();
  await btnTerima.waitFor({ state: 'visible' });
  await btnTerima.click();
  console.log('[approvePendaftaran] Mengklik "Terima Pendaftaran"...');

  // LANGKAH 6: Verifikasi alert sukses (SweetAlert)
  await expect(page.locator('.swal2-popup').first()).toBeVisible({ timeout: 15_000 });
  console.log('[approvePendaftaran] ✅ Pendaftaran berhasil disetujui.');
}

module.exports = { approvePendaftaran };
