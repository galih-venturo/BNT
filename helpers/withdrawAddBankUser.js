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
  /** Tombol "Tambah Akun Bank" di halaman riwayat withdraw */
  BTN_TAMBAH_AKUN_BANK: '[id="withdraw-btn-tambah-akun-bank"]',

  /** Input pilih bank pada form withdraw */
  INPT_PILIH_BANK: '[data-testid="withdraw-select-bank-2"]',

  /** Input pilih bank pada form withdraw */
  SEARCH_BANK: '[id="select-bank-input-search"]',

  /** Input pilih bank pada form withdraw */
  // ITEM_BANK: '[data-testid="select-bank-list-item"]',
  ITEM_BANK: '[id="select-bank-item-BANK BCA"]',

  /** Input pilih bank pada form withdraw */
  INPUT_NAMA_AKUN: '[data-testid="withdraw-input-nama"]',

  /** Input pilih bank pada form withdraw */
  INPUT_NOMOR_REKENING: '[data-testid="withdraw-input-rekening"]',

  /** Input nominal withdraw pada form withdraw */
  INPUT_NOMINAL: '[data-testid="component-withdraw-input-nominal"]',

  /** Input nominal withdraw pada form withdraw */
  BTN_SIMPAN_REKENING: '[data-testid="withdraw-button-btn-withdraw-4"]',
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

async function withdrawAddBankUser(page, bankName, accountName, accountNumber) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  // Pastikan tombol terlihat sebelum diklik
  const btnTambahAkunBank = page.locator(SELECTOR.BTN_TAMBAH_AKUN_BANK).first();
  await btnTambahAkunBank.waitFor({ state: 'visible' });
  await btnTambahAkunBank.click();
  console.log('[withdrawAddBankUser] Mengklik tombol tambah withdraw "Withdraw"...');

  // Pastikan tombol terlihat sebelum diklik
  const selectBank = page.locator(SELECTOR.INPT_PILIH_BANK).first();
  await selectBank.waitFor({ state: 'visible' });
  await selectBank.click();
  console.log('[withdrawAddBankUser] Membuka popup pilih bank');

  await page.waitForTimeout(1000);
  // Pastikan tombol terlihat sebelum diklik
  const searchBank = page.locator(SELECTOR.SEARCH_BANK).first();
  await searchBank.waitFor({ state: 'visible' });
  await searchBank.click();
  await searchBank.pressSequentially(bankName)
  console.log('[withdrawAddBankUser] Mencari Bank');

  await page.waitForTimeout(1000);
  // Pastikan tombol terlihat sebelum diklik
  const itemBank = page.locator(SELECTOR.ITEM_BANK).first();
  await itemBank.waitFor({ state: 'visible' });
  await itemBank.click();
  console.log('[withdrawAddBankUser] Memilih Bank');

  // page.waitForTimeout(10000);
  // // Pastikan tombol terlihat sebelum diklik
  // const inputNamaAkun = page.locator(SELECTOR.INPUT_NAMA_AKUN).first();
  // await inputNamaAkun.waitFor({ state: 'visible' });
  // await inputNamaAkun.click();
  // await inputNamaAkun.pressSequentially(accountName)
  // console.log('[withdrawAddBankUser] Memasukkan Nama Akun');

  await page.waitForTimeout(1000);
  // Pastikan tombol terlihat sebelum diklik
  const inputNomorRekening = page.locator(SELECTOR.INPUT_NOMOR_REKENING).first();
  await inputNomorRekening.waitFor({ state: 'visible' });
  await inputNomorRekening.click();
  await inputNomorRekening.pressSequentially(accountNumber)
  console.log('[withdrawAddBankUser] Memasukkan Nomor Rekening');

  await page.waitForTimeout(3000);
  const btnSimpanRekening = page.locator(SELECTOR.BTN_SIMPAN_REKENING).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnSimpanRekening.waitFor({ state: 'visible' });
  await btnSimpanRekening.click();
  console.log('[withdrawAddBankUser] Mengklik tombol simpan rekening');
}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { withdrawAddBankUser };