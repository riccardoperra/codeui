import {
	Button,
	Checkbox,
	OptionCardGroup,
	SegmentedControl,
	SegmentedControlItem,
	SettingsGroup,
	SettingsRow,
	Stack,
} from "@codeui/kit";
import * as Dialog from "@codeui/kit/dialog/parts";
import { createSignal, For, type JSX } from "solid-js";
import { CopyIcon, DownloadIcon, ExternalIcon, LayersIcon, SlidersIcon, TextIcon } from "../build-settings/icons";

const formats = [
	{ value: "png", label: "PNG", description: "Sharp text, transparent corners" },
	{ value: "jpeg", label: "JPEG", description: "Smaller file, no transparency" },
	{ value: "svg", label: "SVG", description: "Vector, sharp at any size" },
];
const scales = ["1", "2", "3", "6"];

const more: { label: string; description: string; action: string; icon: () => JSX.Element; disabled?: boolean }[] = [
	{ label: "Open in new tab", description: "See it before you save it", action: "Open", icon: ExternalIcon },
	{ label: "Export one image per tab", description: "Needs two tabs or more", action: "Export", icon: LayersIcon, disabled: true },
	{ label: "Copy alt text", description: "Text for screen readers and social posts", action: "Copy", icon: TextIcon },
	{ label: "Export settings…", description: "Format, scale and tabs for every export", action: "Edit", icon: SlidersIcon },
];

export default function DialogExport() {
	const [format, setFormat] = createSignal("png");
	const [scale, setScale] = createSignal("3");
	const name = () => formats.find(item => item.value === format())?.label;
	return (
		<Dialog.Root>
			<Dialog.Trigger as={Button} variant="primary" leftIcon={<DownloadIcon />}>
				Export
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Positioner size="export">
					<Dialog.Content size="export" chrome="inset">
						<Dialog.Header>
							<Dialog.Title>Export</Dialog.Title>
							<Dialog.CloseButton aria-label="Close export" />
						</Dialog.Header>
						<Dialog.Body layout="split">
							<Dialog.Section variant="well" aria-label="Preview">
								<Preview />
							</Dialog.Section>
							<Stack direction="column" gap="3">
								<SettingsGroup>
									<SettingsRow label="Format" layout="wide">
										{control => (
											<OptionCardGroup {...control} orientation="vertical" items={formats} value={format()} onChange={setFormat} />
										)}
									</SettingsRow>
									<SettingsRow label="Scale" description={`${593 * Number(scale())} × ${469 * Number(scale())} px`} layout="wide">
										{control => (
											<SegmentedControl {...control} size="sm" fluid value={scale()} onChange={setScale}>
												<For each={scales}>{value => <SegmentedControlItem value={value}>{value}x</SegmentedControlItem>}</For>
											</SegmentedControl>
										)}
									</SettingsRow>
								</SettingsGroup>
								<Checkbox size="sm" label="Remember as default" />
							</Stack>
						</Dialog.Body>
						<Dialog.Footer>
							<Button size="sm" variant="secondary" leftIcon={<CopyIcon />}>
								Copy image
							</Button>
							<Button size="sm" variant="primary" leftIcon={<DownloadIcon />}>
								Download {name()} · {scale()}x
							</Button>
						</Dialog.Footer>
						<Dialog.Section variant="well" title="More">
							<For each={more}>
								{item => (
									<SettingsRow label={item.label} description={item.description} picture={<item.icon />} compactControl>
										{control => (
											<Button aria-describedby={control["aria-labelledby"]} size="sm" variant="secondary" ghost disabled={item.disabled}>
												{item.action}
											</Button>
										)}
									</SettingsRow>
								)}
							</For>
						</Dialog.Section>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

/** A schematic of the snippet in its own colours: the gradient frame, the window and its code. */
function Preview() {
	return (
		<svg viewBox="0 0 400 300" width="100%" role="img" aria-label="Preview of index.tsx">
			<defs>
				<linearGradient id="export-demo-frame" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="#e0915c" />
					<stop offset="0.55" stop-color="#c35ad6" />
					<stop offset="1" stop-color="#7c3aed" />
				</linearGradient>
			</defs>
			<rect width="400" height="300" rx="8" fill="url(#export-demo-frame)" />
			<rect x="60" y="62" width="280" height="176" rx="12" fill="#16161a" />
			<circle cx="82" cy="84" r="5" fill="#ff5f57" />
			<circle cx="98" cy="84" r="5" fill="#febc2e" />
			<circle cx="114" cy="84" r="5" fill="#28c840" />
			<g stroke="#c792ea" stroke-opacity="0.7" stroke-width="7" stroke-linecap="round">
				<path d="M82 118h150M98 140h110M98 162h170M82 184h70M98 206h120" />
			</g>
		</svg>
	);
}
