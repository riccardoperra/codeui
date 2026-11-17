export default async ({ page, step, check, focus, axe }) => {
  const input = page.getByRole('combobox', { name: 'Language' });
  const out = page.locator('output');
  await step('tab to the combobox', () => page.keyboard.press('Tab'));
  await check('focus on the combobox showing Rust', async () => ({ pass: (await focus()).role === 'combobox' && (await input.inputValue()) === 'Rust', value: await input.inputValue() }));
  await step('ArrowDown opens the list', () => page.keyboard.press('ArrowDown'));
  await step('Escape closes the list', () => page.keyboard.press('Escape'));
  await check('first Escape keeps Rust', async () => ({ pass: (await input.inputValue()) === 'Rust' && (await out.textContent()) === 'Selected: rs', value: await input.inputValue(), out: await out.textContent() }));
  await step('second Escape', () => page.keyboard.press('Escape'));
  await check('second Escape clears the text and the value', async () => ({ pass: (await input.inputValue()) === '' && (await out.textContent()) === 'Selected: none', value: await input.inputValue(), out: await out.textContent() }));
  await step('Tab away', () => page.keyboard.press('Tab'));
  await check('the cleared value does not come back on blur', async () => ({ pass: (await input.inputValue()) === '', value: await input.inputValue() }));
  await step('Shift+Tab back and type Ty', async () => { await page.keyboard.press('Shift+Tab'); await page.keyboard.type('Ty'); });
  await step('ArrowDown, Enter picks TypeScript', async () => { await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); });
  await check('Enter selects ts', async () => ({ pass: (await out.textContent()) === 'Selected: ts', out: await out.textContent() }));
  await step('Select all and Backspace', async () => { await page.keyboard.press('ControlOrMeta+a'); await page.keyboard.press('Backspace'); });
  await check('deleting the text clears the value', async () => ({ pass: (await out.textContent()) === 'Selected: none', out: await out.textContent() }));
  await axe('cleared');
};
