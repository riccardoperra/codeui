import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";

export default function PopoverDemo() {
	return (
		<Popover placement="bottom-start">
			<PopoverTrigger as={Button} theme="secondary">
				Font settings
			</PopoverTrigger>
			<PopoverContent title="Font settings" description="Applies to every new snippet.">
				Ligatures are on for Fira Code and JetBrains Mono.
			</PopoverContent>
		</Popover>
	);
}
