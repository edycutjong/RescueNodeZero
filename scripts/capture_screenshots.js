const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  console.log('📸 Capturing clean screenshots...');

  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // 1. Dashboard empty state
  console.log('1/3 Dashboard empty state...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(docsDir, 'screenshot-dashboard.png') });
  console.log('   ✅ screenshot-dashboard.png');

  // 2. Hazmat search results
  console.log('2/3 Hazmat search...');
  const searchInput = page.locator('input[type="text"]').first();
  await searchInput.fill('Hazmat');
  await searchInput.press('Enter');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(docsDir, 'screenshot-hazmat-search.png') });
  console.log('   ✅ screenshot-hazmat-search.png');

  // 3. Scroll down for more results
  console.log('3/3 Scrolled results...');
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(docsDir, 'screenshot-hazmat-scrolled.png') });
  console.log('   ✅ screenshot-hazmat-scrolled.png');

  await browser.close();
  console.log(`\n🎉 All screenshots saved to: ${docsDir}`);
}

capture().catch(console.error);
