import { OptionCardGroup } from "@codeui/kit";

// A schematic in each option's own colours: the orb is the mode, the rim
// follows the text colour so it reads on either theme.
function Orb(props: { fill: string; half?: string }) {
	return (
		<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
			<circle cx="22" cy="22" r="18" fill={props.fill} />
			{props.half && <path d="M22 4a18 18 0 0 1 0 36z" fill={props.half} />}
			<circle
				cx="22"
				cy="22"
				r="18"
				fill="none"
				stroke="currentColor"
				stroke-opacity="0.18"
			/>
		</svg>
	);
}

// The width of CodeImage's settings pane, which holds three 224px cards.
export default function ColourMode() {
	return (
		<div style={{ width: "100%", "max-width": "688px" }}>
			<OptionCardGroup
				label="Colour mode"
				defaultValue="dark"
				items={[
					{
						value: "dark",
						label: "Dark",
						description: "A darker workspace",
						preview: <Orb fill="#2c2f4a" />,
						badge: "Default",
					},
					{
						value: "light",
						label: "Light",
						description: "A brighter workspace",
						preview: <Orb fill="#f5f5f7" />,
					},
					{
						value: "system",
						label: "System",
						description: "Follow your device",
						preview: <Orb fill="#f5f5f7" half="#2c2f4a" />,
					},
				]}
			/>
		</div>
	);
}
