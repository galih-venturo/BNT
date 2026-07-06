'use strict';

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../../../helpers/loginUser');


test.describe('Notifikasi', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  })

  test('All Notifikasi', async ({ page }) => {
    const bellIcon = '[data-icon="akar-icons:bell"]'
    await page.locator(bellIcon).click();
    await expect(page.getByText('Notifikasi')).toBeVisible();

    const viewNotif = '[data-testid="list-terbaca notif-card"]'
    await page.locator(viewNotif).first().click();
    await expect(page.locator(viewNotif).first()).toHaveClass(/terbaca/);
  })



});