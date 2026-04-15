const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  console.log('📸 Capturing clean screenshots...');

  const docsDir = path.join(__dirname, '..', 'docs', 'all_searches');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  const seedFile = fs.readFileSync(path.join(__dirname, '..', 'backend', 'data', 'seed_protocols.py'), 'utf-8');
  const titles = [...seedFile.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);
  const names = [...seedFile.matchAll(/"name":\s*"([^"]+)"/g)].map(m => m[1]);
  
  const allTerms = [...titles, ...names];
  console.log(`Found ${allTerms.length} search terms in seed_protocols.py.`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  console.log('0 - Dashboard empty state...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(docsDir, 'screenshot-dashboard.png') });

  const searchInput = page.locator('input[type="text"]').first();

  for (let i = 0; i < allTerms.length; i++) {
    const term = allTerms[i];
    console.log(`${i+1}/${allTerms.length} Searching: ${term}...`);
    
    // Clear and fill input
    await searchInput.click({ clickCount: 3 }); // Select all text
    await searchInput.press('Backspace'); // Delete selection
    await searchInput.fill(term);
    await searchInput.press('Enter');
    
    // Wait for search results
    await page.waitForTimeout(1200);
    
    const safeName = term.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    await page.screenshot({ path: path.join(docsDir, `search_${safeName}.png`) });
  }

  await browser.close();
  console.log(`\n🎉 All ${allTerms.length} screenshots saved to: ${docsDir}`);
}

capture().catch(console.error);
