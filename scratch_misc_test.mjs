import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

// Info bottom sheet on camera screen
await page.goto('http://localhost:5180/#/measure/camera', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.locator('button:has(svg)').nth(1).click(); // info icon button
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratch_shots/info_sheet.png' });

// Back button test - from customer screen back to home
await page.goto('http://localhost:5180/#/customer', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.locator('button:has(svg)').first().click();
await page.waitForTimeout(300);
console.log('URL after back from customer:', page.url());

console.log('Errors:', JSON.stringify(errors));
await browser.close();
