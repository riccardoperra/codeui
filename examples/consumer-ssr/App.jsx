import { Button } from "@codeui/kit/button";
import { Select } from "@codeui/kit/select";
import { TextField } from "@codeui/kit/text-field";
import {
	Switch,
	Dialog,
	Popover,
	PopoverTrigger,
	PopoverContent,
	SegmentedControl,
	SegmentedControlItem,
} from "@codeui/kit";
export default function App() {
	return (
		<main data-cui-theme="dark">
			<Button variant="primary" id="consumer-button">
				Consumer button
			</Button>
			<TextField label="Consumer text" value="Hello consumer" />
			<Switch label="Consumer switch" />
			<Select aria-label="Consumer select" options={["One", "Two"]} value="One" />
			<Dialog defaultOpen modal={false} title="Consumer dialog">
				Dialog body
				<Popover defaultOpen>
					<PopoverTrigger>Consumer popover trigger</PopoverTrigger>
					<PopoverContent title="Consumer popover">
						<button>Popover body</button>
					</PopoverContent>
				</Popover>
			</Dialog>
			<SegmentedControl value="one">
				<SegmentedControlItem value="one">Segment one</SegmentedControlItem>
				<SegmentedControlItem value="two">Segment two</SegmentedControlItem>
			</SegmentedControl>
		</main>
	);
}
