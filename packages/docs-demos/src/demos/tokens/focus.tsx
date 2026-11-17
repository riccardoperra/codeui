import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensFocus() {
	return (
		<>
			<TokenTable kind="color" modes names={cssNames({ color: tokens.focus.color })} />
			<TokenTable kind="length" names={cssNames({ width: tokens.focus.width, offset: tokens.focus.offset })} />
		</>
	);
}
