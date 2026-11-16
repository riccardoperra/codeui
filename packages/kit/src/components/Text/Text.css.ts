import { style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
export const root = style({
	fontFamily: tokens.font.family.sans,
	fontSize: tokens.font.size.sm,
	fontWeight: tokens.font.weight.normal,
	lineHeight: tokens.font.lineHeight.normal,
	color: tokens.text.default,
	selectors: {
		'&[data-size="badge"]': { fontSize: tokens.font.size["badge"] },
		'&[data-size="xs"]': { fontSize: tokens.font.size["xs"] },
		'&[data-size="caption"]': { fontSize: tokens.font.size["caption"] },
		'&[data-size="sm"]': { fontSize: tokens.font.size["sm"] },
		'&[data-size="md"]': { fontSize: tokens.font.size["md"] },
		'&[data-size="lg"]': { fontSize: tokens.font.size["lg"] },
		'&[data-size="xl"]': { fontSize: tokens.font.size["xl"] },
		'&[data-size="2xl"]': { fontSize: tokens.font.size["2xl"] },
		'&[data-weight="normal"]': { fontWeight: tokens.font.weight["normal"] },
		'&[data-weight="medium"]': { fontWeight: tokens.font.weight["medium"] },
		'&[data-weight="semibold"]': { fontWeight: tokens.font.weight["semibold"] },
		'&[data-tone="default"]': { color: tokens.text.default },
		'&[data-tone="muted"]': { color: tokens.text.muted },
		'&[data-tone="hint"]': { color: tokens.text.hint },
		'&[data-tone="label"]': { color: tokens.text.label },
		'&[data-tone="danger"]': { color: tokens.text.danger },
		'&[data-tone="success"]': {
			color: `color-mix(in srgb, ${tokens.action.success.active} 85%, ${tokens.text.panel})`,
		},
	},
});
