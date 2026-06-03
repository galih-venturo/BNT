// helpers/loginAdmin.js
// ============================================================
// Helper Login ADMIN untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { loginAdmin } = require('../helpers/loginAdmin');
//   await loginAdmin(page);
//
// Prasyarat:
//   - File .env harus berisi ADMIN_EMAIL dan ADMIN_PASSWORD
//   - dotenv sudah dimuat di playwright.config.js
// ============================================================

'use strict';

// ----------------------------------------------------------
// Konstanta URL dan Selector
// Dipisahkan agar mudah diperbarui jika UI berubah
// ----------------------------------------------------------
const URL = {
  BASE: process.env.BASE_URL || 'https://test.bnt-global.com',
  BACKOFFICE_HOME: `${process.env.BASE_URL || 'https://test.bnt-global.com'}/backoffice/home`,
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
  if (!process.env.ADMIN_EMAIL) missing.push('ADMIN_EMAIL');
  if (!process.env.ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD');

  if (missing.length > 0) {
    throw new Error(
      `[loginAdmin] Environment variable tidak ditemukan: ${missing.join(', ')}.\n` +
      `Pastikan file .env sudah dibuat dan diisi dengan benar.\n` +
      `Contoh:\n  ADMIN_EMAIL=admin@example.com\n  ADMIN_PASSWORD=yourPassword`
    );
  }
}

// ----------------------------------------------------------
// Fungsi Utama: loginAdmin
// ----------------------------------------------------------
/**
 * Melakukan proses login sebagai Admin pada aplikasi BNT Global.
 *
 * Alur:
 * 1. Navigasi ke BASE URL
 * 2. Klik tombol "Masuk" di halaman utama
 * 3. Isi email dari ADMIN_EMAIL (env)
 * 4. Isi password dari ADMIN_PASSWORD (env)
 * 5. Klik tombol submit "Masuk"
 * 6. Verifikasi URL berpindah ke /backoffice/home
 *
 * @param {import('@playwright/test').Page} page - Instance halaman Playwright
 * @returns {Promise<void>}
 * @throws {Error} Jika env var tidak ada, atau login gagal / URL tidak sesuai
 *
 * @example
 * // Di dalam test:
 * const { loginAdmin } = require('../helpers/loginAdmin');
 * test('contoh test admin setelah login', async ({ page }) => {
 *   await loginAdmin(page);
 *   // Lanjutkan test admin Anda di sini...
 * });
 */
async function loginAdmin(page) {
  // Validasi env vars sebelum mulai
  validateEnvVars();

  console.log('[loginAdmin] Memulai proses login sebagai Admin...');

  // ----------------------------------------------------------
  // LANGKAH 1: Navigasi ke halaman utama
  // ----------------------------------------------------------
  console.log(`[loginAdmin] Membuka URL: ${URL.BASE}`);
  await page.goto(URL.BASE);

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  // ----------------------------------------------------------
  // LANGKAH 2: Klik tombol "Masuk" di halaman utama
  // ----------------------------------------------------------
  console.log('[loginAdmin] Mencari dan mengklik tombol "Masuk"...');

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
  console.log('[loginAdmin] Mengisi field email admin...');
  await inputEmail.click();
  await inputEmail.fill(process.env.ADMIN_EMAIL);

  // ----------------------------------------------------------
  // LANGKAH 4: Isi field Password
  // ----------------------------------------------------------
  console.log('[loginAdmin] Mengisi field password admin...');
  const inputPassword = page.locator(SELECTOR.INPUT_PASSWORD).first();
  await inputPassword.waitFor({ state: 'visible' });
  await inputPassword.click();
  await inputPassword.fill(process.env.ADMIN_PASSWORD);

  // ----------------------------------------------------------
  // LANGKAH 5: Klik tombol Submit "Masuk"
  // ----------------------------------------------------------
  console.log('[loginAdmin] Mengklik tombol submit "Masuk"...');

  // Tunggu navigasi selesai setelah submit (lebih stabil dari waitForTimeout)
  await Promise.all([
    page.waitForURL(URL.BACKOFFICE_HOME, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    }),
    page.locator(SELECTOR.BTN_SUBMIT).last().click(),
  ]);

  // ----------------------------------------------------------
  // LANGKAH 6: Verifikasi URL setelah login
  // ----------------------------------------------------------
  const currentUrl = page.url();
  console.log(`[loginAdmin] URL saat ini: ${currentUrl}`);

  if (!currentUrl.startsWith(URL.BACKOFFICE_HOME)) {
    throw new Error(
      `[loginAdmin] LOGIN ADMIN GAGAL!\n` +
      `  URL diharapkan : ${URL.BACKOFFICE_HOME}\n` +
      `  URL saat ini   : ${currentUrl}\n` +
      `Kemungkinan penyebab: email/password admin salah, akun tidak memiliki akses admin, atau ada perubahan alur login.`
    );
  }

  console.log('[loginAdmin] ✅ Login Admin berhasil! Diarahkan ke backoffice home.');
}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { loginAdmin };