import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

// Home -> Start New Measurement
await page.getByRole('button', { name: 'START NEW MEASUREMENT' }).click();
await page.waitForTimeout(300);
console.log('URL after start:', page.url());

// Customer -> Continue
await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
await page.waitForTimeout(300);
console.log('URL after customer continue:', page.url());

// Frame selection -> select first frame
await page.getByText('YT Classic 101').click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'CONTINUE TO MEASUREMENT' }).click();
await page.waitForTimeout(300);
console.log('URL after frame select:', page.url());
await page.screenshot({ path: 'scratch_shots/journey_intro.png' });

// Measurement intro -> Start Camera Measurement
await page.getByRole('button', { name: 'START CAMERA MEASUREMENT' }).click();
await page.waitForTimeout(300);
console.log('URL after intro:', page.url());

// Camera screen: wait for instructions to cycle to "ready" (~4 * 1.4s)
await page.waitForTimeout(6500);
await page.screenshot({ path: 'scratch_shots/journey_camera_ready.png' });
const captureBtn = page.getByRole('button', { name: 'CAPTURE MEASUREMENT' });
await captureBtn.click();
await page.waitForTimeout(300);
console.log('URL after capture:', page.url());
await page.screenshot({ path: 'scratch_shots/journey_scanning.png' });

// Wait for scanning to auto-complete (~2.6s + buffer) and navigate to results
await page.waitForTimeout(3500);
console.log('URL after scanning:', page.url());
await page.screenshot({ path: 'scratch_shots/journey_results.png' });

console.log('Console errors during journey:', JSON.stringify(errors, null, 2));
await browser.close();
