import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 1400 } });
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

// Scroll the inner scrollable container to the bottom
await page.evaluate(() => {
  const scrollables = document.querySelectorAll('.overflow-y-auto');
  scrollables.forEach((el) => { el.scrollTop = el.scrollHeight; });
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'scratch_shots/review_bottom.png' });

await browser.close();
