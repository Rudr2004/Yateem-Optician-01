import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'START NEW MEASUREMENT' }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
await page.waitForTimeout(300);
await page.getByText('YT Air 305').click();
await page.waitForTimeout(200);
console.log('Frame selected: YT Air 305');

// Navigate in-app to success (simulate having completed flow) via bottom nav isn't direct;
// instead use browser back-forward is unreliable. Use direct in-page hash change (no reload)
// by evaluating location.hash, which HashRouter listens to without a full reload.
await page.evaluate(() => { window.location.hash = '#/success'; });
await page.waitForTimeout(300);
console.log('URL:', page.url());

await page.getByRole('button', { name: 'NEW MEASUREMENT' }).click();
await page.waitForTimeout(300);
console.log('URL after reset:', page.url());

await page.evaluate(() => { window.location.hash = '#/frame-selection'; });
await page.waitForTimeout(300);
const selectedCount = await page.getByText('✓ Selected').count();
console.log('Selected frames after reset (should be 0):', selectedCount);

console.log('Errors:', JSON.stringify(errors));
await browser.close();
