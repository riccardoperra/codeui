import { Badge, Link, Slider, Spinner, Stack } from "@codeui/kit";
import { createSignal } from "solid-js";

// Before, with @codeimage/ui:
//   <RangeField min={0} max={100} value={opacity()} onChange={setOpacity} />
//   <LoadingCircle size="md" />
//   <Badge size="sm">New</Badge>
//   <Link href="...">Changelog</Link>
export default function Controls() {
	const [opacity, setOpacity] = createSignal(80);
	return (
		<Stack gap="4">
			<Slider
				label="Background opacity"
				minValue={0}
				maxValue={100}
				value={opacity()}
				onChange={setOpacity}
				showValue
			/>
			<Stack direction="row" gap="3" align="center">
				<Spinner label="Saving snippet" />
				<Badge tone="info">New</Badge>
				<Link href="https://codeimage.dev">Changelog</Link>
			</Stack>
		</Stack>
	);
}
