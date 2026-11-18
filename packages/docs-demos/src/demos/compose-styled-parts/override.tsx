import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";
import "./override.css";

export default function ComposeOverride() {
	return (
		<Popover placement="bottom-start">
			<PopoverTrigger as={Button} variant="secondary">
				Wider picker
			</PopoverTrigger>
			<PopoverContent
				title="Font family"
				description="One class, no !important. App CSS wins over the cui layer."
				class="compose-override-content"
			>
				Fira Code, JetBrains Mono, and Cascadia Code.
			</PopoverContent>
		</Popover>
	);
}
