import { style } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";
import { dialogThemeVars } from "../Dialog/Dialog.css";

const coarse = "(pointer: coarse)";
const phone = "(max-width: 767px)";
const reducedMotion = "(prefers-reduced-motion: reduce)";

export const trigger = style({}, "trigger");

export const overlay = style({ position: "fixed", inset: 0, zIndex: 50 }, "overlay");

/*
 * Bottom centre with no scrim, so the canvas behind stays visible as the
 * preview. It opens from the keyboard many times a session, so it has no
 * presence animation.
 */
export const content = style(
	{
		vars: { [dialogThemeVars.panelRadius]: t.radius.command },
		position: "fixed",
		left: "50%",
		bottom: t.space["4"],
		zIndex: 50,
		boxSizing: "border-box",
		width: `min(640px, calc(100vw - 2 * ${t.space["4"]}))`,
		maxHeight: `calc(100dvh - 2 * ${t.space["4"]})`,
		padding: t.space["2"],
		gap: t.space["1"],
		transform: "translateX(-50%)",
		fontSize: t.font.size.sm,
		animation: "none",
		selectors: { "&[data-expanded]": { animation: "none" } },
		"@media": {
			[phone]: { top: t.space["2"], bottom: "auto" },
			[reducedMotion]: {
				animationName: "none",
				selectors: { "&[data-expanded]": { animationName: "none" } },
			},
		},
	},
	"content",
);

export const title = style(
	{
		position: "absolute",
		width: "1px",
		height: "1px",
		margin: "-1px",
		padding: 0,
		overflow: "hidden",
		clip: "rect(0 0 0 0)",
		whiteSpace: "nowrap",
		border: 0,
	},
	"title",
);

export const search = style(
	{
		display: "flex",
		alignItems: "center",
		flexShrink: 0,
		gap: t.space["3"],
		minHeight: t.control.height.sm,
		padding: `0 ${t.space["3"]}`,
		borderRadius: t.radius.lg,
		background: t.surface.input,
		color: t.text.hint,
		"@media": { [coarse]: { minHeight: t.control.height.md } },
	},
	"search",
);

export const searchInput = style(
	{
		appearance: "none",
		flex: 1,
		minWidth: 0,
		height: t.control.height.sm,
		padding: 0,
		border: 0,
		outline: "none",
		background: "transparent",
		color: t.text.input,
		font: "inherit",
		fontSize: t.font.size.caption,
		selectors: { "&::placeholder": { color: t.text.hint, opacity: 1 } },
		"@media": {
			[coarse]: { height: t.control.height.md },
			// Below 16px a phone zooms the page into the field.
			[phone]: { fontSize: t.font.size.md },
		},
	},
	"searchInput",
);

export const hint = style(
	{
		flexShrink: 0,
		color: t.text.hint,
		fontSize: t.font.size.xs,
		whiteSpace: "nowrap",
		"@media": { [phone]: { display: "none" } },
	},
	"hint",
);

export const listbox = style(
	{
		margin: 0,
		padding: 0,
		listStyle: "none",
		outline: "none",
		maxHeight: `calc(6 * ${t.control.height.sm} + ${t.space["4"]})`,
		overflowY: "auto",
		overscrollBehavior: "contain",
		scrollPaddingBlock: t.space["2"],
		scrollbarWidth: "thin",
		scrollbarColor: `${t.surface.scrollThumb} transparent`,
	},
	"listbox",
);

export const group = style(
	{
		padding: `${t.space["3"]} ${t.space["3"]} ${t.space["1"]}`,
		color: t.text.hint,
		fontSize: t.font.size.xs,
		fontWeight: t.font.weight.semibold,
	},
	"group",
);

export const groupLabel = style({}, "groupLabel");

export const item = style(
	{
		display: "flex",
		alignItems: "center",
		gap: t.space["2"],
		minHeight: t.control.height.sm,
		padding: `0 ${t.space["3"]}`,
		borderRadius: t.radius.nav,
		color: t.text.dialog,
		cursor: "pointer",
		userSelect: "none",
		outline: "none",
		selectors: {
			"&[data-highlighted]": { background: t.surface.input },
			"&:is([data-disabled], :disabled)": { opacity: 0.4, cursor: "not-allowed" },
		},
		"@media": { [coarse]: { minHeight: t.control.height.md } },
	},
	"item",
);

export const leading = style(
	{
		display: "grid",
		placeItems: "center",
		flexShrink: 0,
		width: t.space["5"],
		height: t.space["5"],
		color: t.text.hint,
		selectors: { [`${item}[data-highlighted] &`]: { color: t.text.dialog } },
	},
	"leading",
);

export const itemLabel = style(
	{
		flex: 1,
		minWidth: 0,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	"itemLabel",
);

export const itemDescription = style(
	{
		flexShrink: 0,
		maxWidth: "40%",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		color: t.text.hint,
		fontSize: t.font.size.xs,
	},
	"itemDescription",
);

export const itemIndicator = style(
	{
		display: "inline-flex",
		flexShrink: 0,
		width: t.space["4"],
		height: t.space["4"],
		color: t.action.brand.base,
	},
	"itemIndicator",
);

export const shortcut = style(
	{
		flexShrink: 0,
		color: t.text.hint,
		fontSize: t.font.size.xs,
		whiteSpace: "nowrap",
	},
	"shortcut",
);

export const empty = style(
	{
		margin: 0,
		padding: t.space["3"],
		color: t.text.hint,
		fontSize: t.font.size.sm,
	},
	"empty",
);
