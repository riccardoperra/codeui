import type { SettingsGroupProps, SettingsRowProps } from "@codeui/kit";
import type * as P from "@codeui/kit/settings/parts";
import type { PropNotes } from "./notes";

export type SettingsRow = Pick<SettingsRowProps, "label" | "description" | "details" | "picture" | "marker" | "children" | "controlId" | "layout" | "compactControl" | "id" | "classes" | "class">;
export type SettingsGroup = Pick<SettingsGroupProps, "title" | "description" | "children" | "id" | "classes" | "class">;
export type SettingsRowRoot = Pick<P.RowProps, "layout" | "compactControl" | "class">;
export type SettingsRowLabel = Pick<P.LabelProps, "for" | "class">;
export type SettingsRowDescription = Pick<P.DescriptionProps, "class">;
export type SettingsRowDetails = Pick<P.DetailsProps, "class">;
export type SettingsRowControl = Pick<P.ControlProps, "class">;
export type SettingsRowPicture = Pick<P.PictureProps, "class">;
export type SettingsRowMarker = Pick<P.MarkerProps, "class">;
export type SettingsGroupRoot = Pick<P.GroupProps, "class">;
export type SettingsGroupTitle = Pick<P.GroupTitleProps, "as" | "class">;
export type SettingsGroupDescription = Pick<P.GroupDescriptionProps, "class">;
export type SettingsGroupContent = Pick<P.GroupContentProps, "class">;

const cls = { class: { description: "Class merged after the kit styles." } };
export const notes = {
	SettingsRow: {
		label: { description: "Row title. It names the row group and the control." },
		description: { description: "One line under the label. It describes the row group and the control." },
		details: { description: "Extra content under the description, such as requirements or links." },
		picture: { description: "Content before the text, such as a thumbnail. Hide decorative art with aria-hidden." },
		marker: { description: "Content after the label, such as a New or Experimental badge. It joins the accessible name." },
		children: { description: "The control. A function child receives aria-labelledby and aria-describedby for the control. It runs once." },
		controlId: { description: "Id of one labelable input. The label renders as <label for> and clicking it focuses the input." },
		layout: { default: '"inline"', description: "inline puts the control on the right. wide puts it under the text at full width." },
		compactControl: { default: "false", description: "Keeps a small control, such as a switch, inline below 900px." },
		id: { description: "Root id, and the base of <id>-label and <id>-description." },
		classes: { description: "Classes keyed by settings-row anatomy part." },
		...cls,
	},
	SettingsGroup: {
		title: { description: "Heading above the island. It names the section." },
		description: { description: "Meta text under the title. It describes the section." },
		children: { description: "The rows." },
		id: { description: "Root id, and the base of <id>-title and <id>-description." },
		classes: { description: "Classes keyed by settings-group anatomy part." },
		...cls,
	},
	SettingsRowRoot: {
		layout: { default: '"inline"', description: "Sets data-layout. wide stacks the control under the text." },
		compactControl: { default: "false", description: "Sets data-compact-control, which keeps the control inline below 900px." },
		...cls,
	},
	SettingsRowLabel: { for: { description: "Id of one labelable input. The part renders <label for> when set, and <span> otherwise." }, ...cls },
	SettingsGroupTitle: { as: { default: '"h3"', description: "Heading element. Match the outline of the page." }, ...cls },
} satisfies PropNotes;
