// helpers/approveWithdraw.js
// ============================================================
// Helper APPROVE (Setujui) Verifikasi Permintaan Penarikan Dana
// untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   const { approveWithdraw } = require('../helpers/approveWithdraw');
//   await loginAdmin(page);
//   await approveWithdraw(page);
//
// Prasyarat:
//   - Sudah login sebagai Admin (loginAdmin) sebelum memanggil helper ini.
//   - Minimal ada 1 penarikan berstatus "Pending".
//   - File bukti: tests/assets/main_page_loaded.png
//
// Alur (mengikuti UI notifikasi/withdrawal/daftar-penarikan-dana):
//   1. Buka halaman Pemberitahuan (sidelist)
//   2. Klik menu "Verifikasi Dana"
//   3. Klik tombol "Setujui" pada baris pertama (status Pending)
//   4. Modal konfirmasi terbuka -> klik "Unggah" (pilih file bukti transfer)
//   5. Modal preview foto -> klik "Simpan"
//   6. Verifikasi alert sukses muncul
// ============================================================

'use strict';

const { expect } = require('@playwright/test');

const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  SIDELIST: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/backoffice/pemberitahuan/sidelist`,
};

const BUKTI_FILE = 'tests/assets/main_page_loaded.png';

const SELECTOR = {
  MENU_VERIFIKASI_DANA: '[data-testid="sidelist-button-verifikasi-dana"]',
  // Tombol setujui per-baris: daftarpenarikandana-button-setujui-<id>
  BTN_SETUJUI_ANY: '[data-testid^="daftarpenarikandana-button-setujui-"]',
  BTN_MODAL_UNGGAH: '[data-testid="daftarpenarikandana-button-modal-upload"]',
  BTN_MODALFOTO_SIMPAN: '[data-testid="daftarpenarikandana-button-modalfoto-simpan"]',
};

/**
 * Menyetujui penarikan dana pada baris pertama berstatus Pending.
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 */
async function approveWithdraw(page) {
  console.log('[approveWithdraw] Membuka halaman Pemberitahuan...');
  await page.goto(URL.SIDELIST);
  await page.waitForLoadState('networkidle');

  // LANGKAH 1: Klik menu "Verifikasi Dana"
  const menu = page.locator(SELECTOR.MENU_VERIFIKASI_DANA).first();
  await menu.waitFor({ state: 'visible' });
  await menu.click();
  console.log('[approveWithdraw] Mengklik menu "Verifikasi Dana"...');

  // LANGKAH 2: Klik "Setujui" baris pertama (status default Pending)
  const btnSetujui = page.locator(SELECTOR.BTN_SETUJUI_ANY).first();
  await btnSetujui.waitFor({ state: 'visible', timeout: 15_000 });
  await btnSetujui.click();
  console.log('[approveWithdraw] Mengklik "Setujui" baris pertama...');

  // LANGKAH 3: Modal konfirmasi -> klik "Unggah", pilih file bukti transfer
  // compressFile() membuka file picker native sekaligus modal preview foto.
  const fileChooserPromise = page.waitForEvent('filechooser');
  const btnUnggah = page.locator(SELECTOR.BTN_MODAL_UNGGAH).first();
  await btnUnggah.waitFor({ state: 'visible' });
  await btnUnggah.click();
  console.log('[approveWithdraw] Mengklik "Unggah" bukti transfer...');

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(BUKTI_FILE);
  console.log('[approveWithdraw] Memilih file bukti transfer...');

  // LANGKAH 4: Modal preview foto -> klik "Simpan"
  const btnSimpan = page.locator(SELECTOR.BTN_MODALFOTO_SIMPAN).first();
  await btnSimpan.waitFor({ state: 'visible' });
  await btnSimpan.click();
  console.log('[approveWithdraw] Mengklik "Simpan"...');

  // LANGKAH 5: Verifikasi alert sukses
  await expect(page.locator('.swal2-popup').first()).toBeVisible({ timeout: 15_000 });
  console.log('[approveWithdraw] ✅ Penarikan dana berhasil disetujui.');
}

module.exports = { approveWithdraw };
