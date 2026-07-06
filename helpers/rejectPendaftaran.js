// helpers/rejectPendaftaran.js
// ============================================================
// Helper REJECT (Tolak) Pendaftaran Pengguna Baru
// untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   const { rejectPendaftaran } = require('../helpers/rejectPendaftaran');
//   await loginAdmin(page);
//   await rejectPendaftaran(page);
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
//   5. Klik "Tolak Pendaftaran" -> modal muncul
//   6. Pilih jenis penolakan + isi keterangan
//   7. Klik "Kirim Penolakan"
//   8. Verifikasi alert sukses muncul
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
  BTN_DETAIL_ANY: '[data-testid^="penggunabaru-button-detail-"]',
  BTN_TOLAK: '[data-testid="penggunabaru-button-tolak-pendaftaran"]',
  // Modal tolak
  SELECT_ALASAN: '.modal-body ng-select',
  INPUT_KETERANGAN: '.modal-body textarea[name="keterangan"]',
  BTN_KIRIM: '[data-testid="penggunabaru-button-kirim-penolakan"]',
};

// ----------------------------------------------------------
// Fungsi Utama: rejectPendaftaran
// ----------------------------------------------------------
/**
 * Menolak (Tolak) pendaftaran pengguna baru pada baris pertama
 * yang berstatus "Verifikasi Pendaftaran".
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 */
async function rejectPendaftaran(page) {
  console.log('[rejectPendaftaran] Membuka halaman Pemberitahuan...');
  await page.goto(URL.SIDELIST);
  await page.waitForLoadState('networkidle');

  // LANGKAH 1: Klik menu "Pengguna Baru"
  const menu = page.locator(SELECTOR.MENU_PENGGUNA_BARU).first();
  await menu.waitFor({ state: 'visible' });
  await menu.click();
  console.log('[rejectPendaftaran] Mengklik menu "Pengguna Baru"...');

  // LANGKAH 2: Filter status = "Verifikasi Pendaftaran"
  const selectStatus = page.locator(SELECTOR.SELECT_STATUS).first();
  await selectStatus.waitFor({ state: 'visible' });
  await selectStatus.click();
  const optVerif = page.locator(SELECTOR.OPTION, { hasText: 'Verifikasi Pendaftaran' }).first();
  await optVerif.waitFor({ state: 'visible' });
  await optVerif.click();
  console.log('[rejectPendaftaran] Memilih status "Verifikasi Pendaftaran"...');

  // LANGKAH 3: Klik "Cari"
  const btnCari = page.locator(SELECTOR.BTN_CARI).first();
  await btnCari.click();
  console.log('[rejectPendaftaran] Mengklik tombol "Cari"...');

  // LANGKAH 4: Klik "Detail Data" baris pertama
  const btnDetail = page.locator(SELECTOR.BTN_DETAIL_ANY).first();
  await btnDetail.waitFor({ state: 'visible', timeout: 15_000 });
  await btnDetail.click();
  console.log('[rejectPendaftaran] Mengklik "Detail Data" baris pertama...');

  // LANGKAH 5: Klik "Tolak Pendaftaran" -> buka modal
  const btnTolak = page.locator(SELECTOR.BTN_TOLAK).first();
  await btnTolak.waitFor({ state: 'visible' });
  await btnTolak.click();
  console.log('[rejectPendaftaran] Mengklik "Tolak Pendaftaran"...');

  // LANGKAH 6a: Pilih jenis penolakan
  const selectAlasan = page.locator(SELECTOR.SELECT_ALASAN).first();
  await selectAlasan.waitFor({ state: 'visible' });
  await selectAlasan.click();
  const optAlasan = page.locator(SELECTOR.OPTION, { hasText: 'Data Tidak Sesuai' }).first();
  await optAlasan.waitFor({ state: 'visible' });
  await optAlasan.click();
  console.log('[rejectPendaftaran] Memilih jenis penolakan "Data Tidak Sesuai"...');

  // LANGKAH 6b: Isi keterangan (wajib)
  const inputKeterangan = page.locator(SELECTOR.INPUT_KETERANGAN).first();
  await inputKeterangan.waitFor({ state: 'visible' });
  await inputKeterangan.fill('Data identitas tidak sesuai dengan dokumen.');
  console.log('[rejectPendaftaran] Mengisi keterangan penolakan...');

  // LANGKAH 7: Klik "Kirim Penolakan"
  const btnKirim = page.locator(SELECTOR.BTN_KIRIM).first();
  await btnKirim.waitFor({ state: 'visible' });
  await btnKirim.click();
  console.log('[rejectPendaftaran] Mengklik "Kirim Penolakan"...');

  // LANGKAH 8: Verifikasi alert sukses (SweetAlert)
  await expect(page.locator('.swal2-popup').first()).toBeVisible({ timeout: 15_000 });
  console.log('[rejectPendaftaran] ✅ Pendaftaran berhasil ditolak.');
}

module.exports = { rejectPendaftaran };
