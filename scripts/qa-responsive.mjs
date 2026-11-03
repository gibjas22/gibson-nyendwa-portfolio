// Read-only browser checks. Start a local HTTP server before running this file.
// Install Playwright in a separate tooling directory, then set PLAYWRIGHT_MODULE
// to its absolute package directory if it is not installed in this project.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const base = new URL(process.argv[2] || 'http://127.0.0.1:8000');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) {
  throw new Error('Use a local preview. This check blocks third-party requests.');
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
      check(`${label}: documented title scale`, facts.titleSize <= facts.rootSize * 2.625 + 0.1, facts.titleSize);
      check(`${label}: video control`, facts.pause.visible && facts.pause.width >= 44 && facts.pause.height >= 44, facts.pause);
      check(`${label}: reduced motion keeps poster`, !facts.videoHasSource, facts.videoHasSource);
      if (width < 1024) {
        const menu = page.getByRole('button', { name: 'Open menu', exact: true });
        await menu.click();
        check(`${label}: menu opens`, await menu.getAttribute('aria-expanded') === 'true', 'aria-expanded');
        await page.keyboard.press('Escape');
        check(`${label}: Escape restores focus`, await menu.evaluate(el => document.activeElement === el && el.getAttribute('aria-expanded') === 'false'), 'focus and aria-expanded');
      }
      await page.locator('.certs').evaluate(el => { el.open = true; });
      check(`${label}: expanded certificates fit`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'expanded layout');
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
