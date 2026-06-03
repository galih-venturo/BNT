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
  BTN_OPEN_LOGIN: 'button:has-text("Masuk"), a:has-text("Masuk")',

  /** Input email pada form login */
  INPUT_EMAIL: 'input[type="email"], input[name="email"], input[placeholder*="email" i]',

  /** Input password pada form login */
  INPUT_PASSWORD: 'input[type="password"], input[name="password"], input[placeholder*="password" i]',

  /** Tombol submit "Masuk" di dalam form login */
  BTN_SUBMIT: 'button[type="submit"]:has-text("Masuk"), button:has-text("Masuk")',
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
async function loginUser(page) {
  // Validasi env vars sebelum mulai
  validateEnvVars();

  console.log('[loginUser] Memulai proses login sebagai User...');

  // ----------------------------------------------------------
  // LANGKAH 1: Navigasi ke halaman utama
  // ----------------------------------------------------------
  console.log(`[loginUser] Membuka URL: ${URL.BASE}`);
  await page.goto(URL.BASE);

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  // ----------------------------------------------------------
  // LANGKAH 2: Klik tombol "Masuk" di halaman utama
  // ----------------------------------------------------------
  console.log('[loginUser] Mencari dan mengklik tombol "Masuk"...');

  const btnOpenLogin = page.locator(SELECTOR.BTN_OPEN_LOGIN).first();

  // Pastikan tombol terlihat sebelum diklik
  await btnOpenLogin.waitFor({ state: 'visible' });
  await btnOpenLogin.click();

  // Tunggu form login muncul (ditandai input email tersedia)
  const inputEmail = page.locator(SELECTOR.INPUT_EMAIL).first();
  await inputEmail.waitFor({ state: 'visible' });

  // ----------------------------------------------------------
  // LANGKAH 3: Isi field Email
  // ----------------------------------------------------------
  console.log('[loginUser] Mengisi field email...');
  await inputEmail.click();
  await inputEmail.fill(process.env.USER_EMAIL);

  // ----------------------------------------------------------
  // LANGKAH 4: Isi field Password
  // ----------------------------------------------------------
  console.log('[loginUser] Mengisi field password...');
  const inputPassword = page.locator(SELECTOR.INPUT_PASSWORD).first();
  await inputPassword.waitFor({ state: 'visible' });
  await inputPassword.click();
  await inputPassword.fill(process.env.USER_PASSWORD);

  // ----------------------------------------------------------
  // LANGKAH 5: Klik tombol Submit "Masuk"
  // ----------------------------------------------------------
  console.log('[loginUser] Mengklik tombol submit "Masuk"...');

  // Tunggu navigasi selesai setelah submit (lebih stabil dari waitForTimeout)
  await Promise.all([
    page.waitForURL(URL.DASHBOARD, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    }),
    page.locator(SELECTOR.BTN_SUBMIT).last().click(),
  ]);

  // ----------------------------------------------------------
  // LANGKAH 6: Verifikasi URL setelah login
  // ----------------------------------------------------------
  const currentUrl = page.url();
  console.log(`[loginUser] URL saat ini: ${currentUrl}`);

  if (!currentUrl.startsWith(URL.DASHBOARD)) {
    throw new Error(
      `[loginUser] LOGIN GAGAL!\n` +
      `  URL diharapkan : ${URL.DASHBOARD}\n` +
      `  URL saat ini   : ${currentUrl}\n` +
      `Kemungkinan penyebab: email/password salah, akun terkunci, atau ada perubahan alur login.`
    );
  }

  console.log('[loginUser] ✅ Login User berhasil! Diarahkan ke dashboard.');
}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { loginUser };