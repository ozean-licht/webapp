const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  // Test Desktop View
  console.log('🖥️ Testing Desktop View...');
  const contextDesktop = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const pageDesktop = await contextDesktop.newPage();
  
  console.log('📱 Navigiere zur Learn-Seite...');
  await page.goto('http://localhost:3008/courses/sterben-fuer-anfaenger/learn', {
    waitUntil: 'networkidle'
  });
  
  console.log('⏳ Warte auf Video Player...');
  await page.waitForTimeout(2000);
  
  // Screenshot 1: Initial State
  console.log('📸 Screenshot 1: Video Player Initial State');
  await page.screenshot({
    path: 'test-results/video-player-initial.png',
    fullPage: false
  });
  
  // Warte auf den Video Player
  const videoPlayer = await page.locator('video').first();
  if (await videoPlayer.count() > 0) {
    console.log('✅ Video Player gefunden!');
    
    // Überprüfe Controls
    const playButton = await page.locator('button').filter({ hasText: /play|pause/i }).first();
    if (await playButton.count() > 0) {
      console.log('✅ Play/Pause Button gefunden');
      
      // Hover über Video für Controls
      await videoPlayer.hover();
      await page.waitForTimeout(500);
      
      // Screenshot 2: Mit Controls
      console.log('📸 Screenshot 2: Mit Controls');
      await page.screenshot({
        path: 'test-results/video-player-with-controls.png',
        fullPage: false
      });
      
      // Klicke Play
      console.log('▶️ Klicke Play Button...');
      await playButton.click();
      await page.waitForTimeout(3000);
      
      // Screenshot 3: Video spielt
      console.log('📸 Screenshot 3: Video spielt');
      await page.screenshot({
        path: 'test-results/video-player-playing.png',
        fullPage: false
      });
      
      // Hover wieder über Video
      await videoPlayer.hover();
      await page.waitForTimeout(500);
      
      // Screenshot 4: Playing mit Controls
      console.log('📸 Screenshot 4: Playing mit Controls');
      await page.screenshot({
        path: 'test-results/video-player-playing-controls.png',
        fullPage: false
      });
      
      console.log('✅ Alle Tests erfolgreich!');
    } else {
      console.log('❌ Play/Pause Button nicht gefunden');
    }
  } else {
    console.log('❌ Video Player nicht gefunden');
  }
  
  console.log('\n🎉 Test abgeschlossen! Browser bleibt offen für manuelle Überprüfung.');
  console.log('📁 Screenshots gespeichert in test-results/');
  
  // Browser bleibt offen
  // await browser.close();
})();

