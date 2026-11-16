import {
	createOptionCardItems,
	OptionCardGroup,
	type OptionCardEntry,
} from "@codeui/kit";
import { createSignal } from "solid-js";
export default function Demo() {
	const [entries] = createSignal<readonly OptionCardEntry[]>([
		{ value: "png", label: "PNG", description: "Raster image" },
		{ value: "svg", label: "SVG", description: "Vector image" },
	]);
	const options = createOptionCardItems(entries);
	return (
		<OptionCardGroup label="Export format" items={options.items()} defaultValue="png" />
	);
}
