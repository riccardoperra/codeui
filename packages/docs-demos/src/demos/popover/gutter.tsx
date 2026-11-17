import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";

export default function PopoverGutter() {
	return (
		<>
			<Popover placement="bottom">
				<PopoverTrigger as={Button} theme="secondary">
					Default gutter (6px)
				</PopoverTrigger>
				<PopoverContent title="Padding">The panel sits 6px below the trigger.</PopoverContent>
			</Popover>
			<Popover placement="bottom" gutter={16}>
				<PopoverTrigger as={Button} theme="secondary">
					Gutter 16px
				</PopoverTrigger>
				<PopoverContent title="Padding">The panel sits 16px below the trigger.</PopoverContent>
			</Popover>
			<Popover placement="bottom-start" gutter={6} shift={-8}>
				<PopoverTrigger as={Button} theme="secondary">
					Shift -8px
				</PopoverTrigger>
				<PopoverContent title="Padding">The panel moves 8px along the trigger edge.</PopoverContent>
			</Popover>
		</>
	);
}
