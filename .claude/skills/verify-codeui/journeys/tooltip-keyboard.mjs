export default async ({page, step, check, focus}) => {
 const tooltip = page.getByRole('tooltip');
 await step('Tab to trigger', async () => {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);
 });
 await check('trigger has keyboard focus', async () => (await focus()).name === 'Hover me');
 await check('focus opens tooltip', async () => await tooltip.isVisible());
 await step('Escape closes tooltip', () => page.keyboard.press('Escape'));
 await check('tooltip is closed', async () => !(await tooltip.isVisible()));
 await check('focus stays on trigger', async () => (await focus()).name === 'Hover me');
};
