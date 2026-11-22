// Read-only browser checks. Start the local preview server (scripts/preview-server.mjs) before running this file.
// Install Playwright in a separate tooling directory, then set PLAYWRIGHT_MODULE
// to its absolute package directory if it is not installed in this project.
// To check the live site, pass its URL and set QA_ALLOW_ORIGIN to exactly that origin.
// Only that origin is requested (everything else is blocked) and nothing is submitted or changed.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const base = new URL(process.argv[2] || 'http://127.0.0.1:8000');
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
if (!isLocal && base.origin !== process.env.QA_ALLOW_ORIGIN) {
  throw new Error('Use a local preview, or set QA_ALLOW_ORIGIN to exactly this origin to check the live site. Third-party requests are blocked either way.');
}
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const output = resolve(process.env.QA_OUTPUT || 'tmp/responsive-qa');
await mkdir(output, { recursive: true });
const results = [];
function check(name, passed, evidence) { results.push({ name, status: passed ? 'PASS' : 'FAIL', evidence }); }
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    for (const theme of ['purple', 'sky-blue', 'white']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        return url.origin === base.origin || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort();
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base.href, { waitUntil: 'load' });
      // Appearance is a local UI setting, not an account or production change.
      await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
      await page.evaluate(() => document.fonts.ready);
      const facts = await page.evaluate(() => {
        const h1 = document.querySelector('.hero h1');
        const button = document.querySelector('.hero-video-toggle');
        const rect = button.getBoundingClientRect();
        return {
          viewport: innerWidth, page: document.documentElement.scrollWidth,
          titleSize: parseFloat(getComputedStyle(h1).fontSize),
          rootSize: parseFloat(getComputedStyle(document.documentElement).fontSize),
          pause: { width: rect.width, height: rect.height, visible: !button.hidden },
          videoHasSource: !!document.querySelector('.hero-video').getAttribute('src'),
          font: getComputedStyle(h1).fontFamily,
        };
      });
      const label = `${width}px/${theme}`;
      check(`${label}: page fits`, facts.page <= facts.viewport + 1, facts);
      // Documented scale: 1.75rem to 2.625rem (28px to 42px at a 16px root).
      check(`${label}: documented title scale (28 to 42px)`, facts.titleSize >= facts.rootSize * 1.75 - 0.1 && facts.titleSize <= facts.rootSize * 2.625 + 0.1, `${facts.titleSize}px`);
      check(`${label}: video control`, facts.pause.visible && facts.pause.width >= 44 && facts.pause.height >= 44, facts.pause);
      check(`${label}: reduced motion keeps poster`, !facts.videoHasSource, facts.videoHasSource);
      if (width < 1024) {
        // The accessible name flips between "Open menu" and "Close menu", so resolve the control once
        // and keep a stable handle. A name-based locator stops matching after the menu opens.
        const menu = page.locator('.menu-toggle');
        check(`${label}: menu control is named Open menu`, await menu.getAttribute('aria-label') === 'Open menu', 'aria-label');
        await menu.click();
        check(`${label}: menu opens`, await menu.getAttribute('aria-expanded') === 'true', 'aria-expanded');
        await page.keyboard.press('Escape');
        check(`${label}: Escape restores focus`, await menu.evaluate(el => document.activeElement === el && el.getAttribute('aria-expanded') === 'false'), 'focus and aria-expanded');
      }
      await page.locator('.certs').evaluate(el => { el.open = true; });
      const certs = await page.evaluate(() => {
        const grid = document.querySelector('.certs-grid');
        const columns = grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;
        return { page: document.documentElement.scrollWidth, viewport: innerWidth, gridClientWidth: grid ? grid.clientWidth : 0, gridScrollWidth: grid ? grid.scrollWidth : 0, columns };
      });
      check(`${label}: expanded certificates fit`, certs.page <= certs.viewport + 1 && certs.gridScrollWidth <= certs.gridClientWidth + 1, certs);
      await page.screenshot({ path: resolve(output, `${width}-${theme}.png`), fullPage: true });
      check(`${label}: no JavaScript errors`, errors.length === 0, errors);
      await context.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(resolve(output, 'results.json'), JSON.stringify(results, null, 2));
}
console.table(results.map(({ name, status }) => ({ name, status })));
if (results.some(result => result.status === 'FAIL')) process.exitCode = 1;
