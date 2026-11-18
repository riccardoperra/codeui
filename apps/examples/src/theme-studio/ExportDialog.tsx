import { Button, Dialog, DialogPanelContent, DialogPanelFooter, SegmentedControl, SegmentedControlItem, SettingsGroup, SettingsRow, Stack, TextArea } from "@codeui/kit";
import * as D from "@codeui/kit/dialog/parts";
import Copy from "lucide-solid/icons/copy";
import Download from "lucide-solid/icons/download";
import { createMemo, createSignal, For, Show } from "solid-js";
import { tokenize } from "./highlight";
import { createArtStyle, Line } from "./Preview";
import { type ExportFormat, useStudio } from "./studio";

/** Both dialogs open from the export control or the command menu, so that is where focus goes back to. */
export const exportButtonId = "ts-export";
const returnFocus = (event: Event) => {
	event.preventDefault();
	document.getElementById(exportButtonId)?.focus();
};

const formats: { id: ExportFormat; name: string; description: string }[] = [
	{ id: "ts", name: "TypeScript", description: "A createTheme module, ready for CodeImage." },
	{ id: "json", name: "JSON", description: "The same data. Theme Studio imports it back." },
];

/** The export: a blocking surface, so its choice is segments, not a select (DESIGN.md §9.1). */
export function ExportDialog() {
	const studio = useStudio();
	const style = createArtStyle();
	const format = () => formats.find(item => item.id === studio.format())!;
	// The file is shown in the theme it describes, coloured by the same scanner as the preview.
	const lines = createMemo(() => tokenize(studio.source().trimEnd(), studio.format()));
	return (
		<Dialog open={studio.exportOpen()} onOpenChange={studio.setExportOpen} title="Export theme" size="export" chrome="inset" closeLabel="Close export" onCloseAutoFocus={returnFocus}>
			<DialogPanelContent layout="split">
				<D.Section variant="well" aria-label="Generated file">
					{/* Focusable, so the keyboard can scroll it. */}
					<pre class="ts-art ts-export-code ex-scroll" style={style()} tabindex="0" aria-label={studio.fileName()}>
						<For each={lines()}>{tokens => <Line tokens={tokens} />}</For>
					</pre>
				</D.Section>
				<SettingsGroup>
					<SettingsRow label="Format" description={format().description} layout="wide">
						{control => (
							<SegmentedControl {...control} size="sm" fluid value={studio.format()} onChange={value => studio.setFormat(value as ExportFormat)}>
								<For each={formats}>{item => <SegmentedControlItem value={item.id}>{item.name}</SegmentedControlItem>}</For>
							</SegmentedControl>
						)}
					</SettingsRow>
					<SettingsRow label="File" description={studio.format() === "ts" ? "Goes in packages/highlight/src/lib/themes." : "Keep it to carry on later."} layout="wide">
						<code class="ts-file ex-truncate">{studio.fileName()}</code>
					</SettingsRow>
				</SettingsGroup>
			</DialogPanelContent>
			<DialogPanelFooter>
				<Button theme="secondary" size="sm" leftIcon={<Copy size={16} />} onClick={() => studio.copy()}>
					Copy
				</Button>
				<Button theme="primary" size="sm" leftIcon={<Download size={16} />} onClick={() => studio.download()}>
					Download {studio.fileName()}
				</Button>
			</DialogPanelFooter>
		</Dialog>
	);
}

/** Import: paste what the export wrote. What is wrong is said under the field, where it happened (DESIGN.md §9.10). */
export function ImportDialog() {
	const studio = useStudio();
	const [text, setText] = createSignal("");
	const [errors, setErrors] = createSignal<string[]>([]);
	const close = (open: boolean) => {
		studio.setImportOpen(open);
		if (!open) {
			setText("");
			setErrors([]);
		}
	};
	const submit = () => {
		const found = studio.importTheme(text());
		setErrors(found);
		if (!found.length) close(false);
	};
	return (
		<Dialog open={studio.importOpen()} onOpenChange={close} title="Import theme" size="md" closeLabel="Close import" onCloseAutoFocus={returnFocus}>
			<DialogPanelContent>
				<TextArea
					label="Theme"
					description="Paste the JSON or the TypeScript module from the export dialog."
					classes={{ input: "ts-import ts-mono" }}
					placeholder={"export const myTheme = createTheme({\n  id: 'myTheme',\n  …\n} as const);"}
					spellcheck={false}
					value={text()}
					onChange={value => {
						setText(value);
						setErrors([]);
					}}
					validationState={errors().length ? "invalid" : "valid"}
					errorMessage={
						<ul class="ts-errors">
							<For each={errors().slice(0, 5)}>{error => <li>{error}</li>}</For>
							<Show when={errors().length > 5}>
								<li>And {errors().length - 5} more.</li>
							</Show>
						</ul>
					}
				/>
			</DialogPanelContent>
			<DialogPanelFooter>
				<Stack direction="row" gap="2" justify="end">
					<Button theme="secondary" size="sm" onClick={() => close(false)}>
						Cancel
					</Button>
					<Button theme="primary" size="sm" disabled={!text().trim()} onClick={submit}>
						Import
					</Button>
				</Stack>
			</DialogPanelFooter>
		</Dialog>
	);
}
