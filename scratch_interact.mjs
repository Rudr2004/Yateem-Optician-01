import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
await page.goto('http://localhost:5180/#/tint', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

// Click "Rose" tint color and set opacity high via clicking Brown then checking
await page.getByRole('button', { name: 'Rose' }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratch_shots/tint_rose.png' });

await browser.close();
