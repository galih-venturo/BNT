// helpers/prepareCart.js
// ============================================================
// Helper: siapkan keranjang ke kondisi siap-checkout.
// ============================================================
// Cart di BNT tersimpan server-side per akun & dikonsumsi saat checkout,
// jadi tiap test harus membangun sendiri kondisi keranjangnya.
// Helper ini:
//   1. Tambah produk top-0 dari dashboard (tombol paling stabil).
//   2. Buka keranjang.
//   3. Naikkan qty via tombol "+" sampai memenuhi Minimal Pembelian.
//   4. Centang semua principle, klik Checkout, klik "Bayar Sekarang".
// Setelah helper ini, halaman berada di step "Pilih Pembayaran".
//
// Cara pakai:
//   const { prepareCart } = require('../helpers/prepareCart');
//   await prepareCart(page);           // default 4x klik "+"
//   await prepareCart(page, { qtyClicks: 6 });
// ============================================================

'use strict';

const { expect } = require('@playwright/test');

/**
 * @param {import('@playwright/test').Page} page
 * @param {{ qtyClicks?: number }} [opts] qtyClicks = jumlah klik tombol "+" (default 4).
 */
async function prepareCart(page, opts = {}) {
  const qtyClicks = opts.qtyClicks ?? 4;

  // Pastikan dashboard benar-benar selesai load (env test kadang lambat).
  await page.waitForLoadState('networkidle').catch(() => {});

  // 1. Tambah produk dari dashboard (login mendarat di /dashboard).
  const addBtn = page.locator('[id="btn-top-produk-0"]');
  await addBtn.waitFor({ state: 'visible', timeout: 20000 });
  await addBtn.scrollIntoViewIfNeeded();
  await addBtn.click();
  await expect(page.getByText('Product added to cart')).toBeVisible({ timeout: 10000 });
  // Beri jeda agar penambahan tereflect di server sebelum buka keranjang.
  await page.waitForTimeout(1500);

  // 2. Buka katalog lalu keranjang.
  await page.locator('#mobile-top-nav > div > div:nth-child(2)').click();
  await page.waitForTimeout(1500);
  await page.locator('[data-icon="akar-icons:cart"]').click();

  // 3. Naikkan qty agar memenuhi Minimal Pembelian (checkout diblokir jika kurang).
  //    Cart server-side kadang telat reflect; jika stepper belum muncul, tambah ulang.
  const tambahQty = page.locator('[id^="btn-tambah-jumlah-"]').first();
  try {
    await tambahQty.waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    // Keranjang kosong (add belum tereflect) -> ulangi sekali dari dashboard.
    await page.locator('[data-icon="akar-icons:cart"]').waitFor({ state: 'visible', timeout: 10000 });
    await page.goto((process.env.BASE_URL || 'https://test.bnt-global.com') + '/dashboard');
    await page.waitForLoadState('networkidle').catch(() => {});
    await addBtn.waitFor({ state: 'visible', timeout: 20000 });
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click();
    await expect(page.getByText('Product added to cart')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1500);
    await page.locator('#mobile-top-nav > div > div:nth-child(2)').click();
    await page.waitForTimeout(1500);
    await page.locator('[data-icon="akar-icons:cart"]').click();
    await tambahQty.waitFor({ state: 'visible', timeout: 15000 });
  }
  for (let i = 0; i < qtyClicks; i++) {
    await tambahQty.click();
    await page.waitForTimeout(400);
  }

  // 4. Centang semua principle.
  const checkboxes = page.locator('[id^="chk-pilih-principle-"]');
  await checkboxes.first().waitFor({ state: 'visible', timeout: 15000 });
  const total = await checkboxes.count();
  for (let i = 0; i < total; i++) {
    if (!(await checkboxes.nth(i).isChecked())) {
      await checkboxes.nth(i).check();
    }
  }

  // Checkout -> Bayar Sekarang -> tiba di "Pilih Pembayaran".
  await page.locator('[data-testid="keranjang-belanja-btn-checkout"]').click();
  await page.locator('#btn-checkout-1').click();
}

module.exports = { prepareCart };
