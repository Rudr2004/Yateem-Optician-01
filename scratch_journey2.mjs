import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

// Jump straight to validation via hash (state will be default mock, which is fine for this leg)
await page.goto('http://localhost:5180/#/measure/validation', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

await page.getByRole('button', { name: 'ACCEPT ALL' }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: 'scratch_shots/journey_validation_accepted.png' });

await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);
console.log('URL after validation:', page.url());

// Lens type
await page.getByText('Progressive', { exact: true }).click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);
console.log('URL after lens:', page.url());

// Coatings
await page.getByText('Anti-Reflective', { exact: true }).click();
await page.getByText('Blue-Light Filtering', { exact: true }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: 'scratch_shots/journey_coatings.png' });
await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);
console.log('URL after coatings:', page.url());

// Thickness
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratch_shots/journey_thickness.png' });
await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);
console.log('URL after thickness:', page.url());

// Tint
await page.getByRole('button', { name: 'CONTINUE' }).click();
await page.waitForTimeout(300);
console.log('URL after tint:', page.url());

// Final review
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratch_shots/journey_review.png' });
await page.getByRole('button', { name: 'GENERATE REPORT' }).click();
await page.waitForTimeout(300);
console.log('URL after review:', page.url());
await page.screenshot({ path: 'scratch_shots/journey_report.png' });

// Share
await page.getByRole('button', { name: 'SHARE REPORT' }).click();
await page.waitForTimeout(300);
console.log('URL after report:', page.url());
await page.getByText('Email', { exact: true }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratch_shots/journey_share_toast.png' });

await page.getByRole('button', { name: 'DONE' }).click();
await page.waitForTimeout(300);
console.log('URL after share:', page.url());
await page.screenshot({ path: 'scratch_shots/journey_success.png' });

console.log('Console errors during journey2:', JSON.stringify(errors, null, 2));
await browser.close();
