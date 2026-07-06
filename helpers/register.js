// helpers/register.js
// ============================================================
// Helper Login USER untuk BNT Global Automation Testing
// ============================================================
// Cara pakai:
//   const { register } = require('../helpers/register');
//   await register(page);
//
// Prasyarat:
//   - File .env harus berisi USER_EMAIL dan USER_PASSWORD
//   - dotenv sudah dimuat di playwright.config.js
// ============================================================

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
  BTN_OPEN_LOGIN: 'button:has-text("Masuk"), a:has-text("Masuk")',

  /** Tombol "Register" di halaman utama (navbar/hero) */
  BTN_OPEN_REGISTER: '[id="ngb-nav-1"]',

  /** Input nama lengkap pada form register */
  INPUT_NAMA_LENGKAP: '[data-testid="register-input-nama_lengkap"]',

  /** Input gender laki pada form register */
  BTN_GENDER_LAKI: '[data-testid="register-gender-laki"]',

  /** Input tempat lahir pada form register */
  INPUT_TEMPAT_LAHIR: '[data-testid="register-input-tempat_lahir"]',

  /** Input tanggal lahir pada form register */
  INPUT_TANGGAL_LAHIR: '[data-testid="register-input-tanggal_lahir"]',

  /** Input email pada form register */
  INPUT_EMAIL: '[data-testid="register-input-email"]',

  /** Input no hp pada form register */
  INPUT_NO_HP: '[data-testid="register-input-no_hp"]',

  /** Input password pada form register */
  INPUT_PASSWORD: '[data-testid="register-input-password"]',

  /** Tombol kitas/ktp di dalam form register */
  BTN_KITAS_KTP: '[data-testid="register-kitas-ktp"]',

  /** Input nomor kitas/ktp di dalam form register */
  INPUT_NOMOR_KITAS_KTP: '[data-testid="register-input-kitas_nomor"]',

  /** Tombol crop foto di dalam form register */
  BTN_CROP_FOTO: '[data-testid="crop-foto-btn-regis"]',

  /** Tombol unggah foto di dalam form register */
  BTN_UNGGAH_FOTO: '[data-testid="crop-foto-btn-unggah"]',

  /** Tombol simpan foto di dalam form register */
  BTN_SIMPAN_FOTO: '[data-testid="crop-foto-btn-simpan"]',

  /** Tombol jenis alamat di dalam form register */
  BTN_JENIS_ALAMAT: '[data-testid="register-jenis-alamat"]',

  /** Select wilayah di dalam form register */
  SELECT_WILAYAH: '[data-testid="register-select-wilayah"]',

  /** ID wilayah di dalam form register */
  // ID_WILAYAH: '[data-testid="register-option-wilayah-0"]',
  ID_WILAYAH: '[role="option"]',

  /** Input kode pos di dalam form register */
  INPUT_KODE_POS: '[data-testid="register-input-kode_pos"]',

  /** Tombol open map di dalam form register */
  BTN_OPEN_MAP: '[data-testid="register-div-open-map"]',

  /** Input detail alamat di dalam form register */
  INPUT_DETAIL_MAP: '[data-testid="register-textarea-alamat"]',

  /** Input detail alamat di dalam form register */
  BTN_SUBMIT_MAP: '[data-testid="register-button-btn-register-8"]',

  /** Checkbox menyetujui di dalam form register */
  CHECKBOX_MENYETUJUI: '[data-testid="register-input-menyetujui"]',

  /** Tombol selanjutnya di dalam form register */
  BTN_NEXT: '[data-testid="register-button-btn-register-1"]',

  /** Tombol selanjutnya di dalam form register */
  BTN_NEXT_2: '[data-testid="register-button-btn-register-3"]',

  /** Tombol selanjutnya di dalam form register */
  BTN_NEXT_3: '[data-testid="register-button-btn-register-5"]',

  /** Tombol selanjutnya di dalam form register */
  BTN_DAFTAR: '[data-testid="register-button-btn-register-7"]',


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
      `[register] Environment variable tidak ditemukan: ${missing.join(', ')}.\n` +
      `Pastikan file .env sudah dibuat dan diisi dengan benar.\n` +
      `Contoh:\n  USER_EMAIL=user@example.com\n  USER_PASSWORD=yourPassword`
    );
  }
}

// ----------------------------------------------------------
// Fungsi Utama: register
// ----------------------------------------------------------
/**
 * Melakukan proses register sebagai User pada aplikasi BNT Global.
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
 * @throws {Error} Jika env var tidak ada, atau register gagal / URL tidak sesuai
 *
 * @example
 * // Di dalam test:
 * const { register } = require('../helpers/register');
 * test('contoh test setelah register', async ({ page }) => {
 *   await register(page);
 *   // Lanjutkan test Anda di sini...
 * });
 */
