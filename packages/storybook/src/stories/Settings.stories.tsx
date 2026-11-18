import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
	Badge,
	Button,
	NumberField,
	OptionCardGroup,
	SegmentedControl,
	SegmentedControlItem,
	SettingsGroup,
	SettingsRow,
	Switch,
} from "@codeui/kit";
import { For, type JSX } from "solid-js";

const meta = {
	title: "DesignSystem/Settings",
	component: SettingsRow,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SettingsRow>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The right pane of CodeImage's Settings dialog: islands sit on the inset surface. */
function Pane(props: { children: JSX.Element; width?: string }) {
	return (
		<div
			style={{
				background: "var(--cui-surface-panel)",
				padding: "var(--cui-space-2) var(--cui-space-6) var(--cui-space-6)",
				display: "flex",
				"flex-direction": "column",
				gap: "var(--cui-space-6)",
				"max-width": props.width ?? "768px",
				"box-sizing": "border-box",
			}}
		>
			{props.children}
		</div>
	);
}

/** Settings segments are 84px per option (Inkstone §6). */
function Segmented(props: {
	options: string[];
	value: string;
	control: { "aria-labelledby": string; "aria-describedby"?: string };
}) {
	return (
		<div
			style={{
				width: `min(100%, calc(84px * ${props.options.length}))`,
				display: "flex",
			}}
		>
			<SegmentedControl {...props.control} defaultValue={props.value} size="sm" fluid>
				<For each={props.options}>
					{option => <SegmentedControlItem value={option}>{option}</SegmentedControlItem>}
				</For>
			</SegmentedControl>
		</div>
	);
}

export const Dialog: Story = {
	render: () => (
		<Pane>
			<SettingsGroup title="Interface">
				<SettingsRow
					id="language"
					label="Language"
					description="The language of the menus, labels and messages."
				>
					{control => (
						<Segmented
							control={control}
							value="English"
							options={["Italian", "English", "German", "Spanish"]}
						/>
					)}
				</SettingsRow>
			</SettingsGroup>
			<SettingsGroup title="Sidebar">
				<SettingsRow
					id="panel-side"
					label="Panel side"
					description="The side of the canvas the sidebar sits on."
				>
					{control => (
						<Segmented control={control} value="Left" options={["Left", "Right"]} />
					)}
				</SettingsRow>
				<SettingsRow
					id="visible"
					label="Visible"
					description="Show the sidebar next to the canvas."
					compactControl
				>
					{control => <Switch {...control} defaultChecked />}
				</SettingsRow>
				<SettingsRow id="padding" label="Padding" description="Space around the code.">
					{control => <NumberField {...control} defaultValue={64} size="sm" />}
				</SettingsRow>
			</SettingsGroup>
		</Pane>
	),
};

export const Wide: Story = {
	render: () => (
		<Pane>
			<SettingsGroup title="Colours">
				<SettingsRow
					id="colour-mode"
					label="Colour mode"
					description="Dark, light, or the same as your system."
					layout="wide"
				>
					{control => (
						<OptionCardGroup
							aria-labelledby={control["aria-labelledby"]}
							defaultValue="dark"
							items={[
								{
									value: "dark",
									label: "Dark",
									description: "Dark surfaces",
									badge: "Default",
								},
								{ value: "light", label: "Light", description: "Light surfaces" },
								{ value: "system", label: "System", description: "Follow your device" },
							]}
						/>
					)}
				</SettingsRow>
			</SettingsGroup>
		</Pane>
	),
};

export const MarkersPictureDetails: Story = {
	render: () => (
		<Pane>
			<SettingsGroup title="Rendering engine" description="Choices not yet default.">
				<SettingsRow
					id="takumi"
					label="Takumi"
					marker={<Badge>Experimental</Badge>}
					description="Use the experimental Takumi engine for image exports."
					compactControl
				>
					{control => <Switch {...control} />}
				</SettingsRow>
				<SettingsRow
					id="model"
					label="On-device model"
					marker={<Badge tone="success">New</Badge>}
					description="Chrome downloads it once, a few GB."
					details={<span>Chrome 148 or later, on a computer.</span>}
					picture={
						<svg width="104" height="64" viewBox="0 0 104 64" aria-hidden="true">
							<rect width="104" height="64" rx="10" fill="var(--cui-surface-input)" />
							<path
								d="M20 22h64M20 34h40M20 46h52"
								stroke="var(--cui-text-muted)"
								stroke-width="4"
							/>
						</svg>
					}
				>
					{control => (
						<Button
							aria-describedby={control["aria-labelledby"]}
							variant="secondary"
							size="sm"
						>
							Download
						</Button>
					)}
				</SettingsRow>
			</SettingsGroup>
		</Pane>
	),
};

export const LongLabels: Story = {
	render: () => (
		<Pane width="560px">
			<SettingsGroup title="Ein sehr langer Gruppentitel, der in schmalen Bereichen umbricht">
				<SettingsRow
					label="Bevorzugte Exportskalierung für hochauflösende Bildschirme"
					description="Die Skalierung bestimmt die Größe des exportierten Bildes in Pixeln, auch bei sehr langen Beschreibungen."
				>
					{control => (
						<Segmented control={control} value="2x" options={["1x", "2x", "3x"]} />
					)}
				</SettingsRow>
				<SettingsRow label="Aktiven Tab allein anzeigen" compactControl>
					{control => <Switch {...control} />}
				</SettingsRow>
			</SettingsGroup>
		</Pane>
	),
};

export const Disabled: Story = {
	render: () => (
		<Pane>
			<SettingsGroup title="Export">
				<SettingsRow
					label="Transparent background"
					description="Not available for JPEG."
					compactControl
				>
					{control => <Switch {...control} disabled />}
				</SettingsRow>
				<SettingsRow label="Format" description="The file type of the image.">
					{control => (
						<div style={{ width: "min(100%, calc(84px * 3))", display: "flex" }}>
							<SegmentedControl {...control} defaultValue="png" size="sm" disabled fluid>
								<SegmentedControlItem value="png">PNG</SegmentedControlItem>
								<SegmentedControlItem value="jpeg">JPEG</SegmentedControlItem>
								<SegmentedControlItem value="svg">SVG</SegmentedControlItem>
							</SegmentedControl>
						</div>
					)}
				</SettingsRow>
			</SettingsGroup>
		</Pane>
	),
};
