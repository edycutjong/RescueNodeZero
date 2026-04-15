/**
 * 🎬 RescueNode Zero — YouTube Video Recorder
 * 
 * Records a full ~2min walkthrough matching VIDEO_SCRIPT.md scenes.
 * Captures all dashboard interactions as a single WebM video.
 * 
 * Usage:
 *   1. Start backend: cd backend && DEMO_MODE=true uvicorn main:app --port 8000
 *   2. Start frontend: cd frontend && npm run dev
 *   3. Run: node scripts/record_youtube_video.js
 * 
 * Output:
 *   docs/youtube/dashboard_recording.webm
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'youtube');
const OUTPUT_FILE = 'dashboard_recording.webm';
const BASE_URL = 'http://localhost:3000';

// Timing aligned with ElevenLabs voiceover durations (in ms)
const SCENE_TIMINGS = {
  hook:           20000,  // Scene 1: ~20s opening view
  commandCenter:  17000,  // Scene 2: ~17s overview  
  hazmatSearch:   40000,  // Scene 3: ~40s HAZMAT search demo
  medicalTriage:  22000,  // Scene 4: ~22s medical triage
  multimodal:     35000,  // Scene 5: ~35s multimodal 
  safetyFilters:  32000,  // Scene 6: ~32s filters + inventory
  outro:          19000,  // Scene 7: ~19s outro
};

async function typeSlowly(element, text, delay = 55) {
  await element.pressSequentially(text, { delay });
}

async function smoothScroll(page, distance, duration = 1000) {
  await page.evaluate(({ dist, dur }) => {
    const start = window.scrollY;
    const startTime = performance.now();
    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      window.scrollTo(0, start + dist * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, { dist: distance, dur: duration });
  await page.waitForTimeout(duration + 100);
}

async function recordYouTubeVideo() {
  console.log('🎬 RescueNode Zero — YouTube Video Recording');
  console.log('═'.repeat(50));

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  // ─── SCENE 1: Hook (0:00–0:20) ───
  console.log('\n⚡ Scene 1: Hook — Empty dashboard reveal');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // Let animations play
  
  // Hold on the full dashboard — the scanlines, radar, HUD grid
  await page.waitForTimeout(SCENE_TIMINGS.hook - 3000);

  // ─── SCENE 2: Command Center (0:20–0:37) ───
  console.log('⚡ Scene 2: Command Center — Pan across dashboard');
  // Slowly scroll down to reveal all panels
  await smoothScroll(page, 200, 2000);
  await page.waitForTimeout(4000);
  // Scroll back up
  await smoothScroll(page, -200, 2000);
  await page.waitForTimeout(SCENE_TIMINGS.commandCenter - 8000);

  // ─── SCENE 3: HAZMAT Search (0:37–1:17) ───
  console.log('⚡ Scene 3: HAZMAT Search — "chemical burn treatment acetone"');
  const searchInput = page.locator('input[type="text"]').first();
  await searchInput.click();
  await page.waitForTimeout(1500);
  
  // Type the query dramatically
  await typeSlowly(searchInput, 'chemical burn treatment acetone', 65);
  await page.waitForTimeout(800);
  await searchInput.press('Enter');
  
  // Wait for results to load and animate in
  await page.waitForTimeout(3000);
  
  // Slowly browse the results
  await smoothScroll(page, 300, 2000);
  await page.waitForTimeout(5000);
  await smoothScroll(page, -300, 1500);
  await page.waitForTimeout(SCENE_TIMINGS.hazmatSearch - 14000);

  // ─── SCENE 4: Medical Triage (1:17–1:39) ───  
  console.log('⚡ Scene 4: Medical Triage — "crush syndrome field extraction"');
  // Clear search and type new query
  await searchInput.click();
  await searchInput.fill('');
  await page.waitForTimeout(500);
  await typeSlowly(searchInput, 'crush syndrome field extraction', 60);
  await page.waitForTimeout(500);
  await searchInput.press('Enter');
  await page.waitForTimeout(3000);
  
  // Browse medical results
  await smoothScroll(page, 250, 1500);
  await page.waitForTimeout(4000);
  await smoothScroll(page, -250, 1500);
  await page.waitForTimeout(SCENE_TIMINGS.medicalTriage - 11000);

  // ─── SCENE 5: Multimodal (1:39–2:14) ───
  console.log('⚡ Scene 5: Multimodal — Upload zone interaction');
  // Clear search  
  await searchInput.click();
  await searchInput.fill('');
  await page.waitForTimeout(1000);
  
  // Scroll to the upload zone area if it exists
  const uploadZone = page.locator('.dropzone, [class*="upload"], [class*="Upload"]').first();
  if (await uploadZone.count() > 0) {
    await uploadZone.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    // Hover over upload zone to trigger visual feedback
    await uploadZone.hover();
    await page.waitForTimeout(3000);
  }
  
  // Search for something multimodal-related
  await searchInput.click();
  await typeSlowly(searchInput, 'drone reconnaissance flood damage', 55);
  await searchInput.press('Enter');
  await page.waitForTimeout(3000);
  await smoothScroll(page, 200, 1500);
  await page.waitForTimeout(SCENE_TIMINGS.multimodal - 12000);

  // ─── SCENE 6: Safety Filters + Inventory (2:14–2:46) ───
  console.log('⚡ Scene 6: Safety Filters + Inventory');
  await smoothScroll(page, -200, 1000);
  
  // Clear and search something to show filters
  await searchInput.click();
  await searchInput.fill('');
  await typeSlowly(searchInput, 'burn treatment antibiotic', 55);
  await searchInput.press('Enter');
  await page.waitForTimeout(3000);

  // Click allergen filter chips if they exist
  const chips = page.locator('.chip, [class*="chip"], [class*="Chip"], button:has-text("penicillin")');
  if (await chips.count() > 0) {
    const firstChip = chips.first();
    await firstChip.click();
    await page.waitForTimeout(2000);
  }
  
  // Look at inventory panel
  const inventoryPanel = page.locator('[class*="inventory"], [class*="Inventory"]').first();
  if (await inventoryPanel.count() > 0) {
    await inventoryPanel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
  }
  
  await page.waitForTimeout(SCENE_TIMINGS.safetyFilters - 10000);

  // ─── SCENE 7: Outro (2:46–3:05) ───
  console.log('⚡ Scene 7: Outro — Full dashboard zoom out');
  // Scroll back to top for final view
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  
  // Hold on full dashboard
  await page.waitForTimeout(SCENE_TIMINGS.outro - 2000);

  // ─── Finalize ───
  console.log('\n📼 Finalizing recording...');
  await context.close();
  await browser.close();

  // Find and rename the video file
  const files = fs.readdirSync(OUTPUT_DIR);
  const webmFiles = files
    .filter(f => f.endsWith('.webm'))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(OUTPUT_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (webmFiles.length > 0) {
    const latestVideo = webmFiles[0].name;
    const oldPath = path.join(OUTPUT_DIR, latestVideo);
    const newPath = path.join(OUTPUT_DIR, OUTPUT_FILE);

    if (oldPath !== newPath) {
      if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
      fs.renameSync(oldPath, newPath);
    }
    
    const size = fs.statSync(newPath).size;
    console.log(`\n✅ Video saved: docs/youtube/${OUTPUT_FILE}`);
    console.log(`   Size: ${(size / 1024 / 1024).toFixed(1)} MB`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Combine with narration: docs/youtube/narration_full.mp3`);
    console.log(`   2. Add in CapCut/DaVinci Resolve/Premiere`);
    console.log(`   3. Follow docs/youtube/ASSEMBLY_GUIDE.md for text overlays`);
  } else {
    console.log('⚠️ Could not locate the WebM video file.');
  }
}

recordYouTubeVideo().catch(err => {
  console.error('❌ Recording failed:', err.message);
  process.exit(1);
});
