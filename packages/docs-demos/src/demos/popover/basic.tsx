import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";

export default function PopoverBasic() {
	return (
		<Popover placement="bottom-start">
			<PopoverTrigger as={Button} variant="secondary">
				Font settings
			</PopoverTrigger>
			<PopoverContent title="Font settings" description="Applies to every new snippet.">
				Ligatures are on for Fira Code and JetBrains Mono.
			</PopoverContent>
		</Popover>
	);
}
