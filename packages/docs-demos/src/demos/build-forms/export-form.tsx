import { Button, NumberField, Stack, Text, TextArea, TextField } from "@codeui/kit";
import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";

type ExportSettings = {
	fileName: string;
	caption: string;
	width: number | null | undefined;
};

type Errors = Partial<Record<keyof ExportSettings, string>>;

function validate(values: ExportSettings): Errors {
	const errors: Errors = {};
	if (!values.fileName.trim()) errors.fileName = "Enter a file name.";
	else if (!/^[\w-]+$/.test(values.fileName)) errors.fileName = "Use letters, numbers, dashes and underscores.";
	if (values.caption.length > 120) errors.caption = "Keep the caption under 120 characters.";
	if (values.width == null) errors.width = "Enter an export width.";
	return errors;
}

/** Stands in for a request to your API. */
function saveExportSettings(values: ExportSettings) {
	return new Promise<ExportSettings>(resolve => setTimeout(() => resolve(values), 600));
}

export default function ExportForm() {
	const [values, setValues] = createStore<ExportSettings>({ fileName: "", caption: "", width: 1280 });
	const [submitted, setSubmitted] = createSignal(false);
	const [saving, setSaving] = createSignal(false);
	const [saved, setSaved] = createSignal<string>();

	// Show errors only after the first submit, then update them on every edit.
	const errors = () => (submitted() ? validate(values) : {});
	const state = (key: keyof ExportSettings) => (errors()[key] ? "invalid" : "valid");

	const onSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		setSubmitted(true);
		setSaved(undefined);
		if (Object.keys(validate(values)).length > 0) {
			// Move focus to the first field that failed, so keyboard and screen reader users land on it.
			const form = event.currentTarget as HTMLFormElement;
			queueMicrotask(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
			return;
		}
		setSaving(true);
		const result = await saveExportSettings({ ...values });
		setSaving(false);
		setSaved(`Saved ${result.fileName}.png at ${result.width} px.`);
	};

	return (
		<form noValidate onSubmit={onSubmit} style={{ width: "360px" }}>
			<Stack gap="4">
				<TextField
					name="fileName"
					label="File name"
					required
					autocomplete="off"
					description="Without the extension."
					value={values.fileName}
					onChange={value => setValues("fileName", value)}
					validationState={state("fileName")}
					errorMessage={errors().fileName}
				/>
				<TextArea
					name="caption"
					label="Caption"
					description="Optional. Shown under the image."
					options={{ autoResize: true }}
					value={values.caption}
					onChange={value => setValues("caption", value)}
					validationState={state("caption")}
					errorMessage={errors().caption}
				/>
				<NumberField
					name="width"
					label="Export width"
					required
					postfix=" px"
					min={320}
					max={4096}
					step={160}
					value={values.width}
					onChange={value => setValues("width", value)}
					validationState={state("width")}
					errorMessage={errors().width}
				/>
				<Stack direction="row" gap="3" align="center">
					<Button type="submit" theme="primary" loading={saving()}>
						Save settings
					</Button>
					<div role="status">
						<Show when={saved()}>
							<Text size="xs" tone="success">
								{saved()}
							</Text>
						</Show>
					</div>
				</Stack>
			</Stack>
		</form>
	);
}
