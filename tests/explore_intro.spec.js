import { test, expect } from '@playwright/test';

test('explore intro page and redirections', async ({ page }) => {
  page.on('console', msg => console.log(`PAGE LOG: [${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', request => {
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`);
  });

  console.log('Navigating to https://test.bnt-global.com/...');
  await page.goto('https://test.bnt-global.com/', { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('Current URL after navigation:', page.url());

  // Wait 10 seconds to allow the Angular app to load and redirect or render
  console.log('Waiting 10 seconds for Angular rendering and routing...');
  await page.waitForTimeout(10000);

  console.log('Current URL after 10s wait:', page.url());

  // Let's print out the text of the entire page
  const textContent = await page.innerText('body');
  console.log('Body Text Content (first 1000 chars):', textContent.substring(0, 1000));

  // Print all elements with tag a or button
  const buttons = await page.locator('button').allTextContents();
  const links = await page.locator('a').allTextContents();
  console.log('Buttons:', buttons);
  console.log('Links:', links);

  // Check if there are specific text elements like 'Masuk'
  const masukText = page.locator('text=Masuk');
  console.log('Count of "Masuk" text:', await masukText.count());

  // Take screenshot
  await page.screenshot({ path: 'tests/intro_page.png', fullPage: true });
});
