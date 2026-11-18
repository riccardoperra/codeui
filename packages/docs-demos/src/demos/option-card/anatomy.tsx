import { OptionCard } from "@codeui/kit";
import * as Cards from "@codeui/kit/option-card/parts";

const Window = () => (
	<svg viewBox="0 0 64 40" width="64" height="40" fill="none" stroke="currentColor" aria-hidden="true">
		<rect x="4" y="4" width="56" height="32" rx="6" />
		<circle cx="11" cy="11" r="1.5" />
		<circle cx="16" cy="11" r="1.5" />
		<circle cx="21" cy="11" r="1.5" />
	</svg>
);

export default function OptionCardAnatomy() {
	return (
		<Cards.Root defaultValue="plain" validationState="invalid">
			<Cards.Label>Snippet frame</Cards.Label>
			<Cards.Description>Shown around every export.</Cards.Description>
			<div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--cui-space-2)" }}>
				<OptionCard value="window" label="Window" description="With window controls" preview={<Window />} badge="Default" />
				<Cards.Item value="plain">
					<Cards.ItemInput />
					<Cards.ItemControl>
						<Cards.ItemIndicator />
					</Cards.ItemControl>
					<Cards.ItemLabel>
						Plain
						<Cards.ItemDescription>The code alone</Cards.ItemDescription>
					</Cards.ItemLabel>
				</Cards.Item>
			</div>
			<Cards.ErrorMessage>Choose a frame.</Cards.ErrorMessage>
		</Cards.Root>
	);
}
