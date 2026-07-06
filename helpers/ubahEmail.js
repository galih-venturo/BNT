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
  BTN_DROPDOWN_PRIVASI: '[id="dropdown-header-privasi"]',
  BTN_DROPDOWN_EDIT_EMAIL: '[id="dropdown-item-ubah-email"]',
  INPUT_NEW_EMAIL: '[data-testid="email-input-1"]',
  INPUT_PASSWORD: '[data-testid="email-input-password"]',
  BTN_SUBMIT: '[data-testid="email-button-btn-email-1"]',
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
 * const { ubahEmail } = require('../helpers/ubahEmail');
 * test('contoh test setelah login', async ({ page }) => {
 *   await ubahEmail(page);
 *   // Lanjutkan test Anda di sini...
 * });
 */
async function ubahEmail(page) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  const btnNavAkun = page.locator(SELECTOR.BTN_NAV_AKUN).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnNavAkun.waitFor({ state: 'visible' });
  await btnNavAkun.click();
  console.log('[ubahEmail] Mengklik tombol footbar akun"...');

  const btnDropdownProfile = page.locator(SELECTOR.BTN_DROPDOWN_PRIVASI).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnDropdownProfile.waitFor({ state: 'visible' });
  await btnDropdownProfile.click();
  console.log('[ubahEmail] Mengklik tombol buka dropdown privasi...');

  const btnDropdownEditEmail = page.locator(SELECTOR.BTN_DROPDOWN_EDIT_EMAIL).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnDropdownEditEmail.waitFor({ state: 'visible' });
  await btnDropdownEditEmail.click();
  console.log('[ubahEmail] Mengklik tombol edit email "Ubah Email"...');

  const inputNewEmail = page.locator(SELECTOR.INPUT_NEW_EMAIL).first();
  await inputNewEmail.waitFor({ state: 'visible' });
  await inputNewEmail.fill("sgalih1234@gmail.com");
  console.log('[ubahEmail] Mengisi email...');

  const inputPassword = page.locator(SELECTOR.INPUT_PASSWORD).first();
  // Pastikan tombol terlihat sebelum diklik
  await inputPassword.waitFor({ state: 'visible' });
  await inputPassword.fill("Venturo1407*");
  console.log('[ubahEmail] Mengisi password...');

  const btnSubmit = page.locator(SELECTOR.BTN_SUBMIT).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnSubmit.waitFor({ state: 'visible' });
  await btnSubmit.click();
  console.log('[ubahEmail] Mengklik tombol submit "Ubah Email"...');
}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { ubahEmail };