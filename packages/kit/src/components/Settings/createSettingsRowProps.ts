import { type Accessor, createUniqueId, type JSX } from "solid-js";

export type SettingsRowFieldProps = {
	/** Base for the row ids: `<id>-label` and `<id>-description`. */
	id?: string;
	/** The id of one labelable input. The label becomes `<label for>`. */
	controlId?: string;
	description?: JSX.Element;
	details?: JSX.Element;
};

/** Spread on the control so the row's label and description name and describe it. */
export type SettingsRowControlProps = {
	"aria-labelledby": string;
	"aria-describedby"?: string;
};

/**
 * Ids and ARIA props that connect a row's label and description to its
 * control. The row is a `group` named by its label. The control gets
 * `aria-labelledby` and `aria-describedby`; merge them with the control's own
 * description ids rather than replacing those.
 */
export function createSettingsRowProps(props: Accessor<SettingsRowFieldProps>) {
	const fallback = createUniqueId();
	const base = () => props().id ?? `settings-row-${fallback}`;
	const labelId = () => `${base()}-label`;
	const descriptionId = () => (props().description ? `${base()}-description` : undefined);
	return {
		root: () => ({
			id: props().id,
			role: "group" as const,
			"aria-labelledby": labelId(),
			"aria-describedby": descriptionId(),
		}),
		label: () => ({ id: labelId(), for: props().controlId }),
		description: () => ({ id: descriptionId() }),
		control: (): SettingsRowControlProps => ({
			"aria-labelledby": labelId(),
			"aria-describedby": descriptionId(),
		}),
	};
}
