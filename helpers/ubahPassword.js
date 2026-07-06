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
  BTN_DROPDOWN_EDIT_PASSWORD: '[id="dropdown-item-ubah-kata-sandi"]',
  INPUT_NEW_PASSWORD: '[data-testid="password-input-password"]',
  INPUT_PASSWORD_CONFIRM: '[data-testid="password-input-repeat_password"]',
  BTN_SAVE: '[data-testid="password-button-btn-password-1"]',
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
 * const { ubahPassword } = require('../helpers/ubahPassword');
 * test('contoh test setelah login', async ({ page }) => {
 *   await ubahPassword(page);
 *   // Lanjutkan test Anda di sini...
 * });
 */
async function ubahPassword(page) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  const btnNavAkun = page.locator(SELECTOR.BTN_NAV_AKUN).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnNavAkun.waitFor({ state: 'visible' });
  await btnNavAkun.click();
  console.log('[ubahPassword] Mengklik tombol footbar akun"...');

  const btnDropdownProfile = page.locator(SELECTOR.BTN_DROPDOWN_PRIVASI).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnDropdownProfile.waitFor({ state: 'visible' });
  await btnDropdownProfile.click();
  console.log('[ubahPassword] Mengklik tombol buka dropdown privasi...');

  const btnDropdownEditPassword = page.locator(SELECTOR.BTN_DROPDOWN_EDIT_PASSWORD).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnDropdownEditPassword.waitFor({ state: 'visible' });
  await btnDropdownEditPassword.click();
  console.log('[ubahPassword] Mengklik tombol edit password "Ubah Password"...');

  const inputNewPassword = page.locator(SELECTOR.INPUT_NEW_PASSWORD).first();
  await inputNewPassword.waitFor({ state: 'visible' });
  await inputNewPassword.fill("Venturo1407*");
  console.log('[ubahPassword] Mengisi password baru...');

  const inputPasswordConfirm = page.locator(SELECTOR.INPUT_PASSWORD_CONFIRM).first();
  // Pastikan tombol terlihat sebelum diklik
  await inputPasswordConfirm.waitFor({ state: 'visible' });
  await inputPasswordConfirm.fill("Venturo1407*");
  console.log('[ubahPassword] Mengisi password konfirmasi...');

  const btnSubmit = page.locator(SELECTOR.BTN_SAVE).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnSubmit.waitFor({ state: 'visible' });
  await btnSubmit.click();
  console.log('[ubahPassword] Mengklik tombol submit "Ubah Email"...');
}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { ubahPassword };