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
await page.getByText('YT Modern 204').click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'CONTINUE TO MEASUREMENT' }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'START CAMERA MEASUREMENT' }).click();
await page.waitForTimeout(6500);
await page.getByRole('button', { name: 'CAPTURE MEASUREMENT' }).click();
await page.waitForTimeout(3500);
console.log('at results:', page.url());

await page.getByRole('button', { name: 'CONTINUE TO VALIDATION' }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'ACCEPT ALL' }).click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);

await page.getByText('Progressive', { exact: true }).click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);

await page.getByText('Anti-Reflective', { exact: true }).click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);

await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);

await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);
console.log('at review:', page.url());
await page.screenshot({ path: 'scratch_shots/full_journey_review.png' });

await page.getByRole('button', { name: 'GENERATE REPORT' }).click();
await page.waitForTimeout(300);
console.log('at report:', page.url());
await page.screenshot({ path: 'scratch_shots/full_journey_report.png' });

console.log('Console errors during full journey:', JSON.stringify(errors, null, 2));
await browser.close();
