import { Button, Checkbox, OptionCardGroup, SegmentedControl, SegmentedControlItem } from "@codeui/kit";
import * as Dialog from "@codeui/kit/dialog";
import { createSignal, For, type JSX } from "solid-js";
import {
	CameraIcon,
	CopyIcon,
	DownloadIcon,
	ExternalIcon,
	ImageIcon,
	LayersIcon,
	PenIcon,
	SlidersIcon,
	TextIcon,
} from "../build-settings/icons";
import "./export.css";

const formats = [
	{ value: "png", name: "PNG", hint: "Sharp text, transparent corners", icon: ImageIcon },
	{ value: "jpeg", name: "JPEG", hint: "Smaller file, no transparency", icon: CameraIcon },
	{ value: "svg", name: "SVG", hint: "Vector, sharp at any size", icon: PenIcon },
] as const;

const more: { title: string; hint: string; icon: () => JSX.Element; disabled?: boolean }[] = [
	{ title: "Export one image per tab", hint: "Needs two tabs or more", icon: LayersIcon, disabled: true },
	{ title: "Copy alt text", hint: "Text for screen readers and social posts", icon: TextIcon },
	{ title: "Export settings…", hint: "Format, scale and tabs for every export", icon: SlidersIcon },
];

export default function DialogExport() {
	const [format, setFormat] = createSignal<string>("png");
	const [scale, setScale] = createSignal("3");
	const name = () => formats.find(item => item.value === format())?.name;
	return (
		<Dialog.Root>
			<Dialog.Trigger as={Button} theme="primary" leftIcon={<DownloadIcon />}>
				Export…
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Positioner size="export">
					<Dialog.Content size="export" chrome="inset">
						<Dialog.Header>
							<Dialog.Title>Export</Dialog.Title>
							<Dialog.CloseButton aria-label="Close" />
						</Dialog.Header>
						<Dialog.Body layout="split">
							<Dialog.Section variant="well" class="export-demo-preview" aria-label="Preview">
								{/* A schematic of the snippet, in its own colours. */}
								<div class="export-demo-frame" role="img" aria-label="Preview of index.tsx">
									<div class="export-demo-window">
										<span class="export-demo-dots" />
										<span class="export-demo-line" style={{ width: "70%" }} />
										<span class="export-demo-line" style={{ width: "45%" }} />
										<span class="export-demo-line" style={{ width: "60%" }} />
										<span class="export-demo-line" style={{ width: "35%" }} />
									</div>
								</div>
							</Dialog.Section>
							<div class="export-demo-options">
								<OptionCardGroup
									class="export-demo-formats"
									label="Format"
									orientation="vertical"
									value={format()}
									onChange={setFormat}
									items={formats.map(item => ({
										value: item.value,
										label: (
											<span class="export-demo-format">
												<item.icon size={22} />
												<span class="export-demo-format-text">
													{item.name}
													<span class="export-demo-hint">{item.hint}</span>
												</span>
											</span>
										),
									}))}
								/>
								<div class="export-demo-field">
									<span class="export-demo-label" id="export-demo-scale">
										Scale <span class="export-demo-value">{Number(scale()) * 593} × {Number(scale()) * 469} px</span>
									</span>
									<SegmentedControl aria-labelledby="export-demo-scale" value={scale()} onChange={setScale} fluid autoWidth>
										<For each={["1", "2", "3", "6"]}>{value => <SegmentedControlItem value={value}>{value}x</SegmentedControlItem>}</For>
									</SegmentedControl>
								</div>
								<Checkbox label="Remember as default" />
							</div>
						</Dialog.Body>
						<Dialog.Footer>
							<Button theme="secondary" leftIcon={<ExternalIcon size={18} />}>Open in new tab</Button>
							<Button theme="secondary" leftIcon={<CopyIcon size={18} />}>Copy image</Button>
							<Button theme="primary" class="export-demo-download" leftIcon={<DownloadIcon size={18} />}>
								Download {name()} · {scale()}x
							</Button>
						</Dialog.Footer>
						<Dialog.Section variant="well" title="More" columns={2}>
							<For each={more}>
								{item => (
									<button type="button" class="export-demo-action" disabled={item.disabled}>
										<span class="export-demo-tile"><item.icon /></span>
										<span class="export-demo-format-text">
											{item.title}
											<span class="export-demo-hint">{item.hint}</span>
										</span>
									</button>
								)}
							</For>
						</Dialog.Section>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
