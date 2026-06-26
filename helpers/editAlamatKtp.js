// helpers/loginUser.js
// ============================================================
// Helper Login USER untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginUser } = require('../helpers/loginUser');
//   await loginUser(page);
//
// Prasyarat:
//   - File .env harus berisi USER_EMAIL dan USER_PASSWORD
//   - dotenv sudah dimuat di playwright.config.js
// ============================================================

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
  BTN_NAV_AKUN: '[id="btn-nav-akun"]',
  BTN_DROPDOWN_PROFIL: '[id="dropdown-header-profil"]',
  BTN_DROPDOWN_DAFTAR_ALAMAT: '[id="dropdown-item-daftar-alamat"]',
  BTN_PLUS: '[data-testid="index-alamat-button-btn-index-alamat-2"]',
  BTN_ALAMAT_KTP: '[data-testid="index-alamat-button-btn-index-alamat-9"]',
  SLCT_PROVINSI: '[data-testid="alamat-ktp-select-provinsi"]',
  SLCT_KOTA: '[data-testid="alamat-ktp-select-kota"]',
  SLCT_KECAMATAN: '[data-testid="alamat-ktp-select-kecamatan"]',
  SLCT_KELURAHAN: '[data-testid="alamat-ktp-select-kelurahan"]',
  INPT_ALAMAT: '[data-testid="alamat-ktp-input-detail-alamat"]',
  SEARCH_WILAYAH: '[data-testid="search-wilayah"]',
  ITEM_WILAYAH_PROVINSI: '[id="select-mobile-list-item-JAWA BARAT"]',
  ITEM_WILAYAH_KOTA: '[id="select-mobile-list-item-BANDUNG"]',
  ITEM_WILAYAH_KECAMATAN: '[id="select-mobile-list-item-ARJASARI"]',
  ITEM_WILAYAH_KELURAHAN: '[id="select-mobile-list-item-ANCOLMEKAR"]',
  BTN_SIMPAN: '[data-testid="alamat-ktp-button-btn-alamat-ktp-1"]',
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
 * const { editAlamatKtp } = require('../helpers/editAlamatKtp');
 * test('contoh test setelah login', async ({ page }) => {
 *   await editAlamatKtp(page);
 *   // Lanjutkan test Anda di sini...
 * });
 */
