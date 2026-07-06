// helpers/rejectAktivasiAkun.js
// ============================================================
// Helper REJECT (Tolak) Aktivasi Akun Pengguna
// untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   const { rejectAktivasiAkun } = require('../helpers/rejectAktivasiAkun');
//   await loginAdmin(page);
//   await rejectAktivasiAkun(page);
//
// Prasyarat:
//   - Sudah login sebagai Admin (loginAdmin) sebelum memanggil helper ini.
//   - Minimal ada 1 data aktivasi akun berstatus "pending".
//
// Alur (mengikuti UI src/app/backend/notifikasi/aktivasi-akun):
//   1. Buka halaman Pemberitahuan (sidelist)
//   2. Klik menu "Aktivasi Akun"
//   3. Klik "Cari" (filter status default = pending)
//   4. Klik tombol "Tolak" (silang) pada baris pertama
//   5. Konfirmasi SweetAlert -> klik "Ya, tolak"
//   6. Verifikasi alert sukses muncul
// ============================================================

'use strict';

const { expect } = require('@playwright/test');

// ----------------------------------------------------------
// Konstanta URL dan Selector
// (data-testid diambil dari template aktivasi-akun & sidelist)
// ----------------------------------------------------------
const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  SIDELIST: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/backoffice/pemberitahuan/sidelist`,
};

const SELECTOR = {
  MENU_AKTIVASI_AKUN: '[data-testid="sidelist-button-aktivasi-akun"]',
  BTN_CARI: '[data-testid="aktivasiakun-button-cari"]',
  // Tombol tolak per-baris memakai id dinamis: aktivasiakun-button-tolak-<id>
  BTN_TOLAK_ANY: '[data-testid^="aktivasiakun-button-tolak-"]',
  // Tombol konfirmasi pada SweetAlert
  SWAL_CONFIRM: '.swal2-confirm',
  SWAL_POPUP: '.swal2-popup',
};

// ----------------------------------------------------------
// Fungsi Utama: rejectAktivasiAkun
// ----------------------------------------------------------
/**
 * Menolak (Tolak) aktivasi akun pada baris pertama yang berstatus "pending".
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 */
async function rejectAktivasiAkun(page) {
  console.log('[rejectAktivasiAkun] Membuka halaman Pemberitahuan...');
  await page.goto(URL.SIDELIST);
  await page.waitForLoadState('networkidle');

  // LANGKAH 1: Klik menu "Aktivasi Akun"
  const menu = page.locator(SELECTOR.MENU_AKTIVASI_AKUN).first();
  await menu.waitFor({ state: 'visible' });
  await menu.click();
  console.log('[rejectAktivasiAkun] Mengklik menu "Aktivasi Akun"...');

  // LANGKAH 2: Klik "Cari" (status default sudah "pending")
  const btnCari = page.locator(SELECTOR.BTN_CARI).first();
  await btnCari.waitFor({ state: 'visible' });
  await btnCari.click();
  console.log('[rejectAktivasiAkun] Mengklik tombol "Cari"...');

  // LANGKAH 3: Klik "Tolak" baris pertama
  const btnTolak = page.locator(SELECTOR.BTN_TOLAK_ANY).first();
  await btnTolak.waitFor({ state: 'visible', timeout: 15_000 });
  await btnTolak.click();
  console.log('[rejectAktivasiAkun] Mengklik "Tolak" baris pertama...');

  // LANGKAH 4: Konfirmasi SweetAlert -> "Ya, tolak"
  const swalConfirm = page.locator(SELECTOR.SWAL_CONFIRM).first();
  await swalConfirm.waitFor({ state: 'visible', timeout: 15_000 });
  await swalConfirm.click();
  console.log('[rejectAktivasiAkun] Mengonfirmasi penolakan...');

  // LANGKAH 5: Verifikasi alert sukses (SweetAlert baru)
  await expect(page.locator(SELECTOR.SWAL_POPUP).first()).toBeVisible({ timeout: 15_000 });
  console.log('[rejectAktivasiAkun] ✅ Aktivasi akun berhasil ditolak.');
}

module.exports = { rejectAktivasiAkun };
