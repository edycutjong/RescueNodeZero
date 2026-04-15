const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureVideo(queryText, outputFilename) {
  console.log(`\n🎥 Recording demo video for query: "${queryText}"...`);

  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  // Set up video recording
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    recordVideo: {
      dir: docsDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();

  // 1. Dashboard empty state
  console.log('  1/3 Loading dashboard...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // 2 seconds on the empty state

  // 2. Search
  console.log('  2/3 Typing search query...');
  const searchInput = page.locator('input[type="text"]').first();
  // Ensure we clear it just in case
  await searchInput.fill('');
  // Type rapidly like a skilled terminal operator (40ms per keystroke)
  const typeSpeed = 40;
  await searchInput.pressSequentially(queryText, { delay: typeSpeed }); 
  await page.waitForTimeout(500);
  await searchInput.press('Enter');
  
  console.log('  Waiting for results...');
  await page.waitForTimeout(3000); // 3 seconds to view top results

  // 3. Scroll down for more results
  console.log('  3/3 Scrolling through results...');
  await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
  await page.waitForTimeout(3000); // 3 seconds to view lower cards

  // Close context to finalize and save the video file
  await context.close();
  await browser.close();

  // Playwright saves the video with a random hash name. Let's find it and rename it.
  const files = fs.readdirSync(docsDir);
  // Find the exact video file Playwright just created (it usually creates it right as context closes)
  // To avoid renaming previous videos, we can look for .webm files that are a hash (length > 20)
  const videoFile = files.find(f => f.endsWith('.webm') && f.length === 37); // e.g. 5d5a0a3fe627...webm
  if (videoFile) {
    const oldPath = path.join(docsDir, videoFile);
    const newPath = path.join(docsDir, outputFilename);
    
    // Remove existing file if it's there
    if (fs.existsSync(newPath)) {
        fs.unlinkSync(newPath);
    }
    
    fs.renameSync(oldPath, newPath);
    console.log(`  🎉 Video saved successfully to: docs/${outputFilename}`);
  } else {
    // If exact name matching is flaky, just grab the most recently modified .webm file
    const webmFiles = files.filter(f => f.endsWith('.webm')).map(f => ({
       name: f,
       time: fs.statSync(path.join(docsDir, f)).mtime.getTime()
    })).sort((a, b) => b.time - a.time);
    
    if (webmFiles.length > 0) {
      const latestVideo = webmFiles[0].name;
      const oldPath = path.join(docsDir, latestVideo);
      const newPath = path.join(docsDir, outputFilename);
      
      if (oldPath !== newPath) {
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(oldPath, newPath);
        console.log(`  🎉 Video saved successfully to: docs/${outputFilename}`);
      }
    } else {
      console.log('  ⚠️ Could not locate the WebM video file.');
    }
  }
}

async function runAll() {
  const scenarios = [
    { queryText: 'Hazmat', filename: 'demo_hazmat.webm' },
    { queryText: 'Chlorine gas', filename: 'demo_chlorine_gas.webm' },
    { queryText: 'Crush syndrome', filename: 'demo_crush_syndrome.webm' },
    { queryText: 'Chemical burn penicillin allergy', filename: 'demo_chemical_burn.webm' },
    { queryText: 'Drone Sector 2 flood', filename: 'demo_drone_sector_2.webm' }
  ];

  for (const scenario of scenarios) {
    await captureVideo(scenario.queryText, scenario.filename);
  }
  
  console.log('\n✅ All demo videos recorded successfully!');
}

runAll().catch(console.error);