async function register(page) {
  // Validasi env vars sebelum mulai
  // validateEnvVars();

  console.log('[register] Memulai proses register sebagai User...');

  // ----------------------------------------------------------
  // LANGKAH 1: Navigasi ke halaman utama
  // ----------------------------------------------------------
  console.log(`[register] Membuka URL: ${URL.BASE}`);
  await page.goto(URL.BASE);

  // Tunggu hingga halaman selesai dimuat (network idle)
  await page.waitForLoadState('networkidle');

  // ----------------------------------------------------------
  // LANGKAH 2: Klik tombol "Daftar" di halaman utama
  // ----------------------------------------------------------
  console.log('[register] Mencari dan mengklik tombol "Daftar"...');

  const btnOpenLogin = page.locator(SELECTOR.BTN_OPEN_LOGIN).first();
  // Pastikan tombol terlihat sebelum diklik
  await btnOpenLogin.waitFor({ state: 'visible' });
  await btnOpenLogin.click();

  console.log('[register] Mencari dan mengklik tombol "Daftar"...');

  const btnOpenRegister = page.locator(SELECTOR.BTN_OPEN_REGISTER).first();

  // Pastikan tombol terlihat sebelum diklik
  await btnOpenRegister.waitFor({ state: 'visible' });
  await btnOpenRegister.click();

  // Tunggu form register muncul (ditandai input email tersedia)
  const inputNamaLengkap = page.locator(SELECTOR.INPUT_NAMA_LENGKAP).first();
  await inputNamaLengkap.waitFor({ state: 'visible' });
  await inputNamaLengkap.click();
  await inputNamaLengkap.fill("Galih Wibisono");
  console.log('[register] Mengisi field nama lengkap...');

  // ======================================================================

  // const btnGenderLaki = page.locator(SELECTOR.BTN_GENDER_LAKI).first();
  // await btnGenderLaki.waitFor({ state: 'visible' });
  // await btnGenderLaki.click();
  // console.log('[register] Memilih gender laki-laki...');

  // ======================================================================

  const inputTempatLahir = page.locator(SELECTOR.INPUT_TEMPAT_LAHIR).first();
  await inputTempatLahir.waitFor({ state: 'visible' });
  await inputTempatLahir.click();
  await inputTempatLahir.fill("Malang");
  console.log('[register] Mengisi field tempat lahir...');

  // ======================================================================

  const inputTanggalLahir = page.locator(SELECTOR.INPUT_TANGGAL_LAHIR).first();
  await inputTanggalLahir.waitFor({ state: 'visible' });
  await inputTanggalLahir.fill("01/10/2002");
  console.log('[register] Mengisi field tanggal lahir...');

  // ======================================================================

  const inputEmail = page.locator(SELECTOR.INPUT_EMAIL).first();
  await inputEmail.waitFor({ state: 'visible' });
  await inputEmail.click();
  await inputEmail.fill("wibisonotest@yopmail.com");
  console.log('[register] Mengisi field email...');

  // ======================================================================

  const inputNoHp = page.locator(SELECTOR.INPUT_NO_HP).first();
  await inputNoHp.waitFor({ state: 'visible' });
  await inputNoHp.click();
  await inputNoHp.fill("081000001008");
  console.log('[register] Mengisi field no hp...');

  // ======================================================================

  const inputPassword = page.locator(SELECTOR.INPUT_PASSWORD).first();
  await inputPassword.waitFor({ state: 'visible' });
  await inputPassword.click();
  await inputPassword.fill("Venturo1407*");
  console.log('[register] Mengisi field password...');

  // ======================================================================

  const btnNext = page.locator(SELECTOR.BTN_NEXT).first();
  await btnNext.waitFor({ state: 'visible' });
  await btnNext.click();
  console.log('[register] Mengklik tombol next...');

  // ======================================================================

  // const btnJenisIdentitas = page.locator(SELECTOR.BTN_KITAS_KTP).first();
  // await btnJenisIdentitas.waitFor({ state: 'visible' });
  // await btnJenisIdentitas.click();
  // console.log('[register] Mengklik tombol jenis identitas...');

  // ======================================================================

  const inputNomorIdentitas = page.locator(SELECTOR.INPUT_NOMOR_KITAS_KTP).first();
  await inputNomorIdentitas.waitFor({ state: 'visible' });
  await inputNomorIdentitas.click();
  await inputNomorIdentitas.fill("1234567771234560");
  console.log('[register] Mengisi field nomor identitas...');

  // ======================================================================

  const fileChooserPromise = page.waitForEvent('filechooser');

  const btnCropFoto = page.locator(SELECTOR.BTN_CROP_FOTO).first();
  await btnCropFoto.waitFor({ state: 'visible' });
  await btnCropFoto.click();
  console.log('[register] Mengklik tombol crop foto...');

  const btnPilihFoto = page.locator(SELECTOR.BTN_UNGGAH_FOTO).first();
  await btnPilihFoto.waitFor({ state: 'visible' });
  await btnPilihFoto.click();
  console.log('[register] Mengklik tombol pilih foto...');

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('tests/assets/main_page_loaded.png');

  const btnSimpanFoto = page.locator(SELECTOR.BTN_SIMPAN_FOTO).first();
  await btnSimpanFoto.waitFor({ state: 'visible' });
  await btnSimpanFoto.click();
  console.log('[register] Mengklik tombol simpan foto...');

  // ======================================================================

  const btnNext2 = page.locator(SELECTOR.BTN_NEXT_2).first();
  await btnNext2.waitFor({ state: 'visible' });
  await btnNext2.click();
  console.log('[register] Mengklik tombol next...');

  // ======================================================================

  // const btnJenisAlamat = page.locator(SELECTOR.BTN_JENIS_ALAMAT).first();
  // await btnJenisAlamat.waitFor({ state: 'visible' });
  // await btnJenisAlamat.click();
  // console.log('[register] Mengklik tombol jenis alamat...');

  // ======================================================================

  const searchWilayah = page.locator(SELECTOR.SELECT_WILAYAH).first();
  await searchWilayah.waitFor({ state: 'visible' });
  await searchWilayah.click();
  await searchWilayah.pressSequentially("Tanjungrejo");
  console.log('[register] Mengisi field wilayah...');

  // ======================================================================

  await page.waitForTimeout(5000);
  const idWilayah = page.locator(SELECTOR.ID_WILAYAH).first();
  await idWilayah.waitFor({ state: 'visible' });
  await idWilayah.click();
  console.log('[register] Mengklik tombol id wilayah...');

  // ======================================================================

  const inputKodePos = page.locator(SELECTOR.INPUT_KODE_POS).first();
  await inputKodePos.waitFor({ state: 'visible' });
  await inputKodePos.click();
  await inputKodePos.fill("65147");
  console.log('[register] Mengisi field kode pos...');

  // ======================================================================

  await pilihMaps(page, "Jl. Puter Tengah no.10", SELECTOR.BTN_OPEN_MAP, SELECTOR.INPUT_DETAIL_MAP, SELECTOR.BTN_SUBMIT_MAP, true);
  await page.waitForTimeout(5000);
  await page.waitForLoadState('networkidle');

  // ======================================================================

  const btnNext3 = page.locator(SELECTOR.BTN_NEXT_3).first();
  await btnNext3.waitFor({ state: 'visible' });
  await btnNext3.click();
  console.log('[register] Mengklik tombol next...');

  // ======================================================================

  // await page.waitForTimeout(5000);
  const canvas = page.locator('canvas[width="414"][height="400"]'); // ganti selector sesuai kebutuhan
  const box = await canvas.boundingBox();
  if (box) {
    // 2. Arahkan mouse ke posisi awal (misal: 1/4 lebar canvas dari kiri)
    await page.mouse.move(box.x + box.width / 4, box.y + box.height / 2);
    await page.mouse.down(); // tekan mouse

    // 3. Geser mouse ke posisi lain untuk menggambar coretan
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3);
    await page.mouse.move(box.x + (box.width * 3) / 4, box.y + box.height / 2);

    await page.mouse.up(); // lepaskan mouse
  }

  // ======================================================================

  const checkboxMenyetujui = page.locator(SELECTOR.CHECKBOX_MENYETUJUI).first();
  await checkboxMenyetujui.waitFor({ state: 'visible' });
  await checkboxMenyetujui.click();
  console.log('[register] Mengklik checkbox menyetujui...');

  // ======================================================================

  // await page.pause();

  const btnDaftar = page.locator(SELECTOR.BTN_DAFTAR).first();
  await btnDaftar.waitFor({ state: 'visible' });
  await btnDaftar.click();
  console.log('[register] Mengklik tombol daftar...');

}

// ----------------------------------------------------------
// Ekspor fungsi agar dapat digunakan di file test lain
// ----------------------------------------------------------
module.exports = { register };