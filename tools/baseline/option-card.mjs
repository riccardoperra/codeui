import { launch, open } from './browser.mjs';
import assert from 'node:assert/strict';
const browser = await launch();
try {
 for (const theme of ['dark', 'light']) {
  const { context, page } = await open(browser, { id: 'designsystem-optioncard--cards', type: 'story' }, theme);
  try {
   const radios = page.getByRole('radio');
   await page.keyboard.press('Tab');
   await radios.nth(0).focus();
   await page.keyboard.press('ArrowRight');
   await radios.nth(1).waitFor();
   assert(await radios.nth(1).isChecked(), 'ArrowRight selects Light');
   assert(await radios.nth(1).evaluate(el => el === document.activeElement), 'ArrowRight moves focus');
   await page.keyboard.press('ArrowRight');
   await page.keyboard.press('ArrowRight');
   assert(await radios.nth(0).isChecked(), 'Arrows wrap and skip disabled choices');
   await page.keyboard.press('Tab');
   assert(!await radios.evaluateAll(els => els.includes(document.activeElement)), 'Tab leaves the group once');
   await page.screenshot({path: `.artifacts/option-card-${theme}.png`});
   await page.setViewportSize({width:390,height:844});
   assert(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth), 'Cards fit phone width');
   await page.screenshot({path: `.artifacts/option-card-${theme}-phone.png`});
  } finally { await context.close(); }
 }
} finally { await browser.close(); }
console.log('OptionCard keyboard and responsive checks passed in both themes');
