import { OptionCardGroup } from "@codeui/kit";
import type { JSX } from "@solidjs/web";

// Schematic previews in each option's own colours (Inkstone §9.4).
function Window(props: { controls?: JSX.Element }) {
	return (
		<svg width="96" height="52" viewBox="0 0 96 52" aria-hidden="true">
			<rect x="10" y="6" width="76" height="40" rx="6" fill="currentColor" fill-opacity="0.14" />
			<path d="M20 26h30M20 33h44M20 40h22" stroke="currentColor" stroke-opacity="0.4" stroke-width="3" stroke-linecap="round" />
			{props.controls}
		</svg>
	);
}

export default function WindowStyle() {
	return (
		<OptionCardGroup
			label="Window style"
			defaultValue="mac"
			items={[
				{
					value: "mac",
					label: "macOS",
					badge: "Default",
					preview: (
						<Window
							controls={
								<>
									<circle cx="20" cy="15" r="3" fill="#ff5f57" />
									<circle cx="29" cy="15" r="3" fill="#febc2e" />
									<circle cx="38" cy="15" r="3" fill="#28c840" />
								</>
							}
						/>
					),
				},
				{
					value: "windows",
					label: "Windows",
					preview: (
						<Window
							controls={
								<path d="M58 15h5M68 12.5h5v5h-5zM78 12.5l5 5M83 12.5l-5 5" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.5" fill="none" />
							}
						/>
					),
				},
				{ value: "none", label: "None", preview: <Window /> },
			]}
		/>
	);
}
