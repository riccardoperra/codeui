import { OptionCard } from "@codeui/kit";
import * as Cards from "@codeui/kit/option-card";
export default function Parts() {
	return <Cards.Root defaultValue="window"><Cards.Label>Snippet frame</Cards.Label>
		<OptionCard value="window" label="Window" description="Include window controls" badge="Default" />
		<Cards.Item value="plain"><Cards.ItemInput /><Cards.ItemLabel>Plain<Cards.ItemDescription as="span">Show the code alone</Cards.ItemDescription></Cards.ItemLabel></Cards.Item>
	</Cards.Root>;
}
