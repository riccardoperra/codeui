import { style } from '@vanilla-extract/css';
import { tokens, themeVars, themeTokens, layoutVars, breakpoints, responsiveStyle } from '@codeui/kit/tokens';

export const consumer = style({
  color: tokens.text.default,
  background: themeVars.background,
  borderColor: themeTokens.colors.background,
  padding: tokens.space['2'],
  vars: { [layoutVars.layoutBackgroundColor]: tokens.surface.canvas },
  '@media': { [`(min-width: ${breakpoints.md}px)`]: { margin: themeTokens.spacing['2'] } },
  ...responsiveStyle({ lg: { color: tokens.text.muted } }),
});
