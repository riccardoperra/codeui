import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";

export default function PopoverBordered() {
	return (
		<Popover placement="bottom-start">
			<PopoverTrigger as={Button} theme="secondary">
				Window style
			</PopoverTrigger>
			<PopoverContent variant="bordered" title="Window style" description="The frame drawn around the code.">
				macOS, Windows, or no frame.
			</PopoverContent>
		</Popover>
	);
}
