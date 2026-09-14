import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 500, height: 900 } });
page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
page.on('console', msg => { if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text()); });
page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));
page.on('response', res => { if (res.url().includes('side-face') && res.status() >= 400) console.log('BAD RESPONSE', res.status(), res.url()); });

await page.goto('http://localhost:6402/#/measure/calibrate');
await page.waitForTimeout(400);
await page.locator('button:has(svg.lucide-camera)').first().click();
await page.waitForTimeout(300);
await page.locator('button:has-text("CONFIRM")').first().click();
await page.waitForTimeout(300);
await page.locator('button:has-text("CONFIRM")').first().click();
await page.waitForTimeout(300);
await page.locator('button:has-text("CONFIRM")').first().click();
await page.waitForTimeout(600);

await page.screenshot({ path: 'C:/Users/abc/AppData/Local/Temp/claude/d--Lense-POC-2/e07ea90f-b549-4473-84cc-23561e168341/scratchpad/scratch_prodcheck.png' });

const imgInfo = await page.evaluate(() => {
  const img = document.querySelector('img[alt="Customer side view"]');
  if (!img) return { found: false };
  return { found: true, src: img.src, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, complete: img.complete };
});
console.log('IMG INFO:', JSON.stringify(imgInfo));

await browser.close();
