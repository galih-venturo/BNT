'use strict';

import { pilihMaps } from './pilihMaps';

// ----------------------------------------------------------
// Konstanta URL dan Selector
// Dipisahkan agar mudah diperbarui jika UI berubah
// ----------------------------------------------------------
const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  DASHBOARD: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/dashboard`,
};

const SELECTOR = {
  BTN_NAV_AKUN: '[id="btn-nav-akun"]',
  BTN_DROPDOWN_PROFIL: '[id="dropdown-header-profil"]',
  BTN_DROPDOWN_DAFTAR_ALAMAT: '[id="dropdown-item-daftar-alamat"]',
  BTN_PLUS: '[data-testid="index-alamat-button-btn-index-alamat-2"]',
  BTN_ALAMAT_PENGIRIMAN: '[data-testid="index-alamat-button-btn-index-alamat-10"]',
  BTN_ACC_GANTI_ALAMAT: '[data-testid="index-alamat-button-btn-index-alamat-12"]',
  BTN_PILIH_JENIS_ALAMAT: '[data-testid="tambah-alamat-btn-jenis-rumah"]',
  BTN_SIMPAN: '[data-testid="tambah-alamat-button-btn-tambah-alamat-1"]',
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
 * const { editAlamatPengiriman } = require('../helpers/editAlamatPengiriman');
 * test('contoh test setelah login', async ({ page }) => {
 *   await editAlamatPengiriman(page);
 *   // Lanjutkan test Anda di sini...
 * });
 */
async function editAlamatPengiriman(page) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  const btnNavAkun = page.locator(SELECTOR.BTN_NAV_AKUN).first();
  await btnNavAkun.waitFor({ state: 'visible' });
  await btnNavAkun.click();
  console.log('[editAlamatPengiriman] Mengklik tombol redirect halaman akun "Akun"...');

  const btnDropdownProfile = page.locator(SELECTOR.BTN_DROPDOWN_PROFIL).first();
  await btnDropdownProfile.waitFor({ state: 'visible' });
  await btnDropdownProfile.click();
  console.log('[editAlamatPengiriman] Mengklik tombol dropdown profile "Profile"...');

  const btnDaftarAlamat = page.locator(SELECTOR.BTN_DROPDOWN_DAFTAR_ALAMAT).first();
  await btnDaftarAlamat.waitFor({ state: 'visible' });
  await btnDaftarAlamat.click();
  console.log('[editAlamatPengiriman] Mengklik tombol redirect halaman Daftar Alamat "Daftar Alamat"...');

  const btnPlus = page.locator(SELECTOR.BTN_PLUS).first();
  await btnPlus.waitFor({ state: 'visible' });
  await btnPlus.click();
  console.log('[editAlamatPengiriman] Mengklik tombol ubah alamat "Ubah Alamat"...');

  const btnAlamatPengiriman = page.locator(SELECTOR.BTN_ALAMAT_PENGIRIMAN).first();
  await btnAlamatPengiriman.waitFor({ state: 'visible' });
  await btnAlamatPengiriman.click();
  console.log('[editAlamatPengiriman] Mengklik tombol alamat pengiriman "Alamat Pengiriman"...');

  const btnAccGantiAlamat = page.locator(SELECTOR.BTN_ACC_GANTI_ALAMAT);
  await btnAccGantiAlamat.waitFor({ state: 'visible' });
  await btnAccGantiAlamat.click();
  console.log('[editAlamatPengiriman] Mengklik tombol lanjutkan "Lanjutkan"...');

  const btnJenisAlamat = page.locator(SELECTOR.BTN_PILIH_JENIS_ALAMAT);
  await btnJenisAlamat.waitFor({ state: 'visible' });
  await btnJenisAlamat.click();
  console.log('[editAlamatPengiriman] Mengklik tombol jenis alamat "Rumah"...');

  console.log('[editAlamatPengiriman] Tidak ada akun bank, membuat akun baru...');
  await pilihMaps(page, "Jl. Puter Tengah no.1");

  // Tunggu redirect kembali ke halaman withdraw utama
  await page.waitForTimeout(5000);
  await page.waitForLoadState('networkidle');

  const btnSimpan = page.locator(SELECTOR.BTN_SIMPAN).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnSimpan.waitFor({ state: 'visible' });
  await btnSimpan.click();
  console.log('[editAlamatPengiriman] Melakukan klik tombol simpan "Simpan"...');

  await page.waitForTimeout(5000);

}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { editAlamatPengiriman };