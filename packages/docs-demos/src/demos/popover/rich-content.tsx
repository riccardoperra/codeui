import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";

export default function PopoverRichContent() {
	return (
		<Popover placement="bottom-start">
			<PopoverTrigger as={Button} variant="secondary">
				Export styles
			</PopoverTrigger>
			<PopoverContent
				title={
					<>
						Export styles <Badge tone="info">New</Badge>
					</>
				}
				description="Applies to every new export."
			>
				<div style={{ display: "grid", "grid-template-columns": "1fr 1fr", gap: "8px" }}>
					<Button variant="secondary">PNG</Button>
					<Button variant="secondary">SVG</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
