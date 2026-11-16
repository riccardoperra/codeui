import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";

export default function ComposeReady() {
	return (
		<Popover placement="bottom-start">
			<PopoverTrigger as={Button} theme="secondary">
				Line height
			</PopoverTrigger>
			<PopoverContent title="Line height" description="Space between lines of code.">
				1.5 fits most fonts.
			</PopoverContent>
		</Popover>
	);
}
