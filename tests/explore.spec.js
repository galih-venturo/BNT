import { test, expect } from '@playwright/test';

test('explore page elements with detailed logging', async ({ page }) => {
  // Listen for console logs and errors
  page.on('console', msg => console.log(`PAGE LOG: [${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', request => {
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`);
  });

  console.log('Navigating to BNT website...');
  
  // Go to URL and wait for DOMContentLoaded
  try {
    await page.goto('https://test.bnt-global.com/', { 
      waitUntil: 'load', 
      timeout: 60000 
    });
    console.log('Page loaded.');
  } catch (error) {
    console.error('Navigation error:', error);
  }

  // Let's wait for a bit to allow SPAs to render (e.g., 5 seconds)
  console.log('Waiting 5s for client-side rendering...');
  await page.waitForTimeout(5000);

  // Get Page Title
  const title = await page.title();
  console.log('Page Title:', title);

  // Print HTML body content (first 500 characters) to see what is there
  const bodyHTML = await page.locator('body').innerHTML();
  console.log('Body HTML (first 500 chars):', bodyHTML.substring(0, 500));

  // Count elements
  const allButtons = page.locator('button');
  const allButtonsCount = await allButtons.count();
  console.log('Total buttons found:', allButtonsCount);

  const allLinks = page.locator('a');
  const allLinksCount = await allLinks.count();
  console.log('Total links found:', allLinksCount);

  // Take a fresh screenshot
  await page.screenshot({ path: 'tests/main_page_loaded.png', fullPage: true });
});
