'use strict';

// ----------------------------------------------------------
// Konstanta URL dan Selector
// Dipisahkan agar mudah diperbarui jika UI berubah
// ----------------------------------------------------------
const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  DASHBOARD: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/dashboard`,
};

import { withdrawAddBankUser } from './withdrawAddBankUser';

const SELECTOR = {
  /** Tombol "Withdraw" di halaman dashboard */
  BTN_REDIRECT_WITHDRAW: '[data-testid="dashboard-button-btn-dashboard-4"]',

  /** Tombol "Tambah Withdraw" di halaman riwayat withdraw */
  BTN_TAMBAH_WITHDRAW: '[data-testid="riwayat-withdraw-button-withdraw"]',

  /** Select Akun Bank di halaman riwayat withdraw */
  SLCT_AKUN_BANK: '[id="select-bank-trigger-placeholder-new"]',

  /** Input Search Akun Bank di halaman riwayat withdraw */
  SEARCH_AKUN_BANK: '[id="select-bank-input-search"]',

  /** Item Bank di halaman riwayat withdraw */
  ITEM_BANK: '[data-testid="select-bank-list-item"]',

  /** Input nominal withdraw pada form withdraw */
  INPUT_NOMINAL: '[data-testid="withdraw-input-jumlah_penarikan"]',

  /** Input OTP pada form withdraw */
  INPUT_OTP: '[data-testid="withdraw-input-13"]',

  /** Tombol "Lanjutkan" pada form withdraw */
  BTN_LANJUTKAN: '[data-testid="withdraw-button-btn-withdraw-3"]',

  /** Tombol "Konfirmasi" pada form withdraw */
  BTN_KONFIRMASI: '[data-testid="withdraw-button-btn-withdraw-12"]',
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
async function withdrawUser(page) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  const btnRedirectWithdraw = page.locator(SELECTOR.BTN_REDIRECT_WITHDRAW).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnRedirectWithdraw.waitFor({ state: 'visible' });
  await btnRedirectWithdraw.click();
  console.log('[withdrawUser] Mengklik tombol redirect withdraw "Withdraw"...');

  const btnTambahWithdraw = page.locator(SELECTOR.BTN_TAMBAH_WITHDRAW).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnTambahWithdraw.waitFor({ state: 'visible' });
  await btnTambahWithdraw.click();
  console.log('[withdrawUser] Mengklik tombol tambah withdraw "Tambah Withdraw"...');

  const randomDigits = Math.floor(Math.random() * 7) + 10; // 10–16 digit
  let bankName = 'BCA';
  let accountName = 'Galih Satrio Wibisono';
  let accountNumber = Array.from({ length: randomDigits }, () => Math.floor(Math.random() * 10)).join('');

  // Cek apakah sudah ada akun bank terdaftar
  // Jika placeholder visible → list kosong → buat akun baru dulu
  const triggerPlaceholder = page.locator('[id="select-bank-trigger-placeholder-new"]').first();
  const hasNoAccount = await triggerPlaceholder.isVisible().catch(() => false);

  if (hasNoAccount) {
    console.log('[withdrawUser] Tidak ada akun bank, membuat akun baru...');
    await withdrawAddBankUser(page, bankName, accountName, accountNumber);

    // Tunggu redirect kembali ke halaman withdraw utama
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
  } else {
    console.log('[withdrawUser] Akun bank sudah ada, langsung pilih...');
  }

  const slctAkunBank = page.locator(SELECTOR.SLCT_AKUN_BANK).first();
  // Pastikan tombol terlihat sebelum diklik
  await slctAkunBank.waitFor({ state: 'visible' });
  await slctAkunBank.click();
  console.log('[withdrawUser] Membuka popup pilih bank');

  const searchAkunBank = page.locator(SELECTOR.SEARCH_AKUN_BANK).first();
  // Pastikan tombol terlihat sebelum diklik
  await searchAkunBank.waitFor({ state: 'visible' });
  await searchAkunBank.click();
  await searchAkunBank.pressSequentially(bankName)
  console.log('[withdrawUser] Mencari Bank');

  await page.waitForTimeout(3000);
  // Pastikan tombol terlihat sebelum diklik
  const itemBank = page.locator(SELECTOR.ITEM_BANK).first();
  await itemBank.waitFor({ state: 'visible' });
  await itemBank.click();
  console.log('[withdrawUser] Memilih Bank');

  const inputNominal = page.locator(SELECTOR.INPUT_NOMINAL).first();
  // Pastikan tombol terlihat sebelum diklik
  await inputNominal.waitFor({ state: 'visible' });
  await inputNominal.click();
  await inputNominal.pressSequentially('100000')
  console.log('[withdrawUser] Memasukkan Nominal');

  const btnLanjutkan = page.locator(SELECTOR.BTN_LANJUTKAN).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnLanjutkan.waitFor({ state: 'visible' });
  await btnLanjutkan.click();
  console.log('[withdrawUser] Mengklik tombol lanjutkan');

  // Pause test — isi OTP manual di browser, lalu klik Resume di Playwright Inspector
  console.log('[withdrawUser] Silakan isi OTP di browser, lalu klik Resume di Playwright Inspector...');
  await page.pause();
  console.log('[withdrawUser] Melanjutkan setelah OTP diisi...');

  const btnKonfirmasi = page.locator(SELECTOR.BTN_KONFIRMASI).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnKonfirmasi.waitFor({ state: 'visible' });
  await btnKonfirmasi.click();
  console.log('[withdrawUser] Mengklik tombol konfirmasi');

  await page.waitForTimeout(5000);
}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { withdrawUser };