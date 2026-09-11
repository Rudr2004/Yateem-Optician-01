import { chromium } from 'playwright';

const base = 'http://localhost:5180';
const routes = [
  '/', '/customer', '/frame-selection', '/measure/intro', '/measure/camera',
  '/measure/results', '/measure/validation', '/lens', '/coatings',
  '/thickness', '/tint', '/review', '/report', '/share', '/success', '/more',
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
const allErrors = [];

page.on('pageerror', (err) => allErrors.push({ route: 'unknown', error: String(err) }));

for (const route of routes) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto(`${base}/#${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const bodyText = await page.textContent('body');
  const has404 = /404|not found/i.test(bodyText || '');
  console.log(`${route} -> ${has404 ? 'POSSIBLE 404!' : 'OK'} | errors: ${JSON.stringify(errors)}`);
  const safeName = route.replace(/\//g, '_') || 'root';
  await page.screenshot({ path: `scratch_shots/${safeName}.png` });
}

await browser.close();
