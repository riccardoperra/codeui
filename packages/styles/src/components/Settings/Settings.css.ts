import { globalStyle, style } from "../../foundation/layer.css";
import { tokens as t } from "../../foundation/cui.css";

/** Inkstone §9.2: below 900px the control drops under the text. */
const narrow = "screen and (max-width: 900px)";

export const row = style(
	{
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		gridTemplateAreas: '"label control" "description control" "details control"',
		alignContent: "center",
		alignItems: "center",
		columnGap: t.space["6"],
		minHeight: t.control.height.xl,
		padding: `${t.space["2"]} ${t.space["4"]}`,
		boxSizing: "border-box",
		minWidth: 0,
		fontFamily: t.font.family.sans,
		color: t.text.default,
		selectors: {
			"&[data-layout=wide]": {
				gridTemplateColumns: "minmax(0, 1fr)",
				gridTemplateAreas: '"label" "description" "details" "control"',
				padding: `${t.space["3"]} ${t.space["4"]} ${t.space["2"]}`,
			},
		},
		"@media": {
			[narrow]: {
				columnGap: t.space["3"],
				selectors: {
					"&:not([data-compact-control])": {
						gridTemplateColumns: "minmax(0, 1fr)",
						gridTemplateAreas: '"label" "description" "details" "control"',
						padding: `${t.space["3"]} ${t.space["4"]}`,
					},
				},
			},
		},
	},
	"row",
);

export const label = style(
	{
		gridArea: "label",
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		gap: t.space["1.5"],
		minWidth: 0,
		fontSize: t.font.size.sm,
		fontWeight: t.font.weight.medium,
		lineHeight: t.font.lineHeight.compact,
		color: t.text.default,
		overflowWrap: "anywhere",
	},
	"label",
);

export const description = style(
	{
		gridArea: "description",
		minWidth: 0,
		marginTop: t.space["0.5"],
		fontSize: t.font.size.xs,
		lineHeight: t.font.lineHeight.normal,
		color: t.text.muted,
		overflowWrap: "anywhere",
	},
	"description",
);

export const details = style(
	{
		gridArea: "details",
		minWidth: 0,
		marginTop: t.space["2"],
		fontSize: t.font.size.xs,
		lineHeight: t.font.lineHeight.normal,
		color: t.text.muted,
	},
	"details",
);

export const control = style(
	{
		gridArea: "control",
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		minWidth: 0,
	},
	"control",
);

export const picture = style(
	{
		gridArea: "picture",
		alignSelf: "start",
		display: "flex",
		minWidth: 0,
	},
	"picture",
);

export const marker = style({ display: "inline-flex", flex: "none" }, "marker");

globalStyle(`${row}[data-layout=wide] > ${control}`, {
	display: "block",
	marginTop: t.space["3"],
});
globalStyle(`${row}:not([data-compact-control]) > ${control}`, {
	"@media": { [narrow]: { justifyContent: "flex-start", marginTop: t.space["3"] } },
});

globalStyle(`${row}:has(> ${picture})`, {
	gridTemplateColumns: "auto minmax(0, 1fr) auto",
	gridTemplateAreas:
		'"picture label control" "picture description control" "picture details control"',
	columnGap: t.space["4"],
});
globalStyle(`${row}[data-layout=wide]:has(> ${picture})`, {
	gridTemplateColumns: "auto minmax(0, 1fr)",
	gridTemplateAreas:
		'"picture label" "picture description" "picture details" "picture control"',
});
globalStyle(`${row}:not([data-compact-control]):has(> ${picture})`, {
	"@media": {
		[narrow]: {
			gridTemplateColumns: "auto minmax(0, 1fr)",
			gridTemplateAreas:
				'"picture label" "picture description" "picture details" "picture control"',
			columnGap: t.space["3"],
		},
	},
});

export const group = style(
	{
		display: "flex",
		flexDirection: "column",
		gap: t.space["2"],
		minWidth: 0,
		fontFamily: t.font.family.sans,
		color: t.text.default,
	},
	"group",
);

export const groupTitle = style(
	{
		margin: 0,
		padding: `0 ${t.space["1"]}`,
		fontSize: t.font.size.md,
		fontWeight: t.font.weight.semibold,
		lineHeight: t.font.lineHeight.compact,
		color: t.text.default,
	},
	"groupTitle",
);

export const groupDescription = style(
	{
		margin: 0,
		padding: `0 ${t.space["1"]}`,
		fontSize: t.font.size.xs,
		lineHeight: t.font.lineHeight.normal,
		color: t.text.muted,
	},
	"groupDescription",
);

export const groupContent = style(
	{
		display: "flex",
		flexDirection: "column",
		padding: `${t.space["1.5"]} 0`,
		borderRadius: t.radius.card,
		background: t.surface.canvas,
	},
	"groupContent",
);
