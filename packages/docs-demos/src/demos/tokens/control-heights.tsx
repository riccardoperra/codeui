import { tokens } from "@codeui/kit";
import { TokenTable, cssNames } from "./token-table";

export default function TokensControlHeights() {
	return <TokenTable kind="length" names={cssNames(tokens.control.height)} />;
}