async function editAlamatKtp(page) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  const btnNavAkun = page.locator(SELECTOR.BTN_NAV_AKUN).first();
  await btnNavAkun.waitFor({ state: 'visible' });
  await btnNavAkun.click();
  console.log('[editAlamatKtp] Mengklik tombol redirect halaman akun "Akun"...');

  const btnDropdownProfile = page.locator(SELECTOR.BTN_DROPDOWN_PROFIL).first();
  await btnDropdownProfile.waitFor({ state: 'visible' });
  await btnDropdownProfile.click();
  console.log('[editAlamatKtp] Mengklik tombol dropdown profile "Profile"...');

  const btnDaftarAlamat = page.locator(SELECTOR.BTN_DROPDOWN_DAFTAR_ALAMAT).first();
  await btnDaftarAlamat.waitFor({ state: 'visible' });
  await btnDaftarAlamat.click();
  console.log('[editAlamatKtp] Mengklik tombol redirect halaman Daftar Alamat "Daftar Alamat"...');

  const btnPlus = page.locator(SELECTOR.BTN_PLUS).first();
  await btnPlus.waitFor({ state: 'visible' });
  await btnPlus.click();
  console.log('[editAlamatKtp] Mengklik tombol ubah alamat "Ubah Alamat"...');

  const btnAlamatKtp = page.locator(SELECTOR.BTN_ALAMAT_KTP).first();
  await btnAlamatKtp.waitFor({ state: 'visible' });
  await btnAlamatKtp.click();
  console.log('[editAlamatKtp] Mengklik tombol alamat ktp "Alamat KTP"...');

  const slctProvinsi = page.locator(SELECTOR.SLCT_PROVINSI).first();
  await slctProvinsi.waitFor({ state: 'visible' });
  await slctProvinsi.click();
  console.log('[editAlamatKtp] Mengklik select provinsi "Provinsi"...');

  const searchWilayah = page.locator(SELECTOR.SEARCH_WILAYAH).first();
  await searchWilayah.waitFor({ state: 'visible' });
  await searchWilayah.click();
  await searchWilayah.pressSequentially("Jawa Barat");
  console.log('[editAlamatKtp] Mengisi search wilayah "Jawa Barat"...');

  const itemWilayahProvinsi = page.locator(SELECTOR.ITEM_WILAYAH_PROVINSI).first();
  await itemWilayahProvinsi.waitFor({ state: 'visible' });
  await itemWilayahProvinsi.click();
  console.log('[editAlamatKtp] Mengklik item wilayah provinsi "Jawa Barat"...');

  const slctKota = page.locator(SELECTOR.SLCT_KOTA).first();
  await slctKota.waitFor({ state: 'visible' });
  await slctKota.click();
  console.log('[editAlamatKtp] Mengklik tombol kota "Kota"...');

  const searchWilayahKota = page.locator(SELECTOR.SEARCH_WILAYAH).first();
  await searchWilayahKota.waitFor({ state: 'visible' });
  await searchWilayahKota.click();
  await searchWilayahKota.pressSequentially("Bandung");
  console.log('[editAlamatKtp] Mengisi search wilayah "Bandung"...');

  const itemWilayahKota = page.locator(SELECTOR.ITEM_WILAYAH_KOTA).first();
  await itemWilayahKota.waitFor({ state: 'visible' });
  await itemWilayahKota.click();
  console.log('[editAlamatKtp] Mengklik item wilayah kota "Kota"...');

  const slctKecamatan = page.locator(SELECTOR.SLCT_KECAMATAN).first();
  await slctKecamatan.waitFor({ state: 'visible' });
  await slctKecamatan.click();
  console.log('[editAlamatKtp] Mengklik tombol kecamatan "Kecamatan"...');

  const searchWilayahKecamatan = page.locator(SELECTOR.SEARCH_WILAYAH).first();
  await searchWilayahKecamatan.waitFor({ state: 'visible' });
  await searchWilayahKecamatan.click();
  await searchWilayahKecamatan.pressSequentially("Arjasari");
  console.log('[editAlamatKtp] Mengisi search wilayah "Arjasari"...');

  const itemWilayahKecamatan = page.locator(SELECTOR.ITEM_WILAYAH_KECAMATAN).first();
  await itemWilayahKecamatan.waitFor({ state: 'visible' });
  await itemWilayahKecamatan.click();
  console.log('[editAlamatKtp] Mengklik item wilayah kecamatan "Kecamatan"...');

  const slctKelurahan = page.locator(SELECTOR.SLCT_KELURAHAN).first();
  await slctKelurahan.waitFor({ state: 'visible' });
  await slctKelurahan.click();
  console.log('[editAlamatKtp] Mengklik tombol kelurahan "Kelurahan"...');

  const searchWilayahKelurahan = page.locator(SELECTOR.SEARCH_WILAYAH).first();
  await searchWilayahKelurahan.waitFor({ state: 'visible' });
  await searchWilayahKelurahan.click();
  await searchWilayahKelurahan.pressSequentially("Ancolmekar");
  console.log('[editAlamatKtp] Mengisi search wilayah "Ancolmekar"...');

  const itemWilayahKelurahan = page.locator(SELECTOR.ITEM_WILAYAH_KELURAHAN).first();
  await itemWilayahKelurahan.waitFor({ state: 'visible' });
  await itemWilayahKelurahan.click();
  console.log('[editAlamatKtp] Mengklik item wilayah kecamatan "Kecamatan"...');


  const inputAlamat = page.locator(SELECTOR.INPT_ALAMAT).first();
  await inputAlamat.waitFor({ state: 'visible' });
  await inputAlamat.fill("Jl. Contoh Alamat No.1 RT 01 RW 02");
  console.log('[editAlamatKtp] Mengisi alamat "Jl. Contoh Alamat No.1 RT 01 RW 02"...');

  await page.waitForTimeout(5000);

  const btnSimpan = page.locator(SELECTOR.BTN_SIMPAN).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnSimpan.waitFor({ state: 'visible' });
  await btnSimpan.click();
  console.log('[editAlamatKtp] Melakukan klik tombol simpan "Simpan"...');

  await page.waitForTimeout(5000);

}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { editAlamatKtp };