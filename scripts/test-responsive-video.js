const { chromium } = require('playwright');

async function testVideoPlayer(page, deviceName, viewport) {
  console.log(`\n📱 Testing ${deviceName} (${viewport.width}x${viewport.height})`);

  await page.setViewportSize(viewport);
  await page.goto('http://localhost:3008/courses/sterben-fuer-anfaenger/learn', {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(2000);

  // Screenshot: Full Page
  console.log(`📸 Screenshot ${deviceName}: Full Page`);
  await page.screenshot({
    path: `test-results/video-player-${deviceName.toLowerCase().replace(' ', '-')}-full.png`,
    fullPage: true
  });

  // Screenshot: Video Area Only
  console.log(`📸 Screenshot ${deviceName}: Video Area`);
  await page.screenshot({
    path: `test-results/video-player-${deviceName.toLowerCase().replace(' ', '-')}-video.png`,
    fullPage: false,
    clip: { x: 0, y: 100, width: viewport.width, height: Math.min(600, viewport.height - 100) }
  });

  // Warte auf den Video Player
  const videoPlayer = await page.locator('video').first();
  if (await videoPlayer.count() > 0) {
    console.log(`✅ Video Player gefunden auf ${deviceName}!`);

    // Test Controls (versuche verschiedene Selektoren)
    const playButtons = await page.locator('button').filter({ hasText: /▶️|⏸️|play|pause/i });
    const controlButtons = await page.locator('[class*="hover:text-primary"]');

    if ((await playButtons.count() > 0) || (await controlButtons.count() > 0)) {
      console.log(`✅ Controls gefunden auf ${deviceName}`);
    } else {
      console.log(`⚠️ Controls möglicherweise nicht sichtbar auf ${deviceName} (Hover erforderlich)`);
    }

    console.log(`✅ ${deviceName} Test erfolgreich!`);
  } else {
    console.log(`❌ Video Player nicht gefunden auf ${deviceName}`);
  }
}

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  // Test verschiedene Viewports
  const viewports = [
    { name: 'Desktop', size: { width: 1920, height: 1080 } },
    { name: 'Tablet', size: { width: 768, height: 1024 } },
    { name: 'Mobile', size: { width: 375, height: 667 } }
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: viewport.size });
    const page = await context.newPage();

    await testVideoPlayer(page, viewport.name, viewport.size);

    await context.close();
  }

  console.log('\n🎉 Alle Responsive Tests abgeschlossen!');
  console.log('📁 Screenshots gespeichert in test-results/');

  // Browser bleibt offen für manuelle Tests
  // await browser.close();
})();
