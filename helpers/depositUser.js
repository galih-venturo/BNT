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
  /** Tombol "Masuk" di halaman utama (navbar/hero) */
  BTN_REDIRECT_DEPOSIT: '[data-testid="dashboard-button-btn-dashboard-3"]',

  /** Input nominal deposit pada form deposit */
  INPUT_NOMINAL: '[data-testid="component-deposit-input-nominal"]',

  /** Input nominal deposit pada form deposit */
  BTN_SUBMIT_DEPOSIT : '[data-testid="component-deposit-button-btn-component-deposit-1"]',

  /** Input nominal deposit pada form deposit */
  BTN_TRANSFER_BANK : '[data-testid="component-deposit-button-btn-component-deposit-4"]',

  /** Input nominal deposit pada form deposit */
  BTN_SUMIT_TRANSFER : '[data-testid="component-deposit-button-btn-component-deposit-6"]',

  /** Input nominal deposit pada form deposit */
  BTN_UNGGAH_BUKTI_TF : '[data-testid="component-deposit-button-btn-component-deposit-9"]',
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
async function depositUser(page) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  const btnRedirectDeposit = page.locator(SELECTOR.BTN_REDIRECT_DEPOSIT).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnRedirectDeposit.waitFor({ state: 'visible' });
  await btnRedirectDeposit.click();

  console.log('[depositUser] Mengklik tombol redirect deposit "Deposit"...');

  const inputNominal = page.locator(SELECTOR.INPUT_NOMINAL).first();
  await inputNominal.waitFor({ state: 'visible' });
  // await inputNominal.click();
  await inputNominal.fill("100000");
  console.log('[depositUser] Mengisi nominal deposit"...');

  const btnSubmitDeposit = page.locator(SELECTOR.BTN_SUBMIT_DEPOSIT).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnSubmitDeposit.waitFor({ state: 'visible' });
  await btnSubmitDeposit.click();
  console.log('[depositUser] Klik submit deposit dan membuka modal metode pembayaran"...');

  const btnTransferBank = page.locator(SELECTOR.BTN_TRANSFER_BANK).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnTransferBank.waitFor({ state: 'visible' });
  await btnTransferBank.click();
  console.log('[depositUser] Klik metode pembayaran "Transfer Bank"...');

  const btnSubmitProsesTransfer = page.locator(SELECTOR.BTN_SUMIT_TRANSFER).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnSubmitProsesTransfer.waitFor({ state: 'visible' });
  await btnSubmitProsesTransfer.click();
  console.log('[depositUser] Melakukan klik submit proses transfer "Proses Transfer"...');

  const bntUploadBuktiTf = page.locator(SELECTOR.BTN_UNGGAH_BUKTI_TF).first();
  // Pastikan tombol terlihat sebelum diklik
  await bntUploadBuktiTf.waitFor({ state: 'visible' });
  await bntUploadBuktiTf.click();
  console.log('[depositUser] Melakukan klik tombol unggah bukti transfer "Unggah Bukti Transfer"...');
}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { depositUser };