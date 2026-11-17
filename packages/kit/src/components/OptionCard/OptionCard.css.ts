import { style, globalStyle, recipe } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";
import { transition } from "../../foundation/motion.css";

const phone = "(max-width: 768px)";
const finePointer = "(hover: hover) and (pointer: fine)";
const reducedMotion = "(prefers-reduced-motion: reduce)";
/** One fill step above a field, for a hovered or selected card (Inkstone §2.1). */
const raised = `color-mix(in srgb, ${t.surface.input}, ${t.text.default} 6%)`;

/** Cards three across in a settings pane, stacked on a phone. */
export const root = style({
	display: "grid",
	width: "100%",
	// At most three columns, each at least 128px wide.
	gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, max(${t.space["32"]}, (100% - 2 * ${t.space["2"]}) / 3)), 1fr))`,
	gap: t.space["2"],
	fontFamily: t.font.family.sans,
	lineHeight: t.font.lineHeight.sm,
	color: t.text.default,
	selectors: { "&[data-orientation=vertical]": { gridTemplateColumns: "1fr" } },
	"@media": { [phone]: { gridTemplateColumns: "minmax(0, 1fr)" } },
});
export const label = style({
	gridColumn: "1 / -1",
	fontSize: t.font.size.sm,
	fontWeight: t.font.weight.medium,
	lineHeight: t.font.lineHeight.sm,
});
export const description = style({
	gridColumn: "1 / -1",
	fontSize: t.font.size.xs,
	lineHeight: t.font.lineHeight.xs,
	color: t.text.muted,
});
export const errorMessage = style({
	gridColumn: "1 / -1",
	fontSize: t.font.size.xs,
	lineHeight: t.font.lineHeight.xs,
	color: t.text.danger,
});
export const item = style({ position: "relative", minWidth: 0, display: "flex" });
export const itemInput = style({});
export const itemControl = style({});
export const itemIndicator = style({});
/**
 * The card: field fill, radius 12, padding 12, no border. Selected: one fill
 * step up and a 2px accent ring inside the edge. Press scales to 0.98.
 */
export const itemLabel = recipe({
	base: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		alignItems: "stretch",
		gap: t.space["1"],
		width: "100%",
		minWidth: 0,
		boxSizing: "border-box",
		minHeight: t.space["8"],
		padding: t.space["3"],
		borderRadius: t.radius.md,
		background: t.surface.input,
		color: t.text.default,
		fontSize: t.font.size.sm,
		lineHeight: t.font.lineHeight.sm,
		cursor: "pointer",
		userSelect: "none",
		overflowWrap: "anywhere",
		transition: transition(["transform", "background-color"]),
		selectors: {
			"&[data-checked]": {
				background: raised,
				outline: `${t.focus.width} solid ${t.accent.focus}`,
				outlineOffset: `calc(-1 * ${t.focus.width})`,
			},
			"&:active:not([data-disabled])": { transform: "scale(0.98)" },
			"&[data-disabled]": { cursor: "not-allowed", color: t.text.hint },
		},
		"@media": {
			"(pointer: coarse)": { minHeight: t.space["10"] },
			[finePointer]: {
				selectors: { "&:hover:not([data-disabled])": { background: raised } },
			},
			[reducedMotion]: {
				transition: transition(["background-color"]),
				selectors: { "&:active:not([data-disabled])": { transform: "none" } },
			},
			[phone]: {
				flexDirection: "row",
				alignItems: "center",
				gap: t.space["3"],
			},
		},
	},
	variants: {
		variant: {
			card: {},
			tile: { padding: t.space["2"] },
		},
	},
});
globalStyle(`${item}:has(input:focus-visible) ${itemLabel.classNames.base}`, {
	outline: `${t.focus.width} solid ${t.focus.color}`,
	outlineOffset: t.focus.offset,
});
globalStyle(`${item}[data-invalid] ${itemLabel.classNames.base}`, {
	outline: `${t.focus.width} solid ${t.action.danger.base}`,
	outlineOffset: `calc(-1 * ${t.focus.width})`,
});
/** Title and description, 2px apart. */
export const itemText = style({
	display: "flex",
	flexDirection: "column",
	gap: t.space["0.5"],
	minWidth: 0,
});
/** The title and its badge on one row, as tall with the badge as without. */
export const itemName = style({
	display: "flex",
	alignItems: "center",
	flexWrap: "wrap",
	gap: t.space["2"],
	minHeight: t.space["5"],
	fontSize: t.font.size.sm,
	fontWeight: t.font.weight.medium,
	lineHeight: t.font.lineHeight.sm,
	selectors: { "[data-checked] &": { fontWeight: t.font.weight.semibold } },
});
export const itemDescription = style({
	fontSize: t.font.size.xs,
	lineHeight: t.font.lineHeight.xs,
	color: t.text.muted,
});
/** A 68px well in the page fill that holds the option's schematic. */
export const preview = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	height: `calc(${t.space["16"]} + ${t.space["1"]})`,
	marginBottom: t.space["1"],
	borderRadius: `calc(${t.radius.md} - ${t.space["1"]})`,
	background: t.surface.panel,
	color: t.text.default,
	overflow: "hidden",
	pointerEvents: "none",
	"@media": {
		[phone]: { width: `calc(${t.space["24"]} + ${t.space["4"]})`, marginBottom: 0 },
	},
});
globalStyle(`[data-variant=tile] > ${preview}`, { marginBottom: 0 });
/** CodeImage's Default tag: Micro 500, 1px 6px, radius 6. */
export const badge = style({});
// Two selectors, so the tag wins over the Badge's own size and weight.
globalStyle(`${badge}[data-cui="option-card-badge"]`, {
	border: 0,
	fontWeight: t.font.weight.medium,
	lineHeight: t.font.lineHeight.badge,
});
