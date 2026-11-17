import { Badge } from "@codeui/kit";
import * as S from "@codeui/kit/stack";

export default function StackParts() {
	return (
		<S.Root direction="row" gap="2">
			<Badge>PNG</Badge>
			<Badge>SVG</Badge>
		</S.Root>
	);
}
