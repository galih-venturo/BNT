// helpers/rejectWithdraw.js
// ============================================================
// Helper REJECT (Tolak) Verifikasi Permintaan Penarikan Dana
// untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   const { rejectWithdraw } = require('../helpers/rejectWithdraw');
//   await loginAdmin(page);
//   await rejectWithdraw(page);
//
// Prasyarat:
//   - Sudah login sebagai Admin (loginAdmin) sebelum memanggil helper ini.
//   - Minimal ada 1 penarikan berstatus "Pending".
//
// Alur (mengikuti UI notifikasi/withdrawal/daftar-penarikan-dana):
//   1. Buka halaman Pemberitahuan (sidelist)
//   2. Klik menu "Verifikasi Dana"
//   3. Klik tombol "Tolak" pada baris pertama (status Pending)
//   4. Modal tolak terbuka -> isi alasan penolakan
//   5. Klik "Simpan"
//   6. Verifikasi alert sukses muncul
// ============================================================

'use strict';

const { expect } = require('@playwright/test');

const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  SIDELIST: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/backoffice/pemberitahuan/sidelist`,
};

const SELECTOR = {
  MENU_VERIFIKASI_DANA: '[data-testid="sidelist-button-verifikasi-dana"]',
  // Tombol tolak per-baris: daftarpenarikandana-button-tolak-<id>
  BTN_TOLAK_ANY: '[data-testid^="daftarpenarikandana-button-tolak-"]',
  TEXTAREA_NOTE: '[data-testid="daftarpenarikandana-textarea-reject-note"]',
  BTN_MODAL_SIMPAN: '[data-testid="daftarpenarikandana-button-reject-simpan"]',
};

/**
 * Menolak penarikan dana pada baris pertama berstatus Pending.
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 */
async function rejectWithdraw(page) {
  console.log('[rejectWithdraw] Membuka halaman Pemberitahuan...');
  await page.goto(URL.SIDELIST);
  await page.waitForLoadState('networkidle');

  // LANGKAH 1: Klik menu "Verifikasi Dana"
  const menu = page.locator(SELECTOR.MENU_VERIFIKASI_DANA).first();
  await menu.waitFor({ state: 'visible' });
  await menu.click();
  console.log('[rejectWithdraw] Mengklik menu "Verifikasi Dana"...');

  // LANGKAH 2: Klik "Tolak" baris pertama (status default Pending)
  const btnTolak = page.locator(SELECTOR.BTN_TOLAK_ANY).first();
  await btnTolak.waitFor({ state: 'visible', timeout: 15_000 });
  await btnTolak.click();
  console.log('[rejectWithdraw] Mengklik "Tolak" baris pertama...');

  // LANGKAH 3: Isi alasan penolakan
  const textareaNote = page.locator(SELECTOR.TEXTAREA_NOTE).first();
  await textareaNote.waitFor({ state: 'visible' });
  await textareaNote.fill('Data rekening tidak valid, penarikan ditolak.');
  console.log('[rejectWithdraw] Mengisi alasan penolakan...');

  // LANGKAH 4: Klik "Simpan"
  const btnSimpan = page.locator(SELECTOR.BTN_MODAL_SIMPAN).first();
  await btnSimpan.waitFor({ state: 'visible' });
  await btnSimpan.click();
  console.log('[rejectWithdraw] Mengklik "Simpan"...');

  // LANGKAH 5: Verifikasi alert sukses
  await expect(page.locator('.swal2-popup').first()).toBeVisible({ timeout: 15_000 });
  console.log('[rejectWithdraw] ✅ Penarikan dana berhasil ditolak.');
}

module.exports = { rejectWithdraw };
