import { style } from "../../foundation/layer.css";
import { tokens } from "../../foundation/cui.css";
export const root = style({
	display: "flex",
	gap: `var(--cui-stack-gap, ${tokens.space["2"]})`,
	selectors: {
		'&[data-direction="column"]': { flexDirection: "column" },
		'&[data-direction="row"]': { flexDirection: "row" },
		'&[data-wrap="true"]': { flexWrap: "wrap" },
		'&[data-wrap="false"]': { flexWrap: "nowrap" },
		'&[data-align="start"]': { alignItems: "flex-start" },
		'&[data-align="center"]': { alignItems: "center" },
		'&[data-align="end"]': { alignItems: "flex-end" },
		'&[data-align="stretch"]': { alignItems: "stretch" },
		'&[data-align="baseline"]': { alignItems: "baseline" },
		'&[data-justify="start"]': { justifyContent: "flex-start" },
		'&[data-justify="center"]': { justifyContent: "center" },
		'&[data-justify="end"]': { justifyContent: "flex-end" },
		'&[data-justify="between"]': { justifyContent: "space-between" },
		'&[data-justify="around"]': { justifyContent: "space-around" },
		'&[data-justify="evenly"]': { justifyContent: "space-evenly" },
	},
});
