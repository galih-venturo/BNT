'use strict';

// ----------------------------------------------------------
// Konstanta URL dan Selector
// Dipisahkan agar mudah diperbarui jika UI berubah
// ----------------------------------------------------------
const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  DASHBOARD: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/dashboard`,
};



const SELECTOR = {
  /** Tombol "Cari Maps" di halaman riwayat maps */
  BTN_CARI_MAPS: '[data-testid="tambah-alamat-btn-cari-maps"]',

  /** Input cari maps pada form maps */
  INPUT_CARI_ALAMAT: '[data-testid="peta-regis-input-search"]',

  /** Dropdown item maps pada form maps */
  DROPDOWN_ITEM_ALAMAT: '[class="pac-container pac-logo"]',

  /** Input detail alamat pada form maps */
  INPT_DETAIL_ALAMAT: '[data-testid="tambah-alamat-textarea-alamat"]',

  /** Tombol submit pada form maps */
  BTN_SUBMIT: '[data-testid="tambah-alamat-button-btn-tambah-alamat-2"]',
};

// ----------------------------------------------------------
// Validasi Environment Variables saat modul dimuat
// Gagal cepat (fail-fast) jika config belum diisi
// ----------------------------------------------------------
function validateEnvVars() {
  const missing = [];
  if (!process.env.USER_EMAIL) missing.push('USER_EMAIL');
  if (!process.env.USER_PASSWORD) missing.push('USER_PASSWORD');

  if (missing.length > 0) {
    throw new Error(
      `[loginUser] Environment variable tidak ditemukan: ${missing.join(', ')}.\n` +
      `Pastikan file .env sudah dibuat dan diisi dengan benar.\n` +
      `Contoh:\n  USER_EMAIL=user@example.com\n  USER_PASSWORD=yourPassword`
    );
  }
}

// ----------------------------------------------------------
// Fungsi Utama: loginUser
// ----------------------------------------------------------
/**
 * Melakukan proses login sebagai User pada aplikasi BNT Global.
 *
 * Alur:
 * 1. Navigasi ke BASE URL
 * 2. Klik tombol "Masuk" di halaman utama
 * 3. Isi email dari USER_EMAIL (env)
 * 4. Isi password dari USER_PASSWORD (env)
 * 5. Klik tombol submit "Masuk"
 * 6. Verifikasi URL berpindah ke /dashboard
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 * @throws {Error} Jika env var tidak ada, atau login gagal / URL tidak sesuai
 *
 * @example
 * // Di dalam test:
 * const { loginUser } = require('../helpers/loginUser');
 * test('contoh test setelah login', async ({ page }) => {
 *   await loginUser(page);
 *   // Lanjutkan test Anda di sini...
 * });
 */

async function pilihMaps(page, fullAddress, selectorBtnMaps, selectorInputDetailMaps, selectorBtnSubmitMaps, skipInputDetail = false) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  // Pastikan tombol terlihat sebelum diklik
  let btnMaps = selectorBtnMaps ? selectorBtnMaps : SELECTOR.BTN_CARI_MAPS;
  const btnCariMaps = page.locator(btnMaps).first();
  await btnCariMaps.waitFor({ state: 'visible' });
  await btnCariMaps.click();
  console.log('[pilihMaps] Mengklik tombol cari maps');

  await page.waitForTimeout(1000);
  // Pastikan tombol terlihat sebelum diklik
  const inputCariAlamat = page.locator(SELECTOR.INPUT_CARI_ALAMAT).first();
  await inputCariAlamat.waitFor({ state: 'visible' });
  await inputCariAlamat.click();
  await inputCariAlamat.pressSequentially(fullAddress)
  console.log('[pilihMaps] Memasukkan Alamat');

  await page.waitForTimeout(1000);
  // Pastikan tombol terlihat sebelum diklik
  const dropdownItemAlamat = page.locator(SELECTOR.DROPDOWN_ITEM_ALAMAT).first();
  await dropdownItemAlamat.waitFor({ state: 'visible' });
  await dropdownItemAlamat.click();
  console.log('[pilihMaps] Memilih Alamat');

  await page.waitForTimeout(3000);
  // Pastikan tombol terlihat sebelum diklik
  if (!skipInputDetail) {
    let selectorDetailAlamat = selectorInputDetailMaps ? selectorInputDetailMaps : SELECTOR.INPT_DETAIL_ALAMAT;
    const inputDetailAlamat = page.locator(selectorDetailAlamat).first();
    await inputDetailAlamat.waitFor({ state: 'visible' });
    await inputDetailAlamat.click();
    await inputDetailAlamat.pressSequentially(fullAddress)
    console.log('[pilihMaps] Memasukkan Detail Alamat');
  }


  await page.waitForTimeout(3000);
  let selectorBtnSubmit = selectorBtnSubmitMaps ? selectorBtnSubmitMaps : SELECTOR.BTN_SUBMIT;
  const btnSubmit = page.locator(selectorBtnSubmit).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnSubmit.waitFor({ state: 'visible' });
  await btnSubmit.click();
  console.log('[pilihMaps] Mengklik tombol submit');
}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { pilihMaps };