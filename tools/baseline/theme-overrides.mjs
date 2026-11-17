// An app overrides tokens on :root with plain, unlayered CSS. The override must reach a
// kit component inside a nested [data-cui-theme] scope, and mode values must still follow
// the nested scope.
import assert from 'node:assert/strict';
import { launch, open } from './browser.mjs';

const app = `:root { --cui-radius-md: 3px; --cui-action-brand-base: rgb(1, 2, 3); }`;
const focus = { dark: '#63b3ed', light: '#0083e5' };
const browser = await launch();
try {
 for (const theme of ['dark', 'light']) {
  const nested = theme === 'dark' ? 'light' : 'dark';
  const { context, page, errors } = await open(browser, { id: 'designsystem-button--primary', type: 'story' }, theme);
  try {
   assert.deepEqual(errors, [], `${theme}: story renders without errors`);
   await page.addStyleTag({ content: app });
   const result = await page.evaluate(nested => {
    const root = document.querySelector('#storybook-root');
    root.setAttribute('data-cui-theme', nested);
    const button = root.querySelector('button');
    const style = getComputedStyle(button);
    return {
     background: style.backgroundColor,
     radius: style.borderTopLeftRadius,
     focusColor: style.getPropertyValue('--cui-focus-color').trim(),
     colorScheme: getComputedStyle(root).colorScheme,
    };
   }, nested);
   assert.equal(result.colorScheme, nested, `${theme} page, ${nested} scope: the scope switches mode`);
   assert.equal(result.background, 'rgb(1, 2, 3)', `${theme} page, ${nested} scope: :root brand override reaches the button`);
   assert.equal(result.radius, '3px', `${theme} page, ${nested} scope: :root radius override reaches the button`);
   assert.equal(result.focusColor, focus[nested], `${theme} page, ${nested} scope: focus color follows the nested mode`);
  } finally { await context.close(); }
 }
} finally { await browser.close(); }
console.log('Token overrides on :root reach nested theme scopes in both themes');
