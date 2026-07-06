// helpers/approveAktivasiAkun.js
// ============================================================
// Helper APPROVE (Terima) Aktivasi Akun Pengguna
// untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   const { approveAktivasiAkun } = require('../helpers/approveAktivasiAkun');
//   await loginAdmin(page);
//   await approveAktivasiAkun(page);
//
// Prasyarat:
//   - Sudah login sebagai Admin (loginAdmin) sebelum memanggil helper ini.
//   - Minimal ada 1 data aktivasi akun berstatus "pending".
//
// Alur (mengikuti UI src/app/backend/notifikasi/aktivasi-akun):
//   1. Buka halaman Pemberitahuan (sidelist)
//   2. Klik menu "Aktivasi Akun"
//   3. Klik "Cari" (filter status default = pending)
//   4. Klik tombol "Terima" (centang) pada baris pertama
//   5. Konfirmasi SweetAlert -> klik "Ya, setujui"
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
  // Tombol terima per-baris memakai id dinamis: aktivasiakun-button-terima-<id>
  BTN_TERIMA_ANY: '[data-testid^="aktivasiakun-button-terima-"]',
  // Tombol konfirmasi pada SweetAlert
  SWAL_CONFIRM: '.swal2-confirm',
  SWAL_POPUP: '.swal2-popup',
};

// ----------------------------------------------------------
// Fungsi Utama: approveAktivasiAkun
// ----------------------------------------------------------
/**
 * Menyetujui (Terima) aktivasi akun pada baris pertama yang berstatus "pending".
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 */
async function approveAktivasiAkun(page) {
  console.log('[approveAktivasiAkun] Membuka halaman Pemberitahuan...');
  await page.goto(URL.SIDELIST);
  await page.waitForLoadState('networkidle');

  // LANGKAH 1: Klik menu "Aktivasi Akun"
  const menu = page.locator(SELECTOR.MENU_AKTIVASI_AKUN).first();
  await menu.waitFor({ state: 'visible' });
  await menu.click();
  console.log('[approveAktivasiAkun] Mengklik menu "Aktivasi Akun"...');

  // LANGKAH 2: Klik "Cari" (status default sudah "pending")
  const btnCari = page.locator(SELECTOR.BTN_CARI).first();
  await btnCari.waitFor({ state: 'visible' });
  await btnCari.click();
  console.log('[approveAktivasiAkun] Mengklik tombol "Cari"...');

  // LANGKAH 3: Klik "Terima" baris pertama
  const btnTerima = page.locator(SELECTOR.BTN_TERIMA_ANY).first();
  await btnTerima.waitFor({ state: 'visible', timeout: 15_000 });
  await btnTerima.click();
  console.log('[approveAktivasiAkun] Mengklik "Terima" baris pertama...');

  // LANGKAH 4: Konfirmasi SweetAlert -> "Ya, setujui"
  const swalConfirm = page.locator(SELECTOR.SWAL_CONFIRM).first();
  await swalConfirm.waitFor({ state: 'visible', timeout: 15_000 });
  await swalConfirm.click();
  console.log('[approveAktivasiAkun] Mengonfirmasi persetujuan...');

  // LANGKAH 5: Verifikasi alert sukses (SweetAlert baru)
  await expect(page.locator(SELECTOR.SWAL_POPUP).first()).toBeVisible({ timeout: 15_000 });
  console.log('[approveAktivasiAkun] ✅ Aktivasi akun berhasil disetujui.');
}

module.exports = { approveAktivasiAkun };
