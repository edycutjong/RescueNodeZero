const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function recordDemo() {
  console.log('🎬 Starting RescueNode Zero Demo Recording...');
  
  // Create docs directory for screenshots and videos
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: docsDir,
      size: { width: 1280, height: 720 },
    },
    colorScheme: 'dark'
  });

  const page = await context.newPage();

  try {
    // 1. Navigate to the local dashboard
    console.log('📡 Navigating to dashboard...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take an initial screenshot
    await page.screenshot({ path: path.join(docsDir, 'screenshot-dashboard.png') });

    // 2. Perform a keyword search
    console.log('🔍 Executing keyword search...');
    const searchInput = page.locator('input[placeholder="Search knowledge base..."]');
    await searchInput.fill('crush syndrome field extraction');
    await page.keyboard.press('Enter');
    
    // Wait for search results
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(docsDir, 'screenshot-search-crush.png') });

    // 3. Perform a semantic/hybrid search
    console.log('🧪 Executing hybrid fusion search...');
    await searchInput.fill('');
    await searchInput.fill('chemical burn treatment acetone');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(docsDir, 'screenshot-search-chemical.png') });

    // 4. Test filtering
    console.log('⚠️ Applying allergy filters...');
    // Assuming there's a button or checkbox for penicillin filter
    // For now we just append it to the query
    await searchInput.fill('UN-1090');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(docsDir, 'screenshot-search-hazmat.png') });

    console.log('✅ Demo recording complete. Saving video...');
  } catch (error) {
    console.error('❌ Error during recording:', error);
  } finally {
    // End the session
    await context.close();
    await browser.close();
    console.log(`🎥 Video and screenshots saved to: ${docsDir}`);
  }
}

recordDemo();
