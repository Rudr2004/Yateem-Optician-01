import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:5180/';
const outPath = process.argv[3] || 'screenshot.png';
const width = parseInt(process.argv[4] || '1440', 10);
const height = parseInt(process.argv[5] || '900', 10);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: outPath });

console.log('Console errors:', JSON.stringify(errors, null, 2));
await browser.close();
